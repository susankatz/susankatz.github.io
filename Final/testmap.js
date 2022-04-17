
var width = 1000;
var height = 1000;

// var scaleWidth = 300;
// var scaleHeight = 20;
// var scaleX = 500
// var scaleY = 20;
// var scale = svg.select("#scale")
//                 .attr("transform", "translate(" + scaleX + ", " + scaleY + ")");
// var scaleColor = d3.scaleSequential(d3.interpolateReds)
//                 .domain([84, 95]);

// scale.select("#scaleRect")
//                 .attr("width", scaleWidth)
//                 .attr("height", scaleHeight);
                
// svg.select("#scale")
//                 .attr("transform", "translate(" + scaleX + ", " + scaleY + ")");

var svg = d3.select("#viz")
                    .attr("width", width)
                    .attr("height", height);

svg.select("#ocean")
                    .attr("width", width)
                    .attr("height", height);

var map = svg.select("#map");

d3.json("world-alpha3.json")
    .then(function(world) {

    var geoJSON = topojson.feature(world, world.objects.countries);

    geoJSON.features = geoJSON.features.filter(function(d) {
                return d.id !== "ATA";
                });


    var proj = d3.geoMercator()
                .fitSize([width, height], geoJSON);
    
    var path = d3.geoPath()
                .projection(proj);
    var countries = map.selectAll("path")
                .data(geoJSON.features);

 
    d3.json("winedata.json")
        .then(function(wineData) {

            // DO EVERYTHING IN HERE

            var countryColor = d3.scaleSequential(d3.interpolatePuRd)
                 .domain([85, 91]);
    

            countries.enter().append("path")
                 .attr("d", path)
                 .attr("stroke-width", 1)
                 .attr("stroke", "black")
                 .attr("fill", function (item) {
                     var myCountryData = wineData
                        .filter(function(d) {
                            return d.country === item.properties.name;
                        });
                        console.log()
                    if (myCountryData.length) {
                        var blah = d3.mean(myCountryData, function (d) {
                            return +d.points;
                        })
                        return countryColor(blah)
                    }
                    else {
                        return "LightGray";
                    }
                 // 
                 
                });

            function PriceLevelOne (){}

            

        }); });
   




            // var zoom = d3.zoom()
            //             .translateExtent([[0, 0], [width, height]])
            //             .scaleExtent([1, 8])
            //             .on("zoom", zoomed);

            // function zoomed(event) {
            //         map.attr("transform", event.transform);
            // }

            // svg.call(zoom);
            
            
      
        
