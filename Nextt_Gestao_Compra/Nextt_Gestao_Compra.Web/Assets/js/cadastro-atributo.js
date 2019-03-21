var previous = "1";
var idAtributoEditar = sessionStorage.getItem('idAtributo'), ordemComplete = [], ordemCompleteLista = [], ordemInsert = [], dtbCad;
var espSelecionadas = [];
var sourceSeg = "", segSelecionados = [], secoesAttrEditar = [], dadosItemEdt = null;
var specialKeys = new Array();
specialKeys.push(8); //Backspace
specialKeys.push(46); //Delete
specialKeys.push(96); //numpad 0
$.fn.dataTable.ext.search.push(
    function (settings, data, dataIndex) {
        var valor = parseInt($('#fTxtOrdemFiltro').val(), 10);
        var dado = parseFloat(data[4]) || 0; // use data for the age column
        var metrica = $('#ucComboMetrica').val(), retorno = true;
        if (metrica && !isNaN(valor)) {
            switch (metrica[0]) {
                case '0':
                    retorno = dado < valor;
                    break;
                case '1':
                    retorno = dado <= valor;
                    break;
                case '2':
                    retorno = dado == valor;
                    break;
                case '3':
                    console.log(dado);
                    console.log(valor);
                    console.log(metrica[0]);
                    retorno = dado >= valor;
                    break;
                case '4':
                    retorno = dado > valor;
                    break;
                default:
            }
        }
        return retorno;
    }
);

$(document).ready(function () {
    $(window).on("load", carregar);
    $(document).on('click', '.editarItem', function (evento) {
        if (permissoesUsuarioLogado.indexOf('Editar Item de Atributos') == -1 &&
            parseInt($("#txtIdAtributo").val()) > 0) {
            semAcesso();
        } else {

            $('#listaCadastrados_paginate').css('display', 'none');
            $(".bg_load").show();
            $(".wrapper").show();
            $('.selectpicker').selectpicker('hide');
            $(".navbar.navbar-default.navbar-fixed-top").addClass('ocultarElemento');
            var linha = $(this).parent().parent();
            var dadoLinha = dtbCad.row($(linha)).data()
            dadosItemEdt = dadoLinha;
            var objEnvio = {};
            objEnvio.idTipoAtributo = dadoLinha.idTipoAtributo.toString();
            secoesAttrEditar = dadoLinha.secoes.split(';');
            segSelecionados = dadoLinha.segmentos.split(';');
            espSelecionadas = dadoLinha.especies.split(';');
            console.log(dadosItemEdt)
            manipularItem('Atualizar Item');

        }
    })
    $(document).on('click', '.excluirItem', function (evento) {
        if (permissoesUsuarioLogado.indexOf('Excluir Item de Atributos') === -1 &&
            parseInt($("#txtIdAtributo").val()) > 0) {
            semAcesso();
        } else {
            var linha = $(this).parent().parent();
            $.confirm({
                icon: 'fa fa-warning',
                type: 'red',
                title: 'Excluir Item',
                content: 'Ao confirmar essa operação, o item será excluído da lista. Tem certeza que deseja prosseguir?',
                containerFluid: true,
                buttons: {
                    'Confirmar': {
                        text: 'Sim',
                        btnClass: 'btn-primary',
                        action: function () {
                            dtbCad.row($(linha)).remove().draw();

                        }
                    },
                    'Cancelar': {
                        text: 'Não',
                        btnClass: 'btn-danger',
                    }
                }
            });
        }
    })
    $('#fTxtBusca').keyup(function (e) {
        var keyCode = e.keyCode === 0 ? e.charCode : e.keyCode;
        var ret = keyCode >= 48 && keyCode <= 57 || keyCode >= 65 && keyCode <= 90 || keyCode >= 97 && keyCode <= 122 ||
            specialKeys.indexOf(e.keyCode) !== -1 && e.charCode !== e.keyCode;
        if (ret) {
            dtbCad.search(this.value).draw();
        }
        else if (keyCode === 13) {
            document.activeElement.blur();
            $("#fTxtBusca").blur();
        }

    });
    $('#cbStatusItem').on('change', function (e) {
        var selecionadoLista = $('#cbStatusItem').val();
        if (selecionadoLista) {
            dtbCad
                .columns(3)
                .search(selecionadoLista == 'true')
                .draw();
        } else {
            dtbCad
                .columns()
                .search('')
                .draw();
        }
    });
    $(document).on('switchChange.bootstrapSwitch', '.ckbGridSelecionar', function (event, state) {
        var linha = $(this).closest('tr');
        var idLinha = dtbCad.row($(linha)).data().idTipoAtributo;
        if (!$(linha).find('.ckbGridStatus:first').bootstrapSwitch('state') && state) {
            $(this).bootstrapSwitch('state', !state, true);
            $.confirm({
                icon: 'fa fa-warning',
                type: 'red',
                title: 'Item Inativo',
                content: 'Somente itens ativos podem ser selecionados. Antes de realizar esta operação, reative o item!',
                containerFluid: true,
                buttons: {
                    'Confirmar': {
                        text: 'OK',
                        btnClass: 'btn-primary'
                    }
                }
            });
        } else {
            if (!$("#ckbAttrMult").bootstrapSwitch('state') && state) {
                $(".ckbGridSelecionar").bootstrapSwitch('state', false, true);
                $(this).bootstrapSwitch('state', state, true);
                event.preventDefault();
            }

            dtbCad.data().map(obj => {
                if (!$("#ckbAttrMult").bootstrapSwitch('state') && state) {
                    obj.idTipoAtributo == idLinha ?
                        obj.preSelecionado = state :
                        obj.preSelecionado = false;
                } else {
                    if (obj.idTipoAtributo == idLinha) {
                        obj.preSelecionado = state;
                    }
                }
                return obj;
            })
        }


    })
    $(document).on('switchChange.bootstrapSwitch', '.ckbGridStatus', function (event, state) {
        event.preventDefault();
        var linha = $(this).closest('tr');
        var idLinha = dtbCad.row($(linha)).data().idTipoAtributo;
        if (permissoesUsuarioLogado.indexOf('Ativar/Desativar Item de Atributos') == -1 &&
            idLinha > 0 &&
            parseInt($("#txtIdAtributo").val()) > 0) {
            $(this).bootstrapSwitch('state', !state, true);
            semAcesso();
        } else {
            dtbCad.data().map(obj => {
                if (obj.idTipoAtributo == idLinha) {
                    obj.status = state;
                    if (!state && obj.preSelecionado) {
                        obj.preSelecionado = state;
                        $(linha).find('.ckbGridSelecionar:first').bootstrapSwitch('state', state, true);
                    }
                }
                return obj;
            })

        }
    })

    $('#ucComboMetrica').on('changed.bs.select', function (e, clickedIndex, newValue, oldValue) {
        var selected = $(e.currentTarget).val();
        if (selected) {
            $('#filtroOrdemPesquisa').css('display', 'block');
        } else {
            $('#fTxtOrdemFiltro').val('');
            $('#filtroOrdemPesquisa').css('display', 'none');
        }
        dtbCad.draw();
    });
    $("#txtNumOrdem").autocomplete({
        minLength: 0,
        delay: 50,
        messages: {
            noResults: '',
            results: function () { }
        },
        appendTo: "#combo",
        source: function (request, response) {
            var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex(request.term), "i");
            !request.term.length ? response(ordemComplete) :
                response($.grep(ordemComplete, function (item) {
                    if (matcher.test(item.value)) {
                        console.log(item.value)
                    }

                    return matcher.test(item.value);
                }));

        },
        focus: function (event, ui) { $('#txtNumOrdem').val(ui.item.value); },
        select: function (event, ui) {
            $('#txtNumOrdem').val(ui.item.ordem);
            //$('#link_origin_id').val(ui.item.ordem);
        }
    });

    $('input[name="radioBool"]').checkboxradio();
    $("#ckbTipoAttrModal").bootstrapSwitch();
    $("#ckbAttrObg").bootstrapSwitch();
    $("#ckbStatusAttr").bootstrapSwitch();
    $("#ckbAttrMult").bootstrapSwitch();
    $("#ckbAttrLista").bootstrapSwitch();
    $(document).on('change', 'input[name="radioBool"]', function (e) {
        $('.phradio input[name="radioBool"][value="' + this.value + '"]').prop('checked', true).checkboxradio("refresh");
        $(this).checkboxradio("refresh");
        console.log($("input[name='radioBool']:checked").val())
    })
    $('#ckbAttrObg').on('switchChange.bootstrapSwitch', function (event, state) {
        if (state && parseInt($('#drpTipoAttrCad').val()) > 0 && parseInt($('#drpTipoAttrCad').val()) < 4) {
            var precisao = $('#txtNumValMin').data('settings').precision;
            var valAtual = precisao ? $('#txtNumValMin').maskMoney('unmasked')[0] : parseInt($('#txtNumValMin').val().replace(/\./g, ''));
            if (valAtual === 0) {
                $('#txtNumValMin').val('1').maskMoney('mask');
                $('#txtNumValMin').attr("data-initial-val", 1);
                atualizaValMin(document.getElementById('txtNumValMin'))
            }
        }
    })
    $('#ckbAttrMult').on('switchChange.bootstrapSwitch', function (event, state) {
        if (!state && dtbCad.data().filter((x) => { return x.preSelecionado; }).length > 1) {
            dtbCad
                .data()
                .map(obj => {
                    obj.preSelecionado = false;
                    return obj;
                })
                .rows()
                .invalidate()
                .draw();;

        }
    })
    $('#ckbAttrLista').on('switchChange.bootstrapSwitch', function (event, state) {
        if (!state) {
            if (dtbCad.data().count() > 0) {
                $.confirm({
                    icon: 'fa fa-warning',
                    type: 'red',
                    title: 'Atenção!',
                    content: 'Ao confirmar essa operação, os itens salvos na lista serão perdidos, sendo necessário reiniciar o processo de edição para recupera-los. Tem certeza que deseja prosseguir?',
                    containerFluid: true,
                    buttons: {
                        'Confirmar': {
                            text: 'Sim',
                            btnClass: 'btn-primary',
                            action: function () {
                                geraCargaGridLista([])

                                if (!$('#divMulti').hasClass('ocultarElemento')) {
                                    $('#divMulti').addClass('ocultarElemento')
                                }
                                if (!$('#divLista').hasClass('ocultarElemento')) {
                                    $('#divLista').addClass('ocultarElemento')
                                }
                                if (!$('#divListaDef').hasClass('ocultarElemento')) {
                                    $('#divListaDef').addClass('ocultarElemento')
                                }
                                $("#drpTipoAttrCad").trigger('change');

                            }
                        },
                        'Cancelar': {
                            text: 'Não',
                            btnClass: 'btn-danger',
                            action: function () {
                                if ($("#drpTipoAttrCad").val() !== previous) {
                                    $("#drpTipoAttrCad").selectpicker('val',previous);
                                }
                                $('#ckbAttrLista').bootstrapSwitch('state', !state, true);
                            }
                        }
                    }
                });

            } else {
                if (!$('#divMulti').hasClass('ocultarElemento')) {
                    $('#divMulti').addClass('ocultarElemento')
                }
                if (!$('#divLista').hasClass('ocultarElemento')) {
                    $('#divLista').addClass('ocultarElemento')
                }
                if (!$('#divListaDef').hasClass('ocultarElemento')) {
                    $('#divListaDef').addClass('ocultarElemento')
                }
                $("#drpTipoAttrCad").trigger('change');
            }
        } else {
            if (parseInt($('#drpTipoAttrCad').val()) == 5) {
                $('#ckbAttrLista').bootstrapSwitch('state', !state,true);
                $.confirm({
                    icon: 'fa fa-warning',
                    type: 'red',
                    title: 'Operação Inválida!',
                    content: 'Tipo boleano não podem ser cadastrados como lista. Antes de realizar esta operação, altere o tipo!',
                    containerFluid: true,
                    buttons: {
                        'Confirmar': {
                            text: 'OK',
                            btnClass: 'btn-primary'
                        }
                    }
                });
            } else {
                $('.not-lista').addClass('ocultarElemento')
                $('#divMulti').removeClass('ocultarElemento')
                $('#divLista').removeClass('ocultarElemento')
                $(".filtrosItemLista").removeClass('ocultarElemento');
            }
            
        }
    })
    $('#ckbTipoAttrModal').on('switchChange.bootstrapSwitch', function (event, state) {
        !state ?
            $("#divSegSecEsp").removeClass('ocultarElemento').addClass('ocultarElemento') :
            $("#divSegSecEsp").removeClass('ocultarElemento');

    });
    $(document).on('keydown', '.txtInteiro', function (e) {
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
            (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
            (e.keyCode === 86 && (e.ctrlKey === true || e.metaKey === true)) ||
            (e.keyCode >= 35 && e.keyCode <= 40)) {
            return;
        }
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    })
    $(document).on('keyup', '.txtInteiro', function (e) {
        var element = event.target;
        var validString = element.value.replace(/[^0-9]/g, '');
        if (validString !== element.value) element.value = validString;
        if ($(element).hasClass('filtroOrdem')) dtbCad.draw();
    });
    $(document).on('paste', '.txtInteiro', function (e) {
        var paste = e.originalEvent.clipboardData.getData('Text');

        if (isNumber(paste) && Math.floor(paste) == parseInt(paste)) {
            return;
        }
        e.preventDefault();
    })
    $('#drpTipoAttrCad').on('changed.bs.select', function (e, clickedIndex, newValue, oldValue) {
        if ($("#ckbAttrLista").bootstrapSwitch('state')) {
            if (dtbCad.data().count() > 0) {
                if (parseInt($('#drpTipoAttrCad').val()) == 5) {
                    $('#ckbAttrLista').bootstrapSwitch('state', false);
                } else {
                    $.confirm({
                        icon: 'fa fa-warning',
                        type: 'red',
                        title: 'Atenção!',
                        content: 'Ao confirmar essa operação, os itens salvos na lista serão perdidos, sendo necessário reiniciar o processo de edição para recupera-los. Tem certeza que deseja prosseguir?',
                        containerFluid: true,
                        buttons: {
                            'Confirmar': {
                                text: 'Sim',
                                btnClass: 'btn-primary',
                                action: function () {
                                    previous = $("#drpTipoAttrCad").selectpicker('val');
                                    geraCargaGridLista([])
                                }
                            },
                            'Cancelar': {
                                text: 'Não',
                                btnClass: 'btn-danger',
                                action: function () {
                                    $("#drpTipoAttrCad").selectpicker('val', previous);
                                }
                            }
                        }
                    });
                }
                

            }
        } else {
            if ($('#txtNumValDef').hasClass('attrData')) {
                $('#txtNumValDef').data('daterangepicker').remove();

            }
            previous = $("#drpTipoAttrCad").selectpicker('val');

            $('.not-lista').removeClass('ocultarElemento')

            if ($(".filtrosItemLista").hasClass('ocultarElemento')) {
                $(".filtrosItemLista").removeClass('ocultarElemento');
            }
            $('#txtNumValDef').attr("style", "text-align:center !important")
            if (!$('#divValBool').hasClass('ocultarElemento')) {
                $('#divValBool').addClass('ocultarElemento')
            }


            if (parseInt($('#drpTipoAttrCad').val()) > 0 && parseInt($('#drpTipoAttrCad').val()) < 4) {
                $('#divNumerico').removeClass('ocultarElemento')
                $('#lblValMax').html('Valor Máximo');
                $('#lblValMin').html('Valor Mínimo');
                $('#divValDef').removeClass().addClass('col-md-2 not-lista');
                $('#txtNumValDef').removeAttr('maxlength').removeAttr('minlength')
                var valDef = 0;
                var valMin = 0;
                var valMax = 0;
                if (parseInt($('#drpTipoAttrCad').val()) == 1) {
                    $('#txtNumPrecisao').val('0')
                    $('#divDecimal').removeClass('ocultarElemento')
                    $('#txtNumValMax').removeClass().addClass('form-control attrNum');
                    $('#txtNumValDef').removeClass().addClass('form-control attrNum');
                    $('#txtNumValMin').removeClass().addClass('form-control attrNum');
                    valDef = 0;
                    valMin = 0;
                    valMax = 1000000;
                }
                if (parseInt($('#drpTipoAttrCad').val()) == 3) {
                    $('#txtNumPrecisao').val('2')
                    $('#divDecimal').removeClass('ocultarElemento')
                    $('#txtNumValMax').removeClass().addClass('form-control percent');
                    $('#txtNumValDef').removeClass().addClass('form-control percent');
                    $('#txtNumValMin').removeClass().addClass('form-control percent');
                    valDef = 100.00;
                    valMin = 0.00;
                    valMax = 100.00;
                }
                if (parseInt($('#drpTipoAttrCad').val()) == 2) {
                    $('#divDecimal').addClass('ocultarElemento')
                    $('#txtNumValMax').removeClass().addClass('form-control money');
                    $('#txtNumValDef').removeClass().addClass('form-control money');
                    $('#txtNumValMin').removeClass().addClass('form-control money');

                    valDef = 0.00;
                    valMin = 0.00;
                    valMax = 1000000.00;
                }
                $('.percent').maskMoney('destroy');
                $('.attrNum').maskMoney('destroy');
                $('.money').maskMoney('destroy');

                $('#txtNumValMax').val(valMax.toString().replace('.', ',')).data('minVal', valMin).data('initialVal', valMax);
                $('#txtNumValDef').val(valDef.toString().replace('.', ',')).data('minVal', valMin).data('maxVal', valMax).data('initialVal', valDef);
                $('#txtNumValMin').val(valMin.toString().replace('.', ',')).data('maxVal', valMax).data('initialVal', valMin);
                $('.attrNum').maskMoney({ thousands: '.', allowZero: true, reverse: false, decimal: ',', precision: 0, allowNegative: true });
                $('.percent').maskMoney({ suffix: '%', decimal: ',', reverse: false, allowZero: true });
                $('.money').maskMoney({ prefix: 'R$ ', thousands: '.', allowZero: true, reverse: false, decimal: ',' });
                $('.percent').maskMoney('mask');
                $('.attrNum').maskMoney('mask');
                $('.money').maskMoney('mask');
                console.log($('.money').data())
                console.log($('.attrNum').data())
                console.log($('.percent').data())
            }
            else if (parseInt($('#drpTipoAttrCad').val()) == 0) {
                $('#divNumerico').removeClass('ocultarElemento')
                $('#divValDef').removeClass().addClass('col-md-4 not-lista');
                $('#lblValMax').html('Max. Caractéres');
                $('#lblValMin').html('Min. Caractéres');
                $('#divDecimal').addClass('ocultarElemento')
                var valMin = 0;
                var valMax = 20;
                $('#txtNumValMax').removeClass().addClass('form-control attrNum');
                $('#txtNumValMin').removeClass().addClass('form-control attrNum');
                $('#txtNumValDef').removeAttr("style").val('').attr('maxlength', '20').attr('minlength', '0').maskMoney('destroy');
                $('#txtNumValDef').removeClass().addClass('form-control attrTexto');
                $('#txtNumValMax').val(valMax.toString().replace('.', ',')).maskMoney('destroy');
                $('#txtNumValMin').val(valMin.toString().replace('.', ',')).maskMoney('destroy');
                $('.attrNum').maskMoney({ thousands: '.', allowZero: true, reverse: false, decimal: ',', precision: 0, allowNegative: true });

            }
            else if (parseInt($('#drpTipoAttrCad').val()) == 4) {
                $('#divNumerico').removeClass('ocultarElemento')
                $('#lblValMax').html('Max. Dias');
                $('#lblValMin').html('Min. Dias');
                $('#divDecimal').addClass('ocultarElemento')
                var valMin = 0;
                var valMax = 30;
                $('#txtNumValMax').removeClass().addClass('form-control attrNum');
                $('#txtNumValMin').removeClass().addClass('form-control attrNum');
                $('#divValDef').removeClass().addClass('col-md-3 not-lista');
                $('#txtNumValDef').removeAttr('maxlength').removeAttr('minlength')
                $('#txtNumValDef').data('minVal', valMin).data('maxVal', valMax).data('initialVal', valMin).maskMoney('destroy');
                $('#txtNumValDef').removeClass().addClass('form-control attrData');
                $('#txtNumValMax').val(valMax.toString().replace('.', ',')).maskMoney('destroy');
                $('#txtNumValMin').val(valMin.toString().replace('.', ',')).maskMoney('destroy');
                $('.attrNum').maskMoney({ thousands: '.', allowZero: true, reverse: false, decimal: ',', precision: 0, allowNegative: true });
                geraComponenteCalendarioAttrCad();
            }
            else if (parseInt($('#drpTipoAttrCad').val()) == 5) {
                $('.not-lista').addClass('ocultarElemento');
                $('#divValBool').removeClass('ocultarElemento');

            }

            $('.attrNum').maskMoney('mask');
        }

    });
    $(document).on('focus', '.attrData', function (evento) {
        $(this).select()
    });
    $(document).on('blur', '.attrData', function (e) {
        var valor = this.value;

        if (!moment(valor, "DD/MM/YYYY", true).isValid()) {
            this.value = '';
        }
    });
    $('#drpSecCad').on('change', function (e) {
        var objParam = {};
        $('#divEspCad').addClass('ocultarElemento');
        $("#drpEspCad").html('');
        if ($('#drpSecCad').val()) {
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

            objParam.segmentos = $('#drpSegCad').val().join(',').replace(/[^\d,]/g, '');
            console.log(objParam)
            carregarSecoesModal(objParam);
        } else {
            $(".selectpicker").selectpicker('refresh');
        }
    });
});
function carregar() {
    if (typeof idAtributoEditar !== "undefined") {
        cargaInicialAtributos();
    } else {
        $(".bg_load").fadeOut();
        $(".wrapper").fadeOut();
        modal({
            messageText: "Não é permitido acessar essa função sem seguir o fluxo do sistema!",
            type: "alert",
            headerText: "Acesso negado!",
            alertType: "warning"
        }).done(function (e) {
            voltarHome();
        });
    }

}
function alteraPrecisao(ele) {
    var precisao = $(ele).val();
    var precisaoAtual = $('#txtNumValMin').data('settings').precision;

    var valDef = precisaoAtual ? $('#txtNumValDef').maskMoney('unmasked')[0] : parseInt($('#txtNumValDef').val().replace(/\./g, ''));
    var valMin = precisaoAtual ? $('#txtNumValMin').maskMoney('unmasked')[0] : parseInt($('#txtNumValMin').val().replace(/\./g, ''));
    var valMax = precisaoAtual ? $('#txtNumValMax').maskMoney('unmasked')[0] : parseInt($('#txtNumValMax').val().replace(/\./g, ''));

    $('#txtNumValDef').val(valDef.toFixed(parseInt(precisao)).replace('.', ','));
    $('#txtNumValMin').val(valMin.toFixed(parseInt(precisao)).replace('.', ','));
    $('#txtNumValMax').val(valMax.toFixed(parseInt(precisao)).replace('.', ','));

    $('#txtNumValMax').maskMoney('destroy');
    $('#txtNumValDef').maskMoney('destroy');
    $('#txtNumValMin').maskMoney('destroy');
    $('.attrNum').maskMoney({ thousands: '.', allowZero: true, reverse: false, decimal: ',', precision: parseInt(precisao), allowNegative: true });
    $('.percent').maskMoney({ suffix: '%', decimal: ',', allowZero: true, reverse: false, precision: parseInt(precisao) });
    $('.money').maskMoney({ prefix: 'R$ ', thousands: '.', allowZero: true, reverse: false, decimal: ',' });
    $('.percent').maskMoney('mask');
    $('.attrNum').maskMoney('mask');
    $('.money').maskMoney('mask');


}
function geraComponenteCalendarioAttrCad() {
    $('.attrData').each(function () {
        var valMax = parseInt($(this).attr("data-max-val")) === parseInt($(this).attr("data-min-val")) ?
            null :
            moment().add(parseInt($(this).attr("data-max-val")), 'days');

        var valMin = parseInt($(this).attr("data-max-val")) === parseInt($(this).attr("data-min-val")) ?
            null :
            moment().add(parseInt($(this).attr("data-min-val")), 'days');

        var dataSt = $(this).attr("data-initial-val").indexOf('/') > -1 ? $(this).attr("data-initial-val") : moment().add(parseInt($(this).attr("data-initial-val")), 'days').format('DD/MM/YYYY');
        $(this).val(dataSt)
        var configCal = {
            locale: configuracaoCalendarios,
            singleDatePicker: true,
            autoUpdateInput: false,
            showDropdowns: true,
            startDate: dataSt,
            maxDate: valMax,
            minDate: valMin
        };
        $(this).daterangepicker(configCal).on('apply.daterangepicker', function (ev, picker) {
            $(this).val(picker.startDate.format('DD/MM/YYYY'));
        });
    });
}
function removeItemLista() {
    if ($('#drpListsCad').val()) {
        $('#drpListsCad option:checked').remove();
        $('#txtValLista').val('');
        $('#txtListaOrdem').val(0);
        $('#btnAddLista').removeClass('ocultarElemento');
        $('#btnUpdateLista').addClass('ocultarElemento');
        $('#btnExcLista').addClass('ocultarElemento');
        $('#divBtnLista').addClass('ocultarElemento');
        ordenaOpcaoLista();
        $(".selectpicker").selectpicker('refresh');
        $('#drpListsCad').selectpicker('val', '')

    }
}
function atualizarItemLista() {
    var $optUpdate = $('#drpListsCad option:checked');
    $optUpdate.text($('#txtValLista').val().trim());
    if ($optUpdate.attr('data-tokens').split(';').length == 1) {
        $optUpdate.val($('#txtValLista').val().trim());
        $optUpdate.attr('data-tokens', $('#txtValLista').val().trim());
    } else {
        var token = $optUpdate.attr('data-tokens').split(';')[0] + ';' + $('#txtValLista').val().trim();
        $optUpdate.attr('data-tokens', token)
    }
    $optUpdate.attr('data-ordenacao', $('#txtListaOrdem').val())
    $('#txtValLista').val('');
    $('#txtListaOrdem').val('0');
    $('#divBtnLista').addClass('ocultarElemento');
    ordenaOpcaoLista();
    $(".selectpicker").selectpicker('refresh');
    $('#drpListsCad').selectpicker('val', '')
}
function free(array, start) {
    array.every(function (a) {
        if (start === a) {
            start = a + 1;
            return true;
        }
    });
    return start;
}
function atualizaOrdem(objNew, isNovo) {
    console.log(objNew)
    var lastVal = objNew.ordem
    dtbCad.data().map(obj => {
        if (!isNovo) {
            if (!$("#ckbAttrMult").bootstrapSwitch('state') && objNew.preSelecionado && obj.idTipoAtributo != objNew.idTipoAtributo)
                obj.preSelecionado = false;

            if (obj.idTipoAtributo == objNew.idTipoAtributo)
                for (var prop in objNew)
                    obj[prop] = objNew[prop];

            if (obj.ordem == lastVal && obj.idTipoAtributo != objNew.idTipoAtributo) {
                obj.ordem++;
                lastVal = obj.ordem;
            }
        } else
            if (obj.ordem == lastVal) {
                obj.ordem++;
                lastVal = obj.ordem;
            }

        return obj;
    });
    var novoSource = dtbCad.data().toArray();
    if (isNovo) {
        if (novoSource.length && novoSource.hasMin('idTipoAtributo').idTipoAtributo <= objNew.idTipoAtributo) {
            objNew.idTipoAtributo = novoSource.hasMin('idTipoAtributo').idTipoAtributo - 1;
        }
        novoSource.push(objNew)
    }
    geraCargaGridLista(novoSource);
}
function desabilitaFuncoes() {
    if (permissoesUsuarioLogado.indexOf('Alterar Tipo de Atributos') == -1) {
        $("#drpTipoAttrCad").prop('disabled', true);
    } if (permissoesUsuarioLogado.indexOf('Ativar/Desativar Atributos') == -1) {
        $("#ckbStatusAttr").bootstrapSwitch('disabled', true);
    } if (permissoesUsuarioLogado.indexOf('Editar Descrição de Atributos') == -1) {
        $("#txtDescAttr").prop('disabled', true);
    } if (permissoesUsuarioLogado.indexOf('Alterar Ordem de Atributos') == -1) {
        $("#txtNumOrdem").prop('disabled', true);
    }

}
function addNovoItem() {
    if (permissoesUsuarioLogado.indexOf('Cadastrar Item de Atributos') === -1) {
        semAcesso();
    } else {
        var ordem = free(ordemInsert, 0);

        var retorno = {};

        retorno.idTipoAtributo = -1;
        retorno.descricao = '';
        retorno.preSelecionado = false;
        retorno.status = true;
        retorno.ordem = ordem;
        dadosItemEdt = retorno;
        manipularItem('Cadastrar Item');
    }
}
function ordenaOpcaoLista() {
    var sourceListaOpt = '<option data-ordenacao="-1" value="">Nenhum</option>', contemEmpt = false;
    var options = $('#drpListsCadDef option');
    var arr = options.map(function (_, o) {
        if ($(o).attr('data-ordenacao') === '-1') {
            contemEmpt = true;
        }
        return $(o).attr('data-ordenacao')
    }).get();
    arr.sort(function (o1, o2) {
        return parseInt(o1) > parseInt(o2) ? 1 : parseInt(o1) < parseInt(o2) ? -1 : 0;
    });
    var ordenado = [];
    for (var i = 0; i < arr.length; i++) {
        options.map(function (_, o) {
            if ($(o).attr('data-ordenacao') == arr[i]) {
                ordenado.push(o)
            }
            return $(o).attr('data-ordenacao') == arr[i]
        }).get();
    }

    if (!contemEmpt) {
        $('#drpListsCadDef').html(sourceListaOpt);
    }

    for (var j = 0; j < ordenado.length; j++) $('#drpListsCadDef').append(ordenado[j]);

    if ($('#ckbAttrMult').bootstrapSwitch('state')) $('#drpListsCadDef option:first').remove();
    if ($('#divListaDef').hasClass('ocultarElemento')) $('#divListaDef').removeClass('ocultarElemento');

}
function atualizaValMax(el) {
    var $elTxtPadrao = $('#txtNumValDef');
    var $elTxtMin = $('#txtNumValMin');
    var precisao = $(el).data('settings').precision;
    var valAtual = precisao ? $(el).maskMoney('unmasked')[0] : parseInt($(el).val().replace(/\./g, ''));
    $elTxtPadrao.data('maxVal', valAtual);
    $elTxtMin.data('maxVal', valAtual);
    if (Number($elTxtMin.data('initialVal')) > valAtual) {
        $elTxtMin.data('initialVal', valAtual);
        $elTxtPadrao.data('minVal', valAtual);
    }
    if (Number($elTxtPadrao.data('initialVal')) > valAtual) {
        $elTxtPadrao.data('initialVal', valAtual);
    }
    validaValorCadAtributo(document.getElementById("txtNumValMin"));
    if ($elTxtPadrao.hasClass('attrData')) {
        $elTxtPadrao.data('daterangepicker').maxDate = moment().add(parseInt($elTxtPadrao.data("maxVal")), 'days');
        $elTxtPadrao.data('daterangepicker').minDate = moment().add(parseInt($elTxtPadrao.data("minVal")), 'days');
    }
    else
        validaValorCadAtributo(document.getElementById("txtNumValDef"));
}
function atualizaValMin(el) {
    var $elTxtPadrao = $('#txtNumValDef');
    var $elTxtMax = $('#txtNumValMax');
    var precisao = $(el).data('settings').precision;
    var valAtual = precisao ? $(el).maskMoney('unmasked')[0] : parseInt($(el).val().replace(/\./g, ''));

    $elTxtPadrao.data('minVal', valAtual);
    $elTxtMax.data('minVal', valAtual);
    if (Number($elTxtMax.data('initialVal')) < valAtual) {
        $elTxtMax.data('initialVal', valAtual);
        $elTxtPadrao.data('maxVal', valAtual);
    }
    if (Number($elTxtPadrao.data('initialVal')) < valAtual) {
        $elTxtPadrao.data('initialVal', valAtual);
    }
    validaValorCadAtributo(document.getElementById("txtNumValMax"));
    if ($elTxtPadrao.hasClass('attrData')) {
        $elTxtPadrao.data('daterangepicker').maxDate = moment().add(parseInt($elTxtPadrao.data("maxVal")), 'days');
        $elTxtPadrao.data('daterangepicker').minDate = moment().add(parseInt($elTxtPadrao.data("minVal")), 'days');
    }
    else
        validaValorCadAtributo(document.getElementById("txtNumValDef"));
}
function validaValorCadAtributo(e) {
    console.log(e)
    if (!$(e).hasClass('attrTexto')) {
        var limMax = Number($(e).data("maxVal"));
        var limMin = Number($(e).data("minVal"));
        var valIni = Number($(e).data("initialVal"));

        var precisao = $(e).data('settings').precision
        if (limMax !== limMin) {
            var valAtual = precisao ? $(e).maskMoney('unmasked')[0] : parseInt($(e).val().replace(/\./g, ''));
            var valAtu = valAtual <= limMax && valAtual >= limMin ?
                valAtual.toString() :
                valIni.toString();
            console.log(valIni)
            console.log(valAtual)
            if (valIni !== valAtual) {
                $(e).data("initialVal", valAtu);
                $(e).val(valAtu.replace('.', ',')).maskMoney('mask');
            }
        }
    }
}
function configuraCombosOpcoesAttr(multiplo) {
    $('#drpListsCadDef').removeAttr('multiple')
    if (multiplo) {
        $('#drpListsCadDef').attr('multiple', 'multiple');
    }
    var dtsize = $('#drpListsCadDef').find('option').length < 7 ? "auto" : 7;
    $('#drpListsCadDef').selectpicker('destroy').selectpicker({
        liveSearch: $('#drpListsCadDef').find('option').length > 7,
        size: dtsize,
        actionsBox: $('#drpListsCadDef').find('option').length > 1,
    });
    $('#drpListsCadDef').addClass('selectpicker');
    $(".selectpicker").selectpicker('refresh');
}
function carregaModalEditarLista(objLista) {
    $('.not-lista').addClass('ocultarElemento')
    $("#ckbAttrLista").bootstrapSwitch('state', objLista.lista, false);
    $("#ckbAttrMult").bootstrapSwitch('state', objLista.multiplo, false);

    geraCargaGridLista(objLista.itensCadastrados);
    $(".bg_load").fadeOut();
    $(".wrapper").fadeOut();
    var $menuTitulo = $(".navbar.navbar-default.navbar-fixed-top");
    $menuTitulo.removeClass('ocultarElemento');
    $("div.controls.ocultarElemento").removeClass('ocultarElemento');
}
function carregaModalEditarTexto(objLista) {
    var max = objLista.maximo > 0 ? objLista.maximo.toString() : '';
    var min = objLista.minimo > 0 ? objLista.minimo.toString() : '';
    var def = objLista.valorDef ? objLista.valorDef : '';
    $('#txtNumValDef').val(def).attr('maxlength', max).attr('minlength', min);
    $('#txtNumValMax').val(max.replace('.', ',')).maskMoney('mask');
    $('#txtNumValMin').val(min.replace('.', ',')).maskMoney('mask');
    $('#modalBodyAttr .selectpicker').selectpicker('show');
    $(".bg_load").fadeOut();
    $(".wrapper").fadeOut();
    var $menuTitulo = $(".navbar.navbar-default.navbar-fixed-top");
    $menuTitulo.removeClass('ocultarElemento');
    $("div.controls.ocultarElemento").removeClass('ocultarElemento');
}
function carregaModalEditarBool(objLista) {
    if (objLista.valorDef !== null) {
        if (objLista.valorDef == '0') {
            $('#rdBtnNao').attr('checked', true).trigger('click');
        } else {
            $('#rdBtnSim').attr('checked', true).trigger('click')
        }

    } else {
        $('#rdBtnNulo').attr('checked', true).trigger('click')
    }
    $(".bg_load").fadeOut();
    $(".wrapper").fadeOut();
    var $menuTitulo = $(".navbar.navbar-default.navbar-fixed-top");
    $menuTitulo.removeClass('ocultarElemento');
    $("div.controls.ocultarElemento").removeClass('ocultarElemento');

}
function carregaModalEditarData(objLista) {
    var max = objLista.minimo !== objLista.maximo ? objLista.maximo.toString() : 0;
    var min = objLista.minimo !== objLista.maximo ? objLista.minimo.toString() : 0;
    var def = objLista.valorDef ? objLista.valorDef : 0;
    var valMax = max === min ?
        null :
        moment().add(max, 'days'); 

    var valMin = max === min ?
        null :
        moment().add(min, 'days');

    $('#txtNumValDef').data('minVal', min).data('maxVal', max).data('initialVal', def);

    $('#txtNumValMax').val(max.toString()).maskMoney('mask');
    $('#txtNumValMin').val(min.toString()).maskMoney('mask');
    var dataSt = def.indexOf('/') > -1 ? def : moment().add(parseInt(def), 'days').format('DD/MM/YYYY');
    $('#txtNumValDef').val(dataSt);
    $('#txtNumValDef').data('daterangepicker').maxDate = moment().add(parseInt($('#txtNumValDef').data("maxVal")), 'days');
    $('#txtNumValDef').data('daterangepicker').minDate = moment().add(parseInt($('#txtNumValDef').data("minVal")), 'days');
    $('#txtNumValDef').data('daterangepicker').setStartDate(dataSt);
    $('#txtNumValDef').data('daterangepicker').setEndDate(dataSt);
    $(".bg_load").fadeOut();
    $(".wrapper").fadeOut();
    var $menuTitulo = $(".navbar.navbar-default.navbar-fixed-top");
    $menuTitulo.removeClass('ocultarElemento');
    $("div.controls.ocultarElemento").removeClass('ocultarElemento');
}
function carregaModalEditarNumerico(objLista) {
    $('#txtNumPrecisao').val(objLista.precisao.toString()).trigger('change');
    var valDef = objLista.valorDef && objLista.valorDef.length ? objLista.valorDef.replace('.', ',') :
        objLista.precisao ?
            $('#txtNumValMin').maskMoney('unmasked')[0] :
            parseInt($('#txtNumValMin').val().replace(/\./g, ''));
    if (objLista.minimo >= 0 && objLista.minimo != objLista.maximo) {
        $('#txtNumValMax').val(objLista.maximo.toString().replace('.', ','))
            .data('minVal', objLista.minimo)
            .data('initialVal', objLista.maximo)
            .maskMoney('mask');
        $('#txtNumValDef')
            .data('minVal', objLista.minimo)
            .data('maxVal', objLista.maximo)

        $('#txtNumValMin').val(objLista.minimo.toString().replace('.', ','))
            .data('maxVal', objLista.maximo)
            .data('initialVal', objLista.minimo)
            .maskMoney('mask');

    }
    $('#txtNumValDef').val(valDef.toString().replace('.', ',')).data('initialVal', valDef)
        .maskMoney('mask');
    $(".bg_load").fadeOut();
    $(".wrapper").fadeOut();
    var $menuTitulo = $(".navbar.navbar-default.navbar-fixed-top");
    $menuTitulo.removeClass('ocultarElemento');
    $("div.controls.ocultarElemento").removeClass('ocultarElemento');
}
function geraCargaGridLista(dados) {
    var sourceRetorno = [];
    ordemInsert = [];
    ordemCompleteLista = [];
    $.each(dados, function (index, value) {
        ordemCompleteLista.push({
            value: value.ordem,
            label: value.ordem + ' (' + value.descricao + ')'
        });
        ordemInsert.push(value.ordem);
        var retorno = {};
        var statusGrp = value.status ? 'Ativo' : 'Inativo';
        retorno.idTipoAtributo = parseInt(value.idTipoAtributo);
        retorno.descricao = value.descricao;
        retorno.preSelecionado = typeof value.valorDef != 'undefined' ?
            value.valorDef == '1' :
            value.preSelecionado;
        retorno.status = value.status;
        retorno.ordem = value.ordem;
        retorno.operacao = retornaOperacaoGrid(statusGrp);
        retorno.segmentos = typeof value.segmentosSelecionados != 'undefined' ?
            value.segmentosSelecionados.join(';') :
            value.segmentos;
        retorno.secoes = typeof value.secoesSelecionadas != 'undefined' ?
            value.secoesSelecionadas.join(';') :
            value.secoes;
        retorno.especies = typeof value.especiesSelecionadas != 'undefined' ?
            value.especiesSelecionadas.join(';') :
            value.especies;
        sourceRetorno.push(retorno);
    });
    carregarCadFilial(sourceRetorno)
}

function retornaOperacaoGrid(status) {
    var operacao = '<a href="#" style="margin:3px" class="btn btn-info editarItem" data-toggle="tooltip" title="Editar" ><i class="fa fa-pencil" aria-hidden="true"></i></a>'
        + '<a href="#" style="margin:3px;" class="btn btn-danger excluirItem" data-toggle="tooltip" title="Excluir" ><i class="fa fa-trash" aria-hidden="true"></i></a>';

    return operacao;
}
function carregarCadFilial(dados) {
    dtbCad = $('#listaCadastrados').DataTable({
        paging: true, /* define se a tabela deve usar paginação */
        searching: true, /* define se deve usar o campo Buscar dentro da tabela */
        lengthChange: false,
        pageLength: 8,
        deferRender: true,
        "ordering": true,
        "order": [[4, "asc"]],
        responsive: true,
        "columnDefs": [
            {
                "targets": 4,
                'className': 'dt-body-center',
                "orderable": true,
                "render": function (data, type, row, meta) {
                    if (type === 'display') {

                        return data.toLocaleString('pt-BR')

                    }
                    else return data;
                }
            },
            {
                "targets": 2,
                'className': 'dt-body-center',
                "orderable": true,
                "type": "boolean",
                "render": function (data, type, row, meta) {
                    if (type === 'display') {
                        if (data) {
                            return '<input type="checkbox" checked class="ckbGridSelecionar ckbGrid" data-on-color="success" data-off-color="danger" data-on-text="Sim" data-off-text="Não">';
                        } else {
                            return '<input type="checkbox" class="ckbGridSelecionar ckbGrid" data-on-color="success" data-off-color="danger" data-on-text="Sim" data-off-text="Não">';
                        }
                    }
                    else return data;
                }
            },
            {
                "targets": 3,
                "type": "boolean",
                'className': 'dt-body-center',
                "orderable": true,
                "render": function (data, type, row, meta) {
                    if (type === 'display') {
                        if (data) {
                            return '<input type="checkbox" checked class="ckbGridStatus ckbGrid" data-on-color="success" data-off-color="danger" data-on-text="Ativo" data-off-text="Inativo">';
                        } else {
                            return '<input type="checkbox" class="ckbGridStatus ckbGrid" data-on-color="success" data-off-color="danger" data-on-text="Ativo" data-off-text="Inativo">';
                        }
                    }
                    else return data;
                }
            },
            {
                "visible": false,
                "targets": 0
            },
            {
                'className': 'dt-body-left',
                "targets": 1
            },
            {
                "orderable": false,
                'className': 'dt-body-left grupoOperacao',
                "targets": 5
            },
            {
                'searchable': false,
                "orderable": false,
                "visible": false,
                "targets": [6, 7, 8]
            },
        ],
        "language": {
            "emptyTable": "Nenhum item cadastrado na lista",
            "zeroRecords": "Nenhum item na lista corresponde ao filtro",
            "paginate": {
                "previous": "Anterior",
                "next": "Próximo"
            }
        },

        "info": false,
        destroy: true,
        data: dados,
        "columns": [
            { "data": "idTipoAtributo" },
            { "data": "descricao" },
            { "data": "preSelecionado" },
            { "data": "status" },
            { "data": "ordem" },
            { "data": "operacao" },
            { "data": "segmentos" },
            { "data": "secoes" },
            { "data": "especies" },
        ],
        "drawCallback": function (settings) {
            $(".ckbGrid").bootstrapSwitch();
            $(".ckbGrid").each(function () {
                $(this).bootstrapSwitch('state', $(this).is(":checked"));
            });
        }
    });
}
function manipularItem(tit) {
    console.log(dadosItemEdt)
    var idItm = dadosItemEdt.idTipoAtributo < 0 ? 0 : dadosItemEdt.idTipoAtributo;
    $.confirm({
        icon: 'fa fa-pencil-square-o',
        type: 'blue',
        title: tit,
        columnClass: 'xlarge',
        containerFluid: true,
        content: '<div class="col-md-12">' +
            '<div class="row">' +
            '<div class="col-md-1 form-group">' +
            '<label class="control-label">ID</label>' +
            '<div class="controls">' +
            '<input type="text" id="txtItemAttrID" disabled data-initial="' + dadosItemEdt.idTipoAtributo + '" value="' + idItm + '" class="form-control">' +
            '</div>' +
            '</div>' +
            '<div class="col-md-5 form-group">' +
            '<label class="control-label">Valor</label><span class="obrigatorio"> *</span>' +
            '<div class="controls">' +
            '<input type="text" id="txtDescItem" data-initial="' + dadosItemEdt.descricao + '" placeholder="Digite aqui..." value="' + dadosItemEdt.descricao + '" class="form-control">' +
            '</div>' +
            '</div>' +
            '<div class="col-md-2 form-group">' +
            '<label class="control-label">Status</label>' +
            '<div class="controls">' +
            '<input id="ckbStatusItem" type="checkbox" data-on-color="success" data-off-color="danger" data-on-text="Ativo" data-off-text="Inativo">' +
            '</div>' +
            '</div>' +
            '<div class="col-md-2 form-group">' +
            '<label class="control-label">Ordem</label><span class="obrigatorio"> *</span>' +
            '<div class="controls">' +
            '<input type="text" onclick="this.select()" id="txtNumOrdemItem" value="1" style="text-align:center!important" class="form-control txtInteiro" />' +
            '</div>' +
            '</div>' +
            '<div class="col-md-2 form-group">' +
            '<label class="control-label">Pré Selecionado</label>' +
            '<div class="controls">' +
            '<input id="ckbDefItem" type="checkbox" data-on-color="success" data-off-color="danger" data-on-text="Sim" data-off-text="Não">' +
            '</div>' +
            '</div>' +
            '</div>' +

            '<div id="divSegSecEspItem" class="row ocultarElemento">' +

            '<div id="divSegCadItem" class="col-md-4 col-sm-5 col-xs-12 form-group">' +
            '<label class="control-label">Segmentos</label>' +
            '<div class="controls">' +
            '<select id="drpSegCadItem" data-container=".jconfirm-box-container" class="selectpicker show-tick form-control" data-actions-box="true" data-show-subtext="true" multiple data-live-search="true" data-count-selected-text="Selecionado {0} de {1}" title="0 selecionados..." data-select-all-text="Marcar" data-deselect-all-text="Desmarcar" data-width="100%" data-select-header="true" data-size="auto" data-selected-text-format="count > 2">' +
            sourceSeg + '</select>' +
            '</div>' +
            '</div>' +

            '<div id="divSecCadItem" class="col-md-4 col-sm-5 col-xs-12 form-group ocultarElemento">' +
            '<label class="control-label">Seções</label>' +
            '<div class="controls">' +
            '<select id="drpSecCadItem" data-container=".jconfirm-box-container" class="selectpicker show-tick form-control" data-actions-box="true" data-show-subtext="true" multiple data-live-search="true" data-count-selected-text="Selecionado {0} de {1}" title="0 selecionados..." data-select-all-text="Marcar" data-deselect-all-text="Desmarcar" data-width="100%" data-select-header="true" data-size="auto" data-selected-text-format="count > 2">' +
            '</select>' +
            '</div>' +
            '</div>' +

            '<div id="divEspCadItem" class="col-md-4 col-sm-5 col-xs-12 form-group ocultarElemento">' +
            '<label class="control-label">Espécies</label>' +
            '<div class="controls">' +
            '<select id="drpEspCadItem" data-container=".jconfirm-box-container" class="selectpicker show-tick form-control" data-actions-box="true" data-show-subtext="true" multiple data-live-search="true" data-count-selected-text="Selecionado {0} de {1}" title="0 selecionados..." data-select-all-text="Marcar" data-deselect-all-text="Desmarcar" data-width="100%" data-select-header="true" data-size="auto" data-selected-text-format="count > 2">' +
            '</select>' +
            '</div>' +
            '</div>' +

            '</div>' +
            '<div class="col-md-3 bootstrap-select" id="comboItem"></div>' +
            '</div>',
        buttons: {
            confirm: {
                text: 'Confirmar',
                btnClass: 'btn-green',
                action: function () {
                    var self = this;
                    var retorno = {};
                    var isNovo = tit.toLowerCase().indexOf('atualizar') === -1 ;
                    if ($(self.$content.find('#txtDescItem')).val() && $(self.$content.find('#txtNumOrdemItem')).val()) {
                        retorno.idTipoAtributo = parseInt($(self.$content.find('#txtItemAttrID')).attr("data-initial"));
                        retorno.descricao = $(self.$content.find('#txtDescItem')).val();
                        retorno.preSelecionado = $(self.$content.find("#ckbDefItem")).bootstrapSwitch('state');
                        retorno.status = $(self.$content.find("#ckbStatusItem")).bootstrapSwitch('state');;
                        retorno.ordem = parseInt($(self.$content.find('#txtNumOrdemItem')).val());
                        retorno.segmentos = $(self.$content.find('#drpSegCadItem')).val() ?
                            $(self.$content.find('#drpSegCadItem')).val().join(';') :
                            '';

                        retorno.secoes = $(self.$content.find('#drpSecCadItem')).val() ?
                            $(self.$content.find('#drpSecCadItem')).val().join(';') :
                            retorno.segmentos !== '' ?
                                $(self.$content.find('#drpSecCadItem option')).map(function (_, o) {
                                    return $(o).val();
                                }).get().join(';') :
                                '';
                        retorno.especies = $(self.$content.find('#drpEspCadItem')).val() ?
                            $(self.$content.find('#drpEspCadItem')).val().join(';') :
                            '';
                        atualizaOrdem(retorno, isNovo);
                    } else {
                        $.confirm({
                            icon: 'fa fa-warning',
                            theme: 'modern',
                            animation: 'scale',
                            typeAnimated: true,
                            type: 'red',
                            title: 'Operação Invalida!',
                            containerFluid: true,
                            content: 'Os campos descrição e ordem são obrigatórios. Cancele a operação ou preencha os campos obrigatórios para prosseguir!',
                            buttons: {
                                ok: {
                                    btnClass: 'btn-red',
                                    text: 'Ok'
                                },
                            },
                        });
                        return false;
                    }
                }
            },
            cancel: {
                text: 'Cancelar',
                btnClass: 'btn-red',
                action: function () {
                }
            }
        },
        onContentReady: function () {
            var self = this;
            if ($("#ckbTipoAttrModal").bootstrapSwitch('state')) {
                self.$content.find('#drpSecCadItem').change(function () {
                    var objParam = {};
                    $('#divEspCadItem').addClass('ocultarElemento');
                    $("#drpEspCadItem").html('');
                    if ($('#drpSecCadItem').val()) {
                        objParam.secoes = $('#drpSecCadItem').val().join(',');
                        carregarEspecieModal(objParam, true);
                    } else {
                        $(".selectpicker").selectpicker('refresh');
                    }
                });
                self.$content.find('#drpSegCadItem').change(function () {
                    if (!$('#divEspCadItem').hasClass('ocultarElemento')) $('#divEspCadItem').addClass('ocultarElemento');
                    $("#drpEspCadItem").html('');
                    if (!$('#divSecCadItem').hasClass('ocultarElemento')) $('#divSecCadItem').addClass('ocultarElemento');
                    $("#drpSecCadItem").html('');

                    var objParam = {};
                    if ($('#drpSegCadItem').val()) {
                        if ($('#divSecCadItem').hasClass('ocultarElemento')) {
                            $('#divSecCadItem').removeClass('ocultarElemento');
                        }

                        objParam.segmentos = $('#drpSegCadItem').val().join(',').replace(/[^\d,]/g, '');
                        console.log(objParam)
                        carregarSecoesModal(objParam, true);
                    } else {
                        $(".selectpicker").selectpicker('refresh');
                    }
                });
                $(self.$content.find('#drpSegCadItem')).selectpicker('val', segSelecionados).trigger('change');
            }
            $(self.$content.find("#txtNumOrdemItem")).autocomplete({
                minLength: 0,
                delay: 50,
                messages: {
                    noResults: '',
                    results: function () { }
                },
                appendTo: "#comboItem",
                source: function (request, response) {
                    var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex(request.term), "i");
                    !request.term.length ? response(ordemCompleteLista) :
                        response($.grep(ordemCompleteLista, function (item) {

                            return matcher.test(item.value);
                        }));

                },
                focus: function (event, ui) { $(self.$content.find("#txtNumOrdemItem")).val(ui.item.value); },
                select: function (event, ui) {
                    $(self.$content.find("#txtNumOrdemItem")).val(ui.item.ordem);
                    $('#link_origin_id').val(ui.item.ordem);
                }
            });

        },
        onOpenBefore: function () {
            var self = this;
            $(self.$content.find(".selectpicker")).selectpicker();
            if (parseInt($('#drpTipoAttrCad').val()) > 0 && parseInt($('#drpTipoAttrCad').val()) < 4) {
                var valDef = 0;
                if (parseInt($('#drpTipoAttrCad').val()) == 1) {
                    $(self.$content.find('#txtDescItem')).removeClass().addClass('form-control attrNumItem');
                }
                if (parseInt($('#drpTipoAttrCad').val()) == 3) {
                    $(self.$content.find('#txtDescItem')).removeClass().addClass('form-control percentItem');
                    valDef = 100.00;
                }
                if (parseInt($('#drpTipoAttrCad').val()) == 2) {
                    $(self.$content.find('#txtDescItem')).removeClass().addClass('form-control moneyItem');
                    valDef = 0.00;
                }
                if (!dadosItemEdt.descricao.length) {
                    $(self.$content.find('#txtDescItem')).val(valDef).data('initialVal', valDef);
                } else {
                    $(self.$content.find('#txtDescItem')).val($(self.$content.find('#txtDescItem')).val().replace(/[^\d,]/g, ''))
                }

                $('.attrNumItem').maskMoney({ thousands: '.', allowZero: true, reverse: false, decimal: ',', allowNegative: true });
                $('.percentItem').maskMoney({ suffix: '%', decimal: ',', reverse: false, allowZero: true });
                $('.moneyItem').maskMoney({ prefix: 'R$ ', thousands: '.', allowZero: true, reverse: false, decimal: ',' });
                $('.percentItem').maskMoney('mask');
                $('.attrNumItem').maskMoney('mask');
                $('.moneyItem').maskMoney('mask');

            }
            else if (parseInt($('#drpTipoAttrCad').val()) == 0) {
                $(self.$content.find('#txtDescItem')).attr('maxlength', '50');
            }
            else if (parseInt($('#drpTipoAttrCad').val()) == 4) {

                if (!dadosItemEdt.descricao.length) {
                    $(self.$content.find('#txtDescItem')).val(valDef).data('initialVal', valDef);
                }
                $(self.$content.find('#txtDescItem')).removeClass().addClass('form-control attrDataItem');
                var dataSt = dadosItemEdt.descricao.indexOf('/') > -1 ? dadosItemEdt.descricao : moment().add(valDef, 'days').format('DD/MM/YYYY');
                var configCal = {
                    locale: configuracaoCalendarios,
                    singleDatePicker: true,
                    "parentEl": ".jconfirm-box-container",
                    autoUpdateInput: false,
                    showDropdowns: true,
                    startDate: dataSt,
                };
                $(self.$content.find('#txtDescItem')).daterangepicker(configCal).on('apply.daterangepicker', function (ev, picker) {
                    $(self.$content.find('#txtDescItem')).val(picker.startDate.format('DD/MM/YYYY'));
                });
            }

            $(self.$content.find("input[type='checkbox']")).bootstrapSwitch();
            $(self.$content.find("#ckbStatusItem")).bootstrapSwitch('state', dadosItemEdt.status, false);
            $(self.$content.find("#ckbDefItem")).bootstrapSwitch('state', dadosItemEdt.preSelecionado, false);
            $(self.$content.find("#txtNumOrdemItem")).val(dadosItemEdt.ordem);
            if ($("#ckbTipoAttrModal").bootstrapSwitch('state')) $(self.$content.find("#divSegSecEspItem")).removeClass('ocultarElemento');
            if (tit.toLowerCase().indexOf('atualizar') > -1) {
                self.buttons.confirm.setText('Confirmar')

            }
            if (parseInt($("#txtIdAtributo").val()) > 0 && parseInt($(self.$content.find('#txtItemAttrID')).attr("data-initial")) > 0) {
                if (permissoesUsuarioLogado.indexOf('Ativar/Desativar Item de Atributos') === -1) {
                    $(self.$content.find("#ckbStatusItem")).bootstrapSwitch('disabled', true);
                }
                if (permissoesUsuarioLogado.indexOf('Alterar Descrição de Item de Atributos') === -1) {
                    $(self.$content.find("#txtDescItem")).prop('disabled', true);
                }

            }
            //$(self.$content.find(".selectpicker")).selectpicker('refresh');
            $(".bg_load").hide();
            $(".wrapper").hide();
            var $menuTitulo = $(".navbar.navbar-default.navbar-fixed-top");
            $menuTitulo.removeClass('ocultarElemento');
            $(".selectpicker").selectpicker('show');
        },
        onDestroy: function () {
            $('#listaCadastrados_paginate').css('display', 'block');
            segSelecionados = [];
            espSelecionadas = [];
            dadosItemEdt = null
        },
    });
}

function limparCamposPesquisa() {

    $(".filtrosItemLista #fTxtBusca").val("");
    dtbCad.search('').draw();
    $('.filtrosItemLista .selectpicker:not([multiple])').selectpicker('val', '');
    $('.filtrosItemLista .selectpicker[multiple]').each(function () {
        if (this.length) {
            $(this).selectpicker('deselectAll')
        }
    });
    $('.clear-filter').blur();
    $('.selectpicker').selectpicker('refresh');

    //dtbCad.draw();

}
function voltarGerenciamentoAtributo() {
    if (!$('#divValBool').hasClass('ocultarElemento')) {
        $('#divValBool').addClass('ocultarElemento')
    }
    $('.selectpicker').selectpicker('hide');
    $(".navbar.navbar-default.navbar-fixed-top").addClass('ocultarElemento');
    $(".bg_load").show();
    $(".wrapper").show();
    window.location = "../gerenciamento/atributos.cshtml"
}