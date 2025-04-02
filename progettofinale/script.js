const pacman = document.getElementById('pacman');
let pacmanPosition = { x: 0, y: 0 };

// Dimensione del labirinto
const gridSize = 40;  // Ogni cella è 40x40px

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            movePacman(0, -gridSize);
            break;
        case 'ArrowDown':
            movePacman(0, gridSize);
            break;
        case 'ArrowLeft':
            movePacman(-gridSize, 0);
            break;
        case 'ArrowRight':
            movePacman(gridSize, 0);
            break;
    }
});

function movePacman(dx, dy) {
    const newX = pacmanPosition.x + dx;
    const newY = pacmanPosition.y + dy;

    if (isValidMove(newX, newY)) {
        pacmanPosition.x = newX;
        pacmanPosition.y = newY;
        pacman.style.left = `${pacmanPosition.x}px`;
        pacman.style.top = `${pacmanPosition.y}px`;
    }
}

function isValidMove(x, y) {
    // Aggiungi la logica per evitare le collisioni con le pareti
    const walls = document.querySelectorAll('.parete');
    for (let wall of walls) {
        const wallRect = wall.getBoundingClientRect();
        const pacmanRect = pacman.getBoundingClientRect();

        if (
            pacmanRect.left + x < wallRect.right &&
            pacmanRect.right + x > wallRect.left &&
            pacmanRect.top + y < wallRect.bottom &&
            pacmanRect.bottom + y > wallRect.top
        ) {
            return false; // Pac-Man collide con una parete
        }
    }
    return true; // Nessuna collisione
}