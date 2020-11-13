const fetch = require('node-fetch')
const parse = require('csv-parse')
const fs = require('fs')

const parser = parse({
  delimiter: ','
})

const output = []

const sourceFile = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv'

const slugify = string => string.replace(/\s+/g, '-').toLowerCase().replace(/[^a-z-]+/g, "")

const generateSlug = ({country, province}) => {
  if (!province.length) {
    return slugify(country)
  }
  else {
    return slugify(`${country}--${province}`)
  }
}

let isHeaderRow = true

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

fetch(sourceFile)
  .then(response => response.text())
  .then(data => {
    parser.on('readable', () => {
      let record
      while (record = parser.read()) {
        if (!isHeaderRow) {
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
          isHeaderRow = false
        }
      }
    })

    parser.on('end', () => {
      output.slice(10).forEach(countryData => {
        const {slug, deaths} = countryData
        fs.writeFileSync(`data/${slug}.json`, JSON.stringify({
          cumulativeDeaths: deaths,
          dailyDeaths: calculateDailyData(deaths)
        }));
      })
    })

    parser.write(data)
    parser.end()
  })
