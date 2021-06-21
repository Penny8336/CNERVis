clickTheCharacter=0
changePOS=1
function returnIndex_(indexs,context_,select_,pos_truth,select_context){
    layer = context_.length/11
    $(select_).empty()

    var margin = {top: 10, right: 0, bottom: 10, left: 10},
    width = 750 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

    // for pie chart
    let arc = d3.arc()
    .innerRadius(0)
    .outerRadius(3);

    var pie = d3.pie()
    .sort(null)
    .value(function(d) { return d; })

    var toDonut = function(char){
        pie_ = pie(char.predicts)
        pie_['index_'] = char.index
        pie_['entropy'] = char.entropy
        pie_.forEach(function(d,i){
            d['predicts_order'] = char.label_list[i]
            d['radius'] = char.radius
            d['entity'] = String(char.ner)
        })
        return pie_
    }

    let layer_arr=[]
    for (let i = 0; i < layer; i++){
        layer_arr.push(i)
    }
    const reversed_layer_arr = layer_arr.reverse();

    height = (layer+1)*60 - margin.top - margin.bottom;

    timeStep= [0,1,2,3,4,5,6,7,8,9,10]
    let xScale = d3.scaleBand()
        .range([ 0, width])
        .domain(timeStep) //min.max
        .padding(0.01);
    let yScale = d3.scaleBand()
        .range([height, 0])
        .domain(reversed_layer_arr)
        .padding(0.01);
        
   
    let each_sentence = d3.select(select_)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")")
        .attr("id", "context_svg")
        .style("margin-left","20px")

    each_sentence.append("g")
        .attr("transform", "translate(0," + height + ")")
        // .call(d3.axisBottom(xScale))

    // each_sentence.append("g")
    //     .call(d3.axisLeft(yScale));


    timeStep_len = timeStep.length
    let each_sentence_g = each_sentence.append("g") 
        .attr("id", "sentence_pie")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    for (var i=0; i<context_.length ; i++){
        x_timeStep = i % timeStep_len
        if (x_timeStep==0 && +(context_[i].BI) ==0){
            context_[i]['heatMap_block'] = 1
            for (var j=1; j<10 ; j++){
                if (+(context_[i+j].BI) ==0){
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
            if (x_timeStep==0 && +(d.BI) ==0){
                block_width = xScale.bandwidth() * d.heatMap_block
            }
            else {
                block_width = xScale.bandwidth()*(+(d.BI))
            }
            if (+(d.BI)-1 <=0){
                temp = 0
            }
            else{
                temp = xScale.bandwidth()*0.01*(+(d.BI)-1)

            }
            return block_width+temp
        })
        .attr("height",function(d){ return yScale.bandwidth()})
        .attr("rx", "8")
        .attr("rx", "8")
        .style("opacity", 0.2)
        .on("click",changeWS)
        .attr("fill",function(d) { 
            posTag = d.pos
            if (punctuationSet.has(posTag)){
                return color_.pos["Z"]
            }
            else if(twoCharSet.has(posTag.slice(0,2))){
                return color_.pos[posTag.slice(0,2)]
            }
            else{
                return color_.pos[posTag.slice(0,1)]
            }
            
        })
        .on("mouseover",function(d){ 
            tooltip.style("opacity", 1)
         })
        .on("mousemove", function(d){
            tooltip
            .html(d.pos)
            .style("left", d3.event.pageX+ "px")
            .style("top", (d3.event.pageY)+30 + "px")
            
        })
        .on("mouseleave", function(){
            tooltip.style("opacity", 0)
        })


        let tooltip = d3.select(select_)
        .append("div")
        .style("opacity", 0)
        .attr("class", "lable_tooltip")
        .style("background-color", "white")
        .style("align-items", "center")
        .style("text-align","center")
        .style("position","absolute")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")
        
        
    var characters = each_sentence.selectAll(null)
        .data(context_)
        .enter()
        .append("g")
        .attr("transform", function (d,i) {
            x_timeStep = i % timeStep_len
            y_timeStep = parseInt(i/timeStep_len)
            x_ = xScale(x_timeStep)+35
            y_ = yScale(y_timeStep)+35
            d['opacity'] = (x_timeStep == 5 ? 1.0 : 0.5)
            return "translate(" + x_ + "," + y_ + ")";
        })
        // .attr("stroke-width", function(d) {
        //     // if (!(d.kurtosis)) {
        //     //     return "0.8px"
        //     // }
        //     // else if (d.predicts.lastIndexOf(0)>0){
        //     //     return "0px"
        //     // }
        //     // else{
        //     //     return "0.3px"
        //     // }
        //     // console.log(d.entropy)
        // })  
        .attr("stroke", function(d) {
            // if (!(d.kurtosis)) return "red"
            // return "black"
            // console.log(d.entropy)
        })  
        .on("click",function(d){ 
            console.log(d)
            clickTheCharacter = d.index.char
            console.log("clickTheCharacter",clickTheCharacter)
            if (changePOS%2){
                $.ajax({ 
                    type: "POST", 
                    url: "/wordCloud", 
                    data: {"open_tsne":0,"perp":perp,"click_index":d.index.char,"changeWS":0,"wordCloudClick":1,
                    "wordCloudSelect":0},
                    success: function(data,textStatus,jqXHR ){ 
                        console.log("hi there post success")      
                        console.log(data)
                        console.log(data.wordCloud)
                        returnIndex_(groups_index,data.tra_nearest,"#tra_context",0,0)
                        wordCloud(data.wordCloud,"#wordCloud",d.index,data.diff_index_WC)
                    } 
                }); 
            }
        })


    // console.log(context_)
    characters.selectAll()
        .data(function(d) { return toDonut(d); })
        .enter()
        .append("path")
        .attr('d', function (d) {
            arc.innerRadius(17);
            arc.outerRadius(25);
            return arc(d)
        })
        .attr("fill",function(d) { 
            nerString = d.predicts_order.split(":",1)
            return color_.waffle[nerString]})            
            //return color_.waffle[d.predicts_order]})
        .on("mouseover",function(d){ 
            tooltip.style("opacity", 1)
            console.log("tip")
         })
        .on("mousemove", function(d){
            tooltip
            .html(d.predicts_order)
            .style("left", d3.event.pageX+ "px")
            .style("top", (d3.event.pageY)+30 + "px")
            
        })
        .on("mouseleave", function(){
            tooltip.style("opacity", 0)
        })


    characters.selectAll()
        .data(function(d){ return [d]})
        .enter()
        .append("text")
        .text(function (d) {return d.character})
        .style('text-anchor', 'middle')
        .attr('dy', '.35em')
        .style("font-size","17px")
        .attr("id",d => {return "index" + d.index.char})


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
// start returnIndex_ws

//end returnIndex_ws
    click_time=-1 //to back char/collection model
    range_click_time=0
    function changeWS(d,i){
        console.log(d,i,d3.select(this))
        console.log(select_context)
        d3.select(this)
        // .style("stroke-width", 2)
        .style("opacity", 0.8)

        range_mod = range_click_time%2
        switch(range_mod){
            
            case 0:
                console.log(d)
                console.log("case0",d.index.char)
                new_begin = d.index.char
                map_begin = i
                break;
            case 1:
                new_end = d.index.char
                map_end = i
                console.log("case1",d.index.char)
                $.ajax({ 
                    type: "POST", 
                    url: "/changeWS", 
                    data: {"open_tsne":0,"perp":perp,"changeWS":1,"character_begin":new_begin,"character_end":new_end,
                        "map_begin":map_begin,"map_end":map_end,
                        "article":d.index.article,hithere:JSON.stringify(select_context)},
                    success: function(data,textStatus,jqXHR ){ 
                        console.log("success hi there post success")      
                        contentNew = data.content
                        console.log(contentNew)
                        // open_tsne_1(scatter.hidden1)
                        $("#context").empty()
                        $("#tra_context").empty()
                        returnIndex_(indexs,contentNew,select_,pos_truth,contentNew)

                        // draw_heatmap(scatter.hidden1.tsne.all_)
                        
                    } 
                }); 
                break;
        }
        range_click_time+=1
        
    }
}
