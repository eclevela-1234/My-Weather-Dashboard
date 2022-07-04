// api key hidden locally
import { apiKey } from "./api.js";

var tempEl = document.querySelector("#temp");
var windEl = document.querySelector("#wind");
var humEl = document.querySelector("#humidity");
var uvEl = document.querySelector("#uv-index");
var weatherHeaderEl = document.querySelector("#weather-header");
var dailyWeatherEl = document.querySelector("#daily-weather");


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
        var name = data[0].name
        weatherHeaderEl.textContent = name
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
    
    var date = new Date((data.current.dt + data.timezone_offset) * 1000);
    date = date.toLocaleDateString();
    weatherHeaderEl.textContent += " (" + date +")"
    console.log(date);
    
    dailyData(data);


};
var dailyData = function(data) {
    for (var i=0; i < data.daily.length; i++) {
        // create card elements
        var cardDiv = document.createElement("div");
        var cardEl = document.createElement("div");
        var cardHeaderEl = document.createElement("div");
        var listEl = document.createElement("ul");
        var listHiTemp = document.createElement("li");
        var listLowTemp = document.createElement("li");
        var listWind = document.createElement("li");
        var listHum = document.createElement("li");
        var listUV = document.createElement("li");

        // assign BS classes/attributes
        cardDiv.classList = "col-12 col-sm-6 col-lg-3"
        cardEl.classList = "card bg-secondary m-1";
        // cardEl.setAttribute("style", "width: 13rem;");
        cardHeaderEl.className = "card-header";
        listEl.classList = "list-group list-group-flush";
        listHiTemp.classList = "list-group-item";
        listLowTemp.className = "list-group-item";
        listWind.className = "list-group-item";
        listHum.className = "list-group-item";
        listUV.className = "list-group-item";

        //Get day of week
        var day = new Date((data.daily[i].dt + data.timezone_offset) * 1000);
        var options = { weekday: "short" };
        // console.log(new Intl.DateTimeFormat('en-US', options).format(day));

        
        // put data in textcontent of elements
        cardHeaderEl.textContent = new Intl.DateTimeFormat('en-US', options).format(day) + " " + day.toLocaleDateString();
        listHiTemp.textContent = "High: " + data.daily[i].temp.max + " °F";
        listLowTemp.textContent = "Low: " + data.daily[i].temp.min + " °F";
        listWind.textContent = "Wind: " + data.daily[i].wind_speed + " mph";
        listHum.textContent = "Humitity: " + data.daily[i].humidity + " %";
        listUV.textContent = "UV Index: " + data.daily[i].uvi;

        // append to div
        dailyWeatherEl.appendChild(cardDiv);
        cardDiv.appendChild(cardEl);
        cardEl.appendChild(cardHeaderEl);
        cardEl.appendChild(listEl);
        listEl.appendChild(listHiTemp);
        listEl.appendChild(listLowTemp);
        listEl.appendChild(listWind);
        listEl.appendChild(listHum);
        listEl.appendChild(listUV);


    }

}
getCoords("richmond");
// traverse response to disired info and store in object array

// dynamically create elements and display on page

// add persistence - store city names/coords

// add auto load with current location info
