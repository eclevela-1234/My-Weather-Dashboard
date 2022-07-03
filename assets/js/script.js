// place api key here for development
import { apiKey } from "./api.js"; 



var getCoords = function(city) {
    console.log(apiKey);
    // get coordinates for city
    var apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q="+ city + "&limit=1&appid=" + apiKey;

    fetch(apiUrl)
    .then(function(response){
        if (response.ok) {
            response.json().then(function(data) {
                var lat = data[0].lat;
                var lon = data[0].lon;

                getWeather(lat, lon);

            })
        }
    })
};

// plug coords into one call api

var getWeather = function(lat, lon) {

    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&appid=" + apiKey;

    console.log(apiUrl);

    fetch(apiUrl)
    .then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                console.log(data)
            })
        }
    })
};
// display results in console

getCoords("richmond");
// traverse response to disired info and store in object array


// dynamically create elements and display on page


// add persistence - store city names/coords

// add auto load with current location info