const APIKEY = 'addd896774748bd74c75435e0840431b';
const TODAY = new Date().toLocaleDateString();
var cityArray = [];


// get locaion from Location API
function getLatLon(search) {
    fetch('https://api.openweathermap.org/geo/1.0/direct?q=' + search + '&appid=' + APIKEY)
        .then((response) => response.json())
        .then((data) => {

            console.log(TODAY)
            console.log(data, 'dump stuff')
            // capitalize the city if not capitalized in search
            var city = search.toLowerCase();
            var cityName = city.replace(city[0], city[0].toUpperCase());
            $('#currentCity').html(cityName);
            $('#currentDate').html(TODAY);
            console.log('cityArray' + cityArray + 'includes');
            if (cityArray.includes(cityName)) {
                console.log('message')
            } else {

                cityArray.push(cityName);
                console.log('something else' + cityArray);
                var cityButton = '<button id="' + cityName + '" type="button" class="btn btn-secondary" onclick="start(\'' + cityName.trim() + '\')">' + cityName + '</button></br></br>'
                console.log(cityButton);
                $('#cityButtons').append(cityButton);

            }
           
   
            
            // add to local storage
            localStorage.setItem('city', cityArray.toString());
            var location = {
                lat: data[0].lat,
                lon: data[0].lon
            }
            console.log(location);
            getWeather(data[0].lat, data[0].lon,);

        })

}
// clears/resets the fields for the cards/ headers when searching a diffrent city
function reset() {
    $('#currentCity').text('');
    $('#currentDate').text('');
    $('#currentTemp').text('');
    $('#currentWind').text('');
    $('#currentWeatherIcon > img').remove();
    $('#currentHumidity').text('');
    for (i = 0; i < 6; i++) {
        $('#' + i + 'Temp').text('');
        $('#' + i + 'Wind').text('');
        $('#' + i + 'Humidity').text('');
        $('#' + i + 'WeatherIcon > img').remove();
        $('#' + i + 'Date').text('');

    }
}
// get weather from Weather API
function getWeather(lat, lon) {
    fetch('https://api.openweathermap.org/data/3.0/onecall?lat=' + lat + '&lon=' + lon + '&appid=' + APIKEY)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            // temp is in Kelvin, needs to be converted to Ferinheight
            let tempF = ((data.current.temp - 273.15) * 1.8) + 32;
            let formatTemp = Math.round(tempF * 100) / 100;
            let formatWind = Math.round(data.current.wind_speed * 2.2369);
            let currentIconUrl = 'https://openweathermap.org/img/wn/' + data.current.weather[0].icon + '@2x.png';
            // current temp (todays weather)
            $('#currentTemp').append('Temp: ' + formatTemp + '°F');
            $('#currentWind').append('Wind: ' + formatWind + ' MPH');
            $('#currentWeatherIcon').append("<img src='" + currentIconUrl + "' height='64px'>");
            $('#currentHumidity').append('Humidity: ' + data.current.humidity + '%');
            // 6 day forcast, looks better than the 5 day version
            console.log(data + "daily temps");
            for (i = 0; i < 6; i++) {
                var forcastDay = parseInt(data.daily[i].dt) * 1000;
                console.log(moment(forcastDay).format("MMM Do YY"));
                let dailyTempF = ((data.daily[i].temp.max - 273.15) * 1.8) + 32;
                let formatDailyTemp = Math.round(dailyTempF * 100) / 100;
                let forcast = new Date(data.daily[i].dt).toLocaleDateString();
                let iconUrl = 'https://openweathermap.org/img/wn/' + data.daily[i].weather[0].icon + '@2x.png';
                let formatDailyWind = Math.round(data.daily[i].wind_speed * 2.2369);
                $('#' + i + 'Temp').append(formatDailyTemp);
                $('#' + i + 'Wind').append(formatDailyWind);
                $('#' + i + 'Humidity').append(data.daily[i].humidity);
                $('#' + i + 'WeatherIcon').append("<img src='" + iconUrl + "' height='64px'>")
                $('#' + i + 'Date').append(moment(forcastDay).format("MMM Do YY"));
            }
        })

}

// get cities from local storage, make buttons
function retrieveLocalStorage() {
    if (localStorage.getItem('city')) {
        var myCitys = localStorage.getItem('city');
        cityArray = myCitys.split(',');
    }
    console.log(myCitys, "stuff it");
    console.log('myCitys' + cityArray);
    for (i = 0; i < cityArray.length; i++) {
        console.log(cityArray[i]);
        var cityButton = '<button id="' + cityArray[i] + '" type="button" class="btn btn-secondary" onclick="start(\'' + cityArray[i].trim() + '\')">' + cityArray[i] + '</button></br></br>'
        console.log(cityButton);
        $('#cityButtons').append(cityButton);

    }
}

function start(city) {
    reset();
    getLatLon(city);

}
// // main process

$(document).ready(function () {
    retrieveLocalStorage();
    console.log($(citySearch));
    console.log(city, submitCity, citySearch, cityArray)
    var city;
    submitCity.onclick = function () {
        city = $('#citySearch').val();
        console.log(city);
        start(city);
    }


});