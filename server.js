const express = require("express");

const app = express();
const port = process.env.PORT || 3000;
const { fork } = require("child_process");

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
