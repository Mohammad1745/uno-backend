const Request = require('../../../base/request')

class LoginRequest extends Request{
    constructor() {
        super({
            email: 'required|string',
            password: 'required|string'
        })
    }
}

module.exports = new LoginRequest()