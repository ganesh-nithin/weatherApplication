const { allTimeZones } = require("../time-zone");

process.send(getAllTimeZonesData());
process.exit();

function getAllTimeZonesData() {
  return JSON.stringify(allTimeZones());
}
