const GameService = require('./game_service')

class GameController {
    /**
     * GameController constructor
     * */
    constructor() {
        this.service = new GameService()
    }

    /**
     * @param {Object} request
     * @param {Object} response
     * @return {JSON}
     */
    join = async (request, response) => {
        return response.json(await this.service.join(request))
    }

    /**
     * @param {Object} request
     * @param {Object} response
     * @return {JSON}
     */
    create = async (request, response) => {
        return response.json(await this.service.create(request))
    }

    /**
     * @param {Object} request
     * @param {Object} response
     * @return {JSON}
     */
    playerList = async (request, response) => {
        return response.json(await this.service.playerList(request))
    }

    /**
     * @param {Object} request
     * @param {Object} response
     * @return {JSON}
     */
    startGame = async (request, response) => {
        return response.json(await this.service.startGame(request))
    }

    /**
     * @param {Object} request
     * @param {Object} response
     * @return {JSON}
     */
    game = async (request, response) => {
        return response.json(await this.service.game(request))
    }

    /**
     * @param {Object} request
     * @param {Object} response
     * @return {JSON}
     */
    playCard = async (request, response) => {
        return response.json(await this.service.playCard(request))
    }

    /**
     * @param {Object} request
     * @param {Object} response
     * @return {JSON}
     */
    skipPlay = async (request, response) => {
        return response.json(await this.service.skipPlay(request))
    }

    /**
     * @param {Object} request
     * @param {Object} response
     * @return {JSON}
     */
    drawCard = async (request, response) => {
        return response.json(await this.service.drawCard(request))
    }

    /**
     * @param {Object} request
     * @param {Object} response
     * @return {JSON}
     */
    callUno = async (request, response) => {
        return response.json(await this.service.callUno(request))
    }
}

module.exports = new GameController()