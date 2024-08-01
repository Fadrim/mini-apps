document.addEventListener('DOMContentLoaded', function() {
    const startGameBtn = document.getElementById('start-game');
    const hitBtn = document.getElementById('hit');
    const standBtn = document.getElementById('stand');
    const dealerCardsDiv = document.getElementById('dealer-cards');
    const playerCardsDiv = document.getElementById('player-cards');
    const dealerScoreP = document.getElementById('dealer-score');
    const playerScoreP = document.getElementById('player-score');
    const messageDiv = document.getElementById('message');
    const chipsDiv = document.getElementById('chips');

    let deck = [];
    let dealerHand = [];
    let playerHand = [];
    let playerChips = 1000;
    let currentBet = 100;

    startGameBtn.addEventListener('click', startGame);
    hitBtn.addEventListener('click', hit);
    standBtn.addEventListener('click', stand);

    function createDeck() {
        deck = [];
        const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
        const values = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];
        for (let suit of suits) {
            for (let value of values) {
                deck.push({ value, suit });
            }
        }
        deck = shuffle(deck);
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function startGame() {
        if (playerChips < currentBet) {
            messageDiv.textContent = 'Not enough chips to place a bet.';
            return;
        }

        playerChips -= currentBet;
        updateChipsDisplay();

        messageDiv.textContent = '';
        dealerCardsDiv.innerHTML = '';
        playerCardsDiv.innerHTML = '';
        dealerScoreP.textContent = '';
        playerScoreP.textContent = '';

        createDeck();
        dealerHand = [deck.pop(), deck.pop()];
        playerHand = [deck.pop(), deck.pop()];

        updateScores();
        displayHands();

        startGameBtn.disabled = true;
        hitBtn.disabled = false;
        standBtn.disabled = false;
    }

    function hit() {
        playerHand.push(deck.pop());
        updateScores();
        displayHands();

        if (calculateHand(playerHand) > 21) {
            endGame('You bust! Dealer wins.');
        }
    }

    function stand() {
        hitBtn.disabled = true;
        standBtn.disabled = true;
        dealerTurn();
    }

    function dealerTurn() {
        while (calculateHand(dealerHand) < 17) {
            dealerHand.push(deck.pop());
        }
        updateScores();
        displayHands();
        determineWinner();
    }

    function calculateHand(hand) {
        let value = 0;
        let aces = 0;
        for (let card of hand) {
            if (card.value === 'A') {
                aces += 1;
                value += 11;
            } else if (['J', 'Q', 'K'].includes(card.value)) {
                value += 10;
            } else {
                value += parseInt(card.value);
            }
        }
        while (value > 21 && aces) {
            value -= 10;
            aces -= 1;
        }
        return value;
    }

    function updateScores() {
        dealerScoreP.textContent = `Score: ${calculateHand(dealerHand)}`;
        playerScoreP.textContent = `Score: ${calculateHand(playerHand)}`;
    }

    function displayHands() {
        dealerCardsDiv.innerHTML = dealerHand.map(card => getCardHTML(card)).join('');
        playerCardsDiv.innerHTML = playerHand.map(card => getCardHTML(card)).join('');
    }

    function getCardHTML(card) {
        return `<img src="cards/card_${card.suit}_${card.value}.png" alt="${card.value} of ${card.suit}" />`;
    }

    function determineWinner() {
        const dealerScore = calculateHand(dealerHand);
        const playerScore = calculateHand(playerHand);

        if (dealerScore > 21) {
            endGame('Dealer busts! You win.');
            playerChips += currentBet * 2;
        } else if (dealerScore > playerScore) {
            endGame('Dealer wins.');
        } else if (dealerScore < playerScore) {
            endGame('You win!');
            playerChips += currentBet * 2;
        } else {
            endGame('It\'s a tie.');
            playerChips += currentBet;
        }
        updateChipsDisplay();
    }

    function endGame(message) {
        messageDiv.textContent = message;
        startGameBtn.disabled = false;
        hitBtn.disabled = true;
        standBtn.disabled = true;
    }

    function updateChipsDisplay() {
        chipsDiv.textContent = `Chips: ${playerChips}`;
    }

    updateChipsDisplay();
});
