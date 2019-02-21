var secoesAttrEditar = [];
$(document).ready(function () {
    $(window).on("load", carregar);
    $('#modalAtributo').on('hidden.bs.modal', function () {

        resetaModalAtributo();
    })

    $(document).on('click', '.painelCard', function (evento) {

        if (permissoesUsuarioLogado.indexOf('Cadastrar Atributos') === -1) {
            semAcesso();
        } else {
            sessionStorage.setItem('idAtributo', '0');
            $('.selectpicker').selectpicker('hide');
            $(".navbar.navbar-default.navbar-fixed-top").addClass('ocultarElemento');
            $(".bg_load").show();
            $(".wrapper").show();
            window.location = "../cadastro/atributo.cshtml";
        }
    });
    $('#drpSecCad').on('change', function (e) {
        var objParam = {};
        $('#divEspCad').addClass('ocultarElemento');
        $("#drpEspCad").html('');
        if ($('#drpSecCad').val()) {
            $('#drpSecCad').selectpicker('toggle');
            $('.selectpicker').selectpicker('hide');
            $(".navbar.navbar-default.navbar-fixed-top").addClass('ocultarElemento');
            $(".bg_load").show();
            $(".wrapper").show();
            objParam.secoes = $('#drpSecCad').val().join(',');
            carregarEspecieModal(objParam);
        } else {
            $(".selectpicker").selectpicker('refresh');
        }
    });
    $('#drpSegCad').on('change', function (e) {
        $('#divEspCad').addClass('ocultarElemento');
        $("#drpEspCad").html('');
        $('#divSecCad').addClass('ocultarElemento');
        $("#drpSecCad").html('');

        var objParam = {};
        if ($('#drpSegCad').val()) {
            if ($('#divSecCad').hasClass('ocultarElemento')) {
                $('#divSecCad').removeClass('ocultarElemento');
            }
            $('.selectpicker').selectpicker('hide');
            $(".navbar.navbar-default.navbar-fixed-top").addClass('ocultarElemento');
            $(".bg_load").show();
            $(".wrapper").show();
            objParam.segmentos = $('#drpSegCad').val().join(',').replace(/[^\d,]/g, '');
            console.log(objParam)
            carregarSecoesModal(objParam);
        } else {
            $(".selectpicker").selectpicker('refresh');
        }
    });


});
function carregar() {
    //window.location = "../home.cshtml";

    cargaInicialAtributos();
}
function pesquisarAtributo() {
    var objConsulta = {};
    if (!$('#drpSecCad').val() && !$('#drpTipoAttr').val()) {
        erroCadCompra("Não é permitido pesquisar sem selecionar ao menos um filtro de seção ou tipo de atributo!", "alertCadItemLista");
    } else {
        objConsulta.segmentos = $.map($('#drpSegCad option:selected'), function (elSeg) {
            var obj = {};
            var idSeg = Number($(elSeg).val().replace(/[^\d,]/g, ''));
            obj.idSegmento = idSeg;
            obj.secoes = $.map($('#drpSecCad option:selected'), function (elSec) {
                var token = $(elSec).data('tokens').split(';')[0];
                if (Number(token.split('-')[0]) === idSeg) {
                    var objSec = {};
                    var idSec = Number(token.split('-')[1]);
                    objSec.idSecao = idSec;
                    objSec.especies = $.map($('#drpEspCad option:selected'), function (elEsp) {
                        if (idSec === Number($(elEsp).val().split('-')[0])) {
                            var objEsp = {};
                            objEsp.idEspecie = Number($(elEsp).val().split('-')[1])
                            return objEsp;
                        }
                    });
                    return objSec;
                }
            });
            return obj;
        });
        objConsulta.classe = $('#drpAttrPara').val();
        objConsulta.tipos = $.map($('#drpTipoAttr option:selected'), function (el) {
            var obj = {};
            obj.tipo = Number($(el).val());
            return obj;
        });
        var $menuTitulo = $(".navbar.navbar-default.navbar-fixed-top");
        $('.selectpicker').selectpicker('hide');
        $(".bg_load").show();
        $(".wrapper").show();
        $menuTitulo.addClass('ocultarElemento');
        $('.wrap.hover-accept').parent().remove();
        var objEnvio = { parametros: objConsulta };
        console.log(objEnvio)
        retornaAtributosSintetico(objEnvio);
    }
}
function geraCardAtributo(objAtributo) {
    var $painelCard = $('#pnlCardAtributo');
    !$painelCard.find('.row.mbr-justify-content-center').length || $painelCard.find('.row.mbr-justify-content-center').length === 4 ?
        $painelCard.append('<div class="row mbr-justify-content-center"></div>') :
        '';
    var $cardGrupo = $painelCard.find('.row.mbr-justify-content-center').last();
    $cardGrupo.append('<div class="col-lg-3 mbr-col-md-10"><div class="wrap hover-accept">' +
        '<div class="ico-wrap"><span class="mbr-iconfont fa-cog-pencil fa fa-2x"></span></div><div class="vcenter">' +
        '<h2 class="mbr-fonts-style mbr-bold mbr-section-title3 display-5-5"><span><b>' + objAtributo.descricao + '</b></span></h2>' +
        '<div class="mbr-fonts-style text1 mbr-text display-6">' +
        '<b>Atributo de: </b>' + objAtributo.modelo +
        '</div>' +
        '<div class="mbr-fonts-style text1 mbr-text display-6">' +
        '<b>Status: </b>' + objAtributo.status +
        '</div>' +
        '<div class="mbr-fonts-style text1 mbr-text display-6">' +
        '<b>Tipo: </b>' + objAtributo.tipo +
        '</div>' +
        '<div class="mbr-fonts-style text1 mbr-text display-6">' +
        '<b>Ordem: </b>' + objAtributo.ordem +
        '</div>' +
        '<div class="mbr-fonts-style text1 mbr-text text-center display-6"><a href="javascript:acessarAtributo(' + objAtributo.idTipoAtributo + ',\'' + objAtributo.nome + '\');" style="margin:3px" class="btn btn-info" data-toggle="tooltip" title="Editar" ><i class="fa fa-pencil" aria-hidden="true"></i></a>'
        + '<a href="javascript:excluirAtributo(' + objAtributo.idTipoAtributo + ');" style="margin:3px;" class="btn btn-danger" data-toggle="tooltip" title="Excluir" ><i class="fa fa-trash" aria-hidden="true"></i></a></div>' +
        '</div></div></div>');

}
function acessarAtributo(idAttr) {

    if (permissoesUsuarioLogado.indexOf('Editar Atributos') === -1) {
        semAcesso();
    } else {
        sessionStorage.setItem('idAtributo', idAttr);
        $('.selectpicker').selectpicker('hide');
        $(".navbar.navbar-default.navbar-fixed-top").addClass('ocultarElemento');
        $(".bg_load").show();
        $(".wrapper").show();
        window.location = "../cadastro/atributo.cshtml";
    }
}
function limparCamposAttr() {
    $('.main-clear .selectpicker:not([multiple])').selectpicker('val', '');
    $('.main-clear .selectpicker[multiple]').each(function () {
        if (this.length) {
            $(this).selectpicker('deselectAll')
        }

    });
    $('.clear-filter').blur();
    $(".main-clear input[type=text]").val("");
    $('.selectpicker').selectpicker('refresh');

    $('.wrap.hover-accept').parent().remove();
}

