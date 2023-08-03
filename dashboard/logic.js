const popup = $("#popup");
const addRecordButton = $("#addRecordButton");

$(function () {
    initChart();
    uiSetup();
});

function uiSetup() {
    $(".submit").on("click", function() {
        $(this).css("animation", "0.8s ease-in-out submitButton")
            .children(".fa-check")
            .css("animation", "0.8s ease-in-out submitCheck");
    });

    $(".submit").on("animationend", function() {
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
        monthNamesShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
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
    await sleep(900);
    closePopup();
    await sleep(100);
    $("#saveButton").removeAttr("disabled");
}

function initChart() {
    let data = [];
    let prev = 100;
    for (let i = 0; i < 100; i++) {
        data.push({x: i / 2, y: Math.floor(Math.random() * 31)});
    }
    Chart.defaults.font.family = "Montserrat";
    const ctx = $("#chart");

    const totalDuration = 5000;
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
                radius: 0
            }]
        },
        options: {
            animation,
            responsive: true,
            maintainAspectRatio: false,
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
                        }
                    }
                }
            }
        },
    };

    new Chart(ctx, config);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}