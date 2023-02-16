function Weather(weatherData) {
  this.weatherData = weatherData;
  this.timerId;
  this.amStateIconPath = "/Assets/General%20Images%20&%20Icons/amState.svg";
  this.pmStateIconPath = "/Assets/General%20Images%20&%20Icons/pmState.svg";
  this.humidityIconPath = "/Assets/Weather%20Icons/humidityIcon.svg";
  this.precipitationIconPath = "/Assets/Weather%20Icons/precipitationIcon.svg";
  this.cityTimerId;
  this.timeIntervalValue = 60000;
  this.cardsTimerId;
  this.arrowUpIconPath = "/Assets/General%20Images%20&%20Icons/arrowUp.svg";
  this.arrowDownIconPath = "/Assets/General%20Images%20&%20Icons/arrowDown.svg";
  this.noOfCitiesId = document.getElementById("no-of-cities");
  this.continentTimerId;
}

fetch("/Assets/files/data.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    return response.json();
  })
  .then((json) => {
    weatherData = json;
    let weather = new Weather(weatherData);
    weather.settingCitiesToDropdownAndAddingDefaultCity();
  })
  .catch((err) => console.error(`Fetch problem: ${err.message}`));

Weather.prototype.settingCitiesToDropdownAndAddingDefaultCity = function () {
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

Weather.prototype.changeIcon = function (city) {
  let image = document.getElementById("city-img");
  image.src = "/Assets/Icons for cities/" + city.toLowerCase() + ".svg";
  image.style.visibility = "visible";
};

Weather.prototype.formatDate = function (date) {
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

Weather.prototype.getTime = function (timeZone) {
  return new Date().toLocaleString("en-US", {
    timeZone: timeZone,
    timeStyle: "medium",
    hourCycle: "h24",
  });
};

Weather.prototype.isTimeAm = function (time) {
  return time >= 0 && time < 12;
};

Weather.prototype.changeTime = function (timeZone) {
  if (timerId) {
    clearInterval(timerId);
  }
  document.getElementById("stateIcon").style.visibility = "visible";

  timerId = setInterval(() => {
    let time = getTime(timeZone).split(":");
    document.getElementById("hour-minutes").innerHTML =
      (time[0] == 12 ? 12 : time[0] % 12) + ":" + time[1];
    document.getElementById("seconds").innerHTML = ":" + time[2];
    if (isTimeAm(time[0])) {
      document.getElementById("stateIcon").src = amStateIconPath;
    } else {
      document.getElementById("stateIcon").src = pmStateIconPath;
    }
  }, 100);
};

Weather.prototype.changeDate = function (dateAndTime) {
  let unFormatDate = dateAndTime.split(",")[0].split("/");
  let dateString = formatDate(unFormatDate);
  document.getElementById("date-id").innerHTML = dateString;
};

Weather.prototype.convertCelsiusToFahrenheit = function (temperature) {
  return (1.8 * parseInt(temperature.slice(0, -2)) + 32).toFixed() + "F";
};

Weather.prototype.changeWeatherData = function (
  temperature,
  humidity,
  precipitation
) {
  let fahrenheit = convertCelsiusToFahrenheit(temperature);

  document.getElementById("temperature-celsius").innerHTML = temperature;
  document.getElementById("humidity").innerHTML = humidity;
  document.getElementById("precipitation").innerHTML = precipitation;
  document.getElementById("temperature-fahrenheit").innerHTML = fahrenheit;
};

Weather.prototype.changeWeatherIconData = function (temperature, number) {
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
};

Weather.prototype.isTimeAmfor24Format = function (time) {
  return time <= 12 || time >= 24;
};

Weather.prototype.changeNextFiveHrs = function (
  weatherData,
  timeZone,
  currentTemp
) {
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
};

Weather.prototype.changeWeatherTimeDateDataForSelectedCity = function (key) {
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
};

Weather.prototype.showNILValues = function () {
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
};

Weather.prototype.changeCity = function () {
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
};

document.getElementById("input-city").addEventListener("change", changeCity);

Weather.prototype.getTime12Hrs = function (timeZone) {
  return new Date().toLocaleString("en-US", {
    timeZone: timeZone,
    timeStyle: "short",
    hourCycle: "h12",
  });
};

Weather.prototype.arrangeCardsInContainer = function (
  cities,
  weatherCondition,
  noOfCities
) {
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
  }
};

Weather.prototype.setTimeIntervalsForMiddleCards = function (
  cities,
  noOfCities
) {
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
};

Weather.prototype.toggleArrowsAndDisplayNumber = function (noOfCities) {
  if (noOfCities > 4) {
    document.getElementById("arrow-left").style.visibility = "visible";
    document.getElementById("arrow-right").style.visibility = "visible";
  } else {
    document.getElementById("arrow-left").style.visibility = "hidden";
    document.getElementById("arrow-right").style.visibility = "hidden";
  }
  document.getElementById("no-of-cities").value =
    noOfCities > 10 ? 10 : noOfCities;
};

Weather.prototype.filterRainyCards = function () {
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
};

Weather.prototype.filterSnowCards = function () {
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
};

Weather.prototype.filterSunnyCards = function () {
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
};

Weather.prototype.showSunnyCards = function () {
  let sunnyCities = filterSunnyCards();

  document.getElementById("sunny-icon").className = "border";
  document.getElementById("snow-icon").className = "";
  document.getElementById("rainy-icon").className = "";
  toggleArrowsAndDisplayNumber(sunnyCities.length);

  arrangeCardsInContainer(sunnyCities, "sunny");
  setTimeIntervalsForMiddleCards(sunnyCities, sunnyCities.length);
};

Weather.prototype.showSnowCards = function () {
  let snowCities = filterSnowCards();

  document.getElementById("sunny-icon").className = "";
  document.getElementById("snow-icon").className = "border";
  document.getElementById("rainy-icon").className = "";
  toggleArrowsAndDisplayNumber(snowCities.length);

  arrangeCardsInContainer(snowCities, "snowflake");
  setTimeIntervalsForMiddleCards(snowCities, snowCities.length);
};

Weather.prototype.showRainyCards = function () {
  let rainyCities = filterRainyCards();

  document.getElementById("sunny-icon").className = "";
  document.getElementById("snow-icon").className = "";
  document.getElementById("rainy-icon").className = "border";
  toggleArrowsAndDisplayNumber(rainyCities.length);

  arrangeCardsInContainer(rainyCities, "rainy");
  setTimeIntervalsForMiddleCards(rainyCities, rainyCities.length);
};

document.getElementById("sunny-icon").addEventListener("click", showSunnyCards);
document.getElementById("snow-icon").addEventListener("click", showSnowCards);
document.getElementById("rainy-icon").addEventListener("click", showRainyCards);

Weather.prototype.rightScroll = function () {
  var right = document.querySelector(".cards");
  var width = document.querySelector(".card").clientWidth * 1.2;
  right.scrollBy(width, 0);
};
document.getElementById("arrow-right").addEventListener("click", rightScroll);

Weather.prototype.leftScroll = function () {
  var left = document.querySelector(".cards");
  var width = document.querySelector(".card").clientWidth * 1.2;
  left.scrollBy(-width, 0);
};
document.getElementById("arrow-left").addEventListener("click", leftScroll);

Weather.prototype.isIdSelected = function (id) {
  return document.getElementById(id).className === "border";
};

Weather.prototype.displayGivenNumberOfCities = function () {
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
};

noOfCitiesId.addEventListener("change", displayGivenNumberOfCities);

Weather.prototype.toogleArrows = function (element) {
  if (element.alt === "arrowUp") {
    element.alt = "arrowDown";
    element.src = arrowDownIconPath;
  } else {
    element.alt = "arrowUp";
    element.src = arrowUpIconPath;
  }
};

const sortOrderEnum = {
  ASCENDING_ORDER: 1,
  DESCENDING_ORDER: -1,
};

Weather.prototype.getContinentName = function (timeZone) {
  return timeZone.split("/")[0];
};

Weather.prototype.sortCitiesByTemperatureAndContinent = function (
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
  });

  return cityKeys;
};

Weather.prototype.arrangeCardsInContainerByOrder = function (cityKeys) {
  let htmlInnerText = "";
  let cardsContainer = document.getElementById("continent-card-container");

  for (let i = 0; i < 12; i++) {
    htmlInnerText += `<div class="card">
    <p class="name">${getContinentName(weatherData[cityKeys[i]].timeZone)}</p>
    <p class="temp">${weatherData[cityKeys[i]].temperature}</p>
    <p class="place-time">${weatherData[cityKeys[i]].cityName}, ${getTime12Hrs(
      weatherData[cityKeys[i]].timeZone
    )}</p>
    <p class="humidity">
      <img
        src=${humidityIconPath}
        alt="humidityIcon"
        width="15"
        height="15"
      />
      ${weatherData[cityKeys[i]].humidity}
    </p>
  </div>`;
  }
  cardsContainer.innerHTML = htmlInnerText;
};

Weather.prototype.setTimeIntervels = function (cityKeys) {
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
};

Weather.prototype.sortingAndArrangingCards = function () {
  let cityKeys = sortCitiesByTemperatureAndContinent(
    Object.keys(weatherData),
    document.getElementById("continent-name").alt,
    document.getElementById("temperature").alt
  );

  arrangeCardsInContainerByOrder(cityKeys);
  setTimeIntervels(cityKeys);
};

Weather.prototype.arrangeCardsInOrderTemperature = function () {
  let temperatureElement = document.getElementById("temperature");

  toggleArrows(temperatureElement);
  sortingAndArrangingCards();
};

Weather.prototype.arrangeCardsInOrderContinentName = function () {
  let continentNameElement = document.getElementById("continent-name");

  toggleArrows(continentNameElement);
  sortingAndArrangingCards();
};

document
  .getElementById("continent-name")
  .addEventListener("click", arrangeCardsInOrderContinentName);

document
  .getElementById("temperature")
  .addEventListener("click", arrangeCardsInOrderTemperature);
