
d3.csv('artist_genres.csv').then(function(data){
    let genres = {};
    data.map((item) => {genres[item.artist_names] = item.artist_genre})
    console.log(genres);
    let topGenres = Object.values(genres).slice(0, 20);
    let topArtists = Object.keys(genres).slice(0, 20);


    bub = [{
        x: topGenres,
        y: topArtists,
        mode: 'markers',
        marker: {
            size: topGenres.map(item => item.length * 5),
            color: topArtists.map(item => item.length),
            colorscale: "Viridis"
        }
    }]

    layout = {
        height: 600, 
        width: 1000,
        margin: {
            l: 250,
            t: 0
        }
    }

    Plotly.newPlot('graph2', bub, layout);

});

d3.select('#graph1').text('Meaningless Test Graph');

function clickFunc(){
    console.log('You clicked me!')
}