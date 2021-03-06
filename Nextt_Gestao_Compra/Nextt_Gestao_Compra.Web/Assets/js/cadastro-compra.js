﻿var $frmDados, $frmAttr, $frmCusto, $lgdDados, $lgdAttr, $lgdCusto, isResumo = false, statusTransicao = null;

$(document).ready(function myfunction() {
    (function ($) {
        fakewaffle.responsiveTabs(['xs', 'sm']);
    })(jQuery);
    $('.panel-group.responsive').on("show.bs.collapse", ".collapse", function (e) {
        var destino = $(e.target).context.id.replace(/collapse-tab/g, ''), origem = destino;
        var $origemEl = $('.panel-group.responsive').find('.collapse.in');
        var $destinoEl = $(e.target);
        if ($origemEl.length) {
            origem = $origemEl.attr('id').replace(/collapse-tab/g, '');
        }
        if (isMobile) {
            if (origem === 'Dados' || origem === 'Foto' || origem === 'Atributos') {
                if (!validaOperacaoPassoWizard(origem, destino)) {
                    e.preventDefault();
                } else {
                    $('.panel-group.responsive').find('.collapse.in').collapse('hide');
                }
            } else {
                if (!validaOperacaoMudancaAbaWizard(origem, destino)) {
                    e.preventDefault();
                } else {
                    $('.panel-group.responsive').find('.collapse.in').collapse('hide');
                }
            }
        }


    });

    $('.panel-group.responsive').on("hide.bs.collapse", ".collapse", function (e) {

        var currentId = $(e.target).context.id.replace(/collapse-tab/g, '');
        if (isMobile) {
            if ((currentId === 'Dados' || currentId === 'Foto' || currentId === 'Atributos') && !validaOperacaoPassoWizard(currentId, currentId)) {
                e.preventDefault();
            }
        }

    });

    $('#wizard-cad-ped  a.deco-none').click(function (e) {
        var $origemEl = $('#wizard-cad-ped li.active').children()[0];
        var $destinoEl = e.currentTarget;

        var origem = $origemEl.hash.replace('#tab', '');
        var destino = $destinoEl.hash.replace('#tab', '');
        e.preventDefault();

        if ($($destinoEl).parent().index() < $($origemEl).parent().index()) {
            $(this).tab('show');
        }
        else if (origem === 'Dados' || origem === 'Foto' || origem === 'Atributos') {
            if (validaOperacaoPassoWizard(origem, destino)) {
                $(this).tab('show');
                if (destino === 'Pack' && tabelaPackCadastrados.length === 0 &&
                    (!compraId || sessionStorage.getItem("pedidoStatus") === 'A')) {
                    addGrupo(true);
                }
            } else {
                $(this).blur();
            }
        } else {
            if (validaOperacaoMudancaAbaWizard(origem, destino)) {

                $(this).tab('show');
                if (destino === 'Pack' && tabelaPackCadastrados.length === 0 &&
                    (!compraId || sessionStorage.getItem("pedidoStatus") === 'A')) {
                    addGrupo(true);
                }
            } else {
                $(this).blur();
            }
        }

    });
    $(".next-step").click(function (e) {
        var parametroTabIdOrigem = $('#wizard-cad-ped li.active').children()[0].hash.replace('#tab', ''),
            parametroTabIdDestino = $('#wizard-cad-ped li.active').next().children()[0].hash.replace('#tab', '');
        if (parametroTabIdOrigem !== 'Dados' && parametroTabIdOrigem !== 'Foto' && parametroTabIdOrigem !== 'Atributos') {
            if (validaOperacaoMudancaAbaWizard(parametroTabIdOrigem, parametroTabIdDestino)) {
                mudaEtapa('#collapse-tab' + parametroTabIdDestino, '#collapse-tab' + parametroTabIdOrigem);
                if (parametroTabIdDestino === 'Pack' && tabelaPackCadastrados.length === 0 &&
                    (!compraId || sessionStorage.getItem("pedidoStatus") === 'A')) {
                    addGrupo(true);
                }
            }
        } else {
            if (validaOperacaoPassoWizard(parametroTabIdOrigem, parametroTabIdDestino)) {
                mudaEtapa('#collapse-tab' + parametroTabIdDestino, '#collapse-tab' + parametroTabIdOrigem);
                if (parametroTabIdDestino === 'Pack' && tabelaPackCadastrados.length === 0 &&
                    (!compraId || sessionStorage.getItem("pedidoStatus") === 'A')) {
                    addGrupo(true);
                }
            }
        }

    });
    $(".prev-step").click(function (e) {
        var parametroTabIdOrigem = $('#wizard-cad-ped li.active').children()[0].hash.replace('#tab', ''),
            parametroTabIdDestino = $('#wizard-cad-ped li.active').prev().children()[0].hash.replace('#tab', '');
        if (validaOperacaoPassoWizard(parametroTabIdOrigem, parametroTabIdDestino)) {
            mudaEtapa('#collapse-tab' + parametroTabIdDestino, '#collapse-tab' + parametroTabIdOrigem);
        }
    });
    $(".cancel-change").click(function (e) {
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
                var listaProd = sessionStorage.getItem("produtosLista");

                sessionStorage.removeItem('compra');
                sessionStorage.removeItem("pedidoId");
                sessionStorage.removeItem("pedidoStatus");
                if (!compraId || listaProd) {
                    if (listaProd) {
                        window.location = "../gerenciamento/compraprodutos.cshtml";
                    } else {
                        window.location = "../gerenciamento/compra.cshtml";
                    }
                } else {
                    window.location = "../gerenciamento/pedido.cshtml";
                }

            }
        });
    });
    $(".finish-change").click(function (e) {
        console.log(observacaoStatus)
        if (sessionStorage.getItem("pedidoStatus") && sessionStorage.getItem("pedidoStatus") !== 'A') {
            salvarPedidoOpcao();
        }
        else {
            if (validaSalvarPedido()) {

                salvarPedidoOpcao();
            } else if (!isMobile) {
                $("html, body").animate({ scrollTop: 0 }, 'slow');
            }
        }
    });
    $(".cad-prod").click(function (e) {
        if (referenciaGrade.length && coresGrade.length && tamanhosGrade.length) {
            salvarProduto();
        } else {
            erroCadCompra("É necessário inserir ao menos uma cor, um tamanho e uma referência para prosseguir!", "alertCadGrade");
        }

    });
    $(document).on('click', '#btnFinalizar', function (e) {
        console.log(observacaoStatus)
        if (validaSalvarPedido()) {
            atualizarPedidoOpcao('Finalizar Pedido!', 'Este pedido será finalizado e encaminhado para aprovação.', 'F')
            //geraPedidoSalvar('F');
        } else if (!isMobile) {
            $("html, body").animate({ scrollTop: 0 }, 'slow');
        }


    });
    $(document).on('click', '#btnCancelar', function (e) {
        if (permissoesUsuarioLogado.indexOf('Cancelar Qualquer Pedidos') === -1) {
            semAcesso();
        } else {
            atualizarPedidoOpcao('Cancelar Pedido!', 'Este pedido será cancelado ao confirmar essa operação.', 'C')
        }

        //if (observacaoStatus.indexOf('C') > -1) {
        //    alteraStatusPedido('C', sessionStorage.getItem("pedidoId"))
        //}
        //else {
        //    objEnvio = {};
        //    objEnvio.codigo = sessionStorage.getItem("pedidoId");
        //    objEnvio.status = 'C';
        //    atualizarStatus(objEnvio);
        //}

    });
    $(document).on('click', '#btnReprovar', function (e) {
        console.log(observacaoStatus)
        if (permissoesUsuarioLogado.indexOf('Reprovar Qualquer Pedido') === -1) {
            semAcesso();
        } else {
            atualizarPedidoOpcao('Reprovar Pedido!', 'Este pedido será reprovado ao confirmar essa operação.', 'R')
        }

        //if (observacaoStatus.indexOf('R') > -1) {
        //    alteraStatusPedido('R', sessionStorage.getItem("pedidoId"))
        //}
        //else {
        //    objEnvio = {};
        //    objEnvio.codigo = sessionStorage.getItem("pedidoId");
        //    objEnvio.status = 'R';
        //    atualizarStatus(objEnvio);
        //}
    });
    $(document).on('click', '#btnAprovar', function (e) {
        if (permissoesUsuarioLogado.indexOf('Aprovar Qualquer Pedidos') === -1) {
            semAcesso();
        } else {
            atualizarPedidoOpcao('Aprovar Pedido!', 'Este pedido será aprovado ao confirmar essa operação.', 'L')
        }

        //if (observacaoStatus.indexOf('L') > -1) {
        //    alteraStatusPedido('L', sessionStorage.getItem("pedidoId"))
        //}
        //else {
        //    objEnvio = {};
        //    objEnvio.codigo = sessionStorage.getItem("pedidoId");
        //    objEnvio.status = 'L';
        //    atualizarStatus(objEnvio);
        //}

    });
    $(document).on('click', '#btnDevolver', function (e) {
        if (permissoesUsuarioLogado.indexOf('Reprovar para Editar Qualquer Pedidos') === -1) {
            semAcesso();
        } else {
            atualizarPedidoOpcao('Devolver Pedido!', 'Este pedido retornará para o status aberto, possibilitando alterações.', 'A')
        }

        //origemModal = true;
        //if (observacaoStatus.indexOf('A') > -1) {
        //    alteraStatusPedido('A', sessionStorage.getItem("pedidoId"))
        //}
        //else {
        //    objEnvio = {};
        //    objEnvio.codigo = sessionStorage.getItem("pedidoId");
        //    objEnvio.status = 'A';
        //    atualizarStatus(objEnvio);
        //};

    });
});
function mudaEtapa(elemShow, elemHide) {
    $(elemShow).collapse("show");
    $(elemHide).collapse("hide");
    $('#wizard-cad-ped a[href="#' + elemShow.replace('#collapse-', '') + '"]').tab('show');
}
function validaOperacaoPassoWizard(parametroTab, evento) {
    if (!compraId || sessionStorage.getItem("pedidoStatus") === 'A') {
        if (evento !== 'back' && evento !== 'nextt') {
            switch (parametroTab) {
                case 'Dados':
                    return validaAbaDadosCamposObrigatorios(parametroTab, evento);
                case 'Foto':
                    var retorno = validaAbaFotoCamposObrigatorios(parametroTab, evento);
                    if (retorno && (cadastroNovoSession || (cadastroNovoProduto && cadastroNovoProduto === '0'))) {
                        var $refEl = $('#drpReferenciaGrade')
                        if ($refEl.find('option').length == 0) {
                            var refNova = $('#txtRefPed').val().trim();
                            $('#drpReferenciaGrade').append(cadastraReferencia(refNova));
                            $('#drpReferenciaGrade').selectpicker('refresh');
                            if ($('#drpReferenciaGrade').val()) {
                                referenciaGrade = $('#drpReferenciaGrade').val();
                                reiniciaTbGrade()
                                if (tamanhosGrade.length || referenciaGrade.length || coresGrade.length) {
                                    var dados = cargaReferencia(coresGrade.length, tamanhosGrade.length)
                                    criarCargaGradePackPadrao(dados)
                                }
                            }
                        }
                    }
                    return retorno
                case 'Atributos':
                    return validaAttrCadastrado();
                case 'Grade':
                    return true;//
                case 'Resumo':
                    return true;//
                case 'Pack':
                    return validaGrade(evento);
                case 'Distribuicao':
                    return validaPacksCadastradosExiste();
            }
        } else {
            switch (parametroTab) {
                case 'Dados':
                    return validaAbaDadosCamposObrigatorios(parametroTab, evento);
                case 'Foto':
                    var retorno = validaAbaFotoCamposObrigatorios(parametroTab, evento);
                    return retorno
                case 'Atributos':
                    return validaAttrCadastrado();
                case 'Resumo':
                    return true;//
                case 'Grade':
                    return true; //
                case 'Pack':
                    return validaGrade(evento);
                case 'Distribuicao':
                    return validaPacksCadastradosExiste();
            }
        }
    } else {
        return true;
    }


}
function validaGrade(evento) {
    if ((!tamanhosGrade.length > 0 || !coresGrade.length > 0 || !referenciaGrade.length > 0) && evento === 'Pack') {
        erroCadCompra("É necessário inserir ao menos uma cor, um tamanho e uma referência para prosseguir!", "alertCadGrade");
    }
    var retorno = tamanhosGrade.length > 0 && coresGrade.length > 0 && referenciaGrade.length > 0;
    if (retorno && evento === 'Pack' && gradeAlterada) {
        gradeAlterada = false;
        addColunaPack();
    }
    return retorno || evento !== 'Pack';
}
function validaDadosCompra(evento) {
    var isValido = true, validacao = null;
    if (evento === 'Dados') validacao = validacaoOcultarAbaDados();
    else if (validaOperacaoPassoWizard(evento, evento)) validacao = validacaoAvancarAbaDados();
    else {
        erroCadCompra('Antes de avançar para a etapa de ' + evento + ' é necessário concluir as etapas anteriores!', "alertDadosCompra");
        isValido = false;
    }
    if (isValido && validacao) {
        isValido = false;
        erroCadCompra(validacao.textoMensagem, "alertDadosCompra");
        criaTimeOut(validacao.isInput, validacao.elemento);
    }
    return isValido;
}
function validaOperacaoMudancaAbaWizard(origemTab, destinoTab) {

    var isValido = (origemTab == "Resumo" && destinoTab == 'Dados' || destinoTab == 'Resumo') ? true : validaOperacaoPassoWizard(destinoTab, destinoTab);
    if (origemTab === 'Foto' && !isValido) {
        erroCadCompra('Antes de avançar para o passo de ' + destinoTab + ', é necessário concluir os passos anteriores!', "alertEditaImg");
    }
    return isValido;
}
function criaTimeOut(isNotSelect, elemento) {
    if (isMobile) {
        setTimeout(function () {
            if (elemento && !elemento.hasClass('imagemSalvar')) {
                var $frmScroll = $(elemento).closest('fieldset');
                $('html, body').animate({ scrollTop: $frmScroll.offset().top }, 500);
            } else {
                $("html, body").animate({ scrollTop: $(document).height() }, 500);
            }

            setTimeout(function () {
                if (elemento && !elemento.hasClass('imagemSalvar')) isNotSelect ? elemento.focus().select() : elemento.selectpicker('toggle');
            }, 500);
        }, 6500);
    } else {
        setTimeout(function () {
            if (elemento && !elemento.hasClass('imagemSalvar'))
                isNotSelect ?
                    elemento.focus().select() :
                    elemento.selectpicker('toggle');
            else {
                $("html, body").animate({ scrollTop: 0 }, 500);
            }
        }, 200);
    }
}
function recolheFieldsetDados(expande) {
    $frmDados = $('#frmDados'); $frmCusto = $('#frmCusto'), $frmAttr = $('#frmAttrProd');
    $lgdDados = $frmDados.children("legend"); $lgdCusto = $frmCusto.children("legend"), $lgdAttr = $frmAttr.children("legend");

    switch (expande) {
        case 1:
            if ($frmDados.hasClass('collapsed')) $lgdDados.click();
            if (!$frmAttr.hasClass('collapsed')) $lgdAttr.click();
            if (!$frmCusto.hasClass('collapsed')) $lgdCusto.click();
            break;
        case 2:
            if (!$frmDados.hasClass('collapsed')) $lgdDados.click();
            if (!$frmAttr.hasClass('collapsed')) $lgdAttr.click();
            if ($frmCusto.hasClass('collapsed')) $lgdCusto.click();
            break;
        case 3:
            if (!$frmDados.hasClass('collapsed')) $lgdDados.click();
            if (!$frmCusto.hasClass('collapsed')) $lgdCusto.click();
            if ($frmAttr.hasClass('collapsed')) $lgdAttr.click();
            break;
        case 4:
            if (!$frmDados.hasClass('collapsed')) $lgdDados.click();
            if (!$frmCusto.hasClass('collapsed')) $lgdCusto.click();
            if (!$frmAttr.hasClass('collapsed')) $lgdAttr.click();
            break;
    }
}
function validacaoOcultarAbaDados() {
    var retorno = null;
    if ($("#txtCadCondPgtoPed").val().length > 0) {
        retorno = {};
        retorno.field = 2;
        retorno.elemento = $("#txtCadCondPgtoPed");
        retorno.isInput = true;
        retorno.textoMensagem = 'Você iniciou um cadastro de uma condição de pagamento. Conclua ou cancele para recolher esta aba!';
    } else if (!$("#drpCNPJ").val()) {
        retorno = {};
        retorno.field = 2;
        retorno.elemento = $("#drpCNPJ");
        retorno.textoMensagem = 'É necessário selecionar um fornecedor antes de prosseguir';
    }
    else if (!$("#drpFrmPgtoPed").val()) {
        retorno = {};
        retorno.field = 2;
        retorno.elemento = $("#drpFrmPgtoPed");
        retorno.textoMensagem = 'É necessário selecionar uma forma de pagamento para recolher esta aba!';
    } else if (!$("#drpCondPgtoPed").val()) {
        retorno = {};
        retorno.field = 2;
        retorno.elemento = $("#drpCondPgtoPed");
        retorno.textoMensagem = 'É necessário selecionar uma condição de pagamento para recolher esta aba!';
    } else if (!$("#drpCompPed").val()) {
        retorno = {};
        retorno.field = 2;
        retorno.elemento = $("#drpCompPed");
        retorno.textoMensagem = 'É necessário selecionar um comprador para recolher esta aba!';
    } else if ($("#txtQldNotaPed").maskMoney('unmasked')[0] === 0) {
        retorno = {};
        retorno.field = 2;
        retorno.elemento = $("#txtQldNotaPed");
        retorno.isInput = true;
        retorno.textoMensagem = 'É necessário informar um porcentagem para qualidade de nota para recolher esta aba!';
    } else if ($("#txtQldProdPed").maskMoney('unmasked')[0] === 0) {
        retorno = {};
        retorno.field = 2;
        retorno.elemento = $("#txtQldProdPed");
        retorno.isInput = true;
        retorno.textoMensagem = 'É necessário informar um porcentagem para quantidade de nota para recolher esta aba!';
    } else if (!validaAttrCadastrado($("#pnlAttrPed"))) {
        retorno = {};
        //retorno.field = 2;
        //retorno.elemento = $("#txtQldProdPed");
        //retorno.isInput = true;
        retorno.textoMensagem = 'É necessário informar os atributos obrigatórios antes de prosseguir!';
    }
    return retorno;
}
function validacaoAvancarAbaDados() {
    var retorno = null;
    if ($("#txtCadCondPgtoPed").val().length > 0) {
        retorno = {};
        retorno.field = 2;
        retorno.elemento = $("#txtCadCondPgtoPed");
        retorno.isInput = true;
        retorno.textoMensagem = 'Você iniciou um cadastro de uma condição de pagamento. Conclua ou cancele antes de prosseguir!';
    } else if (!$("#drpCNPJ").val()) {
        retorno = {};
        retorno.field = 2;
        retorno.elemento = $("#drpCNPJ");
        retorno.textoMensagem = 'É necessário selecionar um fornecedor antes de prosseguir';
    }
    else if (!$("#drpFrmPgtoPed").val()) {
        retorno = {};
        retorno.field = 2;
        retorno.elemento = $("#drpFrmPgtoPed");
        retorno.textoMensagem = 'É necessário selecionar uma forma de pagamento antes de prosseguir';
    } else if (!$("#drpCondPgtoPed").val()) {
        retorno = {};
        retorno.field = 2;
        retorno.elemento = $("#drpCondPgtoPed");
        retorno.textoMensagem = 'É necessário selecionar uma condição de pagamento antes de prosseguir!';
    } else if (!$("#drpCompPed").val()) {
        retorno = {};
        retorno.field = 2;
        retorno.elemento = $("#drpCompPed");
        retorno.textoMensagem = 'É necessário selecionar um comprador antes de prosseguir!';
    } else if ($("#txtQldNotaPed").maskMoney('unmasked')[0] === 0) {
        retorno = {};
        retorno.field = 2;
        retorno.elemento = $("#txtQldNotaPed");
        retorno.isInput = true;
        retorno.textoMensagem = 'É necessário informar um porcentagem para qualidade de nota antes de prosseguir!';
    } else if ($("#txtQldProdPed").maskMoney('unmasked')[0] === 0) {
        retorno = {};
        retorno.field = 2;
        retorno.elemento = $("#txtQldProdPed");
        retorno.isInput = true;
        retorno.textoMensagem = 'É necessário informar um porcentagem para quantidade de nota antes de prosseguir!';
    } else if (!validaAttrCadastrado($("#pnlAttrPed"))) {
        retorno = {};
        //retorno.field = 2;
        //retorno.elemento = $("#txtQldProdPed");
        //retorno.isInput = true;
        retorno.textoMensagem = 'É necessário informar os atributos obrigatórios antes de prosseguir!';
    }
    return retorno;
}
function validaAbaDadosCamposObrigatorios(parametroTab, evento) {
    var isValido = true, retornoValidado = null;

    parametroTab === 'Dados' ?
        retornoValidado = validacaoOcultarAbaDados() :
        validaOperacaoPassoWizard(parametroTab, parametroTab) ?
            retornoValidado = validacaoAvancarAbaDados() :
            isValido = false;
    if (evento !== 'Foto' && evento !== 'Dados') {
        if (validaDadosProduto() || validaImagensPendentes()) {
            isValido = false;
        }
    }

    if (isValido && retornoValidado) {
        isValido = false;
        erroCadCompra(retornoValidado.textoMensagem, "alertDadosCompra");
        criaTimeOut(retornoValidado.isInput, retornoValidado.elemento);
    } else if (!isValido) {
        erroCadCompra('Antes de avançar para a etapa de ' + evento + ' é necessário concluir as etapas anteriores!', "alertDadosCompra");
    }
    return isValido;
}
function validaAbaFotoCamposObrigatorios(parametroTab, evento) {
    console.log(parametroTab);
    console.log(evento);

    var isValido = true;
    var retornoValidado = validaDadosProduto();

    if (!retornoValidado && parametroTab !== evento)
        parametroTab === 'Foto' ?
            retornoValidado = validaImagensPendentes() :
            validaOperacaoPassoWizard(parametroTab, parametroTab) ?
                retornoValidado = validacaoAvancarAbaDados() :
                isValido = false;
    if (isValido && retornoValidado) {
        isValido = false;
        recolheFieldsetDados(retornoValidado.field);
        erroCadCompra(retornoValidado.textoMensagem, "alertEditaImg");
        criaTimeOut(retornoValidado.isInput, retornoValidado.elemento);
    } else if (!isValido) {
        erroCadCompra('Antes de avançar para a etapa de ' + evento + ' é necessário concluir as etapas anteriores!', "alertEditaImg");
    }
    return isValido;
}

function validaImagensPendentes() {
    var retorno = null, imagensPendentes = $('#imgUpload').fileinput('getFileStack').length === 0;
    if (!cadastroNovoSession) {
        if (imagensPendentes) {
            retorno = {};
            retorno.field = 3;
            retorno.elemento = $('#imgUpload');
            retorno.textoMensagem = 'É necessário salvar ou excluir as fotos pendentes realizar esta operação!';
        }
    }
    return null;
}
function validaDadosProduto() {
    //Aba Dados Produto
    var $codProdEl = $("#txtProdutoPed"), $refFornEl = $("#txtRefPed"), $custoEl = $("#txtCustoBrutoPed"), $descPedEl = $("#txtDescPed"), $desResPedEl = $("#txtDescResPed"),
        $marcProdEl = $('#drpMarc'), $compProdEl = $('#drpCompProd'), $secProdEl = $('#drpSec'), $segProdEl = $('#drpSeg'), $espProdEl = $('#drpEsp'), $classProdEl = $('#drpClassificacao'), $uniMedEl = $('#drpUnidadeMed');
    var codProd = $codProdEl.val(), custo = $custoEl.maskMoney('unmasked')[0], refForn = $refFornEl.val(), descPed = $descPedEl.val(), desResPed = $desResPedEl.val(),
        marcProd = $marcProdEl.val(), compProd = $compProdEl.val(), secProd = $secProdEl.val(), segProd = $segProdEl.val(), espProd = $espProdEl.val(), classProd = $classProdEl.val(), uniMed = $uniMedEl.val();
    var retorno = null, uniMedHasOpt = $uniMedEl.find('option').length > 1;

    console.log($compProdEl.find('option:selected'))
    if (!marcProd.length) {
        retorno = {};
        retorno.field = 1;
        retorno.elemento = $marcProdEl;
        retorno.textoMensagem = 'É necessário selecionar uma marca para realizar esta operação!';
    } else if (segTratado && !segProd.length) {
        retorno = {};
        retorno.field = 1;
        retorno.elemento = $segProdEl;
        retorno.textoMensagem = 'É necessário selecionar um segmento para realizar esta operação!';
    } else if (!secProd.length) {
        retorno = {};
        retorno.field = 1;
        retorno.elemento = $secProdEl;
        retorno.textoMensagem = 'É necessário selecionar uma seção para realizar esta operação!';
    } else if (!espProd.length) {
        retorno = {};
        retorno.field = 1;
        retorno.elemento = $espProdEl;
        retorno.textoMensagem = 'É necessário selecionar uma espécie para realizar esta operação!';
    } else if (!$compProdEl.find('option:selected').length) {
        retorno = {};
        retorno.field = 1;
        retorno.elemento = $compProdEl;
        retorno.textoMensagem = 'É necessário selecionar um comprador para realizar esta operação!';
    } else if (!uniMed.length) {
        retorno = {};
        retorno.field = 1;
        retorno.elemento = $uniMedEl;
        retorno.textoMensagem = 'É necessário selecionar uma unidade de medida para realizar esta operação!';
    }
    //else if ($("#txtPrVendaPed").maskMoney('unmasked')[0] === 0) {
    //    retorno = {};
    //    retorno.field = 1;
    //    retorno.elemento = $("#txtPrVendaPed");
    //    retorno.isInput = true;
    //    retorno.textoMensagem = 'É necessário informar um valor de venda para realizar esta operação!';
    //}
    else if (!classProd.length) {
        retorno = {};
        retorno.field = 1;
        retorno.elemento = $classProdEl;
        retorno.textoMensagem = 'É necessário informar a classificação fiscal para realizar esta operação!';
    }
    else if (!refForn.length) {
        retorno = {};
        retorno.field = 1;
        retorno.isInput = true;
        retorno.elemento = $refFornEl;
        retorno.textoMensagem = 'É necessário informar a referência para realizar esta operação!';
    } else if (!descPed.length) {
        retorno = {};
        retorno.isInput = true;
        retorno.elemento = $descPedEl;
        retorno.textoMensagem = 'É necessário informar a descrição do produto para realizar esta operação!';
    } else if (!desResPed.length) {
        retorno = {};
        retorno.field = 1;
        retorno.isInput = true;
        retorno.elemento = $desResPedEl;
        retorno.textoMensagem = 'É necessário informar a descrição resumida do produto para realizar esta operação!';
    } else if (!custo && $("#frmCusto").length) {
        retorno = {};
        retorno.field = 2;
        retorno.isInput = true;
        retorno.elemento = $custoEl;
        retorno.textoMensagem = 'É necessário informar o custo do produto para realizar esta operação!';
    } else if (!validaAttrCadastrado($("#pnlAttrProd"))) {
        retorno = {};
        var attrEl = retornaAttrProdInvalido($("#pnlAttrProd"));
        console.log(attrEl);
        retorno.field = 3;
        retorno.elemento = attrEl.elemento;
        retorno.isInput = attrEl.isInput;
        retorno.textoMensagem = 'É necessário informar os atributos obrigatórios antes de prosseguir!';
    } else if (validaPrecoObrigatorio()) {
        retorno = {};
        var attrEl = validaPrecoObrigatorio();
        retorno.field = 4;
        retorno.elemento = attrEl.elemento;
        retorno.isInput = attrEl.isInput;
        retorno.textoMensagem = 'É necessário informar os preçoes de venda obrigatórios antes de prosseguir!';
    }
    return retorno;
}
function validaPrecoObrigatorio() {
    var eleInvalido = null;
    var elsPreco = $('.prVenda.validaPrEmpresa');
    for (var i = 0; i < elsPreco.length; i++) {
        if ($(elsPreco[i]).maskMoney('unmasked')[0] === 0) {
            eleInvalido = {};
            eleInvalido.elemento = $(elsPreco[i]);
            eleInvalido.isInput = true;
            break;
        }
    }
    return eleInvalido;
}
function retornaAttrProdInvalido(pnl) {
    var eleInvalido = null;
    var elsAtributo = pnl.find('.validarAttr').not('div');
    for (var i = 0; i < elsAtributo.length; i++) {
        if (!$(elsAtributo[i]).hasClass('attrTexto') &&
            !$(elsAtributo[i]).hasClass('attrData') &&
            !$(elsAtributo[i]).hasClass('attrBool') &&
            !$(elsAtributo[i]).hasClass('listAttr')) {
            if ($(elsAtributo[i]).maskMoney('unmasked')[0] === 0) {
                eleInvalido = {};
                eleInvalido.elemento = $(elsAtributo[i]);
                eleInvalido.isInput = true;
            }
        } else if ($(elsAtributo[i]).hasClass('listAttr')) {
            if (!$(elsAtributo[i]).val()) {
                eleInvalido = {};
                eleInvalido.elemento = $(elsAtributo[i]);
                eleInvalido.isInput = false;
            }
        } else if ($(elsAtributo[i]).hasClass('attrBool')) {
            if ($(elsAtributo[i]).bootstrapSwitch('indeterminate')) {
                eleInvalido = {};
                eleInvalido.elemento = $(elsAtributo[i]);
                eleInvalido.isInput = true;
            }
        } else {
            if (!$(elsAtributo[i]).val()) {
                eleInvalido = {};
                eleInvalido.elemento = $(elsAtributo[i]);
                eleInvalido.isInput = true;
            }
        }
        if (eleInvalido) break;
    }
    return eleInvalido;
}
function validaAttrCadastrado(el) {
    var valido = true;
    var validaTexto = el.find('.attrTexto.validarAttr');
    var validaNum = el.find('.attrNum.validarAttr');
    var validaMon = el.find('.attrMon.validarAttr');
    var validaPer = el.find('.attrPerc.validarAttr');
    var validaDt = el.find('.attrData.validarAttr');
    var validabol = el.find('.attrBool.validarAttr');
    var validaList = el.find('.selectpicker.listAttr.validarAttr');
    valido = validaElemento(validaTexto, 0) && validaElemento(validaNum, 1) && validaElemento(validaPer, 2) &&
        validaElemento(validaMon, 3) && validaElemento(validaDt, 4) && validaElemento(validabol, 5) && validaElemento(validaList, 6);
    return valido;
}
function validaElemento(elAttr, tipo) {
    var valido = true;

    for (var i = 0; i < elAttr.length; i++) {

        if (tipo === 0 && !$(elAttr[i]).val().length) {
            valido = false;
        }
        if (tipo === 1 && $(elAttr[i]).maskMoney('unmasked')[0] === 0) {
            valido = false;
        }
        if (tipo === 2 && $(elAttr[i]).maskMoney('unmasked')[0] === 0) {
            valido = false;
        }
        if (tipo === 3 && $(elAttr[i]).maskMoney('unmasked')[0] === 0) {
            valido = false;
        }
        if (tipo === 4 && !$(elAttr[i]).val().length) {
            valido = false;
        }
        if (tipo === 5 && $(elAttr[i]).bootstrapSwitch('indeterminate')) {
            valido = false;
        }
        if (tipo === 6 && !$(elAttr[i]).val() || !$(elAttr[i]).val().length) {
            valido = false;
        }
        if (!valido) {
            break;
        }
    }
    return valido;
}
function atualizaCodigoProduto() {
    var idSecao = $("#drpSec").val().split('-')[0];
    var idEspecie = $("#drpEsp").val().split('-')[0];
    var codProd = '00000';
    if (idSecao.length > 0) {
        idSecao.length === 1 ? codProd = '00' + idSecao : idSecao.length === 2 ? codProd = '0' + idSecao : codProd = idSecao;
        idEspecie.length === 1 ? codProd += '0' + idEspecie : idEspecie.length === 2 ? codProd += idEspecie : codProd += '00';
    }
    $("#txtProdutoPed").val(codProd);

}
function continuarCompraProdNovo() {
    $.confirm({
        icon: 'fa fa-gift',
        type: 'blue',
        title: 'Atenção!',
        content: 'Deseja continuar comprando novos produtos desse fornecedor?',
        containerFluid: true,
        buttons: {
            confirm: {
                text: 'Sim',
                btnClass: 'btn-success',
                action: function () {
                    resetarCadastro();
                }
            },
            cancel: {
                text: 'Não',
                btnClass: 'btn-danger',
                action: function () {
                    $(".bg_load").show();
                    $(".wrapper").show();
                    sessionStorage.removeItem('compra');
                    sessionStorage.removeItem('pedidoId');
                    sessionStorage.removeItem("cadastroNovo");
                    window.location = "../gerenciamento/compra.cshtml";
                }
            },
        },
    });
}
function validaExibeMsgAttr() {
    var tabAtiva =
        isMobile ?
            $('.panel-group.responsive').find('.collapse.in').attr('id').replace(/collapse-tab/g, '') :
            $('#wizard-cad-ped li.active').children()[0].hash.replace('#tab', '');
    console.log(tabAtiva);
    return tabAtiva === 'Atributos';
}
function insereVlrVendaObrigatorio() { 
    $('.prVenda.validaPrEmpresa').each(function () {
        $(this).removeClass('validaPrEmpresa');
    })
    $('.frmPrecosVenda .obrigatorio').each(function () {
        if (!$(this).hasClass('ocultarElemento')) {
            $(this).addClass('ocultarElemento');
        }
        
    })
    var empresas = $('#drpMarc option:selected').attr('data-empresa-obrigatorio');
    
    if (empresas) {
        empresas.split(',').map(obj => {
            console.log(converterFormatoVariavel(obj.trim()))
            $("#frm" + converterFormatoVariavel(obj.trim())).find('.prVenda').addClass('validaPrEmpresa');
            $("#frm" + converterFormatoVariavel(obj.trim())).find('.obrigatorio').removeClass('ocultarElemento')
        })
    }
}