const { allTimeZones } = require("@ganesh-nithin/time-zone/time-zone");

process.send(getAllTimeZonesData());
process.exit();

function getAllTimeZonesData() {
  return JSON.stringify(allTimeZones());
}