function chat() {
    let gameId = localStorage.getItem('gameId')
    let userId = localStorage.getItem('userId')
    loadChatContainer({gameId, userId})
    handleSocketChatEvents({gameId, userId})
}

function handleSocketChatEvents({gameId, userId}) {
    socket.on('chat-updated', async payload => {
        if(gameId && payload.gameId === gameId) {
            await helper.sleep(1000)
            updateChatContainer({userId, payload})
        }
    })
}

function loadChatContainer({gameId, userId}) {
    let chatPopup = `
        <div class="chat-container" id="chat_container">
            <div class="chat-header">
                Game Chat: ${gameId} 
                <span class="float-right open-chat cursor-pointer" id="open_chat_btn" data-state="open">
                    <i class="fas fa-caret-square-up"></i>
                </span>
            </div>
            <div class="chat-body" id="chat_body">
                <ul class="chat-details" id="chat_details"></ul>
                <div class="chat-input form-group" id="chat_input">
                    <input type="text" class="message-input" id="message_input">
                    <button type="button" id="send_message_btn" class="btn btn-primary send-message-btn"><i class="fas fa-paper-plane"></i></button>
                </div>
            </div>
        </div>`
    document.body.insertAdjacentHTML('beforeend', chatPopup)
    handleOpenChatButton()
    handleSendMessageButton(userId)
}

//Sending Message
function handleOpenChatButton() {
    let chatBody = document.getElementById('chat_body')
    let chatDetails = document.getElementById('chat_details')
    let openChatButton = document.getElementById('open_chat_btn')
    openChatButton.addEventListener("click", () => {
        let state = openChatButton.getAttribute('data-state')
        if (state==="open"){
            openChatButton.setAttribute('data-state', "close")
            chatDetails.style.display = "none"
            chatBody.style.display = "none"
        }else {
            openChatButton.setAttribute('data-state', "open")
            chatDetails.style.display = "block"
            chatBody.style.display = "block"
        }
    })
}

//Sending Message
function handleSendMessageButton(userId) {
    let sendMessageButton = document.getElementById('send_message_btn')
    sendMessageButton.addEventListener("click", () => {
        let message = document.getElementById('message_input').value
        if (message) sendMessage({userId, message})
    })
}

function sendMessage({userId, message}) {
    let messageInput = document.getElementById('message_input')
    messageInput.value = ''
    let time = helper.getTime(new Date())
    socket.emit("chat-updated", { userId, content: message, time })
}

function updateChatContainer({userId, payload}) {
    if (payload.userId===userId)
        appendOutgoingMessage(payload)
    else
        appendIncomingMessage(payload)
}

function appendIncomingMessage(message) {
    let time = message.time.length === 5 ? helper.toAmPm(message.time) : message.time
    document.querySelector('#chat_details').insertAdjacentHTML('beforeend', `
        <li class="incoming-message-list" id="s${++x}">
            <div class="p-2 incoming-message-content">
                <span>${message.userId}</span> ${message.content}<span style="font-size: 9px;"> -${time}</span>
            </div>
        </li>
    `)
    document.querySelector('#chat_details').querySelector("#s" + x).scrollIntoView({ behavior: 'smooth' })
}

function appendOutgoingMessage(message) {
    let time = message.time.length === 5 ? helper.toAmPm(message.time) : message.time
    document.querySelector('#chat_details').insertAdjacentHTML('beforeend', `
        <li class="outgoing-message-list" id="s${++x}">
            <div class="p-2 ml-auto outgoing-message-content">
                <span style="font-size: 9px;">${time} -</span> ${message.content}
            </div class="p-2" >
        </li>
    `)
    document.querySelector('#chat_details').querySelector("#s" + x).scrollIntoView({ behavior: 'smooth' })
}