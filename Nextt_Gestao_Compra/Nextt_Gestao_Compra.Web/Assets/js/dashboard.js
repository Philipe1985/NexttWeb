
/* Display message header */
//****************** LINE & BAR SWITCH CHART ******************//
var tickArray = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'], arrayMes = new Array(12);
arrayMes[0] = "Janeiro"; arrayMes[1] = "Fevereiro"; arrayMes[2] = "Março"; arrayMes[3] = "Abril"; arrayMes[4] = "Maio"; arrayMes[5] = "Junho";
arrayMes[6] = "Julho"; arrayMes[7] = "Agosto"; arrayMes[8] = "Setembro"; arrayMes[9] = "Outubro"; arrayMes[10] = "Novembro"; arrayMes[11] = "Dezembro";
var p1 = [
    { x: arrayMes[0], y: 8.5 }, { x: arrayMes[1], y: 10.0 }, { x: arrayMes[2], y: 5.5 }, { x: arrayMes[3], y: 8.5 }, { x: arrayMes[4], y: 7.5 }, { x: arrayMes[5], y: 4.5 },
    { x: arrayMes[6], y: 9.5 }, { x: arrayMes[7], y: 2.5 }, { x: arrayMes[8], y: 5.5 }, { x: arrayMes[9], y: 4.5 }, { x: arrayMes[10], y: 5.5 }, { x: arrayMes[11], y: 1.0 }
];
var p2 = [
    { x: arrayMes[0], y: 8.5 + 1 }, { x: arrayMes[1], y: 10.0 + 1 }, { x: arrayMes[2], y: 5.5 + 1 }, { x: arrayMes[3], y: 8.5 + 1 }, { x: arrayMes[4], y: 7.5 + 1 }, { x: arrayMes[5], y: 4.5 + 1 },
    { x: arrayMes[6], y: 9.5 + 1 }, { x: arrayMes[7], y: 2.5 + 1 }, { x: arrayMes[8], y: 5.5 + 1 }, { x: arrayMes[9], y: 4.5 + 1 }, { x: arrayMes[10], y: 5.5 + 1 }, { x: arrayMes[11], y: 1.0 + 1 }
]

window.chartColors = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
};

var color = Chart.helpers.color;
var barChartData = {
    labels: arrayMes,
    datasets: [{
        label: 'Vendas Realizadas',
        backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
        borderColor: window.chartColors.red,
        borderWidth: 1,
        data: p1
    }, {
        label: 'Vendas Previstas',
        backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(),
        borderColor: window.chartColors.blue,
        borderWidth: 1,
        data: p2
    }]

};
var lineConfig = {
    type: 'line',
    data: {
        labels: arrayMes,
        datasets: [{
            label: 'Vendas Realizadas',
            backgroundColor: window.chartColors.red,
            borderColor: window.chartColors.red,
            data: p1,
            fill: false,
        }, {
            label: 'Vendas Previstas',
            fill: false,
            backgroundColor: window.chartColors.blue,
            borderColor: window.chartColors.blue,
            data: p2,
        }]
    },
    options: {
        responsive: true,
        title: {
            display: true,
            text: 'Evolução de Vendas'
        },
        tooltips: {
            mode: 'index',
            intersect: false,
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
            xAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Período'
                }
            }],
            yAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Notas'
                }
            }]
        }
    }
};
var barConfig = {
    type: 'bar',
    data: barChartData,
    options: {
        responsive: true,
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Evolução de Vendas'
        }
    }
};
window.onload = function () {
    var ctx = document.getElementById('canvas-grafico').getContext('2d');
    window.myBar = new Chart(ctx, barConfig);

};
$(document).ready(function () {
    $(document).on('click', '.bg-red', function () {
        if (window.myBar) {
            window.myBar.destroy();

        }
        var ctx = document.getElementById('canvas-grafico').getContext('2d');
        window.myLine = new Chart(ctx, lineConfig);
    });
    $(document).on('click', '.bg-green', function () {
        if (window.myLine) {
            window.myLine.destroy();

        }
        var ctx = document.getElementById('canvas-grafico').getContext('2d');
        window.myBar = new Chart(ctx, barConfig);
    });
    $(document).on('click', '.panel-stat .panel-body', function () {
        var destinoEvento = $(this).find('h4').text().replace('Cadastrar ', 'cadastro') + '.cshtml';
        //console.log(destinoEvento)
        window.location = "../cadastro/" + destinoEvento;
    });
});

//var colorNames = Object.keys(window.chartColors);
//document.getElementById('addDataset').addEventListener('click', function () {
//    var colorName = colorNames[barChartData.datasets.length % colorNames.length];
//    var dsColor = window.chartColors[colorName];
//    var newDataset = {
//        label: 'Produto ' + barChartData.datasets.length,
//        backgroundColor: color(dsColor).alpha(0.5).rgbString(),
//        borderColor: dsColor,
//        borderWidth: 1,
//        data: []
//    };

//    for (var index = 0; index < barChartData.labels.length; ++index) {
//        newDataset.data.push(randomScalingFactor());
//    }

//    barChartData.datasets.push(newDataset);
//    window.myBar.update();
//});

//document.getElementById('addData').addEventListener('click', function () {
//    if (barChartData.datasets.length > 0) {
//        var month = MONTHS[barChartData.labels.length % MONTHS.length];
//        barChartData.labels.push(month);

//        for (var index = 0; index < barChartData.datasets.length; ++index) {
//            // window.myBar.addData(randomScalingFactor(), index);
//            barChartData.datasets[index].data.push(randomScalingFactor());
//        }

//        window.myBar.update();
//    }
//});

//document.getElementById('removeDataset').addEventListener('click', function () {
//    barChartData.datasets.splice(0, 1);
//    window.myBar.update();
//});

//document.getElementById('removeData').addEventListener('click', function () {
//    barChartData.labels.splice(-1, 1); // remove the label first

//    barChartData.datasets.forEach(function (dataset) {
//        dataset.data.pop();
//    });

//    window.myBar.update();
//});