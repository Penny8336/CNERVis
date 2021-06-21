function draw_legend(legend_set,legendID,classes){
    console.log(legend_set)
    colorScale 
    .domain([0,0.2, 0.5, 0.7, 1, 1.2, 1.5])
    .range(d3.schemeOrRd[8]);

    let legend_l = d3.select(legendID)

    $(legendID).empty()

    d3.selectAll(legendID)
    .style("padding-bottom","13px")
    .style("padding-left","10px")

    legend_l    
    .selectAll(legendID)
    .data(legend_set)
    .enter()
    .append('div')
    .text( d => {return d.substr(0, 4)})
    .attr('class', classes)
    .style('background-color',function (d){
        if (legendID == "#posLegend"){
            posTag = d
            return color_.pos[d]
        }
        else{
            return color_.waffle[d]
        }
    })
    .style("color", "white")

}

function draw_color_legend(legend_set,legendID,classes){

    colorScale 
    .domain([0,0.2, 0.5, 0.7, 1, 1.2, 1.5])
    .range(d3.schemeOrRd[8]);
    
    let legend_l = d3.select(legendID)

    $(legendID).empty()

    d3.selectAll(legendID)
    .style("padding-bottom","13px")
    .style("padding-left","10px")

    legend_l    
    .selectAll(legendID)
    .data(legend_set)
    .enter()
    .append('div')
    .attr('class', classes)
    .style('background-color',
    
    function (d){return colorScale(d)})
    .style("color", "white")
}