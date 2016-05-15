
(function(){

  var coordCenter = [-73.98, 40.74]
function loader(){
  d3.selectAll('#map svg')
   .append("foreignObject")
     .attr("width", 100)
     .attr("height", 100)
   .attr("id","loader")
   .attr("transform", "translate("+knn_projection(coordCenter)[0]+","+knn_projection(coordCenter)[1]+")")
     .append("xhtml:div")
     .style("color", "aliceblue")
     .html('Loading data...');
}

function removeLoader(){
  d3.selectAll('#map svg').selectAll("#loader").remove();
};

var knn_projection = d3.geo.mercator()
           .center(coordCenter)
           .scale([60000])
           ;
    var margin = {top: 20, right: 40, bottom: 30, left: 80}
    var width = 1000 - margin.left - margin.right;
    var height = 600 - margin.top - margin.bottom;
    var geojson = 'https://raw.githubusercontent.com/dwillis/nyc-maps/master/boroughs.geojson';


    d3.select("#map").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var path = d3.geo.path()
                 .projection(knn_projection);
    d3.json(geojson, function(json) {
        features = json.features;
        features.forEach(function(d){
            d3.selectAll('#map svg')
           .append("path")
           .attr("d", path(d))
		   .style("fill", knn_backgroundColor );;
        });
	loader();

    setTimeout(function() {
        d3.csv('processing/allcenters.csv', function(data){
            data.forEach(function(d){
                d.Longitude = +d.Longitude;
                d.Latitude = +d.Latitude;
                d.cluster3 = +d.cluster3;
                d.cluster4 = +d.cluster4;
                d.cluster5 = +d.cluster5;
                d3.selectAll('#map svg')
                   .append("circle")
                   .attr("cx", knn_projection([d.Longitude, d.Latitude])[0])
                   .attr("cy", knn_projection([d.Longitude, d.Latitude])[1])
                   .attr("r", 3)
                   .attr('k3', d.cluster3)
                   .attr('k4', d.cluster4)
                   .attr('k5', d.cluster5)
                   .attr("class", "kmeans")
                   .style("fill", knn_colors[d.cluster5])
                   .style("opacity", .6);
            });
            knn_updateClusters(4);
			removeLoader();
        });
    }, 100);

    });
}());

var knn_colors = ["#E29253", "#A4973F", "#649452", "#2F8870", "#317582"];
var knn_backgroundColor = "#263948";
var knn_textColor = "#ECFF85";
function knn_addPoints(k){

        d3.selectAll('.center').style('display', 'none');
		d3.selectAll('.kmeans')[0].forEach(function(d){
			d.style.fill = knn_colors[parseInt(d.attributes['k'+k].value)];
		});
		d3.csv('processing/centers'+k+'.csv', function(centroids){

			centroids.forEach(function(d, i){
                  var group = d3.selectAll('#map svg')
				   .data(centroids)
				   .append("g")
                   .attr("class", "center")
				   .attr("transform", "translate("+knn_projection([d.Longitude, d.Latitude])[0]+","+knn_projection([d.Longitude, d.Latitude])[1]+")");
				  group.append("circle")
                   .attr("r", 10)
                   .style("fill", knn_colors[i])
                   .style("stroke", "black");
				  group.append("text")
				   .attr("dx",10)
				   .style("fill", knn_textColor)
				   .text(d.count+" Accidents");
                });

		});

    }

	knn_k = 4;

    knn_updateClusters = function(k){
        knn_k = k;
        knn_addPoints(k);
        if(k==3){
            d3.select('#k3').attr('disabled', true).attr("class","");
            d3.select('#k4').attr('disabled', null).attr("class","active");
            d3.select('#k5').attr('disabled', null).attr("class","active");
        } else if(k==4){
            d3.select('#k4').attr('disabled', true).attr("class","");
            d3.select('#k3').attr('disabled', null).attr("class","active");
            d3.select('#k5').attr('disabled', null).attr("class","active");
        } else if(k==5){
            d3.select('#k5').attr('disabled', true).attr("class","");
            d3.select('#k3').attr('disabled', null).attr("class","active");
            d3.select('#k4').attr('disabled', null).attr("class","active");
        }

    }