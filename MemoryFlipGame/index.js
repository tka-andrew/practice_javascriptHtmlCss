// Reference: https://www.youtube.com/watch?v=5hCBK9JPNtQ

const cardList = document.querySelector(".cards"),
    timeTag = document.querySelector(".time b"),
    flipsTag = document.querySelector(".flips b"),
    refreshBtn = document.querySelector(".details button"),
    information = document.querySelector(".information"),
    gameLevelSelection = document.querySelector(".level-settings select");

const levelSettings = {
    1: {
        pairs: 8,
        cardWidth: '350px',
        maxTime: 32,
    },
    2: {
        pairs: 8,
        cardWidth: '350px',
        maxTime: 24
    },
    3: {
        pairs: 12,
        cardWidth: '520px',
        maxTime: 60
    },
    4: {
        pairs: 12,
        cardWidth: '520px',
        maxTime: 48
    },
    5: {
        pairs: 16,
        cardWidth: '670px',
        maxTime: 96
    },
    6: {
        pairs: 16,
        cardWidth: '670px',
        maxTime: 80
    }
}
let totalPairs = 8;
let timeLeft = 20;
let flips = 0;
let matchedPairs = 0;
let disableDeck = false;
let isPlaying = false;
let cardOne, cardTwo, timer;
const cardTypes = ["bxl-facebook-circle", "bxl-adobe", "bxl-google", "bxl-twitter", "bxl-whatsapp", "bxl-linkedin-square", "bxl-skype",
    "bxl-airbnb", "bxl-meta", "bxl-tiktok", "bxl-sketch", "bxl-steam", "bxl-trip-advisor", "bxl-unity",
    "bxl-discord-alt", "bxl-instagram-alt"];

function initTimer() {
    if (timeLeft <= 0) {
        if (matchedPairs < totalPairs) {
            let percentage = Math.floor(matchedPairs / totalPairs * 100)
            information.innerText = `You lose. Result: ${percentage}%\nClick refresh to start another game.`
        }
        return clearInterval(timer);
    }
    timeLeft--;
    timeTag.innerText = timeLeft;
}

function flipCard({ target: clickedCard }) {
    if (!isPlaying) {
        isPlaying = true;
        timer = setInterval(initTimer, 1000);
        if (flips == 0) {
            information.innerText = ""
        }
    }
    if (clickedCard !== cardOne && !disableDeck && timeLeft > 0) {
        flips++;
        flipsTag.innerText = flips;
        clickedCard.classList.add("flip");
        if (!cardOne) {
            return cardOne = clickedCard;
        }
        cardTwo = clickedCard;
        disableDeck = true;
        let cardOneIcon = cardOne.querySelector(".back-view i").classList.value;
        let cardTwoIcon = cardTwo.querySelector(".back-view i").classList.value;
        matchCards(cardOneIcon, cardTwoIcon);
    }
}

function matchCards(icon1, icon2) {
    if (icon1 == icon2) {
        matchedPairs++;
        if (matchedPairs == totalPairs && timeLeft > 0) {
            information.innerText = "You win!!!\nClick refresh to start another game."
            return clearInterval(timer);
        }
        cardOne.removeEventListener("click", flipCard);
        cardTwo.removeEventListener("click", flipCard);
        cardOne = cardTwo = "";
        return disableDeck = false;
    }

    setTimeout(() => {
        cardOne.classList.add("shake");
        cardTwo.classList.add("shake");
    }, 600);

    setTimeout(() => {
        cardOne.classList.remove("shake", "flip");
        cardTwo.classList.remove("shake", "flip");
        cardOne = cardTwo = "";
        disableDeck = false;
    }, 800)
}

function initGame() {
    let gameLevel = gameLevelSelection.value;
    totalPairs = levelSettings[gameLevel].pairs;
    cardList.style.width = levelSettings[gameLevel].cardWidth;

    while (cardList.lastChild) {
        cardList.removeChild(cardList.lastChild);
    }

    for (let i = 0; i < totalPairs * 2; ++i) {
        const cardItem = document.createElement('li');
        cardItem.classList.add('card');

        const frontView = document.createElement('div');
        frontView.classList.add('view', 'front-view');
        frontView.innerHTML = '<i class="bx bx-question-mark"></i>';

        const backView = document.createElement('div');
        backView.classList.add('view', 'back-view');
        backView.innerHTML = '<i class="bx"></i>';

        cardItem.appendChild(frontView);
        cardItem.appendChild(backView);

        cardList.appendChild(cardItem);
    }
    shuffleCards();
}

function shuffleCards() {
    let gameLevel = gameLevelSelection.value;
    timeLeft = levelSettings[gameLevel].maxTime;;
    flips = matchedPairs = 0;
    cardOne = cardTwo = "";
    clearInterval(timer);
    timeTag.innerText = timeLeft;
    flipsTag.innerText = flips;
    information.innerText = 'Flip any card to start the game.';
    disableDeck = isPlaying = false;

    let randomCardTypes = cardTypes;
    randomCardTypes = randomCardTypes.sort(() => Math.random() > 0.5 ? 1 : -1).slice(0, totalPairs);
    let cardDecks = randomCardTypes.concat(randomCardTypes);
    cardDecks.sort(() => Math.random() > 0.5 ? 1 : -1);
    document.querySelectorAll(".card").forEach((card, index) => {
        card.classList.remove("flip");
        let iconTag = card.querySelector(".back-view i");
        setTimeout(() => {
            iconTag.classList.value = `bx ${cardDecks[index]}`
        }, 500);
        card.addEventListener("click", flipCard);
    });
}

gameLevelSelection.onchange = initGame;

initGame();
refreshBtn.addEventListener("click", shuffleCards);
document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", flipCard);
})
