// Elements
const animateBtn = document.getElementById("animateBtn");
const box = document.getElementById("box");
const prefsForm = document.getElementById("prefsForm");
const usernameInput = document.getElementById("username");
const greeting = document.getElementById("greeting");
const themeToggle = document.getElementById("themeToggle");
const body = document.body;
const confettiCanvas = document.getElementById("confettiCanvas");
const ctx = confettiCanvas.getContext("2d");

// Resize confetti canvas to fill screen
function resizeCanvas() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// --- Theme toggle with localStorage ---
themeToggle.addEventListener("click", () => {
  body.classList.toggle("dark");
  const isDark = body.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

function loadTheme() {
  const theme = localStorage.getItem("theme");
  if (theme === "dark") {
    body.classList.add("dark");
  }
}
loadTheme();

// --- Animate box on button click ---
animateBtn.addEventListener("click", () => {
  box.classList.remove("animate");  // reset animation
  void box.offsetWidth;             // trigger reflow
  box.classList.add("animate");
});

// --- localStorage username and greeting ---
prefsForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = usernameInput.value.trim();
  if (name) {
    localStorage.setItem("username", name);
    showGreeting(name);
    launchConfetti();
    prefsForm.reset();
  }
});

function showGreeting(name) {
  greeting.textContent = `Hello, ${name}! Welcome back! 🎉`;
}

function loadUsername() {
  const savedName = localStorage.getItem("username");
  if (savedName) {
    showGreeting(savedName);
  }
}
loadUsername();

// --- Confetti animation ---
const confettiParticles = [];
const colors = ["#23ff82", "#1485d4", "#ff4e50", "#f9d423", "#fc913a"];

class ConfettiParticle {
  constructor() {
    this.x = Math.random() * confettiCanvas.width;
    this.y = Math.random() * -confettiCanvas.height;
    this.size = 7 + Math.random() * 8;
    this.speedY = 2 + Math.random() * 3;
    this.speedX = (Math.random() - 0.5) * 4;
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.rotation = Math.random() * 360;
    this.rotationSpeed = (Math.random() - 0.5) * 10;
  }

  update() {
    this.y += this.speedY;
    this.x += this.speedX;
    this.rotation += this.rotationSpeed;

    if (this.y > confettiCanvas.height) {
      this.y = -10;
      this.x = Math.random() * confettiCanvas.width;
    }
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation * Math.PI / 180);
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    ctx.restore();
  }
}

function launchConfetti() {
  for (let i = 0; i < 150; i++) {
    confettiParticles.push(new ConfettiParticle());
  }
  if (!confettiRunning) {
    confettiRunning = true;
    requestAnimationFrame(confettiLoop);
  }
}

let confettiRunning = false;

function confettiLoop() {
  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  confettiParticles.forEach((p, index) => {
    p.update();
    p.draw();
   
    if (p.y > confettiCanvas.height + 20) {
      confettiParticles.splice(index, 1);
    }
  });

  if (confettiParticles.length > 0) {
    requestAnimationFrame(confettiLoop);
  } else {
    confettiRunning = false;
  }
}
