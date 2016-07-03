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

    drawChart: function(path, dim) {

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

        var eachDay = d3.range(365);

        canvas.selectAll("rects")
            .data(eachDay)
            .enter()
            .append("rect")
            .attr("y", function(d) {
                return dim.heightBuffer + d * (dim.heightDay + dim.bufferDay);
            })
            .attr({
                x: 0,
                width: dim.widthSvg,
                height: dim.heightDay,
                class: "rect-background"
            });


        //Make the chart
        sunChart.update(path, dim);
    },

    update: function(path, dim) {
        d3.json(path, function(error, dataset) {

            var canvas = d3.select("#vis-svg");

            canvas.selectAll(".holder-rect").remove();
            canvas.selectAll(".axis-text").remove();
            canvas.selectAll(".axis-lines").remove();

            var dataRect = canvas.selectAll("rects")
                .data(dataset)
                .enter()
                .append('g')
                .classed("holder-rect", true);

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
            var avgRise = Math.floor(d3.mean(dataset, function(d) {
                return d.rise;
            }));
            var avgSet = Math.floor(d3.mean(dataset, function(d) {
                return d.set;
            }));
            var avgMid = Math.floor(d3.mean(dataset, function(d) {
                return (d.rise + d.set) / 2;
            }));

            function avgText(num) {
                var hour = Math.floor(num / 60);

                // Determines if the number is one/two digits long
                var mLen = function(num) {
                    return num.toString().length;
                };

                var min = (mLen(num % 60) === 2 ? num % 60 : "0" + num % 60);
                var time = (hour % 12 === 0 ? 12 : hour % 12) + ":" + min;
                return time + (hour < 12 ? " am" : " pm");
            }


            var tickTimes = [{
                time: avgRise,
                text: avgText(avgRise)
            }, {
                time: avgMid,
                text: avgText(avgMid)
            }, {
                time: avgSet,
                text: avgText(avgSet)
            }];

            //  console.log(tickTimes);

            var axes = canvas.selectAll("axes")
                .data(tickTimes)
                .enter();

            axes.append("line")
                .attr("x1", function(d) {
                    return dim.scaleBoxWidth(d.time);
                })
                .attr("y1", dim.heightBuffer)
                .attr("x2", function(d) {
                    return dim.scaleBoxWidth(d.time);
                })
                .attr("y2", dim.heightSvg)
                .classed("axis-lines", true);

            axes.append("text")
                .text(function(d) {
                    return d.text;
                })
                .attr("x", function(d) {
                    return dim.scaleBoxWidth(d.time);
                })
                .attr("y", dim.heightBuffer - 20)
                .attr("text-anchor", "middle")
                .classed("axis-text", true);
        });
    },

    drop: function() {
        d3.json("data/cities/ALL.json", function(error, dataset) {
            var menu = d3.select("#state-input");

            var options = menu.selectAll("options")
                .data(dataset)
                .enter();

            options.append("option")
                .text(function(d) {
                    return d.city + ", " + d.state;
                });
        });

    },

    change: function() {
        var input = document.getElementById("state-input").value;
        var splt = input.split(", ");

        var path = "data/cities/" + splt[0] + splt[1] + ".json";
        console.log(path);
        sunChart.update(path, sunChart.dim);
    }

};