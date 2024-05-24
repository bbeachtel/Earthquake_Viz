function createMap(bikeStations) {

    // Create the tile layer that will be the background of our map.
    let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });


    // Create a baseMaps object to hold the streetmap layer.
    let baseMaps = {
        "Street Map": streetmap
    };

    // Create an overlayMaps object to hold the bikeStations layer.
    let overlayMaps = {
        "Bike Stations": bikeStations
    };

    // Create the map object with options.
    let map = L.map("map-id", {
        center: [40.73, -74.0059],
        zoom: 12,
        layers: [streetmap, bikeStations]
    });

    // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(map);
}

function createMarkers(response) {

    // Pull the "stations" property from response.data.
    let features = response.features;

    // Initialize an array to hold bike markers.
    let featuresArray = [];

    // Loop through the stations array.
    for (let i=0; i < features.length; i++) {
        let feature = features[i];
        let long = feature.geometry.coordinates[1];
        let lat = feature.geometry.coordinates[0];
        let depth = feature.geometry.coordinates[2];

        // For each station, create a marker, and bind a popup with the station's name.
        let featureMarker = L.marker([long, lat, depth])
            .bindPopup("<h3>" + station.name + "<h3><h3>Capacity: " + station.capacity + "</h3>");

        // Add the marker to the bikeMarkers array.
        bikeMarkers.push(bikeMarker);
    }

    // Create a layer group that's made from the bike markers array, and pass it to the createMap function.
    createMap(L.layerGroup(bikeMarkers));
}


// Perform an API call to the Citi Bike API to get the station information. Call createMarkers when it completes.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(createMarkers);