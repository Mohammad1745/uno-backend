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





document.getElementById('lgout').style.display="none"
document.getElementById('start').style.display="none"
document.getElementById('login').addEventListener('click', GoogleLogin)
document.getElementById('logout').addEventListener('click', LogoutUser)

let provider = new firebase.auth.GoogleAuthProvider()
function GoogleLogin(){
  console.log('Login Btn Call')
  firebase.auth().signInWithPopup(provider).then(res=>{
    console.log(res.user)
    showUserDetails(res.user)
  }).catch(e=>{
    console.log(e)
  })
}

function showUserDetails(user){
  document.getElementById('userDetails').innerHTML = `
   <p>${user.displayName}</p>
  `
}

function checkAuthState(){
  firebase.auth().onAuthStateChanged(user=>{
    if(user){
      document.getElementById('lgin').style.display="none"
      document.getElementById('lgout').style.display="flex"
      document.getElementById('start').style.display="flex"
      showUserDetails(user)
    }else{

    };
  });
};

function LogoutUser(){
  console.log('Logout Btn Call')
  firebase.auth().signOut().then(()=>{
    document.getElementById('lgin').style.display="inherit"
    document.getElementById('lgout').style.display="none"
    document.getElementById('start').style.display="none"
  })
}


checkAuthState();
