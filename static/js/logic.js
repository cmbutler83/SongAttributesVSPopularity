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

    // Create legend
    var legend = L.control({position: 'topright'});
    legend.onAdd = function(){
        var div = L.DomUtil.create('div', 'info legend')
        var limits = countries.options.limits;
        var colors = countries.options.colors;
        var labels = [];

        div.innerHTML = '<h2 id="legend_title">Attribute</h2><hr><div class="labels"><div class="min">' + limits[0] + '</div> \
        <div class="max">' + limits[limits.length - 1] + '</div></div>';

        limits.forEach(function (limit, index) {
            labels.push('<li style="background-color: ' + colors[index] + '"></li>');
        });
        div.innerHTML += '<ul>' + labels.join('') + '</ul>';
        return div;
    };
    legend.addTo(myMap);


    // Create info box to display results for song attributes by country
    var infoBox = L.control({position: 'bottomleft'});
    infoBox.onAdd = function(){
        var div2 = L.DomUtil.create('div', 'info box');
        div2.innerHTML += '<h2>Song Attributes for</h2><h1><div id="this_country">Each Country</div></h1><p><div id="attrs">Click for more info...</div></p>';
        return div2;
    };
    infoBox.addTo(myMap);

}

// Define function to create interactive buttons for song attributes
function createButtons(){

    d3.select('#top').append('a').property('href', '/').text('Go to Plots  ');

    // Array to hold song attributes
    attrs = ['danceability', 'energy', 'loudness', 'speechiness', 'acousticness', 'valence', 'tempo', 'duration'];
    
    // Iterate through attributes
    for(i = 0; i < attrs.length; i++){

        // Create button for each attribute
        attr = attrs[i];
        d3.select('#top').append('button').text(attr).property('value', attr.toString()).attr('onclick', 'buttonPressed(this.value)');
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
                fillColor: 'lime',
                fillOpacity: 0.6
            });
            country = feature.properties.ADMIN;
            document.getElementById('this_country').innerHTML = country
        });
        layer.on('mouseout', function(e){

            // will need to be cautious about adjusting this per each choropleth...
            borders.resetStyle(this);

        });
        layer.on('click', function(c){
            clickd = feature.properties.ADMIN;
            document.getElementById('attrs').innerHTML = `Song attributes for ${clickd} populate here...`
            // call attr by country function here





        })
    };

    function getColor(feature){
        return feature.properties.ADMIN.length
    };

    // test fuunction to try to change to on button click...
    function getcolor2(feature){
        return feature.properties.ADMIN.length % 2
    }




    var borders = L.choropleth(polys, {
        valueProperty: getColor,
        scale: ["white", "green"],
        steps: 10,
        mode: "q",
        style: {
          color: "saddlebrown", // default color
          weight: 1, // default weight
          fillOpacity: 0.5 // default opacity is 0.2
        },
        onEachFeature: onEach,
    });

    // test change style, not working...
    borders.setStyle({
        valueProperty: getcolor2,
        scale: ["white", "blue"]
    });




    console.log(borders);

    // Draw map w/border layer
    createMap(borders);
}

// Get country border polygon info from file & call draw marker function when received
var polys = 'static/js/countries.geojson'
d3.json(polys).then(createMarkers);

// Define button click function
function buttonPressed(attribute){
    document.getElementById('legend_title').innerHTML = attribute;

    // Update choropleth & legend function here




}
