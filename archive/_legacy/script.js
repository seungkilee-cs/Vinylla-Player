class AudioPlayerApp {
  constructor() {
    this.audioPlayer = document.getElementById("audioPlayer");
    this.playlist = [];
    this.currentTrack = 0;
    this.isPlaying = false;

    this.initializeEventListeners();
    this.initializeWaveform();
  }

  initializeEventListeners() {
    const uploadZone = document.getElementById("uploadZone");
    const fileInput = document.getElementById("audioInput");

    // File upload handling
    uploadZone.addEventListener("click", () => fileInput.click());
    uploadZone.addEventListener("dragover", this.handleDragOver);
    uploadZone.addEventListener("drop", this.handleFileDrop.bind(this));
    fileInput.addEventListener("change", this.handleFileSelect.bind(this));

    // Player controls
    document
      .getElementById("playPauseBtn")
      .addEventListener("click", this.togglePlayPause.bind(this));
    document
      .getElementById("prevBtn")
      .addEventListener("click", this.previousTrack.bind(this));
    document
      .getElementById("nextBtn")
      .addEventListener("click", this.nextTrack.bind(this));

    // Audio events
    this.audioPlayer.addEventListener(
      "loadedmetadata",
      this.updateTrackInfo.bind(this),
    );
    this.audioPlayer.addEventListener(
      "timeupdate",
      this.updateProgress.bind(this),
    );
    this.audioPlayer.addEventListener("ended", this.nextTrack.bind(this));
  }

  handleFileDrop(e) {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.dataTransfer.files);
    this.processFiles(files);
  }

  handleFileSelect(e) {
    const files = Array.from(e.target.files);
    this.processFiles(files);
  }

  processFiles(files) {
    const audioFiles = files.filter((file) => file.type.startsWith("audio/"));

    audioFiles.forEach((file) => {
      const fileURL = URL.createObjectURL(file);
      this.playlist.push({
        name: file.name,
        url: fileURL,
        duration: 0,
      });
    });

    this.updatePlaylistUI();
    this.showPlayerSections();

    if (this.playlist.length > 0 && !this.audioPlayer.src) {
      this.loadTrack(0);
    }
  }

  loadTrack(index) {
    if (this.playlist[index]) {
      this.currentTrack = index;
      this.audioPlayer.src = this.playlist[index].url;
      this.audioPlayer.load();
    }
  }

  togglePlayPause() {
    if (this.isPlaying) {
      this.audioPlayer.pause();
      this.isPlaying = false;
      document.getElementById("playPauseBtn").textContent = "▶️";
    } else {
      this.audioPlayer.play();
      this.isPlaying = true;
      document.getElementById("playPauseBtn").textContent = "⏸️";
    }
  }

  updateTrackInfo() {
    const currentTrack = this.playlist[this.currentTrack];
    document.getElementById("trackName").textContent = currentTrack.name;
    document.getElementById("totalTime").textContent = this.formatTime(
      this.audioPlayer.duration,
    );
  }

  updateProgress() {
    const progress =
      (this.audioPlayer.currentTime / this.audioPlayer.duration) * 100;
    document.getElementById("progressBar").value = progress;
    document.getElementById("currentTime").textContent = this.formatTime(
      this.audioPlayer.currentTime,
    );

    this.updateWaveform();
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  showPlayerSections() {
    document.getElementById("playerSection").style.display = "block";
    document.getElementById("playlistSection").style.display = "block";
  }

  initializeWaveform() {
    // Simplified waveform visualization
    this.canvas = document.getElementById("waveform");
    this.ctx = this.canvas.getContext("2d");
  }

  updateWaveform() {
    // Create animated waveform effect
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, 0);
    gradient.addColorStop(0, "#667eea");
    gradient.addColorStop(1, "#764ba2");

    this.ctx.fillStyle = gradient;

    for (let i = 0; i < 50; i++) {
      const height = Math.random() * 40 + 10;
      const x = (i * this.canvas.width) / 50;
      this.ctx.fillRect(x, this.canvas.height - height, 6, height);
    }
  }
}

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  new AudioPlayerApp();
});
