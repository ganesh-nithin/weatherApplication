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

app.get("/allTimeZones", (request, response) => {
  let allTimeZonesData = allTimeZones();

  response.json(allTimeZonesData);
});

      response.writeHead(200, { "Content-Type": "application/json" });
      response.write(allTimeZonesData);
      response.end();
    } else if (request.url.startsWith("/timeForOneCity")) {
      let cityName = request.url.split("=")[1];
      let timeForOneCityData = JSON.stringify(timeForOneCity(cityName));

      response.writeHead(200, { "Content-Type": "application/json" });
      response.write(timeForOneCityData);
      response.end();
    } else if (request.url === "/nextNhoursWeather") {
      let timeForOneCityData = "";

      request.on("data", function (chunk) {
        timeForOneCityData += chunk;
      });
      request.on("end", () => {
        response.writeHead(200, { "Content-Type": "application/json" });
        timeForOneCityData = JSON.parse(timeForOneCityData);
        let nextNhoursWeatherData = nextNhoursWeather(
          timeForOneCityData.city_Date_Time_Name,
          timeForOneCityData.hours,
          allTimeZones()
        );
        nextNhoursWeatherData = JSON.stringify(nextNhoursWeatherData);
        response.write(nextNhoursWeatherData);
        response.end();
      });
    } else {
      response.writeHead(200, { "Content-Type": contentType });
      const readStream = fs.createReadStream(filePath);
      readStream.pipe(response);
    }
  })
  .listen(port, (err) => {
    if (err) {
      console.log(`Error: ${err}`);
    } else {
      console.log(`Server listening at port ${port}...`);
    }
  });
