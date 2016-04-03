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

    setTimeout(function() {
        d3.csv('clustering/allclusters.csv', function(data){
            data.forEach(function(d){
                d.Longitude = +d.Longitude;
                d.Latitude = +d.Latitude;
                d.cluster2 = +d.cluster2;
                d.cluster3 = +d.cluster3;
                d.cluster4 = +d.cluster4;
                d.cluster5 = +d.cluster5;
                d.cluster6 = +d.cluster6;
                d3.selectAll('#map svg')
                   .append("circle")
                   .attr("cx", projection([d.Longitude, d.Latitude])[0])
                   .attr("cy", projection([d.Longitude, d.Latitude])[1])
                   .attr("r", 3)
                   .attr('k2', d.cluster2)
                   .attr('k3', d.cluster3)
                   .attr('k4', d.cluster4)
                   .attr('k5', d.cluster5)
                   .attr('k6', d.cluster6)
                   .attr("class", "kmeans")
                   .style("fill", colors[d.cluster6])
                   .style("opacity", .6);
            });
            addPoints(2);
        });
    }, 100);

    var colors = ["red", "blue", "yellow", "green", "magenta", "orange"]

    function addPoints(k){
        d3.selectAll('.center').style('display', 'none');
        if (k===2){
            d3.selectAll('.kmeans')[0].forEach(function(d){
                d.style.fill = colors[parseInt(d.attributes['k2'].nodeValue)];
            });
            d3.csv('clustering/centers2.csv', function(centroids){
                centroids.forEach(function(d, i){
                  d.Longitude = +d.Longitude;
                  d.Latitude = +d.Latitude;
                  d3.selectAll('#map svg')
                   .append("circle")
                   .attr("cx", projection([d.Longitude, d.Latitude])[0])
                   .attr("cy", projection([d.Longitude, d.Latitude])[1])
                   .attr("r", 10)
                   .attr("class", "center")
                   .style("fill", colors[i])
                   .style("stroke", "black");
                });
            });
        } else if(k==3){
            d3.selectAll('.kmeans')[0].forEach(function(d){
                d.style.fill = colors[parseInt(d.attributes['k3'].nodeValue)];
            });
            d3.csv('clustering/centers3.csv', function(centroids){
                centroids.forEach(function(d, i){
                  d.Longitude = +d.Longitude;
                  d.Latitude = +d.Latitude;
                  d3.selectAll('#map svg')
                   .append("circle")
                   .attr("cx", projection([d.Longitude, d.Latitude])[0])
                   .attr("cy", projection([d.Longitude, d.Latitude])[1])
                   .attr("r", 10)
                   .attr("class", "center")
                   .style("fill", colors[i])
                   .style("stroke", "black");
                });
            });
        } else if(k==4){
            d3.selectAll('.kmeans')[0].forEach(function(d){
                d.style.fill = colors[parseInt(d.attributes['k4'].nodeValue)];
            });
            d3.csv('clustering/centers4.csv', function(centroids){
                centroids.forEach(function(d, i){
                  d.Longitude = +d.Longitude;
                  d.Latitude = +d.Latitude;
                  d3.selectAll('#map svg')
                   .append("circle")
                   .attr("cx", projection([d.Longitude, d.Latitude])[0])
                   .attr("cy", projection([d.Longitude, d.Latitude])[1])
                   .attr("r", 10)
                   .attr("class", "center")
                   .style("fill", colors[i])
                   .style("stroke", "black");
                });
            });
        } else if(k==5){
            d3.selectAll('.kmeans')[0].forEach(function(d){
                d.style.fill = colors[parseInt(d.attributes['k5'].nodeValue)];
            });
            d3.csv('clustering/centers5.csv', function(centroids){
                centroids.forEach(function(d, i){
                  d.Longitude = +d.Longitude;
                  d.Latitude = +d.Latitude;
                  d3.selectAll('#map svg')
                   .append("circle")
                   .attr("cx", projection([d.Longitude, d.Latitude])[0])
                   .attr("cy", projection([d.Longitude, d.Latitude])[1])
                   .attr("r", 10)
                   .attr("class", "center")
                   .style("fill", colors[i])
                   .style("stroke", "black");
                });
            });
        } else if(k==6){
            d3.selectAll('.kmeans')[0].forEach(function(d){
                d.style.fill = colors[parseInt(d.attributes['k6'].nodeValue)];
            });
            d3.csv('clustering/centers6.csv', function(centroids){
                centroids.forEach(function(d, i){
                  d.Longitude = +d.Longitude;
                  d.Latitude = +d.Latitude;
                  d3.selectAll('#map svg')
                   .append("circle")
                   .attr("cx", projection([d.Longitude, d.Latitude])[0])
                   .attr("cy", projection([d.Longitude, d.Latitude])[1])
                   .attr("r", 10)
                   .attr("class", "center")
                   .style("fill", colors[i])
                   .style("stroke", "black");
                });
            });
        }
    }

    $scope.k = 2;

    $scope.preview = function(k){
        setTimeout(function() {
            addPoints(k);
        }, 200);

    }

    $scope.restore = function(){
        addPoints($scope.k);
    }

    $scope.updateClusters = function(k){
        $scope.k = k;
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


    });
}]);