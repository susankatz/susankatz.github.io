function priceLevelOne () {
    d3.json("world-alpha3.json")
    .then(function(worldOne) {
    // var geoJSON = topojson.feature(world, world.objects.countries);

    // geoJSON.features = geoJSON.features.filter(function(d) {
    //             return d.id !== "ATA";
    //             });


    // var proj = d3.geoMercator()
    //             .fitSize([width, height], geoJSON);
    
    // var path = d3.geoPath()
    //             .projection(proj);
    // var countries = map.selectAll("path")
    //             .data(geoJSON.features);

    d3.json("winedata.json")
            .then(function(wineDataOne) {
                var countryColorOne = d3.scaleSequential(d3.interpolateYlGn)
                 .domain([80, 100]);
                var svg = d3.selectAll("map").transition();

                
                svg.select("path")
                .duration(750)
                .attr("d", path)
                .attr("fill", function (item) {
                    var myCountryData = wineDataOne
                       .filter(function(d) {
                           return d.country === item.properties.name;
                       })
                       .filter(function (d){
                           return +d.price <= 25;
                       });
                       
                       console.log()
                   if (myCountryData.length) {
                       var blah = d3.mean(myCountryData, function (d) {
                           return +d.points;
                        
                       })
                       return countryColorOne(blah)
                   }
                   else {
                       return "LightGray";
                   }
                // legend
                
               });

            }); });
        }