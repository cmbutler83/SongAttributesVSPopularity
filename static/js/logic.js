

function createMap(countries){

    var base = L.tileLayer('https://stamen-tiles.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg', {
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>)'
    })

    var myMap = L.map("map", {
        center: [10, 0],
        zoom: 3,
        layers: [base, countries]
    });
    createButtons();

}

function createButtons(){
    attrs = ['danceability', 'energy', 'loudness', 'speechiness', 'acousticness', 'instrumentalness', 'valence', 'tempo', 'duration'];
    for(i=0; i<attrs.length; i++){
        attr = attrs[i];
        d3.select('#attributes').append('button').text(attr).property('value', attr.toString());
    }
}

function createMarkers(polys) {
    console.log(polys);
    var borders = L.geoJSON(polys.features, {
        color: 'saddlebrown',
        weight: 1
    });
    createMap(borders);
}

var polys = 'static/js/countries.geojson'
d3.json(polys).then(createMarkers);