const popup = $("#popup");
const addRecordButton = $("#addRecordButton");
const russianMonthNames = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];

$(function () {
    uiSetup();
    setupRecords();
});

function setupRecords() {
    getRecords(function (data) {
        let userDTO = data["userDTO"];
        //* chartCreate
        let weightList = [];
        let datesList = [];
        weightList.push(userDTO["initialWeight"]);
        datesList.push(new Date(userDTO["startDate"]));
        for (let record of data["recordDTOList"]) {
            weightList.push(record["currentWeight"]);
            datesList.push(new Date(record["date"]));
        }
        updateTable(data["recordDTOList"].reverse());
        setupStats(userDTO);
        initChart(weightList, datesList);
    });
}

function updateTable(recordDTOList) {
    let recordsBox = $(".recordsTable").find("tbody");
    recordsBox.children("tr").not(":first").remove();
    let parent = recordsBox.find("tr");
    for (let record of recordDTOList) {
        let copy = parent.clone();
        copy.find(".recordDate").text(new Date(record["date"]).toLocaleDateString("ru-RU"));
        copy.find(".recordWeight").text(record["currentWeight"] + "кг");
        copy.appendTo(recordsBox);
    }
    parent.remove();
}

function setupStats(userDTO) {
    $("#initialWeightSpan").text(userDTO["initialWeight"] + "кг");
    $("#currentWeightSpan").text(userDTO["currentWeight"] + "кг");
    $("#lostWeightSpan").text(userDTO["weightLost"] + "кг");
    $("#startDateSpan").text(new Date(userDTO["startDate"]).toLocaleDateString("ru-RU"));
    $("#goalSpan").text(userDTO["goalWeight"] + "кг");
    $("#leftWeightSpan").text(userDTO["weightLeft"] + "кг");
    $("#supposedDateSpan").text(new Date(userDTO["plannedDate"]).toLocaleDateString("ru-RU"));
    $("#perDaySpan").text(userDTO["perDay"]);
    $("#perWeekSpan").text(userDTO["perWeek"]);
}

function getRecords(handleData) {
    $.ajax({
        type: 'GET',
        url: 'http://89.108.76.24:9092/summary?id=1',
        dataType: 'json',
        success: function (data) {
            handleData(data);
        }
    });
}

function createRecord() {
    let weightVal = $("#weightInput").val();
    let dateVal = new Date($("#dateInput").val()).toISOString().split("T")[0];
    $.ajax({
        type: "POST",
        url: "http://89.108.76.24:9092/record",
        data: JSON.stringify({
            currentWeight: weightVal,
            date: dateVal,
            userId: 1
        }),
        contentType: "application/json",
        success: function (response) {
            console.log(response);
        },
        error: function (e) {
            console.log(e);
        }
    });
}

function openCreateRecordPopup() {
    $("#dateInput").datepicker("setDate", new Date());
    $("#weightInput").val("");
    openPopup();
}

function uiSetup() {
    $(".submit").on("click", function () {
        $(this).css("animation", "0.8s ease-in-out submitButton")
            .children(".fa-check")
            .css("animation", "0.8s ease-in-out submitCheck");
    });

    $(".submit").on("animationend", function () {
        $(this).attr("disabled", "disabled")
            .css("animation", "")
            .children(".fa-check")
            .css("animation", "");
    });

    $("#dateInput").datepicker({
        maxDate: new Date(),
        dateFormat: "dd-mm-yy",
        duration: "fast",
        closeText: 'Закрыть',
        prevText: 'Предыдущий',
        nextText: 'Следующий',
        currentText: 'Сегодня',
        monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        monthNamesShort: russianMonthNames,
        dayNames: ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
        dayNamesShort: ['вск', 'пнд', 'втр', 'срд', 'чтв', 'птн', 'сбт'],
        dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        weekHeader: 'Не',
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: ''
    });

    $('#dateInput').datepicker("setDate", new Date());
}

function openPopup() {
    popup.css("animation", "0.3s ease-in-out forwards showPopup");
}

function closePopup() {
    popup.css("animation", "0.3s ease-in-out forwards hidePopup");
    addRecordButton.removeAttr("disabled");
}

async function save() {
    createRecord();
    await sleep(900);
    closePopup();
    await sleep(100);
    $("#saveButton").removeAttr("disabled");
}

function initChart(weightList, datesList) {
    let data = [];
    for (let i = 0; i < datesList.length; i++) {
        data.push({x: dayFromDate(datesList[i]), y: weightList[i]});
    }
    Chart.defaults.font.family = "Montserrat";
    const ctx = $("#chart");

    const totalDuration = 1000;
    const delayBetweenPoints = totalDuration / data.length;
    const previousY = (ctx) => ctx.index === 0 ? ctx.chart.scales.y.getPixelForValue(100) : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y;
    const animation = {
        x: {
            type: 'number',
            easing: 'linear',
            duration: delayBetweenPoints,
            from: NaN, // the point is initially skipped
            delay(ctx) {
                if (ctx.type !== 'data' || ctx.xStarted) {
                    return 0;
                }
                ctx.xStarted = true;
                return ctx.index * delayBetweenPoints;
            }
        },
        y: {
            type: 'number',
            easing: 'linear',
            duration: delayBetweenPoints,
            from: previousY,
            delay(ctx) {
                if (ctx.type !== 'data' || ctx.yStarted) {
                    return 0;
                }
                ctx.yStarted = true;
                return ctx.index * delayBetweenPoints;
            }
        }
    };

    const config = {
        type: 'line',
        data: {
            datasets: [{
                label: 'My First Dataset',
                data: data,
                fill: false,
                borderColor: '#4C2DFE',
                tension: 0.3,
                radius: 3
            }]
        },
        options: {
            animation,
            responsive: true,
            maintainAspectRatio: false,
            elements: {
              point: {
                  hitRadius: 10
              }
            },
            plugins: {
                legend: {
                    display: false,
                }
            },
            layout: {
                padding: {
                    left: 15,
                    top: 22,
                    right: 21.5,
                    bottom: 16
                }
            },
            scales: {
                y: {
                    grid: {
                        drawBorder: false,
                        color: "rgba(204, 204, 204, 0.4)"
                    },
                    ticks: {
                        color: "#5E5E5E",
                        font: {
                            size: 15,
                        }
                    }
                },
                x: {
                    type: "linear",
                    grid: {
                        drawBorder: false,
                        display: false
                    },
                    ticks: {
                        color: "#5E5E5E",
                        font: {
                            size: 15,
                        },

                        callback: function (value) {
                            return monthFromDay(value);
                        }
                    }
                }
            }
        },
    };

    new Chart(ctx, config);
}

const dayFromDate = date =>
    Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);

function monthFromDay(day) {
    console.log(day);
    let date = new Date(2023, 0);
    let convertedDate = new Date(date.setDate(day));
    console.log(convertedDate.toLocaleDateString("ru-RU", {month: "long"}));
    return  russianMonthNames[convertedDate.getMonth()];
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}