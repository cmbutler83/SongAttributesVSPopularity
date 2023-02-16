

function createMap(countries){

    var base = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    var myMap = L.map("map", {
        center: [0, 12],
        zoom: 3,
        layers: [base]
    });

    attrs = ['danceability', 'energy', 'loudness', 'speechiness', 'acousticness', 'instrumentalness', 'valence', 'tempo', 'duration'];
    for(i=0; i<attrs.length; i++){
        attr = attrs[i];
        d3.select('#attributes').append('button').text(attr).property('value', attr.toString());
    }

}

function createMarkers(polys) {
    console.log(polys);


    
    createMap(countries);
}

var polys = 'static/js/countries.geojson'
d3.json(polys).then(createMarkers);