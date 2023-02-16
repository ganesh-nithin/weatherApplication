var weatherData;
var timerId;
const amStateIconPath = "/Assets/General%20Images%20&%20Icons/amState.svg";
const pmStateIconPath = "/Assets/General%20Images%20&%20Icons/pmState.svg";
const humidityIconPath = "/Assets/Weather%20Icons/humidityIcon.svg";
const precipitationIconPath = "/Assets/Weather%20Icons/precipitationIcon.svg";
var cityTimerId;
const timeIntervalValue = 60000;
var cardsTimerId;
const arrowUpIconPath = "/Assets/General%20Images%20&%20Icons/arrowUp.svg";
const arrowDownIconPath = "/Assets/General%20Images%20&%20Icons/arrowDown.svg";
var continentTimerId;
const sortOrderEnum = {
  ASCENDING_ORDER: 1,
  DESCENDING_ORDER: -1,
};

fetch("/Assets/files/data.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    return response.json();
  })
  .then((json) => {
    weatherData = json;
    addingCitiesToDropDownAndCallingDefaultFunctions();
  })
  .catch((err) => console.error(`Fetch problem: ${err.message}`));

document.getElementById("input-city").addEventListener("input", changeCity);
document.getElementById("sunny-icon").addEventListener("click", showSunnyCards);
document.getElementById("snow-icon").addEventListener("click", showSnowCards);
document.getElementById("rainy-icon").addEventListener("click", showRainyCards);
document.getElementById("arrow-right").addEventListener("click", rightScroll);
document.getElementById("arrow-left").addEventListener("click", leftScroll);
document
  .getElementById("no-of-cities")
  .addEventListener("change", displayGivenNumberOfCities);
document
  .getElementById("continent-name")
  .addEventListener("click", arrangeCardsInOrderContinentName);
document
  .getElementById("temperature")
  .addEventListener("click", arrangeCardsInOrderTemperature);

function City(cityName, timeZone) {
  this.cityName = cityName;
  this.timeZone = timeZone;
}

function CityWeatherData(
  cityName,
  timeZone,
  temperature,
  humidity,
  precipitation,
  nextFiveHrs
) {
  City.call(this, cityName, timeZone);
  this.temperature = temperature;
  this.humidity = humidity;
  this.precipitation = precipitation;
  this.nextFiveHrs = nextFiveHrs;
}

CityWeatherData.prototype = Object.create(City.prototype);

const addingCitiesToDropDownAndCallingDefaultFunctions = () => {
  var str = "";
  const keys = Object.keys(this.weatherData);
  var my_list = document.getElementById("cities");

    keys.forEach((key) => {
      str += '<option value="' + this.weatherData[key].cityName + '" />';
    });
    my_list.innerHTML = str;
    document.getElementById("input-city").value = "Kolkata";
    this.changeWeatherTimeDateDataForSelectedCity("kolkata");
    this.showSunnyCards();
    this.arrangeCardsInOrderContinentName();
  }

City.prototype.changeIcon = function () {
  let image = document.getElementById("city-img");
  image.src =
    "/Assets/Icons for cities/" + this.cityName.toLowerCase() + ".svg";
  image.style.visibility = "visible";
};

City.prototype.formatDate = function (date) {
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return date[1] + "-" + months[date[0] - 1] + "-" + date[2];
};

City.prototype.getTime = function () {
  return new Date().toLocaleString("en-US", {
    timeZone: this.timeZone,
    timeStyle: "medium",
    hourCycle: "h24",
  });
};

City.prototype.getDate = function () {
  let unFormatDate = new Date()
    .toLocaleString("en-US", {
      timeZone: this.timeZone,
      hourCycle: "h24",
    })
    .split(",")[0]
    .split("/");
  return this.formatDate(unFormatDate);
};

City.prototype.isTimeAm = function (time) {
function isTimeAm(time) {
};
}
City.prototype.changeTime = function () {
function changeTime(timeZone) {
  if (timerId) {
    clearInterval(timerId);
  }
  document.getElementById("stateIcon").style.visibility = "visible";

    let time = this.getTime().split(":");
    let time = getTime(timeZone).split(":");
    document.getElementById("hour-minutes").innerHTML =
      (time[0] == 12 ? 12 : time[0] % 12) + ":" + time[1];
    if (this.isTimeAm(time[0])) {
    if (isTimeAm(time[0])) {
      document.getElementById("stateIcon").src = amStateIconPath;
    } else {
      document.getElementById("stateIcon").src = pmStateIconPath;
    }
};
}
City.prototype.changeDate = function () {
  let dateString = this.getDate();
  let dateString = formatDate(unFormatDate);
};
}
CityWeatherData.prototype.convertCelsiusToFahrenheit = function (temperature) {
function convertCelsiusToFahrenheit(temperature) {
};
}
CityWeatherData.prototype.changeWeatherData = function () {
  let fahrenheit = this.convertCelsiusToFahrenheit(this.temperature);
  let fahrenheit = convertCelsiusToFahrenheit(temperature);
  document.getElementById("temperature-celsius").innerHTML = this.temperature;
  document.getElementById("humidity").innerHTML = this.humidity;
  document.getElementById("precipitation").innerHTML = this.precipitation;
  document.getElementById("precipitation").innerHTML = precipitation;
};
}
CityWeatherData.prototype.changeWeatherIconData = function (
  temperature,
  number
) {
function changeWeatherIconData(temperature, number) {
  let tempVal = parseInt(temperature.slice(0, -2));
  let image = document.getElementById(`weatherImg${number}`);
  let icon;

    if (tempVal < 18) {
      icon = "rainy";
    } else if (tempVal >= 18 && tempVal <= 22) {
      icon = "windy";
    } else if (tempVal >= 23 && tempVal <= 29) {
      icon = "cloudy";
    } else {
      icon = "sunny";
    }

  document.getElementById(`temp${number}`).innerHTML = temperature;
  image.src = "/Assets/Weather Icons/" + icon + "Icon.svg";
  image.title = icon;
};
}
City.prototype.isTimeAmfor24Format = function (time) {
function isTimeAmfor24Format(time) {
};
}
CityWeatherData.prototype.changeNextFiveHrs = function () {
  let hour = parseInt(this.getTime().split(":")[0]);
  this.changeWeatherIconData(this.temperature, 0);
  changeWeatherIconData(currentTemp, 0);
  document.getElementById("time0").innerHTML = "NOW";
  for (let i = 1; i < 5; i++) {
    if (this.isTimeAmfor24Format(displayHour)) {
    if (isTimeAmfor24Format(displayHour)) {
      displayHour = (displayHour % 24) + "AM";
    } else {
      displayHour = (displayHour % 12) + "PM";
    }
    this.changeWeatherIconData(this.nextFiveHrs[i - 1], i);
    changeWeatherIconData(weatherData[i - 1], i);
};
}
const changeWeatherTimeDateDataForSelectedCity = (key) => {
function changeWeatherTimeDateDataForSelectedCity(key) {
  if (weatherData[key] === null) {
    return;
  const cityWeatherData = new CityWeatherData(
    weatherData[key].cityName,
    weatherData[key].timeZone,
  changeWeatherData(
    weatherData[key].temperature,
    weatherData[key].precipitation,
    weatherData[key].nextFiveHrs
    weatherData[key].precipitation

  document.getElementById("invalid-input").style.display = "none";
  cityWeatherData.changeIcon();
  cityWeatherData.changeTime();
  cityWeatherData.changeDate();
  cityWeatherData.changeWeatherData();
  cityWeatherData.changeNextFiveHrs();
};
}
const showNILValues = () => {
function showNILValues() {
  if (timerId) {
    clearInterval(timerId);
  }

  document.getElementById("invalid-input").style.display = "block";
  document.getElementById("city-img").style.visibility = "hidden";
  document.getElementById("city-img").alt = "";
  document.getElementById("hour-minutes").innerHTML = "NIL:NIL";
  document.getElementById("seconds").innerHTML = ":NIL";
  document.getElementById("stateIcon").style.visibility = "hidden";
  document.getElementById("stateIcon").alt = "";
  document.getElementById("date-id").innerHTML = "NIL-NIL-NIL";
  document.getElementById("temperature-celsius").innerHTML = "NIL";
  document.getElementById("humidity").innerHTML = "NIL";
  document.getElementById("temperature-fahrenheit").innerHTML = "NIL";
  document.getElementById("precipitation").innerHTML = "NIL";
  for (let i = 0; i <= 4; i++) {
    document.getElementById(`time${i}`).innerHTML = "NIL";
    document.getElementById(`weatherImg${i}`).style.visibility = "hidden";
    document.getElementById(`weatherImg${i}`).title = "";
    document.getElementById(`weatherImg${i}`).alt = "";
    document.getElementById(`temp${i}`).innerHTML = "NIL";
};
}

  changeCity() {
    let cityElement = document.getElementById("input-city");
    let cityName = cityElement.value;
    let isValidCity = false;

    const keys = Object.keys(this.weatherData);

    keys.forEach((key) => {
      if (this.weatherData[key].cityName == cityName) {
        isValidCity = true;
        cityElement.className = "";
        this.changeWeatherTimeDateDataForSelectedCity(key);
      }
    });

  if (!isValidCity) {
    cityElement.className = "incorrect";
    this.showNILValues();
  }
}
City.prototype.getTime12Hrs = function () {
function getTime12Hrs(timeZone) {
    timeZone: this.timeZone,
    timeZone: timeZone,
    timeStyle: "short",
    hourCycle: "h12",
};
}
const arrangeCardsInContainer = (cities, weatherCondition, noOfCities) => {
function arrangeCardsInContainer(cities, weatherCondition, noOfCities) {
  let str = "";
  let cardsContainer = document.getElementById("cards");
  noOfCities = noOfCities || cities.length;
  noOfCities = noOfCities > 10 ? 10 : noOfCities;

    for (let i = 0; i < noOfCities; i++) {
      str += `<div class="card" id=card${i}>
      <p class="city">
        ${cities[i].cityName}
        <img
          class="img"
          src="/Assets/Weather Icons/${weatherCondition}Icon.svg"
          alt="${weatherCondition}Icon"
          width="18"
          height="18"
        />
        <span class="temp">${cities[i].temperature}</span>
      </p>
        ${cities[i].getTime12Hrs()}
        ${getTime12Hrs(cities[i].timeZone)}
      <p class="time">${cities[i].getDate()}</p>
      )}</p>
      <p class="value">
        <img
          src= ${humidityIconPath}
          alt="humidityIcon"
          width="15"
          height="15"
        />
        ${cities[i].humidity}
      </p>
      <p class="value">
        <img
          src=${precipitationIconPath}
          alt="precipitationIcon"
          width="15"
          height="15"
        />
        ${cities[i].precipitation}
      </p>
    </div>`;
  }
  cardsContainer.innerHTML = str;
  for (let i = 0; i < noOfCities; i++) {
    document.getElementById(
      `card${i}`
    ).style.backgroundImage = `url(/Assets/Icons%20for%20cities/${cities[
      i
    ].cityName.toLowerCase()}.svg)`;
};
}
const setTimeIntervalsForMiddleCards = function (cities, noOfCities) {
function setTimeIntervalsForMiddleCards(cities, noOfCities) {
  if (cityTimerId) {
    clearInterval(cityTimerId);
  }

  this.cityTimerId = setInterval(() => {
    for (let i = 0; i < noOfCities; i++) {
      let str = cities[i].getTime12Hrs();
      let str = getTime12Hrs(cities[i].timeZone);
      element.innerHTML = str;
    }
};
}
const toggleArrowsAndDisplayNumber = function (noOfCities) {
function toggleArrowsAndDisplayNumber(noOfCities) {
  if (noOfCities > 4) {
    document.getElementById("arrow-left").style.visibility = "visible";
    document.getElementById("arrow-right").style.visibility = "visible";
  } else {
    document.getElementById("arrow-left").style.visibility = "hidden";
    document.getElementById("arrow-right").style.visibility = "hidden";
  }
  document.getElementById("no-of-cities").value =
};

const createCityWeatherDataObjects = (cityKeys) => {
  let cityObjects = [];

  cityKeys.forEach((key) => {
    let cityWeatherData = new CityWeatherData(
      weatherData[key].cityName,
      weatherData[key].timeZone,
      weatherData[key].temperature,
      weatherData[key].humidity,
      weatherData[key].precipitation
    );

    cityObjects.push(cityWeatherData);
  });

  return cityObjects;
};

const filterRainyCards = function () {

Weather.prototype.filterRainyCards=function () {
  let rainyCities = [];
  const keys = Object.keys(this.weatherData);

  keys.forEach((key) => {
    let temperatureValue = parseInt(weatherData[key].temperature);
      rainyCities.push(key);
    if (temperatureValue < 20 && humidityValue >= 50) {
      rainyCities.push(weatherData[key]);
    }
  });
  rainyCities = rainyCities.sort((city1, city2) => {

  rainyCities = createCityWeatherDataObjects(rainyCities);
    return parseInt(city2.humidity) - parseInt(city1.humidity);
  });
};
  return rainyCities;
const filterSnowCards = function () {

  filterSnowCards() {
    let snowCities = [];
    const keys = Object.keys(this.weatherData);

  keys.forEach((key) => {
    let temperatureValue = parseInt(this.weatherData[key].temperature);
    let humidityValue = parseInt(this.weatherData[key].humidity);
    let precipitationValue = parseInt(this.weatherData[key].precipitation);
    if (
      temperatureValue >= 20 &&
      temperatureValue <= 28 &&
      humidityValue > 50 &&
      snowCities.push(key);
    ) {
      snowCities.push(this.weatherData[key]);
    }
  });
  snowCities = snowCities.sort((city1, city2) => {

  snowCities = createCityWeatherDataObjects(snowCities);
    return parseInt(city2.precipitation) - parseInt(city1.precipitation);
  });
};
  return snowCities;
const filterSunnyCards = function () {

  filterSunnyCards() {
    let sunnyCities = [];
    const keys = Object.keys(this.weatherData);

  keys.forEach((key) => {
    let temperatureValue = parseInt(this.weatherData[key].temperature);
    let humidityValue = parseInt(this.weatherData[key].humidity);
    let precipitationValue = parseInt(this.weatherData[key].precipitation);
    if (
      temperatureValue > 29 &&
      humidityValue < 50 &&
      sunnyCities.push(key);
    ) {
      sunnyCities.push(this.weatherData[key]);
    }
  });
  sunnyCities = sunnyCities.sort((city1, city2) => {

  sunnyCities = createCityWeatherDataObjects(sunnyCities);
    return parseInt(city2.temperature) - parseInt(city1.temperature);
  });
};
  return sunnyCities;
};

  showSunnyCards() {
    let sunnyCities = this.filterSunnyCards();

    document.getElementById("sunny-icon").className = "border";
    document.getElementById("snow-icon").className = "";
    document.getElementById("rainy-icon").className = "";
    this.toggleArrowsAndDisplayNumber(sunnyCities.length);

    this.arrangeCardsInContainer(sunnyCities, "sunny");
    this.setTimeIntervalsForMiddleCards(sunnyCities, sunnyCities.length);
  }

  showSnowCards() {
    let snowCities = this.filterSnowCards();

    document.getElementById("sunny-icon").className = "";
    document.getElementById("snow-icon").className = "border";
    document.getElementById("rainy-icon").className = "";
    this.toggleArrowsAndDisplayNumber(snowCities.length);

    this.arrangeCardsInContainer(snowCities, "snowflake");
    this.setTimeIntervalsForMiddleCards(snowCities, snowCities.length);
  }

  showRainyCards() {
    let rainyCities = this.filterRainyCards();

    document.getElementById("sunny-icon").className = "";
    document.getElementById("snow-icon").className = "";
    document.getElementById("rainy-icon").className = "border";
    this.toggleArrowsAndDisplayNumber(rainyCities.length);

  arrangeCardsInContainer(rainyCities, "rainy");
document.getElementById("snow-icon").addEventListener("click", showSnowCards);
document.getElementById("rainy-icon").addEventListener("click", showRainyCards);

Weather.prototype.rightScroll=function () {
  var right = document.querySelector(".cards");
  var width = document.querySelector(".card").clientWidth * 1.2;
}
document.getElementById("arrow-right").addEventListener("click", rightScroll);

Weather.prototype.leftScroll = function () {
  var left = document.querySelector(".cards");
  var width = document.querySelector(".card").clientWidth * 1.2;
}
const isIdSelected = function (id) {

};
  return document.getElementById(id).className === "border";
};

  displayGivenNumberOfCities() {
    let noOfCities = document.getElementById("no-of-cities").value;
    let cities, weatherCondition;

    if (this.isIdSelected("sunny-icon")) {
      cities = this.filterSunnyCards();
      weatherCondition = "sunny";
    } else if (this.isIdSelected("snow-icon")) {
      cities = this.filterSnowCards();
      weatherCondition = "snowflake";
    } else {
      cities = this.filterRainyCards();
      weatherCondition = "rainy";
    }
    let sizeOfCitiesArray = cities.length > 10 ? 10 : cities.length;
    if (sizeOfCitiesArray < noOfCities || noOfCities < 3) {
      document.getElementById("no-of-cities").value = sizeOfCitiesArray;
      noOfCities = sizeOfCitiesArray;
    }
    this.toggleArrowsAndDisplayNumber(noOfCities);

  arrangeCardsInContainer(cities, weatherCondition, noOfCities);
  setTimeIntervalsForMiddleCards(cities, noOfCities);
const toggleArrows = function (element) {

function toggleArrows(element) {
  if (element.alt === "arrowUp") {
    element.alt = "arrowDown";
    element.src = arrowDownIconPath;
  } else {
    element.alt = "arrowUp";
  ASCENDING_ORDER: 1,
  DESCENDING_ORDER: -1,
const getContinentName = function (timeZone) {

};
  return timeZone.split("/")[0];
const sortCitiesByTemperatureAndContinent = function (
function sortCitiesByTemperatureAndContinent(
  cityKeys,
  continetArrowDirection,
  temperatureArrowDirection
) {
  let continentVarable =
    continetArrowDirection === "arrowUp"
      ? sortOrderEnum.ASCENDING_ORDER
      : sortOrderEnum.DESCENDING_ORDER;
  let temperatureVariable =
    temperatureArrowDirection === "arrowUp"
  let cityKeys = Object.keys(weatherData);
      ? sortOrderEnum.ASCENDING_ORDER
      : sortOrderEnum.DESCENDING_ORDER;

  cityKeys = cityKeys.sort((city1, city2) => {
    return (
      getContinentName(weatherData[city1].timeZone).localeCompare(
        getContinentName(weatherData[city2].timeZone)
      ) * continentVarable ||
      (parseInt(weatherData[city1].temperature) -
        parseInt(weatherData[city2].temperature)) *
        temperatureVariable
    );
  return createCityWeatherDataObjects(cityKeys);
};
  return cityKeys;
const arrangeCardsInContainerByOrder = function (cityObjects) {

  arrangeCardsInContainerByOrder(cityKeys) {
    let htmlInnerText = "";
    let cardsContainer = document.getElementById("continent-card-container");

    <p class="name">${getContinentName(cityObjects[i].timeZone)}</p>
    <p class="temp">${cityObjects[i].temperature}</p>
    <p class="place-time">${cityObjects[i].cityName}, ${cityObjects[
      i
    ].getTime12Hrs()}</p>
      weatherData[cityKeys[i]].timeZone
    )}</p>
    <p class="humidity">
      <img
        src=${humidityIconPath}
        alt="humidityIcon"
        width="15"
      ${cityObjects[i].humidity}
      />
      ${this.weatherData[cityKeys[i]].humidity}
    </p>
  </div>`;
};
  cardsContainer.innerHTML = htmlInnerText;
const setTimeIntervels = function (cityObjects) {

Weather.prototype.setTimeIntervels = function (cityKeys) {
  if (this.continentTimerId) {
    clearInterval(this.continentTimerId);
  }
  continentTimerId = setInterval(() => {
      let str = `${cityObjects[i].cityName}, ${cityObjects[i].getTime12Hrs()}`;
        " , " +
        this.getTime12Hrs(this.weatherData[cityKeys[i]].timeZone);
      element.innerHTML = str;
};
  }, 60000);
const sortingAndArrangingCards = function () {
  let cityObjects = sortCitiesByTemperatureAndContinent(
  let cityKeys = sortCitiesByTemperatureAndContinent(
    Object.keys(weatherData),
    document.getElementById("continent-name").alt,
    document.getElementById("temperature").alt
  arrangeCardsInContainerByOrder(cityObjects);
  setTimeIntervels(cityObjects);
};
  setTimeIntervels(cityKeys);
};

  arrangeCardsInOrderTemperature() {
    let temperatureElement = document.getElementById("temperature");

  toggleArrows(temperatureElement);
  sortingAndArrangingCards();
};

  arrangeCardsInOrderContinentName() {
    let continentNameElement = document.getElementById("continent-name");

  toggleArrows(continentNameElement);
  sortingAndArrangingCards();
  .addEventListener("click", arrangeCardsInOrderTemperature);
