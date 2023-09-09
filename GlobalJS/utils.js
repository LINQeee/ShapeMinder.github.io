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