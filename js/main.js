"use strict";
let playersList = [];
let playersGlobal = [];
let globalResult = Object();

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
    const player1Name = document.getElementById('player1Name').value;
    const player2Name = document.getElementById('player2Name').value;
    const player3Name = document.getElementById('player3Name').value;
    const player4Name = document.getElementById('player4Name').value;

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
    changeBackgroundImage();

    //displayPlayersList();
    displayPlayersCardAfterGameStarts();
    displayTopCard();
    setupDrawPile();
    showCurrentPlayer();

});


function changeBackgroundImage() {
    // Hier setzt du das neue Hintergrundbild
    document.body.style.backgroundImage = 'url("img/background_spiel.jpg")'; // Ersetze 'neues-bild.jpg' durch den Pfad zu deinem gewünschten Hintergrundbild
    document.body.style.color = "white";
}


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
    showThisPlayerCards(0, "player0div")
    showThisPlayerCards(1, "player1div")
    showThisPlayerCards(2, "player2div")
    showThisPlayerCards(3, "player3div")
}


async function displayPlayerDivHeaders() {
    let i = 0;
    while (i < playersGlobal.length) {
        // Create a base ID for each player div
        let baseId = `player${i}div`;
        let gameCourt = document.getElementById('gameCourt');

        let playerDiv = document.createElement('div');
        playerDiv.id = baseId;  // Set the unique ID for the div
        playerDiv.classList.add('player-div');    //---KATA

        gameCourt.appendChild(playerDiv);
        let playerDivHeader = document.createElement('h3');
        playerDivHeader.textContent = globalResult.Players[i].Player;

        playerDiv.appendChild(playerDivHeader);

        //div for player's score
        let playerScoreDiv = document.createElement('div');
        playerScoreDiv.id = `playerScore${i}`;
        playerScoreDiv.textContent = 'Score'; //temporary: placeholder

        playerDiv.appendChild(playerScoreDiv);
        i++;
    }
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

    /*
     //construct discard Div Heading
     let discardDeckHeading = document.createElement('p');
     discardDeckHeading.textContent = "Discard Deck";
     discardCardDiv.appendChild(discardDeckHeading);
     */

    gameCourt.appendChild(discardCardDiv);

    //construct div for the card image
    let discardCardImageDiv = document.createElement('div');
    discardCardImageDiv.appendChild(discardimg);
    discardCardDiv.appendChild(discardCardImageDiv);
}


//Construct draw pile and create div for draw pile
function setupDrawPile() {
    let gameCourt = document.getElementById('gameCourt');
    let drawPileDiv = document.createElement('div');
    drawPileDiv.id = 'drawPileDiv';

    /*
    let drawPileHeading = document.createElement('p');
    drawPileHeading.textContent = 'Draw Pile';
    drawPileDiv.appendChild(drawPileHeading);
    */

    let drawPileImg = document.createElement('img');
    drawPileImg.classList.add('drawPileCard');
    drawPileImg.src = './img/cards/back0.png';

    drawPileDiv.appendChild(drawPileImg)
    gameCourt.appendChild(drawPileDiv);
}

// returns ID of Current Player
function getCurrentPlayerID() {
    for (let playerID = 0; playerID <= 3; playerID++) {
        if (globalResult.Player === playersList[playerID].Name) {
            return playerID;
        }
    }
}

// show only current player cards
async function showCurrentPlayerCards(playerID) {
    let baseUrl = './img/cards/';
    let currentPlayerCardDiv = document.getElementById('cardContainer' + playerID);
    currentPlayerCardDiv.innerHTML = '';

    currentPlayerCardDiv.id = 'cardContainer' + playerID;
    currentPlayerCardDiv.classList.add = 'card-container';

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

        currentPlayerCardDiv.appendChild(cardimg);

        cardimg.addEventListener('click', function () {
            playerPlaysACard(newCard);
        })

        i++;
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

    for (let playerID = 0; playerID <= 3; playerID++) {
        if (playerID === playerIndex) {
            showCurrentPlayerCards(playerID);

        } else {
            putThisPlayerCardsUpsideDown(playerID)
        }
    }
}


//--------CODES ABOVE ARE WORKING PERFECTLY------------------------------------------


//LOGIC for when a player plays a card
function playerPlaysACard(card) {

    if (cardValidation(card)) {
        let currentPlayerID = getCurrentPlayerID();
        removePlayedCardFromPlayersHand(currentPlayerID, card)

        if (card.Color === CardColor.Black) {
            showChooseColor(card);

        } else {
            playCardServer(card, "").then();
        }
    } else {
        showCardErrorFeedback(card);
    }
}

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

function removePlayedCardFromPlayersHand(currentPlayerID, card) {
    let cardToRemove = getCardID(currentPlayerID, card);
    playersList[playerID].Cards.splice(cardToRemove, 1);

    console.log('the played card should have been removed from the playerhand');
}

//return the searched card 
function getCardID(playerID, card) {
    for (let i = 0; i < players[playerID].Cards.length; i++) {
        if (playersList[playerID].Cards[i].Color === card.Color && players[playerID].Cards[i].Value === card.Value) {
            return i;
        }
    }

    alert("for some unknown reason, there is no such card!");
}

function showChooseColor(card) {

}

function playCardServer(card) {

}

function showCardErrorFeedback(card) {

}


// if player clicks on a card they're allowed to play, send request to server
async function playCardServer(card, wildColor) {
    let id = globalResult.id;
    let value = card.Value;
    let color = card.Color;

    oldTopCard = globalResult.TopCard;
    console.log(oldTopCard);

    let url = `https://nowaunoweb.azurewebsites.net/api/Game/PlayCard/${id}?value=${value}&color=${color}&wildColor=${wildColor}`;

    let response = await fetch(url, {
        method: "PUT", headers: {
            "Content-type": "application/json; charset=UTF-8",
        }
    });

    if (response.ok) {
        let result = await response.json();
        console.log("result from playCard");
        console.log(result);

        if (catchError(result) === undefined) {
            let currentPlayerId = getCurrentPlayerID();

            removeOneCardFromPlayer(currentPlayerId, card);

            globalResult.TopCard = card;

            //reverse
            if (card.Value === 12) {

            }

            //skip
            if (card.Value === 11) {

            }
            // if +2 or +4 is played, get all cards from server to update them and get the new drawn cards
            if (value === 10 || value === 13) {

                await updateAllCardsFromServer();
            }

            if (value === 13 || value === 14) {
                globalResult.chosenColor = wildColor;
            } else {
                globalResult.chosenColor = card.Color;
            }

            proceedToGivenPlayer(result.Player);

            //update the gamecourt
            displayTopCard();
            setupDrawPile();
            showCurrentPlayer();

        } else {
            alert("card not played: " + catchError(result));
        }

    } else {
        alert("HTTP-Error: " + response.status);
    }
}

// catches error in server response
function catchError(result) {
    return result.error;
}

// updates all cards from each player
async function updateAllCardsFromServer() {
    for (let playerId = 0; playerId <= 3; playerId++) {
        await getPlayerCardsFromServer(playerId);
    }
}

// gets cards from server for a given player
async function getPlayerCardsFromServer(playerId) {
    let id = globalResult.id;
    let name = players[playerId].Name;
    let response = await fetch(`https://nowaunoweb.azurewebsites.net/api/Game/GetCards/${id}?playerName=${name}`, {
        method: "GET", headers: {
            "Content-type": "application/json; charset=UTF-8",
        }
    });

    if (response.ok) {
        let result = await response.json();
        console.log(response);
        console.log(players[playerId]);
        playersList[playerId].Cards = result.Cards;
        playersList[playerId].Cards.sort(compareCard);
        playersList[playerId].Score = result.Score;

    } else {
        alert("HTTP-Error: " + response.status);
    }
}

// saves player and next player
function proceedToGivenPlayer(playerName) {
    globalResult.Player = playerName;
    globalResult.NextPlayer = null;
}