let joinGameOptions = {
    createGame: 1,
    joinGame: 2
}
let joinGameOption = joinGameOptions.createGame

document.addEventListener("DOMContentLoaded", () => {
    joinGameMenuHandler()
    joinGameButtonHandler()
    if(localStorage.getItem('gameId')) startGamePopUp()
})

function joinGameMenuHandler() {
    const joinMenuButton = document.querySelector('#join_menu_button')
    const createMenuButton = document.querySelector('#create_menu_button')

    joinMenuButton.addEventListener('click', () => {
        joinGameOption = joinGameOptions.joinGame
        document.getElementById('game_id').style.display = "flex";
        document.getElementById("create_option").style.display = "none";
        document.getElementById("join_option").style.display = "flex";
        document.getElementById('join_button').innerHTML = "Join Game"
    })
    createMenuButton.addEventListener('click', () => {
        joinGameOption = joinGameOptions.createGame
        document.getElementById('game_id').style.display = "none";
        document.getElementById("create_option").style.display = "flex";
        document.getElementById("join_option").style.display = "none";
        document.getElementById('join_button').innerHTML = "Create Game"
    })
}

function joinGameButtonHandler() {
    const joinButton = document.getElementById('join_button')

    joinButton.addEventListener('click', () => {
        const username = document.getElementById('username').value
        const gameId = document.getElementById('game_id').value

        if(localStorage.getItem('gameId')){
            helper.alertMessage("error", "Already has a game")
            startGamePopUp()
        } else {
            if (joinGameOption===joinGameOptions.joinGame)
                joinGame({username, gameId})
            else
                createGame({username})
        }
    })
}

function joinGame ({username, gameId}) {
    $.ajax({
        url: helper.DOMAIN + "/api/game/join",
        method: "POST",
        data: {username, gameId}
    }).done(async response => {
        response.success ?
            await handleJoinGameRequestSuccess(response) :
            handleJoinGameRequestError(response)
    }).fail(err => {
        console.log(err)
    })
}

function createGame ({username}) {
    $.ajax({
        url: helper.DOMAIN + "/api/game/create",
        method: "POST",
        data: {username}
    }).done(async response => {
        console.log(response)
        response.success ?
            await handleJoinGameRequestSuccess(response) :
            handleJoinGameRequestError(response)
    }).fail(err => {
        console.log(err)
    })
}

async function handleJoinGameRequestSuccess(response) {
    let {gameId, username} = response.data
    localStorage.setItem('gameId', gameId)
    localStorage.setItem('username',  username)
    helper.alertMessage("success", response.message)
    await startGamePopUp()
}

function handleJoinGameRequestError(response) {
    helper.alertMessage("error", response.message)
    console.log(response.message)
}

async function startGamePopUp() {
    let gameId = localStorage.getItem('gameId')
    let username = localStorage.getItem('username')
    const startGamePopUp = document.getElementById('game_login')
    startGamePopUp.innerHTML = ''

    startGamePopUp.insertAdjacentHTML('beforeend', `
        <div id="popup_game_id" class="popup-game-id"> Game ID: ${gameId}</div>
        <hr>
        <ul id="player_list" class="players-list">
        
        </ul>
        <button type="button" id="start_game_button" class="start-game-button">Start Game</button>
    `)
    startGamePopUp.style.padding = "10px"
    document.getElementById('popup_game_id').style.color = 'black'
    await helper.sleep(1000)
    showPlayerList(gameId)
}

function showPlayerList (gameId) {
    $.ajax({
        url: helper.DOMAIN + "/api/game/player-list",
        method: "GET",
        data: {gameId}
    }).done(response => {
        response.success ?
            handlePlayerListRequestSuccess(response) :
            handlePlayerListRequestError(response)
    }).fail(err => {
        console.log(err)
    })
}

function handlePlayerListRequestSuccess(response) {
    let playerList = response.data
    let playerListDom = document.getElementById('player_list')
    playerListDom.innerHTML = ''
    Object.keys(playerList).map(key => {
        localStorage.setItem(key, playerList[key])
        playerListDom.insertAdjacentHTML('beforeend', `<li class="game-player-list"><img class="players-avatar" src="./public/assets/images/icons/uno-logo.png"> ${playerList[key]}</li>`)
    })
}

function handlePlayerListRequestError(response) {
    helper.alertMessage("error", response.message)
    console.log(response.message)
}
