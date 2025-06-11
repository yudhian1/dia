// Import SweetAlert2
const Swal = window.Swal

// Import confetti library
const confetti = window.confetti

document.addEventListener("DOMContentLoaded", () => {
  // Play music automatically
  const song = document.querySelector(".song")
  if (song) {
    song.play().catch((e) => console.log("Audio play failed:", e))
  }

  // Create floating hearts
  createFloatingHearts()
})

// Create floating hearts in the background
function createFloatingHearts() {
  const heartSymbols = ["❤️", "💕", "💖", "💗", "💓", "💌", "💝"]

  for (let i = 0; i < 15; i++) {
    const heart = document.createElement("div")
    heart.className = "floating-heart"
    heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)]

    // Random position and animation duration
    const left = Math.random() * 100
    const animationDuration = 8 + Math.random() * 12
    const animationDelay = Math.random() * 8
    const size = 0.8 + Math.random() * 1.2

    heart.style.left = `${left}%`
    heart.style.animationDuration = `${animationDuration}s`
    heart.style.animationDelay = `${animationDelay}s`
    heart.style.fontSize = `${size}em`

    document.body.appendChild(heart)
  }
}

// Function to open letter
function openLetter(letterId) {
  const modalId = letterId === "letter1" ? "letterModal1" : "letterModal2"
  const modal = document.getElementById(modalId)

  // Add opening animation
  modal.style.display = "block"

  // Prevent body scroll when modal is open
  document.body.style.overflow = "hidden"

  // Play a subtle sound effect (optional)
  playLetterSound()
}

// Function to close letter
function closeLetter(modalId) {
  const modal = document.getElementById(modalId)

  // Add closing animation
  modal.style.animation = "modalFadeOut 0.3s ease-out"

  setTimeout(() => {
    modal.style.display = "none"
    modal.style.animation = ""
    document.body.style.overflow = "auto"
  }, 300)
}

// Function to play letter opening sound (optional)
function playLetterSound() {
  // You can add a subtle sound effect here if you have an audio file
  // const audio = new Audio('./sounds/letter-open.mp3')
  // audio.volume = 0.3
  // audio.play().catch(e => console.log('Sound play failed:', e))
}

// Function to show exit confirmation
function exitWebsite() {
  const exitModal = document.getElementById("exitModal")
  exitModal.style.display = "block"
  document.body.style.overflow = "hidden"

  // Add confetti effect
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ["#ff69b4", "#699bc8", "#8b6a60"],
  })
}

// Function to confirm exit
function confirmExit() {
  // Show final message with SweetAlert
  Swal.fire({
    title: "Sampai Jumpa! 👋",
    html: `
      <div style="text-align: center; color: #8b6a60;">
        <p style="font-size: 1.2rem; margin-bottom: 15px;">Terima kasih sudah mengunjungi website spesial ini!</p>
        <p style="font-size: 1.1rem; margin-bottom: 15px;">Semoga hari ulang tahunmu penuh kebahagiaan! 🎉</p>
        <p style="font-size: 1rem; color: #ff69b4;">💕 Selamat ulang tahun! 💕</p>
      </div>
    `,
    icon: "success",
    confirmButtonText: "Tutup Website",
    confirmButtonColor: "#ff69b4",
    allowOutsideClick: false,
    allowEscapeKey: false,
    showClass: {
      popup: "animate__animated animate__fadeInDown",
    },
    hideClass: {
      popup: "animate__animated animate__fadeOutUp",
    },
  }).then((result) => {
    if (result.isConfirmed) {
      // Try different methods to close the window/tab
      try {
        // Method 1: Close current window
        window.close()

        // Method 2: If window.close() doesn't work, redirect to a blank page
        setTimeout(() => {
          window.location.href = "about:blank"
        }, 500)

        // Method 3: If still open, show final goodbye message
        setTimeout(() => {
          document.body.innerHTML = `
            <div style="
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              height: 100vh;
              background: radial-gradient(ellipse at top left, rgba(105, 155, 200, 1) 0%, rgba(181, 197, 216, 1) 57%);
              font-family: 'Poppins', sans-serif;
              text-align: center;
              color: #8b6a60;
            ">
              <div style="
                background: rgba(255, 255, 255, 0.9);
                padding: 40px;
                border-radius: 20px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                max-width: 500px;
                margin: 20px;
              ">
                <h1 style="font-size: 3rem; margin-bottom: 20px; color: #ff69b4;">👋</h1>
                <h2 style="font-size: 2rem; margin-bottom: 20px;">Sampai Jumpa!</h2>
                <p style="font-size: 1.2rem; margin-bottom: 15px;">Website ini sudah selesai dikunjungi.</p>
                <p style="font-size: 1.1rem; margin-bottom: 20px;">Kamu bisa menutup tab ini sekarang.</p>
                <p style="font-size: 1rem; color: #ff69b4;">💕 Terima kasih! 💕</p>
                <button onclick="window.close()" style="
                  background: #ff69b4;
                  border: none;
                  border-radius: 30px;
                  color: white;
                  padding: 12px 30px;
                  font-size: 16px;
                  margin-top: 20px;
                  cursor: pointer;
                  font-family: 'Poppins', sans-serif;
                ">Tutup Tab</button>
              </div>
            </div>
          `
        }, 1000)
      } catch (error) {
        console.log("Exit method failed:", error)
      }
    }
  })

  // Close exit modal
  cancelExit()
}

// Function to cancel exit
function cancelExit() {
  const exitModal = document.getElementById("exitModal")
  exitModal.style.animation = "modalFadeOut 0.3s ease-out"

  setTimeout(() => {
    exitModal.style.display = "none"
    exitModal.style.animation = ""
    document.body.style.overflow = "auto"
  }, 300)
}

// Close modal when clicking outside of letter content
window.onclick = (event) => {
  if (event.target.classList.contains("letter-modal")) {
    const modalId = event.target.id
    closeLetter(modalId)
  }

  if (event.target.classList.contains("exit-modal")) {
    cancelExit()
  }
}

// Close modal with Escape key
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    const openModals = document.querySelectorAll('.letter-modal[style*="block"]')
    openModals.forEach((modal) => {
      closeLetter(modal.id)
    })

    const exitModal = document.getElementById("exitModal")
    if (exitModal.style.display === "block") {
      cancelExit()
    }
  }
})

// Add CSS for fade out animation
const style = document.createElement("style")
style.textContent = `
  @keyframes modalFadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
  
  .letter-envelope:hover .envelope-flap {
    transform: translateY(-5px);
    transition: transform 0.3s ease;
  }
  
  .letter-envelope:hover .click-hint {
    color: var(--primary-color);
    transform: scale(1.1);
    transition: all 0.3s ease;
  }
`
document.head.appendChild(style)
