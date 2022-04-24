
d3.json("winedata.json")
        .then(function(wineData) {
  
  
            wineData.forEach(function(d) {
              d.points = +d.points;
              d.price = +d.price;
            });
  
            var pointExtent = d3.extent(wineData, function (d) {
                return d.points;
            });
            
          
            var selectedCountries = wineData.getElementById("country").value;
            var selectedPoints = wineData.getElementById("points").value;

            var selectedDataScale = wineData.filter(function(d) {
                    return  d.country == selectedCountries &&
                            d.points == selectedPoints;
                    });

            console.log(selectedDataScale);
    });