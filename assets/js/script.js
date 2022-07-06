// api key hidden locally
// import { apiKey } from "./api.js";

var apiKey = "b13e0cc529070c7086450ac0a02f4aa9";

// DOM elements
var tempEl = document.querySelector("#temp");
var windEl = document.querySelector("#wind");
var humEl = document.querySelector("#humidity");
var uvEl = document.querySelector("#uv-index");
var weatherHeaderEl = document.querySelector("#weather-header");
var dailyWeatherEl = document.querySelector("#daily-weather");
var curImgDivEl = document.querySelector("#current-icon-div");
var searchBtnEl = document.querySelector("#searchBtn");
var inputEl = document.querySelector("#city");
var searchBtnDiv = document.querySelector("#past-search-btns");
var clearBtnEl = document.querySelector("#clear-btn");

// array for button labels
var citiesArr = [];

// function to remove spaces and construct geocode apiurl
var cityCheck = function (city) {
  var cityArr = city.split(" ");
  if (cityArr.length > 1) {
    city = "";
    for (var i = 0; i < cityArr.length; i++) {
      if (i < cityArr.length - 1) {
        city += cityArr[i] + "%20";
      } else {
        city += cityArr[i];
      }
    }
  }
  var apiUrl =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    city +
    "&limit=1&appid=" +
    apiKey;
  console.log(apiUrl);
  getCoords(apiUrl);
};

// function to find lat/lon for the location input
var getCoords = function (apiUrl) {
  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          var lat = data[0].lat;
          var lon = data[0].lon;
          var name = data[0].name;
          weatherHeaderEl.textContent = name;
          getWeather(lat, lon);
          checkButtons(name);
        });
      } else {
        // error handling - I noticed this would throw on certain cases but still work so I changed the verbiage to suit
        alert("There was an issue! You may need to enter a valid location.");
      }
    })
    .catch(function (error) {
      alert("There is a connection error to the API");
      console.log(error);
    });
};

// check buttons to avoid duplicates in the cities array - creates new button if no dupe
var checkButtons = function (name) {
  citiesArr.push(name);
  var citySet = new Set(citiesArr);
  var NewArr = Array.from(citySet);
  if (citiesArr.length !== NewArr.length) {
    citiesArr = NewArr;
  } else {
    createButton(name);
    localStorage.setItem("buttons", JSON.stringify(citiesArr));
  }
};

// load buttons from localstorage
var loadButtons = function () {
  citiesArr = JSON.parse(localStorage.getItem("buttons"));

  if (citiesArr) {
    for (var i = 0; i < citiesArr.length; i++) {
      var name = citiesArr[i];
      createButton(name);
    }
  } else {
    citiesArr = [];
  }
};

//create button elements
var createButton = function (name) {
  var cityButtoneEl = document.createElement("button");
  cityButtoneEl.classList = "btn btn-primary form-control mt-3";
  cityButtoneEl.textContent = name;
  searchBtnDiv.appendChild(cityButtoneEl);
};

// fetch to one call api
var getWeather = function (lat, lon) {
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&exclude=minutely,hourly&units=imperial&appid=" +
    apiKey;

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          displayData(data);
        });
      } else {
        alert("Error: Please try again");
      }
    })
    .catch(function (error) {
      alert("Unable to connect to OpenWeatherMap");
      console.log(error);
    });
};

// displays current data info - then calls the daily weather function
var displayData = function (data) {
  //create span elements
  var curUV = document.createElement("span");
  var curImgEl = document.createElement("img");
  //parse current data
  var curIconUrl =
    "http://openweathermap.org/img/wn/" +
    data.current.weather[0].icon +
    "@2x.png";
  curImgEl.setAttribute("src", curIconUrl);
  curImgEl.setAttribute("alt", data.current.weather[0].description);
  curImgEl.classList = "rounded-2 bg-secondary mt-1";
  curUV.textContent = data.current.uvi;
  curImgDivEl.innerHTML = "";
  curImgDivEl.appendChild(curImgEl);
  tempEl.textContent = "Temp: " + data.current.temp + " °F";
  windEl.textContent = "Wind: " + data.current.wind_speed + " mph";
  humEl.textContent = "Humidity: " + data.current.humidity + " %";
  uvEl.innerHTML = "";
  uvEl.textContent = "UV-Index: ";
  uvEl.appendChild(curUV);

  // conditional to change UV bg color based on value
  var uvVal = data.current.uvi;
  if (uvVal > 10) {
    curUV.className = "bgPurple";
  } else if (uvVal > 7) {
    curUV.className = "bgRed";
  } else if (uvVal > 5) {
    curUV.className = "bgOrange";
  } else if (uvVal > 2) {
    curUV.className = "bgYellow";
  } else {
    curUV.className = "bgGreen";
  }
  // add date to weatherHeader location name
  var date = new Date((data.current.dt + data.timezone_offset) * 1000);
  date = date.toLocaleDateString();
  weatherHeaderEl.textContent += " (" + date + ")";
  dailyData(data);
};

// function to populate forcast data
var dailyData = function (data) {
  dailyWeatherEl.innerHTML = "";
  for (var i = 0; i < data.daily.length; i++) {
    // create card elements
    var cardDiv = document.createElement("div");
    var cardEl = document.createElement("div");
    var cardHeaderEl = document.createElement("h5");
    var imgDiv = document.createElement("div");
    var imgEl = document.createElement("img");
    var listEl = document.createElement("ul");
    var listHiTemp = document.createElement("li");
    var listLowTemp = document.createElement("li");
    var listWind = document.createElement("li");
    var listHum = document.createElement("li");

    // Get Icon for weather conditions
    var iconUrl =
      "http://openweathermap.org/img/wn/" +
      data.daily[i].weather[0].icon +
      "@2x.png";
    // assign BS classes/attributes
    cardDiv.classList = "col-12 col-sm-6 col-lg-3";
    cardEl.classList = "card bg-secondary my-2";
    imgEl.setAttribute("src", iconUrl);
    imgEl.setAttribute("alt", data.daily[i].weather[0].description);
    imgDiv.classList = "mx-auto";
    imgEl.classList = "list-group-item";
    cardHeaderEl.classList = "card-header text-center text-light";
    listEl.classList = "list-group list-group-flush";
    listHiTemp.classList = "list-group-item text-center ";
    listLowTemp.classList = "list-group-item text-center";
    listWind.classList = "list-group-item text-center";
    listHum.classList = "list-group-item text-center";

    //Get day of week using native JS methods
    var day = new Date(data.daily[i].dt * 1000);
    var options = { weekday: "short" };
    cardHeaderEl.textContent =
      new Intl.DateTimeFormat("en-US", options).format(day) +
      " " +
      day.toLocaleDateString();
    // put data in textcontent of elements
    listHiTemp.textContent = "High: " + data.daily[i].temp.max + " °F";
    listLowTemp.textContent = "Low: " + data.daily[i].temp.min + " °F";
    listWind.textContent = "Wind: " + data.daily[i].wind_speed + " mph";
    listHum.textContent = "Humitity: " + data.daily[i].humidity + " %";

    // append to div
    dailyWeatherEl.appendChild(cardDiv);
    cardDiv.appendChild(cardEl);
    imgDiv.appendChild(imgEl);
    cardEl.appendChild(cardHeaderEl);
    cardEl.appendChild(imgDiv);
    cardEl.appendChild(listEl);
    listEl.appendChild(listHiTemp);
    listEl.appendChild(listLowTemp);
    listEl.appendChild(listWind);
    listEl.appendChild(listHum);
  }
};

//button/event handlers

var searchBtnHandler = function (event) {
  event.preventDefault();
  var cityName = inputEl.value.trim();
  inputEl.value = "";
  cityCheck(cityName);
};

// catches bubble events from all past buttons
var pastButtons = function (event) {
  var city = event.target.textContent;
  cityCheck(city);
};

// confirms intent to delete history and does
var clearButtons = function () {
  var confirm = window.confirm(
    "Are you sure you want to delete your search history?"
  );
  if (confirm) {
    citiesArr = [];
    localStorage.removeItem("buttons");
    searchBtnDiv.innerHTML = "";
  }
};

// prompt user to access location

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition((position) => {
    // reverse geocoding call for city name
    var apiUrl =
      "http://api.openweathermap.org/geo/1.0/reverse?lat=" +
      position.coords.latitude +
      "&lon=" +
      position.coords.longitude +
      "&limit=1&appid=" +
      apiKey;
    fetch(apiUrl)
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            var name = data[0].name;
            weatherHeaderEl.textContent = name;
          });
        } else {
          alert("Error: Please try again");
        }
      })
      .catch(function (error) {
        alert("Unable to connect to OpenWeatherMap");
      });

    getWeather(position.coords.latitude, position.coords.longitude);
  });
}
loadButtons();

inputEl.addEventListener("change", searchBtnHandler);
searchBtnEl.addEventListener("click", searchBtnHandler);
searchBtnDiv.addEventListener("click", pastButtons);
clearBtnEl.addEventListener("click", clearButtons);
