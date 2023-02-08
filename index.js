let weatherData;

fetch("/Assets/files/data.json")
  .then((myJson) => myJson.json())
  .then((json) => {
    weatherData = json;
    indexFunction();
  });

var timerId;

function indexFunction() {
  var str = "";

  for (let key in weatherData) {
    str += '<option value="' + weatherData[key].cityName + '" />';
  }
  var my_list = document.getElementById("cities");
  my_list.innerHTML = str;
  document.getElementById("input-city").value = "Kolkata";
  changeFeatures("kolkata");
}

function changeIcon(city) {
  let image = document.getElementById("city-img");
  image.src = "/Assets/Icons for cities/" + city.toLowerCase() + ".svg";
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

function changeDateTime(timeZone, dateAndTime) {
  if (timerId) {
    clearInterval(timerId);
  }

  timerId = setInterval(() => {
    let time = getTime(timeZone).split(":");
    document.getElementById("hour-minutes").innerHTML =
      (time[0] % 12) + ":" + time[1];
    document.getElementById("seconds").innerHTML = ":" + time[2];
    if (time[0] >= 0 && time[0] <= 11) {
      document.getElementById("stateIcon").src =
        "/Assets/General Images & Icons/amState.svg";
    } else {
      document.getElementById("stateIcon").src =
        "/Assets/General Images & Icons/pmState.svg";
    }
  }, 100);

  changeDate(dateAndTime.split(",")[0].split("/"));
}

function changeWeatherData(temperature, humidity, precipitation) {
  let fahrenheit =
    (1.8 * parseInt(temperature.slice(0, -2)) + 32).toFixed() + "F";

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
}

function changeNextFiveHrs(weatherData, timeZone, currentTemp) {
  let hour = parseInt(getTime(timeZone).split(":")[0]);
  changeWeatherIconData(currentTemp, 0);
  document.getElementById("time0").innerHTML = "NOW";
  for (let i = 1; i < 5; i++) {
    let displayHour = hour + i;
    if (displayHour <= 12 || displayHour >= 24) {
      displayHour = (displayHour % 24) + "AM";
    } else {
      displayHour = (displayHour % 12) + "PM";
    }
    document.getElementById(`time${i}`).innerHTML = displayHour;
    changeWeatherIconData(weatherData[i - 1], i);
  }
}

function changeFeatures(key) {
  changeIcon(weatherData[key].cityName);
  changeDateTime(weatherData[key].timeZone, weatherData[key].dateAndTime);
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
  document.getElementById("city-img").src = "";
  document.getElementById("city-img").alt = "";
  if (timerId) {
    clearInterval(timerId);
  }
  document.getElementById("hour-minutes").innerHTML = "NIL:NIL";
  document.getElementById("seconds").innerHTML = ":NIL";
  document.getElementById("stateIcon").src = "";
  document.getElementById("stateIcon").alt = "";
  document.getElementById("date-id").innerHTML = "NIL-NIL-NIL";
  document.getElementById("temperature-celsius").innerHTML = "NIL";
  document.getElementById("humidity").innerHTML = "NIL";
  document.getElementById("temperature-fahrenheit").innerHTML = "NIL";
  document.getElementById("precipitation").innerHTML = "NIL";
  for (let i = 0; i <= 4; i++) {
    document.getElementById(`time${i}`).innerHTML = "NIL";
    document.getElementById(`weatherImg${i}`).src = "NIL";
    document.getElementById(`weatherImg${i}`).title = "";
    document.getElementById(`weatherImg${i}`).alt = "";
    document.getElementById(`temp${i}`).innerHTML = "NIL";
  }
}

function changeCity() {
  let city = document.getElementById("input-city");
  let cityVal = city.value;
  let isCorrect = false;

  for (let key in weatherData) {
    if (weatherData[key].cityName == cityVal) {
      isCorrect = true;
      city.className = "";
      changeFeatures(key);
    }
  }
  if (!isCorrect) {
    city.className = "incorrect";
    showNILValues();
  }
}

document.getElementById("input-city").addEventListener("change", changeCity);
