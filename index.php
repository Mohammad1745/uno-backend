<html>
   <head>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Zen+Loop&display=swap" rel="stylesheet">
      <link href="style.css" rel="stylesheet">
   </head>

   <body>
     <?php

     $data = array(
       "name" => "Sami",
       "last" => "",
       "" => "",
       "" => ""
     );

     $cards = array("0R","1R","1R","2R","2R","3R","3R","4R","4R","5R","5R","6R","6R","7R","7R","8R","8R","9R","9R","sR","sR","rR","rR","dR","dR",
    "0Y","1Y","1Y","2Y","2Y","3Y","3Y","4Y","4Y","5Y","5Y","6Y","6Y","7Y","7Y","8Y","8Y","9Y","9Y","sY","sY","rY","rY","dY","dY",
    "0G","1G","1G","2G","2G","3G","3G","4G","4G","5G","5G","6G","6G","7G","7G","8G","8G","9G","9G","sG","sG","rG","rG","dG","dG",
    "0B","1B","1B","2B","2B","3B","3B","4B","4B","5B","5B","6B","6B","7B","7B","8B","8B","9B","9B","sB","sB","rB","rB","dB","dB",
    "cC","cC","cC","cC","fC","fC","fC","fC");

    shuffle($cards);

    $my_cards = array_slice($cards, 0, 10);
    $bot2 = array_slice($cards, 10, 10);
    $bot3 = array_slice($cards, 20, 10);
    $bot4 = array_slice($cards, 30, 10);

    $last = array("7R","","","");

    $rest_card = array_slice($cards, 40, 68);

    sort($bot2);
    sort($bot3);
    sort($bot4);
    sort($my_cards);

     ?>
    <div class="header">
      <h1 class="head">UNO-LIMITED</h1>
      <div id="user">
        <div id="username">Hola Sami!</div>
        <div class="">
          <button class="ENBN actv">EN</button>
          <button class="ENBN">BN</button>
        </div>
      </div>
    </div>
    <br>

    <div class="intro hide">
      <div>
        <img class="intro-img" src="img/uno.png" alt="">
      </div>
      <div class="">
        <p class="intro-text">
          UNO-LIMITED is a free web application to play UNO. Have fun with your friends in this pendamic. This is developed as a fun project.
          <br><br>
          Create a unique game id of maximum 6 characters and share it with your friends. Or join games with game id created by your friend.
        </p>
      </div>
    </div>


     <div class="start hide" id="start">
       <div class="create-game">
         <form>
           <label for="userId">Nickname:</label>
           <input type="text" maxlength="10" name="userId" id="userId"><br>
           <label for="serverId">Game ID:</label>
           <input type="text" maxlength="6" name="serverId" id="serverId" placeholder="abc12"><br>
           <label for="numPlayer">Number of players:</label>
           <select name="numPlayer" id="numPlayer">
               <option value="2">2</option>
               <option value="3">3</option>
               <option value="4">4</option>
           </select><br>

           <input type="hidden" name="mycards" id="mycards" value="<?php echo implode(";",$my_cards); ?>">
           <input type="hidden" name="rest" id="rest" value="<?php echo implode(";",$rest_card); ?>">
           <input type="hidden" name="bot2" id="bot2" value="<?php echo implode(";",$bot2); ?>">
           <input type="hidden" name="bot3" id="bot3" value="<?php echo implode(";",$bot3); ?>">
           <input type="hidden" name="bot4" id="bot4" value="<?php echo implode(";",$bot4); ?>">


           <button id="startBtn" class="btn">Create Game</button>
         </form>
       </div>

       <div class="join-game">
         <form>
           <label for="userId">Nickname:</label>
           <input type="text" maxlength="10" name="userId" id="userId"><br>
           <label for="severId">Game ID:</label>
           <input type="text" maxlength="6" name="serverId" id="serverId" placeholder="abc12"><br>
           <button id="staBtn" class="btn">Join Game</button>
         </form>
       </div>


     </div>


     <div class="container ide">
       <div class="player1">
         <h2>You</h2>
         <?php
            for ($x = 0; $x < count($my_cards); $x++) {
              if (($last[0][0] == $my_cards[$x][0]) or ($last[0][1] == $my_cards[$x][1]) or ($my_cards[$x][1] == "C")) {
              ?>
              <a href="#"><img src="img/<?php echo $my_cards[$x]; ?>.png" class="img img-stack" style="transform: rotate(<?php echo ($x-((count($my_cards)-1)/2))*20; ?>deg);"></a>
        <?php    }
        else { ?>
          <img class="img-stack img" src="img/<?php echo $my_cards[$x]; ?>.png" style="transform: rotate(<?php echo ($x-((count($my_cards)-1)/2))*20; ?>deg);">
          <?php
        } }
          ?>

       </div>
       <div class="player2">
         <h2>Player 2</h2>
         <?php
            for ($x = 0; $x < count($bot2); $x++) {?>
                <img class="img-stack-others img" src="img/uno.png" style="transform: rotate(<?php echo ($x-((count($bot2)-1)/2))*20; ?>deg);">
        <?php    }
          ?>

       </div>
       <div class="player3">
         <h2>Player 3</h2>
         <?php
            for ($x = 0; $x < count($bot3); $x++) {?>
                <img class="img-stack-others img" src="img/uno.png" style="transform: rotate(<?php echo ($x-((count($bot3)-1)/2))*20; ?>deg);">
        <?php    }
          ?>

       </div>
       <div class="player4">
         <h2>Player 4</h2>
         <?php
            for ($x = 0; $x < count($bot4); $x++) {?>
                <img class="img-stack-others img" src="img/uno.png" style="transform: rotate(<?php echo ($x-((count($bot4)-1)/2))*20; ?>deg);">
        <?php    }
          ?>

       </div>
       <div class="mid">
         <?php
            for ($x = 0; $x < 4; $x++) {
              if ($last[$x] != "") { ?>
              <img class="img" src="img/<?php echo $last[$x]; ?>.png">
        <?php  }  }
          ?>

       </div>

     </div>


    <div class="ide">
      <div class="messages" id="messages">
        <ul id="msgs"></ul>

        <form style="text-align: center;">
          <input type="text" id="message" placeholder="Enter message" autocomplete="off">
          <button type="button" id="sendMessage" class"sendMessage">Send</button>
        </form>
        <button type="button" class="close" onclick="closeForm()">Close</button>
      </div>

      <button class="open-button" onclick="openForm()">Chat</button>
    </div>


<div class="footer hide">
  Some text, maybe later.
</div>





     <!-- The core Firebase JS SDK is always required and must be listed first -->
     <script src="https://www.gstatic.com/firebasejs/8.8.0/firebase-app.js"></script>
     <script src="https://www.gstatic.com/firebasejs/8.8.0/firebase-firestore.js"></script>
     <script src="https://www.gstatic.com/firebasejs/8.8.0/firebase-database.js"></script>
     <script src="https://www.gstatic.com/firebasejs/8.8.0/firebase-auth.js"></script>
     <!-- TODO: Add SDKs for Firebase products that you want to use
          https://firebase.google.com/docs/web/setup#available-libraries -->
     <script src="https://www.gstatic.com/firebasejs/8.8.0/firebase-analytics.js"></script>

     <script>
       // Your web app's Firebase configuration
       // For Firebase JS SDK v7.20.0 and later, measurementId is optional
       var firebaseConfig = {
         apiKey: "AIzaSyC6KcLbdXriQ7y-6G1U0cCctFQ8Rmdy3hU",
         authDomain: "uno-online-1308a.firebaseapp.com",
         databaseURL: "https://uno-online-1308a-default-rtdb.firebaseio.com",
         projectId: "uno-online-1308a",
         storageBucket: "uno-online-1308a.appspot.com",
         messagingSenderId: "696665546246",
         appId: "1:696665546246:web:0a6cabd3d7a67cc0f1ed87",
         measurementId: "G-RQPLJHK7MV"
       };
       // Initialize Firebase
       firebase.initializeApp(firebaseConfig);
       firebase.analytics();

     </script>


     <script type="text/javascript" src="./function.js"></script>
   </body>
</html>
