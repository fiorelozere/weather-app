const express = require("express");
const axios = require("axios");
var bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

app.use(express.static("public"));
app.use(bodyParser.json());

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const GEOLOCATION_API_KEY = process.env.GEOLOCATION_API_KEY;

app.get("/", (req, res) => {
  res.render("index.html");
});

app.post("/weather", async (req, res) => {
  const lat = req.body.lat;
  const lon = req.body.lon;

  await axios(`http://api.openweathermap.org/data/2.5/weather`, {
    params: {lat, lon, appid: WEATHER_API_KEY, units: "metric"},
  })
    .then((response) => {
      res.status(200).json({
        status: 200,
        data: response.data,
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

app.post("/geolocation/", async (req, res) => {
  const city = req.body.city;
  await axios(`https://api.opencagedata.com/geocode/v1/json`, {
    params: {q: req.body.city, key: GEOLOCATION_API_KEY},
  })
    .then((response) => {
      res.status(200).json({
        status: 200,
        data: response.data.results[0].geometry,
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running in port ${port}`);
});
