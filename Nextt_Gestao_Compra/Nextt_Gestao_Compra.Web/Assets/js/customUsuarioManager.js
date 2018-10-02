﻿var tabela, statusFiltro = [], perfilId = [], filtrarParametros = false, idBloqueia;

$(document).ready(function () {


    $(window).on("load", carregarUsuario);

    $("#usuario-finder").keyup(function () {
        var val = $.trim($(this).val());
        val = val.toLowerCase();
        for (var i = 0; i < $rows.length; i++) {
            var id = $rows[i].id;
            var text = $('#' + id).html();
            text = text.toLowerCase();
            if (text.indexOf(val) === -1) {
                $('#' + id).addClass('oculto');
            }

            else {
                $('#' + id).removeClass('oculto');
            }
        }
    });

    $(document).on('click', '.editaUsuario', function (e) {

        var linha = $(this).parent().parent();
        var tbUsuario = new $.fn.dataTable.Api("#tabelaUsuarios");
        var idEditar = tbUsuario.row($(linha)).data()[0], titulo = 'Operação Inválida', texto = 'Não é permitido editar seu próprio usuário.';

        if (sessionStorage.getItem("id_usuario") === idEditar) {
            modal({
                type: "alert",
                messageText: texto,
                alertType: 'warning',
                headerText: titulo
            });
        }
        else {
            $('.events-filter').css('display', 'none');
            $('#tabelaUsuarios_paginate').css('display', 'none');
            $('#tabelaUsuarios').css('display', 'none');
            $(".bg_load").show();
            $(".wrapper").show();

            editarUsuario(idEditar);
        }

    });

    $(document).on('switchChange.bootstrapSwitch', '.ckbGrid', function (event, state) {


        var tbUsuario = new $.fn.dataTable.Api("#tabelaUsuarios"), linha = $(this).parent().parent().parent().parent(), btnSim = "Sim",
            btnNao = "Não", checkbox = this, idEditar = tbUsuario.row($(linha)).data()[0], titulo = 'Operação Inválida', texto = 'Não é permitido bloquear seu próprio usuário.';

        if (sessionStorage.getItem("id_usuario") === idEditar) {
            $(checkbox).bootstrapSwitch('state', !state.value, true);
            modal({
                type: "alert",
                messageText: texto,
                alertType: 'warning',
                headerText: titulo
            });
        } else {
            titulo = 'Gerenciamento de Usuários';

            var nomeUsuarioBloqueio = tbUsuario.row($(linha)).data()[1];


            if (!state.value) {
                texto = 'Ao confirmar esta operação, o usuário ' + nomeUsuarioBloqueio + ' perderá acesso ao sistema. </br> Deseja Prosseguir?';
                modal({
                    type: "confirm",
                    messageText: texto,
                    yesButtonText: btnSim,
                    noButtonText: btnNao,
                    alertType: 'warning',
                    headerText: titulo
                }).done(function (e) {
                    if (!e) {
                        $(checkbox).bootstrapSwitch('state', true, true);
                    } else {
                        alterarStatusUsuario(idEditar, state.value, checkbox);
                    }
                });
            } else {
                texto = 'Ao confirmar esta operação, o usuário ' + nomeUsuarioBloqueio + ' voltará a ter acesso ao sistema. </br> Deseja Prosseguir?';
                modal({
                    type: "confirm",
                    messageText: texto,
                    yesButtonText: btnSim,
                    noButtonText: btnNao,
                    alertType: 'warning',
                    headerText: titulo
                }).done(function (e) {
                    if (!e) {
                        $(checkbox).bootstrapSwitch('state', false, true);
                    } else {
                        alterarStatusUsuario(idEditar, state.value, checkbox);
                    }
                });
            }
        }

    });

    $('#ucComboAtivos').change(function () {
        recarregarTabelaUsuarios();
    });

    $('#ucComboAdmins').change(function () {
        recarregarTabelaUsuarios();
    });

    $('#fTxtBusca').keyup(function () {
        tabela.fnFilter($(this).val());
        $(".ckbGrid").bootstrapSwitch();
    });

    $('#fTxtBusca').keypress(function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
        }
    });
});


function cadastrarNovo() {
    var email = $("#txtEmail").val().toLowerCase();
    var user = $("#txtUserName").val();
    var nome = $("#txtNome").val();
    var sobnome = $("#txtSobrenome").val();
    var perfil = $("#cbPerfil").val() ? [$("#cbPerfil").val()] : [];
    var textoLoad = 'Cadastrando. Aguarde!', titulo = "Falha no Cadastro", texto = 'Para cadastrar um novo usuário, é necessário preencher todos os campos.';

    if (perfil.length === 0 || nome === '' || user === '' || email === '' || sobnome === '') {

        modal({
            type: "alert",
            messageText: texto,
            alertType: 'warning',
            headerText: titulo
        }).done(function (e) { focoCadastroInvalido(); });
    } else {

        waitingDialog.show(textoLoad, { dialogSize: 'lg', progressType: 'warning' });
        cadastrarUsuario(email, user, nome, sobnome, perfil, false);
    }

}

function carregarUsuario() {
    if (sessionStorage.getItem("perfilSistema") === 'undefined' && sessionStorage.getItem("perfilAdmin") === 'undefined' && sessionStorage.getItem("id_usuarioLogado") !== null) {
        sessionStorage.clear();
        localStorage.clear();
        localStorage.setItem("erro", "<strong>Operação Inválida!</strong></br>Você tentou acessar manualmente uma funcionalidade a qual você não tem permissão.</br>Por motivo de segurança, sua conexão foi encerrada. Caso haja alguma dúvida, entre em contato com o administrador do sistema.</br>Reconecte novamente e utilize apenas as funcionalidades que tenha permissão.");
        window.location = "../conta/login.cshtml";
    } else {
        tabela = $('#tabelaUsuarios').dataTable({
            paging: true, /* define se a tabela deve usar paginação */
            searching: true, /* define se deve usar o campo Buscar dentro da tabela */
            lengthChange: false,
            pageLength: 10,
            "info": false,
            "columnDefs": [
                {
                    "targets": "_all",
                    "orderable": false,
                    'className': 'dt-body-center'
                },
                {
                    "targets": 0,
                    "visible": false
                }
            ],
            "language": {
                "emptyTable": "Nenhum usuário encontrado",
                "zeroRecords": "Nenhum usuário corresponde ao filtro",
                "paginate": {
                    "previous": "Anterior",
                    "next": "Próximo"
                }
            },
            fixedHeader: true,
            "drawCallback": function (settings) {
                $(".ckbGrid").bootstrapSwitch();

                settings.oLanguage.oPaginate.sPrevious = "Anterior";
                settings.oLanguage.oPaginate.sNext = "Próximo";
                $('.ckbGrid').bootstrapSwitch('onText', 'Sim');
                $('.ckbGrid').bootstrapSwitch('offText', 'Não');
                $('.editaUsuario').each(function () {
                    $(this).attr('data-original-title', "Editar Usuário");
                });
                $(function () {
                    $('.editaUsuario').tooltip();
                });


                $('.cbPerfilGrid').selectpicker({
                    size: 4
                });
                $('[data-toggle="tooltip"]').tooltip();

                waitingDialog.hide();

            },
            "ajax": {
                'type': 'POST',
                'cache': false,
                'url': urlApi + 'ListarUsuarios',
                'data': function (d) {
                    if (filtrarParametros === true) {
                        return d = { 'status': statusFiltro, 'perfilId': perfilId };
                    }
                },
                'beforeSend': function (req) {
                    req.setRequestHeader('Authorization', sessionStorage.getItem("token"));
                },
                "dataSrc": function (json) {
                    var retorno = [];
                    for (var i = 0; i < json.length; i++) {
                        retorno.push(
                            carregarGridUsuario(json[i])
                        );
                    }
                    $("#usuarioOpcao").css("display", "none");

                    $(".bg_load").fadeOut();
                    $(".wrapper").fadeOut();
                    var $menuTitulo = $(".navbar.navbar-default.navbar-fixed-top");
                    $menuTitulo.find('.navbar-header .navbar-center').text('Gerenciamento de Usuário');
                    if ($menuTitulo.hasClass('ocultarElemento')) {
                        $menuTitulo.removeClass('ocultarElemento');
                    } else {
                        $menuTitulo.css('display', 'block');
                    }

                    $(".divSelectPicker.ocultarElemento").removeClass('ocultarElemento');
                    $('#tabelaUsuarios_paginate').css('display', 'block');
                    return retorno;
                }
            }
        });

        $('#tabelaUsuarios thead tr th').removeClass('sorting_asc');
        carregaComboPerfil();

    }
}

function limparModalCadastro() {
    $("#txtEmail").val('');
    $("#txtUserName").val('');
    $("#txtNome").val('');
    $("#txtSobrenome").val('');
    $("#txtCelular").val('');

    $('#cbPerfil').selectpicker('val', '');

    $('.divSelectPicker').addClass('ocultarElemento');
    $('#tabelaUsuarios_paginate').css('display', 'none');
    $(".table-responsive").find('.selectpicker').selectpicker('hide');
    $(".navbar.navbar-default.navbar-fixed-top").css("display", "none");

    var t = $('#tabelaUsuarios').DataTable();
    t.ajax.reload();
    $(".bg_load").show();
    $(".wrapper").show();
}
function focoCadastroInvalido() {
    !$("#cbPerfil").val() ? $("#cbPerfil").data('selectpicker').$button.focus() :
        $("#txtUserName").val().length < 1 ? $("#txtUserName").focus() :
            $("#txtNome").val().length < 1 ? $("#txtNome").focus() :
                $("#txtSobrenome").val().length < 1 ? $("#txtSobrenome").focus() : $("#txtEmail").focus();
}

function carregarGridUsuario(retorno) {

    var admin = '<select class="selectpicker cbPerfilGrid" data-width="100%" multiple title="Nenhum Perfil Atribuído">';
    var editarUsuario = '<a href="#" class="btn btn-primary btn3d editaUsuario" data-toggle="tooltip" title="Editar Usuário" style="margin-top:0px"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>';

    $.each(retorno.roles, function (indice, valor) {
        admin += '<option value="' + indice + '" disabled selected="selected">' + valor + '</option>';
    });
    admin += '</select>';
    var status;
    if (!retorno.locked) {
        status = '<input type="checkbox" checked class="ckbGrid" data-on-color="success" data-off-color="danger" data-on-text="Sim" data-off-text="Não">';
    } else {
        status = '<input type="checkbox" class="ckbGrid" data-on-color="success" data-off-color="danger" data-on-text="Sim" data-off-text="Não">';
    }

    cargaTabela = [
        retorno.id,
        retorno.nome + ' ' + retorno.sobrenome,
        retorno.email,
        status,
        admin,
        editarUsuario
    ];
    return cargaTabela;
}

function abrirModalNovoUsuario() {
    document.getElementById('novoUsuario').click();
}

function id(el) {
    return document.getElementById(el);
}

function recarregarTabelaUsuarios() {
    if (window.location.href.toLowerCase().indexOf("gerenciadorusuario") > -1) {
        statusFiltro = obterAtivos();
        perfilId = obterAdmins();

        waitingDialog.show('Aguarde!', { dialogSize: 'lg', progressType: 'warning' });
        if (statusFiltro.length === 0 && perfilId.length === 0) {
            filtrarParametros = false;

            $('#tabelaUsuarios').dataTable().api().ajax.url(urlApi + 'ListarUsuarios').load();

        } else {
            if (perfilId.length === 0) {
                perfilId.push("Todos");
            }
            if (statusFiltro.length === 0) {
                statusFiltro.push(2);
                statusFiltro.push(2);

            }
            filtrarParametros = true;

            $('#tabelaUsuarios').dataTable().api().ajax.url(urlApi + 'RecuperarUsuariosFiltrado').load();

        }
    }
}

function obterAtivos() {
    var statusRetorno = [];
    var lista = $('#ucComboAtivos').val();
    if (lista) {
        for (var i = 0; i < lista.length; i++) {
            statusRetorno.push(
                parseInt(lista[i])
            );
        }
    }
    return statusRetorno;
}

function obterAdmins() {
    var perfilIdRetorno = [];
    var lista = $('#ucComboAdmins').val();
    if (lista) {
        perfilIdRetorno = lista;
    }
    return perfilIdRetorno;
}
