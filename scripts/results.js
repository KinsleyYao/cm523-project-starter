document.addEventListener("DOMContentLoaded", () => {
    const youtubeApiKey = "AIzaSyCRSI5rKKU8tRmesdNOMZAQmJdYqBaZgKE";
    //YouTube API key retrieving from: https://console.cloud.google.com/apis/library/youtube.googleapis.com?project=cm523-443019&supportedpurview=project&inv=1&invt=Abjmsg

    // fetch YouTube Videos based on the query string and display
    // codes development referred to https://www.youtube.com/watch?v=EAyo3_zJj5c
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
                if (data.items.length) {
                    container.innerHTML = "";
                    data.items.forEach((item) => {
                        const videoCard = `
                            <div class="song-card">
                                <div class="song-image">
                                    <img src="${item.snippet.thumbnails.medium.url}" alt="${item.snippet.title}" />
                                </div>
                                <p>Title: <span>${item.snippet.title}</span></p>
                                <a href="https://www.youtube.com/watch?v=${item.id.videoId}" target="_blank">Listen To It</a>
                            </div>
                        `;
                        container.innerHTML += videoCard;
                    });
                } else {
                    container.innerHTML = "<p>No videos found for the query.</p>";
                }
            })
            .catch((error) => {
                console.error("YouTube API fetch error:", error);
                container.innerHTML = "<p>Error fetching videos. Please try again later.</p>";
            });
    };

    // diary section
    const saveButton = document.getElementById("save-thoughts-button");
    const thoughtsInput = document.getElementById("thoughts-input");
    const saveMessage = document.getElementById("save-message");

    const saveThoughts = () => {
        const thoughts = thoughtsInput.value.trim();

        if (!thoughts) {
            saveMessage.textContent = "Please write something before saving.";
            saveMessage.classList.remove("success");
            saveMessage.classList.add("error", "visible");
            return;
        }

        const fileContent = `Thoughts: ${thoughts}`;
        const blob = new Blob([fileContent], { type: "text/plain" });
        const downloadLink = document.createElement("a");

        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = "MyThoughts.txt";
        downloadLink.click();

        thoughtsInput.value = "";
        saveMessage.textContent = "Your thoughts.txt have been saved!";
        saveMessage.classList.remove("error");
        saveMessage.classList.add("success", "visible");
    };

    
    // page process order
    const initializeResultsPage = () => {
        const videoContainer = document.getElementById("video-results");

        const params = new URLSearchParams(window.location.search);
        const mood = params.get("mood");
        const weather = params.get("weather");

        if (!mood || !weather) {
            videoContainer.innerHTML = "<p>Error: Missing mood or weather data.</p>";
            return;
        }

        const query = `songs for a ${mood} and ${weather} day`;
        fetchYouTubeVideos(query, videoContainer);

        saveButton.addEventListener("click", saveThoughts);
    };

    if (document.getElementById("video-results")) initializeResultsPage();
});