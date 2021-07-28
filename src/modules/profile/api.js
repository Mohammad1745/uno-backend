const express = require('express')
const route = express.Router()
const {user}  = require('./middlewares/user')
const {authApi}  = require('./middlewares/api_authentication')
const {verified} = require('./middlewares/phone_verification')
const profileController = require('./profile_controller')
const updateProfileRequest = require('./requests/update_profile_request')

//middleware
route.use(authApi, user, verified)

//profile
route.get('/', profileController.profile)
route.post('/update-info', ...updateProfileRequest.validate, profileController.updateInfo)
route.post('/upload-image', profileController.uploadImage)

module.exports = route