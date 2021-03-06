﻿var tbPedido;
var specialKeys = new Array();
specialKeys.push(8); //Backspace
specialKeys.push(46); //Delete
specialKeys.push(96); //numpad 0
var origemModal = false;
$(document).ready(function () {
    $(window).on("load", carregar);
    $('.btnFooters').prepend($.parseHTML(btnStatusTransicao));
    $(document).on('click', '.clonarPedido', function (e) {
        if (permissoesUsuarioLogado.indexOf('Clonar Qualquer Pedido') === -1) {
            semAcesso();
        } else {
            objEnvio = {};
            objEnvio.codigo = $(this).closest('tr').children().eq(2).html();
            objEnvio.idUsuarios = sessionStorage.getItem("id_usuario");
            $('.selectpicker').selectpicker('hide');
            $(".navbar.navbar-default.navbar-fixed-top").addClass('ocultarElemento');
            $(".bg_load").show();
            $(".wrapper").show();
            criarClonePedido(objEnvio);
        }
    });
    
    $(document).on('click', '.validarPedido', function (e) {
        objEnvio = {};
        var userLog = $(this).closest('tr').children().eq(13).html().trim().toLowerCase();
        
        var isUserLog = $('#cbUsuario option').filter(function () { return $(this).html().trim().toLowerCase() == userLog}).val() == sessionStorage.getItem("id_usuario")
   
        objEnvio.codigo = $(this).closest('tr').children().eq(2).html();
        $('.btnFooters .exibeBtn').addClass('ocultarElemento');
        carregaPedidoSintetico(objEnvio, isUserLog);

        $('#modalBodyDetalhePedido').addClass('ocultarElemento');
        $('.btnFooters').addClass('ocultarElemento');
        $("#modalLoad").show();
        $("#modalwrapper").show();
        $('#modalDetalhamentoPedido').modal({
            backdrop: 'static',
            keyboard: false
        });
    });
    $(document).on('click', '.devolverPedido', function (e) {
        if (permissoesUsuarioLogado.indexOf('Reprovar para Editar Qualquer Pedidos') === -1) {
            semAcesso();
        } else {
            if (observacaoStatus.indexOf('A') > -1) {
                alteraStatusPedido('A', $(this).closest('tr').children().eq(2).html())
            }
            else {
                objEnvio = {};
                objEnvio.codigo = $(this).closest('tr').children().eq(2).html();
                objEnvio.status = 'A';
                atualizarStatus(objEnvio);
            }
        }
    });

    $(document).on('click', '.cancelarPedido', function (e) {
        if (permissoesUsuarioLogado.indexOf('Cancelar Qualquer Pedidos') === -1) {
            semAcesso();
        } else {
            if (observacaoStatus.indexOf('C') > -1) {
                alteraStatusPedido('C', $(this).closest('tr').children().eq(2).html())
            }
            else {
                objEnvio = {};
                objEnvio.codigo = $(this).closest('tr').children().eq(2).html();
                objEnvio.status = 'C';
                atualizarStatus(objEnvio);
            }
        }
    });
    $(document).on('click', '.aprovarPedido', function (e) {
        if (permissoesUsuarioLogado.indexOf('Aprovar Qualquer Pedidos') === -1) {
            semAcesso();
        } else {
            if (observacaoStatus.indexOf('L') > -1) {
                alteraStatusPedido('L', $(this).closest('tr').children().eq(2).html())
            }
            else {
                objEnvio = {};
                objEnvio.codigo = $(this).closest('tr').children().eq(2).html();
                objEnvio.status = 'L';
                atualizarStatus(objEnvio);
            }
        }
    });
    $(document).on('click', '.reprovarPedido', function (e) {
        if (permissoesUsuarioLogado.indexOf('Reprovar Qualquer Pedido') === -1) {
            semAcesso();
        } else {
            if (observacaoStatus.indexOf('R') > -1) {
                alteraStatusPedido('R', $(this).closest('tr').children().eq(2).html())
            }
            else {
                objEnvio = {};
                objEnvio.codigo = $(this).closest('tr').children().eq(2).html();
                objEnvio.status = 'R';
                atualizarStatus(objEnvio);
            }
        }
    });
    $(document).on('click', '.finalizarPedido', function (e) {
        if (permissoesUsuarioLogado.indexOf('Finalizar para Aprovar Qualquer Pedidos') === -1) {
            semAcesso();
        } else {
            $('#modalDetalhamentoPedido').modal('hide');
            if (observacaoStatus.indexOf('F') > -1) {
                alteraStatusPedido('F', $(this).closest('tr').children().eq(2).html())
            }
            else {
                objEnvio = {};
                objEnvio.codigo = $(this).closest('tr').children().eq(2).html();
                objEnvio.status = 'F';
                atualizarStatus(objEnvio);
            }
        }

    });
    $(document).on('click', '#btnFinalizar', function (e) {
        if (permissoesUsuarioLogado.indexOf('Finalizar para Aprovar Qualquer Pedidos') === -1) {
            semAcesso();
        } else {
            origemModal = true;
            $('#modalDetalhamentoPedido').modal('hide');
            if (observacaoStatus.indexOf('F') > -1) {
                alteraStatusPedido('F', $('#spnCodPed').html().replace(/\D/g, ""))
            }
            else {
                objEnvio = {};
                objEnvio.codigo = $('#spnCodPed').html().replace(/\D/g, "");
                objEnvio.status = 'F';
                atualizarStatus(objEnvio);
            }
        }
    });
    $(document).on('click', '#btnCancelar', function (e) {
        if (permissoesUsuarioLogado.indexOf('Cancelar Qualquer Pedidos') === -1) {
            semAcesso();
        } else {
            origemModal = true;
            $('#modalDetalhamentoPedido').modal('hide');
            if (observacaoStatus.indexOf('C') > -1) {
                alteraStatusPedido('C', $('#spnCodPed').html().replace(/\D/g, ""))
            }
            else {
                objEnvio = {};
                objEnvio.codigo = $('#spnCodPed').html().replace(/\D/g, "");
                objEnvio.status = 'C';
                atualizarStatus(objEnvio);
            }
        }
    });
    $(document).on('click', '#btnReprovar', function (e) {
        if (permissoesUsuarioLogado.indexOf('Reprovar Qualquer Pedidos') === -1) {
            semAcesso();
        } else {
            origemModal = true;
            $('#modalDetalhamentoPedido').modal('hide');
            if (observacaoStatus.indexOf('R') > -1) {
                alteraStatusPedido('R', $('#spnCodPed').html().replace(/\D/g, ""))
            }
            else {
                objEnvio = {};
                objEnvio.codigo = $('#spnCodPed').html().replace(/\D/g, "");
                objEnvio.status = 'R';
                atualizarStatus(objEnvio);
            }
        }
    });
    $(document).on('click', '#btnAprovar', function (e) {
        if (permissoesUsuarioLogado.indexOf('Aprovar Qualquer Pedidos') === -1) {
            semAcesso();
        } else {
            origemModal = true;
            $('#modalDetalhamentoPedido').modal('hide');
            if (observacaoStatus.indexOf('L') > -1) {
                alteraStatusPedido('L', $('#spnCodPed').html().replace(/\D/g, ""))
            }
            else {
                objEnvio = {};
                objEnvio.codigo = $('#spnCodPed').html().replace(/\D/g, "");
                objEnvio.status = 'L';
                atualizarStatus(objEnvio);
            }
        }
    });
    $(document).on('click', '#btnDevolver', function (e) {
        if (permissoesUsuarioLogado.indexOf('Reprovar para Editar Qualquer Pedidos') === -1) {
            semAcesso();
        } else {
            origemModal = true;
            $('#modalDetalhamentoPedido').modal('hide');
            if (observacaoStatus.indexOf('A') > -1) {
                alteraStatusPedido('A', $('#spnCodPed').html().replace(/\D/g, ""))
            }
            else {
                objEnvio = {};
                objEnvio.codigo = $('#spnCodPed').html().replace(/\D/g, "");
                objEnvio.status = 'A';
                atualizarStatus(objEnvio);
            };
        }
    });
    $(document).on('click', '.acessarPedido', function (e) {
        sessionStorage.setItem("pedidoId", $(this).closest('tr').children().eq(2).html());
        $('.selectpicker').selectpicker('hide');
        $(".navbar.navbar-default.navbar-fixed-top").addClass('ocultarElemento');
        $(".bg_load").show();
        $(".wrapper").show();
        window.location = "../cadastro/compra.cshtml";

    });
    $(document).on('click', '#btnAcessar', function (e) {
        sessionStorage.setItem("pedidoId", $('#spnCodPed').html().replace(/\D/g, ""));
        $('.selectpicker').selectpicker('hide');
        $(".navbar.navbar-default.navbar-fixed-top").addClass('ocultarElemento');
        $(".bg_load").show();
        $(".wrapper").show();
        window.location = "../cadastro/compra.cshtml";
    });
    $(document).on('keypress', '#txtCodOri', function (event) {

        var keyCode = event.keyCode || event.which
        if (keyCode == 8 || (keyCode >= 35 && keyCode <= 40)) {
            return;
        }

        var regex = new RegExp("^[a-zA-Z0-9]+$");
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);

        if (!regex.test(key)) {
            event.preventDefault();
            return false;
        }
    })
    $(document).on('paste', '#txtCodOri', function (e) {
        var paste = e.originalEvent.clipboardData.getData('Text');
        var isValidoPaste = paste.replace(/[^a-z0-9]/gi, '') === paste;
        if (isValidoPaste) {
            return;
        }

        e.preventDefault();
    })

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
        if (validString !== element.value) {
            element.value = validString;
        }
    });
    $(document).on('paste', '.txtInteiro', function (e) {
        var paste = e.originalEvent.clipboardData.getData('Text');

        if (isNumber(paste) && Math.floor(paste) == parseInt(paste)) {
            return;
        }
        e.preventDefault();
    })
    $('#txtDtEntregaPed').daterangepicker({
        locale: configuracaoCalendariosPedido,
        autoUpdateInput: false,
        linkedCalendars: true,
        "parentEl": "#principal",
        showDropdowns: true,
        alwaysShowCalendars: true,
        buttonClasses: "btn btn-small",
        cancelClass: "btn-primary",
        ranges: {
            "Na Próxima Semana": recuperaRange('semana'),
            "No Próxima Mês": recuperaRange('mes'),
            "Em 3 Meses": recuperaRange('trimestre'),
            "Em 6 Meses": recuperaRange('semestre')
        }
    }).on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
    }).on('cancel.daterangepicker', function (ev, picker) {
        $(this).val('');
    });

    $('#txtDtCadPed').daterangepicker({
        locale: configuracaoCalendariosPedido,
        autoUpdateInput: false,
        linkedCalendars: true,
        "parentEl": "#principal",
        showDropdowns: true,
        alwaysShowCalendars: true,
        buttonClasses: "btn btn-small",
        cancelClass: "btn-primary",
        ranges: {
            "Na Próxima Semana": recuperaRange('semana'),
            "No Próxima Mês": recuperaRange('mes'),
            "Em 3 Meses": recuperaRange('trimestre'),
            "Em 6 Meses": recuperaRange('semestre')
        }
    }).on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
    }).on('cancel.daterangepicker', function (ev, picker) {
        $(this).val('');
    });
    $(document).on('keyup touchend', '#fTxtBusca', function (e) {
        var keyCode = e.keyCode === 0 ? e.charCode : e.keyCode;
        var ret = keyCode >= 48 && keyCode <= 57 || keyCode >= 65 && keyCode <= 90 || keyCode >= 97 && keyCode <= 122 ||
            specialKeys.indexOf(e.keyCode) !== -1 && e.charCode !== e.keyCode;
        if (ret) {
            tbPedido.search(this.value).draw();
        }
        else if (keyCode === 13) {
            document.activeElement.blur();
            $("#fTxtBusca").blur();
        }
    });
    $(document).on('click', '#btnPrint', function (e) {
        printElement(document.getElementById("modalBodyDetalhePedido"));

    });
    $('#drpSec').on('change', function (e) {
        var objParam = {};
        $('#divEsp').addClass('ocultarElemento');
        $("#drpEsp").html('');
        if ($('#drpSec').val()) {
            $('#drpSec').selectpicker('toggle');
            $('.selectpicker').selectpicker('hide');
            $(".navbar.navbar-default.navbar-fixed-top").addClass('ocultarElemento');
            $(".bg_load").show();
            $(".wrapper").show();
            objParam.secoes = $('#drpSec').val().join(',');
            carregarEspecie(objParam);
        }
    });
    $('#drpSeg').on('change', function (e) {
        $('#divEsp').addClass('ocultarElemento');
        $("#drpEsp").html('');
        $('#divSec').addClass('ocultarElemento');
        $("#drpSec").html('');

        var objParam = {};
        if ($('#drpSeg').val()) {
            if ($('#divSec').hasClass('ocultarElemento')) {
                $('#divSec').removeClass('ocultarElemento');
            }
            $('.selectpicker').selectpicker('hide');
            $(".navbar.navbar-default.navbar-fixed-top").addClass('ocultarElemento');
            $(".bg_load").show();
            $(".wrapper").show();
            objParam.segmentos = $('#drpSeg').val().join(',').replace(/[^\d,]/g, '');
            console.log(objParam)
            carregarSecoes(objParam);
        }
    });
    $('#modalDetalhamentoPedido').on('hidden.bs.modal', function () {
        $("#printSection").remove();
    })
});
function printElement(elem) {
    var domClone = elem.cloneNode(true);

    var $printSection = document.getElementById("printSection");

    if (!$printSection) {
        $printSection = document.createElement("div");
        $printSection.id = "printSection";
        document.body.appendChild($printSection);
    }

    $printSection.innerHTML = "";
    $printSection.appendChild(domClone);
    window.print();

}

function carregarPackNF(id, dados, colunas, tbIndice) {
    console.log(dados);
    console.log(colunas);
    var tbCadPackNF = $('#' + id).DataTable({
        paging: false, /* define se a tabela deve usar paginação */
        searching: false, /* define se deve usar o campo Buscar dentro da tabela */
        lengthChange: false,
        rowsGroup: [-2, -1, 0],
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
            {
                "targets": "_all",
                "render": function (data, type, row, meta) {
                    if (type === 'display' && meta.col > 1) {

                        return data.toLocaleString('pt-BR')

                    }
                    else return data;
                }
            }
        ],
        "info": false,
        columns: colunas
    })
    recalculaTotalColunas(tbCadPackNF);
}
function carregar() {
    sessionStorage.removeItem('compra');
    sessionStorage.removeItem("pedidoId");
    sessionStorage.removeItem('produtosLista');
    sessionStorage.removeItem('cadastroProduto');
    sessionStorage.removeItem("produtosComprarSelecionados");
    sessionStorage.removeItem("pedidoStatus");
    sessionStorage.removeItem("cadastroNovo");
    sessionStorage.removeItem('fornSelecionado');
    cargaInicialPedido();
}
function carregarPedidos() {
    tbPedido = $('#tabelaPedidos').DataTable({
        paging: false, /* define se a tabela deve usar paginação */
        searching: true, /* define se deve usar o campo Buscar dentro da tabela */
        lengthChange: false,
        deferRender: true,
        "order": [[2, "desc"]],
        responsive: true,
        scrollCollapse: true, 
        destroy: true,
        fixedHeader: true,
        scrollX: true,
        scrollY: '50vh',
        "columnDefs": [
            {
                "targets": "_all",
                'className': 'dt-body-center'
            },
            {
                "targets": [13],
                "orderable": true,
                'type': 'currency'
            },
            {
                "targets": [3],
                visible: false
            },
            {
                "targets": [0, -1],
                "orderable": false,
                'type': 'date-eu'
            },
            {
                "targets": [10, 11],
                "orderable": true,
                'type': 'date-eu'
            },
            {
                "targets": [12],
                "orderable": true,
                'type': 'formatted-num'
            },

        ],
        "language": {
            "emptyTable": "Nenhum pedido encontrado",
            "zeroRecords": "Nenhum pedido corresponde ao filtro",
            "paginate": {
                "previous": "Anterior",
                "next": "Próximo"
            }
        },
        drawCallback: function (settings) {
            $(function () {
                $('[data-toggle="tooltip"]').tooltip();
            });
        },
        "ajax": {
            'type': 'POST',
            'cache': false,
            'url': urlApi + 'cadastro/pedido/RetornaPedidosFiltrados',
            'data': function (d) {
                return criaObjConsulta();
            },
            'beforeSend': function (req) {
                req.setRequestHeader('Authorization', sessionStorage.getItem("token"));
            },
            "dataSrc": function (json) {
                console.log(json)
                var retorno = [];
                for (var i = 0; i < json.length; i++) {
                    retorno.push(geraLinhaRetornoPedido(json[i]))
                }

                $(".bg_load").fadeOut();
                $(".wrapper").fadeOut();
                $(".navbar.navbar-default.navbar-fixed-top").removeClass('ocultarElemento');
                $("div.controls.ocultarElemento").removeClass('ocultarElemento');
                $("#divSeg").removeClass('ocultarElemento');
                $("#divForn").removeClass('ocultarElemento');
                $("#divMarca").removeClass('ocultarElemento');
                //$("#divSec").removeClass('ocultarElemento');
                $(".selectpicker").selectpicker('show');
                $("#divOcultaColuna").removeClass('ocultarElemento');

                return retorno;
            }
        }
    });
}
function retornaBotõesAlteraStatus(opcoes) {
    var btnOperacoes = '';
    for (var i = 0; i < opcoes; i++) {

    }
}
function geraLinhaRetornoPedido(retorno) {
    var statusTransicao = retorno.idStatusPedidoPara ? retorno.idStatusPedidoPara.split(','):[];

    var isPedUserLog = $('#cbUsuario option').filter(function () { return $(this).html().trim().toLowerCase() == retorno.usuario.trim().toLowerCase(); }).val() == sessionStorage.getItem("id_usuario")
    
    var btnClonar = '<a href="#" class="btn btn-primary clonarPedido" data-toggle="tooltip" data-container="body" title="Copiar Pedido" style="margin:auto"><i class="fa fa-plus-square" aria-hidden="true"></i></a>'
    var btnHTML = $.parseHTML(btnStatusTransicaoIcones);
    for (var i = 0; i < statusTransicao.length; i++) {
        if (isPedUserLog) {
            if (statusTransicao[i].toLowerCase() === 'f') {
                if (permissoesUsuarioLogado.indexOf('Finalizar para Aprovar os Próprio Pedidos') > -1) {
                    $(btnHTML).filter('.status' + statusTransicao[i]).removeClass('ocultarElemento')
                }
            } else if (statusTransicao[i].toLowerCase() === 'c') {
                if (permissoesUsuarioLogado.indexOf('Cancelar os Próprios Pedidos') > -1) {
                    $(btnHTML).filter('.status' + statusTransicao[i]).removeClass('ocultarElemento')
                }
            } else if (statusTransicao[i].toLowerCase() === 'a') {
                if (permissoesUsuarioLogado.indexOf('Reprovar para Editar os Próprios Pedidos') > -1) {
                    $(btnHTML).filter('.status' + statusTransicao[i]).removeClass('ocultarElemento')
                }
            } else if (statusTransicao[i].toLowerCase() === 'l') {
                if (permissoesUsuarioLogado.indexOf('Aprovar os Próprios Pedidos') > -1) {
                    $(btnHTML).filter('.status' + statusTransicao[i]).removeClass('ocultarElemento')
                }
            } else {
                $(btnHTML).filter('.status' + statusTransicao[i]).removeClass('ocultarElemento')
            }
            
        } else {
            $(btnHTML).filter('.status' + statusTransicao[i]).removeClass('ocultarElemento')
        }
    }

    var btnOperacoes = '<a href="#" class="btn btn-primary validarPedido" data-toggle="tooltip" data-container="body" title="Detalhamento" style="margin:3px"><i class="fa fa-external-link-square" aria-hidden="true"></i></a>' +
        '<a href="#" class="btn btn-primary acessarPedido" data-toggle="tooltip" data-container="body" title="Abrir" style="margin:3px"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>';
    for (var i = 0; i < btnHTML.length; i++) {
        btnOperacoes += btnHTML[i].outerHTML;
    }
    var linhaRetorno = [
        btnOperacoes,
        retorno.status,
        retorno.idPedido,
        retorno.idProduto,
        retorno.codProduto,
        retorno.codigoOriginal,
        toTitleCase(retorno.descricaoProduto),
        configuraMascaraCnpj(retorno.cnpj),
        toTitleCase(retorno.nomeFantasia),
        toTitleCase(retorno.descricaoMarca),
        moment(retorno.dataCadastro).format("DD/MM/YYYY"),
        moment(retorno.dataEntregaInicio).format("DD/MM/YYYY"),
        retorno.qtdeItens.toLocaleString('pt-BR'),
        (retorno.precoCusto * retorno.qtdeItens).toLocaleString('pt-BR', { style: "currency", currency: "BRL" }),
        retorno.usuario,
        btnClonar
    ];
    return linhaRetorno;

}
function carregaFormCompraManager() {
    $("#drpMarc").selectpicker('val', '');
    $("#drpSec").selectpicker('val', '');
    $("#drpCNPJ").selectpicker('val', '');
    carregarPedidos();
    var $menuTitulo = $(".navbar.navbar-default.navbar-fixed-top");
    $menuTitulo.find('.navbar-header .navbar-center').text('Consulta de Pedidos');
    if (localStorage.getItem("erro") !== null) {
        var msgFalha = localStorage.getItem("erro");
        localStorage.removeItem("erro");
        setTimeout(function () { erroCadCompra(msgFalha, "alertProdCompra"); }, 500);
    }
}
function criaPainelRelatorio(id, titulo) {
    return '<div class="row"><fieldset id="' + id + '" class="collapsible cadPackForm"><legend>' + titulo +
        '&nbsp; &nbsp;</legend><div class="field-body"><div class="col-md-12 col-sm-12 col-xs-12 table-responsive" style="max-height:65vh;overflow:auto;"></div></div></fieldset></div>'
}
function criaPainelRelatorioDist(titulo, id) {
    var painelRelatorio = '<div class="row">' +
        '<div class="col-md-12">' +
        '<div class="panel panel-primary">' +
        '<div class="panel-heading">' +
        '<h3 class="panel-title">' + titulo + '</h3>' +
        '</div>' +
        '<div id="' + id + '" class="panel-body">' +
        '<div class="col-md-12 col-sm-12 col-xs-12 table-responsive" style="max-height:65vh;overflow:auto;"></div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';
    return painelRelatorio;
}
function geraColunaDistribuicaoNF(filiais) {
    var colunasDistribuicao = [{ "data": "descricao" }];
    for (var i = 0; i < filiais.length; i++) {
        colunasDistribuicao.push({ "data": "filial" + (i + 1) });
    }
    colunasDistribuicao.push({ "data": "total" });
    return colunasDistribuicao;
}
function carregarDistribuicaoFilialNF(idTabelaDist, colunmsPk, dadosPk) {
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
                            return data.toLocaleString('pt-BR', { maximumFractionDigits: 2 })
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
                    // 'sort', 'type' and undefined all just use the integer
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

            }

        },
        "drawCallback": function (settings) {
            var api = this.api();
            var rows = api.rows().nodes();
            var colSpan = $(rows).find('td').length;
            $(rows).eq(5).before(
                '<tr class="groupOtb"><td colspan="' + colSpan + '">Planejamento OTB</td></tr>'
            );
        },
        "info": false,
        destroy: true,
        data: dadosPk,
        columns: colunmsPk
    });

    tbDistribuicao.columns.adjust().draw();
}

function geraCargaDistPackFiliaisNF(grupos, indexPack, custo) {
    var totalItemPack = $("#tblPackCad" + indexPack).dataTable().api().column(".sumItem")
        .data()
        .reduce(function (a, b) {
            return a + b;
        });
    for (var i = 0; i < grupos.length; i++) {

        var colreg = geraColunaDistribuicaoNF(grupos[i].filiais);

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
        dadosPk = recalculaTotalLinhaFiliais(dadosPk)
        dadosPk = calculaItensCustoPackFilial(totalItemPack, custo, dadosPk);
        console.log(colreg);
        console.log(dadosPk);
        carregarDistribuicaoFilialNF("tblGrpPack" + grupos[i].idGrupo + '_' + indexPack, colreg, dadosPk)
    }
    if ($('#tabDadosDist' + indexPack + ' li').length > 1) {
        $('#tabDadosDist' + indexPack + ' li').children('a').first().click();
    }

}

function criaTabelaDistribuicaoNF(colunas) {
    var tabelaHtml = '<thead><tr>' +
        '<th class="groupHeaderTable">Dados</th>';
    for (var i = 0; i < colunas.length; i++) {
        tabelaHtml += '<th class="groupHeaderTable">' + colunas[i].nome + '</th>'
    }
    tabelaHtml += '<th class="groupHeaderTable">Total/Média</th>'

    tabelaHtml += '</tr></thead>';
    return tabelaHtml;
}
function retornaTabela(id) {
    return '<table id="' + id + '" cellpadding="0" cellspacing="0" class="tbPackCad cell-border hover table cell nowrap stripe compact pretty"></table>';
}
function buscarPedidosFiltrado() {
    $('.selectpicker').selectpicker('hide');
    $(".navbar.navbar-default.navbar-fixed-top").addClass('ocultarElemento');
    //objEnvio = {};
    //objEnvio.codigo = "2";
    ////var statusAtual = retornaStatusValor($(this).closest('tr').children().eq(12).html());
    //$('.btnFooters .exibeBtn').addClass('ocultarElemento');
    //carregaPedidoSintetico(objEnvio)
    $(".bg_load").show();
    $(".wrapper").show();
    tbPedido.ajax.reload();
}
function criaObjConsulta() {
    var objConsulta = {};

    var user = [];
    objConsulta.codigo = $('#txtCodProd').val();
    objConsulta.codigoOriginal = $('#txtCodOri').val();
    objConsulta.referenciaFornecedor = $('#txtRefProd').val();
    objConsulta.descricaoProduto = $('#txtDescProd').val();
    objConsulta.idPedido = $('#txtIdPed').val();
    $('#cbUsuario option:selected').each(function () {
        user.push($(this).val());
    });
    $('#drpSeg').val() ? objConsulta.segmentos = $('#drpSeg').val().join(',').replace(/[^\d,]/g, '') : objConsulta.segmentos = '';
    $('#drpSec').val() ? objConsulta.secoes = $('#drpSec').val().join(',') : objConsulta.secoes = '';
    $('#drpEsp').val() ? objConsulta.especies = $('#drpEsp').val().join(',') : objConsulta.especies = '';
    $('#cbAttrForn').val() ? objConsulta.attrFornecedor = $('#cbAttrForn').val().join(',') : objConsulta.attrFornecedor = '';
    objConsulta.idUsuarios = user.join(',');
    $('#drpCNPJ').val() ? objConsulta.idFornecedor = $('#drpCNPJ').val().join(',') : objConsulta.idFornecedor = '';
    $('#drpMarc').val() ? objConsulta.marcas = $('#drpMarc').val().join(',') : objConsulta.marcas = '';
    $('#cbStatus').val() ? objConsulta.status = $('#cbStatus').val().join(',') : objConsulta.status = '';
    objConsulta.dtEntregaInicial = formataStringData($('#txtDtEntregaPed').val().split(' - ')[0]);
    objConsulta.dtEntregaFinal = formataStringData($('#txtDtEntregaPed').val().split(' - ')[1]);
    if (localStorage.getItem('primeiroAcesso')) {
        localStorage.removeItem('primeiroAcesso');
        var now = new Date();
        now.setDate(now.getDate() + 30);
        objConsulta.dtCadInicial = formatarDataEnvio(moment(now));
        objConsulta.dtCadFinal = formatarDataEnvio(moment(now));

    } else {
        objConsulta.dtCadInicial = formataStringData($('#txtDtCadPed').val().split(' - ')[0]);
        objConsulta.dtCadFinal = formataStringData($('#txtDtCadPed').val().split(' - ')[1]);
        objConsulta.dtEntregaInicial = formataStringData($('#txtDtEntregaPed').val().split(' - ')[0]);
        objConsulta.dtEntregaFinal = formataStringData($('#txtDtEntregaPed').val().split(' - ')[1]);
    }

    console.log(objConsulta)
    return objConsulta
}

function criaSinteticoTitulo(dados) {
    $('#spnIdProd').html(dados.idProduto);
    $('#spnCodPed').html(dados.idPedido);
}
function criaSinteticoFornecedor(dados) {
    $('#spnRazSoc').html(dados.razaoSocial);
    $('#spnNomFan').html(dados.nomeFantasia);
    $('#spnCnpj').html(configuraMascaraCnpj(dados.cnpj));
    $('#spnRefForn').html(dados.referenciaFornecedor);

}
function criaSinteticoPedido(dados) {
    $('#spnDtEmi').html(dados.dataCadastro);
    $('#spnDtEnt').html(dados.dataEntregaPrazo);
    $('#spnCstTot').html(dados.precoCustoTotal.toLocaleString('pt-BR', { style: "currency", currency: "BRL" }));
    $('#spnComp').html(dados.nomeUsuario);
}
function criaSinteticoProduto(dados) {
    $('#spnCodProd').html(dados.codProduto);
    $('#spnDescSecEsp').html(dados.descSecEsp);
    $('#spnDesc').html(dados.descricaoProduto);
    $('#spnDescRes').html(dados.descricaoReduzidaProduto);
    $('#spnCustoBruto').html(dados.precoCusto.toLocaleString('pt-BR', { style: "currency", currency: "BRL" }));
    $('#spnPrVenda').html(dados.precoVenda.toLocaleString('pt-BR', { style: "currency", currency: "BRL" }));
    $('#spnQtdTot').html(dados.qtde.toLocaleString('pt-BR'));
}
function criaSinteticoFoto(dados) {
    if (dados.fotoProduto) {
        $('#imgProdPrincipal').attr('src', 'data:image/' + dados.fotoProduto.extensao.toLowerCase() + ';base64,' + dados.fotoProduto.imagem);
    }
}

function criaColunasTabelaNF(tamanhos) {
    var tabelaHtml = '<thead><tr>' +
        '<th class="groupHeaderTable" rowspan="2">Referência</th>' +
        '<th class="groupHeaderTable" rowspan="2">Cores</th>' +
        '<th class="groupHeaderTable" colspan="' + (tamanhos.length) + '">Tamanho</th>' +
        '<th class="groupHeaderTable numInt sumItem" rowspan="2" >Total</th>' +
        '<th class="groupHeaderTable" rowspan="2" >Qtd. Packs</th>' +
        '<th class="groupHeaderTable" rowspan="2" >Total Itens</th>' +
        '</tr><tr>';
    for (var i = 0; i < tamanhos.length; i++) {
        tabelaHtml += '<th class="groupHeaderTableRigth separaDireita numInt">' + tamanhos[i].descricaoTamanho.toUpperCase() + '</th>'
    }
    tabelaHtml += '</tr></thead>' + retornoRodapeTabelaNF(tamanhos);
    return tabelaHtml;

}
function retornoRodapeTabelaNF(tamanhos) {
    var tabelaHtml = '<tfoot><tr>' +
        '<th class="groupHeaderTable" colspan="2">Total</th>';
    for (var i = 0; i < tamanhos.length; i++) {
        tabelaHtml += '<th class="groupHeaderTableRigth">0</th>'
    }
    tabelaHtml += '<th class="groupHeaderTable" style="border-right:none !important">0</th><th class="groupHeaderTable" style="border-left:none !important;border-right:none !important"></th><th class="groupHeaderTable" style="border-left:none !important"></th></tr></tfoot>';
    return tabelaHtml;
}
