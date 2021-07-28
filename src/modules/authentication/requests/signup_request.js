const Request = require('../../../base/request')
const {ADMIN_ROLE, USER_ROLE} = require('../../../helper/core_constants')

class SignupRequest extends Request{
    constructor() {
        super({
            firstName: 'required|string',
            lastName: 'required|string',
            email: 'required|email|unique:user',
            phoneCode: 'required|string|regex:/^[+]{1}[0-9]{3}$/',
            phone: 'required|string|unique:user|regex:/^(1){1}[1-9]{1}[0-9]{8}$/',
            // role: 'required|in:'+[ADMIN_ROLE,USER_ROLE].join(','),
            password: 'required|string|min:8',
            confirmPassword: 'required|same:password',
            // arr: 'required|array',
        })
    }
}

module.exports = new SignupRequest()