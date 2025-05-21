// Importa pacman e le sue funzioni dal file pacman.js
import { pacman, drawPacman, movePacman } from './pacman.js';
// Importa i fantasmi e le loro funzioni dal file fantasmi.js
import { ghosts, drawGhost, moveGhosts, handleGhostEaten } from './fantasmi.js';
// Importa le variabili di configurazione dal file variabili.js
import {cols, gridSize, rows} from './variabili.js';

// Ottieni il riferimento al canvas HTML e al suo contesto 2D
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Imposta la dimensione del canvas in base alle colonne, righe e dimensione della griglia
canvas.width = cols * gridSize;
canvas.height = rows * gridSize;

// Inizializza il punteggio
let score = 0;

// Definisci la posizione dei muri nella mappa
const walls = [
  { x: 3, y: 2 }, { x: 4, y: 2 }, { x: 5, y: 2 }, { x: 6, y: 2 },
  { x: 10, y: 4 }, { x: 11, y: 4 }, { x: 12, y: 4 },
  { x: 15, y: 7 }, { x: 16, y: 7 }, { x: 17, y: 7 },
  { x: 7, y: 10 }, { x: 8, y: 10 }, { x: 9, y: 10 },
  { x: 5, y: 5 }, { x: 5, y: 6 }, { x: 5, y: 7 },
  { x: 14, y: 0 }, { x: 14, y: 1 }, { x: 14, y: 2 }, { x: 14, y: 3 },
  { x: 0, y: 8 }, { x: 0, y: 9 }, { x: 0, y: 10 }, { x: 0, y: 11 },
  { x: 19, y: 5 }, { x: 19, y: 6 }, { x: 19, y: 7 },
  { x: 9, y: 8 }, { x: 10, y: 8 }, { x: 11, y: 8 },
  { x: 2, y: 13 }, { x: 3, y: 13 }, { x: 4, y: 13 },
  { x: 17, y: 12 }, { x: 17, y: 13 }, { x: 17, y: 14 },
  { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 },
  { x: 1, y: 2 }, { x: 1, y: 3 }, { x: 1, y: 4 },
  { x: 8, y: 3 }, { x: 9, y: 3 }, { x: 10, y: 3 }, { x: 11, y: 3 },
  { x: 6, y: 6 }, { x: 7, y: 6 }, { x: 8, y: 6 },
  { x: 12, y: 9 }, { x: 13, y: 9 }, { x: 14, y: 9 },
  { x: 4, y: 11 }, { x: 5, y: 11 }, { x: 6, y: 11 },
  { x: 15, y: 5 }, { x: 16, y: 5 }, { x: 17, y: 5 },
  { x: 10, y: 12 }, { x: 11, y: 12 }, { x: 12, y: 12 },
  { x: 3, y: 7 }, { x: 4, y: 7 }, { x: 5, y: 7 },
  { x: 18, y: 2 }, { x: 18, y: 3 }, { x: 18, y: 4 },
];

// Inizializza l'array dei puntini
let dots = [];
// Inizializza la posizione del bonus (ciliegia)
let bonus = { x: cols - 2, y: rows - 2 };
// Stato del potere attivo (quando Pac-Man può mangiare i fantasmi)
let powerActive = false;
// Timeout per gestire la durata del potere
let powerTimeout;

// Funzione per generare una posizione casuale valida per il bonus (non dentro i muri)
function generateRandomBonusPosition() {
  let position;
  do {
    const x = Math.floor(Math.random() * cols);
    const y = Math.floor(Math.random() * rows);
    const isBlocked = walls.some(w => w.x === x && w.y === y);
    if (!isBlocked) {
      position = { x, y };
    }
  } while (!position);
  return position;
}

// Funzione per resettare il gioco
function resetGame() {
  pacman.x = 0; // Pac-Man torna all'inizio
  pacman.y = 0;
  pacman.dir = 'right'; // Direzione iniziale
  score = 0; // Azzeramento punteggio
  dots = []; // Svuota i puntini

  // Genera tutti i puntini tranne dove ci sono muri o la posizione iniziale di Pac-Man
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const blocked = walls.some(w => w.x === x && w.y === y);
      const onStart = x === 0 && y === 0;
      if (!blocked && !onStart) dots.push({ x, y });
    }
  }

  updateScore(); // Aggiorna il punteggio a schermo
}

// Funzione per disegnare il bonus (ciliegia)
function drawBonus(ctx, bonus, gridSize) {
  const centerX = bonus.x * gridSize + gridSize / 2;
  const centerY = bonus.y * gridSize + gridSize / 2;

  // Disegna il gambo della ciliegia
  ctx.strokeStyle = 'green';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - 10);
  ctx.lineTo(centerX - 5, centerY - 20);
  ctx.moveTo(centerX, centerY - 10);
  ctx.lineTo(centerX + 5, centerY - 20);
  ctx.stroke();

  // Disegna le due ciliegie rosse
  ctx.fillStyle = 'red';
  ctx.beginPath();
  ctx.arc(centerX - 5, centerY, 6, 0, 2 * Math.PI); // Ciliegia sinistra
  ctx.arc(centerX + 5, centerY, 6, 0, 2 * Math.PI); // Ciliegia destra
  ctx.fill();
}

// Funzione principale di disegno della scena di gioco
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Pulisce il canvas

  // Disegna i muri
  ctx.fillStyle = 'blue';
  walls.forEach(w => {
    ctx.fillRect(w.x * gridSize, w.y * gridSize, gridSize, gridSize);
  });

  // Disegna i puntini
  ctx.fillStyle = 'white';
  dots.forEach(dot => {
    ctx.beginPath();
    ctx.arc(dot.x * gridSize + gridSize / 2, dot.y * gridSize + gridSize / 2, 4, 0, 2 * Math.PI);
    ctx.fill();
  });

  // Disegna il bonus (ciliegia) se presente
  if (bonus) {
    drawBonus(ctx, bonus, gridSize);
  }

  // Disegna tutti i fantasmi
  ghosts.forEach(g => {
    drawGhost(ctx, g, gridSize, powerActive);
  });

  // Disegna Pac-Man
  drawPacman(ctx, gridSize);
}

// Aggiorna il punteggio visualizzato nell'HTML
function updateScore() {
  document.getElementById('score').textContent = "Punteggio: " + score;
}

// Gestisce la pressione dei tasti freccia per cambiare direzione a Pac-Man
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowUp') pacman.dir = 'up';
  if (e.key === 'ArrowDown') pacman.dir = 'down';
  if (e.key === 'ArrowLeft') pacman.dir = 'left';
  if (e.key === 'ArrowRight') pacman.dir = 'right';
});

// Funzione principale del ciclo di gioco
function gameLoop() {
  movePacman(walls, cols, rows); // Muove Pac-Man
  moveGhosts(walls, cols, rows); // Muove i fantasmi

  // Gestisce la raccolta dei puntini
  dots = dots.filter(dot => {
    const same = dot.x === pacman.x && dot.y === pacman.y;
    if (same) {
      score += 10; // Aumenta il punteggio

      // Fai ricomparire il dot dopo 3 secondi
      setTimeout(() => {
        dots.push({ x: dot.x, y: dot.y });
      }, 3000);
    }
    return !same;
  });

  // Gestisce la raccolta del bonus (ciliegia)
  if (bonus && pacman.x === bonus.x && pacman.y === bonus.y) {
    powerActive = true; // Attiva il potere
    clearTimeout(powerTimeout); // Pulisce eventuali timeout precedenti
    powerTimeout = setTimeout(() => {
      powerActive = false; // Disattiva il potere

      // Fai ricomparire il bonus in un punto casuale dopo 10 secondi
      setTimeout(() => {
        bonus = generateRandomBonusPosition();
      }, 10000);
    }, 10000); // Potere attivo per 10 secondi
    bonus = null; // Rimuovi il bonus dalla mappa
  }

  // Gestisce la collisione tra Pac-Man e i fantasmi
  ghosts.forEach(g => {
    if (g.x === pacman.x && g.y === pacman.y) {
      if (powerActive && !g.eaten) {
        // Se il potere è attivo e il fantasma non è già stato mangiato
        handleGhostEaten(g); // Mangia il fantasma
        score += 50; // Aggiungi punti per il fantasma mangiato
      } else if (!powerActive) {
        // Se il potere non è attivo, il gioco termina
        alert("GAME OVER!");
        resetGame();
      }
    }
  });

  updateScore(); // Aggiorna il punteggio
  draw();        // Ridisegna la scena
  setTimeout(gameLoop, 250); // Richiama il ciclo di gioco ogni 250ms
}

// Avvia il gioco
resetGame();
gameLoop();