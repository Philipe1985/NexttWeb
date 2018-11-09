var segRelGerado, secRelGerado, espRelGerado;
var dt = formatarDataEnvio(new Date()).split('-'), dtAtual = dt[1] + '/' + dt[0];

$(document).ready(function () {
    $(window).on("load", carregar);
    $('#drpSeg').on('change', function (e) {
        var objParam = {};
        if ($('#drpSeg').val()) {
            if ($('#divSec').hasClass('ocultarElemento')) {
                $('#divSec').removeClass('ocultarElemento');
            }
            objParam.segmentos = $('#drpSeg').val().join(',').replace(/[^\d,]/g, '');
            console.log(objParam)
            carregarSecoes(objParam);
        } else {
            if (!$('#divEsp').hasClass('ocultarElemento')) {
                $('#divEsp').addClass('ocultarElemento');
                $("#drpEsp").html('');
            }
            if (!$('#divSec').hasClass('ocultarElemento')) {
                $('#divSec').addClass('ocultarElemento');
                $("#drpSec").html('');
            }
        }
    });
    $('#drpSec').on('change', function (e) {
        var objParam = {};
        if ($('#drpSec').val()) {
            $('.selectpicker').selectpicker('hide');
            $(".navbar.navbar-default.navbar-fixed-top").addClass('ocultarElemento');
            $(".bg_load").show();
            $(".wrapper").show();
            objParam.secoes = $('#drpSec').val().join(',');
            carregarEspecie(objParam);
        } else {
            $('#divEsp').addClass('ocultarElemento');
            $("#drpEsp").html('');

        }
    });
    $('#filtroAno').val(dtAtual)
    $('#filtroAno').datepicker({
        format: "mm/yyyy",
        startView: 'decade',
        minView: 'decade',
        defaultViewDate: 'year',
        title: "Ano a Consultar"
    }).on('changeMonth', function (ev) {
        $(this).datepicker('update', ev.date);
        $(this).datepicker('hide');
        if ($('#segFiltro  option:selected').length > 0) {
            $("#btnFiltrar").attr("disabled", false);
        }
    });

});
function carregar() {
    $('#movProdOpcao').addClass('ocultarElemento');
    sessionStorage.removeItem('compra');
    sessionStorage.removeItem("pedidoId");
    sessionStorage.removeItem("pedidoStatus");
    sessionStorage.removeItem("cadastroNovo");
    carregarFiltrosMovimentacaoProduto();
}
function geraDadosRelatorioOTB(grupos, abaRef,arrayRef) {
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
    $('.spanEsp').append($.parseHTML(criaAbaGruposRelatorio(grupos, 'Esp',espRelGerado)));
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
        especies = $("#drpEsp").val(), grp = $("#drpGrps").val(), periodo = $('#filtroAno').val();
    if (!periodo || !seg || !grp) {
        erroCadCompra("Não é permitido pesquisar sem selecionar ao menos um período, um grupo e um segmento!", "alertProdMov");
    } else {
        segRelGerado = retornaComboTokem('drpSeg');
        secRelGerado = retornaComboTokem('drpSec');
        espRelGerado = retornaComboTokem('drpEsp');
        objEnvio.mes = periodo.split('/')[0];
        objEnvio.ano = periodo.split('/')[1];
        objEnvio.segmentos = seg.join(',');
        objEnvio.idGrupo = grp.join(',');
        if (secoes) objEnvio.secoes = secoes.join(",");
        if (especies) objEnvio.especies = especies.join(",");
        $(".navbar.navbar-default.navbar-fixed-top").addClass('ocultarElemento');
        $('.selectpicker').selectpicker('hide');
        $(".bg_load").show();
        $(".wrapper").show();
        cargaMovimentacaoProdutoOTB(objEnvio);
        //console.log(objEnvio)
    }
}
function criaPainelRelatorio(titulo, htmlBody) {
    var painelRelatorio = '<div class="row">' +
        '<div class="col-md-12">' +
        '<div class="panel panel-primary">' +
        '<div class="panel-heading">' +
        '<h3 class="panel-title"> ' + titulo + '</h3>' +
        //'<span class="pull-right clickable panel-collapsed"><i class="glyphicon glyphicon-chevron-down"></i></span>' +
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
