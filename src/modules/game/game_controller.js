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
}

module.exports = new GameController()