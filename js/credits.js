
function before(){
    document.getElementById('myImage')
    .src="./img/kata_b.jpg";
    document.getElementById('myImage1')
    .src="./img/myla_b.jpg";
    document.getElementById('myImage2')
    .src="./img/ksenija_b.jpg";
    document.getElementById('message')
    .innerHTML="This Game is presented to you by these bitches!";
}
     
function afterr(){
    document.getElementById('myImage')
    .src="./img/kata.jpeg";
    document.getElementById('myImage1')
    .src="./img/myla.jpeg";
    document.getElementById('myImage2')
    .src="./img/ksenija.jpeg";
    document.getElementById('message')
    .innerHTML="... sorry, we mean witches ! ...";
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
