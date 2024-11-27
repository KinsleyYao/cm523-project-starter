document.addEventListener("DOMContentLoaded", () => {
    const weatherApiKeyUrl = "./secrets/secretWeather.txt"; // Path to the secret file
    let weatherApiKey = ""; // Placeholder for the API key

    // Fetch the weather API key from secretWeather.txt
    const fetchWeatherApiKey = async () => {
        try {
            const response = await fetch(weatherApiKeyUrl);
            if (!response.ok) {
                throw new Error(`Failed to load weather API key. Status: ${response.status}`);
            }
            weatherApiKey = (await response.text()).trim(); // Read and trim the key
            console.log("Weather API Key loaded successfully");
        } catch (error) {
            console.error("Error loading weather API key:", error);
        }
    };

    // Fetch and display weather for Boston, MA
    const fetchWeather = async () => {
        const weatherSpan = document.getElementById("weather");
        const temperatureSpan = document.getElementById("temperature");
        const dateSpan = document.getElementById("current-date");

        if (!weatherApiKey) {
            console.error("Weather API key is not loaded yet.");
            return;
        }

        const url = `https://api.openweathermap.org/data/2.5/weather?lat=42.3601&lon=-71.0589&appid=${weatherApiKey}&units=metric`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            const weather = data.weather[0].description;
            const temperature = data.main.temp;

            weatherSpan.textContent = weather.charAt(0).toUpperCase() + weather.slice(1); // Capitalize first letter
            temperatureSpan.textContent = `${temperature}°C`;

            const currentDate = new Date().toLocaleDateString();
            dateSpan.textContent = currentDate;
        } catch (error) {
            console.error("Error fetching weather:", error);
            weatherSpan.textContent = "Error fetching weather.";
            temperatureSpan.textContent = "";
        }
    };

    // Add click listener to the generator button
    const addGenerateButtonListener = () => {
        const generateButton = document.querySelector(".generate-button");
        generateButton.addEventListener("click", () => {
            const selectedMood = document.querySelector('input[name="moods"]:checked');

            if (!selectedMood) {
                alert("Please select a mood!");
                return;
            }

            const mood = selectedMood.id;
            const weather = document.getElementById("weather").textContent;

            if (weather === "Loading..." || weather === "Error fetching weather.") {
                alert("Weather data is not available. Please try again.");
                return;
            }

            const queryString = `results.html?mood=${encodeURIComponent(mood)}&weather=${encodeURIComponent(weather)}`;
            console.log(`Redirecting to results page with query: "${queryString}"`);
            window.location.href = queryString;
        });
    };

    // Initialize the page
    const initPage = async () => {
        await fetchWeatherApiKey(); // Load the weather API key
        await fetchWeather(); // Fetch and display the weather
        addGenerateButtonListener(); // Add the event listener
    };

    initPage(); // Start the initialization process
});