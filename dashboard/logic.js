let isChartLoaded = false;
let isTableLoaded = false;
const popup = $("#popup");
const addRecordButton = $("#addRecordButton");
const shortRussianMonths = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
const longRussianMonths = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

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
    let progressBarVal = Math.round(userDTO["progress"]*100);

    progressBarSpan.siblings("svg").find(".js-progress-bar").css({
       transition: "stroke-dashoffset 1s ease-in-out",
        strokeDashoffset: 100-progressBarVal
    });
    progressBarSpan.text(progressBarVal+"%");
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

async function save() {
    let saveButton = $("#saveButton");
    let fieldErrors = validateInputs();
    if (fieldErrors.length > 0) {
        for (let error of fieldErrors) {
            showInputError(error);
        }
        await sleep(100);
        saveButton.removeAttr("disabled");
        return;
    }
    if (currentEditingRecord != null) editRecord(handleRecordResponse);
    else createRecord(handleRecordResponse);

    await sleep(100);
    saveButton.removeAttr("disabled");
}

async function handleRecordResponse(status, inputFieldError) {
    if(status === 200){
        await sleep(900);
        closePopup();
        await sleep(100);
    }
    else if (status === 500) showInputError(inputFieldError);
}