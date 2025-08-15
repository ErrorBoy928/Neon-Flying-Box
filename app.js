const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game states: "menu", "game", "gameover"
let gameState = "menu";

// Bird properties
let birdX = 50;
let birdY = 150;
let birdWidth = 30;
let birdHeight = 30;
let birdVelocity = 0;
let gravity = 0.5;
let jumpStrength = -8;

// Pipes array
let pipes = [];
let pipeWidth = 50;
let pipeGap = 150;
let pipeSpeed = 2;

// Score
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let frameCount = 0;

function drawBackground() {
    let gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#0f0f1a");
    gradient.addColorStop(1, "#1a0033");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function createPipe() {
    let pipeHeight = Math.random() * (canvas.height - pipeGap - 100) + 50;
    pipes.push({
        x: canvas.width,
        top: pipeHeight,
        bottom: canvas.height - pipeHeight - pipeGap
    });
}

function drawPipes() {
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#0ff";
    ctx.fillStyle = "#0ff";
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
        ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipeWidth, pipe.bottom);
    });
    ctx.shadowBlur = 0;
}

function updatePipes() {
    pipes.forEach(pipe => {
        pipe.x -= pipeSpeed;

        // Collision
        if (
            birdX < pipe.x + pipeWidth &&
            birdX + birdWidth > pipe.x &&
            (birdY < pipe.top || birdY + birdHeight > canvas.height - pipe.bottom)
        ) {
            gameState = "gameover";
        }
    });

    if (pipes.length && pipes[0].x < -pipeWidth) {
        pipes.shift();
        score++;
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore);
        }
    }
}

function drawBird() {
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#ff0";
    ctx.fillStyle = "#ff0";
    ctx.fillRect(birdX, birdY, birdWidth, birdHeight);
    ctx.shadowBlur = 0;
}

function drawScore() {
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#f0f";
    ctx.fillStyle = "#fff";
    ctx.font = "24px Arial";
    ctx.fillText("Score: " + score, 10, 30);
    ctx.fillText("High: " + highScore, 10, 60);
    ctx.shadowBlur = 0;
}

function resetGame() {
    birdY = 150;
    birdVelocity = 0;
    pipes = [];
    score = 0;
    frameCount = 0;
}

function drawMenu() {
    drawBackground();
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#0ff";
    ctx.fillStyle = "#0ff";
    ctx.font = "48px Arial";
    ctx.fillText("Flying Box", canvas.width / 2 - 120, canvas.height / 2 - 60);

    ctx.shadowColor = "#ff0";
    ctx.font = "28px Arial";
    ctx.fillText("Press SPACE or Click to Start", canvas.width / 2 - 180, canvas.height / 2);

    ctx.shadowBlur = 0;
}

function drawGameOver() {
    drawBackground();

    ctx.shadowBlur = 20;
    ctx.shadowColor = "#f0f";
    ctx.fillStyle = "#fff";
    ctx.font = "40px Arial";
    ctx.fillText("Game Over", canvas.width / 2 - 110, canvas.height / 2 - 60);

    ctx.font = "24px Arial";
    ctx.fillText("Score: " + score, canvas.width / 2 - 50, canvas.height / 2 - 20);
    ctx.fillText("High Score: " + highScore, canvas.width / 2 - 70, canvas.height / 2 + 10);

    ctx.shadowColor = "#0ff";
    ctx.font = "20px Arial";
    ctx.fillText("Press R to Restart", canvas.width / 2 - 90, canvas.height / 2 + 50);
    ctx.fillText("Press M for Menu", canvas.width / 2 - 85, canvas.height / 2 + 80);

    ctx.shadowBlur = 0;
}

function gameLoop() {
    if (gameState === "menu") {
        drawMenu();
    } else if (gameState === "game") {
        birdVelocity += gravity;
        birdY += birdVelocity;

        if (birdY + birdHeight > canvas.height || birdY < 0) {
            gameState = "gameover";
        }

        drawBackground();
        frameCount++;
        if (frameCount % 90 === 0) createPipe();

        updatePipes();
        drawPipes();
        drawBird();
        drawScore();
    } else if (gameState === "gameover") {
        drawGameOver();
    }

    requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (e) => {
    if (gameState === "menu" && e.code === "Space") {
        resetGame();
        gameState = "game";
    } else if (gameState === "game" && e.code === "Space") {
        birdVelocity = jumpStrength;
    } else if (gameState === "gameover") {
        if (e.code === "KeyR") {
            resetGame();
            gameState = "game";
        } else if (e.code === "KeyM") {
            gameState = "menu";
        }
    }
});

canvas.addEventListener("click", () => {
    if (gameState === "menu") {
        resetGame();
        gameState = "game";
    } else if (gameState === "game") {
        birdVelocity = jumpStrength;
    }
});

gameLoop();