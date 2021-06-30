#coding=utf-8
from flask import Flask
from flask import request, render_template, redirect, url_for
import tensorflow as tf
import numpy as np
from ckiptagger import data_utils, construct_dictionary, WS, POS, NER
from analysis import nearest, wordCloudSelect, tsne2json_revised, wordCollection
import json
from sklearn.manifold import TSNE
import matplotlib.pyplot as plt
import time
from scipy.stats import entropy

diff_index = np.array([])

app = Flask(__name__)


f = open("news.txt",'r',encoding="utf-8")
onto=[]
onto_sect=[]
onto_string=""
for line in f.readlines():
    line = line.replace("\n","")
    line = line.replace(" ","")
    line = line.replace("纔","才")
    onto_string += line
    onto_sect.append([line])
onto.append(onto_string)
onto_list=list(onto[0])
onto_sort = np.array(onto_list)

# print("news_.shape: ",news_char.shape)
char_list_json = json.load(open("onto_names.json"))
tra_hidden = np.load('hidden_onto.npy')
tra_hidden1 = np.load('hidden1_onto.npy')

char_list_json_news = json.load(open("./json/Characters.json"))
news_pirChart = json.load(open("./json/news.json"))
word_dountChart = json.load(open("./json/uncertainty.json"))
news_hidden = np.load('newsHidden.npy')
news_hidden1 = np.load('newsHidden1.npy')
Hiddenstates = np.load('./json/Hiddenstates.npy')
articelLength = np.load('./json/articelLength.npy')

#global 
all_=0
forward_=0
backward_=0

@app.route("/", methods=['GET', 'POST'])
def index():
    json = {"news":news_pirChart,"dount":word_dountChart}
    return render_template('index.html',json = json)

# open_tsne
@app.route("/open_tsne", methods=['POST'])
def open_tsne():
    if request.method == 'POST':
        data = request.form
        print(type(data['pipeline']))
        pipeline = int(data['pipeline'])
        selectedCharacter = int(data['selectedCharacter']) #based on character
        selectedArticle = int(data['selectedArticle']) #based on character
        print(selectedCharacter,selectedCharacter)

        hiddenState = Hiddenstates[pipeline]
        hiddenState1 = Hiddenstates[pipeline+1]
        revised,revised_axis = tsne2json_revised(selectedCharacter, hiddenState1)
        revised0,revised_axis0 = tsne2json_revised(selectedCharacter, hiddenState)

        print("Tsne done")
        scatter = {'hidden':{'tsne':revised0,'axis':revised_axis0},"hidden1":{"tsne":revised,"axis":revised_axis}}
        # labelViewOrder0 = getOrder(char_list_json_news,revised0)
        # labelViewOrder1 = getOrder(char_list_json_news,revised)
    return {"scatter":scatter,"charJson":char_list_json_news}

@app.route("/changePOSWS", methods=['POST'])
def changePOSWS():
    if request.method == 'POST':
        select_character = int(request.form['select_character']) #based on character
        select_article = int(request.form['select_article']) #based on character
        pipeline = int(request.form['pipeline'])

        hiddenState = Hiddenstates[pipeline]
        hiddenState1 = Hiddenstates[pipeline+1]
        revised,revised_axis,all_,forward_,backward_ = tsne2json_revised(select_article,news_pirChart[select_article],select_character,hiddenState1[select_character],hiddenState1,pipeline)
        revised0,revised_axis0,all0_,forward0_,backward0_ = tsne2json_revised(select_article,news_pirChart[select_article],select_character,hiddenState[select_character],hiddenState,pipeline)
        # revised0,revised_axis0 = tsne2json_revised(select_article,news_pirChart[select_article],select_character,news_hidden[select_character],news_hidden,perp)
        print("Tsne done")
        # scatter = {'hidden':{'tsne':tsen_h,'axis':axis},'hidden1':{'tsne':tsen_h1,'axis':axis_1},"revised":{"tsne":revised,"axis":revised_axis}}
        scatter = {'hidden':{'tsne':revised0,'axis':revised_axis0},"revised":{"tsne":revised,"axis":revised_axis}}
    return {"scatter":scatter,"charJson":char_list_json_news}


# changeWS
@app.route("/changeWS", methods=['POST'])
def changeWS():
    if request.method == 'POST':
        content = json.loads(request.form.get('hithere'))
        print(len(content))
        perp = request.form['perp']
        article = int(request.form['article'])
        articelSum = np.sum(articelLength[:article])

        new_begin = int(request.form['character_begin'])-articelSum
        new_end = int(request.form['character_end'])-articelSum
        map_begin = int(request.form['map_begin'])
        map_end = int(request.form['map_end'])
        print(content[map_begin:map_end+1])
        
        sentence_list = onto_sect[int(article)]
        print(sentence_list)
        ws = WS("./data", )
        pos = POS("./data",)
        ner = NER("./data",)
        word_sentence_list, seq_sentence_list = ws(sentence_list,)

        print("seq_sentence_list",seq_sentence_list,len(seq_sentence_list),new_begin,new_end)
        new_BI = list("I"*(new_end-new_begin+1))
        new_BI[0] = "B"
        seq_sentence_list[new_begin:new_end+1] = new_BI
        print("seq_sentence_list","OK",len(seq_sentence_list),seq_sentence_list,new_BI)

        word_=[]
        temp_word=""
        article = sentence_list[0]
        print("article",len(article))
        for index,ws in enumerate(seq_sentence_list):
            if index !=0 and ws == 'B':
                word_.append(temp_word)
                temp_word = article[index]
            else:
                temp_word += article[index]

        word_=[word_]
        print("word_sentence_list","OK",word_)
        pos_sentence_list = pos(word_)
        entity_sentence_list, label_sentence_list, logits, hiddenState_all,c_v,w_v,label_list,sample_list = ner(word_, pos_sentence_list)
        print(entity_sentence_list)
        print("pos_sentence_list",len(pos_sentence_list))

        pos_=[]
        for i, word in enumerate (word_[0]):
            pos_ += [pos_sentence_list[0][i]]*len(word)
            print(i,word)
        ###for change_ws
        label_list_ = np.array(label_list).copy()
        for i,label in enumerate(label_list):
            label_list_[i] = label.split(':')[0]

        predict_avg_set = []
        label_set = []
        result = np.where(logits<0, 0, logits)
        for i, char in enumerate(result):
            predict_index = np.argsort(-char)
            predict_value = char[predict_index]
            predict_sum = np.sum(predict_value)
            predict_avg = (predict_value/predict_sum)[:3].tolist()
            label_ = label_list_[predict_index][:3].tolist()
            predict_avg_set.append(predict_avg)
            label_set.append(label_)

        BI = ['0']*len(new_BI)
        BI[0] = len(new_BI)

        entity_list_order = ["O"]*len(sentence_list[0])
        for entity in sorted(entity_sentence_list):
            for k in range(entity[0],entity[1]):
                entity_list_order[k]=entity[2]

        for index,char in enumerate(content[map_begin:map_end+1]):
            label = label_sentence_list[k].split(':')
            if (len(label)<2):
                label.append("non")

            char["predicts"] = predict_avg_set[new_begin+index]
            char["label_list"] = label_set[new_begin+index]
            char["entropy"] = str(entropy(result[new_begin+index]))
            char["ner"] = entity_list_order[index]
            char["BI"] = BI[index]
            char["pos"] = pos_[index]
    
    hidden = hiddenState_all[0][0]
    hidden1 =hiddenState_all[1][0]

    

    # all_xy = all_.transform(hidden1[new_begin])
    # forward_.transform(backward[:2])
    # backward_.transform(backward[:2])



    return {"content":content}

# changeWS
@app.route("/changePOS", methods=['POST'])
def changePOS():
    if request.method == 'POST':
        content = json.loads(request.form.get('hithere'))
        print(len(content))
        article = int(request.form['article'])
        articelSum = np.sum(articelLength[:article])

        new_begin = int(request.form['character'])-articelSum
        map_begin = int(request.form['map_begin']) #labelView order
        POSchange = request.form['name']
        print("new_begin",new_begin,"map_begin",map_begin)
        print(content[map_begin])
        
        sentence_list = onto_sect[int(article)]
        print(sentence_list)
        ws = WS("./data", )
        pos = POS("./data",)
        ner = NER("./data",)
        word_sentence_list, seq_sentence_list = ws(sentence_list,)
        pos_sentence_list = pos(word_sentence_list)
        index2word=[]
        for i,word in enumerate(word_sentence_list[0]):
            print(len(word)*[i])
            index2word += len(word)*[i]
        
        wordIndex = index2word[new_begin]
        pos_sentence_list[0][wordIndex] = POSchange
        entity_sentence_list, label_sentence_list, logits, hiddenState_all,c_v,w_v,label_list,sample_list = ner(word_sentence_list, pos_sentence_list)


        label_list_ = np.array(label_list).copy()
        for i,label in enumerate(label_list):
            label_list_[i] = label.split(':')[0]

        predict_avg_set = []
        label_set = []
        result = np.where(logits<0, 0, logits)
        for i, char in enumerate(result):
            predict_index = np.argsort(-char)
            predict_value = char[predict_index]
            predict_sum = np.sum(predict_value)
            predict_avg = (predict_value/predict_sum)[:3].tolist()
            label_ = label_list_[predict_index][:3].tolist()
            predict_avg_set.append(predict_avg)
            label_set.append(label_)

        entity_list_order = ["O"]*len(sentence_list[0])
        for entity in sorted(entity_sentence_list):
            for k in range(entity[0],entity[1]):
                entity_list_order[k]=entity[2]


        char= content[map_begin]

        char["predicts"] = predict_avg_set[new_begin]
        char["label_list"] = label_set[new_begin]
        char["entropy"] = str(entropy(result[new_begin]))
        char["ner"] = entity_list_order[new_begin]
        char["pos"] = POSchange


    return {"content":content}

diff_index = np.array([])
@app.route("/wordCloud", methods=['POST'])
def wordCloud():
    global diff_index
    print(diff_index)
    if request.method == 'POST':
        print("wordCloud")
        click_index = int(request.form['click_index'])
        print(click_index,len(onto_list),len(Hiddenstates[1]))
        print(click_index,onto_list[click_index],onto_list[click_index-3:click_index+3])
        print(char_list_json_news[click_index])
        top_k=10
        h_direct=0

        hidden_nearest,wordCloud,diff_index_WC,top = nearest(click_index, Hiddenstates[1][click_index], tra_hidden1,h_direct,top_k)
        print("diff_index_WC")
    
    diff_index = diff_index_WC.tolist()
    print(diff_index)
    return {"tra_nearest": hidden_nearest,"wordCloud": wordCloud,"topIndex":top.tolist(),"diff_index_WC":diff_index_WC.tolist()}

@app.route("/clickWordCloud", methods=['POST'])
def clickWordCloud():
    print("diff_index", diff_index)
    if request.method == 'POST':
        
        data = request.form
        wordSelect = data['wordCloudSelect']

        print("clickWordCloud", wordSelect)
        print(diff_index)
        WC_Select = wordCloudSelect(wordSelect,diff_index)

    return {"WC_Select":WC_Select}


@app.route("/findWord", methods=['POST'])
def findWord():
    if request.method == 'POST':
        word = request.form['word']
        wordRecode = word_dountChart['wordRecode']

        thesame=[]
        for index,w in enumerate(wordRecode):
            if (w == word):
                thesame.append(index)
        print("thesame",thesame)
        wordIndex = np.array(wordRecode)[thesame]
        temp = wordCollection(thesame,wordIndex)


    return temp

if __name__ == "__main__":
    app.run()

    