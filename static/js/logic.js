// Define function to create map
function createMap(countries){

    // Map tiles
    var base = L.tileLayer('https://stamen-tiles.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg', {
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>)'
    })

    // Create map
    var myMap = L.map("map", {
        center: [12, 10],
        zoom: 3,
        layers: [base, countries]
    });

    // Call function to create buttons
    createButtons();

    // Add legend here?

        
    var infoBox = L.control({position: 'bottomleft'});
    infoBox.onAdd = function(){
        var div = L.DomUtil.create('div', 'info box');
        div.innerHTML += '<h2>Song Attributes for</h2><h1><div id="this_country">Each Country</div></h1><p><div id="attrs">Click for more info...</div></p>';
        return div;
    };
    infoBox.addTo(myMap);


}

// Define function to create interactive buttons for song attributes
function createButtons(){

    d3.select('#attributes').append('a').property('href', '/').text('Go to Plots  ');
    // Array to hold song attributes
    attrs = ['danceability', 'energy', 'loudness', 'speechiness', 'acousticness', 'valence', 'tempo', 'duration'];
    
    // Iterate through attributes
    for(i = 0; i < attrs.length; i++){

        // Create button for each attribute
        attr = attrs[i];
        d3.select('#attributes').append('button').text(attr).property('value', attr.toString()).attr('onclick', 'buttonPressed(this.value)');
    }
}

// Define function to draw country borders
function createMarkers(polys) {

    console.log(polys);

    var country = '';
    var clickd = '';
    function onEach(feature, layer) {

        // Open popups on mouse hover 
        layer.on('mouseover', function(d){
            this.setStyle({
                fillColor: 'red',
                fillOpacity: 0.6
            });
            country = feature.properties.ADMIN;
            document.getElementById('this_country').innerHTML = country
        });
        layer.on('mouseout', function(e){
            this.setStyle({
                fillColor: 'saddlebrown',
                fillOpacity: 0.2
            });
        });
        layer.on('click', function(c){
            clickd = feature.properties.ADMIN;
            console.log(clickd);
            document.getElementById('attrs').innerHTML = `Song attributes for ${clickd} populate here...`
            // call attr by country function here
        })
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

// Define button click function
function buttonPressed(attribute){
    console.log(attribute);

    // Create or call choropleth function here
}
