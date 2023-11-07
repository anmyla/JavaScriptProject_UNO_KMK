"use strict";

//START: Global variables-----------------------------------------------------------------
let globalResult = Object();
let gameID;
let direction = 1;

let colorPick;
let winnerOfThisRound;
let ultimateWinner;
let playerScores = [];
let round = 0;

let playersList = [];
let playersGlobal = [];
let player1Name, player2Name, player3Name, player4Name;
let playersCall = [];

class Card {
    constructor(color, value) {
        this.Color = color;
        this.Value = value;
    }
}

//START: Modal and other functions to collect players' names------------------------------
function hasDuplicates(array) {
    // Function to check for duplicate names
    const lowerCaseNames = array.map((name) => name.toLowerCase());
    return new Set(lowerCaseNames).size !== lowerCaseNames.length;
}

function assignTeams(players) {
    // Function to assign players to different houses
    const houses = ["Gryffindor", "Hufflepuff", "Ravenclaw", "Slytherin"];
    const assignedTeams = [];
    for (let i = 0; i < players.length; i++) {
        const playerName = players[i];
        const house = houses[i];
        assignedTeams.push(`${playerName} goes to ${house}!`);
    }
    return assignedTeams;
}

function displayTeams(teams) {
    // Function to display assigned houses in the modal
    let formSection = document.querySelector("#formSection");
    formSection.innerHTML = "";
    const teamsDisplay = teams.join("<br>"); // Use '<br>' for line breaks
    document.getElementById("playerTeamMessage").innerHTML = teamsDisplay;
    document.getElementById("okButton").style.display = "block";
}

document.getElementById("openModal1").addEventListener("click", function () {
    // Open the Modal dialog when the button is clicked
    $("#nameModal").modal("show");
});

document.getElementById("nameForm").addEventListener("submit", function (e) {
    // Handle form submission
    e.preventDefault(); // Prevent the form from submitting traditionally

    // Get player names from the input fields
    player1Name = document.getElementById("player1Name").value;
    player2Name = document.getElementById("player2Name").value;
    player3Name = document.getElementById("player3Name").value;
    player4Name = document.getElementById("player4Name").value;

    // Check for empty fields
    if (!player1Name || !player2Name || !player3Name || !player4Name) {
        alert("Please fill in all fields.");
        return; // Stop form submission
    }

    // Check for duplicate names
    if (hasDuplicates([player1Name, player2Name, player3Name, player4Name])) {
        alert(
            "Please enter unique names. The same name cannot be used more than once."
        );
        return; // Stop form submission
    }

    // Add the names to the playersList array
    playersList = [player1Name, player2Name, player3Name, player4Name];
    playersGlobal = [
        document.getElementById("player1Name").value,
        document.getElementById("player2Name").value,
        document.getElementById("player3Name").value,
        document.getElementById("player4Name").value,
    ];

    // Assign players to different teams (Hogwart Houses)
    const teams = assignTeams([
        player1Name,
        player2Name,
        player3Name,
        player4Name,
    ]);

    // Display assigned teams in the modal
    displayTeams(teams);
});

//START: Functions for Design Elements--------------------------------------------Kata: start
async function setDirection(direction) {
    let directionContainer = document.getElementById("directionContainer");

    if (direction === 1) {
        // im Uhrzeigersinn (clockwise)
        directionContainer.style.animationName = "rotateClockwise";
    } else {
        // gegen den Uhrzeigersinn (counterclockwise)
        directionContainer.style.animationName = "rotateCounterclockwise";
    }
}

function changeBGAfterStart() {
    //change background when entering Game Court
    // Hier setzt du das neue Hintergrundbild
    document.body.style.backgroundImage = 'url("./img/BGSpiel.jpg")';

    // neue schriftfarbe
    document.body.style.color = "white";
    //neue h1
    let gameMessageElement = document.getElementById("gameMessage");
    gameMessageElement.textContent = "No magic! Just logic!";

    // translucent black background
    let container = document.querySelector("#playground");
    container.classList.add("container1");

    let directionContainer = document.getElementById("directionContainer");
    let imageElement = document.createElement("img");
    imageElement.src = "./img/direction.png";
    directionContainer.appendChild(imageElement);
    imageElement.style.width = "100px";
    imageElement.style.height = "auto";

    let unoButton = document.getElementById("unoButtonContainer");
    let unoImg = document.createElement("img");
    unoImg.src = "./img/unoButton.png";
    unoButton.appendChild(unoImg);
    unoImg.style.width = "100px";
    unoImg.style.height = "auto";

    unoButton.addEventListener("click", async function () {
        let playerID = await getCurrentPlayerID();
        await callUNO(playerID);
    });
}

let audio = document.getElementById("myAudio");
let audioIcon = document.getElementById("audioIcon");

function toggleMute() {
    //audio button on nav bar
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

async function wrongCardAnimation(card) {
    let playerID = await getCurrentPlayerID();
    let cardID = await getCardID(playerID, card);
    const discardCard = document.getElementById("discardCardDiv");
    discardCard.classList.add("wrongCard");
    const wrongCardDiv = document.getElementById(
        "cardContainer" + playerID
    ).children;
    //const wrongCard = wrongCardDiv.item(cardID);
    const wrongCard = wrongCardDiv[cardID];
    wrongCard.classList.add("wrongCard");

    setTimeout(() => {
        wrongCard.classList.remove("wrongCard");
        discardCard.classList.remove("wrongCard");
    }, 2000);
}

async function correctCardAnimation(currentPlayerId, card) {
    let cardId = await getCardID(currentPlayerId, card);
    const correctCardDiv = document.getElementById(
        "cardContainer" + currentPlayerId
    ).children;
    const correctCard = correctCardDiv.item(cardId);
    correctCard.classList.add("bigcard");

    setTimeout(() => {
        correctCard.classList.remove("bigcard");
    }, 300);
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
    let cardContainer = document.createElement("div");
    playerSection.appendChild(cardContainer);
    cardContainer.id = "cardContainer" + playerID;
    cardContainer.class = "card-container";

    let newCard;
    let i = 0;

    while (i < globalResult.Players[playerID].Cards.length) {
        const cardimg = document.createElement("img");
        cardimg.classList.add("card"); // Apply a CSS class for styling

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
    playersGlobal.forEach((playerName) => {
        const li = document.createElement("li");
        const span = document.createElement("span");
        li.appendChild(span);
        span.textContent = playerName;
    });

    let cleanThisDiv = document.querySelector("#homeMessage");
    cleanThisDiv.innerHTML = "";

    displayPlayerDivHeaders();
    distributeCards(0, "player1Place");
    distributeCards(1, "player2Place");
    distributeCards(2, "player3Place");
    distributeCards(3, "player4Place");
}

function setupDrawPile() {
    //Construct draw pile and create div for draw pile

    let gameCourt = document.getElementById("gameCourt");
    let drawPileDiv = document.createElement("div");
    drawPileDiv.id = "drawPileDiv";

    let drawPileImg = document.createElement("img");
    drawPileImg.classList.add("drawPileCard");
    drawPileImg.src = "./img/cards/back0.png";

    drawPileDiv.appendChild(drawPileImg);
    gameCourt.appendChild(drawPileDiv);

    drawPileDiv.addEventListener("click", async function () {
        let playerID = await getCurrentPlayerID();
        await drawCardFromAPI(playerID);
    });
}

function displayTopCard() {
    //Construct a discard pile and create div for discard pile
    const baseUrl = "./img/cards/";

    //construct card image
    let discardCard;
    const discardimg = document.createElement("img");
    discardimg.classList.add("discardCard"); // Apply a CSS class for styling

    let color = globalResult.TopCard.Color;
    let value = globalResult.TopCard.Value;

    if (value >= 13) {
        discardCard = new Card(colorPick, value);
    } else {
        discardCard = new Card(color, value);
    }
    let discardImageUrl = `${baseUrl}${discardCard.Color}${discardCard.Value}.png`;

    discardimg.src = discardImageUrl;

    let gameCourt = document.getElementById("gameCourt");
    let discardCardDiv = document.createElement("div");
    discardCardDiv.id = "discardCardDiv";

    gameCourt.appendChild(discardCardDiv);

    //construct div for the card image
    let discardCardImageDiv = document.createElement("div");
    discardCardImageDiv.appendChild(discardimg);
    discardCardDiv.appendChild(discardCardImageDiv);
}

function showPlayerScores() {
    //player's total scores based on the cards they have
    let span;
    let scoreDiv;
    let playerScore;
    for (let i = 0; i < 4; i++) {
        scoreDiv = document.getElementById("score" + (i + 1));
        scoreDiv.innerHTML = "";
        playerScore = 0;
        for (let j = 0; j < globalResult.Players[i].Cards.length; j++) {
            playerScore = playerScore += globalResult.Players[i].Cards[j].Score;
        }
        span = document.createElement("span");
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
    scoreBoard.innerHTML = "";

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
async function showThisPlayerCards(playerID) {
    let baseUrl = "./img/cards/";
    let currentPlayerCardDiv = document.getElementById(
        "cardContainer" + playerID
    );
    currentPlayerCardDiv.innerHTML = "";

    currentPlayerCardDiv.id = "cardContainer" + playerID;
    //currentPlayerCardDiv.classList.add = "card-container";
    currentPlayerCardDiv.classList.add("card-container");

    let newCard;

    for (let i = 0; i < globalResult.Players[playerID].Cards.length; i++) {
        const cardimg = document.createElement("img");
        cardimg.classList.add("card"); // Apply a CSS class for styling

        let color = globalResult.Players[playerID].Cards[i].Color;
        let number = globalResult.Players[playerID].Cards[i].Value;
        newCard = new Card(color, number);
        let cardImageUrl = `${baseUrl}${newCard.Color}${newCard.Value}.png`;
        cardimg.src = cardImageUrl;

        currentPlayerCardDiv.appendChild(cardimg);

        cardimg.addEventListener("click", async function () {
            //we add an eventListener for each image.
            if (
                (globalResult.Players[playerID].Cards.length === 1 &&
                    playersCall[playerID] === "uno") ||
                globalResult.Players[playerID].Cards.length > 1
            ) {
                if (color === "Black") {
                    if (number === 13) {
                        let canOnlyPlayPlus4 = await checkIfPlayerMayPlayDraw4(playerID);
                        if (canOnlyPlayPlus4) {
                            await openColorPickModal(globalResult.Players[playerID].Cards[i])
                                .then(async () => {
                                    await playerPlaysACard(
                                        globalResult.Players[playerID].Cards[i],
                                        colorPick
                                    );
                                })
                                .catch((error) => {
                                    console.log("error after color modal");
                                    console.error(error);
                                });
                        } else {
                            await wrongCardAnimation(globalResult.Players[playerID].Cards[i]);
                            console.log("Player has other cards to play");
                        }
                    }
                    if (number === 14) {
                        await openColorPickModal(globalResult.Players[playerID].Cards[i])
                            .then(async () => {
                                await playerPlaysACard(
                                    globalResult.Players[playerID].Cards[i],
                                    colorPick
                                );
                            })
                            .catch((error) => {
                                console.log("error after color modal");
                                console.error(error);
                            });
                    }
                } else {
                    playerPlaysACard(globalResult.Players[playerID].Cards[i], colorPick);
                    colorPick = globalResult.Players[playerID].Cards[i].Color;
                }
            } else {
                alert("YOU FORGOT TO CALL UNO! HERE IS YOU PENALTY CARD!");
                drawCardFromAPI(playerID);
            }
        });
    }
}

// hide the cards of this player
async function putThisPlayerCardsUpsideDown(playerID) {
    let notCurrentPlayerCardDiv = document.getElementById(
        "cardContainer" + playerID
    );
    notCurrentPlayerCardDiv.innerHTML = "";

    notCurrentPlayerCardDiv.id = "cardContainer" + playerID;
    // notCurrentPlayerCardDiv.classList.add = "card-container";
    notCurrentPlayerCardDiv.classList.add("card-container");

    let i = 0;

    while (i < globalResult.Players[playerID].Cards.length) {
        const backCardImg = document.createElement("img");
        backCardImg.classList.add("card"); // Apply a CSS class for styling
        backCardImg.src = "./img/cards/back0.png";

        notCurrentPlayerCardDiv.appendChild(backCardImg);
        i++;
    }
}

// To show/hide players' hand based on whose turn it is
async function showCurrentPlayer() {
    let playerIndex = await getCurrentPlayerID();

    for (let i = 0; i <= 3; i++) {
        if (i === playerIndex) {
            await showThisPlayerCards(i);
        } else {
            await putThisPlayerCardsUpsideDown(i);
        }
    }
}

function updateScoreboard() {
    if (round === 0) {
        initializePlayerScores();
    }

    // Clear the scoreboard div before updating it with the new content
    const scoreBoard = document.getElementById("scoreBoard");
    scoreBoard.innerHTML = "";

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
            winnerScoreThisRound =
                winnerScoreThisRound + globalResult.Players[i].Score;
        }
    }

    for (let i = 0; i < globalResult.Players.length; i++) {
        if (globalResult.Players[i].Player === winnerOfThisRound) {
            playerScores[i] = playerScores[i] + winnerScoreThisRound;
            winnerOfThisRound = "";
        } else {
            playerScores[i] = playerScores[i] + 0;
        }
    }

    for (let i = 0; i < 4; i++) {
        if (playerScores[i] >= 500) {
            ultimateWinner = playersList[i];
        }
    }

    return playerScores;
}

async function checkIfWinner() {
    for (let i = 0; i < 4; i++) {
        if (globalResult.Players[i].Cards.length === 0) {
            winnerOfThisRound = globalResult.Players[i].Player;
            console.log(winnerOfThisRound + " has no more cards left!");
            return true;
        }
    }
    return false;
}

async function getTopCardFromAPI() {
    let URL = `https://nowaunoweb.azurewebsites.net/api/game/topCard/${gameID}`;
    let response = await fetch(URL, {
        method: "GET",
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
    });

    let apiTopCard = await response.json();

    if (response.ok) {
        globalResult.TopCard = apiTopCard;
    } else {
        alert("HTTP-Error: " + response.status);
    }
}

async function drawCardFromAPI(playerID) {
    let response = await fetch(
        "https://nowaunoweb.azurewebsites.net/api/Game/DrawCard/" + gameID,
        {
            method: "PUT",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        }
    );

    let apiResponseToDrawCard = await response.json();

    if (response.ok) {
        let drawnCard = apiResponseToDrawCard.Card;
        globalResult.Players[playerID].Cards.push(drawnCard);
        globalResult.Players[playerID].Cards.sort(sortPlayersCards);
        globalResult.Player = apiResponseToDrawCard.Player;
        globalResult.NextPlayer = apiResponseToDrawCard.NextPlayer;
        console.log(globalResult.Players[playerID].Player + " drawn a card!");
        console.log("Next Player: " + globalResult.NextPlayer);
    } else {
        alert("HTTP-Error: " + response.status);
    }

    playersCall[playerID] = "";
    showCurrentPlayer();
}

//return index of Current Player
async function getCurrentPlayerID() {
    for (let i = 0; i <= 3; i++) {
        if (globalResult.NextPlayer === playersList[i]) {
            return i;
        }
    }
}

//search and return index of card
async function getCardID(playerID, card) {
    let searchedCard;

    for (let i = 0; i < globalResult.Players[playerID].Cards.length; i++) {
        if (
            globalResult.Players[playerID].Cards[i].Color === card.Color &&
            globalResult.Players[playerID].Cards[i].Value === card.Value
        ) {
            searchedCard = new Card(
                globalResult.Players[playerID].Cards[i].Color,
                globalResult.Players[playerID].Cards[i].Value
            );
            return i;
        }
    }
}

async function startNewGame() {
    // Async function necessary for Promise
    try {
        // We start the connection request
        // then wait for promise (alternatively fetch, then notation)
        let response = await fetch(
            "https://nowaunoweb.azurewebsites.net/api/game/start",
            {
                method: "POST",
                body: JSON.stringify(playersList), // Send the names entered in the form
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
            }
        );

        if (response.ok) {
            globalResult = await response.json(); // Assign the response data to globalResult
            playersGlobal = playersList; // Replace the player names with the names entered in the form
            gameID = globalResult.Id;
            return globalResult;
        } else {
            alert("HTTP-Error: " + response.status);
        }
    } catch {
        console.error("Error in startNewGame:", error);
    }
}

document
    .getElementById("okButton")
    .addEventListener("click", async function () {
        // Handle "OK" button click to close the modal and start game
        $("#nameModal").modal("hide");
        await startNewGame();
        changeBGAfterStart();
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

        let response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        });

        let apiResponseToUpdatePlayerCards = await response.json();

        if (response.ok) {
            globalResult.Players[i].Cards = apiResponseToUpdatePlayerCards.Cards;
            globalResult.Players[i].Score = apiResponseToUpdatePlayerCards.Score;
            globalResult.Players[i].Cards.sort(sortPlayersCards);
        } else {
            alert("HTTP-Error: " + response.status);
        }
    }
}

async function updateThisPlayerCards(playerID) {
    let name = globalResult.Players[playerID].Player;
    let URL = `https://nowaunoweb.azurewebsites.net/api/Game/GetCards/${gameID}?playerName=${name}`;

    let response = await fetch(URL, {
        method: "GET",
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
    });

    let apiResponseToUpdatePlayerCards = await response.json();

    if (response.ok) {
        globalResult.Players[playerID].Cards = apiResponseToUpdatePlayerCards.Cards;
        globalResult.Players[playerID].Score = apiResponseToUpdatePlayerCards.Score;
        globalResult.Players[playerID].Cards.sort(sortPlayersCards);
    } else {
        alert("HTTP-Error: " + response.status);
    }
}

async function openColorPickModal(card) {
    return new Promise((resolve) => {
        let colorModal = document.getElementById("colorModal");
        let colorImages = document.querySelectorAll(".color-image");

        colorModal.style.display = "block";

        colorImages.forEach(function (image) {
            image.addEventListener("click", function (event) {
                colorPick = image.getAttribute("data-color");
                console.log("Selected color: " + colorPick);
                image.removeEventListener("click", event);
                colorModal.style.display = "none";
                resolve(colorPick); // Resolve the Promise with the selected color
            });
        });
    });
}

async function changeDirection() {
    direction = direction * -1;
    await setDirection(direction);
}

async function checkIfPlayerMayPlayDraw4(playerID) {
    let color = globalResult.TopCard.Color;
    let value = globalResult.TopCard.Value;

    let currentPlayersHand = globalResult.Players[playerID].Cards;

    if (color === "Black") {
        return false;
    } else {
        for (let i = 0; i < currentPlayersHand.length; i++) {
            if (currentPlayersHand[i].Value === 14) {
                return false;
            } else if (
                currentPlayersHand[i].Color === color ||
                currentPlayersHand[i].Value === value ||
                currentPlayersHand[i].Color === colorPick
            ) {
                return false;
            }
        }
        return true;
    }
}

async function checkPlayedCardValiditiyBeforeSendingToAPI(card) {
    let topCard = globalResult.TopCard;
    if (card.Color === "Black") {
        console.log("Wildcards are already checked for validity before colorPick.");
        return true;
    } else if (topCard.Value === card.Value || topCard.Color === card.Color) {
        console.log("Card is valid based on color or value!");
        return true;
    } else if (colorPick === card.Color) {
        console.log("Card is valid based on colorPick");
        return true;
    } else {
        console.log("You can't play this invalid card!");
        return false;
    }
}

// send played/chosen card to the server
async function sendPlayedCardToAPI(card, colorPick) {
    let URL = `https://nowaunoweb.azurewebsites.net/api/Game/PlayCard/${gameID}?value=${card.Value}&color=${card.Color}&wildColor=${colorPick}`;
    try {
        let response = await fetch(URL, {
            method: "PUT",
            dataType: "json",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        });

        let apiResponseToPlayedCard = await response.json();

        if (response.ok) {
            console.log(response.status);
            console.log(apiResponseToPlayedCard);
            globalResult.Player = apiResponseToPlayedCard.Player;
            globalResult.NextPlayer = apiResponseToPlayedCard.Player;
            // console.log(globalResult.Players[playerID].Player + ' is done playing a card!');
            console.log("Next Player:  " + globalResult.NextPlayer);

            //set colorPick to topCard.Color
            if (card.Value < 12) {
                colorPick = card.Color;
            }

            //determine direction
            if (card.Value === 12) {
                changeDirection();
            }
        } else {
            console.log("HTTP-Error: " + response.status);
        }
    } catch (error) {
        console.log(error);
    }
}

function penalizedPlayer(previousPlayerIndex) {
    let penalizedPlayerID;

    if (direction === 1) {
        //if clockwise
        penalizedPlayerID = previousPlayerIndex + 1;
        if (penalizedPlayerID > 3) {
            penalizedPlayerID = 0;
        }
        if (penalizedPlayerID < 0) {
            penalizedPlayerID = 3;
        }
    } else {
        //if counterclockwise
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

async function updateFrontEnd(card, playerID) {
    if (card.Value === 10 || card.Value === 13) {
        let getsPenaltyCards = penalizedPlayer(playerID);
        await updateThisPlayerCards(getsPenaltyCards);
        await updateThisPlayerCards(playerID);
    } else {
        await updateThisPlayerCards(playerID);
    }

    //await updatePlayersHand(card, playerID);
    let isWinner = await checkIfWinner();
    if (isWinner) {
        openWinnerModal(winnerOfThisRound); //after this part we can decide how to end the game
    } else {
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
    let playerID = await getCurrentPlayerID();

    if (cardValid) {
        await correctCardAnimation(playerID, card);
        await sendPlayedCardToAPI(card, chosenColor);
    } else {
        wrongCardAnimation(card);
        console.log("INVALID CARD!");
        return;
    }

    await updateFrontEnd(card, playerID);
    colorPick = card.Color;
}

function displayWinner(player) {
    // Function to display assigned houses in the modal
    let formSection = document.querySelector("#formSection");
    formSection.innerHTML = "";
    const teamsDisplay = teams.join("<br>"); // Use '<br>' for line breaks
    document.getElementById("playerTeamMessage").innerHTML = teamsDisplay;
    document.getElementById("okButton").style.display = "block";
}

function openWinnerModal(playerName) {
    //dialog box to show player points and winner

    document.getElementById("winnerName").innerHTML = "";

    let winnerModal = document.getElementById("winnerModal");
    let nameDiv = document.getElementById("winnerName");
    let h1 = document.createElement("h1");

    winnerModal.style.display = "block";
    h1.innerText = playerName;

    nameDiv.appendChild(h1);
    updateScoreboard();

    let winnerSong = new Audio("./css/winnerSong.mp3");
    winnerSong.loop = true; // Hier wird das loop-Attribut gesetzt
    winnerSong.play();

    let anotherRound = document.getElementById("anotherRound");
    let endGame = document.getElementById("endGame");

    if (ultimateWinner) {
        document.getElementById("housePoints").innerHTML = "";
        document.getElementById("housePoints").innerHTML =
            "What an impressive win for a real champion!";
        anotherRound.innerHTML = "";
        anotherRound.textContent = "Congrats!";

        anotherRound.addEventListener("click", function () {
            winnerSong.pause(); // Stoppe den Song, wenn der Button geklickt wird
            winnerModal.style.display = "none";
            thanksForPlaying();
        });
    } else {
        anotherRound.addEventListener("click", async function () {
            winnerSong.pause(); // Stoppe den Song, wenn der Button geklickt wird
            winnerModal.style.display = "none";

            await resetPlayground();

            if (direction !== 1) {
                //reset Direction
                changeDirection();
            }

            await startNewGame(); //start a new round

            if (globalResult.TopCard.Value === 12) {
                changeDirection();
            }

            displayTopCard();
            setupDrawPile();
            showCurrentPlayer();
            showPlayerScores();
        });
    }

    endGame.addEventListener("click", function () {
        winnerModal.style.display = "none";
        thanksForPlaying();
    });
    round++;
}

//----------------------------------------EXTRAS--------------------------------------------//
//if user want to play more rounds
async function resetPlayground() {
    document.body.style.backgroundImage = "";
    document.body.style.color = "";

    let gameMessageElement = document.getElementById("gameMessage");
    gameMessageElement.textContent = "";

    let container = document.querySelector("#playground");
    container.classList.remove("container1");

    // Hier setzt du das neue Hintergrundbild
    document.body.style.backgroundImage = 'url("./img/BGSpiel.jpg")';
    // neue schriftfarbe
    document.body.style.color = "white";
    //neue h1
    gameMessageElement = document.getElementById("gameMessage");
    gameMessageElement.textContent = "No magic! Just logic!";

    // translucent black background
    container = document.querySelector("#playground");
    container.classList.add("container1");
}

function badUnoCall() { //uno button wiggle effect
    const unoDiv = document.getElementById("unoButtonContainer");
    unoDiv.classList.add("wrongCard");

    setTimeout(() => {
        unoDiv.classList.remove("wrongCard");
    }, 2000);
}

function goodUnoCall() { //uno button spinning effect
    const unoDiv = document.getElementById("unoButtonContainer");
    unoDiv.classList.add("goodCall");

    setTimeout(() => {
        unoDiv.classList.remove("goodCall");
    }, 2000);
}

async function callUNO(playerID) {
    let notGood = new Audio("./css/notGood.mp3");
    let brilliant = new Audio("./css/brilliant.mp3");

    // Refactored to return true if any of the two cards can be played
    let canCallUno = async function (playerID) {
        if (globalResult.Players[playerID].Cards.length === 2) {
            for (let i = 0; i < 2; i++) {
                const isValid = await cardCheck(
                    globalResult.Players[playerID].Cards[i]
                );
                if (isValid) {
                    return true; // Returns true if at least one card is playable
                }
            }
        }
        return false; // Returns false if no cards are playable
    };

    // Ensure 'canCallUno' is awaited to get the boolean result
    if (
        globalResult.Players[playerID].Cards.length === 2 &&
        (await canCallUno(playerID))
    ) {
        playersCall[playerID] = "uno";
        goodUnoCall();
        brilliant.play();
    } else {
        badUnoCall();
        notGood.play();
    }
}

async function cardCheck(card) {
    //check if card can be played
    let topCard = globalResult.TopCard;

    if (card.Color === "Black") {
        if (card.Value === 14) {
            return true;
        } else if (card.Value === 13 && topCard.Color !== "Black") {
            return true;
        } else {
            return false;
        }
    } else if (topCard.Value === card.Value || topCard.Color === card.Color) {
        return true;
    } else if (colorPick === card.Color) {
        return true;
    } else {
        return false;
    }
}

// sort cards in players hand
function sortPlayersCards(card1, card2) {
    if (card1.Color < card2.Color) {
        return 1;
    }
    if (card1.Color > card2.Color) {
        return -1;
    }
    return 0;
}

function thanksForPlaying() {
    //closing message
    document.body.style.backgroundImage = "";
    document.body.style.color = "";

    let gameMessageElement = document.getElementById("gameMessage");
    gameMessageElement.textContent = "";

    let container = document.querySelector("#playground");
    container.innerHTML = "";

    // Hier setzt du das neue Hintergrundbild
    document.body.style.backgroundImage = 'url("./img/BGSpiel.jpg")';
    // neue schriftfarbe
    document.body.style.color = "white";
    //neue h1
    gameMessageElement = document.getElementById("gameMessage");
    gameMessageElement.textContent = "No magic! Just logic!";

    container.classList.add("container1");

    let byeDiv = document.createElement("div");
    let thanksForPlaying = document.createElement("h1");
    thanksForPlaying.textContent = "Thanks for Playing! Goodbye!";
    byeDiv.classList.add("byeDiv");
    byeDiv.appendChild(thanksForPlaying);
    container.appendChild(byeDiv);
}




//--------------------------------------------------------------------------------------------//