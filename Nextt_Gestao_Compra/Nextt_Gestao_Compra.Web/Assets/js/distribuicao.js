var valorInicial, cell, col, row, tabelaProd, tabela;
jQuery.fn.delay = function (time, func) {
    return this.each(function () {
        setTimeout(func, time);
    });
};
$(document).ready(function () {
    $('.navbar-fixed-top').find('.navbar-center').html('Redistribuição de Produtos');
    carregarProdutosRedistribuicao();

    $(document).on('click', '.editavel', function (e) {
        cell = this;
        col = $(this).parent().children().index($(this));
        row = $(this).parent().parent().children().index($(this).parent());
        valorInicial = $(cell).html();
        if (col === 3) {
            $(this).html(geraEditor(1, $(this).html()))
        }
        else {
            $(this).html(geraEditor(2, valorInicial));
            $('.txtDecimal').mask('###.###.###.###.##0,00', { reverse: true });
        }
        $(this).find('input[type="text"]').focus().select();
    });
    $(document).on('click', '.redistribuirProduto', function (e) {

        var linha = $(this).parent().parent();
        var tbUsuario = new $.fn.dataTable.Api("#tabelaUsuarios");
        var idEditar = tbUsuario.row($(linha)).data()[0];
        carregarDistribuicaoFilial();
        $('#modalRedistribuirProduto').modal({
            backdrop: 'static',
            keyboard: false
        })
        $('#modalRedistribuirProduto').modal('show');
    });
    $(document).on('keydown', '.txtInteiro', function (e) {
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
            (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
            (e.keyCode >= 35 && e.keyCode <= 40)) {
            //var totalizador = parseInt($("#tituloProdutoRedistribuir").html().replace("<strong>Total Inicial:</strong> ", ""));

            //var valorReferencia = parseInt($(elemento).val());
            //var valorValidado = checaValorLimite(valorReferencia, totalizador);
            //if (valorReferencia !== valorValidado) {
            //    exibeMensagemValidacao(elemento);
            //    e.preventDefault();
            //}
            //$(elemento).val(valorValidado);



            return;
        }
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    })
})



function carregarProdutosRedistribuicao() {
    tabela = $('#tabelaUsuarios').dataTable({
        paging: true, /* define se a tabela deve usar paginação */
        searching: true, /* define se deve usar o campo Buscar dentro da tabela */
        lengthChange: false,
        pageLength: 10,
        deferRender: true,
        responsive: true,

        "columnDefs": [
            {
                "targets": "_all",
                "orderable": true,
                'className': 'dt-body-center'
            },
            {
                "targets": -1,
                "data": null,
                "defaultContent": '<a href="#" class="btn btn-primary redistribuirProduto" data-toggle="tooltip" title="Redistribuir" style="margin:auto"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>'
            }

        ],
        "language": {
            "emptyTable": "Nenhum produto encontrado",
            "zeroRecords": "Nenhum produto corresponde ao filtro",
            "paginate": {
                "previous": "Anterior",
                "next": "Próximo"
            }
        },
        fixedHeader: true,
        data: cargaTabelaRealocacao,
        columns: [
            { "data": "coluna_id" },
            { "data": "coluna_nome" },
            { "data": "coluna_email" },
            { "data": "coluna_ativo" },
            { "data": "coluna_administrador" },
            { "data": "coluna_gerenciarUsuario" },
            { "data": "coluna_realocar" }
        ]

    });
}
function carregarDistribuicaoFilial() {
    var tabelaProd = $('#tblRedistribuirProduto').dataTable({
        paging: true, /* define se a tabela deve usar paginação */
        searching: true, /* define se deve usar o campo Buscar dentro da tabela */
        lengthChange: false,
        pageLength: 10,
        deferRender: true,
        responsive: true,

        "columnDefs": [
            {
                "targets": "_all",
                "orderable": true,
                'className': 'dt-body-center'
            },
            //{
            //    "targets": [3, 2],
            //    'className': 'editavel'
            //}

        ],
        "language": {
            "emptyTable": "Nenhum produto encontrado",
            "zeroRecords": "Nenhum produto corresponde ao filtro",
            "paginate": {
                "previous": "Anterior",
                "next": "Próximo"
            }
        },
        fixedHeader: true,
        data: cargaTabelaFilialDistribuicao,
        columns: [
            { "data": "idFilial" },
            { "data": "descFilial" },
            { "data": "participacao", 'className': 'editavel' },
            { "data": "qtdAlocada", 'className': 'editavel' }
        ]

    });
}



function perdeFoco() {
    var tbPlanejamento = $('#tblRedistribuirProduto').dataTable().api();
    if ($('.txtInteiro').length) {
        var param = parseInt($('.txtInteiro').val());
        (($('.txtInteiro').val() === valorInicial) ? $(cell).html(valorInicial) : $(cell).html($('.txtInteiro').val()));
        if (param !== parseInt(valorInicial)) {
            atualizaDados("qtdAlocada", tbPlanejamento.row(row).data(), param);
            var totalGrid = tbPlanejamento
                .column(3)
                .data()
                .reduce(function (a, b) {
                    return a + b;
                });
            calculaSobressalenteQtd(totalGrid, $("#tituloProdutoRedistribuir").html());

            atualizaQtdDistribuicao(tbPlanejamento);
        }
    } else {
        var param = parseFloat($('.txtDecimal').val()).toFixed(2);
        (($('.txtDecimal').val() === valorInicial) ? $(cell).html(valorInicial) : $(cell).html($('.txtDecimal').val()));
        if (param !== valorInicial.replace(',', '.')) {
            recalculaQtdNovaPorc(tbPlanejamento, param, row);
            var totalGrid = tbPlanejamento
                .column(3)
                .data()
                .reduce(function (a, b) {
                    return a + b;
                });
            calculaSobressalenteQtd(totalGrid, $("#tituloProdutoRedistribuir").html());

            atualizaQtdDistribuicao(tbPlanejamento);
        }
    }
    var datasourcenovo = tbPlanejamento.data()
    tbPlanejamento.clear();
    tbPlanejamento.data(tbPlanejamento).rows.add(datasourcenovo);
    tbPlanejamento.draw();
    //$(function () {
    //    $('.metricaTooltip').tooltip();
    //});
    //if (localStorage.getItem("erro") !== null) {
    //    if (localStorage.getItem("erro").length > 0) {
    //        var msg = localStorage.getItem("erro");
    //        $("#dangeralert").html('<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
    //            '<i class="fa fa-times" aria-hidden="true"></i>' +
    //            '</button>' +
    //            '<span class="alertaErro">' + msg + '</span>');
    //        $("#dangeralert").fadeTo(6000, 500).slideUp(500, function () {
    //            $("#dangeralert").slideUp(500);
    //            localStorage.removeItem("erro");
    //        });
    //    }
    //}
}

function checaValorLimite(v, max) {
    return (Math.min(max, Math.max(0, v)));
}

function exibeMensagemValidacao(elemento) {
    tooltip($(elemento), "Mostrar");
    $('.tooltip').delay(2000, function () {
        $('.tooltip').fadeOut('fast');
    });

}

function tooltip(elm, msg) {
    if (msg)
        $("<span class='tooltip' />").stop().html('O valor informado excede o limite de produtos disponível para distribuição.').appendTo(elm).show();
    else
        $(".tooltip").hide();
}
