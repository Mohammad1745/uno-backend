let x = 1
function chat() {
    let gameId = localStorage.getItem('gameId')
    let userId = localStorage.getItem('userId')
    loadChatContainer({gameId, userId})
    handleSocketChatEvents({gameId, userId})
}

function handleSocketChatEvents({gameId, userId}) {
    socket.on('chat-updated', async payload => {
        if(gameId && payload.gameId === gameId) {
            await helper.sleep(100)
            updateChatStorage({userId, payload})
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
                    <i class="fas fa-caret-square-down"></i>
                </span>
            </div>
            <div class="chat-body" id="chat_body">
                <ul class="chat-details ml-0" id="chat_details"></ul>
            </div>
            <div class="chat-footer" id="chat_footer">
                <div class="chat-input form-group" id="chat_input">
                    <input type="text" class="message-input" id="message_input">
                    <button type="button" id="send_message_btn" class="btn btn-primary send-message-btn"><i class="fas fa-paper-plane"></i></button>
                </div>
            </div>
        </div>`
    document.body.insertAdjacentHTML('beforeend', chatPopup)
    let chat = JSON.parse(localStorage.getItem('chat'))
    if (chat)
        chat.map(payload =>updateChatContainer({userId, payload}))
    else
        localStorage.setItem('chat', JSON.stringify([]))
    handleOpenChatButton()
    handleSendMessageButton({gameId, userId})
}

//Sending Message
function handleOpenChatButton() {
    let chatFooter = document.getElementById('chat_footer')
    let chatDetails = document.getElementById('chat_details')
    let openChatButton = document.getElementById('open_chat_btn')
    openChatButton.addEventListener("click", () => {
        let state = openChatButton.getAttribute('data-state')
        if (state==="open"){
            openChatButton.innerHTML = `<i class="fas fa-caret-square-up"></i>`
            openChatButton.setAttribute('data-state', "close")
            chatDetails.style.height = "10vh"
            chatFooter.style.display = "none"
        }else {
            openChatButton.innerHTML = `<i class="fas fa-caret-square-down"></i>`
            openChatButton.setAttribute('data-state', "open")
            chatDetails.style.height = "50vh"
            chatFooter.style.display = "block"
        }
    })
}

//Sending Message
function handleSendMessageButton({gameId, userId}) {
    let messageInput = document.getElementById('message_input')
    let sendMessageButton = document.getElementById('send_message_btn')
    messageInput.addEventListener("keypress", event => {
        if (event.keyCode===13){
            sendMessage ({gameId, userId})
        }
    })
    sendMessageButton.addEventListener("click", () => {
        sendMessage ({gameId, userId})
    })
}
function sendMessage({gameId, userId}) {
    let username = localStorage.getItem('username')
    let message = document.getElementById('message_input').value
    if (message) {
        let time = helper.getTime(new Date())
        document.getElementById('message_input').value = ''
        socket.emit("chat-updated", { gameId, userId, username,content: message, time })
    }
}

function updateChatStorage({userId, payload}) {
    let chat = JSON.parse(localStorage.getItem('chat'))
    chat.push(payload)
    localStorage.setItem('chat', JSON.stringify(chat))
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
                <span class="sender-name">${message.username}</span> : ${message.content}<span style="font-size: 9px;"> -${time}</span>
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