data_url = 'https://api.covid19india.org/v4/min/data.min.json'
ts_url = 'https://api.covid19india.org/v4/min/timeseries.min.json'
topo_url = 'https://www.covid19india.org/mini_maps/india.json'
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
fetch(topo_url).then(data => data.json()).then((data) => {
    console.log(data)
    raw_data = data
    // get_nation_totals(data)
    // init_vue_app(data)
    draw_map(data)
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
                delta: '+' + data["TT"]['delta'].confirmed,
                total: data['TT']['total'].confirmed,
                chart_id: 'tt_confirmed_trend'
            }, {
                title: 'Recovered',
                delta: '+' + data["TT"]['delta'].recovered,
                total: data['TT']['total'].recovered,
                chart_id: 'tt_recovered_trend'
            }, {
                title: 'Deceased',
                delta: '+' + data["TT"]['delta'].deceased,
                total: data['TT']['total'].deceased,
                chart_id: 'tt_deceased_trend'
            }, {
                title: 'Active',
                delta: "\n",
                total: data['TT']['total'].confirmed - data['TT']['total'].recovered - data['TT']['total'].deceased,
                chart_id: 'tt_active_trend'
            }]
        }
    })
}


function shorten_data_array(array, skipValue) {
    temp = []
    for (i = 0; i < array.length; i++) {
        if (i % skipValue == 0) {
            temp.push(array[i])
        }
    }
    return temp
}

function draw_trends(data) {
    india_data = data['TT']['dates']
    confirmed = []
    recovered = []
    deceased = []
    active = []
    delta = []
    dates = Object.keys(india_data)
    for (i = 0; i < dates.length; i++) {
        confirmed.push(india_data[dates[i]]['total'].confirmed)
        recovered.push(india_data[dates[i]]['total'].recovered)
        deceased.push(india_data[dates[i]]['total'].deceased)
        active.push(india_data[dates[i]]['total'].active)
        if (india_data[dates[i]]['delta'].confirmed) {
            delta.push(india_data[dates[i]]['delta'].confirmed)
        } else {
            delta.push(india_data[dates[i]]['delta'].confirmed)
        }
        // delta.push(india_data[dates[i]]['delta7'].confirmed)
    }

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
        scales: {
            x: {
                display: false
            },
            y: {
                // type: 'linear',
                display: false
            }
        }
    }

    // dates = shorten_data_array(dates, 30)
    // confirmed = shorten_data_array(confirmed, 30)
    // recovered = shorten_data_array(recovered, 30)
    // deceased = shorten_data_array(deceased, 30)
    // // deceased = shorten_data_array(deceased, 30)
    // delta = shorten_data_array(delta, 30)
    chart_data = {
        // labels: dates.slice(dates.length-180,dates.length),
        labels: dates,
        datasets: [{
            // data: confirmed.slice(dates.length-180,dates.length),
            // data: confirmed,
            data: confirmed,
            borderColor: 'rgb(75, 192, 192)',
            //cubicInterpolationMode: 'monotone',
            tension: 0,
            // // fill: true,
            // stepped: true
        }]
    }

    chart_data1 = {
        labels: dates,
        datasets: [{
            data: recovered,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0,
        }]
    }
    chart_data2 = {
        labels: dates,
        datasets: [{
            data: deceased,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0,
        }]
    }
    var ctx = document.getElementById('tt_confirmed_trend')
    var confimedChart = new Chart(ctx, {
        type: 'line',
        data: chart_data,
        options: chart_options
    })

    var ctx = document.getElementById('tt_recovered_trend')
    var recoveredChart = new Chart(ctx, {
        type: 'line',
        data: chart_data1,
        options: chart_options
    })

    var ctx = document.getElementById('tt_deceased_trend')
    var deceasedChart = new Chart(ctx, {
        type: 'line',
        data: chart_data2,
        options: chart_options
    })
}

function draw_map(data){


    // var ctx = document.getElementById('india_topo')
    // var deceasedChart = new Chart(ctx, {
    //     type: 'line',
    //     data: chart_data2,
    //     options: chart_options
    // })

    const chart = new Chart(document.getElementById('india_topo').getContext('2d'), {
        type: 'bubbleMap',
        data: {
        //   labels: data.map((d) => d.description),
          datasets: [
            {
              outline: data.objects.states,
              showOutline: true,
              backgroundColor: 'steelblue',
            //   data: data.map((d) => Object.assign(d, { value: Math.round(Math.random() * 10) })),
            //data: data.objects.states
            },
          ],
        },
        options: {
          plugins: {
            legend: {
              display: false,
            },
          },
          // plugins: {
          //   datalabels: {
          //     align: 'top',
          //     formatter: (v) => {
          //       return v.description;
          //     },
          //   },
          // },
          layout: {
            // padding: 20
          },
          scales: {
            xy: {
              projection: 'albersUsa',
            },
            r: {
              size: [1, 20],
              mode: 'area',
            },
          },
        },
      })
}