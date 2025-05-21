export const pacman = {
    x: 0,
    y: 0,
    dir: 'right'
  };
  
  export function drawPacman(ctx, gridSize) {
    const centerX = pacman.x * gridSize + gridSize / 2;
    const centerY = pacman.y * gridSize + gridSize / 2;
    const radius = gridSize / 2 - 4;
  
    let startAngle = 0;
    let endAngle = 2 * Math.PI;
  
    switch (pacman.dir) {
      case 'right': startAngle = 0.25 * Math.PI; endAngle = 1.75 * Math.PI; break;
      case 'left': startAngle = 1.25 * Math.PI; endAngle = 0.75 * Math.PI; break;
      case 'up': startAngle = 1.75 * Math.PI; endAngle = 1.25 * Math.PI; break;
      case 'down': startAngle = 0.75 * Math.PI; endAngle = 0.25 * Math.PI; break;
    }
  
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle, false);
    ctx.closePath();
    ctx.fill();
  }
  
  export function movePacman(walls, cols, rows) {
    let dx = 0, dy = 0;
    if (pacman.dir === 'left') dx = -1;
    if (pacman.dir === 'right') dx = 1;
    if (pacman.dir === 'up') dy = -1;
    if (pacman.dir === 'down') dy = 1;
  
    const newX = pacman.x + dx;
    const newY = pacman.y + dy;
  
    const isWall = walls.some(w => w.x === newX && w.y === newY);
    const inBounds = newX >= 0 && newX < cols && newY >= 0 && newY < rows;
  
    if (inBounds && !isWall) {
      pacman.x = newX;
      pacman.y = newY;
    }
  }
