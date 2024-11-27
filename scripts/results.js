document.addEventListener("DOMContentLoaded", () => {
    const youtubeApiKey = 'AIzaSyCRSI5rKKU8tRmesdNOMZAQmJdYqBaZgKE'; // Replace with your YouTube API key
    const videoContainer = document.getElementById("video-results");

    // Extract mood and weather from the URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const mood = urlParams.get("mood");
    const weather = urlParams.get("weather");

    if (!mood || !weather) {
        videoContainer.innerHTML = "<p>Error: Missing mood or weather data.</p>";
        return;
    }

    // Combine mood and weather into a query
    const query = `${mood} music ${weather}`;
    console.log("YouTube search query:", query);

    // Fetch YouTube videos based on the query
    const fetchYouTubeVideos = (query) => {
        const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
            query
        )}&type=video&maxResults=5&key=AIzaSyCRSI5rKKU8tRmesdNOMZAQmJdYqBaZgKE`;

        fetch(apiUrl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`YouTube API error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log("YouTube API Response:", data);

                if (data.items.length === 0) {
                    videoContainer.innerHTML = "<p>No videos found for the query.</p>";
                    return;
                }

                // Clear any existing content
                videoContainer.innerHTML = "";

                // Loop through the results and create video cards
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
                    videoContainer.appendChild(videoElement);
                });
            })
            .catch((error) => {
                console.error("YouTube API fetch error:", error);
                videoContainer.innerHTML = "<p>Error fetching videos. Please try again later.</p>";
            });
    };

    // Fetch and display videos
    fetchYouTubeVideos(query);
});