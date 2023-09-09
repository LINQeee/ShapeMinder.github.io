
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