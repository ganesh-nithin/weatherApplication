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
  let dateStr = date[1] + "-" + months[parseInt(date[0]) - 1] + "-" + date[2];
  document.getElementById("date-id").innerHTML = dateStr;
}

function getTime(timeZone) {
  let time = new Date().toLocaleString("en-US", {
    timeZone: timeZone,
    timeStyle: "medium",
    hourCycle: "h24",
  });

  return time;
}

function changeDateTime(timeZone, dateAndTime) {
  if (timerId) {
    clearInterval(timerId);
  }

  timerId = setInterval(() => {
    let time = getTime(timeZone).split(":");
    document.getElementById("hour-minutes").innerHTML =
      (time[0] % 12) + ":" + time[1];
    document.getElementById("seconds").innerHTML = time[2];
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
}

function changeNextFiveHrs(weatherData, timeZone, currentTemp) {
  let hour = parseInt(getTime(timeZone).split(":")[0]);
  changeWeatherIconData(currentTemp, 0);
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

function changeCity() {
  let city = document.getElementById("input-city");
  let cityVal = city.value;
  let isCorrect = false;

  for (let key in weatherData) {
    if (weatherData[key].cityName == cityVal) {
      isCorrect = true;
      city.className = "";
      changeIcon(cityVal);
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
  }
  if (!isCorrect) {
    city.className = "incorrect";
  }
}

document.getElementById("input-city").addEventListener("change", changeCity);
