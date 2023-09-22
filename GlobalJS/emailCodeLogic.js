
function handleCodeInput(input) {
    $(input).parent().siblings(".error").removeClass("active");
    if (!isEmptyOrSpaces(input.value)){
        $(input).next("input").trigger("focus");

        let isAllInputsFilled = true;
        for (let codeInput of $(input).parent().children("input")){
            if (isEmptyOrSpaces(codeInput.value)) isAllInputsFilled = false;
        }
        if (isAllInputsFilled) checkCodeAndHandleInputs($(input).parent().children("input"));
    }
    else {
        $(input).prev("input").trigger("focus");
    }
}

function checkCodeAndHandleInputs(inputs) {
    let code = '';
    for (let i = 0; i < inputs.length; i++){
        $(inputs[i]).prop("disabled", true);
        code += $(inputs[i]).val();
    }
    checkCode(code, rightCode, wrongCode);
}

function rightCode(response) {
    setCookie("email", response["email"], 30);
    setCookie("password", response["password"], 30);
    window.location.href = "https://hudeem.info/";
}

function wrongCode(responseText) {
    let error = $(".codeBox~.error");
    error.text(responseText);
    error.addClass("active");
    let inputs = $(".codeBox").children("input");
    for (let i = 0; i < inputs.length; i++){
        $(inputs[i]).prop("disabled", false);
    }
}

function openEmailPopup() {
    $(".popupBox").css({
        opacity: "1",
        bottom: "0"
    })
}

function closeEmailPopup() {
    $(".popupBox").css({
        opacity: "0",
        bottom: "-100%"
    })
}