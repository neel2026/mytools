document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const startButton = document.getElementById('startGame');
    const scoreDisplay = document.getElementById('score');
    const highScoreDisplay = document.getElementById('highScore');

    // Set canvas size
    canvas.width = 320;
    canvas.height = 480;

    // Load bird image
    const birdImage = new Image();
    birdImage.src = '/static/main/images/bird.png';

    // Game variables
    let gameStarted = false;
    let score = 0;
    let highScore = localStorage.getItem('flappyHighScore') || 0;
    highScoreDisplay.textContent = highScore;

    // Bird properties
    const bird = {
        x: 50,
        y: canvas.height / 2,
        velocity: 0,
        gravity: 0.5,
        jump: -8,
        width: 34,  // Adjust based on your bird image
        height: 24, // Adjust based on your bird image
        rotation: 0,
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            
            // Calculate rotation based on velocity
            this.rotation = Math.min(Math.PI/4, Math.max(-Math.PI/4, this.velocity * 0.1));
            ctx.rotate(this.rotation);
            
            // Draw bird image
            ctx.drawImage(
                birdImage,
                -this.width/2,
                -this.height/2,
                this.width,
                this.height
            );
            
            ctx.restore();
        }
    };

    // Pipe properties
    const pipes = [];
    const pipeWidth = 50;
    const pipeGap = 150;
    const pipeSpeed = 2;

    function createPipe() {
        const minHeight = 50;
        const maxHeight = canvas.height - pipeGap - minHeight;
        const height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);

        pipes.push({
            x: canvas.width,
            height: height,
            scored: false
        });
    }

    function drawPipe(pipe) {
        ctx.fillStyle = '#2ecc71';
        // Draw top pipe
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.height);
        // Draw bottom pipe
        ctx.fillRect(pipe.x, pipe.height + pipeGap, pipeWidth, canvas.height - pipe.height - pipeGap);
    }

    function updatePipes() {
        if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
            createPipe();
        }

        for (let i = pipes.length - 1; i >= 0; i--) {
            pipes[i].x -= pipeSpeed;

            // Score point when passing pipe
            if (!pipes[i].scored && pipes[i].x + pipeWidth < bird.x) {
                score++;
                scoreDisplay.textContent = score;
                if (score > highScore) {
                    highScore = score;
                    highScoreDisplay.textContent = highScore;
                    localStorage.setItem('flappyHighScore', highScore);
                }
                pipes[i].scored = true;
            }

            // Remove pipes that are off screen
            if (pipes[i].x + pipeWidth < 0) {
                pipes.splice(i, 1);
            }
        }
    }

    function checkCollision(pipe) {
        // Adjust collision box to be smaller than the bird sprite
        const collisionMargin = 4;
        const birdRight = bird.x + bird.width/2 - collisionMargin;
        const birdLeft = bird.x - bird.width/2 + collisionMargin;
        const birdTop = bird.y - bird.height/2 + collisionMargin;
        const birdBottom = bird.y + bird.height/2 - collisionMargin;

        return (
            birdRight > pipe.x &&
            birdLeft < pipe.x + pipeWidth &&
            (birdTop < pipe.height || birdBottom > pipe.height + pipeGap)
        );
    }

    function gameOver() {
        gameStarted = false;
        startButton.style.display = 'block';
        startButton.textContent = 'Play Again';
    }

    function update() {
        if (!gameStarted) return;

        // Update bird position
        bird.velocity += bird.gravity;
        bird.y += bird.velocity;

        // Check boundaries
        if (bird.y + bird.height/2 > canvas.height || bird.y - bird.height/2 < 0) {
            gameOver();
            return;
        }

        // Update and check pipes
        updatePipes();
        for (const pipe of pipes) {
            if (checkCollision(pipe)) {
                gameOver();
                return;
            }
        }

        // Draw everything
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw background (sky color)
        ctx.fillStyle = '#4dc9ff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw pipes
        pipes.forEach(drawPipe);
        
        // Draw bird
        bird.draw();

        requestAnimationFrame(update);
    }

    function startGame() {
        gameStarted = true;
        score = 0;
        scoreDisplay.textContent = score;
        bird.y = canvas.height / 2;
        bird.velocity = 0;
        bird.rotation = 0;
        pipes.length = 0;
        startButton.style.display = 'none';
        update();
    }

    function jump() {
        if (gameStarted) {
            bird.velocity = bird.jump;
        }
    }

    // Wait for bird image to load before starting
    birdImage.onload = function() {
        // Event listeners
        startButton.addEventListener('click', startGame);
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                if (!gameStarted) {
                    startGame();
                } else {
                    jump();
                }
                e.preventDefault();
            }
        });

        canvas.addEventListener('click', () => {
            if (!gameStarted) {
                startGame();
            } else {
                jump();
            }
        });

        // Touch support for mobile
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (!gameStarted) {
                startGame();
            } else {
                jump();
            }
        });
    };
}); 