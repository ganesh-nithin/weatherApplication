const http = require("http");
const fs = require("fs");
const path = require("path");
const {
  allTimeZones,
  timeForOneCity,
  nextNhoursWeather,
} = require("./timeZone");

const port = process.env.PORT || 3000;

function getFilePath(request) {
  return path.join(__dirname, request.url === "/" ? "index.html" : request.url);
}

function writeAllTimeZoneData(response) {
  let allTimeZonesData = JSON.stringify(allTimeZones());

  response.writeHead(200, { "Content-Type": "application/json" });
  response.write(allTimeZonesData);
  response.end();
}

function writeTimeForOneCityData(request, response) {
  let cityName = request.url.split("=")[1];
  let timeForOneCityData = JSON.stringify(timeForOneCity(cityName));

  response.writeHead(200, { "Content-Type": "application/json" });
  response.write(timeForOneCityData);
  response.end();
}

function writeNextNhoursWeatherData(request, response) {
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
}

function write(response, contentType, filePath) {
  response.writeHead(200, { "Content-Type": contentType });
  const readStream = fs.createReadStream(filePath);
  readStream.pipe(response);
}

http
  .createServer((request, response) => {
    let filePath = getFilePath(request);
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

    switch (request.url) {
      case "/allTimeZones":
        writeAllTimeZoneData(response);
        break;
      case request.url.startsWith("/timeForOneCity") ? request.url : "":
        writeTimeForOneCityData(request, response);
        break;
      case "/nextNhoursWeather":
        writeNextNhoursWeatherData(request, response);
        break;
      default:
        write(response, contentType, filePath);
    }
  })
  .listen(port, (err) => {
    if (err) {
      console.log(`Error: ${err}`);
    } else {
      console.log(`Server listening at port ${port}...`);
    }
  });
