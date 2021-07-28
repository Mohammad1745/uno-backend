const ProfileService = require('./profile_service')

class ProfileController {
    /**
     * ProfileController constructor
     * */
    constructor() {
        this.service = new ProfileService()
    }

    /**
     * @param {Object} request
     * @param {Object} response
     * @return {JSON}
     */
    profile = async (request, response) => {
        return response.json(await this.service.profile(request))
    }

    /**
     * @param {Object} request
     * @param {Object} response
     * @return {JSON}
     */
    updateInfo = async (request, response) => {
        return response.json(await this.service.updateInfo(request))
    }

    /**
     * @param {Object} request
     * @param {Object} response
     * @return {JSON}
     */
    uploadImage = async (request, response) => {
        return response.json(await this.service.uploadImage(request, response))
    }
}

module.exports = new ProfileController()