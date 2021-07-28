const express = require('express')
const route = express.Router()
const {user}  = require('./middlewares/user')
const {authApi}  = require('./middlewares/api_authentication')
const {verified} = require('./middlewares/phone_verification')
const dashboardController = require('./dashboard_controller')

//middleware
route.use(authApi, user, verified)

//dashboard
route.get('/', dashboardController.dashboard)

module.exports = route