// Global variables
var countryData;
var myMap;
var legend;
var infoBox;
var attrs;
var c;
var first = true;


// Define function to create map
function createMap(countries){

    // Map tiles
    var base = L.tileLayer('https://stamen-tiles.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg', {
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>)',
        minZoom: 3,
        maxZoom: 6,
        noWrap: true    
    });

    // Create map
    myMap = L.map("map", {
        center: [16, 8],
        zoom: 3,
        layers: [base, countries],
        maxBounds: [[190, -190], [-190, 190]]
    });

    // Call function to create buttons
    createButtons();

    // Create info box to display results for song attributes by country
    infoBox = L.control({position: 'bottomleft'});
    infoBox.onAdd = function(){
        var div2 = L.DomUtil.create('div', 'info');
        div2.innerHTML += '<h2>Song Attribute Popularity Ranking</h2>\
        <h1><div id="this_country">Country Details</div></h1>\
        <h4><div id="attrs">Click a country for more info...</div></h4>';
        return div2;
    };
    // Add info box to map
    infoBox.addTo(myMap);
};


// Define function to create interactive buttons for song attributes
function createButtons(){

    // Add button to switch between map page & main dashboard
    d3.select('#top').append('a').property('href', '/')
    .property('id', 'home')
    .text('Back to Dashboard Page');

    // Add title
    d3.select('#top').append('h1').property('id', 'pageTitle')
        .text('Song Attribute Popularity by Country (Top 50 Songs)')

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
    };
};


// Define function to update map on button clicks
function updateMap(countries, att){

    // Remove previous legend if exists
    if(!first){
        legend.remove(myMap);
    };

    // Define new legend
    legend = L.control({position: 'topright'});
    legend.onAdd = function(){
        var div = L.DomUtil.create('div', 'legend')
        var limits = countries.options.limits;
        var colors = countries.options.colors;
        var labels = [];

        // Create legend labels
        div.innerHTML = '<h2 id="legendTitle">'+ att +'</h2><p>' + attDeets[att] + '</p><div class="labels"><div class="min">' + parseFloat(limits[0]).toFixed(2) + '</div> \
        <div class="max">' + parseFloat(limits[limits.length - 1]).toFixed(2) + '</div></div>';

        // Add legend colors & return div
        limits.forEach(function (limit, index) {
            labels.push('<li style="background-color: ' + colors[index] + '"></li>');
        });
        div.innerHTML += '<ul>' + labels.join('') + '</ul>';
        return div;
    };
    // Add legend to map
    legend.addTo(myMap);
    
    // Remove previous layer
    myMap.removeLayer(c);
    
    // Add requested choropleth
    myMap.addLayer(countries);

    // Save this layer to remove on the next round
    c = countries;

    // Note that we are not on the first round anymore
    first = false;
};


// Define function to convert country data to table format
function createTable(data){

    // Store column names
    var columns = ['attribute', 'value', 'average'];

    // Create table and sections
    var table = d3.select('#attrs').append('table');
	var thead = table.append('thead');
	var	tbody = table.append('tbody');

	// Append the header row
	thead.append('tr').selectAll('th')
        .data(columns).enter().append('th')
	    .text(column => column);

	// Create a row for each object in the data
	var rows = tbody.selectAll('tr')
	  .data(data).enter().append('tr');

	// Create a cell in each row for each column
	var cells = rows.selectAll('td').data(function (row) {
	    return columns.map(function (column) {
	      return {column: column, value: row[column]};
	    })
	  }).enter().append('td').text(d => d.value)
    
    // Rename columns
    thead.selectAll('th').text(function(column){
        if(column === 'attribute'){
            return ' '
        } else if (column === 'value'){
            return 'This Country (Top 50)'
        } else {
            return 'All Countries (All Songs)'
        }
    });

    // Empty array
    var thisOne = [];
    // All rows data
    var trs = d3.selectAll('tr').data();

    // Iterate through rows
    for(t = 1; t < trs.length; t++){

        // Get numeric values of each attribute
        var val1 = parseFloat(trs[t].value);
        var val2 = parseFloat(trs[t].average);

        // Compare to see which is greater & push result to our array
        if(val2 > val1){
            thisOne.push(false);
        } else if(val1 > val2){
            thisOne.push(true);
        } else {
            thisOne.push(null);
        }
    }

    // Iterate through array
    for(i = 0; i < thisOne.length; i++){

        // Get each row's element
        var row = document.getElementsByTagName('tr')[i+1];

        // Skip null values (where both items are equal)
        if(thisOne[i] === null){

        // If true, our country has a higher value
        } else if(thisOne[i]){

            // Color the first value blue & second gold
            row.cells[1].style.color = 'dodgerblue'
            row.cells[2].style.color = 'goldenrod'

        // If false, our country has the lower value
        } else if(!thisOne[i]){

            // Color the first gold and the second blue
            row.cells[1].style.color = 'goldenrod'
            row.cells[2].style.color = 'dodgerblue'
        }
    }    
};


// Define function to draw country borders
function createMarkers(polys, att) {

    var country = '';
    var clickd = '';
    var held;

    // Function to choose color of highlighted country on mouseover
    var highlight = function(){
        if(att === null){
            return 'orange' 
        } else if(att === attrs[0] || att === attrs[1] || att === attrs[2]){
            return 'yellow'
        } else if(att === attrs[3] || att === attrs[4]){
            return 'lime'
        } else {
            return 'aqua'
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

            // Change China to Hong Kong
            if(country === 'China'){
                country = 'Hong Kong'
            }

            // Append mouseover country to top of infobox
            // (instead of popup as these do not populate nicely on the map)
            var container = infoBox.getContainer();
            const titleNode = document.createElement('h2');
            titleNode.setAttribute('id', 'cntry');
            const nodeText = document.createTextNode(country);
            titleNode.appendChild(nodeText);
            container.insertBefore(titleNode, container.children[0]);
            // Add divider
            d3.select('#cntry').append('hr');

        });

        // Mouseout function
        layer.on('mouseout', function(e){
            if(this.feature.properties.ADMIN !== clickd){

                // Reset style if not clicked on
                borders.resetStyle(this);
            } else {

                // Save highlighted country if clicked on
                held = this;
            }
            // Remove appended "popup" country name from infobox
            document.getElementById('cntry').remove()
        });

        // Show country's song attribute info in info box on mouse click
        layer.on('click', function(c){
            if(held){

                // If already a country highlighted, remove it
                borders.resetStyle(held);
            }
        
            // Set this to be our selected country & bring to front, outline
            clickd = feature.properties.ADMIN;
            this.bringToFront()
            this.setStyle({
                color: 'white',
                weight: 3
            });

           // Pass country clicked on to Flask to get our song attribute data
            let url = `/countries/${clickd}`

            // Convert reponse to json
            fetch(url).then(response => response.json())
            .then((json) => {

                let stats = json

                // If response is not blank, country is in our dataset
                if(stats[0] !== undefined){

                    
                    if(clickd === 'China'){

                        // If response is China, add disclaimer
                        document.getElementById('attrs').innerHTML = '(Spotify blocked in mainland China, data is for Hong Kong ONLY)<br><br><hr><br>'
                        document.getElementById('this_country').innerHTML = 'Hong Kong'
                    } else {

                        // Remove previous data & add new country name + border
                        document.getElementById('attrs').innerHTML = '';
                        document.getElementById('this_country').innerHTML = clickd + '<hr>'
                    }

                    // Sort data by greatest difference descending & run create table function to display
                    var sortd = json.sort((a, b) => Math.abs(b.average - b.value) - Math.abs(a.average - a.value));
                    createTable(sortd);
                }
                else {

                    // Country is not in our dataset, display country name & default message
                    document.getElementById('attrs').innerHTML = `No Spotify data for ${clickd}, please try another country.`
                    document.getElementById('this_country').innerHTML = clickd  
                }
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
        
        // Save layer to variable to remove in case user clicks a country before an attribute button
        c = borders;
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

    // Convert response to json
    fetch(url).then(response => response.json())
    .then(json => {

        // Create copy of country polygon data
        let joinedGJ = JSON.parse(JSON.stringify(countryData));

        // Iterate through geojson
        for (let i = 0; i < joinedGJ.features.length; i++){
            const properties = joinedGJ.features[i].properties

            // Append matching countries values if found
            joinedGJ.features[i].properties = {
                ...properties,
                ...json.find((item) => item.country === properties.ADMIN),
            }
        }

        // Update choropleth & legend w/new attribute
        createMarkers(joinedGJ, attribute);
    });
};
