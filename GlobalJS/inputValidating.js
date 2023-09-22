const FieldType = {
    DATE: "#dateInput",
    WEIGHT: "#weightInput",
    EMAIL: "#emailInput",
    PASSWORD: "#passwordInput",
    PASSWORD_CONFIRM: "#passwordConfirmInput",
    USERNAME: "#usernameInput",
    AGE: "#ageInput",
    HEIGHT: "#heightInput",
    GENDER: "#genderChoices"
}

class inputFieldError {
    constructor(message, fieldType) {
        this.message = message;
        this.fieldType = fieldType;
    }
}

function showInputError(error) {
    let input = $(error["fieldType"]);
    input.siblings("span").text(error["message"]);
    input.parent().addClass("error");
}