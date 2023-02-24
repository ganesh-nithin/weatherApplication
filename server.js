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
  .createServer((req, res) => {
    let filePath = path.join(
      __dirname,
      req.url === "/" ? "index.html" : req.url
    );
    let extName = path.extname(filePath);
    let contentType = "text/html";

    switch (extName) {
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

    if (req.url === "/allTimeZones") {
      res.writeHead(200, { "Content-Type": "application/json" });
      const jsonContent = JSON.stringify(allTimeZones());
      res.write(jsonContent);
      res.end();
    } else if (req.url.startsWith("/timeForOneCity")) {
      res.writeHead(200, { "Content-Type": "application/json" });
      let cityName = req.url.split("=")[1];
      const jsonContent = JSON.stringify(timeForOneCity(cityName));
      res.write(jsonContent);
      res.end();
    } else if (req.url === "/nextNhoursWeather") {
      let data = "";
      req.on("data", function (chunk) {
        data += chunk;
      });
      req.on("end", () => {
        res.writeHead(200, { "Content-Type": "application/json" });
        data = JSON.parse(data);
        let content = nextNhoursWeather(
          data.city_Date_Time_Name,
          data.hours,
          allTimeZones()
        );
        const jsonContent = JSON.stringify(content);
        res.write(jsonContent);
        res.end();
      });
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      const readStream = fs.createReadStream(filePath);
      readStream.pipe(res);
    }
  })
  .listen(port, (err) => {
    if (err) {
      console.log(`Error: ${err}`);
    } else {
      console.log(`Server listening at port ${port}...`);
    }
  });
