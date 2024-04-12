// Initialize canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Define game variables
let katamari = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 20,
    color: '#FF6347', // Tomato color
    attachedObjects: [] // Array to store attached objects
};

// Define objects to collect
// Define objects to collect
let objects = [
    { x: 100, y: 100, radius: 15, color: '#32CD32' }, // Lime green
    { x: 200, y: 200, radius: 25, color: '#FFD700' }, // Gold
    { x: 300, y: 300, radius: 20, color: '#8A2BE2' }, // Blue Violet
    { x: 400, y: 150, radius: 18, color: '#FFA500' }, // Orange
    { x: 500, y: 250, radius: 22, color: '#FFFF00' }, // Yellow
    { x: 600, y: 350, radius: 24, color: '#0000FF' } // Blue
];


// Function to draw katamari
function drawKatamari() {
    ctx.beginPath();
    ctx.arc(katamari.x, katamari.y, katamari.radius, 0, Math.PI * 2);
    ctx.fillStyle = katamari.color;
    ctx.fill();
    ctx.closePath();
}

// Function to draw objects
function drawObjects() {
    objects.forEach(object => {
        ctx.beginPath();
        ctx.arc(object.x, object.y, object.radius, 0, Math.PI * 2);
        ctx.fillStyle = object.color;
        ctx.fill();
        ctx.closePath();
    });
}

// Function to detect collision between two circles
function isCollision(obj1, obj2) {
    const dx = obj1.x - obj2.x;
    const dy = obj1.y - obj2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < obj1.radius + obj2.radius;
}

// Update function
function update() {
    // Check for collisions with objects
    objects.forEach(object => {
        if (isCollision(katamari, object)) {
            // Increase katamari's size and remove collected object
            katamari.radius += object.radius / 5;
            objects = objects.filter(obj => obj !== object);
        }
    });

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw objects
    drawObjects();

    // Draw katamari
    drawKatamari();

    // Request animation frame
    requestAnimationFrame(update);
}

// Start the game loop
update();

// Keyboard controls
document.addEventListener('keydown', function(event) {
    const speed = 5;
    switch (event.key) {
        case 'ArrowLeft':
            katamari.x -= speed;
            break;
        case 'ArrowRight':
            katamari.x += speed;
            break;
        case 'ArrowUp':
            katamari.y -= speed;
            break;
        case 'ArrowDown':
            katamari.y += speed;
            break;
    }
});