DOCUMENTATION: Uno Game Functions
-Kata Szöllösi, Myla Ariaga-Nagl, and Ksenija Trstenjak

Function: hasDuplicates(array)
Description: Checks for duplicate names in an array.
Parameters: array: Array of player names.
Returns: boolean:
Returns true if duplicate names are found, otherwise false.

Function: assignTeams(players)
Description: Assigns players to different teams (houses in this case).
Parameters: players: Array of player names.
Returns: string[]:
Assigned teams/houses for each player.

Function: displayTeams(teams)
Description: Displays the assigned teams/houses in the modal.
Parameters: teams:
Assigned teams/houses for each player.

Function: setDirection(direction)
Description: Sets the game direction.
Parameters: direction:
Represents the game direction. 1 for clockwise, -1 for counterclockwise.

Function: changeBGAfterStart()
Description: Changes background and UI elements upon starting the game.

Function: toggleMute()
Description: Toggles audio mute on navbar button click.

Function: playAudioLoop()
Description: Initiates audio loop for the game.

Function: wrongCardAnimation(card)
Description: Performs an animation when a wrong card is played by a player.
Parameters: card -> the card being played/clicked.

Function: correctCardAnimation(currentPlayerId, card)
Description: Performs an animation when a correct card is played by the current player.
Parameters: card -> the card being played/clicked.
: currentPlayerId: The ID of the current player.


Function: displayPlayerDivHeaders()
Description: Updates the player names in their respective HTML elements.

Function: distributeCards(playerID, htmlID)
Description: Distributes cards to a specific player's HTML container.
Parameters: playerID: The ID of the player.
htmlID: The HTML ID where the player's cards will be placed.

Function: distributeCardsAfterGameStarts()
Description: Distributes cards to players' containers after the game starts.

Function: setupDrawPile()
Description: Sets up the draw pile for the game. Creates and handles interactions for the draw pile container.

Function: displayTopCard()
Description: Constructs and displays the top card in the discard pile.
: Creates an HTML structure to display the top card from the discard pile.

Function: showPlayerScores()
Description: Displays the total scores of each player based on the cards they possess.
: Updates the score displayed for each player based on their held cards.

Function: initializePlayerScores()
Description: Initializes the array 'playerScores' with initial scores.
: Initializes the scores for each player, possibly at the beginning of the game or round.

Function: initializeScoreBoard()
Description: Sets up the score board with player names and initial scores.
Creates and populates the score board table with player names and their respective scores.

Function: showThisPlayerCards(playerID)
Description: Displays the cards of the specified player and handles card interactions.
: Shows the cards of the specified player.
: Handles click events on the displayed cards, checking if the player can play a selected card.

Function: putThisPlayerCardsUpsideDown(playerID)
Description: Hides the cards of the specified player, displaying card backs, when it is not their turn.
: Clears the specified player's cards and displays card backs as a visual indication of hidden cards.

Function: showCurrentPlayer()
Description: Manages the visibility of players' cards based on the current turn.
: Reveals the cards of the current player and hides other players' cards with card backs.

Function: updateScoreboard()
Description: Updates the scoreboard with player scores after each round.
: Calculates and updates player scores on the scoreboard, displaying player names and their respective scores.

Function: calculateWinnerScore()
Description: Calculates scores and determines the winner for the round.
: Determines scores for the players for the current round, updates player scores, and identifies the round winner.
: Checks if any player's score exceeds the winning threshold (500 points) to determine the ultimate winner of the game.

Function: checkIfWinner()
Description: Checks if a player has won the round by emptying their cards.
: Iterates through the player list to determine if any player has an empty card stack.
: Returns true if a player has no more cards, signaling the end of the round; otherwise, returns false.

Function: getTopCardFromAPI()
Description: Retrieves the top card of the game from the game API and updates the global result.
: Fetches the top card of the game from the specified API endpoint and stores the response in the global result.
: Alerts the user in case of an HTTP error during the API request.

Function: drawCardFromAPI(playerID)
Description: Draws a card for the specified player from the game API.
: Sends a request to the game API to draw a card for the specified player and updates the global result with the drawn card and player details.
: Alerts the user in case of an HTTP error during the API request.

Function: getCurrentPlayerID()
Description: Returns the index of the current player from the player list based on the next player's name.
: Searches the player list to identify the index of the current player and returns the index value.

Function: getCardID(playerID, card)
Description: Searches and returns the index of a specific card within a player's card stack.
: Checks the specified player's cards to identify the index of the provided card and returns its position.

Function: startNewGame()
Description: Initiates a new game by sending a request to the game API and populating the global result.

Function: updateAllPlayersCards()
Description: Updates cards and scores for all players after the game has started.
Retrieves and updates cards and scores for all players using API calls.
Alerts the user in case of an HTTP error during the API request.

Function: updateThisPlayerCards(playerID)
Description: Updates cards and scores for the specified player after the game has started.
Retrieves and updates cards and scores for the specified player using API calls.
Alerts the user in case of an HTTP error during the API request.

Function: openColorPickModal(card)
Description: Opens a modal for the player to choose the color when a Wildcard is played.
Opens a color selection modal and resolves a promise with the selected color.
Uses a click event listener to capture the color selected by the player.

Function: changeDirection()
Description: Changes the game direction based on the card played.
Reverses the direction for the next turn (clockwise/anticlockwise) based on the 'Skip' card played.

Function: checkIfPlayerMayPlayDraw4()
Description: Checks if the current player is eligible to play the Draw 4 card.
Validates whether the player can play the Draw 4 card based on the existing top card and their hand.
Returns true if the player can play the Draw 4 card; otherwise, returns false.

Function: checkPlayedCardValidityBeforeSendingToAPI(card)
Description: Verifies the validity of the card before sending it to the API.
Checks whether the card played is valid by comparing it with the current top card or color selection.
Returns true if the card is valid; otherwise, returns false.

Function: sendPlayedCardToAPI(card, colorPick)
Description: Sends the played/chosen card to the server after a player's move.
Constructs the URL and performs a PUT request to the API endpoint with the card value, color, and wildColor.
Updates global game state variables such as Player and NextPlayer based on API response.
Handles error alerts in case of an HTTP error during the API request.

Function: penalizedPlayer(previousPlayerIndex)
Description: Determines the penalized player based on the game direction for special card actions (Skip or Draw 2).
Identifies the player ID of the next player to be penalized according to the game's direction.
Considers the game's direction (clockwise or counterclockwise) to determine the player ID.

Function: updateFrontEnd(card, playerID)
Description: Updates the front-end interface after a player's move.
Checks for specific cards (Skip or Wild Draw 4) and updates players' cards accordingly.
Validates if a player has won the round or the game.
Updates the game state, top card, current player, and player scores based on API calls.

Function: playerPlaysACard(card, colorPick)
Description: Handles the logic when a player plays a card.
Checks the validity of the card played before sending it to the API.
Sends the played card to the API if it's valid.
Updates the front-end interface after the move by calling updateFrontEnd().

Function: displayWinner(player)
Description: Displays the winner's name in a modal dialog box.
Sets up the winner's name to be displayed in the winner modal dialog box.
Prepares for the presentation of the winner's information.

Function: openWinnerModal(playerName)
Description: Handles the winner's modal dialog for displaying player points and declaring the winner.
Displays the winner's name along with their points in a modal dialog box.
Handles options for starting another round or ending the game.

Function: resetPlayground()
Description: Resets the game environment and UI to the initial state after a round ends.
Resets the background image, text color, and specific game messages.
Sets a new background image, font color, and updated game message for the next round.

Function: callUNO(playerID)
Description: Handles the player's UNO call action.
Evaluates if the player can call UNO and triggers corresponding sound effects based on the decision.

Function: cardCheck(card)
Description: Validates if a card can be played or not based on the top card and game rules.
Checks the validity of a card against the top card, colorPick, and game rules.
Returns true if the card can be played; otherwise, returns false.

Function: badUnoCall()
Description: Handles the visual indication when a player calls UNO but the call is invalid

Function: goodUnoCall()
Description: Handles the visual indication when a player calls UNO and the call is valid.

Function: sortPlayerCards() 
Description: This function is a comparator used for sorting cards based on their color attribute. 
        It's intended to be used with sorting the cards of a player.

Function: thanksForPlaying()
Description: Displays a closing message and appreciation for playing the game.
Sets the game environment to a closing state with a specific background, font color, and a goodbye message.
