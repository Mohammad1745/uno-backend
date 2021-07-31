
function game() {
    let gameId = localStorage.getItem('gameId')
    handleSocketGameEvents()
    loadGameContainer(gameId)
}

function handleSocketGameEvents() {
    // socket.on('start-game', async payload => {
    //     await startGamePopUp()
    // })
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
    let gameLoginForm = document.getElementById('game_login')
    gameLoginForm.style.display = 'none'
    localStorage.setItem('gameStarted', 'true')
    console.log(response.data)
    updateGameContainers(response.data)
}

function handleLoadGameRequestError(response) {
    helper.alertMessage("error", response.message)
    console.log(response.message)
}

function updateGameContainers(game) {
    let gameContainer = document.getElementById('game_container')
    gameContainer.innerHTML = ''
    let userId = localStorage.getItem('userId')
    let html = ''
    Object.keys(game.players).map(key => {
        let player = game.players[key]
        html += `<div class="${key}-area">
            <div class="player-area-head">
              ${player.username}
            </div>
            <div class="player-cards-area">`
        Object.keys(player.cards).map(index => {
            let rotation = (index-((player.cards.length-1)/2))*15
            if (key===userId && (game.lastCards[0][0] === player.cards[index][0] || game.lastCards[0][1] === player.cards[index][1] || player.cards[index][1] === "C"))
                html += `<a href="#"><img src="./public/assets/images/cards/${player.cards[index]}.png" class="card card-stack" style="transform: rotate(${rotation}deg);"></a>`
            else {
                let className = key === userId ? "card-stack" : "card-stack-others"
                let imageName = key === userId ? player.cards[index] : "uno"
                html += `<img src="./public/assets/images/cards/${imageName}.png" class="card ${className}" style="transform: rotate(${rotation}deg);">`
            }
        })
        html += ` </div></div>`
    })
    html += `<div class="mid"><img class="card" src="./public/assets/images/cards/${game.lastCards[0]}.png"></div>`

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