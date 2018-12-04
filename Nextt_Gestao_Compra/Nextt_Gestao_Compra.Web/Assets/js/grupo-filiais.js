var dadosGrupoNovo = {};
var dtbCad, reativado = false;
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
    $(document).on('click', '.editarGrupo', function (evento) {
        var linha = $(this).parent().parent();
        var dadoLinha = dtbCad.row($(linha)).data()
        var objEnvio = {};
        objEnvio.idGrupo = dadoLinha.id.toString();
        $(".bg_load").show();
        $(".wrapper").show();
        $('.selectpicker').selectpicker('hide');
        $(".navbar.navbar-default.navbar-fixed-top").addClass('ocultarElemento');

        retornaInfoGrp(objEnvio)

    })
    $(document).on('click', '.excluirGrupo', function (evento) {
        var linha = $(this).parent().parent();
        var dadoLinha = dtbCad.row($(linha)).data()
        var objEnvio = {};
        objEnvio.idGrupo = dadoLinha.id.toString();
        sessionStorage.setItem('idGrpWxc', objEnvio.idGrupo)
        $(".bg_load").show();
        $(".wrapper").show();
        $('.selectpicker').selectpicker('hide');
        $(".navbar.navbar-default.navbar-fixed-top").addClass('ocultarElemento');
        excluirGrp(objEnvio)

    })
})
function carregar() {
    $(".ckbGrpDist").bootstrapSwitch();
    recuperaGruposCadastrados();
    //erroCadCompra("Para cadastrar uma cor nova primeiro informe o nome para ela.", "alertCadGrupoFilial");
}
function criaDescGrp() {
    $(".bg_load").show();
    $(".wrapper").show();
    $('.selectpicker').selectpicker('hide');
    $(".navbar.navbar-default.navbar-fixed-top").addClass('ocultarElemento');

    manipularGrupo("Cadastrar Novo Grupo", '', 0)
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
function carregarCadFilial(dados) {
    dtbCad = $('#gruposCadastrados').DataTable({
        paging: false,
        searching: true,
        lengthChange: false,
        deferRender: true,
        "ordering": true,
        "order": [[3, "asc"]],
        responsive: true,

        "columnDefs": [
            {
                "targets": 2,
                'className': 'dt-body-center partGrp',
                "render": function (data, type, row, meta) {
                    if (type === 'display' && meta.col === 2) {
                        return Math.round10(data, -2).toLocaleString('pt-BR') + '%';
                    }
                    else {
                        return data;
                    }
                }
            },
            {
                "visible": false,
                "targets": 0
            },
            {
                'className': 'dt-body-left descGrp',
                "targets": 1
            },
            {
                "orderable": false,
                'className': 'dt-body-left grupoOperacao',
                "targets": 4
            }
        ],
        "language": {
            "emptyTable": "Nenhum produto encontrado",
            "zeroRecords": "Nenhum produto corresponde ao filtro",
        },

        "info": false,
        destroy: true,
        data: dados,
        "columns": [
            { "data": "id" },
            { "data": "descricao" },
            { "data": "participacao" },
            { "data": "status" },
            { "data": "operacao" },

        ]
    });
}
function criaObjetoGrupoEnvio(idFiliais, idGrupo, descGrupo, partEnvio) {
    var listaGruposEnvio = [];
    var objAtualizar = {};
    objAtualizar.descricao = descGrupo;
    objAtualizar.idGrupoFilial = idGrupo;
    objAtualizar.ativo = true;
    objAtualizar.participacaoGrupo = partEnvio;
    objAtualizar.filiais = retornaFiliaisNovoGrupo(idFiliais);
    listaGruposEnvio.push(objAtualizar);
    retorno = { 'gruposOperacao': listaGruposEnvio }
    $(".bg_load").show();
    $(".wrapper").show();
    $('.selectpicker').selectpicker('hide');
    $(".navbar.navbar-default.navbar-fixed-top").addClass('ocultarElemento');
    return retorno;
}
function excluirGrupo() {
    var jc2 = $.confirm({
        title: 'Grupo Excluído Com Sucesso!',
        content: 'O grupo foi removido e não estará disponível para reativação, caso não esteja vinculado a pelo menos um pedido.',
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
            }, 2000);
        },
        onOpenBefore: function () {
            this.buttons.okButton.hide();
        },
        onDestroy: function () {
            $(".bg_load").show();
            $(".wrapper").show();
            $('.selectpicker').selectpicker('hide');
            $(".navbar.navbar-default.navbar-fixed-top").addClass('ocultarElemento');
            location.reload();
        }
    });
}
function msgGrupoAtualizado() {
    var titAtualizado = reativado ? 'Grupo Reativado Com Sucesso!' : 'Grupo Atualizado Com Sucesso!';
    var msgAtualizado = reativado ? 'O grupo foi reativado e todas as atualizações feitas nele foram salvas.' : 'Todas as atualizações no grupo foram salvas.';
    reativado = false;
    var jc2 = $.confirm({
        title: titAtualizado,
        content: msgAtualizado,
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
            }, 2000);
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
            }, 2000);
        },
        onOpenBefore: function () {
            this.buttons.okButton.hide();
        },
    });

}
function manipularGrupo(tit, desc, part) {
    $.confirm({
        icon: 'fa fa-pencil-square-o',
        type: 'blue',
        title: tit,
        containerFluid: true,
        content: '<div class="col-md-6 form-group">' +
            '<label class="control-label">Descrição</label>' +
            '<input type="text" id="txtDescGrp" data-initial="' + desc + '" placeholder="Digite aqui..."  value="' + desc + '" class="form-control">' +
            '</div>' +
            '<div class="col-md-6 form-group">' +
            '<label class="control-label">Participação</label>' +
            '<input type="text" id="txtPartGrp" disabled value="' + Math.round10(part, -2).toLocaleString('pt-BR') + '%' + '" class="form-control">' +
            '</div>' +
            '<div class="col-md-12 form-group">' +
            '<div class="panel panel-primary">' +
            '<div class="panel-heading">' +
            '<h5 id="tltAtivo" class="panel-title" style="font-size:17px!important">Filiais</h5>' +
            '</div>' +
            '<div class="panel-body">' +
            '<div style="height:200px; max-height: 500px;overflow: auto;">' +
            '<ul id="funcoesHabilitado" class="esq connectedSortable" style="list-style-type: none;min-height:100px">' +
            localStorage.getItem('filiaisLista') +

            '</ul>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>',
        buttons: {
            confirm: {
                text: 'Salvar',
                btnClass: 'btn-green',
                action: function () {
                    var descGrupo = toTitleCase(this.$content.find('#txtDescGrp').val().trim());
                    var partEnvio = removeMascaraMoeda(this.$content.find('#txtPartGrp').val().replace('%', ''));
                    var descInicial = this.$content.find('#txtDescGrp').attr("data-initial").trim();
                    var idEdt = localStorage.getItem("idGrpEditar") ?
                        parseInt(localStorage.getItem("idGrpEditar")) :
                        0;
                    reativado = $(this.$$confirm).text() === 'Ativar';
                    if (!descGrupo || descGrupo.length < 3) {
                        grupoOperacaoInvalida('A descrição é um campo obrigatório e deve conter no mínimo 3 caracteres! Informe a descrição ou cancele a operação.')
                        return false;
                    }
                    if (!validaDescricaoExistente(descGrupo)) {
                        var selecionados = [];
                        this.$content.find('li input:checked').each(function () {
                            selecionados.push($(this).val());
                        });
                        var filiaisInicial = localStorage.getItem("filiaisGrupo") ?
                            localStorage.getItem("filiaisGrupo").split(',') :
                            [];
                        if (selecionados.sort().join(',') === filiaisInicial.sort().join(',') && descInicial === descGrupo && !reativado) {
                            grupoOperacaoInvalida('Nenhuma alteração foi realizada! Altere alguma informação do grupo ou cancele a operação.')
                            return false;
                        }
                        if (!selecionados.length) {
                            if (reativado) {
                                grupoOperacaoInvalida('Nenhuma filial foi selecionada! Selecione ao menos uma filial para reativar este grupo ou cancele a operação.');
                            } else {
                                grupoOperacaoInvalida('Nenhuma filial foi selecionada! Selecione ao menos uma filial ou cancele a operação e execute a opção de excluir grupo, caso deseje remover esse grupo do cadastro.');
                            }
                            return false;
                        }
                        if (idEdt) {
                            salvarAtualizacaoGrp(criaObjetoGrupoEnvio(selecionados.map(Number), idEdt, descGrupo, partEnvio));
                        } else if (selecionados.length) {
                            cadastrarGrupoNovo(criaObjetoGrupoEnvio(selecionados.map(Number), idEdt, descGrupo, partEnvio));
                        }
                    }
                    else {
                        grupoOperacaoInvalida('Já existe um grupo cadastrado com esta descrlção! Altere a descrição ou cancele esta operação e edite o grupo existente.')
                        return false;
                    }
                }
            },
            cancel: {
                text: 'Cancelar',
                btnClass: 'btn-red',
                action: function () {
                    reativado = false;
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
        onOpenBefore: function () {
            var self = this;
            var idsSelecionados = localStorage.getItem("filiaisGrupo") ? localStorage.getItem("filiaisGrupo").split(',') : [];

            if (tit.toLowerCase().indexOf('reativar') > -1) {
                self.buttons.confirm.setText('Ativar')
            } else if(tit.toLowerCase().indexOf('atualizar') > -1) {
                self.buttons.confirm.setText('Atualizar')
            }

            for (i = 0; i !== idsSelecionados.length; i++) {
                var checkbox = self.$content.find("li input[type='checkbox'][value='" + idsSelecionados[i] + "']");
                checkbox.attr("checked", "checked");
            }
            self.$content.find("li input[type='checkbox']").checkboxradio();
            $(".bg_load").hide();
            $(".wrapper").hide();
            var $menuTitulo = $(".navbar.navbar-default.navbar-fixed-top");
            $menuTitulo.removeClass('ocultarElemento');

        },
        onDestroy: function () {
            localStorage.removeItem("idGrpEditar");
            localStorage.removeItem("filiaisGrupo");
        },
    });
}
function geraListaFilial(filiais) {
    var retorno = '';
    for (var i = 0; i < filiais.length; i++) {
        retorno += '<li class="phradio" data-filtro="' + filiais[i].token + '">' +
            '<label class="phradio-info">' +
            '<input style="margin:0px !important" type="checkbox" value="' + filiais[i].valor + '">' +
            '<span class="checkmark"> ' + filiais[i].descricao + '</span>' +
            '</label>' +
            '</li>'
    }
    return retorno;
}

function grupoOperacaoInvalida(msg) {
    $.confirm({
        icon: 'fa fa-warning',
        theme: 'modern',
        animation: 'scale',
        typeAnimated: true,
        type: 'red',
        title: 'Operação Invalida!',
        containerFluid: true,
        content: msg,
        buttons: {
            ok: {
                btnClass: 'btn-red',
                text: 'Ok'
            },
        },
    });
}
function validaDescricaoExistente(desc) {
    var dadosGrupo = dtbCad.data()
        .toArray();
    var contador = 0;
    var idEdt = localStorage.getItem("idGrpEditar")
    dadosGrupo.map(obj => {
        if ((!idEdt || obj.id !== parseInt(idEdt)) && obj.descricao === desc) {
            contador++;
        }
        return obj;
    });
    return contador > 0;
}
function atualizaLinhaGrupo(dado) {
    dtbCad.data().map(obj => {
        if (obj.id === parseInt(dado.valor)) {
            obj.descricao = dado.descricao;
            obj.participacaoGrupo = parseFloat(dado.dadosAdicionais[0].replace(',', '.'));
            obj.status = dado.dadosAdicionais[1];
            obj.operacao = retornaOperacaoGrupoGrid(dado.dadosAdicionais[1])

        }
        return obj;
    });
    var dadosNovos = dtbCad.data().toArray();
    dtbCad.clear();
    dtbCad.data(dtbCad).rows.add(dadosNovos);
    dtbCad.draw();


}
function insereLinhaGrupo(dado) {
    dtbCad.row.add({
        "id": parseInt(dado.valor),
        "descricao": dado.descricao,
        "participacao": parseFloat(dado.dadosAdicionais[0].replace(',', '.')),
        "status": "Ativo",
        "operacao": '<a href="#" style="margin:3px" class="btn btn-info editarGrupo" data-toggle="tooltip" title="Editar" ><i class="fa fa-pencil" aria-hidden="true"></i></a>'
            + '<a href="#" style="margin:3px;" class="btn btn-danger excluirGrupo" data-toggle="tooltip" title="Cancelar" ><i class="fa fa-trash" aria-hidden="true"></i></a>'
    }).draw();
}
function retornaOperacaoGrupoGrid(status) {
    var operacao = '';
    if (status === "Ativo") {
        operacao = '<a href="#" style="margin:3px" class="btn btn-info editarGrupo" data-toggle="tooltip" title="Editar" ><i class="fa fa-pencil" aria-hidden="true"></i></a>'
            + '<a href="#" style="margin:3px;" class="btn btn-danger excluirGrupo" data-toggle="tooltip" title="Excluir" ><i class="fa fa-trash" aria-hidden="true"></i></a>';
    } else {
        operacao = '<a href="#" style="margin:3px;" class="btn btn-primary editarGrupo" data-toggle="tooltip" title="Ativar" ><i class="fa fa-check-square-o" aria-hidden="true"></i></a>';
    }
    return operacao;
}