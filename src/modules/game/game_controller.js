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
        return response.json(await this.service.joinGame(request))
    }

    /**
     * @param {Object} request
     * @param {Object} response
     * @return {JSON}
     */
    create = async (request, response) => {
        return response.json(await this.service.createGame(request))
    }
}

module.exports = new GameController()