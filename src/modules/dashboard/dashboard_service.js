const ResponseService = require('../../base/response_service')

class DashboardService extends ResponseService {

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
    dashboard = async request => {
            try {
                const user = request.user
                return this.response({user}).success('User Logged In Successfully')
            } catch (e) {
                return this.response().error(e.message)
            }
        }
}

module.exports = DashboardService