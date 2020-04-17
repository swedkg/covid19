var vlSpec = "spec.vg.json";
var currentLocation = "World";
var locationsList;
var countriesCodes;

function filteredLocation(data) {
  return data.filter((item) => {
    return item.location == currentLocation;
  });
}

function updateData(res, data) {
  let dt = filteredLocation(data);

  var changeSet = vega
    .changeset()
    .remove(() => {
      return true;
    })
    .insert(dt);

  res.view.change("table", changeSet).run();
}

var locationSelect = document.querySelector("#location-select");

d3.csv("countries_with_regional_codes.csv").then((data) => {
  countriesCodes = data;
});

vegaEmbed("#vis", vlSpec, { actions: false }).then((res) => {
  d3.csv("https://covid.ourworldindata.org/data/ecdc/full_data.csv").then(
    (covidData) => {
      // filter out unique locations
      locationsList = [...new Set(covidData.map((a) => a.location))];

      var aggregatedData = [];

      // add code into original data
      for (let l = 0; l < locationsList.length; l++) {
        let location = locationsList[l];

        codes = countriesCodes.filter((c) => {
          return c.name == location || c.name.includes(location);
        })[0];

        cntr = covidData.filter((c) => {
          return c.location == location;
        });

        if (codes)
          cntr.forEach((c) => {
            c.region = codes.region;
            c.regionCode = codes["region-code"];
            c.subRegion = codes["sub-region"];
            c.subRegionCode = codes["sub-region-code"];
          });
        aggregatedData = aggregatedData.concat(cntr);
      }

      locationsList = locationsList.filter((i) => {
        return i != "World";
      });

      // add options to Select element
      for (var i in locationsList) {
        locationSelect.add(new Option(locationsList[i], locationsList[i]));
      }

      updateData(res, aggregatedData);

      locationSelect.addEventListener("change", (event) => {
        currentLocation = event.target.value;
        updateData(res, aggregatedData);
      });
    } // end of loading csv promise
  );
});
