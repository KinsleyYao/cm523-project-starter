document.addEventListener("DOMContentLoaded", () => {
    const apiKeyUrl = "./secrets/secretYoutube.txt"; // Path to the secret file
    let youtubeApiKey = ""; // Placeholder for the API key

    // Fetch API key from secret.txt
    const fetchApiKey = async () => {
        try {
            const response = await fetch(apiKeyUrl);
            if (!response.ok) {
                throw new Error(`Failed to load API key. Status: ${response.status}`);
            }
            youtubeApiKey = (await response.text()).trim(); // Read and trim the key
            console.log("API Key loaded successfully");
        } catch (error) {
            console.error("Error loading API key:", error);
        }
    };

    // Fetch and display YouTube videos
    const fetchYouTubeVideos = async (query, container) => {
        if (!youtubeApiKey) {
            console.error("YouTube API key is not loaded yet.");
            return;
        }

        const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
            query
        )}&type=video&videoCategoryId=10&maxResults=5&key=${youtubeApiKey}`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`YouTube API error! Status: ${response.status}`);
            }
            const data = await response.json();
            console.log("YouTube API Response:", data);

            if (data.items.length === 0) {
                container.innerHTML = "<p>No videos found for the query.</p>";
                return;
            }

            // Clear existing content
            container.innerHTML = "";

            // Create video cards
            data.items.forEach((item) => {
                const videoId = item.id.videoId;
                const title = item.snippet.title;
                const thumbnail = item.snippet.thumbnails.medium.url;

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
        } catch (error) {
            console.error("YouTube API fetch error:", error);
            container.innerHTML = "<p>Error fetching videos. Please try again later.</p>";
        }
    };

    // Initialize Results Page
    const initResultsPage = async () => {
        const videoContainer = document.getElementById("video-results");

        // Extract mood and weather from the URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const mood = urlParams.get("mood");
        const weather = urlParams.get("weather");

        if (!mood || !weather) {
            videoContainer.innerHTML = "<p>Error: Missing mood or weather data.</p>";
            return;
        }

        // Load the API key
        await fetchApiKey();

        const query = `${mood} music ${weather}`;
        console.log(`Fetching YouTube videos for query: "${query}"`);

        // Fetch videos
        fetchYouTubeVideos(query, videoContainer);
    };

    // Detect Results Page and Initialize
    if (document.getElementById("video-results")) {
        initResultsPage();
    }
});