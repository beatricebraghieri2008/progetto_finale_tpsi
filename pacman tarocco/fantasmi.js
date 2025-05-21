import {cols, gridSize, rows} from './variabili.js';

// Definisce l'array dei fantasmi con posizione iniziale e colore
export const ghosts = [
    { x: Math.floor(cols / 2), y: Math.floor(rows / 2), color: 'red' },      // Fantasma rosso al centro
    { x: Math.floor(cols / 2) + 1, y: Math.floor(rows / 2), color: 'cyan' }, // Fantasma ciano a destra del centro
    { x: Math.floor(cols / 2) - 1, y: Math.floor(rows / 2), color: 'pink' }, // Fantasma rosa a sinistra del centro
    { x: Math.floor(cols / 2), y: Math.floor(rows / 2) + 1, color: 'orange' } // Fantasma arancione sotto il centro
];

// Funzione che gestisce quando un fantasma viene mangiato da Pac-Man
export function handleGhostEaten(ghost) {
  ghost.eaten = true; // Segna il fantasma come "mangiato" (non visibile né attivo)

  // Dopo 7 secondi il fantasma ricompare al centro e torna visibile
  setTimeout(() => {
    ghost.x = Math.floor(cols / 2); // Posizione X centrale
    ghost.y = Math.floor(rows / 2); // Posizione Y centrale
    ghost.eaten = false; // Rendi il fantasma visibile di nuovo
  }, 7000);
}

// Funzione che disegna un fantasma sul canvas
export function drawGhost(ctx, ghost, gridSize, powerActive) {
  if (ghost.eaten) return; // Non disegnare il fantasma se è stato mangiato

  // Calcola la posizione e la dimensione del fantasma
  const x = ghost.x * gridSize + gridSize / 2;
  const y = ghost.y * gridSize + gridSize / 2;
  const radius = gridSize / 2 - 6;

  // Se il bonus è attivo, il fantasma è blu, altrimenti usa il suo colore originale
  if (powerActive) {
    ctx.fillStyle = 'blue';
  } else {
    ctx.fillStyle = ghost.color;
  }

  // Corpo del fantasma (parte superiore arrotondata e parte inferiore ondulata)
  ctx.beginPath();
  ctx.arc(x, y - radius / 2, radius, Math.PI, 2 * Math.PI); // Parte superiore
  ctx.lineTo(x + radius, y + radius / 2); // Lato destro
  for (let i = 0; i < 4; i++) { // Onde nella parte inferiore
    const waveX = x + radius - (i * (radius / 2));
    const waveY = y + radius / 2 + (i % 2 === 0 ? -radius / 4 : radius / 4);
    ctx.lineTo(waveX, waveY);
  }
  ctx.lineTo(x - radius, y + radius / 2); // Lato sinistro
  ctx.closePath();
  ctx.fill();

  // Occhi del fantasma (due cerchi bianchi)
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(x - radius / 3, y - radius / 3, radius / 5, 0, 2 * Math.PI); // Occhio sinistro
  ctx.arc(x + radius / 3, y - radius / 3, radius / 5, 0, 2 * Math.PI); // Occhio destro
  ctx.fill();

  // Pupille e bocca
  if (powerActive) {
    // Espressione spaventata: pupille nere e bocca curva verso il basso
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(x - radius / 3, y - radius / 3, radius / 10, 0, 2 * Math.PI); // Pupilla sinistra
    ctx.arc(x + radius / 3, y - radius / 3, radius / 10, 0, 2 * Math.PI); // Pupilla destra
    ctx.fill();

    // Bocca spaventata (curva verso il basso)
    ctx.beginPath();
    ctx.arc(x, y, radius / 3, 0, Math.PI, false);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.stroke();
  } else {
    // Espressione normale: pupille nere
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(x - radius / 3, y - radius / 3, radius / 10, 0, 2 * Math.PI); // Pupilla sinistra
    ctx.arc(x + radius / 3, y - radius / 3, radius / 10, 0, 2 * Math.PI); // Pupilla destra
    ctx.fill();
  }
}

// Funzione che gestisce il movimento casuale dei fantasmi (solo se non sono stati mangiati)
export function moveGhosts(walls, cols, rows) {
    ghosts.forEach(g => {
      if (g.eaten) return; // Salta i fantasmi mangiati

      // Possibili direzioni di movimento (alto, basso, sinistra, destra)
      const dirs = [
        { dx: 0, dy: -1 }, { dx: 0, dy: 1 },
        { dx: -1, dy: 0 }, { dx: 1, dy: 0 }
      ];

      // Filtra solo le direzioni valide (non contro i muri o fuori dalla mappa)
      const valid = dirs.filter(d => {
        const nx = g.x + d.dx;
        const ny = g.y + d.dy;
        return nx >= 0 && ny >= 0 && nx < cols && ny < rows &&
          !walls.some(w => w.x === nx && w.y === ny);
      });

      // Scegli una direzione valida a caso e muovi il fantasma
      if (valid.length > 0) {
        const move = valid[Math.floor(Math.random() * valid.length)];
        g.x += move.dx;
        g.y += move.dy;
      }
    });
}

