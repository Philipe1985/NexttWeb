var tabela, statusFiltro = [], perfilId = [], filtrarParametros = false, idBloqueia;

$(document).ready(function () {
    $('.navbar-fixed-top').find('.navbar-center').html('Realocação de Produtos');
    carregarProdutosRealocacao();

    $(document).on('keydown', '#fTxtQtds', function (e) {
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
            (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
            (e.keyCode >= 35 && e.keyCode <= 40)) {
            return;
        }
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    })
  

    document.querySelector("button.dir").onclick = function () {
        mover(document.querySelector("ul.esq"),
            document.querySelector("ul.dir"));
    };

    document.querySelector("button.esq").onclick = function () {
        mover(document.querySelector("ul.dir"),
            document.querySelector("ul.esq"));
    };

    // Drag-and-drop
    $(function () {
        $("#sortable1, #sortable2").sortable({
            connectWith: ".connectedSortable"
        }).disableSelection();
    });
    $('#ucComboQtds').on('changed.bs.select', function (e, clickedIndex, newValue, oldValue) {
        var selected = $(e.currentTarget).val();
        if (selected) {
            $('#filtroMetrica').css('display', 'block');
        } else {
            $('#ucComboMetrica').selectpicker('deselectAll');
            $('#filtroMetrica').css('display', 'none');
            $('#filtroQtds').css('display', 'none');
            $('#fTxtQtds').val('');

        }

    });
    $('#ucComboMetrica').on('changed.bs.select', function (e, clickedIndex, newValue, oldValue) {
        var selected = $(e.currentTarget).val();
        if (selected) {
            $('#filtroQtds').css('display', 'block');
        } else {
            $('#fTxtQtds').val('');
            $('#filtroQtds').css('display', 'none');

        }
    });
    $('#fTxtBusca').keyup(function () {
        tabela.fnFilter($(this).val());
    });

    $('#fTxtBusca').keypress(function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
        }
    });
    $(document).on('click', '.realocarProduto', function (e) {

        var linha = $(this).parent().parent();
        var tbUsuario = new $.fn.dataTable.Api("#tabelaUsuarios");
        var idEditar = tbUsuario.row($(linha)).data()[0];
        $('#modalRealocarProduto').modal({
            backdrop: 'static',
            keyboard: false
        })
        $('#modalRealocarProduto').modal('show');
    });
})
function mover(fonte, destino) {
    var selecionados = fonte.querySelectorAll("li input:checked");
    for (var i = 0; i < selecionados.length; i++) {
        var li = selecionados[i].parentNode.parentNode;
        fonte.removeChild(li);
        destino.appendChild(li);
        selecionados[i].checked = false;
    }
}
function carregarProdutosRealocacao() {
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
                "defaultContent": '<a href="#" class="btn btn-primary realocarProduto" data-toggle="tooltip" title="Realocar" style="margin:auto"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>'
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
        //"ajax": {
        //    'type': 'POST',
        //    'cache': false,
        //    'url': urlApi + 'ListarUsuarios',
        //    'data': function (d) {
        //        if (filtrarParametros === true) {
        //            return d = { 'status': statusFiltro, 'perfilId': perfilId };
        //        }
        //    },
        //    'beforeSend': function (req) {
        //        req.setRequestHeader('Authorization', sessionStorage.getItem("token"));
        //    },
        //    "dataSrc": function (json) {
        //        var retorno = [];
        //        for (var i = 0; i < json.length; i++) {
        //            retorno.push(
        //                CarregarGridUsuario(json[i])
        //            );
        //        }
        //        $('#tabelaUsuarios_paginate').css('display', 'block');
        //        $(".bg_load").fadeOut();
        //        $(".wrapper").fadeOut();
        //        return retorno;
        //    }
        //}
    });

    //$('#tabelaUsuarios thead tr th').removeClass('sorting_asc');
    //carregaComboPerfil();
    //$(".navbar.navbar-default.navbar-fixed-top").css("display", "block");

    //$("#usuarioOpcao").css("display", "none");

    //$("#bottomNav").css('display', 'none');
}