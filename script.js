const weddingDate = new Date("2027-01-23T15:00:00+08:00"); // 3:00 PM Philippine time; edit if the couple confirms another time.
const envelopeScreen = document.getElementById("envelopeScreen");
const invitationContent = document.getElementById("invitationContent");
const openButton = document.getElementById("openInvitation");
const audio = document.getElementById("backgroundMusic");
const musicToggle = document.getElementById("musicToggle");
const musicLabel = document.querySelector(".music-label");

openButton.addEventListener("click", () => {
  envelopeScreen.classList.add("opening");
  invitationContent.classList.add("visible");
  invitationContent.setAttribute("aria-hidden", "false");
  window.setTimeout(() => {
    envelopeScreen.classList.add("hide");
    document.getElementById("home").scrollIntoView({ behavior: "smooth", block: "start" });
  }, 1050);
  // Browsers require a user gesture before audio can start. Music remains controllable.
  audio.play().then(() => setMusicState(true)).catch(() => setMusicState(false));
});

function setMusicState(isPlaying) {
  musicToggle.classList.toggle("playing", isPlaying);
  musicToggle.setAttribute("aria-pressed", String(isPlaying));
  musicToggle.setAttribute("aria-label", isPlaying ? "Pause background melody" : "Play background melody");
  musicLabel.textContent = isPlaying ? "Pause melody" : "Play melody";
}

musicToggle.addEventListener("click", async () => {
  if (audio.paused) {
    try {
      await audio.play();
      setMusicState(true);
    } catch (error) {
      setMusicState(false);
      alert("The melody could not play. Please check that the music file is included in the project folder.");
    }
  } else {
    audio.pause();
    setMusicState(false);
  }
});

function updateCountdown() {
  const now = new Date();
  const remaining = weddingDate.getTime() - now.getTime();
  const message = document.getElementById("countdownMessage");

  if (remaining <= 0) {
    ["days", "hours", "minutes", "seconds"].forEach(id => {
      document.getElementById(id).textContent = "0";
    });
    message.textContent = now.toDateString() === weddingDate.toDateString()
      ? "Today is the day! Let the celebration begin."
      : "Thank you for celebrating Erma & Rod's beautiful beginning.";
    return;
  }

  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((remaining / (1000 * 60)) % 60);
  const seconds = Math.floor((remaining / 1000) % 60);

  document.getElementById("days").textContent = String(days).padStart(3, "0");
  document.getElementById("hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
  document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
}
updateCountdown();
window.setInterval(updateCountdown, 1000);

// Static-only RSVP demo: prepares an email instead of pretending to save entries online.
document.getElementById("rsvpForm").addEventListener("submit", event => {
  event.preventDefault();
  const form = event.currentTarget;
  const name = document.getElementById("guestName").value.trim();
  const attendance = document.getElementById("attendance").value;
  const note = document.getElementById("guestMessage").value.trim();

  if (!name || !attendance) return;
  const subject = encodeURIComponent("Wedding RSVP — Erma & Rod");
  const body = encodeURIComponent(
    `Wedding RSVP for Erma & Rod\nGuest: ${name}\nResponse: ${attendance}\nMessage: ${note || "None"}`
  );
  document.getElementById("formSuccess").hidden = false;
  document.getElementById("formSuccess").textContent =
    "Your RSVP email is ready. If your email app did not open, please contact the couple directly.";
  // Replace this placeholder with the couple's confirmed RSVP email before publishing.
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
});
