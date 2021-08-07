module.exports = server => {
    const io = require('socket.io')(server, {
        cors: {
            origin: "*"
        }
    })

    io.on("connection", socket => {
        console.log(socket.id)

        socket.on('chat-updated', payload => {
            io.emit('chat-updated', payload)
        })

        socket.on('player-joining', payload => {
            io.emit('player-joining', payload)
        })
        socket.on('start-game', payload => {
            io.emit('start-game', payload)
        })
        socket.on('game-updated', payload => {
            io.emit('game-updated', payload)
        })
        socket.on('player-quiting', payload => {
            io.emit('player-quiting', payload)
        })

        socket.on('disconnect', () => {
           console.log('disconnected')
        })
    })

}