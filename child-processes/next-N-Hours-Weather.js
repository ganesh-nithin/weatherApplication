const {
  allTimeZones,
  nextNhoursWeather,
} = require("@ganesh-nithin/time-zone/time-zone");

process.on("message", (city) => {
  process.send(getNextNHoursWeather(city.cityDateTimeName, city.hours));
  process.exit();
});

function getNextNHoursWeather(cityDateTimeName, hours) {
  return JSON.stringify(
    nextNhoursWeather(cityDateTimeName, hours, allTimeZones())
  );
}
