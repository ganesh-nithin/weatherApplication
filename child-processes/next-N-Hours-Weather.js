const { allTimeZones, nextNhoursWeather } = require("../time-zone");

process.on("message", (city) => {
  process.send(getNextNHoursWeather(city.city_Date_Time_Name, city.hours));
  process.exit();
});

function getNextNHoursWeather(city_Date_Time_Name, hours) {
  return JSON.stringify(
    nextNhoursWeather(city_Date_Time_Name, hours, allTimeZones())
  );
}
