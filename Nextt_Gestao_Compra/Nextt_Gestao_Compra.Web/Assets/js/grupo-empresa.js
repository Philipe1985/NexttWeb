﻿var dtbCadGrp;
$(document).ready(function () {
    $('.selectpicker').selectpicker();
    $('.selectpicker').selectpicker('refresh');
    $(window).on("load", carregar);
    $(document).on('click', '.painelCard', function (evento) {
        limpaModalGrupoEmpresas();
        var cod = $(this).attr('id');
        if (parseInt(cod) > 0) {
            var $menuTitulo = $(".navbar.navbar-default.navbar-fixed-top");
            $menuTitulo.addClass('ocultarElemento');
            $(".bg_load").show();
            $(".wrapper").show();
            objEnvio = {};
            objEnvio.codigo = $(this).attr('id');
            editarGrupoEmpresa(objEnvio);
        } else {
            if (!$('#btnExlcuirOperacao').hasClass('ocultarElemento')) {
                $('#btnExlcuirOperacao').addClass('ocultarElemento');
            }
            $('#btnFinalizarOperacao').html('<i class="fa fa-check" aria-hidden="true"></i> Cadastrar')
            $('#modalGrupoEmpresa').modal({
                backdrop: 'static',
                keyboard: false
            });
        }


    });
    $(document).on('click', '.editarGrupo', function (evento) {
        limpaModalGrupoEmpresas();
        var linha = $(this).parent().parent();
        var dadoLinha = dtbCadGrp.row($(linha)).data()
        var objEnvio = {};
        objEnvio.codigo = dadoLinha.idGrupoEmpresa;
        $('#txtCodGrupo').val(dadoLinha.idGrupoEmpresa);
        $('#txtNomeGrupoEmpresa').val(dadoLinha.nome);
        $(".bg_load").show();
        $(".wrapper").show();
        $(".navbar.navbar-default.navbar-fixed-top").addClass('ocultarElemento');
        editarGrupoEmpresa(objEnvio);
    })
    $(document).on('click', '.excluirGrupo', function (evento) {
        var linha = $(this).parent().parent();
        var dadoLinha = dtbCadGrp.row($(linha)).data()
        var objEnvio = {};
        objEnvio.codigo = dadoLinha.idGrupoEmpresa;
        $('#modalGrupoEmpresa').modal('hide');
        var $menuTitulo = $(".navbar.navbar-default.navbar-fixed-top");
        $menuTitulo.addClass('ocultarElemento');
        $(".bg_load").show();
        $(".wrapper").show();
        excluirGrpEmpresas(objEnvio)
    })
});
function carregar() {
    cargaInicialGrupoEmpresa();
}
function criaNovoGrp() {
    limpaModalGrupoEmpresas();
    if (!$('#btnExlcuirOperacao').hasClass('ocultarElemento')) {
        $('#btnExlcuirOperacao').addClass('ocultarElemento');
    }
    $('#btnFinalizarOperacao').html('<i class="fa fa-check" aria-hidden="true"></i> Cadastrar')
    $('#modalGrupoEmpresa').modal({
        backdrop: 'static',
        keyboard: false
    });
}
function acessarGrpEmpresa(id, desc) {
    limpaModalGrupoEmpresas();
    $('#txtCodGrupo').val(id);
    $('#txtNomeGrupoEmpresa').val(desc);
    var $menuTitulo = $(".navbar.navbar-default.navbar-fixed-top");
    $menuTitulo.addClass('ocultarElemento');
    $(".bg_load").show();
    $(".wrapper").show();
    objEnvio = {};
    objEnvio.codigo = id;
    editarGrupoEmpresa(objEnvio);
}
function excluirGrpEmpresa(id) {
    $('#modalGrupoEmpresa').modal('hide');
    var $menuTitulo = $(".navbar.navbar-default.navbar-fixed-top");
    $menuTitulo.addClass('ocultarElemento');
    $(".bg_load").show();
    $(".wrapper").show();
    var objEnvio = {};
    objEnvio.codigo = id;
    excluirGrpEmpresas(objEnvio);
}
function validaDadosObrigarioGrpEmp() {
    if (!$('#txtNomeGrupoEmpresa').val())
        $('#txtNomeGrupoEmpresa').focus();
    //else if (!$('#drpMarc').val())
    //    $('#drpMarc').selectpicker('toggle');
    else {
        $('#modalGrupoEmpresa').modal('hide');
        var $menuTitulo = $(".navbar.navbar-default.navbar-fixed-top");
        $menuTitulo.addClass('ocultarElemento');
        $(".bg_load").show();
        $(".wrapper").show();
        criaObjetoSalvarGrupoEmpresas()
    }
}

function geraCardGrupoEmpresa(objGrupo) {
    var $painelCard = $('#principal .row:first');
    !$painelCard.find('.row.mbr-justify-content-center').length || $painelCard.find('.row.mbr-justify-content-center').length === 4 ?
        $painelCard.append('<div class="row mbr-justify-content-center"></div>') :
        '';
    var $cardGrupo = $painelCard.find('.row.mbr-justify-content-center').last();
    //var statusgrp = objGrupo.status ? 'Ativo' : 'Inativo';
    $cardGrupo.append('<div class="col-lg-3 mbr-col-md-10"><div class="wrap hover-accept">' +
        '<div class="ico-wrap"><span class="mbr-iconfont fa-users fa"></span></div><div class="vcenter">' +
        '<h2 class="mbr-fonts-style mbr-bold mbr-section-title3 display-5"><span><b>' + objGrupo.idGrupoEmpresa + ' - ' + objGrupo.nome + '</b></span></h2>' +
        '<div class="mbr-fonts-style text1 mbr-text display-6"><a href="javascript:acessarGrpEmpresa(' + objGrupo.idGrupoEmpresa + ',\'' + objGrupo.nome + '\');" style="margin:3px" class="btn btn-info" data-toggle="tooltip" title="Editar" ><i class="fa fa-pencil" aria-hidden="true"></i></a>'
        + '<a href="javascript:excluirGrpEmpresa(' + objGrupo.idGrupoEmpresa + ');" style="margin:3px;" class="btn btn-danger" data-toggle="tooltip" title="Excluir" ><i class="fa fa-trash" aria-hidden="true"></i></a></div>' +
        '</div></div></div>');

}
function carregarGridGrupoEmpresa(dados) {
    dtbCadGrp = $('#gruposCadastrados').DataTable({
        paging: false,
        searching: true,
        lengthChange: false,
        deferRender: true,
        "ordering": true,
        "order": [[0, "asc"]],
        responsive: true,
        drawCallback: function (settings) {
            $(function () {
                $('[data-toggle="tooltip"]').tooltip();
            });
        },
        "columnDefs": [
            {
                'className': 'dt-body-left descGrp',
                "targets": 1
            },
            {
                "orderable": false,
                'className': 'dt-body-left grupoOperacao',
                "targets": 2
            }
        ],
        "language": {
            "emptyTable": "Nenhum grupo encontrado",
            "zeroRecords": "Nenhum grupo corresponde ao filtro",
        },

        "info": false,
        destroy: true,
        data: dados,
        "columns": [
            { "data": "idGrupoEmpresa" },
            { "data": "nome" },
            //{ "data": "status" },
            { "data": "operacao" },

        ]
    });
}

function limpaModalGrupoEmpresas() {
    $('#tituloGrupoEmpresa').html('<i class="fa fa-plus-square"></i>&nbsp;Cadastrar <strong>Grupo de Empresas</strong>')
    $('#txtCodGrupo').val('0');
    //$('#txtStatusGrupo').val('Ativo');
    $('#txtNomeGrupoEmpresa').val('');
    $('#drpMarc').selectpicker('deselectAll');
}

function retornaOperacaoGrupoEmpresaGrid(status) {
    var operacao = '<a href="#" style="margin:3px" class="btn btn-info editarGrupo" data-toggle="tooltip" title="Editar" ><i class="fa fa-pencil" aria-hidden="true"></i></a>'
        + '<a href="#" style="margin:3px;" class="btn btn-danger excluirGrupo" data-toggle="tooltip" title="Excluir" ><i class="fa fa-trash" aria-hidden="true"></i></a>';
    return operacao;
}