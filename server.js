const express = require("express");
const {
  allTimeZones,
  timeForOneCity,
  nextNhoursWeather,
} = require("./timeZone");
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
  response.json(allTimeZonesData);
});

app.get("/city", (request, response) => {
  var cityName = request.query.cityName;
  if (isValidCity(cityName)) {
    response.json(timeForOneCity(cityName));
  } else {
    response
      .status(404)
      .json({ Error: "Not a Valid EndPoint. Please check API Doc" });
  }
});

app.post("/nextNhoursWeather", (request, response) => {
  let cityDateTimeName = request.body.city_Date_Time_Name;
  let hours = request.body.hours;

  if (cityDateTimeName && hours) {
    response.json(nextNhoursWeather(cityDateTimeName, hours, allTimeZones()));
  }
});
