const express = require('express')
const route = express.Router()
const {user}  = require('./middlewares/user')
const {authApi}  = require('./middlewares/api_authentication')
const {verified} = require('./middlewares/phone_verification')
const chatController = require('./chat_controller')
const updateProfileRequest = require('./requests/update_profile_request')

//middleware
route.use(authApi, user, verified)

//profile
route.get('/', chatController.chatList)
route.get('/details', chatController.chatDetails)
route.post('/send-message', chatController.sendMessage)

module.exports = route