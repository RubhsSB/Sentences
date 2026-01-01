// =======================
// Lista de palabras
// =======================
const words = [
  "NICO (Led giro atrás en 5)", "NICO (Led giro en 1 con camb de mano)", "SUZIE Q 1", "MAMBO", "ATRÁS", "LATERAL", "NICO (Doble giro Fol + Giro Led en 5)", "NICO (Rompe giro Foll con brazo)", "Deyfron (Cross + Doble Giro Fol)", 
  "NICO (Led Frame giro FOL en 5 con mano IZQ)", "NICO (Led Frame giro FOL en 5 con mano DCH - mano abajo)", "NICO (Led preparo giro Fol en 5 + Giro led en 6)", "NICO (Led tiro mano IZQ en 1 atrás Fol y me pongo a su Izq)", "GIRA Fol en 5 + Gira Lead en 1)", 
  "Deyfron (Cross 2 manos + sombra + Lid gira por delante)", "NICO (Led giro en 1 + lanzo en 5 + pongo lado Derch Foll)", "Billy Roy Cross + Rompe", "Billy Roy Cross + Sombra Led", "Cross SuperX", "Excalibur", "NICO (Cross con Giro)", 
  "NICO (Led Frame giro FOL en 5 con mano DCH - giro yo mano cintura)", "Escucha la música", "Escucha la música", "Escucha la música", "Escucha la música", "Illusion", "Illusion", 
  "NICO (Giro Follow en 5 + Giro Leader cambiando de mano y Piso Pico Piso Pico + Giro Follo y Piso Pico Piso Pico)", "70´", "NICO (Abro para 360º)"
];

// =======================
// Variables y elementos
// =======================
let currentWord = "";
let startTime = 0;
let totalTime = 0;
let wordCount = 0;
let timerInterval;
let recentWords = [];

const wordElement = document.getElementById("word");
const playButton = document.getElementById("play");
const nextButton = document.getElementById("next");
const finishButton = document.getElementById("finish");
const resultElement = document.getElementById("result");
const counterElement = document.getElementById("counter");
const timerElement = document.getElementById("timer");

// =======================
// Funciones
// =======================
function getRandomWord() {
  let availableWords = words.filter(w => !recentWords.includes(w));

  if (availableWords.length === 0) {
    // Si ya usamos casi todas, reiniciamos la memoria
    recentWords = [];
    availableWords = [...words];
  }

  const word = availableWords[Math.floor(Math.random() * availableWords.length)];

  // Guardamos en la lista de recientes (máximo 5)
  recentWords.push(word);
  if (recentWords.length > 5) recentWords.shift();

  return word;
}

function formatWordDisplay(word) {
  const match = word.match(/^(.*?)\s*(\([^)]+\))?$/);
  const main = match[1];
  const par = match[2] || "";
  return `<span class="main-text">${main.trim()}</span>${par ? `<br><span class="parenthesis">${par}</span>` : ""}`;
}

function startTimer() {
  timerInterval = setInterval(() => {
    const currentTime = ((Date.now() - startTime) / 1000).toFixed(1);
    timerElement.textContent = `Tiempo: ${currentTime} segundos`;
  }, 100);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function saveHighScore(averageTime, wordCount) {
  const key = "hardHighScores";
  let scores = JSON.parse(localStorage.getItem(key)) || [];
  scores.push({ averageTime, wordCount });
  scores.sort((a, b) => a.averageTime - b.averageTime);
  localStorage.setItem(key, JSON.stringify(scores.slice(0, 10)));
}

// =======================
// Botón PLAY
// =======================
playButton.addEventListener("click", () => {
  currentWord = getRandomWord();
  wordElement.innerHTML = formatWordDisplay(currentWord);
  startTime = Date.now();
  wordCount = 0;
  totalTime = 0;
  counterElement.textContent = `Palabras jugadas: ${wordCount}`;
  timerElement.textContent = `Tiempo: 0 segundos`;

  playButton.disabled = true;
  playButton.style.display = "none";
  nextButton.disabled = false;
  nextButton.style.display = "inline-block";
  finishButton.disabled = false;
  finishButton.style.display = "inline-block";

  startTimer();
});

// =======================
// Botón SIGUIENTE
// =======================
nextButton.addEventListener("click", () => {
  const endTime = Date.now();
  totalTime += (endTime - startTime) / 1000;
  wordCount++;
  counterElement.textContent = `Palabras jugadas: ${wordCount}`;
  stopTimer();
  currentWord = getRandomWord();
  wordElement.innerHTML = formatWordDisplay(currentWord);
  startTime = Date.now();
  startTimer();
});

// =======================
// Botón FINALIZAR
// =======================
finishButton.addEventListener("click", () => {
  stopTimer();
  if (wordCount > 0) {
    const averageTime = totalTime / wordCount;
    resultElement.textContent = `Promedio: ${averageTime.toFixed(2)} segundos por palabra.`;
    saveHighScore(averageTime, wordCount);
  } else {
    resultElement.textContent = "No has jugado todavía.";
  }

  playButton.disabled = false;
  playButton.style.display = "inline-block";
  nextButton.disabled = true;
  nextButton.style.display = "none";
  finishButton.disabled = true;
  finishButton.style.display = "none";

  wordElement.textContent = "Presiona 'Play' para comenzar de nuevo.";
  counterElement.textContent = `Palabras jugadas: 0`;
  timerElement.textContent = `Tiempo: 0 segundos`;
});

// =======================
// Swipe en móviles
// =======================
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener("touchstart", e => {
  touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener("touchend", e => {
  touchEndX = e.changedTouches[0].screenX;
  if (touchEndX < touchStartX - 50 && !nextButton.disabled) {
    nextButton.click();
  }
});

// =======================
// Service Worker (PWA)
// =======================
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(reg => console.log("✅ Service Worker registrado:", reg.scope))
    .catch(err => console.warn("❌ Error al registrar el Service Worker:", err));
}
