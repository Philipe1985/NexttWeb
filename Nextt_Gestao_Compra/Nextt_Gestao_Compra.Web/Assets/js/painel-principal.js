$(document).ready(function () {
    $('.panel-hover').on('click', function (e) {
        $(".navbar.navbar-default.navbar-fixed-top").addClass('ocultarElemento');
        $(".bg_load").show();
        $(".wrapper").show();
        window.location = "../gerenciamento/" + $(this).attr('id') + ".cshtml";
    });
    $(window).on("load", carregar);
});
function carregar() {
    sessionStorage.removeItem('compra');
    sessionStorage.removeItem("pedidoId");
    sessionStorage.removeItem("pedidoStatus");
    sessionStorage.removeItem("cadastroNovo");
    if (sessionStorage.getItem("perfilSistema") === 'undefined' && sessionStorage.getItem("perfilAdmin") === 'undefined') {
        $("#grupofiliais").addClass("ocultarElemento");
    }
    $("#homeOpcao").addClass("ocultarElemento");
    var $menuTitulo = $(".navbar.navbar-default.navbar-fixed-top");
    $menuTitulo.find('.navbar-header .navbar-center').text('Gestão de Compras');
    $menuTitulo.removeClass('ocultarElemento');
    $(".bg_load").fadeOut();
    $(".wrapper").fadeOut();
}