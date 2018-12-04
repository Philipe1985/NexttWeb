$(document).ready(function () {
    $(window).on("load", validarPrimeiroAcesso);
    if (localStorage.getItem("erro") !== null) {
        if (localStorage.getItem("erro").length > 0) {
            var msg = localStorage.getItem("erro");
            console.log(msg);
            $("#dangeralert").html('<span> ' + msg + '</span>');
            $("#dangeralert").fadeTo(6000, 500).slideUp(500, function () {
                $("#dangeralert").slideUp(500);
                localStorage.removeItem("erro");
            });
        }
    }

    $('#txtSenha').bind('keypress', function (e) {
        if (e.keyCode === 13 || e.keyCode === 9) {
            e.preventDefault();
            $('#txtSenha').blur();
        }
    });
    $('#txtSenha').blur(function () {
        if ($('#txtLogin').val() === "" || $('#txtLogin').val() === null) {
            $("#txtLogin").focus();
        }
    });
    $('#txtLogin').bind('keypress', function (e) {
        if (e.keyCode === 13 || e.keyCode === 9) {
            e.preventDefault();
            $('#txtLogin').blur();
        }
    });
    $('#txtLogin').blur(function () {
        if ($('#txtSenha').val() === "" || $('#txtSenha').val() === null) {
            $("#txtSenha").focus();
        }
    });
    $('#btnLogin').click(function (e) {
        e.preventDefault();
        $(".bg_load").fadeIn("slow");
        $(".wrapper").fadeIn("slow");
        var username = $('#txtLogin').val();
        var password = $('#txtSenha').val();
        if (username.length > 0 && password.length > 0) {
            localStorage.setItem("erro", "");
            Logar(username, password);
        } else {
            falhaAutenticar("Preencha todos os campos antes de se conectar!");
        }


    });

});
function falhaAutenticar(msgErro) {
    localStorage.setItem("erro", msgErro);
    location.reload();
}

function geraPermissoesAtivas(jsonPermissao) {
    var retorno = [];
    $.each(jsonPermissao, function (key, value) {
        if (value === "1") {
            retorno.push(key);
        }
    });
    return retorno;
}

