function cadastrarUsuario(email, usuario, nome, sobrenome, perfis, emailConfirmado, idNextt) {
    var obj = { 'email': email, "nomeUsuario": usuario, "primeiroNome": nome, "ultimoNome": sobrenome, "perfis": perfis, 'idUsuarioNextt': idNextt };
    if (emailConfirmado) {
        obj.emailConfirmado = emailConfirmado;
    }

    $.ajax({
        type: 'POST',
        crossDomain: true,
        url: urlApi + 'Cadastrar',
        statusCode: {
            201: function (retorno) {
                console.log(retorno)
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
                        location.reload();
                    }

                });
            }
        },
        data: obj,
        async: true,
        xhrFields: {
            withCredentials: true
        },
        beforeSend: function (req) {
            if (sessionStorage.getItem("token")) {
                req.setRequestHeader('Authorization', sessionStorage.getItem("token"));
            }
        },
        error: function (error) {
            console.log(error)
            waitingDialog.hide();
            modal({
                messageText: "Ocorreu um erro durante esta operação, tente novamente.<br/>Caso o erro persista informe o administrador do sistema o horário e data da ocorrencia: Erro " + error.status + ": " + tratamentoErro(error),
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
            console.log(result)
            if (result.especiesRecarga.length) {
                for (var i = 0; i < result.especiesRecarga.length; i++) {

                    if (!localStorage.getItem("combo")) {
                        sourceEsp += '<optgroup label="' + result.especiesRecarga[i].grupoDescricao + '">';
                    }

                    $.each(result.especiesRecarga[i].filtroEspecies, function (index, value) {
                        sourceEsp += "<option data-tokens='" + value.token + "' value='" + value.valor + "'>" + value.descricao + "</option>";
                    });
                    if (!localStorage.getItem("combo")) {
                        sourceEsp += '</optgroup>';
                    }
                }
                if (window.location.href.toLowerCase().indexOf("cadastro/compra") > -1) {
                    $("#pnlAttrProd").html('');
                    carregaAtributosPorOrdem(result.attrEleListaProd, result.attrListaProd, result.ordemProd, false)
                    $(".prVenda").maskMoney();
                    $(".attrBool").bootstrapSwitch();
                    $(".attrNum").maskMoney();
                    $(".attrMon").maskMoney();
                    $(".attrPerc").maskMoney();
                    $(".attrNum").maskMoney('mask');
                    $(".attrMon").maskMoney('mask');
                    $(".attrPerc").maskMoney('mask');
                    $('.money').maskMoney('mask');
                }
                if (result.atributoFornecedor) {
                    var $cbfrn = $('#cbAttr' + result.atributoFornecedor);
                    if ($cbfrn) {
                        $cbfrn.selectpicker('val', result.atributoValor.split(','));
                    }

                }

                if ($('#drpTamanhoCategoria').length) {
                    $('#drpTamanhoCategoria').trigger('change');
                    $('#drpTamanhoCategoria ').prop('disabled', true);
                }

                $("#drpEsp").html(sourceEsp);

                configuraCombosOpcoes('#drpEsp');

                if (!$("#drpEsp").hasClass('selectpicker')) {
                    $("#drpEsp").addClass('selectpicker')
                }
                $(".selectpicker").selectpicker('refresh');
                $("#divEsp").removeClass('ocultarElemento');
                $(".bg_load").fadeOut();
                $(".wrapper").fadeOut();
                $('.selectpicker').selectpicker('show');
                if (window.location.href.toLowerCase().indexOf("gerenciamento/compra") > -1) {
                    $('#drpSec').selectpicker('toggle');
                }

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
function carregarSecoes(parametro) {
    $.ajax({
        type: 'POST',
        crossDomain: true,
        async: true,
        cache: false,
        url: urlApi + 'gerenciamento/movimentacao/RetornaSecoes',
        data: parametro,
        beforeSend: function (req) {
            req.setRequestHeader('Authorization', sessionStorage.getItem("token"));
        },
        success: function (result) {
            console.log(result)
            var sourceSec = "";

            $.each(result, function (index, value) {
                sourceSec += "<option data-tokens='" + value.token + "' value='" + value.valor + "'>" + value.descricao + "</option>";
            });
            $("#drpSec").html(sourceSec);
            configuraCombosOpcoes('#drpSec');

            if (!$("#drpSec").hasClass('selectpicker')) {
                $("#drpSec").addClass('selectpicker')
            }
            $(".selectpicker").selectpicker('refresh');
            $("#drpSec").selectpicker("refresh");
            if (window.location.href.toLowerCase().indexOf("cadastro/compra") > -1) {
                $("#divEsp").removeClass('ocultarElemento');
            }

            $(".bg_load").fadeOut();
            $(".wrapper").fadeOut();
            $('.selectpicker').selectpicker('show');
            var $menuTitulo = $(".navbar.navbar-default.navbar-fixed-top");
            $menuTitulo.removeClass('ocultarElemento');

            $("div.controls.ocultarElemento").removeClass('ocultarElemento');

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
function carregarEspecieModal(parametro, isItem) {
    if (isItem) {
        console.log(parametro)
    }
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
            console.log(result)
            if (result.especiesRecarga.length) {
                for (var i = 0; i < result.especiesRecarga.length; i++) {

                    if (!localStorage.getItem("combo")) {
                        sourceEsp += '<optgroup label="' + result.especiesRecarga[i].grupoDescricao + '">';
                    }

                    $.each(result.especiesRecarga[i].filtroEspecies, function (index, value) {
                        sourceEsp += "<option data-tokens='" + value.token + "' value='" + value.token.split("-")[0] + "-" + value.valor.split("-")[0] + "'>" + value.descricao + "</option>";
                    });
                    if (!localStorage.getItem("combo")) {
                        sourceEsp += '</optgroup>';
                    }
                }
                if (!isItem) {
                    $("#drpEspCad").html(sourceEsp);

                    configuraCombosOpcoes('#drpEspCad');

                    if (!$("#drpEspCad").hasClass('selectpicker')) {
                        $("#drpEspCad").addClass('selectpicker')
                    }
                    $(".selectpicker").selectpicker('refresh');
                    if (typeof espSelecionadas !== 'undefined') {
                        $("#drpEspCad").selectpicker('val', espSelecionadas)
                        espSelecionadas = [];
                    }
                    
                    $("#divEspCad").removeClass('ocultarElemento');
                } else {
                    $("#drpEspCadItem").html(sourceEsp);

                    $(".selectpicker").selectpicker('refresh');
                    $("#drpEspCadItem").selectpicker('val', espSelecionadas)
                    $("#divEspCadItem").removeClass('ocultarElemento');
                }

                $(".bg_load").fadeOut();
                $(".wrapper").fadeOut();
                $('.selectpicker').selectpicker('show');
                var $menuTitulo = $(".navbar.navbar-default.navbar-fixed-top");
                $menuTitulo.removeClass('ocultarElemento');

                $("div.controls.ocultarElemento").removeClass('ocultarElemento');


            }
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
function carregarSecoesModal(parametro, isItem) {
    $.ajax({
        type: 'POST',
        crossDomain: true,
        async: true,
        cache: false,
        url: urlApi + 'gerenciamento/movimentacao/RetornaSecoes',
        data: parametro,
        beforeSend: function (req) {
            req.setRequestHeader('Authorization', sessionStorage.getItem("token"));
        },
        success: function (result) {
            console.log(result)
            var sourceSec = "";

            $.each(result, function (index, value) {
                sourceSec += "<option data-tokens='" + value.token + "' value='" + value.valor + "'>" + value.descricao + "</option>";
            });
            if (!isItem) {
                $("#drpSecCad").html(sourceSec);
                configuraCombosOpcoes('#drpSecCad');

                if (!$("#drpSecCad").hasClass('selectpicker')) {
                    $("#drpSecCad").addClass('selectpicker')
                }
                $("#drpSecCad").selectpicker("refresh");

                if (secoesAttrEditar.length) {
                    $("#drpSecCad").selectpicker('val', secoesAttrEditar).trigger('change');
                    secoesAttrEditar = [];
                }
            } else {
                $("#drpSecCadItem").html(sourceSec);

                $("#drpSecCadItem").selectpicker("refresh");

                if (secoesAttrEditar.length) {
                    $("#drpSecCadItem").selectpicker('val', secoesAttrEditar).trigger('change');
                    secoesAttrEditar = [];
                }
            }

            $(".bg_load").fadeOut();
            $(".wrapper").fadeOut();
            $('.selectpicker').selectpicker('show');
            var $menuTitulo = $(".navbar.navbar-default.navbar-fixed-top");
            $menuTitulo.removeClass('ocultarElemento');

            $("div.controls.ocultarElemento").removeClass('ocultarElemento');


            $(".selectpicker").selectpicker('refresh');




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

function carregarFiltrosMovimentacaoProduto() {
    $.ajax({
        type: 'GET',
        crossDomain: true,
        async: true,
        cache: false,
        url: urlApi + 'gerenciamento/movimentacao/RecuperaFiltrosMovimentacaoProduto',
        beforeSend: function (req) {
            req.setRequestHeader('Authorization', sessionStorage.getItem("token"));
        },
        success: function (result) {
            console.log(result)
            var sourceSeg = "";
            var sourceGrupo = "";
            $.each(result.gruposFiliais, function (index, value) {
                sourceGrupo += "<option data-tokens='" + value.token + "' value='" + value.valor + "'>" + value.descricao + "</option>";
            });
            $.each(result.segmentos, function (index, value) {
                sourceSeg += "<option data-tokens='" + value.token + "' value='" + value.valor + "'>" + value.descricao + "</option>";
            });
            $("#drpGrps").html(sourceGrupo);
            $("#drpSeg").html(sourceSeg);
            $("#divTipoRel").removeClass('ocultarElemento');
            $("#divGrp").removeClass('ocultarElemento');
            $("#divSeg").removeClass('ocultarElemento');
            $('.selectpicker').selectpicker('refresh');
            $(".bg_load").fadeOut();
            $(".wrapper").fadeOut();
            var $menuTitulo = $(".navbar.navbar-default.navbar-fixed-top");
            $menuTitulo.removeClass('ocultarElemento');
            $menuTitulo.find('.navbar-header .navbar-center').text('Movimentação de Produtos');
            $("div.controls.ocultarElemento").removeClass('ocultarElemento');
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
            var permissoes = geraPermissoesAtivas(result);
            console.log(permissoes);
            sessionStorage.setItem("token", result.token_type + ' ' + result.access_token);
            sessionStorage.setItem("id_usuarioLogado", result.nome);
            sessionStorage.setItem("token_expirado", new Date().addHours(8))
            sessionStorage.setItem("id_usuario", result.userID);
            sessionStorage.setItem("perfilSistema", result.perfil);
            sessionStorage.setItem("perfilAdmin", result.gerenciarUsuario);
            sessionStorage.setItem("permissoes", JSON.stringify(permissoes));

            localStorage.removeItem("erro");
            window.location = "../home.cshtml";
        },
        error: function (erro) {
            console.log(erro.getAllResponseHeaders())
            if (erro.status === 401) {
                localStorage.setItem("erro", "Acesso negado! Verifique usuario e senha. Caso o erro persista, entre em contato com o administrador do sistema para confirmar se está autorizado a logar");
                location.reload();
            }
            else {
                localStorage.setItem("erro", "Acesso negado! " + tratamentoErro(erro));
                location.reload();
            }
        }
    });
}
function carregaComboPerfil() {
    $.ajax({
        type: 'POST',
        crossDomain: true,
        cache: false,
        url: urlApi + 'RecuperarTodosPerfis',
        beforeSend: function (req) {
            req.setRequestHeader('Authorization', sessionStorage.getItem("token"));
        },
        success: function (result) {
            console.log(result)
            $.each(result, function (index, value) {
                $("#ucComboAdmins").append("<option value='" + value.id + "'>" + value.name + "</option>");
                $("#cbPerfil").append("<option value='" + value.id + "'>" + value.name + "</option>");
                $("#cbPerfilUsuario").append("<option value='" + value.id + "'>" + value.name + "</option>");
                if (value.name !== 'Administrador') {
                    $("#cbPerfilAtualizar").append("<option value='" + value.id + "'>" + value.name + "</option>");
                }
                $("#cbPerfilNovo").append("<option value='" + value.permissoes + "'>" + value.name + "</option>");
            });
            $('.selectpicker').selectpicker({
                size: 7
            });
            $('#ucComboAdmins').selectpicker('refresh');
            $('#cbPerfil').selectpicker('refresh');
            $('#cbPerfilUsuario').selectpicker('refresh');
            $('#ucComboAtivos').selectpicker('refresh');
            $('#cbPerfilNovo').selectpicker('refresh');
            $('#cbPerfilAtualizar').selectpicker('refresh');

        },
        error: function (erro) {
            modal({
                messageText: "Ocorreu um erro durante esta operação, tente novamente.<br/>Caso o erro persista informe o administrador do sistema o horário e data da ocorrencia",
                type: "alert",
                headerText: "Falha Interna",
                alertType: "warning"
            });
        }
    });
}

function cargaInicialGrupoEmpresa() {
    $.ajax({
        type: 'GET',
        crossDomain: true,
        async: true,
        cache: false,
        url: urlApi + 'gerenciamento/grupoempresa/RecuperaDadosInicial',
        beforeSend: function (req) {
            req.setRequestHeader('Authorization', sessionStorage.getItem("token"));
        },
        success: function (result) {
            console.log(result)
            var sourceMarcas = "";
            var sourceGrupo = [];

            //if (window.location.href.toLowerCase().indexOf("grupoempresa2") === -1) {
            $.each(result, function (index, value) {
                geraCardGrupoEmpresa(value);
                var retorno = {};
                retorno.idGrupoEmpresa = parseInt(value.idGrupoEmpresa);
                retorno.nome = value.nome;
                var statusGrp = value.status ? 'Ativo' : 'Inativo';
                //retorno.status = statusGrp;
                retorno.operacao = retornaOperacaoGrupoEmpresaGrid(statusGrp)
                sourceGrupo.push(retorno);
            });
            //}
            carregarGridGrupoEmpresa(sourceGrupo);

            var $menuTitulo = $(".navbar.navbar-default.navbar-fixed-top");
            var textoTitulo = 'Gerenciamento de Grupos de Empresas';
            $menuTitulo.find('.navbar-header .navbar-center').text(textoTitulo);
            $(".bg_load").fadeOut();
            $(".wrapper").fadeOut();
            $menuTitulo.removeClass('ocultarElemento');
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
function editarGrupoEmpresa(parametro) {
    $.ajax({
        type: 'POST',
        crossDomain: true,
        async: true,
        data: parametro,
        cache: false,
        url: urlApi + 'gerenciamento/grupoempresa/RecuperaDadosGrupoEditar',
        beforeSend: function (req) {
            req.setRequestHeader('Authorization', sessionStorage.getItem("token"));
        },
        success: function (result) {
            console.log(result)
            var sourceMarca = '';
            $.each(result, function (index, value) {
                var selecionarMarca = !value.dadosAdicionais.length ? '' : 'selected '
                sourceMarca += "<option " + selecionarMarca + "data-tokens='" + value.token + "' value='" + value.valor + "'>" + value.descricao + "</option>";
            });
            $('#drpMarc').html(sourceMarca);
            $('.selectpicker').selectpicker('refresh');

            $('#modalGrupoEmpresa').modal({
                backdrop: 'static',
                keyboard: false
            });
            $('.selectpicker').selectpicker('refresh');

            var $menuTitulo = $(".navbar.navbar-default.navbar-fixed-top");
            $(".bg_load").fadeOut();
            $(".wrapper").fadeOut();
            $menuTitulo.removeClass('ocultarElemento');
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
function salvarAtualizarGrupoEmpresas(parametro) {
    $.ajax({
        type: 'POST',
        crossDomain: true,
        async: true,
        data: parametro,
        cache: false,
        url: urlApi + 'gerenciamento/grupoempresa/InsereAtualizaGrupo',
        beforeSend: function (req) {
            req.setRequestHeader('Authorization', sessionStorage.getItem("token"));
        },
        success: function (result) {
            console.log(result)

            var $menuTitulo = $(".navbar.navbar-default.navbar-fixed-top");
            $menuTitulo.removeClass('ocultarElemento');
            var msg = $('#txtCodGrupo').val() === "0" ?
                'O grupo foi cadastrado e já está disponível para utilização.' :
                'O grupo foi atualizado e já está disponível para utilização.';
            var titMsg = $('#txtCodGrupo').val() === "0" ?
                'Grupo Cadastrado Com Sucesso!' :
                'Grupo ' + $('#txtCodGrupo').val() + ' - ' + $('#txtNomeGrupoEmpresa').val() + ' Atualizado Com Sucesso!';
            $(".bg_load").fadeOut("slow");
            $(".wrapper").fadeOut("slow", function () {
                var jc2 = $.confirm({
                    title: titMsg,
                    content: msg,
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
                        }, 2000);
                    },
                    onOpenBefore: function () {
                        this.buttons.okButton.hide();
                    },
                    onDestroy: function () {
                        $menuTitulo.addClass('ocultarElemento');
                        $(".bg_load").show();
                        $(".wrapper").show();
                        location.reload();
                    }
                });
            });
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
function excluirGrpEmpresas(parametro) {
    $.ajax({
        type: 'POST',
        crossDomain: true,
        async: true,
        cache: false,
        url: urlApi + 'gerenciamento/grupoempresa/ExcluirGrupoEmpresas',
        data: parametro,
        beforeSend: function (req) {
            req.setRequestHeader('Authorization', sessionStorage.getItem("token"));
        },
        success: function (result) {
            $(".navbar.navbar-default.navbar-fixed-top").removeClass('ocultarElemento');
            $(".bg_load").fadeOut("slow");
            $(".wrapper").fadeOut("slow", function () {
                var jc2 = $.confirm({
                    title: 'Grupo De Empresas Excluído Com Sucesso!',
                    content: 'O grupo foi removido e não está disponível para utilização.',
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
                        }, 2000);
                    },
                    onOpenBefore: function () {
                        this.buttons.okButton.hide();
                    },
                    onDestroy: function () {
                        $(".bg_load").show();
                        $(".wrapper").show();
                        $(".navbar.navbar-default.navbar-fixed-top").addClass('ocultarElemento');
                        location.reload();
                    }
                });
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

function selecionaPermissaoPorPerfil(parametro) {
    $.ajax({
        type: 'POST',
        crossDomain: true,
        cache: false,
        data: parametro,
        url: urlApi + 'RecuperarPermissaoPorPerfil',
        beforeSend: function (req) {
            req.setRequestHeader('Authorization', sessionStorage.getItem("token"));
        },
        success: function (result) {
            console.log(result);
            $('#cbPermissaoAtualizar').selectpicker('val', result);
            $('#cbPermissaoAtualizar').selectpicker('refresh');
        },
        error: function (erro) {
            modal({
                messageText: "Ocorreu um erro durante esta operação, tente novamente.<br/>Caso o erro persista informe o administrador do sistema o horário e data da ocorrencia",
                type: "alert",
                headerText: "Falha Interna",
                alertType: "warning"
            });
        }
    });
}
function carregaComboPermissao() {
    $.ajax({
        type: 'POST',
        crossDomain: true,
        cache: false,
        url: urlApi + 'RetornaPermissoesCadastradas',
        beforeSend: function (req) {
            req.setRequestHeader('Authorization', sessionStorage.getItem("token"));
        },

        success: function (result) {
            console.log(result)
            $.each(result, function (index, value) {
                $("#cbPermissaoConceder").append("<option value='" + value.id + "'>" + value.descricao + "</option>");
                $("#cbPermissaoAtualizar").append("<option value='" + value.id + "'>" + value.descricao + "</option>");
            });
            $('.selectpicker').selectpicker({
                size: 7
            });
            $('#cbPermissaoConceder').selectpicker('refresh');
            $('#cbPermissaoAtualizar').selectpicker('refresh');

        },
        error: function (erro) {
            modal({
                messageText: "Ocorreu um erro durante esta operação, tente novamente.<br/>Caso o erro persista informe o administrador do sistema o horário e data da ocorrencia",
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
                messageText: "Ocorreu um erro durante esta operação, tente novamente.<br/>Caso o erro persista informe o administrador do sistema o horário e data da ocorrencia",
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
            waitingDialog.hide();
            if (error.status === 500) {
                modal({
                    messageText: "Ocorreu um erro durante esta operação, tente novamente.<br/>Caso o erro persista informe o administrador do sistema o horário e data da ocorrencia",
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
                messageText: "Ocorreu um erro durante esta operação, tente novamente.<br/>Caso o erro persista informe o administrador do sistema o horário e data da ocorrencia",
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
                messageText: "Ocorreu um erro durante esta operação, tente novamente.<br/>Caso o erro persista informe o administrador do sistema o horário e data da ocorrencia",
                type: "alert",
                headerText: "Falha Interna",
                alertType: "warning"
            });
        }
    });
}
function alterarStatusUsuario(id, status, checkbox) {
    var objEnvio = { 'id': id, 'status': status },
        msg = status ? 'Desbloqueando Usuario' : 'Bloqueando Usuario',
        msgResposta = status ? 'Usuario desbloqueado com sucesso!' : 'Usuario bloqueado com sucesso!';


    waitingDialog.show(msg, { dialogSize: 'lg', progressType: 'warning' });
    $.ajax({
        type: 'POST',
        cache: false,
        crossDomain: true,
        url: urlApi + 'BloquearUsuario',
        statusCode: {
            200: function (retorno) {
                var titulo = 'Operação Concluída';
                waitingDialog.hide();
                $('#modalAlteraSenha').modal('hide');
                modal({
                    messageText: msgResposta,
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
                    messageText: "Ocorreu um erro durante esta operação, tente novamente.<br/>Caso o erro persista informe o administrador do sistema o horário e data da ocorrencia",
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

    waitingDialog.show(textoLoad, { dialogSize: 'lg', progressType: 'warning' });
    $.ajax({
        type: 'POST',
        cache: false,
        crossDomain: true,
        url: urlApi + 'AtualizarPermissaoUsuario',
        statusCode: {
            200: function (retorno) {
                var texto = 'Usuário atualizado com sucesso. As alterações terão efeito a partir do proximo login', titulo = 'Usuário Atualizado!';
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
                messageText: "Ocorreu um erro durante esta operação, tente novamente.<br/>Caso o erro persista informe o administrador do sistema o horário e data da ocorrencia",
                type: "alert",
                headerText: "Falha Interna",
                alertType: "warning"
            });
        }
    });
}
function criarPerfilNovo(parametro) {
    //var obj = { 'descricaoPerfil': descricao, 'permissoesConsedidas': permissoes }, textoLoad = 'Cadastrando Perfil!';
    //if (sessionStorage.getItem("Ingles") === "true") {
    //    textoLoad = 'Registering profile!';
    //}
    waitingDialog.show('Cadastrando Perfil!', { dialogSize: 'lg', progressType: 'warning' });
    $.ajax({
        type: 'POST',
        cache: false,
        crossDomain: true,
        url: urlApi + 'CadastraPerfil',
        statusCode: {
            200: function (retorno) {
                var texto = 'Novo perfil cadastrado com sucesso, e já pode ser atribuido aos usuários', titulo = 'Cadastro de Perfil';
                var sourcePerm = "<option value=''>Nenhum</option>", sourcePerf = '';

                $.each(retorno, function (index, value) {
                    sourcePerm += "<option data-tokens='" + value.name + "' value='" + value.id + "'>" + value.name + "</option>";
                });
                $('.selectpicker').selectpicker({
                    size: 7
                });
                $('#ucComboAdmins').html(sourcePerm);
                $('#cbPerfil').html(sourcePerm);
                $('#cbPerfilNovo').html(sourcePerm);
                $('#cbPerfilExistente').html(sourcePerm);
                $('#cbPermissaoConceder').selectpicker('deselectAll');
                $('#cbPermissoesPerfil').selectpicker('deselectAll');
                $('.selectpicker').selectpicker('refresh');
                $('#txtDescPerfil').val('');

                deleteCookie();
                waitingDialog.hide();
                modal({
                    messageText: texto,
                    type: "alert",
                    headerText: titulo,
                    alertType: "success"
                }).done(function (e) {
                    if (!sessionStorage.getItem("token")) {
                        localStorage.removeItem("erro");
                        window.location = "../conta/login.cshtml"
                    }
                    else {
                        location.reload();
                    }
                });
            }
        },
        data: parametro,
        async: true,
        xhrFields: {
            withCredentials: true
        },
        beforeSend: function (req) {
            if (sessionStorage.getItem("token")) {
                req.setRequestHeader('Authorization', sessionStorage.getItem("token"));
            }
        },
        error: function (error) {
            waitingDialog.hide();
            modal({
                messageText: "Ocorreu um erro durante esta operação, tente novamente.<br/>Caso o erro persista informe o administrador do sistema o horário e data da ocorrencia",
                type: "alert",
                headerText: "Falha Interna",
                alertType: "warning"
            });
        }
    });
}

function atualizarPerfilEnviar(parametro) {
    //var obj = { 'descricaoPerfil': descricao, 'permissoesConsedidas': permissoes }, textoLoad = 'Cadastrando Perfil!';
    //if (sessionStorage.getItem("Ingles") === "true") {
    //    textoLoad = 'Registering profile!';
    //}
    waitingDialog.show('Atualizando Perfil!', { dialogSize: 'lg', progressType: 'warning' });
    $.ajax({
        type: 'POST',
        cache: false,
        crossDomain: true,
        url: urlApi + 'AtualizarPerfil',
        statusCode: {
            200: function (retorno) {
                var texto = 'Novo perfil cadastrado com sucesso, e já pode ser atribuido aos usuários', titulo = 'Cadastro de Perfil';
                var sourcePerm = "<option value=''>Nenhum</option>", sourcePerf = '';

                $.each(retorno, function (index, value) {
                    sourcePerm += "<option data-tokens='" + value.name + "' value='" + value.id + "'>" + value.name + "</option>";
                });
                $('.selectpicker').selectpicker({
                    size: 7
                });
                $('#ucComboAdmins').html(sourcePerm);
                $('#cbPerfil').html(sourcePerm);
                $('#cbPerfilNovo').html(sourcePerm);
                $('#cbPerfilExistente').html(sourcePerm);
                $('#cbPermissaoConceder').selectpicker('deselectAll');
                $('#cbPermissoesPerfil').selectpicker('deselectAll');
                $('.selectpicker').selectpicker('refresh');
                $('#txtDescPerfil').val('');

                deleteCookie();
                waitingDialog.hide();
                modal({
                    messageText: texto,
                    type: "alert",
                    headerText: titulo,
                    alertType: "success"
                }).done(function (e) {
                    if (!sessionStorage.getItem("token")) {
                        localStorage.removeItem("erro");
                        window.location = "../conta/login.cshtml"
                    }
                    else {
                        location.reload();
                    }
                });
            }
        },
        data: parametro,
        async: true,
        xhrFields: {
            withCredentials: true
        },
        beforeSend: function (req) {
            if (sessionStorage.getItem("token")) {
                req.setRequestHeader('Authorization', sessionStorage.getItem("token"));
            }
        },
        error: function (error) {
            waitingDialog.hide();
            modal({
                messageText: "Ocorreu um erro durante esta operação, tente novamente.<br/>Caso o erro persista informe o administrador do sistema o horário e data da ocorrencia",
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
            console.log(result)
            var sourceSec = "", sourceCNPJ = "", sourceMarca = "", sourceAttr = "", sourceSeg = "";
            if (fluxo !== 'cadastro' && fluxo !== 'produto') {

                sourceSec = '<option selected value="">Nenhuma</option>';
                sourceCNPJ = '<option selected value="">Nenhum</option>';
                sourceMarca = '<option selected value="">Nenhuma</option>';
                //sourceAttr = '<option selected value="">Nenhuma</option>';
                var sourceEspecie = '<option selected value="">Nenhuma</option>';
                $("#drpEsp").html(sourceEspecie);
            }
            if (result.secoes) {
                $.each(result.secoes, function (index, value) {
                    sourceSec += "<option data-tokens='" + value.token + "' value='" + value.valor + "'>" + value.descricao + "</option>";
                });
            }

            $.each(result.fornecedores, function (index, value) {
                sourceCNPJ += "<option data-tokens='" + value.token + "' data-subtext='" + value.token.split(';')[3] + "' value='" + value.valor + "'>" + value.descricao + "</option>";
            });
            if (result.attrFornecedores) {
                $.each(result.attrFornecedores, function (index, value) {
                    sourceAttr += "<option data-tokens='" + value.token + "' value='" + value.valor + "'>" + value.descricao + "</option>";
                });

            }
            if (result.segmentos) {
                $.each(result.segmentos, function (index, value) {
                    sourceSeg += "<option data-tokens='" + value.token + "' value='" + value.valor + "'>" + value.descricao + "</option>";
                });

            }
            $.each(result.marcas, function (index, value) {
                var selecionarMarca = !result.produtoInativo ? '' : 'selected '
                var empVinc = value.dadosAdicionais.length ? "data-empresa-obrigatorio ='" + value.dadosAdicionais[0] + "' " : "";
                sourceMarca += "<option " + selecionarMarca + empVinc + "data-tokens='" + value.token + "' value='" + value.valor + "'>" + value.descricao + "</option>";
            });


            $("#drpMarc").html(sourceMarca);
            $("#drpSec").html(sourceSec);
            $("#drpCNPJ").html(sourceCNPJ);
            $("#drpSeg").html(sourceSeg);
            $("#cbAttrForn").html(sourceAttr);
            $(".selectpicker").selectpicker();

            carregaFormCompraManager();
            $("#txtDescPed").removeAttr('style');
            $("#txtDescResPed").removeAttr('style');
            $(".selectpicker").selectpicker('refresh');
            $(".bg_load").fadeOut();
            $(".wrapper").fadeOut();
            $(".navbar.navbar-default.navbar-fixed-top").removeClass('ocultarElemento');
            $("div.controls.ocultarElemento").removeClass('ocultarElemento');
            if (window.location.href.toLowerCase().indexOf("produto") > -1) {

                var $menuTitulo = $(".navbar.navbar-default.navbar-fixed-top");
                $menuTitulo.find('.navbar-header .navbar-center').text('Gerenciamento de Produto');
            }
            $("#divForn").removeClass('ocultarElemento');
            $("#divStatusProd").removeClass('ocultarElemento');
            $("#divMarca").removeClass('ocultarElemento');
            $("#divSeg").removeClass('ocultarElemento');
            //$("#divAttr").removeClass('ocultarElemento');
            //$("#divSeg").removeClass('ocultarElemento');
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
    sessionStorage.setItem('parametrosFiltro', JSON.stringify(parametro));
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
            controleTempo("Consulta produtos concluída: ")
            console.log('============================')
            console.log(result)
            $('.pagination-holder').pagination('destroy');
            sessionStorage.setItem('paginacao', JSON.stringify(result.paginasReferencia));
            if (result.paginasReferencia.length) {
                geraPaginacaoGrid(result.paginasReferencia.length)
            }

            $("#txtFiltroProdutoCompra").val('');

            tbProduto.search('').clear();
            tbProduto.data(tbProduto).rows.add(result.produtos);
            tbProduto.draw();
            $(".bg_load").fadeOut();
            $(".wrapper").fadeOut();
            $('.selectpicker').selectpicker('show');
            $(".navbar.navbar-default.navbar-fixed-top").removeClass('ocultarElemento');
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
            if ($("#drpTamanhoGrade option").length < 7) {
                configuraCombosOpcoes('#drpTamanhoGrade');
            }
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
function alteraPagina(parametro) {
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
            console.log(result)
            if (paginasMarcadas.length) {
                var atualizarProd = validaProdSelPag();
                if (atualizarProd) {
                    result.produtos = atualizaDadosCarga(result.produtos, atualizarProd)
                }

            }
            $("#txtFiltroProdutoCompra").val('');
            tbProduto.columns().visible(true);
            tbProduto.search('').clear();
            tbProduto.data(tbProduto).rows.add(result.produtos);
            tbProduto.draw();
            $(".bg_load").fadeOut();
            $(".wrapper").fadeOut();
            $('.selectpicker').selectpicker('show');
            $(".navbar.navbar-default.navbar-fixed-top").removeClass('ocultarElemento');
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
function buscaDadosProdFornecedor(parametro) {
    $.ajax({
        type: 'POST',
        crossDomain: true,
        async: true,
        cache: false,
        url: urlApi + 'gerenciamento/compra/AtualizaDadosCompraFornecedor',
        data: parametro,
        beforeSend: function (req) {
            req.setRequestHeader('Authorization', sessionStorage.getItem("token"));
        },
        success: function (result) {
            console.log(result)

            $("#drpCondPgtoPed option[value='" + result.ultimaCondicao + "']").attr('selected', 'selected')
            var $cbfrn = $('#cbAttr' + result.atributoFornecedor);
            if ($cbfrn && result.atributoValor) {
                $cbfrn.selectpicker('val', result.atributoValor.split(','));
            }
            if (result.ultimaForma) {
                $('#drpFrmPgtoPed').selectpicker('val', result.ultimaForma);
            }
            $(".selectpicker").selectpicker('refresh');
            if (result.observacao) {
                $('#txtAreaObsPed').val(result.observacao);
            }

            var refCarga = result.referencia ? result.referencia : !cadastroNovoSession ? 'Sem Referência' : '';
            $("#txtRefPed").val(refCarga);
            if (permissoesUsuarioLogado.indexOf('Editar Referência Produto') > -1 && !result.referencia)
                $("#txtRefPed").attr('disabled', false);
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
            $("#txtCustoBrutoPed").val(result.precoCusto.toFixed(2).replace('.', ','));
            //$("#txtPrVendaPed").val(result.precoVenda.toFixed(2).replace('.', ','));
            $("#txtDescontoPedPerc").val(result.desconto.toFixed(2).replace('.', ','));
            $("#txtIPIPercPed").val(result.ipi.toFixed(2).replace('.', ','));
            $("#txtIcmsPercPed").val(result.icms.toFixed(2).replace('.', ','));
            calculaAlteracaoCusto();
            $('.percent').maskMoney('mask');
            $('.money').maskMoney('mask');

            //$(".bg_load").fadeOut();
            //$(".wrapper").fadeOut();
            //$('.selectpicker').selectpicker('show');
            //$(".navbar.navbar-default.navbar-fixed-top").removeClass('ocultarElemento');
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
            console.log(result)
            $('.exibeBtn.statusF').removeClass('ocultarElemento');
            if (result.filtrosPrePedido.grupoEmpresaPrecos) {
                $.each(result.filtrosPrePedido.grupoEmpresaPrecos, function (index, value) {
                    console.log(index)
                    criaPainelPrecoVenda(value)
                });

            }
            grupoRelacionar = result.filtrosPrePedido.relacionamentoGrupos;
            var sourceSec = "", sourceSeg = "", sourceCNPJ = "", souceClass = "", sourceMarca = "", sourceEspecie = "",
                sourceForma = "", sourceCondicao = "", sourceCores = "", sourceTamanho = "", sourceCompradorProduto = '',
                sourceTamanhoGrupo = "", sourceReferencia = "", sourceMedida = "", sourceComprador = '<option selected value="">Nenhuma</option>';
            carregaAtributosPorOrdem(result.filtrosPrePedido.attrEleListaPed, result.filtrosPrePedido.attrListaPed, result.filtrosPrePedido.ordemPed, true);
            carregaAtributosPorOrdem(result.filtrosPrePedido.attrEleListaProd, result.filtrosPrePedido.attrListaProd, result.filtrosPrePedido.ordemProd, false)
            if (result.filtrosPrePedido.segmentos) {
                $.each(result.filtrosPrePedido.segmentos, function (index, value) {
                    sourceSeg += "<option selected data-tokens='" + value.token + "' value='" + value.valor + "'>" + value.descricao + "</option>";
                });

            }

            if (result.filtrosPrePedido.statusPedido) {
                $.each(result.filtrosPrePedido.statusPedido, function (index, value) {
                    if (value.dadosAdicionais.length > 0) observacaoStatus.push(value.valor);
                });
            }
            if (result.filtrosPrePedido.compradoresProduto) {
                $.each(result.filtrosPrePedido.compradoresProduto, function (index, value) {
                    var selecionado = /*value.dadosAdicionais.length > 0 ? */"selected";/* : ""*/

                    sourceCompradorProduto += "<option data-tokens='" + value.token + "' " + selecionado + " value='" + value.valor + "'>" + value.descricao + "</option>";
                });

            }
            $.each(result.filtrosPrePedido.secoes, function (index, value) {
                sourceSec += "<option selected data-tokens='" + value.token + "' value='" + value.valor + "'>" + value.descricao + "</option>";
            });
            $.each(result.filtrosPrePedido.fornecedores, function (index, value) {
                var isSelect = fornSelCadCpr && value.valor === fornSelCadCpr ? ' selected' : '';
                sourceCNPJ += "<option data-tokens='" + value.token + "' data-subtext='" + value.token.split(';')[3] + "' value='" + value.valor + "'" + isSelect + ">" + value.descricao + "</option>";
            });
            $.each(result.filtrosPrePedido.marcas, function (index, value) {
                var selecionarMarca = /*!result.produtoInativo ? '' :*/ 'selected ';
                var empVinc = value.dadosAdicionais.length ? "data-empresa-obrigatorio ='" + value.dadosAdicionais[0] + "' " : "";
                sourceMarca += "<option " + selecionarMarca + empVinc + "data-tokens='" + value.token + "' value='" + value.valor + "'>" + value.descricao + "</option>";
            });
            $.each(result.filtrosPrePedido.compradores, function (index, value) {
                sourceComprador += "<option data-tokens='" + value.token + "' value='" + value.valor + "'>" + value.descricao + "</option>";
            });
            $.each(result.filtrosPrePedido.uniMedida, function (index, value) {
                sourceMedida += "<option data-tokens='" + value.token + "' value='" + value.valor + "'>" + value.descricao + "</option>";
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
            $("#drpSeg").html(sourceSeg).attr('disabled', true);
            $("#drpCNPJ").html(sourceCNPJ);
            if (!fornSelCadCpr) $("#drpCNPJ").html(sourceCNPJ).selectpicker('val', '');

            $("#drpCoresGrade").html(sourceCores);
            $("#drpCompPed").html(sourceComprador);
            $("#drpCompProd").html(sourceCompradorProduto);
            validaPermissaoPedidoCadastro()
            $("#drpUnidadeMed").html(sourceMedida).selectpicker('val', '');
            $("#txDtCadProd").val(result.dtCadastroPedido).attr('disabled', true);
            $("#drpTamanhoGrade").html(sourceTamanho);
            if ($("#drpTamanhoGrade option").length < 7) {
                configuraCombosOpcoes('#drpTamanhoGrade');
            }
            if (result.unidadeSelecionada) {
                $("#drpUnidadeMed option[value='" + result.unidadeSelecionada + "']").attr('selected', 'selected');

            }
            $("#drpTamanhoCategoria").html(sourceTamanhoGrupo);
            $('#drpReferenciaGrade').html(sourceReferencia);
            $('#drpClassificacao').html(souceClass).selectpicker('val', '');
            $("#drpCondPgtoPed").html(sourceCondicao).selectpicker('val', '');
            $("#drpCondPgtoPed option[value='" + result.ultimaCondicao + "']").attr('selected', 'selected');
            if (result.ultimaClassificacao)
                $("#drpClassificacao option[value='" + result.ultimaClassificacao + "']").attr('selected', 'selected');
            $("#drpFrmPgtoPed").html(sourceForma).selectpicker('val', result.ultimaForma);
            if (result.filtrosPrePedido.tamanhoGrupo.length === 1) {
                $("#drpTamanhoCategoria option[value='" + result.filtrosPrePedido.tamanhoGrupo[0].valor + "']").attr('selected', 'selected')
            }
            configuraRangeCalendarioFornecedor('#txtDtEntregaPed', result.filtrosPrePedido.dadosConfigPadrao.dataEntregaInicio, result.filtrosPrePedido.dadosConfigPadrao.dataEntregaFinal)
            atualizaDtEntregaLimite();
            configuraRangeCalendarioFornecedor('#txtDtEntregaFinalPed', result.filtrosPrePedido.dadosConfigPadrao.dataToleranciaAtrasoInicio, result.filtrosPrePedido.dadosConfigPadrao.dataToleranciaAtrasoFinal)
            if (result.filtrosPrePedido.dadosConfigPadrao.addCores) {
                if ($('#frmGradeCor2').hasClass("ocultarElemento"))
                    $('#frmGradeCor2').removeClass("ocultarElemento");
                if ($('#frmGradeCor3').hasClass("ocultarElemento"))
                    $('#frmGradeCor3').removeClass("ocultarElemento");
            }
            $(".attrNum").maskMoney();
            $(".attrMon").maskMoney();
            $(".attrPerc").maskMoney();
            $(".prVenda").maskMoney();
            geraComponenteCalendarioAttr();
            ordenaOpcao();
            $("#drpCompProd option").attr('disabled', true);
            $(".selectpicker").selectpicker();

            $("#drpCoresGrade").selectpicker('val', result.coresGrade);
            $("#drpTamanhoGrade").selectpicker('val', result.tamanhosGrade);
            $('#drpReferenciaGrade').selectpicker('val', result.referenciasGrade);
            $("#txtIDProd").val(result.idProduto).attr('disabled', true);
            $("#txtProdutoPed").val(result.codProduto);
            if (result.produtoInativo) {
                $("#txtStatusProd").val('Inativo');
                $("#drpMarc option[value='" + result.filtrosPrePedido.marcaSelecionada + "']").attr('selected', 'selected');
                permissoesUsuarioLogado.indexOf('Editar Marca') === -1 ?
                    $("#drpMarc").attr('disabled', true) :
                    $("#drpMarc").attr('disabled', false);
                $("#txtCodOriPed").val(result.codOriginal);
                permissoesUsuarioLogado.indexOf('Editar Código Original') === -1 ?
                    $("#txtCodOriPed").attr('disabled', true) :
                    $("#txtCodOriPed").attr('disabled', false);
                $("#txtRefPed").val(result.referencia);
                permissoesUsuarioLogado.indexOf('Editar Referência Produto') === -1 ?
                    $("#txtRefPed").attr('disabled', true) :
                    $("#txtRefPed").attr('disabled', false);
                $("#txtDescPed").val(result.descricao)
                permissoesUsuarioLogado.indexOf('Editar Descrição') === -1 ?
                    $("#txtDescPed").attr('disabled', true) :
                    $("#txtDescPed").attr('disabled', false);
                $("#txtDescResPed").val(result.descricaoReduzida)
                permissoesUsuarioLogado.indexOf('Editar Descrição Reduzida') === -1 ?
                    $("#txtDescResPed").attr('disabled', true) :
                    $("#txtDescResPed").attr('disabled', false);
            } else {
                $("#txtStatusProd").val('Ativo');
                $("#txtCodOriPed").val(result.codOriginal).attr('disabled', true);
                $("#txtRefPed").val(result.referencia).attr('disabled', true);
                $("#txtDescPed").val(result.descricao).attr('disabled', true);
                $("#txtDescResPed").val(result.descricaoReduzida).attr('disabled', true);
            }
            nomesCoresCSS = repartirArray(result.filtrosPrePedido.dadosPaleta.valoresCSS);
            nomesCoresPtCSS = repartirArray(result.filtrosPrePedido.dadosPaleta.descricoes);
            $("#txtCustoBrutoPed").val(result.precoCusto.toFixed(2).replace('.', ','));
            $("#txtDtCadProd").val(result.dtCadastroProduto);
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
            if (fornSelCadCpr) {
                var objEnvioForn = {};
                objEnvioForn.idFornecedor = $('#drpCNPJ').val();
                objEnvioForn.codigo = $('#txtIDProd').val();
                buscaDadosProdFornecedor(objEnvioForn);
            }
            $('.percent').maskMoney('mask');
            $('.money').maskMoney('mask');
            criaPaletas();
            if (result.ultimaCondicao && result.ultimaForma.length && validaAttrCadastrado($("#pnlAttrPed"))) {
                $('#wizard-cad-ped li a[href="#tabFoto"]').click();
            }
            if (result.filtrosPrePedido.dadosConfigPadrao.produtoBloqueado) {
                desabilitaConfiguracaoProduto()
            }
            var $menuTitulo = $(".navbar.navbar-default.navbar-fixed-top");
            $menuTitulo.find('.navbar-header .navbar-center').text('Cadastro de Pedido');
            $(".selectpicker").selectpicker('refresh');
            $('#drpMarc').trigger('change');
            carregaPedidoGrade();
            $(".bg_load").fadeOut();
            $(".wrapper").fadeOut();
            $(".navbar.navbar-default.navbar-fixed-top").removeClass('ocultarElemento');
            $("div.controls.ocultarElemento").removeClass('ocultarElemento');
            $("#divForn").removeClass('ocultarElemento');
            $("#divMarca").removeClass('ocultarElemento');
            $("#divSec").removeClass('ocultarElemento');
            $(".frmPrecosVenda.collapsible").collapsible({
                animation: true,
                speed: "medium"
            });
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
            console.log(result)
            if (result.grupoEmpresaPrecos) {
                $.each(result.grupoEmpresaPrecos, function (index, value) {
                    console.log(index)
                    criaPainelPrecoVenda(value)
                });

            }
            grupoRelacionar = result.relacionamentoGrupos;
            var sourceForma = "", sourceCondicao = "", souceClass = '', sourceSeg = '<option selected value="">Nenhuma</option>', sourceSec = '<option selected value="">Nenhuma</option>', sourceTamanho = "", sourceCNPJ = '<option selected value="">Nenhum</option>',
                sourceMarca = '<option selected value="">Nenhuma</option>', sourceCores = '', sourceEspecie = '<option selected value="">Nenhuma</option>', sourceMedida = "", sourceCompradorProduto = '', sourceComprador = '<option selected value="">Nenhuma</option>';
            carregaAtributosPorOrdem(result.attrEleListaPed, result.attrListaPed, result.ordemPed, true);
            carregaAtributosPorOrdem(result.attrEleListaProd, result.attrListaProd, result.ordemProd, false)
            if (result.compradoresProduto) {
                $.each(result.compradoresProduto, function (index, value) {
                    sourceCompradorProduto += "<option data-tokens='" + value.token + "' value='" + value.valor + "'>" + value.descricao + "</option>";
                });

            }

            if (result.statusPedido) {
                $.each(result.statusPedido, function (index, value) {
                    if (value.dadosAdicionais.length > 0) observacaoStatus.push(value.valor);
                });
            }
            $('.exibeBtn.statusF').removeClass('ocultarElemento')
            $.each(result.compradores, function (index, value) {
                sourceComprador += "<option data-tokens='" + value.token + "' value='" + value.valor + "'>" + value.descricao + "</option>";
            });
            $.each(result.uniMedida, function (index, value) {
                sourceMedida += "<option data-tokens='" + value.token + "' value='" + value.valor + "'>" + value.descricao + "</option>";
            });
            $.each(result.segmentos, function (index, value) {
                sourceSeg += "<option data-tokens='" + value.token + "' value='" + value.valor + "'>" + value.descricao + "</option>";
            });
            $.each(result.fornecedores, function (index, value) {
                sourceCNPJ += "<option data-tokens='" + value.token + "' data-subtext='" + value.token.split(';')[3] + "' value='" + value.valor + "'>" + value.descricao + "</option>";
            });
            $.each(result.marcas, function (index, value) {
                var selecionarMarca = !result.produtoInativo ? '' : 'selected '
                var empVinc = value.dadosAdicionais.length ? "data-empresa-obrigatorio ='" + value.dadosAdicionais[0] + "' " : "";
                sourceMarca += "<option " + selecionarMarca + empVinc + "data-tokens='" + value.token + "' value='" + value.valor + "'>" + value.descricao + "</option>";
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
            $("#drpSec").html(sourceSec).attr('disabled', true);
            $("#drpSeg").html(sourceSeg).attr('disabled', false);
            $("#drpCNPJ").html(sourceCNPJ).attr('disabled', false);
            $("#drpCondPgtoPed").html(sourceCondicao);
            $("#drpFrmPgtoPed").html(sourceForma);
            $("#drpTamanhoCategoria").html(sourceTamanho).selectpicker('val', '');
            $('#drpClassificacao').html(souceClass).selectpicker('val', '');
            $("#drpCompPed").html(sourceComprador);
            $("#drpCompProd").html(sourceCompradorProduto);
            $("#txtStatusProd").val('Inativo');
            //$("#drpCompProd option:first").remove();
            validaPermissaoPedidoCadastro()
            $("#drpUnidadeMed").html(sourceMedida).selectpicker('val', '');
            $("#drpCoresGrade").html(sourceCores);
            $("#txtDtCadProd").val(dataAtualFormatada())
            configuraRangeCalendarioFornecedor('#txtDtEntregaPed', result.dadosConfigPadrao.dataEntregaInicio, result.dadosConfigPadrao.dataEntregaFinal)
            atualizaDtEntregaLimite();
            configuraRangeCalendarioFornecedor('#txtDtEntregaFinalPed', result.dadosConfigPadrao.dataToleranciaAtrasoInicio, result.dadosConfigPadrao.dataToleranciaAtrasoFinal)
            $(".prVenda").maskMoney();
            $(".attrBool").bootstrapSwitch();
            $(".attrNum").maskMoney();
            $(".attrMon").maskMoney();
            $(".attrPerc").maskMoney();
            $(".attrNum").maskMoney('mask');
            $(".attrMon").maskMoney('mask');
            $(".attrPerc").maskMoney('mask');
            $('.money').maskMoney('mask');
            geraComponenteCalendarioAttr()

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
            $menuTitulo.find('.navbar-header .navbar-center').text('Cadastro de Pedido e Produto');
            $(".selectpicker").selectpicker('refresh');
            $('#drpMarc').trigger('change');
            $(".frmPrecosVenda.collapsible").collapsible({
                animation: true,
                speed: "medium"
            });
            $(".bg_load").fadeOut();
            $(".wrapper").fadeOut();
            $(".navbar.navbar-default.navbar-fixed-top").removeClass('ocultarElemento');
            $("div.controls.ocultarElemento").removeClass('ocultarElemento');
            $("#divForn").removeClass('ocultarElemento');
            $("#divMarca").removeClass('ocultarElemento');
            $("#divSec").removeClass('ocultarElemento');
            $("#divCompProd").removeClass('ocultarElemento');
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
function cadastrarProduto() {
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
            console.log(result)
            if (result.grupoEmpresaPrecos) {
                $.each(result.grupoEmpresaPrecos, function (index, value) {
                    criaPainelPrecoVenda(value)
                });

            }
            var sourceForma = "", sourceCondicao = "", souceClass = '', sourceSeg = '<option selected value="">Nenhuma</option>', sourceSec = '<option selected value="">Nenhuma</option>', sourceTamanho = "", sourceCNPJ = '<option selected value="">Nenhum</option>',
                sourceMarca = '<option selected value="">Nenhuma</option>', sourceCores = '', sourceEspecie = '<option selected value="">Nenhuma</option>', sourceMedida = "", sourceCompradorProduto = '', sourceComprador = '<option selected value="">Nenhuma</option>';
            carregaAtributosPorOrdem(result.attrEleListaProd, result.attrListaProd, result.ordemProd, false)
            if (result.compradoresProduto) {
                $.each(result.compradoresProduto, function (index, value) {
                    sourceCompradorProduto += "<option data-tokens='" + value.token + "' value='" + value.valor + "'>" + value.descricao + "</option>";
                });

            }
            $.each(result.compradores, function (index, value) {
                sourceComprador += "<option data-tokens='" + value.token + "' value='" + value.valor + "'>" + value.descricao + "</option>";
            });
            $.each(result.uniMedida, function (index, value) {
                sourceMedida += "<option data-tokens='" + value.token + "' value='" + value.valor + "'>" + value.descricao + "</option>";
            });
            $.each(result.segmentos, function (index, value) {
                sourceSeg += "<option data-tokens='" + value.token + "' value='" + value.valor + "'>" + value.descricao + "</option>";
            });
            $.each(result.marcas, function (index, value) {
                var selecionarMarca = !result.produtoInativo ? '' : 'selected '
                var empVinc = value.dadosAdicionais.length ? "data-empresa-obrigatorio ='" + value.dadosAdicionais[0] + "' " : "";
                sourceMarca += "<option " + selecionarMarca + empVinc + "data-tokens='" + value.token + "' value='" + value.valor + "'>" + value.descricao + "</option>";
            });
            $.each(result.classificacao, function (index, value) {
                souceClass += criarClassificacao(value.valor, value.token, value.descricao);
            });
            $.each(result.cores, function (index, value) {
                sourceCores += criarCor(value.valor, value.descricao, value.token, value.dadosAdicionais);
            });
            $.each(result.tamanhos.tamanhosGrupo, function (index, value) {
                sourceTamanho += criarTamanho(value.valor, value.token, value.descricao);
            });
            $("#drpEsp").html(sourceEspecie).attr('disabled', true);
            $("#drpMarc").html(sourceMarca).attr('disabled', false);
            $("#drpSec").html(sourceSec).attr('disabled', true);
            $("#drpSeg").html(sourceSeg).attr('disabled', false);
            $("#drpTamanhoCategoria").html(sourceTamanho).selectpicker('val', '');
            $('#drpClassificacao').html(souceClass).selectpicker('val', '');
            $("#drpCompPed").html(sourceComprador);
            $("#txtStatusProd").val('Inativo');
            criaInputImagem([], [], [])
            $("#drpCompProd").html(sourceCompradorProduto);
            //$("#drpCompProd option:first").remove();
            $("#drpUnidadeMed").html(sourceMedida).selectpicker('val', '');
            $("#drpCoresGrade").html(sourceCores);
            $(".prVenda").maskMoney();
            $(".attrBool").bootstrapSwitch();
            $(".attrNum").maskMoney();
            $(".attrMon").maskMoney();
            $(".attrPerc").maskMoney();
            $(".attrNum").maskMoney('mask');
            $(".attrMon").maskMoney('mask');
            $(".attrPerc").maskMoney('mask');
            $('.money').maskMoney('mask');
            $(".attrBool").bootstrapSwitch();
            $("#txtDtCadProd").val(dataAtualFormatada());
            geraComponenteCalendarioAttr()
            validaPermissaoPedidoCadastro();
            $(".selectpicker").selectpicker();
            nomesCoresCSS = repartirArray(result.dadosPaleta.valoresCSS);
            nomesCoresPtCSS = repartirArray(result.dadosPaleta.descricoes);
            criaPaletas();
            if (permissoesUsuarioLogado.indexOf('Cadastrar Produto Novo') > -1) {
                $("#divPesquisaProduto").removeClass('ocultarElemento');
            }
            var $menuTitulo = $(".navbar.navbar-default.navbar-fixed-top");
            $menuTitulo.find('.navbar-header .navbar-center').text('Cadastro de Produto');
            $(".selectpicker").selectpicker('refresh');
            $('#drpMarc').trigger('change');
            $(".dadosTab").addClass('ocultarElemento');
            $(".packTab").addClass('ocultarElemento');
            $("#frmCusto").remove();
            $("#tabFoto.tab-pane").find('button.prev-step').remove();
            $("#tabGrade.tab-pane").find('button.next-step').remove();
            $("#tabGrade.tab-pane").find('button.cad-prod').removeClass('ocultarElemento');
            $(".produtoTab a").tab('show');
            $(".bg_load").fadeOut();
            $(".wrapper").fadeOut();
            $(".navbar.navbar-default.navbar-fixed-top").removeClass('ocultarElemento');
            $("div.controls.ocultarElemento").removeClass('ocultarElemento');
            $("#divForn").removeClass('ocultarElemento');
            $("#divMarca").removeClass('ocultarElemento');
            $("#divSec").removeClass('ocultarElemento');
            $(".frmPrecosVenda.collapsible").collapsible({
                animation: true,
                speed: "medium"
            });
            $("#divCompProd").removeClass('ocultarElemento');
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
function editarProduto(parametro) {
    $.ajax({
        type: 'POST',
        crossDomain: true,
        async: true,
        cache: false,
        url: urlApi + 'cadastro/produto/RetornaProdutoEditar',
        data: parametro,
        beforeSend: function (req) {
            req.setRequestHeader('Authorization', sessionStorage.getItem("token"));
        },
        success: function (result) {
            console.log(result)
            var objEnvio = {};
            objEnvio.codigo = result.idProduto;
            prodBloqueado = result.filtrosPrePedido.dadosConfigPadrao.produtoBloqueado;
            carregaImagemProduto(objEnvio);
            if (result.filtrosPrePedido.grupoEmpresaPrecos) {
                $.each(result.filtrosPrePedido.grupoEmpresaPrecos, function (index, value) {
                    criaPainelPrecoVenda(value)
                });
            }
            var sourceSec = "", sourceSeg = "", sourceCNPJ = "", souceClass = "", sourceMarca = "", sourceEspecie = "",
                sourceForma = "", sourceCondicao = "", sourceCores = "", sourceTamanho = "",
                sourceTamanhoGrupo = "", sourceReferencia = "", sourceMedida = "", sourceComprador = '', sourceCompradorProduto = '';
            carregaAtributosPorOrdem(result.filtrosPrePedido.attrEleListaProd, result.filtrosPrePedido.attrListaProd, result.filtrosPrePedido.ordemProd, false)
            if (result.filtrosPrePedido.segmentos) {
                $.each(result.filtrosPrePedido.segmentos, function (index, value) {
                    sourceSeg += "<option selected data-tokens='" + value.token + "' value='" + value.valor + "'>" + value.descricao + "</option>";
                });

            }

            if (result.filtrosPrePedido.compradoresProduto) {
                $.each(result.filtrosPrePedido.compradoresProduto, function (index, value) {
                    var selecionado = value.dadosAdicionais.length > 0 ? "selected" : ""
                    sourceCompradorProduto += "<option data-tokens='" + value.token + "' " + selecionado + " value='" + value.valor + "'>" + value.descricao + "</option>";
                });

            }

            $.each(result.filtrosPrePedido.secoes, function (index, value) {
                sourceSec += "<option selected data-tokens='" + value.token + "' value='" + value.valor + "'>" + value.descricao + "</option>";
            });
            $.each(result.filtrosPrePedido.marcas, function (index, value) {
                var selecionarMarca = result.filtrosPrePedido.marcaSelecionada != value.valor ? '' : 'selected ';
                var empVinc = value.dadosAdicionais.length ? "data-empresa-obrigatorio ='" + value.dadosAdicionais[0] + "' " : "";
                sourceMarca += "<option " + selecionarMarca + empVinc + "data-tokens='" + value.token + "' value='" + value.valor + "'>" + value.descricao + "</option>";
            });
            $.each(result.filtrosPrePedido.compradores, function (index, value) {
                sourceComprador += "<option data-tokens='" + value.token + "' value='" + value.valor + "'>" + value.descricao + "</option>";
            });
            $.each(result.filtrosPrePedido.uniMedida, function (index, value) {
                sourceMedida += "<option data-tokens='" + value.token + "' value='" + value.valor + "'>" + value.descricao + "</option>";
            });
            $.each(result.filtrosPrePedido.especies, function (index, value) {
                sourceEspecie += "<option selected data-tokens='" + value.token + "' value='" + value.valor + "'>" + value.descricao + "</option>";
            });
            $.each(result.filtrosPrePedido.classificacao, function (index, value) {
                souceClass += criarClassificacao(value.valor, value.token, value.descricao);
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
            $("#drpMarc").html(sourceMarca);
            $("#drpSec").html(sourceSec).attr('disabled', true);
            $("#drpSeg").html(sourceSeg).attr('disabled', true);
            $("#txtDtCadProd").val(result.dtCadastroProduto);
            $("#drpCoresGrade").html(sourceCores);
            $("#drpCompPed").html(sourceComprador);
            $("#drpCompProd").html(sourceCompradorProduto);

            if (result.produtoInativo) {
                $("#txtStatusProd").val('Inativo');
                $("#drpMarc option[value='" + result.filtrosPrePedido.marcaSelecionada + "']").attr('selected', 'selected');
                permissoesUsuarioLogado.indexOf('Editar Marca') === -1 ?
                    $("#drpMarc").attr('disabled', true) :
                    $("#drpMarc").attr('disabled', false);
                $("#txtCodOriPed").val(result.codOriginal);
                permissoesUsuarioLogado.indexOf('Editar Código Original') === -1 ?
                    $("#txtCodOriPed").attr('disabled', true) :
                    $("#txtCodOriPed").attr('disabled', false);
                $("#txtRefPed").val(result.referencia);
                permissoesUsuarioLogado.indexOf('Editar Referência Produto') === -1 ?
                    $("#txtRefPed").attr('disabled', true) :
                    $("#txtRefPed").attr('disabled', false);
                $("#txtDescPed").val(result.descricao)
                permissoesUsuarioLogado.indexOf('Editar Descrição') === -1 ?
                    $("#txtDescPed").attr('disabled', true) :
                    $("#txtDescPed").attr('disabled', false);
                $("#txtDescResPed").val(result.descricaoReduzida)
                permissoesUsuarioLogado.indexOf('Editar Descrição Reduzida') === -1 ?
                    $("#txtDescResPed").attr('disabled', true) :
                    $("#txtDescResPed").attr('disabled', false);
            } else {
                $("#txtStatusProd").val('Ativo');
                $("#txtCodOriPed").val(result.codOriginal).attr('disabled', true);
                $("#txtRefPed").val(result.referencia).attr('disabled', true);
                $("#txtDescPed").val(result.descricao).attr('disabled', true);
                $("#txtDescResPed").val(result.descricaoReduzida).attr('disabled', true);
                $("#drpMarc").attr('disabled', true);
            }
            $("#drpUnidadeMed").html(sourceMedida).selectpicker('val', '');
            $("#drpTamanhoGrade").html(sourceTamanho);
            if ($("#drpTamanhoGrade option").length < 7) {
                configuraCombosOpcoes('#drpTamanhoGrade');
            }

            $("#drpTamanhoCategoria").html(sourceTamanhoGrupo);
            $('#drpReferenciaGrade').html(sourceReferencia);
            $('#drpClassificacao').html(souceClass).selectpicker('val', '');
            if (result.ultimaClassificacao)
                $("#drpClassificacao option[value='" + result.ultimaClassificacao + "']").attr('selected', 'selected');
            $("#drpFrmPgtoPed").html(sourceForma).selectpicker('val', result.ultimaForma);
            if (result.filtrosPrePedido.tamanhoGrupo.length === 1) {
                $("#drpTamanhoCategoria option[value='" + result.filtrosPrePedido.tamanhoGrupo[0].valor + "']").attr('selected', 'selected')
            }
            if (result.unidadeSelecionada) {
                $("#drpUnidadeMed option[value='" + result.unidadeSelecionada + "']").attr('selected', 'selected')
            }
            $(".prVenda").maskMoney();
            $(".attrNum").maskMoney();
            $(".attrMon").maskMoney();
            $(".attrPerc").maskMoney();
            geraComponenteCalendarioAttr();
            ordenaOpcao();
            validaPermissaoPedidoCadastro();
            $(".selectpicker").selectpicker();
            $("#drpCoresGrade").selectpicker('val', result.coresGrade);
            $("#drpTamanhoGrade").selectpicker('val', result.tamanhosGrade);
            $('#drpReferenciaGrade').selectpicker('val', result.referenciasGrade);
            if (permissoesUsuarioLogado.indexOf('Editar Grade') === -1) {
                $("#drpCoresGrade").attr('disabled', true);;
                $("#drpTamanhoGrade").attr('disabled', true);;
                $('#drpReferenciaGrade').attr('disabled', true);;
            }
            $("#txtIDProd").val(result.idProduto).attr('disabled', true);
            $("#txtProdutoPed").val(result.codProduto);
            nomesCoresCSS = repartirArray(result.filtrosPrePedido.dadosPaleta.valoresCSS);
            nomesCoresPtCSS = repartirArray(result.filtrosPrePedido.dadosPaleta.descricoes);

            $("#txtPrVendaPed").val(result.precoVenda.toFixed(2).replace('.', ','));
            $('.percent').maskMoney('mask');
            $('.money').maskMoney('mask');
            criaPaletas();
            var $menuTitulo = $(".navbar.navbar-default.navbar-fixed-top");
            $menuTitulo.find('.navbar-header .navbar-center').text('Edição de Produto');
            $(".selectpicker").selectpicker('refresh');
            $('#drpMarc').trigger('change');
            $(".dadosTab").addClass('ocultarElemento');
            if (permissoesUsuarioLogado.indexOf('Excluir Referências da Grade de Produto') > -1 && !result.filtrosPrePedido.dadosConfigPadrao.produtoBloqueado) {
                $("#frmGradeReferencia3").removeClass('ocultarElemento');
            }

            if (result.filtrosPrePedido.dadosConfigPadrao.produtoBloqueado) desabilitaConfiguracaoProduto();

            $("#divCompProd").removeClass('ocultarElemento');
            $(".packTab").addClass('ocultarElemento');
            $(".cad-prod").text('Atualizar')
            $("#frmCusto").remove();
            $("#tabFoto.tab-pane").find('button.prev-step').remove();
            $("#tabGrade.tab-pane").find('button.next-step').remove();
            $("#tabGrade.tab-pane").find('button.cad-prod').removeClass('ocultarElemento');
            $(".produtoTab a").tab('show');
            carregaPedidoGrade();
            $(".frmPrecosVenda.collapsible").collapsible({
                animation: true,
                speed: "medium"
            });
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

            $('.selectpicker').selectpicker('show');
            $(".navbar.navbar-default.navbar-fixed-top").removeClass('ocultarElemento');
            $(".bg_load").fadeOut();
            $(".wrapper").fadeOut();
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
            if ($("#drpTamanhoGrade option").length < 7) {
                configuraCombosOpcoes('#drpTamanhoGrade');
            }
            if (!$("#drpTamanhoGrade").hasClass('selectpicker')) {
                $("#drpTamanhoGrade").addClass('selectpicker')
            }
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

            if ((sessionStorage.getItem("pedidoStatus") && sessionStorage.getItem("pedidoStatus") !== 'A') || prodBloqueado) {
                desabiliaFotos()
            }
        },
    });
}
function carregarComboUsuarioNextt() {
    $.ajax({
        type: 'POST',
        crossDomain: true,
        cache: false,
        url: urlApi + 'ListarUsuariosNextt',
        beforeSend: function (req) {
            req.setRequestHeader('Authorization', sessionStorage.getItem("token"));
        },

        success: function (result) {
            console.log(result)
            $.each(result, function (index, value) {
                $("#cbUsuarioNextt").append("<option value='" + value.id + "'>" + value.nome + "</option>");
                //$("#cbPermissaoAtualizar").append("<option value='" + value.id + "'>" + value.descricao + "</option>");
            });
            $('.selectpicker').selectpicker({
                size: 7
            });
            $('#cbUsuarioNextt').selectpicker('refresh');
            //$('#cbPermissaoAtualizar').selectpicker('refresh');

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
            if (parametro.parametros) {
                parametro.parametros.codigo = result;
                atualizarStatusGravarPedido(parametro.parametros);
            }
            var files = $('#imgUpload').fileinput('getFileStack');
            if (files.length) {
                sessionStorage.setItem("idProdutoImagens", result);
                $('#imgUpload').fileinput('upload');
            }
            var statusSalvar = sessionStorage.getItem("salvarStatus");
            sessionStorage.removeItem("salvarStatus");
            sessionStorage.removeItem("pedidoId");
            sessionStorage.removeItem("pedidoStatus")
            var msg = compraId ?
                statusSalvar === 'A' ?
                    'O pedido foi atualizado, mas segue aberto para edição' :
                    'O pedido foi enviado para aprovação.' :
                statusSalvar === 'A' ?
                    'O pedido foi cadastrado, mas segue aberto para edição' :
                    'O pedido foi enviado para aprovação.';
            var titMsg = compraId ? 'Pedido Atualizado Com Sucesso!' : 'Pedido ' + result + ' Salvo Com Sucesso!';
            $(".bg_load").fadeOut("slow");
            $(".wrapper").fadeOut("slow", function () {
                var jc2 = $.confirm({
                    title: titMsg,
                    content: msg,//'O pedido foi enviado para aprovação.',
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
                        }, 2000);
                    },
                    onOpenBefore: function () {
                        this.buttons.okButton.hide();
                    },
                    onDestroy: function () {
                        compraId = result;
                        salvarDadosCompra(true)
                    }
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
function salvarProdutoAtualizado(parametro) {
    $(".bg_load").show();
    $(".wrapper").show();
    $('.selectpicker').selectpicker('hide');
    $("#divEsp").addClass('ocultarElemento');
    $("#frmGradeTam1").addClass('ocultarElemento');
    $(".navbar.navbar-default.navbar-fixed-top").addClass('ocultarElemento');

    $.ajax({
        type: 'POST',
        crossDomain: true,
        async: true,
        cache: false,
        url: urlApi + 'cadastro/produto/SalvarProduto',
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
            $(".bg_load").fadeOut("slow");
            $(".wrapper").fadeOut("slow", function () {
                var jc2 = $.confirm({
                    title: 'Produto Salvo',
                    content: 'Os dados foram salvos com sucesso',//'O pedido foi enviado para aprovação.',
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
                        }, 2000);
                    },
                    onOpenBefore: function () {
                        this.buttons.okButton.hide();
                    },
                    onDestroy: function () {
                        //compraId = result;
                        window.location = "../gerenciamento/produto.cshtml";
                    }
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
            console.log(result)
            var sourceGrupo = [], sourceFiliais = '';
            $.each(result.grupos, function (index, value) {
                var retorno = {};
                retorno.id = parseInt(value.valor);
                retorno.descricao = value.descricao;
                retorno.participacao = parseFloat(value.dadosAdicionais[0].replace(',', '.'));
                retorno.status = value.dadosAdicionais[1];
                retorno.operacao = retornaOperacaoGrupoGrid(value.dadosAdicionais[1])
                sourceGrupo.push(retorno);
            });
            var lista = geraListaFilial(result.filiais);
            $.each(result.filiais, function (index, value) {
                sourceFiliais += "<option data-tokens='" + value.token + "' value='" + value.valor + "'>" + value.descricao + "</option>";
            });
            console.log(sourceGrupo)
            carregarCadFilial(sourceGrupo)
            $("#cbGrupos").html(sourceGrupo);
            localStorage.setItem("filiaisOption", sourceFiliais);
            localStorage.setItem("filiaisLista", lista);

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
            var sourceFiliais = []
            $.each(result.filiais, function (index, value) {
                sourceFiliais.push(value.valor);
            });
            var idEditar = result.grupos[0].valor;
            var desc = result.grupos[0].descricao;
            var part = parseFloat(result.grupos[0].dadosAdicionais[0].replace(',', '.'));
            var tit = result.grupos[0].dadosAdicionais[1] === "Ativo" ? 'Atualizar Grupo' : 'Reativar Grupo'
            localStorage.setItem("filiaisGrupo", sourceFiliais);
            localStorage.setItem("idGrpEditar", idEditar);


            manipularGrupo(tit, desc, part);
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
        url: urlApi + 'cadastro/grupo/GerenciarGrupo',
        data: parametro,
        beforeSend: function (req) {
            req.setRequestHeader('Authorization', sessionStorage.getItem("token"));
        },
        success: function (result) {
            atualizaLinhaGrupo(result);
            $(".navbar.navbar-default.navbar-fixed-top").removeClass('ocultarElemento');
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
function excluirGrp(parametro) {
    $.ajax({
        type: 'POST',
        crossDomain: true,
        async: true,
        cache: false,
        url: urlApi + 'cadastro/grupo/ExcluirGrupo',
        data: parametro,
        beforeSend: function (req) {
            req.setRequestHeader('Authorization', sessionStorage.getItem("token"));
        },
        success: function (result) {
            var excId = parseInt(sessionStorage.getItem('idGrpWxc'));
            sessionStorage.removeItem('idGrpWxc')
            //excluirLinhaGrupo(excId);
            $(".navbar.navbar-default.navbar-fixed-top").removeClass('ocultarElemento');
            $(".bg_load").fadeOut("slow");
            $(".wrapper").fadeOut("slow", function () {
                excluirGrupo();
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
        url: urlApi + 'cadastro/grupo/GerenciarGrupo',
        data: parametro,
        beforeSend: function (req) {
            req.setRequestHeader('Authorization', sessionStorage.getItem("token"));
        },
        success: function (result) {
            insereLinhaGrupo(result);
            $(".navbar.navbar-default.navbar-fixed-top").removeClass('ocultarElemento');
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
function cargaInicialAtributos() {
    $.ajax({
        type: 'GET',
        crossDomain: true,
        cache: false,
        url: urlApi + 'gerenciamento/atributo/RecuperaFiltrosAtributo',
        beforeSend: function (req) {
            req.setRequestHeader('Authorization', sessionStorage.getItem("token"));
        },
        success: function (result) {
            console.log(result)
            sourceSeg = "";
            if (result.segmentos) {
                $.each(result.segmentos, function (index, value) {
                    sourceSeg += "<option data-tokens='" + value.token + "' value='" + value.valor + "'>" + value.descricao + "</option>";
                });
            }

            $("#drpSeg").html(sourceSeg);
            $("#drpSegCad").html(sourceSeg);
            $(".selectpicker").selectpicker();
            $(".selectpicker").selectpicker('refresh');


            var $menuTitulo = $(".navbar.navbar-default.navbar-fixed-top");
            if (window.location.href.toLowerCase().indexOf("cadastro/atributo") > -1) {
                if (result.attrEleListaProd) {
                    $.each(result.attrEleListaProd, function (index, value) {
                        ordemComplete.push({
                            value: value.ordem,
                            label: value.ordem + ' (' + value.descricao + ')'
                        });
                    });
                }
                $('.attrNum').maskMoney({ thousands: '.', allowZero: true, decimal: ',', precision: 0, reverse: true, selectAllOnFocus: true, allowNegative: true });
                $('.percent').maskMoney({ suffix: '%', decimal: ',', allowZero: true, reverse: true, selectAllOnFocus: true });
                $('.money').maskMoney({ prefix: 'R$ ', thousands: '.', allowZero: true, decimal: ',', reverse: true, selectAllOnFocus: true });
                $('.percent').maskMoney('mask');
                $('.attrNum').maskMoney('mask');
                $('.money').maskMoney('mask');
                if (idAtributoEditar == '0') {
                    var valOrdem = parseInt(result.attrEleListaProd[result.attrEleListaProd.length - 1].ordem) + 1;
                    $("#txtNumOrdem").val(valOrdem);
                    carregarCadFilial([])
                    $('#divLista').addClass('ocultarElemento')
                    $(".filtrosItemLista").addClass('ocultarElemento');

                    $menuTitulo.find('.navbar-header .navbar-center').text('Cadastro de Atributos');
                    $(".bg_load").fadeOut();
                    $(".wrapper").fadeOut();
                    $menuTitulo.removeClass('ocultarElemento');
                    $("div.controls.ocultarElemento").removeClass('ocultarElemento');
                } else {
                    var objConsulta = {};
                    objConsulta.idTipoAtributo = idAtributoEditar;
                    var objEnvio = { tipoAtributo: objConsulta };

                    retornaAtributoEditar(objEnvio);
                    $menuTitulo.find('.navbar-header .navbar-center').text('Atualização de Atributos');
                }

            } else {
                $menuTitulo.find('.navbar-header .navbar-center').text('Gerenciamento de Atributos');
                $(".bg_load").fadeOut();
                $(".wrapper").fadeOut();
                $menuTitulo.removeClass('ocultarElemento');
                $("div.controls.ocultarElemento").removeClass('ocultarElemento');
            }

        },
        error: function (error) {
            sessionStorage.clear();
            localStorage.clear();
            localStorage.setItem("erro", "<strong>Erro Interno!</strong></br>Ocorreu uma falha de comunicação entre a aplicação e a base de dados. Aguarde alguns minutos e tente novamente.</br>Caso o erro persista, entre em contato com o administrador do sistema e comunique este problema.<br/>Erro " + error.status + ": " + tratamentoErro(error));
            window.location = "../conta/login.cshtml";
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
            console.log(result)
            var sourceSec = "", sourceCNPJ = "", sourceMarca = "", sourseUsuario = "", sourseForn = "", sourceSeg = "", sourceSts = "";
            if (result.secoes) {
                $.each(result.secoes, function (index, value) {
                    sourceSec += "<option data-tokens='" + value.token + "' value='" + value.valor + "'>" + value.descricao + "</option>";
                });
            }
            if (result.statusPedido) {
                $.each(result.statusPedido, function (index, value) {
                    if (value.dadosAdicionais.length > 0) {
                        observacaoStatus.push(value.valor);
                    }

                    sourceSts += "<option data-tokens='" + value.token + "' value='" + value.valor + "'>" + value.descricao + "</option>";
                });
            }
            $.each(result.fornecedores, function (index, value) {
                sourceCNPJ += "<option data-tokens='" + value.token + "' data-subtext='" + value.token.split(';')[3] + "' value='" + value.valor + "'>" + value.descricao + "</option>";
            });
            $.each(result.attrFornecedores, function (index, value) {
                sourseForn += "<option data-tokens='" + value.token + "' value='" + value.valor + "'>" + value.descricao + "</option>";
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
            if (result.segmentos) {
                $.each(result.segmentos, function (index, value) {
                    sourceSeg += "<option data-tokens='" + value.token + "' value='" + value.valor + "'>" + value.descricao + "</option>";
                });

            }
            $("#drpMarc").html(sourceMarca);
            $("#drpSec").html(sourceSec);
            $("#drpSeg").html(sourceSeg);
            $("#cbAttrForn").html(sourseForn);
            $("#drpCNPJ").html(sourceCNPJ);
            $("#cbUsuario").html(sourseUsuario);
            $("#cbStatus").html(sourceSts);

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

            //$(".bg_load").fadeOut();
            //$(".wrapper").fadeOut();
            //$(".navbar.navbar-default.navbar-fixed-top").removeClass('ocultarElemento');
            //$("div.controls.ocultarElemento").removeClass('ocultarElemento');
            //$("#divForn").removeClass('ocultarElemento');
            //$("#divMarca").removeClass('ocultarElemento');
            //$("#divSec").removeClass('ocultarElemento');
            //$("#divOcultaColuna").removeClass('ocultarElemento');

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
                        '/' + result.packs[i].gruposDistribuir[j].descricao,
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
            var statusTransicao = result.idStatusPedidoPara ? result.idStatusPedidoPara.split(',') : []
            for (var i = 0; i < statusTransicao.length; i++) {
                $('.btnFooters .status' + statusTransicao[i]).removeClass('ocultarElemento');
            }
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
            if (result.filtrosPrePedido.grupoEmpresaPrecos) {
                $.each(result.filtrosPrePedido.grupoEmpresaPrecos, function (index, value) {
                    criaPainelPrecoVenda(value)
                });
            }
            objEnvio.codigo = result.idProduto;
            sessionStorage.setItem("pedidoStatus", result.status);
            grupoRelacionar = result.filtrosPrePedido.relacionamentoGrupos;
            console.log(grupoRelacionar);
            carregaImagemProduto(objEnvio);
            var sourceSec = "", sourceCNPJ = "", souceClass = "", sourceMarca = "", sourceEspecie = "", sourceSeg = "", sourceForma = "",
                sourceCondicao = "", sourceCores = "", sourceTamanho = "", sourceTamanhoGrupo = "", sourceReferencia = "",
                sourceMedida = "", sourceCompradorProduto = '', sourceComprador = '<option value="">Nenhuma</option>';
            carregaAtributosPorOrdem(result.filtrosPrePedido.attrEleListaPed, result.filtrosPrePedido.attrListaPed, result.filtrosPrePedido.ordemPed, true);
            carregaAtributosPorOrdem(result.filtrosPrePedido.attrEleListaProd, result.filtrosPrePedido.attrListaProd, result.filtrosPrePedido.ordemProd, false)
            $.each(result.filtrosPrePedido.secoes, function (index, value) {
                sourceSec += "<option selected data-tokens='" + value.token + "' value='" + value.valor + "'>" + value.descricao + "</option>";
            });
            $.each(result.filtrosPrePedido.fornecedores, function (index, value) {
                sourceCNPJ += "<option selected data-tokens='" + value.token + "' data-subtext='" + value.token.split(';')[3] + "' value='" + value.valor + "'>" + value.descricao + "</option>";
            });
            $.each(result.filtrosPrePedido.marcas, function (index, value) {
                var selecionarMarca = result.filtrosPrePedido.marcaSelecionada != value.valor ? '' : 'selected '

                var empVinc = value.dadosAdicionais.length ? "data-empresa-obrigatorio ='" + value.dadosAdicionais[0] + "' " : "";
                sourceMarca += "<option " + selecionarMarca + empVinc + "data-tokens='" + value.token + "' value='" + value.valor + "'>" + value.descricao + "</option>";
            });
            $.each(result.filtrosPrePedido.especies, function (index, value) {
                sourceEspecie += "<option selected data-tokens='" + value.token + "' value='" + value.valor + "'>" + value.descricao + "</option>";
            });
            if (result.filtrosPrePedido.segmentos) {
                $.each(result.filtrosPrePedido.segmentos, function (index, value) {
                    sourceSeg += "<option selected data-tokens='" + value.token + "' value='" + value.valor + "'>" + value.descricao + "</option>";
                });

            }
            if (result.filtrosPrePedido.compradoresProduto) {
                $.each(result.filtrosPrePedido.compradoresProduto, function (index, value) {
                    sourceCompradorProduto += "<option selected data-tokens='" + value.token + "' value='" + value.valor + "'>" + value.descricao + "</option>";
                });

            }
            if (result.filtrosPrePedido.statusPedido) {
                $.each(result.filtrosPrePedido.statusPedido, function (index, value) {
                    if (value.dadosAdicionais.length > 0) observacaoStatus.push(value.valor);
                });
            }
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
            $.each(result.filtrosPrePedido.compradores, function (index, value) {
                var selecionado = value.valor == result.compradoresSelecionados ? " selected " : "";

                sourceComprador += "<option data-tokens='" + value.token + "' " + selecionado + "' value='" + value.valor + "'>" + value.descricao + "</option>";
            });
            $.each(result.filtrosPrePedido.uniMedida, function (index, value) {
                var selecionado = value.valor == result.idUnidadeMedida ? " selected " : "";
                sourceMedida += "<option data-tokens='" + value.token + "' " + selecionado + " value='" + value.valor + "'>" + value.descricao + "</option>";
            });
            $(".attrNum").maskMoney();
            $(".attrMon").maskMoney();
            $(".attrPerc").maskMoney();
            $(".attrBool").bootstrapSwitch();
            $(".prVenda").maskMoney();

            geraComponenteCalendarioAttr()
            $(".frmPrecosVenda.collapsible").collapsible({
                animation: true,
                speed: "medium"
            });
            validaPermissaoPedidoCadastro();
            $('#txtDtEntregaPed').data('daterangepicker').minDate = moment(new Date(result.filtrosPrePedido.dadosConfigPadrao.dataEntregaInicio));
            $('#txtDtEntregaPed').data('daterangepicker').setStartDate(new Date(result.filtrosPrePedido.dadosConfigPadrao.dataEntregaInicio));
            $('#txtDtEntregaPed').data('daterangepicker').setEndDate(new Date(result.filtrosPrePedido.dadosConfigPadrao.dataEntregaFinal));
            $('#txtDtEntregaFinalPed').data('daterangepicker').setStartDate(new Date(result.filtrosPrePedido.dadosConfigPadrao.dataToleranciaAtrasoInicio));
            $('#txtDtEntregaFinalPed').data('daterangepicker').setEndDate(new Date(result.filtrosPrePedido.dadosConfigPadrao.dataToleranciaAtrasoFinal));
            $("#drpCompPed").html(sourceComprador);
            $("#drpCompProd").html(sourceCompradorProduto);
            $("#drpUnidadeMed").html(sourceMedida);
            $("#txDtCadProd").val(result.dtCadastroPedido).attr('disabled', true);
            $("#txtDtCadProd").val(result.dtCadastroProduto).attr('disabled', true);
            $("#drpEsp").html(sourceEspecie).attr('disabled', true);
            $("#drpMarc").html(sourceMarca).attr('disabled', true);
            $("#drpSec").html(sourceSec).attr('disabled', true);
            $("#drpSeg").html(sourceSeg).attr('disabled', true);
            $("#drpCNPJ").html(sourceCNPJ).attr('disabled', true);
            $("#drpCoresGrade").html(sourceCores);
            $("#drpTamanhoGrade").html(sourceTamanho);
            if ($("#drpTamanhoGrade option").length < 7) {
                configuraCombosOpcoes('#drpTamanhoGrade');
            }
            statusTransicao = result.idStatusPedidoPara ? result.idStatusPedidoPara.split(',') : [];
            if (result.status.toLowerCase() !== "a") {
                $(".finish-change").addClass('ocultarElemento');
                $("#drpCompPed").attr('disabled', true);
            }
            for (var i = 0; i < statusTransicao.length; i++) {
                if (statusTransicao[i].toLowerCase() != 'c') {
                    $('.exibeBtn.status' + statusTransicao[i]).removeClass('ocultarElemento')
                }
            }
            if (result.historicos.length) {
                console.log(result.historicos)
                var colHitorico = retornaDescColunaTabelaHitorico(result.historicos[0]);
                var colRef = geraColunaHistorico(colHitorico);
                var colDesc = colHitorico.map(obj => {
                    return obj.replace(/([A-Z]+)/g, " $1").replace(/([A-Z][a-z])/g, "$1");
                });
                var headTB = criaTabelaHistorico(colDesc);
                $("#tabelaHitorico").html(headTB);
                carregarHistoricoTB(colRef, result.historicos)

            }
            $("#drpTamanhoCategoria").html(sourceTamanhoGrupo);
            $('#drpReferenciaGrade').html(sourceReferencia);
            $('#drpClassificacao').html(souceClass).selectpicker('val', '');
            $("#drpCondPgtoPed").html(sourceCondicao);
            $("#drpFrmPgtoPed").html(sourceForma);
            $("#drpCompProd option").attr('disabled', true);

            ordenaOpcao();
            $(".selectpicker").selectpicker();
            var compSel = result.compradoresSelecionados ? result.compradoresSelecionados.split(',') : '';
            $("#drpCompPed").selectpicker('val', compSel);
            validaPermissaoPedidoCadastro()
            $("#drpTamanhoGrade").selectpicker('val', result.tamanhosSelecionadas.split(','));
            $("#drpCoresGrade").html(sourceCores).selectpicker('val', result.coresSelecionadas.split(','));
            $('#drpReferenciaGrade').selectpicker('val', result.referenciasSelecionadas.split(','));
            $("#drpCondPgtoPed option[value='" + result.condicaoSeleciona + "']").attr('selected', 'selected')
            $("#drpClassificacao option[value='" + result.classificacaoSelecionada + "']").attr('selected', 'selected')
            $("#drpTamanhoCategoria option[value='" + result.filtrosPrePedido.tamanhoGrupo[0].valor + "']").attr('selected', 'selected')

            $('#drpFrmPgtoPed').selectpicker('val', result.formasSelecionadas.split(','));
            //$(".selectpicker").selectpicker('refresh');
            $('#txtAreaObsPed').val(result.observacao);
            $("#txtIDProd").val(result.idProduto).attr('disabled', true);
            $("#txtProdutoPed").val(result.codProduto).attr('disabled', true);
            if (result.produtoInativo) {
                $("#txtStatusProd").val('Inativo');
                $("#drpMarc option[value='" + result.filtrosPrePedido.marcaSelecionada + "']").attr('selected', 'selected');
                permissoesUsuarioLogado.indexOf('Editar Marca') === -1 ?
                    $("#drpMarc").attr('disabled', true) :
                    $("#drpMarc").attr('disabled', false);
                $("#txtCodOriPed").val(result.codigoOriginal);
                permissoesUsuarioLogado.indexOf('Editar Código Original') === -1 ?
                    $("#txtCodOriPed").attr('disabled', true) :
                    $("#txtCodOriPed").attr('disabled', false);
                $("#txtRefPed").val(result.referenciaFornecedor);
                permissoesUsuarioLogado.indexOf('Editar Referência Produto') === -1 ?
                    $("#txtRefPed").attr('disabled', true) :
                    $("#txtRefPed").attr('disabled', false);
                $("#txtDescPed").val(result.descricaoProduto)
                permissoesUsuarioLogado.indexOf('Editar Descrição') === -1 ?
                    $("#txtDescPed").attr('disabled', true) :
                    $("#txtDescPed").attr('disabled', false);
                $("#txtDescResPed").val(result.descricaoReduzidaProduto)
                permissoesUsuarioLogado.indexOf('Editar Descrição Reduzida') === -1 ?
                    $("#txtDescResPed").attr('disabled', true) :
                    $("#txtDescResPed").attr('disabled', false);
            } else {
                $("#txtStatusProd").val('Ativo');
                $("#txtCodOriPed").val(result.codigoOriginal).attr('disabled', true);
                $("#txtRefPed").val(result.referenciaFornecedor).attr('disabled', true);
                $("#txtDescPed").val(result.descricaoProduto).attr('disabled', true);
                $("#txtDescResPed").val(result.descricaoReduzidaProduto).attr('disabled', true);
            }
            nomesCoresCSS = repartirArray(result.filtrosPrePedido.dadosPaleta.valoresCSS);
            nomesCoresPtCSS = repartirArray(result.filtrosPrePedido.dadosPaleta.descricoes);
            $("#txtCustoBrutoPed").val(result.precoCusto.toFixed(2).replace('.', ','));
            $("#txtValorResumoPed").val(result.valorTotal.toFixed(2).replace('.', ','));
            $("#txtItensResumoPed").val(result.qtdeItens.toLocaleString('pt-BR'));
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
            $(".prVenda").maskMoney();
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
            var textoTitulo = 'Pedido ' + sessionStorage.getItem("pedidoId") + ': ' + result.descricaoStatus;
            $menuTitulo.find('.navbar-header .navbar-center').text(textoTitulo);
            $(".finish-change").html('Atualizar');
            $(".selectpicker").selectpicker('refresh');
            $(".bg_load").fadeOut();
            $(".wrapper").fadeOut();
            $(".navbar.navbar-default.navbar-fixed-top").removeClass('ocultarElemento');
            $("div.controls.ocultarElemento").removeClass('ocultarElemento');
            $("#divForn").removeClass('ocultarElemento');
            $("#divMarca").removeClass('ocultarElemento');
            $("#divSec").removeClass('ocultarElemento');
            $(".resumoTab").removeClass('ocultarElemento');
            $(".resumoTab a").tab('show');
            if (result.status !== 'A') {
                if (result.status == 'C') {
                    $('.btn.finish-change').addClass('ocultarElemento');
                }
                desabilitaEdicao();
                $(".selectpicker").selectpicker('refresh');
            } else {

                if (result.filtrosPrePedido.dadosConfigPadrao.produtoBloqueado) {
                    desabilitaConfiguracaoProduto();
                }
                $("#frmDados.collapsible").collapsible({
                    animation: true,
                    speed: "medium"
                });
                $("#frmCusto.collapsible").collapsible({
                    animation: true,
                    speed: "medium"
                });
                $("#frmAttrProd.collapsible").collapsible({
                    animation: true,
                    speed: "medium"
                });
                $(".frmPrecosVenda.collapsible").collapsible({
                    animation: true,
                    speed: "medium"
                });
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
                    var dadosOrigemCompra = JSON.parse(sessionStorage.getItem("produtosLista"));
                    if (dadosOrigemCompra) {
                        window.location = "../gerenciamento/compraprodutos.cshtml";
                    } else {
                        window.location = "../gerenciamento/pedido.cshtml";
                    }

                }
            });;
        }
    });
}
function atualizarStatus(parametro) {
    $('.btn-group.bootstrap-select.disabled.show-tick').addClass('ocultarElemento');
    if ($('#modalDetalhamentoPedido')) {
        $('#modalDetalhamentoPedido').modal('hide');
    }

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
                if (sessionStorage.getItem('Editar')) {
                    sessionStorage.removeItem('Editar');
                    location.reload();
                } else {
                    sessionStorage.getItem("produtosLista") ?
                        window.location = "../gerenciamento/compraprodutos.cshtml" :
                        window.location = "../gerenciamento/pedido.cshtml";
                }
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
function atualizarStatusGravarPedido(parametro) {
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
function cargaMovimentacaoProdutoOTB(parametro) {
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
            console.log(result);
            $("#divOTBRelatorio").removeClass('ocultarElemento');
            carregaAbaSegmento(result);
            geraDadosRelatorioOTB(result, 'Seg', segRelGerado)
            carregaAbaSecao(result);
            geraDadosRelatorioOTB(result, 'Sec', secRelGerado)
            carregaAbaEspecie(result);
            geraDadosRelatorioOTB(result, 'Esp', espRelGerado)
            $(".selectpicker").selectpicker('show');
            var $menuTitulo = $(".navbar.navbar-default.navbar-fixed-top");
            $menuTitulo.removeClass('ocultarElemento');
            $(".bg_load").fadeOut("slow");
            $(".wrapper").fadeOut("slow");
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
function validarPrimeiroAcesso() {
    sessionStorage.removeItem("cookies");
    console.log(document.cookie);
    $.ajax({
        type: 'GET',
        crossDomain: true,
        url: urlApi + 'ValidarPrimeiroAcesso',
        success: function (result) {
            if (result.headers) {
                var coockiesServer = result.headers[0];
                console.log(result)
                console.log(JSON.stringify(coockiesServer));
                if (coockiesServer && coockiesServer.key === "Set-Cookie") {
                    var coks = coockiesServer.value[0];
                    sessionStorage.setItem("cookies", JSON.stringify(coockiesServer));
                    console.log(coks);
                    window.location = "../gerenciamento/configuracao.cshtml";
                }
            }
            else {

                $(".bg_load").fadeOut();
                $(".wrapper").fadeOut();
            }
        },
        error: function (error) {
            console.log(error)
            if (error.status === 401) {
                localStorage.setItem("erro", "Acesso negado! Verifique usuario e senha. Caso o erro persista, entre em contato com o administrador do sistema para confirmar se está autorizado a logar");
                location.reload();
            } else if (error.status === 0) {
                location.reload();
            }
            else {
                localStorage.setItem("erro", "Acesso negado! " + tratamentoErro(error));
                location.reload();
            }
        }
    });
}
function cadastrarPermissoes(parametro) {
    waitingDialog.show('Cadastrando Permissão!', { dialogSize: 'lg', progressType: 'warning' });

    var objEnvio = { 'descricoes': parametro };
    $.ajax({
        type: 'POST',
        crossDomain: true,
        cache: false,
        //dataType: 'jsonp',
        url: urlApi + 'CadastraPermissao',
        xhrFields: {
            withCredentials: true
        },
        data: objEnvio,
        success: function (result) {
            console.log(result);
            var sourcePerm = "";
            $.each(result, function (index, value) {
                sourcePerm += "<option data-tokens='" + value.descricao + "' value='" + value.id + "'>" + value.descricao + "</option>";
            });
            $("#cbPermissoesPerfil").html(sourcePerm).selectpicker("refresh");
            var texto = 'Novo perfil cadastrado com sucesso, e já pode ser atribuido aos usuários', titulo = 'Cadastro de Perfil';

            waitingDialog.hide();

            $('#tabSetupInicial li a[href="#perfilApp"]').closest('li').removeClass("disabled");
            $('#tabSetupInicial li a[href="#permissaoApp"]').closest('li').addClass("disabled tabFinalizada");
            $('#tabSetupInicial li a[href="#permissaoApp"] i').removeClass("ocultarElemento");
            $('#tabSetupInicial li a[href="#perfilApp"]').tab('show');
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
function retornaAtributosSintetico(parametro) {
    $.ajax({
        type: 'POST',
        crossDomain: true,
        async: true,
        cache: false,
        data: parametro,
        beforeSend: function (req) {
            req.setRequestHeader('Authorization', sessionStorage.getItem("token"));
        },
        url: urlApi + 'gerenciamento/atributo/RecuperaAtributosFiltrados',
        success: function (result) {
            console.log(result);
            for (var i = 0; i < result.length; i++) geraCardAtributo(result[i]);
            $('.selectpicker').selectpicker('show');
            $(".bg_load").fadeOut();
            $(".wrapper").fadeOut();
            var $menuTitulo = $(".navbar.navbar-default.navbar-fixed-top");
            $menuTitulo.removeClass('ocultarElemento');
        },
        error: function (error) {
            console.log(error)
            $('.selectpicker').selectpicker('show');
            $(".bg_load").fadeOut();
            $(".wrapper").fadeOut();
            var $menuTitulo = $(".navbar.navbar-default.navbar-fixed-top");
            $menuTitulo.removeClass('ocultarElemento');
            modal({
                messageText: "Ocorreu um erro durante esta operação, tente novamente.<br/>Caso o erro persista informe o administrador do sistema o horário e data da ocorrencia",
                type: "alert",
                headerText: "Falha Interna",
                alertType: "warning"
            })
        }
    });
}
function retornaAtributoEditar(parametro) {
    $.ajax({
        type: 'POST',
        crossDomain: true,
        async: true,
        cache: false,
        data: parametro,
        beforeSend: function (req) {
            req.setRequestHeader('Authorization', sessionStorage.getItem("token"));
        },
        url: urlApi + 'gerenciamento/atributo/RecuperaAtributoEditar',
        success: function (result) {
            console.log(result);

            if (result.segmentosSelecionados.length) {
                secoesAttrEditar = result.secoesSelecionadas;
                espSelecionadas = result.especiesSelecionadas;
                $("#drpSegCad").selectpicker('val', result.segmentosSelecionados).trigger('change');

            }
            previous = result.tipo;
            $("#drpTipoAttrCad").selectpicker('val', result.tipo).trigger('change');
            $("#txtIdAtributo").val(result.idTipoAtributo);
            $("#txtDescAttr").val(result.descricao);
            $("#txtNumOrdem").val(result.ordem);


            $("#ckbAttrObg").bootstrapSwitch('state', result.obrigatorio, false);
            $("#ckbStatusAttr").bootstrapSwitch('state', result.status, false);
            
            $("#ckbTipoAttrModal").bootstrapSwitch('state', result.modelo, false);
            desabilitaFuncoes()
            if (result.lista) {
                carregaModalEditarLista(result);
            } else {
                $('#divLista').addClass('ocultarElemento')
                $(".filtrosItemLista").addClass('ocultarElemento');

                carregarCadFilial([]);
                if (parseInt(result.tipo) > 0 && parseInt(result.tipo) < 4) {
                    carregaModalEditarNumerico(result);
                } else if (parseInt(result.tipo) == 0) {
                    carregaModalEditarTexto(result)
                } else if (parseInt(result.tipo) == 4) {
                    carregaModalEditarData(result)
                } else if (parseInt(result.tipo) == 5) {
                    carregaModalEditarBool(result)
                }
            }

        },
        error: function (error) {
            console.log(error)
            $('.selectpicker').selectpicker('show');
            $(".bg_load").fadeOut();
            $(".wrapper").fadeOut();
            var $menuTitulo = $(".navbar.navbar-default.navbar-fixed-top");
            $menuTitulo.removeClass('ocultarElemento');
            modal({
                messageText: "Ocorreu um erro durante esta operação, tente novamente.<br/>Caso o erro persista informe o administrador do sistema o horário e data da ocorrencia",
                type: "alert",
                headerText: "Falha Interna",
                alertType: "warning"
            })
        }
    });
}
function retornaItemListaEditar(parametro) {
    $.ajax({
        type: 'POST',
        crossDomain: true,
        async: true,
        cache: false,
        data: parametro,
        beforeSend: function (req) {
            req.setRequestHeader('Authorization', sessionStorage.getItem("token"));
        },
        url: urlApi + 'gerenciamento/atributo/RecuperaAtributoListaItem',
        success: function (result) {
            console.log(result);
            segSelecionados = [];
            if (result.segmentosSelecionados.length) {
                secoesAttrEditar = result.secoesSelecionadas;
                segSelecionados = result.segmentosSelecionados;

            }
            manipularItem('Atualizar Item');
        },
        error: function (error) {
            console.log(error)
            $('.selectpicker').selectpicker('show');
            $(".bg_load").fadeOut();
            $(".wrapper").fadeOut();
            var $menuTitulo = $(".navbar.navbar-default.navbar-fixed-top");
            $menuTitulo.removeClass('ocultarElemento');
            modal({
                messageText: "Ocorreu um erro durante esta operação, tente novamente.<br/>Caso o erro persista informe o administrador do sistema o horário e data da ocorrencia",
                type: "alert",
                headerText: "Falha Interna",
                alertType: "warning"
            })
        }
    });
}
function salvarDadosAtributo(parametro) {
    $.ajax({
        type: 'POST',
        crossDomain: true,
        async: true,
        cache: false,
        data: parametro,
        beforeSend: function (req) {
            req.setRequestHeader('Authorization', sessionStorage.getItem("token"));
        },
        url: urlApi + 'gerenciamento/atributo/SalvarAtributo',
        success: function (result) {
            var $menuTitulo = $(".navbar.navbar-default.navbar-fixed-top");
            $menuTitulo.removeClass('ocultarElemento');
            $(".bg_load").fadeOut("slow");
            $(".wrapper").fadeOut("slow", function () {
                var jc2 = $.confirm({
                    title: 'Operação Concluída!',
                    content: 'O atributo foi salvo com sucesso.',
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
                        }, 2000);
                    },
                    onOpenBefore: function () {
                        this.buttons.okButton.hide();
                    },
                    onDestroy: function () {
                        voltarGerenciamentoAtributo();
                    }
                });
            });
        },
        error: function (error) {
            console.log(error)
            $('.selectpicker').selectpicker('show');
            $(".bg_load").fadeOut();
            $(".wrapper").fadeOut();
            var $menuTitulo = $(".navbar.navbar-default.navbar-fixed-top");
            $menuTitulo.removeClass('ocultarElemento');
            modal({
                messageText: "Ocorreu um erro durante esta operação, tente novamente.<br/>Caso o erro persista informe o administrador do sistema o horário e data da ocorrencia",
                type: "alert",
                headerText: "Falha Interna",
                alertType: "warning"
            })
        }
    });
}
function excluirDadosAtributo(parametro) {
    $.ajax({
        type: 'POST',
        crossDomain: true,
        async: true,
        cache: false,
        data: parametro,
        beforeSend: function (req) {
            req.setRequestHeader('Authorization', sessionStorage.getItem("token"));
        },
        url: urlApi + 'gerenciamento/atributo/ExcluirAtributo',
        success: function (result) {
            var $menuTitulo = $(".navbar.navbar-default.navbar-fixed-top");
            $menuTitulo.removeClass('ocultarElemento');
            $(".bg_load").fadeOut("slow");
            $(".wrapper").fadeOut("slow", function () {
                var jc2 = $.confirm({
                    title: 'Operação Concluída!',
                    content: 'O atributo foi excluído com sucesso.',
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
                        }, 2000);
                    },
                    onOpenBefore: function () {
                        this.buttons.okButton.hide();
                    },
                    onDestroy: function () {
                        $menuTitulo.addClass('ocultarElemento');
                        $(".bg_load").show();
                        $(".wrapper").show();
                        location.reload();
                    }
                });
            });
        },
        error: function (error) {
            console.log(error)
            $('.selectpicker').selectpicker('show');
            $(".bg_load").fadeOut();
            $(".wrapper").fadeOut();
            var $menuTitulo = $(".navbar.navbar-default.navbar-fixed-top");
            $menuTitulo.removeClass('ocultarElemento');
            modal({
                messageText: "Ocorreu um erro durante esta operação, tente novamente.<br/>Caso o erro persista informe o administrador do sistema o horário e data da ocorrencia",
                type: "alert",
                headerText: "Falha Interna",
                alertType: "warning"
            })
        }
    });
}