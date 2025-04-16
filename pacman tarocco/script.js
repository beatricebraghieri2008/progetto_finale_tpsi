import { pacman, drawPacman, movePacman } from './pacman.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const gridSize = 40;
const rows = 15;
const cols = 20;
canvas.width = cols * gridSize;
canvas.height = rows * gridSize;

let score = 0;

const walls = [
  { x: 3, y: 2 }, { x: 4, y: 2 }, { x: 5, y: 2 },
  { x: 10, y: 4 }, { x: 11, y: 4 },
  { x: 15, y: 7 }, { x: 16, y: 7 }
];

let ghosts = [
  { x: 10, y: 2, color: 'red' },
  { x: 18, y: 13, color: 'cyan' }
];

let dots = [];

function resetGame() {
  pacman.x = 0;
  pacman.y = 0;
  pacman.dir = 'right';
  score = 0;
  dots = [];

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const blocked = walls.some(w => w.x === x && w.y === y);
      const onStart = x === 0 && y === 0;
      if (!blocked && !onStart) dots.push({ x, y });
    }
  }

  updateScore();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'blue';
  walls.forEach(w => {
    ctx.fillRect(w.x * gridSize, w.y * gridSize, gridSize, gridSize);
  });

  ctx.fillStyle = 'white';
  dots.forEach(dot => {
    ctx.beginPath();
    ctx.arc(dot.x * gridSize + gridSize / 2, dot.y * gridSize + gridSize / 2, 4, 0, 2 * Math.PI);
    ctx.fill();
  });

  ghosts.forEach(g => {
    ctx.fillStyle = g.color;
    ctx.beginPath();
    ctx.arc(g.x * gridSize + gridSize / 2, g.y * gridSize + gridSize / 2, gridSize / 2 - 6, 0, 2 * Math.PI);
    ctx.fill();
  });

  drawPacman(ctx, gridSize);
}

function moveGhosts() {
  ghosts.forEach(g => {
    const dirs = [
      { dx: 0, dy: -1 }, { dx: 0, dy: 1 },
      { dx: -1, dy: 0 }, { dx: 1, dy: 0 }
    ];

    const valid = dirs.filter(d => {
      const nx = g.x + d.dx;
      const ny = g.y + d.dy;
      return nx >= 0 && ny >= 0 && nx < cols && ny < rows &&
        !walls.some(w => w.x === nx && w.y === ny);
    });

    if (valid.length > 0) {
      const move = valid[Math.floor(Math.random() * valid.length)];
      g.x += move.dx;
      g.y += move.dy;
    }
  });
}

function updateScore() {
  document.getElementById('score').textContent = "Punteggio: " + score;
}

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowUp') pacman.dir = 'up';
  if (e.key === 'ArrowDown') pacman.dir = 'down';
  if (e.key === 'ArrowLeft') pacman.dir = 'left';
  if (e.key === 'ArrowRight') pacman.dir = 'right';
});

function gameLoop() {
  movePacman(walls, cols, rows);
  moveGhosts();

  // Mangia dot
  dots = dots.filter(dot => {
    const same = dot.x === pacman.x && dot.y === pacman.y;
    if (same) score += 10;
    return !same;
  });

  // Collisione fantasma
  if (ghosts.some(g => g.x === pacman.x && g.y === pacman.y)) {
    alert("GAME OVER!");
    resetGame();
  }

  updateScore();
  draw();
  setTimeout(gameLoop, 250);
}

resetGame();
gameLoop();
