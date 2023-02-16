
// Define function to create map
function createMap(countries){

    // Map tiles
    var base = L.tileLayer('https://stamen-tiles.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg', {
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>)'
    })

    // Create map
    var myMap = L.map("map", {
        center: [10, 0],
        zoom: 3,
        layers: [base, countries]
    });

    // Call function to create buttons
    createButtons();
}

// Define function to create interactive buttons for song attributes
function createButtons(){

    // Array to hold song attributes
    attrs = ['danceability', 'energy', 'loudness', 'speechiness', 'acousticness', 'instrumentalness', 'valence', 'tempo', 'duration'];
    
    // Iterate through attributes
    for(i = 0; i < attrs.length; i++){

        // Create button for each attribute
        attr = attrs[i];
        d3.select('#attributes').append('button').text(attr).property('value', attr.toString());
    }
}

// Define function to draw country borders
function createMarkers(polys) {

    console.log(polys);

    function onEach(feature, layer) {

        // Add popup showing country
        //layer.bindPopup(`<p>${feature.properties.ADMIN}</p>`);
        // var popup = L.popup().setLatLng(layer.getBounds().getCenter())
        // .setContent(`<p>${feature.properties.ADMIN}</p>`);
        // layer.bindPopup(popup);

        // Open popups on mouse hover 
        layer.on('mouseover', function(d){
            this.setStyle({
                fillColor: 'red',
                fillOpacity: 0.6
            });
            console.log(feature.properties.ADMIN);
        });
        layer.on('mouseout', function(e){
            this.setStyle({
                fillColor: 'saddlebrown',
                fillOpacity: 0.2
            });
        });
    };

    // Create geoJSON layer of country border line style
    var borders = L.geoJSON(polys.features, {
        onEachFeature: onEach,
        style: {
            color: 'saddlebrown',
            weight: 1
        }
    });

    // Draw map w/border layer
    createMap(borders);
}

// Get country border polygon info from file & call draw marker function when received
var polys = 'static/js/countries.geojson'
d3.json(polys).then(createMarkers);