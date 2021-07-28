const express = require('express')
const route = express.Router()

const loginRequest = require('./requests/login_request')
const signupRequest = require('./requests/signup_request')
const phoneVerificationRequest = require('./requests/phone_verification_request')
const passwordResetRequest = require('./requests/reset_password_request')
const passwordResetCodeRequest = require('./requests/reset_password_code_request')
const authController = require('./auth_controller')
const {authApi}  = require('./middlewares/api_authentication')

route.post('/login', ...loginRequest.validate, authController.login)
route.post('/register', ...signupRequest.validate, authController.signup)
route.post('/reset-password', ...passwordResetRequest.validate, authController.resetPasswordProcess)
route.put('/reset-password-code', ...passwordResetCodeRequest.validate, authController.resetPasswordCodeProcess)
//middleware
route.use(authApi)
route.get('/resend-phone-verification-code', authController.resendPhoneVerificationCode)
route.put('/phone-verification', ...phoneVerificationRequest.validate, authController.phoneVerificationProcess)
route.get('/logout', authController.logout)

module.exports = route