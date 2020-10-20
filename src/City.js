import axios from "axios";
import dotenv from "dotenv";
import moment from "moment";
import _ from "lodash";
import {
  faSun,
  faMoon,
  faCloudSun,
  faCloudMoon,
  faCloud,
  faCloudSunRain,
  faCloudMoonRain,
  faCloudRain,
  faBolt,
  faSnowflake,
} from "@fortawesome/free-solid-svg-icons";

dotenv.config();

const ICONS = {
  "01d": faSun,
  "01n": faMoon,
  "02d": faCloudSun,
  "02n": faCloudMoon,
  "03d": faCloud,
  "03n": faCloud,
  "04d": faCloud,
  "04n": faCloud,
  "09d": faCloudRain,
  "09n": faCloudRain,
  "10d": faCloudSunRain,
  "10n": faCloudMoonRain,
  "11d": faBolt,
  "11n": faBolt,
  "13d": faSnowflake,
  "13n": faSnowflake,
};

// const axios = require('axios');
// require('dotenv').config();
class City {
  constructor(cityName) {
    this.cityName = cityName;
    this.coords = null;
    this.weather = null;
  }

  async getCoords() {
    if (this.coords !== null) {
      return this.coords;
    }
    const geoURL = "http://dev.virtualearth.net/REST/v1/Locations";
    try {
      console.log(process.env);
      const response = await axios.get(
        `${geoURL}/${this.cityName}?key=${process.env.REACT_APP_BING_KEY}`
      );
      // console.log(response.data);
      for (let resource of response.data.resourceSets[0].resources) {
        if (resource.confidence === "High") {
          this.coords = resource.point.coordinates;
          return resource.point.coordinates;
        }
      }
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async getWeather() {
    if (this.weather !== null) {
      return this.weather;
    }
    const owmURL = `https://api.openweathermap.org/data/2.5/onecall?`;
    try {
      let [lat, lon] = await this.getCoords();
      const response = await axios.get(
        `${owmURL}lat=${lat}&lon=${lon}&exclude=minutely&appid=${process.env.REACT_APP_OWA_KEY}`
      );
      this.weather = response.data;
      let temps = response.data.hourly.map((x) => { return x.temp; })
      this.weather.max = _.max(temps);
      this.weather.min = _.min(temps);
      this.weather.icon = ICONS[response.data.current.weather[0].icon];
      this.weather.hourly = this.formatHourly(response.data);
      this.weather.daily = this.formatDaily(response.data);
      this.weather.timezone = response.data.timezone;
      this.weather.sunset = response.data.current.sunset;
      this.weather.sunrise = response.data.current.sunrise;
      return response.data;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  formatHourly(json) {
    let hourly = {};
    if (this.weather !== null) {
      for (let day of json.hourly) {
        hourly[moment.unix(day.dt).format("h a")] = day.temp;
      }
      return hourly;
    }
  }

  formatDaily(json) {
    let daily = {};
    for (let weekday of json.daily) {
      let key = moment.unix(weekday.dt).format("dddd");
      daily[key] = {
        temp: weekday.temp,
        icon: ICONS[weekday.weather[0].icon],
        condition: weekday.weather[0].icon,
        humidity: weekday.humidity,
      };
    }
    return daily;
  }
}

export default City;
