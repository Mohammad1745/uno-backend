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
                    game.players[key].cards = cards.filter((card, indx) => (indx >= index && indx <= index+9))
                    index += 10
                })
                game.lastCards =  cards.filter((card, indx) => (indx >= index && indx <= index+3))
                index += 4
                game.restCards =  cards.filter((card, indx) => (indx >= index))
                game.gameStarted = true
                game.color = game.lastCards[0][1]
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
            let skip = false
            let reverse = false
            let double = false
            let power = false

            const gameId = request.body.gameId;
            const userId = request.body.userId;
            const card = request.body.card;
            const color = request.body.color;

            let database = this.readData('data.json')
            let game = database.games[gameId]
            let players = Object.keys(game.players)
            if (!game) {
                return this.response().error("Wrong Game Id!")
            }
            if (userId!==game.turn) {
                return this.response().error("Wrong Player!")
            }

            let cardIndex = game.players[userId].cards.indexOf(card)
            if(game.cardsCount>1){
                cardIndex = ['d','f','c'].indexOf(card[0])===-1 ? -1 : cardIndex
            }
            if (cardIndex===-1) {
                return this.response().error("Wrong Card!")
            }
            console.log(card, 'card')
            console.log(cardIndex, 'cardIndex')

            if ([...card][0]==='s') {
                skip = true
            }else if ([...card][0]==='r') {
                reverse = true
                game.direction = game.direction === "clockwise" ? "anticlockwise" : "clockwise"
            }else if ([...card][0]==='d') {
                double = true
                game.cardsCount = game.cardsCount === 1 ? 2 : game.cardsCount+2
            }else if ([...card][0]==='f') {
                power = true
                game.cardsCount = game.cardsCount === 1 ? 4 : game.cardsCount+4
            }else if ([...card][0]==='c') {
                power = true
                game.cardsCount = 1
            }

            if (!double && !power && card[0]!==game.lastCards[0][0] && card[1]!==game.color) {
                return this.response().error("Wrong Card!")
            }

            game.players[userId].cards = game.players[userId].cards.filter((element, index) => {
                return index!==cardIndex
            })
            game.players[userId].canDraw = true;
            game.lastCards.unshift(card)
            game.restCards.unshift(game.lastCards.pop())

            if (power)
                game.color = color
            else
                game.color = game.lastCards[0][1]

            let playerSerial = Number([...userId].pop())
            if ((skip || reverse) && players.length===2) {
                //same player
            }
            if (skip && players.length>2) {
                if(game.direction==="clockwise" )
                    game.turn = playerSerial<players.length-1 ? "player"+(playerSerial+2) : "player1"
                else if(game.direction==="anticlockwise")
                    game.turn = playerSerial>2 ? "player"+(playerSerial-2) : players.pop()
            }
            else {
                if(game.direction==="clockwise" )
                    game.turn = playerSerial<players.length ? "player"+(playerSerial+1) : "player1"
                else if(game.direction==="anticlockwise")
                    game.turn = playerSerial>1 ? "player"+(playerSerial-1) : players.pop()
            }

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
    skipPlay = async request => {
        try {
            const gameId = request.body.gameId;
            const userId = request.body.userId;

            let database = this.readData('data.json')
            let game = database.games[gameId]
            let players = Object.keys(game.players)
            if (!game) {
                return this.response().error("Wrong Game Id!")
            }
            if (userId!==game.turn) {
                return this.response().error("Wrong Player!")
            }
            game.players[userId].canDraw = true;
            let playerSerial = Number([...userId].pop())

            if(game.direction==="clockwise" )
                game.turn = playerSerial<players.length ? "player"+(playerSerial+1) : "player1"
            else if(game.direction==="anticlockwise")
                game.turn = playerSerial>1 ? "player"+(playerSerial-1) : players.pop()

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
            for (let i = 0; i < game.cardsCount; i++){
                const cardIndex = randomNumber(0, game.restCards.length - 1)
                game.players[userId].cards.push(game.restCards[cardIndex])
                game.restCards = game.restCards.filter((element, index) => {
                    return index !== cardIndex
                })
            }
            game.players[userId].canDraw = false;
            if(game.cardsCount>1){
                game.cardsCount = 1
                game.players[userId].canDraw = true;
            }

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
                direction: "clockwise",
                turn: "player2",
                color: '',
                cardsCount: 1,
                result: [],
                lastCards: [],
                restCards: []
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