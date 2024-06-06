// Function to create the map and add the layers
function createMap(markers) {
    // Create the tile layers
    let cartoDBPositron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    });

    let cartoDBDarkMatter = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    });

    // Create a baseMaps object to hold the map layers
    let baseMaps = {
        "Light Map": cartoDBPositron,
        "Dark Matter": cartoDBDarkMatter
    };

    // Create an overlayMaps object to hold the markers layer
    let overlayMaps = {
        "Earthquakes": markers
    };

    // Create the map object with options
    let map = L.map("map", {
        center: [20, 0], // Initial view set to the world
        zoom: 2,
        layers: [cartoDBPositron, markers] // Default to Light Map and markers layer
    });

    // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(map);

    // Add legend
    addLegend(map);
}

// Function to determine marker size based on magnitude
function getMarkerSize(magnitude) {
    return magnitude * 4;
}

// Function to determine marker color based on depth
function getMarkerColor(depth) {
    return depth > 90 ? '#d73027' :
        depth > 70 ? '#fc8d59' :
            depth > 50 ? '#fee08b' :
                depth > 30 ? '#d9ef8b' :
                    depth > 10 ? '#91cf60' : '#1a9850';
}

// Function to add legend to the map
function addLegend(map) {
    const legend = L.control({ position: 'bottomleft' });

    legend.onAdd = function () {
        const div = L.DomUtil.create('div', 'legend');
        const grades = [0, 10, 30, 50, 70, 90];
        const colors = ['#1a9850', '#91cf60', '#d9ef8b', '#fee08b', '#fc8d59', '#d73027'];

        div.innerHTML = '<h4>Earthquake Depth</h4>';

        for (let i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + colors[i] + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(map);
}

// Function to create markers from the GeoJSON response
function createMarkers(response) {
    // Pull the "features" property from the response
    let features = response.features;

    // Initialize an array to hold the feature markers
    let featuresArray = [];

    // Loop through the features array
    for (let i = 0; i < features.length; i++) {
        let feature = features[i];
        let long = feature.geometry.coordinates[0]; // Longitude
        let lat = feature.geometry.coordinates[1];  // Latitude
        let depth = feature.geometry.coordinates[2]; // Depth
        let mag = feature.properties.mag; // Magnitude
        let title = feature.properties.title || "No title available";
        let place = feature.properties.place || "Unknown location";

        // Create a circle marker with size based on magnitude and color based on depth
        let featureMarker = L.circleMarker([lat, long], {
            radius: getMarkerSize(mag),
            fillColor: getMarkerColor(depth),
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        }).bindPopup("<h3>" + title + "</h3><hr><p>Magnitude: " + mag + "<br>Location: " + place + "<br>Depth: " + depth + "</p>");

        // Add the marker to the featuresArray
        featuresArray.push(featureMarker);
    }

    // Create a layer group from the feature markers array, and pass it to the createMap function
    let markers = L.layerGroup(featuresArray);
    createMap(markers);
}

// Perform an API call to the USGS Earthquake API to get the earthquake information. Call createMarkers when it completes.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(createMarkers).catch(error => {
    console.error('Error fetching data:', error);
});

// Perform API call to Fraxen Tectonic Plates to get plate boundaries
d3.json('https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json').then(createMarkers).catch(error => {
    console.error('Error fetching data:', error);
});