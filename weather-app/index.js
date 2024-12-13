const API_KEY = "6bb8bb0aa22fb7f059d67300ddeb1615"; // Replace with your actual API key

document.getElementById("getWeather").addEventListener("click", () => {
  const city = document.getElementById("city").value;
  if (!city) {
    alert("Please enter a city name.");
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error("City not found");
      }
      return response.json();
    })
    .then(data => {
      console.log(data); // For debugging
      const weatherResult = `
        <h2>Weather in ${data.name}</h2>
        <p>Temperature: ${data.main.temp}°C</p>
        <p>Condition: ${data.weather[0].description}</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
      `;
      document.getElementById("weatherResult").innerHTML = weatherResult;
    })
    .catch(error => {
      console.error("Error:", error);
      alert("Error fetching weather data. Please try again.");
    });
});

console.log(city);  // Add this to print the city name to the console