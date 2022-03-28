var apiKey = "78eafed7d2164c2baa5f79827b9117ac";

var cityName = "Toronto";
var apiLocationUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=5&appid=" + apiKey;

var lat = "";
var lon = "";

var getGeoCoord = function() {
    fetch(apiLocationUrl)
    .then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                lat = data[0].lat;
                lon = data[0].lon;
                
                getWeatherData(lat, lon);
            });
        }
    });
}

var getWeatherData = function(lat, lon) {
    // default(temp: kelvin, speed: meter/sec), metric(temp: celsius, speed: meter/sec), imperial(temp: fahrenheit, speed: miles/hour)
    var units = "metric";
    var apiWeatherUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=" + units + "&exclude=minutely,hourly,alerts&appid=" + apiKey;
    fetch(apiWeatherUrl)
        .then(function(response) {
            if (response.ok) {
                response.json()
                    .then(function(data) {
                        getCurrentWeather(data)
                    });
            }
        });
}

var today = moment().format("M/D/YYYY");
var temp = "";
var wind = "";
var humid = "";
var uvInd = "";

var getCurrentWeather = function(data) {
    temp = data.current.temp;
    wind = data.current.wind_speed;
    humid = data.current.humidity;
    uvInd = data.current.uvi;
    showCurrentWeather(temp, wind, humid, uvInd);
}

var showCurrentWeather = function(temp, wind, humid, uvInd) {
    $("#city-name").text(cityName + " (" + today + ")");
    $(".today-weather > p > .temp").text(temp);
    $(".today-weather > p > .wind").text(wind);
    $(".today-weather > p > .humid").text(humid);
    $(".today-weather > p > .uvInd").text(uvInd);
}

getGeoCoord();