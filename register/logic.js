async function nextForm() {
    let accountForm = $("#accountForm");
    let biologyForm = $("#biologyForm");
    let headerSpan = $("#headerSpan");
    accountForm.css("opacity", "0");
    headerSpan.css("opacity", "0");

    await sleep(350);

    accountForm.css("display", "none");
    headerSpan.text("Расскажите О Себе")

    biologyForm.css("display", "flex");
    await sleep(50);
    biologyForm.css("opacity", "1");
    headerSpan.css("opacity", "1");
}

async function previousForm() {
    let accountForm = $("#accountForm");
    let biologyForm = $("#biologyForm");
    let headerSpan = $("#headerSpan");

    biologyForm.css("opacity", "0");
    headerSpan.css("opacity", "0");

    await sleep(150);

    biologyForm.css("display", "none");
    accountForm.css("display", "flex");


    await sleep(50);
    accountForm.css("opacity", "1");
    headerSpan.css("opacity", "1");
}

async function submitForm() {
    let errorInputs = validateLoginInputs();
    let accountFields = [FieldType.EMAIL, FieldType.PASSWORD, FieldType.PASSWORD_CONFIRM];
    let isContainsAccountFields = false;
    for (let errorInput of errorInputs) {
        showInputError(errorInput);
        if (accountFields.includes(errorInput.fieldType)) isContainsAccountFields = true;
    }
    if (isContainsAccountFields) await previousForm();
    if (errorInputs.length > 0) return;

    getIp(function (ip) {
        createUser(new User(
            $("#usernameInput").val(),
            $("#passwordInput").val(),
            $("#maleInput").prop("checked") ? Gender.MALE : Gender.FEMALE,
            $("#heightInput").val(),
            $("#ageInput").val(),
            $("#emailInput").val(),
            ip,
            $("#isRememberMe").prop("checked")
        ));
    });
}

function validateLoginInputs() {
    let errorInputs = [];
    if (isEmptyOrSpaces($("#emailInput").val()))
        errorInputs.push(new inputFieldError("Укажите почту!", FieldType.EMAIL));
    else if (!isEmailValidated($("#emailInput").val()))
        errorInputs.push(new inputFieldError("Неверный формат почты!", FieldType.EMAIL));

    if (isEmptyOrSpaces($("#passwordInput").val()))
        errorInputs.push(new inputFieldError("Укажите пароль!", FieldType.PASSWORD));
    if ($("#passwordInput").val() !== $("#passwordConfirmInput").val())
        errorInputs.push(new inputFieldError("Пароли не совпадают!", FieldType.PASSWORD_CONFIRM));
    if (isEmptyOrSpaces($("#usernameInput").val()))
        errorInputs.push(new inputFieldError("Укажите имя пользователя!", FieldType.USERNAME));
    if (isEmptyOrSpaces($("#ageInput").val()))
        errorInputs.push(new inputFieldError("Укажите возраст!", FieldType.AGE));
    else if (parseInt($("#ageInput").val()) <= 0)
        errorInputs.push(new inputFieldError("Некорректный возраст!", FieldType.AGE));
    if (isEmptyOrSpaces($("#heightInput").val()))
        errorInputs.push(new inputFieldError("Укажите рост!", FieldType.HEIGHT));
    else if (parseInt($("#heightInput").val()) <= 0)
        errorInputs.push(new inputFieldError("Некорректный рост!", FieldType.HEIGHT));
    if (!$("#maleInput").prop("checked") && !$("#femaleInput").prop("checked"))
        errorInputs.push(new inputFieldError("Укажите пол!", FieldType.GENDER));
    return errorInputs;
}