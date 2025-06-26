// Persistent Audio Manager - Fixed Version
class PersistentAudio {
    constructor(audioSrc) {
      this.audioSrc = audioSrc
      this.audio = null
      this.isInitialized = false
      this.updateInterval = null
      this.storageKey = "persistent_audio_time"
      this.playingKey = "persistent_audio_playing"
      this.volumeKey = "persistent_audio_volume"
      this.isReady = false
  
      this.init()
    }
  
    init() {
      // Create audio element
      this.audio = new Audio(this.audioSrc)
      this.audio.loop = true
      this.audio.preload = "auto"
  
      // Load saved volume or set default
      const savedVolume = localStorage.getItem(this.volumeKey)
      this.audio.volume = savedVolume ? Number.parseFloat(savedVolume) : 0.7
  
      // Set up event listeners first
      this.setupEventListeners()
  
      // Load saved state after audio is ready
      this.audio.addEventListener("loadeddata", () => {
        this.isReady = true
        this.loadState()
        this.startTracking()
        console.log("Audio ready and state loaded")
      })
  
      // Fallback if loadeddata doesn't fire
      setTimeout(() => {
        if (!this.isReady) {
          this.isReady = true
          this.loadState()
          this.startTracking()
          console.log("Audio ready (fallback)")
        }
      }, 1000)
  
      this.isInitialized = true
    }
  
    setupEventListeners() {
      // Save state when audio plays
      this.audio.addEventListener("play", () => {
        localStorage.setItem(this.playingKey, "true")
        console.log("Audio started playing at:", this.audio.currentTime)
      })
  
      // Save state when audio pauses
      this.audio.addEventListener("pause", () => {
        localStorage.setItem(this.playingKey, "false")
        this.saveCurrentTime()
        console.log("Audio paused at:", this.audio.currentTime)
      })
  
      // Handle audio end (though it's looped)
      this.audio.addEventListener("ended", () => {
        localStorage.setItem(this.storageKey, "0")
        console.log("Audio ended, resetting position")
      })
  
      // Handle audio errors
      this.audio.addEventListener("error", (e) => {
        console.error("Audio error:", e)
      })
  
      // Save position periodically while playing
      this.audio.addEventListener("timeupdate", () => {
        if (!this.audio.paused && this.isReady) {
          this.saveCurrentTime()
        }
      })
  
      // Handle page visibility change
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          this.saveCurrentTime()
          console.log("Page hidden, saved time:", this.audio.currentTime)
        }
      })
  
      // Save state before page unload
      window.addEventListener("beforeunload", () => {
        this.saveCurrentTime()
        console.log("Page unloading, saved time:", this.audio.currentTime)
      })
  
      // Handle page focus
      window.addEventListener("focus", () => {
        if (this.isReady) {
          this.loadState()
          console.log("Page focused, loaded state")
        }
      })
    }
  
    loadState() {
      if (!this.isReady) return
  
      const savedTime = localStorage.getItem(this.storageKey)
      const wasPlaying = localStorage.getItem(this.playingKey) === "true"
  
      console.log("Loading state - Time:", savedTime, "Was playing:", wasPlaying)
  
      if (savedTime && !isNaN(Number.parseFloat(savedTime))) {
        const timeToSet = Number.parseFloat(savedTime)
  
        // Only set time if it's different from current time (avoid unnecessary seeks)
        if (Math.abs(this.audio.currentTime - timeToSet) > 1) {
          this.audio.currentTime = timeToSet
          console.log("Set audio position to:", timeToSet)
        }
      }
  
      // Auto-play if it was playing before
      if (wasPlaying && this.audio.paused) {
        this.play()
      }
    }
  
    saveCurrentTime() {
      if (this.audio && !isNaN(this.audio.currentTime) && this.isReady) {
        localStorage.setItem(this.storageKey, this.audio.currentTime.toString())
        localStorage.setItem(this.volumeKey, this.audio.volume.toString())
      }
    }
  
    startTracking() {
      // Clear existing interval
      if (this.updateInterval) {
        clearInterval(this.updateInterval)
      }
  
      // Update position every 2 seconds (less frequent to avoid conflicts)
      this.updateInterval = setInterval(() => {
        if (this.audio && !this.audio.paused && this.isReady) {
          this.saveCurrentTime()
        }
      }, 2000)
    }
  
    play() {
      if (!this.audio || !this.isReady) {
        console.log("Audio not ready for play")
        return
      }
  
      const playPromise = this.audio.play()
  
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Audio playback started successfully at:", this.audio.currentTime)
          })
          .catch((error) => {
            console.log("Audio playback failed:", error)
            // Try to play with user interaction
            this.setupUserInteractionPlay()
          })
      }
    }
  
    pause() {
      if (this.audio && this.isReady) {
        this.audio.pause()
      }
    }
  
    setupUserInteractionPlay() {
      const playOnInteraction = () => {
        this.play()
        document.removeEventListener("click", playOnInteraction)
        document.removeEventListener("keydown", playOnInteraction)
        document.removeEventListener("touchstart", playOnInteraction)
      }
  
      document.addEventListener("click", playOnInteraction, { once: true })
      document.addEventListener("keydown", playOnInteraction, { once: true })
      document.addEventListener("touchstart", playOnInteraction, { once: true })
    }
  
    setVolume(volume) {
      if (this.audio && this.isReady) {
        this.audio.volume = Math.max(0, Math.min(1, volume))
        localStorage.setItem(this.volumeKey, this.audio.volume.toString())
      }
    }
  
    getCurrentTime() {
      return this.audio && this.isReady ? this.audio.currentTime : 0
    }
  
    getDuration() {
      return this.audio && this.isReady ? this.audio.duration : 0
    }
  
    isPlaying() {
      return this.audio && this.isReady ? !this.audio.paused : false
    }
  
    destroy() {
      if (this.updateInterval) {
        clearInterval(this.updateInterval)
      }
  
      if (this.audio) {
        this.saveCurrentTime()
        this.audio.pause()
        this.audio.src = ""
        this.audio = null
      }
    }
  }
  
  // Global audio manager instance
  let globalAudioManager = null
  
  // Initialize audio manager
  function initPersistentAudio(audioSrc = "./music/hbd.mp3") {
    // Prevent multiple instances
    if (globalAudioManager) {
      console.log("Audio manager already exists, reusing...")
      return globalAudioManager
    }
  
    console.log("Creating new audio manager...")
    globalAudioManager = new PersistentAudio(audioSrc)
    return globalAudioManager
  }
  
  // Auto-initialize when script loads
  document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM loaded, initializing audio...")
  
    // Small delay to ensure page is fully loaded
    setTimeout(() => {
      initPersistentAudio()
  
      // Try to start playing after initialization
      setTimeout(() => {
        if (globalAudioManager && globalAudioManager.isReady) {
          const wasPlaying = localStorage.getItem("persistent_audio_playing") === "true"
          if (wasPlaying || !localStorage.getItem("persistent_audio_playing")) {
            globalAudioManager.play()
          }
        }
      }, 500)
    }, 100)
  })
  
  // Export for use in other scripts
  window.PersistentAudio = PersistentAudio
  window.globalAudioManager = globalAudioManager
  window.initPersistentAudio = initPersistentAudio
  
  // Debug function to check audio state
  window.debugAudio = () => {
    if (globalAudioManager && globalAudioManager.audio) {
      console.log("=== AUDIO DEBUG INFO ===")
      console.log("Current Time:", globalAudioManager.audio.currentTime)
      console.log("Duration:", globalAudioManager.audio.duration)
      console.log("Is Playing:", !globalAudioManager.audio.paused)
      console.log("Volume:", globalAudioManager.audio.volume)
      console.log("Ready State:", globalAudioManager.audio.readyState)
      console.log("Saved Time:", localStorage.getItem("persistent_audio_time"))
      console.log("Saved Playing:", localStorage.getItem("persistent_audio_playing"))
      console.log("Is Ready:", globalAudioManager.isReady)
      console.log("========================")
    } else {
      console.log("Audio manager not available")
    }
  }
  
  // Auto-debug on page load (remove this in production)
  setTimeout(() => {
    if (typeof window.debugAudio === "function") {
      window.debugAudio()
    }
  }, 2000)
  