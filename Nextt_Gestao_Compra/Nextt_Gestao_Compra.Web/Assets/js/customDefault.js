var isMobile = false, resizeId; //initiate as false

$(document).ready(function () {
    // device detection
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
        isMobile = true;
    }
    jQuery.extend(jQuery.fn.dataTableExt.oSort, {
        "currency-pre": function (a) {
            a = (a === "-") ? 0 : a.replace(/[^\d\-\,]/g, "").replace(',','.');
            return parseFloat(a);
        },

        "currency-asc": function (a, b) {
            return a - b;
        },

        "currency-desc": function (a, b) {
            return b - a;
        }
    });
    jQuery.extend(jQuery.fn.dataTableExt.oSort, {
        "numeric-comma-pre": function (a) {
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
        window.location = "../conta/login.cshtml"
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
    //$(window).on('resize', function () {
    //    $(window).scrollTop(0);
    //    $("span.wait").addClass('ocultarElemento');
    //    $("span.resized").removeClass('ocultarElemento');
    //    $('.selectpicker').selectpicker('hide');
    //    if (!$('.infoPage').hasClass('ocultarElemento')) {
    //        $('.infoPage').css('display', 'none')
    //    }
    //    $(".bg_load").show();
    //    $(".wrapper").show();
    //    clearTimeout(resizeId);
    //    console.log((new Date).toLocaleTimeString())
    //    resizeId = setTimeout(redimensionarTabelas, 1000);

    //});

    $(document).on("mouseup touchend", ".bootstrap-select .dropdown-header", function () {
        $(this).closest('.bootstrap-select').find('select').attr('id').indexOf('OcultaColuna') > 0 ? iniciarOcultacaoColuna(this) : cliqueGrupoDpd(this);
    });
});

function gerenciarUsuario() {

    var retorno, btconfirma = 'Sim', btcancela = 'Não', texto = 'Tem certeza que deseja abandonar esta página e iniciar o gerenciamento de usuários?', titulo = 'Abandonar Relatórios';

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
    var destino = '../home.cshtml';
    window.location = destino;
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
    sessionStorage.removeItem('compra');
    sessionStorage.removeItem("pedidoId");
    sessionStorage.removeItem("pedidoStatus");
    sessionStorage.removeItem("cadastroNovo");
    $(".navbar.navbar-default.navbar-fixed-top").addClass('ocultarElemento');
    $('.selectpicker').selectpicker('hide');
    $(".bg_load").show();
    $(".wrapper").show();
    window.location = "../home.cshtml";
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
        idSelect = $optgroup.closest('.bootstrap-select').find('select').attr('id'),
        $ul = $optgroup.closest("ul"),
        optgroup = $optgroup.data("optgroup"),
        $options = $ul.find("[data-optgroup=" + optgroup + "]").not($optgroup),
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
    if (idSelect.indexOf('OcultaColuna') > 0) finalizarOcultacaoColuna();
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
    if (!contains.call(permissoes, 'Editar Dados Basicos')) {
        $("#txtNome").attr("disabled", true);
        $("#txtSobrenome").attr("disabled", true);
        $("#txtNomeExibicao").attr("disabled", true);
        $("#txtEmail").attr("disabled", true);
        $('#ckbAdministrador').bootstrapSwitch('disabled', true);
        $("#ckbAtivo").bootstrapSwitch('toggleDisabled', true, true);
        $("#txtCelular").attr("disabled", true);
    }
    if (!contains.call(permissoes, 'Adicionar Perfil ao Usuário')) {
        $('#ckbAdministrador').bootstrapSwitch('disabled', true);
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


function baixarXMLZipado() {
    baixarXMLS();
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