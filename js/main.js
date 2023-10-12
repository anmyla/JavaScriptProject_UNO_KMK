/*
const socket = io()
*/

let playersList = [];
let playersListRoom = [];

// Open the Modal dialog when the button is clicked
document.getElementById('openModal1').addEventListener('click', function () {
  $('#nameModal').modal('show');
});

document.getElementById('openModal2').addEventListener('click', function () {
  $('#nameModalRoom').modal('show');
});


// Handle form submission
document.getElementById('nameForm').addEventListener('submit', function (e) {
  e.preventDefault(); // Prevent the form from submitting traditionally

  const player1Name = document.getElementById('player1Name').value;
  const player2Name = document.getElementById('player2Name').value;
  const player3Name = document.getElementById('player3Name').value;
  const player4Name = document.getElementById('player4Name').value;

  // Add the names to the playersList array
  playersList = [player1Name, player2Name, player3Name, player4Name];

  // Close the Modal dialog
  $('#nameModal').modal('hide');

  // You can use the playersList array as needed
  console.log('Player Names:', playersList);

  // Call the function to initially display the players list
  displayPlayersList();

});

// Handle form submission
document.getElementById('nameFormRoom').addEventListener('submit', function (e) {
  e.preventDefault(); // Prevent the form from submitting traditionally

  const roomPlayerName = document.getElementById('roomPlayerName').value;

  // Add the names to the playersList array
  playersListRoom = [roomPlayerName];

  // Close the Modal dialog
  $('#nameModalRoom').modal('hide');

  // You can use the playersList array as needed
  console.log('Player Names:', playersListRoom);

});


document.getElementById('nameFormRoom').addEventListener('submit', function (e) {
  e.preventDefault(); // Prevent the form from submitting traditionally

  const roomPlayerName = document.getElementById('roomPlayerName').value;

  // Add the names to the playersList array
  playersListRoom = [roomPlayerName];

  // Close the Modal dialog
  $('#nameModalRoom').modal('hide');

  // Redirect to room.html
  window.location.href = 'room.html'; // Change 'room.html' to the actual URL you want to redirect to
});






// Function to display the list of players in the specified div
function displayPlayersList() {

  // Clear the existing content of the playersDiv
  let playersDiv = document.querySelector('#playersInTheGame');
  playersDiv.innerHTML = '';

  // Check if the playersList array is not empty
  if (playersList.length > 0) {
    // Create an unordered list element
    const ul = document.createElement('ul');

    // Loop through the playersList array and create list items
    playersList.forEach(function (playerName, index) {
      const li = document.createElement('li');
      li.textContent = playerName;

      // Apply different font size to the heading and list items
      if (index === 0) {
        const headingPlayerList = document.createElement('h3');
        headingPlayerList.textContent = 'Player List:';
        playersDiv.appendChild(headingPlayerList);
      }

      ul.appendChild(li);
    });

    // Append the unordered list to the playersDiv
    playersDiv.appendChild(ul);
  } else {
    // If playersList is empty, display a message
    playersDiv.textContent = 'No players in the list.';
  }
}


