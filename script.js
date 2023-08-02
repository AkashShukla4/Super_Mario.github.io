var mario = document.getElementById("mario");
var pipe = document.getElementById("pipe");
var mushroom = document.getElementById("mushroom");
var score = document.getElementById("score");
var backgroundMusic = document.getElementById("background-music");
var jumpSound = document.getElementById("jump-sound");
var startBtn = document.getElementById("start-btn");

startBtn.addEventListener("click", function () {
    // Start the game here
    backgroundMusic.play();
    // Hide the start button
    startBtn.style.display = "none";
    document.getElementById("game-container").style.display = "block";
    startGame();
});

function startGame() {
    var marioJumping = false;
    var marioMovingRight = false;
    var marioMovingLeft = false;
    var obstacles = [pipe, mushroom];
    var gameScore = 0;
    var gameContainerWidth =
        document.getElementById("game-container").offsetWidth;
    var marioPosition = 50;

    function jump() {
        if (!marioJumping) {
            marioJumping = true;
            jumpSound.play(); // play jump sound

            var startPos = 32;
            var endPos = 150;
            var speed = 5;

            var jumpInterval = setInterval(function () {
                if (startPos < endPos) {
                    startPos += speed;
                    mario.style.bottom = startPos + "px";
                } else {
                    clearInterval(jumpInterval);
                    fall();
                }
            }, 20);
        }
    }

    function fall() {
        var startPos = 150;
        var endPos = 32;
        var speed = 8;

        var fallInterval = setInterval(function () {
            if (startPos > endPos) {
                startPos -= speed;
                mario.style.bottom = startPos + "px";
            } else {
                clearInterval(fallInterval);
                marioJumping = false;
            }
        }, 20);
    }

    function moveMario(direction) {
        var proposedPosition = marioPosition + (direction === "right" ? 20 : -20);
        var maxMarioPosition = gameContainerWidth - mario.offsetWidth; // mario.offsetWidth gives the width of the mario element
        if (proposedPosition >= 0 && proposedPosition <= maxMarioPosition) {
            marioPosition = proposedPosition;
            mario.style.left = marioPosition + "px";
            if (direction === "right") {
                mario.classList.remove("flipped");
            } else {
                mario.classList.add("flipped");
            }
        }
    }

    function checkCollision(obstaclePos) {
        return obstaclePos < marioPosition + 100 && obstaclePos > marioPosition;
    }

    function moveObstacle(obstacle) {
        var obstaclePos = gameContainerWidth;
        obstacle.style.left = obstaclePos + "px"; // set initial position

        var obstacleTimer = setInterval(function () {
            if (obstaclePos < -60) {
                obstacle.style.display = "none";
                obstaclePos = gameContainerWidth;
                setTimeout(() => {
                    obstacle.style.display = "block";
                }, 100);
                gameScore++;
                score.innerText = "Score : " + gameScore;
            } else if (checkCollision(obstaclePos) && marioJumping) {
                obstaclePos -= 10; // increase speed
            } else if (checkCollision(obstaclePos) && !marioJumping) {
                clearInterval(obstacleTimer);
                score.innerText = "Game Over! Score: " + gameScore;
                obstacles.forEach(function (obstacle) {
                    obstacle.style.animationPlayState = "paused";
                });
                if (confirm("Game Over!")) {
                    location.reload();
                } else {
                    location.reload();
                }
            } else {
                obstaclePos -= 10; // increase speed
            }

            obstacle.style.left = obstaclePos + "px";
        }, Math.random() * (200 - 50) + 50);
    }

    window.addEventListener("keydown", function (event) {
        switch (event.key) {
            case " ":
                jump();
                break;
            case "ArrowRight":
                marioMovingRight = true;
                break;
            case "ArrowLeft":
                marioMovingLeft = true;
                break;
        }
    });

    window.addEventListener("keyup", function (event) {
        switch (event.key) {
            case "ArrowRight":
                marioMovingRight = false;
                break;
            case "ArrowLeft":
                marioMovingLeft = false;
                break;
        }
    });

    setInterval(function () {
        if (marioMovingRight) {
            moveMario("right");
        } else if (marioMovingLeft) {
            moveMario("left");
        }
    }, 100);

    obstacles.forEach(function (obstacle, index) {
        setTimeout(function () {
            obstacle.style.display = "block";
            moveObstacle(obstacle);
        }, index * 2000); // 2000 ms (2 seconds) delay before each obstacle starts moving
    });
}