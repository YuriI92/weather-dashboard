// store api key and city name
var apiKey = "78eafed7d2164c2baa5f79827b9117ac";
var cityName = $("#city-search").attr("placeholder");

var lat = "43.6535";
var lon = "-79.3839";
var cityLocation = [];

var loadDashboard = function() {
    cityLocation = JSON.parse(localStorage.getItem("cities"));
    
    getWeatherData(lat, lon);
    showHistories();
}

// get geological coordinate
var getGeoCoord = function(cityName) {
    // store api url to get geological coordinate of the city
    var apiLocationUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=5&appid=" + apiKey;

    // get location data from api url
    fetch(apiLocationUrl)
        .then(function(response) {
            // if the response is ok, get data, and if not, alert user
            if (response.ok) {
                response.json().then(function(data) {
                    // if the data is not valid, alert user
                    if (data[0] == null) {
                        window.alert("The city name is invalid. Please enter a valid city name.");
                        return;
                    // if the data is valid, get latitude and longitude to get weather data
                    } else {
                        lat = data[0].lat;
                        lon = data[0].lon;
                        
                        getWeatherData(lat, lon);

                        var tempoLocArr = {
                            city: cityName,
                            latitude: lat,
                            longitude: lon
                        }

                        cityLocation.push(tempoLocArr);
                        localStorage.setItem("cities", JSON.stringify(cityLocation));
                    }
                });
            } else {
                window.alert("The city name is invalid. Please enter a valid city name.");
            }
        });
}

// get weather data using geological coordinate
var getWeatherData = function(lat, lon) {
    // default(temp: kelvin, speed: meter/sec), metric(temp: celsius, speed: meter/sec), imperial(temp: fahrenheit, speed: miles/hour)
    var units = "metric";
    var apiWeatherUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=" + units + "&exclude=minutely,hourly,alerts&appid=" + apiKey;

    // get weather data from api url
    fetch(apiWeatherUrl)
        .then(function(response) {
            // if the response is ok, get data, if not, alert user
            if (response.ok) {
                response.json()
                    .then(function(data) {
                        getCurrentData(data);
                        showForecastData(data);
                        showHistories();
                    });
            } else {
                window.alert("Sorry. No data found for " + cityName + ". Try other city.");
            }
        });
}

// store today's date and set an array to store weather condition data
var today = moment().format("M/D/YYYY");
var weatherCond = {};

//　store weather data in the weatherCond array
var getCurrentData = function(data) {
    console.log(data);
    // store current weather data in an array
    weatherCond = {
        icon: data.current.weather[0].icon,
        iconDesc: data.current.weather[0].description,
        temp: data.current.temp,
        wind: data.current.wind_speed,
        humid: data.current.humidity,
        uvInd: data.current.uvi
    }

    showCurrentWeather(weatherCond);
}

// show current weather in the dashboard
var showCurrentWeather = function(weatherCond) {
    // set city name and today's date
    $("#city-name").text(cityName + " (" + today + ")");

    // set weather condition icon image
    $(".today-weather > div > img")
        .attr("src", "http://openweathermap.org/img/wn/" + weatherCond.icon + ".png")
        .attr("alt", weatherCond.iconDesc);

    // set temperature, wind speed, humidity, and uv index
    $(".today-weather > p > .temp").text(weatherCond.temp);
    $(".today-weather > p > .wind").text(weatherCond.wind); 
    $(".today-weather > p > .humid").text(weatherCond.humid);
    $(".today-weather > p > .uvInd").text(weatherCond.uvInd);

    // add background color and font color to uv index data
    if (weatherCond.uvInd <= 2) {
        $(".today-weather > p > .uvInd").addClass("bg-success text-white");
    } else if (weatherCond.uvInd <= 5) {
        $(".today-weather > p > .uvInd").addClass("bg-warning text-dark");
    } else {
        $(".today-weather > p > .uvInd").addClass("bg-danger text-white");
    }
}

var showForecastData = function(data) {
    console.log(data);

    if ($(".day-forecast")) {
        $(".day-forecast").detach();
    }

    for (var i = 0; i < 5; i++) {
        var forecastData = {
            date: moment().add(i + 1, "d").format("M/D/YYYY"),
            icon: data.daily[i].weather[0].icon,
            iconDesc: data.daily[i].weather[0].description,
            temp: data.daily[i].temp.day,
            wind: data.daily[i].wind_speed,
            humid: data.daily[i].humidity,
        }

        var dayContainerEl = $("<div>")
            .addClass("day-forecast");

        var dateEl = $("<p>")
            .addClass("forecast-date font-weight-bold")
            .html(forecastData.date);
        var iconEl = $("<img>")
            .addClass("weather-icon")
            .attr("src", "http://openweathermap.org/img/wn/" + forecastData.icon + ".png")
            .attr("alt", forecastData.iconDesc);
        var tempEl = $("<p>")
            .addClass("temp")
            .html("Temp: " + forecastData.temp + " &#8451;");
        var windEl = $("<p>")
            .addClass("wind")
            .html("Wind: " + forecastData.wind + " m/s");
        var humidEl = $("<p>")
            .addClass("humid")
            .html("Humidity: " + forecastData.humid + " &percnt;");

        dayContainerEl.append(dateEl, iconEl, tempEl, windEl, humidEl);
        $("#forecast-container").append(dayContainerEl);
    }
}

var showHistories = function() {
    console.log(cityLocation);
    if ($(".city-search-btn")) {
        $(".city-search-btn").detach();
    } 

    for (var i = 0; i < cityLocation.length; i++) {
        var cityBtnEl = $("<button>")
            .addClass("city-search-btn")
            .attr("type", "button")
            .html(cityLocation[i].city);
        $("#history-container").append(cityBtnEl);
    }
}

// get default weather data to display at first
loadDashboard();

// get weather data and display in dashboard when search button is clicked
$("#search-form").on("click", "button", function() {
    // get city name from the search form input
    cityName = $("#city-search").val();
    cityName = cityName.charAt(0).toUpperCase() + cityName.slice(1);
    console.log(cityName);

    // alert user if the input is left blank
    if (cityName === "") {
        window.alert("Please enter a city name.")
    // if the city name is entered, get weather data of the city
    } else {
        getGeoCoord(cityName);
        // clear the input after the result is displayed
        $("#city-search").val("");
    }
});
