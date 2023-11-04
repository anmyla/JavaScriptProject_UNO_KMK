

function after() {
    document.getElementById('myImage')
        .src = "./img/kata.jpg";
    document.getElementById('myImage1')
        .src = "./img/myla.jpg";
    document.getElementById('myImage2')
        .src = "./img/ksenija.jpg";
    const h1 = document.getElementById("message2");

    const newH1 = document.createElement("h1");
    newH1.textContent = "... sorry, we mean WITCHES!";

    // Füge das neue h1-Element zum Dokument hinzu
    h1.appendChild(newH1);
}


let messageAdded = false;

document.addEventListener('click', function () {
    if (!messageAdded) {
        after();
        messageAdded = true;
    }
});

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
