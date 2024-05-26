// Function to create the map and add the layers
function createMap(markers) {
    console.log("Creating map...");

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

    console.log("Map created successfully");
}

// Function to create markers from the GeoJSON response
function createMarkers(response) {
    // Log the entire response to ensure we are getting data
    console.log("API Response:", response);

    // Pull the "features" property from the response
    let features = response.features;

    // Initialize an array to hold the feature markers
    let featuresArray = [];

    // Loop through the features array
    for (let i = 0; i < features.length; i++) {
        let feature = features[i];
        let long = feature.geometry.coordinates[0]; // Longitude
        let lat = feature.geometry.coordinates[1];  // Latitude
        let depth = feature.geometry.coordinates[2];
        let mag = feature.properties.mag;
        let title = feature.properties.title || "No title available";

        // Log each feature's coordinates and title to verify data parsing
        console.log("Feature:", { lat, long, title });

        // Create a marker for each feature, and bind a popup with the feature's title
        let featureMarker = L.marker([lat, long])
            .bindPopup("<h3>" + title + "</h3>");

        // Add the marker to the featuresArray
        featuresArray.push(featureMarker);
    }

    // Log the featuresArray to ensure markers are being created
    console.log("Features Array:", featuresArray);

    // Create a layer group from the feature markers array, and pass it to the createMap function
    let markers = L.layerGroup(featuresArray);
    createMap(markers);
}

// Perform an API call to the USGS Earthquake API to get the earthquake information. Call createMarkers when it completes.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(createMarkers).catch(error => {
    console.error('Error fetching data:', error);
});