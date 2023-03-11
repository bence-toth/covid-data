# COVID-19 API

This repository contains COVID-19 data in JSON format.

## ⚠️ This dataset is no longer updated

On 10 March 2023 the Johns Hopkins Coronavirus Resource Center ceased its collecting and reporting of global COVID-19 data, and therefore this dataset is no longer updated.

For updated cases, deaths, and vaccine data please visit the following sources:

- Global: [World Health Organization (WHO)](https://www.who.int/)
- U.S.: [U.S. Centers for Disease Control and Prevention (CDC)](https://www.cdc.gov/coronavirus/2019-ncov/index.html)

For more information, visit the [Johns Hopkins Coronavirus Resource Center](https://coronavirus.jhu.edu/).

## API

The dataset contains the number of confirmed cases, the number of recoveries, and the number of deaths, both daily and cumulative values, and both exact values and values for one million inhabitants.

The first day of the dataset is 22 January 2020.

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
fetch(
  "https://raw.githubusercontent.com/bence-toth/covid-data/main/data/countries.json"
)
  .then((response) => response.json())
  .then((result) => {
    console.log(result.countriesAndProvinces);
  });
```

### Confirmed cases, daily

The daily confirmed cases for countries and provinces are available in the JSON files in the `data/confirmed/daily/exact/` folder.

These files contain a JSON object with only one key `dailyConfirmedCases` which is an array of numbers.

You can fetch the data contained in one of these files by sending a `GET` request to:

```
https://raw.githubusercontent.com/bence-toth/covid-data/main/data/confirmed/daily/exact/SLUG.json
```

Where `SLUG` is to be replaced with the slug of the country or province.

For example:

```js
fetch(
  "https://raw.githubusercontent.com/bence-toth/covid-data/main/data/confirmed/daily/exact/canada.json"
)
  .then((response) => response.json())
  .then((result) => {
    console.log(result.dailyConfirmedCases);
  });
```

### Confirmed cases per one million inhabitants, daily

The daily confirmed cases per one million inhabitants for countries and provinces are available in the JSON files in the `data/confirmed/daily/per-million/` folder.

These files contain a JSON object with only one key `dailyConfirmedCasesPerMillion` which is an array of numbers.

You can fetch the data contained in one of these files by sending a `GET` request to:

```
https://raw.githubusercontent.com/bence-toth/covid-data/main/data/confirmed/daily/per-million/SLUG.json
```

Where `SLUG` is to be replaced with the slug of the country or province.

For example:

```js
fetch(
  "https://raw.githubusercontent.com/bence-toth/covid-data/main/data/confirmed/daily/per-million/canada.json"
)
  .then((response) => response.json())
  .then((result) => {
    console.log(result.dailyConfirmedCasesPerMillion);
  });
```

### Confirmed cases, cumulative

The cumulative confirmed cases for countries and provinces are available in the JSON files in the `data/confirmed/cumulative/exact/` folder.

These files contain a JSON object with only one key `cumulativeConfirmedCases` which is an array of numbers.

You can fetch the data contained in one of these files by sending a `GET` request to:

```
https://raw.githubusercontent.com/bence-toth/covid-data/main/data/confirmed/cumulative/exact/SLUG.json
```

Where `SLUG` is to be replaced with the slug of the country or province.

For example:

```js
fetch(
  "https://raw.githubusercontent.com/bence-toth/covid-data/main/data/confirmed/cumulative/exact/canada.json"
)
  .then((response) => response.json())
  .then((result) => {
    console.log(result.cumulativeConfirmedCases);
  });
```

### Confirmed cases per one million inhabitants, cumulative

The cumulative confirmed cases per one million inhabitants for countries and provinces are available in the JSON files in the `data/confirmed/cumulative/per-million/` folder.

These files contain a JSON object with only one key `cumulativeConfirmedCasesPerMillion` which is an array of numbers.

You can fetch the data contained in one of these files by sending a `GET` request to:

```
https://raw.githubusercontent.com/bence-toth/covid-data/main/data/confirmed/cumulative/per-million/SLUG.json
```

Where `SLUG` is to be replaced with the slug of the country or province.

For example:

```js
fetch(
  "https://raw.githubusercontent.com/bence-toth/covid-data/main/data/confirmed/cumulative/per-million/canada.json"
)
  .then((response) => response.json())
  .then((result) => {
    console.log(result.cumulativeConfirmedCasesPerMillion);
  });
```

### Deaths, daily

The daily deaths for countries and provinces are available in the JSON files in the `data/died/daily/exact/` folder.

These files contain a JSON object with only one key `dailyDeaths` which is an array of numbers.

You can fetch the data contained in one of these files by sending a `GET` request to:

```
https://raw.githubusercontent.com/bence-toth/covid-data/main/data/died/daily/exact/SLUG.json
```

Where `SLUG` is to be replaced with the slug of the country or province.

For example:

```js
fetch(
  "https://raw.githubusercontent.com/bence-toth/covid-data/main/data/died/daily/exact/canada.json"
)
  .then((response) => response.json())
  .then((result) => {
    console.log(result.dailyDeaths);
  });
```

### Deaths per one million inhabitants, daily

The daily deaths per one million inhabitants for countries and provinces are available in the JSON files in the `data/died/daily/per-million/` folder.

These files contain a JSON object with only one key `dailyDeathsPerMillion` which is an array of numbers.

You can fetch the data contained in one of these files by sending a `GET` request to:

```
https://raw.githubusercontent.com/bence-toth/covid-data/main/data/died/daily/per-million/SLUG.json
```

Where `SLUG` is to be replaced with the slug of the country or province.

For example:

```js
fetch(
  "https://raw.githubusercontent.com/bence-toth/covid-data/main/data/died/daily/per-million/canada.json"
)
  .then((response) => response.json())
  .then((result) => {
    console.log(result.dailyDeathsPerMillion);
  });
```

### Deaths, cumulative

The cumulative deaths for countries and provinces are available in the JSON files in the `data/died/cumulative/exact/` folder.

These files contain a JSON object with only one key `cumulativeDeaths` which is an array of numbers.

You can fetch the data contained in one of these files by sending a `GET` request to:

```
https://raw.githubusercontent.com/bence-toth/covid-data/main/data/died/cumulative/exact/SLUG.json
```

Where `SLUG` is to be replaced with the slug of the country or province.

For example:

```js
fetch(
  "https://raw.githubusercontent.com/bence-toth/covid-data/main/data/died/cumulative/exact/canada.json"
)
  .then((response) => response.json())
  .then((result) => {
    console.log(result.cumulativeDeaths);
  });
```

### Deaths per one million inhabitants, cumulative

The cumulative deaths per one million inhabitants for countries and provinces are available in the JSON files in the `data/died/cumulative/per-million/` folder.

These files contain a JSON object with only one key `cumulativeDeathsPerMillion` which is an array of numbers.

You can fetch the data contained in one of these files by sending a `GET` request to:

```
https://raw.githubusercontent.com/bence-toth/covid-data/main/data/died/cumulative/per-million/SLUG.json
```

Where `SLUG` is to be replaced with the slug of the country or province.

For example:

```js
fetch(
  "https://raw.githubusercontent.com/bence-toth/covid-data/main/data/died/cumulative/per-million/canada.json"
)
  .then((response) => response.json())
  .then((result) => {
    console.log(result.cumulativeDeathsPerMillion);
  });
```

### Recoveries, daily

The daily recoveries for countries and provinces are available in the JSON files in the `data/recovered/daily/exact/` folder.

These files contain a JSON object with only one key `dailyRecoveredCases` which is an array of numbers.

You can fetch the data contained in one of these files by sending a `GET` request to:

```
https://raw.githubusercontent.com/bence-toth/covid-data/main/data/recovered/daily/exact/SLUG.json
```

Where `SLUG` is to be replaced with the slug of the country or province.

For example:

```js
fetch(
  "https://raw.githubusercontent.com/bence-toth/covid-data/main/data/recovered/daily/exact/canada.json"
)
  .then((response) => response.json())
  .then((result) => {
    console.log(result.dailyRecoveredCases);
  });
```

### Recoveries per one million inhabitants, daily

The daily recoveries per one million inhabitants for countries and provinces are available in the JSON files in the `data/recovered/daily/per-million/` folder.

These files contain a JSON object with only one key `dailyRecoveredCasesPerMillion` which is an array of numbers.

You can fetch the data contained in one of these files by sending a `GET` request to:

```
https://raw.githubusercontent.com/bence-toth/covid-data/main/data/recovered/daily/per-million/SLUG.json
```

Where `SLUG` is to be replaced with the slug of the country or province.

For example:

```js
fetch(
  "https://raw.githubusercontent.com/bence-toth/covid-data/main/data/recovered/daily/per-million/canada.json"
)
  .then((response) => response.json())
  .then((result) => {
    console.log(result.dailyRecoveredCasesPerMillion);
  });
```

### Recoveries, cumulative

The cumulative recoveries for countries and provinces are available in the JSON files in the `data/recovered/cumulative/exact/` folder.

These files contain a JSON object with only one key `cumulativeRecoveredCases` which is an array of numbers.

You can fetch the data contained in one of these files by sending a `GET` request to:

```
https://raw.githubusercontent.com/bence-toth/covid-data/main/data/recovered/cumulative/exact/SLUG.json
```

Where `SLUG` is to be replaced with the slug of the country or province.

For example:

```js
fetch(
  "https://raw.githubusercontent.com/bence-toth/covid-data/main/data/recovered/cumulative/exact/canada.json"
)
  .then((response) => response.json())
  .then((result) => {
    console.log(result.cumulativeRecoveredCases);
  });
```

### Recoveries per one million inhabitants, cumulative

The cumulative recoveries per one million inhabitants for countries and provinces are available in the JSON files in the `data/recovered/cumulative/per-million/` folder.

These files contain a JSON object with only one key `cumulativeRecoveredCasesPerMillion` which is an array of numbers.

You can fetch the data contained in one of these files by sending a `GET` request to:

```
https://raw.githubusercontent.com/bence-toth/covid-data/main/data/recovered/cumulative/per-million/SLUG.json
```

Where `SLUG` is to be replaced with the slug of the country or province.

For example:

```js
fetch(
  "https://raw.githubusercontent.com/bence-toth/covid-data/main/data/recovered/cumulative/per-million/canada.json"
)
  .then((response) => response.json())
  .then((result) => {
    console.log(result.cumulativeRecoveredCasesPerMillion);
  });
```

### Full datasets

The full datasets for countries and provinces are available in the JSON files in the `data/entire-dataset/` folder.

These files contain a JSON object with the following keys:

- `cumulativeConfirmedCases`
- `cumulativeConfirmedCasesPerMillion`
- `dailyConfirmedCases`
- `dailyConfirmedCasesPerMillion`
- `cumulativeDeaths`
- `cumulativeDeathsPerMillion`
- `dailyDeaths`
- `dailyDeathsPerMillion`
- `cumulativeRecoveredCases`
- `cumulativeRecoveredCasesPerMillion`
- `dailyRecoveredCases`
- `dailyRecoveredCasesPerMillion`

The values are arrays of numbers.

You can fetch the data contained in one of these files by sending a `GET` request to:

```
https://raw.githubusercontent.com/bence-toth/covid-data/main/data/entire-dataset/SLUG.json
```

Where `SLUG` is to be replaced with the slug of the country or province.

For example:

```js
fetch(
  "https://raw.githubusercontent.com/bence-toth/covid-data/main/data/entire-dataset/canada.json"
)
  .then((response) => response.json())
  .then((result) => {
    console.log(result.cumulativeConfirmedCases);
    console.log(result.cumulativeConfirmedCasesPerMillion);
    console.log(result.dailyConfirmedCases);
    console.log(result.dailyConfirmedCasesPerMillion);
    console.log(result.cumulativeDeaths);
    console.log(result.cumulativeDeathsPerMillion);
    console.log(result.dailyDeaths);
    console.log(result.dailyDeathsPerMillion);
    console.log(result.cumulativeRecoveredCases);
    console.log(result.cumulativeRecoveredCasesPerMillion);
    console.log(result.dailyRecoveredCases);
    console.log(result.dailyRecoveredCasesPerMillion);
  });
```

## Acknowledgements

The COVID data is fetched from [the GitHub repository](https://github.com/CSSEGISandData/COVID-19) of the 2019 Novel Coronavirus Visual Dashboard, which is operated by the [Johns Hopkins University Center for Systems Science and Engineering](https://systems.jhu.edu/), and it is updated daily.

Population data and latitude/longitude of countries and provinces were collected from various sources, including [Word Population Review](https://worldpopulationreview.com) and [Wikipedia](https://en.wikipedia.org/wiki/Main_Page).

## License

Licensed under [MIT](./LICENSE). Do what you will.
