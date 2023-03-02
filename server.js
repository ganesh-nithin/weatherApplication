const express = require("express");

const app = express();
const port = process.env.PORT || 3000;
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

app.use(express.static("public"));
app.use(express.json());
app.listen(port);

app.get("/allTimeZones", (_request, response) => {
  let childProcess = fork("./child-processes/all-Time-Zones.js");
  childProcess.on("message", (allTimeZoneData) =>
    response.send(allTimeZoneData)
  );
});

app.get("/city", (request, response) => {
  let childProcess = fork("./child-processes/time-for-one-city.js");
  childProcess.send({ cityName: request.query.cityName });
  childProcess.on("message", (timeForCity) => response.send(timeForCity));
});

app.post("/nextNhoursWeather", (request, response) => {
  let childProcess = fork("./child-processes/next-N-Hours-Weather.js");
  childProcess.send({
    city_Date_Time_Name: request.body.city_Date_Time_Name,
    hours: request.body.hours,
  });
  childProcess.on("message", (nextNhoursWeather) =>
    response.send(nextNhoursWeather)
  );
});
