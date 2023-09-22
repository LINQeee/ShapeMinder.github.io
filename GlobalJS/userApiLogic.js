let currentUser;

class User {
    constructor(username, password, gender, height, age, email, ip, rememberMe, code) {
        this.username = username;
        this.password = password;
        this.gender = gender;
        this.height = height;
        this.age = age;
        this.email = email;
        this.ip = ip;
        this.rememberMe = rememberMe;
        this.code = code;
    }
}

const Gender = {MALE: "M", FEMALE: "F"}

function createUser(user) {
    $.ajax({
        url: "https://shape-minder.tech/user",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(user),
        success: function () {
            currentUser = user;
            sendCode();
        },
        error: async function (err) {
            let response = err["responseJSON"];
            if (response["type"] === "VALIDATION") {
                showInputError(new inputFieldError(response["msg"], FieldType[response["inputFieldType"]]));
                await previousForm();
            }
        }
    });
}

function getIp(callback) {
    $.ajax({
        url: "https://api.db-ip.com/v2/free/self",
        method: "GET",
        dataType: "json",
        success: function (response) {
            callback(response["ipAddress"]);
        },
        error: function (err) {
            console.log(err);
        }
    });
}

function sendCode() {
    console.log(currentUser);
    $.ajax({
        url: "https://shape-minder.tech/send-code",
        method: "POST",
        data: currentUser.email,
        contentType: "text/plain",
        success: function () {
            openEmailPopup();
        },
        error: function (err) {
            console.log(err);
        }
    });
}

function checkCode(code, success, error) {
    currentUser.code = code;
    $.ajax({
        url: "https://shape-minder.tech/check-code",
        method: "POST",
        data: JSON.stringify(currentUser),
        contentType: "application/json",
        success: function (response) {
            success(response);
        },
        error: function (err) {
            if (err.status === 500){
                error(err.responseText);
            }
            else console.log(err);
        }
    });
}