console.log(json)
legend_set = json.entity_set
default_opacity = 0.6
// scatter1 = json.scatter.hidden1
// scatter = json.scatter.hidden
// let content = scatter1.tsne.all_

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

function open_tsne_1(scatter){
    $('#hid1_all').empty()
    $('#hid1_forward').empty()
    $('#hid1_backward').empty()
    console.log(scatter)
    let hidden1_check = document.getElementsByName('hidden1')[0].checked;

    console.log(hidden1_check);//false
    if (hidden1_check == true){
        console.log("hi there")
        draw_tsne(scatter.tsne.all_,scatter.axis.all_,'#hid1_all')
        // draw_tsne(scatter.tsne.forward_,scatter.axis.forward_,'#hid1_forward')
        // draw_tsne(scatter.tsne.backward_,scatter.axis.backward_,'#hid1_backward')

      }
    else{
        $('#hid1_all').empty()
        $('#hid1_forward').empty()
        $('#hid1_backward').empty()
    }
}

function open_tsne_0(scatter){
    $('#hid0_all').empty()
    $('#hid0_forward').empty()
    $('#hid0_backward').empty()
    
    console.log("hi")
    let hidden0_check = document.getElementsByName('hidden0')[0].checked;

    console.log(hidden0_check);//false
    if (hidden0_check == true){
        console.log("hi there")
        draw_tsne(scatter.tsne.all_,scatter.axis.all_,'#hid0_all')
        // draw_tsne(scatter.tsne.forward_,scatter.axis.forward_,'#hid0_forward')
        // draw_tsne(scatter.tsne.backward_,scatter.axis.backward_,'#hid0_backward')
      }
      else{
        $('#hid0_all').empty()
        $('#hid0_forward').empty()
        $('#hid0_backward').empty()
    }
}

function draw_heatmap(content){
    $('#heatMap').empty()
    let heatMap = d3.select("#heatMap")
    click_flag=0
    heatMap
        .selectAll()
        .data(content)
        .enter()
        .append('div')
        .attr('class', 'heatMaps')
        .style('background-color', function (d){return color_.waffle[d.ner]})
        .style('border', function (d){
            if (!(d.kurtosis)) {
                return "3px solid"
            }})
        .style('border-color', function (d){
            if (!(d.kurtosis)) {
                return "red"
            }})  
        .attr("id",d => {return "index" + d.index})
        .style("opacity",default_opacity)
        .on("click", function(d){
            click_flag = 1
            // heatMap.style('opacity', default_opacity)
            d3.selectAll("#"+this.id)
            .style('opacity', 1)
            d3.selectAll("#"+this.id)
            .style('box-shadow', "3px 3px 12px black")

            d3.select("#c_"+this.id)
            .style('opacity', 1)
            .attr("stroke-width", 2)

        })
        .on("mousemove",function(d){ 
            if (!click_flag){
                d3.select("#heatMap").selectAll("#"+this.id)
                    .style('opacity', 1)
                d3.selectAll("#"+this.id)
                .style('box-shadow', "3px 3px 12px black")

                d3.select("#c_"+this.id)
                    .style('opacity', 1)
                    .attr("stroke-width", 2)
                // d3.select("#c_"+this.id)
                //     .data(function(d){ return d})
                //     .enter()
                //     .append("cirlce ")
                //     .attr("cx",function(d) {
                //         console.log(d)
                //         return d.x})
                //     .attr("cy",function(d) {return d.y})
                //     .attr('r', 5)
                //     .attr("stroke", black)
                //     .attr("stroke-width", 3)

            }})
        .on("mouseleave", function(d){ 
            if (!click_flag){
                d3.select("#heatMap").selectAll("#"+this.id)
                    .style('opacity', default_opacity)
                    .style('box-shadow', "")

                d3.select("#c_"+this.id)
                    .style('opacity', default_opacity)
                    .attr("stroke-width", 0.5)
            }})


}

function draw_legend(){
    let legend_r = d3.select("#legend_r")

    legend_r
    .selectAll('#legend_r')
    .data(legend_set)
    .enter()
    .append('div')
    .text( d => {return d.substr(0, 4)})
    .attr('class', 'legends')
    .style('background-color', function (d){return color_.waffle[d]})

}



function draw_tsne(scatter,axis_,select_){
    var margin = {top: 10, right: 15, bottom: 15, left: 35},
        width = 400 - margin.left - margin.right,
        height = 280 - margin.top - margin.bottom;

    // for pie chart
    var arc = d3.arc()
    .innerRadius(0)
    .outerRadius(3);

    var pie = d3.pie()
    .sort(null)
    .value(function(d) { return d; })

    var label_ = function(char){
        pie_ = pie(char.predicts)
        pie_['index_'] = char.index
        pie_['kurtosis'] = char.kurtosis
        pie_['center'] = arc.centroid(pie_)
        pie_.forEach(function(d,i){
            d['predicts_order'] = char.label_list[i]
            d['radius'] = char.radius
            d['entity'] = String(char.ner)
        })
        return pie_
    }

    axis_x = axis_.x
    axis_y = axis_.y
    var axis_x = Object.values(axis_x).map(Number);
    var axis_y = Object.values(axis_y).map(Number);

    var xScale = d3.scaleLinear()
        .range([ 0, width])
        .domain([axis_x[1]-5, axis_x[0]]) //min.max
        
    var yScale = d3.scaleLinear()
        .range([height, 0])
        .domain([axis_y[1], axis_y[0]+5])
    
    var overview_scatterplot = d3.select(select_)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("class","scatterplot")

    var pie_charts = overview_scatterplot.append("g") // pie charts
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    
    // var xAxis = pie_charts.append("g")
    //     .attr("transform", "translate(0," + height + ")")
    //     .call(d3.axisBottom(xScale));

    // var yAxis = pie_charts.append("g")
    //     .call(d3.axisLeft(yScale));

    scatter.forEach(function(d,i){
        // var pies = pie(d3.entries(d.predicts))
        d['x'] = parseInt(d.x)
        d['y'] = parseInt(d.y)
        d['scaleX'] = xScale(d.x)
        d['scaleY'] = yScale(d.y)

        })

    var circles = pie_charts.selectAll(null)
        .data(scatter)
        .enter()
        .append("g")
        .property("radius", function (d) {
            return d.radius;
        })
        .attr("transform", function (d) {
            return "translate(" + d.scaleX + "," + d.scaleY + ")";
        })
        .attr("class","pies")
        .attr("stroke", function(d) {
            if (!(d.kurtosis)) return "red"
            return "black"
        })  
        .attr("class",d => { return "dot_index" + d.index +" "+ "pies"})
        .attr("stroke-width", function(d) {
            if (!(d.kurtosis)) {
                return "0.5px"
            }
            else if (d.predicts.lastIndexOf(0)>0){
                return "0px"
            }
            else{
                return "0.3px"
            }
        })  
        .attr("id",d => { return "c_index" + d.index})
        .style("opacity", default_opacity)

        // .on("mouseover",function(d){ console.log(d.index)})
    // var pies = circles.selectAll(".pies")
    circles.selectAll()
        .data(function(d) { return label_(d); })
        .enter()
        .append("path")
        .attr('d', function (d) {
            arc.outerRadius(d.radius);
            return arc(d)
        })
        // .style("opacity", 0.8)
        .attr("fill",function(d) { return color_.waffle[d.predicts_order]})
            // .on("mouseleave", mouseleave )

    var simulation = d3.forceSimulation()
        .force("collision", d3.forceCollide(d => d.radius)) // Repulsion force
        .force("x_force", d3.forceX(d => d.scaleX)) // Each point attacted to its center x and y
        .force("y_force", d3.forceY(d => d.scaleY))

    simulation
        .nodes(scatter)
        .on("tick", function(d){
            console.log("tick")
            circles
                .attr("transform", function (d) {
                    return "translate(" + d.x + "," + d.y + ")";
                })
            });
        
    // Lasso functions

    var lasso_start = function() {
        d3.select("#heatMap").selectAll(".heatMaps")
        .style("opacity", default_opacity) 
        .style('box-shadow', "")

        lasso.items()
            .attr("r",5.5) // reset size
            .classed("not_possible",true)
            .classed("selected",false);
    };

    var lasso_draw = function() {
    
        // Style the possible dots
        lasso.possibleItems()
            .classed("not_possible",false)
            .classed("possible",true);

        // Style the not possible dot
        lasso.notPossibleItems()
            .classed("not_possible",true)
            .classed("possible",false);
    };

    var lasso_end = function() {
        // Reset the color of all dots
        lasso.items()
            .classed("not_possible",false)
            .classed("possible",false);

        var selects = lasso.selectedItems()
            .classed("selected",true)
            .style("opacity", 1);
        
        lasso.notSelectedItems()
            .style("opacity", default_opacity)
        
        groups = selects._groups[0]
        groups_index=""
        groups_number=[]
        groups.forEach(function(d){
            console.log(d.id.slice(2,))
            groups_index = groups_index.concat("#"+d.id.slice(2,)+",")
            groups_number.push(parseInt(d.id.slice(7, )))
        });

        groups_index= groups_index.slice(0, -1)

        // d3.selectAll(".pies")
        // .style("opacity", default_opacity)



        d3.select("#heatMap").selectAll(groups_index)
        .style("opacity", 0.8)    
        .style('box-shadow', "3px 3px 12px black")

        get_group(groups_number,groups_index,scatter,"#context")


    };
    
    var lasso = d3.lasso()
        .closePathSelect(true)
        .closePathDistance(100)
        .items(circles)
        .targetArea(overview_scatterplot)
        .on("start",lasso_start)
        .on("draw",lasso_draw)
        .on("end",lasso_end);
    
    overview_scatterplot.call(lasso);


}
function get_group(groups,groups_index,content,select_){
    // if continuous
    groups_=[]
    let skip = 0
    groups_.push(groups[0])
    for (let i = 0; i < groups.length-1; i++){
        // console.log(groups[i],groups[i+1],groups[i]+1)
        if(!(groups[i+1]==groups[i]+1)){
            // groups_.push(groups[i+1])
            groups_.push(groups[i+1])
        }
        else{
            skip += 1
        }
    }

    context_=[]
    let layer=0
    groups_.forEach(function(d,i){
        if (d-4==4){
            slice_word=content.slice(d-3,d+8)
        }
        else if(d-4<0){
            slice_word=content.slice(d,d+11)
        }
        else{
            slice_word=content.slice(d-4,d+7)
        }
        layer = i
        context_ = context_.concat(slice_word)
    })
    returnIndex_(groups_index,context_,layer,select_,1)

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
    .attr("fill",function(d) { return color_.waffle[d.label]})
    
    console.log(block.selectAll("g"))
    block.style("opacity", function(d){ return d.opacity})
    // block.attr("fill",function(d) { return color_.waffle[d.label]})
}

click_time=-1 //to back char/collection model
range_click_time=0
function changeWS(d){
    console.log(d)

    d3.select(this)
    // .style("stroke-width", 2)
    .style("opacity", 0.8)

    range_mod = range_click_time%2
    switch(range_mod){
        case 0:
            console.log("case0")
            new_begin = d.index
            break;
        case 1:
            new_end = d.index
            console.log("case1")
            $.ajax({ 
                type: "POST", 
                url: "/", 
                data: {"open_tsne":0,"perp":perp,"changeWS":1,"new_begin":new_begin,"new_end":new_end},
                success: function(data,textStatus,jqXHR ){ 
                    console.log("success hi there post success")      
                    scatter = data.scatter
                    open_tsne_1(scatter.hidden1)
                    $("#context").empty()
                    $("#tra_context").empty()

                    draw_heatmap(scatter.hidden1.tsne.all_)
                    
                } 
            }); 
            break;
    }
    range_click_time+=1

}

function returnIndex_(indexs,context_,layer,select_,pos_truth){
    // console.log(context_)
    $(select_).empty()
    var margin = {top: 10, right: 0, bottom: 10, left: 10},
    width = 750 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

      // create a tooltip
    let tooltip = d3.select(select_)
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")

    // for pie chart
    let arc = d3.arc()
    .innerRadius(0)
    .outerRadius(3);

    var pie = d3.pie()
    .sort(null)
    .value(function(d) { return d; })

    var label_ = function(char){
        pie_ = pie(char.predicts)
        pie_['index_'] = char.index
        pie_['kurtosis'] = char.kurtosis
        pie_.forEach(function(d,i){
            d['predicts_order'] = char.label_list[i]
            d['radius'] = char.radius
            d['entity'] = String(char.ner)
        })
        return pie_
    }

    let layer_arr=[]
    for (let i = 0; i <= layer; i++){
        layer_arr.push(i)
    }

    height = (layer+1)*75 - margin.top - margin.bottom;

    timeStep= [0,1,2,3,4,5,6,7,8,9,10]
    let xScale = d3.scaleBand()
        .range([ 0, width])
        .domain(timeStep) //min.max
        .padding(0.01);
    let yScale = d3.scaleBand()
        .range([height, 0])
        .domain(layer_arr)
        .padding(0.01);
        
   
    let each_sentence = d3.select(select_)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")")
        .attr("id", "context_svg")


    each_sentence.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale))

    each_sentence.append("g")
        .call(d3.axisLeft(yScale));

    let mouseover = function(d) {
        tooltip.style("opacity", 1)
    }
    let mousemove = function(d) {
        tooltip
        .html(d.predicts_order)
        .attr("transform",
        "translate(" + xScale(d3.mouse(this)[0]) + "," + yScale(d3.mouse(this)[1]) + ")")

    }
    let mouseleave = function(d) {
        tooltip.style("opacity", 0)
    }


    timeStep_len = timeStep.length
    let each_sentence_g = each_sentence.append("g") 
        .attr("id", "sentence_pie")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    for (var i=0; i<context_.length ; i++){
        x_timeStep = i % timeStep_len
        if (x_timeStep==0 && context_[i].BI ==0){
            context_[i]['heatMap_block'] = 1
            for (var j=1; j<10 ; j++){
                if (context_[i+j].BI ==0){
                    context_[i]['heatMap_block'] += 1
                }
                else{
                    break
                }
            }
        }
    }

    let pos_block = each_sentence.selectAll(null)
        .data(context_)
        .enter()
        .append("rect")
        .attr("x", function(d,i) { 
            x_timeStep = i % timeStep_len
            return xScale(x_timeStep) })
        .attr("y", function(d,i) { 
            y_timeStep = parseInt(i/timeStep_len)
            return yScale(y_timeStep) })
        .attr("class", "block")
        .attr("width",           function(d,i){
            x_timeStep = i % timeStep_len
            if (x_timeStep==0 && d.BI ==0){
                block_width = xScale.bandwidth() * d.heatMap_block
            }
            else {
                block_width = xScale.bandwidth()*(d.BI)
            }
            if (d.BI-1 <=0){
                temp = 0
            }
            else{
                temp = xScale.bandwidth()*0.01*(d.BI-1)

            }
            return block_width+temp
        })
        .attr("height",function(d){ return yScale.bandwidth()})
        .attr("rx", "8")
        .attr("rx", "8")
        .style("opacity", 0.3)
        // .on("mouseover",function(d){ console.log(d.index)})
        .on("click",changeWS)
        .attr("fill",function(d) { return color_.pos[d.pos.slice(0,1)]})
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
        
    var characters = each_sentence.selectAll(null)
        .data(context_)
        .enter()
        .append("g")
        // .property("radius", 50)
        .attr("transform", function (d,i) {
            x_timeStep = i % timeStep_len
            y_timeStep = parseInt(i/timeStep_len)
            x_ = xScale(x_timeStep)+35
            y_ = yScale(y_timeStep)+35
            d['opacity'] = (x_timeStep == 4 ? 1.0 : 0.5)
            return "translate(" + x_ + "," + y_ + ")";
        })
        .attr("stroke-width", function(d) {
            if (!(d.kurtosis)) {
                return "0.8px"
            }
            else if (d.predicts.lastIndexOf(0)>0){
                return "0px"
            }
            else{
                return "0.3px"
            }
        })  
        .attr("stroke", function(d) {
            if (!(d.kurtosis)) return "red"
            return "black"
        })  
        .on("click",function(d){ 
            $.ajax({ 
                type: "POST", 
                url: "/", 
                data: {"open_tsne":0,"perp":perp,"click_index":d.index,"changeWS":0,"wordCloudClick":1,"wordCloudSelect":0},
                success: function(data,textStatus,jqXHR ){ 
                    console.log("hi there post success")      
                    console.log(data)
                    returnIndex_(groups_index,data.tra_nearest,9,"#tra_context",0)
                    wordCloud(data.wordCloud,"#wordCloud",d.index)
                } 
            }); 
        })

    each_sentence.selectAll("g")

    // console.log(context_)
    characters.selectAll()
        .data(function(d) { return label_(d); })
        .enter()
        .append("path")
        .attr('d', function (d) {
            arc.innerRadius(17);
            arc.outerRadius(25);
            return arc(d)
        })
        .attr("fill",function(d) { return color_.waffle[d.predicts_order]})
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)

    characters.selectAll()
        .data(function(d){ return [d]})
        .enter()
        .append("text")
        .text(function (d) {return d.character})
        .style('text-anchor', 'middle')
        .attr('dy', '.35em')
        .style("font-size","17px")
        .style("color","white")
        .attr("id",d => {return "index" + d.index})

    d3.select("#context_svg").selectAll("text")
        .style("opacity", 0.4)
    d3.selectAll(indexs)
        .style("opacity", 1)   
    
    if (!pos_truth){
        draw_block_truth_color(characters)
    }
    else{
        // d3.select("#context_svg").selectAll("g")
        //     .style("opacity", 0.4)
        // d3.select("#context_svg").selectAll("text")
        //     .style("opacity", 0.4)
        draw_block_pos_color(characters,indexs)
    }

}

function wordCloud(data,select_,index){
    console.log(index)
    $(select_).empty()
    console.log(data)
    max_=0
    data.forEach(function(d){
        if (max_ < d.frequency){
            max_ = d.frequency
        }
    })
    var margin = {top: 10, right: 0, bottom: 10, left: 10},
        width = 750 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;
    
    var g = d3.select(select_)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const wordScale = d3.scaleLinear()
            .domain([0,max_])
            .range([0,400])
        
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
                        returnIndex_(data.WC_Select[0],data.WC_Select,9,"#tra_context",0)
                    } 
                }); 
            })
    };
}

var delay = (function() { 
    var timer = 0; 
    return function(callback, ms) { 
     clearTimeout (timer); 
     timer = setTimeout(callback, ms); 
    }; 
})(); 

function post_tsne(){
    console.log("perp",perp)

    $.ajax({ 
        type: "POST", 
        url: "/", 
        data: {"open_tsne":1,"perp":perp,"changeWS":0},
        success: function(data,textStatus,jqXHR ){ 
            console.log("hi there post success")      
            scatter = data.scatter
            open_tsne_1(scatter.hidden1)
            // open_tsne_0(scatter.hidden)
            draw_heatmap(scatter.hidden1.tsne.all_)
        } 
    }); 
}

let perp=0
//slider
const range = document.getElementById('range'),
rangeV = document.getElementById('rangeV'),
setValue = ()=>{
    const newValue = Number( (range.value - range.min) * 100 / (range.max - range.min) ),
        newPosition = 10 - (newValue * 0.2);
        rangeV.innerHTML = `<span> Perplexity ${range.value}</span>`;
        rangeV.style.left = `calc(${newValue}% + (${newPosition}px))`;
    console.log(range.value)
    perp =  range.value

    delay(function(){
        post_tsne()
    }, 500); // end delay 
};

document.addEventListener("DOMContentLoaded", setValue);
range.addEventListener('input', setValue);


draw_legend()