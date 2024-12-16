const API_KEY = "6bb8bb0aa22fb7f059d67300ddeb1615"; // Replace with your OpenWeatherMap API Key

// Select DOM elements
const cityInput = document.getElementById("city");
const getWeatherBtn = document.getElementById("get-weather");
const cityName = document.getElementById("city-name");
const temperature = document.getElementById("temperature");
const weatherDescription = document.getElementById("weather-description");
const humidity = document.getElementById("humidity");

// Forecast Cards
const forecastCards = document.querySelectorAll(".forecast-card p:nth-child(3)");

// Event listener for "Get Weather" button
getWeatherBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeather(city);
        fetchForecast(city);
    } else {
        alert("Please enter a city name!");
    }
});

// Function to fetch current weather
function fetchWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            cityName.textContent = `Weather in ${data.name}`;
            temperature.textContent = `${Math.round(data.main.temp)}°C`;
            weatherDescription.textContent = `Description: ${data.weather[0].description}`;
            humidity.textContent = `Humidity: ${data.main.humidity}%`;
        })
        .catch((error) => {
            console.error("Error fetching current weather:", error);
            alert("City not found or API request failed!");
        });
}

// Function to fetch 3-day weather forecast
function fetchForecast(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;

    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            const forecasts = data.list.filter((_, index) => index % 8 === 0).slice(0, 3);
            forecasts.forEach((forecast, i) => {
                const temp = Math.round(forecast.main.temp);
                forecastCards[i].textContent = `${temp}°C`;
            });
        })
        .catch((error) => {
            console.error("Error fetching forecast:", error);
            alert("Forecast not available for this city!");
        });
}
