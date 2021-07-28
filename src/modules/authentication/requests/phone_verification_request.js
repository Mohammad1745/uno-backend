const Request = require('../../../base/request')

class PhoneVerificationRequest extends Request{
    constructor() {
        super({
            phoneCode: 'required|string|regex:/^[+]{1}[0-9]{3}$/',
            phone: 'required|string|regex:/^(1){1}[1-9]{1}[0-9]{8}$/',
            code: 'required|string'
        })
    }
}

module.exports = new PhoneVerificationRequest()