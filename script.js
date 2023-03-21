const app = document.querySelector('.weather-app');
const temp = document.querySelector('.temp');
const dateOutput = document.querySelector('.date');
const timeOutput = document.querySelector('.time');
const conditionOutput = document.querySelector('.condition');
const nameOutput = document.querySelector('.name');
const icon = document.querySelector('.icon');
const cloudOutput = document.querySelector('.cloud');
const humidityOutput = document.querySelector('.humidity');
const windOutput = document.querySelector('.wind');
const form = document.getElementById('locationInput');
const search = document.querySelector('.search');
const btn = document.querySelector('.submit');
const cities = document.querySelectorAll('.city');

//Default city
let cityInput = "London";

//Adding click event to each cities in the panel
cities.forEach((city) => {
    city.addEventListener('click', (e) => {
        cityInput = e.target.innerHTML;  //Change from default city to the clicked one
        fetchWeatherData();
        app.style.opacity = "0";
    });
})

//Adding submit event to the form
form.addEventListener('submit', (e) => {
    /*If the input field is empty
    throw in the alert */
    if (search.value.length == 0) {
        alert('Please enter a city name');
    } else {
        /*Change from default city to the
        searched city from the user's input */
        cityInput = search.value;
        fetchWeatherData();
        //Remove text from the input field
        search.value = "";
        app.style.opacity = "0";
    }
    //Prevents default behavior of the form
    e.preventDefault();
})

/*Function that returns a day of the week
from a date (12 03 2022) */
function dayOfTheWeek(day, month, year) {
    const weekday = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];
    return weekday[new Date(`${day}/${month}/${year}`).getDay()];
};

//Function that fetches and displays data from the weather API
function fetchWeatherData() {
    //Fetch the data
    fetch(`https://api.weatherapi.com/v1/current.json?key=edfdd9e1ff7a462f99104631221003&q=${cityInput}`)
        //Take the data (JSON) and convert it to JS object
        .then(response => response.json())
        .then(data => {
        console.log(data);

        /*Displaying temperature and
        weather condition to the page*/
        temp.innerHTML = data.current.temp_c + "&#176;";
        conditionOutput.innerHTML = data.current.condition.text;

        /*Get the time & date from the requested location
        and extract the day, month, year and teh time*/
        const date = data.location.localtime;
        const y = parseInt(date.substr(0, 4));
        const d = parseInt(date.substr(5, 2));
        const m = parseInt(date.substr(8, 2));
        const time = date.substr(11);

        //Reformat teh date
        dateOutput.innerHTML = `${dayOfTheWeek(d, m, y)} ${d}, ${m} ${y}`;
        timeOutput.innerHTML = time;

        //Display name of the city
        nameOutput.innerHTML = data.location.name;

        //Get the right icon url and extarct a part of it
        const iconId = data.current.condition.icon.substr("//cdn.weatherapi.com/weather/64x64/".length);
        icon.src = "./icons/" + iconId;

        //Display weather details
        cloudOutput.innerHTML = data.current.cloud + "%";
        humidityOutput.innerHTML = data.current.humidity + "%";
        windOutput.innerHTML = data.current.wind_kph + "km/h";

        //Set dault time of day
        let timeOfDay = "day";
        //Get the unique id for each weather condition
        const code = data.current.condition.code;

        //Change to night if it's night time in the requested location
        if (!data.current.is_day) {
            timeOfDay = "night";
        }

        if (code == 1000) {
            /*Set the background img to clear
            if the weather condition is clear*/
            app.style.backgroundImage = `
            url(./images/${timeOfDay}/clear.avif)`;
            /*Change the btn bg colotr depending on
            if it's day or night*/
            btn.style.background = "#e5ba92";
            if (timeOfDay == "night") {
                btn.style.background = "#181e27";
            }
        } else if (
            code == 1003 ||
            code == 1006 ||
            code == 1009 ||
            code == 1030 ||
            code == 1069 ||
            code == 1087 ||
            code == 1135 ||
            code == 1273 ||
            code == 1276 ||
            code == 1279 ||
            code == 1282
        ) {
            app.style.backgroundImage = `
            url(./images/${timeOfDay}/cloudy.avif)`;
            btn.style.background = "#fa6d1b";
            if (timeOfDay == "night") {
                btn.style.background = "#181e27";
            }
        } else if (
            code == 1063 ||
            code == 1069 ||
            code == 1072 ||
            code == 1150 ||
            code == 1153 ||
            code == 1180 ||
            code == 1183 ||
            code == 1186 ||
            code == 1189 ||
            code == 1192 ||
            code == 1195 ||
            code == 1204 ||
            code == 1207 ||
            code == 1240 ||
            code == 1243 ||
            code == 1246 ||
            code == 1249 ||
            code == 1252
        ) {
            app.style.backgroundImage = `
            url(./images/${timeOfDay}/rainy.avif)`;
            btn.style.background = "#647d75";
            if (timeOfDay == "night") {
                btn.style.background = "#325c80";
            }
        } else {
            app.style.backgroundImage = `
            url(./images/${timeOfDay}/snow.avif)`;
            btn.style.background = "#4d72aa";
            if (timeOfDay == "night") {
                btn.style.background = "#1b1b1b";
            }
        }
        app.style.opacity = "1";

        })
        /*If the user types a location that doesn't
        exist, throw an alert*/
        .catch(() => {
            alert('Location not found, try again please');
            app.style.opacity = "1";
        });
}

//Call the function on page load
fetchWeatherData();

app.style.opacity = "1";