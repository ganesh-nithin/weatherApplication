const { timeForOneCity } = require("@ganesh-nithin/time-zone/time-zone");

process.on("message", (city) => {
  process.send(getTimeForOneCity(city.cityName));
  process.exit();
});

function getTimeForOneCity(cityName) {
  return JSON.stringify(timeForOneCity(cityName));
}
