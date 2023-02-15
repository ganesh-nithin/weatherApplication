let weatherData;

fetch("/Assets/files/data.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    return response.json();
  })
  .then((json) => {
    weatherData = json;
    settingCitiesToDropdownAndAddingDefaultCity();
  })
  .catch((err) => console.error(`Fetch problem: ${err.message}`));

var timerId;

function settingCitiesToDropdownAndAddingDefaultCity() {
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
}

function changeIcon(city) {
  let image = document.getElementById("city-img");
  image.src = "/Assets/Icons for cities/" + city.toLowerCase() + ".svg";
  image.style.visibility = "visible";
}

function formatDate(date) {
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

function getTime(timeZone) {
  return new Date().toLocaleString("en-US", {
    timeZone: timeZone,
    timeStyle: "medium",
    hourCycle: "h24",
  });
}

function isTimeAm(time) {
  return time >= 0 && time <= 12;
}

function changeTime(timeZone) {
  if (timerId) {
    clearInterval(timerId);
  }
  document.getElementById("stateIcon").style.visibility = "visible";

  timerId = setInterval(() => {
    let time = getTime(timeZone).split(":");
    document.getElementById("hour-minutes").innerHTML =
      (time[0] % 12) + ":" + time[1];
    document.getElementById("seconds").innerHTML = ":" + time[2];
    if (isTimeAm(time[0])) {
      document.getElementById("stateIcon").src =
        "/Assets/General Images & Icons/amState.svg";
    } else {
      document.getElementById("stateIcon").src =
        "/Assets/General Images & Icons/pmState.svg";
    }
  }, 100);
}

function changeDate(dateAndTime) {
  let unFormatDate = dateAndTime.split(",")[0].split("/");
  let dateString = formatDate(unFormatDate);
  document.getElementById("date-id").innerHTML = dateString;
}

function convertCelsiusToFahrenheit(temperature) {
  return (1.8 * parseInt(temperature.slice(0, -2)) + 32).toFixed() + "F";
}

function changeWeatherData(temperature, humidity, precipitation) {
  let fahrenheit = convertCelsiusToFahrenheit(temperature);

  document.getElementById("temperature-celsius").innerHTML = temperature;
  document.getElementById("humidity").innerHTML = humidity;
  document.getElementById("precipitation").innerHTML = precipitation;
  document.getElementById("temperature-fahrenheit").innerHTML = fahrenheit;
}

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
  image.style.visibility = "visible";
}

function isTimeAmfor24Format(time) {
  return time <= 12 || time >= 24;
}

function changeNextFiveHrs(weatherData, timeZone, currentTemp) {
  let hour = parseInt(getTime(timeZone).split(":")[0]);
  changeWeatherIconData(currentTemp, 0);
  document.getElementById("time0").innerHTML = "NOW";
  for (let i = 1; i < 5; i++) {
    let displayHour = hour + i;
    if (isTimeAmfor24Format(displayHour)) {
      displayHour = (displayHour % 24) + "AM";
    } else {
      displayHour = (displayHour % 12) + "PM";
    }
    document.getElementById(`time${i}`).innerHTML = displayHour;
    changeWeatherIconData(weatherData[i - 1], i);
  }
}

function changeWeatherTimeDateDataForSelectedCity(key) {
  if (weatherData[key] === null) {
    return;
  }
  document.getElementById("invalid-input").style.display = "none";
  changeIcon(weatherData[key].cityName);
  changeTime(weatherData[key].timeZone);
  changeDate(weatherData[key].dateAndTime);
  changeWeatherData(
    weatherData[key].temperature,
    weatherData[key].humidity,
    weatherData[key].precipitation
  );
  changeNextFiveHrs(
    weatherData[key].nextFiveHrs,
    weatherData[key].timeZone,
    weatherData[key].temperature
  );
}

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
  }
}

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

document.getElementById("input-city").addEventListener("change", changeCity);

function getTime12Hrs(timeZone) {
  return new Date().toLocaleString("en-US", {
    timeZone: timeZone,
    timeStyle: "short",
    hourCycle: "h12",
  });
}

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
      <p class="time time-interval">
        ${getTime12Hrs(cities[i].timeZone)}
      </p>
      <p class="time">${formatDate(
        cities[i].dateAndTime.split(",")[0].split("/")
      )}</p>
      <p class="value">
        <img
          src="/Assets/Weather Icons/humidityIcon.svg"
          alt="humidityIcon"
          width="15"
          height="15"
        />
        ${cities[i].humidity}
      </p>
      <p class="value">
        <img
          src="/Assets/Weather Icons/precipitationIcon.svg"
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
  }
}

var cityTimerId;
const timeIntervalValue = 60000;

function setTimeIntervalsForMiddleCards(cities, noOfCities) {
  if (cityTimerId) {
    clearInterval(cityTimerId);
  }

  cityTimerId = setInterval(() => {
    for (let i = 0; i < noOfCities; i++) {
      let element = document.querySelectorAll(".time-interval")[i];
      let str = getTime12Hrs(cities[i].timeZone);
      element.innerHTML = str;
    }
  }, timeIntervalValue);
}

function toggleArrowsAndDisplayNumber(noOfCities) {
  if (noOfCities > 4) {
    document.getElementById("arrow-left").style.visibility = "visible";
    document.getElementById("arrow-right").style.visibility = "visible";
  } else {
    document.getElementById("arrow-left").style.visibility = "hidden";
    document.getElementById("arrow-right").style.visibility = "hidden";
  }
  document.getElementById("no-of-cities").value =
    noOfCities > 10 ? 10 : noOfCities;
}

var cardsTimerId;

function filterRainyCards() {
  let rainyCities = [];
  const keys = Object.keys(weatherData);

  keys.forEach((key) => {
    let temperatureValue = parseInt(weatherData[key].temperature);
    let humidityValue = parseInt(weatherData[key].humidity);
    if (temperatureValue < 20 && humidityValue >= 50) {
      rainyCities.push(weatherData[key]);
    }
  });
  rainyCities = rainyCities.sort((city1, city2) => {
    return parseInt(city2.humidity) - parseInt(city1.humidity);
  });

  return rainyCities;
}

function filterSnowCards() {
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
      snowCities.push(weatherData[key]);
    }
  });
  snowCities = snowCities.sort((city1, city2) => {
    return parseInt(city2.precipitation) - parseInt(city1.precipitation);
  });

  return snowCities;
}

function filterSunnyCards() {
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
      sunnyCities.push(weatherData[key]);
    }
  });
  sunnyCities = sunnyCities.sort((city1, city2) => {
    return parseInt(city2.temperature) - parseInt(city1.temperature);
  });

  return sunnyCities;
}

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

document.getElementById("sunny-icon").addEventListener("click", showSunnyCards);
document.getElementById("snow-icon").addEventListener("click", showSnowCards);
document.getElementById("rainy-icon").addEventListener("click", showRainyCards);

function rightScroll() {
  var right = document.querySelector(".cards");
  var width = document.querySelector(".card").clientWidth * 1.2;
  right.scrollBy(width, 0);
}
document.getElementById("arrow-right").addEventListener("click", rightScroll);

function leftScroll() {
  var left = document.querySelector(".cards");
  var width = document.querySelector(".card").clientWidth * 1.2;
  left.scrollBy(-width, 0);
}
document.getElementById("arrow-left").addEventListener("click", leftScroll);

function isIdSelected(id) {
  return document.getElementById(id).className === "border";
}

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

let noOfCitiesId = document.getElementById("no-of-cities");
noOfCitiesId.addEventListener("change", displayGivenNumberOfCities);

function toogleArrows(element) {
  if (element.alt === "arrowDown") {
    element.alt = "arrowUp";
    element.src = "/Assets/General Images & Icons/arrowUp.svg";
  } else {
    element.alt = "arrowDown";
    element.src = "/Assets/General Images & Icons/arrowDown.svg";
  }
}

function sortCitiesByTemperatureAndContinent(
  cityKeys,
  continetArrowDirection,
  temperatureArrowDirection
) {
  let continentVarable = continetArrowDirection === "arrowUp" ? 1 : -1;
  let temperatureVariable = temperatureArrowDirection === "arrowUp" ? 1 : -1;

  cityKeys = cityKeys.sort((city1, city2) => {
    return (
      weatherData[city1].timeZone
        .split("/")[0]
        .localeCompare(weatherData[city2].timeZone.split("/")[0]) *
        continentVarable ||
      (parseInt(weatherData[city1].temperature) -
        parseInt(weatherData[city2].temperature)) *
        temperatureVariable
    );
  });

  return cityKeys;
}

function arrangeCardsInContainerByOrder(cityKeys) {
  let htmlInnerText = "";
  let cardsContainer = document.getElementById("continent-card-container");

  for (let i = 0; i < 12; i++) {
    htmlInnerText += `<div class="card">
    <p class="name">${weatherData[cityKeys[i]].timeZone.split("/")[0]}</p>
    <p class="temp">${weatherData[cityKeys[i]].temperature}</p>
    <p class="place-time">${weatherData[cityKeys[i]].cityName}, ${getTime12Hrs(
      weatherData[cityKeys[i]].timeZone
    )}</p>
    <p class="humidity">
      <img
        src="/Assets/Weather Icons/humidityIcon.svg"
        alt="humidityIcon"
        width="15"
        height="15"
      />
      ${weatherData[cityKeys[i]].humidity}
    </p>
  </div>`;
  }
  cardsContainer.innerHTML = htmlInnerText;
}
var continentTimerId;
function setTimeIntervels(cityKeys) {
  if (continentTimerId) {
    clearInterval(continentTimerId);
  }
  continentTimerId = setInterval(() => {
    for (let i = 0; i < 12; i++) {
      let element = document.querySelectorAll(".place-time")[i];
      let str =
        weatherData[cityKeys[i]].cityName +
        " , " +
        getTime12Hrs(weatherData[cityKeys[i]].timeZone);
      element.innerHTML = str;
    }
  }, 60000);
}

function sortingAndArrangingCards() {
  let cityKeys = sortCitiesByTemperatureAndContinent(
    Object.keys(weatherData),
    document.getElementById("continent-name").alt,
    document.getElementById("temperature").alt
  );

  arrangeCardsInContainerByOrder(cityKeys);
  setTimeIntervels(cityKeys);
}

function arrangeCardsInOrderTemperature() {
  let temperatureElement = document.getElementById("temperature");

  toogleArrows(temperatureElement);
  sortingAndArrangingCards();
}

function arrangeCardsInOrderContinentName() {
  let continentNameElement = document.getElementById("continent-name");

  toogleArrows(continentNameElement);
  sortingAndArrangingCards();
}

document
  .getElementById("continent-name")
  .addEventListener("click", arrangeCardsInOrderContinentName);

document
  .getElementById("temperature")
  .addEventListener("click", arrangeCardsInOrderTemperature);
