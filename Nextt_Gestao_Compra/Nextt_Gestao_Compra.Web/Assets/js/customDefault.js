﻿var isMobile = false, resizeId, checarSessao = null, expirar = sessionStorage.getItem('token_expirado'); //initiate as false
var observacaoStatus = [], nfStatus = [];
var permissoesUsuarioLogado = JSON.parse(sessionStorage.getItem("permissoes"));
var btnStatusTransicaoIcones = '<a href="#" class="btn btn-success aprovarPedido ocultarElemento statusL" data-toggle="tooltip" data-container="body" title="Aprovar" style="margin:3px"><i class="fa fa-check" aria-hidden="true"></i></a>' +
    '<a href="#" class="btn btn-danger cancelarPedido ocultarElemento statusC" data-toggle="tooltip" data-container="body" title="Cancelar" style="margin:3px"><i class="fa fa-close" aria-hidden="true"></i></a>' +
    '<a href="#" class="btn btn-success finalizarPedido ocultarElemento statusF" data-toggle="tooltip" data-container="body" title="Finalizar" style="margin:3px"><i class="fa fa-check" aria-hidden="true"></i></a>' +
    '<a href="#" class="btn btn-warning devolverPedido ocultarElemento statusA" data-toggle="tooltip" data-container="body" title="Devolver" style="margin:3px"><i class="fa fa-mail-reply" aria-hidden="true"></i></a>' +
    '<a href="#" class="btn btn-danger reprovarPedido ocultarElemento statusR" data-toggle="tooltip" data-container="body" title="Reprovar" style="margin:3px"><i class="fa fa-retweet" aria-hidden="true"></i></a>';

var btnStatusTransicao = '<button type="button" id="btnReprovar" class="btn exibeBtn btn-danger ocultarElemento statusR"><i class="fa fa-retweet" aria-hidden="true"></i> Reprovar</button>' +
    '<button type="button" id="btnAprovar" class="btn btn-success exibeBtn ocultarElemento statusL"><i class="fa fa-check" aria-hidden="true"></i> Aprovar</button>' +
    '<button type="button" id="btnFinalizar" class="btn btn-success exibeBtn ocultarElemento statusF"><i class="fa fa-check" aria-hidden="true"></i> Finalizar</button>' +
    '<button type="button" id="btnDevolver" class="btn btn-warning exibeBtn ocultarElemento statusA"><i class="fa fa-mail-reply" aria-hidden="true"></i> Devolver</button>' +
    '<button type="button" id="btnCancelar" class="btn btn-danger exibeBtn ocultarElemento statusC"><i class="fa fa-close" aria-hidden="true"></i> Cancelar</button>'

var btnStatusTransicaoNF = '';
$(document).ready(function () {
    // device detection
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
        isMobile = true;
    }
    jQuery.extend(jQuery.fn.dataTableExt.oSort, {
        "currency-pre": function (a) {
            a = (a === "-") ? 0 : a.replace(/[^\d\-\,]/g, "").replace(',', '.');
            return parseFloat(a);
        },

        "currency-asc": function (a, b) {
            return a - b;
        },

        "currency-desc": function (a, b) {
            return b - a;
        }
    });
    $.fn.dataTable.moment = function (format, locale) {
        var types = $.fn.dataTable.ext.type;

        // Add type detection
        types.detect.unshift(function (d) {
            return moment(d, format, locale, true).isValid() ?
                'moment-' + format :
                null;
        });

        // Add sorting method - use an integer for the sorting
        types.order['moment-' + format + '-pre'] = function (d) {
            return moment(d, format, locale, true).unix();
        };
    };
    jQuery.extend(jQuery.fn.dataTableExt.oSort, {
        "numeric-comma-pre": function (a) {
            console.log(a)
            var x = a === "-" ? 0 : a.replace(/,/, ".");
            return parseFloat(x);
        },

        "numeric-comma-asc": function (a, b) {
            return a < b ? -1 : a > b ? 1 : 0;
        },

        "numeric-comma-desc": function (a, b) {
            return a < b ? 1 : a > b ? -1 : 0;
        }
    });
    jQuery.extend(jQuery.fn.dataTableExt.oSort, {
        "formatted-num-pre": function (a) {
            a = a === "-" || a === "" ? 0 : a.replace(/\./g, '');
            return parseFloat(a);
        },

        "formatted-num-asc": function (a, b) {
            return a - b;
        },

        "formatted-num-desc": function (a, b) {
            return b - a;
        }

    });
    jQuery.extend(jQuery.fn.dataTableExt.oSort, {
        "boolean-pre": function (a) {
            a = a === "-" || a === "" ? 0 : Number(a);
            return parseFloat(a);
        },

        "boolean-asc": function (a, b) {
            return a - b;
        },

        "boolean-desc": function (a, b) {
            return b - a;
        }

    });
    jQuery.extend(jQuery.fn.dataTableExt.oSort, {
        "date-eu-pre": function (date) {
            date = date.replace(" ", "");

            if (!date) {
                return 0;
            }

            var year;
            var eu_date = date.split(/[\.\-\/]/);

            /*year (optional)*/
            if (eu_date[2]) {
                year = eu_date[2];
            }
            else {
                year = 0;
            }

            /*month*/
            var month = eu_date[1];
            if (month.length === 1) {
                month = 0 + month;
            }

            /*day*/
            var day = eu_date[0];
            if (day.length === 1) {
                day = 0 + day;
            }

            return (year + month + day) * 1;
        },

        "date-eu-asc": function (a, b) {
            return a < b ? -1 : a > b ? 1 : 0;
        },

        "date-eu-desc": function (a, b) {
            return a < b ? 1 : a > b ? -1 : 0;
        }
    });

    if (sessionStorage.getItem("id_usuarioLogado") === null) {
        if (sessionStorage.getItem("cookies") === null) {
            window.location = "../conta/login.cshtml"
        }
    } else {
        $(".username").html("Olá, <strong>" + sessionStorage.getItem("id_usuarioLogado") + "</strong>!")
    }
    if (sessionStorage.getItem("perfilSistema") === 'undefined' && sessionStorage.getItem("perfilAdmin") === 'undefined') {
        $("#usuarioOpcao").css("display", "none");
    }
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });
    $(".selectpicker").on('changed.bs.select', function (e, clickedIndex, newValue, oldValue) {
        var drpDwnDefaut = $(this).data('selectpicker');
        if (drpDwnDefaut.options.liveSearch && drpDwnDefaut.multiple) {
            var liVisiveisSelecionadas = $(drpDwnDefaut.$menuInner).find("li").not(":hidden").not(".selected").length;
            if (liVisiveisSelecionadas === 0) {
                drpDwnDefaut.$searchbox.val('').trigger('propertychange');
            } else {
                $(drpDwnDefaut.$searchbox).focus().select();
            }
        }
    });
    Array.prototype.contains = function (needle) {
        for (i in this) {
            if (this[i] == needle) return true;
        }
        return false;
    };
    Array.prototype.hasMin = function (attrib) {
        return this.reduce(function (prev, curr) {
            return prev[attrib] < curr[attrib] ? prev : curr;
        });
    }
    validaSessaoExpirada();
    $(document).on("mouseup touchend", ".bootstrap-select .dropdown-header", function () {
        cliqueGrupoDpd(this);
    });
    bloqueiaOpcoesPrincipais();
});
function validaSessaoExpirada() {
    if (!checarSessao) {
        checarSessao = setInterval(function () { validaSessaoExpirada(); }, 6000);
    }
    if (new Date() > new Date(expirar)) {
        sessionStorage.clear();
        localStorage.clear();
        localStorage.setItem("erro", "<strong>Sessão Expirada!</strong></br>Sua sessão expirou e você foi desconectado. Conecte novamente para acessar o sistema.");
        window.location = "../conta/login.cshtml";
    }
}
function bloqueiaOpcoesPrincipais() {
    console.log(permissoesUsuarioLogado)
    if (permissoesUsuarioLogado && permissoesUsuarioLogado.indexOf('Gerenciar Usuários') === -1) {
        $("#usuarioOpcao").css("display", "none");
    };
}

function gerenciarUsuario() {

    var retorno, btconfirma = 'Sim', btcancela = 'Não', texto = 'Tem certeza que deseja abandonar esta página e iniciar o gerenciamento de usuários?', titulo = 'Gerenciamento de Usuário';

    $("#usuarioOpcao").css("display", "none");
    $("#planejamentoOpcao").css("display", "block");
    modal({
        type: "confirm",
        messageText: texto,
        alertType: 'info',
        headerText: titulo,
        yesButtonText: btconfirma,
        noButtonText: btcancela
    }).done(function (e) {
        if (e) {
            sessionStorage.removeItem('compra');
            sessionStorage.removeItem("pedidoId");
            sessionStorage.removeItem("pedidoStatus");
            sessionStorage.removeItem("cadastroNovo");
            $(".navbar.navbar-default.navbar-fixed-top").addClass('ocultarElemento');
            $('.selectpicker').selectpicker('hide');
            $(".bg_load").show();
            $(".wrapper").show();
            window.location = "../conta/gerenciadorusuario.cshtml";
        }
    });


}

function navBrandClick() {

    if (sessionStorage.getItem("cookies") === null && window.location.href.toLowerCase().indexOf("home") === -1) {
        if (window.location.href.toLowerCase().indexOf("cadastro/") > -1) {
            modal({
                type: "confirm",
                headerText: '<i class="fa fa-exclamation-circle red"></i><strong> Atenção! Tem certeza que deseja prosseguir?</strong>',
                messageText: 'Ao confirmar esta operação, todas as informações inseridas e não salvas serão descartadas.',
                alertType: 'warning',
                modalSize: 'modal-lg',
                titleClass: 'red'
            }).done(function (e) {
                if (e) {
                    $('#tabelaUsuarios_paginate').css('display', 'none');
                    $('#divPaineisCadastroCompra').addClass('ocultarElemento');
                    $('.selectpicker').selectpicker('hide');
                    $(".navbar.navbar-default.navbar-fixed-top").addClass('ocultarElemento');
                    $(".bg_load").show();
                    $(".wrapper").show();
                    window.location = "../home.cshtml"
                }
            });
        } else {
            if (!$('#divValBool').hasClass('ocultarElemento')) {
                $('#divValBool').addClass('ocultarElemento')
            }
            sessionStorage.removeItem('paginacao');
            sessionStorage.removeItem('parametrosFiltro');
            $('#tabelaUsuarios_paginate').css('display', 'none');
            $('.selectpicker').selectpicker('hide');
            $(".navbar.navbar-default.navbar-fixed-top").addClass('ocultarElemento');
            $(".bg_load").show();
            $(".wrapper").show();
            window.location = "../home.cshtml"
        }

    }
}
function validarTexto(texto) {
    var pallavrasTexto = texto.split(' ');
    var retorno = '';
    if (pallavrasTexto.length == 1 && pallavrasTexto[0].length > 50) {
        retorno = 'Informe um texto válido para prosseguir!'
    }
    else if (pallavrasTexto.length > 1) {
        for (var i = 0; i < pallavrasTexto.length; i++) {
            if (pallavrasTexto[0].length > 50) {
                retorno = 'Informe um texto válido para prosseguir! Existem palavras no texto que não correspondem a palavras nos existentes em qualquer idioma'
            }
        }
    }
    return retorno;
}
function alteraStatusPedido(status, idPedido) {
    var txtMensagem = parseInt(idPedido) === 0 ? 'Salvar o Pedido' : 'Atualizar o Pedido';
    $.confirm({
        type: 'blue',
        title: txtMensagem,
        content:
            '<div class="form-group">' +
            '<label>Informe o motivo da operação!</label>' +
            '<textarea id="txtAreaCancelPed" maxlength="1000" class="form-control" rows="5"></textarea>' +
            '</div>',
        buttons: {
            confirmar: {
                text: 'Confirmar',
                btnClass: 'btn-blue',
                action: function () {
                    var motivo = this.$content.find('#txtAreaCancelPed').val().trim();
                    var validacao = validarTexto(motivo);
                    if (validacao.length) {
                        pedidoOperacaoInvalida(validacao);
                        return false;
                    }
                    if (!motivo || motivo.length < 5) {
                        pedidoOperacaoInvalida('O motivo é obrigatório e deve conter no mínimo 5 caracteres! Informe o motivo ou cancele a operação.')
                        return false;
                    }

                    var objEnvio = {};
                    objEnvio.codigo = idPedido;
                    objEnvio.status = status;
                    objEnvio.observacao = motivo;
                    if (window.location.href.toLowerCase().indexOf("cadastro/compra") > -1 && (status.toLowerCase() == 'a' || status.toLowerCase() == 'f')) {
                        geraPedidoSalvar(status, objEnvio);
                    } else {
                        atualizarStatus(objEnvio);
                    }

                }
            },
            cancel: {
                text: 'Sair',
                btnClass: 'btn-green',
                action: function () {
                    if (window.location.href.toLowerCase().indexOf("cadastro/compra") > -1) { salvarPedidoOpcao(); } else if (origemModal) {
                        origemModal = false
                        $('#modalDetalhamentoPedido').modal('show');
                    }
                },
            }
        }
    });

}
function limparModalSenha() {
    $('#txtSenhaAtual').val('');
    $('#txtSenhaNova').val('');
    $('#txtConfirmaSenhaNova').val('');
}

function atualizarSenha() {
    var titulo = "Alteração de Senha";
    var senhaAtual = $('#txtSenhaAtual').val(), senhaNova = $('#txtSenhaNova').val(), confirmaNovaSenha = $('#txtConfirmaSenhaNova').val(), texto, tipoAlerta = 'warning', mantemModal = false;
    if (senhaAtual === '' || senhaNova === '' || confirmaNovaSenha === '') {
        texto = "Existem dados em branco. Informe todos os dados antes de alterar a senha.";
        modal({
            type: "alert",
            messageText: texto,
            alertType: tipoAlerta,
            headerText: titulo
        }).done(function (e) { limparModalSenha(); });
    } else {
        if (senhaNova === senhaAtual) {
            texto = "Sua nova senha deve ser diferente da senha atual.";
            modal({
                type: "alert",
                messageText: texto,
                alertType: tipoAlerta,
                headerText: titulo
            }).done(function (e) { limparModalSenha(); });

        } else {
            if (senhaNova === confirmaNovaSenha) {
                var validadorSenha = (/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*_+.])[0-9a-zA-Z!@#$%&*_+.]{6,}$/);
                if (validadorSenha.test(senhaNova)) {
                    waitingDialog.show('Alterando Senha. Aguarde!', { dialogSize: 'lg', progressType: 'warning' });
                    alterarSenha(senhaAtual, senhaNova, confirmaNovaSenha);
                } else {
                    texto = 'Para cadastrar uma nova senha, é necessário respeitar as seguintes regras:</br></br>' +
                        '<ul class="fa-ul">' +
                        '<li><i class="fa-li fa fa-check-square"></i>Deve conter <strong>ao menos 1 letra maiúscula</strong>;</li>' +
                        '<li><i class="fa-li fa fa-check-square"></i>Deve conter <strong>ao menos 1 letra minúscula</strong>;</li>' +
                        '<li><i class="fa-li fa fa-check-square"></i>Deve conter <strong>ao menos 1 carácter especial (!, @, #, $, %, &, *, _, + ou .)</strong>;</li>' +
                        '<li><i class="fa-li fa fa-check-square"></i>Deve conter <strong>no mínimo 6 dígitos</strong>;</li>' +
                        '</ul>';

                    modal({
                        type: "alert",
                        messageText: texto,
                        alertType: tipoAlerta,
                        headerText: titulo
                    }).done(function (e) { });
                }

            } else {
                texto = "Nova senha e confirmação de senha não conferem. Informe o mesmo valor nos dois campos";
                modal({
                    messageText: texto,
                    type: "alert",
                    alertType: tipoAlerta,
                    headerText: titulo
                }).done(function (e) { limparModalSenha(); });
            }
        }
    }
}

function conferirAgenda() {
    sessionStorage.removeItem('compra');
    sessionStorage.removeItem("pedidoId");
    sessionStorage.removeItem("pedidoStatus");
    sessionStorage.removeItem("cadastroNovo");
    $(".navbar.navbar-default.navbar-fixed-top").addClass('ocultarElemento');
    $('.selectpicker').selectpicker('hide');
    $(".bg_load").show();
    $(".wrapper").show();
    window.location = "../gerenciamento/agenda.cshtml";
}
function voltarHome() {

    if (window.location.href.toLowerCase().indexOf("cadastro/compra") > -1) {
        modal({
            type: "confirm",
            headerText: '<i class="fa fa-exclamation-circle red"></i><strong> Atenção! Tem certeza que deseja prosseguir?</strong>',
            messageText: 'Ao confirmar esta operação, todas as informações inseridas até aqui serão descartadas.',
            alertType: 'warning',
            modalSize: 'modal-lg',
            titleClass: 'red'
        }).done(function (e) {
            if (e) {
                $('#divPaineisCadastroCompra').addClass('ocultarElemento');
                $('.selectpicker').selectpicker('hide');
                $(".navbar.navbar-default.navbar-fixed-top").addClass('ocultarElemento');
                $(".bg_load").show();
                $(".wrapper").show();
                window.location = "../home.cshtml"
            }
        });
    } else {
        $('#tabelaUsuarios_paginate').css('display', 'none');
        $('.selectpicker').selectpicker('hide');
        $(".navbar.navbar-default.navbar-fixed-top").addClass('ocultarElemento');
        $(".bg_load").show();
        $(".wrapper").show();
        window.location = "../home.cshtml"
    }
}

function desconectarSessao() {
    var mensagem, tituloLogout, btconfirma, btcancela;
    var destino = "../conta/login.cshtml";
    mensagem = "Tem certeza que deseja desconectar?";
    tituloLogout = "Encerrar Conexão";
    btconfirma = 'Sim';
    btcancela = 'Não';
    modal({
        type: "confirm",
        messageText: mensagem,
        headerText: tituloLogout,
        yesButtonText: btconfirma,
        noButtonText: btcancela,
        alertType: "info"
    }).done(function (e) {
        if (e) {

            sessionStorage.clear();
            localStorage.clear();
            window.location = "../conta/login.cshtml";
        }

    });
}

function cliqueGrupoDpd(el) {
    var $optgroup = $(el),
        idSelect = $(document).find('.controls .bootstrap-select.open').find('select').attr('id'),
        $ul = $optgroup.closest("ul"),
        optgroup = $optgroup.data("optgroup"),
        $options = $ul.find("[data-optgroup=" + optgroup + "]").not($optgroup),
        $selecionar = $options.filter(":not(.selected)").length > 0;
    $selecionar = $options.filter(":not(.selected)").length > 0;

    if ($selecionar) {
        $options.each(function () {

            if (!$(this).hasClass("selected")) {
                $(this).addClass('selected');
                $("#" + idSelect).find("option:eq(" + parseInt($(this).attr('data-original-index')) + ")").prop('selected', true);
            }
        });
    } else {
        $options.each(function () {

            if ($(this).hasClass("selected")) {
                $(this).removeClass('selected');
                $("#" + idSelect).find("option:eq(" + parseInt($(this).attr('data-original-index')) + ")").prop('selected', false);
            }
        });
    }
    $('.selectpicker').selectpicker('refresh');
    //if (idSelect.indexOf('OcultaColuna') > 0) finalizarOcultacaoColuna();
}

function mudarSenhaModal() {
    $("#alteraSenhaModalTitulo").html('<i class="fa fa-user"></i>&nbsp;Alterar <strong>Senha</strong>');
    $("#lblConfirmaSenha").html('Confirme a Nova Senha');
    $("#lblNovaSenha").html('Informe a Nova Senha');
    $("#lblSenhaAtual").html('Informe a Senha Atual');
    $("#btnSalvarSenha").html('<i class="fa fa-check"></i> Alterar');
    $("#btnCancelarSenha").html('<i class="fa fa-ban"></i> Cancelar');
    $('#modalAlteraSenha').modal({
        backdrop: 'static',
        keyboard: false
    });
    $('#modalAlteraSenha').modal('show');
}

function checarPermissoesEdicao() {
    if (permissoesUsuarioLogado.indexOf('Editar Dados Basicos') === -1) {
        $("#txtNome").attr("disabled", true);
        $("#txtSobrenome").attr("disabled", true);
        $("#txtNomeExibicao").attr("disabled", true);
        $("#txtEmail").attr("disabled", true);
        $("#txtCelular").attr("disabled", true);
    }
    if (permissoesUsuarioLogado.indexOf('Adicionar Perfil ao Usuário') === -1) {
        $('#ckbAdministrador').bootstrapSwitch('disabled', true);
        $('#ucComboAdminsEditar option').attr("disabled", true);
    }
    if (permissoesUsuarioLogado.indexOf('Bloquear/Desbloquear Usuário') === -1) {
        $("#ckbAtivo").bootstrapSwitch('toggleDisabled', true, true);
    }
}

function configuraMascaraInteiro(valor) {
    return (parseInt(valor)).toLocaleString('pt-BR');
}

function removeMascaraInteiro(valor) {
    var mascaraRemovida = valor.replace(".", "");
    return parseInt(mascaraRemovida);
}

function removeMascaraMoeda(valor) {
    var mascaraRemovida = valor.replace(".", "").replace(",", ".");
    return parseFloat(mascaraRemovida);
}

function configuraMascaraMoeda(valor) {
    return (parseFloat(valor)).formatMoney(2, ',', '.');
}
function semAcesso() {
    modal({
        messageText: "Você não possui permissão para executar esta operação, entre em contato com o administrador do sistema para solicitar o acesso!",
        type: "alert",
        headerText: "Acesso negado!",
        alertType: "warning"
    });
}
function configuraMascaraCnpj(v) {
    v = v.replace(/\D/g, ""); //Remove tudo o que não é dígito
    v = v.replace(/^(\d{2})(\d)/, "$1.$2"); //Coloca ponto entre o segundo e o terceiro dígitos
    v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3"); //Coloca ponto entre o quinto e o sexto dígitos
    v = v.replace(/\.(\d{3})(\d)/, ".$1/$2"); //Coloca uma barra entre o oitavo e o nono dígitos
    v = v.replace(/(\d{4})(\d)/, "$1-$2"); //Coloca um hífen depois do bloco de quatro dígitos
    return v;
}
function recuperaRgb(str) {
    var arrayRetornoTratado = [];
    var arrayTratadoCor = str.replace('linear-gradient(to right, rgb(', '').replace(' 100%)', '').split('%, rgb(');
    for (var i = 0; i < arrayTratadoCor.length; i++) {
        if (i % 2 === 0) {
            arrayRetornoTratado.push(arrayTratadoCor[i].split(')')[0].replace(/ /g, ''));
        }
    }
    return arrayRetornoTratado.join('/');
}
function retornaComboTokem(id) {
    var retorno = [];
    $('#' + id + ' option:selected').each(function () {
        retorno.push($(this).attr("data-tokens").replace(';', ' / '));

    });
    return retorno;
}
function dataAtualFormatada() {
    var data = new Date(),
        dia = data.getDate().toString(),
        diaF = (dia.length == 1) ? '0' + dia : dia,
        mes = (data.getMonth() + 1).toString(), //+1 pois no getMonth Janeiro começa com zero.
        mesF = (mes.length == 1) ? '0' + mes : mes,
        anoF = data.getFullYear();
    return diaF + "/" + mesF + "/" + anoF;
}
function trataParametroEnvio(arrayParametroEnvio) {
    var retorno = [];
    for (var i = 0; i < arrayParametroEnvio.length; i++) {
        retorno.push(arrayParametroEnvio[i].split('-')[0]);
    }
    return retorno;
}
function isNumber(n) { return /^-?[\d.]+(?:e-?\d+)?$/.test(n); }
function erroCadCompra(msgFalha, idErro) {
    if (fakewaffle.currentPosition === 'panel' || isMobile) {

        var jc = $.confirm({
            icon: 'fa fa-warning',
            theme: 'modern',
            animation: 'scale',
            typeAnimated: true,
            type: 'red',
            title: 'Operação Invalida!',
            content: '<strong>Erro: </strong>' + msgFalha,
            onOpenBefore: function () {
                $(".jconfirm-buttons").css('display', 'none');
            }
        });
        setTimeout(function () {
            jc.close();
        }, 6000);
    } else {

        if ($("#" + idErro).hasClass('alert-danger')) {
            msgFalha = '<strong>Erro: </strong>' + msgFalha;
        }
        $("#" + idErro).html(msgFalha);
        $("#" + idErro).fadeTo(6000, 500).slideUp(500, function () {
            $("#" + idErro).slideUp(500);
            $("#" + idErro).html('');
        });
    }

}
function isDate(txtDate) {
    return txtDate.match(/^(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)\d\d$/);
}
function formataStringData(data) {
    var retorno = '';
    if (data) {
        var dia = data.split("/")[0];
        var mes = data.split("/")[1];
        var ano = data.split("/")[2];
        retorno = ano + '-' + ("0" + mes).slice(-2) + '-' + ("0" + dia).slice(-2);
    }
    return retorno;
    // Utilizo o .slice(-2) para garantir o formato com 2 digitos.
}
function formatarDataEnvio(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}
function redimensionarTabelas() {

    console.log((new Date).toLocaleTimeString())

    $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust().draw();
    $.fn.dataTable.tables({ visible: true, api: true }).fixedHeader.adjust();
    var tables = $('.dataTable').DataTable();
    console.log(screen);

    $(".bg_load").fadeOut("slow");
    $(".wrapper").fadeOut("slow", function () {
        if (!$('.infoPage').hasClass('ocultarElemento')) {
            $('.infoPage').removeAttr('style')
        }
        $('.selectpicker').selectpicker('show');
        $("span.resized").addClass('ocultarElemento');
        $("span.wait").removeClass('ocultarElemento');
    });

}
function configuraRangeCalendarioFornecedor(elemento, dataIni, dataFinal) {
    var dtInicial = new Date(dataIni);
    var dtFinal = new Date(dataFinal);

    if (dtInicial.getFullYear() >= new Date().getFullYear() && dtInicial <= dtFinal) {
        $(elemento).data('daterangepicker').setStartDate(dtInicial);
        $(elemento).data('daterangepicker').setEndDate(dtFinal);
    }
}
function configuraCombosOpcoes(elemento) {
    var dtsize = $(elemento).find('option').length <= 7 ? "auto" : 7;
    $(elemento).selectpicker('destroy').selectpicker({
        liveSearch: $(elemento).find('option').length > 7,
        size: dtsize,
        actionsBox: $(elemento).find('option').length > 1,
    });
}
function deleteCookie() {
    if (document.cookie.indexOf("session-id=") > -1) {
        document.cookie = 'session-id=tempGuest; expires=expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=localhost; path=/';
    }
}
function atualizaObjetoMudancaPagina(pg) {
    var paramRetorno = JSON.parse(sessionStorage.getItem('parametrosFiltro'));
    var indicePagina = JSON.parse(sessionStorage.getItem('paginacao'));
    paramRetorno.paginas = indicePagina.filter(function (el) {
        return el.paginaNum === pg; // Changed this so a home would match
    })[0].idReferencias;
    console.log(paramRetorno)
    return paramRetorno;
}
function ajustaCodigoTamanho(str, tamanho) {
    str = "" + str;
    if (str.length >= tamanho)
        return str;
    return "00000000000000000000000000".substr(0, tamanho - str.length) + str;
}
function limparCampos() {
    $('.selectpicker:not([multiple])').selectpicker('val', '');
    $('.selectpicker[multiple]').each(function () {
        if (this.length) {
            $(this).selectpicker('deselectAll')
        }

    });
    if ($('.pagination-holder').length) {
        paginasMarcadas = [];
        prodMarcados = [];
        $('.pagination-holder').pagination('destroy');
    }

    $('.clear-filter').blur();
    $("input[type=text]").val("");
    $('.selectpicker').selectpicker('refresh');
    $('.dataTable').DataTable().clear().draw();
    sessionStorage.removeItem('paginacao');
    sessionStorage.removeItem('parametrosFiltro');
}
function limparCamposModal() {
    $('.modal-body .selectpicker:not([multiple])').selectpicker('val', '');
    $('.modal-body .selectpicker[multiple]').each(function () {
        if (this.length) {
            $(this).selectpicker('deselectAll')
        }

    });

    $('.modal-body .clear-filter').blur();
    $(".modal-body input[type=text]:not('.not-clear')").val("");
    $('.modal-body .selectpicker').selectpicker('refresh');
    $('.modal-body .dataTable').DataTable().clear().draw();
}
function validarCNPJ(cnpj) {

    cnpj = cnpj.replace(/[^\d]+/g, '');

    if (cnpj == '') return false;

    if (cnpj.length != 14)
        return false;

    // Elimina CNPJs invalidos conhecidos
    if (cnpj == "00000000000000" ||
        cnpj == "11111111111111" ||
        cnpj == "22222222222222" ||
        cnpj == "33333333333333" ||
        cnpj == "44444444444444" ||
        cnpj == "55555555555555" ||
        cnpj == "66666666666666" ||
        cnpj == "77777777777777" ||
        cnpj == "88888888888888" ||
        cnpj == "99999999999999")
        return false;

    // Valida DVs
    tamanho = cnpj.length - 2
    numeros = cnpj.substring(0, tamanho);
    digitos = cnpj.substring(tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0))
        return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1))
        return false;

    return true;

}


function modalAtualizaStatusNF(status, id) {
    var jcEntNf = $.confirm({
        icon: 'fa fa-pencil-square-o',
        type: 'blue',
        title: 'Atualizar Status',
        containerFluid: true,
        content: '<div class="col-md-12 col-sm-12 col-xs-12">' +
            btnStatusTransicaoNF +
            '</div>',
        buttons: {

            cancel: {
                text: 'Sair',
                btnClass: 'btn-red'
            }
        },
        onContentReady: function () {
            var self = this;

            $(self.$content.find('.btn-nf-transicao')).click(function () {
                var statusDestino = $(this).attr('class').split(' ')[2].replace('status-nf-', '');
                var objSalvarNF = {}, objEnvio = {};
                objEnvio.nfFornecedor = [];
                objSalvarNF.idnfFornecedor = id;
                objSalvarNF.idUsuarioCadastro = sessionStorage.getItem("id_usuario");
                objSalvarNF.status = statusDestino;
                objEnvio.nfFornecedor.push(objSalvarNF);
                $('.selectpicker').selectpicker('hide');
                $(".navbar.navbar-default.navbar-fixed-top").addClass('ocultarElemento');
                $(".dataTables_paginate.paging_simple_numbers").addClass('ocultarElemento');
                $(".bg_load").show();
                $(".wrapper").show();
                atualizaStatusEntradaNF(objEnvio);
                jcEntNf.close()


            })

        },
        onOpenBefore: function () {
            var self = this;
            $(self.$content.find(".btn-nf-transicao.status-nf-" + status.status)).closest('div.row').addClass('ocultarElemento');
            for (var i = 0; i < status.mudar.length; i++) {
                $(self.$content.find(".btn-nf-transicao.status-nf-" + status.mudar[i])).attr('disabled', false);
            }

        },
        onDestroy: function () {
            //$('#listaCadastrados_paginate').css('display', 'block');
            //segSelecionados = [];
            //espSelecionadas = [];
            //dadosItemEdt = null
        },
    });

}

(function () {
    var addRule;

    if (typeof document.styleSheets !== "undefined" && document.styleSheets) {
        addRule = function (selector, rule) {
            var styleSheets = document.styleSheets, styleSheet;
            if (styleSheets && styleSheets.length) {
                styleSheet = styleSheets[styleSheets.length - 1];
                if (styleSheet.addRule) {
                    styleSheet.addRule(selector, rule);
                } else if (typeof styleSheet.cssText === "string") {
                    styleSheet.cssText = selector + " {" + rule + "}";
                } else if (styleSheet.insertRule && styleSheet.cssRules) {
                    styleSheet.insertRule(selector + " {" + rule + "}", styleSheet.cssRules.length);
                }
            }
        };
    } else {
        addRule = function (selector, rule, el, doc) {
            el.appendChild(doc.createTextNode(selector + " {" + rule + "}"));
        };
    }

    var createCssClass = function (className, cssProps, doc) {
        doc = doc || document;

        var head = doc.getElementsByTagName("head")[0];
        if (head && addRule) {
            var selector = "*." + className;
            var ruleBits = [];
            for (var i in cssProps) {
                if (cssProps.hasOwnProperty(i)) {
                    ruleBits.push(i + ":" + cssProps[i] + ";");
                }
            }
            var rule = ruleBits.join("");
            var styleEl = doc.createElement("style");
            styleEl.type = "text/css";
            styleEl.media = "screen";
            head.appendChild(styleEl);
            addRule(selector, rule, styleEl, doc);
            styleEl = null;
        }
    };

    jQuery.fn.createAndApplyCssClass = function (className, cssProps) {
        createCssClass(className, cssProps, document);
    };
})();
(function (factory) {
    if (typeof define === "function" && define.amd) {
        define(["jquery", "moment", "datatables.net"], factory);
    } else {
        factory(jQuery, moment);
    }
}(function ($, moment) {

    $.fn.dataTable.moment = function (format, locale) {
        var types = $.fn.dataTable.ext.type;

        // Add type detection
        types.detect.unshift(function (d) {
            if (d) {
                // Strip HTML tags and newline characters if possible
                if (d.replace) {
                    d = d.replace(/(<.*?>)|(\r?\n|\r)/g, '');
                }

                // Strip out surrounding white space
                d = $.trim(d);
            }

            // Null and empty values are acceptable
            if (d === '' || d === null) {
                return 'moment-' + format;
            }

            return moment(d, format, locale, true).isValid() ?
                'moment-' + format :
                null;
        });

        // Add sorting method - use an integer for the sorting
        types.order['moment-' + format + '-pre'] = function (d) {
            if (d) {
                // Strip HTML tags and newline characters if possible
                if (d.replace) {
                    d = d.replace(/(<.*?>)|(\r?\n|\r)/g, '');
                }

                // Strip out surrounding white space
                d = $.trim(d);
            }

            return !moment(d, format, locale, true).isValid() ?
                Infinity :
                parseInt(moment(d, format, locale, true).format('x'), 10);
        };
    };

}));




