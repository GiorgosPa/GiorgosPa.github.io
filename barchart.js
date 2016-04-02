app = angular.module('app');

app.controller("barchartController", ["$scope", function($scope){
    var svg;
    var w = 1000;
    var h = 500;
    var top_space = 20;
    var bottom_space = 130;
    var left_space = 50;

    function sortElem(elem) {
//                elem
//                    .sort(function (a, b) {
//                        console.log(a.category+","+b.category+"="+d3.ascending(a.category, b.category));
//                        return d3.ascending(a.category, b.category);
//                    });

    };

    function init_hist(rect, xScale, yScale, hScale) {
        rect
                .attr("x", function (d, i) {
                    return xScale(i);
                })
                .attr("y", function (d) {
//                            console.log("d: "+d.count+" scale:"+yScale(d.count));
                    return yScale(d.count);
                })
                .attr("width", xScale.rangeBand())
                .attr("height", function (d) {
                    return hScale(d.count);
                })
                .attr("fill", function (d) {
                    return "rgb(0, 0, " + (d.count * 10) + ")";
                })
                ;
        sortElem(rect);
    }

    function init_text(text_, xScale, yScale, hScale) {

        text_
                .text(function (d) {
                    return d.count;
                })
                .attr("x", function (d, i) {
                    return xScale(i);
                })
                .attr("y", function (d) {
                    return yScale(d.count) - 2;
                })
                .attr("font-family", "sans-serif")
                .attr("font-size", "12px")
                .attr("fill", "black");
        sortElem(text_);
    }

    function init_label(label, xScale, yScale, hScale) {

        label
                .text(function (d) {
                    return d.category;
                })
                .style("text-anchor", "end")
                .attr("dx", "-2px")
                .attr("dy", "5px")
                .attr("transform", function (d, i) {
                    return "translate(" + (xScale(i) + xScale.rangeBand() / 2) + "," + (yScale(0)) + ") rotate(-50)"
                })
                .attr("font-family", "sans-serif")
                .attr("font-size", "10px")
                .attr("fill", "black");
        sortElem(label);
    }

    function init_xScale(dataset) {
        //Create scale functions
        var xScale = d3.scale.ordinal()
                .domain(d3.range(dataset.length))
                .rangeRoundBands([left_space, w], 0.05);
        return xScale;
    }
    ;
    function init_yScale(dataset) {
        var yScale = d3.scale.linear()
                .domain([d3.max(dataset, function (d) {
                        return d.count;
                    }), 0])
                .range([top_space, h - bottom_space]);
        return yScale;
    }

    function init_hScale(dataset) {
        var hScale = d3.scale.linear()
                .domain([0, d3.max(dataset, function (d) {
                        return d.count;
                    })])
                .range([0, h - top_space - bottom_space]);
        return hScale;
    }

    function load_hist(file_name) {
        d3.csv(file_name, function (dataset) {
//                    DATA_ = dataset;
            dataset.forEach(function (d) {
                d.count = +d.count;
            });
            //Create SVG element
            svg = d3.select("#hist")
                    .append("svg")
                    .attr("width", w)
                    .attr("height", h)
                    .attr("id", "hist_svg");
            var xScale = init_xScale(dataset);
            var yScale = init_yScale(dataset);
            var hScale = init_hScale(dataset);

            var rect = svg.selectAll("rect")
                    .data(dataset)
                    .enter()
                    .append("rect");
            init_hist(rect, xScale, yScale, hScale);
            rect
                    .on("mouseover", function () {
                        d3.select(this)
                                .attr("fill", "orange");
                    })
                    .on("mouseout", function (d) {
                        d3.select(this)
                                .transition()
                                .duration(250)
                                .attr("fill", "rgb(0, 0, " + (d.count * 10) + ")")
                    });

            var text_ = svg.selectAll(".value")
                    .data(dataset)
                    .enter()
                    .append("text")
                    .attr("class", "value");
            init_text(text_, xScale, yScale, hScale);


            var label = svg.selectAll(".label")
                    .data(dataset)
                    .enter()
                    .append("text")
                    .attr("class", "label");
            init_label(label, xScale, yScale, hScale);
        });
    }

    function upd_hist(file_name) {
        d3.csv(file_name, function (dataset) {
            dataset.forEach(function (d) {
                d.count = +d.count;
            });
            var xScale = init_xScale(dataset);
            var yScale = init_yScale(dataset);
            var hScale = init_hScale(dataset);
            //Update all rects
            var rect = svg.selectAll("rect")
                    .data(dataset)
                    .transition()
                    .delay(function (d, i) {
                        return i / dataset.length * 1000;
                    })
                    .duration(500);
            init_hist(rect, xScale, yScale, hScale);

            //Update all labels
            var text_ = svg.selectAll(".value")
                    .data(dataset)
                    .transition()
                    .delay(function (d, i) {
                        return i / dataset.length * 1000;
                    })
                    .duration(500);
            init_text(text_, xScale, yScale, hScale);

            var label = svg.selectAll(".label")
                    .data(dataset)
                    .transition()
                    .delay(function (d, i) {
                        return i / dataset.length * 1000;
                    })
                    .duration(500);
            init_label(label, xScale, yScale, hScale);
        });
    }
    //Width and height
    var filename = "barchart/output0.csv";
    load_hist(filename);
    d3.select("button")
            .on("click", function () {
                if (filename === "barchart/output0.csv") {
                    filename = "barchart/output1.csv";
                } else {
                    filename = "barchart/output0.csv";
                }
                upd_hist(filename);
            });
}]);
