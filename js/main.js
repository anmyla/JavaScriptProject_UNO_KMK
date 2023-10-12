document.addEventListener('DOMContentLoaded', function () {

    let playersList = [];

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


        // Assign players to different teams (Hogwart Houses)
        const teams = assignTeams([player1Name, player2Name, player3Name, player4Name]);

        // Display assigned teams in the modal
        displayTeams(teams);

        // You can use the playersList array as needed
        console.log('Player Names:', playersList);

        // Call the function to initially display the players list
        displayPlayersList();
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


    // Handle "OK" button click to close the modal
    document.getElementById('okButton').addEventListener('click', function () {
        $('#nameModal').modal('hide');
    });


    // Function to display the list of players in the specified div
    function displayPlayersList() {
        // Clear the existing content of the playersDiv
        let playersDiv = document.querySelector('#playersInTheGame');
        playersDiv.innerHTML = '';

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
    }
});