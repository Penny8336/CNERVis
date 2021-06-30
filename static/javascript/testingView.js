function draw_testingOverview(scatter,news,range){
    // console.log(scatter)
    // console.log(news)
    // console.log(range.min,range.max)

    var margin = {top: 10, right: 20, bottom: 10, left: 20},
        width = 800 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    d3.select(".range-slider")
    .append('input')
    .attr("class", 'js-range-slider')

    var $range = $(".js-range-slider"),
        $inputFrom = $(".js-input-from"),
        $inputTo = $(".js-input-to"),
        instance,
        min = range.min,
        max = range.max,
        // max = (range.max == 2.48 ? 2.3 : range.max)
        from = 0,
        to = 0;
    

    $range.ionRangeSlider({
        skin: "round",
        type: "double",
        min: min,
        max: max,
        from: max/1.26,
        to: max/1.09,
        onStart: updateInputs,
        onChange: updateInputs,
        step:0.01
    });

    instance = $range.data("ionRangeSlider");

    function updateInputs (data) {
        from = data.from;
        to = data.to;
        $inputFrom.prop("value", from);
        $inputTo.prop("value", to);	
        delay(function(){
            changeRange(from,to)
        }, 500); // end delay 
        
    }

    function changeRange(from,to){
        // console.log(from,to)
        let entropyRange_ = scatter.filter(word => word.max_entropy > from);
        let entropyRange = entropyRange_.filter(word => word.max_entropy <= to);
        numnerword = (entropyRange.length)-1
        draw_overview(entropyRange,entropyRange[numnerword].max_entropy,entropyRange[0].max_entropy)
    }

    function draw_overview(entropyRange,from,to){
        // console.log(from,to,width,entropyRange)
        $('#forceAxis > svg').remove()

        var xScale = d3.scaleLinear()
            .range([ 0, width-100])
            .domain([from-0.01,to]) //min.max

    let article_index = 0
    var overview_scatterplot = d3.select("#forceAxis")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("id","forceAxis_svg")

    var pie_charts = overview_scatterplot.append("g") // pie charts
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")


        entropyRange.forEach(function(d,i){
        d['scaleX'] = xScale(d.max_entropy)
        d['scaleY'] = 150
        })

        //
        let forceG =pie_charts.selectAll('.rectText_')
            .data(entropyRange)
            .enter()
            .append('g')
            .attr("class","rectText_")
            .on("click",function(d){
                index = d.dount[0].index
                article_index = index.article
                classWord=""
                d.dount.forEach(d => classWord += ".waffle"+d.index.char+",")

                console.log("index",index,"classWord",classWord)
                draw_heatmap(news[article_index].heatmap, classWord)
                draw_legend(news[article_index].set,"#heatMap_set","legendsAll")
            })


        let texts=  forceG
            .append('text')
            .html(function(d){
                wordLength = d.word.length
                return d.word
            })
            .attr("x",0)
            .attr("y",21)
            .attr("id", function(d,i){
                return "group"+i
            })
            .style("color", "white")
            .attr("class","TTT")
            .style("fill", "#fff")


    var simulation = d3.forceSimulation()
        .force("collision", d3.forceCollide(d => d.max_entropy*13)) // Repulsion force
        .force("x_force", d3.forceX(d => xScale(d.max_entropy)))
        .force("y_force", d3.forceY(d => 150))

    simulation
        .nodes(entropyRange)
        .on("tick", function(d,i){
            forceG
                .attr("transform", function (d) {
                    return "translate(" + d.x + "," + d.y + ")";
                })

          
        });

        d3.select("#forceAxis_svg")
        .select("g")
        .selectAll('text')
        .attr("font-size",function (d) {
            wordLength = d.dount.length
            if (d.dount.length<2){
                wordSize = +(d.dount[0].entropy)
            }
            else{
                wordSize = +(d.dount[wordLength-1].entropy)

            }
            if (wordSize*13 < 13){
                return 13
            }
            else{
                return (wordSize*13);
            }
        })
        
        var bbox = texts.nodes()

        forceG
        .insert('rect', 'text')
        .attr("x", (d, i) => bbox[i].getBBox().x-3)
        .attr("y", (d, i) => bbox[i].getBBox().y)
        .attr("width", (d, i) => bbox[i].getBBox().width+6)
        .attr("height", (d, i) => bbox[i].getBBox().height)
        .style('fill', function (d){return color_.waffle[d.ner]})
        .attr("rx", 5)
        .attr("ry", 5)

        let tooltip = d3.select('#forceAxis_svg')
        .append("g")
        .style("opacity", 0)
        .attr("class", "donut_tooltip")


        var pie = d3.pie()
          .value(function(d) {return d.value; })
    
        var toDonut = function(char){
            array1 = char.label_list
            array2 = char.predicts
            data =[]
            for (let index = 0; index < array1.length; index++) {
                data.push({'key':array1[index],'value':array2[index]})
            }
            pie_ = pie(data)
            return pie_
        }

        d3.selectAll('.rectText_')
        .on("mouseover",function(d){ 
            tooltip.style("opacity", 1)
         })
        .on("mousemove", function(d){
            dount = d.dount
            tooltipLength = d.dount.length
            index = d.index
            // x =  d3.mouse(this)[0]+400
            // y =  d3.mouse(this)[1]+100
            x = d3.event.pageX
            y = d3.event.pageY

            // console.log(x,y-200,d3.mouse(this)[0]+400,d3.mouse(this)[1]+100)

            tooltip
            .html("details")
            .attr("transform", "translate(" + (x) + "," + (y-200) + ")")

            tooltip
            .append('rect')
            .style("width", function(d){
                return tooltipLength*65+20 +"px"
            })
            .style("height","80px")
            .style("fill", "#fff")
            .style("stroke","black")
            .style("stroke-width","2px")

            .style("position","absolute")

            let gDonut = tooltip.selectAll(null)
            .data(dount)
            .enter()
            .append("g")
            .attr("transform", function(d,i){
                return "translate(" + (i*65+40) + "," + 40 + ")"
            })
            .style("position","absolute")

            gDonut.selectAll()
            .data(function(d) { return toDonut(d); })
            .enter()
            .append("path")
            .attr('d', d3.arc()
                .innerRadius(30)         // This is the size of the donut hole
                .outerRadius(15)
            )
            .attr("fill",function(d) { 
                nerString = d.data.key.split(":",1)
                
                return color_.waffle[nerString]})
            .attr("stroke", "black")
            .style("stroke-width", "2px")
            .style("opacity", 0.7)


            gDonut.selectAll()
            .data(function(d){ return [d]})
            .enter()
            .append("text")
            .text(function (d) {return d.character})
            .style('text-anchor', 'middle')
            .attr('dy', '.35em')
            .style("font-size","17px")
            .style("color","white")
            .attr("id",d => {return "index" + d.index})
    

        })
        .on("mouseleave", function(){
            tooltip.style("opacity", 0)
        })





    }
}



function draw_heatmap(content,classWord){
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
            return 'heatMaps' + " waffle"+d.index.char
        })
        .style('background-color', function (d){return color_.waffle[d.ner]})
        .style('border', function (d){
            return "3px solid"
        })

        .style('border-color', function (d){
            return colorScale(d.entropy)
        })  
        .attr("id",d => {return "index" + d.index.char})
        .style("opacity",default_opacity)
        .on("click", function(d){
            d3.selectAll(".heatMaps")
            .style('opacity', 0.9)
            .style('box-shadow', "")
            click_flag = 1
            // heatMap.style('opacity', default_opacity)
            d3.selectAll("#"+this.id)
                .style('opacity', 1)
            d3.selectAll("#"+this.id)
                .style('box-shadow', "3px 3px 10px black")

            d3.select("#c_"+this.id)
                .style('opacity', 1)
                .attr("stroke-width", 2)

            selectedCharacter = d.index.char
            selectedArticle = d.index.article
            pipeline = 0 //for check NER
            post_tsne(pipeline)

        })

        d3.selectAll(".heatMaps")
            .style('opacity', 0.9)

        classWord = classWord.slice(0, -1)
        // console.log(wordlist)
        d3.selectAll(classWord)
            .style('box-shadow', "5px 5px 10px black")
            .style('opacity', 0.9)

        
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
