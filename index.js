const fetch = require("node-fetch");
const parse = require("csv-parse");
const fs = require("fs");

const { countriesAndProvinces: countries } = JSON.parse(
  fs.readFileSync("./data/countries.json")
);

const output = [];

const sourceFiles = {
  deaths:
    "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv",
  confirmed:
    "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv",
  recovered:
    "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv",
};

const slugify = (string) =>
  string
    .replace(/\s+/g, "-")
    .toLowerCase()
    .replace(/[^a-z-]+/g, "");

const generateSlug = ({ country, province }) => {
  if (!province.length) {
    return slugify(country);
  } else {
    return slugify(`${country}--${province}`);
  }
};

let isDeathsHeaderRow = true;
let isConfirmedHeaderRow = true;
let isRecoveredHeaderRow = true;

const fillInZeroGaps = (data) => {
  data.forEach((item, index) => {
    if (index > 0) {
      if (item === 0 && data[index - 1] > 0) {
        data[index] = data[index - 1];
      }
    }
  });
  return data;
};

const calculateDailyData = (data) => {
  const dailyData = [];
  for (let i = data.length - 1; i > 0; --i) {
    if (data[i - 1] > data[i]) {
      data[i - 1] = data[i];
    }
    dailyData.unshift(data[i] - data[i - 1]);
  }
  dailyData.unshift(data[0]);
  return dailyData;
};

const calculatePerMillion = (data, population) =>
  data.map((dataPoint) =>
    Number(((dataPoint * 1000000) / population).toFixed(8))
  );

const requests = [
  fetch(sourceFiles.deaths).then((response) => response.text()),
  fetch(sourceFiles.confirmed).then((response) => response.text()),
  fetch(sourceFiles.recovered).then((response) => response.text()),
];

const aggregateCountry = ({ output, slug, recoveredAvailable }) => {
  const recovered = [];
  const deaths = [];
  const confirmed = [];
  const provinces = output.filter(({ slug: slugToFind }) =>
    slugToFind.includes(`${slug}--`)
  );
  provinces.forEach((province) => {
    province.deaths.forEach((_, index) => {
      deaths[index] =
        deaths[index] === undefined
          ? province.deaths[index]
          : deaths[index] + province.deaths[index];
      confirmed[index] =
        confirmed[index] === undefined
          ? province.confirmed[index]
          : confirmed[index] + province.confirmed[index];
      if (!recoveredAvailable) {
        recovered[index] =
          recovered[index] === undefined
            ? province.recovered[index]
            : recovered[index] + province.recovered[index];
      }
    });
  });
  return {
    slug,
    deaths,
    confirmed,
    recovered: recoveredAvailable
      ? output.find(({ slug: slugToFind }) => slugToFind === slug).recovered
      : recovered,
  };
};

Promise.all(requests).then(([deaths, confirmed, recovered]) => {
  const deathsParser = parse({
    delimiter: ",",
  });

  deathsParser.on("readable", () => {
    let record;
    while ((record = deathsParser.read())) {
      if (!isDeathsHeaderRow) {
        const slug = generateSlug({
          province: record[0],
          country: record[1],
        });
        output.push({
          slug,
          deaths: record.slice(4).map(Number),
        });
      } else {
        isDeathsHeaderRow = false;
      }
    }
  });

  deathsParser.write(deaths);
  deathsParser.end();

  const confirmedParser = parse({
    delimiter: ",",
  });

  confirmedParser.on("readable", () => {
    let record;
    while ((record = confirmedParser.read())) {
      if (!isConfirmedHeaderRow) {
        const slug = generateSlug({
          province: record[0],
          country: record[1],
        });
        output.find((country) => country.slug === slug).confirmed = record
          .slice(4)
          .map(Number);
      } else {
        isConfirmedHeaderRow = false;
      }
    }
  });

  confirmedParser.write(confirmed);
  confirmedParser.end();

  const recoveredParser = parse({
    delimiter: ",",
  });

  recoveredParser.on("readable", () => {
    let record;
    while ((record = recoveredParser.read())) {
      if (!isRecoveredHeaderRow) {
        const slug = generateSlug({
          province: record[0],
          country: record[1],
        });
        const foundCountry = output.find((country) => country.slug === slug);
        if (foundCountry) {
          foundCountry.recovered = record.slice(4).map(Number);
        } else {
          output.push({
            slug,
            recovered: record.slice(4).map(Number),
          });
        }
      } else {
        isRecoveredHeaderRow = false;
      }
    }
  });

  recoveredParser.on("end", () => {
    const australia = aggregateCountry({
      output,
      slug: "australia",
    });
    const china = aggregateCountry({
      output,
      slug: "china",
    });
    const canada = aggregateCountry({
      output,
      slug: "canada",
      recoveredAvailable: true,
    });
    output.push(australia, china, canada);

    output.forEach((countryData) => {
      const { slug, deaths, confirmed, recovered } = countryData;
      const exceptions = [
        "antarctica",
        "china--unknown",
        "diamond-princess",
        "ms-zaandam",
        "grand-princess",
        "canada--repatriated-travellers",
        "summer-olympics",
        "winter-olympics",
      ];
      if (exceptions.some((exception) => slug.includes(exception))) {
        return;
      }
      if (!countries.find((country) => country.slug === slug)) {
        console.error(
          `\n  ERROR: Couldn't find matching slug for: ${slug}\n\n`
        );
      }
      const { population } = countries.find((country) => country.slug === slug);

      const cumulativeDeaths = deaths ? fillInZeroGaps(deaths) : null;
      const cumulativeDeathsPerMillion = cumulativeDeaths
        ? calculatePerMillion(cumulativeDeaths, population)
        : null;
      const dailyDeaths = deaths ? calculateDailyData(deaths) : null;
      const dailyDeathsPerMillion = dailyDeaths
        ? calculatePerMillion(dailyDeaths, population)
        : null;
      const cumulativeConfirmedCases = confirmed
        ? fillInZeroGaps(confirmed)
        : null;
      const cumulativeConfirmedCasesPerMillion = cumulativeConfirmedCases
        ? calculatePerMillion(cumulativeConfirmedCases, population)
        : null;
      const dailyConfirmedCases = confirmed
        ? calculateDailyData(confirmed)
        : null;
      const dailyConfirmedCasesPerMillion = dailyConfirmedCases
        ? calculatePerMillion(dailyConfirmedCases, population)
        : null;
      const cumulativeRecoveredCases = recovered
        ? fillInZeroGaps(recovered)
        : null;
      const cumulativeRecoveredCasesPerMillion = cumulativeRecoveredCases
        ? calculatePerMillion(cumulativeRecoveredCases, population)
        : null;
      const dailyRecoveredCases = recovered
        ? calculateDailyData(recovered)
        : null;
      const dailyRecoveredCasesPerMillion = dailyRecoveredCases
        ? calculatePerMillion(dailyRecoveredCases, population)
        : null;

      fs.writeFileSync(
        `data/entire-dataset/${slug}.json`,
        JSON.stringify({
          cumulativeDeaths,
          cumulativeDeathsPerMillion,
          dailyDeaths,
          dailyDeathsPerMillion,
          cumulativeConfirmedCases,
          cumulativeConfirmedCasesPerMillion,
          dailyConfirmedCases,
          dailyConfirmedCasesPerMillion,
          cumulativeRecoveredCases,
          cumulativeRecoveredCasesPerMillion,
          dailyRecoveredCases,
          dailyRecoveredCasesPerMillion,
        })
      );

      fs.writeFileSync(
        `data/died/cumulative/exact/${slug}.json`,
        JSON.stringify({
          cumulativeDeaths,
        })
      );

      fs.writeFileSync(
        `data/died/cumulative/per-million/${slug}.json`,
        JSON.stringify({
          cumulativeDeathsPerMillion,
        })
      );

      fs.writeFileSync(
        `data/died/daily/exact/${slug}.json`,
        JSON.stringify({
          dailyDeaths,
        })
      );

      fs.writeFileSync(
        `data/died/daily/per-million/${slug}.json`,
        JSON.stringify({
          dailyDeathsPerMillion,
        })
      );

      fs.writeFileSync(
        `data/confirmed/cumulative/exact/${slug}.json`,
        JSON.stringify({
          cumulativeConfirmedCases,
        })
      );

      fs.writeFileSync(
        `data/confirmed/cumulative/per-million/${slug}.json`,
        JSON.stringify({
          cumulativeConfirmedCasesPerMillion,
        })
      );

      fs.writeFileSync(
        `data/confirmed/daily/exact/${slug}.json`,
        JSON.stringify({
          dailyConfirmedCases,
        })
      );

      fs.writeFileSync(
        `data/confirmed/daily/per-million/${slug}.json`,
        JSON.stringify({
          dailyConfirmedCasesPerMillion,
        })
      );

      fs.writeFileSync(
        `data/recovered/cumulative/exact/${slug}.json`,
        JSON.stringify({
          cumulativeRecoveredCases,
        })
      );

      fs.writeFileSync(
        `data/recovered/cumulative/per-million/${slug}.json`,
        JSON.stringify({
          cumulativeRecoveredCasesPerMillion,
        })
      );

      fs.writeFileSync(
        `data/recovered/daily/exact/${slug}.json`,
        JSON.stringify({
          dailyRecoveredCases,
        })
      );

      fs.writeFileSync(
        `data/recovered/daily/per-million/${slug}.json`,
        JSON.stringify({
          dailyRecoveredCasesPerMillion,
        })
      );
    });
  });

  recoveredParser.write(recovered);
  recoveredParser.end();
});
