// 🎧 SOUNDS
const introSound = new Audio("sounds/intro.mp3");
const btnSound = new Audio("sounds/button.mp3");

// ▶️ PLAY INTRO SOUND
window.addEventListener("load", () => {
    introSound.volume = 0.4;
    introSound.play().catch(() => {});
});

// 🎯 ELEMENTS
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const noAnim = document.getElementById("noAnim");
const heartsContainer = document.querySelector(".hearts");

// ❌ NO BUTTON ESCAPE
noBtn.onclick = () => {
    btnSound.currentTime = 0;
    btnSound.play();

    noAnim.style.opacity = "1";
    noAnim.innerText = "bby pleaseee say yes 😭💗";

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

// 🎂 COUNTDOWN FUNCTION (NOW CONTROLLED)
function startCountdown() {
    const countdownEl = document.getElementById("countdown");
    const targetDate = new Date("April 3, 2026 00:00:00").getTime();

    setInterval(() => {
        const now = new Date().getTime();
        const diff = targetDate - now;

        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / (1000 * 60)) % 60);
        const s = Math.floor((diff / 1000) % 60);

        if (countdownEl) {
            countdownEl.innerHTML = `${d} : ${h} : ${m} : ${s}`;
        }
    }, 1000);
}

// ✅ YES BUTTON → LOADING → COUNTDOWN
yesBtn.onclick = () => {
    btnSound.currentTime = 0;
    btnSound.play();

    document.getElementById("welcomePage").style.display = "none";
    document.getElementById("loadingPage").style.display = "flex";

    startTyping(); // 💖 start typing text

    // 🎧 fade music slowly
    let fade = setInterval(() => {
        if (introSound.volume > 0.1) {
            introSound.volume -= 0.02;
        }
    }, 200);

    // ⏳ suspense delay
    setTimeout(() => {
        clearInterval(fade);

        document.getElementById("loadingPage").style.display = "none";
        document.getElementById("countdownPage").style.display = "flex";

        startCountdown(); // 🎂 start ONLY after page shows
    }, 6500);
};

// 💗 HEART FLOATING
setInterval(() => {
    let heart = document.createElement("div");
    heart.innerHTML = "💗";
    heart.style.position = "absolute";
    heart.style.left = Math.random() * 100 + "%";
    heart.style.fontSize = (Math.random() * 25 + 15) + "px";
    heart.style.animation = "floatUp 4s linear forwards";
    heartsContainer.appendChild(heart);

    setTimeout(() => heart.remove(), 4000);
}, 600);