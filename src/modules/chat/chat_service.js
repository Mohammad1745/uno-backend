const ResponseService = require('../../base/response_service')
const {Op} = require('sequelize')
const {User, Chat} = require('../../models')
const {USER_ROLE} = require('../../helper/core_constants')

class ChatService extends ResponseService {

    /**
     * UserService constructor.
     */
    constructor() {
        super()
    }

    /**
     * @param {Object} request
     * @return {Object}
     */
    chatList = async request => {
        try {
            let users = await User.findAll({
                where: {id: {[Op.ne]: request.user.id}, role: USER_ROLE},
                attributes: ["id", "firstName", "lastName", "image"]
            })
            let chatList = []
            let keys = Object.keys(users)
            for(let key of keys) {
                let lastChatAsSender = await Chat.findOne({where: {senderId: request.user.id, receiverId: users[key].id}, order: [['createdAt', 'DESC']]})
                let lastChatAsReceiver = await Chat.findOne({where: {senderId: users[key].id, receiverId: request.user.id}, order: [['createdAt', 'DESC']]})
                let lastChat = {}
                if (lastChatAsSender&&lastChatAsReceiver) {
                    lastChat = lastChatAsSender.createdAt > lastChatAsReceiver.createdAt ? lastChatAsSender : lastChatAsReceiver
                }
                else if (lastChatAsSender) lastChat = lastChatAsSender
                else if (lastChatAsReceiver) lastChat = lastChatAsReceiver

                let createdDate = new Date(lastChat.createdAt)
                createdDate =  createdDate.getFullYear() + '-' +(createdDate.getMonth()+1) + '-' + createdDate.getDate()
                let date = new Date()
                date =  date.getFullYear() + '-' +(date.getMonth()+1) + '-' + date.getDate()
                if (createdDate<date) lastChat.dataValues.time = createdDate
                else lastChat.dataValues.time = String(lastChat.createdAt).substr(16, 5)

                chatList.push({
                    userId: users[key].id,
                    firstName: users[key].firstName,
                    lastName: users[key].lastName,
                    image: users[key].image,
                    chat: lastChat
                })
            }

            return this.response(chatList).success()
        } catch (e) {
            return this.response().error(e.message)
        }
    }

    /**
     * @param {Object} request
     * @return {Object}
     */
    chatDetails = async request => {
        try {
            let messages = await Chat.findAll({
                where: {
                    [Op.or]: [
                        {senderId: request.user.id, receiverId: request.query.userId},
                        {senderId: request.query.userId, receiverId: request.user.id}
                    ]
                },
                order: [['createdAt', 'DESC']]
            })
            messages.map(message => {
                let createdDate = new Date(message.createdAt)
                createdDate =  createdDate.getFullYear() + '-' +(createdDate.getMonth()+1) + '-' + createdDate.getDate()
                let date = new Date()
                date =  date.getFullYear() + '-' +(date.getMonth()+1) + '-' + date.getDate()

                if (createdDate<date) message.dataValues.time = createdDate
                else message.dataValues.time = String(message.createdAt).substr(16, 5)
                return message
            })
            return this.response(messages.reverse()).success()
        } catch (e) {
            return this.response().error(e.message)
        }
    }

    /**
     * @param {Object} request
     * @return {Object}
     */
    sendMessage = async request => {
        try {
            const senderId = request.user.id
            const data = request.body
            await Chat.create(this._chatDataFormatter(data, senderId))
            return this.response().success()
        } catch (e) {
            return this.response().error(e.message)
        }
    }

    _chatDataFormatter = (data, senderId) => {
        return data ?
            {
                senderId: senderId,
                receiverId: data.userId,
                content: data.message
            }
            : {}
    }
}

module.exports = ChatService