document.addEventListener("DOMContentLoaded", () => {
    const weatherApiKeyUrl = "./secrets/secretWeather.txt";
    let weatherApiKey = "";

    // fetch weatherAPI from the secrets 
    const fetchWeatherApiKey = () => {
        return fetch(weatherApiKeyUrl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to load weather API key. Status: ${response.status}`);
                }
                return response.text();
            })
            .then((key) => {
                weatherApiKey = key.trim();
                console.log("Weather API Key loaded successfully");
            })
            .catch((error) => {
                console.error("Error loading weather API key:", error);
            });
    };

    // fetch and display weather for user's location
    const fetchWeather = (latitude, longitude) => {
        if (!weatherApiKey) {
            console.error("Weather API key is not loaded yet.");
            return;
        }

        const weatherSpan = document.getElementById("weather");
        const temperatureSpan = document.getElementById("temperature");
        const dateSpan = document.getElementById("current-date");

        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${weatherApiKey}&units=metric`;

        fetch(apiUrl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                const { description } = data.weather[0];
                const temperatureCelsius = data.main.temp;
                const temperatureFahrenheit = (temperatureCelsius * 9) / 5 + 32;

                weatherSpan.textContent = description.charAt(0).toUpperCase() + description.slice(1); 
                temperatureSpan.textContent = `${temperatureCelsius.toFixed(1)}°C / ${temperatureFahrenheit.toFixed(1)}°F`;
                dateSpan.textContent = new Date().toLocaleDateString();
            })
            .catch((error) => {
                console.error("Error fetching weather:", error);
                weatherSpan.textContent = "Error fetching weather.";
                temperatureSpan.textContent = "";
            });
    };

    // fetch user's location and weather
    const getLocationAndFetchWeather = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    console.log(`User location: Latitude ${latitude}, Longitude ${longitude}`);
                    fetchWeather(latitude, longitude);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    alert("Unable to retrieve your location. Please check location permissions.");
                }
            );
        } else {
            alert("Geolocation is not supported by your browser.");
        }
    };

    // generator button
    const addGenerateButtonListener = () => {
        const generateButton = document.querySelector(".generate-button");
        generateButton.addEventListener("click", () => {
            const selectedMoodElement = document.querySelector('input[name="moods"]:checked');
            const weatherDescription = document.getElementById("weather").textContent;

            if (!selectedMoodElement) {
                alert("Please select a mood!");
                return;
            }

            if (weatherDescription === "Loading..." || weatherDescription === "Error fetching weather.") {
                alert("Weather data is not available. Please try again.");
                return;
            }

            const mood = selectedMoodElement.id;
            const queryString = `results.html?mood=${encodeURIComponent(mood)}&weather=${encodeURIComponent(weatherDescription)}`;
            console.log(`Redirecting to results page with query: "${queryString}"`);
            window.location.href = queryString;
        });
    };

    // page process order
    const initializePage = () => {
        fetchWeatherApiKey().then(getLocationAndFetchWeather).then(addGenerateButtonListener);
    };

    initializePage(); 
});