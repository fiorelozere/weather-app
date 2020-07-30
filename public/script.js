const submitButton = document.getElementById("submit-button");

function getLocation() {
  if (navigator.geolocation) {
    return navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

async function geoSuccess(position) {
  var lat = position.coords.latitude;
  var lng = position.coords.longitude;
  const weatherData = await getWeatherData({lat, lng});
  populateWeatherData(weatherData);
}

function geoError() {
  alert("Geocoder failed.");
}

getLocation();

submitButton.addEventListener("click", async () => {
  const weatherInput = document.getElementById("find-weather").value;
  const geoCoords = await getGeoLocation(weatherInput);
  if (!geoCoords) {
    alert("Location you searched not found, please try again");
  } else {
    const weatherData = await getWeatherData(geoCoords);
    populateWeatherData(weatherData);
  }
});

async function getWeatherData(geoCoords) {
  const {lat, lng} = geoCoords;
  const response = await fetch(`/weather`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({lat, lon: lng}),
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
  return response.data;
}

async function getGeoLocation(weatherInput) {
  const response = await fetch(`/geolocation`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({city: weatherInput}),
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
  return response.data;
}

function populateWeatherData(data) {
  const icon = document.getElementById("weather-icon");
  const city = document.getElementById("name-data");
  const mainInfo = document.getElementById("main-data");
  const mainTemp = document.getElementById("temp-data");
  const feelsLike = document.getElementById("feels-like-data");
  const minTemp = document.getElementById("temp-min-data");
  const maxTemp = document.getElementById("temp-max-data");
  const sunrise = document.getElementById("sunrise-data");
  const sunset = document.getElementById("sunset-data");
  const humidity = document.getElementById("humidity-data");
  const pressure = document.getElementById("pressure-data");

  icon.src = `icons/${data.weather[0].icon}.png`;
  city.innerHTML = data.name;
  mainInfo.innerHTML = data.weather[0].main;
  mainTemp.innerHTML = Math.round(data.main.temp);
  feelsLike.innerHTML = Math.round(data.main.feels_like);
  minTemp.innerHTML = Math.round(data.main.temp_min);
  maxTemp.innerHTML = Math.round(data.main.temp_max);
  sunrise.innerHTML = new Date(data.sys.sunrise * 1000).toLocaleTimeString(
    "it-IT"
  );
  sunset.innerHTML = new Date(data.sys.sunset * 1000).toLocaleTimeString(
    "it-IT"
  );
  humidity.innerHTML = data.main.humidity;
  pressure.innerHTML = data.main.pressure;
}
