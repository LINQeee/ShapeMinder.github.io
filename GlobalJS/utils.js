

const dayFromDate = date =>
    Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);

function shortMonthFromDay(day) {
    let date = new Date(2023, 0);
    let convertedDate = new Date(date.setDate(day));
    return shortRussianMonths[convertedDate.getMonth()];
}

function longMonthFromDay(day) {
    let date = new Date(2023, 0);
    let convertedDate = new Date(date.setDate(day));
    return longRussianMonths[convertedDate.getMonth()];
}

function toJsonFormat(date) {
    return date.split("-").reverse().join("-");
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function isEmptyOrSpaces(str){
    return str === null || str.match(/^ *$/) !== null;
}

const isEmailValidated = (email) => {
    return email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}