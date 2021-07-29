const fs = require('fs')
const path = require('path')
const ResponseService = require('../../base/response_service')
const {randomNumber} = require('../../helper/helper')
const {MAX_PLAYER_COUNT} = require('../../helper/core_constants')

class GameService extends ResponseService {

    /**
     * UserService constructor.
     */
    constructor() {
        super()
    }

    /**
     * @param {Object} request
     * @return {Object}
     */
    joinGame = async request => {
        try {
            const gameId = request.body.gameId
            let database = this.readData('data.json')

            let game = database.game[gameId]
            if (!game) {
                return this.response().error("Wrong Game Id")
            }

            let playerCount = Object.keys(game.players).length
            if (game.gameStarted) {
                return this.response().error("Game Already Started")
            } else if (playerCount>=MAX_PLAYER_COUNT) {
                return this.response().error("Player Full")
            } else {
                database.game[gameId].players['player'+(playerCount+1)] =  request.body.username
                this.writeData('data.json', database)
                return this.response({gameId}).success('Joined Game Successfully')
            }
        } catch (e) {
            return this.response().error(e.message)
        }
    }

    /**
     * @param {Object} request
     * @return {Object}
     */
    createGame = async request => {
        try {
            let database = this.readData('data.json')
            let gameId = String(Object.keys(database.game).length+111111)
            database.game[gameId] = {
                gameId,
                players:{
                    player1: request.body.username
                },
                gameStarted: false,
                turn: "player2"
            }
            this.writeData('data.json', database)

            return this.response({gameId}).success('Game Created Successfully')
        } catch (e) {
            return this.response().error(e.message)
        }
    }

    readData = (filename) => {
        let data = fs.readFileSync(path.join(__dirname, filename), err => {
            if (err) throw err
        })
        return JSON.parse(data)
    }

    writeData = (filename, database) => {
        database = JSON.stringify(database)
        fs.writeFileSync(path.join(__dirname, 'data.json'), database, 'utf8', err => {
            if (err) throw err
        })
    }
}

module.exports = GameService