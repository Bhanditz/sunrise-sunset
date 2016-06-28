var sunChart = {

    drawChart: function() {

        //Dimensions of the main svg
        var widthSvg = "100%",
            heightSvg = 900;

        //Height of each rectangle
        var heightDay = 2;
        var bufferDay = 0.5;

        //Scaling section
        var maxDayLength = 60 * 24 - 1;
        var scaleBoxWidth = d3.scale.linear()
            .domain([0, maxDayLength])
            .range([0, widthSvg]);

        var vis = d3.select("#vis");

        var canvas = vis.append("svg")
            .attr("width", widthSvg)
            .attr("height", heightSvg);

  /*      canvas.append("rect")
            .attr({
                x: 0,
                y: 0,
                width: widthSvg,
                height: heightSvg,
                id: "rect-background"
            });
*/
        //Make the chart
        d3.json("data/data.json", function(error, dataset) {

            var dataRect = canvas.selectAll("rects")
                .data(dataset)
                .enter()
                .append('g')
                .classed("holder-rect", true);

            dataRect.append("rect")
                .attr("y", function(d, i){return i * (heightDay + bufferDay);})
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
                    return i * (heightDay + bufferDay);
                })
                .attr("height", heightDay)
                .attr("width", function(d) {
                    return scaleBoxWidth(d.set - d.rise);
                })
                .classed("rectDay", true);
        });

    }
};
