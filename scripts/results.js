document.addEventListener("DOMContentLoaded", () => {
    const apiKeyUrl = "./secrets/secretYoutube.txt"; // Path to the secret file
    let youtubeApiKey = ""; // Placeholder for the API key

    // Fetch API key from secretYoutube.txt
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

    // Save user thoughts as a local file
    const saveThoughts = () => {
        const thoughtsInput = document.getElementById("thoughts-input");
        if (!thoughtsInput) {
            alert("Error: Thoughts input field not found.");
            return;
        }

        const thoughts = thoughtsInput.value.trim();
        if (!thoughts) {
            alert("Please write something before saving.");
            return;
        }

        // Get the current timestamp
        const now = new Date();
        const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}`;

        // Create the file content
        const fileContent = `Timestamp: ${timestamp}\n\nThoughts:\n${thoughts}`;

        // Create a blob and download link
        const blob = new Blob([fileContent], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `Thoughts_${timestamp}.txt`;

        // Simulate a click to download the file
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clear the text area
        thoughtsInput.value = "";
        alert("Your thoughts have been saved!");
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

        // Attach the save thoughts functionality
        const saveButton = document.getElementById("save-thoughts-button");
        if (saveButton) {
            saveButton.addEventListener("click", saveThoughts);
        } else {
            console.error("Save button not found.");
        }
    };

    // Detect Results Page and Initialize
    if (document.getElementById("video-results")) {
        initResultsPage();
    }
});