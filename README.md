# COVID-19 data

This repository contains COVID-19 data in JSON format.


## API

The dataset contains the number of confirmed cases, the number of recoveries, and the number of deaths, both daily and cumulative values, and both exact values and values for one million inhabitants.

You can fetch the data using HTTP.


### Counties and provinces

The countries and provinces the data is available for are listed in `data/countries.json`.

This file contains a JSON object with only one key `countriesAndProvinces` which is an array of objects which describe a country or province, including its slug, which is used in the file names that contain data for that specific country or province.

A province’s slug is always prefixed with its country’s slug, and `--` is used as a delimiter.

An object which describes a country looks like:

```json
{
  "slug": "canada",
  "name": "Canada",
  "population": 37742154,
  "latitude": 56.1304,
  "longitude": 106.3468
}
```

An object which describes a province looks like:

```json
{
  "slug": "canada--ontario",
  "name": "Canada",
  "province": "Ontario",
  "latitude": 51.2538,
  "longitude": -85.3232,
  "population": 14446515
}
```

You can fetch the data contained in this file by sending a `GET` request to:

```
https://raw.githubusercontent.com/bence-toth/covid-data/main/data/countries.json
```

For example:

```js
fetch('https://raw.githubusercontent.com/bence-toth/covid-data/main/data/countries.json')
  .then(response => response.json())
  .then(result => {
    console.log(result.countriesAndProvinces)
  })
```
### Confirmed cases

### Deaths

### Recoveries

## Acknowledgments

The data is fetched from [the GitHub repository](https://github.com/CSSEGISandData/COVID-19) of the 2019 Novel Coronavirus Visual Dashboard, which is operated by the Johns Hopkins University Center for Systems Science and Engineering, and it is updated daily.

## License

Licensed under [MIT](./LICENSE). Do what you will.