document.addEventListener("DOMContentLoaded", () => {
    helper.checkAlert()
    handleSignupForm()
})

function handleSignupForm() {
    let registerSubmitButton = document.querySelector('#register_form_submit_btn')
    registerSubmitButton.addEventListener('click', () => {
        let firstName = document.querySelector("#first_name_input").value
        let lastName = document.querySelector("#last_name_input").value
        let phoneCode = document.querySelector("#phone_code_input").value
        let phone = document.querySelector("#phone_input").value
        let email = document.querySelector("#email_input").value
        let password = document.querySelector("#password_input").value
        let confirmPassword = document.querySelector("#confirm_password_input").value
        let validated = validateForm({ firstName, lastName, phoneCode, phone, email, password, confirmPassword})
        if (validated) submitSignupForm({ firstName, lastName, phoneCode, phone, email, password, confirmPassword})
    })
}

function validateForm ({ firstName, lastName, phoneCode, phone, email, password, confirmPassword}) {
    let validated = true
    if (!firstName) {
        validated = false
        document.getElementById('first_name_error_message').innerHTML = "First Name Empty"
    }
    if (!lastName) {
        validated = false
        document.getElementById('last_name_error_message').innerHTML = "Last Name Empty"
    }
    if (!phoneCode) {
        validated = false
        document.getElementById('phone_code_error_message').innerHTML = "Phone Code Empty"
    }
    if (!phone) {
        validated = false
        document.getElementById('phone_error_message').innerHTML = "Phone Empty"
    }
    if (!email) {
        validated = false
        document.getElementById('email_error_message').innerHTML = "Email Empty"
    }
    if (!password) {
        validated = false
        document.getElementById('password_error_message').innerHTML = "Password Empty"
    }
    if (!confirmPassword) {
        validated = false
        document.getElementById('confirm_password_error_message').innerHTML = "Confirm Password Empty"
    }
    return validated
}


function submitSignupForm ({ firstName, lastName, phoneCode, phone, email, password, confirmPassword}) {
    $.ajax({
        url: helper.DOMAIN+"/api/auth/register",
        method: "POST",
        data: { firstName, lastName, phoneCode, phone, email, password, confirmPassword},
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
    localStorage.setItem('success', response.message)

    window.location.replace("./phone_verification.html")
}

function handleRequestError(response) {
    if (typeof response.message === "string") helper.alertMessage(response.message, "error")
    else
        Object.keys(response.message).map(key => {
        if (key === "firstName") document.getElementById('first_name_error_message').innerHTML = response.message[key].msg
        else if (key === "lastName") document.getElementById('last_name_error_message').innerHTML = response.message[key].msg
        else if (key === "phoneCode") document.getElementById('phone_code_error_message').innerHTML = response.message[key].msg
        else if (key === "phone") document.getElementById('phone_error_message').innerHTML = response.message[key].msg
        else if (key === "email") document.getElementById('email_error_message').innerHTML = response.message[key].msg
        else if (key === "password") document.getElementById('password_error_message').innerHTML = response.message[key].msg
        else if (key === "confirmPassword") document.getElementById('confirm_password_error_message').innerHTML = response.message[key].msg
    })
}