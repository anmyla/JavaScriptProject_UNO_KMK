"use strict";

//START: Global variables-----------------------------------------------------------------
let playersList = [];
let playersGlobal = [];
let globalResult = Object();
let gameID;
let direction = 1;
let player1Name, player2Name, player3Name, player4Name;
let colorPick;
let winner;


class Card {
    constructor(color, number) {
        this.Color = color;
        this.Number = number;
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




//START: Functions for Design Elements---------------------------------Kata: start
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

//-----------------------------------------------------------------Kata: ende


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

        let colorInput = globalResult.Players[playerID].Cards[i].Color;
        let numberInput = Number(globalResult.Players[playerID].Cards[i].Value);
        newCard = new Card(colorInput, numberInput);
        let cardImageUrl = `${baseUrl}${newCard.Color}${newCard.Number}.png`;
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

//return index of Current Player
function getCurrentPlayerID() {
    for (let i = 0; i <= 3; i++) {
        if (globalResult.NextPlayer === playersList[i]) {
            return i;
        }
    }
}

//retrieve playerID based on player's name
function getIdOfThisPlayer(nameOfPlayer) {
    for (let i = 0; i <= 3; i++) {
        if (globalResult.Players[i].Player === nameOfPlayer) {
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
            console.log('this card must be removed from the players hand: ' + searchedCard.Color + searchedCard.Value);
            return i;
        }
    }
    if (searchedCard == undefined) {
        alert('For some unknown reason, this card cant be found!');
    }
}


function displayTopCard() { //Construct a discard pile and create div for discard pile
    const baseUrl = "./img/cards/";

    //construct card image
    let discardCard;
    const discardimg = document.createElement('img');
    discardimg.classList.add('discardCard'); // Apply a CSS class for styling

    let colorInput = globalResult.TopCard.Color;
    let numberInput = Number(globalResult.TopCard.Value);
    discardCard = new Card(colorInput, numberInput);
    let discardImageUrl = `${baseUrl}${discardCard.Color}${discardCard.Number}.png`;
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

function displayPlayerDivHeaders() {
    let pl1Name = document.getElementById("pl1Name");
    pl1Name.innerHTML = player1Name;

    let pl2Name = document.getElementById("pl2Name");
    pl2Name.innerHTML = player2Name;

    let pl3Name = document.getElementById("pl3Name");
    pl3Name.innerHTML = player3Name;

    let pl4Name = document.getElementById("pl4Name");
    pl4Name.innerHTML = player4Name;

    let scoreOne = document.getElementById("score1");
    score1.innerHTML = scoreOne;
    scoreOne.textContent = 'Score';

    let scoreTwo = document.getElementById("score2");
    score2.innerHTML = scoreTwo;
    scoreTwo.textContent = 'Score';

    let scoreThree = document.getElementById("score3");
    score3.innerHTML = scoreThree;
    scoreThree.textContent = 'Score';

    let scoreFour = document.getElementById("score4");
    score4.innerHTML = scoreFour;
    scoreFour.textContent = 'Score';
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



function checkIfWinner(currentPlayerID) {
    if (globalResult.Players[currentPlayerID].Cards === null) {
        winner = globalResult.Players[currentPlayerID].Player;
    }
    console.log(winner + 'has no more cards left!');
    alert(winner + ' has won this round!');
}



/*
async function checksIfPlayerHasCardToPlay(playerIndex) {
    let topCard = globalResult.TopCard;
    let playersHand = globalResult.Players[playerIndex].Cards;
    let playerCard;
    let hasCardToPlay = false;

    for (let i = 0; i < playersHand.length; i++) {
        playerCard = playersHand[i];

        if (topCard.Color === playerCard.Color ||
            colorPick === playerCard.Color ||
            topCard.Value === playerCard.Value ||
            playerCard.Value === 14) {
            hasCardToPlay = true;
        } else if (topCard.Value !== 13 && playerCard.Value === 13) {
            hasCardToPlay = true;
        } 
    }
    return hasCardToPlay;
} */

async function drawCardFromAPI(playerID) {
    //let playerID = getCurrentPlayerID();
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
        console.log(globalResult.Players[playerID].Player + 'drawn a card!');
    } else {
        alert("HTTP-Error: " + response.status);
    }

    showCurrentPlayer();
}


async function playerDrawsACard() {
    /*  let hasCards = checksIfPlayerHasCardToPlay(playerID);
      if (hasCards) {
          alert('You have a card to play! You dont need to draw a card!');
      } else { */
    let playerID = getCurrentPlayerID();
    let topCard = globalResult.TopCard;
    if (topCard.Value === 10 || topCard.Value === 11 || topCard.Value === 13) {
        let playerToDrawCard = getNextTurn(playerID);
        await drawCardFromAPI(playerToDrawCard);

        //Remove value of TOPCARD so it will not do double penalty
        globalResult.TopCard.Value = '';

    } else {
        await drawCardFromAPI(playerID);
    }
}



function setupDrawPile() { //Construct draw pile and create div for draw pile
    let playerID = getCurrentPlayerID();
    let gameCourt = document.getElementById('gameCourt');
    let drawPileDiv = document.createElement('div');
    drawPileDiv.id = 'drawPileDiv';

    let drawPileImg = document.createElement('img');
    drawPileImg.classList.add('drawPileCard');
    drawPileImg.src = './img/cards/back0.png';

    drawPileDiv.appendChild(drawPileImg)
    gameCourt.appendChild(drawPileDiv);

    drawPileDiv.addEventListener('click', function () {
        playerDrawsACard();
    })
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

        let colorInput = globalResult.Players[playerID].Cards[i].Color;
        let numberInput = Number(globalResult.Players[playerID].Cards[i].Value);
        newCard = new Card(colorInput, numberInput);
        let cardImageUrl = `${baseUrl}${newCard.Color}${newCard.Number}.png`;
        cardimg.src = cardImageUrl;

        currentPlayerCardDiv.appendChild(cardimg);

        cardimg.addEventListener('click', function () { //we add an eventListener for each image.
                playerPlaysACard(globalResult.Players[playerID].Cards[i]);
            
        });
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
    distributeCardsAfterGameStarts();
    displayTopCard();
    setupDrawPile();
    showCurrentPlayer();
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

async function updatePlayerCardsAfterPenalty(name) {
    let URL = `https://nowaunoweb.azurewebsites.net/api/Game/GetCards/${gameID}?playerName=${name}`;

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
    console.log('next player is  got penalty cards');
}

//START: Functions for game rules and logic------------------------------------------

//-------------------------when wild card is played----------------
async function openColorPickModal() {
    let colorModal = document.getElementById('colorModal');
    let colorImages = document.querySelectorAll('.color-image');

    colorModal.style.display = 'block';

    colorImages.forEach(function (image) {
        image.addEventListener('click', function () {
            colorPick = image.getAttribute('data-color');
            colorModal.style.display = 'none';
            console.log('Selected color: ' + colorPick);
        });
    });
}
//--------------------------------------------------------------


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
}


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

function playerToReceivePenaltyCards(playerWhoPlayedPenaltyCards) {
    let playerToGetPenaltyCards;

    if (direction === 1) { //if clockwise
        playerToGetPenaltyCards = playerWhoPlayedPenaltyCards + 1;
        if (playerToGetPenaltyCards > 3) {
            playerToGetPenaltyCards = 0;
        }
        if (playerToGetPenaltyCards < 0) {
            playerToGetPenaltyCards = 3;
        }
    } else { //if counterclockwise
        playerToGetPenaltyCards = playerWhoPlayedPenaltyCards - 1;
        if (playerToGetPenaltyCards > 3) {
            playerToGetPenaltyCards = 0;
        }
        if (playerToGetPenaltyCards < 0) {
            playerToGetPenaltyCards = 3;
        }
    }
    let name = globalResult.Players[playerToGetPenaltyCards].Player
    return playerToGetPenaltyCards;
}


function checkIfPlayerCanOnlyPlayDraw4() {
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
    let cardValid;

    if (topCard.Value === card.Value || topCard.Color === card.Color) {
        console.log('Card is valid!');
        cardValid = true;
    } else if (colorPick === card.Color) {
        console.log('Card is valid based on colorPick');
        cardValid = true;
    } else if (card.Value === 14) { // just changeColor
        console.log('Card is valid because its a joker');
        await openColorPickModal();
        cardValid = true;
    } else if (card.Value === 13) { //changeColor and +4 
        if (checkIfPlayerCanOnlyPlayDraw4()) {
            console.log('this player has no other cards to play except +4');
             await openColorPickModal();
            cardValid = true;
        } else {
            console.log('Card is invalid because player has other cards to play.');
            alert('You cannot play this card because you have other options. Choose another one!');
            cardValid = false;
        }
    } else {
        console.log('Card is invalid!');
        cardValid = false;
    }
    return cardValid;
}

//gets cards from server for a given player
async function getPenaltyCardsFromAPI(name) {
    let playerID = getIdOfThisPlayer(name);

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
        console.log(name + ' has now the following cards: ' + apiResponseToUpdatePlayerCards.Cards);
    } else {
        alert("HTTP-Error: " + response.status);
    }
}

// if player clicks on a card they're allowed to play, send request to server
async function sendPlayedCardToAPI(card) {

    console.log('initiating card transmission to API...' + card.Color + card.Value);
    let value = card.Value;
    let color = card.Color;

    let URL = `https://nowaunoweb.azurewebsites.net/api/Game/PlayCard/${gameID}?value=${value}&color=${color}&wildColor=${colorPick}`;

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
        console.log("received response");
        console.log(apiResponseToPlayedCard);

        determineTheNextPlayer(card);
        displayTopCard();
        showCurrentPlayer();
    } else {
        alert("HTTP-Error: " + response.status);
    }

}

function removePlayedCardFromPlayersHand(currentPlayerID, card) {
    let cardToRemove = getCardID(currentPlayerID, card);
    globalResult.Players[currentPlayerID].Cards.splice(cardToRemove, 1);

    console.log('this card is successfully removed from players hand: ' + cardToRemove);
    console.log(globalResult.Players[currentPlayerID].Cards);
}

/*functions to update state of the game
async function determineTheNextPlayer(card) {
    globalResult.TopCard = card; //put played card on top of the discard pile
    let currentPlayerIndex = getCurrentPlayerID();

    if (card.Value < 10) { //if card is a regular card
        setNextPlayer(currentPlayerIndex);
    }
    if (card.Value === 12) { //if card is reverse
        changeDirection(currentPlayerIndex);
        colorPick = card.Color;
    }
    if (card.Value === 11) { //if card is skip
        skipNextPlayer(currentPlayerIndex);
        colorPick = card.Color;
    }
    if (card.Value === 10) { //just +2 penalty
        await updateAllPlayersCards();
        skipNextPlayer(currentPlayerIndex);
        console.log('next player got penalized and is skipped');
        colorPick = card.Color;
    }
    if (card.Value === 13) { //colorChange  and +4 penalty
        await updateAllPlayersCards();
        skipNextPlayer(currentPlayerIndex);
        console.log('next player got penalized and is skipped');
    }
    if (card.Value === 14) { //just colorchange
        setNextPlayer(currentPlayerIndex);
    } else {
        colorPick = card.Color;
    }

    showCurrentPlayer();
}
*/

// 
async function determineTheNextPlayer(card) {
    globalResult.TopCard = card;
    let currentPlayerIndex = getCurrentPlayerID();

    if (card.Value < 10) {
        setNextPlayer(currentPlayerIndex);
        colorPick = card.Color;
    }
    if (card.Value === 12) {
        changeDirection(currentPlayerIndex);
        colorPick = card.Color;
    }
    if (card.Value === 11) {
       skipNextPlayer(currentPlayerIndex);
        colorPick = card.Color;
    }
    if (card.Value === 10) {
        await updateAllPlayersCards();
        skipNextPlayer(currentPlayerIndex);
        console.log('next player got penalized and is skipped');
        colorPick = card.Color;
    }
    if (card.Value === 13) {
        await updateAllPlayersCards();
        skipNextPlayer(currentPlayerIndex);
        console.log('next player got penalized and is skipped');
    }
    if (card.Value === 14) {
        setNextPlayer(currentPlayerIndex);
    } else {
        colorPick = card.Color;
    }

    showCurrentPlayer();
}


//LOGIC for when a player plays a card

/*async function playerPlaysACard(card) {
    let cardValid = checkPlayedCardValiditiyBeforeSendingToAPI(card);
    if (cardValid) {
        let currentPlayerID = getCurrentPlayerID();
        removePlayedCardFromPlayersHand(currentPlayerID, card);
        if (card.Value === 13 || card.Value === 14) {
            let wildCard = blackCardIsPlayed(card);
            await sendPlayedCardToAPI(wildCard);
        } else {
            await sendPlayedCardToAPI(card);
        }
        console.log('card transmition to API succeful');
        //console.log('removed played card');

    } else {
        alert('Player played an invalid card!');
        return;
    }
}
*/

async function playerPlaysACard(card) {
    let cardValid = await checkPlayedCardValiditiyBeforeSendingToAPI(card);
    if (cardValid) {
        await sendPlayedCardToAPI(card);

        /*let currentPlayerID = getCurrentPlayerID();
        removePlayedCardFromPlayersHand(currentPlayerID, card);
        if (card.Value === 13 || card.Value === 14) {
            let wildCard = blackCardIsPlayed(card);
            await sendPlayedCardToAPI(wildCard);
        } else {
            await sendPlayedCardToAPI(card);
        } */
        console.log('card transmission to API successful');
    } else {
        alert('Player played an invalid card!');
        return;
    }
}


