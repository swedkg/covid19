var vlSpec = "spec.vg.json";
var country = "World";
var locationsList;

function filteredLocation(data) {
  return data.filter((item) => {
    return item.location == country;
  });
}

function updateData(res, data) {
  let dt = filteredLocation(data);
  // console.log(country, dt);

  var changeSet = vega
    .changeset()
    .remove(() => {
      return true;
    })
    .insert(dt);

  res.view.change("table", changeSet).run();
}

var locationSelect = document.querySelector("#location-select");

vegaEmbed("#vis", vlSpec, { actions: false }).then((res) => {
  d3.csv("https://covid.ourworldindata.org/data/ecdc/full_data.csv").then(
    (data) => {
      locationsList = [...new Set(data.map((a) => a.location))];

      locationsList = locationsList.filter((i) => {
        return i != "World";
      });

      // add country options to Select element
      for (var i in locationsList) {
        locationSelect.add(new Option(locationsList[i], locationsList[i]));
      }

      updateData(res, data);

      locationSelect.addEventListener("change", (event) => {
        country = event.target.value;
        updateData(res, data);

        // const title = document.querySelector(".title");
        // title.textContent = `Displaying data for ${event.target.value}`;
      });
    } // end of loading csv promise
  );
});
