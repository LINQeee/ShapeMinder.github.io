function editRecord(callback) {
    let weightVal = $("#weightInput").val();
    let dateVal = toJsonFormat($("#dateInput").val());
    $.ajax({
        type: "POST",
        url: "https://shape-minder.tech/record",
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
            callback(200);
        },
        error: function (e) {
            if (e["responseJSON"]["type"] === "VALIDATION") {
                callback(
                    e["status"],
                    new inputFieldError(e["responseJSON"]["msg"],
                        FieldType[e["responseJSON"]["inputFieldType"]])
                );
            }
        }
    });
}

function getRecords(handleData) {
    $.ajax({
        type: 'GET',
        url: 'https://shape-minder.tech/summary?id=1',
        dataType: 'json',
        success: function (data) {
            handleData(data);
        }
    });
}

function deleteRecord(button) {
    let recordId = $(button).closest("tr").attr("data-record-id");

    $.ajax({
        type: "DELETE",
        url: "https://shape-minder.tech/record?id=" + recordId,
        success: function (response) {
            setupStatsAndRecords();
            console.log(response);
        },
        error: function (e) {
            console.log(e);
        }
    });
}

function createRecord(callback) {
    let weightVal = $("#weightInput").val();
    let dateVal = toJsonFormat($("#dateInput").val());
    $.ajax({
        type: "POST",
        url: "https://shape-minder.tech/record",
        data: JSON.stringify({
            currentWeight: weightVal,
            date: dateVal,
            userId: 1
        }),
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            setupStatsAndRecords();
            callback(200);
            console.log(response);
        },
        error: function (e) {
            if (e["responseJSON"]["type"] === "VALIDATION") {
                callback(
                    e["status"],
                    new inputFieldError(e["responseJSON"]["msg"],
                        FieldType[e["responseJSON"]["inputFieldType"]])
                );
            }
        }
    });
}