var weatherData = {};
var cityTimeTimerId;
var cityTimerId;
var cardsTimerId;
var continentTimerId;
var weatherDataTimerId;
const oneSecondTimeInterval = 1000;
const oneMinuteTimeInterval = 60000;
const oneHourTimerInterval = 3600000;
const fourHoursTimerInterval = 14400000;
const sortOrderEnum = {
  ASCENDING_ORDER: 1,
  DESCENDING_ORDER: -1,
};
const amStateIconPath = "/Assets/General_Images_&_Icons/amState.svg";
const pmStateIconPath = "/Assets/General_Images_&_Icons/pmState.svg";
const humidityIconPath = "/Assets/Weather_Icons/humidityIcon.svg";
const precipitationIconPath = "/Assets/Weather_Icons/precipitationIcon.svg";
const arrowUpIconPath = "/Assets/General_Images_&_Icons/arrowUp.svg";
const arrowDownIconPath = "/Assets/General_Images_&_Icons/arrowDown.svg";

class City {
  constructor(cityName, timeZone) {
    this.cityName = cityName;
    this.timeZone = timeZone;
  }

  changeIcon() {
    let image = document.getElementById("city-img");
    image.src =
      "/Assets/Icons_for_cities/" + this.cityName.toLowerCase() + ".svg";
    image.style.visibility = "visible";
  }

  formatDate(date) {
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
  }

  getTime() {
    return new Date().toLocaleString("en-US", {
      timeZone: this.timeZone,
      timeStyle: "medium",
      hourCycle: "h24",
    });
  }

  getDate() {
    let unFormatDate = new Date()
      .toLocaleString("en-US", {
        timeZone: this.timeZone,
        hourCycle: "h24",
      })
      .split(",")[0]
      .split("/");
    return this.formatDate(unFormatDate);
  }

  isTimeAm(time) {
    return time >= 0 && time < 12;
  }

  changeTime() {
    if (cityTimeTimerId) {
      clearInterval(cityTimeTimerId);
    }
    document.getElementById("stateIcon").style.visibility = "visible";

    cityTimeTimerId = setInterval(() => {
      let time = this.getTime().split(":");
      document.getElementById("hour-minutes").innerHTML =
        (time[0] == 12 ? 12 : time[0] % 12) + ":" + time[1];
      document.getElementById("seconds").innerHTML = ":" + time[2];
      if (this.isTimeAm(time[0])) {
        document.getElementById("stateIcon").src = amStateIconPath;
      } else {
        document.getElementById("stateIcon").src = pmStateIconPath;
      }
    }, oneSecondTimeInterval);
  }

  changeDate() {
    let dateString = this.getDate();
    document.getElementById("date-id").innerHTML = dateString;
  }

  isTimeAmfor24Format(time) {
    return time <= 12 || time >= 24;
  }

  getTime12Hrs() {
    return new Date().toLocaleString("en-US", {
      timeZone: this.timeZone,
      timeStyle: "short",
      hourCycle: "h12",
    });
  }
}

class CityWeatherData extends City {
  constructor(cityName, timeZone, temperature, humidity, precipitation) {
    super(cityName, timeZone);
    this.temperature = temperature;
    this.humidity = humidity;
    this.precipitation = precipitation;
    this.weatherDataForNextFiveYears;
  }

  convertCelsiusToFahrenheit(temperature) {
    return (1.8 * parseInt(temperature.slice(0, -2)) + 32).toFixed() + "F";
  }

  changeWeatherData() {
    let fahrenheit = this.convertCelsiusToFahrenheit(this.temperature);

    document.getElementById("temperature-celsius").innerHTML = this.temperature;
    document.getElementById("humidity").innerHTML = this.humidity;
    document.getElementById("precipitation").innerHTML = this.precipitation;
    document.getElementById("temperature-fahrenheit").innerHTML = fahrenheit;
  }

  changeWeatherIconData(temperature, number) {
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
    image.src = "/Assets/Weather_Icons/" + icon + "Icon.svg";
    image.title = icon;
    image.style.visibility = "visible";
  }

  async getNextFiveYearsData() {
    let timeForCity = await getDataFromServer(
      `./city?cityName=${this.cityName}`
    );

    let weatherDataForNextFiveYears = await fetch("./nextNhoursWeather", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cityDateTimeName: timeForCity["city_Date_Time_Name"],
        hours: 5,
      }),
    });

    this.weatherDataForNextFiveYears = await getJsonData(
      weatherDataForNextFiveYears
    );
    this.weatherDataForNextFiveYears =
      this.weatherDataForNextFiveYears.temperature;
  }

  async changeNextFiveHrs() {
    await this.getNextFiveYearsData();
    if (weatherDataTimerId) {
      clearInterval(weatherDataTimerId);
    }
    weatherDataTimerId = setInterval(
      this.getNextFiveYearsData(),
      oneHourTimerInterval
    );
    let hour = parseInt(this.getTime().split(":")[0]);

    this.changeWeatherIconData(this.temperature, 0);
    document.getElementById("time0").innerHTML = "NOW";
    for (let i = 1; i < 5; i++) {
      let displayHour = hour + i;
      if (this.isTimeAmfor24Format(displayHour)) {
        displayHour = (displayHour % 24) + "AM";
      } else {
        displayHour = (displayHour % 12) + "PM";
      }
      document.getElementById(`time${i}`).innerHTML = displayHour;
      this.changeWeatherIconData(this.weatherDataForNextFiveYears[i - 1], i);
    }
  }
}

async function getDataFromServer(serverLink) {
  let dataFromServer = await fetch(serverLink);
  return await getJsonData(dataFromServer);
}

async function fetchData() {
  let jsonWeatherData = await getDataFromServer("./allTimeZones");

  jsonWeatherData.forEach((index) => {
    let cityName = index.cityName.toLowerCase();
    weatherData[cityName] = index;
  });
  addingCitiesToDropDownAndCallingDefaultFunctions();
}

function getJsonData(response) {
  try {
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    return response.json();
  } catch (e) {
    console.error(`Fetch problem: ${e.message}`);
  }
}

fetchData();
setInterval(fetchData, fourHoursTimerInterval);

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
window.addEventListener("resize", displayGivenNumberOfCities);

const addingCitiesToDropDownAndCallingDefaultFunctions = () => {
  var str = "";
  const keys = Object.keys(weatherData);
  var my_list = document.getElementById("cities");

  keys.forEach((key) => {
    str += '<option value="' + weatherData[key].cityName + '" />';
  });
  my_list.innerHTML = str;
  document.getElementById("input-city").value = "Kolkata";
  changeWeatherTimeDateDataForSelectedCity("kolkata");
  showSunnyCards();
  arrangeCardsInOrderContinentName();
};

const changeWeatherTimeDateDataForSelectedCity = (key) => {
  if (weatherData[key] === null) {
    return;
  }
  const cityWeatherData = new CityWeatherData(
    weatherData[key].cityName,
    weatherData[key].timeZone,
    weatherData[key].temperature,
    weatherData[key].humidity,
    weatherData[key].precipitation
  );

  document.getElementById("invalid-input").style.display = "none";
  cityWeatherData.changeIcon();
  cityWeatherData.changeTime();
  cityWeatherData.changeDate();
  cityWeatherData.changeWeatherData();
  cityWeatherData.changeNextFiveHrs();
};

const showNILValues = () => {
  if (cityTimeTimerId) {
    clearInterval(cityTimeTimerId);
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
  }
};

function changeCity() {
  let cityElement = document.getElementById("input-city");
  let cityName = cityElement.value;
  let isValidCity = false;

  const keys = Object.keys(weatherData);

  keys.forEach((key) => {
    if (weatherData[key].cityName == cityName) {
      isValidCity = true;
      cityElement.className = "";
      changeWeatherTimeDateDataForSelectedCity(key);
    }
  });

  if (!isValidCity) {
    cityElement.className = "incorrect";
    showNILValues();
  }
}

const arrangeCardsInContainer = (cities, weatherCondition, noOfCities) => {
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
          src="/Assets/Weather_Icons/${weatherCondition}Icon.svg"
          alt="${weatherCondition}Icon"
          width="18"
          height="18"
        />
        <span class="temp">${cities[i].temperature}</span>
      </p>
      <p class="time time-interval">
        ${cities[i].getTime12Hrs()}
      </p>
      <p class="time">${cities[i].getDate()}</p>
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
    ).style.backgroundImage = `url(/Assets/Icons_for_cities/${cities[
      i
    ].cityName.toLowerCase()}.svg)`;
  }
};

const setTimeIntervalsForMiddleCards = function (cities, noOfCities) {
  if (cityTimerId) {
    clearInterval(cityTimerId);
  }

  cityTimerId = setInterval(() => {
    for (let i = 0; i < noOfCities; i++) {
      let element = document.querySelectorAll(".time-interval")[i];
      let str = cities[i].getTime12Hrs();
      element.innerHTML = str;
    }
  }, oneMinuteTimeInterval);
};

const toggleArrowsAndDisplayNumber = function (noOfCities) {
  let thresholdValue;
  let windowWidth = window.innerWidth;

  if (windowWidth > 1300) {
    thresholdValue = 4;
  } else if (windowWidth > 970) {
    thresholdValue = 3;
  } else {
    thresholdValue = 2;
  }

  if (noOfCities > thresholdValue) {
    document.getElementById("arrow-left").style.visibility = "visible";
    document.getElementById("arrow-right").style.visibility = "visible";
  } else {
    document.getElementById("arrow-left").style.visibility = "hidden";
    document.getElementById("arrow-right").style.visibility = "hidden";
  }
  document.getElementById("no-of-cities").value =
    noOfCities > 10 ? 10 : noOfCities;
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
  let rainyCities = [];
  const keys = Object.keys(weatherData);

  keys.forEach((key) => {
    let temperatureValue = parseInt(weatherData[key].temperature);
    let humidityValue = parseInt(weatherData[key].humidity);
    if (temperatureValue < 20 && humidityValue >= 50) {
      rainyCities.push(key);
    }
  });
  rainyCities = rainyCities.sort((city1, city2) => {
    return parseInt(city2.humidity) - parseInt(city1.humidity);
  });

  rainyCities = createCityWeatherDataObjects(rainyCities);

  return rainyCities;
};

const filterSnowCards = function () {
  let snowCities = [];
  const keys = Object.keys(weatherData);

  keys.forEach((key) => {
    let temperatureValue = parseInt(weatherData[key].temperature);
    let humidityValue = parseInt(weatherData[key].humidity);
    let precipitationValue = parseInt(weatherData[key].precipitation);
    if (
      temperatureValue >= 20 &&
      temperatureValue <= 28 &&
      humidityValue > 50 &&
      precipitationValue < 50
    ) {
      snowCities.push(key);
    }
  });
  snowCities = snowCities.sort((city1, city2) => {
    return parseInt(city2.precipitation) - parseInt(city1.precipitation);
  });

  snowCities = createCityWeatherDataObjects(snowCities);

  return snowCities;
};

const filterSunnyCards = function () {
  let sunnyCities = [];
  const keys = Object.keys(weatherData);

  keys.forEach((key) => {
    let temperatureValue = parseInt(weatherData[key].temperature);
    let humidityValue = parseInt(weatherData[key].humidity);
    let precipitationValue = parseInt(weatherData[key].precipitation);
    if (
      temperatureValue > 29 &&
      humidityValue < 50 &&
      precipitationValue >= 50
    ) {
      sunnyCities.push(key);
    }
  });
  sunnyCities = sunnyCities.sort((city1, city2) => {
    return parseInt(city2.temperature) - parseInt(city1.temperature);
  });

  sunnyCities = createCityWeatherDataObjects(sunnyCities);

  return sunnyCities;
};

function showSunnyCards() {
  let sunnyCities = filterSunnyCards();

  document.getElementById("sunny-icon").className = "border";
  document.getElementById("snow-icon").className = "";
  document.getElementById("rainy-icon").className = "";
  toggleArrowsAndDisplayNumber(sunnyCities.length);
  arrangeCardsInContainer(sunnyCities, "sunny");
  setTimeIntervalsForMiddleCards(sunnyCities, sunnyCities.length);
}

function showSnowCards() {
  let snowCities = filterSnowCards();

  document.getElementById("sunny-icon").className = "";
  document.getElementById("snow-icon").className = "border";
  document.getElementById("rainy-icon").className = "";
  toggleArrowsAndDisplayNumber(snowCities.length);
  arrangeCardsInContainer(snowCities, "snowflake");
  setTimeIntervalsForMiddleCards(snowCities, snowCities.length);
}

function showRainyCards() {
  let rainyCities = filterRainyCards();

  document.getElementById("sunny-icon").className = "";
  document.getElementById("snow-icon").className = "";
  document.getElementById("rainy-icon").className = "border";
  toggleArrowsAndDisplayNumber(rainyCities.length);
  arrangeCardsInContainer(rainyCities, "rainy");
  setTimeIntervalsForMiddleCards(rainyCities, rainyCities.length);
}

function rightScroll() {
  var right = document.querySelector(".cards");
  var width = document.querySelector(".card").clientWidth * 1.2;

  right.scrollBy(width, 0);
}

function leftScroll() {
  var left = document.querySelector(".cards");
  var width = document.querySelector(".card").clientWidth * 1.2;
  left.scrollBy(-width, 0);
}

const isIdSelected = function (id) {
  return document.getElementById(id).className === "border";
};

function displayGivenNumberOfCities() {
  let noOfCities = document.getElementById("no-of-cities").value;
  let cities, weatherCondition;

  if (isIdSelected("sunny-icon")) {
    cities = filterSunnyCards();
    weatherCondition = "sunny";
  } else if (isIdSelected("snow-icon")) {
    cities = filterSnowCards();
    weatherCondition = "snowflake";
  } else {
    cities = filterRainyCards();
    weatherCondition = "rainy";
  }
  let sizeOfCitiesArray = cities.length > 10 ? 10 : cities.length;
  if (sizeOfCitiesArray < noOfCities || noOfCities < 3) {
    document.getElementById("no-of-cities").value = sizeOfCitiesArray;
    noOfCities = sizeOfCitiesArray;
  }
  toggleArrowsAndDisplayNumber(noOfCities);
  arrangeCardsInContainer(cities, weatherCondition, noOfCities);
  setTimeIntervalsForMiddleCards(cities, noOfCities);
}

const toggleArrows = function (element) {
  if (element.alt === "arrowUp") {
    element.alt = "arrowDown";
    element.src = arrowDownIconPath;
  } else {
    element.alt = "arrowUp";
    element.src = arrowUpIconPath;
  }
};

const getContinentName = function (timeZone) {
  return timeZone.split("/")[0];
};

const sortCitiesByTemperatureAndContinent = function (
  continetArrowDirection,
  temperatureArrowDirection
) {
  let continentVarable =
    continetArrowDirection === "arrowUp"
      ? sortOrderEnum.ASCENDING_ORDER
      : sortOrderEnum.DESCENDING_ORDER;
  let temperatureVariable =
    temperatureArrowDirection === "arrowUp"
      ? sortOrderEnum.ASCENDING_ORDER
      : sortOrderEnum.DESCENDING_ORDER;
  let cityKeys = Object.keys(weatherData);

  cityKeys = cityKeys.sort((city1, city2) => {
    return (
      getContinentName(weatherData[city1].timeZone).localeCompare(
        getContinentName(weatherData[city2].timeZone)
      ) * continentVarable ||
      (parseInt(weatherData[city1].temperature) -
        parseInt(weatherData[city2].temperature)) *
        temperatureVariable
    );
  });

  return createCityWeatherDataObjects(cityKeys);
};

const arrangeCardsInContainerByOrder = function (cityObjects) {
  let htmlInnerText = "";
  let cardsContainer = document.getElementById("continent-card-container");

  for (let i = 0; i < 12; i++) {
    htmlInnerText += `<div class="card">
    <p class="name">${getContinentName(cityObjects[i].timeZone)}</p>
    <p class="temp">${cityObjects[i].temperature}</p>
    <p class="place-time">${cityObjects[i].cityName}, ${cityObjects[
      i
    ].getTime12Hrs()}</p>
    <p class="humidity">
      <img
        src=${humidityIconPath}
        alt="humidityIcon"
        width="15"
        height="15"
      />
      ${cityObjects[i].humidity}
    </p>
  </div>`;
  }
  cardsContainer.innerHTML = htmlInnerText;
};

const setTimeIntervels = function (cityObjects) {
  if (continentTimerId) {
    clearInterval(continentTimerId);
  }
  continentTimerId = setInterval(() => {
    for (let i = 0; i < 12; i++) {
      let element = document.querySelectorAll(".place-time")[i];
      let str = `${cityObjects[i].cityName}, ${cityObjects[i].getTime12Hrs()}`;
      element.innerHTML = str;
    }
  }, oneMinuteTimeInterval);
};

const sortingAndArrangingCards = function () {
  let cityObjects = sortCitiesByTemperatureAndContinent(
    document.getElementById("continent-name").alt,
    document.getElementById("temperature").alt
  );

  arrangeCardsInContainerByOrder(cityObjects);
  setTimeIntervels(cityObjects);
};

function arrangeCardsInOrderTemperature() {
  let temperatureElement = document.getElementById("temperature");

  toggleArrows(temperatureElement);
  sortingAndArrangingCards();
}

function arrangeCardsInOrderContinentName() {
  let continentNameElement = document.getElementById("continent-name");

  toggleArrows(continentNameElement);
  sortingAndArrangingCards();
}
