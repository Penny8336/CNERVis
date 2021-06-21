function wordCloud(data,select_,index,diff_index_WC){
    console.log(data)
    console.log(index)
    $(select_).empty()
    console.log(data)
    max_ = d3.max(data,function (d) { return (d.frequency)})

    var margin = {top: 10, right: 0, bottom: 10, left: 10},
        width = 800 - margin.left - margin.right,
        height = 200 - margin.top - margin.bottom;
    
    var g = d3.select(select_)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const wordScale = d3.scaleLinear()
            .domain([0,max_])
            .range([20,100])
        
    var layout = d3.layout.cloud()
            .size([width, height])
            .words(data)
            .rotate(function(d) { return 0; })
            .padding(5)
            .fontSize(function(d){ return wordScale(d.frequency)})
            .fontWeight(["bold"])
            .spiral("rectangular") // "archimedean" or "rectangular"
            .on("end", draw)
        
        layout.start();
    
    function draw(words) {
        console.log(words)
        g.append("g")
        .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
            .selectAll("text")
            .data(words)
            .enter()
            .append("text")
            .attr('class','word')
    //         .style("fill", function(d, i) { return color(i); })
            .style("font-size", function(d) { return d.size + "px"; })
            .attr("text-anchor", "middle")
            .attr("transform", function(d) { return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")"; })
            .text(function(d) { return d.text; })
            .on("click", function(d){
                console.log(d.text)
                console.log(diff_index_WC)
                $.ajax({ 
                    type: "POST", 
                    url: "/clickWordCloud", 
                    data: {"open_tsne":0,"diff_index_WC":diff_index_WC,"click_index":index,"changeWS":0,"wordCloudClick":0,"wordCloudSelect":d.text},
                    success: function(data,textStatus,jqXHR ){ 
                        console.log("hi there post success") 

                        console.log(data)     
                        console.log(data.WC_Select)
                        returnIndex_(data.WC_Select[0],data.WC_Select,"#tra_context",0)
                    } 
                }); 
            })
    };
}