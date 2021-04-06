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
    // draw_map(data)-
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
        responsive: true,
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

const STATE_NAMES = {
    AP: 'Andhra Pradesh',
    AR: 'Arunachal Pradesh',
    AS: 'Assam',
    BR: 'Bihar',
    CT: 'Chhattisgarh',
    GA: 'Goa',
    GJ: 'Gujarat',
    HR: 'Haryana',
    HP: 'Himachal Pradesh',
    JH: 'Jharkhand',
    KA: 'Karnataka',
    KL: 'Kerala',
    MP: 'Madhya Pradesh',
    MH: 'Maharashtra',
    MN: 'Manipur',
    ML: 'Meghalaya',
    MZ: 'Mizoram',
    NL: 'Nagaland',
    OR: 'Odisha',
    PB: 'Punjab',
    RJ: 'Rajasthan',
    SK: 'Sikkim',
    TN: 'Tamil Nadu',
    TG: 'Telangana',
    TR: 'Tripura',
    UT: 'Uttarakhand',
    UP: 'Uttar Pradesh',
    WB: 'West Bengal',
    AN: 'Andaman and Nicobar Islands',
    CH: 'Chandigarh',
    DN: 'Dadra and Nagar Haveli and Daman and Diu',
    DL: 'Delhi',
    JK: 'Jammu and Kashmir',
    LA: 'Ladakh',
    LD: 'Lakshadweep',
    PY: 'Puducherry',
    TT: 'India',
    // [UNASSIGNED_STATE_CODE]: 'Unassigned',
}

function draw_map(stat_data) {

    // const svg = d3.select('#india_topo')
    // .append("svg")
    // .attr("viewBox", [0, 0, 975, 610]);
    india_map = []
    // d3.json('https://www.covid19india.org/mini_maps/india.json', function (india_map) {

    //     var path = d3.geoPath()

    //     svg.append('g')
    //         .selectAll('path')
    //         .data(topojson.feature(india_map, india_map.objects.states).features)
    //         .enter().append("path")
    //         .attr("d", path)

    //     svg.append("path")
    //         .datum(topojson.mesh(india_map, india_map.objects.states, function (a, b) {
    //             return a !== b;
    //         }))
    //         .attr("class", "states")
    //         .attr("d", path)
    // })

    var width = 960,
        height = 480;

    var svg = d3.select("#india_topo").append("svg")
        .attr("width", width)
        .attr("height", height);

    var projection = d3.geo.equirectangular()
        .scale(153)
        .translate([width / 2, height / 2])
        .precision(.1);

    var path = d3.geo.path()
        .projection(projection);

    d3.json("https://www.covid19india.org/mini_maps/india.json", function (error, topology) {
        if (error) throw error;

        // svg.append("path")
        //     .datum(topojson.feature(topology, topology.objects.states))
        //     .attr("d", path)
        //     // .attr("d", d3.geo.path().projection(d3.geo.mercator()))
        //     .attr("class", "land-boundary");
        svg.append("g")
            .selectAll("path")
            .data( topojson.feature(topology, topology.objects.states).features)
            .enter()
            .append("path")
            .attr( "d", path )
            .attr("class","county"); 

    });
}

function draw_chartjs_map() {
    fetch('https://www.covid19india.org/mini_maps/india.json').then((r) => r.json()).then((data) => {
        const countries = ChartGeo.topojson.feature(data, data.objects.states).features;

        const chart = new Chart(document.getElementById("india_topo").getContext("2d"), {
            type: 'choropleth',
            data: {
                labels: countries.map((d) => d.properties.st_nm),
                datasets: [{
                    label: 'Countries',
                    data: countries.map((d) => ({
                        feature: d,
                        // value: Math.random()
                    })),
                }]
            },
            options: {
                showOutline: true,
                showGraticule: true,
                legend: {
                    display: false
                },
                scale: {
                    // projection: 'equalEarth'
                },
                geo: {
                    colorScale: {
                        display: true,
                    },
                },
            }
        });
    });
}