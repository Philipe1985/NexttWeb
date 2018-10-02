﻿function cadastrarUsuario(email, usuario, nome, sobrenome, perfis, emailConfirmado) {
    var obj = { 'email': email, "nomeUsuario": usuario, "primeiroNome": nome, "ultimoNome": sobrenome, "perfis": perfis };
    if (emailConfirmado) {
        obj.emailConfirmado = emailConfirmado;
    }

    $.ajax({
        type: 'POST',
        cache: false,
        crossDomain: true,
        url: urlApi + 'Cadastrar',
        statusCode: {
            201: function (retorno) {
                waitingDialog.hide();
                $('#modalCadastroUsuario').modal('hide');
                var texto = '';
                emailConfirmado ?
                    texto = "O usuário foi cadastrado. Um email foi enviado com as orientações para acessar o sistema" :
                    texto = "O usuário foi cadastrado. Um email foi enviado para confirmação e orientação para acessar o sistema"
                modal({
                    messageText: texto,
                    type: "alert",
                    headerText: "Usuário Cadastrado com Sucesso",
                    alertType: "success"
                }).done(function (e) {
                    if (emailConfirmado) {
                        $('#tabSetupInicial li a[href="#permissaoApp"]').closest('li').removeClass("disabled");
                        $('#tabSetupInicial li a[href="#usuarioAdmin"]').closest('li').addClass("disabled tabFinalizada");
                        $('#tabSetupInicial li a[href="#usuarioAdmin"] i').removeClass("ocultarElemento");
                        $('#tabSetupInicial li a[href="#permissaoApp"]').tab('show');
                    } else {
                        limparModalCadastro(retorno);
                    }
                    
                });
            }
        },
        data: obj,
        async: true,
        beforeSend: function (req) {
            req.setRequestHeader('Authorization', sessionStorage.getItem("token"));
        },
        error: function (error) {
            modal({
                messageText: "Ocorreu um erro durante a operação. Informe o administrador do sistema o erro abaixo: <br/>Erro " + error.status + ": " + tratamentoErro(error),
                type: "alert",
                headerText: "Falha Interna",
                alertType: "warning"
            });
        }
    });
}
function carregarEspecie(parametro) {
    $.ajax({
        type: 'POST',
        crossDomain: true,
        async: true,
        cache: false,
        url: urlApi + 'gerenciamento/compra/BuscaEspeciesFiltradas',
        data: parametro,
        beforeSend: function (req) {
            req.setRequestHeader('Authorization', sessionStorage.getItem("token"));
        },
        success: function (result) {
            var sourceEsp = "";
            if (result.length ) {
                for (var i = 0; i < result.length; i++) {
                    console.log(result[i])
                    if (!localStorage.getItem("combo")) {
                        sourceEsp += '<optgroup label="' + result[i].grupoDescricao + '">';
                    }
                    
                    $.each(result[i].filtroEspecies, function (index, value) {
                        sourceEsp += "<option data-tokens='" + value.token + "' value='" + value.valor + "'>" + value.descricao + "</option>";
                    });
                    if (!localStorage.getItem("combo")) {
                        sourceEsp += '</optgroup>';
                    }
                }

                $("#drpEsp").html(sourceEsp);
                $(".selectpicker").selectpicker('refresh');
                $("#divEsp").removeClass('ocultarElemento');
                $(".bg_load").fadeOut();
                $(".wrapper").fadeOut();
                $('.selectpicker').selectpicker('show');
                $(".navbar.navbar-default.navbar-fixed-top").removeClass('ocultarElemento');
            } else {
                var texto = '';
                localStorage.getItem("combo") ?
                    texto = "Não existe nenhuma espécie para as seção selecionada!" :
                    texto = "Não existe nenhuma espécie para as seções selecionadas!";
                $(".bg_load").fadeOut();
                $(".wrapper").fadeOut();
                $(".navbar.navbar-default.navbar-fixed-top").removeClass('ocultarElemento');
                modal({
                    messageText: texto,
                    type: "alert",
                    modalSize: 'modal-lg',
                    headerText: '<i class="fa fa-ban red"></i>&nbsp;&nbsp;<strong>Atenção!</strong>',
                    alertType: "warning",
                    titleClass: 'red'
                }).done(function (e) {
                    $('.selectpicker').selectpicker('show');
                });
            }

            localStorage.removeItem("combo")

        },
        error: function (erro) {
            $(".bg_load").fadeOut();
            $(".wrapper").fadeOut();
            $('.selectpicker').selectpicker('show');
            $(".navbar.navbar-default.navbar-fixed-top").removeClass('ocultarElemento');
            modal({
                messageText: "Ocorreu um erro durante esta operação, tente novamente.<br/>Caso o erro persista informe o administrador do sistema o horário e data da ocorrencia",
                type: "alert",
                modalSize: 'modal-lg',
                headerText: "Falha Interna",
                alertType: "warning"
            });
        }
    });
}
function Logar(un, pw) {
    var dadosLogin = { "grant_type": "password", "username": un, "password": pw };
    $.ajax({
        type: 'POST',
        crossDomain: true,
        cache: false,
        //dataType: 'jsonp',
        url: urlToken + 'oauth/token',
        data: dadosLogin,
        success: function (result) {
            sessionStorage.setItem("token", result.token_type + ' ' + result.access_token);
            sessionStorage.setItem("id_usuarioLogado", result.nome);
            sessionStorage.setItem("id_usuario", result.userID);
            sessionStorage.setItem("perfilSistema", result.perfil);
            sessionStorage.setItem("perfilAdmin", result.gerenciarUsuario);
            localStorage.removeItem("erro");
            window.location = "../home.cshtml";
        },
        error: function (error) {
            console.log(error)
            if (error.status === 401) {
                localStorage.setItem("erro", "Acesso negado! Verifique usuario e senha. Caso o erro persista, entre em contato com o administrador do sistema para confirmar se está autorizado a logar");
                location.reload();
            }
            else {
                localStorage.setItem("erro", "Acesso negado! " + tratamentoErro(error));
                location.reload();
            }
        }
    });
}
function carregaComboPerfil() {
    $.ajax({
        type: 'POST',
        crossDomain: true,
        statusCode: {
            404: function () {
                falha("Nos parametros informados, existem dados nulos ou inválidos. Verifique e tente novamente!");
            }
        },
        cache: false,
        url: urlApi + 'RecuperarTodosPerfis',
        beforeSend: function (req) {
            req.setRequestHeader('Authorization', sessionStorage.getItem("token"));
        },
        success: function (result) {
            $.each(result, function (index, value) {
                $("#ucComboAdmins").append("<option value='" + value.id + "'>" + value.name + "</option>");
                $("#cbPerfil").append("<option value='" + value.name + "'>" + value.name + "</option>");
            });
            $('.selectpicker').selectpicker({
                size: 7
            });
            $('#ucComboAdmins').selectpicker('refresh');
            $('#cbPerfil').selectpicker('refresh');
            $('#ucComboAtivos').selectpicker('refresh');
            $('#cbPerfilNovo').selectpicker('refresh');

        },
        error: function (erro) {
            modal({
                messageText: "Ocorreu um erro durante a operação. Informe o administrador do sistema o erro abaixo: <br/>Erro " + erro.status + ": " + tratamentoErro(erro),
                type: "alert",
                headerText: "Falha Interna",
                alertType: "warning"
            });
        }
    });
}
function carregaComboPerfilEditar() {
    $.ajax({
        type: 'POST',
        crossDomain: true,
        statusCode: {
            404: function () {
                falha("Nos parametros informados, existem dados nulos ou inválidos. Verifique e tente novamente!");
            }
        },
        cache: false,
        url: urlApi + 'RecuperarTodosPerfis',
        beforeSend: function (req) {
            req.setRequestHeader('Authorization', sessionStorage.getItem("token"));
        },
        success: function (result) {
            console.log(result)
            $.each(result, function (index, value) {
                $("#ucComboAdminsEditar").append("<option value='" + value.name + "'>" + value.name + "</option>");
            });
            $('.selectpicker').selectpicker({
                size: 4
            });
            carregaUsuarioEditar();
        },
        error: function (erro) {
            modal({
                messageText: "Ocorreu um erro durante a operação. Informe o administrador do sistema o erro abaixo: <br/>Erro " + erro.status + ": " + tratamentoErro(erro),
                type: "alert",
                headerText: "Falha Interna",
                alertType: "warning"
            });
        }
    });
}
function alterarSenha(senhaAt, senhaNov, senhaConf) {
    var obj = { 'senhaAtual': senhaAt, "senhaNova": senhaNov, "confirmacaoSenha": senhaConf };
    $.ajax({
        type: 'POST',
        cache: false,
        crossDomain: true,
        url: urlApi + 'AlterarSenha',
        statusCode: {
            200: function (retorno) {
                waitingDialog.hide();
                $('#modalAlteraSenha').modal('hide');
                modal({
                    messageText: "Senha alterada com Sucesso",
                    type: "alert",
                    headerText: "Alteração de Senha",
                    alertType: "success"
                }).done(function (e) { limparModalSenha(); });
            }
        },
        data: obj,
        async: true,
        beforeSend: function (req) {
            req.setRequestHeader('Authorization', sessionStorage.getItem("token"));
        },
        error: function (error) {
            if (error.status === 500) {
                modal({
                    messageText: "Ocorreu um erro durante a operação. Informe o administrador do sistema o erro abaixo: <br/>" + tratamentoErro(error),
                    type: "alert",
                    headerText: "Falha Interna",
                    alertType: "warning"
                });
            }
            else {
                modal({
                    messageText: "Ocorreu um erro durante a operação. Certifique-se de que a senha atual informada está correta.",
                    type: "alert",
                    headerText: "Operação Inválida",
                    alertType: "warning"
                });
            }
        }
    });
}
function editarUsuario(id) {
    $.ajax({
        type: 'Get',
        cache: false,
        crossDomain: true,
        url: urlApi + 'RecuperaUsuario/' + id,
        statusCode: {
            200: function (retorno) {

                $("#usuarioOpcao").css("display", "block");
                $("#planejamentoOpcao").css("display", "block");
                sessionStorage.setItem("usuarioEditar", JSON.stringify(retorno));
                window.location = "../conta/editorusuario.cshtml";
            }
        },
        async: true,
        beforeSend: function (req) {
            req.setRequestHeader('Authorization', sessionStorage.getItem("token"));
        },
        error: function (error) {
            modal({
                messageText: "Ocorreu um erro durante a operação. Informe o administrador do sistema o erro abaixo: <br/>Erro " + error.status + ": " + tratamentoErro(error),
                type: "alert",
                headerText: "Falha Interna",
                alertType: "warning"
            });
        }
    });
}
function resetarSenha(id) {
    $.ajax({
        type: 'POST',
        cache: false,
        crossDomain: true,
        url: urlApi + 'ResetarSenha/' + id,
        statusCode: {
            200: function (retorno) {
                var texto = 'Informe esse usuário que a nova senha foi encaminhada ao E-mail cadastrado. <br/> Por questão de segurança, esta senha deve ser alterada o mais breve possível.', titulo = 'Senha Redefinida com Sucesso';
                if (sessionStorage.getItem("Ingles") === "true") {
                    titulo = 'Password Reset Successful';
                    texto = 'Notify this user that the new password was forwarded to the registered e-mail. <br/> For security reasons, this password should be changed as soon as possible.';
                }
                waitingDialog.hide();
                $('#modalAlteraSenha').modal('hide');
                modal({
                    messageText: texto,
                    type: "alert",
                    headerText: titulo,
                    alertType: "success"
                });

            }
        },
        async: true,
        beforeSend: function (req) {
            req.setRequestHeader('Authorization', sessionStorage.getItem("token"));
        },
        error: function (error) {
            modal({
                messageText: "Ocorreu um erro durante a operação. Informe o administrador do sistema o erro abaixo: <br/>Erro " + error.status + ": " + tratamentoErro(error),
                type: "alert",
                headerText: "Falha Interna",
                alertType: "warning"
            });
        }
    });
}
function alterarStatusUsuario(id, status, checkbox) {
    var objEnvio = { 'id': id, 'status': status };
    waitingDialog.show('Bloquando Usuario', { dialogSize: 'lg', progressType: 'warning' });
    $.ajax({
        type: 'POST',
        cache: false,
        crossDomain: true,
        url: urlApi + 'BloquearUsuario',
        statusCode: {
            200: function (retorno) {
                var texto = 'O usuário foi bloqueado com sucesso!', titulo = 'Operação Concluída';
                waitingDialog.hide();
                $('#modalAlteraSenha').modal('hide');
                modal({
                    messageText: texto,
                    type: "alert",
                    headerText: titulo,
                    alertType: "success"
                });
            }
        },
        data: objEnvio,
        async: true,
        beforeSend: function (req) {
            req.setRequestHeader('Authorization', sessionStorage.getItem("token"));
        },
        error: function (error) {
            console.log(error)
            waitingDialog.hide();
            $(checkbox).bootstrapSwitch('state', !status, true);
            var texto = 'O usuário ainda não confirmou o E-mail, e não pode ter o status alterado.', titulo = 'Operação Não Executada';
            if (error.responseJSON.message.indexOf("inválida") > -1) {
                modal({
                    messageText: texto,
                    type: "alert",
                    headerText: titulo,
                    alertType: "warning"
                });
            } else {
                modal({
                    messageText: "Ocorreu um erro durante a operação. Informe o administrador do sistema o erro abaixo: <br/>Erro " + error.status + ": " + tratamentoErro(error),
                    type: "alert",
                    headerText: "Falha Interna",
                    alertType: "warning"
                });
            }
        }
    });
}
function atualizarUsuario(usuarioAtualzado) {
    console.log(usuarioAtualzado);
    var textoLoad = 'Atualizando Usuário!';
    if (sessionStorage.getItem("Ingles") === "true") {
        textoLoad = 'Updating User!';
    }
    waitingDialog.show(textoLoad, { dialogSize: 'lg', progressType: 'warning' });
    $.ajax({
        type: 'POST',
        cache: false,
        crossDomain: true,
        url: urlApi + 'AtualizarPermissaoUsuario',
        statusCode: {
            200: function (retorno) {
                var texto = 'Usuário atualizado com sucesso. As alterações terão efeito a partis do proximo login', titulo = 'User Update';
                if (sessionStorage.getItem("Ingles") === "true") {
                    titulo = 'Profile Registration';
                    texto = 'User updated successfully. The changes will take effect from the next login.';
                }
                waitingDialog.hide();

                modal({
                    messageText: texto,
                    type: "alert",
                    headerText: titulo,
                    alertType: "success"
                });
            }
        },
        data: usuarioAtualzado,
        async: true,
        beforeSend: function (req) {
            req.setRequestHeader('Authorization', sessionStorage.getItem("token"));
        },
        error: function (error) {
            waitingDialog.hide();
            modal({
                messageText: "Ocorreu um erro durante a operação. Informe o administrador do sistema o erro abaixo: <br/>Erro " + error.status + ": " + tratamentoErro(error),
                type: "alert",
                headerText: "Falha Interna",
                alertType: "warning"
            });
        }
    });
}
function criarPerfilNovo(descricao, permissoes) {
    var obj = { 'descricaoPerfil': descricao, 'permissoesConsedidas': permissoes }, textoLoad = 'Cadastrando Perfil!';
    if (sessionStorage.getItem("Ingles") === "true") {
        textoLoad = 'Registering profile!';
    }
    waitingDialog.show(textoLoad, { dialogSize: 'lg', progressType: 'warning' });
    $.ajax({
        type: 'POST',
        cache: false,
        crossDomain: true,
        url: urlApi + 'CadastraPerfil',
        statusCode: {
            200: function (retorno) {
                var texto = 'Novo perfil cadastrado com sucesso, e já pode ser atribuido aos usuários', titulo = 'Cadastro de Perfil';
                if (sessionStorage.getItem("Ingles") === "true") {
                    titulo = 'Profile Registration';
                    texto = 'New profile successfully registered, and can already be assigned to users.';
                }
                waitingDialog.hide();
                modal({
                    messageText: texto,
                    type: "alert",
                    headerText: titulo,
                    alertType: "success"
                }).done(function (e) {
                    location.reload();
                });
            }
        },
        data: obj,
        async: true,
        beforeSend: function (req) {
            req.setRequestHeader('Authorization', sessionStorage.getItem("token"));
        },
        error: function (error) {
            modal({
                messageText: "Ocorreu um erro durante a operação. Informe o administrador do sistema o erro abaixo: <br/>Erro " + error.status + ": " + tratamentoErro(error),
                type: "alert",
                headerText: "Falha Interna",
                alertType: "warning"
            });
        }
    });
}

function cargaInicialGerenciamentoCompra(fluxo) {
    $.ajax({
        type: 'GET',
        crossDomain: true,
        cache: false,
        url: urlApi + 'gerenciamento/compra/RecuperaFiltrosPesquisaCompra',
        beforeSend: function (req) {
            req.setRequestHeader('Authorization', sessionStorage.getItem("token"));
        },
        success: function (result) {
            var sourceSec = "", sourceCNPJ = "", sourceMarca = "";
            if (fluxo !== 'cadastro' && fluxo !== 'produto') {

                sourceSec = '<option selected value="">Nenhuma</option>';
                sourceCNPJ = '<option selected value="">Nenhum</option>';
                sourceMarca = '<option selected value="">Nenhuma</option>';
                var sourceEspecie = '<option selected value="">Nenhuma</option>';
                $("#drpEsp").html(sourceEspecie);
            }
            $.each(result.secoes, function (index, value) {
                sourceSec += "<option data-tokens='" + value.token + "' value='" + value.valor + "'>" + value.descricao + "</option>";
            });
            $.each(result.fornecedores, function (index, value) {
                sourceCNPJ += "<option data-tokens='" + value.token + "' value='" + value.valor + "'>" + value.descricao + "</option>";
            });
            $.each(result.marcas, function (index, value) {
                sourceMarca += "<option data-tokens='" + value.token + "' value='" + value.valor + "'>" + value.descricao + "</option>";
            });


            $("#drpMarc").html(sourceMarca);
            $("#drpSec").html(sourceSec);
            $("#drpCNPJ").html(sourceCNPJ);
            $(".selectpicker").selectpicker();

            carregaFormCompraManager();
            $("#txtDescPed").removeAttr('style');
            $("#txtDescResPed").removeAttr('style');
            $(".selectpicker").selectpicker('refresh');
            $(".bg_load").fadeOut();
            $(".wrapper").fadeOut();
            $(".navbar.navbar-default.navbar-fixed-top").removeClass('ocultarElemento');
            $("div.controls.ocultarElemento").removeClass('ocultarElemento');
            $("#divForn").removeClass('ocultarElemento');
            $("#divMarca").removeClass('ocultarElemento');
            $("#divSec").removeClass('ocultarElemento');
            $("#divOcultaColuna").removeClass('ocultarElemento');

        },
        error: function (error) {
            sessionStorage.clear();
            localStorage.clear();
            localStorage.setItem("erro", "<strong>Erro Interno!</strong></br>Ocorreu uma falha de comunicação entre a aplicação e a base de dados. Aguarde alguns minutos e tente novamente.</br>Caso o erro persista, entre em contato com o administrador do sistema e comunique este problema.<br/>Erro " + error.status + ": " + tratamentoErro(error));
            window.location = "../conta/login.cshtml";
        }
    });

}
function geraCargaProdutoFiltrado(parametro) {
    $.ajax({
        type: 'POST',
        crossDomain: true,
        async: true,
        cache: false,
        url: urlApi + 'gerenciamento/compra/GeraDadosProdutoFiltrado',
        data: parametro,
        beforeSend: function (req) {
            req.setRequestHeader('Authorization', sessionStorage.getItem("token"));
        },
        success: function (result) {
            $("#txtFiltroProdutoCompra").val('');
            tbProduto.columns().visible(true);
            tbProduto.search('').clear();
            tbProduto.data(tbProduto).rows.add(result.produtos);
            tbProduto.draw();
            finalizarOcultacaoColuna();

        },
        error: function (erro) {
            $(".bg_load").fadeOut("slow");
            $(".wrapper").fadeOut("slow", function () {
                $('.selectpicker').selectpicker('show');
            });

            modal({
                messageText: "Ocorreu um erro durante esta operação, tente novamente.<br/>Caso o erro persista informe o administrador do sistema o horário e data da ocorrencia",
                type: "alert",
                headerText: "Falha Interna",
                alertType: "warning"
            });
        }
    });
}
function atualizaCargaFiltroTamanho(parametro) {
    $.ajax({
        type: 'POST',
        crossDomain: true,
        async: true,
        cache: false,
        url: urlApi + 'gerenciamento/compra/RecarregaDadosTamanho',
        data: parametro,
        beforeSend: function (req) {
            req.setRequestHeader('Authorization', sessionStorage.getItem("token"));
        },
        success: function (result) {
            var sourceTamanho = '';
            $.each(result, function (index, value) {
                sourceTamanho += criarTamanho(value.valor, value.descricao);
            });
            $('#drpTamanhoGrade').html(sourceTamanho);
            $(".selectpicker").selectpicker('refresh');
            $(".bg_load").fadeOut();
            $(".wrapper").fadeOut();
            $(".navbar.navbar-default.navbar-fixed-top").removeClass('ocultarElemento');
            $(".selectpicker").selectpicker('show');
        },
        error: function (erro) {
            $(".bg_load").fadeOut("slow");
            $(".wrapper").fadeOut("slow", function () {
                $('.selectpicker').selectpicker('show');
            });

            modal({
                messageText: "Ocorreu um erro durante esta operação, tente novamente.<br/>Caso o erro persista informe o administrador do sistema o horário e data da ocorrencia",
                type: "alert",
                headerText: "Falha Interna",
                alertType: "warning"
            });
        }
    });
}

function atualizaFiltroCadastroNovoProdutoCompra(parametro) {

    $.ajax({
        type: 'POST',
        crossDomain: true,
        async: true,
        cache: false,
        url: urlApi + 'gerenciamento/compra/AtualizaFiltrosCadProdCompra',
        data: parametro,
        beforeSend: function (req) {
            req.setRequestHeader('Authorization', sessionStorage.getItem("token"));
        },
        success: function (result) {
            console.log(result);
            var secSelecionado = $("#drpSec").val(), espSelecionado = $("#drpEsp").val(), marcSelecionado = $("#drpMarc").val(), cnpjSelecionado = $("#drpCNPJ").val();
            var sourceSec = '<option selected value="">Nenhuma</option>', sourceCNPJ = '<option selected value="">Nenhum</option>',
                sourceMarca = '<option selected value="">Nenhuma</option>', sourceEspecie = '<option selected value="">Nenhuma</option>';
            $.each(result.secoes, function (index, value) {
                sourceSec += "<option data-tokens='" + value.token + "' value='" + value.valor + "'>" + value.descricao + "</option>";
            });
            $.each(result.fornecedores, function (index, value) {
                sourceCNPJ += "<option data-tokens='" + value.token + "' value='" + value.valor + "'>" + value.descricao + "</option>";
            });
            $.each(result.marcas, function (index, value) {
                sourceMarca += "<option data-tokens='" + value.token + "' value='" + value.valor + "'>" + value.descricao + "</option>";
            });
            $.each(result.especies, function (index, value) {
                sourceEspecie += "<option data-tokens='" + value.token + "' value='" + value.valor + "'>" + value.descricao + "</option>";
            });
            var alterado = localStorage.getItem("combo");
            localStorage.removeItem("combo");
            if (alterado !== 'marca' && !parametro.marcas) {
                $("#drpMarc").html(sourceMarca);
            }
            if (alterado !== 'secao' && !parametro.secoes) {
                $("#drpSec").html(sourceSec);
            }
            if (alterado !== 'fornecedor' && !parametro.idFornecedor) {
                $("#drpCNPJ").html(sourceCNPJ);
            }



            $("#drpEsp").html(sourceEspecie);
            $(".selectpicker").selectpicker('refresh');
            carregaFormCadProdAtualizaFiltro(cnpjSelecionado, secSelecionado, marcSelecionado, espSelecionado);
            $(".selectpicker").selectpicker('refresh');
            $(".bg_load").fadeOut("slow");
            $(".wrapper").fadeOut("slow", function () {
                $('.selectpicker').selectpicker('show');
            });

        },
        error: function (erro) {
            $(".bg_load").fadeOut("slow");
            $(".wrapper").fadeOut("slow", function () {
                $('.selectpicker').selectpicker('show');
            });

            modal({
                messageText: "Ocorreu um erro durante esta operação, tente novamente.<br/>Caso o erro persista informe o administrador do sistema o horário e data da ocorrencia",
                type: "alert",
                headerText: "Falha Interna",
                alertType: "warning"
            });
        }
    });

}
function geraCargaPrePedido(parametro) {
    $.ajax({
        type: 'POST',
        crossDomain: true,
        async: true,
        cache: false,
        url: urlApi + 'gerenciamento/compra/BuscaDadosPrePedido',
        data: parametro,
        beforeSend: function (req) {
            req.setRequestHeader('Authorization', sessionStorage.getItem("token"));
        },
        success: function (result) {
            console.log(result);
            var sourceSec = "", sourceCNPJ = "", souceClass = "", sourceMarca = "", sourceEspecie = "",
                sourceForma = "", sourceCondicao = "", sourceCores = "", sourceTamanho = "",
                sourceTamanhoGrupo = "", sourceReferencia = "";
            //tamanhoCalcados = result.filtrosPrePedido.tamanhosCalcado, tamanhoConfeccao = result.filtrosPrePedido.tamanhosConfeccao;
            $.each(result.filtrosPrePedido.secoes, function (index, value) {
                sourceSec += "<option selected data-tokens='" + value.token + "' value='" + value.valor + "'>" + value.descricao + "</option>";
            });
            $.each(result.filtrosPrePedido.fornecedores, function (index, value) {
                sourceCNPJ += "<option selected data-tokens='" + value.token + "' value='" + value.valor + "'>" + value.descricao + "</option>";
            });
            $.each(result.filtrosPrePedido.marcas, function (index, value) {
                sourceMarca += "<option selected data-tokens='" + value.token + "' value='" + value.valor + "'>" + value.descricao + "</option>";
            });
            $.each(result.filtrosPrePedido.especies, function (index, value) {
                sourceEspecie += "<option selected data-tokens='" + value.token + "' value='" + value.valor + "'>" + value.descricao + "</option>";
            });
            $.each(result.filtrosPrePedido.formaPgto, function (index, value) {
                sourceForma += criarCondPgto(value.valor, value.descricao, 'money');
            });
            $.each(result.filtrosPrePedido.classificacao, function (index, value) {
                souceClass += criarClassificacao(value.valor, value.token, value.descricao);
            });
            $.each(result.filtrosPrePedido.condicaoPgto, function (index, value) {
                sourceCondicao += criarCondPgto(value.valor, value.descricao, 'calculator');
            });
            $.each(result.filtrosPrePedido.cores, function (index, value) {
                sourceCores += criarCor(value.valor, value.descricao, value.token, value.dadosAdicionais);
            });
            $.each(result.filtrosPrePedido.referencias, function (index, value) {
                if (!parseInt(value.token.split(',')[0])) {
                    sourceReferencia += '<option data-tokens="' + value.token + '" value="' + value.descricao + '" data-content="<span class=\'badge badge-danger\' style=\'font-size: 12px;\'><i style=\'font-size: 12px !important;width:12px !important;height:12px !important;\' class=\'glyphicon glyphicon-tags\' aria-hidden=\'true\'></i>&nbsp;&nbsp;' + value.descricao + '</span>">' + value.descricao + '</option>';
                } else {
                    sourceReferencia += '<option data-tokens="' + value.token + '" value="' + value.descricao + '" data-content="<span style=\'font-size: 12px;\'><i style=\'font-size: 12px !important;width:12px !important;height:12px !important;\' class=\'glyphicon glyphicon-tags\' aria-hidden=\'true\'></i>&nbsp;&nbsp;' + value.descricao + '</span>">' + value.descricao + '</option>';                        
                }
            });
            $.each(result.filtrosPrePedido.tamanhoGrupo, function (index, value) {
                sourceTamanhoGrupo += criarTamanho(value.valor, value.token, value.descricao);
            });
            $.each(result.filtrosPrePedido.tamanhoOpcoes, function (index, value) {
                sourceTamanho += criarTamanho(value.valor, value.token, value.descricao, value.dadosAdicionais);
            });
            $("#drpEsp").html(sourceEspecie).attr('disabled', true);
            $("#drpMarc").html(sourceMarca).attr('disabled', true);
            $("#drpSec").html(sourceSec).attr('disabled', true);
            $("#drpCNPJ").html(sourceCNPJ).attr('disabled', true);
            $("#drpCoresGrade").html(sourceCores);
            $("#drpTamanhoGrade").html(sourceTamanho);
            $("#drpTamanhoCategoria").html(sourceTamanhoGrupo);
            $('#drpReferenciaGrade').html(sourceReferencia);
            $('#drpClassificacao').html(souceClass).selectpicker('val', '');
            $("#drpCondPgtoPed").html(sourceCondicao).selectpicker('val', '');
            $("#drpCondPgtoPed option[value='" + result.ultimaCondicao + "']").attr('selected', 'selected');
            $("#drpFrmPgtoPed").html(sourceForma).selectpicker('val', result.ultimaForma);
            if (result.filtrosPrePedido.tamanhoGrupo.length === 1) {
                $("#drpTamanhoCategoria option[value='" + result.filtrosPrePedido.tamanhoGrupo[0].valor + "']").attr('selected', 'selected')
            }

            ordenaOpcao();
            $(".selectpicker").selectpicker();

            $("#drpCoresGrade").selectpicker('val', result.coresGrade);
            $("#drpTamanhoGrade").selectpicker('val', result.tamanhosGrade);
            $('#drpReferenciaGrade').selectpicker('val', result.referenciasGrade);
            $("#txtIDProd").val(result.idProduto).attr('disabled', true);
            $("#txtProdutoPed").val(result.codProduto).attr('disabled', true);
            $("#txtCodOriPed").val(result.codOriginal).attr('disabled', true);
            $("#txtRefPed").val(result.referencia).attr('disabled', true);
            $("#txtDescPed").val(toTitleCase(result.descricao)).attr('disabled', true);
            $("#txtDescResPed").val(toTitleCase(result.descricaoReduzida)).css('font-weigh', 'bold !important').attr('disabled', true);
            nomesCoresCSS = repartirArray(result.filtrosPrePedido.dadosPaleta.valoresCSS);
            nomesCoresPtCSS = repartirArray(result.filtrosPrePedido.dadosPaleta.descricoes);
            $("#txtCustoBrutoPed").val(result.precoCusto.toFixed(2).replace('.', ','));
            $("#txtPrVendaPed").val(result.precoVenda.toFixed(2).replace('.', ','));
            $("#txtDescontoPedPerc").val(result.desconto.toFixed(2).replace('.', ','));
            $("#txtPercPontualidade").val(result.descontoPontualidade.toFixed(2).replace('.', ','));
            $("#txtIPIPercPed").val(result.ipi.toFixed(2).replace('.', ','));
            $("#txtIcmsPercPed").val(result.icms.toFixed(2).replace('.', ','));
            var valQualiNota = result.qualidadeQtde;
            var valQuantNota = result.qualidadeValor;
            if (valQualiNota === 0) {
                valQualiNota = 100;
            }
            if (valQuantNota === 0) {
                valQuantNota = 100;
            }
            $("#txtQldProdPed").val(valQualiNota.toFixed(2).replace('.', ','));
            $("#txtQldNotaPed").val(valQuantNota.toFixed(2).replace('.', ','));
            calculaAlteracaoCusto();
            $('.percent').maskMoney('mask');
            $('.money').maskMoney('mask');
            criaPaletas();
            if (result.ultimaCondicao && result.ultimaForma.length) {
                $('#wizard-cad-ped li a[href="#tabFoto"]').click();
            }
            var $menuTitulo = $(".navbar.navbar-default.navbar-fixed-top");
            $menuTitulo.find('.navbar-header .navbar-center').text('Cadastro de Pré-Pedido');
            $(".selectpicker").selectpicker('refresh');
            carregaPedidoGrade();
            $(".bg_load").fadeOut();
            $(".wrapper").fadeOut();
            $(".navbar.navbar-default.navbar-fixed-top").removeClass('ocultarElemento');
            $("div.controls.ocultarElemento").removeClass('ocultarElemento');
            $("#divForn").removeClass('ocultarElemento');
            $("#divMarca").removeClass('ocultarElemento');
            $("#divSec").removeClass('ocultarElemento');

        },
        error: function (erro) {
            console.log(erro)
            $(".bg_load").fadeOut("slow");
            $(".wrapper").fadeOut("slow", function () {
                $('.selectpicker').selectpicker('show');
            });

            modal({
                messageText: "Ocorreu um erro durante esta operação, tente novamente.<br/>Caso o erro persista informe o administrador do sistema o horário e data da ocorrencia",
                type: "alert",
                headerText: "Falha Interna",
                alertType: "warning"
            });
        }
    });
}
function geraCargaCadNovo() {
    $.ajax({
        type: 'GET',
        crossDomain: true,
        async: true,
        cache: false,
        url: urlApi + 'gerenciamento/compra/BuscaDadosCadNovo',
        //data: parametro,
        beforeSend: function (req) {
            req.setRequestHeader('Authorization', sessionStorage.getItem("token"));
        },
        success: function (result) {
            console.log(result);
            var sourceForma = "", sourceCondicao = "", souceClass = '', sourceSec = '<option selected value="">Nenhuma</option>', sourceTamanho = "", sourceCNPJ = '<option selected value="">Nenhum</option>',
                sourceMarca = '<option selected value="">Nenhuma</option>', sourceCores = '', sourceEspecie = '<option selected value="">Nenhuma</option>';
            $.each(result.secoes, function (index, value) {
                sourceSec += "<option data-tokens='" + value.token + "' value='" + value.valor + "'>" + value.descricao + "</option>";
            });
            $.each(result.fornecedores, function (index, value) {
                sourceCNPJ += "<option data-tokens='" + value.token + "' value='" + value.valor + "'>" + value.descricao + "</option>";
            });
            $.each(result.marcas, function (index, value) {
                sourceMarca += "<option data-tokens='" + value.token + "' value='" + value.valor + "'>" + value.descricao + "</option>";
            });
            $.each(result.classificacao, function (index, value) {
                souceClass += criarClassificacao(value.valor, value.token, value.descricao);
            });
            $.each(result.cores, function (index, value) {
                sourceCores += criarCor(value.valor, value.descricao, value.token, value.dadosAdicionais);
            });
            $.each(result.formaPgto, function (index, value) {
                sourceForma += criarCondPgto(value.valor, value.descricao, 'money');
            });
            $.each(result.condicaoPgto, function (index, value) {
                sourceCondicao += criarCondPgto(value.valor, value.descricao, 'calculator');
            });
            $.each(result.tamanhos.tamanhosGrupo, function (index, value) {
                sourceTamanho += criarTamanho(value.valor, value.token, value.descricao);
            });
            $("#drpEsp").html(sourceEspecie).attr('disabled', true);
            $("#drpMarc").html(sourceMarca).attr('disabled', false);
            $("#drpSec").html(sourceSec).attr('disabled', false);
            $("#drpCNPJ").html(sourceCNPJ).attr('disabled', false);
            $("#drpCondPgtoPed").html(sourceCondicao);
            $("#drpFrmPgtoPed").html(sourceForma);
            $("#drpTamanhoCategoria").html(sourceTamanho).selectpicker('val', '');
            $('#drpClassificacao').html(souceClass).selectpicker('val', '');
            $("#drpCoresGrade").html(sourceCores);

            $(".selectpicker").selectpicker();
            nomesCoresCSS = repartirArray(result.dadosPaleta.valoresCSS);
            nomesCoresPtCSS = repartirArray(result.dadosPaleta.descricoes);
            criaPaletas();
            $("#drpCondPgtoPed").val('');
            criaInputImagem([], [], [])
            if ($('#txtQldProdPed').maskMoney('unmasked')[0] === 0) {
                $("#txtQldProdPed").val((100).toFixed(2).replace('.', ',')).maskMoney('mask');
            }
            if ($('#txtQldNotaPed').maskMoney('unmasked')[0] === 0) {
                $("#txtQldNotaPed").val((100).toFixed(2).replace('.', ',')).maskMoney('mask');
            }
            if (sessionStorage.getItem('continuar')) {
                continuarNovoProd()
            }
            var $menuTitulo = $(".navbar.navbar-default.navbar-fixed-top");
            $menuTitulo.find('.navbar-header .navbar-center').text('Cadastro de Pré-Pedido');
            $(".selectpicker").selectpicker('refresh');
            $(".bg_load").fadeOut();
            $(".wrapper").fadeOut();
            $(".navbar.navbar-default.navbar-fixed-top").removeClass('ocultarElemento');
            $("div.controls.ocultarElemento").removeClass('ocultarElemento');
            $("#divForn").removeClass('ocultarElemento');
            $("#divMarca").removeClass('ocultarElemento');
            $("#divSec").removeClass('ocultarElemento');

        },
        error: function (erro) {
            $(".bg_load").fadeOut("slow");
            $(".wrapper").fadeOut("slow", function () {
                $('.selectpicker').selectpicker('show');
            });

            modal({
                messageText: "Ocorreu um erro durante esta operação, tente novamente.<br/>Caso o erro persista informe o administrador do sistema o horário e data da ocorrencia",
                type: "alert",
                headerText: "Falha Interna",
                alertType: "warning"
            }).done(function (e) {
                if (e) {

                    $(".bg_load").show();
                    $(".wrapper").show();
                    sessionStorage.removeItem("compra");
                    sessionStorage.removeItem("pedidoId");
                    sessionStorage.removeItem("cadastroNovo");
                    sessionStorage.removeItem("pedidoStatus");
                    if (!sessionStorage.getItem("produtosLista")) {
                        window.location = "../gerenciamento/compra.cshtml";
                    } else {
                        window.location = "../gerenciamento/compraprodutos.cshtml";
                    }

                    
                }
            });;
        }
    });
}

function retornaDadosGrpFilDist(parametro, qtdRef) {
    $.ajax({
        type: 'POST',
        crossDomain: true,
        async: true,
        cache: false,
        url: urlApi + 'gerenciamento/compra/BuscaFiliaisGrupo',
        data: parametro,
        beforeSend: function (req) {
            req.setRequestHeader('Authorization', sessionStorage.getItem("token"));
        },
        success: function (result) {
            console.log(result)
            console.log(qtdRef)

            if (typeof qtdRef.texto === 'undefined') {
                console.log(result[0].filiais)
                var idTbPack = 'tblPackCad' + qtdRef.pack;
                tabelaPackCadastrados.map(obj => {
                    if (obj.idTabela === idTbPack) {
                        for (var i = 0; i < obj.packGrupos.length; i++) {
                            if (obj.packGrupos[i].idGrupo === qtdRef.idGrupo) {
                                obj.packGrupos[i].filiais = result[0].filiais;
                                calculaDistribuicaoFilialGrupo(obj.packGrupos[i]);
                                break;
                            }
                        }
                        for (var i = 0; i < obj.distOriginal.length; i++) {
                            if (obj.distOriginal[i].idGrupo === qtdRef.idGrupo) {
                                obj.distOriginal[i].filiais = result[0].filiais;
                                break;
                            }
                        }
                        recalcPackGrpsFiliais(qtdRef.pack, obj.packGrupos);

                    }
                    return obj;
                })
                $('#tabDadosDist' + qtdRef.pack + ' li').children('a[href="#grupo' + qtdRef.idGrupo + '_' + qtdRef.pack + '"]').first().click();

            } else {
                qtdRef.grupos = calculaDistribuicaoTotalPackGrp(result, qtdRef.texto)
                if (qtdRef.idPackAtivo) {
                    var idTb = 'tblPackCad' + qtdRef.idPackAtivo;
                    criarTabGrupoFilial(qtdRef.grupos, qtdRef.idPackAtivo);
                    geraCargaDistPackFiliais(qtdRef.grupos, qtdRef.idPackAtivo)
                    tabelaPackCadastrados.map(obj => {
                        if (obj.idTabela === idTb) {
                            obj.packGrupos = qtdRef.grupos;
                            delete qtdRef.idPackAtivo;
                            obj.distOriginal = qtdRef;
                            if ($('ul#tabDadosDist' + idTb.replace('tblPackCad', '') + ' li').length > 1) {
                                obj.packGrupos = calculaDistribuicaoTotalPackGrp(obj.packGrupos, obj.qtdPck);
                                recalcPackGrpsFiliais(idTb.replace('tblPackCad', ''), obj.packGrupos);
                            }
                        }
                        return obj;
                    })

                } else {
                    finalizaPackCadastrado(qtdRef);
                }
            }


        },
        error: function (erro) {
            $(".bg_load").fadeOut("slow");
            $(".wrapper").fadeOut("slow", function () {
                $('.selectpicker').selectpicker('show');
            });

            modal({
                messageText: "Ocorreu um erro durante esta operação, tente novamente.<br/>Caso o erro persista informe o administrador do sistema o horário e data da ocorrencia",
                type: "alert",
                headerText: "Falha Interna",
                alertType: "warning"
            });
        }
    });

}
function geraCargaTamanhos(parametro) {
    $.ajax({
        type: 'POST',
        crossDomain: true,
        async: false,
        cache: false,
        url: urlApi + 'gerenciamento/compra/RecarregaDadosTamanho',
        data: parametro,

        beforeSend: function (req) {
            req.setRequestHeader('Authorization', sessionStorage.getItem("token"));
        },
        success: function (result) {
            console.log(result);
            var sourceTamanho = "";
            $.each(result, function (index, value) {
                sourceTamanho += criarTamanho(value.valor, value.token, value.descricao);
            });
            $("#drpTamanhoGrade").html(sourceTamanho).selectpicker('val', '');

            $(".selectpicker").selectpicker();
            $(".selectpicker").selectpicker('refresh');
        },
        error: function (erro) {
            console.log(erro)
            modal({
                messageText: "Ocorreu um erro durante esta operação, tente novamente.<br/>Caso o erro persista informe o administrador do sistema o horário e data da ocorrencia",
                type: "alert",
                headerText: "Falha Interna",
                alertType: "warning"
            });
        }
    });
}

function carregaImagemProduto(parametro) {
    $.ajax({
        type: 'POST',
        crossDomain: true,
        async: true,
        cache: false,
        url: urlApi + 'gerenciamento/compra/BuscaImagensProduto',
        data: parametro,
        beforeSend: function (req) {
            req.setRequestHeader('Authorization', sessionStorage.getItem("token"));
        },
        success: function (result) {
            console.log(result);
            var listaImagem = [];
            var configImg = [];
            var configRodaope = [];
            for (var i = 0; i < result.length; i++) {
                listaImagem = geraImagemInput(listaImagem, result[i]);
                configImg = geraPreviewConfig(configImg, result[i]);
                configRodaope = geraRodapePreview(configRodaope);
            }
            criaInputImagem(listaImagem, configImg, configRodaope)
            if (sessionStorage.getItem("pedidoStatus") && sessionStorage.getItem("pedidoStatus") !== 'A') {
                desabiliaFotos()
            }
        },
    });
}

function salvarPedido(parametro) {
    $.ajax({
        type: 'POST',
        crossDomain: true,
        async: true,
        cache: false,
        url: urlApi + 'gerenciamento/compra/salvarNovoPedido',
        data: parametro,

        beforeSend: function (req) {
            req.setRequestHeader('Authorization', sessionStorage.getItem("token"));
        },
        success: function (result) {
            console.log(result)
            var files = $('#imgUpload').fileinput('getFileStack');
            if (files.length) {
                sessionStorage.setItem("idProdutoImagens", result);
                $('#imgUpload').fileinput('upload');
            }
            sessionStorage.removeItem("pedidoId");
            sessionStorage.removeItem("pedidoStatus")
            $(".bg_load").fadeOut("slow");
            $(".wrapper").fadeOut("slow", function () {
                var jc2 = $.confirm({
                    title: 'Pedido Salvo Com Sucesso!',
                    content: 'O pedido foi enviado para aprovação.',
                    icon: 'fa fa-check',
                    theme: 'modern',
                    closeIcon: false,
                    type: 'green',
                    animation: 'scale',
                    buttons: {
                        okButton: {
                            text: 'ok'
                        }
                    },
                    onContentReady: function () {
                        setTimeout(function () {
                            jc2.close()
                        }, 4000);
                    },
                    onOpenBefore: function () {
                        this.buttons.okButton.hide();
                    },
                    onDestroy: function () { salvarDadosCompra(true) }
                });
            });


        },
        error: function (erro) {
            $('.selectpicker').selectpicker('show');
            $(".navbar.navbar-default.navbar-fixed-top").removeClass('ocultarElemento');
            $(".bg_load").fadeOut("slow");
            $(".wrapper").fadeOut("slow", function () {
                $('.selectpicker').selectpicker('show');
            });

            modal({
                messageText: "Ocorreu um erro durante esta operação, tente novamente.<br/>Caso o erro persista informe o administrador do sistema o horário e data da ocorrencia",
                type: "alert",
                headerText: "Falha Interna",
                alertType: "warning"
            });
        }
    });
}
function criarClonePedido(parametro) {
    $.ajax({
        type: 'POST',
        crossDomain: true,
        async: true,
        cache: false,
        url: urlApi + 'cadastro/pedido/RetornaPedidoClonado',
        data: parametro,

        beforeSend: function (req) {
            req.setRequestHeader('Authorization', sessionStorage.getItem("token"));
        },
        success: function (result) {
            console.log(result)
            sessionStorage.setItem("pedidoId", result)
           
            window.location = "../cadastro/compra.cshtml";

        },
        error: function (erro) {
            $('.selectpicker').selectpicker('show');
            $(".navbar.navbar-default.navbar-fixed-top").removeClass('ocultarElemento');
            $(".bg_load").fadeOut("slow");
            $(".wrapper").fadeOut("slow", function () {
                $('.selectpicker').selectpicker('show');
            });

            modal({
                messageText: "Ocorreu um erro durante esta operação, tente novamente.<br/>Caso o erro persista informe o administrador do sistema o horário e data da ocorrencia",
                type: "alert",
                headerText: "Falha Interna",
                alertType: "warning"
            });
        }
    });
}
function recuperaGruposCadastrados() {
    $.ajax({
        type: 'GET',
        crossDomain: true,
        async: true,
        cache: false,
        url: urlApi + 'cadastro/grupo/RecuperaFiltrosCadastroGrupo',
        beforeSend: function (req) {
            req.setRequestHeader('Authorization', sessionStorage.getItem("token"));
        },
        success: function (result) {
            var sourceGrupo = '', sourceFiliais = '';
            $.each(result.grupos, function (index, value) {
                sourceGrupo += "<option data-tokens='" + value.token + "' value='" + value.valor + "'>" + toTitleCase(value.descricao) + "</option>";
            });
            $.each(result.filiais, function (index, value) {
                sourceFiliais += "<option data-tokens='" + value.token + "' value='" + value.valor + "'>" + toTitleCase(value.descricao) + "</option>";
            });


            $("#cbGrupos").html(sourceGrupo);
            localStorage.setItem("filiaisOption", sourceFiliais);

            //$("#cbFiliais").html(sourceFiliais);
            $(".selectpicker").selectpicker('refresh');
            $(".bg_load").fadeOut();
            $(".wrapper").fadeOut();
            var $menuTitulo = $(".navbar.navbar-default.navbar-fixed-top");
            $menuTitulo.find('.navbar-header .navbar-center').text('Gerenciamento de Grupos/Filiais');
            $menuTitulo.removeClass('ocultarElemento');
            $(".controls.ocultarElemento").removeClass('ocultarElemento');
        },
        error: function (erro) {
            $(".bg_load").fadeOut("slow");
            $(".wrapper").fadeOut("slow", function () {
                $('.selectpicker').selectpicker('show');
            });

            modal({
                messageText: "Ocorreu um erro durante esta operação, tente novamente.<br/>Caso o erro persista informe o administrador do sistema o horário e data da ocorrencia",
                type: "alert",
                headerText: "Falha Interna",
                alertType: "warning"
            });
        }
    });
}

function retornaInfoGrp(parametro) {
    $.ajax({
        type: 'POST',
        crossDomain: true,
        async: true,
        cache: false,
        url: urlApi + 'cadastro/grupo/RecuperaFiliaisPorGrupo',
        data: parametro,
        beforeSend: function (req) {
            req.setRequestHeader('Authorization', sessionStorage.getItem("token"));
        },
        success: function (result) {
            console.log(result);
            //Criar abas dos grupos
            criarTabGruposSelecionados(result.gruposCadastrados)
        },
        error: function (erro) {
            $(".bg_load").fadeOut("slow");
            $(".wrapper").fadeOut("slow", function () {
                $('.selectpicker').selectpicker('show');
            });

            modal({
                messageText: "Ocorreu um erro durante a operação. Informe o administrador do sistema o erro abaixo: <br/>Erro " + erro.status + ": " + tratamentoErro(erro),
                type: "alert",
                headerText: "Falha Interna",
                alertType: "warning"
            });
        }
    });

}
function salvarAtualizacaoGrp(parametro) {
    $.ajax({
        type: 'POST',
        crossDomain: true,
        async: true,
        cache: false,
        url: urlApi + 'cadastro/grupo/AtualizarGrupos',
        data: parametro,
        beforeSend: function (req) {
            req.setRequestHeader('Authorization', sessionStorage.getItem("token"));
        },
        success: function (result) {
            $('#divPaineisCadastroGrupo').addClass('ocultarElemento');
            $('#divPaineisCadastroGrupo #cadGrupo').empty();
            $('#divPaineisCadastroGrupo div.tab-content:first').empty();
            $('.selectpicker').selectpicker('show');
            $(".bg_load").fadeOut("slow");
            $(".wrapper").fadeOut("slow", function () {
                msgGrupoAtualizado();
            });
            //Criar abas dos grupos
        },
        error: function (erro) {
            $(".bg_load").fadeOut("slow");
            $(".wrapper").fadeOut("slow", function () {
                $('.selectpicker').selectpicker('show');
            });

            modal({
                messageText: "Ocorreu um erro durante esta operação, tente novamente.<br/>Caso o erro persista informe o administrador do sistema o horário e data da ocorrencia",
                type: "alert",
                headerText: "Falha Interna",
                alertType: "warning"
            });
        }
    });

}

function cadastrarGrupoNovo(parametro) {
    $.ajax({
        type: 'POST',
        crossDomain: true,
        async: true,
        cache: false,
        url: urlApi + 'cadastro/grupo/CadastrarGrupo',
        data: parametro,
        beforeSend: function (req) {
            req.setRequestHeader('Authorization', sessionStorage.getItem("token"));
        },
        success: function (result) {
            $('#divPaineisCadastroGrupo').addClass('ocultarElemento');
            var novoGrupo = "<option selected data-tokens='" + result.gruposCadastrado[0].idGrupo + ',' + result.gruposCadastrado[0].descricao + "' value='" + result.gruposCadastrado[0].idGrupo + "'>" + toTitleCase(result.gruposCadastrado[0].descricao) + "</option>";
            $("#cbGrupos").prepend(novoGrupo);
            $("#cbGrupos").selectpicker('refresh');
            $("#cbGrupos").selectpicker('render');
            criarTabGruposSelecionados(result.gruposCadastrados);
            $('.selectpicker').selectpicker('show');
            $(".bg_load").fadeOut("slow");
            $(".wrapper").fadeOut("slow", function () {
                msgGrupoCadastrado();
            });

            //Criar abas dos grupos
        },
        error: function (erro) {
            $(".bg_load").fadeOut("slow");
            $(".wrapper").fadeOut("slow", function () {
                $('.selectpicker').selectpicker('show');
            });

            modal({
                messageText: "Ocorreu um erro durante esta operação, tente novamente.<br/>Caso o erro persista informe o administrador do sistema o horário e data da ocorrencia",
                type: "alert",
                headerText: "Falha Interna",
                alertType: "warning"
            });
        }
    });
}

function cargaInicialPedido() {
    $.ajax({
        type: 'GET',
        crossDomain: true,
        cache: false,
        url: urlApi + 'cadastro/pedido/CarregaFiltrosPesquisa',
        beforeSend: function (req) {
            req.setRequestHeader('Authorization', sessionStorage.getItem("token"));
        },
        success: function (result) {
            var sourceSec = "", sourceCNPJ = "", sourceMarca = "", sourseUsuario = "";

            $.each(result.secoes, function (index, value) {
                sourceSec += "<option data-tokens='" + value.token + "' value='" + value.valor + "'>" + value.descricao + "</option>";
            });
            $.each(result.fornecedores, function (index, value) {
                sourceCNPJ += "<option data-tokens='" + value.token + "' value='" + value.valor + "'>" + value.descricao + "</option>";
            });
            $.each(result.marcas, function (index, value) {
                sourceMarca += "<option data-tokens='" + value.token + "' value='" + value.valor + "'>" + value.descricao + "</option>";
            });
            $.each(result.usuarios, function (index, value) {
                if (sessionStorage.getItem("perfilSistema") === 'undefined' && sessionStorage.getItem("perfilAdmin") === 'undefined') {
                    if (sessionStorage.getItem("id_usuario") === value.valor) {
                        sourseUsuario += "<option disabled data-tokens='" + value.token + "' value='" + value.valor + "'>" + value.descricao + "</option>";
                    }
                }
                else {
                    sourseUsuario += "<option data-tokens='" + value.token + "' value='" + value.valor + "'>" + value.descricao + "</option>";
                }
            });

            $("#drpMarc").html(sourceMarca);
            $("#drpSec").html(sourceSec);
            $("#drpCNPJ").html(sourceCNPJ);
            $("#cbUsuario").html(sourseUsuario);

            $(".selectpicker").selectpicker();

            $("#txtDescPed").removeAttr('style');
            $("#txtDescResPed").removeAttr('style');
            if (sessionStorage.getItem("perfilSistema") === 'undefined' && sessionStorage.getItem("perfilAdmin") === 'undefined') {

                $("#cbUsuario").selectpicker('destroy').selectpicker({
                    liveSearch: false,
                    actionsBox: false,
                });
                $("#cbUsuario").selectpicker('val', sessionStorage.getItem("id_usuario"));
            }
            $(".selectpicker").selectpicker('refresh');
            localStorage.setItem('primeiroAcesso', '1')
            carregaFormCompraManager();

            $(".bg_load").fadeOut();
            $(".wrapper").fadeOut();
            $(".navbar.navbar-default.navbar-fixed-top").removeClass('ocultarElemento');
            $("div.controls.ocultarElemento").removeClass('ocultarElemento');
            $("#divForn").removeClass('ocultarElemento');
            $("#divMarca").removeClass('ocultarElemento');
            $("#divSec").removeClass('ocultarElemento');
            $("#divOcultaColuna").removeClass('ocultarElemento');

        },
        error: function (error) {
            sessionStorage.clear();
            localStorage.clear();
            localStorage.setItem("erro", "<strong>Erro Interno!</strong></br>Ocorreu uma falha de comunicação entre a aplicação e a base de dados. Aguarde alguns minutos e tente novamente.</br>Caso o erro persista, entre em contato com o administrador do sistema e comunique este problema.<br/>Erro " + error.status + ": " + tratamentoErro(error));
            window.location = "../conta/login.cshtml";
        }
    });

}
function carregaPedidoSintetico(parametro) {
    $.ajax({
        type: 'POST',
        crossDomain: true,
        async: true,
        cache: false,
        url: urlApi + 'cadastro/pedido/RetornaPedidoSintetico',
        data: parametro,
        beforeSend: function (req) {
            req.setRequestHeader('Authorization', sessionStorage.getItem("token"));
        },
        success: function (result) {
            console.log(result)
            criaSinteticoFoto(result);
            criaSinteticoFornecedor(result);
            criaSinteticoPedido(result);
            criaSinteticoProduto(result);
            criaSinteticoTitulo(result);
            $('#divPackCadastradosNF').html('');
            $('#divPackDistNF').html('');
            for (var i = 0; i < result.packs.length; i++) {
                for (var j = 0; j < result.packs[i].gruposDistribuir.length; j++) {
                    var contentDist = criaPainelRelatorioDist("Pack " + result.packs[i].idPedidoPack +
                        '/' + toTitleCase(result.packs[i].gruposDistribuir[j].descricao),
                        "grupo" + result.packs[i].gruposDistribuir[j].idGrupo + '_' + result.packs[i].idPedidoPack);
                    var objContentDist = $.parseHTML(contentDist);
                    $('#divPackDistNF').append($(objContentDist));
                    var tbHtmlDist = retornaTabela("tblGrpPack" + result.packs[i].gruposDistribuir[j].idGrupo + '_' + result.packs[i].idPedidoPack),
                        headerTb = criaTabelaDistribuicaoNF(result.packs[i].gruposDistribuir[j].filiais);
                    var objHtmlDist = $.parseHTML(tbHtmlDist);
                    $("#grupo" + result.packs[i].gruposDistribuir[j].idGrupo +
                        '_' + result.packs[i].idPedidoPack + " div.table-responsive").append($(objHtmlDist));
                    $("#tblGrpPack" + result.packs[i].gruposDistribuir[j].idGrupo + '_' + result.packs[i].idPedidoPack)
                        .removeClass('tbPackCad').addClass('tbPackGrp').html(headerTb);
                    //$('#divPackDistNF').append('<div class="page-break"></div>')
                }
                var content = criaPainelRelatorio('frmPack' + result.packs[i].idPedidoPack, "Pack " + result.packs[i].idPedidoPack);
                var objContent = $.parseHTML(content);
                $('#divPackCadastradosNF').append($(objContent));
                var colPack = retornaPackCadColunas(result.packs[i].packItens[0].dadosTamanho);
                var dadosPack = retornaPackCadDados(result.packs[i].packItens);
                var tbHtml = retornaTabela("tblPackCad" + result.packs[i].idPedidoPack);
                var objHtml = $.parseHTML(tbHtml);
                $("#frmPack" + result.packs[i].idPedidoPack + " div.table-responsive").append($(objHtml));
                $("#tblPackCad" + result.packs[i].idPedidoPack).append(criaColunasTabelaNF(result.packs[i].packItens[0].dadosTamanho));
                carregarPackNF("tblPackCad" + result.packs[i].idPedidoPack, dadosPack, colPack, result.packs[i].idPedidoPack);
                geraCargaDistPackFiliaisNF(result.packs[i].gruposDistribuir, result.packs[i].idPedidoPack, result.precoCusto)
                $(function () {
                    $('[data-toggle="tooltip"]').tooltip();
                });
            }
            $('#modalBodyDetalhePedido').removeClass('ocultarElemento');
            $('.btnFooters').removeClass('ocultarElemento');
            $("#modalLoad").fadeOut("slow");
            $("#modalwrapper").fadeOut("slow");


            //Criar abas dos grupos
        },
        error: function (erro) {
            $("#modalLoad").hide();
            $("#modalwrapper").hide();

            $('#modalBodyDetalhePedido').removeClass('ocultarElemento');
            $('.btnFooters').removeClass('ocultarElemento');
            $('#modalDetalhamentoPedido').modal('hide');
            erroCadCompra("Ocorreu um erro durante esta operação, tente novamente.<br/>Caso o erro persista informe o administrador do sistema o horário e data da ocorrencia",
                "alertConsultaPedido")

        }
    });
}
function geraCargaPedidoAnalitico(parametro) {
    $.ajax({
        type: 'POST',
        crossDomain: true,
        async: true,
        cache: false,
        url: urlApi + 'cadastro/pedido/RetornaPedidoAnalitico',
        data: parametro,
        beforeSend: function (req) {
            req.setRequestHeader('Authorization', sessionStorage.getItem("token"));
        },
        success: function (result) {
            console.log(result);
            var objEnvio = {};
            objEnvio.codigo = result.idProduto;
            sessionStorage.setItem("pedidoStatus", result.status);

            carregaImagemProduto(objEnvio);
            var sourceSec = "", sourceCNPJ = "", souceClass = "", sourceMarca = "", sourceEspecie = "", sourceForma = "",
                sourceCondicao = "", sourceCores = "", sourceTamanho = "", sourceTamanhoGrupo = "", sourceReferencia = "";
            $.each(result.filtrosPrePedido.secoes, function (index, value) {
                sourceSec += "<option selected data-tokens='" + value.token + "' value='" + value.valor + "'>" + value.descricao + "</option>";
            });
            $.each(result.filtrosPrePedido.fornecedores, function (index, value) {
                sourceCNPJ += "<option selected data-tokens='" + value.token + "' value='" + value.valor + "'>" + value.descricao + "</option>";
            });
            $.each(result.filtrosPrePedido.marcas, function (index, value) {
                sourceMarca += "<option selected data-tokens='" + value.token + "' value='" + value.valor + "'>" + value.descricao + "</option>";
            });
            $.each(result.filtrosPrePedido.especies, function (index, value) {
                sourceEspecie += "<option selected data-tokens='" + value.token + "' value='" + value.valor + "'>" + value.descricao + "</option>";
            });
            $.each(result.filtrosPrePedido.formaPgto, function (index, value) {
                sourceForma += criarCondPgto(value.valor, value.descricao, 'money');
            });
            $.each(result.filtrosPrePedido.classificacao, function (index, value) {
                souceClass += criarClassificacao(value.valor, value.token, value.descricao);
            });
            $.each(result.filtrosPrePedido.condicaoPgto, function (index, value) {
                sourceCondicao += criarCondPgto(value.valor, value.descricao, 'calculator');
            });
            $.each(result.filtrosPrePedido.referencias, function (index, value) {
                sourceReferencia += '<option data-tokens="' + value.token + '" value="' + value.descricao + '" data-content="<span style=\'font-size: 12px;\'><i style=\'font-size: 12px !important;width:12px !important;height:12px !important;\' class=\'glyphicon glyphicon-tags\' aria-hidden=\'true\'></i>&nbsp;&nbsp;' + value.descricao + '</span>">' + value.descricao + '</option>';
            });
            $.each(result.filtrosPrePedido.cores, function (index, value) {
                sourceCores += criarCor(value.valor, value.descricao, value.token, value.dadosAdicionais);
            });
            $.each(result.filtrosPrePedido.tamanhoGrupo, function (index, value) {
                sourceTamanhoGrupo += criarTamanho(value.valor, value.token, value.descricao);
            });
            $.each(result.filtrosPrePedido.tamanhoOpcoes, function (index, value) {
                sourceTamanho += criarTamanho(value.valor, value.token, value.descricao);
            });

            $('#txtDtEntregaPed').data('daterangepicker').minDate = moment(new Date(result.dataEntregaInicio));
            $('#txtDtEntregaPed').data('daterangepicker').setStartDate(new Date(result.dataEntregaInicio));
            $('#txtDtEntregaPed').data('daterangepicker').setEndDate(new Date(result.dataEntregaFinal));
            $('#txtDtEntregaFinalPed').data('daterangepicker').setStartDate(new Date(result.dataToleranciaAtrasoInicio));
            $('#txtDtEntregaFinalPed').data('daterangepicker').setEndDate(new Date(result.dataToleranciaAtrasoFinal));

            $("#drpEsp").html(sourceEspecie).attr('disabled', true);
            $("#drpMarc").html(sourceMarca).attr('disabled', true);
            $("#drpSec").html(sourceSec).attr('disabled', true);
            $("#drpCNPJ").html(sourceCNPJ).attr('disabled', true);
            $("#drpCoresGrade").html(sourceCores);
            $("#drpTamanhoGrade").html(sourceTamanho);
            $("#drpTamanhoCategoria").html(sourceTamanhoGrupo);
            $('#drpReferenciaGrade').html(sourceReferencia);
            $('#drpClassificacao').html(souceClass).selectpicker('val', '');
            $("#drpCondPgtoPed").html(sourceCondicao);
            $("#drpFrmPgtoPed").html(sourceForma);
            ordenaOpcao();
            $(".selectpicker").selectpicker();
            $("#drpCoresGrade").selectpicker('val', result.coresSelecionadas.split(','));
            $("#drpTamanhoGrade").selectpicker('val', result.tamanhosSelecionadas.split(','));
            $('#drpReferenciaGrade').selectpicker('val', result.referenciasSelecionadas.split(','));
            $("#drpCondPgtoPed option[value='" + result.condicaoSeleciona + "']").attr('selected', 'selected')
            $("#drpClassificacao option[value='" + result.classificacaoSelecionada + "']").attr('selected', 'selected')
            $("#drpTamanhoCategoria option[value='" + result.filtrosPrePedido.tamanhoGrupo[0].valor + "']").attr('selected', 'selected')

            $('#drpFrmPgtoPed').selectpicker('val', result.formasSelecionadas.split(','));
            //$(".selectpicker").selectpicker('refresh');
            $('#txtAreaObsPed').val(result.observacao);
            $("#txtIDProd").val(result.idProduto).attr('disabled', true);
            $("#txtProdutoPed").val(result.codProduto).attr('disabled', true);
            $("#txtCodOriPed").val(result.codOriginal).attr('disabled', true);
            $("#txtRefPed").val(result.referenciaFornecedor).attr('disabled', true);
            $("#txtDescPed").val(toTitleCase(result.descricaoProduto)).attr('disabled', true);
            $("#txtDescResPed").val(toTitleCase(result.descricaoReduzidaProduto)).css('font-weigh', 'bold !important').attr('disabled', true);
            nomesCoresCSS = repartirArray(result.filtrosPrePedido.dadosPaleta.valoresCSS);
            nomesCoresPtCSS = repartirArray(result.filtrosPrePedido.dadosPaleta.descricoes);
            $("#txtCustoBrutoPed").val(result.precoCusto.toFixed(2).replace('.', ','));
            $("#txtPrVendaPed").val(result.precoVenda.toFixed(2).replace('.', ','));
            $("#txtDescontoPedPerc").val(result.desconto.toFixed(2).replace('.', ','));
            $("#txtPercVendor").val(result.acrescimo.toFixed(2).replace('.', ','));
            $("#txtPercPontualidade").val(result.descontoPontualidade.toFixed(2).replace('.', ','));
            $("#txtIPIPercPed").val(result.ipi.toFixed(2).replace('.', ','));
            $("#txtIcmsPercPed").val(result.icms.toFixed(2).replace('.', ','));
            var valQualiNota = result.qualidadeQtde;
            var valQuantNota = result.qualidadeValor;
            if (valQualiNota === 0) {
                valQualiNota = 100;
            }
            if (valQuantNota === 0) {
                valQuantNota = 100;
            }
            $("#txtQldProdPed").val(valQualiNota.toFixed(2).replace('.', ','));
            $("#txtQldNotaPed").val(valQuantNota.toFixed(2).replace('.', ','));
            calculaAlteracaoCusto();

            atualizaCbClassificacao();
            carregaPedidoGrade();
            $('.percent').maskMoney('mask');
            $('.money').maskMoney('mask');
            criaPaletas();
            var $menuTitulo = $(".navbar.navbar-default.navbar-fixed-top");
            $('#grupoPackCadastrados').removeClass('ocultarElemento');
            for (var i = 0; i < result.packs.length; i++) {
                var dadosOriginais = {};
                if (result.packs[i].gruposDistribuir) {
                    dadosOriginais.grupos = result.packs[i].gruposDistribuir;
                } else {
                    dadosOriginais.grupos = [];
                }
                dadosOriginais.texto = result.packs[i].packItens[0].dadosTamanho[0].qtdePack
                criarAbaPackCadastrado(result.packs[i].idPedidoPack, dadosOriginais);
                var colPack = retornaPackCadColunas(result.packs[i].packItens[0].dadosTamanho);
                var dadosPack = retornaPackCadDados(result.packs[i].packItens);
                carregarPackPedidoCadastrado("tblPackCad" + result.packs[i].idPedidoPack, dadosOriginais, dadosPack, colPack);
            }
            $menuTitulo.find('.navbar-header .navbar-center').text('Cadastro de Pré-Pedido');
            $(".finish-change").html('Atualizar');
            $(".selectpicker").selectpicker('refresh');
            $(".bg_load").fadeOut();
            $(".wrapper").fadeOut();
            $(".navbar.navbar-default.navbar-fixed-top").removeClass('ocultarElemento');
            $("div.controls.ocultarElemento").removeClass('ocultarElemento');
            $("#divForn").removeClass('ocultarElemento');
            $("#divMarca").removeClass('ocultarElemento');
            $("#divSec").removeClass('ocultarElemento');
            if (result.status !== 'A') {
                desabilitaEdicao();
                $(".selectpicker").selectpicker('refresh');
            }
            statusPedido = result.status;

        },
        error: function (erro) {
            sessionStorage.removeItem('compra');
            sessionStorage.removeItem("pedidoId");
            sessionStorage.removeItem("pedidoStatus");
            $(".bg_load").fadeOut("slow");
            $(".wrapper").fadeOut("slow", function () {
                $('.selectpicker').selectpicker('show');
            });

            modal({
                messageText: "Ocorreu um erro durante esta operação, tente novamente.<br/>Caso o erro persista informe o administrador do sistema o horário e data da ocorrencia",
                type: "alert",
                headerText: "Falha Interna",
                alertType: "warning"
            }).done(function (e) {
                if (e) {

                    $(".bg_load").show();
                    $(".wrapper").show();
                    window.location = "../gerenciamento/pedido.cshtml";
                }
            });;
        }
    });
}
function atualizarStatus(parametro) {
    console.log(parametro)
    $('#modalDetalhamentoPedido').modal('hide');
    $('.selectpicker').selectpicker('hide');
    $(".navbar.navbar-default.navbar-fixed-top").addClass('ocultarElemento');
    $(".bg_load").show();
    $(".wrapper").show();
    $.ajax({
        type: 'POST',
        crossDomain: true,
        async: true,
        cache: false,
        url: urlApi + 'cadastro/pedido/atualizaStatusPedido',
        data: parametro,
        beforeSend: function (req) {
            req.setRequestHeader('Authorization', sessionStorage.getItem("token"));
        },
        success: function (result) {
            var pathname = window.location.pathname;
            if (pathname.toLowerCase().indexOf('pedido') > -1) {
                carregarPedidos();
                $(".bg_load").fadeOut();
                $(".wrapper").fadeOut();
                $(".navbar.navbar-default.navbar-fixed-top").removeClass('ocultarElemento');
                $('.selectpicker').selectpicker('show');
            } else {
                window.location = "../gerenciamento/pedido.cshtml";
            }

            //Criar abas dos grupos
        },
        error: function (erro) {
            $(".bg_load").fadeOut("slow");
            $(".wrapper").fadeOut("slow", function () {
                $('.selectpicker').selectpicker('show');
            });

            modal({
                messageText: "Ocorreu um erro durante esta operação, tente novamente.<br/>Caso o erro persista informe o administrador do sistema o horário e data da ocorrencia",
                type: "alert",
                headerText: "Falha Interna",
                alertType: "warning"
            });
        }
    });
}