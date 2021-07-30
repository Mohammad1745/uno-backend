let helper = {
    DOMAIN: "http://127.0.0.1:8000",

    sleep : (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    },

    getTime: dateTime => {
        return (dateTime.getHours()<10 ? "0"+dateTime.getHours():dateTime.getHours())
        +":"+(dateTime.getMinutes()<10 ? "0"+dateTime.getMinutes():dateTime.getMinutes())
    },

    toAmPm: time =>{
        let hour = Number(time.substr(0,2))
        let minute = time.substr(3,2)
        if (hour===0) time = "12:"+minute+"AM"
        else if (hour<12) time = time+"AM"
        else if (hour===12) time = "12:"+minute+"PM"
        else time = (hour-12)+":"+minute+"PM"
        return time
    },

    alertMessage : (type="success", message) => {
        let content = `<div style="position: fixed; left: 0; top: 0; width: 100%; z-index: 100">`
        if(type==="success") {
            content += `
                <div class="alert-float alert alert-success alert-dismissable">
                    <button type="button" class="close" data-dismiss="alert" aria-hidden="true">x</button>
                    ${message}
                </div>`
        }
        else {
            content += `
                <div class="alert-float alert alert-danger alert-dismissable">
                    <button type="button" class="close" data-dismiss="alert" aria-hidden="true">x</button>
                    ${message}
                </div>`
        }
        content+= `</div>`
        document.body.insertAdjacentHTML('beforeend', content)
        setTimeout(() => {
            document.querySelector('.close').click()
        }, 2000)
    },

    checkAlert: () => {
        let success = localStorage.getItem('success')
        let error = localStorage.getItem('error')
        if (success) {
            localStorage.removeItem("success")
            helper.alertMessage(success, "success")
        }
        else if (error) {
            localStorage.removeItem("error")
            helper.alertMessage(error, "error")
        }
    },

    handleLogoutButton:() => {
        let logoutButton = document.querySelector('#logout_btn')
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem("tokenType")
            localStorage.removeItem("token")
            localStorage.setItem('success', "Logged Out Successfully.")
            window.location.replace('../authentication/login.html')
        })
    },

    updateAvatar:() => {
        $.ajax({
            url: "http://127.0.0.1:8000/api/user/profile",
            method: "GET",
            headers: { authorization: localStorage.getItem("tokenType") + " " + localStorage.getItem("token")},
        }).done(response => {
            if (response.success) {
                let image = helper.DOMAIN+"/uploads/avatar/"+response.data.image
                $("#avatar").attr("src", image)
            } else {
                window.location.replace("../authentication/login.html")
            }
        }).fail(err => {
            console.log(err)
        })
    },

    updateUserInfo: (user) => {
        $.ajax({
            url: "http://127.0.0.1:8000/api/user/profile",
            method: "GET",
            headers: { authorization: localStorage.getItem("tokenType") + " " + localStorage.getItem("token")},
        }).done(response => {
            if (response.success) {
                localStorage.setItem('id', response.data.id )
                localStorage.setItem('firstName', response.data.firstName )
                localStorage.setItem('lastName', response.data.lastName )
                localStorage.setItem('email', response.data.email )
            } else {
                window.location.replace("../authentication/login.html")
            }
        }).fail(err => {
            console.log(err)
        })
    }
}
