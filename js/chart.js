var sunChart = {

  dim: {
      //Dimensions of the main svg
      widthSvg: "100%",
      heightVis: 900,

      // Buffer room for the text for the ticks
      heightBuffer: 70,

      //heightSvg: dim.heightVis + dim.heightBuffer,

      //Height of each rectangle
      heightDay: 2,
      bufferDay: 0.5,

      //Scaling section
      maxDayLength: 60 * 24 - 1
  },

    drawChart: function(dim) {

      /*  var dim = {
            //Dimensions of the main svg
            widthSvg: "100%",
            heightVis: 900,

            // Buffer room for the text for the ticks
            heightBuffer: 70,

            //heightSvg: dim.heightVis + dim.heightBuffer,

            //Height of each rectangle
            heightDay: 2,
            bufferDay: 0.5,

            //Scaling section
            maxDayLength: 60 * 24 - 1
        };
        */
        dim.heightSvg = dim.heightVis + dim.heightBuffer;
        dim.scaleBoxWidth = d3.scale.linear()
            .domain([0, dim.maxDayLength])
            .range([0, dim.widthSvg]);

        // Select #vis and append an svg
        var vis = d3.select("#vis");

        var canvas = vis.append("svg")
            .attr("width", dim.widthSvg)
            .attr("height", dim.heightSvg)
            .attr("id", "vis-svg");


        //Make the chart
        sunChart.update(dim);
    },

    update: function(dim) {
        d3.json("data/data.json", function(error, dataset) {

            var leftLine = d3.svg.line()
                .x(function(d) {
                    return dim.scaleBoxWidth(d.rise);
                })
                .y(function(d, i) {
                    return dim.heightBuffer + i * (dim.heightDay + dim.bufferDay);
                });

            var canvas = d3.select("#vis-svg");

            var dataRect = canvas.selectAll("rects")
                .data(dataset)
                .enter()
                .append('g')
                .classed("holder-rect", true);

            dataRect.append("rect")
                .attr("y", function(d, i) {
                    return dim.heightBuffer + i * (dim.heightDay + dim.bufferDay);
                })
                .attr({
                    x: 0,
                    width: dim.widthSvg,
                    height: dim.heightDay,
                    class: "rect-background"
                });

            dataRect.append("rect")
                .attr("x", function(d) {
                    return dim.scaleBoxWidth(d.rise);
                })
                .attr("y", function(d, i) {
                    return dim.heightBuffer + i * (dim.heightDay + dim.bufferDay);
                })
                .attr("height", dim.heightDay)
                .attr("width", function(d) {
                    return dim.scaleBoxWidth(d.set - d.rise);
                })
                .classed("rect-day", true);


            // Axis times in military time
            var tickTimes = [{
                time: 6,
                text: "6 am"
            }, {
                time: 12,
                text: "Noon"
            }, {
                time: 18,
                text: "6 pm"
            }];

            var axes = canvas.selectAll("axes")
                .data(tickTimes)
                .enter();

            axes.append("line")
                .attr("x1", function(d) {
                    return dim.scaleBoxWidth(d.time * 60);
                })
                .attr("y1", dim.heightBuffer)
                .attr("x2", function(d) {
                    return dim.scaleBoxWidth(d.time * 60);
                })
                .attr("y2", dim.heightSvg)
                .classed("axis-lines", true);

            axes.append("text")
                .text(function(d) {
                    return d.text;
                })
                .attr("x", function(d) {
                    return dim.scaleBoxWidth(d.time * 60);
                })
                .attr("y", dim.heightBuffer - 20)
                .attr("text-anchor", "middle")
                .classed("axis-text", true);
        });

    }

};
