function draw_tsne(neighborhood,axis_,select_,chatJson){

    var margin = {top: 20, right: 20, bottom: 20, left: 10},
        width = 450 - margin.left - margin.right,
        height = 350 - margin.top - margin.bottom;

    // for pie chart
    var arc = d3.arc()
    .innerRadius(0)
    .outerRadius(7);

    var pie = d3.pie()
    .sort(null)
    .value(function(d) { return d; })

    var label_ = function(char){
        pie_ = pie(char.predicts)
        pie_['index_'] = char.index
        pie_['entropy'] = char.entropy
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
        .domain([axis_x[1], axis_x[0]]) //min.max
        // .domain([-80, 80])

    var yScale = d3.scaleLinear()
        .range([height, 0])
        .domain([axis_y[1], axis_y[0]+1])
        // .domain([-80, 80])

    var overview_scatterplot = d3.select(select_)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("class","scatterplot")
        .style("text-align","center")

    var pie_charts = overview_scatterplot.append("g") // pie charts
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    neighborhood .forEach(function(d,i){
        d['x'] = +(d.x)
        d['y'] = +(d.y)
        d['scaleX'] = xScale(d.x)
        d['scaleY'] = yScale(d.y)

        })

    var circles = pie_charts.selectAll(null)
        .data(neighborhood)
        .enter()
        .append("g")
        .property("radius", function (d) {
            return d.radius;
        })
        .attr("transform", function (d) {
            return "translate(" + d.scaleX + "," + d.scaleY + ")";
        })
        .attr("class","pies")
        .attr("stroke", d => { return colorScale(d.entropy)})  
        .attr("class",d => { return "nearest"+d.nearest +" "+ "dot_index" + d.index.char +" "+ "pies" + " from" + d.from})
        .attr("stroke-width", d => { return (d.entropy < 0.2 ? 0 : 0.5)})
        .attr("id",d => { return "c_index" + d.index.char })
        .style("opacity", default_opacity)

        // .on("mouseover",function(d){ console.log(d.index)})
    // var pies = circles.selectAll(".pies")
    circles.selectAll()
        .data(function(d) { return label_(d); })
        .enter()
        .append("path")
        .attr('d', function (d) {
            // arc.outerRadius(d.radius);
            return arc(d)
        })
        // .style("opacity", 0.8)
        .attr("fill",function(d) { 
            nerString = d.predicts_order.split(":",1)
            return color_.waffle[nerString]})            
            //return color_.waffle[d.predicts_order]})
            // .on("mouseleave", mouseleave )

    var simulation = d3.forceSimulation()
        .force("collision", d3.forceCollide(5.5)) // Repulsion force
        .force("x_force", d3.forceX(d => d.scaleX)) // Each point attacted to its center x and y
        .force("y_force", d3.forceY(d => d.scaleY))

    simulation
        .nodes(neighborhood)
        .on("tick", function(d){
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
        
        // lasso.notSelectedItems()
        //     .style("opacity", default_opacity)

        d3.selectAll(".pies")
            .style("opacity", default_opacity)
            .style("filter","drop-shadow(0px 0px 0px white)")
            
        groups = selects._groups[0]
        groups_index=""
        groups_index_C=""
        groups_number = []
        selectedNearest = []
        selectedIndex = []
        
        groups.forEach(function(d){
            nearestOrder = parseInt(d.classList[0].slice(7,))
            nearestIndex = d.id.slice(2,)
            nearestIndex_ = parseInt(d.id.slice(7,))


            selectedNearest.push(nearestOrder)
            selectedIndex.push(nearestIndex_)

            groups_index = groups_index.concat("#"+nearestIndex+",")
            groups_index_C = groups_index_C.concat("#c_"+nearestIndex+",")
            groups_number.push(parseInt(d.id.slice(7, )))

        });     
        groups_index= groups_index.slice(0, -1)
        groups_index_C= groups_index_C.slice(0, -1)

        if (!(selectedIndex.includes(selectedCharacter))){
            selectedNearest.push(0)
            selectedIndex.push(selectedCharacter)
        }

        console.log("selectedNearest",selectedNearest)
        console.log("selectedIndex",selectedIndex)

        let orderSet = {}
        selectedIndex.forEach((key, i) => orderSet[key] = selectedNearest[i]);

        function compareNumbers(a, b) {
            return a - b;
        }
        function getKeyByValue(object, value) {
            return Object.keys(object).find(key => object[key] === value);
        }

        selectedIndexSort = selectedIndex.sort(compareNumbers)

        selectedAvoidOverlap=[]
        selectedNumber = selectedIndex.length-1
        for (let i = 0; i < selectedNumber; i++){
            if (!((selectedIndexSort[i]+1 == selectedIndexSort[i+1])||(selectedIndexSort[i]-1 == selectedIndexSort[i+1]))){
                selectedAvoidOverlap.push(selectedIndexSort[i])
            }
        }
        selectedAvoidOverlap.push(selectedIndexSort[selectedNumber])

        reOrder = []
        selectedAvoidOverlap.forEach(function(d){
            order = orderSet[d]
            reOrder.push(order)
        })
        reOrder = reOrder.sort(compareNumbers)

        selectedOrder =[]
        context = []
        reOrder.forEach(function(d){
            key = getKeyByValue(orderSet,d)
            key = parseInt(key)
            context = context.concat(chatJson.slice(key-5,key+6))
            selectedOrder.push(key)
        })

        neighborhoodChar=""
        selectedIndex.forEach(function(d){
            neighborhoodChar = neighborhoodChar.concat("#index"+d+",")
        });
        neighborhoodChar = neighborhoodChar.slice(0,-1)


        posSet = new Set();
        nerSet = new Set();
        // console.log(context_)
        context.forEach(d => {
            nerSet.add(d.ner)
            posTag = d.pos
            if (punctuationSet.has(posTag)){
                return posSet.add("Z")
            }
            else if(twoCharSet.has(posTag.slice(0,2))){
                return posSet.add(posTag.slice(0,2))
            }
            else{
                return posSet.add(posTag.slice(0,1))
            }
        });
    
        posSet= [...posSet]
        nerSet= [...nerSet]
    
        posSet.sort(function (a, b) {
            return a.localeCompare(b);
          });



        draw_legend(posSet,"#posLegend","legendsPOS")
        draw_legend(nerSet,"#nerLegend","legendsAll")
        returnIndex_(neighborhoodChar,groups_index,context,"#context",1)

        // groups_index_C= groups_index_C.slice(0, -1)

        // console.log(groups_index,groups_index_C)
        // d3.select("#heatMap").selectAll(groups_index)
        // .style("opacity", 0.8)    
        // .style('box-shadow', "3px 3px 12px black")

        d3.selectAll(groups_index_C)
            .style('opacity', 0.8)
            .style("filter","drop-shadow(1px 1px 3px black)")

        d3.select("#c_index"+selectedCharacter)
            .style('opacity', 0.8)
            .style("filter","drop-shadow(1px 1px 3px red)")
        // console.log(groups_number,groups_index)

        // selectedNeighborhood = []
                

        // get_group(context,groups_number,groups_index,chatJson,"#context")


    };
    
    var lasso = d3.lasso()
        .closePathSelect(true)
        .closePathDistance(100)
        .items(circles)
        .targetArea(overview_scatterplot)
        .on("start",lasso_start)
        .on("draw",lasso_draw)
        .on("end",lasso_end);
    
    d3.selectAll("#c_index"+selectedCharacter)
        .style("opacity", 1)
        .style("filter","drop-shadow(1px 1px 4px red)")
        .attr("stroke-width",1)
    overview_scatterplot.call(lasso);


}

function theSame(d){
    d3.selectAll(".from0")
        .style("opacity",0.8)

    d3.selectAll(".from1")
        .style("opacity",0.2)
}
function theNearest(d){
    d3.selectAll(".from0")
        .style("opacity",0.2)

    d3.selectAll(".from1")
        .style("opacity",0.8)
}