document.addEventListener("DOMContentLoaded", () => {
    helper.checkAlert()
    handleResetPasswordForm()
    countdown()
})

function handleResetPasswordForm() {
    let resetPasswordFormSubmitButton = document.querySelector('#reset_password_form_submit_btn')
    resetPasswordFormSubmitButton.addEventListener('click', () => {
        let phoneCode = document.querySelector("#phone_code_input").value
        let phone = document.querySelector("#phone_input").value
        let code = document.querySelector("#reset_code_input").value
        let password = document.querySelector("#password_input").value
        let confirmPassword = document.querySelector("#confirm_password_input").value
        let validated = validateForm({ phoneCode, phone, code, password, confirmPassword})
        if (validated) submitLoginForm({ phoneCode, phone, code, password, confirmPassword})
    })
}

function validateForm ({ phoneCode, phone, code, password, confirmPassword}) {
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
        document.getElementById('reset_code_error_message').innerHTML = "Code Empty"
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

function submitLoginForm ({ phoneCode, phone, code, password, confirmPassword}) {
    $.ajax({
        url: helper.DOMAIN+"/api/auth/reset-password-code",
        method: "PUT",
        data: { phoneCode, phone, code, password, confirmPassword},
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
    if (typeof response.message === "string") {
        helper.alertMessage(response.message, "error")
    }
    else {
        Object.keys(response.message).map(key => {
            if (key === "phoneCode") document.getElementById('phone_code_error_message').innerHTML = response.message[key].msg
            else if (key === "phone") document.getElementById('phone_error_message').innerHTML = response.message[key].msg
            else if (key === "code") document.getElementById('phone_code_error_message').innerHTML = response.message[key].msg
            else if (key === "password") document.getElementById('password_error_message').innerHTML = response.message[key].msg
            else if (key === "confirmPassword") document.getElementById('confirm_password_error_message').innerHTML = response.message[key].msg
        })
    }
}

function countdown() {
    let form = '<a class="btn p-0 fw-bold text-secondary cursor-pointer" href="./reset_password.html">Resend Code</a>\n' +
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
        }
    }
}