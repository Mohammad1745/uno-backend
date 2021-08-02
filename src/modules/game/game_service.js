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
                return this.response(game).error("Game Already Started")
            } else {
                let cards = Cards()
                cards.sort(function() { return 0.5 - Math.random() });
                let index = 0
                Object.keys(game.players).map(key => {
                    database.games[gameId].players[key].cards = cards.filter((card, indx) => (indx >= index && indx <= index+9))
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
    playCard = async request => {
        try {
            const gameId = request.body.gameId;
            const userId = request.body.userId;
            const card = request.body.card;

            let database = this.readData('data.json')
            let game = database.games[gameId]
            if (!game) {
                return this.response().error("Wrong Game Id!")
            }
            if (userId!==game.turn) {
                return this.response().error("Wrong Player!")
            }
            const cardIndex = game.players[userId].cards.indexOf(card)
            if (cardIndex===-1) {
                return this.response().error("Unknown Card!")
            }
            game.players[userId].cards = game.players[userId].cards.filter((element, index) => {
                return index!==cardIndex
            })
            game.players[userId].canDraw = true;
            game.lastCards.unshift(card)
            game.restCards.unshift(game.lastCards.pop())
            let playerSerial = Number([...userId].pop())
            if(Object.keys(game.players).length>playerSerial)
                game.turn = "player"+(playerSerial+1)
            else
                game.turn = "player1"
            this.writeData('data.json', database)

            return this.response().success('Joined Game Successfully')
        } catch (e) {
            return this.response().error(e.message)
        }
    }

    /**
     * @param {Object} request
     * @return {Object}
     */
    drawCard = async request => {
        try {
            const gameId = request.body.gameId;
            const userId = request.body.userId;

            let database = this.readData('data.json')
            let game = database.games[gameId]
            if (!game) {
                return this.response().error("Wrong Game Id!")
            }
            if (userId!==game.turn) {
                return this.response().error("Wrong Player!")
            }
            if (!game.players[userId].canDraw) {
                return this.response().error("Already Drawn!")
            }
            const cardIndex = randomNumber(0, game.restCards.length-1)
            game.players[userId].cards.push(game.restCards[cardIndex])
            game.restCards = game.restCards.filter((element, index) => {
                return index!==cardIndex
            })
            game.players[userId].canDraw = false;
            this.writeData('data.json', database)

            return this.response().success('Joined Game Successfully')
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
                    uno: false,
                    canDraw:true
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
                        uno: false,
                        canDraw:true
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