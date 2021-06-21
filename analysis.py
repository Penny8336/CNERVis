import numpy as np
from sklearn import preprocessing
from collections import Counter
import json
from sklearn.manifold import TSNE
from scipy.stats import norm, kurtosis
from scipy.stats import entropy
import umap

f = open("ontoNote_names.txt",'r',encoding="utf-8")
onto=[]
onto_string=""
for line in f.readlines():
    line = line.replace("\n","")
    line = line.replace(" ","")
    line = line.replace("纔","才")
    onto_string += line

f_news = open("news.txt",'r',encoding="utf-8")
onto_string_news=""
for line in f_news.readlines():
    line = line.replace("\n","")
    line = line.replace(" ","")
    line = line.replace("纔","才")
    onto_string_news += line

# tra_hidden1 = np.load('hidden1_onto.npy')
# tra_hidden = np.load('hidden_onto.npy')
tra_label = np.load('tra_label.npy')
word2index = np.load('./json/word2index.npy')

char_list_json = json.load(open("onto_names.json"))
char_list_json_news = json.load(open("newsCharacter.json"))
char_list = json.load(open("./json/Characters.json"))

# threshold = 1.8
kur_threshold = 45
# kur_threshold = -1.0
ent_threshold = 1
tsen_perplexity=5






def each_char(sentence_list_len,entity_set):
    #different form predict label
    entity_list_order = ["O"]*sentence_list_len
    for entity in sorted(entity_set):
        for k in range(entity[0],entity[1]):
            entity_list_order[k]=entity[2]

    return entity_list_order

def predict(index,logits,label_list):
    predict=[]
    predict_order=[]
    
    for index in range (index,index+5):
        sort = np.argsort(-logits[index]) #reorder
        pro = logits[index][sort]
        prediction = np.array(label_list)[sort]
        val = [0 if i < 0 else i for i in pro] #negative numbers to zero
        normalized_arr = preprocessing.normalize([val[:5]])
        for i in range(5):
            predict_order.append({"ner":prediction[i].split(":"),"val":str(round(normalized_arr[0][i],2))})
    predict.append(predict_order)

        # predict_order.append({"ner":k.split(":"),"val":str(round(pro[i],2))})
    return predict_order


def nearest(click_index,click_h,tra_hidden,h_direct,top_k):
#     print(click_index,len(news_char),hidden.shape,tra_hidden.shape,h_direct)
    analysis={}
    diffenent_=np.empty([tra_hidden.shape[0]])
    for i,compare_h in enumerate(tra_hidden):
        diffenent = np.sum(abs(click_h-compare_h))
        diffenent_[i] = diffenent

    diff_index_top_k = np.argsort(diffenent_)[:top_k] #return index 
    diff_index_WC = np.argsort(diffenent_)[:200] #return index 

#     diffenent_value = diffenent_[diff_] #return value
#     diffenent_value = (diffenent_s-diffenent_s[0]).tolist()
#     print(diff_index)
    #for top_k
    context_ = [] 
    for i, index in enumerate(diff_index_top_k):
        print(char_list_json[index])
        slice_word = char_list_json[index-5:index+6]
        context_ += slice_word[:]

    #for wordcloud
    wordCloud={}
    for i, index in enumerate(diff_index_WC):
        char = char_list_json[index]['character']
        if char in wordCloud:
            wordCloud[char] = wordCloud[char]+1
        else:
            wordCloud[char] = 1

    wordCloud_=[]
    for item in wordCloud.items():
        wordCloud_.append({'text':item[0],'frequency':item[1]})
    
    return context_,wordCloud_,diff_index_WC,diff_index_top_k

def wordCloudSelect(wordSelect,diff_index_WC):
    context_ = [] 
    for i, index in enumerate(diff_index_WC):
        # print(char_list_json[index]['character'], wordSelect)
        if (char_list_json[index]['character'] == wordSelect):
            slice_word = char_list_json[index-5:index+6]
            context_ += slice_word[:]    
    return context_

def find_sub_list(sl,l):
    print("hi",sl)
    results=[]
    sll=len(sl)
    for ind in (i for i,e in enumerate(l) if e==sl[0]):
        if l[ind]==sl: #for 一個字相同時  print(l[ind:ind+sll]) 1個字以上相同
#             results.append((ind,ind+sll-1))
            results.append(ind)
    return results

def tsne2json_revised(select_article, article, select_character, select_hidden, tra_hidden,perp):
    print("tra_hidden.shape", tra_hidden.shape)
    print("tra_hidden.shape", select_hidden.shape)
    print("select_character", select_character)
    print("char_list_json_news.length",len(char_list_json_news))
    # print(article)
    tra_hidden=tra_hidden[:len(char_list_json_news)-1]
    # accu = article['accu']
    # word = article['heatmap'][select_character-accu]['character']

    # print(accu)
    # print(word)
    # print(word)
    # theSame = find_sub_list(word,list(onto_string_news))
    # if len(theSame)>100:
    #     theSame = theSame[:100]
    # remain = 200-len(theSame)
    remain = 150
    # print("collect point",article,len(theSame))
    print("tra_hidden.shape", tra_hidden.shape)
    print("remain",remain)

    diffenent_=np.empty([tra_hidden.shape[0]])
    for i,compare_h in enumerate(tra_hidden):
        diffenent = np.sum(abs(select_hidden-compare_h))
        diffenent_[i] = diffenent

    diff_index_top_k = np.argsort(diffenent_)[:remain] #return index 
    point = list(diff_index_top_k) 
    point = list(set(point))
    print(type(tra_hidden),tra_hidden.shape)

    
    #order
    sort_index=[]
    for index in point:
        sort_index.append(np.sum(abs(select_hidden-tra_hidden[index])))  #the different

    sort_index = np.argsort(sort_index) # samll to big index
    point = np.array(point)[sort_index]
    print("sort point",point[:5])
    print("char_list_json_news",len(char_list_json_news))
    point = list(point)

    point_hiddenstate = tra_hidden[point]
    forward,backward = np.hsplit(point_hiddenstate,2)

    #umap
    reducer = umap.UMAP(min_dist=0.5)
    # all_ = reducer.fit_transform(point_hiddenstate)
    # forward_ = reducer.fit_transform(forward)
    # backward_ = reducer.fit_transform(backward)

    embeddingHiddenstate = reducer.fit(point_hiddenstate)
    all_ = embeddingHiddenstate.embedding_

    embeddingForward = reducer.fit(forward)
    forward_ = embeddingHiddenstate.embedding_

    embeddingBackward = reducer.fit(backward)    
    backward_ = embeddingHiddenstate.embedding_


    # all_ = TSNE(n_components=2,perplexity=20).fit_transform(point_hiddenstate)
    # forward_ = TSNE(n_components=2,perplexity=20).fit_transform(forward)
    # backward_ = TSNE(n_components=2,perplexity=20).fit_transform(backward)

    list_=[all_, forward_, backward_]
    list_S=['all_', 'forward_', 'backward_']

    json_axis={}
    json_circle = {}
    json_ =[]
    circle={}
   
    for k, tsen2D in enumerate(list_):
        # print(len(tsen2D),list_S[k])
        min_x = min(tsen2D[:, 0])
        max_x = max(tsen2D[:, 0])
        min_y = min(tsen2D[:, 1])
        max_y = max(tsen2D[:, 1])
        axis = {'x':{'min':str(round(min_x,2)),'max':str(round(max_x,2))},
                'y':{'min':str(round(min_y,2)),'max':str(round(max_y,2))}}
        json_axis[list_S[k]] = axis
        for i, key in enumerate(tsen2D):
            point_=point[i]
            print(point[i])
            temp = char_list_json_news[point_].copy()
            temp['nearest'] = 200-i
            temp['x'] = str(round(key[0],2))
            temp['y'] = str(round(key[1],2))
            temp['radius'] = 5
            # if (point_ in theSame):
            #     temp['from'] = 0 #0 for the same
            # else:
            temp['from'] = 1 #1 for the neartest 
            # char_list_json[point[i]]['index_'] = int(point[i])
            
            json_.append(temp)
        json_circle[list_S[k]] = json_
        json_=[]

    return json_circle, json_axis,all_,forward_,backward_

#tsne的json 會收集資訊給interface 資訊 
def tsen2json(perp,tsen_data,logits,label_sentence_list,sentence,entity_list_order,label_list,ws_count,pos_):

    forward,backward = np.hsplit(tsen_data,2) 
    print("tsen2json",tsen_data.shape)
    all_ = TSNE(n_components=2,perplexity=perp).fit_transform(tsen_data)
    forward_ = TSNE(n_components=2,perplexity=perp).fit_transform(forward)
    backward_ = TSNE(n_components=2,perplexity=perp).fit_transform(backward)

    list_=[all_, forward_, backward_]
    list_S=['all_', 'forward_', 'backward_']
    
    json_axis={}
    json_circle = {}
    json_ =[]
    circle={}
    result = np.where(logits<0, 0, logits)
    
    for k, tsen2D in enumerate(list_):
        # print(len(tsen2D),list_S[k])
        min_x = min(tsen2D[:, 0])
        max_x = max(tsen2D[:, 0])
        min_y = min(tsen2D[:, 1])
        max_y = max(tsen2D[:, 1])
        axis = {'x':{'min':str(round(min_x,2)),'max':str(round(max_x,2))},
                'y':{'min':str(round(min_y,2)),'max':str(round(max_y,2))}}
        json_axis[list_S[k]] = axis
        for i, key in enumerate(tsen2D):
            if (len(label_sentence_list[i].split(':'))) ==2:
                temp_v=label_sentence_list[i].split(':')[1]
            else:
                temp_v='O'
            predict = np.argsort(-result[i])
            # temp_data = result[i]
            # predicts = dict(zip(label_list[predict], result[i][predict].tolist()))
            predicts = result[i][predict]
            predict_sum = np.sum(predicts)
            predict_avg = (predicts/predict_sum)[:3].tolist()
            label_ = label_list[predict][:3].tolist()
            circle['character'] = sentence[i]
            circle['index'] = str(i)
            circle['label_list'] = label_
            circle['predicts'] = predict_avg
            kur = kurtosis(result[i])
            ent = entropy(result[i])
            circle['kurtosis'] = True if kur >= kur_threshold else False

            if (ent_threshold > ent and ent > 0):
                circle['entropy'] = False
            else:
                circle['entropy'] = True
            
            # if (kur < kur_threshold and (not(kur == -3))):
            #     circle['kurtosis'] = False
            #     print(kur)
            # else:
            #     circle['kurtosis'] = True
            

            circle['x'] = str(round(key[0],2))
            circle['y'] = str(round(key[1],2))
            
            # circle['label'] = True if entropy((result[i]), base=2) >= threshold else False,
            circle['ner_nonCollect'] = label_sentence_list[i].split(":")
            circle['ner'] = entity_list_order[i]
            circle['BI'] = ws_count[i]
            if (not ws_count[i]==0):
                circle['pos'] = pos_[i]
            else:
                circle['pos'] = pos_[i]
            if (entity_list_order[i] == 'O'):
                circle['radius'] = 3 #for forceSimulation
            else:
                circle['radius'] = 5
            circle['chunk'] = temp_v
            json_.append(circle)
            circle={}
        json_circle[list_S[k]] = json_
        json_=[]

    return json_circle, json_axis

def forHeatmap(logits,label_sentence_list,sentence,entity_list_order,label_list,ws_count,pos_):
    heatMap=[]
    result = np.where(logits<0, 0, logits)
    for i in range(len(sentence)):
        circle={}
        circle['character'] = sentence[i]
        circle['index'] = str(i)
        entropy_ = entropy(result[i])
        circle['entropy'] =  str(np.round(entropy_,2))
        circle['ner'] = entity_list_order[i]
        heatMap.append(circle)

    return heatMap

def maxEntropyWord(charList):
    entropyList=[]
    for i in charList:
        entropyList.append(i['entropy'])
    
    maxEntropy = max(entropyList)
    return maxEntropy

def wordCollection(thesame,word_):
    wordCollect=[]
    entropyOrder=[]
    entropyMax=0
    entropyMin=1000
    for order, index  in enumerate(thesame):
        eachWord={}
        word = word_[order]
        eachWord['word'] = word
        start = word2index[index]
        wordChar = char_list[start:start+len(word)]
        eachWord['dount'] = wordChar
        eachWord['ner'] = wordChar[0]['ner']
        maxWordEntropy = maxEntropyWord(char_list[start:start+len(word)])
        eachWord['max_entropy'] = float(maxWordEntropy)
        entropyOrder.append(float(maxWordEntropy))
        wordCollect.append(eachWord)

    entropyOrder = np.array(entropyOrder)
    entropySort = np.argsort(-entropyOrder)
    wordCollect_ = np.array(wordCollect)[entropySort]
    wordCollect_ = list(wordCollect_)

    entropyMax = entropyOrder[entropySort][0]
    entropyMin = entropyOrder[entropySort][len(entropyOrder)-1]
    entro = {"max":entropyMax,"min":entropyMin}
    uncertainty = {'word_collect':wordCollect_,'range':entro}

    return uncertainty



    


