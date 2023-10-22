"use strict";
let playersList = [];
let playersGlobal = [];
let globalResult = Object();
let gameID;
let apiResponseToPlayedCard;
let player1Name, player2Name, player3Name, player4Name;

class Card {
    constructor(color, number) {
        this.Color = color;
        this.Number = number;
    }
}

// Open the Modal dialog when the button is clicked
document.getElementById('openModal1').addEventListener('click', function () {
    $('#nameModal').modal('show');
});

// Handle form submission
document.getElementById('nameForm').addEventListener('submit', function (e) {
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

//----------------------------------------------------------------------------------------------------------Kata: start
function changeBGAfterStart() {
    // Hier setzt du das neue Hintergrundbild
    document.body.style.backgroundImage = 'url("./img/BGSpiel.jpg")';
    // neue schriftfarbe
    document.body.style.color = "white";
    //neue h1
    let gameMessageElement = document.getElementById("gameMessage");
    gameMessageElement.textContent = "May magic guide your way!";
}


//-------------------------------------------------------------------------------------------------Kata: audio function
let audio = document.getElementById("myAudio");
let audioIcon = document.getElementById("audioIcon");

function toggleMute() {
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

//----------------------------------------------------------------------------------------------------------Kata: ende

// Function to check for duplicate names in an array
function hasDuplicates(array) {
    const lowerCaseNames = array.map(name => name.toLowerCase());
    return (new Set(lowerCaseNames)).size !== lowerCaseNames.length;
}


// Function to assign players to different teams
function assignTeams(players) {
    const houses = ['Gryffindor', 'Hufflepuff', 'Ravenclaw', 'Slytherin'];
    const assignedTeams = [];

    for (let i = 0; i < players.length; i++) {
        const playerName = players[i];
        const house = houses[i];
        assignedTeams.push(`${playerName} goes to ${house}!`);
    }

    return assignedTeams;
}

// Function to display assigned teams in the modal
function displayTeams(teams) {
    let formSection = document.querySelector('#formSection');
    formSection.innerHTML = '';
    const teamsDisplay = teams.join('<br>'); // Use '<br>' for line breaks
    document.getElementById('playerTeamMessage').innerHTML = teamsDisplay;
    document.getElementById('okButton').style.display = 'block';
}

// Handle "OK" button click to close the modal and start game
document.getElementById('okButton').addEventListener('click', async function () {
    $('#nameModal').modal('hide');
    //nueues spiel starten!

    await startNewGame();
    gameID = globalResult.id;
    changeBGAfterStart();

    //displayPlayersList();
    displayPlayersCardAfterGameStarts();
    displayTopCard();
    setupDrawPile();
    showCurrentPlayer();

});




// Async function necessary for Promise
async function startNewGame() {
    try {
        // We start the connection request 
        // then wait for promise (alternatively fetch, then notation)
        let response = await fetch("https://nowaunoweb.azurewebsites.net/api/game/start", {
            method: 'POST',
            body: JSON.stringify(playersList), // Send the names entered in the form
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        });

        if (response.ok) {
            globalResult = await response.json(); // Assign the response data to globalResult
            playersGlobal = playersList; // Replace the player names with the names entered in the form
            return globalResult;
        } else {
            alert("HTTP-Error: " + response.status);
        }
    }
    catch {
        console.error("Error in startNewGame:", error);
    }
}


function changeBackgroundImage() {
    // Hier setzt du das neue Hintergrundbild
    document.body.style.backgroundImage = 'url("./img/background_spiel.jpg")'; // Ersetze 'neues-bild.jpg' durch den Pfad zu deinem gewünschten Hintergrundbild
    document.body.style.color = "white";
}


//Construct draw pile and create div for draw pile
function setupDrawPile() {
    let gameCourt = document.getElementById('gameCourt');
    let drawPileDiv = document.createElement('div');
    drawPileDiv.id = 'drawPileDiv';

    let drawPileImg = document.createElement('img');
    drawPileImg.classList.add('drawPileCard');
    drawPileImg.src = './img/cards/back0.png';

    drawPileDiv.appendChild(drawPileImg)
    gameCourt.appendChild(drawPileDiv);
}

async function displayTopCard() {
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

// show only current player cards
async function showCurrentPlayerCards(playerID) {
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

        cardimg.addEventListener('click', function () {
            playerPlaysACard(globalResult.Players[playerID].Cards[i]);
        })
    }

}


async function showThisPlayerCards(playerID, htmlID) {
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


async function displayPlayersCardAfterGameStarts() {
    playersGlobal.forEach(playerName => {
        const li = document.createElement("li");
        const span = document.createElement("span");
        li.appendChild(span);
        span.textContent = playerName;
    });

    let cleanThisDiv = document.querySelector('#homeMessage');
    cleanThisDiv.innerHTML = '';

    displayPlayerDivHeaders();
    showThisPlayerCards(0, "player1Place");
    showThisPlayerCards(1, "player2Place");
    showThisPlayerCards(2, "player3Place");
    showThisPlayerCards(3, "player4Place");
}

async function displayPlayerDivHeaders() {
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

// returns ID of Current Player
function getCurrentPlayerID() {
    for (let playerID = 0; playerID <= 3; playerID++) {
        if (globalResult.Player === playersList[playerID].Name) {
            return playerID;
        }
    }
}

//search and return
function getCardID(playerID, card) {
    let searchedCard;
    let playerCard;

    for (let i = 0; i < globalResult.Players[playerID].Cards.length; i++) {
        if (globalResult.Players[playerID].Cards[i].Color === card.Color && globalResult.Players[playerID].Cards[i].Value === card.Value) {
            searchedCard = new Card(globalResult.Players[playerID].Cards[i].Color, globalResult.Players[playerID].Cards[i].Value);
            console.log('this card must be removed from the players hand: ' + searchedCard);
            return i;
        } else {
            console.log("for some unknown reason, there is no such card!");
        }
    }
}

// hide notCurrentPlayer's cards
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

// To show/hide players' hand
function showCurrentPlayer() {
    let playerIndex = getCurrentPlayerID();

    for (let i = 0; i <= 3; i++) {
        if (i === playerIndex) {
            showCurrentPlayerCards(i);

        } else {
            putThisPlayerCardsUpsideDown(i)
        }
    }
}

//--------CODES ABOVE ARE WORKING PERFECTLY------------------------------------------


// check if played card is valid
function cardValidation(card) {
    let topCard = globalResult.TopCard;
    console.log('top card:' + topCard);
    switch (card.Value) {
        case 14:
            // if Player doesn't have the Color, he can play Draw4
            let hasNoCardWithSameColor = !hasCardWithSameColor(getCurrentPlayerID(), globalResult.chosenColor);
            let draw4onTop = topCard.Value === value.Draw4;
            let changeColorTop = topCard.Value === value.ChangeColor;
            // if TopCard is Draw 4 or Wild card, you can't play a Draw4
            console.log('player played: Darw4');
            return hasNoCardWithSameColor
                && !draw4onTop && !changeColorTop;

        case 13:
            // you can always play a Wild Card / ChangeColor
            console.log('player played: changeColor');
            return true;
        default:
            // if player doesn't play wild card or +4, return the value and color of the card
            return card.Value === topCard.Value
                || card.Color === globalResult.chosenColor;
            console.log('card validation: default');

    }
}

// returns true if player has card with the same color as chosen color
function hasCardWithSameColor(playerID, color) {
    for (let i = 0; i < playersList[playerID].Cards.length; i++) {
        if (playersList[playerID].Cards[i].Color === color) {
            return true;
        }
    }
    return false;
}



function checkplayedCardValiditiyBeforeSendingToAPI(card) {
    let topCard = globalResult.TopCard;

    if (topCard.Value === card.Value || topCard.Color === card.Color) {
        console.log('card VALID based on global result');
        return true;
    } else {
        console.log('card INVALID based on global result');
        return false;

    }
}

// catches error in server response
function catchError(result) {
    return result.error;
}

// if player clicks on a card they're allowed to play, send request to server
async function sendPlayedCardToAPI(card) {
    let wildColor = "not_being_used_right_now";
    let value = card.Value;
    let color = card.Color;
    let gameID = globalResult.Id;
    let URL = `https://nowaunoweb.azurewebsites.net/api/Game/PlayCard/${gameID}?value=${value}&color=${color}&wildColor=${wildColor}`;

    // try {
    const response = await fetch(URL,
        {
            method: "PUT",
            dataType: "json",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
            /*
            complete: function (response) {
                writeResult(that, result);
            }
            */
        }
    );

    if (response.ok) {
        apiResponseToPlayedCard = await response.json(); // alternativ response.text wenn nicht json gewünscht ist
        console.log("received response");
        console.log(response);

        if (catchError(response) === undefined) { //there is no error

            afterSuccessfulTransmissionOfAValidCardToAPI(card);
            proceedToGivenPlayer(apiResponseToPlayedCard.Player);
            //update the gamecourt
            displayTopCard();
            setupDrawPile();
            showCurrentPlayer();

        } else {
            alert("card cannot be played: " + catchError(apiResponseToPlayedCard));
        }

    } else {
        alert("HTTP-Error: " + response.status);
    }

    //}
    //catch {
    //    console.error("Error in sendPlayedCardToAPI");
    //}
}

function removePlayedCardFromPlayersHand(currentPlayerID, card) {
    let cardToRemove = getCardID(currentPlayerID, card);
    globalResult.Players[currentPlayerID].Cards.splice(cardToRemove, 1);

    console.log('this card is successfully removed from players hand: ' + cardToRemove);
    console.log(globalResult.Players[currentPlayerID].Cards);
}


// saves player and next player
function proceedToGivenPlayer(playerName) {
    globalResult.Player = playerName;
    globalResult.NextPlayer = null;
}

function showChooseColor(card) {

}

function playCardServer(card) {

}

function showCardErrorFeedback(card) {

}


//LOGIC for when a player plays a card
function playerPlaysACard(card) {
    if (checkplayedCardValiditiyBeforeSendingToAPI(card)) {
        let currentPlayerID = getCurrentPlayerID();
        sendPlayedCardToAPI(card);
        console.log('playedCard sent to API');
        removePlayedCardFromPlayersHand(currentPlayerID, card);
        console.log('removed played card');
    } else {
        alert('Player played an invalid card!');
    }
}

//--------------------------------------------------------------------------------

// updates all cards from each player
async function updateAllCardsFromServer() {
    for (let playerId = 0; playerId <= 3; playerId++) {
        await getPlayerCardsFromServer(playerId);
    }
}

// gets cards from server for a given player
async function getPlayerCardsFromServer(playerID) {
    let id = globalResult.id;
    let name = players[playerID].Name;
    let response = await fetch(`https://nowaunoweb.azurewebsites.net/api/Game/GetCards/${id}?playerName=${name}`, {
        method: "GET", headers: {
            "Content-type": "application/json; charset=UTF-8",
        }
    });

    if (response.ok) {
        globalResult = await response.json();
        console.log(globalResponse);
        console.log(players[playerID]);
        playersList[playerID].Cards = globalResult.Cards;
        playersList[playerID].Cards.sort(compareCard);
        playersList[playerID].Score = result.Score;
    } else {
        alert("HTTP-Error: " + response.status);
    }
}



// updates all cards from each player
async function updateAllCardsFromServer() {
    for (let i = 0; i <= 3; i++) {
        await getPlayerCardsFromServer(i);
    }
}

// changes direction if player plays Reverse card
function reverseDirection() {
    if (globalResult.direction === Direction.CW) {
        globalResult.direction = Direction.CCW;
    } else {
        globalResult.direction = Direction.CW
    }
}

function afterSuccessfulTransmissionOfAValidCardToAPI(card) {
    globalResult.TopCard = card; //put played card on top of the discard pile

    //reverse
    if (card.Value === 12) {
        reverseDirection();
    }

    //skip
    if (card.Value === 11) {
    }

    // if +2 or +4 is played, get all cards from server to update them and get the new drawn cards
    if (card.Value === 10 || card.Value === 13) {
        updateAllCardsFromServer();
    }
    if (card.Value === 13 || card.Value === 14) {
        globalResult.chosenColor = wildColor;
    } else {
        globalResult.chosenColor = card.Color;
    }

}
