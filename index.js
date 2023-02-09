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
}

function changeIcon(city) {
  let image = document.getElementById("city-img");
  image.src = "/Assets/Icons for cities/" + city.toLowerCase() + ".svg";
  image.style.visibility = "visible";
}

function changeDate(date) {
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
  let dateStr = date[1] + "-" + months[date[0] - 1] + "-" + date[2];
  document.getElementById("date-id").innerHTML = dateStr;
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

function covertCelsiusToFahrenheit(temperature) {
  return (1.8 * parseInt(temperature.slice(0, -2)) + 32).toFixed() + "F";
}

function changeWeatherData(temperature, humidity, precipitation) {
  let fahrenheit = covertCelsiusToFahrenheit(temperature);

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
  changeDate(weatherData[key].dateAndTime.split(",")[0].split("/"));
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
    timeStyle: "medium",
    hourCycle: "h12",
  });
}

function arrangeCardsInContainer(cities, weatherCondition) {
  let str = "";
  let cardsContainer = document.getElementById("cards");

  for (let i = 0; i < cities.length; i++) {
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
      <p class="time">${getTime12Hrs(cities[i].timeZone)}</p>
      <p class="time">${cities[i].dateAndTime.split(",")[0]}</p>
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
  for (let i = 0; i < cities.length; i++) {
    document.getElementById(
      `card${i}`
    ).style.backgroundImage = `url(/Assets/Icons%20for%20cities/${cities[
      i
    ].cityName.toLowerCase()}.svg)`;
  }
}

function filterSunnyCards() {
  let sunnyCities = [];

  for (let key in weatherData) {
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
  }
  sunnyCities = sunnyCities.sort((temperature1, temperature2) => {
    return (
      parseInt(temperature2.temperature) - parseInt(temperature1.temperature)
    );
  });

  arrangeCardsInContainer(sunnyCities, "sunny");
}

function showSunnyCards() {
  document.getElementById("sunny-icon").className = "border";
  document.getElementById("snow-icon").className = "";
  document.getElementById("rainy-icon").className = "";
  filterSunnyCards();
}

function showSnowCards() {
  document.getElementById("sunny-icon").className = "";
  document.getElementById("snow-icon").className = "border";
  document.getElementById("rainy-icon").className = "";
}

function showRainyCards() {
  document.getElementById("sunny-icon").className = "";
  document.getElementById("snow-icon").className = "";
  document.getElementById("rainy-icon").className = "border";
}

document.getElementById("sunny-icon").addEventListener("click", showSunnyCards);
document.getElementById("snow-icon").addEventListener("click", showSnowCards);
document.getElementById("rainy-icon").addEventListener("click", showRainyCards);
