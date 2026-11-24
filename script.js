const WORDS = {
  easy: [
    ["apple", "りんご"], ["blue", "青"], ["cat", "ねこ"], ["dream", "夢"],
    ["earth", "地球"], ["fish", "魚"], ["green", "緑"], ["happy", "幸せ"],
    ["idea", "アイデア"], ["jump", "ジャンプ"], ["light", "光"], ["moon", "月"],
    ["orange", "オレンジ"], ["play", "遊ぶ"], ["quick", "速い"], ["star", "星"],
    ["tree", "木"], ["water", "水"], ["young", "若い"], ["zebra", "シマウマ"]
  ],
  normal: [
    ["adventure", "冒険"], ["beautiful", "美しい"], ["challenge", "挑戦"], ["energy", "エネルギー"],
    ["freedom", "自由"], ["guitar", "ギター"], ["journey", "旅"], ["kindness", "優しさ"],
    ["library", "図書館"], ["mystery", "謎"], ["planet", "惑星"], ["rainbow", "虹"],
    ["summer", "夏"], ["thunder", "雷"], ["victory", "勝利"], ["wonder", "驚き"]
  ],
  hard: [
    ["extraordinary", "並外れた"], ["architecture", "建築"], ["imagination", "想像力"],
    ["environment", "環境"], ["communication", "コミュニケーション"], ["responsibility", "責任"],
    ["unbelievable", "信じられない"], ["determination", "決意"], ["concentration", "集中"],
    ["celebration", "祝賀"], ["technology", "テクノロジー"], ["possibility", "可能性"]
  ]
};

const timeEl = document.querySelector("#time");
const scoreEl = document.querySelector("#score");
const comboEl = document.querySelector("#combo");
const progressEl = document.querySelector("#progress");
const japaneseEl = document.querySelector("#japanese");
const wordEl = document.querySelector("#word");
const inputEl = document.querySelector("#typing-input");
const feedbackEl = document.querySelector("#feedback");
const startButton = document.querySelector("#start-button");
const resultDialog = document.querySelector("#result-dialog");
const againButton = document.querySelector("#again-button");

let level = "easy";
let currentWord = "";
let score = 0;
let combo = 0;
let bestCombo = 0;
let correctCount = 0;
let timeLeft = 60;
let running = false;
let timerId = null;
let usedWords = [];

function formatScore(value) {
  return String(value).padStart(4, "0");
}

function pickWord() {
  const pool = WORDS[level];
  if (usedWords.length >= pool.length) usedWords = [];
  const available = pool.filter((item) => !usedWords.includes(item[0]));
  const chosen = available[Math.floor(Math.random() * available.length)];
  usedWords.push(chosen[0]);
  currentWord = chosen[0];
  japaneseEl.textContent = chosen[1];
  renderWord("");
  inputEl.value = "";
  inputEl.focus();
}

function renderWord(typed) {
  let html = "";
  for (let i = 0; i < currentWord.length; i++) {
    const char = currentWord[i];
    if (i < typed.length) {
      html += typed[i] === char
        ? `<span class="matched">${char}</span>`
        : `<span class="wrong">${char}</span>`;
    } else {
      html += char;
    }
  }
  wordEl.innerHTML = html;
}

function startGame() {
  clearInterval(timerId);
  level = document.querySelector(".level.active").dataset.level;
  score = 0;
  combo = 0;
  bestCombo = 0;
  correctCount = 0;
  timeLeft = 60;
  running = true;
  usedWords = [];
  scoreEl.textContent = "0000";
  comboEl.textContent = "0";
  timeEl.textContent = "60";
  progressEl.style.width = "100%";
  feedbackEl.textContent = "";
  inputEl.disabled = false;
  startButton.querySelector("span:first-child").textContent = "RESTART";
  pickWord();

  timerId = setInterval(() => {
    timeLeft--;
    timeEl.textContent = String(timeLeft).padStart(2, "0");
    progressEl.style.width = `${(timeLeft / 60) * 100}%`;
    if (timeLeft <= 0) endGame();
  }, 1000);
}

function endGame() {
  running = false;
  clearInterval(timerId);
  inputEl.disabled = true;
  document.querySelector("#final-score").textContent = score;
  document.querySelector("#correct-count").textContent = correctCount;
  document.querySelector("#best-combo").textContent = bestCombo;
  if (typeof resultDialog.showModal === "function") resultDialog.showModal();
}

inputEl.addEventListener("input", () => {
  if (!running) return;
  const typed = inputEl.value.toLowerCase();
  renderWord(typed);

  if (typed === currentWord) {
    combo++;
    correctCount++;
    bestCombo = Math.max(bestCombo, combo);
    const bonus = combo >= 10 ? 30 : combo >= 5 ? 20 : 10;
    const base = level === "easy" ? 100 : level === "normal" ? 150 : 220;
    score += base + bonus;
    scoreEl.textContent = formatScore(score);
    comboEl.textContent = String(combo);
    feedbackEl.textContent = combo > 1 ? `NICE! ${combo} COMBO` : "NICE!";
    setTimeout(pickWord, 150);
  } else if (!currentWord.startsWith(typed) && typed.length > 0) {
    combo = 0;
    comboEl.textContent = "0";
    feedbackEl.textContent = "MISS";
  }
});

document.querySelectorAll(".level").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".level").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    level = button.dataset.level;
  });
});

startButton.addEventListener("click", startGame);
againButton.addEventListener("click", () => {
  resultDialog.close();
  startGame();
});

pickWord();
inputEl.disabled = true;
