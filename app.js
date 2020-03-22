global_stats = 'https://covid19.mathdro.id/api'


//fetch('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/03-03-2020.csv').then(response => response.text()).then(data => console.log(data));
corona_data = []
var cards = ['global_infected_card', 'global_recovered_card', 'global_death_card']
var cards_val = ['confirmed', 'recovered', 'deaths']

fetch(global_stats).then(response => response.json()).then(data => {

    console.log(data)
    corona_data = data
    d = new Date(data.lastUpdate)
    document.getElementById('last_updated').innerText = d.toLocaleString()
    i = 0
    cards.forEach(card_id => {
        updateCards(card_id, data[cards_val[i++]]['value'])
    })
})


function updateCards(card_id, card_value) {
    document.getElementById(card_id).querySelector('h2').innerText = card_value
}
confirmed_data = []
countries_data = []

function getIndexbycountry(corona_data, country_name) {
    for (i = 0; i < corona_data.length; i++) {
        if (corona_data[i].countryRegion === country_name) {
            return i
        }
    }
    return -1
}

function colorSelector(val, min, max) {
    colors = ['#8b0000', '#8f0c05', '#931509', '#971c0d', '#9c2311', '#a02915', '#a42f19', '#a8341d', '#ac3921', '#b03e25', '#b44429', '#b8492d', '#bc4d31', '#c05235', '#c45739', '#c85c3e', '#cc6142', '#d06646', '#d46b4a', '#d86f4e', '#dc7453', '#e07957', '#e47e5b', '#e8835f', '#ec8864', '#f08c68', '#f3916d', '#f79671', '#fb9b76', '#ffa07a']
    colors = colors.reverse()
    levels = []
    for (i = 0; i < colors.length; i++) {
        levels[i] = ((max - min) / colors.length) * i + min
    }
    // console.log(levels)
    for (i = 0; i < levels.length; i++) {
        if ((i + 1) !== levels.length && levels[i] < val && levels[i + 1] > val) {
            // console.log(levels[i])
            return colors[i]
        } else if (val > levels[levels.length - 1]) {
            return colors[colors.length - 1]
        } else if (val < levels[0]) {
            return '#ffffff'
        }
    }
}

function drawMap() {
    fetch('https://covid19.mathdro.id/api/confirmed').then(response => response.json()).then(data => {
        // console.log(data)
        confirmed_data = data


        fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-10m.json').then((r) => r.json()).then((data) => {
            const countries = ChartGeo.topojson.feature(data, data.objects.countries).features;
            // console.log(data)
            // console.log(countries)
            countries_data = countries

            confirmed_cases = []
            for (i = 0; i < countries.length; i++) {
                temp = 0
                for (j = 0; j < confirmed_data.length; j++) {
                    if (confirmed_data[j].countryRegion === countries[i].properties.name) {
                        temp += confirmed_data[j].confirmed
                    }
                }
                confirmed_cases.push(temp)
            }
            console.log(confirmed_cases)
            i = 0
            const chart = new Chart(document.getElementById("map_chart").getContext("2d"), {
                type: 'choropleth',
                data: {
                    labels: countries.map((d) => d.properties.name),
                    datasets: [{
                        label: 'Countries',
                        backgroundColor: (context) => {
                            if (context.dataIndex == null) {
                                return null;
                            }
                            const value = context.dataset.data[context.dataIndex];
                            // return new Color('red').lightness(value.value).rgbString();
                            return colorSelector(value.value, 100, 10000)
                        },

                        data: countries.map((d) => ({
                            feature: d,
                            value: confirmed_cases[i++]
                            // value: confirmed_cases[i++] / 1000
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
                        projection: 'equalEarth'
                    }
                }
            })
        })
    })

}