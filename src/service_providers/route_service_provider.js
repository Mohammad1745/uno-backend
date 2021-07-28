const cookieParser = require('cookie-parser')

module.exports = (app, express) => {
    //parse form data
    app.use(express.urlencoded({extended: true}))
    //parse json data
    app.use(express.json())
    //parse cookies from the HTTP Request
    app.use(cookieParser());

    //api routes
    // app.use('/api/admin', require('../../routes/api/admin'))
    app.use('/api/user/chat', require('../modules/chat/api'))
    app.use('/api/user/profile', require('../modules/profile/api'))
    app.use('/api/user/dashboard', require('../modules/dashboard/api'))
    app.use('/api/auth', require('../modules/authentication/api'))
    // app.use('/api', require('../modules/authentication/api'))
}