const serverId = document.getElementById("serverId");
const rest = document.getElementById("rest");
const bot2 = document.getElementById("bot2");
const bot3 = document.getElementById("bot3");
const bot4 = document.getElementById("bot4");

const numPlayer = document.getElementById("numPlayer");
const cardsPlayer1 = document.getElementById("mycards");
const startBtn = document.getElementById("startBtn");

const message = document.getElementById("message");

const database = firebase.database();

// Get the container element
var btnContainer = document.getElementById("user");

// Get all buttons with class="btn" inside the container
var btns = btnContainer.getElementsByClassName("ENBN");

// Loop through the buttons and add the active class to the current/clicked button
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function() {
    var current = document.getElementsByClassName("actv");
    current[0].className = current[0].className.replace(" actv", "");
    this.className += " actv";
  });
}




startBtn.addEventListener("click", (e) =>{
  e.preventDefault();
  database.ref('/'+serverId.value+"/main").set({
    num: numPlayer.value,
    turn: numPlayer.value,
    rest: rest.value,
  });
  database.ref('/'+serverId.value+"/player1").set({
    name: '',
    cards: cardsPlayer1.value,
  });
  database.ref('/'+serverId.value+"/player2").set({
    name: "nai",
    cards: bot2.value,
  });
  database.ref('/'+serverId.value+"/player3").set({
    name: "nai",
    cards: bot3.value,
  });
  database.ref('/'+serverId.value+"/player4").set({
    name: "nai",
    cards: bot4.value,
  });
});


sendMessage.addEventListener("click", (e) =>{
  e.preventDefault();
  database.ref('/chats').push().set({
    sender: 'sami',
    message: message.value,
  });
});

// listen for incoming messages
database.ref('/chats').on('child_added', function (snapshot){
  var html = "";
  html += "<li>";
  html += snapshot.val().sender + ": " + snapshot.val().message;
  html += "</li>";

  document.getElementById("msgs").innerHTML += html;
});
