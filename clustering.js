app = angular.module('app');

app.controller("clusteringController", ["$scope", function($scope){
    var margin = {top: 20, right: 40, bottom: 30, left: 80}
    var width = 1000 - margin.left - margin.right;
    var height = 600 - margin.top - margin.bottom;
    var geojson = 'https://raw.githubusercontent.com/suneman/socialdataanalysis2016/master/files/sfpddistricts.geojson';

    d3.select("#map").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



    var projection = d3.geo.albersUsa()
                       .translate([101450, 9950])
                       .scale([290000]);

    var path = d3.geo.path()
                 .projection(projection);

    d3.json(geojson, function(json) {
        features = json.features;
        features.forEach(function(d){
            d3.selectAll('#map svg')
           .append("path")
           .attr("d", path(d));
        });

    var colors = ["red", "blue", "yellow", "green", "pink", "orange"]

    function addPoints(k){
        d3.csv('clustering/k'+k+'.csv', function(points){
            $scope.points = points;
            points.forEach(function(d){
                d.Longitude = +d.Longitude;
                d.Latitude = +d.Latitude;
                d.ClusterNumber = +d.ClusterNumber;
                d3.selectAll('#map svg')
                   .append("circle")
                   .attr("cx", projection([d.Longitude, d.Latitude])[0])
                   .attr("cy", projection([d.Longitude, d.Latitude])[1])
                   .attr("r", 3)
                   .style("fill", colors[d.ClusterNumber])
                   .style("opacity", .6);
            });

            d3.csv('clustering/centers'+k+'.csv', function(centroids){
                console.log(centroids);
                $scope.centroids = centroids;
                centroids.forEach(function(d, i){
                  console.log(d)
                  console.log(i)
                  d.Longitude = +d.Longitude;
                  d.Latitude = +d.Latitude;
                  d3.selectAll('#map svg')
                   .append("circle")
                   .attr("cx", projection([d.Longitude, d.Latitude])[0])
                   .attr("cy", projection([d.Longitude, d.Latitude])[1])
                   .attr("r", 10)
                   .style("fill", colors[i])
                   .style("stroke", "black");
                })

            });
        });
    }

    $scope.updateClusters = function(k){
        d3.selectAll('#map svg circle').style('display', 'None');
        addPoints(k);
        if (k===2){
            d3.select('#k2').attr('disabled', true).attr("class","");
            d3.select('#k3').attr('disabled', null).attr("class","active");
            d3.select('#k4').attr('disabled', null).attr("class","active");
            d3.select('#k5').attr('disabled', null).attr("class","active");
            d3.select('#k6').attr('disabled', null).attr("class","active");
        } else if(k==3){
            d3.select('#k3').attr('disabled', true).attr("class","");
            d3.select('#k2').attr('disabled', null).attr("class","active");
            d3.select('#k4').attr('disabled', null).attr("class","active");
            d3.select('#k5').attr('disabled', null).attr("class","active");
            d3.select('#k6').attr('disabled', null).attr("class","active");
        } else if(k==4){
            d3.select('#k4').attr('disabled', true).attr("class","");
            d3.select('#k3').attr('disabled', null).attr("class","active");
            d3.select('#k2').attr('disabled', null).attr("class","active");
            d3.select('#k5').attr('disabled', null).attr("class","active");
            d3.select('#k6').attr('disabled', null).attr("class","active");
        } else if(k==5){
            d3.select('#k5').attr('disabled', true).attr("class","");
            d3.select('#k3').attr('disabled', null).attr("class","active");
            d3.select('#k4').attr('disabled', null).attr("class","active");
            d3.select('#k2').attr('disabled', null).attr("class","active");
            d3.select('#k6').attr('disabled', null).attr("class","active");
        } else if(k==6){
            d3.select('#k6').attr('disabled', true).attr("class","");
            d3.select('#k3').attr('disabled', null).attr("class","active");
            d3.select('#k4').attr('disabled', null).attr("class","active");
            d3.select('#k5').attr('disabled', null).attr("class","active");
            d3.select('#k2').attr('disabled', null).attr("class","active");
        }

    }

    addPoints(2);

    });
}]);