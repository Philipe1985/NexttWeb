var dadosGrupoNovo = {};
var dtbCad;
$(document).ready(function () {

    $(window).on("load", carregar);

    $(document).on('shown.bs.tab', '.nav-tabs-responsive [data-toggle="tab"]', function (e) {

        var x = $(e.target)["0"].hash;         // active tab
        var y = $(e.relatedTarget)["0"].hash;  // previous tab
        var tbs = $('#divPaineisCadastroGrupo').find('.tab-pane');
        $.each(tbs, function (i, el) {
            if ($(el).hasClass('active')) {
                $(el).removeClass('active');
            }
            if ($(el).attr('id') === x) {
                $(el).addClass('active');
            }

        });
    });
    $(document).on('show.bs.tab', '.nav-tabs-responsive [data-toggle="tab"]', function (e) {
        var $target = $(e.target);
        var $tabs = $target.closest('.nav-tabs-responsive');
        var $current = $target.closest('li');
        var $parent = $current.closest('li.dropdown');
        $current = $parent.length > 0 ? $parent : $current;
        var $next = $current.next();
        var $prev = $current.prev();


        $tabs.find('>li').removeClass('next prev');
        $prev.addClass('prev');
        $next.addClass('next');
    });
    $('#cbGrupos').on('change', function (e) {
        var param = {};
        $('#divPaineisCadastroGrupo').addClass('ocultarElemento');
        $('#divPaineisCadastroGrupo #cadGrupo').empty();
        $('#divPaineisCadastroGrupo div.tab-content:first').empty();
        if ($('#cbGrupos').val()) {
            param.idGrupo = $('#cbGrupos').val().join(',');
            retornaInfoGrp(param);
        }


    });
})
function carregar() {
    $(".ckbGrpDist").bootstrapSwitch();
    recuperaGruposCadastrados();
    //erroCadCompra("Para cadastrar uma cor nova primeiro informe o nome para ela.", "alertCadGrupoFilial");
}
function criaDescGrp() {
    var value = ''
    if (dadosGrupoNovo.descricao) {
        value = dadosGrupoNovo.descricao;
    }
    $.confirm({
        icon: 'fa fa-pencil-square-o',
        type: 'blue',
        title: 'Cadastro de Grupo!',
        content: '<div class="form-group">' +
            '<label class="control-label">Informe a Descrição do Grupo:</label>' +
            '<input type="text" id="txtDescGrp" autofocus placeholder="Digite aqui..."  value="' + value + '" class="form-control">' +
            '</div>',
        buttons: {
            confirm: {
                text: 'Avançar',
                btnClass: 'btn-blue',
                action: function () {
                    var descGrupo = this.$content.find('#txtDescGrp').val().trim();
                    if (!descGrupo.length) {
                        $('#txtDescGrp').popover({
                            title: '<h5 class="custom-title"><span class="glyphicon glyphicon-exclamation-sign orange"></span> Atenção!</h5>',
                            content: "<p>Para avançar é necessário informar uma descrição</p>",
                            html: true,
                            trigger: 'manual',
                            container: this.$content,
                            placement: 'bottom'
                        });

                        $('#txtDescGrp').popover('show');
                        $('#txtDescGrp').focus().select();
                        setTimeout(function () {
                            $('#txtDescGrp').popover('destroy');

                        }, 3000);
                        return false;
                    } else {
                        dadosGrupoNovo.descricao = descGrupo;
                        addFiliais();
                    }

                }
            },
            cancel: {
                text: 'Cancelar',
                action: function () {
                    dadosGrupoNovo = {};
                }
            }
        },
        onContentReady: function () {
            var self = this;
            this.$content.find('#txtDescGrp').keyup(function (evento) {

                var code = (evento.keyCode ? evento.keyCode : evento.which);
                if (code === 9 || code === 13) {
                    $(this).blur();
                }
            });


        },
    });
}
function addFiliais() {

    $.confirm({
        icon: 'fa fa-pie-chart',
        type: 'blue',
        title: 'Seleção de Filiais!',
        content: '<div class="form-group">' +
            '<label class="control-label">Selecione as Filiais do Novo Grupo:</label>' +
            '<select id="drpFiliais" data-container=".jconfirm" class="selectpicker show-tick form-control" multiple data-live-search="true" title="Selecione uma filial..." data-width="100%" data-size="5">' +
            localStorage.getItem('filiaisOption') + '</select>' +
            '</div>',

        buttons: {
            confirm: {
                text: 'Concluir',
                btnClass: 'btn-success',
                isHidden: true,
                action: function () {
                    dadosGrupoNovo.filiais = retornaFiliaisNovoGrupo($('#drpFiliais').val().map(Number));
                    var objEnvio = dadosGrupoNovo;
                    console.log(objEnvio);
                    $(".bg_load").show();
                    $(".wrapper").show();
                    $('.selectpicker').selectpicker('hide');
                    cadastrarGrupoNovo(objEnvio);
                    dadosGrupoNovo = {};
                }
            },
            back: {
                text: 'Voltar',
                btnClass: 'btn-info',
                action: function () {
                    criaDescGrp();
                }
            },
            cancel: {
                text: 'Cancelar',
                btnClass: 'btn-danger',
                action: function () {
                    dadosGrupoNovo = {};
                }
            }
        },
        onContentReady: function () {
            var self = this;
            self.$content.find('#drpFiliais').selectpicker();
            self.$content.find('#drpFiliais').change(function () {
                if ($('#drpFiliais').val()) {
                    self.buttons.confirm.show();
                } else {
                    self.buttons.confirm.hide();
                }
            });
        },
    });

}
function criarTabGruposSelecionados(dadosGrupos) {
    var htmlContent = '';
    var ulHtml = '';
    for (var i = 0; i < dadosGrupos.length; i++) {
        var filiaisDrp = '<div class="row"><div class="col-md-3 col-sm-12 col-xs-12">' +
            '<div class="form-group">' +
            '<label class="form-label" style="font-size:16px!important;">Selecione as Filiais do Grupo:</label>' +
            '<div class="controls">' +
            '<select name="cbFiliais' + dadosGrupos[i].idGrupo + '" id="cbFiliais' + dadosGrupos[i].idGrupo + '" data-actions-box="true" class="selectpicker show-tick form-control" data-live-search="true"' +
            'data-select-all-text="Marcar Todas" data-deselect-all-text="Desmarcar Todas" data-count-selected-text="Selecionado {0} de {1} opções"' +
            'data-width="100%" multiple data-select-header="true" data-size="7" data-selected-text-format="count > 0" title="Selecione uma filial...">' + localStorage.getItem('filiaisOption') + '</select>' +
            '</div>' +
            '</div>' +
            '</div>' +
            //'<div class="col-md-2 col-sm-12 col-xs-12">' +
            //'<div class="form-group">' +
            //'<label class="form-label">Mês Referência:</label>' +
            //'<div class="controls">' +
            //retornaFiltroMesGrupoCad('mesFilial' + dadosGrupos[i].idGrupo, dadosGrupos[i].idGrupo) +
            //'</div>' +
            //'</div>' +
            //'</div>' +
            //'<div class="col-md-2 col-sm-12 col-xs-12">' +
            //'<div class="form-group">' +
            //'<label class="form-label">Ano Referência:</label>' +
            //'<div class="controls">' +
            //retornaFiltroAnoGrupoCad('anoFilial' + dadosGrupos[i].idGrupo, dadosGrupos[i].idGrupo) +
            //'</div>' +
            //'</div>' +
            //'</div>' +
            '</div>';
        //var tbHtml = $.parseHTML(retornaTabelaCadGrp("tblGrpCad" + dadosGrupos[i].idGrupo)), headerTb = criaTabelaCadGrp(dadosGrupos[i].filiais);
        //$(tbHtml).html(headerTb);


        //Fazer carregar combo com filiais selecionadaas
        if ($('#divPaineisCadastroGrupo #cadGrupo li').length === 0 && i === 0) {
            ulHtml = '<li role="presentation" class="active"><a id="grupo' + dadosGrupos[i].idGrupo + 'tab" aria-controls="grupo' + dadosGrupos[i].idGrupo + '" class="deco-none" href="#grupo' + dadosGrupos[i].idGrupo + '" data-toggle="tab"><span class="text"> ' +
                toTitleCase(dadosGrupos[i].descricao) + ' </span></a></li>';
            htmlContent = '<div role="tabpanel" class="tab-pane active" aria-labelledby="grupo' + dadosGrupos[i].idGrupo + 'tab" id="#grupo' + dadosGrupos[i].idGrupo +
                '">' + filiaisDrp +
                //'<div class="row"><div class="col-md-12 col-sm-12 col-xs-12 table-responsive">' +
                //$(tbHtml).prop('outerHTML') + '</div>' +
                '</div>';
        } else if (i === 1) {
            ulHtml = '<li role="presentation" class="next"><a  id="grupo' + dadosGrupos[i].idGrupo + 'tab" aria-controls="grupo' + dadosGrupos[i].idGrupo + '" class="deco-none" href="#grupo' + dadosGrupos[i].idGrupo + '" data-toggle="tab"><span class="text"> ' +
                toTitleCase(dadosGrupos[i].descricao) + ' </span></a></li>';
            htmlContent = '<div role="tabpanel" class="tab-pane" aria-labelledby="grupo' + dadosGrupos[i].idGrupo + 'tab" id="#grupo' + dadosGrupos[i].idGrupo +
                '">' + filiaisDrp +
                //'<div class="row"><div class="col-md-12 col-sm-12 col-xs-12 table-responsive">' +
                //$(tbHtml).prop('outerHTML') + '</div>' +
                '</div>';
        } else {
            ulHtml = '<li role="presentation"><a  id="grupo' + dadosGrupos[i].idGrupo + 'tab" aria-controls="grupo' + dadosGrupos[i].idGrupo + '" class="deco-none" href="#grupo' + dadosGrupos[i].idGrupo + '" data-toggle="tab"><span class="text"> ' +
                toTitleCase(dadosGrupos[i].descricao) + ' </span></a></li>';
            htmlContent = '<div role="tabpanel" class="tab-pane" aria-labelledby="grupo' + dadosGrupos[i].idGrupo + 'tab" id="#grupo' + dadosGrupos[i].idGrupo +
                '">' + filiaisDrp +
                //'<div class="row"><div class="col-md-12 col-sm-12 col-xs-12 table-responsive">' +
                //$(tbHtml).prop('outerHTML') + '</div>' +
                '</div>';
        }
        $('#divPaineisCadastroGrupo #cadGrupo').append(ulHtml);
        $('#divPaineisCadastroGrupo  div.tab-content:first').append(htmlContent)
        $(".selectpicker").selectpicker();
        $('#cbFiliais' + dadosGrupos[i].idGrupo).selectpicker('val', dadosGrupos[i].filiais);
    }
    //ulHtml += '</ul>' + htmlContent + '</div>'
    //$('#divPaineisCadastroGrupo').append($.parseHTML(ulHtml));
    //geraCargaFiliaisGrp(dadosGrupos)
    //var mesSelecionar = new Date().getMonth() + 1;
    //$(".selectpicker").selectpicker();
    //$(".mesRel").selectpicker('val', mesSelecionar.toString());
    $('#divPaineisCadastroGrupo').removeClass('ocultarElemento');


}
function retornaFiltroMesGrupoCad(classe, id) {
    var retorno = "<select id='drpFiltroMes" + id + "' class='selectpicker show-tick form-control mesRel " + classe + "'" +
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
function retornaFiltroAnoGrupoCad(classe, id) {
    var ano = new Date().getFullYear();
    var retorno = "<select id='drpFiltroAno" + id + "' class='selectpicker show-tick anoRel form-control " + classe + "'" +
        "data-width='100%' data-size='5'>" +
        "<option class='menuAno' data-icon='glyphicon-calendar' title='Ano Base: " + (ano - 2) + "' value='" + (ano - 2) + "'>" + (ano - 2) + "</option>" +
        "<option class='menuAno' data-icon='glyphicon-calendar' title='Ano Base: " + (ano - 1) + "' value='" + (ano - 1) + "'>" + (ano - 1) + "</option>" +
        "<option class='menuAno' data-icon='glyphicon-calendar' selected title='Ano Base: " + (ano) + "' value='" + (ano) + "'>" + (ano) + "</option>" +
        "<option class='menuAno' data-icon='glyphicon-calendar' title='Ano Base: " + (ano + 1) + "' value='" + (ano + 1) + "'>" + (ano + 1) + "</option>" +
        "<option class='menuAno' data-icon='glyphicon-calendar' title='Ano Base: " + (ano + 2) + "' value='" + (ano + 2) + "'>" + (ano + 2) + "</option>" +
        "</select>";

    return retorno;
}

function retornaTabelaCadGrp(id) {
    return '<table id="' + id + '" cellpadding="0" cellspacing="0" class="cell-border hover table cell nowrap stripe compact pretty"></table>';
}
function retornaFiliaisNovoGrupo(idsFiliais) {
    var filiaisRetorno = [];
    for (var i = 0; i < idsFiliais.length; i++) {
        var filialAdd = {};
        filialAdd.idFilial = idsFiliais[i];
        filiaisRetorno.push(filialAdd);
    }
    return filiaisRetorno;
}
function criaTabelaCadGrp(colunas) {
    var tabelaHtml = '<thead><tr>' +
        '<th class="groupHeaderTable">Dados</th>';
    for (var i = 0; i < colunas.length; i++) {
        tabelaHtml += '<th class="groupHeaderTable">' + colunas[i].nome + '</th>'
    }

    tabelaHtml += '</tr></thead>';
    return tabelaHtml;
}
function geraCargaFiliaisGrp(grupos) {
    for (var i = 0; i < grupos.length; i++) {
        var hashTab = "grupo" + grupos[i].idGrupo;
        $('.nav--responsive a[href="#' + hashTab + '"]').tab('show');
        var colreg = geraColunaCad(grupos[i].filiais);
        var dadosOrganizado = transposeObjetoDistribuicaoPack(grupos[i].filiais)

        var dadosPk = [
            dadosOrganizado.partVendas,
            dadosOrganizado.partCobertura,
            dadosOrganizado.qtdeVenda,
            dadosOrganizado.qtdeEstoque,
            dadosOrganizado.qtdeCarteira,
            dadosOrganizado.vlrMedio
        ];
        carregarCadFilial("tblGrpCad" + grupos[i].idGrupo, colreg, dadosPk)
    }
    //$('#tabDadosDist' + indexPack + ' li').children('a').first().click();

}
function geraColunaCad(filiais) {
    var colunasDistribuicao = [{ "data": "descricao" }];
    for (var i = 0; i < filiais.length; i++) {
        colunasDistribuicao.push({ "data": "filial" + (i + 1) });
    }
    return colunasDistribuicao;
}
function carregarCadFilial(idTabelaDist, colunmsPk, dadosPk) {
    dtbCad = $('#' + idTabelaDist).DataTable({
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
                    if (type === 'display' && meta.col > 0) {
                        if (meta.row === 5) {
                            return data.toLocaleString('pt-BR', { style: "currency", currency: "BRL" })
                        } else if (meta.row === 0 || meta.row === 1) {
                            return Math.round10(data, -2).toLocaleString('pt-BR');
                        } else {
                            return data.toLocaleString('pt-BR')
                        }
                    }
                    else {
                        return data;
                    }
                    // 'sort', 'type' and undefined all just use the integer
                }
            },
        ],
        "language": {
            "emptyTable": "Nenhum produto encontrado",
            "zeroRecords": "Nenhum produto corresponde ao filtro",
        },

        "info": false,
        destroy: true,
        data: dadosPk,
        columns: colunmsPk
    });
    var $inputGrp = $('#' + idTabelaDist.replace('tblGrpPack', 'txtQtdPackGrupo'))
    dtbCad.columns.adjust().draw();
}
function criaObjetoAtualizarGrupos() {
    var idsGrupo = $('#cbGrupos').val(), retorno = [];
    console.log(idsGrupo)
    if (idsGrupo) {
        for (var i = 0; i < idsGrupo.length; i++) {
            var objAtualizar = {};
            var valoresGrupo = $("#cbGrupos option[value='" + idsGrupo[i] + "']").attr('data-tokens').split(',');
            objAtualizar.descricao = valoresGrupo[1];
            objAtualizar.idGrupoFilial = parseInt(valoresGrupo[0]);
            console.log(valoresGrupo)
            console.log($('#cbFiliais' + valoresGrupo[0]).val())

            $('#cbFiliais' + valoresGrupo[0]).val() ?
                objAtualizar.filiais = retornaFiliaisNovoGrupo($('#cbFiliais' + valoresGrupo[0]).val().map(Number)) :
                objAtualizar.filiais = [];
            retorno.push(objAtualizar);
        }
    }
    return retorno;
}
function atualizarGrupos() {
    if ($('#cbGrupos').val()) {
        $(".bg_load").show();
        $(".wrapper").show();
        $('.selectpicker').selectpicker('hide');
        var objEnvio = { 'grupo': criaObjetoAtualizarGrupos() };
        console.log(objEnvio);
        salvarAtualizacaoGrp(objEnvio);
    }
}
function msgGrupoAtualizado() {
    var jc2 = $.confirm({
        title: 'Grupos Atualizados Com Sucesso!',
        content: 'Todas as atualizações nos grupos foram salvas.',
        icon: 'fa fa-check',
        theme: 'modern',
        closeIcon: false,
        type: 'green',
        animation: 'scale',
        buttons: {
            okButton: {
                text: 'ok'
            }
        },
        onContentReady: function () {
            setTimeout(function () {
                jc2.close()
            }, 4000);
        },
        onOpenBefore: function () {
            this.buttons.okButton.hide();
        },
        onDestroy: function () { $('#cbGrupos').selectpicker('val', ''); }
    });

}
function msgGrupoCadastrado() {
    var jc2 = $.confirm({
        title: 'Grupo Cadastrado Com Sucesso!',
        content: 'O novo grupo foi cadastrado e já está disponível para utilização.',
        icon: 'fa fa-check',
        theme: 'modern',
        closeIcon: false,
        type: 'green',
        animation: 'scale',
        buttons: {
            okButton: {
                text: 'ok'
            }
        },
        onContentReady: function () {
            setTimeout(function () {
                jc2.close()
            }, 4000);
        },
        onOpenBefore: function () {
            this.buttons.okButton.hide();
        },
    });

}