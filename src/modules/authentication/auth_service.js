const ResponseService = require('../../base/response_service')
const {User, PasswordReset} = require('../../models')
const jwt = require('jsonwebtoken')
const {makeHash, randomNumber, sendMessage} = require('../../helper/helper')
const {USER_ROLE, SESSION_TIMEOUT} = require('../../helper/core_constants')

class AuthService extends ResponseService {

    /**
     * UserService constructor.
     */
    constructor() {
        super()
    }

    /**
     * @param {Object} request
     * @param response
     * @return {Object}
     */
    login = async (request, response) => {
        try {
            const { email, password } = request.body
            const user = await User.findOne({where: {email: email}})
            if (!user){
                return this.response().error('Email User Doesn\'t Exists. Please Register An Account.')
            }
            if (user.password !== makeHash(email,password)){
                return this.response().error('Wrong email or password.')
            }
            const data = this._authorizeUser(user, request, response)
            return this.response(data).success('User Logged In Successfully')
        } catch (e) {
            return this.response().error(e.message)
        }
    }

    /**
     * @param {Object} request
     * @param response
     * @return {Object}
     */
    signUp = async (request, response) => {
        try {
            let user = await User.findOne({where:{email: request.body.email}})
            if (user) {
                return this.response().error('User Already Exists')
            }
            const code = randomNumber(6)
            user = await User.create( this._userDataFormatter( request.body, code))
            // sendMessage(user.phoneCode+user.phone, `\nYour account verification code is ${code}`, () => {}, err => {})//TODO: uncomment to get verification sms

            const data = this._authorizeUser(user, request, response)
            return this.response(data).success(`User Signed Up Successfully. Verification code has been send to ${user.phoneCode}${user.phone}.`)
        } catch (e) {
            return this.response().error(e.message)
        }
    }

    /**
     * @param {Object} request
     * @return {Object}
     */
    resendPhoneVerificationCode = async request => {
        try {
            let user = await User.findOne({where: {phoneCode: request.user.phoneCode, phone: request.user.phone}})
            if (!user) {
                return this.response().error('Invalid User')
            }
            const code = randomNumber(6)
            await User.update({phoneVerificationCode:code, isPhoneVerified:false}, {where:{id:user.id}})
            // sendMessage(user.phoneCode+user.phone, `\nYour account verification code is ${code}`, () => {}, err => {})//TODO: uncomment to get verification sms
            const {firstName, lastName, email, phoneCode, phone} = user
            return this.response({firstName, lastName, email, phoneCode, phone}).success(`Verification code has been send to ${user.phoneCode}${user.phone}.`)
        } catch (e) {
            return this.response().error(e.message)
        }
    }

    /**
     * @param {Object} request
     * @return {Object}
     */
    phoneVerification = async request => {
        try {
            let user = await User.findOne({where:{phoneCode: request.body.phoneCode, phone: request.body.phone}})
            if (!user) {
                return this.response().error('Invalid User')
            }
            if (user.phoneVerificationCode !== request.body.code) {
                return this.response().error('Invalid Code')
            }
            await User.update({phoneVerificationCode:null, isPhoneVerified: true}, {where:{id: user.id}})
            return this.response().success(`Verification successful`)
        } catch (e) {
            return this.response().error(e.message)
        }
    }

    /**
     * @param {Object} request
     * @return {Object}
     */
    resetPassword = async request => {
        try {
            let user = await User.findOne({where: {phoneCode: request.body.phoneCode, phone: request.body.phone}})
            if (!user) {
                return this.response().error('Invalid User')
            }
            const code = randomNumber(6)
            const {id, phoneCode, phone} = user
            await PasswordReset.create( this._passwordResetDataFormatter( id, code))
            // sendMessage(user.phoneCode+user.phone, `\n Your reset password code is ${code}`, () => {}, err => {})//TODO: uncomment to get verification sms
            return this.response({phoneCode, phone}).success(`Reset password code has been send to ${phoneCode}${phone}.`)
        } catch (e) {
            return this.response().error(e.message)
        }
    }

    /**
     * @param {Object} request
     * @return {Object}
     */
    resetPasswordCode = async request => {
        try {
            try {
                const user = await User.findOne({where: {phoneCode: request.body.phoneCode, phone: request.body.phone}})
                if (!user) {
                    return this.response().error('Invalid User')
                }
                const passwordReset = await PasswordReset.findOne({where: {userId:user.id, code:request.body.code}})
                if (!passwordReset) {
                    return this.response().error('Invalid Code')
                }
                await User.update({password:makeHash(user.email, request.body.password)}, {where: {id: user.id}})
                await PasswordReset.destroy({where: {userId:user.id}})
                return this.response().success(`Password Reset Successful.`)
            } catch (e) {
                return this.response().error(e.message)
            }
        } catch (e) {
            return this.response().error(e.message)
        }
    }

    /**
     * @param {Object} request
     * @return {Object}
     */
    logout = request => {
        try {
            return this.response().success('User Logged Out Successfully')
        } catch (e) {
            return this.response().error(e.message)
        }
    }

    _userDataFormatter = (data, verificationCode) => {
        return data ?
            {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phoneCode: data.phoneCode,
                phone: data.phone,
                phoneVerificationCode: verificationCode,
                password: makeHash(data.email,data.password),
                role: data.role ? data.role : USER_ROLE
            }
            : {}
    }

    _passwordResetDataFormatter = (userId, code) => {
        return userId && code ? {userId, code} : {}
    }

    _authorizeUser = user => {
        const {id, firstName, lastName, role, email, phoneCode, phone, isPhoneVerified} = user
        const data = {id, firstName, lastName, email, role, phoneCode, phone, isPhoneVerified}
        const authToken = jwt.sign(data, process.env.AUTH_SECRET, {expiresIn: SESSION_TIMEOUT+'s'})
        data.authorization = {
            tokenType: 'Bearer',
            token: authToken
        }
        return data
    }
}

module.exports = AuthService