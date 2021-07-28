document.addEventListener("DOMContentLoaded", () => {
    helper.checkAlert()
    handleLoginForm()
})

function handleLoginForm() {
    let loginSubmitButton = document.querySelector('#login_form_submit_btn')
    loginSubmitButton.addEventListener('click', () => {
        let email = document.querySelector("#email_input").value
        let password = document.querySelector("#password_input").value
        let validated = validateForm({email, password})
        if (validated) submitLoginForm({email, password})
    })
}

function validateForm ({ email, password}) {
    let validated = true
    if (!email) {
        validated = false
        document.getElementById('email_error_message').innerHTML = "Email Empty"
    }
    if (!password) {
        validated = false
        document.getElementById('password_error_message').innerHTML = "Password Empty"
    }
    return validated
}

function submitLoginForm ({email, password}) {
    $.ajax({
        url: helper.DOMAIN+"/api/auth/login",
        method: "POST",
        data: {
            email, password
        },
    }).done(response => {
        response.success ?
            handleRequestSuccess(response)
            : handleRequestError(response)
    }).fail(err => {
        console.log(err)
    })
}

function handleRequestSuccess (response) {
    localStorage.setItem('tokenType', response.data.authorization.tokenType)
    localStorage.setItem('token', response.data.authorization.token)

    if (response.data.isPhoneVerified) {
        localStorage.setItem('success', response.message)
        window.location.replace("../user/dashboard.html")
    }
    else {
        localStorage.setItem('success', 'Account not verified.')
        window.location.replace("./phone_verification.html")
    }
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
            if (key === "email") document.getElementById('email_error_message').innerHTML = response.message[key].msg
            else if (key === "password") document.getElementById('password_error_message').innerHTML = response.message[key].msg
        })
    }
}