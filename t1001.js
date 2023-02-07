let weatherData;

fetch("/Assets/files/data.json")
  .then((myJson) => myJson.json())
  .then((json) => {
    weatherData = json;
    console.log(weatherData);
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

function changeDateTime(timeZone, dateAndTime) {
  if (timerId) {
    clearInterval(timerId);
  }

  timerId = setInterval(() => {
    let date = new Date()
      .toLocaleString("en-US", {
        timeZone: timeZone,
        timeStyle: "medium",
        hourCycle: "h24",
      })
      .split(":");
    document.getElementById("hour-minutes").innerHTML =
      (date[0] % 12) + ":" + date[1];
    document.getElementById("seconds").innerHTML = date[2];
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
    }
  }
  if (!isCorrect) {
    city.className = "incorrect";
  }
}

document.getElementById("input-city").addEventListener("change", changeCity);
