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
            let database = this._readData('data.json')

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
            let database = this._readData('data.json')

            let game = database.games[gameId]
            if (!game) {
                return this.response().error("Wrong Game Id")
            }
            else if (game.gameStarted && !game.gameEnded) {
                return this.response(game).error("Game Already Started")
            }
            else {
                let isLastCardHasNumber = false
                while (!isLastCardHasNumber) {
                    this._bootGame(game)
                    isLastCardHasNumber =  ['0','1','2','3','4','5','6','7','8','9'].includes(game.lastCards[0][0])
                }
                this._writeData('data.json', database)
                return this.response().success('Joined Game Successfully')
            }
        } catch (e) {
            return this.response().error(e.message)
        }
    }

    /**
     * @return {Object}
     * @param game
     */
    _bootGame = (game) => {
        let cards = Cards()
        cards.sort(function() { return 0.5 - Math.random() });
        let index = 0
        Object.keys(game.players).map(key => {
            game.players[key].uno = false
            game.players[key].canDraw = true
            game.players[key].position = null
            game.players[key].cards = cards.filter((card, cardIndex) => (cardIndex >= index && cardIndex <= index+9))
            index += 10
        })
        game.lastCards =  cards.filter((card, cardIndex) => (cardIndex >= index && cardIndex <= index+2))
        index += 3
        game.restCards =  cards.filter((card, cardIndex) => (cardIndex >= index))
        game.color = game.lastCards[0][1]
        game.gameStarted = true
        game.gameEnded = false
        game.turn = "player2"
        game.direction = "clockwise"
        game.cardsCount = 1
        game.result = []
    }

    /**
     * @param {Object} request
     * @return {Object}
     */
    game = async request => {
        try {
            const gameId = request.query.gameId;
            let database = this._readData('data.json')

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
            let specialCardPlay = {
                skip : false,
                reverse : false,
                double : false,
                power : false
            }

            const gameId = request.body.gameId;
            const userId = request.body.userId;
            const card = request.body.card;
            const color = request.body.color;

            let database = this._readData('data.json')
            let game = database.games[gameId]
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

            this._checkSpecialCardPlay({game,card, specialCardPlay})
            if (!specialCardPlay.double && !specialCardPlay.power && card[0]!==game.lastCards[0][0] && card[1]!==game.color) {
                return this.response().error("Wrong Card!")
            }

            let gameEnded = this._setCardPlay({game, userId, card, cardIndex})
            if(gameEnded){
                this._writeData('data.json', database)
                return this.response().success('Game Ended')
            }

            this._setColor({game, color, specialCardPlay})
            this._setGameTurn({game, userId, specialCardPlay})
            this._checkOtherPlayersUno({game, userId})
            this._writeData('data.json', database)

            return this.response().success('Joined Game Successfully')
        } catch (e) {
            return this.response().error(e.message)
        }
    }

    /**
     * @param {Object} request
     * @return {Object}
     */
    _checkSpecialCardPlay = ({game,card, specialCardPlay}) => {
        if ([...card][0]==='s') {
            specialCardPlay.skip = true
        }else if ([...card][0]==='r') {
            specialCardPlay.reverse = true
            game.direction = game.direction === "clockwise" ? "anticlockwise" : "clockwise"
        }else if ([...card][0]==='d') {
            specialCardPlay.double = true
            game.cardsCount = game.cardsCount === 1 ? 2 : game.cardsCount+2
        }else if ([...card][0]==='f') {
            specialCardPlay.power = true
            game.cardsCount = game.cardsCount === 1 ? 4 : game.cardsCount+4
        }else if ([...card][0]==='c') {
            specialCardPlay.power = true
            game.cardsCount = 1
        }
    }

    /**
     * @param {Object}
     * @return {Object}
     */
    _setCardPlay = ({game, userId, card, cardIndex}) => {
        game.players[userId].cards = game.players[userId].cards.filter((element, index) => {
            return index!==cardIndex
        })
        //player position
        let players = Object.keys(game.players)
        let gameEnded = this._checkPlayersPosition({game, players, userId})
        if(gameEnded){
            return true
        }
        game.players[userId].canDraw = true;
        game.lastCards.unshift(card)
        game.restCards.unshift(game.lastCards.pop())

        return false
    }

    /**
     * @param {Object} request
     * @return {Object}
     */
    _checkPlayersPosition = ({game, players, userId}) => {
        if (!game.players[userId].cards.length) {
            let positions = ['1st', '2nd', '3rd', '4th']
            game.result.push(userId)
            game.players[userId].position = positions[game.result.length-1];
            if(players.length-game.result.length<2){
                let lastPlayerId = Object.keys(game.players).filter(playerId => {
                    return !game.result.includes(playerId)
                })[0]
                game.result.push(lastPlayerId)
                game.turn = null
                game.gameEnded = true
                game.players[lastPlayerId].cards = []
                game.players[lastPlayerId].position = positions[game.result.length-1]

                return true
            }
            return false
        }
        return false
    }

    /**
     * @param {Object} request
     * @return {Object}
     */
    _setColor = ({game, color,specialCardPlay}) => {
        if (specialCardPlay.power)
            game.color = color
        else
            game.color = game.lastCards[0][1]
    }

    /**
     * @param {Object} request
     * @return {Object}
     */
    _setGameTurn = ({game, userId, specialCardPlay}) => {
        let players = Object.keys(game.players)
        let playerSerial = Number([...userId].pop())
        if ((specialCardPlay.skip || specialCardPlay.reverse) && (players.length===2 || (players.length>2 && players.length-game.result.length===2))) {
            //same player
        }
        else if (specialCardPlay.skip && players.length>2) {
            let step = 2
            this._gameTurn({game, players,playerSerial, step})
        }
        else {
            let step = 1
            this._gameTurn({game, players,playerSerial, step})
        }
    }

    /**
     * @param {Object} request
     * @return {Object}
     */
    _checkOtherPlayersUno = ({game, userId}) => {
        let players = Object.keys(game.players)
        players.map(playerId => {
            let playerCardCount =  Object.keys(game.players[playerId].cards).length
            let playerUnoCall =  game.players[playerId].uno
            if (playerId!==userId && playerCardCount===1 && !playerUnoCall) {
                let penalty = 2
                for (let i = 0; i < penalty; i++){
                    const cardIndex = randomNumber(0, game.restCards.length - 1)
                    game.players[playerId].cards.push(game.restCards[cardIndex])
                    game.restCards = game.restCards.filter((element, index) => {
                        return index !== cardIndex
                    })
                }
            }
        })
    }


    /**
     * @param {Object} request
     * @return {Object}
     */
    skipPlay = async request => {
        try {
            const gameId = request.body.gameId;
            const userId = request.body.userId;

            let database = this._readData('data.json')
            let game = database.games[gameId]
            let players = Object.keys(game.players)
            if (!game) {
                return this.response().error("Wrong Game Id!")
            }
            if (userId!==game.turn) {
                return this.response().error("Wrong Player!")
            }
            game.players[userId].canDraw = true;

            let step = 1
            let playerSerial = Number([...userId].pop())
            this._gameTurn({game, players,playerSerial, step})

            this._writeData('data.json', database)

            return this.response().success('Joined Game Successfully')
        } catch (e) {
            return this.response().error(e.message)
        }
    }

    _gameTurn({game, players,playerSerial, step}) {
        for (let i=0; i<step; i++) {
            if(game.direction==="clockwise" ) {
                do{
                    game.turn = playerSerial < players.length ? "player" + (playerSerial + 1) : "player1"
                    playerSerial = Number([...game.turn].pop())
                } while (game.players[game.turn].position);
            }
            else if(game.direction==="anticlockwise") {
                do{
                    game.turn = playerSerial > 1 ? "player" + (playerSerial - 1) : players.pop()
                    playerSerial = Number([...game.turn].pop())
                } while (game.players[game.turn].position);
            }
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

            let database = this._readData('data.json')
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
            this._setCardDraw({game, userId})
            this._writeData('data.json', database)

            return this.response().success('Joined Game Successfully')
        } catch (e) {
            return this.response().error(e.message)
        }
    }

    _setCardDraw = ({game, userId}) => {
        for (let i = 0; i < game.cardsCount; i++){
            const cardIndex = randomNumber(0, game.restCards.length - 1)
            game.players[userId].cards.push(game.restCards[cardIndex])
            game.restCards = game.restCards.filter((element, index) => {
                return index !== cardIndex
            })
        }
        game.players[userId].uno = false;
        game.players[userId].canDraw = false;
        if(game.cardsCount>1){
            game.cardsCount = 1
            game.players[userId].canDraw = true;
        }
    }

    /**
     * @param {Object} request
     * @return {Object}
     */
    callUno = async request => {
        try {
            const gameId = request.body.gameId;
            const userId = request.body.userId;

            let database = this._readData('data.json')
            let game = database.games[gameId]
            if (!game) {
                return this.response().error("Wrong Game Id!")
            }

            let player = game.players[userId]
            if (player.cards.length===1)
                player.uno = true
            else
                return this.response().error("Not an uno call moment!")

            this._writeData('data.json', database)

            return this.response().success('Uno Call Successful')
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
            let database = this._readData('data.json')

            let game = database.games[gameId]
            if (!game) {
                return this.response().error("Wrong Game Id")
            }

            let playerCount = Object.keys(game.players).length
            if (game.gameStarted) {
                return this.response().error("Game Already Started")
            }
            else if (playerCount>=MAX_PLAYER_COUNT) {
                return this.response().error("Player Full")
            }
            else {
                let userId = 'player'+(playerCount+1)
                database.games[gameId].players[userId] = {username}

                this._writeData('data.json', database)
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
            let database = this._readData('data.json')
            let gameId = String(Object.keys(database.games).length+111111)
            let userId = "player1"
            database.games[gameId] = {
                gameId,
                players:{
                    player1: {username: request.body.username}
                },
                gameStarted: false
            }
            this._writeData('data.json', database)

            return this.response({username, gameId, userId}).success('Game Created Successfully')
        } catch (e) {
            return this.response().error(e.message)
        }
    }

    _readData = (filename) => {
        let data = fs.readFileSync(path.join(__dirname, filename), err => {
            if (err) throw err
        })
        return JSON.parse(data)
    }

    _writeData = (filename, database) => {
        database = JSON.stringify(database)
        fs.writeFileSync(path.join(__dirname, filename), database, 'utf8', err => {
            if (err) throw err
        })
    }
}

module.exports = GameService