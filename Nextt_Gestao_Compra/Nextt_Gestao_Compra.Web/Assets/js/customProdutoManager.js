var tbProduto;
var specialKeys = new Array();
var objRefSelecionados = {};
var paginasMarcadas = [];
var fornSelConsulta;
var prodMarcados = [];
specialKeys.push(8); //Backspace
specialKeys.push(46); //Delete
specialKeys.push(96); //numpad 0
$(document).ready(function () {
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
    $(document).on('paste', '.txtInteiro', function (e) {
        var paste = e.originalEvent.clipboardData.getData('Text');

        if (isNumber(paste) && Math.floor(paste) == parseInt(paste)) {
            return;
        }
        e.preventDefault();
    })
    $(window).on("load", carregar);
    $('#drpOcultaColuna').on('change', function (e) {
        iniciarOcultacaoColuna(false);
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
        if ($('#drpSec').val()) {
            $('.selectpicker').selectpicker('hide');
            $(".navbar.navbar-default.navbar-fixed-top").addClass('ocultarElemento');
            $(".bg_load").show();
            $(".wrapper").show();
            objParam.secoes = $('#drpSec').val().join(',');
            carregarEspecie(objParam);
        } else {
            $("#drpEsp").html('');

        }
    });
    $(document).on('click', '.editarProduto', function (e) {
        var linha = $($(this).closest('tr'));
        var dadoSelecionado = tbProduto.row(linha).data().idProduto;
        sessionStorage.setItem("cadastroProduto", dadoSelecionado)

        $('.selectpicker').selectpicker('hide');
        $(".navbar.navbar-default.navbar-fixed-top").addClass('ocultarElemento');
        $(".bg_load").show();
        $(".wrapper").show();
        
        window.location = "../cadastro/compra.cshtml";
        
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
    sessionStorage.removeItem('cadastroProduto');
    sessionStorage.removeItem('fornSelecionado');
    sessionStorage.removeItem('produtosLista');
    sessionStorage.removeItem("produtosComprarSelecionados");
    sessionStorage.removeItem("pedidoId");
    sessionStorage.removeItem("pedidoStatus");
    cargaInicialGerenciamentoCompra('produto');
}
function buscarProdutosFiltrado() {
    var objEnvio = { 'marcas': '', 'secoes': '', 'especies': '', 'idFornecedor': '', 'segmentos': '' }, marcas = $("#drpMarc").val(), segmentos = $("#drpSeg").val(),
        secoes = $("#drpSec").val(), codProduto = $("#txtCodProd").val(),
        especies = $("#drpEsp").val(), cnpj = $("#drpCNPJ").val(), fornAttr = $("#cbAttrForn").val();
    if (!marcas && !secoes && !cnpj && !fornAttr && !codProduto) {
        !segmentos ? erroCadCompra("Não é permitido filtrar produtos sem selecionar ao menos um parâmetro de pesquisa!", "alertProdCompra") :
            erroCadCompra("Não é permitido filtrar produtos apenas por segmentos!", "alertProdCompra");
    } else {
        objRefSelecionados = {};
        paginasMarcadas = [];
        prodMarcados = [];
        fornSelConsulta = null;
        if (marcas) objEnvio.marcas = marcas.join(",");
        if (fornAttr) objEnvio.attrFornecedor = fornAttr.join(",");
        if (secoes) objEnvio.secoes = secoes.join(",");
        if (especies) objEnvio.especies = especies.join(",");
        if (segmentos) objEnvio.segmentos = segmentos.join(",").replace(/[^\d,]/g, '');
        if (cnpj) {
            objEnvio.idFornecedor = cnpj.join(",");
            if (cnpj.length === 1) fornSelConsulta = cnpj[0];
        }
        objEnvio.codigo = codProduto ? codProduto : '';
        $(".navbar.navbar-default.navbar-fixed-top").addClass('ocultarElemento');
        $('.selectpicker').selectpicker('hide');
        $(".bg_load").show();
        $(".wrapper").show();
        console.log(objEnvio)
        controleTempo("Iniciando consulta produtos: ")
        console.log('============================')

        geraCargaProdutoFiltrado(objEnvio);
    }

}
function inicializarTbProduto() {
    tbProduto = $('#tabelaProdutos').DataTable({
        deferRender: true,
        ordering: true,
        responsive: true,
        searching: true,
        paging: false,
        "order": [[1, 'desc']],
        scrollX: true,
        scrollY: '50vh',
        "columnDefs": [
            {
                "targets": [2, 3, 4, 5, 7, 8],
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
                        if (window.location.href.toLowerCase().indexOf("produto") > -1) {
                            return '<a href="#" class="btn btn-primary editarProduto" data-toggle="tooltip" title="Editar Produto"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>';                            
                        } else {
                            if (data) {
                                return '<input type="checkbox" checked class="ckbGridProd" data-on-color="success" data-off-color="danger" data-on-text="Sim" data-off-text="Não">';
                            } else {
                                return '<input type="checkbox" class="ckbGridProd" data-on-color="success" data-off-color="danger" data-on-text="Sim" data-off-text="Não">';
                            }
                        }
                        
                    } else {
                        return data;
                    }
                }
                //"defaultContent": '<input type="checkbox" class="ckbGridProd" data-on-color="success" data-off-color="danger" data-on-text="Sim" data-off-text="Não">'
            },
            { "data": "idProduto", visible: false },
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
                visible: false,
                "render": function (data, type, row, meta) {
                    return type === 'display' ? toTitleCase(data) : data;
                }
            },
            { "data": "idFornecedor", visible: false },
            { "data": "razaoSocial" },
            { "data": "nomeFantasia" },
            {
                "data": "cnpj",
                "render": function (data, type, row, meta) {
                    return type === 'display' && data ?configuraMascaraCnpj(data) : data;
                }
            },
            { "data": "referencia" },
            { "data": "idMarca", visible: false },
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
        objCarga.idFornecedor = result[i].idFornecedor;
        objCarga.codProduto = result[i].codProduto;
        objCarga.descricaoProduto = result[i].descricaoProduto;
        objCarga.descricaoReduzida = result[i].descricaoReduzida;
        objCarga.descricaoMarca = result[i].descricaoMarca;
        objCarga.status = !result[i].selecionado;
        arrayCarga.push(objCarga);
    }
    sessionStorage.setItem("produtosLista", JSON.stringify(arrayCarga));
    if (fornSelConsulta) {
        sessionStorage.setItem("fornSelecionado", fornSelConsulta);
    }

    sessionStorage.setItem("produtosComprarSelecionados", JSON.stringify(result));
    window.location = "../gerenciamento/compraprodutos.cshtml";
}
function cadastrarNovoProdGerenciamento() {
    if (permissoesUsuarioLogado.indexOf('Cadastrar Produto Novo') === -1) {
        semAcesso()
    } else {
        $('.selectpicker').selectpicker('hide');
        $(".navbar.navbar-default.navbar-fixed-top").addClass('ocultarElemento');
        $(".bg_load").show();
        $(".wrapper").show();
        sessionStorage.setItem("cadastroProduto", '0')
        //sessionStorage.setItem("cadastroNovo", '1');
        window.location = "../cadastro/compra.cshtml";
    }
}
function cadastrarNovoProduto() {
    if (permissoesUsuarioLogado.indexOf('Cadastrar Produto Novo') === -1) {
        semAcesso()
    } else {
        $('.selectpicker').selectpicker('hide');
        $(".navbar.navbar-default.navbar-fixed-top").addClass('ocultarElemento');
        $(".bg_load").show();
        $(".wrapper").show();
        sessionStorage.setItem("cadastroNovo", '1');
        window.location = "../cadastro/compra.cshtml";
    }
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