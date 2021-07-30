
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
    console.log(response.data)
    let gameLoginForm = document.getElementById('game_login')
    gameLoginForm.style.display = 'none'
    let gameContainer = document.getElementById('game_container')
}

function handleLoadGameRequestError(response) {
    helper.alertMessage("error", response.message)
    console.log(response.message)
}
