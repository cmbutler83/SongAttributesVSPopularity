var countryData;
var myMap;
var first = true;
var legend;
var c;
// Define function to create map
function createMap(countries){

    // Map tiles
    var base = L.tileLayer('https://stamen-tiles.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg', {
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>)'
    })

    // Create map
    myMap = L.map("map", {
        center: [12, 10],
        zoom: 3,
        layers: [base, countries]
    });

    // Call function to create buttons
    createButtons();

    // Create info box to display results for song attributes by country
    var infoBox = L.control({position: 'bottomleft'});
    infoBox.onAdd = function(){
        var div2 = L.DomUtil.create('div', 'info');
        div2.innerHTML += '<h2>Song Attributes for</h2><h1><div id="this_country">Each Country</div></h1><p><div id="attrs">Click for more info...</div></p>';
        return div2;
    };
    infoBox.addTo(myMap);
};

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

function updateMap(countries, att){
    if(!first){
        legend.remove(myMap);
    }
    legend = L.control({position: 'topright'});
    legend.onAdd = function(){
        var div = L.DomUtil.create('div', 'info legend')
        var limits = countries.options.limits;
        var colors = countries.options.colors;
        var labels = [];

        div.innerHTML = '<h2 id="legend_title">'+ att +'</h2><hr><div class="labels"><div class="min">' + limits[0] + '</div> \
        <div class="max">' + limits[limits.length - 1] + '</div></div>';

        limits.forEach(function (limit, index) {
            labels.push('<li style="background-color: ' + colors[index] + '"></li>');
        });
        div.innerHTML += '<ul>' + labels.join('') + '</ul>';
        return div;
    };
    legend.addTo(myMap);
    
    if(!first){
        myMap.removeLayer(c);
    }
    myMap.addLayer(countries);
    c = countries;
    first = false;
};


// Define function to draw country borders
function createMarkers(polys, att) {

    var country = '';
    var clickd = '';
    var highlight = function(){
        if(att === null){
            return 'red'
        } else if(att === 'tempo'){
            return 'lime'
        }else {
            return 'cyan'
        }
    }
    
    function onEach(feature, layer) {

        //Hightlight country on mouseover
        layer.on('mouseover', function(d){
            this.setStyle({
                fillColor: highlight(),
                fillOpacity: 0.6
            });
            // Show country name in infobox
            country = feature.properties.ADMIN;
            document.getElementById('this_country').innerHTML = country
        });
        // Reset style on mouseout
        layer.on('mouseout', function(e){
            borders.resetStyle(this);
        });
        // Show country's song attribute info in info box on mouse click
        layer.on('click', function(c){
            clickd = feature.properties.ADMIN;
            document.getElementById('attrs').innerHTML = `No Spotify data for ${clickd}, please try another country.`
            // call attr by country function here



        })
    };


    function getStyle(){
        if(att === null){
            return {
                color: 'saddlebrown',
                weight: 1,
                fillOpacity: 0.2
            }
        } else {
            return {
                color: 'grey',
                weight: 1,
                fillOpacity: 0.5
            }
        }
    };

    function propVal(feature){
        if(att === null){
            return null
        } else if(att === 'tempo'){
            return feature.properties.ADMIN.length
        } else {
            return feature.properties.ADMIN.length % 2
        }
    }

    var propScale = function (){
        if(att === null){
            return null
        } else if(att === 'tempo'){
            return ['white', 'green']
        } else {
            return ['white', 'blue']
        }
    }


    var propSteps = function(){
        if(att === null){
            return null
        } else if(att === 'tempo') {
            return 10
        } else {
            return 9
        }
    }

    var propMode = function(){
        if(att === null){
            return null
        } else {
            return 'q'
        }
    }

   
    var borders = L.choropleth(polys, {
        valueProperty: propVal,
        scale: propScale(),
        steps: propSteps(),
        mode: propMode(),
        style: getStyle(),
        onEachFeature: onEach
    });

    
    if(att === null){
        // First pass, draw map
        createMap(borders);
    } else {
        // Update choropleth & legend on button press
        updateMap(borders, att);
    }
}

// Get country border polygon info from file & call draw marker function when received
var polys = 'static/js/countries.geojson'
d3.json(polys).then(function(data){
    countryData = data;
    createMarkers(data, null);
});

// Define button click function
function buttonPressed(attribute){

    // Update choropleth & legend function
    createMarkers(countryData, attribute);
};
