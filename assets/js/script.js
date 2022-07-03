// api key hidden locally
import { apiKey } from "./api.js";

var tempEl = document.querySelector("#temp");
var windEl = document.querySelector("#wind");
var humEl = document.querySelector("#humidity");
var uvEl = document.querySelector("#uv-index");


//to test functionality, please disable import and add an OpenWeather api key below
// var apiKey = "";

var getCoords = function (city) {
  console.log(apiKey);
  // get coordinates for city
  var apiUrl =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    city +
    "&limit=1&appid=" +
    apiKey;

  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        var lat = data[0].lat;
        var lon = data[0].lon;

        getWeather(lat, lon);
      });
    }
  });
};

// plug coords into one call api

var getWeather = function (lat, lon) {
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&exclude=minutely,hourly&units=imperial&appid=" +
    apiKey;

  console.log(apiUrl);

  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        displayData(data);
      });
    }
  });
};
// display results in console
var displayData = function(data){
    //create span elements
    var curTemp = document.createElement("span");
    var curWind = document.createElement("span");
    var curHum = document.createElement("span");
    var curUV = document.createElement("span");
    //parse current data
    curTemp.textContent = data.current.temp + " °F";
    curWind.textContent = data.current.wind_speed + " mph";
    curHum.textContent = data.current.humidity + " %";
    curUV.textContent = data.current.uvi;
    // append to divs
    tempEl.appendChild(curTemp);
    windEl.appendChild(curWind);
    humEl.appendChild(curHum);
    uvEl.appendChild(curUV);


    

};

getCoords("richmond");
// traverse response to disired info and store in object array

// dynamically create elements and display on page

// add persistence - store city names/coords

// add auto load with current location info
