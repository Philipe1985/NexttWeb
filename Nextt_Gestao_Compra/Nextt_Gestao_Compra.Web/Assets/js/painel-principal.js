$(document).ready(function () {
    $('.panel-hover').on('click', function (e) {

        if ($(this).attr('id').toLowerCase().indexOf('movimentacaoproduto') > -1) {
            funcaoInativa();
        }
        //else if ($(this).attr('id').toLowerCase() === 'produto') {

        //$('.selectpicker').selectpicker('hide');
        //$(".navbar.navbar-default.navbar-fixed-top").addClass('ocultarElemento');
        //$(".bg_load").show();
        //$(".wrapper").show();
        //sessionStorage.setItem("cadastroProduto", '1');
        //window.location = "../cadastro/compra.cshtml";

        //}
        else {
            $(".navbar.navbar-default.navbar-fixed-top").addClass('ocultarElemento');
            $(".bg_load").show();
            $(".wrapper").show();
            window.location = "../gerenciamento/" + $(this).attr('id') + ".cshtml";
        }

    });
    $(window).on("load", carregar);
});
function carregar() {
    sessionStorage.removeItem('compra');
    sessionStorage.removeItem("pedidoId");
    sessionStorage.removeItem('produtosLista');
    sessionStorage.removeItem('fornSelecionado');
    sessionStorage.removeItem("produtosComprarSelecionados");
    sessionStorage.removeItem("pedidoStatus");
    sessionStorage.removeItem('cadastroProduto');
    sessionStorage.removeItem("cadastroNovo");
    if (permissoesUsuarioLogado.indexOf('Gerenciar Grupos') === -1) {
        $("#grupofiliais").addClass("ocultarElemento");
    }
    if (permissoesUsuarioLogado.indexOf('Acessar Movimentação de Produto') === -1) {
        $("#movimentacaoproduto").addClass("ocultarElemento");
    }
    if (permissoesUsuarioLogado.indexOf('Cadastrar Pedido') === -1) {
        $("#compra").addClass("ocultarElemento");
    }
    if (permissoesUsuarioLogado.indexOf('Cadastrar Produto Novo') === -1) {
        $("#produto").addClass("ocultarElemento");
    }
    if (permissoesUsuarioLogado.indexOf('Gerenciar Grupo de Empresas') === -1) {
        $("#grupoempresa").addClass("ocultarElemento");
    }
    if (permissoesUsuarioLogado.indexOf('Gerenciar Atributos') === -1) {
        $("#atributos").addClass("ocultarElemento");
    }
    if (permissoesUsuarioLogado.indexOf('Acessar Distribuição de Produto') === -1) {
        $("#distribuicao").addClass("ocultarElemento");
    }
    $("#homeOpcao").addClass("ocultarElemento");
    var $menuTitulo = $(".navbar.navbar-default.navbar-fixed-top");
    $menuTitulo.find('.navbar-header .navbar-center').text('Gestão de Compras');
    $menuTitulo.removeClass('ocultarElemento');
    $(".bg_load").fadeOut();
    $(".wrapper").fadeOut();
}