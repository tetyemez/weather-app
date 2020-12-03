window.onload = getLocation();
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(currentWeatherLoading);
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

const weather_api_key = "2c5d5345d21241fd2639199e6c923f71";
const cityName = document.querySelector("input");
const weatherInfoDiv = document.getElementById("weather-info-div");
const loader = document.getElementById("loader");
loader.style.display = "none";
let tempType = 0;

const h1 = document.createElement("span");
h1.className = "degree";
const h5 = document.createElement("span");
h5.className = "city-name-span";
const img = document.createElement("img");
const tempDiv = document.createElement("div");
tempDiv.className = "temperature";
const textCelsius = document.createElement("span");
textCelsius.className = "text-celsius";
textCelsius.innerHTML = "&#8451";
const textFahrenheit = document.createElement("span");
textFahrenheit.className = "text-fahrenheit";
textFahrenheit.innerHTML = "&#8457";
const textSeperator = document.createElement("span");
textSeperator.innerHTML = " | ";
tempDiv.append(textCelsius, textSeperator, textFahrenheit);

const res = document.getElementById("no-such-city");
res.style.display = "none";

//without async await
function getWeather() {
  fetch(
    "http://api.openweathermap.org/data/2.5/weather?q=" +
      cityName.value +
      "&appid=" +
      api_key
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      let temp = Math.round(data.main.temp - 273.15) + "&#8451";
      let cName = data.name + "," + data.sys.country;
      let weatherDescription = data.weather[0].description;

      h1.innerHTML = temp;
      h3.innerHTML = cName;
      p.innerHTML = weatherDescription;
    })
    .catch(function (err) {
      console.log(err);
    });
}

cityName.addEventListener("keyup", function (event) {
  if (event.key == "Enter") {
    event.preventDefault();
    weatherLoading();
  }
});
textCelsius.addEventListener("click", () => {
  if (tempType !== 0) {
    h1.innerHTML = fToC(h1.textContent);
  }
  tempType = 0;
});
textFahrenheit.addEventListener("click", () => {
  if (tempType !== 1) {
    h1.innerHTML = cToF(h1.textContent);
  }
  tempType = 1;
});

function cToF(celsius) {
  var cTemp = celsius;
  return ((cTemp * 9) / 5 + 32).toFixed(1);
}
function fToC(fahrenheit) {
  var fTemp = fahrenheit;
  return (((fTemp - 32) * 5) / 9).toFixed(1);
}
function currentWeatherLoading(position) {
  loader.style.display = "block";
  setTimeout(() => {
    getCurrentWeather(position);
  }, 500);
}
function weatherLoading() {
  loader.style.display = "block";
  setTimeout(() => {
    getWeatherCondition();
  }, 1000);
}
function calculateTemperature(temp) {
  if (tempType == 0) {
    return (temp - 273.15).toFixed(1);
  } else {
    return ((temp - 273) * 1.8 + 32).toFixed(1);
  }
}
function putWeatherInformation(response) {
  let temp = calculateTemperature(response.main.temp);
  let cName = response.name + "," + response.sys.country;
  // let weatherDescription = response.weather[0].description;

  h1.innerHTML = temp;
  h5.innerHTML = cName;
  img.src = getImageUrl(response.weather[0].id);

  weatherInfoDiv.appendChild(tempDiv);
  weatherInfoDiv.append(h1);
  weatherInfoDiv.appendChild(h5);
  weatherInfoDiv.appendChild(img);
}

function getImageUrl(id) {
  if (id / 100 == 2) {
    return "/assets/img/thunder storm.png";
  } else if (id / 100 == 3 || (id >= 520 && id <= 531)) {
    return "/assets/img/drizzle.png";
  } else if (id >= 500 && id <= 504) {
    return "/assets/img/rain.png";
  } else if (id == 504 || (id >= 600 && id <= 622)) {
    return "/assets/img/snow.png";
  } else if (id >= 701 && id <= 781) {
    return "/assets/img/mist.png";
  } else if (id == 801 || id == 803 || id == 804) {
    return "/assets/img/broken clouds.png";
  } else {
    return "/assets/img/scattered clouds.png";
  }
}

async function getWeatherCondition() {
  try {
    const weatherResponse = await fetch(
      `http://api.openweathermap.org/data/2.5/weather?q=${cityName.value}&appid=${weather_api_key}`
    );
    const weatherData = await weatherResponse.json();

    //No such city
    if (weatherResponse.statusText == "OK") {
      putWeatherInformation(weatherData);
      res.style.display = "none";
      loader.style.display = "none";
    } else {
      loader.style.display = "none";
      res.style.display = "block";
      cityName.value = "";
    }
  } catch (error) {
    console.log(error);
  }
}

async function getCurrentWeather(position) {
  try {
    const weatherResponse = await fetch(
      `http://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${weather_api_key}`
    );
    const weatherData = await weatherResponse.json();
    loader.style.display = "none";
    putWeatherInformation(weatherData);
  } catch (error) {
    console.log(error);
  }
}
