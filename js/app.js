data_url = 'https://api.covid19india.org/v4/min/data.min.json'
ts_url = 'https://api.covid19india.org/v4/min/timeseries.min.json'
raw_data = []
fetch(data_url).then(data => data.json()).then((data) => {
    console.log(data)
    raw_data = data
    // get_nation_totals(data)
    init_vue_app(data)
})
fetch(ts_url).then(data => data.json()).then((data) => {
    console.log(data)
    raw_data = data
    // get_nation_totals(data)
    // init_vue_app(data)
    draw_trends(data)
})

function get_nation_totals(data) {
    confirmed = 0
    active = 0
    recovered = 0
    deceased = 0
    tested = 0

    states = Object.keys(data)

    for (i = 0; i < states.length; i++) {
        confirmed += parseInt(data[states[i]]['total'].confirmed)
        recovered += parseInt(data[states[i]]['total'].recovered)
        deceased += parseInt(data[states[i]]['total'].deceased)
        tested += parseInt(data[states[i]]['total'].tested)
        console.log(states[i], data[states[i]]['total'])
    }
    console.log("c " + confirmed + " r " + recovered + " d " + deceased + " t " + tested)
}

function init_vue_app(data) {

    var app_counter = new Vue({
        el: "#overall_counter",
        data: {
            overall_stats: [{
                title: 'Confirmed cases',
                delta: data["TT"]['delta'].confirmed,
                total: data['TT']['total'].confirmed,
                chart_id: 'tt_confirmed_trend'
            }, {
                title: 'Recovered',
                delta: data["TT"]['delta'].recovered,
                total: data['TT']['total'].recovered
            }, {
                title: 'Deceased',
                delta: data["TT"]['delta'].deceased,
                total: data['TT']['total'].deceased
            }, {
                title: 'Active',
                delta: "\n",
                total: data['TT']['total'].confirmed - data['TT']['total'].recovered - data['TT']['total'].deceased
            }]
        }
    })
}

function draw_trends(data) {
    india_data = data['TT']['dates']
    confirmed = []
    
    dates = Object.keys(india_data)
    for (i = 0; i < dates.length; i++) {
        confirmed.push(india_data[dates[i]]['total'].confirmed)
    }

    // We are setting a few options for our chart and override the defaults
    var options = {
        // Don't draw the line chart points
        showPoint: false,
        // Disable line smoothing
        lineSmooth: false,
        // X-Axis specific configuration
        axisX: {
            // We can disable the grid for this axis
            showGrid: false,
            // and also don't show the label
            showLabel: false
        },
        // Y-Axis specific configuration
        axisY: {
            // Lets offset the chart a bit from the labels
            // offset: 60,
            // The label interpolation function enables you to modify the values
            // used for the labels on each axis. Here we are converting the
            // values into million pound.
            // We can disable the grid for this axis
            showGrid: false,
            // and also don't show the label
            showLabel: false,
            scale: 'log',
            //   labelInterpolationFnc: function(value) {
            //     return '$' + value + 'm';
            //   }
        }
    };

    // // Initialize a Line chart in the container with the ID chart1
    // new Chartist.Line('#tt_confirmed_trend', {
    // //   labels: [1, 2, 3, 4],
    //   series: [confirmed]
    // }, options);
    chart_options = {
        responsive: false,
        plugins: {
            legend: {
                display: false
            },
        },        
        elements: {
            line: {
                borderColor: '#FF0000',
                borderWidth: 1
            },
            point: {
                radius: 0
            }
        },
        tooltips: {
            enabled: false
        },
        // scales: {
        //     yAxes: [{
        //         display: false
        //     }],
        //     xAxes: [{
        //         display: false
        //     }]
        // }
        scales: {
            x: {
                display: false
            },
            y: {
                display: false
            }
        }
    }
    chart_data = {
        // labels: dates.slice(dates.length-180,dates.length),
        labels: dates,
        datasets: [{           
            // data: confirmed.slice(dates.length-180,dates.length),
            data: confirmed,
            borderColor: 'rgb(75, 192, 192)',
            //tension: -1
        }]
    }
    // chart_data = {
    //     labels: dates,
    //     datasets: [{
    //       label: 'My First Dataset',
    //       data: confirmed,
    //       fill: false,
    //       borderColor: 'rgb(75, 192, 192)',
    //       //tension: 0.0
    //     }]
    //   };
    var ctx = document.getElementById('tt_confirmed_trend')
    var myLineChart = new Chart(ctx, {
        type: 'line',
        data: chart_data,
        options: chart_options
    });
}