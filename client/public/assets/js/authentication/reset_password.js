document.addEventListener("DOMContentLoaded", () => {
    helper.checkAlert()
    handleVerificationForm()
})

function handleVerificationForm() {
    let sendCodeFormSubmitButton = document.querySelector('#send_code_form_submit_btn')
    sendCodeFormSubmitButton.addEventListener('click', () => {
        let phoneCode = document.querySelector("#phone_code_input").value
        let phone = document.querySelector("#phone_input").value
        let validated = validateForm({ phoneCode, phone})
        if (validated) submitLoginForm({ phoneCode, phone})
    })
}

function validateForm ({ phoneCode, phone}) {
    let validated = true
    if (!phoneCode) {
        validated = false
        document.getElementById('phone_code_error_message').innerHTML = "Phone Code Empty"
    }
    if (!phone) {
        validated = false
        document.getElementById('phone_error_message').innerHTML = "Phone Empty"
    }
    return validated
}

function submitLoginForm ({ phoneCode, phone}) {
    $.ajax({
        url: helper.DOMAIN+"/api/auth/reset-password",
        method: "POST",
        data: { phoneCode, phone},
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

    window.location.replace('./reset_password_code.html')
}

function handleRequestError(response) {
    if (typeof response.message === "string") {
        helper.alertMessage(response.message, "error")
    }
    else {
        Object.keys(response.message).map(key => {
            if (key === "phoneCode") document.getElementById('phone_code_error_message').innerHTML = response.message[key].msg
            else if (key === "phone") document.getElementById('phone_error_message').innerHTML = response.message[key].msg
        })
    }
}