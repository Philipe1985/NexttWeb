var tbProdutoCadastrar, compraProdNew = sessionStorage.getItem("compra");
$(document).ready(function () {
    $(window).on("load", carregar);
    $(document).on('click', '.inicioPedido', function (e) {
        
        var linha = $(this).closest('tr');
        var idEditar = tbProdutoCadastrar.row($(linha)).data().codProduto;
        var statudEditar = tbProdutoCadastrar.row($(linha)).data().status;
        if (!statudEditar) {
            var dadosEditar = JSON.parse(sessionStorage.getItem("produtosComprarSelecionados"));
            var editarCompra = dadosEditar.filter(function (el) {
                return el.codProduto === idEditar;
            });
            $(".navbar.navbar-default.navbar-fixed-top").addClass('ocultarElemento');
            $('.selectpicker').selectpicker('hide');
            $(".bg_load").show();
            $(".wrapper").show();
            sessionStorage.setItem("compra", JSON.stringify(editarCompra));
            window.location = "../cadastro/compra.cshtml";
        } else {
            erroCadCompra('Esta compra já foi finalizada e não pode ser alterada.', "alertProdListaCompra");
        }
        
    });
    $('#btnVoltarGerenciarCompras').click(function (event) {
        var dadosNovoProd = JSON.parse(sessionStorage.getItem("produtosLista"))[0];
        var texto = 'Ao confirmar esta operação, todos os produtos com status pendente  não serão cadastrados como um pré-pedido.';
        if (dadosNovoProd.cadastrarNovo) {
            texto = 'Ao confirmar esta operação nenhum pré-pedido será cadastrado, pois não foram concluídos os passos de cadastro para o produto novo.';
        }
        modal({
            type: "confirm",
            headerText: '<i class="fa fa-exclamation-circle red"></i>&nbsp;&nbsp;<strong><span class="hidden-xs">Atenção! </span>Tem certeza que deseja prosseguir?</strong>',
            messageText: texto,
            alertType: 'warning',
            modalSize: 'modal-lg',
            titleClass: 'red'
        }).done(function (e) {
            if (e) {
                $('.selectpicker').selectpicker('hide');
                $(".navbar.navbar-default.navbar-fixed-top").addClass('ocultarElemento');
                $(".bg_load").show();
                $(".wrapper").show();
                sessionStorage.removeItem('produtosLista');
                sessionStorage.removeItem("produtosComprarSelecionados");
                sessionStorage.removeItem("compra");
                window.location = "../gerenciamento/compra.cshtml";
            }
        });
    });
    $('#btnNovoProdCompra').click(function (event) {
        if (validarCadCompraNovoProduto()) {
            var dadosNovoProd = JSON.parse(sessionStorage.getItem("compra"))[0];
            var texto = '<strong>Os dados do novo produto exibidos abaixo não poderão ser editados durante o processo de cadastro do pré-pedido. São eles:</strong></br></br>' +
                '<ul class="fa-ul">' +
                '<li><i class="fa-li fa fa-pencil-square-o red"></i><strong>Seção: ' + $("#drpSec option:selected").text() + '</strong></li>' +
                '<li><i class="fa-li fa fa-pencil-square-o red"></i><strong>Espécie: ' + dadosNovoProd.especie + '</strong></li>' +
                '<li><i class="fa-li fa fa-pencil-square-o red"></i><strong>Código Original: ' + dadosNovoProd.codOriginal + '</strong></li>' +
                '<li><i class="fa-li fa fa-pencil-square-o red"></i><strong>Marca: ' + $("#drpMarc option:selected").text() + '</strong></li>' +
                '<li><i class="fa-li fa fa-pencil-square-o red"></i><strong>Referência: ' + dadosNovoProd.referencia + '</strong></li>' +
                '<li><i class="fa-li fa fa-pencil-square-o red"></i><strong>Fornecedor: ' + $("#drpCNPJ option:selected").text() + '</strong></li>' +
                '</ul>';
            modal({
                type: "confirm",
                headerText: '<i class="fa fa-exclamation-circle red"></i>&nbsp;&nbsp;<strong><span class="hidden-xs">Atenção! </span>Tem certeza que deseja prosseguir?</strong>',
                messageText: texto,
                yesButtonText: 'Continuar',
                noButtonText: 'Cancelar',
                alertType: 'warning',
                modalSize: 'modal-lg',
                titleClass: 'red'
            }).done(function (e) {
                if (e) {
                    $('.selectpicker').selectpicker('hide');
                    $(".navbar.navbar-default.navbar-fixed-top").addClass('ocultarElemento');
                    $(".bg_load").show();
                    $(".wrapper").show();
                    window.location = "../cadastro/compra.cshtml";
                }
            });

        }
    });
});
function carregar() {
    var carga = sessionStorage.getItem("produtosLista");
    if (!carga) {
        localStorage.setItem("erro", "<strong>Acesso Não Autorizado!</strong> É necessário seguir o fluxo de cadastro para acessar os próximos passos.");
        window.location = "../gerenciamento/compra.cshtml";
    } else {
        carga = JSON.parse(carga);
        if (!carga[0].cadastrarNovo) {
            if (validaComprasPendentes(carga)) {
                inicializarTbProdutoCadastrar(carga);
                var $menuTitulo = $(".navbar.navbar-default.navbar-fixed-top");
                $menuTitulo.find('.navbar-header .navbar-center').text('Lista de Compras');
                $menuTitulo.removeClass('ocultarElemento');
                $(".bg_load").fadeOut();
                $(".wrapper").fadeOut();
            } else {

                sessionStorage.removeItem('produtosLista');
                sessionStorage.removeItem("produtosComprarSelecionados");
                sessionStorage.removeItem("compra");
                window.location = "../gerenciamento/compra.cshtml";
            }
        }
        if (localStorage.getItem("erro") !== null) {
            var msgFalha = localStorage.getItem("erro");
            localStorage.removeItem("erro");
            setTimeout(function () {
                erroCadCompra(msgFalha, "alertProdListaCompra");
            }, 500);
        }
    }
}

function inicializarTbProdutoCadastrar(dadosCarga) {
    tbProdutoCadastrar = $('#tabelaProdutosPedidoCad').DataTable({
        deferRender: true,
        ordering: false,
        responsive: true,
        scrollX: true,
        searching: false,
        paging: false,
        "info": false,
        "order": [[1, 'desc']],
        scrollCollapse: true,
        scrollY: '65vh',
        "columnDefs": [
            {
                "targets": [2, 3, 4, 5],
                //"orderable": false,
                'className': 'dt-body-left'
            },
            {
                "targets": -2,
                "type": "boolean"

            }

        ],
        "language": {
            "emptyTable": "Nenhum produto encontrado",
            "zeroRecords": "Nenhum produto corresponde ao filtro"
        },
        destroy: true,
        data: dadosCarga,
        columns: [
            {
                "data": 'imagem',
                "render": function (data, type, row, meta) {
                    if (type === 'display') {
                        return '<img src="http://placehold.it/50x50">';
                    } else {
                        return data;
                    }
                }
            },
            { "data": "codProduto" },

            {
                "data": "descricaoProduto",
                "render": function (data, type, row, meta) {
                    return type === 'display' ? toTitleCase(data) : data;
                }
            },
            {
                "data": "descricaoReduzida",
                "render": function (data, type, row, meta) {
                    return type === 'display' ? toTitleCase(data) : data;
                }
            },
            {
                "data": "descricaoMarca",
                "render": function (data, type, row, meta) {
                    return type === 'display' ? toTitleCase(data) : data;
                }
            },
            {
                "data": "nomeFantasia",
                "render": function (data, type, row, meta) {
                    return type === 'display' ? toTitleCase(data) : data;
                }
            },
            {
                "data": 'status',
                "render": function (data, type, row, meta) {
                    if (type === 'display') {
                        if (data) {
                            return '<input type="checkbox" disabled checked class="ckbCadCompra" data-on-color="success" data-off-color="danger" data-on-text="Pendente" data-off-text="Digitando">';
                        } else {
                            return '<input type="checkbox" disabled class="ckbCadCompra" data-on-color="success" data-off-color="danger" data-on-text="Pendente" data-off-text="Digitando">';
                        }
                    } else {
                        return data;
                    }
                }
            },
            {
                "data": null,
                "defaultContent": '<button class="btn btn-primary inicioPedido">' +
                '<i class="fa fa-shopping-cart" aria-hidden="true"> Comprar</i>' +
                '</button>'
            }

        ],
        "drawCallback": function (settings) {
            $(".ckbCadCompra").bootstrapSwitch();
        }

    });

}
function validarCadCompraNovoProduto() {
    var fornecedor = $('#drpCNPJ').val(), marca = $('#drpMarc').val(), secao = $('#drpSec').val(), especie = $('#drpEsp').val(),
        referencia = $('#txtRefPed').val(), descricao = $('#txtDescPed').val(), descricaoResumida = $('#txtDescResPed').val(),
        codOriginal = $('#txtCodOriPed').val(), retorno = true, elemento, isNotSelect = false;
    if (!fornecedor) { elemento = $('#drpCNPJ'); retorno = false; }
    else if (!marca) { elemento = $('#drpMarc'); retorno = false; }
    else if (!secao) { elemento = $('#drpSec'); retorno = false; }
    //else if (!especie) { elemento = $('#drpEsp'); retorno = false; }
    else if (!referencia.length > 0) { elemento = $('#txtRefPed'); retorno = false; isNotSelect = true; }
    else if (!descricao.length > 0) { elemento = $('#txtDescPed'); retorno = false; isNotSelect = true; }
    else if (!descricaoResumida.length > 0) { elemento = $('#txtDescResPed'); retorno = false; isNotSelect = true; }
    //else if (!codOriginal.length > 0) { elemento = $('#txtCodOriPed'); retorno = false; isNotSelect = true}

    if (retorno) {
        var objJson = [
            {
                'selecionado': retorno, 'codProduto': '', 'codOriginal': codOriginal, 'descricaoProduto': descricao, 'referencia': referencia,
                'descricaoReduzida': descricaoResumida, 'idMarca': marca, 'secao': secao, 'especie': especie, 'cnpj': fornecedor
            }
        ];
        sessionStorage.setItem("compra", JSON.stringify(objJson));
    } else {
        erroCadCompra('Para iniciar o cadastro de pré-pedido é necessário preencher todos os campos.', "alertProdListaCompra");
        geraTimeoutCadProdIncompleto(isNotSelect, elemento);
    }
    return retorno;
}
function geraTimeoutCadProdIncompleto(isNotSelect, elemento) {
    if (isMobile) {
        setTimeout(function () {
            $('html, body').animate({ scrollTop: elemento.offset().top - 60 }, 500);
            setTimeout(function () {
                isNotSelect ? elemento.focus().select() : elemento.selectpicker('toggle');
            }, 500);
        }, 6500);
    } else {
        setTimeout(function () {
            isNotSelect ? elemento.focus().select() : elemento.selectpicker('toggle');
        }, 100);
    }
}
function validaComprasPendentes(listaCompras) {
    return listaCompras.filter(e => !e.status).length > 0;
}