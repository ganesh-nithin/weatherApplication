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
