
function game() {
    let gameId = localStorage.getItem('gameId')
    handleSocketGameEvents()
    loadGameContainer(gameId)
}

function handleSocketGameEvents() {
    socket.on('card-played', async payload => {
        let gameId = localStorage.getItem('gameId')
        await helper.sleep(1000)
        loadGameContainer(gameId)
    })
    socket.on('card-drawn', async payload => {
        let gameId = localStorage.getItem('gameId')
        await helper.sleep(1000)
        loadGameContainer(gameId)
    })
}

function loadGameContainer(gameId) {
    $.ajax({
        url: helper.DOMAIN + "/api/game/game",
        method: "GET",
        data: {gameId}
    }).done(response => {
        response.success ?
            handleLoadGameRequestSuccess(response) :
            handleLoadGameRequestError(response)
    }).fail(err => {
        console.log(err)
    })
}

function handleLoadGameRequestSuccess(response) {
    console.log(response.data)
    let game = response.data
    let gameLoginForm = document.getElementById('game_login')
    gameLoginForm.style.display = 'none'
    let userId = localStorage.getItem('userId')
    localStorage.setItem('canDraw', game.players[userId].canDraw)
    localStorage.setItem('turn', game.turn)
    updateGameContainers(game)
    handleCardPlay()
}

function handleLoadGameRequestError(response) {
    helper.alertMessage("error", response.message)
    console.log(response.message)
}

function updateGameContainers(game) {
    let gameContainer = document.getElementById('game_container')
    gameContainer.innerHTML = ''
    let userId = localStorage.getItem('userId')
    let turnUser = localStorage.getItem('turn')
    let canDraw = localStorage.getItem('canDraw')
    let numberOfCardCanBeDrawn = canDraw==="true" ? 1 : 0;
    let html = ''
    Object.keys(game.players).map(key => {
        let player = game.players[key]
        html += `<div class="${key}-area" id="${key}_area">
            <div class="player-area-head" id="player_area_head">
              ${player.username}
            </div>
            <div class="player-cards-area">`
        Object.keys(player.cards).map(index => {
            let rotation = (index-((player.cards.length-1)/2))*15
            if (key===userId && (game.lastCards[0][0] === player.cards[index][0] || game.lastCards[0][1] === player.cards[index][1] || player.cards[index][1] === "C"))
                html += `<img src="./public/assets/images/cards/${player.cards[index]}.png" data-name="${player.cards[index]}" class="card card-stack playable-card cursor-pointer" style="transform: rotate(${rotation}deg);">`
            else {
                let className = key === userId ? "card-stack" : "card-stack-others"
                let imageName = key === userId ? player.cards[index] : "uno"
                html += `<img src="./public/assets/images/cards/${imageName}.png" class="card ${className}" style="transform: rotate(${rotation}deg);">`
            }
        })
        html += ` </div></div>`
    })
    html += `<div class="mid">
          <img class="card" src="./public/assets/images/cards/${game.lastCards[2]}.png">
          <img class="card" src="./public/assets/images/cards/${game.lastCards[1]}.png"  style="margin-left: -40px;">
          <img class="card" src="./public/assets/images/cards/${game.lastCards[0]}.png"  style="margin-left: -40px;">`
    if(canDraw==="true" && turnUser === userId)
        html += `<button id="draw_card_btn" class="draw-card" >Draw ${numberOfCardCanBeDrawn} Cards</button>`
    html += `<button id="uno_call_btn" class="uno-call">UNO</button>`
    if(canDraw!=="true" && turnUser === userId)
        html +=`<button id="skip_btn" class="skip-btn">Skip</button>`
    html += `</div>`

    gameContainer.insertAdjacentHTML('beforeend', html)
    updateGameContainerGrid(game.players, userId)
}

function updateGameContainerGrid(players, userId) {
    let gameContainer = document.getElementById('game_container')
    if(Object.keys(players).length===2){
        if(userId==='player1') {
            gameContainer.classList.add('container-2p-1')
        } else {
            gameContainer.classList.add('container-2p-2')
        }
    }
    else if(Object.keys(players).length===3){
        if(userId==='player1') {
            gameContainer.classList.add('container-3p-1')
        } else if(userId==='player2') {
            gameContainer.classList.add('container-3p-2')
        } else {
            gameContainer.classList.add('container-3p-3')
        }
    }
    else if(Object.keys(players).length===4){
        if(userId==='player1') {
            gameContainer.classList.add('container-4p-1')
        } else if(userId==='player2') {
            gameContainer.classList.add('container-4p-2')
        }  else if(userId==='player3') {
            gameContainer.classList.add('container-4p-3')
        } else {
            gameContainer.classList.add('container-4p-4')
        }
    }
}

function handleCardPlay () {
    let turnUser = localStorage.getItem('turn')
    let userId = localStorage.getItem('userId')
    let gameId = localStorage.getItem('gameId')
    let canDraw = localStorage.getItem('canDraw')
    let turnUserHeader = document.querySelector("#"+turnUser+"_area").querySelector('#player_area_head')
    turnUserHeader.style.backgroundColor = "#F2EDD7"
    turnUserHeader.style.color = "black"
    let playableCards = document.querySelectorAll('.playable-card')
    let drawCardButton = document.getElementById('draw_card_btn')
    let skipButton = document.getElementById('skip_btn')
    if (canDraw==='true' && drawCardButton){
        if (!playableCards.length && turnUser === userId) {
            drawCardButton.classList.add('must')
        }
        drawCardButton.addEventListener('click', () => {
            socket.emit('card-drawn', 'draw-card-success')
            saveCardDrawing({gameId, userId})
        })
    }
    if (canDraw!=="true" && skipButton) {
        skipButton.addEventListener('click', () => {
            socket.emit('card-played', 'play-card-success')
            saveSkiping({gameId, userId})
        })
    }
    for (let card of playableCards) {
        if(turnUser===userId){
            card.addEventListener('click', event => {
                let cardName = event.target.getAttribute('data-name')
                socket.emit('card-played', 'play-card-success')
                saveCardPlay({gameId, userId, cardName})
            })
        } else {
            card.classList.remove('cursor-pointer')
        }
    }
}

function saveCardPlay({gameId, userId, cardName}) {
    $.ajax({
        url: helper.DOMAIN + "/api/game/play-card",
        method: "POST",
        data: {gameId, userId, card:cardName}
    }).done(response => {
        response.success ?
            handlePlayCardRequestSuccess(response) :
            handlePlayCardRequestError(response)
    }).fail(err => {
        console.log(err)
    })
}

function handlePlayCardRequestSuccess(response) {
}

function handlePlayCardRequestError(response) {
    helper.alertMessage("error", response.message)
    console.log(response.message)
}

function saveCardDrawing({gameId, userId}) {
    $.ajax({
        url: helper.DOMAIN + "/api/game/draw-card",
        method: "POST",
        data: {gameId, userId}
    }).done(response => {
        response.success ?
            handleDrawCardRequestSuccess(response) :
            handleDrawCardRequestError(response)
    }).fail(err => {
        console.log(err)
    })
}

function handleDrawCardRequestSuccess(response) {
}

function handleDrawCardRequestError(response) {
    helper.alertMessage("error", response.message)
    console.log(response.message)
}

function saveSkiping({gameId, userId}) {
    $.ajax({
        url: helper.DOMAIN + "/api/game/skip-play",
        method: "POST",
        data: {gameId, userId}
    }).done(response => {
        response.success ?
            handleSkipPlayRequestSuccess(response) :
            handleSkipPlayRequestError(response)
    }).fail(err => {
        console.log(err)
    })
}

function handleSkipPlayRequestSuccess(response) {
}

function handleSkipPlayRequestError(response) {
    helper.alertMessage("error", response.message)
    console.log(response.message)
}