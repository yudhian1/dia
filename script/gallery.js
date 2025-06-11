// Use Swal from window object (loaded from CDN)
const Swal = window.Swal

// Set animation delay for each gallery item
document.addEventListener("DOMContentLoaded", () => {
  const galleryItems = document.querySelectorAll(".gallery-item")

  console.log("Gallery items found:", galleryItems.length)

  galleryItems.forEach((item, index) => {
    item.style.setProperty("--i", index)

    // Set random rotation for polaroid effect
    const rotation = Math.random() * 6 - 3 // Random between -3 and 3 degrees
    const polaroid = item.querySelector(".polaroid")
    polaroid.style.setProperty("--rotation", `${rotation}deg`)

    // Set initial transform with the rotation
    polaroid.style.transform = `rotate(${rotation}deg)`

    // Add hover effect for photos and videos
    item.addEventListener("mouseenter", () => {
      polaroid.style.transform = `rotate(0deg) scale(1.05)`
      polaroid.style.transition = "transform 0.3s ease"
      polaroid.style.zIndex = "10"
      polaroid.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.3)"
    })

    item.addEventListener("mouseleave", () => {
      polaroid.style.transform = `rotate(${rotation}deg) scale(1)`
      polaroid.style.transition = "transform 0.3s ease"
      polaroid.style.zIndex = "1"
      polaroid.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.2)"
    })

    // Simple click effect for photos (no modal)
    if (item.getAttribute("data-type") === "photo") {
      item.addEventListener("click", (e) => {
        e.preventDefault()
        // Just a subtle click animation
        polaroid.style.transform = `rotate(0deg) scale(0.95)`
        setTimeout(() => {
          polaroid.style.transform = `rotate(${rotation}deg) scale(1)`
        }, 150)
      })
    }
  })

  // Setup video functionality
  setupVideoControls()

  // Play music automatically without confirmation
  const song = document.querySelector(".song")
  if (song) {
    song.play().catch((e) => console.log("Audio play failed:", e))
  }
})

function setupVideoControls() {
  // Setup play buttons
  document.querySelectorAll(".play-button").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation()
      e.preventDefault()

      console.log("Play button clicked")

      const videoContainer = button.closest(".video-container")
      const video = videoContainer.querySelector("video")

      if (!video) {
        console.error("Video element not found")
        return
      }

      // Ensure video has audio enabled
      video.muted = false
      video.volume = 0.8 // Set volume to 80%

      // Pause all other videos first
      pauseAllVideos()

      // Toggle play/pause for this video
      if (video.paused) {
        playVideo(video, button)
      } else {
        pauseVideo(video, button)
      }
    })
  })

  // Setup video click functionality
  document.querySelectorAll(".video-container video").forEach((video) => {
    const button = video.parentElement.querySelector(".play-button")

    // Ensure video is not muted by default
    video.muted = false
    video.volume = 0.8

    // Click on video to play/pause
    video.addEventListener("click", (e) => {
      e.stopPropagation()

      // Ensure audio is enabled when clicking
      video.muted = false

      if (video.paused) {
        playVideo(video, button)
      } else {
        pauseVideo(video, button)
      }
    })

    // Video event listeners
    video.addEventListener("play", () => {
      if (button) button.style.opacity = "0"
      console.log("Video started playing with audio")
    })

    video.addEventListener("pause", () => {
      if (button) button.style.opacity = "1"
      console.log("Video paused")
    })

    video.addEventListener("ended", () => {
      if (button) button.style.opacity = "1"
      console.log("Video ended")
    })

    // Error handling
    video.addEventListener("error", (e) => {
      console.error("Video error:", e)
      if (button) {
        button.innerHTML = "❌"
        button.title = "Video tidak dapat dimuat"
        button.style.opacity = "1"
      }
    })

    // Loading states
    video.addEventListener("loadstart", () => {
      console.log("Video loading started")
      if (button) {
        button.innerHTML = "⏳"
        button.title = "Loading video..."
      }
    })

    video.addEventListener("canplay", () => {
      console.log("Video can play")
      if (button) {
        button.innerHTML = "▶"
        button.title = "Play video"
      }
    })

    video.addEventListener("loadeddata", () => {
      console.log("Video data loaded")
    })
  })
}

function playVideo(video, button) {
  console.log("Attempting to play video with audio")

  // Pause all other videos first
  pauseAllVideos()

  // Ensure audio is enabled
  video.muted = false
  video.volume = 0.8

  video
    .play()
    .then(() => {
      console.log("Video play successful with audio enabled")
      if (button) button.style.opacity = "0"
    })
    .catch((error) => {
      console.error("Video play failed:", error)
      if (button) {
        button.innerHTML = "❌"
        button.title = "Video tidak dapat diputar"
      }
    })
}

function pauseVideo(video, button) {
  console.log("Pausing video")
  video.pause()
  if (button) button.style.opacity = "1"
}

function pauseAllVideos() {
  document.querySelectorAll(".video-container video").forEach((v) => {
    if (!v.paused) {
      v.pause()
      const otherButton = v.parentElement.querySelector(".play-button")
      if (otherButton) otherButton.style.opacity = "1"
    }
  })
}

// Add CSS for enhanced styling
const style = document.createElement("style")
style.textContent = `
  .gallery-item {
    transition: transform 0.3s ease;
    opacity: 1 !important;
    visibility: visible !important;
  }
  
  .gallery-item:hover {
    transform: translateY(-5px) !important;
  }

  /* Video container styling */
  .video-container {
    position: relative;
    cursor: pointer;
    background: #f0f0f0;
  }

  .video-container video {
    cursor: pointer;
    transition: all 0.3s ease;
    width: 100%;
    height: 100%;
    object-fit: cover;
    background: #000;
  }

  .video-container:hover video {
    transform: scale(1.02);
  }

  /* Play button styling */
  .play-button {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60px;
    height: 60px;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: #8b6a60;
    transition: all 0.3s ease;
    cursor: pointer;
    z-index: 10;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(5px);
    border: none;
    outline: none;
    pointer-events: auto;
  }

  .play-button:hover {
    transform: translate(-50%, -50%) scale(1.2);
    background-color: rgba(255, 255, 255, 1);
  }

  .play-button:active {
    transform: translate(-50%, -50%) scale(1.1);
  }

  /* Photo click effect */
  .gallery-item[data-type="photo"] {
    cursor: pointer;
  }

  .gallery-item[data-type="photo"]:active .polaroid {
    transform: scale(0.98) !important;
  }

  /* Enhanced polaroid styling */
  .polaroid {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .polaroid:hover {
    transform: rotate(0deg) scale(1.05) !important;
  }

  /* Make sure all content is visible */
  .gallery {
    opacity: 1 !important;
    visibility: visible !important;
  }

  .image-container img, 
  .video-container video {
    opacity: 1 !important;
    visibility: visible !important;
  }

  /* Video loading states */
  .video-container video[poster] {
    background-size: cover;
    background-position: center;
  }
`
document.head.appendChild(style)
