$(".switchers").children(".buttons").children("button").children("i").on("animationend", function () {
    $(this).css("animation", "")
});

$(window).on("resize", function(){
    updateRowsCount("currentStatsCards");
    updateRowsCount("goalStatsCards");
});

$(function(){
    updateRowsCount("currentStatsCards");
    updateRowsCount("goalStatsCards");
});

function updateRowsCount(id) {
    let cardsBox = $("#"+id);
    let rowsCount = getRowsCount(cardsBox.children(".panel"));
    let switches = cardsBox.find(".switches").find(".buttons");
    if (rowsCount === 1) {
        switches.children("button").attr("disabled", "disabled");
    } else {
        switches.children("button").removeAttr("disabled");
    }
    if (cardsBox.attr("data-row-index") >= rowsCount) {
        scroll(-1, id);
    }
}

function scrollDown(id) {
    scroll(1, id);
}

function scrollUp(id) {
    scroll(-1, id);
}

function scroll(multiplier, id) {
    let currentBox = $("#"+id);
    let cards = currentBox.children(".panel");
    let currentRawCount = getRowsCount(cards);
    let currentRowIndex = parseInt(currentBox.attr("data-row-index"));
    if (currentRowIndex < clamp(currentRowIndex + multiplier, 0, currentRawCount - 1)) {
        currentBox.find(".switches").find(".fa-chevron-down").css("animation", "0.5s ease-in-out switchDown");
    } else {
        currentBox.find(".switches").find(".fa-chevron-up").css("animation", "0.5s ease-in-out switchUp");
    }
    currentRowIndex = clamp(currentRowIndex + multiplier, 0, currentRawCount - 1)

    for (let card of cards) {
        $(card).css("transform", "translate(0," + -130 * currentRowIndex + "%)");
    }

    currentBox.find(".switches").find("span").text(currentRowIndex + 1);
    currentBox.attr("data-row-index", currentRowIndex);
}

function getRowsCount(cards) {
    let currentRowCount = 1;
    for (let i = 0; i < cards.length; i++) {
        if (i !== 0 && cards[i].offsetTop !== cards[i - 1].offsetTop) currentRowCount++;
    }
    return currentRowCount;
}

function clamp(num, min, max) {
    return num < min
        ? max
        : num > max
            ? min
            : num
}