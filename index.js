const fetch = require('node-fetch')
const parse = require('csv-parse')
const fs = require('fs')

const output = []

const sourceFiles = {
  deaths: 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv',
  confirmed: 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv',
  recovered: 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv'
}

const slugify = string => string.replace(/\s+/g, '-').toLowerCase().replace(/[^a-z-]+/g, "")

const generateSlug = ({country, province}) => {
  if (!province.length) {
    return slugify(country)
  }
  else {
    return slugify(`${country}--${province}`)
  }
}

let isDeathsHeaderRow = true
let isConfirmedHeaderRow = true

const calculateDailyData = data => {
  const dailyData = []
  for (let i = data.length - 1; i > 0; --i) {
    if (data[i - 1] > data[i]) {
      data[i - 1] = data[i]
    }
    dailyData.unshift(data[i] - data[i-1])
  }
  dailyData.unshift(data[0])
  return dailyData
}

const requests = [
  fetch(sourceFiles.deaths)
    .then(response => response.text()),
  fetch(sourceFiles.confirmed)
    .then(response => response.text())
]

Promise.all(requests)
  .then(([deaths, confirmed]) => {
    const deathsParser = parse({
      delimiter: ','
    })

    deathsParser.on('readable', () => {
      let record
      while (record = deathsParser.read()) {
        if (!isDeathsHeaderRow) {
          const slug = generateSlug({
            province: record[0],
            country: record[1]
          })
          output.push({
            slug,
            deaths: record.slice(4).map(Number)
          })
        }
        else {
          isDeathsHeaderRow = false
        }
      }
    })

    deathsParser.write(deaths)
    deathsParser.end()

    const confirmedParser = parse({
      delimiter: ','
    })

    confirmedParser.on('readable', () => {
      let record
      while (record = confirmedParser.read()) {
        if (!isConfirmedHeaderRow) {
          const slug = generateSlug({
            province: record[0],
            country: record[1]
          })
          output.forEach(country => {
            if (country.slug === slug) {
              country.confirmed = record.slice(4).map(Number)
            }
          })
        }
        else {
          isConfirmedHeaderRow = false
        }
      }
    })

    confirmedParser.on('end', () => {
      output.forEach(countryData => {
        const {slug, deaths, confirmed} = countryData
        fs.writeFileSync(`data/${slug}.json`, JSON.stringify({
          cumulativeDeaths: deaths,
          dailyDeaths: calculateDailyData(deaths),
          confirmedCases: confirmed,
          dailyConfirmedCases: calculateDailyData(confirmed),
        }));
      })
    })

    confirmedParser.write(confirmed)
    confirmedParser.end()
  })
