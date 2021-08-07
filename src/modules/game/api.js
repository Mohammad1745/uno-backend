const express = require('express')
const route = express.Router()
const gameController = require('./game_controller')

//game
route.post('/join', gameController.join)
route.post('/create', gameController.create)
route.get('/game', gameController.game)
route.get('/player-list', gameController.playerList)
route.get('/start-game', gameController.startGame)
route.post('/play-card', gameController.playCard)
route.post('/skip-play', gameController.skipPlay)
route.post('/draw-card', gameController.drawCard)
route.post('/call-uno', gameController.callUno)
route.get('/quit', gameController.quitGame)

module.exports = route