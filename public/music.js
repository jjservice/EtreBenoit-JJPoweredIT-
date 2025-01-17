const audioPlayer = document.getElementById("audioPlayer");
const playPauseBtn = document.getElementById("playPauseBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const randomBtn = document.getElementById("randomBtn");
const searchInput = document.getElementById('searchInput');
const trackList = document.getElementById('trackList');

// Tracks array (as before)
const tracks = [
    {   id: 0,
        name: "No me quiero Casar",
        artist: "Bad Bunny",
        img: "./music/BadBunnyBryinSedaPic.jpg",
        music: "./music/BAD BUNNY - NO ME QUIERO CASAR (MP3).mp3"
    },
    {   id: 1,
        name: "Se Dejaron Ver",
        artist: "Yaisel LM Ft El Fother",
        img: "./music/elfotheryasielsedejaronverPic.jpg",
        music: "./music/Yasiel LM x El Fother - Se Dejaron Ver.mp3"
    },
    {   id: 2,
        name: "Que Cabra Mete Tu",
        artist: "El Fother",
        img: "./music/elfotherquecabrametetuPic.webp",
        music: "./music/El Fother - Que Cabra Mete Tu.mp3"
    },
    {   id: 3,
        name: "Pa que tú me ronca",
        artist: "Químico ultra Mega x Danger",
        img: "./music/QUIMICOPIC.jpg",
        music: "./music/Químico ultra Mega x Danger- Pa que tú me ronca.mp3"
    },
    {   id: 4,
        name: "SEDA",
        artist: "Bad Bunny x Bryant Myers",
        img: "./music/BadBunnyBryinSedaPic.jpg",
        music: "./music/Bad Bunny, Bryant Myers - Seda.mp3"
    },
    {   id: 5,
        name: "Sauce Boy",
        artist: "Eladio Carrion",
        img: "./music/EladioCarrionSauceBoyPic.jpg",
        music: "./music/Eladio Carrión - SAUCEBOY (Freestyle).mp3"
    },
    {   id: 6,
        name: "TOUCHDOWN",
        artist: "Messiah x Myke Towers",
        img: "./music/MessiahMikeTouchDownPic.jpg",
        music: "./music/Messiah, Myke Towers - TOUCHDOWN.mp3"
    }
];

let currentTrackIndex = 0;

// Function to update and play the track
function updateTrack() {
    const track = tracks[currentTrackIndex];
    audioPlayer.src = track.music;
    audioPlayer.load(); // Ensures that the audio is loaded

    // Update UI with song info
    document.getElementById("songName").innerText = track.name;
    document.getElementById("artistName").innerText = track.artist;
    document.getElementById("songImage").src = track.img;

    // Change play/pause button icon
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';

    // Mark active track in the list
    const trackItems = document.querySelectorAll('.track-item');
    trackItems.forEach((item, index) => {
        if (index === currentTrackIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Play/Pause button event listener
playPauseBtn.addEventListener("click", () => {
    if (audioPlayer.paused) {
        audioPlayer.play();
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        audioPlayer.pause();
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
});

// Next button event listener
nextBtn.addEventListener("click", () => {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    updateTrack();
    audioPlayer.play(); // Start playing immediately
});

// Previous button event listener
prevBtn.addEventListener("click", () => {
    currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    updateTrack();
    audioPlayer.play(); // Start playing immediately
});

// Random button event listener
randomBtn.addEventListener("click", () => {
    currentTrackIndex = Math.floor(Math.random() * tracks.length);
    updateTrack();
    audioPlayer.play(); // Start playing immediately
});

// When the audio ends, automatically play the next track
audioPlayer.addEventListener("ended", () => {
    nextBtn.click();
});

// Initialize the player with the first track
updateTrack();






// Function to render the track list
function renderTrackList(filteredTracks = tracks) {
    trackList.innerHTML = ''; // Clear previous list
    filteredTracks.forEach((track, index) => {
        const trackItem = document.createElement('li');
        trackItem.classList.add('track-item');
        trackItem.innerHTML = `
            <img src="${track.img}" alt="${track.name}">
            <h5>${track.name}</h5>
            <p>${track.artist}</p>
        `;
        trackItem.addEventListener('click', () => {
            currentTrackIndex = tracks.indexOf(track);
            updateTrack();
            audioPlayer.play(); // Start playing the clicked track
        });
        trackList.appendChild(trackItem);
    });
}

// Initial render of the track list
renderTrackList();


// Search input event listener for filtering tracks
searchInput.addEventListener('input', function() {
    const searchQuery = searchInput.value.toLowerCase();
    const filteredTracks = tracks.filter(track =>
        track.name.toLowerCase().includes(searchQuery) ||
        track.artist.toLowerCase().includes(searchQuery)
    );
    renderTrackList(filteredTracks); // Re-render the track list with the filtered tracks
});





// Get the progress bar element
const progressBar = document.getElementById("progressBar");

// Update progress bar as audio plays
audioPlayer.addEventListener("timeupdate", () => {
    if (audioPlayer.duration > 0) {
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.value = progress;
    }
});

// Allow the user to click on the progress bar to seek
progressBar.addEventListener("input", () => {
    const seekTime = (progressBar.value / 100) * audioPlayer.duration;
    audioPlayer.currentTime = seekTime;
});
