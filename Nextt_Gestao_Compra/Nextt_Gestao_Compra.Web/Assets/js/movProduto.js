var segRelGerado, secRelGerado, espRelGerado;
var dt = formatarDataEnvio(new Date()).split('-'), dtAtual = dt[1] + '/' + dt[0];

$(document).ready(function () {
    $("#ckbTipoRel").bootstrapSwitch();
    $(window).on("load", carregar);
    $('#drpSeg').on('change', function (e) {
        $('#divEsp').addClass('ocultarElemento');
        $("#drpEsp").html('');
        $('#divSec').addClass('ocultarElemento');
        $("#drpSec").html('');
        if (!$("#divOTBRelatorio").hasClass('ocultarElemento')) {
            resetarRelatorios();
        }
        var objParam = {};
        if ($('#drpSeg').val()) {
            if ($('#divSec').hasClass('ocultarElemento')) {
                $('#divSec').removeClass('ocultarElemento');
            }
            objParam.segmentos = $('#drpSeg').val().join(',').replace(/[^\d,]/g, '');
            carregarSecoes(objParam);
        }
    });
    $('#drpSec').on('change', function (e) {
        var objParam = {};
        $('#divEsp').addClass('ocultarElemento');
        $("#drpEsp").html('');
        if (!$("#divOTBRelatorio").hasClass('ocultarElemento')) {
            resetarRelatorios();
        }
        if ($('#drpSec').val()) {
            $('.selectpicker').selectpicker('hide');
            $(".navbar.navbar-default.navbar-fixed-top").addClass('ocultarElemento');
            $(".bg_load").show();
            $(".wrapper").show();
            objParam.secoes = $('#drpSec').val().join(',');
            carregarEspecie(objParam);
        }
    });
    $('#drpEsp').on('change', function (e) {
        if (!$("#divOTBRelatorio").hasClass('ocultarElemento')) {
            resetarRelatorios();
        }
    });
    $('#drpGrps').on('change', function (e) {
        if (!$("#divOTBRelatorio").hasClass('ocultarElemento') && !$("#ckbTipoRel").bootstrapSwitch('state')) {
            resetarRelatorios();
        }
    });

    $('#filtroAno').val(dtAtual)
    $('#filtroAno').datepicker({
        format: "mm/yyyy",
        startView: 'decade',
        startDate: '-2y',
        endDate: 'y',
        minView: 'decade',
        defaultViewDate: 'year',
        title: "Ano a Consultar"
    }).on('changeMonth', function (ev) {
        $(this).datepicker('update', ev.date);
        if (!$("#divOTBRelatorio").hasClass('ocultarElemento')) {
            resetarRelatorios();
        }
        $(this).datepicker('hide');
        if ($('#segFiltro  option:selected').length > 0) {
            $("#btnFiltrar").attr("disabled", false);
        }
    });
    $('#filtroAno').blur(function (e) {
        var valor = $(this).val().split('/');
        var novaData = valor[1] + '-' + valor[0];
        var d = new Date(novaData);
        var optDtPk = $(this).data('datepicker');

        var strAno = optDtPk.startDate.getFullYear();
        var endAno = optDtPk.endDate.getFullYear();
        var strMes = optDtPk.startDate.getMonth() + 1;
        var endMes = optDtPk.endDate.getMonth() + 1;
        if (!$(this).val()) {
            $(this).val(endMes + "/" + endAno)
            if (!$("#divOTBRelatorio").hasClass('ocultarElemento')) {
                resetarRelatorios();
            }
        } else if (d.toString() === 'Invalid Date') {
            $(this).focus();
        } else if (d.getFullYear() === strAno) {
            if ((d.getUTCMonth() + 1) < strMes) {
                $(this).val(strMes + "/" + strAno)
                optDtPk.date = optDtPk.startDate;
                if (!$("#divOTBRelatorio").hasClass('ocultarElemento')) {
                    resetarRelatorios();
                }
            }
        } else if (d.getFullYear() === endAno) {
            if ((d.getUTCMonth() + 1) > endMes) {
                $(this).val(endMes + "/" + endAno)
                optDtPk.date = optDtPk.endDate;
                if (!$("#divOTBRelatorio").hasClass('ocultarElemento')) {
                    resetarRelatorios();
                }
            }
        } else if (d.getFullYear() < strAno) {
            $(this).val(strMes + "/" + strAno)
            optDtPk.date = optDtPk.startDate;
            if (!$("#divOTBRelatorio").hasClass('ocultarElemento')) {
                resetarRelatorios();
            }
        } else if (d.getFullYear() > endAno) {
            $(this).val(endMes + "/" + endAno)
            optDtPk.date = optDtPk.endDate;
            if (!$("#divOTBRelatorio").hasClass('ocultarElemento')) {
                resetarRelatorios();
            }
        }
        //$('#filtroAno').datepicker('show');
    });
    $(document).on('click', '.panel-heading span.clickable.pull-right', function (e) {
        var $this = $(this);
        var paineisExistentes = $('.panel-heading span.clickable.pull-right')
        if (!$this.hasClass('panel-collapsed')) {
            $this.parents('.panel').find('.panel-body').slideUp();
            $this.addClass('panel-collapsed');

            $this.find('i').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
        } else {

            $this.parents('.panel').find('.panel-body').slideDown();
            $this.removeClass('panel-collapsed');

            $this.find('i').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
        }
    })
    $(document).on('switchChange.bootstrapSwitch', '#ckbTipoRel', function (event, state) {
        if (!$("#divOTBRelatorio").hasClass('ocultarElemento')) {
            resetarRelatorios();
        }
        if (state) {
            $('#drpGrps').selectpicker('deselectAll');
            if ($("#divGrp .bootstrap-select").hasClass('open')) {
                $('#drpGrps').selectpicker('toggle');
            }
            $("#divGrp").addClass('ocultarElemento');
        } else {
            $("#divGrp").removeClass('ocultarElemento');
        }
    });

});
function carregar() {
    sessionStorage.removeItem('compra');
    sessionStorage.removeItem("pedidoId");
    sessionStorage.removeItem("pedidoStatus");
    sessionStorage.removeItem("cadastroNovo");

    carregarFiltrosMovimentacaoProduto();
}
function geraDadosRelatorioOTB(grupos, abaRef, arrayRef) {
    for (var i = 0; i < grupos.length; i++) {
        var hashTab = 'grupo' + grupos[i].idGrupo + '_' + abaRef;
        $('.nav-pills a[href="#' + hashTab + '"]').tab('show');
        var colreg = geraColunaRelOTB(grupos[i].filiais);
        var dadosOrganizado = transposeObjetoDistribuicaoPack(grupos[i].filiais)
        var qtdParticipacaoFilial = dadosOrganizado.qtdParticipacaoFilial;
        if (!qtdParticipacaoFilial) {
            qtdParticipacaoFilial = dadosOrganizado.qtdePack;
        }
        var dadosPk = [
            dadosOrganizado.idFilial,
            dadosOrganizado.partVendas,
            dadosOrganizado.partCobertura,
            dadosOrganizado.qtdeVenda,
            dadosOrganizado.qtdeEstoque,
            dadosOrganizado.qtdeCarteira,
            dadosOrganizado.vlrMedio
        ];

        dadosPck = recalculaTotalLinhaMov(dadosPk)
        for (var j = 0; j < arrayRef.length; j++) {
            var idTb = converterFormatoVariavel(arrayRef[j].replace(' / ', '-'));
            geraGridRelatorioOTB("tblGrpRel" + grupos[i].idGrupo + '_' + abaRef + '_' + idTb, colreg, dadosPk)
        }
    }
    if ($('#tabDadosGrupo' + abaRef + ' li').length > 1) {
        $('#tabDadosGrupo' + abaRef + ' li').children('a').first().click();
    }
}
function carregaAbaSegmento(grupos) {
    $('.nav-pills a[href="#tabSegmento"]').tab('show');
    $('.spanSeg .tabbable.tabs-left').remove();
    $('.spanSeg').append($.parseHTML(criaAbaGruposRelatorio(grupos, 'Seg', segRelGerado)));
    $('#tabDadosGrupoSeg li').children('a').first().click();
}
function carregaAbaSecao(grupos) {
    $('.nav-pills a[href="#tabSecao]').tab('show');
    $('.spanSec .tabbable.tabs-left').remove();
    $('.spanSec').append($.parseHTML(criaAbaGruposRelatorio(grupos, 'Sec', secRelGerado)));
    $('#tabDadosGrupoSec li').children('a').first().click();

}
function carregaAbaEspecie(grupos) {
    $('.nav-pills a[href="#tabEspecie]').tab('show');
    $('.spanEsp .tabbable.tabs-left').remove();
    $('.spanEsp').append($.parseHTML(criaAbaGruposRelatorio(grupos, 'Esp', espRelGerado)));
    $('#tabDadosGrupoEsp li').children('a').first().click();

}
function criaAbaGruposRelatorio(grupos, abaRef, arrayRef) {
    var htmlContent = '<div class="tab-content clearfix" style="border: 1px solid blue !important;">',
        ulHtml = '<div class="tabbable tabs-left"><ul id="tabDadosGrupo' + abaRef + '" class="nav nav-pills tabGrupoFilial">';

    for (var i = 0; i < grupos.length; i++) {
        ulHtml += '<li><a style="border: 1px solid blue !important;" href="#grupo' + grupos[i].idGrupo + '_' + abaRef +
            '" data-toggle="tab"><i class="fa fa-pie-chart" aria-hidden="true"></i> ' + toTitleCase(grupos[i].descricao) + '</a></li>';
        var pnlAppend = '';
        for (var j = 0; j < arrayRef.length; j++) {
            var idTb = converterFormatoVariavel(arrayRef[j].replace(' / ', '-'));
            var tbHtml = $.parseHTML(retornaTabelaRel("tblGrpRel" + grupos[i].idGrupo + '_' + abaRef + '_' + idTb)), headerTb = criaTabelaRel(grupos[i].filiais);
            $(tbHtml).removeClass('tbPackCad').html(headerTb);
            pnlAppend += criaPainelRelatorio(arrayRef[j], $(tbHtml).prop('outerHTML'))
        }

        htmlContent += '<div class="tab-pane" id="grupo' + grupos[i].idGrupo + '_' + abaRef + '">' + pnlAppend + '</div>';
    }
    ulHtml += '</ul>' + htmlContent + '</div></div>';
    return ulHtml;
}
function geraGridRelatorioOTB(idTabelaDist, colunmsPk, dadosPk) {
    var tbRelOtb = $('#' + idTabelaDist).DataTable({
        paging: false,
        searching: false,
        lengthChange: false,
        deferRender: true,
        ordering: false,
        responsive: true,
        columnDefs: [
            {
                "targets": "_all",
                "orderable": false,
                'className': 'dt-body-center',
                "render": function (data, type, row, meta) {
                    if (type === 'display' && meta.col > 0) {
                        if (meta.row === 6) {
                            return data.toLocaleString('pt-BR', { style: "currency", currency: "BRL" })
                        } else if (meta.row === 1) {
                            return Math.round10(data, -2).toLocaleString('pt-BR') + '%';
                        } else {
                            return data.toLocaleString('pt-BR', { maximumFractionDigits: 2 })
                        }
                    } else if (meta.col === 0) {
                        var textToolip;
                        if (meta.row === 1) {
                            textToolip = "Participação em vendas por filial planejado no OTB";
                            return '<span class="metricaTooltip" data-toggle="tooltip" data-placement="right" data-container="body" title="' + textToolip + '">' + data + '</span>';
                        }
                        if (meta.row === 2) {
                            textToolip = "Participação por cobertura para as filial planejado no OTB";
                            return '<span class="metricaTooltip" data-toggle="tooltip" data-placement="right" data-container="body" title="' + textToolip + '">' + data + '</span>';
                        }
                        if (meta.row === 3) {
                            textToolip = "Quantidade de vendas para as filial planejado no OTB";
                            return '<span class="metricaTooltip" data-toggle="tooltip" data-placement="right" data-container="body" title="' + textToolip + '">' + data + '</span>';
                        }
                        if (meta.row === 4) {
                            textToolip = "Quantidade em estoque para as filial planejado no OTB";
                            return '<span class="metricaTooltip" data-toggle="tooltip" data-placement="right" data-container="body" title="' + textToolip + '">' + data + '</span>';
                        }
                        if (meta.row === 5) {
                            textToolip = "Quantidade em carteira para as filial planejado no OTB";
                            return '<span class="metricaTooltip" data-toggle="tooltip" data-placement="right" data-container="body" title="' + textToolip + '">' + data + '</span>';
                        }
                        if (meta.row === 6) {
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
        language: {
            "emptyTable": "Nenhum produto encontrado",
            "zeroRecords": "Nenhum produto corresponde ao filtro",
        },
        createdRow: function (row, data, dataIndex) {
            if (dataIndex === 0) {
                $(row).addClass('ocultarElemento');
            }
        },
        drawCallback: function (settings) {
            $(".ckbDistFilial").bootstrapSwitch();
            $(function () {
                $('[data-toggle="tooltip"]').tooltip();
            });
        },
        info: false,
        destroy: true,
        data: dadosPk,
        columns: colunmsPk
    });
    tbRelOtb.columns.adjust().draw();
}
function buscaDadosRelatorioEspecies() {
    var objEnvio = { 'segmentos': '', 'idGrupo': '', 'secoes': '', 'especies': '', 'ano': '', 'mes': '' }, seg = $("#drpSeg").val(), secoes = $("#drpSec").val(),
        especies = $("#drpEsp").val(), grp = $("#drpGrps").val(), periodo = $('#filtroAno').val(), relTipo = $("#ckbTipoRel").bootstrapSwitch('state');
    if (relTipo) {
        modal({
            messageText: "A consulta sintética está inativa, pois necessita de um modelo de como será exibido o grid.",
            type: "alert",
            modalSize: 'modal-lg',
            headerText: "Operação Inválida",
            alertType: "warning"
        });
    } else if (!periodo || !seg || !grp) {
        erroCadCompra("Não é permitido pesquisar sem selecionar ao menos um período, um grupo e um segmento!", "alertProdMov");
    } else {
        segRelGerado = retornaComboTokem('drpSeg');
        secRelGerado = retornaComboTokem('drpSec');
        espRelGerado = retornaComboTokem('drpEsp');
        objEnvio.mes = periodo.split('/')[0];
        objEnvio.ano = periodo.split('/')[1];
        objEnvio.segmentos = seg.join(',');
        objEnvio.idGrupo = grp.join(',');
        if (secoes) objEnvio.secoes = '72';//secoes.join(",");
        if (especies) objEnvio.especies = '2';//especies.join(",");
        $(".navbar.navbar-default.navbar-fixed-top").addClass('ocultarElemento');
        $('.selectpicker').selectpicker('hide');
        $(".bg_load").show();
        $(".wrapper").show();
        cargaMovimentacaoProdutoOTB(objEnvio);
        // console.log(objEnvio)
    }
}
function criaPainelRelatorio(titulo, htmlBody) {
    var painelRelatorio = '<div class="row">' +
        '<div class="col-md-12">' +
        '<div class="panel panel-primary">' +
        '<div class="panel-heading">' +
        '<h3 class="panel-title"> ' + titulo + '</h3>' +
        '<span class="pull-right clickable"><i class="glyphicon glyphicon-chevron-up"></i></span>' +
        '</div>' +
        '<div class="panel-body">' +
        '<div class="col-md-12 col-sm-12 col-xs-12 table-responsive">' +
        htmlBody +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';


    return painelRelatorio;
} function criaTabelaRel(colunas) {
    var tabelaHtml = '<thead><tr>' +
        '<th class="groupHeaderTable">Dados</th>';
    for (var i = 0; i < colunas.length; i++) {
        tabelaHtml += '<th class="groupHeaderTable">' + colunas[i].nome + '</th>'
    }
    tabelaHtml += '<th class="groupHeaderTable">Total/Média</th>'

    tabelaHtml += '</tr></thead>';
    return tabelaHtml;
}
function retornaTabelaRel(id) {
    return '<table id="' + id + '" cellpadding="0" cellspacing="0" class="tbPackCad cell-border hover table cell nowrap stripe compact pretty"></table>';
}
function retornaLinhaOpcoesGrupoRel(idField) {
    var retorno = '<div class="row">' +
        '<div class="col-md-3 col-sm-3 col-xs-12">' +
        '<div class="form-group">' +
        '<label class="form-label">Distribuir Por:</label>' +
        '<div class="controls">' +
        '<input id="ckbGrpPack' + idField + '" type="checkbox" disabled="disabled" class="ckbDistFilial" data-size="normal" data-on-color="success" data-off-color="primary" data-on-text="Cobertura" data-off-text="Vendas">' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="col-md-3 col-sm-3 col-xs-12">' +
        '<div class="form-group">' +
        '<label class="form-label">Mês Referência:</label>' +
        '<div class="controls">' +
        retornaFiltroMesGrupoRel('GrpRelOTB' + idField, idField) +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="col-md-3 col-sm-3 col-xs-12">' +
        '<div class="form-group">' +
        '<label class="form-label">Ano Referência:</label>' +
        '<div class="controls">' +
        retornaFiltroAnoGrupoRel('GrpRelOTB' + idField, idField) +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="col-md-3 col-sm-3 col-xs-12">' +
        '<div class="form-group">' +
        '<label class="form-label">Aplicar Filtros:</label>' +
        '<div class="controls">' +
        retornaBtnRecalcularRel('GrpRelOTB' + idField) +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';
    return retorno;
}
function geraColunaRelOTB(filiais) {
    var colunasDistribuicao = [{ "data": "descricao" }];
    for (var i = 0; i < filiais.length; i++) {
        colunasDistribuicao.push({ "data": "filial" + (i + 1) });
    }
    colunasDistribuicao.push({ "data": "total" });
    return colunasDistribuicao;
}
function resetarRelatorios() {
    $("#divOTBRelatorio").addClass('ocultarElemento');
    $('div.spanSeg').html('');
    $('div.spanSec').html('');
    $('div.spanEsp').html('');
}