const http = require("http");
const fs = require("fs");
const path = require("path");
const {
  allTimeZones,
  timeForOneCity,
  nextNhoursWeather,
} = require("./timeZone");

const port = process.env.PORT || 3000;

http
  .createServer((request, response) => {
    let filePath = path.join(
      __dirname,
      request.url === "/" ? "index.html" : request.url
    );
    let extensionName = path.extname(filePath);
    let contentType = "text/html";

    switch (extensionName) {
      case ".css":
        contentType = "text/css";
        break;
      case ".js":
        contentType = "text/js";
        break;
      case ".svg":
        contentType = "image/svg+xml";
        break;
      case ".ico":
        contentType = "image/x-icon";
        break;
    }

    if (request.url === "/allTimeZones") {
      let allTimeZonesData = JSON.stringify(allTimeZones());

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
