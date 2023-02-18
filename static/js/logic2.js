const initUrl = 'http://127.0.0.1:5000/api/v1.0/tobs'
fetch(initUrl).then(response =>response.json()).then(function(json){

    console.log(json);
    //document.getElementById('graph2').innerHTML = JSON.stringify(json);
    let date = json[0].Date;
    let temp = json[0].Temp;
    console.log(`Date: ${date}, Temp: ${temp}`);

    let sample = json.slice(0, 20).sort((a, b) => b.Temp - a.Temp);
    console.log(sample);
    let y = sample.map(item => item.Date);
    let x = sample.map(item => item.Temp);
    console.log(x, y);

    initplot = [{
        x: x,
        y: y,
        type: 'bar',
        orientation: 'h'
    }]

    initbub = [{
        x: y,
        y: x,
        mode: 'markers',
        marker: {
            color: x,
            size: x,
            colorscale: 'Viridis'
        }
    }]
    Plotly.newPlot('graph2', initplot);
    Plotly.newPlot('graph3', initbub);

});



function clickFunc(){
    console.log('You clicked me!')
}

function searchTemp(){
    console.log('Searching...')
    //let value = document.getElementById('year').value;
    let url = `http://127.0.0.1:5000/api/v1.0/${'1993-02-18'}`
    fetch(url).then(response => response.json())
    .then(json => {console.log(json);
    document.getElementById('graph1').innerHTML = JSON.stringify(json)});
}
