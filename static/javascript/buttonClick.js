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