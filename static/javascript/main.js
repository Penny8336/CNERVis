console.log(json)
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
        "A":"#7D6608",
        "C":"#797D7F",
        "D":"#E67E22",
        "I":"#F4D03F",
        "N":"#1ABC9C",
        "P":"#3498DB",
        "T":"#9B59B6",
        "V":"#E74C3C",
        "P":"#7B241C"
    }
}



function open_tsne_1(scatter,charJson,select_char){

    console.log("select_char",select_char)

    $('#hid1_all > svg').remove()
    $('#hid1_forward > svg').remove()
    $('#hid1_backward > svg').remove()


    draw_tsne(scatter.tsne.all_,scatter.axis.all_,'#hid1_all',charJson,select_char)
    draw_tsne(scatter.tsne.forward_,scatter.axis.forward_,'#hid1_forward',charJson,select_char)
    draw_tsne(scatter.tsne.backward_,scatter.axis.backward_,'#hid1_backward',charJson,select_char)


      

        // $('#hid1_all').empty()
        // $('#hid1_forward').empty()
        // $('#hid1_backward').empty()
        // $('#hid0_all').empty()
        // $('#hid0_forward').empty()
        // $('#hid0_backward').empty()
    
}

function open_tsne_0(scatter,charJson,select_char){
    $('#hid0_all > svg').remove()
    $('#hid0_forward > svg').remove()
    $('#hid0_backward > svg').remove()


    draw_tsne(scatter.tsne.all_,scatter.axis.all_,'#hid0_all',charJson,select_char)
    draw_tsne(scatter.tsne.forward_,scatter.axis.forward_,'#hid0_forward',charJson,select_char)
    draw_tsne(scatter.tsne.backward_,scatter.axis.backward_,'#hid0_backward',charJson,select_char)
    // var x = document.querySelectorAll(".hid0");
    // console.log(x)
    // var x = document.getElementsByClassName("hid0");
    // if (x.style.display === "none") {
    //   x.style.display = "block";
    // } else {
    //   x.style.display = "none";
    // }

    // $('#hid0_all').empty()
    // $('#hid0_forward').empty()
    // $('#hid0_backward').empty()
    
    // console.log("hi")
    // let hidden0_check = document.getElementsByName('hidden0')[0].checked;

    // console.log("open_tsne_0",hidden0_check);//false
    // if (hidden0_check == true){
    //     console.log("hi there")
    //     console.log(scatter)

    //     draw_tsne(scatter.tsne.all_,scatter.axis.all_,'#hid0_all',charJson,select_char)
    //     draw_tsne(scatter.tsne.forward_,scatter.axis.forward_,'#hid0_forward',charJson,select_char)
    //     draw_tsne(scatter.tsne.backward_,scatter.axis.backward_,'#hid0_backward',charJson,select_char)

    //   }
    //   else{
    //     $('#hid0_all').empty()
    //     $('#hid0_forward').empty()
    //     $('#hid0_backward').empty()
    // }
}





function get_group(groups,groups_index,content,select_,select_char){
    // if continuous
    groups_=[]
    if (!(groups.includes(select_char))){
        groups_=[select_char]
    }
    else{
        groups_=[]
    }

    groups_= groups_.concat(groups);
    console.log(groups_)
    console.log(groups)
    let skip = 0
    for (let i = 0; i < groups.length-1; i++){
        console.log(groups_[i],groups[i])
        if (!(groups_[i]==groups[i+1])){
            skip += 1
            console.log("skip",groups_[i],groups[i])
        }
        else{
            groups_.push(groups[i])
            console.log("push",groups_[i],groups[i])
        }
        
    }
    console.log(groups_)

    context_=[]
    groups_.forEach(function(d,i){
        // if (d-4==4){
        //     slice_word=
        // }
        // else if(d-4<0){
            
        // }
        // else{
        //     slice_word=content[d-4,d+7]
        // }
        // console.log(slice_word)
        slice_word=content.slice(d-5,d+6)
        context_ = context_.concat(slice_word)
    })

    console.log(context_)

    returnIndex_(groups_index,context_,select_,1,context_)

}

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
    console.log(block.selectAll("g"))
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
selectCharacter=0
articleIndex=0
function post_tsne(select_character,article_index,pipeline){
    console.log("perp",perp)
    console.log(select_character,article_index)
    selectCharacter= select_character
    articleIndex = article_index
    $.ajax({ 
        type: "POST", 
        url: "/open_tsne", 
        data: {"open_tsne":1,"pipeline":pipeline,"changeWS":0,"select_character":select_character,'select_article':article_index},
        success: function(data,textStatus,jqXHR ){ 
            console.log("hi there post_tsne success")      
            console.log(data)
            chatJson = data.charJson
            scatter = data.scatter
            open_tsne_1(scatter.revised,chatJson,select_character)
            open_tsne_0(scatter.hidden,chatJson,select_character)
            // open_tsne_0(scatter.hidden)
            // draw_heatmap(scatter.hidden1.tsne.all_)
        } 
    }); 
}


// function draw_heatmap(content){
//     colorScale 
//     .domain([0,0.2, 0.5, 0.7, 1, 1.2, 1.5])
//     .range(d3.schemeOrRd[8]);
    
//     // console.log(content)
//     $('#heatMap').empty()
//     let heatMap = d3.select("#heatMap")
//     click_flag=0
//     var heapMaps = heatMap
//         .selectAll()
//         .data(content)
//         .enter()
//         .append('div')
//         .text(d => { return d.character})
//         .style("font-size","4px")
//         .style("text-align","center")
//         .style("color", "white")
//         .attr('class', 'heatMaps')
//         .style('background-color', function (d){return color_.waffle[d.ner]})
//         .style('border', function (d){
//             // if (!(d.kurtosis)) {
//             //     return "3px solid"
//             // }
//             // console.log(d.entropy)
//             return "3px solid"
//         })

//         .style('border-color', function (d){
//             // if (!(d.kurtosis)) {
//             //     return "red"
//             // }
//             // console.log(d.entropy)
//             return colorScale(d.entropy)
//         })  
//         .attr("id",d => {return "index" + d.index})
//         .style("opacity",default_opacity)
//         .on("click", function(d){
//             click_flag = 1
//             // heatMap.style('opacity', default_opacity)
//             d3.selectAll("#"+this.id)
//             .style('opacity', 1)
//             d3.selectAll("#"+this.id)
//             .style('box-shadow', "3px 3px 12px black")

//             d3.select("#c_"+this.id)
//             .style('opacity', 1)
//             .attr("stroke-width", 2)

//             select_character = d.index
//             post_tsne(select_character)

//         })
//         .on("mousemove",function(d){ 
//             if (!click_flag){
//                 d3.select("#heatMap").selectAll("#"+this.id)
//                     .style('opacity', 1)
//                 d3.selectAll("#"+this.id)
//                 .style('box-shadow', "3px 3px 12px black")

//                 d3.select("#c_"+this.id)
//                     .style('opacity', 1)
//                     .attr("stroke-width", 2)
//                 // d3.select("#c_"+this.id)
//                 //     .data(function(d){ return d})
//                 //     .enter()
//                 //     .append("cirlce ")
//                 //     .attr("cx",function(d) {
//                 //         console.log(d)
//                 //         return d.x})
//                 //     .attr("cy",function(d) {return d.y})
//                 //     .attr('r', 5)
//                 //     .attr("stroke", black)
//                 //     .attr("stroke-width", 3)

//             }})
//         .on("mouseleave", function(d){ 
//             if (!click_flag){
//                 d3.select("#heatMap").selectAll("#"+this.id)
//                     .style('opacity', default_opacity)
//                     .style('box-shadow', "")

//                 d3.select("#c_"+this.id)
//                     .style('opacity', default_opacity)
//                     .attr("stroke-width", 0.5)
//             }})

//         // heapMaps
//         // .append('span')
//         // .text(d => { 
//         //     console.log(d)
//         //     return d.character})
//         // .style("font-size","8px")
//         // .style("text-align","center")
        

// }



let perp=0
//slider
const range = document.getElementById('range'),
rangeV = document.getElementById('rangeV'),
setValue = ()=>{
    const newValue = Number( (range.value - range.min) * 100 / (range.max - range.min) );
    console.log(range.value)
    perp =  range.value

    delay(function(){
        // post_tsne()

    }, 500); // end delay 
};

// document.addEventListener("DOMContentLoaded", setValue);
// range.addEventListener('input', setValue);

// draw_legend()
// draw_heatmap(json.heatMap)
console.log(json)
draw_testingOverview(json.dount.word_collect,json.news,json.dount.range)
draw_legend(json.dount.label,"#totalLe","legendsAll")
draw_color_legend([0,0.2, 0.5, 0.7, 1, 1.2, 1.5],"#colorSet","colorlegendsAll")