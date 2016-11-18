// obtain current weather information and render to dom
// see http://openweathermap.org/current

var m_test = false;
//var m_test = true;  

var m_units = 'Fahrenheit';
//var m_tempKelvin = 0;

var m_json;

// openweathermap api key
// see https://home.openweathermap.org/
var m_apikey = 'd7712ffb29a3e2f73cebdcc6d7748acb';

// map from openweathermap icons to weather-icon icons
// see http://openweathermap.org/weather-conditions
// and https://erikflowers.github.io/weather-icons/
var m_iconmap = {
  '01d': 'wi-day-sunny',
  '02d': 'wi-day-sunny-overcast',
  '03d': 'wi-day-cloudy',
  '04d': 'wi-day-cloudy',
  '09d': 'wi-day-showers',
  '10d': 'wi-day-rain',
  '11d': 'wi-day-thunderstorm',
  '13d': 'wi-day-snow',
  '50d': 'wi-day-fog',
  '01n': 'wi-night-clear',
  '02n': 'wi-night-partly-cloudy',
  '03n': 'wi-night-cloudy',
  '04n': 'wi-night-cloudy',
  '09n': 'wi-night-showers',
  '10n': 'wi-night-rain',
  '11n': 'wi-night-thunderstorm',
  '13n': 'wi-night-snow',
  '50n': 'wi-night-fog'
}

var m_testJson = {
  "coord": {
    "lon": 139,
    "lat": 35
  },
  "sys": {
    "country": "JP",
    "sunrise": 1369769524,
    "sunset": 1369821049
  },
  "weather": [{
    "id": 804,
    "main": "clouds",
    "description": "overcast clouds",
    "icon": "04n"
  }],
  "main": {
    "temp": 289.5,
    "humidity": 89,
    "pressure": 1013,
    "temp_min": 287.04,
    "temp_max": 292.04
  },
  "wind": {
    "speed": 7.31,
    "deg": 187.002
  },
  "rain": {
    "3h": 0
  },
  "clouds": {
    "all": 92
  },
  "dt": 1369824698,
  "id": 1851632,
  "name": "Shuzenji",
  "cod": 200
};

// get user's latlong location
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(handlePosition);
  }
}

// given a position object with coords.latitude and .longitude,
// get the weather at that position and update the DOM.
// can optionally use test data if m_test flag is true.
function handlePosition(pos) {
  if (m_test) {
    handleWeather(m_testJson);
  } else {
    var url = "http://api.openweathermap.org/data/2.5/weather" +
      "?lat=" + pos.coords.latitude +
      "&lon=" + pos.coords.longitude +
      "&APPID=" + m_apikey;
    $.getJSON(url, handleWeather);
  }
}

// capitalize first letter of string
function capitalize(s) {
  return s[0].toUpperCase() + s.slice(1);
}

// convert from kelvin to celsius or fahrenheit
function getLocalTemp(tempKelvin, units) {
  var tempLocal;
  if (units=='Fahrenheit') {
    tempLocal = tempKelvin * 9/5 - 459.67;
  } else {
    tempLocal = tempKelvin - 273.15;
  }
  tempLocal = Math.floor(tempLocal);
  return tempLocal;
}

// convert from secs to local time
//. the time from owm seems to be off - 
// eg returns sunrise of 1369769524, 
// while current time is 1460484411
function getLocalTime(secs) {
  var d = new Date(secs*1000); // takes msecs
  var s = d.toLocaleTimeString();
  return s;
}

// given a json object containing current condition information,
// as returned by OpenWeatherMap api, update the DOM. 
function handleWeather(json) {
  var tempKelvin = json.main.temp;
  var tempLocal = getLocalTemp(tempKelvin, m_units);
  var tempUnits = '&deg;' + m_units[0]; // F or C
  var conditions = capitalize(json.weather[0].main);
  var iconOWM = json.weather[0].icon;
  var iconWI = m_iconmap[iconOWM];
  var sunrise = getLocalTime(json.sys.sunrise);
  var sunset = getLocalTime(json.sys.sunset);
  var location = json.name;
  $("#temp-value").html(tempLocal);
  $("#temp-units").html(tempUnits);
  $("#conditions-name").html(conditions);
  $("#conditions-icon").addClass(iconWI);
  $("#sunrise").html(sunrise);
  $("#sunset").html(sunset);
  $("#location").html(location);
  m_json = json; // save the json
}

function setCelsius() {
  m_units='Celsius';
  handleWeather(m_json);
}
function setFahrenheit() {
  m_units='Fahrenheit';
  handleWeather(m_json);
}

$(document).ready(function() {
  $("#celsius").on("click",setCelsius);
  $("#fahrenheit").on("click",setFahrenheit);
  getLocation();
});