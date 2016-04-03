app = angular.module('app');

app.controller("scaterController", ["$scope", '$timeout', function($scope, $timeout){
    var margin = {top: 20, right: 40, bottom: 30, left: 80}
    var width = 1000 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;

    var xValue = function(d) { return d.prostitutions2003;}, // data -> value
    xScale = d3.scale.linear().range([0, width]), // value -> display
    xMap = function(d) {
        return xScale(xValue(d));
    }, // data -> display
    xAxis = d3.svg.axis().scale(xScale).orient("bottom");

    var yValue = function(d) {return d.vehiclethefts2003;}, // data -> value
    yScale = d3.scale.linear().range([height, 0]), // value -> display
    yMap = function(d) {return yScale(yValue(d));}, // data -> display
    yAxis = d3.svg.axis().scale(yScale).orient("left");

    var cValue = function(d) { return d.district;},
    color = d3.scale.category10();

    var radius = function(d) {
        return d.crimes2003 * 30 /maxcrimes;
    };

    var crimes = function(d){
        return d.crimes2003;
    }
    var maxcrimes;

    function show_data(){
        $timeout(function(){
            var circle = $scope.svg.selectAll(".dot");
            circle.data($scope.dataset)
              .attr("r", radius)
              .attr("cx", xMap)
              .attr("cy", yMap)
              .on("mouseover", function(d) {
                $scope.tooltip.transition()
                  .duration(200)
                  .style("opacity", .9);
                $scope.tooltip.html(d.district + "<br/> prostitutions:"
                  + xValue(d) + "<br/> vehicle thefts:" + yValue(d)
                  + "<br/> total crimes:"  + crimes(d))
                .style("left", (d3.event.pageX - 50) + "px")
                .style("top", (d3.event.pageY + 20) + "px");
              })
              .on("mouseout", function(d) {
                $scope.tooltip.transition()
                  .duration(500)
                  .style("opacity", 0);
              })
              .transition()
              .delay(function (d, i) {
                return i * 200;
              })
              .duration(500)
              .style('opacity', 1);
        }, ($scope.dataset.length + 1) * 200);


    }

    $scope.update = function(year){
        if (year === 2003){
            yValue = function(d) {return d.vehiclethefts2003;};
            xValue = function(d) {return d.prostitutions2003;};
            radius = function(d) {return d.crimes2003 * 30 /maxcrimes;};
            crimes = function(d) {return d.crimes2003;};
            maxcrimes = d3.max($scope.dataset, crimes);
            d3.select('#y2003').attr('disabled', true).attr("class","");
            d3.select('#y2015').attr('disabled', null).attr("class","active");

        } else {
            yValue = function(d) {return d.vehiclethefts2015;};
            xValue = function(d) {return d.prostitutions2015;};
            radius = function(d) {return d.crimes2015 * 30 /maxcrimes;};
            crimes = function(d) {return d.crimes2015;};
            maxcrimes = d3.max($scope.dataset, crimes);
            d3.select('#y2015').attr('disabled', true).attr("class","");
            d3.select('#y2003').attr('disabled', null).attr("class","active");
        }

        $scope.svg.selectAll(".dot")
            .data($scope.dataset)
            .transition()
            .delay(function (d, i) {
                return i * 200;
            })
            .duration(500)
            .style('opacity', 0);
        show_data();

    };

    function initialize(file_name) {
        d3.csv(file_name, function (dataset) {
            $scope.dataset = dataset;
            dataset.forEach(function (d) {
                d.crimes2003 = +d.crimes2003;
                d.vehiclethefts2003 = +d.vehiclethefts2003;
                d.prostitutions2003 = +d.prostitutions2003;
                d.crimes2015 = +d.crimes2015;
                d.vehiclethefts2015 = +d.vehiclethefts2015;
                d.prostitutions2015 = +d.prostitutions2015;

            });
            $scope.svg = d3.select("#scater").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            $scope.tooltip = d3.select("#scater").append("div")
              .attr("class", "tooltip")
              .style("opacity", 0);

            var minx = d3.min(dataset, xValue),
                maxx = d3.max(dataset, xValue),
                miny = d3.min(dataset, yValue),
                maxy = d3.max(dataset, yValue);
            xScale.domain([(0-maxx+minx)/25, maxx]);
            yScale.domain([(0-maxy+miny)/25, maxy]);

            maxcrimes = d3.max($scope.dataset, crimes);
            // x-axis
            $scope.svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis)
              .append("text")
              .attr("class", "label")
              .attr("x", width)
              .attr("y", -6)
              .style("text-anchor", "end")
              .text("prostitutions");
            // y-axis
            $scope.svg.append("g")
              .attr("class", "y axis")
              .call(yAxis)
              .append("text")
              .attr("class", "label")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", ".71em")
              .style("text-anchor", "end")
              .text("vehicle thefts");

            $scope.svg.selectAll(".dot")
              .data($scope.dataset)
              .enter().append("circle")
              .attr("class", "dot")
              .attr("r", radius)
              .attr("cx", xMap)
              .attr("cy", yMap)
              .style("fill", function(d) { return color(cValue(d));})
              .on("mouseover", function(d) {
                $scope.tooltip.transition()
                  .duration(200)
                  .style("opacity", 1);
                $scope.tooltip.html(d.district + "<br/> prostitutions:" + xValue(d)
                  + "<br/> vehicle thefts:" + yValue(d) + "")
                  .style("left", (d3.event.pageX - 50) + "px")
                  .style("top", (d3.event.pageY + 20) + "px");
              })
              .on("mouseout", function(d) {
                $scope.tooltip.transition()
                  .duration(500)
                  .style("opacity", 0);
            });

            // draw legend
            var legend = $scope.svg.selectAll(".legend")
              .data(color.domain())
              .enter().append("g")
              .attr("class", "legend")
              .attr("transform", function(d, i) { return "translate(0," + (150 + i * 20) + ")"; });

            // draw legend colored rectangles
            legend.append("rect")
              .attr("x", width - 18)
              .attr("width", 18)
              .attr("height", 18)
              .style("fill", color);

            // draw legend text
            legend.append("text")
              .attr("x", width - 24)
              .attr("y", 9)
              .attr("dy", ".35em")
              .style("text-anchor", "end")
              .text(function(d) { return d;});
        });
    }
    initialize('http://giorgospa.github.io/scater_plot/scater_plot_data.csv');
}]);
