const canvas = document.getElementById("confettiCanvas");
const ctx = canvas.getContext("2d");
const audio = document.getElementById("birthdayAudio");
const flame = document.getElementById("flame");
const statusLabel = document.getElementById("statusLabel");
const mainStage = document.getElementById("mainStage");
const giftStage = document.getElementById("giftStage");
const wishCard = document.getElementById("wishCard");

let W = window.innerWidth, H = window.innerHeight;
canvas.width = W; canvas.height = H;

let particles = [];
let partyRunning = false;

// 1. Listen for first click to start mic
window.addEventListener('click', () => {
    if(!partyRunning) {
        statusLabel.innerText = "Mic Active! Blow the candle! 🌬️";
        initMic();
    }
}, {once: true});

// 2. Microphone Detection
async function initMic() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        function checkVolume() {
            if(partyRunning) return;
            analyser.getByteFrequencyData(dataArray);
            let avg = dataArray.reduce((a, b) => a + b) / dataArray.length;
            if(avg > 45) extinguish();
            else requestAnimationFrame(checkVolume);
        }
        checkVolume();
    } catch (err) {
        statusLabel.innerText = "Mic blocked? Tap the flame!";
        flame.onclick = extinguish;
    }
}

function extinguish() {
    partyRunning = true;
    flame.style.display = "none";
    statusLabel.innerText = "YAY! HAPPY BIRTHDAY! 🎉";
    audio.play();
    startConfetti();
}

// 3. Transition to Gift
audio.onended = () => {
    mainStage.style.opacity = "0";
    setTimeout(() => {
        mainStage.classList.add("hidden");
        giftStage.classList.remove("hidden");
        giftStage.style.opacity = "1";
    }, 1000);
};

// 4. Open Gift
document.getElementById("giftBox").onclick = function() {
    this.querySelector(".lid").style.transform = "translateY(-200px) rotate(45deg)";
    this.querySelector(".lid").style.opacity = "0";
    setTimeout(() => { wishCard.classList.add("active"); }, 500);
};

// --- Confetti Engine ---
function startConfetti() {
    for(let i=0; i<150; i++) {
        particles.push({
            x: Math.random()*W, y: -20,
            s: Math.random()*10+5, v: Math.random()*8+6,
            c: `hsl(${Math.random()*360}, 100%, 60%)`
        });
    }
    function render() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => {
            p.y += p.v;
            ctx.fillStyle = p.c;
            ctx.fillRect(p.x, p.y, p.s, p.s/2);
            if(p.y > H) p.y = -20;
        });
        if(partyRunning) requestAnimationFrame(render);
    }
    render();
}

window.addEventListener("resize", () => {
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W; canvas.height = H;
});
let balloons = [];
const balloonColors = ["#FF5E5E", "#FFD93D", "#6BCB77", "#4D96FF", "#F473B9"];

class Balloon {
    constructor() {
        this.reset();
        this.y = H + Math.random() * H; // Start below the screen
    }

    reset() {
        this.x = Math.random() * W;
        this.y = H + 100; 
        this.size = Math.random() * 30 + 50; // Balloon width
        this.color = balloonColors[Math.floor(Math.random() * balloonColors.length)];
        this.speed = Math.random() * 2 + 1; // Speed going UP
        this.swing = Math.random() * 2; // Side to side movement
        this.swingSpeed = Math.random() * 0.02;
        this.t = 0;
    }

    update() {
        this.y -= this.speed; // Move Up
        this.t += this.swingSpeed;
        this.x += Math.sin(this.t) * this.swing;
        if (this.y < -150) this.reset();
    }

    draw() {
        // Balloon String
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + this.size);
        ctx.lineTo(this.x, this.y + this.size + 40);
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Balloon Body
        ctx.beginPath();
        ctx.ellipse(this.x, this.y, this.size / 1.2, this.size, 0, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();

        // Shine on balloon
        ctx.beginPath();
        ctx.ellipse(this.x - this.size/3, this.y - this.size/2, this.size/5, this.size/3, 0.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.fill();
    }
}

// Update the loop function in your startCelebration
function startCelebration() {
    partyRunning = true;
    flame.style.display = "none";
    statusLabel.innerText = "YAY! HAPPY BIRTHDAY! 🎉";
    audio.play();

    // Init both Confetti and Balloons
    for(let i=0; i<100; i++) particles.push({
        x: Math.random()*W, y: -20,
        s: Math.random()*10+5, v: Math.random()*8+6,
        c: `hsl(${Math.random()*360}, 100%, 60%)`
    });
    
    for(let i=0; i<15; i++) balloons.push(new Balloon());

    function render() {
        ctx.clearRect(0, 0, W, H);
        
        // Render Confetti (Falling Down)
        particles.forEach(p => {
            p.y += p.v;
            ctx.fillStyle = p.c;
            ctx.fillRect(p.x, p.y, p.s, p.s/2);
            if(p.y > H) p.y = -20;
        });

        // Render Balloons (Floating Up)
        balloons.forEach(b => {
            b.update();
            b.draw();
        });

        if(partyRunning) requestAnimationFrame(render);
    }
    render();
}