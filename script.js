// 🎧 WEB AUDIO — zero delay, no files needed!
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playPop() {
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.connect(g); g.connect(audioCtx.destination);
    o.type = "sine";
    o.frequency.setValueAtTime(600, audioCtx.currentTime);
    o.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.12);
    g.gain.setValueAtTime(0.4, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
    o.start(); o.stop(audioCtx.currentTime + 0.15);
}

function playChime() {
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
        const o = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        o.connect(g); g.connect(audioCtx.destination);
        o.type = "sine";
        o.frequency.value = freq;
        const t = audioCtx.currentTime + i * 0.1;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.3, t + 0.05);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
        o.start(t); o.stop(t + 0.5);
    });
}

function playIntro() {
    const melody = [523, 587, 659, 698, 784];
    melody.forEach((freq, i) => {
        const o = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        o.connect(g); g.connect(audioCtx.destination);
        o.type = "sine";
        o.frequency.value = freq;
        const t = audioCtx.currentTime + i * 0.3;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.15, t + 0.1);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
        o.start(t); o.stop(t + 0.5);
    });
}

// ▶️ PLAY INTRO ON FIRST CLICK
let introPlayed = false;
document.body.addEventListener("click", () => {
    if (audioCtx.state === "suspended") audioCtx.resume();
    if (!introPlayed) { playIntro(); introPlayed = true; }
});

// 🎯 ELEMENTS
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const noAnim = document.getElementById("noAnim");
const heartsContainer = document.querySelector(".hearts");

// ❌ NO BUTTON ESCAPE
const noPhrases = [
    "bby pleaseee say yes 😭💗",
    "NOOO come back!! 😤💕",
    "I made this with love... 🥺",
    "okayy fiineee... jk PLEASE 😂❤️",
    "one more try!! 👉👈✨"
];
let noCount = 0;

noBtn.onclick = () => {
    playPop();
    noAnim.style.opacity = "1";
    noAnim.innerText = noPhrases[noCount % noPhrases.length];
    noCount++;
    noBtn.style.transform =
        `translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px)`;
};

// 💖 TYPING EFFECT
function startTyping() {
    const text = "I promise, bby… the surprise will make you smile";
    const typingEl = document.getElementById("typingText");
    let i = 0;
    typingEl.innerHTML = "";
    const interval = setInterval(() => {
        if (i < text.length) {
            typingEl.innerHTML += text.charAt(i);
            i++;
        } else {
            clearInterval(interval);
        }
    }, 40);
}

// 🎂 COUNTDOWN
function startCountdown() {
    const targetDate = new Date("April 3, 2026 00:00:00").getTime();

    function pad(n) { return String(n).padStart(2, "0"); }

    function animateUnit(id, val) {
        const el = document.getElementById(id);
        if (!el) return;
        if (el.textContent !== val) {
            el.classList.remove("cd-flip");
            void el.offsetWidth;
            el.classList.add("cd-flip");
            el.textContent = val;
            setTimeout(() => el.classList.remove("cd-flip"), 300);
        }
    }

    setInterval(() => {
        const diff = targetDate - Date.now();
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / (1000 * 60)) % 60);
        const s = Math.floor((diff / 1000) % 60);

        animateUnit("cd-days",  pad(d));
        animateUnit("cd-hours", pad(h));
        animateUnit("cd-mins",  pad(m));
        animateUnit("cd-secs",  pad(s));
    }, 1000);
}

// ✅ YES BUTTON
yesBtn.onclick = () => {
    playChime();
    burstConfetti();

    pageTransition("welcomePage", "loadingPage", () => { startTyping(); });

    setTimeout(() => {
        pageTransition("loadingPage", "countdownPage", () => {
            startCountdown();
            burstConfetti();

            const btn = document.createElement("button");
            btn.innerText = "See our memories 📸";
            btn.style.cssText = `
                margin-top: 20px;
                padding: 12px 28px;
                font-size: 16px;
                border-radius: 30px;
                background: linear-gradient(135deg, #f093b0, #d36b8f);
                color: white;
                border: none;
                cursor: pointer;
                font-family: Poppins, sans-serif;
                font-weight: 700;
                box-shadow: 0 6px 20px rgba(211,107,143,0.4);
            `;
            btn.onclick = () => {
                playChime();
                pageTransition("countdownPage", "galleryPage");
            };
            document.querySelector(".countdown-box").appendChild(btn);
        });
    }, 6500);
};

// 💗 HEART FLOATING
setInterval(() => {
    let heart = document.createElement("div");
    heart.innerHTML = ["💗","💕","💖","💓","🩷","💝","❤️","🌸"][Math.floor(Math.random()*8)];
    heart.style.position = "absolute";
    heart.style.left = Math.random() * 100 + "%";
    heart.style.fontSize = (Math.random() * 25 + 15) + "px";
    heart.style.animation = "floatUp 4s linear forwards";
    heart.style.filter = "drop-shadow(0 0 4px rgba(211,107,143,0.4))";
    heartsContainer.appendChild(heart);
    setTimeout(() => heart.remove(), 4000);
}, 600);

// 🔄 PAGE TRANSITIONS
function pageTransition(fromId, toId, callback) {
    const from = document.getElementById(fromId);
    const to   = document.getElementById(toId);
    from.classList.add("page-exit");
    setTimeout(() => {
        from.style.display = "none";
        from.classList.remove("page-exit");
        to.style.display = "flex";
        to.classList.add("page-enter");
        setTimeout(() => {
            to.classList.remove("page-enter");
            if (callback) callback();
        }, 600);
    }, 450);
}

// ✨ SPARKLES
const sparkleChars = ["✨","⭐","🌟","💫","✦","★","🩷"];
setInterval(() => {
    const layer = document.getElementById("sparkleLayer");
    if (!layer) return;
    const el = document.createElement("div");
    el.className = "sparkle";
    el.textContent = sparkleChars[Math.floor(Math.random() * sparkleChars.length)];
    el.style.left = Math.random() * 100 + "%";
    el.style.top  = Math.random() * 90  + "%";
    el.style.fontSize = (Math.random() * 16 + 8) + "px";
    el.style.animationDuration = (Math.random() * 1.5 + 1.5) + "s";
    layer.appendChild(el);
    setTimeout(() => el.remove(), 2500);
}, 380);

// 🎉 CONFETTI
function burstConfetti() {
    const canvas = document.getElementById("confettiCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    const colors = ["#f093b0","#d36b8f","#fce8f0","#ffb3cb","#fff0a0","#b5f0d8","#f9c74f"];
    const pieces = Array.from({length: 160}, () => ({
        x: canvas.width/2, y: canvas.height*0.45,
        vx: (Math.random()-0.5)*18, vy: (Math.random()-1.2)*14,
        color: colors[Math.floor(Math.random()*colors.length)],
        w: Math.random()*10+5, h: Math.random()*5+3,
        angle: Math.random()*Math.PI*2, spin: (Math.random()-0.5)*0.3,
        gravity: 0.45, alpha: 1
    }));
    let frame;
    (function draw() {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        let alive = false;
        for (const p of pieces) {
            p.vy += p.gravity; p.x += p.vx; p.y += p.vy;
            p.angle += p.spin; p.alpha -= 0.013;
            if (p.alpha > 0) {
                alive = true;
                ctx.save();
                ctx.globalAlpha = Math.max(0, p.alpha);
                ctx.translate(p.x, p.y); ctx.rotate(p.angle);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
                ctx.restore();
            }
        }
        if (alive) frame = requestAnimationFrame(draw);
        else ctx.clearRect(0,0,canvas.width,canvas.height);
    })();
}
