let mainChart;
let currentEditingRecord;
let selectedDate;

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