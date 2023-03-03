const express = require("express");
const {
  allTimeZones,
  timeForOneCity,
  nextNhoursWeather,
} = require("./timeZone");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.json());
app.listen(port);

app.get("/allTimeZones", (_request, response) => {
  let allTimeZonesData = allTimeZones();

  response.json(allTimeZonesData);
});

app.get("/city", (request, response) => {
  var cityName = request.query.cityName;
  if (cityName) {
    response.json(timeForOneCity(cityName));
  } else {
    response
      .status(404)
      .json({ Error: "Not a Valid EndPonit. Please check API Doc" });
  }
});

app.post("/nextNhoursWeather", (request, response) => {
  let city_Date_Time_Name = request.body.city_Date_Time_Name;
  let hours = request.body.hours;

  if (city_Date_Time_Name && hours) {
    response.json(
      nextNhoursWeather(city_Date_Time_Name, hours, allTimeZones())
    );
  }
});
