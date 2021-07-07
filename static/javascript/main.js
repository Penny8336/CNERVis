selectedCharacter=0
selectedArticle=0
legend_set = json.entity_set
default_opacity = 0.8
// scatter1 = json.scatter.hidden1
// scatter = json.scatter.hidden
// let content = scatter1.tsne.all_
var colorScale = d3.scaleThreshold()

let color_= {"legend":
    [{"type":"GPE","color":"#196F3D"},
    {"type":"LOC","color":"#29B6F6"},
    {"type":"ORG","color":"#16A085"},
    {"type":"FAC","color":"#CD5C5C"},
    {"type":"NORP","color":"#AFB42B"},
    {"type":"DATE","color":"#2E86C1"},
    {"type":"TIME","color":"#85C1E9"},

    {"type":"CARDINAL","color":"#45E1E1"},
    {"type":"ORDINAL","color":"#CAE983"},
    {"type":"QUANTITY","color":"#B7FD98"},
    {"type":"PERCENT","color":"#546E7A"},
    {"type":"MONEY","color":"#F4D03F"},

    {"type":"EVENT","color":"#884EA0"},
    {"type":"WORK_OF_ART","color":"#A569BD"},
    {"type":"PRODUCT","color":"#5499C7"},
    {"type":"LAW","color":"#F1948A"},
    {"type":"LANGUAGE","color":"#B03A2E"},
    {"type":"PERSON","color":"#DC7633"},
    {"type":"O","color":"#341E0F"}],
    
    "waffle":{
        "GPE":"#196F3D",
        "LOC":"#33cccc",
        "ORG":"#16A085",
        "FAC":"#CD5C5C",
        "NORP":"#AFB42B",

        "DATE":"#2E86C1",
        "TIME":"#85C1E9",

        "CARDINAL":"#45E1E1",
        "ORDINAL":"#CAE983",
        "QUANTITY":"#B7FD98",
        
        "PERCENT":"#BFC9CA",

        "MONEY":"#F4D03F",

        "EVENT":"#884EA0",
        "WORK_OF_ART":"#A569BD",
        "PRODUCT":"#5499C7",
        "LAW":"#F1948A",
        "LANGUAGE":"#B03A2E",
        "PERSON":"#DC7633",
        "O":"#341E0F"
    },

    "pos":{
        "part of speech":"rgb(224,42,97)",
        "A":"rgb(224,42,97)", //非謂形容詞
        "C":"rgb(241,203,213)", //連接詞
        "D":"rgb(238,13,14)", //副詞
        "I":"rgb(250,209,57)", //感嘆詞
        "P":"rgb(127,136,97)", //介詞
        "T":"rgb(254,143,6)", //語助詞
        "V":"rgb(77,87,168)", //動詞

        "Na": "rgb(46,149,104)", //普通名詞
        "Nb": "rgb(98,235,201)", //專有名詞
        "Nc": "rgb(2,83,29)", //地方詞
        "Nd": "rgb(155,199,50)", //時間詞
        "Ne": "rgb(185,220,202)", //定詞
        "Nf": "rgb(62,73,70)", //量詞
        "Ng": "rgb(103,240,89)", //後置詞
        "Nh": "rgb(126,43,25)", //代名詞
        "Nv": "rgb(218,114,112)", //名物化動詞

        "De":"rgb(192,152,253)", //的之得地
        "SH":"rgb(116,22,142)", //是
        "FW":"rgb(239,106,222)", //外文

        "Z":"rgb(32,142,183)"
    }
}


let punctuationSet = new Set(["COMMACATEGORY", "COLONCATEGORY", "DASHCATEGORY", "DOTCATEGORY", 
"ETCCATEGORY", "EXCLAMATIONCATEGORY", "PARENTHESISCATEGORY","PAUSECATEGORY","PERIODCATEGORY","QUESTIONCATEGORY",
"SEMICOLONCATEGORY", "SPCHANGECATEGORY","WHITESPACE"]);


var select = d3.select("#choose").append("select")
.attr("class", "pretty-select")
.attr("id", "selections")
.on('change', changePOS);
posObject=color_.pos

let choosePos = [];
let twoCharSet = new Set();

Object.entries(posObject).forEach(([key, value]) => {
    let eachPos = new Object();
    eachPos.color = value;
    eachPos.name = key;
    choosePos.push(eachPos)

    if (key.length ==2){
        twoCharSet.add(key)
    }
});
// console.log(choosePos)
// console.log(twoCharSet)

select.selectAll("option")
.data(choosePos)
.enter().append("option")
.attr("value", function (d) {return d.color;})
.text(function (d) {return d.name;})

function open_tsne_1(scatter,charJson){
    $('#hid1_all > svg').remove()
    $('#hid1_forward > svg').remove()
    $('#hid1_backward > svg').remove()

    draw_tsne(scatter.tsne.all_,scatter.axis.all_,'#hid1_all',charJson)
    draw_tsne(scatter.tsne.forward_,scatter.axis.forward_,'#hid1_forward',charJson)
    draw_tsne(scatter.tsne.backward_,scatter.axis.backward_,'#hid1_backward',charJson)
  
}

function open_tsne_0(scatter,charJson){
    $('#hid0_all > svg').remove()
    $('#hid0_forward > svg').remove()
    $('#hid0_backward > svg').remove()

    draw_tsne(scatter.tsne.all_,scatter.axis.all_,'#hid0_all',charJson)
    draw_tsne(scatter.tsne.forward_,scatter.axis.forward_,'#hid0_forward',charJson)
    draw_tsne(scatter.tsne.backward_,scatter.axis.backward_,'#hid0_backward',charJson)
}




selectedContext=[]
// function get_group(context,groups,groups_index,content,select_,select_char){
//     //top row is selectedCharacter
//     neighborhood = []
//     if (!(groups.includes(selectedCharacter))){
//         neighborhood = [selectedCharacter]
//         neighborhood = neighborhood.concat(groups)
//     }
//     else{
//         neighborhood = groups
//     }

//     console.log(neighborhood)

//     groupsAvoidOverlap = []
//     labelViewLength = neighborhood.length-1
//     //avoid overlap
//     for (let i = 0; i < labelViewLength; i++){
//         if (!((neighborhood[i]+1 == neighborhood[i+1])||(neighborhood[i]-1 == neighborhood[i+1]))){
//             groupsAvoidOverlap.push(neighborhood[i])
//         }
//     }
//     groupsAvoidOverlap.push(neighborhood[labelViewLength])
//     console.log(groupsAvoidOverlap)

//     context_=[]
//     groupsAvoidOverlap.forEach(function(d,i){
//         slice_word=content.slice(d-5,d+6)
//         context_ = context_.concat(slice_word)
//     })

//     posSet = new Set();
//     // console.log(context_)
//     context_.forEach(d => {
//         posTag = d.pos
//         if (punctuationSet.has(posTag)){
//             return posSet.add("Z")
//         }
//         else if(twoCharSet.has(posTag.slice(0,2))){
//             return posSet.add(posTag.slice(0,2))
//         }
//         else{
//             return posSet.add(posTag.slice(0,1))
//         }
//     });

//     posSet= [...posSet]
//     // console.log(posSet)

//     posSet.sort(function (a, b) {
//         return a.localeCompare(b);
//       });

//     selectedContext = context_
//     // console.log(posSet)
//     draw_legend(posSet,"#posLegend","legendsPOS")

//     neighborhoodChar = ""
//     neighborhood.forEach(function(d){
//         neighborhoodChar = neighborhoodChar.concat("#index"+d+",")
//     });
//     neighborhoodChar = neighborhoodChar.slice(0,-1)

//     returnIndex_(neighborhoodChar,groups_index,context,select_,1,context_)
    
    
    
//     // draw_legend()
//     // draw_legend(json.dount.label,"#totalLe","legendsAll")
// }

function draw_block_pos_color(block,indexs){
    block.attr("id",d => {return "index" + d.index})
    // d3.selectAll(indexs)
    //     .style("opacity", 1)
    // block.attr("fill",function(d) { return color_.pos[d.pos.slice(0,1)]})

    // .style("opacity", function(d){
    //     console.log(d.predicts== [1,0,0])
    //     return (d.predicts[0] == 1 ? 0.4 : 1)
    // })
}

function draw_block_truth_color(block){
    block.selectAll()
    .data(function(d){return([d])})
    .enter()
    .append("circle")
    .attr("r",17)
    .attr("fill",function(d) { return color_.waffle[d.truth]})
    .attr('truth',function(d){ return d.truth})
    .on("mouseover", function(d){console.log(this)})
    // .on("mousemove", mousemove_truth)
    // .on("mouseleave", mouseleave)
    // console.log(block.selectAll("g"))
    block.style("opacity", function(d){ return d.opacity})
    // block.attr("fill",function(d) { return color_.waffle[d.label]})
}




var delay = (function() { 
    var timer = 0; 
    return function(callback, ms) { 
     clearTimeout (timer); 
     timer = setTimeout(callback, ms); 
    }; 
})(); 

function post_tsne(pipeline){
    console.log(selectedCharacter,selectedArticle)
    $.ajax({ 
        type: "POST", 
        url: "/open_tsne", 
        data: {"pipeline":pipeline,"selectedCharacter":selectedCharacter,'selectedArticle':selectedArticle},
        success: function(data,textStatus,jqXHR ){ 
            console.log("hi there post_tsne success")      
            // console.log(data)
            chatJson = data.charJson
            scatter = data.scatter
            open_tsne_1(scatter.hidden1,chatJson)
            open_tsne_0(scatter.hidden,chatJson)
            // open_tsne_0(scatter.hidden)
            // draw_heatmap(scatter.hidden1.tsne.all_)
        } 
    }); 
}

let perp=0
//slider
const range = document.getElementById('range'),
rangeV = document.getElementById('rangeV'),
setValue = ()=>{
    const newValue = Number( (range.value - range.min) * 100 / (range.max - range.min) );
    // console.log(range.value)
    perp =  range.value

    delay(function(){
        // post_tsne()

    }, 500); // end delay 
};

// document.addEventListener("DOMContentLoaded", setValue);
// range.addEventListener('input', setValue);

// draw_heatmap(json.heatMap)
// console.log(json)
draw_testingOverview(json.dount.word_collect,json.news,json.dount.range)
draw_legend(json.dount.label,"#totalLe","legendsAll")
draw_color_legend([0,0.2, 0.5, 0.7, 1, 1.2, 1.5],"#colorSet","colorlegendsAll")