module.exports = server => {
    const io = require('socket.io')(server, {
        cors: {
            origin: "*"
        }
    })

    io.on("connection", socket => {
        console.log(socket.id)

        socket.on('message', message => {
            io.emit('message', message)
        })

        socket.on('player-joining', payload => {
            io.emit('player-joining', payload)
        })
        socket.on('start-game', payload => {
            io.emit('start-game', payload)
        })
        socket.on('card-played', payload => {
            io.emit('card-played', payload)
        })
        socket.on('card-drawn', payload => {
            io.emit('card-drawn', payload)
        })

        socket.on('disconnect', () => {
           console.log('disconnected')
        })
    })

}