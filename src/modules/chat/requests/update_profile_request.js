const Request = require('../../../base/request')

class UpdateProfileRequest extends Request{
    constructor() {
        super({
            firstName: 'required|string',
            lastName: 'required|string'
            // email: 'required|email|unique:user',
            // phoneCode: 'required|string|regex:/^[+]{1}[0-9]{3}$/',
            // phone: 'required|string|unique:user|regex:/^(1){1}[1-9]{1}[0-9]{8}$/'
        })
    }
}

module.exports = new UpdateProfileRequest()