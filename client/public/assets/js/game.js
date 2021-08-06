
function game() {
    let gameId = localStorage.getItem('gameId')
    handleSocketGameEvents()
    loadGameContainer(gameId)
}

function handleSocketGameEvents() {
    socket.on('game-updated', async payload => {
        let gameId = localStorage.getItem('gameId')
        if(gameId && payload.gameId === gameId) {
            await helper.sleep(1000)
            audio.cardFlick.play()
            loadGameContainer(gameId)
        }
    })
}

function loadGameContainer(gameId) {
    $.ajax({
        url: helper.DOMAIN + "/api/game/game",
        method: "GET",
        data: {gameId}
    }).done(async response => {
        response.success ?
            await handleLoadGameRequestSuccess(response) :
            handleLoadGameRequestError(response)
    }).fail(err => {
        console.log(err)
    })
}

async function handleLoadGameRequestSuccess(response) {
    let game = response.data
    let gameLoginForm = document.getElementById('game_login')
    gameLoginForm.style.display = 'none'
    let userId = localStorage.getItem('userId')
    localStorage.setItem('gameStarted', 'true')
    localStorage.setItem('turn', game.turn)
    localStorage.setItem('color', game.color)
    if (game.gameEnded) {
        audio.gameCompleted.play()
        localStorage.setItem('gameEnded', 'true')
    }
    else
        localStorage.removeItem('gameEnded')

    if (game.players[userId].canDraw)
        localStorage.setItem('cardsCount', game.cardsCount)
    else
        localStorage.setItem('cardsCount', 0)

    Object.keys(game.players).map(playerId => {
        if (game.players[playerId].uno)
            localStorage.setItem(playerId+"_uno", 'true')
        else
            localStorage.removeItem(playerId+"_uno")
    })

    Object.keys(game.players).map(playerId => {
        if (game.players[playerId].position) {
            localStorage.setItem(playerId + "_position", game.players[playerId].position)
            localStorage.removeItem(playerId + "_uno")
        }
    })
    await updateGameContainers(game)
    if (!game.gameEnded) {
        handleCardPlay()
        handleUnoCall()
    }
}

function handleLoadGameRequestError(response) {
    helper.alertMessage("error", response.message)
    console.log(response.message)
    localStorage.clear()
    location.reload()
}

async function updateGameContainers(game) {
    let gameContainer = document.getElementById('game_container')
    gameContainer.innerHTML = ''

    let gameEnded = localStorage.getItem('gameEnded')
    let gameId = localStorage.getItem('gameId')
    let userId = localStorage.getItem('userId')
    let turnUser = localStorage.getItem('turn')
    let cardsCount = localStorage.getItem('cardsCount')
    let color = localStorage.getItem('color')
    let lastCard = game.lastCards[0][0]==='f' || game.lastCards[0][0]==='c' ? game.lastCards[0]+color :  game.lastCards[0]
    let autoSkip = true
    let html = ''
    Object.keys(game.players).map(key => {
        let uno = localStorage.getItem(key+"_uno") ? 'Uno' : ''
        let position = localStorage.getItem(key+"_position") ? localStorage.getItem(key+"_position") : ''
        let player = game.players[key]
        html += `<div class="${key}-area" id="${key}_area">
            <div class="player-area-head" id="player_area_head">
              ${player.username} <span class="float-right">${uno}${position}</span>
            </div>
            <div class="player-cards-area">`
        Object.keys(player.cards).map(index => {
            let rotation = (index-((player.cards.length-1)/2))*15
            if (key===userId && (Number(cardsCount)<=1 && (game.lastCards[0][0] === player.cards[index][0] || player.cards[index][1] === color || player.cards[index][1] === "C")
            || (Number(cardsCount)>1 && ['d','f','c'].includes(player.cards[index][0])))) {
                autoSkip = false
                html += `<img src="./public/assets/images/cards/${player.cards[index]}.png" data-name="${player.cards[index]}" class="card card-stack playable-card cursor-pointer" style="transform: rotate(${rotation}deg);">`
            }
            else {
                let className = key === userId ? "card-stack" : "card-stack-others"
                let imageName = key === userId ? player.cards[index] : "uno"
                html += `<img src="./public/assets/images/cards/${imageName}.png" class="card ${className}" style="transform: rotate(${rotation}deg);">`
            }
        })
        html += ` </div></div>`
    })
    html += `<div class="mid">`
    if(gameEnded){
        html += `<button id="play_again_btn" class="play-again-btn must" >Play Again</button>`
    }else {
        html += `
          <img class="card" src="./public/assets/images/cards/${game.lastCards[2]}.png">
          <img class="card" src="./public/assets/images/cards/${game.lastCards[1]}.png"  style="margin-left: -40px;">
          <img class="card" src="./public/assets/images/cards/${lastCard}.png"  style="margin-left: -40px;">`

        if(Number(cardsCount) && turnUser === userId)
            html += `<button id="draw_card_btn" class="draw-card" >Draw ${cardsCount} Cards</button>`
        html += `<button id="uno_call_btn" class="uno-call">UNO</button>`
        if(!Number(cardsCount) && turnUser === userId)
            html +=`<button id="skip_btn" class="skip-btn">Skip</button>`
    }
    html += `</div>`

    gameContainer.insertAdjacentHTML('beforeend', html)

    let turnUserHeader = document.querySelector("#" + turnUser + "_area").querySelector('#player_area_head')
    if (gameEnded)
        handlePlayAgain()
    else
        turnUserHeader.classList.add('player-turn')

    updateGameContainerGrid(game.players, userId)

    document.getElementById('quit_btn').style.display = "block"

    if(autoSkip && !Number(cardsCount) && turnUser === userId) {
        turnUserHeader.innerHTML = "Auto Skip"
        await helper.sleep(1000)
        socket.emit('game-updated', {gameId})
        saveSkipping({gameId, userId})
    }
}

function handlePlayAgain() {
    let playAgainButton = document.getElementById('play_again_btn')
    playAgainButton.addEventListener('click', () => {
        let gameId = localStorage.getItem('gameId')
        socket.emit('start-game', {gameId})
        startGame(gameId)
    })
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
    let cardsCount = localStorage.getItem('cardsCount')
    let playableCards = document.querySelectorAll('.playable-card')
    let drawCardButton = document.getElementById('draw_card_btn')
    let skipButton = document.getElementById('skip_btn')

    if (Number(cardsCount) && drawCardButton){
        if (!playableCards.length && turnUser === userId) {
            drawCardButton.classList.add('must')
        }
        drawCardButton.addEventListener('click', () => {
            socket.emit('game-updated', {gameId})
            saveCardDrawing({gameId, userId})
        })
    }
    if (!Number(cardsCount) && skipButton) {
        skipButton.addEventListener('click', () => {
            socket.emit('game-updated', {gameId})
            saveSkipping({gameId, userId})
        })
    }
    for (let card of playableCards) {
        if(turnUser===userId){
            card.addEventListener('click', event => {
                let cardName = event.target.getAttribute('data-name')
                let color = cardName[1]
                if(cardName[0]==='f' || cardName[0]==='c')
                    chooseColor({gameId, userId, cardName, color})
                else {
                    socket.emit('game-updated', {gameId})
                    saveCardPlay({gameId, userId, cardName, color})
                }

            })
        } else {
            card.classList.remove('cursor-pointer')
        }
    }
}

function chooseColor({gameId, userId, cardName, color}) {
    let content = `
        <div class="color-popup-container" id="color_popup_container">
          Choose a color
          <div class="choose-color" id="choose_color">
            <div class="red cursor-pointer" id="red" data-color="R"></div>
            <div class="blue cursor-pointer" id="blue" data-color="B"></div>
            <div class="yellow cursor-pointer" id="yellow" data-color="Y"></div>
            <div class="green cursor-pointer" id="green" data-color="G"></div>
          </div>
        </div>`
    document.body.insertAdjacentHTML('beforeend', content)

    let chooseColorDom = document.getElementById('color_popup_container')
    chooseColorDom.addEventListener('click', event => {
        chooseColorDom.remove()
        color = event.target.getAttribute('data-color')
        socket.emit('game-updated', {gameId})
        saveCardPlay({gameId, userId, cardName, color})
    })
}

function saveCardPlay({gameId, userId, cardName, color}) {
    $.ajax({
        url: helper.DOMAIN + "/api/game/play-card",
        method: "POST",
        data: {gameId, userId, card:cardName, color}
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

function saveSkipping({gameId, userId}) {
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

function handleUnoCall () {
    let gameId = localStorage.getItem('gameId')
    let userId = localStorage.getItem('userId')
    let unoCallButton = document.getElementById('uno_call_btn')
    unoCallButton.addEventListener('click', () => {
        socket.emit('game-updated', {gameId})
        saveUnoCall({gameId, userId})
    })
}

function saveUnoCall({gameId, userId}) {
    $.ajax({
        url: helper.DOMAIN + "/api/game/call-uno",
        method: "POST",
        data: {gameId, userId}
    }).done(response => {
        response.success ?
            handleUnoCallRequestSuccess(response) :
            handleUnoCallRequestError(response)
    }).fail(err => {
        console.log(err)
    })
}

function handleUnoCallRequestSuccess(response) {
}

function handleUnoCallRequestError(response) {
    helper.alertMessage("error", response.message)
    console.log(response.message)
}
