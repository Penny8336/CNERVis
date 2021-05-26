function draw_testingOverview(scatter,news,range){
    console.log(news)
    console.log(scatter)
    var margin = {top: 10, right: 20, bottom: 10, left: 20},
        width = 800 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    var xScale = d3.scaleLinear()
        .range([ 0, width])
        .domain([range.min-0.1, range.max+0.3]) //min.max

    let article_index = 0
    var overview_scatterplot = d3.select("#forceAxis")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("id","forceAxis_svg")

    let tooltip = d3.select('#forceAxis')
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")
        .style("align-items", "center")

    var pie_charts = overview_scatterplot.append("g") // pie charts
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    scatter.forEach(function(d,i){
        d['scaleX'] = xScale(d.max_entropy)
        d['scaleY'] = 150
        })

    var circles = pie_charts.selectAll('circle')
        .data(scatter)
        .enter()
        .insert('circle', 'text')
        .attr("r",function (d) {
            wordLength = d.dount.length
            if (d.dount.length<2){
                wordSize = +(d.dount[0].entropy)
                // console.log(wordSize)
            }
            else{
                wordSize = +(d.dount[wordLength-1].entropy)
                console.log(wordSize)

            }
            if (wordSize*8 < 8){
                return 8
            }
            else{
                return (wordSize*8);
            }
        })
        .attr("transform", function (d) {
            return "translate(" + d.scaleX + "," + 100 + ")";
        })
        .style('fill', function (d){return color_.waffle[d.ner]})
        .style("opacity",1)


        let texts = d3.select("#forceAxis_svg")
        .select("g")
        .selectAll('text')
        .data(scatter)
        .enter()
        .append('text')
        .attr('fill','black')
        .html(function(d){
            console.log(d.word.length)
            wordLength = d.word.length
            if (wordLength<3){
                return d.word
            }
            else if(wordLength>3){
                return d.word[0] +'<br>'+ d.word.slice(1,wordLength)
            }
            return d.word
        })
        .on("click",function(d){
            index = d.dount[0].index_article
            character_index = index.char
            article_index = index.article
            console.log(d)
            console.log("character",character_index)
            console.log("article",article_index)
            console.log(news[article_index].set)
            draw_heatmap(news[article_index].heatmap,index)
            draw_legend(news[article_index].set,"#heatMap_set","legendAll")
        })
        .on("mouseover",function(d){ 
            tooltip.style("opacity", 1)
        })
        .on("mousemove", function(d){
            dount = d.dount
            console.log(dount)
            tooltipLength = d.dount.length
            console.log(tooltipLength)
            index = d.index
            tooltip
            .html("details")
            .style("left", (d3.mouse(this)[0]+200) + "px")
            .style("top", (d3.mouse(this)[1])+200 + "px")
            .style("width", function(d){
                return tooltipLength*100 +"px"
            })
        })
        .on("mouseleave", function(){
            tooltip.style("opacity", 0)
        })


    var simulation = d3.forceSimulation()
        .force("collision", d3.forceCollide(d => d.max_entropy*13)) // Repulsion force
        .force("x_force", d3.forceX(d => xScale(d.max_entropy)))
        .force("y_force", d3.forceY(d => 150))

    simulation
        .nodes(scatter)
        .on("tick", function(d){
            circles
                .attr("transform", function (d) {
                    return "translate(" + d.x + "," + d.y + ")";
                })

       d3.select("#forceAxis_svg")
            .select("g")
            .selectAll('text')
            .attr("x", function(d) {
                return d.x;  // Returns scaled location of x
            })
            .attr("y", function(d) {
                return d.y;  // Returns scaled circle y
            })
            .attr("text-anchor", "middle")
           
        });
        d3.select("#forceAxis_svg")
        .select("g")
        .selectAll('text')
        .attr("font-size",function (d) {
            wordLength = d.dount.length
            if (d.dount.length<2){
                wordSize = +(d.dount[0].entropy)
                // console.log(wordSize)
            }
            else{
                wordSize = +(d.dount[wordLength-1].entropy)
                console.log(wordSize)

            }
            if (wordSize*13 < 13){
                return 13
            }
            else{
                return (wordSize*13);
            }
        })



}



function draw_heatmap(content,article_index){
    character = article_index.char
    article = article_index.article 
    console.log("heatmap",article,character )

    colorScale 
    .domain([0,0.2, 0.5, 0.7, 1, 1.2, 1.5])
    .range(d3.schemeOrRd[8]);
    

    $('#heatMap').empty()
    let heatMap = d3.select("#heatMap")
    click_flag=0
    var heapMaps = heatMap
        .selectAll()
        .data(content)
        .enter()
        .append('div')
        .text(d => { return d.character})
        .style("font-size","23px")
        .style("text-align","center")
        .style("color", "white")
        .attr('class', function(d,i){
            return 'heatMaps' + " waffle"+i
        })
        .style('background-color', function (d){return color_.waffle[d.ner]})
        .style('border', function (d){
            // if (!(d.kurtosis)) {
            //     return "3px solid"
            // }
            // console.log(d.entropy)
            return "3px solid"
        })

        .style('border-color', function (d){
            // if (!(d.kurtosis)) {
            //     return "red"
            // }
            // console.log(d.entropy)
            return colorScale(d.entropy)
        })  
        .attr("id",d => {return "index" + d.index.char})
        .style("opacity",default_opacity)
        .on("click", function(d){
            console.log(d)
            click_flag = 1
            // heatMap.style('opacity', default_opacity)
            d3.selectAll("#"+this.id)
            .style('opacity', 1)
            d3.selectAll("#"+this.id)
            .style('box-shadow', "3px 3px 10px black")

            d3.select("#c_"+this.id)
            .style('opacity', 1)
            .attr("stroke-width", 2)
            console.log(d)

            character_index = d.index.char
            article_index = d.index.article

            console.log("post_tsne")
            console.log("character",character_index)
            console.log("article",article_index)
            post_tsne(character_index,article_index)

        })

        d3.selectAll(".heatMaps")
            .style('opacity', 0.8)
        d3.selectAll(".waffle"+character)
            .style('box-shadow', "5px 5px 15px black")
            .style('opacity', 0.8)

        
        // .on("mousemove",function(d){ 
        //     if (!click_flag){
        //         d3.select("#heatMap").selectAll("#heapMap"+this.id)
        //             .style('opacity', 1)
        //         d3.selectAll("#"+this.id)
        //         .style('box-shadow', "3px 3px 12px black")

        //         d3.select("#c_"+this.id)
        //             .style('opacity', 1)
        //             .attr("stroke-width", 2)
        //         // d3.select("#c_"+this.id)
        //         //     .data(function(d){ return d})
        //         //     .enter()
        //         //     .append("cirlce ")
        //         //     .attr("cx",function(d) {
        //         //         console.log(d)
        //         //         return d.x})
        //         //     .attr("cy",function(d) {return d.y})
        //         //     .attr('r', 5)
        //         //     .attr("stroke", black)
        //         //     .attr("stroke-width", 3)

        //     }})
        // .on("mouseleave", function(d){ 
        //     if (!click_flag){
        //         d3.select("#heatMap").selectAll("#"+this.id)
        //             .style('opacity', default_opacity)
        //             .style('box-shadow', "")

        //         d3.select("#c_"+this.id)
        //             .style('opacity', default_opacity)
        //             .attr("stroke-width", 0.5)
        //     }})
}

        // heapMaps
        // .append('span')
        // .text(d => { 
        //     console.log(d)
        //     return d.character})
        // .style("font-size","8px")
        // .style("text-align","center")
        