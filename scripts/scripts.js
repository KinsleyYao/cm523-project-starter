document.addEventListener("DOMContentLoaded", () => {
    const weatherApiKey = '86af78f3841b6bddb02fc8df8a2121b4'; // OpenWeatherMap API key
    const youtubeApiKey = 'AIzaSyCRSI5rKKU8tRmesdNOMZAQmJdYqBaZgKE'; // Replace with your YouTube API key

    const weatherSpan = document.getElementById("weather");
    const temperatureSpan = document.getElementById("temperature");
    const dateSpan = document.getElementById("current-date");

    // Fetch and display YouTube videos based on a query
    const fetchYouTubeVideos = (query, container) => {
        const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=5&key=${youtubeApiKey}`;

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`YouTube API error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                container.innerHTML = ""; // Clear existing content
                data.items.forEach(item => {
                    const videoId = item.id.videoId;
                    const title = item.snippet.title;
                    const thumbnail = item.snippet.thumbnails.medium.url;

                    // Create a card for each video
                    const videoElement = document.createElement("div");
                    videoElement.classList.add("song-card");
                    videoElement.innerHTML = `
                        <div class="song-image">
                            <img src="${thumbnail}" alt="${title}" />
                        </div>
                        <p>Song: <span>${title}</span></p>
                        <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank">Listen To It</a>
                    `;
                    container.appendChild(videoElement);
                });
            })
            .catch(error => {
                console.error("YouTube API error:", error);
                container.innerHTML = "<p>Error fetching videos. Please try again later.</p>";
            });
    };

    // Main page logic
    const initMainPage = () => {
        const videoContainer = document.createElement("div");
        videoContainer.id = "videos";
        document.body.appendChild(videoContainer);

        // Fetch weather for Boston, MA
        const fetchWeather = () => {
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=42.3601&lon=-71.0589&appid=${weatherApiKey}&units=metric`;

            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    const weather = data.weather[0].description;
                    const temperature = data.main.temp;

                    weatherSpan.textContent = weather.charAt(0).toUpperCase() + weather.slice(1); // Capitalize first letter
                    temperatureSpan.textContent = `${temperature}°C`;
                })
                .catch(error => {
                    weatherSpan.textContent = "Error fetching weather.";
                    temperatureSpan.textContent = "";
                    console.error("Fetch error:", error);
                });
        };

        // Display current date
        const currentDate = new Date().toLocaleDateString();
        dateSpan.textContent = currentDate;

        // Fetch weather on page load
        fetchWeather();

        // Add click listener to the generator button
        document.querySelector(".generate-button").addEventListener("click", () => {
            const selectedMood = document.querySelector('input[name="moods"]:checked');

            if (!selectedMood) {
                alert("Please select a mood!");
                return;
            }

            const mood = selectedMood.id;
            const weather = weatherSpan.textContent;

            if (weather === "Loading..." || weather === "Error fetching weather.") {
                alert("Weather data is not available. Please try again.");
                return;
            }

            const query = `${mood} music ${weather}`;
            console.log(`Redirecting to results page with query: "${query}"`);

            // Redirect to results page with mood and weather as query parameters
            window.location.href = `results.html?mood=${encodeURIComponent(mood)}&weather=${encodeURIComponent(weather)}`;
        });
    };

    // Results page logic
    const initResultsPage = () => {
        const videoContainer = document.getElementById("video-results");

        // Extract mood and weather from the URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const mood = urlParams.get("mood");
        const weather = urlParams.get("weather");

        if (!mood || !weather) {
            videoContainer.innerHTML = "<p>Error: Missing mood or weather data.</p>";
            return;
        }

        const query = `${mood} music ${weather}`;
        console.log(`Fetching YouTube videos for query: "${query}"`);

        // Fetch videos and display them in the container
        fetchYouTubeVideos(query, videoContainer);
    };

    // Determine which page is active
    const isMainPage = !!document.querySelector(".generate-button");
    if (isMainPage) {
        initMainPage();
    } else if (document.getElementById("video-results")) {
        initResultsPage();
    }
});

