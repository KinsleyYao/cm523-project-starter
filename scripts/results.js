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
    const saveButton = document.getElementById("save-thoughts-button");
    const thoughtsInput = document.getElementById("thoughts-input");

    const saveThoughts = () => {
    
    const thoughts = thoughtsInput.value.trim();

    if (!thoughts) {
      alert("Please write something before saving.");
      return;
    }

    const fileContent = `Thoughts:\n${thoughts}`;
    const blob = new Blob([fileContent], { type: "text/plain" });

    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = "MyThoughts.txt";

    downloadLink.click();

    thoughtsInput.value = "";
    alert("Your thoughts have been saved!");
  };

    // page process order
    const initializeResultsPage = () => {
    const videoContainer = document.getElementById("video-results");
    const saveButton = document.getElementById("save-thoughts-button");
      
   
    const params = new URLSearchParams(window.location.search);
    const mood = params.get("mood");
    const weather = params.get("weather");

    if (!mood || !weather) {
        videoContainer.innerHTML = "<p>Error: Missing mood or weather data.</p>";
        return;
   }
      

    fetchApiKey().then(() => {
    const query = `songs for a ${mood} and ${weather} day`;
    fetchYouTubeVideos(query, videoContainer);
    });
      

    saveButton?.addEventListener("click", saveThoughts);
    };
      

    if (document.getElementById("video-results")) initializeResultsPage();
    });