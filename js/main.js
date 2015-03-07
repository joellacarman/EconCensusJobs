
var dataset;

var DEFAULT = {
  yearChoice: "1987",
  category: "job_destruction"
}

d3.selectAll(".cat-choice").on("click", function(){
  var clicked = d3.select(this);
  category = clicked.attr("data-cat");

  makeMap(category, year);
})

var year = year || DEFAULT.yearChoice,
    category = category || DEFAULT.category;


window.onload = makeMap(DEFAULT.category, DEFAULT.yearChoice);

setUpInteractions();

function setUpInteractions(){
  var slideEventDispatcher = makeSlider();


    slideEventDispatcher.on("slideEnd", function(value){
      var year = Math.round(value);


      if (year > 1976 && year < 1980) { // 77-79
        year = "1977";
      } else if (year > 1979 && year < 1985){ // 80-84
        year = "1982";
      } else if (year > 1984 && year < 1990){ // 85-89
        year = "1987"
      } else if (year > 1989 && year < 1995) { // 90-94
        year = "1992"
      } else if (year > 1994 && year < 2000) { // 95-99
        year = "1997"
      } else if (year > 1999 && year < 2005) { // 00-04
        year = "2002"
      } else if (year > 2004 && year < 2010) { // 05-09
        year = "2007"
      } else {
        year = "2012"
      }


      makeMap(category, year)
    })
}


var w = 960;
var h = 650;

var projection = d3.geo.albersUsa()
             .translate([w/2, h/2])
             .scale([1200]);

var path = d3.geo.path()
         .projection(projection);

var svg = d3.select("#graph")
      .append("svg")
      .attr("width", w)
      .attr("height", h);


function makeMap(category, year){
  d3.csv("../data/data3/bdsDataGeocoded.csv", function (data){

    var sizeNester = d3.nest()
                .key(function (d){
                  return d.fsize
                })



    var yearNester = d3.nest()
                .key(function (d) {
                  return d.year
                });

      dataset = yearNester.map(data, d3.map);


      jobsDataset = dataset.get(year);

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
                            .data(jobsDataset)

              var enter = update.enter()
                            .append("circle")

              var exit = update.exit;

              function placeName(){

              }

              update.transition()
                  .attr("cx", function(d){ return projection([d.lon, d.lat])[0]})
                  .attr("cy", function(d){ return projection([d.lon, d.lat])[1]})
                  .attr("r", function(d){ return d[category]/ 2000})
                  .style("fill", colorCircles)
                  .style("opacity", 0.3)


                update.enter()
                  .append("text")
                    .style("stroke", "#000")
                    .attr("x", function(d){ return projection([d.lon, d.lat])[0]})
                    .attr("y", function(d){ return projection([d.lon, d.lat])[1]})

                    .text(function(d, i){ return d.city })
                    .attr("class", "city-name")
                    .on("mouseover", function(){ d3.select(this).style("opacity", "1")})
                    .on("mouseout", function(){ d3.select(this).style("opacity", "0")})




      });
  });
}





