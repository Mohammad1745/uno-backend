document.addEventListener("DOMContentLoaded", () => {
    helper.checkAlert()
    handleVerificationForm()
    countdown()
})

function handleVerificationForm() {
    let phoneVerificationSubmitButton = document.querySelector('#verification_form_submit_btn')
    phoneVerificationSubmitButton.addEventListener('click', () => {
        let phoneCode = document.querySelector("#phone_code_input").value
        let phone = document.querySelector("#phone_input").value
        let code = document.querySelector("#verification_code_input").value
        let validated = validateForm({ phoneCode, phone, code})
        if (validated) submitLoginForm({ phoneCode, phone, code})
    })
}

function validateForm ({ phoneCode, phone, code}) {
    let validated = true
    if (!phoneCode) {
        validated = false
        document.getElementById('phone_code_error_message').innerHTML = "Phone Code Empty"
    }
    if (!phone) {
        validated = false
        document.getElementById('phone_error_message').innerHTML = "Phone Empty"
    }
    if (!code) {
        validated = false
        document.getElementById('phone_code_error_message').innerHTML = "Code Empty"
    }
    return validated
}

function submitLoginForm ({ phoneCode, phone, code}) {
    $.ajax({
        url: helper.DOMAIN+"/api/auth/phone-verification",
        method: "PUT",
        headers: { authorization: localStorage.getItem("tokenType") + " " + localStorage.getItem("token")},
        data: { phoneCode, phone, code},
    }).done(response => {
        response.success ?
            handleRequestSuccess(response)
            : handleRequestError(response)
    }).fail(err => {
        console.log(err)
    })
}

function handleRequestSuccess (response) {
    localStorage.setItem('success', response.message)

    window.location.replace('./login.html')
}

function handleRequestError(response) {
    if (response.message === "Unauthenticated") {
        window.location.replace('../authentication/login.html')
    }
    else if (typeof response.message === "string") {
        helper.alertMessage(response.message, "error")
    }
    else {
        Object.keys(response.message).map(key => {
            if (key === "phoneCode") document.getElementById('phone_code_error_message').innerHTML = response.message[key].msg
            else if (key === "phone") document.getElementById('phone_error_message').innerHTML = response.message[key].msg
            else if (key === "code") document.getElementById('phone_code_error_message').innerHTML = response.message[key].msg
        })
    }
}

function countdown() {
    let form = '<a class="btn p-0 fw-bold text-secondary cursor-pointer" id="resend_phone_verification_code_btn">Resend Verification Code</a>\n' +
        '       <span>, if you haven\'t got yet.</span>'
    let sec=20
    setTimeout(count, 1000)
    function count(){
        sec--
        if(sec>0){
            document.querySelector('#resend-code-content').innerHTML = `You should get code within ${sec}s`
            setTimeout(count, 1000);
        }else{
            document.querySelector('#resend-code-content').innerHTML = form
            handleResendCodeButton()
        }
    }
}

function handleResendCodeButton() {
    let resendCodeButton = document.querySelector('#resend_phone_verification_code_btn')
    resendCodeButton.addEventListener('click', () => {
        $.ajax({
            url: helper.DOMAIN+"/api/auth/resend-phone-verification-code",
            method: "GET",
            headers: { authorization: localStorage.getItem("tokenType") + " " + localStorage.getItem("token")},
        }).done(response => {
            if (response.success) {
                helper.alertMessage(response.message, "success")
            } else {
                helper.alertMessage(response.message, "error")
            }
        }).fail(err => {
            console.log(err)
        })
    })
}