data_url = 'https://api.covid19india.org/v4/min/data.min.json'
ts_url = 'https://api.covid19india.org/v4/min/timeseries.min.json'
topo_url = 'https://www.covid19india.org/mini_maps/india.json'
raw_data = []
raw_data2 = []
india_map = []
raw_map = []
fetch(data_url).then(data => data.json()).then((data) => {
    console.log(data)
    raw_data = data
    // get_nation_totals(data)
    init_vue_app(data)
    draw_map(data)
})
fetch(ts_url).then(data => data.json()).then((data) => {
    console.log(data)
    raw_data2 = data
    // get_nation_totals(data)
    // init_vue_app(data)
    draw_trends(data)
})
fetch(topo_url).then(data => data.json()).then((data) => {
    console.log(data)
    raw_map = data
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

    var vue_state_data = []
    states = Object.keys(data)

    for (i = 0; i < states.length; i++) {
        if (states[i] != 'TT')
            vue_state_data.push({
                name: STATE_NAMES[states[i]],
                confirmed: data[states[i]]['total'].confirmed,
                confirmed_delta: data[states[i]]['delta'] ? data[states[i]]['delta'].confirmed ? '+' + data[states[i]]['delta'].confirmed : "" : "",
                deceased: data[states[i]]['total'].deceased,
                deceased_delta: data[states[i]]['delta'] ? data[states[i]]['delta'].deceased ? '+' + data[states[i]]['delta'].deceased : "" : "",
                active: (data[states[i]]['total'].confirmed - data[states[i]]['total'].recovered - data[states[i]]['total'].deceased),
                active_delta: data[states[i]]['delta'] ? isNaN((data[states[i]]['delta'].confirmed - data[states[i]]['delta'].recovered - data[states[i]]['delta'].deceased)) ? "" : '+' + (data[states[i]]['delta'].confirmed - data[states[i]]['delta'].recovered - data[states[i]]['delta'].deceased) : "",
                recovered: data[states[i]]['total'].recovered,
                recovered_delta: data[states[i]]['delta'] ? data[states[i]]['delta'].recovered ? '+' + data[states[i]]['delta'].recovered : "" : "",

                // name: STATE_NAMES[states[i]],
                // confirmed: data[states[i]]['total'].confirmed,
                // confirmed_delta: data[states[i]]['delta7'] ? data[states[i]]['delta7'].confirmed ? '+' + data[states[i]]['delta7'].confirmed : "" : "",
                // deceased: data[states[i]]['total'].deceased,
                // deceased_delta: data[states[i]]['delta7'] ? data[states[i]]['delta7'].deceased ? '+' + data[states[i]]['delta7'].deceased : "" : "",
                // active: data[states[i]]['total'].confirmed - data[states[i]]['total'].recovered - data[states[i]]['total'].deceased,
                // active_delta: data[states[i]]['delta7'] ? '+' + (data[states[i]]['delta7'].confirmed - data[states[i]]['delta7'].recovered - data[states[i]]['delta7'].deceased) : "",
                // recovered: data[states[i]]['total'].recovered,
                // recovered_delta: data[states[i]]['delta7'] ? data[states[i]]['delta7'].recovered ? '+' + data[states[i]]['delta7'].recovered : "" : "",
            })
    }

    // console.log('vue data', vue_state_data)
    var state_data_table = new Vue({
        el: '#state_data_table',
        data: {
            state_data: vue_state_data
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
        active.push(india_data[dates[i]]['total'].confirmed - india_data[dates[i]]['total'].deceased - india_data[dates[i]]['total'].recovered)
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
            borderColor: 'rgb(229, 67, 60)',
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
            borderColor: 'rgb(97, 217, 124)',
            tension: 0,
        }]
    }
    chart_data2 = {
        labels: dates,
        datasets: [{
            data: deceased,
            borderColor: 'rgb(158, 150, 137)',
            tension: 0,
        }]
    }
    chart_data3 = {
        labels: dates,
        datasets: [{
            data: active,
            borderColor: 'rgb(51, 162, 255)',
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

    var ctx = document.getElementById('tt_active_trend')
    var deceasedChart = new Chart(ctx, {
        type: 'line',
        data: chart_data3,
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


function draw_map3(stat_data) {
    var width = 600,
        height = 800;

    var projection = d3.geo.mercator()
        .center([83, 23])
        // .rotate([180, -180])
        .scale(1200)
        .translate([width / 2, height / 2]);

    var svg = d3.select("#india_topo2").append("svg")
        .attr("width", width)
        .attr("height", height)

    var path = d3.geo.path()
        .projection(projection);

    var g = svg.append("g");

    states = Object.keys(stat_data)
    district_wise_dist = []
    for (i = 0; i < states.length; i++) {
        if (stat_data[states[i]].hasOwnProperty('districts')) {
            temp_districts = Object.keys(stat_data[states[i]]['districts'])
            for (d = 0; d < temp_districts.length; d++) {
                district_wise_dist[temp_districts[d].toUpperCase()] = {
                    confirmed: stat_data[states[i]]['districts'][temp_districts[d]].total.confirmed,
                    deceased: stat_data[states[i]]['districts'][temp_districts[d]].total.deceased
                }
            }
        }
    }
    console.log(district_wise_dist)
    d3.json("/js/indiaTopoJSON.json", function (topology) {
        var features = topojson.feature(topology, topology.objects.asasas).features;
        var centroids = features.map(function (feature) {
            // console.log(feature.id)
            return {
                coord: path.centroid(feature),
                district: feature.properties.DISTRICT,
                value: district_wise_dist[feature.properties.DISTRICT] ? district_wise_dist[feature.properties.DISTRICT].confirmed : 0
            };
        })
        console.log(centroids)
        radius = d3.scale.sqrt().domain([0, d3.max(centroids, d => d.value)]).range([0, 50])

        g.selectAll("circle")
            .data(centroids)
            .enter()
            .append("circle")
            .attr("cx", function (d) {
                return d['coord'][0];
            })
            .attr("cy", function (d) {
                return d['coord'][1];
            })
            .attr("r", function (d) {
                // return d['value']/1e5;
                return radius(d['value'])
            })
            .style("fill", "red")
            .style("opacity", .5)

        g.selectAll("path")
            .data(topojson.feature(topology, topology.objects.asasas)
                .features)
            .enter().append("path")
            .attr("d", path);
    })



}

function draw_map(stat_data) {

    var width = 600,
        height = 800;

    var projection = d3.geo.mercator()
        .center([83, 23])
        .scale(1200)
        // .rotate([-180,0])
        .translate([width / 2, height / 2]);

    var svg = d3.select("#india_topo").append("svg")
        .attr("width", width)
        .attr("height", height);

    var path = d3.geo.path()
        .projection(projection);

    var g = svg.append("g");

    states = Object.keys(stat_data)
    district_wise_dist = []
    for (i = 0; i < states.length; i++) {
        if (stat_data[states[i]].hasOwnProperty('districts')) {
            temp_districts = Object.keys(stat_data[states[i]]['districts'])
            for (d = 0; d < temp_districts.length; d++) {
                district_wise_dist[temp_districts[d].toUpperCase()] = {
                    confirmed: stat_data[states[i]]['districts'][temp_districts[d]].total.confirmed,
                    deceased: stat_data[states[i]]['districts'][temp_districts[d]].total.deceased
                }
            }
        }
    }

    // load and display the World
    d3.json("js/ne_10m_admin_1_India_Official.json", function (topology) {

        d3.json("/js/indiaTopoJSON.json", function (topology) {
            var features = topojson.feature(topology, topology.objects.asasas).features;
            var centroids = features.map(function (feature) {
                // console.log(feature.id)
                return {
                    coord: path.centroid(feature),
                    district: feature.properties.DISTRICT,
                    value: district_wise_dist[feature.properties.DISTRICT] ? district_wise_dist[feature.properties.DISTRICT].confirmed : 0
                };
            })
            //console.log(centroids)
            radius = d3.scale.sqrt().domain([0, d3.max(centroids, d => d.value)]).range([0, 50])

            g.selectAll("circle")
                .data(centroids)
                .enter()
                .append("circle")
                .attr("cx", function (d) {
                    return d['coord'][0];
                })
                .attr("cy", function (d) {
                    return d['coord'][1];
                })
                .attr("r", function (d) {
                    // return d['value']/1e5;
                    return radius(d['value'])
                })
                .style("fill", "red")
                .style("stroke", "darkred")
                .style("stroke-width", 2)
                .style("opacity", .3)
        })

        // load and display the cities
        // d3.csv("cities.csv").then(function(data) {
        // console.log(topology)
        // india_map = topology
        // var features = topojson.feature(topology, topology.objects.ne_10m_admin_1_India_Official).features;
        // var centroids = features.map(function (feature) {
        //     // console.log(feature.properties.alias)
        //     if (feature.properties.alias == "DD") {
        //         feature.properties.alias = "DN"
        //     }
        //     // console.log(stat_data[feature.properties.alias].total.confirmed, path.centroid(feature))
        //     // console.log(feature.properties.alias, feature.properties.name)

        //     return {
        //         coord: path.centroid(feature),
        //         value: stat_data[feature.properties.alias].total.confirmed
        //     };
        // })

        // console.log(centroids)
        // radius = d3.scale.sqrt([0, d3.max(centroids, d => d.value)], [0, 100])
        // radius = d3.scale.sqrt().domain([0, d3.max(centroids, d => d.value)]).range([0, 50])
        // g.selectAll("circle")
        //     .data(centroids)
        //     .enter()
        //     .append("circle")
        //     //    .attr("cx", function(d) {
        //     //            return projection([d.lon, d.lat])[0];
        //     //    })
        //     //    .attr("cy", function(d) {
        //     //            return projection([d.lon, d.lat])[1];
        //     //    })
        //     .attr("cx", function (d) {
        //         return d['coord'][0];
        //     })
        //     .attr("cy", function (d) {
        //         return d['coord'][1];
        //     })
        //     .attr("r", function (d) {
        //         // return d['value']/1e5;
        //         return radius(d['value'])
        //     })
        //     .style("fill", "red")
        //     .style("opacity", .5)
        // });

        g.selectAll("path")
            .data(topojson.feature(topology, topology.objects.ne_10m_admin_1_India_Official)
                .features)
            .enter().append("path")
            .attr("d", path);

    })
}