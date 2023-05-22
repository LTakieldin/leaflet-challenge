// read data
d3.json(
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
).then((data) => {
  console.log(data);

  // popup for each marker
  function onEachFeature(feature, layer) {
    layer.bindPopup(`
         <h1>${feature.properties.title}</h1>
        <h3>Magnitude: ${feature.properties.mag}</h3>
        <h3>Depth: ${feature.geometry.coordinates[2]}</h3>
        <h3>Place: ${feature.properties.place}</h3>
        <h3>Type: ${feature.properties.type}</h3>
    `);
  }

  // markers
  let earthquakes = L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
      return new L.CircleMarker(latlng, {
        radius: feature.properties.mag * 4,
        color: getColor(feature.geometry.coordinates[2]),
      });
    },
    onEachFeature: onEachFeature,
  });

  // create map
  createMap(earthquakes);
});

const createMap = (earthquakes) => {
  // map street view
  let street = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  });

  let baseMap = {
    "Street View": street,
  };

  var map = L.map("map", {
    center: [50, -100],
    zoom: 4,
    layers: [street, earthquakes],
  });

  // set overlay
  let overlayMaps = { Earthquakes: earthquakes };

  // add abit of control
  L.control.layers(baseMap, overlayMaps, { collapse: false }).addTo(map);

  // legend
  let legend = L.control({ position: "bottomright" });
  legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend");
    let depth = [-10, 10, 30, 50, 70, 90];
    for (let i = 0; i < depth.length; i++) {
      const el = depth[i];
      const nextEl = depth[i + 1];
      div.innerHTML +=
        "<div>" +
        '<span style="background-color:' +
        getColor(el + 1) +
        '"></span>' +
        el +
        (nextEl ? "-" + nextEl : "+") +
        "<div>";
    }
    return div;
  };
  legend.addTo(map);
};

const getColor = (val) => {
  if (val >= 90) return "rgb(255,10,10)";
  else if (val >= 70 && val < 90) return "rgb(255, 78, 10)";
  else if (val >= 50 && val < 70) return "rgb(255, 142, 20)";
  else if (val >= 30 && val < 50) return "rgb(250, 183, 50)";
  else if (val >= 10 && val < 30) return "rgb(170, 170, 50)";
  else return "rgb(100, 170, 70)";
};
