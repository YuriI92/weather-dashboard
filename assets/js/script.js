var apiKey = "78eafed7d2164c2baa5f79827b9117ac";
var cityName = $("#city-search").attr("placeholder");

var lat = "";
var lon = "";

var getGeoCoord = function(cityName) {
    var apiLocationUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=5&appid=" + apiKey;

    fetch(apiLocationUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    if (data[0] == null) {
                        alert("The city name is invalid. Please enter a valid city name.");
                        return;
                    } else {
                        lat = data[0].lat;
                        lon = data[0].lon;
                        
                        getWeatherData(lat, lon);    
                    }
                });
            } else {
                alert("The city name is invalid. Please enter a valid city name.");
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
var icon = "";
var iconDesc =  "";
var temp = "";
var wind = "";
var humid = "";
var uvInd = "";

var getCurrentWeather = function(data) {
    icon = data.current.weather[0].icon;
    iconDesc = data.current.weather[0].description;
    temp = data.current.temp;
    wind = data.current.wind_speed;
    humid = data.current.humidity;
    uvInd = data.current.uvi;
    showCurrentWeather(icon, iconDesc, temp, wind, humid, uvInd);
}

var showCurrentWeather = function(icon, iconDesc, temp, wind, humid, uvInd) {
    $("#city-name").text(cityName + " (" + today + ")");

    $(".today-weather > div > img")
        .attr("src", "http://openweathermap.org/img/wn/" + icon + ".png")
        .attr("alt", iconDesc);

    $(".today-weather > p > .temp").text(temp);
    $(".today-weather > p > .wind").text(wind);
    $(".today-weather > p > .humid").text(humid);
    $(".today-weather > p > .uvInd").text(uvInd);

    if (uvInd <= 2) {
        $(".today-weather > p > .uvInd").addClass("bg-success text-white");
    } else if (uvInd <= 5) {
        $(".today-weather > p > .uvInd").addClass("bg-warning text-dark");
    } else {
        $(".today-weather > p > .uvInd").addClass("bg-danger text-white");
    }
}

getGeoCoord(cityName);

$("#search-form").on("click", "button", function() {
    cityName = $("#city-search").val();
    cityName = cityName.charAt(0).toUpperCase() + cityName.slice(1);
    console.log(cityName);

    if (cityName === "") {
        window.alert("Please enter a city name.")
    } else {
        getGeoCoord(cityName);
        $("#city-search").val("");
    }
});