
var width = 1500;
var height = 1500;

var mapHeight = height-100;
var mapWidth = width;

// Map        
var svg = d3.select("#viz")
  .attr("width", width)
  .attr("height", height);

svg.select("#ocean")
  .attr("width", mapWidth)
  .attr("height", mapHeight);
 

// Map        
var map = svg.select("#map");

// Scale
var scaleWidth = 1450;
var scaleHeight = 45;
var scaleX = mapWidth / 2 - (scaleWidth / 2);
var scaleY = mapHeight;
var scale = svg.select("#scale")
        .attr("transform", "translate(" + scaleX + ", " + scaleY + ")");


svg.select("#scale")
        .attr("transform", "translate(" + scaleX + ", " + scaleY + ")");

scale.select("#scaleRect")
        .attr("width", scaleWidth)
        .attr("height", scaleHeight)


d3.json("world-alpha3.json")
  .then(function(world) {

    var geoJSON = topojson.feature(world, world.objects.countries);

    geoJSON.features = geoJSON.features.filter(function(d) {
      return d.id !== "ATA";
    });


    var proj = d3.geoMercator()
      .fitSize([mapWidth, mapHeight], geoJSON);

    var path = d3.geoPath()
      .projection(proj);

    d3.json("winedata.json")
      .then(function(wineData) {

          // DO EVERYTHING IN HERE

          wineData.forEach(function(d) {
            d.points = +d.points;
            d.price = +d.price;
          });

          var pointExtent = d3.extent(wineData, function (d) {
              return d.points;
          });
          var maxPointExtent = d3.max(wineData, function (d) {
            return d.points;
        });
          var countryColor = d3.scaleSequential(d3.interpolateInferno)
          .domain(pointExtent); 
          

            // Countries 
          function drawMap(filteredData) {

            var countries = map.selectAll("path")
              .data(geoJSON.features);

            

            // enter countries
            var enterCountries = countries.enter().append("path")
              .attr("d", path)
              .attr("stroke-width", 1)
              .attr("stroke", "black");


              
            countries.merge(enterCountries)
              .attr("fill", function (item) {

                var myCountryData = filteredData
                  .filter(function(d) {
                    return d.country === item.properties.name;
                  });

                if (myCountryData.length) {
                  var averagePoints = d3.mean(myCountryData, function (d) {
                      return d.points;
                  })
                  return countryColor(averagePoints);
                }
                else {
                  return "LightGray";
                }

              })
              .on("mousemove", function(event, item) {
          
                var tooltip = d3.select("#tooltip")
                  .style("display", "block")
                  .style("left", event.pageX + 20 + "px")
                  .style("top", event.pageY + 20 + "px");
            
                  tooltip.select("#country").html(item.properties.name);
      
  
                var myCountryData = filteredData
                .filter(function(d) {
                  return d.country === item.properties.name;
                });
                tooltip.select("#totalWines").html(myCountryData.length);
              if (myCountryData.length) {
                var averagePoints = d3.mean(myCountryData, function (d) {
                    return d.points;
                })
                  tooltip.select("#points").html(Math.round(averagePoints));
              }
              else {
                  tooltip.select("#points").html("N/A");
              }
              })
              .on("mouseout", function() {
            
                d3.select("#tooltip")
                  .style("display", "none");
            
              });
            
          }

          // Scale Variables 

        var scaleColor = d3.scaleSequential(d3.interpolateInferno)
        .domain([0, maxPointExtent]); 

        // Draw Scale


        var gradientScale = d3.scaleLinear()
        .domain(pointExtent)
        .range([0, scaleWidth])
        ;  

        var scaleAxis = d3.axisBottom(gradientScale);

        scale.select("#scaleAxis")
            .style("font-size", "25")
            .style("font-family","'Bebas Neue', cursive")
            .attr("transform", "translate(0, " + scaleHeight + ")")
            .call(scaleAxis);

            var stops = d3.range(0, 1.25, 0.25);

            svg.select("#colorGradient").selectAll("stop")
            .data(stops).enter()
            .append("stop")
            .attr("offset", function(d) {
                return d * 100 + "%";
            })
            .attr("stop-color", function (d) {
                return scaleColor(d * maxPointExtent)
            }
            );

// Filter Data
          function filterData(range) {
            var extent = range.split("-").map(Number);
            return wineData.filter(function(d) {
              return d.price >= extent[0] && d.price <= extent[1];
            });
          }

          var startingData = filterData("0-25");
          drawMap(startingData);

          d3.selectAll(".rangeButton")
            .on("click", function() {

              var range = this.id.replace("range", "");

              if (range === "All") drawMap(wineData);
              else {
                var rangeData = filterData(range);
                drawMap(rangeData);
              }
            });
// Connected Chart event 
            
        // function drawOtherChart (topTenData) {
        //     var svg2 = d3.select("#wineNameChart")
            
        //     svg2.selectAll()
        // }  

           
       
        //     function drawScale (wineData) {
        //         var selectedCountries = wineData.getElementById("country").value;
        //         var selectedPoints = wineData.getElementById("points").value;

        //         var filteredDataScale = wineData.filter(function(d) {
        //             return  d.country == selectedCountries &&
        //                     d.points == selectedPoints;
        // });

        //         console.log(filteredDataScale);//RETURNING EMPTY ARRAY?

            //      mean = d3.mean(filteredData,function(d) { return d.points})

                
            //     var myCountryDataScale = wineData
            //             .filter(function(d) {
            //             return d.country === item.properties.name;
            //             });
            
              
          
            // }
            // drawScale(filteredDataScale);
      });
      
  });

//   function (d) { 
//     return countryColor(d * d3.max(wineData, function (d){
//     return d.points; 
//  }

