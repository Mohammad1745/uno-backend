const ChatService = require('./chat_service')

class ChatController {
    /**
     * ChatController constructor
     * */
    constructor() {
        this.service = new ChatService()
    }

    /**
     * @param {Object} request
     * @param {Object} response
     * @return {JSON}
     */
    chatList = async (request, response) => {
        return response.json(await this.service.chatList(request))
    }

    /**
     * @param {Object} request
     * @param {Object} response
     * @return {JSON}
     */
    chatDetails = async (request, response) => {
        return response.json(await this.service.chatDetails(request))
    }

    /**
     * @param {Object} request
     * @param {Object} response
     * @return {JSON}
     */
    sendMessage = async (request, response) => {
        return response.json(await this.service.sendMessage(request))
    }
}

module.exports = new ChatController()