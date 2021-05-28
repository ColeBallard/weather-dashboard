const router = require("express").Router();
const axios = require("axios");
const path = require("path");
require('dotenv').config();

router.get("/api/:city", (req, res) => {
  const data = {};
  console.log(`https://api.openweathermap.org/data/2.5/weather?q=${req.params.city}&units=imperial&appid=${process.env.OW_API_KEY}`)
  axios({
    url: `https://api.openweathermap.org/data/2.5/weather?q=${req.params.city}&units=imperial&appid=${process.env.OW_API_KEY}`,
    method: 'get'
  }).then(response => {
    data.name = response.data.name;
    data.country = response.data.sys.country;
    data.icon = response.data.weather[0].icon;
    data.desc = response.data.weather[0].description;
    data.temp = response.data.main.temp;
    data.hum = response.data.main.humidity;
    data.wind = response.data.wind.speed;

    axios({
      url: `https://api.openweathermap.org/data/2.5/onecall?lat=${response.data.coord.lat}&lon=${response.data.coord.lon}&units=imperial&appid=${process.env.OW_API_KEY}`,
      method: 'get'
    }).then(response => {
      data.uvi = response.data.current.uvi;
      data.daily = response.data.daily;

      res.json(data);
    });
  }).catch(response => {
    res.status(response.response.status).end();
  });
});

router.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, "/../public/index.html"));
});

module.exports = router;