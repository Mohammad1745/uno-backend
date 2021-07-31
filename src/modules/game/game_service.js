const fs = require('fs')
const path = require('path')
const ResponseService = require('../../base/response_service')
const {randomNumber, Cards} = require('../../helper/helper')
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
    playerList = async request => {
        try {
            const gameId = request.query.gameId;
            let database = this.readData('data.json')

            let game = database.games[gameId]
            if (!game) {
                return this.response().error("Wrong Game Id")
            }

            return this.response(game.players).success('Joined Game Successfully')
        } catch (e) {
            return this.response().error(e.message)
        }
    }

    /**
     * @param {Object} request
     * @return {Object}
     */
    startGame = async request => {
        try {
            const gameId = request.query.gameId;
            let database = this.readData('data.json')

            let game = database.games[gameId]
            if (!game) {
                return this.response().error("Wrong Game Id")
            }

            if (game.gameStarted) {
                return this.response().error("Game Already Started")
            } else {
                let cards = Cards()
                cards.sort(function() { return 0.5 - Math.random() });
                let index = 0
                console.log(Object.keys(game.players))
                Object.keys(game.players).map(key => {
                    database.games[gameId].players[key].cards = cards.filter((card, indx) => (indx >= index && indx <= index+9))
                    console.log(index)
                    index += 10
                })
                database.games[gameId].lastCards =  cards.filter((card, indx) => (indx >= index && indx <= index+3))
                index += 4
                database.games[gameId].restCards =  cards.filter((card, indx) => (indx >= index))
                database.games[gameId].gameStarted = true
                this.writeData('data.json', database)
                return this.response().success('Joined Game Successfully')
            }
        } catch (e) {
            return this.response().error(e.message)
        }
    }

    /**
     * @param {Object} request
     * @return {Object}
     */
    game = async request => {
        try {
            const gameId = request.query.gameId;
            let database = this.readData('data.json')

            let game = database.games[gameId]
            if (!game) {
                return this.response().error("Wrong Game Id")
            }
            return this.response(game).success('Joined Game Successfully')
        } catch (e) {
            return this.response().error(e.message)
        }
    }

    /**
     * @param {Object} request
     * @return {Object}
     */
    join = async request => {
        try {
            const username = request.body.username
            const gameId = request.body.gameId
            let database = this.readData('data.json')

            let game = database.games[gameId]
            if (!game) {
                return this.response().error("Wrong Game Id")
            }

            let playerCount = Object.keys(game.players).length
            if (game.gameStarted) {
                return this.response().error("Game Already Started")
            } else if (playerCount>=MAX_PLAYER_COUNT) {
                return this.response().error("Player Full")
            } else {
                let userId = 'player'+(playerCount+1)
                database.games[gameId].players[userId] = {
                    username,
                    cards: [],
                    uno: false
                }
                this.writeData('data.json', database)
                return this.response({username, gameId, userId}).success('Joined Game Successfully')
            }
        } catch (e) {
            return this.response().error(e.message)
        }
    }

    /**
     * @param {Object} request
     * @return {Object}
     */
    create = async request => {
        try {
            const username = request.body.username
            let database = this.readData('data.json')
            let gameId = String(Object.keys(database.games).length+111111)
            let userId = "player1"
            database.games[gameId] = {
                gameId,
                players:{
                    player1: {
                        username: request.body.username,
                        cards: [],
                        uno: false
                    }
                },
                gameStarted: false,
                turn: "player2"
            }
            this.writeData('data.json', database)

            return this.response({username, gameId, userId}).success('Game Created Successfully')
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
        fs.writeFileSync(path.join(__dirname, filename), database, 'utf8', err => {
            if (err) throw err
        })
    }
}

module.exports = GameService