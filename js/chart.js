var sunChart = {

  drawChart: function(){

    var maxDayLength = 60 * 24 - 1;

    var svgWidth = 800,
        svgHeight = 900;

    var scaleBoxWidth = d3.scale.linear()
                            .domain([0, maxDayLength])
                            .range([0, svgWidth])
                            ;

    var vis = d3.select("#vis");

    var canvas = vis.append("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight)
            ;

    d3.json("test/data.json", function(error,dataset){

      console.log(dataset);

      var dataRect = canvas.selectAll("rects")
                      .data(dataset)
                      .enter()
                      ;

      var heightDay = 10;

      dataRect.append("rect")
        .attr("x", function(d){return scaleBoxWidth(d.rise);})
        .attr("y", function(d,i){return i*heightDay;})
        .attr("height", heightDay)
        .attr("width", function(d){return scaleBoxWidth(d.set)})
        .style("fill","red")
        .style("stroke", "black")
        ;
    });

  }
};
