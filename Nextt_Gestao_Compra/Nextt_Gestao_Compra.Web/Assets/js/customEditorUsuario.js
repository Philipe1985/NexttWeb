$(document).ready(function () {
    if (sessionStorage.getItem("id_usuarioLogado") === null) {
        window.location = "../conta/login.cshtml"
    }

    else if (sessionStorage.getItem("usuarioEditar") === null) {
        window.location = "../home.cshtml";
    }

    $("#btnCancelarEdicao").click(function (e) {
        e.preventDefault();
        var btconfirma = 'Sim', btcancela = 'Não', texto = 'Ao confirmar esta operação, todas as alterações não salvas serão descartadas. <br/>Tem certeza de que deseja prosseguir?', titulo = 'Desfazer Alterações';

        modal({
            type: "confirm",
            messageText: texto,
            alertType: 'info',
            headerText: titulo,
            yesButtonText: btconfirma,
            noButtonText: btcancela
        }).done(function (e) {
            if (e) {
                location.reload();
            }
        });
    })

    $('#btnResetarSenha').click(function (e) {
        e.preventDefault();
        if (permissoesUsuarioLogado.indexOf('Bloquear/Desbloquear Usuário') === -1) {
            semAcesso()
        } else {
            var usuario = JSON.parse(sessionStorage.getItem("usuarioEditar"));
            var id = usuario.id, textoLoading = "Redefinindo senha. Aguarde!", btconfirma = 'Sim', btcancela = 'Não';
            var texto = 'Ao confirmar esta operação, o usuário receberá uma nova senha por E-mail. Certifique-se de que o usuário tenha acesso ao E-mail registrado antes de prosseguir. ' +
                'Caso o E-mail esteja desatualizado, efetue as alterações necessárias e salve. <br/>Tem certeza de que deseja prosseguir?', titulo = 'Redefinir Senha';
            modal({
                type: "confirm",
                messageText: texto,
                alertType: 'info',
                headerText: titulo,
                yesButtonText: btconfirma,
                noButtonText: btcancela
            }).done(function (e) {
                if (e) {
                    waitingDialog.show(textoLoading, { dialogSize: 'lg', progressType: 'warning' });
                    resetarSenha(id);
                }
            });

        }
        
        

    });

    $('#btnSalvarEdicao').click(function (e) {
        e.preventDefault();
        var usuario = JSON.parse(sessionStorage.getItem("usuarioEditar"));
        var textoLoading = "Atualizando cadastro. Aguarde!";
        var email = $('#txtEmail').val();
        var nome = $('#txtNome').val();
        var sobrenome = $('#txtSobrenome').val();
        var usuarioExibicao = $("#txtNomeExibicao").val();
        var status = !$('#ckbAtivo').bootstrapSwitch('state');
        var id = usuario.id;
        var perfilAlterado = $("#ucComboAdminsEditar").val();
        var altaracaoPerfil = perfilAlterado === usuario.roles ? false : true;

        if (email === usuario.email && usuarioExibicao === usuario.userName && usuario.nome === nome && usuario.sobrenome === sobrenome
            && status === usuario.locked && !altaracaoPerfil) {
            var texto = 'Nenhuma alteração foi efetuada.', titulo = 'Operação não Executada';

            modal({
                type: "alert",
                messageText: texto,
                alertType: 'info',
                headerText: titulo,
            });

        } else {
            var usuarioObj = {};
            usuarioObj.email = email;
            usuarioObj.userName = usuarioExibicao;
            usuarioObj.nome = nome;
            usuarioObj.sobrenome = sobrenome;
            usuarioObj.locked = status;
            usuarioObj.id = usuario.id;
            usuarioObj.roles = perfilAlterado;

            if (!validaEmail(email)) {
                var texto = 'Informe um e-mail válido para salvar as alterações.', titulo = 'Operação Inválida';
                modal({
                    type: "alert",
                    messageText: texto,
                    alertType: 'info',
                    headerText: titulo,
                });
            } else if (!perfilAlterado) {
                var texto = 'Atribua ao menos um perfil para salvar as alterações.', titulo = 'Operação Inválida';
                modal({
                    type: "alert",
                    messageText: texto,
                    alertType: 'info',
                    headerText: titulo,
                });
            } else {
                atualizarUsuario(usuarioObj);
            }
        }
    });

    $('#ucComboAdminsEditar').change(function () {

        alteraPerfilAtribuido();

    })



    $(document).on('switchChange.bootstrapSwitch', '#ckbAdministrador', function (event, state) {
        if (state) {
            $('#ucComboAdminsEditar').selectpicker('val', 'Administrador');

        } else {
            $('#ucComboAdminsEditar').selectpicker('val', '');
        }

    })

    $(document).on('switchChange.bootstrapSwitch', '#ckbAtivo', function (event, state) {
        var perfilClonado = $('#ucComboAdminsEditar').val();
        var usuario = JSON.parse(sessionStorage.getItem("usuarioEditar"));
        if (!usuario.emailConfirmed) {
            $('#ckbAtivo').bootstrapSwitch('state', !state, true);
            var texto = 'O usuário ainda não confirmou o E-mail, e não pode ter o status alterado.', titulo = 'Operação Não Executada';

            modal({
                messageText: texto,
                type: "alert",
                headerText: titulo,
                alertType: "warning"
            });
        }

    })
});

function alteraPerfilAtribuido() {
    var perfilClonado = $('#ucComboAdminsEditar').val();
    if (perfilClonado.indexOf('Administrador') > -1) {
        $("#ckbAdministrador").bootstrapSwitch('state', true);
    } else {
        $("#ckbAdministrador").bootstrapSwitch('state', false);
    }
}



function carregaUsuarioEditar() {

    var usuario = JSON.parse(sessionStorage.getItem("usuarioEditar"));
    console.log(usuario)
    $("#txtNome").val(usuario.nome);
    $("#txtSobrenome").val(usuario.sobrenome);
    $("#txtNomeExibicao").val(usuario.userName);
    $("#txtEmail").val(usuario.email);
    var fullDate = new Date(usuario.joinDate);
    var twoDigitMonth = (fullDate.getMonth() + 1) + ""; if (twoDigitMonth.length == 1) twoDigitMonth = "0" + twoDigitMonth;
    var twoDigitDate = fullDate.getDate() + ""; if (twoDigitDate.length == 1) twoDigitDate = "0" + twoDigitDate;
    var currentDate = twoDigitDate + "/" + twoDigitMonth + "/" + fullDate.getFullYear();
    $("#txtDataCadastro").val(currentDate);
    $("#ckbAtivo").bootstrapSwitch('state', !usuario.locked);
    if ($.inArray('Administrador', usuario.roles) > -1) {
        $("#ckbAdministrador").bootstrapSwitch('state', true);
    } else {
        $("#ckbAdministrador").bootstrapSwitch('state', false);
    }
    for (var i = 0; i < usuario.roles.length; i++) {

        var texto = usuario.roles[i];
        $("#ucComboAdminsEditar option").filter(function () {
            return this.text == texto;
        }).attr('selected', true);
    };
    checarPermissoesEdicao()
    $('#ucComboAdminsEditar').selectpicker('refresh');


    $(".bg_load").fadeOut();
    $(".wrapper").fadeOut();
    var $menuTitulo = $(".navbar.navbar-default.navbar-fixed-top");
    $menuTitulo.find('.navbar-header .navbar-center').text('Edição de Usuário');
    $menuTitulo.removeClass('ocultarElemento');
    $("div.controls.ocultarElemento").removeClass('ocultarElemento');
}

window.onload = function () {
    carregaComboPerfilEditar()
    $(".switch").bootstrapSwitch();
}