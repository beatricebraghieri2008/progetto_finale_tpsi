const pacman = document.getElementById('pacman');
const gridSize = 40;
let pacmanPosition = { x: 0, y: 0 };

// Posizionamento iniziale
updatePacmanPosition();

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            movePacman(0, -1);
            break;
        case 'ArrowDown':
            movePacman(0, 1);
            break;
        case 'ArrowLeft':
            movePacman(-1, 0);
            break;
        case 'ArrowRight':
            movePacman(1, 0);
            break;
    }
});

function movePacman(dx, dy) {
    const newX = pacmanPosition.x + dx;
    const newY = pacmanPosition.y + dy;

    if (isValidMove(newX, newY)) {
        pacmanPosition.x = newX;
        pacmanPosition.y = newY;
        updatePacmanPosition();
    }
}

function updatePacmanPosition() {
    pacman.style.left = `${pacmanPosition.x * gridSize}px`;
    pacman.style.top = `${pacmanPosition.y * gridSize}px`;
}

function isValidMove(x, y) {
    const walls = document.querySelectorAll('.parete');

    for (let wall of walls) {
        const style = window.getComputedStyle(wall);
        const rowStart = parseInt(style.gridRowStart);
        const colStart = parseInt(style.gridColumnStart);
        const rowSpan = parseInt(style.gridRowEnd?.replace("span ", "") || 1);
        const colSpan = parseInt(style.gridColumnEnd?.replace("span ", "") || 1);

        const wallCells = [];

        for (let r = 0; r < rowSpan; r++) {
            for (let c = 0; c < colSpan; c++) {
                wallCells.push({ x: colStart - 1 + c, y: rowStart - 1 + r });
            }
        }

        for (let cell of wallCells) {
            if (cell.x === x && cell.y === y) {
                return false; // Collisione con parete
            }
        }
    }

    // Check limiti labirinto (10x10)
    return x >= 0 && y >= 0 && x < 10 && y < 10;
}
