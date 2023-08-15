let isChartLoaded = false;
let isTableLoaded = false;
const popup = $("#popup");
const addRecordButton = $("#addRecordButton");
const shortRussianMonths = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
const longRussianMonths = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
const FieldType = {DATE: "#dateInput", WEIGHT: "#weightInput"}

let mainChart;
let currentEditingRecord;
let selectedDate;

class inputFieldError {
    constructor(message, fieldType) {
        this.message = message;
        this.fieldType = fieldType;
    }
}

$(function () {
    uiSetup();
    setupStatsAndRecords();
    loadingFinish();
});

function loadingFinish() {
    if (!isChartLoaded || !isTableLoaded)
        setTimeout(function () {
            loadingFinish()
        }, 100);
    else
        $(".loading").css("animation", "0.2s forwards finishLoading");

}

function setupStatsAndRecords() {
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
        copy.attr("data-record-id", record["id"]);
        copy.find(".recordDate").text(new Date(record["date"]).toLocaleDateString("ru-RU"));
        copy.find(".recordWeight").text(record["currentWeight"] + "кг");
        copy.appendTo(recordsBox);
    }
    parent.remove();
    isTableLoaded = true;
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

    let progressBarSpan = $("#currentProgressSpan");
    let progressBarVal = Math.round(userDTO["progress"]*10);

    progressBarSpan.siblings("svg").find(".js-progress-bar").css({
       transition: "stroke-dashoffset 1s ease-in-out",
        strokeDashoffset: 100-progressBarVal
    });
    progressBarSpan.text(progressBarVal+"%");
}

function getRecords(handleData) {
    $.ajax({
        type: 'GET',
        url: 'https://89.108.76.24:9092/summary?id=1',
        dataType: 'json',
        success: function (data) {
            handleData(data);
        }
    });
}

function editRecord() {
    let weightVal = $("#weightInput").val();
    let dateVal = toJsonFormat($("#dateInput").val());
    $.ajax({
        type: "POST",
        url: "https://89.108.76.24:9092/record",
        data: JSON.stringify({
            currentWeight: weightVal,
            date: dateVal,
            userId: 1,
            id: currentEditingRecord["id"]
        }),
        contentType: "application/json",
        success: function (response) {
            console.log(response);
            currentEditingRecord = null;
            setupStatsAndRecords();
        },
        error: function (e) {
            console.log(e);
        }
    });
}

function deleteRecord(button) {
    let recordId = $(button).closest("tr").attr("data-record-id");

    $.ajax({
        type: "DELETE",
        url: "https://89.108.76.24:9092/record?id=" + recordId,
        success: function (response) {
            setupStatsAndRecords();
            console.log(response);
        },
        error: function (e) {
            console.log(e);
        }
    });
}

function createRecord() {
    let weightVal = $("#weightInput").val();
    let dateVal = toJsonFormat($("#dateInput").val());
    $.ajax({
        type: "POST",
        url: "https://89.108.76.24:9092/record",
        data: JSON.stringify({
            currentWeight: weightVal,
            date: dateVal,
            userId: 1
        }),
        contentType: "application/json",
        success: function (response) {
            setupStatsAndRecords();
            console.log(response);
        },
        error: function (e) {
            console.log(e);
        }
    });
}

function validateInputs() {
    let dateInputVal = $("#dateInput").val();
    let weightInputVal = $("#weightInput").val();
    let fieldsErrors = [];
    if (dateInputVal === "") {
        fieldsErrors.push(new inputFieldError("Укажите дату!", FieldType.DATE));
    } else if (!Date.parse(toJsonFormat(dateInputVal))) {
        fieldsErrors.push(new inputFieldError("Дата должна быть формата дд-мм-гггг!", FieldType.DATE));
    }

    if (weightInputVal === "") {
        fieldsErrors.push(new inputFieldError("Укажите вес!", FieldType.WEIGHT));
    }
    return fieldsErrors;
}

function openCreateRecordPopup() {
    $("#dateInput").datepicker("setDate", new Date());
    $("#weightInput").val("");
    openPopup();
}

function openEditRecordPopup(button) {
    let tableRecord = $(button).closest("tr");
    let currentWeight = tableRecord.find(".recordWeight").text();
    currentWeight = currentWeight.slice(0, currentWeight.length - 2);
    console.log(currentWeight);
    currentEditingRecord = {
        id: tableRecord.attr("data-record-id"),
        date: tableRecord.find(".recordDate").text().replaceAll(".", "-"),
        currentWeight: currentWeight,
        userId: 1
    };

    $("#dateInput").val(currentEditingRecord["date"]);
    $("#weightInput").val(currentEditingRecord["currentWeight"]);

    openPopup();
}

function uiSetup() {
    let submitButtons = $(".submit");
    submitButtons.on("click", function () {
        $(this).attr("disabled", "disabled")
        $(this).css("animation", "0.8s ease-in-out submitButton")
            .children(".fa-check")
            .css("animation", "0.8s ease-in-out submitCheck");
    });

    submitButtons.on("animationend", function () {
        $(this).css("animation", "")
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
        monthNames: longRussianMonths,
        monthNamesShort: shortRussianMonths,
        dayNames: ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
        dayNamesShort: ['вск', 'пнд', 'втр', 'срд', 'чтв', 'птн', 'сбт'],
        dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        weekHeader: 'Не',
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: '',
        onSelect: function () {
            $(this).parent().removeClass("error");
            selectedDate = $(this).val();
        }
    });

    $('#dateInput').datepicker("setDate", new Date());
}

function openPopup() {
    $("#dateInput").parent().removeClass("error");
    $("#weightInput").parent().removeClass("error");
    $("#saveButton").removeAttr("disabled");
    popup.css("animation", "0.3s ease-in-out forwards showPopup");
}

function closePopup() {
    currentEditingRecord = null;
    popup.css("animation", "0.3s ease-in-out forwards hidePopup");
    addRecordButton.removeAttr("disabled");
}

async function save() {
    let saveButton = $("#saveButton");
    let fieldErrors = validateInputs();
    if (fieldErrors.length > 0) {
        for (let error of fieldErrors) {
            let input = $(error["fieldType"]);
            input.siblings("span").text(error["message"]);
            input.parent().addClass("error");
        }
        await sleep(100);
        saveButton.removeAttr("disabled");
        return;
    }
    if (currentEditingRecord != null) editRecord();
    else createRecord();
    await sleep(900);
    closePopup();
    await sleep(100);
    saveButton.removeAttr("disabled");
}

function initChart(weightList, datesList) {
    let data = [];
    for (let i = 0; i < datesList.length; i++) {
        data.push({x: dayFromDate(datesList[i]), y: weightList[i]});
    }
    Chart.defaults.font.family = "Montserrat";
    const ctx = $("#chart");

    const totalDuration = data.length * 50;
    const delayBetweenPoints = totalDuration / data.length;
    const previousY = (ctx) => ctx.index === 0 ? ctx.chart.scales.y.getPixelForValue(100) : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y;
    const animation = {
        x: {
            type: 'number',
            easing: 'linear',
            duration: delayBetweenPoints,
            from: NaN,
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
                label: 'Вес',
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
                },
                tooltip: {
                    callbacks: {
                        title: function (value) {
                            return longMonthFromDay(value[0]["label"]);
                        },
                        label: function (value) {
                            return value["dataset"]["label"] + ": " + value["formattedValue"] + "кг";
                        }
                    },
                    displayColors: false,
                    backgroundColor: "#100C46"
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
                            return shortMonthFromDay(value);
                        }
                    }
                }
            }
        },
    };
    isChartLoaded = true;

    if (mainChart != null) mainChart.destroy();
    mainChart = new Chart(ctx, config);
}

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