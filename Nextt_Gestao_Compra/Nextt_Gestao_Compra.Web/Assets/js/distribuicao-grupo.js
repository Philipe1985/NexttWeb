var linhasMerge = [
    { row: 0, col: 0, rowspan: 4, colspan: 1 },
    { row: 1, col: 6, rowspan: 3, colspan: 1 },
    { row: 2, col: 4, rowspan: 2, colspan: 1 },
    { row: 2, col: 5, rowspan: 2, colspan: 1 },
    { row: 4, col: 0, rowspan: 4, colspan: 1 },
    { row: 5, col: 6, rowspan: 3, colspan: 1 },
    { row: 8, col: 0, rowspan: 2, colspan: 1 },
    { row: 8, col: 1, rowspan: 2, colspan: 1 },
    { row: 8, col: 2, rowspan: 2, colspan: 1 },
    { row: 8, col: 3, rowspan: 2, colspan: 1 },
    { row: 8, col: 4, rowspan: 2, colspan: 1 },
    { row: 8, col: 5, rowspan: 2, colspan: 1 },
]

var customBorders = [
    {
        range: {
            from: {
                row: 0,
                col: 0
            },
            to: {
                row: 3,
                col: 6
            }
        },
        top: {
            width: 3,
            color: '#000000'
        },
        left: {
            width: 3,
            color: '#000000'
        },
        bottom: {
            width: 3,
            color: '#000000'
        },
        right: {
            width: 3,
            color: '#000000'
        }
    },
    {
        range: {
            from: {
                row: 4,
                col: 0
            },
            to: {
                row: 7,
                col: 6
            }
        },
        top: {
            width: 3,
            color: '#000000'
        },
        left: {
            width: 3,
            color: '#000000'
        },
        bottom: {
            width: 3,
            color: '#000000'
        },
        right: {
            width: 3,
            color: '#000000'
        }
    },
    {
        range: {
            from: {
                row: 8,
                col: 0
            },
            to: {
                row: 9,
                col: 6
            }
        },
        top: {
            width: 3,
            color: '#000000'
        },
        left: {
            width: 3,
            color: '#000000'
        },
        bottom: {
            width: 3,
            color: '#000000'
        },
        right: {
            width: 3,
            color: '#000000'
        }
    }]
var data = [
    ['Grupo 1', 'Filial 1', 'Filial 2', 'Filial 3', 'Filial 4', 'Filial 5', 'Total do Grupo'],
    ['Grupo 1', 5, 1000, 11, 12, 13, 51],
    ['Grupo 1', 'Filial 1', 'Filial 2', 'Filial 3', '', '', 51],
    ['Grupo 1', 5, 10, 11, '', '', 51],
    ['Grupo 2', 'Filial 1', 'Filial 2', 'Filial 3', 'Filial 4', 'Filial 5', 'Total do Grupo'],
    ['Grupo 2', 5, 10, 11, 12, 13, 51],
    ['Grupo 2', 'Filial 1', 'Filial 2', 'Filial 3', 'Filial 4', 'Filial 5', 51],
    ['Grupo 2', 5, 10, 11, 12, 13, 51],
    ['Totais', 5, 10, 11, 12, 13, 'Total Geral'],
    ['Totais', 5, 10, 11, 12, 13, 51]
],
    intEditor = Handsontable.editors.TextEditor.prototype.extend(),
    percEditor = Handsontable.editors.TextEditor.prototype.extend(),
    decimalEditor = Handsontable.editors.TextEditor.prototype.extend(),
    container = document.getElementById('excel'),
    container2 = document.getElementById('excel2'),
    hot1,
    hot2;
intEditor.prototype.createElements = function () {
    Handsontable.editors.TextEditor.prototype.createElements.apply(this, arguments);


    this.TEXTAREA = document.createElement('input');
    this.TEXTAREA.setAttribute('type', 'text');
    this.TEXTAREA.className = 'form-control handsontableInput attrNum';
    this.TEXTAREA.onkeyup = validaValor();
    this.textareaStyle = this.TEXTAREA.style;
    this.textareaStyle.width = 0;
    this.textareaStyle.height = 0;
    Handsontable.dom.empty(this.TEXTAREA_PARENT);
    this.TEXTAREA_PARENT.appendChild(this.TEXTAREA);
    $('.attrNum').maskMoney({ thousands: '.', allowZero: true, reverse: false, decimal: ',', precision: 0, allowNegative: false });
    $('.attrNum').maskMoney('mask');

};

intEditor.prototype.getValue = function () {
    return this.TEXTAREA.value.replace(/\./g, '');
};
$(document).ready(function () {
    $(window).on("load", carregar);
    $(document).on('click', '.cancel-change', function (evento) {

        $('.selectpicker').selectpicker('hide');
        $(".navbar.navbar-default.navbar-fixed-top").addClass('ocultarElemento');
        $(".bg_load").show();
        $(".wrapper").show();
        window.location = "../gerenciamento/distribuicaoproduto.cshtml";
    });
})
function carregar() {
    $('.nav-pills a[href="#pack2"]').tab('show');
    hot2 = new Handsontable(container2, {
        data: data,
        colWidths: 120,
        customBorders: customBorders,
        mergeCells: linhasMerge,
        className: "htCenter",
        maxCols: 7,
        minCols: 7,
        columns: function (index) {
            return {
                readOnly: index == 0 || index == 6
            }
        },
        cell: [
            { row: 1, col: 6, className: "htCenter htMiddle" },
            { row: 4, col: 0, className: "htLeft htMiddle" },
            { row: 0, col: 0, className: "htLeft htMiddle" },
            { row: 5, col: 6, className: "htCenter htMiddle" }
        ],
        observeChanges: true,
        cells: function (row, col) {
            var cellProperties = {};
            var rows = this.instance.countSourceRows() - 2;
            if (row < rows) {
                if (col == 0) {
                    cellProperties.renderer = linhaMergeGrupos;
                }
                if (row % 2 === 0) {
                    cellProperties.readOnly = true;
                }
                if (col === 6) {
                    cellProperties.renderer = linhaTotal;
                }
                if (col > 0 && col < 6) {
                    if (row % 2 !== 0) cellProperties.renderer = linhaNumerico;
                    else cellProperties.renderer = linhaTitulo;
                }

            } else {
                cellProperties.readOnly = true;
                if (col == 0) {
                    cellProperties.className = 'htCenter htMiddle'
                    cellProperties.renderer = linhaTotal;
                }
                if (col === 6) {
                    cellProperties.renderer = linhaTotal;
                }
                if (col > 0 && col < 6) {
                    cellProperties.renderer = linhaNumerico;
                    cellProperties.className = 'htCenter htMiddle'
                }
            }

            return cellProperties;
        },
        beforeChange: (changes, source) => {
            if (source == 'edit') {
                changes[0][3] = isNaN(parseInt(changes[0][3])) || parseInt(changes[0][3]) == parseInt(changes[0][2]) ?
                    parseInt(changes[0][2]) :
                    parseInt(changes[0][3]);
                var grp = this.data[changes[0][0]][0];
                this.data[changes[0][0]][changes[0][1]] = changes[0][3];
                var total = 0, limite = this.data.length - 2;
                var totalCol = this.data.reduce(function (prevVal, elem, index, array) {

                    if (elem[changes[0][1]] && index < limite && !isNaN(elem[changes[0][1]])) {
                        return prevVal + elem[changes[0][1]];
                    }
                    return prevVal
                }, 0);
                this.data[limite][changes[0][1]] = totalCol;
                this.data[limite + 1][changes[0][1]] = totalCol;

                var grpTotal = '';
                this.data.map(obj => {
                    if (obj[0] == grp && !isNaN(obj[1]))
                        for (var i = 1; i < obj.length - 1; i++) {
                            total += obj[i];
                        }

                    return obj;
                });
                var totalGeral = 0;
                this.data.map(obj => {

                    if (obj[0] == grp && !isNaN(obj[obj.length - 1])) { obj[obj.length - 1] = total; }
                    if (obj[0] !== grpTotal && obj[0].indexOf("Totais") == -1 && !isNaN(obj[obj.length - 1])) {
                        totalGeral += obj[obj.length - 1];
                        grpTotal = obj[0];
                    }
                    return obj;
                });
                this.data[limite + 1][6] = totalGeral;
            }
        },
        beforeKeyDown: function (e) {
            var selection = hot2.getSelected();
            console.log(selection)
        }
    });
    $('.nav-pills a[href="#pack1"]').tab('show');
    hot1 = new Handsontable(container, {
        data: data,
        colWidths: 120,
        customBorders: customBorders,
        mergeCells: linhasMerge,
        className: "htCenter",
        maxCols: 7,
        minCols: 7,
        columns: function (index) {
            return {
                readOnly: index == 0 || index == 6
            }
        },
        cell: [
            { row: 1, col: 6, className: "htCenter htMiddle" },
            { row: 4, col: 0, className: "htLeft htMiddle" },
            { row: 0, col: 0, className: "htLeft htMiddle" },
            { row: 5, col: 6, className: "htCenter htMiddle" }
        ],
        observeChanges: true,
        cells: function (row, col) {
            var cellProperties = {};
            var rows = this.instance.countSourceRows() - 2;
            if (row < rows) {
                if (col == 0) {
                    cellProperties.renderer = linhaMergeGrupos;
                }
                if (row % 2 === 0) {
                    cellProperties.readOnly = true;
                }
                if (col === 6) {
                    cellProperties.renderer = linhaTotal;
                }
                if (col > 0 && col < 6) {
                    if (row % 2 !== 0) {
                        cellProperties.renderer = linhaNumerico;

                    }
                    else
                        cellProperties.renderer = linhaTitulo;
                }

            } else {
                cellProperties.readOnly = true;
                if (col == 0) {
                    cellProperties.className = 'htCenter htMiddle'
                    cellProperties.renderer = linhaTotal;
                }
                if (col === 6) {
                    cellProperties.renderer = linhaTotal;
                }
                if (col > 0 && col < 6) {
                    cellProperties.renderer = linhaNumerico;
                    cellProperties.className = 'htCenter htMiddle'
                }
            }

            return cellProperties;
        },
        beforeChange: (changes, source) => {
            if (source == 'edit') {
                changes[0][3] = isNaN(parseInt(changes[0][3])) || parseInt(changes[0][3]) == parseInt(changes[0][2]) ?
                    parseInt(changes[0][2]) :
                    parseInt(changes[0][3]);
                var grp = this.data[changes[0][0]][0];
                this.data[changes[0][0]][changes[0][1]] = changes[0][3];
                var total = 0, limite = this.data.length - 2;
                var totalCol = this.data.reduce(function (prevVal, elem, index, array) {

                    if (elem[changes[0][1]] && index < limite && !isNaN(elem[changes[0][1]])) {
                        return prevVal + elem[changes[0][1]];
                    }
                    return prevVal
                }, 0);
                this.data[limite][changes[0][1]] = totalCol;
                this.data[limite + 1][changes[0][1]] = totalCol;

                var grpTotal = '';
                this.data.map(obj => {
                    if (obj[0] == grp && !isNaN(obj[1]))
                        for (var i = 1; i < obj.length - 1; i++) {
                            total += obj[i];
                        }

                    return obj;
                });
                var totalGeral = 0;
                this.data.map(obj => {

                    if (obj[0] == grp && !isNaN(obj[obj.length - 1])) { obj[obj.length - 1] = total; }
                    if (obj[0] !== grpTotal && obj[0].indexOf("Totais") == -1 && !isNaN(obj[obj.length - 1])) {
                        totalGeral += obj[obj.length - 1];
                        grpTotal = obj[0];
                    }
                    return obj;
                });
                this.data[limite + 1][6] = totalGeral;
            }
        },

    });
    var $menuTitulo = $(".navbar.navbar-default.navbar-fixed-top");
    $menuTitulo.find('.navbar-header .navbar-center').text('Cadastrar Distribuição');
    if ($menuTitulo.hasClass('ocultarElemento'))
        $menuTitulo.removeClass('ocultarElemento');
    $(".bg_load").fadeOut();
    $(".wrapper").fadeOut();
}
function linhaTitulo(instance, td, row, col, prop, value, cellProperties) {

    if (value != "") {
        Handsontable.renderers.TextRenderer.apply(this, arguments);
        td.style.fontWeight = 'bold';
        td.style.background = '#b4c6e7';
    }
}
function linhaMergeGrupos(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.TextRenderer.apply(this, arguments);
    td.style.fontWeight = 'bold';
    td.style.background = '#CEC';
}
function linhaTotal(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.TextRenderer.apply(this, arguments);
    if (isNaN(value)) {
        var rows = instance.countSourceRows() - 2;
        td.style.fontWeight = 'bold';
        td.style.color = 'white';
        if (rows >= row && col == 0 && value && value.length > 0) {
            td.innerHTML = value.toUpperCase()
        }
        td.style.background = '#595959';
    } else {
        td.innerHTML = value.toLocaleString('pt-BR')
        td.style.fontWeight = 'bold';
        td.style.background = '#CEC';
    }

}
function linhaNumerico(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.TextRenderer.apply(this, arguments);
    if (isNaN(parseInt(value))) {

    } else {
        cellProperties.editor = intEditor
        td.innerHTML = value.toLocaleString('pt-BR')
    }
}
function geraGridPack(objDataLinha) {
    var retorno = [];
    var linhaTit = [], linhaDado = [];
    for (var i = 0; i < objDataLinha.filiais.length; i++) {
        if (i % 5 == 0) {
            linhaTit = [objDataLinha.nomeGrupo, objDataLinha.filiais[i].nome];
            linhaDado = [objDataLinha.nomeGrupo, objDataLinha.filiais[i].qtd];
        } else {
            linhaTit.push(objDataLinha.filiais[i].nome);
            linhaDado.push(objDataLinha.filiais[i].qtd);
        }
        if ((i + 1) % 5 == 0 || (i + 1) == objDataLinha.filiais.length) {
            var totalLinha = linhaDado.reduce((pv, cv) => { return pv + (parseInt(cv) || 0); }, 0);
            var indexAddCol = 6 - linhaTit.length;
            console.log(indexAddCol)
            for (var j = 0; j < indexAddCol; j++) {
                linhaTit.push(null)
                linhaDado.push(null)
            }

            linhaTit.push('Total do Grupo')
            linhaDado.push(totalLinha);
            retorno.push(linhaTit);
            retorno.push(linhaDado);
        }

    }
    return retorno;
}

function validaValor() {

}