const {
  timeForOneCity,
  allTimeZones,
} = require("@ganesh-nithin/time-zone/time-zone");
const allTimeZonesData = allTimeZones();
let cityNames = [];

allTimeZonesData.forEach((city) => {
  cityNames.push(city.cityName);
});

function isValidCity(cityName) {
  return cityNames.find((cityNameIndex) => {
    return cityName === cityNameIndex;
  });
}

process.on("message", (city) => {
  process.send(getTimeForOneCity(city.cityName));
  process.exit();
});

function getTimeForOneCity(cityName) {
  if (isValidCity(cityName)) {
    return JSON.stringify(timeForOneCity(cityName));
  } else {
    return JSON.stringify({
      Error: "Not a Valid EndPoint. Please check API Doc",
    });
  }
}
