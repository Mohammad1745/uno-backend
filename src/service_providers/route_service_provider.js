const cookieParser = require('cookie-parser')

module.exports = (app, express) => {
    //parse form data
    app.use(express.urlencoded({extended: true}))
    //parse json data
    app.use(express.json())
    //parse cookies from the HTTP Request
    app.use(cookieParser());

    //api routes
    app.use('/api/game', require('../modules/game/api'))
}