const { timeForOneCity } = require("../time-zone");

process.on("message", (city) => {
  process.send(getTimeForOneCity(city.cityName));
  process.exit();
});

function getTimeForOneCity(cityName) {
  return JSON.stringify(timeForOneCity(cityName));
}
