$(document).ready(function () {
    $(window).on("load", carregar);
    document.querySelector("button.dir").onclick = function () {
        mover(document.querySelector("ul.esq"),
            document.querySelector("ul.dir"));
    };

    document.querySelector("button.esq").onclick = function () {
        mover(document.querySelector("ul.dir"),
            document.querySelector("ul.esq"));
    };
    $(document).on('keyup', '#txtBuscaFiltros', function (e) {
        var search = $.trim($(this).val());
        search = search.toLowerCase();
        var hltd = $('#funcoesHabilitado li').each(function () {
            var refFiltro = $(this).attr('data-filtro').toLowerCase();
            if (refFiltro.indexOf(search) === -1) {
                $(this).addClass('oculto');
            }
            else {
                $(this).removeClass('oculto');
            }
        })
        var dltd = $('#funcoesDesabilitado li').each(function () {
            var refFiltro = $(this).attr('data-filtro').toLowerCase();
            if (refFiltro.indexOf(search) === -1) {
                $(this).addClass('oculto');
            }
            else {
                $(this).removeClass('oculto');
            }
        })
    })
    $(".nav-tabs a[data-toggle=tab]").on("click", function (e) {
        if ($(this).closest('li').hasClass("disabled")) {
            e.preventDefault();
            this.blur()
            return false;
        }
    });
    $(document).on('shown.bs.tab', '.nav-tabs-responsive [data-toggle="tab"]', function (e) {
        var x = $(e.target)["0"].hash;         // active tab
        var y = $(e.relatedTarget)["0"].hash;  // previous tab
        console.log($(e.target));
        console.log($(e.relatedTarget));
        console.log(x);

        var tbs = $('#divPaineisConfigApp').find('.tab-pane');
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
        var $next = $current.next();
        var $prev = $current.prev();
    });

})
function carregar() {
    $('#user-header').addClass('ocultarElemento');
    var temp = JSON.parse(sessionStorage.getItem("cookies"));
    document.cookie = temp.value[0];
    //$('#tabSetupInicial li a[href="#permissaoApp"]').closest('li').removeClass("disabled");
    //$('#tabSetupInicial li a[href="#usuarioAdmin"]').closest('li').addClass("disabled tabFinalizada");
    //$('#tabSetupInicial li a[href="#usuarioAdmin"] i').removeClass("ocultarElemento");
    $('#tabSetupInicial li a[href="#usuarioAdmin"]').tab('show');
    $(".bg_load").fadeOut();
    $(".wrapper").fadeOut();
    var $menuTitulo = $(".navbar.navbar-default.navbar-fixed-top");
    $menuTitulo.find('.navbar-header .navbar-center').text('Configuração de Primeiro Acesso');
    $menuTitulo.removeClass('ocultarElemento');


}
function mover(fonte, destino) {
    $('#txtBuscaFiltros').val('');
    $('#funcoesHabilitado li').removeClass('oculto');
    $('#funcoesDesabilitado li').removeClass('oculto');
    var selecionados = fonte.querySelectorAll("li input:checked");
    for (var i = 0; i < selecionados.length; i++) {
        var li = selecionados[i].parentNode.parentNode;
        selecionados[i].checked = false;
        fonte.removeChild(li);
        destino.appendChild(li);
        $(selecionados[i]).checkboxradio('refresh')
    }
}
function cadastrarUsuarioAdmin() {
    var email = $("#txtEmail").val().toLowerCase();

    if (validaEmail(email)) {
        var user = $("#txtUserName").val();
        var nome = $("#txtNome").val();
        var sobnome = $("#txtSobrenome").val();
        var perfil = $("#cbPerfil").val() ? [$("#cbPerfil").val()] : [];
        var emailConfirmado = true;
        var textoLoad = 'Cadastrando. Aguarde!', titulo = "Falha no Cadastro", texto = 'Para cadastrar um novo usuário, é necessário preencher todos os campos.';

        if (perfil.length === 0 || nome === '' || user === '' || email === '' || sobnome === '') {
            modal({
                type: "alert",
                messageText: texto,
                alertType: 'warning',
                headerText: titulo
            });
        } else {

            waitingDialog.show(textoLoad, { dialogSize: 'lg', progressType: 'warning' });
            cadastrarUsuario(email, user, nome, sobnome, perfil, emailConfirmado);

            //$('#tabSetupInicial li a[href="#permissaoApp"]').closest('li').removeClass("disabled");
            //$('#tabSetupInicial li a[href="#usuarioAdmin"]').closest('li').addClass("disabled tabFinalizada");
            //$('#tabSetupInicial li a[href="#usuarioAdmin"] i').removeClass("ocultarElemento");
            //$('#tabSetupInicial li a[href="#permissaoApp"]').tab('show');
        }
    } else {
        var titulo = "Formato de E-mail Inválido", texto = 'Para cadastrar o usuário é necessário informar um e-mail válido.';
        modal({
            type: "alert",
            messageText: texto,
            alertType: 'warning',
            headerText: titulo
        });
    }


}
function cadastrarFuncoes() {
    var funcoesCadastrar = [];
    var funcoesAgrupado = $("#funcoesHabilitado").find("li");
    funcoesAgrupado.each(function () {
        funcoesCadastrar.push($(this).find('input').val());
    });

    cadastrarPermissoes(funcoesCadastrar)

}
function cadastrarPerfis() {
    if (!$("#txtDescPerfil").val() || !$("#cbPermissoesPerfil").val()) {
        modal({
            type: "alert",
            messageText: "Para cadastrar um perfil é necessário informar uma descrição e selecionar as permissões!",
            alertType: 'warning',
            headerText: "Atenção!"
        });
    } else {
        var descPerfil = $("#txtDescPerfil").val() ? toTitleCase($("#txtDescPerfil").val().trim()) : '';
        var permissoesConcedidas = [];
        $("#cbPermissoesPerfil option:selected").each(function () {
            permissoesConcedidas.push({ id: $(this).val(), descricao: $(this).text() });
        });
        var objEnvio = { descricaoPerfil: descPerfil, permissoes: permissoesConcedidas }
        var teste = JSON.stringify(objEnvio)
        console.log(teste);
        console.log(objEnvio);
        criarPerfilNovo(objEnvio);
        $('#tabSetupInicial li a[href="#perfilApp"]').closest('li').addClass("disabled tabFinalizada");
        $('#tabSetupInicial li a[href="#perfilApp"] i').removeClass("ocultarElemento");
    }

}