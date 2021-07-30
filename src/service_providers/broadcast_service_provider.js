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

        socket.on('disconnect', () => {
           console.log('disconnected')
        })
    })

}