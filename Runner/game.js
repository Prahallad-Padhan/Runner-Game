// Get the canvas and set up the game context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set canvas dimensions
canvas.width = 800;
canvas.height = 300;

// Load sprite sheet
const runSprite = new Image();
runSprite.src = "Run.png"; // Running animation

const jumpSprite = new Image();
jumpSprite.src = "Jump.png"; // Jumping animation

const obstacleSprite = new Image();
obstacleSprite.src = "obstacle.png"; // Obstacles


// Game variables
let gameSpeed = 5;
let gravity = 0.5;
let frame = 0; // For animation

const player = {
    x: 50,
    y: canvas.height - 80,
    width: 50,
    height: 50,
    dy: 0,
    frameIndex: 0,
    frameSpeed: 5,
    jumpPower: -10,
    isJumping: false,
    sprite: runSprite, // Default is running sprite
    spriteWidth: 50,  // Adjust based on your sprite sheet size
    spriteHeight: 50,
};

// Jump Function
function jump() {
    let upInterval = setInterval(() => {
        if (jumpHeight < 80) {
            jumpHeight += 8;
        } else {
            clearInterval(upInterval);
            fall();
        }
    }, 30);
}
// Update Player
function updatePlayer() {
    player.y += player.dy;
    player.dy += gravity;

    // Stop falling at ground level
    if (player.y >= canvas.height - 80) {
        player.y = canvas.height - 80;
        player.isJumping = false;
        player.sprite = runSprite; // Switch back to running animation
    }

    // Animate sprite frames
    if (frame % player.frameSpeed === 0) {
        player.frameIndex = (player.frameIndex + 1) % 6; // Adjust based on sprite sheet frames
    }
}

// Draw Player with the selected sprite
let frameIndex = 0;
const frameWidth = 128; // Width of each frame in the sprite
const frameHeight = 128;

let isJumping = false;
let jumpHeight = 0;

document.addEventListener("keydown", (event) => {
    if (event.code === "Space" && !isJumping) {
        isJumping = true;
        jump();
    }
});

function jump() {
    let upInterval = setInterval(() => {
        if (jumpHeight < 80) {
            jumpHeight += 8;
        } else {
            clearInterval(upInterval);
            fall();
        }
    }, 30);
}

function fall() {
    let downInterval = setInterval(() => {
        if (jumpHeight > 0) {
            jumpHeight -= 8;
        } else {
            clearInterval(downInterval);
            isJumping = false;
        }
    }, 30);
}

let obstacleX = canvas.width; // Start from the right edge
const obstacleSpeed = 5;

function drawCharacter() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Move the obstacle
    obstacleX -= obstacleSpeed;
    if (obstacleX < -50) {
        obstacleX = canvas.width; // Reset after it goes off-screen
    }

    // Draw obstacle
    ctx.drawImage(obstacleSprite, obstacleX, 250, 40, 50);

    // Draw character - switch sprite if jumping
    if (isJumping) {
        ctx.drawImage(jumpSprite, 0, 0, frameWidth, frameHeight, 50, 150 - jumpHeight, 100, 100);
    } else {
        ctx.drawImage(runSprite, frameIndex * frameWidth, 0, frameWidth, frameHeight, 50, 200, 100, 100);
    }

    frameIndex = (frameIndex + 1) % 10; // Cycle through frames
    function checkCollision() {
        if (
            50 < obstacleX + 50 &&
            50 + 64 > obstacleX &&
            200 - jumpHeight < 230 + 50 &&
            200 - jumpHeight + 64 > 230
        ) {
            alert("Game Over!");
            location.reload(); // Restart game
        }
    }
    setInterval(() => {
        drawCharacter();
        checkCollision();
    }, 100);

}

setInterval(drawCharacter, 100);





const obstacles = [];

class Obstacle {
    constructor() {
        this.x = canvas.width;
        this.y = canvas.height - 50;
        this.width = 30;
        this.height = 50;
        this.speed = gameSpeed;
    }

    update() {
        this.x -= this.speed;
    }

    draw() {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}



function update() {
    frame++;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updatePlayer();
    drawPlayer();

    spawnObstacles();

    // Update and draw obstacles
    obstacles.forEach((obstacle, index) => {
        obstacle.update();
        obstacle.draw();

        // Check collision
        if (detectCollision(player, obstacle)) {
            alert("Game Over!");
            document.location.reload();
        }

        // Remove off-screen obstacles
        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(index, 1);
        }
    });

    requestAnimationFrame(update);
}

// Start game after sprite sheet loads
let loadedSprites = 0;

runSprite.onload = checkAllSpritesLoaded;
jumpSprite.onload = checkAllSpritesLoaded;
obstacleSprite.onload = checkAllSpritesLoaded;

function checkAllSpritesLoaded() {
    loadedSprites++;
    if (loadedSprites === 3) {
        update();
    }
}

// Listen for jump key
document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        jump();
    }
});
