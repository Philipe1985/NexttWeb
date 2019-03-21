var tbEntradaNF
$(document).ready(function () {
    $(document).on('keydown', '.txtInteiro', function (e) {
        console.log(e.keyCode)
        console.log()
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
            (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
            (e.keyCode === 86 && (e.ctrlKey === true || e.metaKey === true)) ||
            (e.keyCode >= 35 && e.keyCode <= 40)) {
            return;
        }
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
            return false;
        }
    })
    $(document).on('click', 'td.status-Desc', function (evento) {
        if (permissoesUsuarioLogado.indexOf('Alterar Status de NF') === -1) {
            semAcesso();
        } else {
            var nfId = tbEntradaNF.row($(this).closest('tr')).data().idEntradaNF;
            var statusVal = $('#drpStatus option:contains("' + $(this).text() + '")').val();
            var returnedData = $.grep(nfStatus, function (element, index) { return element.status == statusVal; })[0];
            if (returnedData && returnedData.mudar.length) {
                modalAtualizaStatusNF(returnedData, nfId)
            } else {
                $.confirm({
                    title: 'Atenção!',
                    content: 'Nenhum status de transição!',
                    icon: 'fa fa-warning',
                    theme: 'modern',
                    closeIcon: false,
                    animation: 'scale',
                    typeAnimated: true,
                    type: 'orange',
                    buttons: {
                        okButton: {
                            text: 'OK'
                        }
                    },

                });
            }
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
    $(window).on("load", carregar);
    $('#txtDtEntregaNF').daterangepicker({
        locale: configuracaoCalendariosPedido,
        autoUpdateInput: false,
        linkedCalendars: true,
        "opens": "left",
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

    $('#txtDtCadNF').daterangepicker({
        locale: configuracaoCalendariosPedido,
        "opens": "left",
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
});
function carregar() {
    sessionStorage.removeItem("idNFEditar");
    cargaInicialConsultaEntradaNF();
}
function carregarDadosEntradasNF(dados) {
    tbEntradaNF = $('#tabelaNF').DataTable({
        paging: true, /* define se a tabela deve usar paginação */
        searching: true, /* define se deve usar o campo Buscar dentro da tabela */
        lengthChange: false,
        pageLength: 6,
        deferRender: true,
        "ordering": true,
        "order": [[4, "asc"]],
        responsive: true,
        scrollCollapse: true,
        destroy: true,
        scrollX: true,
        "dom": '<"top"p>rt<"clear">',
        scrollY: '55vh',
        "columnDefs": [
            {
                "targets": "_all",
                'className': 'dt-body-center'
            },
            {
                "targets": [4],
                "orderable": true,
                "render": function (data, type, row, meta) {
                    return type === 'display' ? configuraMascaraCnpj(data) : data;
                }
            },
            {
                "targets": [2],

                "render": function (data, type, row, meta) {
                    return '<span class="status-Desc" data-toggle="tooltip" data-placement="right" data-container="body" title="Clique para atualizar o status">' + data + '</span>';
                }
            },
            {
                "targets": 0,
                visible: false
            },
            {
                "targets": [12],
                "orderable": true,
                'type': 'date-eu'
            },
            {
                "targets": [11],
                "orderable": true,
                "render": function(data, type, row, meta) {
                    return type === 'display' ? moment(data).format("DD/MM/YYYY HH:mm:ss"): data;
                }
            },
            {
                "targets": [6, 7, 9],
                "orderable": true,
                "render": function (data, type, row, meta) {
                    return type === 'display' ? data.toLocaleString('pt-BR') : data;
                }
            },
            {
                "targets": 10,
                "orderable": true,
                "render": function (data, type, row, meta) {
                    return type === 'display' ? data.toLocaleString('pt-BR', { style: "currency", currency: "BRL" }) : data;
                }
            }

        ],
        "language": {
            "emptyTable": "Nenhuma nota encontrado",
            "zeroRecords": "Nenhuma nota corresponde ao filtro",
            "paginate": {
                "previous": "Anterior",
                "next": "Próximo"
            }
        },
        "columns": [
            { "data": "idEntradaNF" },
            { "data": "operacao" },
            { "data": "status", 'className': 'status-Desc' },
            { "data": "filial" },
            { "data": "cnpj" },
            { "data": "fornecedor" },
            { "data": "numNF" },
            { "data": "serieNF" },
            { "data": "chaveNF" },
            { "data": "qtdItens" },
            { "data": "vlrItens" },
            { "data": "dtCadNF" },
            { "data": "dtEntNF" },
            { "data": "usuario" },
        ],
        data: dados,
        drawCallback: function (settings) {
            $(function () {
                $('[data-toggle="tooltip"]').tooltip();
            });
        },

    });
}
function geraDadosGridEntradaNF(dados) {
    console.log(dados)
    var retorno = [];

    for (var i = 0; i < dados.length; i++) {
        var objNF = {}
        objNF.idEntradaNF = dados[i].idnfFornecedor;
        objNF.operacao = '<a href="#" onclick="acessaEntradaCadastrada(\'' + dados[i].idnfFornecedor + '\');return false;" style="margin:3px" class="btn btn-info" data-toggle="tooltip" title="Acessar" data-container="body" ><i class="fa fa-pencil" aria-hidden="true"></i></a>';
        objNF.status = dados[i].statusDescricao;
        objNF.filial = dados[i].filialNome;
        objNF.cnpj = dados[i].cnpj;
        objNF.fornecedor = dados[i].razaoSocial;
        objNF.numNF = dados[i].numero;
        objNF.serieNF = dados[i].serie;
        objNF.chaveNF = dados[i].chaveAcessoNfe;
        objNF.qtdItens = dados[i].qtdeItens;
        objNF.vlrItens = dados[i].valorTotal;
        objNF.dtCadNF = dados[i].dataCadastro;//).format("DD/MM/YYYY HH:mm:ss");
        objNF.dtEntNF = moment(dados[i].dataEntrega).format("DD/MM/YYYY");
        objNF.usuario = dados[i].usuarioCadastroNome;
        retorno.push(objNF);
    }
    return retorno;
}
function acessaEntradaCadastrada(id) {
    if (permissoesUsuarioLogado.indexOf('Gerenciar Entradas de Notas') === -1) {
        semAcesso();
    } else {
        sessionStorage.setItem("idNFEditar", id)
        cadastrarNovaEntrada();
    }
}
function cadastrarNovaEntrada() {
    if (permissoesUsuarioLogado.indexOf('Cadastrar Entrada de Nota') === -1) {
        semAcesso();
    } else {
        $(".dataTables_paginate.paging_simple_numbers").addClass('ocultarElemento');
        $('.selectpicker').selectpicker('hide');
        $(".navbar.navbar-default.navbar-fixed-top").addClass('ocultarElemento');
        //objEnvio = {};
        //objEnvio.codigo = "2";
        ////var statusAtual = retornaStatusValor($(this).closest('tr').children().eq(12).html());
        //$('.btnFooters .exibeBtn').addClass('ocultarElemento');
        //carregaPedidoSintetico(objEnvio)
        $(".bg_load").show();
        $(".wrapper").show();
        window.location = "../cadastro/notafiscal.cshtml";
    }
}
function buscarEntradasNFFiltradas() {
    $(".dataTables_paginate.paging_simple_numbers").addClass('ocultarElemento');
    $('.selectpicker').selectpicker('hide');
    $(".navbar.navbar-default.navbar-fixed-top").addClass('ocultarElemento');
    //objEnvio = {};
    //objEnvio.codigo = "2";
    ////var statusAtual = retornaStatusValor($(this).closest('tr').children().eq(12).html());
    //$('.btnFooters .exibeBtn').addClass('ocultarElemento');
    //carregaPedidoSintetico(objEnvio)
    $(".bg_load").show();
    $(".wrapper").show();

    var objConsulta = {};
    objConsulta.segmentos = $.map($('#drpSeg option:selected'), function (elSeg) {
        var obj = {};
        var idSeg = Number($(elSeg).val().replace(/[^\d,]/g, ''));
        obj.idSegmento = idSeg;
        obj.secoes = $.map($('#drpSec option:selected'), function (elSec) {
            var token = $(elSec).data('tokens').split(';')[0];
            if (Number(token.split('-')[0]) === idSeg) {
                var objSec = {};
                var idSec = Number(token.split('-')[1]);
                objSec.idSecao = idSec;
                objSec.especies = $.map($('#drpEsp option:selected'), function (elEsp) {
                    var tokenEsp = $(elEsp).data('tokens').split(';')[0];
                    if (idSec === Number(tokenEsp.split('-')[0])) {
                        var objEsp = {};
                        objEsp.idEspecie = Number($(elEsp).val().split('-')[0])
                        return objEsp;
                    }
                });
                return objSec;
            }
        });
        return obj;
    });
    objConsulta.numero = $("#txtNumNota").val();
    objConsulta.chaveAcesso = $("#txtChaveAcesso").val();
    objConsulta.codigoProduto = $("#txtProdutoNF").val();
    objConsulta.dataEntregaInicio = formataStringData($('#txtDtEntregaNF').val().split(' - ')[0]);
    objConsulta.dataEntregaFinal = formataStringData($('#txtDtEntregaNF').val().split(' - ')[1]);
    objConsulta.dataCadastroInicio = formataStringData($('#txtDtCadNF').val().split(' - ')[0]);
    objConsulta.dataCadastroFinal = formataStringData($('#txtDtCadNF').val().split(' - ')[1]);
    objConsulta.fornecedores = $.map($('#drpCNPJ option:selected'), function (el) {
        var obj = {};
        obj.idFornecedor = Number($(el).val());
        return obj;
    });
    objConsulta.filiais = $.map($('#drpFiliais option:selected'), function (el) {
        var obj = {};
        obj.idFilial = Number($(el).val());
        return obj;
    });
    objConsulta.statusNFFornecedores = $.map($('#drpStatus option:selected'), function (el) {
        var obj = {};
        obj.status = $(el).val();
        return obj;
    });
    carregarEntradasNF(objConsulta)
}