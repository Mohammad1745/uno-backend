let joinGameOptions = {
    createGame: 1,
    joinGame: 2
}
let joinGameOption = joinGameOptions.createGame

document.addEventListener("DOMContentLoaded", () => {
    joinGameMenuHandler()
    joinGameButtonHandler()
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

        if (joinGameOption===joinGameOptions.joinGame)
            joinGame({username, gameId})
        else
            createGame({username})
    })
}

function joinGame ({username, gameId}) {
    $.ajax({
        url: helper.DOMAIN + "/api/game/join",
        method: "POST",
        data: {username, gameId}
    }).done(response => {
        response.success ?
            handleJoinGameRequestSuccess(response) :
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
    }).done(response => {
        response.success ?
            handleJoinGameRequestSuccess(response) :
            handleJoinGameRequestError(response)
    }).fail(err => {
        console.log(err)
    })
}

function handleJoinGameRequestSuccess(response) {
    console.log(response.data.gameId)
    helper.alertMessage("success", response.message)
}

function handleJoinGameRequestError(response) {
    helper.alertMessage("error", response.message)
    console.log(response.message)
}