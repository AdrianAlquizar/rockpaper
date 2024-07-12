document.addEventListener('DOMContentLoaded', () => {
    const playNowBtn = document.getElementById('play-now-btn');
    const resetGameBtn = document.getElementById('reset-game-btn');
    const page1 = document.getElementById('page1');
    const gameArea = document.getElementById('game-area');
    const choicePage = document.getElementById('choice-page');
    const resultPage = document.getElementById('result-page');
    const emojiContainer = document.getElementById('emoji-container');
    const playerChoices = document.querySelectorAll('.player-choice');

    let playerChoice = '';

    const emojis = [
        { type: 'rock', symbol: '🪨' },
        { type: 'paper', symbol: '📄' },
        { type: 'scissors', symbol: '✂️' }
    ];

    const emojiElements = [];

    playNowBtn.addEventListener('click', () => {
        page1.style.display = 'none';
        choicePage.style.display = 'block';
    });

    playerChoices.forEach(choice => {
        choice.addEventListener('click', () => {
            playerChoice = choice.dataset.type;
            choicePage.style.display = 'none';
            gameArea.style.display = 'flex';
            startGame();
        });
    });

    resetGameBtn.addEventListener('click', () => {
        resetGame();
    });

    function startGame() {
        for (let i = 0; i < 10; i++) {
            emojis.forEach(emoji => {
                const emojiEl = createEmojiElement(emoji);
                emojiContainer.appendChild(emojiEl);
                const position = setPosition(emojiEl);
                const velocityFactor = 0.7; // Adjust this value for slower or faster emojis
                emojiElements.push({
                    element: emojiEl,
                    type: emoji.type,
                    x: position.x,
                    y: position.y,
                    dx: (Math.random() - 0.5) * velocityFactor, // Random horizontal velocity
                    dy: (Math.random() - 0.5) * velocityFactor // Random vertical velocity
                });
            });
        }
        animateEmojis();
    }

    function resetGame() {
        emojiContainer.innerHTML = '';
        emojiElements.length = 0;
        playerChoice = '';
        page1.style.display = 'block';
        choicePage.style.display = 'none';
        resultPage.style.display = 'none';
        resetGameBtn.style.display = 'none'; // Hide the button on reset
        gameArea.style.display = 'none'; // Hide the game area on reset
    }

    function createEmojiElement(emoji) {
        const emojiEl = document.createElement('div');
        emojiEl.classList.add('emoji');
        emojiEl.dataset.type = emoji.type;
        emojiEl.innerHTML = emoji.symbol;
        emojiEl.style.position = 'absolute';
        emojiEl.style.fontSize = '1.5rem'; // Adjust the font size of emojis
        return emojiEl;
    }

    function setPosition(element) {
        const containerRect = emojiContainer.getBoundingClientRect();
        const x = Math.random() * (containerRect.width - element.offsetWidth);
        const y = Math.random() * (containerRect.height - element.offsetHeight);
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
        return { x, y };
    }

    function animateEmojis() {
        function animate() {
            emojiElements.forEach(emoji => {
                const emojiEl = emoji.element;

                // Update position
                emoji.x += emoji.dx;
                emoji.y += emoji.dy;

                // Boundary check
                if (emoji.x < 0) {
                    emoji.x = 0;
                    emoji.dx = -emoji.dx; // Reverse horizontal direction
                }
                if (emoji.x > emojiContainer.offsetWidth - emojiEl.offsetWidth) {
                    emoji.x = emojiContainer.offsetWidth - emojiEl.offsetWidth;
                    emoji.dx = -emoji.dx; // Reverse horizontal direction
                }
                if (emoji.y < 0) {
                    emoji.y = 0;
                    emoji.dy = -emoji.dy; // Reverse vertical direction
                }
                if (emoji.y > emojiContainer.offsetHeight - emojiEl.offsetHeight) {
                    emoji.y = emojiContainer.offsetHeight - emojiEl.offsetHeight;
                    emoji.dy = -emoji.dy; // Reverse vertical direction
                }

                emojiEl.style.left = `${emoji.x}px`;
                emojiEl.style.top = `${emoji.y}px`;

                // Check collisions and handle game logic
                checkCollisions(emoji);
            });

            requestAnimationFrame(animate);
        }

        animate();
    }

    function checkCollisions(emoji) {
        emojiElements.forEach(otherEmoji => {
            if (emoji !== otherEmoji && isColliding(emoji, otherEmoji)) {
                resolveCollision(emoji, otherEmoji);
            }
        });
    }

    function isColliding(emoji1, emoji2) {
        const rect1 = emoji1.element.getBoundingClientRect();
        const rect2 = emoji2.element.getBoundingClientRect();

        return !(rect1.right < rect2.left ||
                 rect1.left > rect2.right ||
                 rect1.bottom < rect2.top ||
                 rect1.top > rect2.bottom);
    }

    function resolveCollision(emoji1, emoji2) {
        const type1 = emoji1.type;
        const type2 = emoji2.type;

        // Implementing Rock Paper Scissors game rules
        if ((type1 === 'rock' && type2 === 'scissors') ||
            (type1 === 'scissors' && type2 === 'paper') ||
            (type1 === 'paper' && type2 === 'rock')) {
            // emoji1 wins
            emoji2.type = type1;
            emoji2.element.dataset.type = type1;
            emoji2.element.innerHTML = emojis.find(e => e.type === type1).symbol;
        } else if ((type2 === 'rock' && type1 === 'scissors') ||
                   (type2 === 'scissors' && type1 === 'paper') ||
                   (type2 === 'paper' && type1 === 'rock')) {
            // emoji2 wins
            emoji1.type = type2;
            emoji1.element.dataset.type = type2;
            emoji1.element.innerHTML = emojis.find(e => e.type === type2).symbol;
        }

        // Check if the game is over
        checkGameOver();
    }

    function checkGameOver() {
        const remainingTypes = new Set(emojiElements.map(emoji => emoji.type));
        if (remainingTypes.size === 1) {
            const playerWins = emojis.find(emoji => emoji.type === playerChoice).type === Array.from(remainingTypes)[0];
            displayResult(playerWins);
        }
    }

    function displayResult(playerWins) {
        resultPage.innerHTML = playerWins ? '<br><h2>You won!</h2>' : '<br><h2>You lost! HHAHAAHAHAHAHA</h2>';
        resultPage.style.display = 'block';
        resetGameBtn.style.display = 'block'; // Show the button when displaying the result
        gameArea.style.display = 'none'; // Hide the game area when displaying the result
    }
});
