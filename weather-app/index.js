const apiKey = '6bb8bb0aa22fb7f059d67300ddeb1615'; // Replace with your valid OpenWeatherMap API key

// Add event listener for search input to show suggestions
document.getElementById('location-input').addEventListener('input', function () {
  const inputValue = this.value;
  if (inputValue.length > 1) {
    fetchCitySuggestions(inputValue);
  } else {
    clearSuggestions();
  }
});

// Fetch city suggestions from the OpenWeatherMap API (or use a different API for better suggestions)
function fetchCitySuggestions(query) {
  fetch(`https://api.openweathermap.org/data/2.5/find?q=${query}&type=like&sort=population&cnt=5&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      const suggestions = data.list.map(city => city.name);
      showSuggestions(suggestions);
    })
    .catch(error => console.error("Error fetching city suggestions:", error));
}

// Display the city suggestions in the dropdown
function showSuggestions(suggestions) {
  const suggestionBox = document.createElement('ul');
  suggestionBox.classList.add('suggestions-box');
  suggestions.forEach(suggestion => {
    const listItem = document.createElement('li');
    listItem.textContent = suggestion;
    listItem.addEventListener('click', function () {
      document.getElementById('location-input').value = suggestion;
      fetchWeather(suggestion);
      clearSuggestions();
    });
    suggestionBox.appendChild(listItem);
  });
  clearSuggestions(); // Clear previous suggestions
  document.querySelector('.search').appendChild(suggestionBox);
}

// Clear suggestions when input is empty or a suggestion is selected
function clearSuggestions() {
  const suggestionBox = document.querySelector('.suggestions-box');
  if (suggestionBox) {
    suggestionBox.remove();
  }
}

// Search Weather by Location
document.getElementById('Search-btn').addEventListener('click', () => {
  const location = document.getElementById('location-input').value;
  fetchWeather(location);
});

function fetchWeather(location) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`City not found (${response.status})`);
      }
      return response.json();
    })
    .then(data => updateCurrentWeather(data))
    .then(() => fetchLocationForecast(location))
    .catch(error => {
      console.error("Error fetching weather data:", error);
      alert("Unable to fetch weather data. Please check the city name and try again.");
    });
}

// Fetch Weather by Current Location
document.getElementById('current-location-btn').addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      fetchWeatherByCoords(latitude, longitude);
    }, error => {
      console.error("Error fetching geolocation:", error);
      alert("Unable to fetch your location. Please enable location services and try again.");
    });
  } else {
    alert("Geolocation is not supported by your browser.");
  }
});

// Fetch 3-day forecast for the current location
function fetchLocationForecast(location) {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&cnt=3&appid=${apiKey}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`City not found (${response.status})`);
      }
      return response.json();
    })
    .then(data => updateForecast(data))
    .catch(error => {
      console.error("Error fetching forecast data:", error);
      alert("Unable to fetch forecast data.");
    });
}

// Fetch weather using coordinates
function fetchWeatherByCoords(lat, lon) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Unable to fetch weather (${response.status})`);
      }
      return response.json();
    })
    .then(data => {
      updateCurrentWeather(data);
      fetchLocationForecast(data.name);
    })
    .catch(error => {
      console.error("Error fetching weather data:", error);
      alert("Unable to fetch weather data for your location.");
    });
}

// Update Current Weather
function updateCurrentWeather(data) {
  document.getElementById('current-location').textContent = data.name;
  document.querySelector('.temp').textContent = `${data.main.temp}°C`;
  document.querySelector('.condition').textContent = data.weather[0].description;
  document.querySelector('.weather-icon').textContent = getWeatherIcon(data.weather[0].main);
  document.getElementById('humidity').textContent = `${data.main.humidity}%`;
  document.getElementById('wind-speed').textContent = `${data.wind.speed} km/h`;
  document.getElementById('pressure').textContent = `${data.main.pressure} hPa`;

  // Adding UV index and visibility
  const uvIndex = data.current ? data.current.uvi : '--'; // Ensure this field exists or handle it based on available data
  const visibility = data.visibility ? (data.visibility / 1000) : '--'; // Convert to km
  document.getElementById('uv-index').textContent = `${uvIndex}`;
  document.getElementById('visibility').textContent = `${visibility} km`;
}

// Get Weather Icon
function getWeatherIcon(condition) {
  const icons = {
    Clear: "☀️",
    Clouds: "☁️",
    Rain: "🌧️",
    Snow: "❄️",
    Thunderstorm: "⚡",
  };
  return icons[condition] || "🌫️";
}

// Fetch 3-day forecast for the current location
function fetchLocationForecast() {
  const location = document.getElementById('location-input').value;
  
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&cnt=3&appid=${apiKey}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`City not found (${response.status})`);
      }
      return response.json();
    })
    .then(data => updateForecast(data))
    .catch(error => {
      console.error("Error fetching forecast data:", error);
      alert("Unable to fetch forecast data.");
    });
}

// Update 3-day forecast
function updateForecast(data) {
  const forecastCards = document.getElementById('forecast-cards');
  forecastCards.innerHTML = ''; // Clear previous cards

  data.list.forEach(forecast => {
    const card = document.createElement('div');
    card.classList.add('card');

    card.innerHTML = `
      <div class="day">${new Date(forecast.dt_txt).toLocaleDateString()}</div>
      <div class="temp">${forecast.main.temp}°C</div>
      <div class="condition">${forecast.weather[0].description}</div>
    `;

    forecastCards.appendChild(card);
  });
}

// Fetch weather data for multiple locations (Location Forecast)
const locations = ["New York", "London", "Tokyo"]; // Modify with the cities you want

locations.forEach(location => {
  fetchLocationWeather(location);
});

// Fetch and display weather data for each location in the forecast
function fetchLocationWeather(location) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`City not found (${response.status})`);
      }
      return response.json();
    })
    .then(data => updateLocationWeather(data))
    .catch(error => {
      console.error("Error fetching location weather data:", error);
    });
}

// Update the location forecast cards
function updateLocationWeather(data) {
  const locationCards = document.getElementById('location-cards');

  const card = document.createElement('div');
  card.classList.add('card');

  card.innerHTML = `
    <div class="city">${data.name}</div>
    <div class="temp">${data.main.temp}°C</div>
    <div class="condition">${data.weather[0].description}</div>
  `;

  locationCards.appendChild(card);
}