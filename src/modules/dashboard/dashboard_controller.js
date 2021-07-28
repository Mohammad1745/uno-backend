const DashboardService = require('./dashboard_service')

class DashboardController {
    /**
     * DashboardController constructor
     * */
    constructor() {
        this.service = new DashboardService()
    }

    /**
     * @param {Object} request
     * @param {Object} response
     * @return {JSON}
     */
    dashboard = async (request, response) => {
        return response.json(await this.service.dashboard(request))
    }
}

module.exports = new DashboardController()