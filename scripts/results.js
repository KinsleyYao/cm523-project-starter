document.addEventListener("DOMContentLoaded", () => {
    const apiKeyFilePath = "./secrets/secretYoutube.txt";
    let youtubeApiKey = "";

    // fetch YT API
    const fetchApiKey = () =>
        fetch(apiKeyFilePath)
            .then((response) => {
                if (!response.ok) throw new Error(`Failed to load API key. Status: ${response.status}`);
                return response.text();
            })
            .then((key) => {
                youtubeApiKey = key.trim();
                console.log("YouTube API Key loaded successfully");
            })
            .catch((error) => console.error("Error loading API key:", error));

    // fetch and display YT videos
    const fetchYouTubeVideos = (query, container) => {
        if (!youtubeApiKey) return console.error("YouTube API key is not loaded yet.");

        const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&videoCategoryId=10&maxResults=5&key=${youtubeApiKey}`;

        fetch(apiUrl)
            .then((response) => {
                if (!response.ok) throw new Error(`YouTube API error! Status: ${response.status}`);
                return response.json();
            })
            .then((data) => {
                console.log("YouTube API Response:", data);
                container.innerHTML = data.items.length
                    ? data.items
                          .map(
                              (item) => `
                            <div class="song-card">
                                <div class="song-image">
                                    <img src="${item.snippet.thumbnails.medium.url}" alt="${item.snippet.title}" />
                                </div>
                                <p>Song: <span>${item.snippet.title}</span></p>
                                <a href="https://www.youtube.com/watch?v=${item.id.videoId}" target="_blank">Listen To It</a>
                            </div>
                        `
                          )
                          .join("")
                    : "<p>No videos found for the query.</p>";
            })
            .catch((error) => {
                console.error("YouTube API fetch error:", error);
                container.innerHTML = "<p>Error fetching videos. Please try again later.</p>";
            });
    };

    // diary section
    const saveThoughts = () => {
        const thoughtsInput = document.getElementById("thoughts-input");
        if (!thoughtsInput) return alert("Error: Thoughts input field not found.");

        const thoughts = thoughtsInput.value.trim();
        if (!thoughts) return alert("Please write something before saving.");

        const timestamp = new Date().toISOString().replace(/T/, "_").replace(/:/g, "-").split(".")[0];
        const fileContent = `Timestamp: ${timestamp}\n\nThoughts:\n${thoughts}`;
        const blob = new Blob([fileContent], { type: "text/plain" });
        const downloadLink = document.createElement("a");

        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = `Thoughts_${timestamp}.txt`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        thoughtsInput.value = "";
        alert("Your thoughts have been saved!");
    };

    // page process order
    const initializeResultsPage = () => {
        const videoContainer = document.getElementById("video-results");
        const saveButton = document.getElementById("save-thoughts-button");
        const urlParameters = new URLSearchParams(window.location.search);
        const mood = urlParameters.get("mood");
        const weather = urlParameters.get("weather");

        if (!mood || !weather) {
            videoContainer.innerHTML = "<p>Error: Missing mood or weather data.</p>";
            return;
        }

        fetchApiKey().then(() => {
            const query = `songs for a ${mood} and ${weather} day`;
            console.log(`Fetching YouTube videos for query: "${query}"`);
            fetchYouTubeVideos(query, videoContainer);
        });

        if (saveButton) saveButton.addEventListener("click", saveThoughts);
        else console.error("Save button not found.");
    };

    if (document.getElementById("video-results")) initializeResultsPage();
});