function draw_tsne(scatter,axis_,select_,chatJson, select_char){

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
        // .call(d3.zoom().on("zoom", function () {
        //     overview_scatterplot.attr("transform", d3.event.transform)
        //  }))

    var pie_charts = overview_scatterplot.append("g") // pie charts
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    
    // var xAxis = pie_charts.append("g")
    //     .attr("transform", "translate(0," + height + ")")
    //     .call(d3.axisBottom(xScale));

    // var yAxis = pie_charts.append("g")
    //     .call(d3.axisLeft(yScale));

    scatter.forEach(function(d,i){
        // var pies = pie(d3.entries(d.predicts))
        d['x'] = +(d.x)
        d['y'] = +(d.y)
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
                // if (!(d.kurtosis)) return "red"
                // return "black"
            // console.log(d.entropy)
            return colorScale(d.entropy)
        })  
        .attr("class",d => { return "dot_index" + d.index +" "+ "pies" + " from" + d.from})
        .attr("stroke-width", function(d) {
            // console.log(d.entropy < 0.01)
            if (d.entropy == 0 ) {
                return "0px"
            }
            // else if (d.predicts.lastIndexOf(0)>0){
            //     return "0px"
            // }
            else{
                return "0.5px"
            }
            // console.log(d.entropy)
            
        })  
        .attr("id",d => { return "c_index" + d.index })
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
        .force("collision", d3.forceCollide(d => d.radius*1.1)) // Repulsion force
        .force("x_force", d3.forceX(d => d.scaleX)) // Each point attacted to its center x and y
        .force("y_force", d3.forceY(d => d.scaleY))

    simulation
        .nodes(scatter)
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
        groups_number=[]
        groups.forEach(function(d){
            groups_index = groups_index.concat("#"+d.id.slice(2,)+",")
            groups_index_C = groups_index_C.concat("#c_"+d.id.slice(2,)+",")
            groups_number.push(parseInt(d.id.slice(7, )))
        });

        groups_index= groups_index.slice(0, -1)

        // d3.selectAll(".pies")
        // .style("opacity", default_opacity)
        groups_index_C= groups_index_C.slice(0, -1)

        console.log(groups_index,groups_index_C)
        d3.select("#heatMap").selectAll(groups_index)
        .style("opacity", 0.8)    
        .style('box-shadow', "3px 3px 12px black")

        d3.selectAll(groups_index_C)
        .style('opacity', 0.8)
        .style("filter","drop-shadow(1px 1px 3px black)")

        get_group(groups_number,groups_index,chatJson,"#context",select_char)


    };
    
    var lasso = d3.lasso()
        .closePathSelect(true)
        .closePathDistance(100)
        .items(circles)
        .targetArea(overview_scatterplot)
        .on("start",lasso_start)
        .on("draw",lasso_draw)
        .on("end",lasso_end);
    
    d3.selectAll("#c_index"+select_char)
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