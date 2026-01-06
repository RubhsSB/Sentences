// =======================
// Lista de frases
// =======================
const words = [
  "Si no te activas, si no haces algo, la probabilidad es 0",
  "«El que se guarda un elogio se queda con algo ajeno» Pablo Picasso",
  "No nos enamoramos de quién nos baja la luna, si no de quién quiere ir a la luna",
  "Una relación de calidad sobrevive a la verdad"
];

// =======================
// Elementos del DOM
// =======================
const wordElement = document.getElementById("word");
const nextButton = document.getElementById("next");
const favoriteButton = document.getElementById("favorite");
const favoritesCount = document.getElementById("favorites-count");

// =======================
// Estado
// =======================
let currentWord = "";

// =======================
// Mostrar frase (aleatoria, puede repetirse)
// =======================
function getRandomWord() {
  const idx = Math.floor(Math.random() * words.length);
  return words[idx];
}

// Si hay un texto entre paréntesis al final, lo baja a otra línea
function formatWordDisplay(word) {
  const match = word.match(/^(.*?)\s*(\([^)]+\))?$/);
  const main = (match && match[1]) ? match[1] : word;
  const par = (match && match[2]) ? match[2] : "";
  return `<span class="main-text">${main.trim()}</span>${par ? `<br><span class="parenthesis">${par}</span>` : ""}`;
}

function applyLongClass(word) {
  const LONG_LIMIT = 80; // si quieres, cambia este número
  if (word.length > LONG_LIMIT) wordElement.classList.add("long");
  else wordElement.classList.remove("long");
}

function showNewWord() {
  currentWord = getRandomWord();
  wordElement.innerHTML = formatWordDisplay(currentWord);
  applyLongClass(currentWord);
  updateFavoriteUI();
}

// =======================
// Favoritas (se guardan en el móvil con localStorage)
// =======================
function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites")) || [];
}

function setFavorites(list) {
  localStorage.setItem("favorites", JSON.stringify(list));
}

function isFavorite(word) {
  return getFavorites().includes(word);
}

function toggleFavorite() {
  if (!currentWord) return;

  const favs = getFavorites();
  const idx = favs.indexOf(currentWord);

  if (idx === -1) favs.push(currentWord);
  else favs.splice(idx, 1);

  setFavorites(favs);
  updateFavoriteUI();
}

function updateFavoriteUI() {
  const favs = getFavorites();
  favoritesCount.textContent = `Favoritas guardadas: ${favs.length}`;

  if (!currentWord) return;

  if (isFavorite(currentWord)) {
    favoriteButton.classList.add("is-fav");
    favoriteButton.textContent = "★ Guardada";
  } else {
    favoriteButton.classList.remove("is-fav");
    favoriteButton.textContent = "⭐ Favorita";
  }
}

// =======================
// Eventos
// =======================
nextButton.addEventListener("click", showNewWord);
favoriteButton.addEventListener("click", toggleFavorite);

// Swipe en móviles (izquierda = siguiente)
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener("touchstart", e => {
  touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener("touchend", e => {
  touchEndX = e.changedTouches[0].screenX;
  if (touchEndX < touchStartX - 50) {
    showNewWord();
  }
});

// =======================
// Inicio
// =======================
(function init() {
  updateFavoriteUI();
  showNewWord();
})();
