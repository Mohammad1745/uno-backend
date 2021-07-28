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

        socket.on('disconnect', () => {
           console.log('disconnected')
        })
    })

}