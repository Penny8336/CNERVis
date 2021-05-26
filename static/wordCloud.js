function wordCloud(data,select_,index){
    console.log(data)
    console.log(index)
    $(select_).empty()
    console.log(data)
    max_=0
    data.forEach(function(d){
        if (max_ < d.frequency){
            max_ = d.frequency
        }
    })
    var margin = {top: 20, right: 0, bottom: 10, left: 10},
        width = 750 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;
    
    var g = d3.select(select_)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .style("margin-left","20px")
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const wordScale = d3.scaleLinear()
            .domain([0,d3.max(data, function (d) {

                return +(d.frequency);
            })])
            .range([0,550])
        
    var layout = d3.layout.cloud()
            .size([width, height])
            .timeInterval(20)
            .words(data)
            .rotate(function(d) { return 0; })
            .fontSize(d=>wordScale(d.frequency))
            //.fontStyle(function(d,i) { return fontSyle(Math.random()); })
            .fontWeight(["bold"])
            .text(function(d) { return d.text; })
            .spiral("rectangular") // "archimedean" or "rectangular"
            .on("end", draw)
            .start();
    
       var wordcloud = g.append("g")
          .attr('class','wordcloud')
          .attr("transform", "translate(" + width/2 + "," + height/2 + ")");
          
       g.append("g")
          .attr("class", "axis")
          .attr("transform", "translate(0," + height + ")")
          .selectAll('text')
    //       .style('fill',function(d) { return color(d); })
    //       .style('font','sans-serif');
    
    function draw(words) {
        wordcloud.selectAll("text")
            .data(words)
            .enter().append("text")
            .attr('class','word')
    //         .style("fill", function(d, i) { return color(i); })
            .style("font-size", function(d) { 
                fontSize = 0
                if (d.size<5){

                }
                return d.size + "px"; })
    //         .style("font-family", function(d) { return d.font; })
    
            .attr("text-anchor", "middle")
            .attr("transform", function(d) { return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")"; })
            .text(function(d) { return d.text; })
            .on("click", function(d){
                $.ajax({ 
                    type: "POST", 
                    url: "/", 
                    data: {"open_tsne":0,"perp":perp,"click_index":index,"changeWS":0,"wordCloudClick":0,"wordCloudSelect":d.text},
                    success: function(data,textStatus,jqXHR ){ 
                        console.log("hi there post success")      
                        console.log(data.WC_Select)
                        returnIndex_(data.WC_Select[0],data.WC_Select,"#tra_context",0)
                    } 
                }); 
            })
    };
}