var sunChart = {

    drawChart: function() {

        //Dimensions of the main svg
        var widthSvg = "100%",
            heightVis = 900;

            // Buffer room for the text for the ticks
            var heightBuffer = 70;

        var heightSvg = heightVis + heightBuffer;

        //Height of each rectangle
        var heightDay = 2;
        var bufferDay = 0.5;

        //Scaling section
        var maxDayLength = 60 * 24 - 1;
        var scaleBoxWidth = d3.scale.linear()
            .domain([0, maxDayLength])
            .range([0, widthSvg]);

        // Select #vis and append an svg
        var vis = d3.select("#vis");

        var canvas = vis.append("svg")
            .attr("width", widthSvg)
            .attr("height", heightSvg);

        //Make the chart
        d3.json("data/data.json", function(error, dataset) {

          var leftLine = d3.svg.line()
                            .x(function(d){return scaleBoxWidth(d.rise);})
                            .y(function(d, i){return heightBuffer + i * (heightDay + bufferDay);})
                            ;

            var dataRect = canvas.selectAll("rects")
                .data(dataset)
                .enter()
                .append('g')
                .classed("holder-rect", true);

            dataRect.append("rect")
                .attr("y", function(d, i){return heightBuffer + i * (heightDay + bufferDay);})
                .attr({
                    x: 0,
                    width: widthSvg,
                    height: heightDay,
                    class: "rect-background"
                });

            dataRect.append("rect")
                .attr("x", function(d) {
                    return scaleBoxWidth(d.rise);
                })
                .attr("y", function(d, i) {
                    return heightBuffer + i * (heightDay + bufferDay);
                })
                .attr("height", heightDay)
                .attr("width", function(d) {
                    return scaleBoxWidth(d.set - d.rise);
                })
                .classed("rect-day", true);


      // Axis times in military time
      var tickTimes = [
        {time: 6, text: "6 am"},
        {time: 12, text: "Noon"},
        {time: 18, text: "6 pm"}
    ];

      var axes = canvas.selectAll("axes")
        .data(tickTimes)
        .enter()
        ;

      axes.append("line")
        .attr("x1", function(d){return scaleBoxWidth(d.time * 60);})
        .attr("y1", heightBuffer)
        .attr("x2", function(d){return scaleBoxWidth(d.time * 60);})
        .attr("y2", heightSvg)
        .classed("axis-lines", true)
        ;

      axes.append("text")
        .text(function(d){return d.text;})
        .attr("x", function(d){return scaleBoxWidth(d.time * 60);})
        .attr("y", heightBuffer - 20)
        .attr("text-anchor", "middle")
        .classed("axis-text", true)
        ;
  });

    }

};
