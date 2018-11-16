var tbProduto;
var specialKeys = new Array();
var objRefSelecionados = {};
var paginasMarcadas = [];
var prodMarcados = [];
specialKeys.push(8); //Backspace
specialKeys.push(46); //Delete
specialKeys.push(96); //numpad 0
$(document).ready(function () {
    $(window).on("load", carregar);
    $('#drpOcultaColuna').on('change', function (e) {
        iniciarOcultacaoColuna(false);
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

    $(document).on('switchChange.bootstrapSwitch', '.ckbGridProd', function (event, state) {
        var linha = $($(this).closest('tr'));
        tbProduto.row(linha).data().selecionado = state;
        var dadoSelecionado = tbProduto.row(linha).data();
        console.log(dadoSelecionado)
        var contem = false;

        if (state) {
            prodMarcados.push(dadoSelecionado);
            paginasMarcadas.map(obj => {
                if (obj.pagina === $('.pagination-holder').pagination('getCurrentPage')) {
                    obj.prodMarcados.push(dadoSelecionado);
                    contem = true;
                }
            });
            if (!contem) {
                var inserir = {};
                inserir.pagina = $('.pagination-holder').pagination('getCurrentPage');
                inserir.prodMarcados = [];
                inserir.prodMarcados.push(dadoSelecionado);
                paginasMarcadas.push(inserir);

            }
        } else {
            prodMarcados = $.grep(prodMarcados, function (el) {
                var retorno = true;
                if (el.idProduto === dadoSelecionado.idProduto) {
                    retorno = false;
                }

                return retorno;
            });
            paginasMarcadas.map(obj => {
                if (obj.pagina === $('.pagination-holder').pagination('getCurrentPage')) {
                    obj.prodMarcados = $.grep(obj.prodMarcados, function (el) {
                        var retorno = true;
                        if (el.idProduto === dadoSelecionado.idProduto) {
                            retorno = false;
                        }

                        return retorno;
                    });
                    contem = obj.prodMarcados.length === 0;
                }
                return obj;
            });
            if (contem) {
                paginasMarcadas = $.grep(paginasMarcadas, function (el) {
                    return el.pagina !== $('.pagination-holder').pagination('getCurrentPage')
                });
            }
        }
        console.log(paginasMarcadas)
        console.log(prodMarcados)
    });
    $(document).on('keyup', '#txtFiltroProdutoCompra', function (e) {
        var keyCode = e.keyCode === 0 ? e.charCode : e.keyCode;
        var ret = keyCode >= 48 && keyCode <= 57 || keyCode >= 65 && keyCode <= 90 || keyCode >= 97 && keyCode <= 122 ||
            specialKeys.indexOf(e.keyCode) !== -1 && e.charCode !== e.keyCode;
        if (ret) {
            tbProduto.search(this.value).draw();
        }
    });
});
function carregar() {
    sessionStorage.removeItem('compra');
    sessionStorage.removeItem('cadastroNovo');
    sessionStorage.removeItem('produtosLista');
    sessionStorage.removeItem("produtosComprarSelecionados");
    sessionStorage.removeItem("pedidoId");
    sessionStorage.removeItem("pedidoStatus");
    cargaInicialGerenciamentoCompra('produto');
}
function buscarProdutosFiltrado() {
    var objEnvio = { 'marcas': '', 'secoes': '', 'especies': '', 'idFornecedor': '' }, marcas = $("#drpMarc").val(), secoes = $("#drpSec").val(),
        especies = $("#drpEsp").val(), cnpj = $("#drpCNPJ").val();
    if (!marcas && !secoes && !cnpj) {
        erroCadCompra("Não é permitido filtrar produtos sem selecionar ao menos um parâmetro de pesquisa!", "alertProdCompra");
    } else {
        objRefSelecionados = {};
        paginasMarcadas = [];
        prodMarcados = [];
        if (marcas) objEnvio.marcas = marcas.join(",");
        if (secoes) objEnvio.secoes = secoes.join(",");
        if (especies) objEnvio.especies = especies.join(",");
        if (cnpj) objEnvio.idFornecedor = cnpj.join(",");
        $(".navbar.navbar-default.navbar-fixed-top").addClass('ocultarElemento');
        $('.selectpicker').selectpicker('hide');
        $(".bg_load").show();
        $(".wrapper").show();
        geraCargaProdutoFiltrado(objEnvio);
    }

}
function inicializarTbProduto() {
    tbProduto = $('#tabelaProdutos').DataTable({
        deferRender: true,
        ordering: true,
        responsive: true,
        scrollX: true,
        searching: true,
        paging: false,
        "order": [[1, 'desc']],
        scrollCollapse: true,
        scrollY: '40vh',
        "columnDefs": [
            {
                "targets": [2, 3, 4, 5, 7,8],
                //"orderable": false,
                'className': 'dt-body-left'
            },
            {
                "targets": 0,
                "type": "boolean"

            }
        ],
        "language": {
            "emptyTable": "Nenhum produto encontrado",
            "zeroRecords": "Nenhum produto corresponde ao filtro"
        },
        destroy: true,
        fixedHeader: true,
        data: [],
        columns: [
            {
                "data": 'selecionado',
                "render": function (data, type, row, meta) {
                    if (type === 'display') {
                        if (data) {
                            return '<input type="checkbox" checked class="ckbGridProd" data-on-color="success" data-off-color="danger" data-on-text="Sim" data-off-text="Não">';
                        } else {
                            return '<input type="checkbox" class="ckbGridProd" data-on-color="success" data-off-color="danger" data-on-text="Sim" data-off-text="Não">';
                        }
                    } else {
                        return data;
                    }
                }
                //"defaultContent": '<input type="checkbox" class="ckbGridProd" data-on-color="success" data-off-color="danger" data-on-text="Sim" data-off-text="Não">'
            },
            { "data": "idProduto",visible:false },
            { "data": "codProduto" },
            { "data": "codOriginal" },
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
            { "data": "referencia" },
            { "data": "idMarca" },
            {
                "data": "descricaoMarca",
                "render": function (data, type, row, meta) {
                    return type === 'display' ? toTitleCase(data) : data;
                }
            },
        ],
        "drawCallback": function (settings) {
            $(".ckbGridProd").bootstrapSwitch();
            $(".ckbGridProd").each(function () {
                $(this).bootstrapSwitch('state', $(this).is(":checked"));
            });
        }

    });
}
function msgErro() {
    modal({
        messageText: "Todos os campos devem ser preenchidos!",
        type: "alert",
        headerText: "Operação Não Realizada",
        alertType: "warning"
    });
}
function validaCadastrarNovasCompras() {
    if (prodMarcados.length) {
        cadastrarNovasCompras();
    } else {
        erroCadCompra("É necessário selecionar ao menos 1 produto para iniciar uma compra!", "alertProdCompra");
    }

    //console.log(produtosComprar);
}
function iniciarOcultacaoColuna(grupoClicado) {
    $('.selectpicker').selectpicker('hide');
    $(".navbar.navbar-default.navbar-fixed-top").addClass('ocultarElemento');
    $(".bg_load").show();
    $(".wrapper").show();
    if (!grupoClicado) {
        setTimeout(function () {
            finalizarOcultacaoColuna();
        }, 500);
    } else {
        setTimeout(function () {
            cliqueGrupoDpd(grupoClicado);
        }, 500);
    }
}

function ocultarColunas(indexColunas) {
    tbProduto.columns().visible(true);
    if (indexColunas.length > 0) {
        tbProduto.columns(indexColunas).visible(false, false);
    }
    tbProduto.draw(false);
        $(".bg_load").fadeOut();
        $(".wrapper").fadeOut();
        $('.selectpicker').selectpicker('show');
        $(".navbar.navbar-default.navbar-fixed-top").removeClass('ocultarElemento');

}

function finalizarOcultacaoColuna() {
    var filtros = $('#drpOcultaColuna').val() ? $('#drpOcultaColuna').val().map(Number) : [];
    ocultarColunas(filtros);

}
function cadastrarNovasCompras() {
    var result = prodMarcados;
    $('.selectpicker').selectpicker('hide');
    $(".navbar.navbar-default.navbar-fixed-top").addClass('ocultarElemento');
    $(".bg_load").show();
    $(".wrapper").show();
    var arrayCarga = [];
    for (var i = 0; i < result.length; i++) {
        var objCarga = {};
        result[i].idPedido = 0; 
        objCarga.idPedido = result[i].idPedido;
        objCarga.imagem = 'http://placehold.it/50x50';
        objCarga.idProduto = result[i].idProduto;
        objCarga.codProduto = result[i].codProduto;
        objCarga.descricaoProduto = result[i].descricaoProduto;
        objCarga.descricaoReduzida = result[i].descricaoReduzida;
        objCarga.descricaoMarca = result[i].descricaoMarca;
        objCarga.status = !result[i].selecionado;
        arrayCarga.push(objCarga);
    }
    sessionStorage.setItem("produtosLista", JSON.stringify(arrayCarga));
    sessionStorage.setItem("produtosComprarSelecionados", JSON.stringify(result));
    window.location = "../gerenciamento/compraprodutos.cshtml";
}
function cadastrarNovoProduto() {
    $('.selectpicker').selectpicker('hide');
    $(".navbar.navbar-default.navbar-fixed-top").addClass('ocultarElemento');
    $(".bg_load").show();
    $(".wrapper").show();
    sessionStorage.setItem("cadastroNovo", '1');
    window.location = "../cadastro/compra.cshtml";
}
function carregaFormCompraManager() {
    $("#drpMarc").selectpicker('val', '');
    $("#drpSec").selectpicker('val', '');
    $("#drpCNPJ").selectpicker('val', '');
    inicializarTbProduto();
    var $menuTitulo = $(".navbar.navbar-default.navbar-fixed-top");
    $menuTitulo.find('.navbar-header .navbar-center').text('Gerenciamento de Compras');
    if (localStorage.getItem("erro") !== null) {
        var msgFalha = localStorage.getItem("erro");
        localStorage.removeItem("erro");
        setTimeout(function () { erroCadCompra(msgFalha, "alertProdCompra"); }, 500);
    }
}
function geraPaginacaoGrid(qtdPg) {
    $('.pagination-holder').pagination({
        pages: qtdPg,
        prevText: 'Anterior',
        nextText: 'Próximo',
        cssStyle: 'light-theme',
        hrefTextPrefix: '#pagina-',
        displayedPages: 2,
        edges: 1,
        onPageClick: function (pageNumber, event) {
            $('.selectpicker').selectpicker('hide');
            $(".navbar.navbar-default.navbar-fixed-top").addClass('ocultarElemento');
            $(".bg_load").show();
            $(".wrapper").show();
            alteraPagina(atualizaObjetoMudancaPagina(pageNumber));
        },
    });
}
function validaProdSelPag() {
    var paginaDados = $.grep(paginasMarcadas, function (el) {
        return el.pagina === $('.pagination-holder').pagination('getCurrentPage');
    })[0], dadosMarcados;
    if (paginaDados) {
        dadosMarcados = paginaDados.prodMarcados;
    }
    return dadosMarcados;
}
function atualizaDadosCarga(produtos, atualizarProd) {
    produtos.map(function (obj) {
        for (var i = 0; i < atualizarProd.length; i++) {
            if (obj.idProduto === atualizarProd[i].idProduto && obj.idFornecedor === atualizarProd[i].idFornecedor) {
                obj.selecionado = true;
            }
        }
        return obj;
    });
    return produtos;
}