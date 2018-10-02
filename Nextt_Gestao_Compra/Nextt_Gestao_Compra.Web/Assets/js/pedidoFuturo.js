﻿var fullDate = new Date();
var twoDigitMonth = (fullDate.getMonth() + 1) + "", twoDigitDate = fullDate.getDate() + "";
if (twoDigitMonth.length === 1) twoDigitMonth = "0" + twoDigitMonth;
if (twoDigitDate.length === 1) twoDigitDate = "0" + twoDigitDate;
var currentDate = twoDigitDate + "/" + twoDigitMonth + "/" + fullDate.getFullYear();

var coresGrade = [], coresNovasCadastradas = [], tamanhosGrade = [], tamanhoTexto = [], referenciaGrade = [], tabelaPackCadastrados = [], tamanhoConfeccao = [],
    tamanhoCalcados = [], specialKeys = new Array(), tbDistribuicao, valorInicialPed, tabelaPack, tabResponsive, dadoPackOriginal, gridNome, titPack = undefined,
    avanca = false, dadosPck;

var current = new Date().getMonth(),
    slides, currentIndex;

specialKeys.push(8); //Backspace
specialKeys.push(43); // +
specialKeys.push(13); // ENTER
$.fn.hasAttr = function (name) {
    return this.attr(name) !== undefined;
};
var dadosCompraCadastro = sessionStorage.getItem("compra");
var compraId = sessionStorage.getItem("pedidoId");
var cadastroNovoSession = sessionStorage.getItem("cadastroNovo");
var statusPedido = null;
sessionStorage.setItem("cores", "");

$(document).ready(function () {

    $(window).on("load", carregar);


    $('.percent').maskMoney({ suffix: '%', decimal: ',', allowZero: true, selectAllOnFocus: true });
    $('.money').maskMoney({ prefix: 'R$ ', thousands: '.', allowZero: true, decimal: ',', selectAllOnFocus: true });
    $('.percent').maskMoney('mask');
    $('.money').maskMoney('mask');
    $(document).on('keyup touchend', '.percent', function (evento) {
        evento =evento || window.event;
        var code = evento.which || evento.charCode || evento.keyCode, valorImputado = $(this).maskMoney('unmasked')[0];
        if (valorImputado > 100) {
            var str = valorImputado.toFixed(2);
            var output = [str.slice(0, str.indexOf(".") - 1), ',',
            str.slice(str.indexOf(".") - 1, -1).replace(/\D/g, '')].join('');
            $(this).val(output).maskMoney('mask');
        } else if ($(this).hasClass('calcular')) {
            var elLinkado = $(this).attr('id').replace('Perc', 'Vlr');
            calculaAlteracaoDescAcre(this, elLinkado, 'perc', true)
        }
        if (code === 9 || code === 13) {
            $(this).blur();
        }
    })
    $(document).on('keyup touchend', '.calcular.money', function (evento) {
        var code = (evento.keyCode ? evento.keyCode : evento.which), valorImputado = $(this).maskMoney('unmasked')[0];
        if (validaValorImputado(valorImputado)) {
            $(this).data().initail = valorImputado;
            var elLinkado = $(this).attr('id').replace('Vlr', 'Perc');
            calculaAlteracaoDescAcre(this, elLinkado, 'mon', true)
        } else {
            var valInit = $(this).data().initail.toFixed(2).replace('.', ',');
            $(this).val(valInit).maskMoney('mask');;
        }
        if (code === 9 || code === 13) {
            $(this).blur();
        }
    })
    $(document).on('keyup touchend', '#txtCustoBrutoPed', function (evento) {

        var code = (evento.keyCode ? evento.keyCode : evento.which);
        if (code === 9 || code === 13) {
            $(this).blur();
        }
    })
    $(document).on('click', '.add-pack', function (evento) {
        var existInput = $('.pretty.dataTable').find('input').length;
        evento.preventDefault();
        if (!existInput) {
            var tabs = $("#tabPacksCad li:not(:last)"), valido = true;
            for (var i = 0; i < tabs.length; i++) {
                var tabid = $(tabs[i]).attr('id').replace('li', '');
                var tbValidar = $('#tblPackCad' + tabid).dataTable().api();
                valido = validaAddPack(tbValidar, tabid);
                if (!valido) {
                    if (!$(tabs[i]).hasClass('active')) {
                        $(tabs[i]).children('a').first().click();
                    }
                    break;
                }
            }
            if (valido) {
                for (var i = 0; i < tabs.length; i++) {
                    var tabid = $(tabs[i]).attr('id').replace('li', '');
                    var tbValidar = $('#tblPackCad' + tabid).dataTable().api();
                    var packRepetido = validaPackRepetido(tbValidar, tabid);
                    if (packRepetido.length) {
                        valido = false;
                        break;
                    }
                }
            }
            if (valido) {
                addGrupo(true);
            }
        }
    })
    $('#tabPacksCad').on('click', '.close', function (evento) {
        var existInput = $('.pretty.dataTable').find('input').length;
        evento.preventDefault();
        if (!existInput) {
            var tabs = $("#tabPacksCad li:not(:first)");
            if (tabs.length === 1) {
                erroCadCompra("Para excluir um pack é necessário que existam ao menos 2 packs cadastrados!", "alertCadPack");
            } else {
                var tabID = $(this).parents('a').attr('href');
                var $tabRemover = $(this).parents('li');
                $.confirm({
                    title: 'Atenção!',
                    content: 'Ao confirmar essa operação, o pack será excluído e as informações contidas nele serão descartadas.<br/>Tem certeza que deseja prosseguir?',
                    icon: 'fa fa-warning',
                    theme: 'modern',
                    closeIcon: false,
                    animation: 'scale',
                    typeAnimated: true,
                    type: 'orange',
                    buttons: {
                        okButton: {
                            text: 'Confirmar',
                            action: function () {
                                $tabRemover.remove();
                                $(tabID).remove();
                                excluirPack(tabID.replace(/\D/g, ""))
                                $("#tabPacksCad li").children('a').first().click();
                            },
                        },
                        cancel: {
                            text: 'Cancelar'
                        },
                    },

                });
            }
        }
    });
    $(document).on('click', '.add-grupo', function (evento) {
        var existInput = $('.pretty.dataTable').find('input').length;
        evento.preventDefault();
        if (!existInput) {
            dadosPck = {};
            dadosPck.idPackAtivo = $("#tabPacksCad li.active").attr('id').replace('li', '');
            var teabGrupos = $("#tabDadosDist" + dadosPck.idPackAtivo + " li:not(:last)");
            dadosPck.grpsSelecionados = []
            for (var i = 0; i < teabGrupos.length; i++) {
                dadosPck.grpsSelecionados.push($(teabGrupos[i]).children('a').attr('href').split('_')[0].replace(/\D/g, ""));
            }
            console.log(dadosPck);
            addGrupo(false);
        }
    })
    $(document).on('click', '.btnRecalcDist', function (evento) {
        var grpRecalc = $(this).attr('id');
        var param = {};
        param.idGrupo = grpRecalc.split('_')[0].replace(/\D/g, "");
        param.secoes = $('#drpSec').val().split('-')[0];
        param.especies = $('#drpEsp').val().split('-')[0];
        param.mes = $('#' + grpRecalc.replace('btnGrpPack', 'drpFiltroMes')).val();
        param.ano = $('#' + grpRecalc.replace('btnGrpPack', 'drpFiltroAno')).val();
        var refEditar = {};
        refEditar.pack = grpRecalc.split('_')[1];
        refEditar.idGrupo = parseInt(grpRecalc.split('_')[0].replace(/\D/g, ""));
        console.log(param)
        console.log(refEditar);
        retornaDadosGrpFilDist(param, refEditar)
    })

    $(document).on('click', '.tabGrupoFilial .close', function (evento) {
        var existInput = $('.pretty.dataTable').find('input').length;
        evento.preventDefault();
        if (!existInput) {
            var ulGrupoClicado = $(this).closest('ul').attr('id');
            var tabs = $("#" + ulGrupoClicado + " li:not(:last)");
            if (tabs.length === 1) {
                erroCadCompra("Para excluir um grupo é necessário que existam ao menos 2 packs cadastrados!", "alertCadPack");
            } else {

                var tabID = $(this).parents('a').attr('href');
                var $tabRemover = $(this).parents('li');
                var tbGrupoExcluir = $(tabID).find('.dataTable').first().attr('id').split('_');
                var tbRefNome = 'tblPackCad' + tbGrupoExcluir[1];
                var indiceGrp = parseInt(tbGrupoExcluir[0].replace(/\D/g, ""));

                tabelaPackCadastrados.map(obj => {
                    if (obj.idTabela === tbRefNome) {
                        var grpExcluir = obj.packGrupos.filter(el => el.idGrupo === indiceGrp)[0];
                        obj.packGrupos = excluirGrupoPack(grpExcluir, obj.packGrupos, obj.qtdPck);
                        for (var i = 0; i < obj.packGrupos.length; i++) {
                            calculaDistribuicaoFilialGrupo(obj.packGrupos[i]);
                        }
                        recalcPackGrpsFiliais(tbRefNome.replace('tblPackCad', ''), obj.packGrupos);
                    }
                    return obj;
                })
                $tabRemover.remove();
                $(tabID).remove();
                $("#" + ulGrupoClicado + " li").children('a').first().click();
            }
        }
    });

    $('#txtDtEntregaPed').daterangepicker({
        locale: configuracaoCalendarios,
        dateLimit: {
            "month": 1
        },
        minDate: moment(),
        "parentEl": "#principal",
        showDropdowns: true,
        alwaysShowCalendars: true,
        buttonClasses: "btn btn-small",
        cancelClass: "btn-primary",
        startDate: moment(),
        endDate: moment().endOf("month"),
        opens: 'left',
        linkedCalendars: false,
        ranges: {
            "Na Próxima Semana": recuperaRange('semana'),
            "No Próxima Mês": recuperaRange('mes'),
            "Em 3 Meses": recuperaRange('trimestre'),
            "Em 6 Meses": recuperaRange('semestre')
        }
    }).on('apply.daterangepicker', function (ev, picker) {
        var dataRef = picker.endDate.toDate();
        var momentObjStart = moment(dataRef).add(1, 'day');
        var rangesRed = $('#txtDtEntregaFinalPed').data('daterangepicker').ranges;
        $.each(rangesRed, function (key, value) {
            if (key === '+ 1 Dia') {
                rangesRed[key] = recuperaRangeEntregaFinal('dia')
            }
            else if (key === '+ 7 Dias') {
                rangesRed[key] = recuperaRangeEntregaFinal('semana')
            }
            else if (key === '+ 15 Dias') {
                rangesRed[key] = recuperaRangeEntregaFinal('quinzena')
            }
            else if (key === '+ 30 Dias') {
                rangesRed[key] = recuperaRangeEntregaFinal('mes')
            }
        });
        $('#txtDtEntregaFinalPed').data('daterangepicker').ranges = rangesRed;
        $('#txtDtEntregaFinalPed').data('daterangepicker').minDate = momentObjStart;
        $('#txtDtEntregaFinalPed').data('daterangepicker').setStartDate(momentObjStart);
        $('#txtDtEntregaFinalPed').data('daterangepicker').setEndDate(momentObjStart);
    });;

    $('#txtDtEntregaFinalPed').daterangepicker({
        locale: configuracaoCalendarios,
        autoUpdateInput: true,
        startDate: recuperaStartDateFinalEntrega(),
        endDate: recuperaStartDateFinalEntrega(),
        minDate: recuperaStartDateFinalEntrega(),
        "parentEl": "#principal",
        showDropdowns: true,
        buttonClasses: "btn btn-small",
        cancelClass: "btn-primary",
        linkedCalendars: true,
        alwaysShowCalendars: true,
        ranges: {
            "+ 1 Dia": recuperaRangeEntregaFinal('dia'),
            "+ 7 Dias": recuperaRangeEntregaFinal('semana'),
            "+ 15 Dias": recuperaRangeEntregaFinal('quinzena'),
            "+ 30 Dias": recuperaRangeEntregaFinal('mes')
        },
        opens: 'left',
    });
    ordenaOpcao();


    $(".frmTamanho.collapsible").collapsible({
        animation: true,
        speed: "medium"
    });
    $(".ckbTamanho").bootstrapSwitch();
    $(".ckbTipoTamanho").bootstrapSwitch();

    $(document).on('click', '.panel-heading span.clickable.pull-right', function (e) {
        var $this = $(this);
        var id = $this.parents('.panel')
            .find('.panel-body')
            .find('table.tbPackCad')
            .filter(function (tb) {
                return this.id.length > 0 ? true : false;
            })
            .map(function (i, table) {
                return table.id;
            })
            .get()
            .join(",");
        var tbCadastrada = $('#' + id).dataTable().api();
        if (!$this.hasClass('panel-collapsed')) {
            $this.closest('.panel').find('.panel-body').slideUp();
            $this.addClass('panel-collapsed');
            $this.find('i').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
        } else {
            //$this.closest('.panel').find('.panel-body').slideDown('slow');
            $this.closest('.panel').find('.panel-body').slideDown({
                complete: function () {
                    tbCadastrada.columns.adjust().draw();
                    tbCadastrada.fixedHeader.adjust()
                    tbCadastrada.rowsgroup.update();
                    //$('#modalCadastroCompra').animate({ scrollTop: $('#modalCadastroCompra .modal-dialog').height() }, 500);

                }
            });
            $this.removeClass('panel-collapsed');
            $this.find('i').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
        }
    })
    $(".ckbCadPedido").bootstrapSwitch();
    //descomentar
    //$('.selectpicker').selectpicker('val', '')
    $('.selectpicker').selectpicker('refresh');
    $('#txtDtCadastro').val(currentDate);

    $(document).on('click', '.cadCor', function (e) {
        var $elCor1 = $("#txtHexNovaCor1")//.spectrum("get");
        var $elCor2 = $("#txtHexNovaCor2")//.spectrum("get");
        var $elCor3 = $("#txtHexNovaCor3")//.spectrum("get");
        var corNome = $("#txtNomeNovaCor").val(), corClasses = [], corDesc = [];
        if ($elCor1.val().length) {
            corClasses.push($elCor1.val().replace(/\s/g, ''))
        }
        if ($elCor2.val().length) {
            corClasses.push($elCor2.val().replace(/\s/g, ''))
        }
        if ($elCor3.val().length) {
            corClasses.push($elCor3.val().replace(/\s/g, ''))
        }
        if (corNome.length > 0) {
            if (!checaCorCadastrada(corNome) && corClasses.length) {
                addLinhaOpcaoCores(corClasses, corNome)
            }
        }
        if (retornaCoresSelecionadas()) {
            coresGrade = retornaCoresSelecionadas();
            reiniciaTbGrade();
            if (tamanhosGrade.length || referenciaGrade.length || coresGrade.length) {
                var dados = cargaCor(referenciaGrade.length, tamanhosGrade.length);
                criarCargaGradePackPadrao(dados)
            }

        } else {
            coresGrade = [];
        }
        $elCor1.spectrum("set", "");
        $elCor2.spectrum("set", "");
        $elCor3.spectrum("set", "");
        $elCor3.spectrum('disable');
        $elCor2.spectrum('disable');
        $("#txtNomeNovaCor").val("");
    });
    $(document).on('click', '.limpaCor', function (e) {
        $("#txtHexNovaCor1").spectrum("set", "");
        $("#txtHexNovaCor2").spectrum("set", "");
        $("#txtHexNovaCor3").spectrum("set", "");
        $("#txtHexNovaCor2").spectrum('disable');
        $("#txtHexNovaCor3").spectrum('disable');
        $("#txtNomeNovaCor").val("");
    });

    $(document).on('click', '.qtdPackCadastrado', function (e) {
        var existInput = $('.pretty.dataTable').find('input').length;
        if (!existInput && (!statusPedido || statusPedido === 'A')) {
            cell = this;
            if ($(this).is('td')) {
                col = $(this).parent().children().index($(this));
                row = $(this).parent()[0];
                gridNome = $(this).closest('table').attr('id');
                valorInicial = $(cell).html();
                $(this).html(geraEditorPackCadastrado(1, $(this).html()))
                $(this).find('input[type="text"]').focus().select();
            }

        }

    });
    $(document).on('click', '.qtdPackCad', function (e) {
        var existInput = $('.pretty.dataTable').find('input').length;
        if (!existInput && (!statusPedido || statusPedido === 'A')) {
            cell = this;
            if ($(this).is('td')) {
                col = $(this).parent().children().index($(this));
                row = $(this).parent()[0];
                gridNome = $(this).closest('table').attr('id');
                valorInicial = $(cell).html();
                $(this).html(geraEditorPack(1, $(this).html()))
                $(this).find('input[type="text"]').focus().select();
            }

        }

    });
    $(document).on('click', '.qtdPack', function (e) {
        var existInput = $('.pretty.dataTable').find('input').length;
        if (!existInput && (!statusPedido || statusPedido === 'A')) {
            cell = this;
            if ($(this).is('td')) {
                col = $(this).parent().children().index($(this));
                row = $(this).parent()[0];
                gridNome = $(this).closest('table').attr('id');
                valorInicial = $(cell).html();
                $(this).html(geraEditor(1, $(this).html()))
                $(this).find('input[type="text"]').focus().select();
            }

        }

    });
    $(document).on('click', '.qtdPackFilial', function (e) {
        var existInput = $('.pretty.dataTable').find('input').length;
        if (!existInput && (!statusPedido || statusPedido === 'A')) {
            cell = this;
            col = $(this).parent().children().index($(this));
            row = $(this).parent().index();
            valorInicialPed = $(cell).html();
            if ($(this).is('td')) {
                gridNome = $(this).closest('table').attr('id');


                $(this).html(geraEditorPack(1, $(this).html()))
                $(this).find('input[type="text"]').focus().select();
            }


        }
    });
    $(document).on('click', '.porcPackParticipacao', function (e) {
        titPack = undefined;
        cell = this;
        col = $(this).parent().children().index($(this));
        row = $(this).parent().index();

        valorInicialPed = $(cell).html();
        if ($(this).is('td')) {
            var gridNome = $(this).closest('table').attr('id');
            var gridWrapper = "#" + gridNome + "_wrapper";
            var contColSpan = 1
            $(gridWrapper + ' thead tr:eq(0) th:gt(1)').each(function () {
                if (col > contColSpan) {
                    contColSpan = contColSpan + $(this).prop("colSpan");
                    if (col === contColSpan) {
                        titPack = $(this).text();
                    }
                }

            })
            $(this).html(geraEditorPack(2, $(this).html()))
            $(this).find('input[type="text"]').focus().select();
        }

    });

    $(document).on('click', '.addCond', function (e) {
        var $txtCondPg = $("#txtCadCondPgtoPed"), $drdCondPg = $("#drpCondPgtoPed"), arrayValidar = $txtCondPg.val().split('+');
        if (validaArrayCondPgto(arrayValidar)) {
            $drdCondPg.append(criarCondPgto('0', $txtCondPg.val(), 'calculator'));
            $("#drpCondPgtoPed option").filter(function () {
                return $txtCondPg.val() === this.text;
            }).attr('selected', true);

            $drdCondPg.selectpicker('refresh');
            $txtCondPg.val('');
            $("#frmBtnCond").addClass('ocultarElemento');
        } else {
            $txtCondPg.popover({
                title: '<h5 class="custom-title"><span class="glyphicon glyphicon-exclamation-sign orange"></span> Atenção!</h5>',
                content: "<p>Para cadastrar é necessário que as datas estejam em ordem crescente. Exemplo:</p>" +
                    '<ul class="fa-ul">' +
                    '<li><i class="fa-li fa fa-check green"></i><strong>30+60+90</strong></li>' +
                    '<li><i class="fa-li fa fa-ban red"></i><strong>1+10+5</strong></li>' +
                    '</ul>',
                html: true,
                trigger: 'manual',
                container: 'body',
                placement: 'auto'
            });
            $txtCondPg.popover('show');
            $txtCondPg.focus().select();
            setTimeout(function () {
                $txtCondPg.popover('destroy');
            }, 5000);
        }
    });
    $(document).on('click', '.clearTxtCond', function (e) {
        $("#txtCadCondPgtoPed").val('');
        $("#frmBtnCond").addClass('ocultarElemento');
    });


    $("#txtNomeNovaCor").blur(function () {
        var corNome = $("#txtNomeNovaCor").val().toLowerCase().split('/'), corClasses = [], corDesc = [];
        for (var i = 0; i < corNome.length; i++) {
            if (corNome[i].length) {
                corDesc.push(toTitleCase($.trim(corNome[i])));
            }
        }
        $("#txtNomeNovaCor").val(corDesc.join('/'));
    });
    $(document).on('keydown', '#txtNomeNovaCor', function (evento) {
        var inputValue = evento.keyCode ? evento.keyCode : evento.which;
        var retorno = ((inputValue >= 65 && inputValue <= 90) || (inputValue === 111)) ||
            ((inputValue >= 8 && inputValue <= 13) || (inputValue >= 27 && inputValue <= 43))

        if (retorno) return;
        else evento.preventDefault();
    })
    $(document).on('keydown', '#txtAreaObsPed', function (evento) {
        var inputValue = evento.keyCode ? evento.keyCode : evento.which;
        var retorno = ((inputValue >= 65 && inputValue <= 90) || (inputValue === 111)) ||
            ((inputValue >= 8 && inputValue <= 13) || (inputValue >= 27 && inputValue <= 43))

        if (retorno) return;
        else evento.preventDefault();
    })

    $(document).on('keyup touchend', '#txtNomeNovaCor', function (evento) {
        var code = (evento.keyCode ? evento.keyCode : evento.which), valorImputado = this.value;
        if (valorImputado.length > 0 && valorImputado.slice(-1) === '/') {

            valorImputado = validaCorInput(valorImputado);
            $(this).val(valorImputado);
        }

        if (code === 9 || code === 13) {
            $(this).blur();
        }
    })

    $(document).on('change', '.grpPackQtd', function () {
        var $elQtdGrpPck = $(this);
        var txtId = $elQtdGrpPck.attr('id');
        var novaQtdGrp = parseInt($elQtdGrpPck.val());
        var tbRefNome = 'tblPackCad' + txtId.split('_')[1];
        var indiceGrp = parseInt(txtId.split('_')[0].replace(/\D/g, ""));
        var hashGrupo = $elQtdGrpPck.closest('.tab-pane').attr('id');
        tabelaPackCadastrados.map(obj => {
            if (obj.idTabela === tbRefNome) {
                obj.packGrupos = atualizaGrpQtdAlterado(novaQtdGrp, obj.packGrupos, indiceGrp, obj.qtdPck)
                for (var i = 0; i < obj.packGrupos.length; i++) {
                    calculaDistribuicaoFilialGrupo(obj.packGrupos[i])
                }
                recalcPackGrpsFiliais(tbRefNome.replace('tblPackCad', ''), obj.packGrupos);
            }
            return obj;
        })
        $('#tabDadosDist' + tbRefNome.replace('tblPackCad', '') + ' li').children('a[href="#' + hashGrupo + '"]').tab('show');

    });
    $(document).on('keydown', '.txtInteiro', function (e) {
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
            (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
            (e.keyCode >= 35 && e.keyCode <= 40)) {
            return;
        }
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    })
    $(document).on('change keyup paste', '#txtDescPed', function () {
        var $elDescProd = $(this);
        $('#txtDescResPed').val($elDescProd.val());
    });

    $(document).on('keydown', '#txtNomeNovaRef', function (evento) {
        var code = (evento.keyCode ? evento.keyCode : evento.which);
        if (code === 9 || code === 13) {
            $(this).blur();
        }
    })
    $("#txtNomeNovaRef").blur(function () {
        if ($(this).val().length && !validaReferenciaCadastrada($(this).val())) {
            var referenciaNova = $(this).val().toLowerCase().replace(/\b[a-z]/g, function (letter) {
                return letter.toUpperCase();
            });;
            $('#drpReferenciaGrade').append(cadastraReferencia(referenciaNova));
            $('#drpReferenciaGrade').selectpicker('refresh');
            if ($('#drpReferenciaGrade').val()) {
                referenciaGrade = $('#drpReferenciaGrade').val();
                reiniciaTbGrade()
                if (tamanhosGrade.length || referenciaGrade.length || coresGrade.length) {
                    var dados = cargaReferencia(coresGrade.length, tamanhosGrade.length)
                    criarCargaGradePackPadrao(dados)
                }
            } else {
                referenciaGrade = [];
            }
            $(this).val('');
        }
    });

    $(document).on('keyup touchend', '#txtCadCondPgtoPed', function (evento) {
        var code = (evento.keyCode ? evento.keyCode : evento.which), valorImputado = this.value;
        if (valorImputado.length > 0 && valorImputado.slice(-1) != '+') {
            $('#frmBtnCond').removeClass('ocultarElemento')
        } else {
            $('#frmBtnCond').addClass('ocultarElemento')
        }
        if (code === 9 || code === 13) {
            $(this).blur();
        }
    })

    $(document).on('keydown', '.gradeDados', function (evento) {
        var code = (evento.keyCode ? evento.keyCode : evento.which);
        if (code === 9 || code === 13) {
            $(this).blur();
        }
    })

    $(".gradeDados").blur(function () {
        if ($(this).val().length) {
            var elemento = $(this).parents().parents().children().first();
            if (elemento.html().indexOf(': ') > -1) {
                elemento.html(elemento.html().split(': ')[0])
            }
            elemento.html(elemento.html() + ": " + $(this).val())
        }
    });

    $('#ucComboProduto').on('changed.bs.select', function (e, clickedIndex, newValue, oldValue) {
        var selected = $(e.currentTarget).val();
        if (selected) {
            $('#divImgProd').css('display', 'block');
            $('#container-existe').css('display', 'block');
            $('#container-novo').css('display', 'none');
        } else {
            $('#divImgProd').css('display', 'none');
            $('#container-novo').css('display', 'none');
            $('#container-existe').css('display', 'none');
        }
    });

    $('#drpReferenciaGrade').on('changed.bs.select', function (e, clickedIndex, newValue, oldValue) {

        if ($('#drpReferenciaGrade').val()) {
            referenciaGrade = $('#drpReferenciaGrade').val();
        } else {
            referenciaGrade = [];
        }
        reiniciaTbGrade()
        if (tamanhosGrade.length || referenciaGrade.length || coresGrade.length) {
            var dados = cargaReferencia(coresGrade.length, tamanhosGrade.length)
            criarCargaGradePackPadrao(dados)
        }
        validaMudancaGrade();
    });

    $('#drpCoresGrade').on('changed.bs.select', function (e, clickedIndex, newValue, oldValue) {
        if ($('#drpCoresGrade').val()) {
            coresGrade = retornaCoresSelecionadas();
        } else {
            coresGrade = [];
        }
        reiniciaTbGrade()
        if (tamanhosGrade.length || referenciaGrade.length || coresGrade.length) {
            var dados = cargaCor(referenciaGrade.length, tamanhosGrade.length);
            criarCargaGradePackPadrao(dados)
        }
        validaMudancaGrade();
    });

    $('#drpTamanhoGrade').on('changed.bs.select', function (e, clickedIndex, newValue, oldValue) {
        if ($('#drpTamanhoGrade').val()) {
            retornaTamanhosSelecionados()
            tamanhosGrade = $('#drpTamanhoGrade').val();
        } else {
            tamanhosGrade = [];
        }
        reiniciaTbGrade()
        if (tamanhosGrade.length || referenciaGrade.length || coresGrade.length) {
            var dados = cargaTamanho(referenciaGrade.length, coresGrade.length)
            criarCargaGradePackPadrao(dados)
        }
        validaMudancaGrade();
    });
    $('#drpClassificacao').on('change', function (e) {
        atualizaCbClassificacao();
    });
    $('#drpTamanhoCategoria').on('change', function (e) {
        var objEnvio = {};
        objEnvio.codigo = $('#drpTamanhoCategoria option:checked').attr('data-tokens').split(',')[0];
        geraCargaTamanhos(objEnvio);
    });

    $('#drpSec').on('change', function (e) {
        var objParam = {};
        $("#drpEsp").html('<option selected value="">Nenhuma</option>').prop('disabled', true);
        $("#drpEsp").selectpicker('refresh');
        if ($('#drpSec').val()) {
            localStorage.setItem("combo", "secao");
            $('.selectpicker').selectpicker('hide');
            $(".navbar.navbar-default.navbar-fixed-top").addClass('ocultarElemento');
            $(".bg_load").show();
            $(".wrapper").show();
            $("#drpEsp").prop('disabled', false)
            objParam.secoes = $('#drpSec').val();
            carregarEspecie(objParam);
        } 
        atualizaCodigoProduto();
      
    });

    $('#drpEsp').on('change', function (e) {
        atualizaCodigoProduto();
    });
})

function carregar() {
    if (!dadosCompraCadastro && !cadastroNovoSession && !compraId) {
        var carga = sessionStorage.getItem("produtosLista");
        localStorage.setItem("erro", "<strong>Acesso Não Autorizado!</strong> É necessário seguir o fluxo de cadastro para acessar os próximos passos.");

        if (!carga) {
            window.location = "../gerenciamento/compra.cshtml";
        } else {
            window.location = "../gerenciamento/compraprodutos.cshtml";
        }
    } else {
        if (!compraId) {
            $("#frmDados.collapsible").collapsible({
                animation: true,
                speed: "medium"
            });
            $("#frmCusto.collapsible").collapsible({
                animation: true,
                speed: "medium"
            });

        }

        //criaInputImagem();
        if (dadosCompraCadastro) {
            dadosCompraCadastro = JSON.parse(dadosCompraCadastro)[0];
            var objEnvio = {};
            objEnvio.codigo = dadosCompraCadastro.idProduto;
            objEnvio.idFornecedor = dadosCompraCadastro.idFornecedor;
            carregaImagemProduto(objEnvio);
            geraCargaPrePedido(objEnvio);
        } else if (cadastroNovoSession) {
            geraCargaCadNovo()
        } else {
            var objEnvio = {};
            console.log(compraId)
            objEnvio.codigo = compraId;
            geraCargaPedidoAnalitico(objEnvio);

        }
    }

}

function recuperaRangeEntregaFinal(parametro) {
    var dtRef = $('#txtDtEntregaPed').data('daterangepicker').endDate.toDate();
    if (parametro === "dia") {
        return [moment(dtRef).add(1, 'days'), moment(dtRef).add(1, 'days')];
    } else if (parametro === "semana") {
        return [moment(dtRef).add(1, 'days'), moment(dtRef).add(7, 'days')];
    } else if (parametro === "quinzena") {
        return [moment(dtRef).add(1, 'days'), moment(dtRef).add(15, 'days')];
    } else if (parametro === "mes") {
        return [moment(dtRef).add(1, 'days'), moment(dtRef).add(30, 'days')]
    }
}


function carregarGradeDinamica(dadosGrade, colunasGrade) {
    var tabelaPack2 = {
        paging: false, /* define se a tabela deve usar paginação */
        searching: false, /* define se deve usar o campo Buscar dentro da tabela */
        lengthChange: false,
        rowsGroup: [0],
        destroy: true,
        ordering: false,
        scrollCollapse: true,
        deferRender: true,
        responsive: true,
        data: dadosGrade,
        "language": {
            "emptyTable": "Sem dados cadastrados",
            "zeroRecords": "Nenhum produto corresponde ao filtro"
        },
        columns: colunasGrade,
        "info": false,
    };
    return tabelaPack2;
}
function criarCargaGradePackPadrao(dadosEnviados) {

    var colunasGradeDinamica = geraColunaGradeDinamica();
    var config = carregarGradeDinamica(dadosEnviados, colunasGradeDinamica);
    $("#tabelaPack2").DataTable(config);
}
function reiniciaTbGrade() {
    var retornoTbGrade = criarTabelaPackDinamico();
    if ($.fn.DataTable.isDataTable('#tabelaPack2')) {
        var tb = $('#tabelaPack2').dataTable().api();
        tb.destroy();
    }
    $("#tabelaPack2").html(retornoTbGrade);
}
function carregarDistribuicaoFilial(idTabelaDist, colunmsPk, dadosPk) {
    console.log(colunmsPk);
    console.log(dadosPk);
    tbDistribuicao = $('#' + idTabelaDist).DataTable({
        paging: false,
        searching: false,
        lengthChange: false,
        deferRender: true,
        "ordering": false,
        responsive: true,
        "columnDefs": [
            {
                "targets": "_all",
                "orderable": false,
                'className': 'dt-body-center',
                "render": function (data, type, row, meta) {
                    if (type === 'display' && meta.col > 0 && meta.row > 1) {
                        if (meta.row === 10 || meta.row === 3) {
                            return data.toLocaleString('pt-BR', { style: "currency", currency: "BRL" })
                        } else if (meta.row === 5) {
                            return Math.round10(data, -2).toLocaleString('pt-BR') + '%';
                        } else {
                            return data.toLocaleString('pt-BR', {maximumFractionDigits: 2})
                        }
                    } else if (meta.col === 0) {
                        var textToolip;
                        if (meta.row === 1) {
                            textToolip = "Quantidade de packs distribuidos por filial";
                            return '<span class="metricaTooltip" data-toggle="tooltip" data-placement="right" data-container="body" title="' + textToolip + '">' + data + '</span>';
                        }
                        if (meta.row === 2) {
                            textToolip = "Quantidade de produtos distribuidos por filial";
                            return '<span class="metricaTooltip" data-toggle="tooltip" data-placement="right" data-container="body" title="' + textToolip + '">' + data + '</span>';
                        }
                        if (meta.row === 3) {
                            textToolip = "Custo total da compra por filial";
                            return '<span class="metricaTooltip" data-toggle="tooltip" data-placement="right" data-container="body" title="' + textToolip + '">' + data + '</span>';
                        }
                        if (meta.row === 5) {
                            textToolip = "Participação em vendas por filial planejado no OTB";
                            return '<span class="metricaTooltip" data-toggle="tooltip" data-placement="right" data-container="body" title="' + textToolip + '">' + data + '</span>';
                        }
                        if (meta.row === 6) {
                            textToolip = "Participação por cobertura para as filial planejado no OTB";
                            return '<span class="metricaTooltip" data-toggle="tooltip" data-placement="right" data-container="body" title="' + textToolip + '">' + data + '</span>';
                        }
                        if (meta.row === 7) {
                            textToolip = "Quantidade de vendas para as filial planejado no OTB";
                            return '<span class="metricaTooltip" data-toggle="tooltip" data-placement="right" data-container="body" title="' + textToolip + '">' + data + '</span>';
                        }
                        if (meta.row === 8) {
                            textToolip = "Quantidade em estoque para as filial planejado no OTB";
                            return '<span class="metricaTooltip" data-toggle="tooltip" data-placement="right" data-container="body" title="' + textToolip + '">' + data + '</span>';
                        }
                        if (meta.row === 9) {
                            textToolip = "Quantidade em carteira para as filial planejado no OTB";
                            return '<span class="metricaTooltip" data-toggle="tooltip" data-placement="right" data-container="body" title="' + textToolip + '">' + data + '</span>';
                        }
                        if (meta.row === 10) {
                            textToolip = "Valor médio de vendas para as filial planejado no OTB";
                            return '<span class="metricaTooltip" data-toggle="tooltip" data-placement="right" data-container="body" title="' + textToolip + '">' + data + '</span>';
                        }
                        else {
                            return data;
                        }
                    }
                    else {
                        return data;
                    }
                }
            },

        ],
        "language": {
            "emptyTable": "Nenhum produto encontrado",
            "zeroRecords": "Nenhum produto corresponde ao filtro",
        },
        "createdRow": function (row, data, dataIndex) {
            if (dataIndex === 0 || dataIndex === 4) {
                $(row).addClass('ocultarElemento');
            }
            if (dataIndex === 1) {
                $(row).find('td:not(:first)').addClass('qtdPackFilial');
                $(row).find('td:last').removeClass('qtdPackFilial');
                var idTbRefPack = this.api().context[0].sTableId.replace('tblGrpPack', 'txtQtdGrpPack');
                if (parseInt($('#' + idTbRefPack).val()) !== data.total) {
                    $(row).find('td:last').addClass('invalido')
                } else {
                    $(row).find('td:last').removeClass('invalido')
                }
            }

        },
        "drawCallback": function (settings) {
            var api = this.api();
            var rows = api.rows().nodes();
            var colSpan = $(rows).find('td').length;
            $(rows).eq(5).before(
                '<tr class="groupOtb"><td colspan="' + colSpan + '">Planejamento OTB</td></tr>'
            );
            $(function () {
                $('[data-toggle="tooltip"]').tooltip();
            });
        },
        "info": false,
        destroy: true,
        data: dadosPk,
        columns: colunmsPk
    });
    var $inputGrp = $('#' + idTabelaDist.replace('tblGrpPack', 'txtQtdPackGrupo'))

    tbDistribuicao.columns.adjust().draw();
}
function carregarPackCad(id, qtd, qtdTabela) {
    var tbCadPackNovo = $('#' + id).DataTable({
        paging: false, /* define se a tabela deve usar paginação */
        searching: false, /* define se deve usar o campo Buscar dentro da tabela */
        lengthChange: false,
        rowsGroup: [-1, 0],
        destroy: true,
        ordering: false,
        scrollCollapse: true,
        deferRender: true,
        responsive: true,
        data: geraCargaPackNovo(qtd.texto),
        "columnDefs": [
            {
                "targets": "groupHeaderTableRigth",
                "orderable": false,
                'className': 'dt-body-center groupHeaderTableRigth'
            },
        ],
        "info": false,
        columns: geraColunaPackCadastrado()
    })
    recalculaTotalColunas(tbCadPackNovo);
    tabelaPackCadastrados.push({
        'idTabela': id,
        'dadosLinha': tbCadPackNovo.rows().data(),
        'qtdPck': qtd.texto,
        'packGrupos': qtd.grupos,
        'distOriginal': qtd
    });
    recalculaDistCustos()
    console.log(tabelaPackCadastrados);
    tbCadPackNovo.columns.adjust().draw();

}
function carregarPackPedidoCadastrado(id, qtd, dados, colunas) {
    var tbCadPackNovo = $('#' + id).DataTable({
        paging: false, /* define se a tabela deve usar paginação */
        searching: false, /* define se deve usar o campo Buscar dentro da tabela */
        lengthChange: false,
        rowsGroup: [-1, 0],
        destroy: true,
        ordering: false,
        scrollCollapse: true,
        deferRender: true,
        responsive: true,
        data: dados,
        "columnDefs": [
            {
                "targets": "groupHeaderTableRigth",
                "orderable": false,
                'className': 'dt-body-center groupHeaderTableRigth'
            },
        ],
        "info": false,
        columns: colunas
    })
    recalculaTotalColunas(tbCadPackNovo);
    tabelaPackCadastrados.push({
        'idTabela': id,
        'dadosLinha': tbCadPackNovo.rows().data(),
        'qtdPck': qtd.texto,
        'packGrupos': qtd.grupos,
        'distOriginal': qtd
    });
    recalculaDistCustos()
    console.log(tabelaPackCadastrados);
    tbCadPackNovo.columns.adjust().draw();

}
function carregarPackGradeAtualizada(id, config) {
    var tbCadPackNovo = $('#' + id).DataTable({
        paging: false, /* define se a tabela deve usar paginação */
        searching: false, /* define se deve usar o campo Buscar dentro da tabela */
        lengthChange: false,
        rowsGroup: [-1, 0],
        destroy: true,
        ordering: false,
        scrollCollapse: true,
        deferRender: true,
        responsive: true,
        data: config.dados,
        "columnDefs": [
            {
                "targets": "groupHeaderTableRigth",
                "orderable": false,
                'className': 'dt-body-center groupHeaderTableRigth'
            },
        ],
        "info": false,
        columns: config.colunas
    })
    recalculaTotalColunas(tbCadPackNovo);
    recalculaDistCustos();
    return tbCadPackNovo;


}
function validaNovoProduto(passo, currentStepObj) {
    switch (passo) {
        case 1:
            return true;
        case 2:
            return validaGrade();
        case 3:
            return validaPacksCadastradosExiste();
        case 4:
            criaDistribuicaoFilial()
            return true;
        case 5:
            return true;
    }
}

function addGrupo(novoPack) {

    $.confirm({
        icon: 'fa fa-pie-chart',
        type: 'blue',
        title: 'Seleção de Grupos!',
        content: function () {
            var self = this;
            return $.ajax({
                url: urlApi + 'gerenciamento/compra/BuscaGruposCadastrado',
                dataType: 'json',
                beforeSend: function (req) {
                    req.setRequestHeader('Authorization', sessionStorage.getItem("token"));
                },
                method: 'get'
            }).done(function (response) {
                var sourceGrupo = "";
                $.each(response, function (index, value) {
                    sourceGrupo += "<option data-tokens='" + value.token + "' value='" + value.valor + "'>" + toTitleCase(value.descricao) + "</option>";
                });
                var contentOpt = '<div class="form-group">' +
                    '<label class="control-label">Selecione os Grupo para Distribuição:</label>' +
                    '<select id="drpGrupoDistribuicao" data-container=".jconfirm" class="selectpicker show-tick form-control" multiple data-live-search="true" title="Selecione um grupo..." data-width="100%" data-size="5">' +
                    sourceGrupo + '</select>' +
                    '</div>';
                self.setContent(contentOpt);

            }).fail(function () {
                self.setTitle('Falha ao Carregar Grupos!');
                self.setIcon('fa fa-exclamation-circle');
                self.setType('red')
                self.setContent('Clique em voltar e tente novamente.');
            });
        },
        buttons: {
            confirm: {
                text: 'Concluir',
                btnClass: 'btn-success',
                isHidden: true,
                action: function () {
                    if (novoPack) {
                        dadosPck = {};
                    }
                    dadosPck.grupos = $('#drpGrupoDistribuicao').val();
                    dadosPck.texto = 0;
                    var objEnvio = dadosPck;
                    var param = {};
                    param.idGrupo = $('#drpGrupoDistribuicao').val().join(',');
                    param.secoes = $('#drpSec').val().split('-')[0];
                    param.especies = $('#drpEsp').val().split('-')[0];
                    var dataEntregaPrev = new Date(moment($('#txtDtEntregaPed').data('daterangepicker').endDate.toDate()).add(-1, 'month'));
                    if (cadastroNovoSession) {
                        param.mes = dataEntregaPrev.getMonth() + 1
                        param.ano = dataEntregaPrev.getFullYear() - 1;
                    }
                    else {
                        param.mes = new Date().getMonth();
                        param.ano = new Date().getFullYear();
                    }
                    retornaDadosGrpFilDist(param, objEnvio);
                    dadosPck = null;
                    //finalizaPackCadastrado(objEnvio);
                }
            },
            cancel: {
                text: 'Cancelar',
                btnClass: 'btn-danger',
                action: function () {
                    validaRetornaGrade();
                }
            },
            after: {
                text: 'Depois',
                btnClass: 'btn-primary',
                action: function () {
                    dadosPck = {};
                    dadosPck.grupos = [];
                    dadosPck.texto = 0;
                    var objEnvio = dadosPck;
                    dadosPck = null;
                    finalizaPackCadastrado(objEnvio);
                }
            }
        },
        onContentReady: function () {
            var self = this;
            this.$content.find('#drpGrupoDistribuicao').selectpicker();
            if (novoPack) {
                self.buttons.after.show();
            } else {
                self.buttons.after.hide();
                this.$content.find('#drpGrupoDistribuicao').selectpicker('val', dadosPck.grpsSelecionados);
                delete dadosPck.grpsSelecionados;
            }
            this.$content.find('#drpGrupoDistribuicao').change(function () {
                if ($('#drpGrupoDistribuicao').val()) {
                    self.buttons.confirm.show();
                } else {
                    self.buttons.confirm.hide();
                }
            });
        },
    });

}
function finalizaPackCadastrado(qtd) {

    criarTabelaPackCadastrado(qtd);

    console.log(tabelaPackCadastrados)

};
function validaRetornaGrade() {
    if (tabelaPackCadastrados.length === 0) {
        $('#wizard-cad-ped li a[href="#tabGrade"]').tab('show');
    }

}
function validaQtdPckCad(valor) {
    var retorno = {};
    if (!valor) {
        retorno.texto = 'Informe uma quantidade para prosseguir!';
        retorno.status = false;
    }
    else if (parseInt(valor) <= 0) {
        retorno.texto = 'O valor informado deve ser maior que 0!'
        retorno.status = false;
    }
    else {
        retorno.texto = parseInt(valor);
        retorno.status = true;
    }
    return retorno;
}
function criaDistribuicaoFilial() {
    //tbDistribuicao.destroy();
    $("#tblRedistribuirProduto").html('');
    $("#tblRedistribuirProduto").html(criaTabelaDistribuicao());
    carregarDistribuicaoFilial()

}
function validaPacksCadastradosExiste() {
    var isValido = tabelaPackCadastrados.length > 0;
    if (!isValido) {
        erroCadCompra("É necessário cadastrar ao menos um pack para prosseguir!", "alertCadPack");
    } else {
        for (var i = 0; i < tabelaPackCadastrados.length; i++) {
            var tabelaTotal = $('#' + tabelaPackCadastrados[i].idTabela).dataTable().api()
            var indTotal = retornaQtdDadosJson(tabelaPackCadastrados[i].dadosLinha[0]);
            retornaTotalPackCadastrado(tabelaTotal, (indTotal - 1));
        }
    }
    return isValido;
}
function addLinhaTabela(tabela, dado) {
    tabela.row.add(
        dado
    ).draw();
}

function criarTabelaPackCadastrado(qtd) {
    var tables = $('table.tbPackCad')
        .filter(function (index) {
            return $(this).hasAttr('id') && $(this).attr("id").length > 0;
        });
    var qtdTabela = 1;
    if (tables.length) {
        var idTbNova = parseInt($(tables[tables.length - 1]).attr("id").replace(/\D/g, "")) + 1;
        console.log(idTbNova);
        qtdTabela = parseInt($(tables[tables.length - 1]).attr("id").replace(/\D/g, "")) + 1;
    }
    $('#grupoPackCadastrados').removeClass('ocultarElemento');
    criarAbaPackCadastrado(qtdTabela, qtd);
    carregarPackCad("tblPackCad" + qtdTabela, qtd, qtdTabela);
}
function geraColunaDistribuicao(filiais) {
    var colunasDistribuicao = [{ "data": "descricao" }];
    for (var i = 0; i < filiais.length; i++) {
        colunasDistribuicao.push({ "data": "filial" + (i + 1) });
    }
    colunasDistribuicao.push({ "data": "total" });
    return colunasDistribuicao;
}
function geraColunaPack() {
    var colunasPack = [{ "data": "referencia", 'className': 'separaDireita' }, { "data": "cores", 'className': 'separaDireita' }];
    for (var i = 0; i < tamanhosGrade.length; i++) {
        colunasPack.push({ "data": "tamanho" + converterFormatoVariavel(tamanhosGrade[i]), 'className': 'qtdPack separaDireita' });
    };
    colunasPack.push({ "data": "totalCor", 'className': 'separaDireita' });
    return colunasPack;
}
function geraColunaGradeDinamica() {
    var retorno = [];
    if (referenciaGrade.length) {
        retorno.push({ "data": 'referencia', 'className': 'separaDireita' });
    }
    if (coresGrade.length) {
        retorno.push({ "data": 'cores', 'className': 'separaDireita' });
    }
    for (var i = 0; i < tamanhosGrade.length; i++) {
        retorno.push({ "data": "tamanho" + converterFormatoVariavel(tamanhosGrade[i]), 'className': 'separaDireita' });
    };
    return retorno;
}
function geraColunaPackCadastrado() {
    var colunasPack = [{ "data": "referencia", 'className': 'separaDireita' }, { "data": "cores", 'className': 'separaDireita' }];
    for (var i = 0; i < tamanhosGrade.length; i++) {
        colunasPack.push({ "data": "tamanho" + converterFormatoVariavel(tamanhosGrade[i]), 'className': 'qtdPack separaDireita' });
    };
    colunasPack.push({ "data": "totalCor", 'className': 'numInt separaDireita' }, { "data": "qtdPack", 'className': 'qtdPackCadastrado separaDireita' });
    return colunasPack;
}
function atualizaDadosTxtBox() {
    var tbPlanejamento = $('#' + gridNome).dataTable().api();
    var txtref = $('#' + gridNome).find('.txtInteiro')

    if (txtref.length) {
        var param = parseInt(txtref.val());
        if (isNaN(param) || param < 0) {
            $('#' + gridNome).find('.txtInteiro').focus().select();
        } else {
            var txtPackGrp = gridNome.replace('tbl', 'txtQtd');

            if (parseInt($('#' + txtPackGrp).val()) < param) {
                $(cell).html(valorInicialPed)
                $("html, body").animate({ scrollTop: 0 }, "slow");
                erroCadCompra("A quantidade de packs em uma filial não pode ser superior ao limite para esse grupo!", "alertCadPack");

            }
            else if (!validaAlteracaoFilial(tbPlanejamento.row(row).data(), col, param, parseInt($('#' + txtPackGrp).val()))) {
                $(cell).html(valorInicialPed)
                $("html, body").animate({ scrollTop: 0 }, "slow");
                erroCadCompra("A quantidade informada somada a quantidade das filiais anteriores excede o limite de packs para esse grupo!", "alertCadPack");
            }
            else {
                if (parseInt(txtref.val()) === parseInt(valorInicialPed))
                    $(cell).html(valorInicialPed);
                else
                    $(cell).html(txtref.val());
                if (param !== parseInt(valorInicialPed)) {

                    var tbPrincipal = 'tblPackCad' + gridNome.split('_')[1];
                    var indiceGrupo = parseInt(gridNome.split('_')[0].replace(/\D/g, ""));
                    var idFilialAtualizada = tbPlanejamento.row(row - 1).data()['filial' + col];
                    //['filial' + col]
                    tabelaPackCadastrados.map(obj => {
                        if (obj.idTabela === tbPrincipal) {
                            for (var i = 0; i < obj.packGrupos.length; i++) {
                                if (obj.packGrupos[i].idGrupo === indiceGrupo) {
                                    var qtdGrupoEditar = obj.packGrupos[i].qtdParticipacaoGrupo;
                                    if (!qtdGrupoEditar) {
                                        qtdGrupoEditar = obj.packGrupos[i].qtdGrupoCadastrada;
                                    }
                                    obj.packGrupos[i].filiais = recalcPckFilialAlterada(idFilialAtualizada, obj.packGrupos[i].filiais, param, qtdGrupoEditar);
                                    var dadosOrganizado = transposeObjetoDistribuicaoPack(obj.packGrupos[i].filiais)
                                    var qtdParticipacaoFilial = dadosOrganizado.qtdParticipacaoFilial;
                                    if (!qtdParticipacaoFilial) {
                                        qtdParticipacaoFilial = dadosOrganizado.qtdePack;
                                    }
                                    var dadosPk = [
                                        dadosOrganizado.idFilial,
                                        qtdParticipacaoFilial,
                                        dadosOrganizado.totalItens,
                                        dadosOrganizado.totalCusto,
                                        dadosOrganizado.partAtualizada,
                                        dadosOrganizado.partVendas,
                                        dadosOrganizado.partCobertura,
                                        dadosOrganizado.qtdeVenda,
                                        dadosOrganizado.qtdeEstoque,
                                        dadosOrganizado.qtdeCarteira,
                                        dadosOrganizado.vlrMedio
                                    ];
                                    dadosPck = recalculaTotalLinhaFiliais(dadosPk)

                                    tbPlanejamento.clear();
                                    tbPlanejamento.data(tbPlanejamento).rows.add(dadosPk);
                                    tbPlanejamento.draw();
                                }
                            }
                        }

                        return obj;
                    })
                }
            }
        }
    }
}
function atualizaDadosPack() {
    var tbPlanejamento = $('#' + gridNome).dataTable().api();
    var param = parseInt($('#' + gridNome).find('.txtInteiro').val());
    if (isNaN(param) || param < 0) {
        $('#' + gridNome).find('.txtInteiro').focus().select();
    } else {
        (($('#' + gridNome).find('.txtInteiro').val() === valorInicialPed) ? $(cell).html(valorInicialPed) : $(cell).html($('#' + gridNome).find('.txtInteiro').val()));
        if (param !== parseInt(valorInicialPed)) {
            tbPlanejamento.rows().every(function (rowIdx, tableLoop, rowLoop) {
                var data = this.data();
                data.qtdPack = param;
            });
            tbPlanejamento.columns.adjust().draw();
            tbPlanejamento.rowsgroup.update();
            tabelaPackCadastrados.map(obj => {
                if (obj.idTabela === gridNome) {
                    obj.qtdPck = param;
                    if ($('ul#tabDadosDist' + gridNome.replace('tblPackCad', '') + ' li').length > 1) {
                        obj.packGrupos = calculaDistribuicaoTotalPackGrp(obj.packGrupos, param);
                        recalcPackGrpsFiliais(gridNome.replace('tblPackCad', ''), obj.packGrupos);

                    }

                }
                return obj;
            })
            console.log(tabelaPackCadastrados)
        }
    }

}
function perdeFoco() {
    var tbPlanejamento = $('#' + gridNome).dataTable().api();

    var colunaAtualizada = "tamanho" + $(tbPlanejamento.column(col).header()).html();
    var txtref = $('#' + gridNome).find('.txtInteiro')
    var param = parseInt(txtref.val());
    if (isNaN(param)) {
        param = 0;
        valorInicial = 0
        txtref.val('0')
    }
    ((txtref.val() === valorInicial) ? $(cell).html(valorInicial) : $(cell).html(txtref.val()));
    if (param !== parseInt(valorInicial)) {
        tbPlanejamento.row(row).data()[colunaAtualizada] = param;
        recalculaTotalLinha(tbPlanejamento);
        recalculaTotalColunas(tbPlanejamento);
        tbPlanejamento.rows().invalidate().draw()
        recalculaDistCustosPackAtualizado(gridNome);
    }
    if (avanca) {
        avanca = false;
        cell = $(cell).next('td.qtdPack');
        if ($(cell).html()) {
            col = $(cell).parent().children().index($(cell));
            row = $(cell).parent()[0];
            valorInicial = $(cell).html();
            $(cell).html(geraEditor(1, $(cell).html()));
            $(cell).find('input[type="text"]').focus().select();
        }

    }

}
function bloqueiaRefreshQtdPack(elemento, evento) {
    var code = (evento.keyCode ? evento.keyCode : evento.which);
    if (code === 9 || code === 13) {
        avanca = true;
        $(elemento).blur();
    }
}
function addLinhaOpcaoCores(corClasses, corNome) {
    var corDescricao = corNome;
    var opcaoCor = "<option value='" + corDescricao + "' selected data-content='", styleCircle = '';
    if (corClasses.length === 1) {
        styleCircle = 'style="color: transparent;background: linear-gradient(to right, ' + corClasses[0] + ' 0%,' + corClasses[0] +
            ' 100%);border-radius: 50%;border: 1px solid black;"';
    }
    else if (corClasses.length === 2) {
        styleCircle = 'style="color: transparent;background: linear-gradient(to right, ' + corClasses[0] + ' 0%,' + corClasses[0] + ' 50%,'
            + corClasses[1] + ' 50%,' + corClasses[1] +
            ' 100%);border-radius: 50%;border: 1px solid black;"';
    }
    else if (corClasses.length === 3) {
        styleCircle = 'style="color: transparent;background: linear-gradient(to right, ' + corClasses[0] + ' 0%,' + corClasses[0] + ' 33.3%,'
            + corClasses[1] + ' 33.3%,' + corClasses[1] +
            ' 66.6%,' + corClasses[2] + ' 66.6%, ' + corClasses[2] +
            ' 100%);border-radius: 50%;border: 1px solid black;"';
    }
    opcaoCor += '<span style="font-size:17px;">' +
        '<i class="fa fa-circle" ' + styleCircle + '></i></span> ' +
        corDescricao + '\'/> ' + corDescricao + '</option>';
    $("#drpCoresGrade").append(opcaoCor);
    ordenaOpcao();
    $("#drpCoresGrade").selectpicker('refresh');

}
function checaCorCadastrada(corCadastrar) {
    var retorno = false, listaValores = [];

    $("#drpCoresGrade option").each(function () {
        listaValores.push($(this).val().toLowerCase());
    });
    if (listaValores.includes(corCadastrar.toLowerCase())) {
        var source = [];
        if ($('#drpCoresGrade').val()) {
            source = $('#drpCoresGrade').val();
        }
        source.push(toTitleCase(listaValores[listaValores.indexOf(corCadastrar.toLowerCase())]));
        console.log(source)
        $('#drpCoresGrade').selectpicker('val', source);
        erroCadCompra("A cor que está tentando cadastrar já existe nas opções e não é possivel adiciona-la. O sistema selecionou automaticamente a opção.", "alertCadGrade");
        retorno = true;
    }
    return retorno;
}
function mixNomeCorMultipla(str) {
    var retorno = '';
    str = str.toLowerCase().replace(/\b[a-z]/g, function (letter) {
        return letter.toUpperCase();
    });
    $("#drpCoresGrade option").filter(function () {
        var textCor = $.trim($(this).text());
        if (textCor === str) {
            retorno = $(this).val();
        }
    });
    return retorno;
}
function atualizaInputCor(indice, descricao, valorInicial) {
    var arrValorInicial = valorInicial.split('/');
    if (arrValorInicial.length < indice) {
        arrValorInicial[indice - 1] = '';
    }
    if (arrValorInicial[indice - 1].length === 0) {
        arrValorInicial[indice - 1] = toTitleCase(descricao);
    }
    if (indice < 3) $("#txtHexNovaCor" + (indice + 1)).spectrum('enable');

    return arrValorInicial.join('/');
}
function retornaTamanhosSelecionados() {
    tamanhoTexto = [];
    if ($('#drpTamanhoGrade').val()) {
        var selecionados = $('#drpTamanhoGrade').val();
        for (var i = 0; i < selecionados.length; i++) {
            var objTam = {};
            var valoresTam = $("#drpTamanhoGrade option[value='" + selecionados[i] + "']").attr('data-tokens').split(',');
            objTam.descricao = valoresTam[1].toUpperCase();
            objTam.id = parseInt(valoresTam[0]);

            tamanhoTexto.push(objTam);
        }
    }
}
function atualizaCbClassificacao() {

    if ($('#drpClassificacao').val()) {
        var selecionado = $('#drpClassificacao').val();
        var valoresPisCofins = $("#drpClassificacao option[value='" + selecionado + "']").attr('data-tokens').split(';')[0].split(',');
        var pis = valoresPisCofins[0].replace('.', ',');
        var cofins = valoresPisCofins[1].replace('.', ',');
        $('#txtPisPercPed').val(pis).maskMoney('mask');
        $('#txtCofinsPercPed').val(cofins).maskMoney('mask');
        calculaAlteracaoCusto();
    }
}
function retornaCoresSelecionadas() {
    var retorno = [];
    coresNovasCadastradas = [];
    if ($('#drpCoresGrade').val()) {
        var selecionados = $('#drpCoresGrade').val();
        for (var i = 0; i < selecionados.length; i++) {
            var objCorEnvio = {};
            var corSelecionada = $.trim($("#drpCoresGrade option[value='" + selecionados[i] + "']").text());
            var circulo = $("#drpCoresGrade option[value='" + selecionados[i] + "']").attr('data-content');
            var corToken = $("#drpCoresGrade option[value='" + selecionados[i] + "']").attr('data-tokens');
            corToken ? objCorEnvio.idCor = parseInt(corToken.split(' ')[0]) : objCorEnvio.idCor = 0;
            objCorEnvio.descricao = corSelecionada;
            objCorEnvio.corRGB = recuperaRgb($(circulo).find('i').css('background'));
            coresNovasCadastradas.push(objCorEnvio);
            retorno.push(corSelecionada);
        }
    }
    return retorno.sort();
}
function ordenaOpcao() {
    var options = $('#drpCoresGrade option');
    var arr = options.map(function (_, o) {
        return $(o).text()
    }).get();
    arr.sort(function (o1, o2) {
        return o1.toUpperCase() > o2.toUpperCase() ? 1 : o1.toUpperCase() < o2.toUpperCase() ? -1 : 0;
    });
    var ordenado = [];
    for (var i = 0; i < arr.length; i++) {
        options.map(function (_, o) {
            if ($(o).text().toUpperCase() == arr[i].toUpperCase()) {
                ordenado.push(o)
            }
            return $(o).text() == arr[i]
        }).get();
    }
    $('#drpCoresGrade').html('');
    for (var i = 0; i < ordenado.length; i++) {
        $('#drpCoresGrade').append(ordenado[i]);

    }
}

function validaReferenciaCadastrada(ref) {
    var listaReferencia = [], retorno = false, listaValores = [];

    $("#drpReferenciaGrade option").each(function () {
        listaReferencia.push($(this).val().toUpperCase());
    });
    if (listaReferencia.includes(ref.toUpperCase())) {
        var source = [];
        if ($('#drpReferenciaGrade').val()) {
            source = $('#drpReferenciaGrade').val();
        }
        source.push(listaReferencia[listaReferencia.indexOf(ref.toUpperCase())]);
        $('#drpReferenciaGrade').selectpicker('val', source);
        erroCadCompra("A referência que está tentando cadastrar já existe nas opções e não é possivel adiciona-la. O sistema selecionou automaticamente a opção.", "alertCadGrade");
        retorno = true;
    }
    return retorno;
}
function exibeProdCarteira(qtdSobraProd) {
    if (qtdSobraProd > 0) {
        var msgSobra = ''
        if (qtdSobraProd > 1) {
            msgSobra = qtdSobraProd + ' produtos serão direcionados para a carteira, pois não possuem quantidade suficiente para formar um pack!';
        } else {
            msgSobra = qtdSobraProd + ' produto será direcionados para a carteira, pois não possue quantidade suficiente para formar um pack!';
        }
        $("#alertProdCarteira").html(msgSobra);
        if (!$("#alertProdCarteira").is(":visible")) {
            $("#alertProdCarteira").fadeIn(1000);
        }
    } else {
        $("#alertProdCarteira").fadeOut(1000)
        $("#alertProdCarteira").html('');
    }
    packNovo = false;
}
function ajustaTabela(tblAPI) {
    var datasourcenovo = tblAPI.data()
    tblAPI.clear();
    tblAPI.data(tblAPI).rows.add(datasourcenovo);
    tblAPI.columns.adjust().draw();
    tblAPI.fixedHeader.adjust();
    tblAPI.rowsgroup.update();

}
//function gerar tabelas
function retornoRodape() {
    var tabelaHtml = '<tfoot><tr>' +
        '<th class="groupHeaderTable" colspan="2">Total</th>';
    for (var i = 0; i < tamanhosGrade.length; i++) {
        tabelaHtml += '<th class="groupHeaderTableRigth">0</th>'
    }
    tabelaHtml += '<th class="groupHeaderTable">0</th></tr></tfoot>';
    return tabelaHtml;
}
function retornoRodapeCadPack() {
    var tabelaHtml = '<tfoot><tr>' +
        '<th class="groupHeaderTable" colspan="2">Total</th>';
    for (var i = 0; i < tamanhosGrade.length; i++) {
        tabelaHtml += '<th class="groupHeaderTableRigth">0</th>'
    }
    tabelaHtml += '<th class="groupHeaderTable" style="border-right:none !important">0</th><th class="groupHeaderTable" style="border-left:none !important"></th></tr></tfoot>';
    return tabelaHtml;
}
function retornaTabela(id) {
    return '<table id="' + id + '" cellpadding="0" cellspacing="0" class="tbPackCad cell-border hover table cell nowrap stripe compact pretty"></table>';
}
function criarTabelaPack() {
    var tabelaHtml = '<thead><tr>' +
        '<th class="groupHeaderTable" rowspan="2">Referência</th>' +
        '<th class="groupHeaderTable" rowspan="2">Cores</th>' +
        '<th class="groupHeaderTable" colspan="' + (tamanhosGrade.length) + '">Tamanho</th>' +
        '<th class="groupHeaderTable numInt" rowspan="2" >Total</th>' +
        '</tr><tr>';
    for (var i = 0; i < tamanhosGrade.length; i++) {
        tabelaHtml += '<th class="groupHeaderTableRigth separaDireita numInt">' + tamanhosGrade[i].toUpperCase() + '</th>'
    }
    tabelaHtml += '</tr></thead>' + retornoRodape();
    return tabelaHtml;
}
function criarTabelaPackDinamico() {
    var criaTbNova = false, tamHtml = '', reftml = '', corHtml = '', retornoHtml = '', isRowspan = tamanhosGrade.length;
    if (referenciaGrade.length) {
        if (isRowspan) {
            reftml += '<th class="groupHeaderTable" rowspan="2">Referência</th>';
        } else {
            reftml += '<th class="groupHeaderTable">Referência</th>';
        }
        criaTbNova = true;
    }
    if (coresGrade.length) {
        if (isRowspan) {
            corHtml += '<th class="groupHeaderTable" rowspan="2">Cores</th>';
        } else {
            corHtml += '<th class="groupHeaderTable">Cores</th>';
        }
        criaTbNova = true;
    }
    if (isRowspan) {
        tamHtml += '<th class="groupHeaderTable" colspan="' + (tamanhosGrade.length) + '">Tamanho</th>'
        criaTbNova = true;
    }
    if (criaTbNova) {
        retornoHtml = '<thead><tr>' + reftml + corHtml + tamHtml + '</tr>';
        if (tamHtml.length) {
            retornoHtml += '<tr>';
            for (var i = 0; i < tamanhosGrade.length; i++) {
                retornoHtml += '<th class="groupHeaderTableRigth separaDireita numInt">' + tamanhosGrade[i].toUpperCase() + '</th>'
            }
            retornoHtml += '</tr>';
        }
        retornoHtml += '</thead>';

    }
    return retornoHtml;
}
function criarTabelaPackCadastrada() {
    var tabelaHtml = '<thead><tr>' +
        '<th class="groupHeaderTable" rowspan="2">Referência</th>' +
        '<th class="groupHeaderTable" rowspan="2">Cores</th>' +
        '<th class="groupHeaderTable" colspan="' + (tamanhosGrade.length) + '">Tamanho</th>' +
        '<th class="groupHeaderTable numInt sumItem" rowspan="2" >Total</th>' +
        '<th class="groupHeaderTable" rowspan="2" >Qtd. Pack Cadastrada</th>' +
        '</tr><tr>';
    for (var i = 0; i < tamanhosGrade.length; i++) {
        tabelaHtml += '<th class="groupHeaderTableRigth separaDireita numInt">' + tamanhosGrade[i].toUpperCase() + '</th>'
    }
    tabelaHtml += '</tr></thead>' + retornoRodapeCadPack();
    return tabelaHtml;
}
function criaTabelaDistribuicao(colunas) {
    var tabelaHtml = '<thead><tr>' +
        '<th class="groupHeaderTable">Dados</th>';
    for (var i = 0; i < colunas.length; i++) {
        tabelaHtml += '<th class="groupHeaderTable">' + colunas[i].nome + '</th>'
    }
    tabelaHtml += '<th class="groupHeaderTable">Total/Média</th>'

    tabelaHtml += '</tr></thead>';
    return tabelaHtml;
}


function carregaDropDownTamanho(arrayRef, tipo) {
    sourceTamanho = '';
    $.each(arrayRef[tipo], function (index, value) {
        sourceTamanho += '<option data-tokens="' + value.token + '" value="' + value.valor +
            '" data-content="<span style=\'font-size: 12px;\'><img style=\'width:12px;height:12px;\' src=\'../Assets/images/1_front.png\' /> ' +
            value.descricao + '</span>">' + value.descricao + '</option>';
    });
    $('#drpTamanhoGrade').html(sourceTamanho);
    $("#drpTamanhoGrade").selectpicker('refresh');

}
function atualizaDrpDownTamanho() {
    var categoria = $('#frmGradeTam2 .phradio input[name=radioCat]:checked').val(), tipo = $('#frmGradeTam3 .phradio input[name=radioTipo]:checked').val(), arrayTamRef;
    $('input[name=radioCat]:checked')
    $('input[name=radioTipo]:checked')
    switch (categoria) {
        case "calcado":
            arrayTamRef = tamanhoCalcados;
            break;
        case "confeccao":
            arrayTamRef = tamanhoConfeccao;
            break;
    }
    carregaDropDownTamanho(arrayTamRef, tipo)
}

function cadastraReferencia(valor) {
    var opcaoReferencia = '<option value="{valor}" selected data-content="<span style=\'font-size: 12px;\'><i style=\'font-size: 12px !important;width:12px !important;height:12px !important;\' class=\'glyphicon glyphicon-tags\' aria-hidden=\'true\'></i>&nbsp;&nbsp;{valor}</span>">{valor}</option>';
    var retorno = opcaoReferencia.replace(/\{valor}/g, valor);
    return retorno;
}

function geraCargaCadastroPack() {
    var dadosPack = [];
    for (var i = 0; i < referenciaGrade.length; i++) {
        for (var j = 0; j < coresGrade.length; j++) {
            var linhaPackNovo = {};
            linhaPackNovo.referencia = referenciaGrade[i];
            linhaPackNovo.cores = coresGrade[j];
            for (var k = 0; k < tamanhosGrade.length; k++) {
                linhaPackNovo["tamanho" + converterFormatoVariavel(tamanhosGrade[k])] = 0;
            }
            linhaPackNovo.totalCor = 0;
            dadosPack.push(linhaPackNovo)
        }
    }
    return dadosPack;
}


function geraCargaPackNovo(qtd) {
    var datasourcenovo = [];
    for (var i = 0; i < referenciaGrade.length; i++) {
        for (var j = 0; j < coresGrade.length; j++) {
            var linhaPackNovo = {};
            linhaPackNovo.referencia = referenciaGrade[i];
            linhaPackNovo.cores = coresGrade[j];
            for (var k = 0; k < tamanhosGrade.length; k++) {
                linhaPackNovo["tamanho" + converterFormatoVariavel(tamanhosGrade[k])] = 0;
            }
            linhaPackNovo.totalCor = 0;
            linhaPackNovo.qtdPack = qtd;
            datasourcenovo.push(linhaPackNovo)
        }
    }
    return datasourcenovo;
}
function criaPainelRelatorio(id, titulo) {
    return '<div class="row"><fieldset id="' + id + '" class="collapsible cadPackForm"><legend>' + titulo +
        '&nbsp; &nbsp;</legend><div class="field-body"><div class="col-md-12 col-sm-12 col-xs-12 table-responsive"></div></div></fieldset></div>'
}

function criaPainelPackCadConfirmado(id, titulo) {
    return '<fieldset id="frm' + id + '" class="coolfieldset">' +
        '<legend id="lgd' + id + '">' + titulo + '</legend>' +
        '<div class="col-md-12 col-sm-12 col-xs-12 table-responsive"></div>' +
        '</fieldset>';


}
function validaMudancaGrade() {

    //if (tabelaPackCadastrados.length > 0) {
    //    var tabs = $("#tabPacksCad li:not(:last)");
    //    $.each(tabs, function () {
    //        var tabID = $(this).find('a').attr('href');
    //        var $tabRemover = $(this);
    //        $tabRemover.remove();
    //        $(tabID).remove();
    //    })
    //    tabelaPackCadastrados = [];
    //    $('#grupoPackCadastrados').addClass('ocultarElemento');
    //}
}
function reiniciaPackcadastrado() {

}
function redistribuirAtualizacao(tbPlanejamento) {
    var colunaIndex = 2;
    for (var i = 0; i < tabelaPackCadastrados.length; i++) {

        var totalGrid = tbPlanejamento
            .column(colunaIndex)
            .data()
            .reduce(function (a, b) {
                return a + b;
            });
        calculaSobressalenteQtdPedido(totalGrid, tabelaPackCadastrados[i].qtdPck, tbPlanejamento, i);
        colunaIndex = colunaIndex + 2;
    }
    atualizaQtdDistribuicaoPedido(tbPlanejamento);

}
function criaPaletas() {
    $("input[name=txtHexNovaCor]").spectrum({
        showPaletteOnly: true,
        showPalette: true,
        palette: nomesCoresCSS,
        appendTo: '#principal',
        disabled: true,
        preferredFormat: "rgb",
        hideAfterPaletteSelect: true,
        allowEmpty: true,
        change: function (color) {
            if (color) {
                var idInput = parseInt($(this).attr('id').replace(/\D/g, "")), $txtInputCor = $("#txtNomeNovaCor");
                var indiceLinhaCor, indiceNomeCor, classeCor = color.toString().replace(/\s/g, ''), descCor, arrayDescCor = $("#txtNomeNovaCor").val().split('/');
                $.each(nomesCoresCSS, function (index, value) {
                    if (value.indexOf(classeCor) > -1) {
                        indiceLinhaCor = index;
                        indiceNomeCor = value.indexOf(classeCor);
                        return false;
                    }
                });
                var valInput = $txtInputCor.val();

                descCor = nomesCoresPtCSS[indiceLinhaCor][indiceNomeCor];
                $txtInputCor.val(atualizaInputCor(idInput, descCor, valInput));
            }

        }
    });
    $("#txtHexNovaCor1").spectrum('enable');

}
function criarFormaPgto(valor, idFrm) {
    return "<option value=\"" + idFrm + "\" data-content=\"<span style='font-size: 14px;'><i style='font-size: 14px !important;width:12px !important;height:12px !important;'" +
        "class='fa fa-money' aria-hidden='true'></i>&nbsp;&nbsp; " + valor + "</span>\">" + valor + "</option>";
}
function criarCondPgto(valor, desc, icone) {
    return "<option value=\"" + valor + "\" data-content=\"<span style='font-size: 14px;'><i style='font-size: 14px !important;width:12px !important;height:12px !important;'" +
        "class='fa fa-" + icone + "' aria-hidden='true'></i>&nbsp;&nbsp; " + desc + "</span>\">" + desc + "</option>";
}
function criarClassificacao(valor, token, desc) {
    return "<option data-tokens='" + token + "' value='" + valor + "'>" + desc + "</option>";
}
function criarTamanho(valor, token, desc, dadosAdicionais) {
    if (dadosAdicionais && dadosAdicionais.length) {
        return "<option value=\"" + valor + "\" data-tokens=\"" + token + "\" data-content=\"<span class='badge badge-danger' style='font-size: 12px;'><img style='width:12px;height:12px;' src='../Assets/images/1_front.png' /> " + desc + "</span>\">" + desc + "</option>";
  
    } else {
        return "<option value=\"" + valor + "\" data-tokens=\"" + token + "\" data-content=\"<span style='font-size: 12px;'><img style='width:12px;height:12px;' src='../Assets/images/1_front.png' /> " + desc + "</span>\">" + desc + "</option>";

    }
}
function repartirArray(arrayPaleta) {
    var index = 0;
    var arrayLength = arrayPaleta.length;
    var tempArray = [];

    for (index = 0; index < arrayLength; index += sizePaletaLine) {
        repartido = arrayPaleta.slice(index, index + sizePaletaLine);

        tempArray.push(repartido);
    }

    return tempArray;
}
function criarCor(valor, desc, token, cores) {
    var opcaoCor = "<option value='" + valor + "' data-tokens='" + token + "' data-content='", styleCircle = '';
    if (cores.length === 1) {
        if (cores[0] !== 'gradeInvalida') {
            styleCircle = 'style="color: transparent;background: linear-gradient(to right, rgb(' + cores[0] + ') 0%, rgb(' + cores[0] + ') 100%);border-radius: 50%;border: 1px solid black;"';
        } else {
            opcaoCor += '<span class="badge badge-danger" style="font-size:15px;"><i class="fa fa-ban"></i> ' +
                desc + '</span> \'/> ' + desc + '</option>';
            return opcaoCor;
        }
    }
    else if (cores.length === 2) {
        styleCircle = 'style="color: transparent;background: linear-gradient(to right, rgb(' + cores[0] + ') 0%, rgb(' + cores[0] + ') 50%, rgb('
            + cores[1] + ') 50%,rgb(' + cores[1] +
            ') 100%);border-radius: 50%;border: 1px solid black;"';
    }
    else if (cores.length === 3) {
        styleCircle = 'style="color: transparent;background: linear-gradient(to right, rgb(' + cores[0] + ') 0%, rgb(' + cores[0] + ') 33.3%, rgb('
            + cores[1] + ') 33.3%, rgb(' + cores[1] +
            ') 66.6%, rgb(' + cores[2] + ') 66.6%, rgb(' + cores[2] +
            ') 100%);border-radius: 50%;border: 1px solid black;"';
    }
    opcaoCor += '<span style="font-size:17px;">' +
        '<i class="fa fa-circle" ' + styleCircle + '></i></span> ' +
        desc + '\'/> ' + desc + '</option>';

    return opcaoCor;
}
function criarOptGrupoFiliais(valor) {
    return "<option value=\"Grupo " + valor + "\" data-content=\"<span style='font-size: 14px;'><i style='font-size: 14px !important;width:12px !important;height:12px !important;'" +
        "class='fa fa-sitemap' aria-hidden='true'></i>&nbsp;&nbsp;Grupo " + valor + "</span>\">Grupo " + valor + "</option>";
}

function criarTabGrupoFilial(grupos, indexPack) {
    var htmlContent = '<div class="tab-content clearfix" style="border: 1px solid blue !important;">';
    var ulHtml = '<div class="tabbable tabs-left"><ul id="tabDadosDist' + indexPack + '" class="nav nav-pills tabGrupoFilial">';

    for (var i = 0; i < grupos.length; i++) {
        var qtdGrupoPart = grupos[i].qtdParticipacaoGrupo;
        if (typeof qtdGrupoPart === 'undefined') {
            qtdGrupoPart = grupos[i].qtdGrupoCadastrada
        }
        var filtrosGrupo = retornaLinhaOpcoesGrupo(grupos[i].idGrupo + '_' + indexPack, qtdGrupoPart);
        ulHtml += '<li><a style="border: 1px solid blue !important;" href="#grupo' + grupos[i].idGrupo + '_'
            + indexPack + '" data-toggle="tab"><i class="fa fa-pie-chart" aria-hidden="true"></i> ' + toTitleCase(grupos[i].descricao) +
            '<button style="margin-left: 7px;color:red!important;opacity: 0.5;" data-toggle="tooltip" class="close" type="button" title="Excluir Grupo">×</button> </a></li>';
        var tbHtml = $.parseHTML(retornaTabela("tblGrpPack" + grupos[i].idGrupo + '_' + indexPack)), headerTb = criaTabelaDistribuicao(grupos[i].filiais);

        $(tbHtml).removeClass('tbPackCad').addClass('tbPackGrp').html(headerTb);
        htmlContent += '<div class="tab-pane" id="grupo' + grupos[i].idGrupo + '_' + indexPack +
            '"><div class="row"><div class="col-md-12 col-sm-12 col-xs-12 table-responsive">' + $(tbHtml).prop('outerHTML') + '</div></div>' + filtrosGrupo + '</div>';

    }
    ulHtml += '<li><a href="#" style="border: 1px solid blue !important;" class="add-grupo">+ Adicionar Novo Grupo</a></li></ul>' +
        htmlContent + '</div></div>';
    $('.span' + indexPack + ' .tabbable.tabs-left').remove();
    $('.span' + indexPack).append($.parseHTML(ulHtml));
    if ($('#tabDadosDist' + indexPack + ' li').length > 1) {
        $('#tabDadosDist' + indexPack + ' li').children('a').first().click();
        $(".selectpicker").selectpicker();
        var dataEntregaPrev = new Date(moment($('#txtDtEntregaPed').data('daterangepicker').endDate.toDate()).add(-1, 'month'));
        var dataInicialDist = '';
        var dataInicialDistAno = '';
        if (cadastroNovoSession) {
            dataInicialDist = dataEntregaPrev.getMonth() + 1
            dataInicialDistAno = dataEntregaPrev.getFullYear() - 1;
        }
        else {
            dataInicialDist = new Date().getMonth();
            dataInicialDistAno = new Date().getFullYear();
        }

        $(".filtroRedistribuirMes").selectpicker('val', dataInicialDist);
        $(".filtroRedistribuirAno").selectpicker('val', dataInicialDistAno);
        $(".ckbDistFilial").bootstrapSwitch();
        $('[data-toggle="tooltip"]').tooltip();
    }

}
function validaCorInput(cor) {
    var retorno = '', arrayCoresInput = cor.split('/');
    (arrayCoresInput.length === 2 && arrayCoresInput[0].length === 0) ||
        (arrayCoresInput.length === 3 && arrayCoresInput[1].length === 0) ||
        arrayCoresInput.length > 3 ? retorno = cor.slice(0, -1) : retorno = cor;
    return retorno;
}
function validaArrayCondPgto(arrayCondPgtoValidar) {
    var valorAnterior = arrayCondPgtoValidar[0], retorno = true;
    for (i = 1; i < arrayCondPgtoValidar.length; ++i) {
        if (parseInt(arrayCondPgtoValidar[i]) < parseInt(valorAnterior)) {
            retorno = false;
            break;
        } else {
            valorAnterior = arrayCondPgtoValidar[i];
        }
    }
    return retorno;
}
function carregaFormCadastroCompra() {
    $("#drpMarc").selectpicker('val', dadosCompraCadastro.idMarca);
    $("#drpMarc").attr('disabled', true);
    dadosCompraCadastro.secao ? $("#drpSec").selectpicker('val', dadosCompraCadastro.secao) : $("#drpSec").selectpicker('val', '');
    $("#drpSec").attr('disabled', true);
    dadosCompraCadastro.especie ? $("#drpEsp").selectpicker('val', dadosCompraCadastro.especie) : $("#drpEsp").selectpicker('val', '');
    $("#drpEsp").attr('disabled', true);
    $("#drpCNPJ").selectpicker('val', dadosCompraCadastro.cnpj);
    $("#drpCNPJ").attr('disabled', true);
    $("#txtProdutoPed").val(dadosCompraCadastro.codProduto);
    $("#txtCodOriPed").val(dadosCompraCadastro.codOriginal);
    $("#txtRefPed").val(dadosCompraCadastro.referencia);
    $("#txtDescPed").val(toTitleCase(dadosCompraCadastro.descricaoProduto));
    $("#txtDescResPed").val(toTitleCase(dadosCompraCadastro.descricaoReduzida));
    var $menuTitulo = $(".navbar.navbar-default.navbar-fixed-top");
    $menuTitulo.find('.navbar-header .navbar-center').text('Cadastro de Pré-Pedido');
}
function carragaFormListaProdCompra() {
    $("#drpEsp").attr('disabled', true);


    var $menuTitulo = $(".navbar.navbar-default.navbar-fixed-top");
    $menuTitulo.find('.navbar-header .navbar-center').text('Cadastro de Pré-Pedido');
}
function criaObjFiltroCadProd(opcao) {
    var retornoObj = {};
    if (opcao === 'marca') {
        $('#drpMarc').val() ? retornoObj.marcas = $('#drpMarc').val() :
            $('#drpCNPJ').val() ? retornoObj.idFornecedor = $('#drpCNPJ').val() :
                $('#drpSec').val() ? retornoObj.secoes = $('#drpSec').val().split('-')[0] : retornoObj = null;
    }
    if (opcao === 'secao') {
        $('#drpSec').val() ? retornoObj.secoes = $('#drpSec').val().split('-')[0] :
            $('#drpMarc').val() ? retornoObj.marcas = $('#drpMarc').val() :
                $('#drpCNPJ').val() ? retornoObj.idFornecedor = $('#drpCNPJ').val() : retornoObj = null;
    }
    if (opcao === 'fornecedor') {
        $('#drpCNPJ').val() ? retornoObj.idFornecedor = $('#drpCNPJ').val() :
            $('#drpMarc').val() ? retornoObj.marcas = $('#drpMarc').val() :
                $('#drpSec').val() ? retornoObj.secoes = $('#drpSec').val().split('-')[0] : retornoObj = null;
    }
    return retornoObj;
}
function iniciaAtualizacaoComboCad(alterado) {
    localStorage.setItem("combo", alterado);

    var filtro = criaObjFiltroCadProd(alterado);
    console.log(filtro);
    if (filtro)
        //filtro.secoes && !$('#drpMarc').val() && !$('#drpCNPJ').val() ?
        //atualizaSecaoCadastroNovoProdutoCompra(filtro) :

        atualizaFiltroCadastroNovoProdutoCompra(filtro);
    else cargaInicialGerenciamentoCompra('novo')

}
function carregaFormCadProdAtualizaFiltro(idFornecedor, secoes, marcas, especie) {
    $("#drpCNPJ").selectpicker('val', idFornecedor);
    $("#drpMarc").selectpicker('val', marcas);
    $("#drpSec").selectpicker('val', secoes);
    if ($('#drpSec').val()) {
        $("#drpEsp").selectpicker('val', especie);
        atualizaCodigoProduto();
        $("#drpEsp").attr('disabled', false);
    } else {
        $("#drpEsp").selectpicker('val', '');
        $("#drpEsp").attr('disabled', true);
    }


}
function criarAbaPackCadastrado(iPàck, qtd) {
    var tabId = $("#tabPacksCad li").length;
    $('a.add-pack').closest('li').before('<li id="li' + iPàck + '"><a href="#tabPackCad' + iPàck +
        '" style="border: 1px solid blue !important;" role="tab" data-toggle="tab">Pack ' + tabId +
        '<button style="margin-left: 7px;color:red!important;opacity: 0.5;" data-toggle="tooltip" class="close" type="button" title="Excluir Pack">×</button> </a></li>');
    //$('ul#tabPacksCad').append('<li id="li' + iPàck + '"><a href="#tabPackCad' + iPàck + '" style="border: 1px solid blue !important;" role="tab" data-toggle="tab">Pack ' + iPàck + '</a></li>');
    var htmlFrmPackCad = criaPainelRelatorio('frmCadPack' + iPàck, 'Dados Pack');
    $('#grupoPackCadastrados div.tab-content:first').append('<div class="tab-pane" id="tabPackCad' + iPàck +
        '"> <div class="span' + iPàck + '">' + htmlFrmPackCad +
        '</div></div>');
    $('.nav-pills a[href="#tabPackCad' + iPàck + '"]').tab('show');

    criarTabGrupoFilial(qtd.grupos, iPàck);
    geraCargaDistPackFiliais(qtd.grupos, iPàck)
    carregaTabPackCadastrado(iPàck);
    $("#frmCadPack" + iPàck + ".collapsible").collapsible({
        animation: true,
        speed: "medium"
    });
}
function carregaTabPackCadastrado(iPàck) {
    var tbHtml = retornaTabela("tblPackCad" + iPàck.toString());
    $("#frmCadPack" + iPàck + " div.table-responsive").html('');
    $(tbHtml).appendTo("#frmCadPack" + iPàck + " div.table-responsive");
    $("#tblPackCad" + iPàck.toString()).append(criarTabelaPackCadastrada());
}

function geraCargaDistPackFiliais(grupos, indexPack) {
    for (var i = 0; i < grupos.length; i++) {
        var hashTab = 'grupo' + grupos[i].idGrupo + '_' + indexPack;
        $('.nav-pills a[href="#' + hashTab + '"]').tab('show');
        var colreg = geraColunaDistribuicao(grupos[i].filiais);

        var dadosOrganizado = transposeObjetoDistribuicaoPack(grupos[i].filiais)
        var qtdParticipacaoFilial = dadosOrganizado.qtdParticipacaoFilial;
        if (!qtdParticipacaoFilial) {
            qtdParticipacaoFilial = dadosOrganizado.qtdePack;
        }
        var dadosPk = [
            dadosOrganizado.idFilial,
            qtdParticipacaoFilial,
            dadosOrganizado.totalItens,
            dadosOrganizado.totalCusto,
            dadosOrganizado.partAtualizada,
            dadosOrganizado.partVendas,
            dadosOrganizado.partCobertura,
            dadosOrganizado.qtdeVenda,
            dadosOrganizado.qtdeEstoque,
            dadosOrganizado.qtdeCarteira,
            dadosOrganizado.vlrMedio
        ];

        dadosPck = recalculaTotalLinhaFiliais(dadosPk)
        carregarDistribuicaoFilial("tblGrpPack" + grupos[i].idGrupo + '_' + indexPack, colreg, dadosPk)
    }
    if ($('#tabDadosDist' + indexPack + ' li').length > 1) {
        $('#tabDadosDist' + indexPack + ' li').children('a').first().click();
    }

}

function retornaLinhaOpcoesGrupo(idField, qtdPart) {
    var retorno = '<div class="row">' +
        '<div class="col-md-2 col-sm-12 col-xs-12">' +
        '<div class="form-group">' +
        '<label class="form-label">Qtd. Pack:</label>' +
        '<div class="controls">' +
        '<input type="text"  class="form-control txtInteiro grpPackQtd" id="txtQtdGrpPack' + idField + '" value="' + qtdPart + '" />' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="col-md-2 col-sm-12 col-xs-12">' +
        '<div class="form-group">' +
        '<label class="form-label">Distribuir Por:</label>' +
        '<div class="controls">' +
        '<input id="ckbGrpPack' + idField + '" type="checkbox" disabled checked class="ckbDistFilial" data-width="100" data-on-color="success" data-off-color="primary" data-on-text="&nbsp;&nbsp;Vendas &nbsp;&nbsp;" data-off-text="Cobertura">' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="col-md-2 col-sm-12 col-xs-12">' +
        '<div class="form-group">' +
        '<label class="form-label">Mês Referência:</label>' +
        '<div class="controls">' +
        retornaFiltroMesGrupo('GrpPack' + idField, idField) +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="col-md-2 col-sm-12 col-xs-12">' +
        '<div class="form-group">' +
        '<label class="form-label">Ano Referência:</label>' +
        '<div class="controls">' +
        retornaFiltroAnoGrupo('GrpPack' + idField, idField) +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="col-md-2 col-sm-12 col-xs-12">' +
        '<div class="form-group">' +
        '<label class="form-label">Aplicar Filtros:</label>' +
        '<div class="controls">' +
        retornaBtnRecalcular('GrpPack' + idField) +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';
    return retorno;
}
function retornaBtnRecalcular(id) {
    var btnRetorno = '<button type="button" id="btn' + id + '" class="btn btn-primary btnRecalcDist"><i class="fa fa-refresh" aria-hidden="true"></i> Recalcular</button>'
    return btnRetorno;
}
function retornaFiltroMesGrupo(classe, id) {
    var retorno = "<select id='drpFiltroMes" + id + "' class='selectpicker show-tick filtroRedistribuirMes form-control " + classe + "'" +
        "data-width='100%' data-size='5'>" +
        "<option class='menuAno' data-icon='glyphicon-calendar' title='Mês Base: Janeiro' value='1'>Janeiro</option>" +
        "<option class='menuAno' data-icon='glyphicon-calendar' title='Mês Base: Fevereiro' value='2'>Fevereiro</option>" +
        "<option class='menuAno' data-icon='glyphicon-calendar' title='Mês Base: Março' value='3'>Março</option>" +
        "<option class='menuAno' data-icon='glyphicon-calendar' title='Mês Base: Abril' value='4'>Abril</option>" +
        "<option class='menuAno' data-icon='glyphicon-calendar' title='Mês Base: Maio' value='5'>Maio</option>" +
        "<option class='menuAno' data-icon='glyphicon-calendar' title='Mês Base: Junho' value='6'>Junho</option>" +
        "<option class='menuAno' data-icon='glyphicon-calendar' title='Mês Base: Julho' value='7'>Julho</option>" +
        "<option class='menuAno' data-icon='glyphicon-calendar' title='Mês Base: Agosto' value='8'>Agosto</option>" +
        "<option class='menuAno' data-icon='glyphicon-calendar' title='Mês Base: Setembro' value='9'>Setembro</option>" +
        "<option class='menuAno' data-icon='glyphicon-calendar' title='Mês Base: Outubro' value='10'>Outubro</option>" +
        "<option class='menuAno' data-icon='glyphicon-calendar' title='Mês Base: Novembro' value='11'>Novembro</option>" +
        "<option class='menuAno' data-icon='glyphicon-calendar' title='Mês Base: Dezembro' value='12'>Dezembro</option>" +
        "</select>";
    return retorno;
}
function retornaFiltroAnoGrupo(classe, id) {
    var ano = new Date().getFullYear();
    var retorno = "<select id='drpFiltroAno" + id + "' class='selectpicker show-tick filtroRedistribuirAno form-control " + classe + "'" +
        "data-width='100%' data-size='5'>" +
        "<option class='menuAno' data-icon='glyphicon-calendar' title='Ano Base: " + (ano - 4) + "' value='" + (ano - 4) + "'>" + (ano - 4) + "</option>" +
        "<option class='menuAno' data-icon='glyphicon-calendar' title='Ano Base: " + (ano - 3) + "' value='" + (ano - 3) + "'>" + (ano - 3) + "</option>" +
        "<option class='menuAno' data-icon='glyphicon-calendar' title='Ano Base: " + (ano - 2) + "' value='" + (ano - 2) + "'>" + (ano - 2) + "</option>" +
        "<option class='menuAno' data-icon='glyphicon-calendar' title='Ano Base: " + (ano - 1) + "' value='" + (ano - 1) + "'>" + (ano - 1) + "</option>" +
        "<option class='menuAno' data-icon='glyphicon-calendar' title='Ano Base: " + (ano) + "' value='" + (ano) + "'>" + (ano) + "</option>" +
        "</select>";

    return retorno;
}

function desabilitaEdicao() {
    $('#divPaineisCadastroCompra input[type=text]').attr("disabled", true);
    $('.selectpicker:not([multiple])').attr("disabled", true);
    $('.selectpicker:not([disabled]) option').attr("disabled", true);
    $(".selectpicker").selectpicker('destroy').selectpicker({
        liveSearch: false,
        actionsBox: false,
    });
    $('#frmGradeCor2').addClass("ocultarElemento");
    $('#frmGradeCor3').addClass("ocultarElemento");
    $('#frmGradeReferencia2').addClass("ocultarElemento");
    $('a.add-pack').closest('li').remove();
    $('a.add-grupo').closest('li').remove();
    $('.btnRecalcDist').attr("disabled", true);
    $('.tabGrupoFilial .close').remove();
    $('#tabPacksCad .close').remove();
    $('#txtAreaObsPed').attr("disabled", true);

}
function desabiliaFotos() {
    $("#imgUpload").fileinput('disable');
}
function carregaPedidoGrade() {
    referenciaGrade = $('#drpReferenciaGrade').val();
    coresGrade = retornaCoresSelecionadas();
    retornaTamanhosSelecionados();
    tamanhosGrade = $('#drpTamanhoGrade').val();
    var dados = cargaReferencia(coresGrade.length, tamanhosGrade.length);
    reiniciaTbGrade();
    criarCargaGradePackPadrao(dados);
}
function resetarCadastro() {
    var dadosPedNovo = {};
    dadosPedNovo.condicao = $("#drpCondPgtoPed").val();
    dadosPedNovo.forma = $("#drpFrmPgtoPed").val();
    dadosPedNovo.fornecedor = $("#drpCNPJ").val();
    dadosPedNovo.notaQtd = $('#txtQldProdPed').maskMoney('unmasked')[0];
    dadosPedNovo.notaQld = $('#txtQldNotaPed').maskMoney('unmasked')[0];
    sessionStorage.setItem('continuar', JSON.stringify(dadosPedNovo));
    location.reload();
}
function continuarNovoProd() {
    var dados = JSON.parse(sessionStorage.getItem('continuar'));
    $("#drpCondPgtoPed option[value='" + dados.condicao + "']").attr('selected', 'selected');
    $("#drpCNPJ option[value='" + dados.fornecedor + "']").attr('selected', 'selected');
    $("#drpCNPJ").trigger('change');
    $("#drpFrmPgtoPed").selectpicker('val', dados.forma);
    $("#txtQldProdPed").val(dados.notaQld.toFixed(2).replace('.', ',')).maskMoney('mask');
    $("#txtQldNotaPed").val(dados.notaQtd.toFixed(2).replace('.', ',')).maskMoney('mask');
    sessionStorage.removeItem('continuar');
    $('#wizard-cad-ped li a[href="#tabFoto"]').click();
}