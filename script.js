// DOM Elements
const audio = document.getElementById('audio');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const shuffleBtn = document.getElementById('shuffle');
const repeatBtn = document.getElementById('repeat');
const backward5Btn = document.getElementById('backward5');
const forward5Btn = document.getElementById('forward5');
const volumeControl = document.getElementById('volume');
const progress = document.getElementById('progress');
const progressContainer = document.querySelector('.progress-container');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const titleEl = document.getElementById('title');
const artistEl = document.getElementById('artist');
const coverEl = document.getElementById('cover');
const recordEl = document.querySelector('.record');
const toneArmEl = document.querySelector('.tone-arm');
const playlistEl = document.getElementById('playlist');
const sortSelect = document.getElementById('sort-by');
const totalRuntimeEl = document.querySelector('[data-total-runtime]');

// App state
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;
let currentSongIndex = 0;

// Music library (can be expanded or loaded from an API)
const library = [
  {
    title: 'Plastic Love',
    artist: 'Mariya Takeuchi',
    cover: 'assets/img/Mariya Takeuchi - Plastic Love.jpg',
    audio: 'assets/audio/Mariya Takeuchi - Plastic Love.flac',
    duration: '4:55'
  },
  {
    title: 'まちがいさがし',
    artist: '米津玄師',
    cover: 'assets/img/米津玄師 - まちがいさがし.jpg',
    audio: 'assets/audio/米津玄師 - まちがいさがし.flac',
    duration: '4:27'
  },
  {
    title: '내겐 너무 아름다운',
    artist: 'Arcturus OST',
    cover: 'assets/img/Arcturus OST - 내겐 너무 아름다운.jpg',
    audio: 'assets/audio/Arcturus OST - 내겐 너무 아름다운.flac',
    duration: '3:45'
  }
];

// Initialize the app
function init() {
  // Load the first song
  loadSong(currentSongIndex);
  
  // Render playlist
  renderPlaylist();
  
  // Set up event listeners
  setupEventListeners();
}

// Load song into the player
function loadSong(index) {
  const song = library[index];
  
  // Update UI
  titleEl.textContent = song.title;
  artistEl.textContent = song.artist;
  coverEl.src = song.cover;
  
  // Update audio source
  audio.src = song.audio;
  
  // Update active state in playlist
  updateActiveSong();
  
  // Play if not already playing
  if (isPlaying) {
    audio.play().catch(() => {
      // Autoplay might be blocked; reset UI state
      pauseSong();
    });
  }
}

// Play the current song
function playSong() {
  isPlaying = true;
  playBtn.querySelector('i').classList.remove('fa-play');
  playBtn.querySelector('i').classList.add('fa-pause');
  if (recordEl) {
    recordEl.classList.add('playing');
  }
  if (toneArmEl) {
    toneArmEl.classList.add('playing');
  }
  audio.play().catch(() => {
    // If playback fails (e.g., user gesture required), revert state
    pauseSong();
  });
}

// Pause the current song
function pauseSong() {
  isPlaying = false;
  playBtn.querySelector('i').classList.add('fa-play');
  playBtn.querySelector('i').classList.remove('fa-pause');
  if (recordEl) {
    recordEl.classList.remove('playing');
  }
  if (toneArmEl) {
    toneArmEl.classList.remove('playing');
  }
  audio.pause();
}

// Play previous song
function playPrevSong() {
  currentSongIndex--;
  if (currentSongIndex < 0) {
    currentSongIndex = library.length - 1;
  }
  loadSong(currentSongIndex);
}

// Play next song
function playNextSong() {
  if (isShuffle) {
    playRandomSong();
  } else {
    currentSongIndex = (currentSongIndex + 1) % library.length;
    loadSong(currentSongIndex);
  }
}

// Play a random song
function playRandomSong() {
  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * library.length);
  } while (newIndex === currentSongIndex && library.length > 1);
  
  currentSongIndex = newIndex;
  loadSong(currentSongIndex);
}

// Toggle shuffle
function toggleShuffle() {
  isShuffle = !isShuffle;
  shuffleBtn.classList.toggle('active', isShuffle);
  
  // Save preference to localStorage
  localStorage.setItem('shuffle', isShuffle);
}

// Toggle repeat
function toggleRepeat() {
  isRepeat = !isRepeat;
  repeatBtn.classList.toggle('active', isRepeat);
  
  // Save preference to localStorage
  localStorage.setItem('repeat', isRepeat);
}

// Update progress bar
function updateProgress(e) {
  const { duration, currentTime } = e.srcElement;
  const progressPercent = duration ? (currentTime / duration) * 100 : 0;
  progress.style.width = `${progressPercent}%`;

  const durationMinutes = Math.floor((duration || 0) / 60);
  let durationSeconds = Math.floor((duration || 0) % 60);
  if (durationSeconds < 10) {
    durationSeconds = `0${durationSeconds}`;
  }

  const currentMinutes = Math.floor(currentTime / 60);
  let currentSeconds = Math.floor(currentTime % 60);
  if (currentSeconds < 10) {
    currentSeconds = `0${currentSeconds}`;
  }

  currentTimeEl.textContent = `${currentMinutes}:${currentSeconds}`;

  if (duration) {
    durationEl.textContent = `${durationMinutes}:${durationSeconds}`;
  }
}

// Set progress bar when clicked
function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  audio.currentTime = (clickX / width) * duration;
}

// Update volume
function setVolume() {
  if (!volumeControl) return;
  audio.volume = volumeControl.value;
  
  // Save volume to localStorage
  localStorage.setItem('volume', audio.volume);
  
  // Update volume icon
  const [volumeDownIcon, volumeUpIcon] = document.querySelectorAll('.volume-row i');
  if (volumeDownIcon && volumeUpIcon) {
    if (audio.volume === 0) {
      volumeDownIcon.classList.remove('fa-volume-down');
      volumeDownIcon.classList.add('fa-volume-mute');
      volumeUpIcon.classList.remove('fa-volume-up');
      volumeUpIcon.classList.add('fa-volume-mute');
    } else {
      volumeDownIcon.classList.remove('fa-volume-mute');
      volumeDownIcon.classList.add('fa-volume-down');
      volumeUpIcon.classList.remove('fa-volume-mute');
      volumeUpIcon.classList.add('fa-volume-up');
    }
  }
}

// Render playlist
function renderPlaylist() {
  // Sort songs if needed
  const sortBy = sortSelect.value;
  const sortedLibrary = [...library].sort((a, b) => {
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    if (sortBy === 'artist') return a.artist.localeCompare(b.artist);
    return 0;
  });
  
  // Clear existing playlist
  playlistEl.innerHTML = '';
  
  // Compute total runtime
  const totalSeconds = sortedLibrary.reduce((sum, song) => {
    const [minutes, seconds] = song.duration.split(':').map(Number);
    return sum + minutes * 60 + seconds;
  }, 0);
  if (totalRuntimeEl) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    totalRuntimeEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  // Add songs to playlist
  sortedLibrary.forEach((song, sortedIndex) => {
    const songEl = document.createElement('div');
    songEl.classList.add('song-item');
    const libraryIndex = library.findIndex(s => s.title === song.title && s.artist === song.artist);
    songEl.dataset.index = libraryIndex;
    if (Number(songEl.dataset.index) === currentSongIndex) {
      songEl.classList.add('playing');
    }
    
    songEl.innerHTML = `
      <div class="song-number">${sortedIndex + 1}</div>
      <div class="song-info">
        <div class="song-title">${song.title}</div>
        <div class="song-artist">${song.artist}</div>
      </div>
      <div class="song-duration">${song.duration}</div>
    `;
    
    songEl.addEventListener('click', () => {
      currentSongIndex = Number(songEl.dataset.index);
      loadSong(currentSongIndex);
      playSong();
    });
    
    playlistEl.appendChild(songEl);
  });
}

// Update active song in playlist
function updateActiveSong() {
  const songItems = document.querySelectorAll('.song-item');
  songItems.forEach((item) => {
    if (Number(item.dataset.index) === currentSongIndex) {
      item.classList.add('playing');
    } else {
      item.classList.remove('playing');
    }
  });
}

// Load preferences from localStorage
function loadPreferences() {
  // Volume
  const savedVolume = localStorage.getItem('volume');
  if (savedVolume !== null) {
    audio.volume = parseFloat(savedVolume);
    volumeControl.value = savedVolume;
  }
  
  // Shuffle
  const savedShuffle = localStorage.getItem('shuffle') === 'true';
  if (savedShuffle) {
    isShuffle = true;
    shuffleBtn.classList.add('active');
  }
  
  // Repeat
  const savedRepeat = localStorage.getItem('repeat') === 'true';
  if (savedRepeat) {
    isRepeat = true;
    repeatBtn.classList.add('active');
  }
}

// Set up all event listeners
function setupEventListeners() {
  // Play/pause
  playBtn.addEventListener('click', () => {
    isPlaying ? pauseSong() : playSong();
  });
  
  // Previous/next
  prevBtn.addEventListener('click', playPrevSong);
  nextBtn.addEventListener('click', playNextSong);
  
  // Shuffle/repeat
  shuffleBtn.addEventListener('click', toggleShuffle);
  repeatBtn.addEventListener('click', toggleRepeat);

  // Skip 5 seconds
  if (backward5Btn) {
    backward5Btn.addEventListener('click', () => {
      audio.currentTime = Math.max(0, audio.currentTime - 5);
    });
  }
  if (forward5Btn) {
    forward5Btn.addEventListener('click', () => {
      if (!Number.isNaN(audio.duration)) {
        audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
      }
    });
  }
  
  // Volume control
  if (volumeControl) {
    volumeControl.addEventListener('input', setVolume);
  }
  
  // Progress bar
  audio.addEventListener('timeupdate', updateProgress);
  progressContainer.addEventListener('click', setProgress);
  
  // Song ended
  audio.addEventListener('ended', () => {
    if (isRepeat) {
      // If repeat is on, play the same song again
      audio.currentTime = 0;
      playSong();
    } else {
      // Otherwise, play the next song
      playNextSong();
    }
  });
  
  // Sort playlist
  sortSelect.addEventListener('change', renderPlaylist);
  
  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      isPlaying ? pauseSong() : playSong();
    } else if (e.code === 'ArrowLeft') {
      audio.currentTime = Math.max(0, audio.currentTime - 5);
    } else if (e.code === 'ArrowRight') {
      audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
    } else if (e.code === 'ArrowUp') {
      volumeControl.value = Math.min(1, parseFloat(volumeControl.value) + 0.1);
      setVolume();
    } else if (e.code === 'ArrowDown') {
      volumeControl.value = Math.max(0, parseFloat(volumeControl.value) - 0.1);
      setVolume();
    } else if (e.code === 'KeyM') {
      // Mute/unmute
      if (audio.volume > 0) {
        audio.volume = 0;
        volumeControl.value = 0;
      } else {
        audio.volume = 0.7;
        volumeControl.value = 0.7;
      }
      setVolume();
    }
  });
  
  // Load preferences
  loadPreferences();
}

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);

// Time of song
audio.addEventListener("timeupdate", durTime);
