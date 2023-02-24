// Global variables
var attrs;
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
        center: [16, 8],
        zoom: 3,
        layers: [base, countries]
    });

    // Call function to create buttons
    createButtons();

    // Create info box to display results for song attributes by country
    var infoBox = L.control({position: 'bottomleft'});
    infoBox.onAdd = function(){
        var div2 = L.DomUtil.create('div', 'info');
        div2.innerHTML += '<h2>Song Attributes for</h2><h1><div id="this_country">Each Country</div></h1><h4><div id="attrs">Click for more info...</div></h4>';
        return div2;
    };
    // Add info box to map
    infoBox.addTo(myMap);
};

// Define function to create interactive buttons for song attributes
function createButtons(){

    d3.select('#top').append('a').property('href', '/')
    .property('id', 'home')
    .text('Back to Dashboard Page');

    d3.select('#top').append('h1').property('id', 'pageTitle').text('Most Popular Song Attributes by Country')


    // Array to hold song attributes
    attrs = ['DANCEABILITY', 'ENERGY', 'LOUDNESS', 'SPEECHINESS', 'ACOUSTICNESS', 'VALENCE', 'TEMPO', 'DURATION'];
    
    // Iterate through attributes
    for(i = 0; i < attrs.length; i++){

        // Create button for each attribute
        attr = attrs[i];
        d3.select('#buttons').append('button').text(attr)
            .property('value', attr.toString())
            .property('id', `button${i}`)
            .attr('onclick', 'buttonPressed(this.value)');
    }
}

// Define function to update map on button clicks
function updateMap(countries, att){
    if(!first){
        // remove previous legend if exists
        legend.remove(myMap);
    }
    // Define new legend
    legend = L.control({position: 'topright'});
    legend.onAdd = function(){
        var div = L.DomUtil.create('div', 'legend')
        var limits = countries.options.limits;
        var colors = countries.options.colors;
        var labels = [];

        // Create legend labels
        div.innerHTML = '<h2 id="legendTitle">'+ att +'</h2><p>' + attDeets[att] + '</p><div class="labels"><div class="min">' + limits[0] + '</div> \
        <div class="max">' + limits[limits.length - 1] + '</div></div>';

        // Add legend colors & return div
        limits.forEach(function (limit, index) {
            labels.push('<li style="background-color: ' + colors[index] + '"></li>');
        });
        div.innerHTML += '<ul>' + labels.join('') + '</ul>';
        return div;
    };
    // Add legend to map
    legend.addTo(myMap);
    
    // Remove previous choropleth if exists
    if(!first){
        myMap.removeLayer(c);
    }
    // Add requested choropleth
    myMap.addLayer(countries);
    // Save this layer to remove on the next round
    c = countries;
    // Note that we are not on the first round anymore
    first = false;
};


// Define function to draw country borders
function createMarkers(polys, att) {

    var country = '';
    var clickd = '';

    // Function to choose color of highlighted country on mouseover
    var highlight = function(){
        if(att === null){
            return 'ghostwhite' 
        } else if(att === attrs[0] || att === attrs[1] || att === attrs[2]){
            return 'yellow'
        } else if(att === attrs[3] || att === attrs[4]){
            return 'lime'
        } else {
            return 'cyan'
        }
    };
    
    // Define interactivity options for each country
    function onEach(feature, layer) {

        //Hightlight country on mouseover
        layer.on('mouseover', function(d){
            this.setStyle({
                fillColor: highlight(),
                fillOpacity: 0.8
            });
            // Show country name in infobox
            country = feature.properties.ADMIN;
            if(country === 'China'){
                country = 'Hong Kong'
            }
            document.getElementById('this_country').innerHTML = country
        });
        // Reset style on mouseout
        layer.on('mouseout', function(e){
            borders.resetStyle(this);
            if(clickd){
                document.getElementById('this_country').innerHTML = clickd
            } else {
                document.getElementById('this_country').innerHTML = 'Each Country'
                document.getElementById('attrs').innerHTML = 'Click for more info...'
            }
        });
        // Show country's song attribute info in info box on mouse click
        layer.on('click', function(c){
            clickd = feature.properties.ADMIN;
            if(clickd === 'China'){
                //clickd = 'Hong Kong';
                document.getElementById('attrs').innerHTML = 'Spotify blocked in mainland China, data is for Hong Kong ONLY'
            } else {
                document.getElementById('attrs').innerHTML = `No Spotify data for ${clickd}, please try another country.`
            }
            this.setStyle({
                color:'white',
                weight:2
            });
            // call attr by country function here
            let url = `/countries/${clickd}`
            fetch(url).then(response => response.json())
            .then(json => {
                console.log(json);
            
            
            

            
            
            });
        });
    };

    // Style options for choropleth
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
                fillOpacity: 0.6
            }
        }
    };

    // Values for choropleth
    function propVal(feature){
        if(att === null){
            return null
        } else {
            return feature.properties.value
        }
    };

    // Choropleth color scale
    var propScale = function (){
        if(att === null){
            return null
        } else if(att === attrs[0]){
            return ['white', 'darkkhaki']
        } else if(att === attrs[1]){
            return ['white', 'olive']
        } else if(att === attrs[2]){
            return ['white', 'olivedrab']
        } else if(att === attrs[3]){
            return ['white', 'forestgreen']
        } else if(att === attrs[4]){
            return ['white', 'seagreen']
        } else if(att === attrs[5]){
            return ['white', 'teal']
        } else if(att === attrs[6]){
            return ['white', 'royalblue']
        } else {
            return ['white', 'blue']
        }
    };

    // Number of steps in choropleth
    var propSteps = function(){
        if(att === null){
            return null
        } else {
            return 9
        }
    };
    
    // Mode of choropleth
    var propMode = function(){
        if(att === null){
            return null
        } else {
            return 'q'
        }
    };

   // Generate choropleth with preferred styling
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
    };
};

// Get country border polygon info from file & call draw marker function when received
var polys = 'static/js/countries.geojson'
d3.json(polys).then(function(data){
    // Save data for future references
    countryData = data;
    // Generate map
    createMarkers(data, null);
});

// Define button click function
function buttonPressed(attribute){

    // Pass chosen attribute to our Flask app to get each country's data
    let url = `/attributes/${attribute}`
    fetch(url).then(response => response.json())
    .then(json => {
        console.log(json);
        // Join JSON to existing GeoJSON data
        let joinedGJ = JSON.parse(JSON.stringify(countryData));
        for (let i = 0; i < joinedGJ.features.length; i++){
            const properties = joinedGJ.features[i].properties
            joinedGJ.features[i].properties = {
                ...properties,
                ...json.find((item) => item.country === properties.ADMIN),
            }
        }
        // Update choropleth & legend w/new attribute
        createMarkers(joinedGJ, attribute);
    });
};
