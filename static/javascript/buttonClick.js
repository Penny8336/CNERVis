function wordSubmit() {
    word = document.getElementById("inputWord").value;
    console.log(word)
    $('#forceAxis > svg').remove()
    $('.range-slider').empty()

    $.ajax({ 
        type: "POST", 
        url: "/findWord", 
        data: {"word":word},
        success: function(data,textStatus,jqXHR ){ 
            console.log(data)
            draw_testingOverview(data.word_collect,json.news,data.range)
        } 
    }); 
  }

function  WSNeighborhood(){
    console.log("hi there WSNeighborhood")
    console.log(selectCharacter)
    console.log(articleIndex)
    $.ajax({ 
        type: "POST", 
        url: "/changePOSWS", 
        data: {"pipeline":4,"select_character":selectCharacter,'select_article':articleIndex},
        success: function(data,textStatus,jqXHR ){ 
            console.log(data)
            chatJson = data.charJson
            scatter = data.scatter
            open_tsne_1(scatter.revised,chatJson,selectCharacter)
            open_tsne_0(scatter.hidden,chatJson,selectCharacter)
        } 
    }); 
}

function  POSNeighborhood(){
    console.log("hi there POSNeighborhood")
    console.log(selectCharacter)
    console.log(articleIndex)
    $.ajax({ 
        type: "POST", 
        url: "/changePOSWS", 
        data: {"pipeline":2,"select_character":selectCharacter,'select_article':articleIndex},
        success: function(data,textStatus,jqXHR ){ 
            console.log(data)
            chatJson = data.charJson
            scatter = data.scatter
            open_tsne_1(scatter.revised,chatJson,selectCharacter)
            open_tsne_0(scatter.hidden,chatJson,selectCharacter)            
        } 
    }); 
}

function HidePOS(){
    d3.select("#context_svg")
    .selectAll("rect")
    .attr("fill", "white")
}



function posOrTraining(){

}

function changePOS(){
    console.log("hi there")
    var selectList = document.getElementById("selections")
    console.log(selectList)    
    var index = selectList.selectedIndex;
    var pos = selectList.options[index].text
    console.log(index)    
    console.log(pos)
    console.log(clickTheCharacter)    
    console.log(clickTheOrder)
    console.log("clickArticle",clickArticle)
    console.log(selectedContext)

    $.ajax({ 
        type: "POST", 
        url: "/changePOS", 
        data: {"name":"Nv","character":clickTheCharacter,"map_begin":clickTheOrder, "article":String(clickArticle), hithere:JSON.stringify(selectedContext)},
        success: function(data,textStatus,jqXHR ){ 
            console.log("success hi there post success")      
            contentNew = data.content
            console.log(contentNew)
            // open_tsne_1(scatter.hidden1)
            $("#context").empty()
            $("#tra_context").empty()
            returnIndex_(indexs,contentNew,select_,pos_truth,contentNew)

            // // draw_heatmap(scatter.hidden1.tsne.all_)
            
        } 
    }); 
    changePOS+=1
    console.log("onchange")
}