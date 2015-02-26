
var dataset;

var DEFAULT = {
  yearChoice: "2012",
  category: "job_destruction"
}

var yearChoice = DEFAULT.yearChoice;
var category = DEFAULT.category;


d3.selectAll(".cat-choice").on("click", function(){
  var clicked = d3.select(this);
  category = clicked.attr("data-cat");
  makeMap(category);
})

window.onload = makeMap(category);

var w = 900;
var h = 700;

var projection = d3.geo.albersUsa()
             .translate([w/2, h/2])
             .scale([900]);

var path = d3.geo.path()
         .projection(projection);

var svg = d3.select("body")
      .append("svg")
      .attr("width", w)
      .attr("height", h);


function makeMap(){
  d3.csv("../data/data2/joinedResult.csv", function (data){

    var yearNester = d3.nest()
                .key(function (d) {
                  return d.year
                });

      dataset = yearNester.map(data, d3.map);


      jobs2012 = dataset.get(yearChoice);

      d3.json("../data/us-states.json", function(json) {

              function colorCircles(){
                if (category === "job_destruction"){
                  return "red"
                } else {
                  return "green"
                }
              }

              svg.selectAll("path")
                 .data(json.features)
                 .enter()
                 .append("path")
                 .attr("d", path)
                 .attr("fill", "#eee")
                 .attr("stroke", "#fff");

              var update = svg.selectAll("circle")
                            .data(jobs2012)

              var enter = update.enter()
                            .append("circle")

              var exit = update.exit;

              function placeName(){

              }

              update.transition()
                 .attr("cx", function(d) { if (d.lon) {
                         return projection([d.lon, d.lat])[0];
                        } else {
                          return -1000
                        }
                 })
                 .attr("cy", function(d) { if (d.lon) {
                         return projection([d.lon, d.lat])[1];
                        } else {
                          return -1000
                        }
                 })
                  .attr("r", function(d){ return d[category]/ 10000})
                  .style("fill", colorCircles)
                  .style("opacity", 0.3)


                update.enter()
                  .append("text")
                    .style("stroke", "#000")
                    .attr("x", function(d) {
                      if (d.lon) {
                           return projection([d.lon, d.lat])[0];
                          } else {
                            return -1000
                          }
                   })
                   .attr("y", function(d) { if (d.lon) {
                           return projection([d.lon, d.lat])[1];
                          } else {
                            return -1000
                          }
                   })
                    .text(function(d, i){ return d.city })
                    .attr("class", "city-name")
                    .on("mouseover", function(){ d3.select(this).style("opacity", "1")})
                    .on("mouseout", function(){ d3.select(this).style("opacity", "0")})




      });
  });
}




