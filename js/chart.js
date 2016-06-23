sunChart = {

  drawChart: function(){

    vis = d3.select("#vis");

    canvas = vis.append("svg")
            .attr("width",800)
            .attr("height",900)
            ;
  }
}
