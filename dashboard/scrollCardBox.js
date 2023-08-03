let currentRawIndex = 0;
let cards = $("#goalStatsCards").children(".panel:not(.switches)");
let switches = $(".goalStatsBox").children(".switches").children(".buttons");

switches.children("button").children("i").on("animationend", function () {
    $(this).css("animation", "")
});

$(window).on("resize", updateRowsCount);

$(updateRowsCount);

function updateRowsCount() {
    let rowsCount = getRowsCount();
    if (rowsCount === 1) {
        switches.children("button").attr("disabled", "disabled");
    } else {
        switches.children("button").removeAttr("disabled");
    }
    if (currentRawIndex >= rowsCount) {
        scroll(-1);
    }
}

function scrollDown() {
    scroll(1);
}

function scrollUp() {
    scroll(-1);
}

function scroll(multiplier) {
    let currentRawCount = getRowsCount();
    if (currentRawIndex < clamp(currentRawIndex + multiplier, 0, currentRawCount - 1)) {
        $("#switchDown").css("animation", "0.5s ease-in-out switchDown");
    } else {
        $("#switchUp").css("animation", "0.5s ease-in-out switchUp");
    }
    currentRawIndex = clamp(currentRawIndex + multiplier, 0, currentRawCount - 1)

    for (let card of cards) {
        $(card).css("transform", "translate(0," + -125* currentRawIndex + "%)");
    }

    switches.children("span").text(currentRawIndex+1);
}

function getRowsCount() {
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