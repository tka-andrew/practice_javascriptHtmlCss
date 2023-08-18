// Reference: https://www.youtube.com/watch?v=5hCBK9JPNtQ

const cards = document.querySelectorAll(".card"),
timeTag = document.querySelector(".time b"),
flipsTag = document.querySelector(".flips b"),
refreshBtn = document.querySelector(".details button"),
information = document.querySelector(".information");

let totalPairs = 8;
let maxTime = totalPairs * 3;
let timeLeft = maxTime;
let flips = 0;
let matchedCards = 0;
let disableDeck = false;
let isPlaying = false;
let cardOne, cardTwo, timer;
let cardTypes = ["bxl-facebook-circle", "bxl-adobe", "bxl-google", "bxl-twitter", "bxl-whatsapp", "bxl-linkedin-square", "bxl-skype",
"bxl-airbnb"];

function initTimer() {
    if (timeLeft <= 0) {
        if (matchedCards < totalPairs) {
            information.innerText = "You lose.\nClick refresh to start another game."
        }
        return clearInterval(timer);
    }
    timeLeft --;
    timeTag.innerText = timeLeft;
}

function flipCard({target: clickedCard}) {
    if (!isPlaying) {
        isPlaying = true;
        timer = setInterval(initTimer, 1000);
    }
    information.innerText = ""
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
        matchedCards++;
        if (matchedCards == totalPairs && timeLeft > 0) {
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
    }, 500);

    setTimeout(() => {
        cardOne.classList.remove("shake", "flip");
        cardTwo.classList.remove("shake", "flip");
        cardOne = cardTwo = "";
        disableDeck = false;
    }, 500)
}

function shuffleCards() {
    timeLeft = maxTime;
    flips = matchedCards = 0;
    cardOne = cardTwo = "";
    clearInterval(timer);
    timeTag.innerText = timeLeft;
    flipsTag.innerText = flips;
    disableDeck = isPlaying = false;

    let cardDecks = cardTypes.concat(cardTypes);
    cardDecks.sort(() => Math.random() > 0.5 ? 1 : -1);
    cards.forEach((card, index) => {
        card.classList.remove("flip");
        let iconTag = card.querySelector(".back-view i");
        setTimeout(() => {
            iconTag.classList.value = `bx ${cardDecks[index]}`
        }, 500);
        card.addEventListener("click", flipCard);
    });
}

shuffleCards();
refreshBtn.addEventListener("click", shuffleCards);
cards.forEach(card => {
    card.addEventListener("click", flipCard);
})