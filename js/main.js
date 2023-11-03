"use strict";

//START: Global variables-----------------------------------------------------------------
let globalResult = Object();
let gameID;
let direction = 1;
let colorPick;
let winnerOfThisRound;
let playerScores = [];

let isAPIQuerryInProgress;

let playersList = [];
let playersGlobal = [];
let player1Name, player2Name, player3Name, player4Name;


class Card {
    constructor(color, value) {
        this.Color = color;
        this.Value = value;
    }
}


//START: Modal and other functions to collect players' names------------------------------
function hasDuplicates(array) { // Function to check for duplicate names
    const lowerCaseNames = array.map(name => name.toLowerCase());
    return (new Set(lowerCaseNames)).size !== lowerCaseNames.length;
}

function assignTeams(players) { // Function to assign players to different houses
    const houses = ['Gryffindor', 'Hufflepuff', 'Ravenclaw', 'Slytherin'];
    const assignedTeams = [];
    for (let i = 0; i < players.length; i++) {
        const playerName = players[i];
        const house = houses[i];
        assignedTeams.push(`${playerName} goes to ${house}!`);
    }
    return assignedTeams;
}

function displayTeams(teams) { // Function to display assigned houses in the modal
    let formSection = document.querySelector('#formSection');
    formSection.innerHTML = '';
    const teamsDisplay = teams.join('<br>'); // Use '<br>' for line breaks
    document.getElementById('playerTeamMessage').innerHTML = teamsDisplay;
    document.getElementById('okButton').style.display = 'block';
}

document.getElementById('openModal1').addEventListener('click', function () { // Open the Modal dialog when the button is clicked
    $('#nameModal').modal('show');
});

document.getElementById('nameForm').addEventListener('submit', function (e) { // Handle form submission
    e.preventDefault(); // Prevent the form from submitting traditionally

    // Get player names from the input fields
    player1Name = document.getElementById('player1Name').value;
    player2Name = document.getElementById('player2Name').value;
    player3Name = document.getElementById('player3Name').value;
    player4Name = document.getElementById('player4Name').value;

    // Check for empty fields
    if (!player1Name || !player2Name || !player3Name || !player4Name) {
        alert('Please fill in all fields.');
        return; // Stop form submission
    }

    // Check for duplicate names
    if (hasDuplicates([player1Name, player2Name, player3Name, player4Name])) {
        alert('Please enter unique names. The same name cannot be used more than once.');
        return; // Stop form submission
    }

    // Add the names to the playersList array
    playersList = [player1Name, player2Name, player3Name, player4Name];
    playersGlobal = [document.getElementById("player1Name").value, document.getElementById("player2Name").value, document.getElementById("player3Name").value, document.getElementById("player4Name").value];

    // Assign players to different teams (Hogwart Houses)
    const teams = assignTeams([player1Name, player2Name, player3Name, player4Name]);

    // Display assigned teams in the modal
    displayTeams(teams);
});


//START: Functions for Design Elements--------------------------------------------Kata: start
function setDirection(direction) {
    const directionContainer = document.getElementById("directionContainer");

    if (direction === 1) { // im Uhrzeigersinn (clockwise)
        directionContainer.style.animationName = "rotateClockwise";
    } else { // gegen den Uhrzeigersinn (counterclockwise)
        directionContainer.style.animationName = "rotateCounterclockwise";
    }
}

function changeBGAfterStart() { //change background when entering Game Court
    // Hier setzt du das neue Hintergrundbild
    document.body.style.backgroundImage = 'url("./img/BGSpiel.jpg")';
    // neue schriftfarbe
    document.body.style.color = "white";
    //neue h1
    let gameMessageElement = document.getElementById("gameMessage");
    gameMessageElement.textContent = "No magic! Just logic!";

    // translucent black background
    let container = document.querySelector('#playground');
    container.classList.add('container1');


    let directionContainer = document.getElementById("directionContainer");
    let imageElement = document.createElement("img");
    imageElement.src = "./img/direction.png";
    directionContainer.appendChild(imageElement);
    imageElement.style.width = "100px";
    imageElement.style.height = "auto";
}


let audio = document.getElementById("myAudio");
let audioIcon = document.getElementById("audioIcon");

function toggleMute() { //audio button on nav bar
    if (audio.muted) {
        audio.muted = false;
        audioIcon.classList.remove("fa-volume-off");
        audioIcon.classList.add("fa-volume-up");
    } else {
        audio.muted = true;
        audioIcon.classList.remove("fa-volume-up");
        audioIcon.classList.add("fa-volume-off");
    }
}

function playAudioLoop() {
    audio.loop = true; // Setzt das loop-Attribut auf true
    audio.play(); // Startet die Wiedergabe
    toggleMute(); // Fügt das Toggle-Mute-Verhalten hinzu
}

// Finde das fliegende Bild und den Open Modal Button
let flyingImage = document.getElementById("fliegendesBild");
let okButton = document.getElementById("okButton");

// Hält die Animation an und blendet das Bild aus, wenn der Button geklickt wird
okButton.addEventListener("click", function () {
    flyingImage.style.animationPlayState = "paused";
    flyingImage.style.display = "none";
});

function wrongCardAnimation(card) {
    let playerID = getCurrentPlayerID();
    let cardID = getCardID(playerID, card);
    const discardCard = document.getElementById("discardCardDiv");
    discardCard.classList.add("wrongCard")
    const wrongCardDiv = document.getElementById('cardContainer' + playerID).children;
    const wrongCard = wrongCardDiv.item(cardID);
    wrongCard.classList.add("wrongCard");

    setTimeout(() => {
        wrongCard.classList.remove("wrongCard");
        discardCard.classList.remove("wrongCard");
    }, 2000);
}

function correctCardAnimation(currentPlayerId, card) {
    let cardId = getCardID(currentPlayerId, card);
    const correctCardDiv = document.getElementById('cardContainer' + currentPlayerId).children;
    const correctCard = correctCardDiv.item(cardId);
    correctCard.classList.add("bigcard");

    setTimeout(() => {
        correctCard.classList.remove("bigcard");
    }, 2000);
}

function displayPlayerDivHeaders() {
    let pl1Name = document.getElementById("pl1Name");
    pl1Name.innerHTML = player1Name;

    let pl2Name = document.getElementById("pl2Name");
    pl2Name.innerHTML = player2Name;

    let pl3Name = document.getElementById("pl3Name");
    pl3Name.innerHTML = player3Name;

    let pl4Name = document.getElementById("pl4Name");
    pl4Name.innerHTML = player4Name;
}
//------------------------------------------------------------------------------Kata: ende
//START: Functions to setup and initiate game-----------------------------------

function distributeCards(playerID, htmlID) {
    const baseUrl = "./img/cards/";

    let playerSection = document.getElementById(htmlID);
    let cardContainer = document.createElement('div');
    playerSection.appendChild(cardContainer);
    cardContainer.id = 'cardContainer' + playerID;
    cardContainer.class = "card-container";

    let newCard;
    let i = 0;

    while (i < globalResult.Players[playerID].Cards.length) {
        const cardimg = document.createElement('img');
        cardimg.classList.add('card'); // Apply a CSS class for styling

        let color = globalResult.Players[playerID].Cards[i].Color;
        let number = globalResult.Players[playerID].Cards[i].Value;
        newCard = new Card(color, number);
        let cardImageUrl = `${baseUrl}${newCard.Color}${newCard.Value}.png`;
        cardimg.src = cardImageUrl;

        cardContainer.appendChild(cardimg);
        i++;
    }
}

function distributeCardsAfterGameStarts() {
    playersGlobal.forEach(playerName => {
        const li = document.createElement("li");
        const span = document.createElement("span");
        li.appendChild(span);
        span.textContent = playerName;
    });

    let cleanThisDiv = document.querySelector('#homeMessage');
    cleanThisDiv.innerHTML = '';

    displayPlayerDivHeaders();
    distributeCards(0, "player1Place");
    distributeCards(1, "player2Place");
    distributeCards(2, "player3Place");
    distributeCards(3, "player4Place");
}


function setupDrawPile() { //Construct draw pile and create div for draw pile

    let gameCourt = document.getElementById('gameCourt');
    let drawPileDiv = document.createElement('div');
    drawPileDiv.id = 'drawPileDiv';

    let drawPileImg = document.createElement('img');
    drawPileImg.classList.add('drawPileCard');
    drawPileImg.src = './img/cards/back0.png';

    drawPileDiv.appendChild(drawPileImg)
    gameCourt.appendChild(drawPileDiv);

    drawPileDiv.addEventListener('click', function () {
        drawCardFromAPI();
    })
}

function displayTopCard() { //Construct a discard pile and create div for discard pile
    const baseUrl = "./img/cards/";

    //construct card image
    let discardCard;
    const discardimg = document.createElement('img');
    discardimg.classList.add('discardCard'); // Apply a CSS class for styling

    let color = globalResult.TopCard.Color;
    let value = globalResult.TopCard.Value;

    if (value > 12) {
        discardCard = new Card(colorPick, value);
    } else {
        discardCard = new Card(color, value);
    }
    let discardImageUrl = `${baseUrl}${discardCard.Color}${discardCard.Value}.png`;

    discardimg.src = discardImageUrl;

    let gameCourt = document.getElementById('gameCourt');
    let discardCardDiv = document.createElement('div');
    discardCardDiv.id = "discardCardDiv"

    gameCourt.appendChild(discardCardDiv);

    //construct div for the card image
    let discardCardImageDiv = document.createElement('div');
    discardCardImageDiv.appendChild(discardimg);
    discardCardDiv.appendChild(discardCardImageDiv);
}

function showPlayerScores() { //player's total scores based on the cards they have
    let span;
    let scoreDiv;
    let playerScore;
    for (let i = 0; i < 4; i++) {
        scoreDiv = document.getElementById('score' + (i + 1));
        scoreDiv.innerHTML = '';
        playerScore = 0;
        for (let j = 0; j < globalResult.Players[i].Cards.length; j++) {
            playerScore = playerScore += globalResult.Players[i].Cards[j].Score;
        }
        span = document.createElement('span');
        scoreDiv.appendChild(span);
        span.textContent = "Score: " + playerScore;
    }
}

function initializePlayerScores() {
    // Initialize playerScores with initial scores, perhaps on the first round
    for (let i = 0; i < globalResult.Players.length; i++) {
        playerScores[i] = 0;
    }
}

function initializeScoreBoard() {
    const scoreBoard = document.getElementById("scoreBoard");

    initializePlayerScores();

    let table = document.createElement("table");

    // Create a row for the table title "Score Board"
    let titleRow = document.createElement("tr");
    let titleCell = document.createElement("th");
    titleCell.textContent = "Score Board";
    titleCell.setAttribute("colspan", "2"); // Spanning across the two columns
    titleRow.appendChild(titleCell);
    table.appendChild(titleRow);

    // Create a row for column headings
    let headingRow = document.createElement("tr");
    let playerHeading = document.createElement("th");
    playerHeading.textContent = "Player Names";
    let scoreHeading = document.createElement("th");
    scoreHeading.textContent = "Scores";
    headingRow.appendChild(playerHeading);
    headingRow.appendChild(scoreHeading);
    table.appendChild(headingRow);

    // Iterate through player data and create rows for each player
    for (let i = 0; i < globalResult.Players.length; i++) {
        let player = globalResult.Players[i];

        let row = document.createElement("tr");

        let playerNameCell = document.createElement("td");
        playerNameCell.textContent = player.Player;

        let scoreCell = document.createElement("td");
        scoreCell.textContent = playerScores[i];

        row.appendChild(playerNameCell);
        row.appendChild(scoreCell);

        table.appendChild(row);
    }

    scoreBoard.appendChild(table);
}

// show the cards of this player
function showThisPlayerCards(playerID) {
    let baseUrl = './img/cards/';
    let currentPlayerCardDiv = document.getElementById('cardContainer' + playerID);
    currentPlayerCardDiv.innerHTML = '';

    currentPlayerCardDiv.id = 'cardContainer' + playerID;
    currentPlayerCardDiv.classList.add = 'card-container';

    let newCard;

    for (let i = 0; i < globalResult.Players[playerID].Cards.length; i++) {
        const cardimg = document.createElement('img');
        cardimg.classList.add('card'); // Apply a CSS class for styling

        let color = globalResult.Players[playerID].Cards[i].Color;
        let number = globalResult.Players[playerID].Cards[i].Value;
        newCard = new Card(color, number);
        let cardImageUrl = `${baseUrl}${newCard.Color}${newCard.Value}.png`;
        cardimg.src = cardImageUrl;

        currentPlayerCardDiv.appendChild(cardimg);

        cardimg.addEventListener('click', async function () { //we add an eventListener for each image.
            if (color === 'Black') {
                await openColorPickModal(globalResult.Players[playerID].Cards[i]);
            } else {
                playerPlaysACard(globalResult.Players[playerID].Cards[i], colorPick);
            }
        });
    }
}

// hide the cards of this player
function putThisPlayerCardsUpsideDown(playerID) {
    let notCurrentPlayerCardDiv = document.getElementById('cardContainer' + playerID);
    notCurrentPlayerCardDiv.innerHTML = '';

    notCurrentPlayerCardDiv.id = 'cardContainer' + playerID;
    notCurrentPlayerCardDiv.classList.add = 'card-container';

    let i = 0;

    while (i < globalResult.Players[playerID].Cards.length) {
        const backCardImg = document.createElement('img');
        backCardImg.classList.add('card'); // Apply a CSS class for styling
        backCardImg.src = './img/cards/back0.png';

        notCurrentPlayerCardDiv.appendChild(backCardImg);
        i++;
    }
}

// To show/hide players' hand based on whose turn it is
function showCurrentPlayer() {
    let playerIndex = getCurrentPlayerID();

    for (let i = 0; i <= 3; i++) {
        if (i === playerIndex) {
            showThisPlayerCards(i);

        } else {
            putThisPlayerCardsUpsideDown(i)
        }
    }
}

function updateScoreboard() {
    // Clear the scoreboard div before updating it with the new content
    const scoreBoard = document.getElementById("scoreBoard");
    scoreBoard.innerHTML = '';

    let playerScores = calculateWinnerScore();

    let table = document.createElement("table");

    // Create a row for the table title "Score Board"
    let titleRow = document.createElement("tr");
    let titleCell = document.createElement("th");
    titleCell.textContent = "Score Board";
    titleCell.setAttribute("colspan", "2"); // Spanning across the two columns
    titleRow.appendChild(titleCell);
    table.appendChild(titleRow);

    // Create a row for column headings
    let headingRow = document.createElement("tr");
    let playerHeading = document.createElement("th");
    playerHeading.textContent = "Player Names";
    let scoreHeading = document.createElement("th");
    scoreHeading.textContent = "Scores";
    headingRow.appendChild(playerHeading);
    headingRow.appendChild(scoreHeading);
    table.appendChild(headingRow);

    // Iterate through player data and create rows for each player
    for (let i = 0; i < globalResult.Players.length; i++) {
        let player = globalResult.Players[i];

        let row = document.createElement("tr");

        let playerNameCell = document.createElement("td");
        playerNameCell.textContent = player.Player;

        let scoreCell = document.createElement("td");
        scoreCell.textContent = playerScores[i];

        row.appendChild(playerNameCell);
        row.appendChild(scoreCell);

        table.appendChild(row);
    }

    scoreBoard.appendChild(table);
}


function calculateWinnerScore() {
    let winnerScoreThisRound = 0;

    for (let i = 0; i < globalResult.Players.length; i++) {
        if (globalResult.Players[i].Player !== winnerOfThisRound) {
            winnerScoreThisRound = winnerScoreThisRound + globalResult.Players[i].Score;
        }
    }

    for (let i = 0; i < globalResult.Players.length; i++) {
        if (globalResult.Players[i].Player === winnerOfThisRound) {
            playerScores[i] = playerScores[i] + winnerScoreThisRound;
            winnerOfThisRound = '';
        } else {
            playerScores[i] = playerScores[i] + 0;
        }

    }
    return playerScores;
}


function checkIfWinner() {
    for (let i = 0; i < 4; i++) {
        if (globalResult.Players[i].Cards.length === 0) {
            winnerOfThisRound = globalResult.Players[i].Player;
            console.log(winnerOfThisRound + ' has no more cards left!');
            return true;
        }
    }
    return false;
}


async function getTopCardFromAPI() {
    let URL = `https://nowaunoweb.azurewebsites.net/api/game/topCard/${gameID}`;
    let response = await fetch(URL,
        {
            method: "GET", headers: {
                "Content-type": "application/json; charset=UTF-8",
            }
        });

    let apiTopCard = await response.json();

    if (response.ok) {
        globalResult.TopCard = apiTopCard;
    } else {
        alert("HTTP-Error: " + response.status);
    }
}


async function drawCardFromAPI() {
    let playerID = getCurrentPlayerID();
    let response = await fetch("https://nowaunoweb.azurewebsites.net/api/Game/DrawCard/" + gameID, {
        method: "PUT",
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        }
    });

    let apiResponseToDrawCard = await response.json();

    if (response.ok) {
        let drawnCard = apiResponseToDrawCard.Card;
        globalResult.Players[playerID].Cards.push(drawnCard);
        globalResult.Player = apiResponseToDrawCard.Player;
        globalResult.NextPlayer = apiResponseToDrawCard.NextPlayer;
        console.log(globalResult.Players[playerID].Player + ' drawn a card!');
        console.log('Next Player: ' + globalResult.NextPlayer);
    } else {
        alert("HTTP-Error: " + response.status);
    }
    showCurrentPlayer();
}



//return index of Current Player
function getCurrentPlayerID() {
    for (let i = 0; i <= 3; i++) {
        if (globalResult.NextPlayer === playersList[i]) {
            return i;
        }
    }
}



//search and return index of card
function getCardID(playerID, card) {
    let searchedCard;

    for (let i = 0; i < globalResult.Players[playerID].Cards.length; i++) {
        if (globalResult.Players[playerID].Cards[i].Color === card.Color && globalResult.Players[playerID].Cards[i].Value === card.Value) {
            searchedCard = new Card(globalResult.Players[playerID].Cards[i].Color, globalResult.Players[playerID].Cards[i].Value);
            return i;
        }
    }
}



async function startNewGame() { // Async function necessary for Promise
    try {
        // We start the connection request 
        // then wait for promise (alternatively fetch, then notation)
        let response = await fetch('https://nowaunoweb.azurewebsites.net/api/game/start',
            {
                method: 'POST',
                body: JSON.stringify(playersList), // Send the names entered in the form
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            });

        if (response.ok) {
            globalResult = await response.json(); // Assign the response data to globalResult
            playersGlobal = playersList; // Replace the player names with the names entered in the form
            gameID = globalResult.Id;
            return globalResult;
        } else {
            alert("HTTP-Error: " + response.status);
        }
    }
    catch {
        console.error("Error in startNewGame:", error);
    }
}


document.getElementById('okButton').addEventListener('click', async function () { // Handle "OK" button click to close the modal and start game
    $('#nameModal').modal('hide');
    await startNewGame();
    changeBGAfterStart();
    //initializeScoreBoard(); //set all scores on scoreboard to 0;
    distributeCardsAfterGameStarts();

    if (globalResult.TopCard.Value === 12) {
        changeDirection();
    }

    displayTopCard();
    setupDrawPile();
    showCurrentPlayer();
    showPlayerScores();

});


async function updateAllPlayersCards() {
    let name;
    let URL;

    for (let i = 0; i < 4; i++) {
        name = globalResult.Players[i].Player;
        URL = `https://nowaunoweb.azurewebsites.net/api/Game/GetCards/${gameID}?playerName=${name}`;

        let response = await fetch(URL,
            {
                method: "GET", headers: {
                    "Content-type": "application/json; charset=UTF-8",
                }
            });

        let apiResponseToUpdatePlayerCards = await response.json();

        if (response.ok) {
            globalResult.Players[i].Cards = apiResponseToUpdatePlayerCards.Cards;
            globalResult.Players[i].Score = apiResponseToUpdatePlayerCards.Score;
        } else {
            alert("HTTP-Error: " + response.status);
        }
    }
}


async function updateThisPlayerCards(playerID) {
    let name = globalResult.Players[playerID].Player;
    let URL = `https://nowaunoweb.azurewebsites.net/api/Game/GetCards/${gameID}?playerName=${name}`;

    let response = await fetch(URL,
        {
            method: "GET", headers: {
                "Content-type": "application/json; charset=UTF-8",
            }
        });

    let apiResponseToUpdatePlayerCards = await response.json();

    if (response.ok) {
        globalResult.Players[playerID].Cards = apiResponseToUpdatePlayerCards.Cards;
        globalResult.Players[playerID].Score = apiResponseToUpdatePlayerCards.Score;
    } else {
        alert("HTTP-Error: " + response.status);
    }
}


async function openColorPickModal(card) {
    let colorModal = document.getElementById('colorModal');
    let colorImages = document.querySelectorAll('.color-image');

    colorModal.style.display = 'block';

    colorImages.forEach(function (image) {
        image.addEventListener('click', function () {
            colorPick = image.getAttribute('data-color');
            console.log('Selected color: ' + colorPick);
            colorModal.style.display = 'none';
            playerPlaysACard(card, colorPick);
        });
    });
    //delay(500);
    return colorPick;
}


function changeDirection() {
    direction = direction * (-1);
    setDirection(direction);
}

async function checkIfPlayerCanOnlyPlayDraw4() {
    let color = globalResult.TopCard.Color;
    let value = globalResult.TopCard.Value;
    let currentPlayerIndex = getCurrentPlayerID();

    let currentPlayersHand = globalResult.Players[currentPlayerIndex].Cards;

    for (let i = 0; i < currentPlayersHand.length; i++) {
        if (globalResult.Players[currentPlayerIndex].Cards[i].Color === color || globalResult.Players[currentPlayerIndex].Cards[i].Value === value) {
            return false;
        }
    }
    return true;
}


async function checkPlayedCardValiditiyBeforeSendingToAPI(card) {
    let topCard = globalResult.TopCard;

    if (card.Value === 13) { //changeColor and +4 
        if (await checkIfPlayerCanOnlyPlayDraw4()) {
            console.log('This player HAS NO other cards to play except +4');
            return true;

        } else {
            wrongCardAnimation(card);
            console.log('Card is invalid because player has other cards to play.');
            return false;

        }
    } else if (card.Value === 14) { // just changeColor
        console.log('Card is valid because its a joker');
        return true;
    } else if (topCard.Value === card.Value || topCard.Color === card.Color) {
        console.log('Card is valid based on color or value!');
        return true;
    } else if (colorPick === card.Color) {
        console.log('Card is valid based on colorPick');
        return true;
    } else {
        console.log('You cant play this invalid card!');
        return false;
    }
    //await delay(300);
}


// send played/chosen card to the server
async function sendPlayedCardToAPI(playerID, card, colorPick) {

    if (isAPIQuerryInProgress) {
        return;
    }

    isAPIQuerryInProgress = true;

    let URL = `https://nowaunoweb.azurewebsites.net/api/Game/PlayCard/${gameID}?value=${card.Value}&color=${card.Color}&wildColor=${colorPick}`;

    try {
        let response = await fetch(URL,
            {
                method: "PUT",
                dataType: "json",
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
            }
        );

        let apiResponseToPlayedCard = await response.json();

        if (response.ok) {
            console.log(response.status);
            globalResult.Player = apiResponseToPlayedCard.Player;
            globalResult.NextPlayer = apiResponseToPlayedCard.Player;
            // console.log(globalResult.Players[playerID].Player + ' is done playing a card!');
            console.log('Next Player:  ' + globalResult.NextPlayer);

            if (card.Value < 12) {
                colorPick = card.Color;
            }

            if (card.Value === 12) {
                changeDirection();
            }

            if (card.Value === 14) { //because this is such a problematic card it has its own steNextPlayer Function
                setNextPlayer(playerID);
            }


        } else {
            alert("HTTP-Error: " + response.status);
        }
    }
    catch (error) {
        console.log(error);

    } finally {
        isAPIQuerryInProgress = false;
    }

}

async function updatePlayersHand(card, playerID) {
    if (card.Value === 10 || card.Value === 13) {
        let getsPenaltyCards = penalizedPlayer(playerID);
        await updateThisPlayerCards(getsPenaltyCards);
        await updateThisPlayerCards(playerID);
    } else {
        await updateThisPlayerCards(playerID);
    }
}

async function updateFrontEnd(card, playerID) {
    await updatePlayersHand(card, playerID);
    let isWinner = checkIfWinner();
    if (isWinner) {
        updateScoreboard();
        openWinnerModal(winnerOfThisRound); //after this part we can decide how to end the game
    }
    else {
        await getTopCardFromAPI();
        displayTopCard();
        showCurrentPlayer();
        showPlayerScores();
    }
}



//LOGIC for when a player plays a card
async function playerPlaysACard(card, colorPick) {
    let cardValid = await checkPlayedCardValiditiyBeforeSendingToAPI(card);
    let chosenColor = colorPick;
    let playerID = getCurrentPlayerID();

    if (cardValid) {
        correctCardAnimation(playerID, card);
        if (!isAPIQuerryInProgress) {
            await sendPlayedCardToAPI(playerID, card, chosenColor);
        }
    } else {
        wrongCardAnimation(card);
        console.log('INVALID CARD!');
        return;
    }

    await updateFrontEnd(card, playerID);
    //await delay(300);
}


function displayWinner(player) { // Function to display assigned houses in the modal
    let formSection = document.querySelector('#formSection');
    formSection.innerHTML = '';
    const teamsDisplay = teams.join('<br>'); // Use '<br>' for line breaks
    document.getElementById('playerTeamMessage').innerHTML = teamsDisplay;
    document.getElementById('okButton').style.display = 'block';
}


async function openWinnerModal(playerName) {
    let winnerModal = document.getElementById('winnerModal');
    let nameDiv = document.getElementById('winnerName');
    let h1 = document.createElement('h1');

    winnerModal.style.display = 'block';
    h1.innerText = playerName;

    nameDiv.appendChild(h1);
    initializeScoreBoard();

    let anotherRound = document.getElementById('anotherRound');
    let endGame = document.getElementById('endGame');

    anotherRound.addEventListener('click', function () {
        winnerModal.style.display = 'none';
        startNewGame();
    });

    endGame.addEventListener('click', function () {
        winnerModal.style.display = 'none';
    });

}





function setNextPlayer(thisPlayerIndex) {
    let newPlayerIndex;

    if (direction === 1) { //if clockwise
        newPlayerIndex = thisPlayerIndex + 1;
        if (newPlayerIndex > 3) {
            newPlayerIndex = 0;
        }
        if (newPlayerIndex < 0) {
            newPlayerIndex = 3;
        }
    } else { //if counterclockwise
        newPlayerIndex = thisPlayerIndex - 1;
        if (newPlayerIndex > 3) {
            newPlayerIndex = 0;
        }
        if (newPlayerIndex < 0) {
            newPlayerIndex = 3;
        }
    }

    globalResult.NextPlayer = globalResult.Players[newPlayerIndex].Player;
    globalResult.Player = globalResult.Players[newPlayerIndex].Player;
    console.log('Player after SetNextPlayer function: ' + globalResult.Players[newPlayerIndex].Player);
}

function penalizedPlayer(previousPlayerIndex) {
    let penalizedPlayerID;

    if (direction === 1) { //if clockwise
        penalizedPlayerID = previousPlayerIndex + 1;
        if (penalizedPlayerID > 3) {
            penalizedPlayerID = 0;
        }
        if (penalizedPlayerID < 0) {
            penalizedPlayerID = 3;
        }
    } else { //if counterclockwise
        penalizedPlayerID = previousPlayerIndex - 1;
        if (penalizedPlayerID > 3) {
            penalizedPlayerID = 0;
        }
        if (penalizedPlayerID < 0) {
            penalizedPlayerID = 3;
        }
    }
    return penalizedPlayerID;

}









//---Don't delete yet, i might need to recycle some of it-------

/*

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


//retrieve playerID based on player's name
function getIdOfThisPlayer(nameOfPlayer) {
    for (let i = 0; i <= 3; i++) {
        if (globalResult.Players[i].Player === nameOfPlayer) {
            return i;
        }
    }
} */

/* determines next turn
async function determineTheNextPlayer(card) {
    globalResult.TopCard = card;
    let currentPlayerIndex = getCurrentPlayerID();

    if (card.Value < 10) { //0-9 regular cards
        setNextPlayer(currentPlayerIndex);
    }
    if (card.Value === 12) { //reverse card
        changeDirection(currentPlayerIndex);
    }
    if (card.Value === 11) {//skip card
        skipNextPlayer(currentPlayerIndex);
    }
    if (card.Value === 10) { //+2 cards
        await updateAllPlayersCards();
        skipNextPlayer(currentPlayerIndex);
        console.log('next player got penalized and is skipped');
    }
    if (card.Value === 13) {// +4 and changeColor card
        await updateAllPlayersCards();
        console.log('next player got penalized and is skipped');
        skipNextPlayer(currentPlayerIndex);
    }
    if (card.Value === 14) { // only changeColor card
        setNextPlayer(currentPlayerIndex);
    } else {
    }

    if (card.Value < 13) {
        colorPick = card.Color;
    }

    showCurrentPlayer();
    delay(300);
}
*/

/*

function skipNextPlayer(thisPlayerIndex) {
    let newPlayerIndex;
    if (thisPlayerIndex == 0) {
        newPlayerIndex = 2;
    } else if (thisPlayerIndex == 1) {
        newPlayerIndex = 3;
    } else if (thisPlayerIndex == 2) {
        newPlayerIndex = 0;
    } else if (thisPlayerIndex == 3) {
        newPlayerIndex = 1;
    }

    globalResult.NextPlayer = globalResult.Players[newPlayerIndex].Player;
    console.log('Player to play next after a SKIP CARD is played is: ' + globalResult.NextPlayer);
}

function getNextTurn(thisPlayerIndex) { //player to play next
    let newPlayerIndex;
    if (direction === 1) { //if clockwise
        newPlayerIndex = thisPlayerIndex + 1;
        if (newPlayerIndex > 3) {
            newPlayerIndex = 0;
        }
        if (newPlayerIndex < 0) {
            newPlayerIndex = 3;
        }
    } else { //if counterclockwise
        newPlayerIndex = thisPlayerIndex - 1;
        if (newPlayerIndex > 3) {
            newPlayerIndex = 0;
        }
        if (newPlayerIndex < 0) {
            newPlayerIndex = 3;
        }
    }
    return newPlayerIndex;
}
*/

/*
function changeDirection(currentPlayerIndex) {
    let newPlayerIndex;

    if (direction === 1) { //if clockwise so we set it to counter cloackwise
        newPlayerIndex = currentPlayerIndex - 1;
    } else { // else set to clockwise
        newPlayerIndex = currentPlayerIndex + 1;
    }

    if (newPlayerIndex > 3) {
        newPlayerIndex = 0;
    } else if (newPlayerIndex < 0) {
        newPlayerIndex = 3;
    }

    direction = direction * (-1); //reverse the direction by changing this value

    globalResult.NextPlayer = globalResult.Players[newPlayerIndex].Player;
    globalResult.Player = globalResult.Players[newPlayerIndex].Player;
    console.log('Next player after ChangeDirection function ' + globalResult.Players[newPlayerIndex].Player);

    setDirection(direction);
} */


/*async function playerDrawsACard() {
    let playerID = getCurrentPlayerID();
    let topCard = globalResult.TopCard;
    
    
    if (topCard.Value === 10 || topCard.Value === 11 || topCard.Value === 13) {
        let playerToDrawCard = getNextTurn(playerID);
        await drawCardFromAPI(playerToDrawCard);
    } else {
        await drawCardFromAPI(playerID);
    } 
    console.log('It\'s' + globalResult.Player + '\'s turn now!');
    delay(300);
}
*/
