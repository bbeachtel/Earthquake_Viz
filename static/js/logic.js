// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {

    // // Define a function that we want to run once for each feature in the features array.
    // // Give each feature a popup that describes the place and time of the earthquake.
    function onEachFeatureFn(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
    }

    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    // Run the onEachFeature function once for each piece of data in the array.
    let earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeatureFn
    });

    // let earthquakes = L.geoJSON(earthquakeData, {
    //   'pointToLayer': function(geoJsonPoint, latlng){
    //                     var circleMarker=L.circle(latlng, {
    //                       'radius': geoJsonPoint['properties']['mag']*100000
    //                     });
    //                     return circleMarker
    //   }
    // });

    // Send our earthquakes layer to the createMap function/
    createMap(earthquakes);
}