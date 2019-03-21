var tbPedidoNF, idsPedAdd = [], idCadNF = sessionStorage.getItem("idNFEditar"), statusAtual = null, tabPacKEntradagridNome, titPack = undefined,
    avanca = false, retorna = false, specialKeys = new Array(), limiteDescAdd = 0, cancelaTitGerado = false;
specialKeys.push(8); //Backspace
specialKeys.push(43); // +
specialKeys.push(13); // ENTER
var idPedidoPackAddClicado = 0;
$(document).ready(function () {
    (function ($) {
        fakewaffle.responsiveTabs(['xs', 'sm']);
    })(jQuery);
    $('.panel-group.responsive').on("show.bs.collapse", ".collapse", function (e) {
        //var destino = $(e.target).context.id.replace(/collapse-tab/g, ''), origem = destino;
        //var $origemEl = $('.panel-group.responsive').find('.collapse.in');
        //var $destinoEl = $(e.target);
        //if ($origemEl.length) {
        //    origem = $origemEl.attr('id').replace(/collapse-tab/g, '');
        //}
        //if (isMobile) {
        //    if (origem === 'Dados' || origem === 'Foto' || origem === 'Atributos') {
        //        if (!validaOperacaoPassoWizard(origem, destino)) {
        //            e.preventDefault();
        //        } else {
        //            $('.panel-group.responsive').find('.collapse.in').collapse('hide');
        //        }
        //    } else {
        //        //if (!validaOperacaoMudancaAbaWizard(origem, destino)) {
        //        //    e.preventDefault();
        //        //} else {
        //        $('.panel-group.responsive').find('.collapse.in').collapse('hide');
        //        //}
        //    }
        //}


    });

    $('.panel-group.responsive').on("hide.bs.collapse", ".collapse", function (e) {

        var currentId = $(e.target).context.id.replace(/collapse-tab/g, '');
        if (isMobile) {
            if ((currentId === 'Dados' || currentId === 'Foto' || currentId === 'Atributos') && !validaOperacaoPassoWizard(currentId, currentId)) {
                e.preventDefault();
            }
        }

    });
    $('.money').maskMoney({ prefix: 'R$ ', thousands: '.', allowZero: true, decimal: ',', selectAllOnFocus: true });
    $('.money').maskMoney('mask');
    $('#wizard-cad-nf  a.deco-none').click(function (e) {
        var $origemEl = $('#wizard-cad-nf li.active').children()[0];
        var $destinoEl = e.currentTarget;
        $('.tab-content-main').removeClass().addClass('tab-content tab-content-main responsive');
        var origem = $origemEl.hash.replace('#tab', '');
        var destino = $destinoEl.hash.replace('#tab', '');
        e.preventDefault();

        if ($($destinoEl).parent().index() < $($origemEl).parent().index()) {
            $(this).tab('show');
            if (destino === 'Duplicata') $('.tab-content-main').addClass('duplicata');
            else if (destino === 'Pedido') $('.tab-content-main').addClass('pedido');
        }
        if (validaOperacaoMudancaAbaWizardNF(origem)) {
            if (destino === 'Duplicata') $('.tab-content-main').addClass('duplicata');
            else if (destino === 'Pedido') $('.tab-content-main').addClass('pedido');
            $(this).tab('show');
        }
    });
    $(document).on('click', '.add-pedido', function (evento) {
        if (permissoesUsuarioLogado.indexOf('Adicionar Novo Pedido a NF') === -1) {
            semAcesso();
        } else {
            $('.selectpicker').selectpicker('hide');
            $("#modalLoad").show();
            $("#modalwrapper").show();
            $('#modalConsultaPedido').modal({
                backdrop: 'static',
                keyboard: false
            });
        }


    })
    $('#modalConsultaPedido').on('shown.bs.modal', function (evento) {
        tbPedidoNF.clear().draw();
        idsPedAdd = [];
        $('.selectpicker').selectpicker('show');
        $("#modalLoad").fadeOut("slow");
        $("#modalwrapper").fadeOut("slow");



    })
    $(document).on('changed.bs.select', '.selectpicker.cbTipoDescGrid', function (e, clickedIndex, isSelected, previousValue) {
        var linha = $(this).closest('tr');
        var tbPlanejamento = $('#tabelaDescTit').dataTable().api()
        tbPlanejamento.row($(linha)).data().tipo = Number($(this).selectpicker('val'));
        recalculaTotalNFTit(tbPlanejamento);
    });
    $(document).on('click', '.excluirDesc', function (evento) {
        if (permissoesUsuarioLogado.indexOf('Gerenciar Descontos/Acrescimos dos Titulos da NF') === -1) {
            semAcesso();
        } else {

            if (!cancelaTitGerado) {
                var tbPlanejamento = $('#tabelaDescTit').dataTable().api();
                tbPlanejamento.row($(this).closest('tr')).remove().draw();
                recalculaTotalNFTit(tbPlanejamento);
            } else {

                $.confirm({
                    title: 'Atenção!',
                    content: 'Não é possivel executar esta operação, pois já existem titulos confirmados!',
                    icon: 'fa fa-warning',
                    theme: 'modern',
                    closeIcon: false,
                    animation: 'scale',
                    typeAnimated: true,
                    type: 'orange',
                    buttons: {
                        okButton: {
                            text: 'OK'
                        }
                    },

                });
            }
        }

    })
    $(document).on('click', '.gera-titulo', function (evento) {
        if (permissoesUsuarioLogado.indexOf('Gerar Titulos da NF') === -1) {
            semAcesso();
        } else {
            if ($('#drpTpDoc').val() && $('#drpGrpEmpDup').val() && $('#txtCadCondPgtoNF').val().length) {
                $('.selectpicker').selectpicker('hide');
                $(".navbar.navbar-default.navbar-fixed-top").addClass('ocultarElemento');
                $(".bg_load").show();
                $(".wrapper").show();
                var tbPlanejamento = $('#tabelaDescTit').dataTable().api();
                tbPlanejamento.data().toArray();
                criaObjGeraTituloNF(tbPlanejamento.data().toArray());
            } else {

                $.confirm({
                    title: 'Atenção!',
                    content: 'Preencha todos os campos obrigatórios antes de prosseguir!',
                    icon: 'fa fa-warning',
                    theme: 'modern',
                    closeIcon: false,
                    animation: 'scale',
                    typeAnimated: true,
                    type: 'orange',
                    buttons: {
                        okButton: {
                            text: 'OK'
                        }
                    },

                });
            }
        }
    })
    $(document).on('click', '.cancela-titulo', function (evento) {
        if (permissoesUsuarioLogado.indexOf('Cancelar Titulos da NF') === -1) {
            semAcesso();
        } else {
            retornaDadosTbTitulosGerados([]);
        }
    })
    $(document).on('click', '.confirma-titulo', function (evento) {
        if (permissoesUsuarioLogado.indexOf('Confirmar Titulos da NF') === -1) {
            semAcesso();
        } else {
            $('.selectpicker').selectpicker('hide');
            $(".navbar.navbar-default.navbar-fixed-top").addClass('ocultarElemento');
            $(".bg_load").show();
            $(".wrapper").show();
            var tbPlanejamento = $('#tabelaDuplicatas').dataTable().api();
            criaObjConfirmaTituloNF(tbPlanejamento.data().toArray());
        }
    })
    $(document).on('click', 'td.percent', function (e) {
        if (permissoesUsuarioLogado.indexOf('Gerenciar Descontos/Acrescimos dos Titulos da NF') === -1) {
            semAcesso();
        } else {
            if (!cancelaTitGerado) {
                cell = this;

                if ($(this).is('td') && !$(this).find('input').length) {
                    row = $(this).closest('tr');
                    gridNome = 'tabelaDescTit';
                    $(row).children('td:not(:first)').remove();
                    $(row).append($.parseHTML(geraEditorDesc('Percentual', $(cell).html().replace(/[^\d\-\,]/g, "").replace(',', '.'))))

                    //$(this).html(geraEditorDesc('Percentual', $(cell).html().replace(/[^\d\-\,]/g, "").replace(',', '.')));
                    $(".descPerc").maskMoney({ suffix: '%', decimal: ',', allowZero: true, selectAllOnFocus: true });
                    $(row).find('input[type="text"]').focus();
                    //$(this).find('input[type="text"]').focus();
                }
            } else {

                $.confirm({
                    title: 'Atenção!',
                    content: 'Não é possivel executar esta operação, pois já existem titulos confirmados!',
                    icon: 'fa fa-warning',
                    theme: 'modern',
                    closeIcon: false,
                    animation: 'scale',
                    typeAnimated: true,
                    type: 'orange',
                    buttons: {
                        okButton: {
                            text: 'OK'
                        }
                    },

                });
            }
        }
    });
    $(document).on('click', 'td.money', function (e) {
        if (permissoesUsuarioLogado.indexOf('Gerenciar Descontos/Acrescimos dos Titulos da NF') === -1) {
            semAcesso();
        } else {
            if (!cancelaTitGerado) {
                cell = this;
                if ($(this).is('td') && !$(this).find('input').length) {
                    row = $(this).closest('tr');
                    gridNome = 'tabelaDescTit';
                    $(row).children('td:not(:first)').remove();
                    $(row).append($.parseHTML(geraEditorDesc('Monetario', $(cell).html().replace(/[^\d\-\,]/g, "").replace(',', '.'))));
                    $(".descMon").maskMoney({ prefix: 'R$ ', thousands: '.', allowZero: true, decimal: ',', selectAllOnFocus: true });
                    $(row).find('input[type="text"]').focus();
                }
            } else {

                $.confirm({
                    title: 'Atenção!',
                    content: 'Não é possivel executar esta operação, pois já existem titulos confirmados!',
                    icon: 'fa fa-warning',
                    theme: 'modern',
                    closeIcon: false,
                    animation: 'scale',
                    typeAnimated: true,
                    type: 'orange',
                    buttons: {
                        okButton: {
                            text: 'OK'
                        }
                    },

                });
            }
        }
    });
    $('#tabNFPedido').on('click', '.close', function (evento) {
        if (permissoesUsuarioLogado.indexOf('Excluir Pedido de NF') === -1) {
            semAcesso();
        } else {
            if (statusAtual == 'ED' || !statusAtual) {

                evento.preventDefault();
                var tabID = $(this).parents('a').attr('href');
                var $tabRemover = $(this).parents('li');
                $tabRemover.remove();
                $(tabID).remove();
                enableDisableCamposNota($("#tabNFPedido li").children("a:not('.add-pedido')").length == 0)
                $("#tabNFPedido li").children("a:not('.add-pedido')").first().click();
            }
        }
    });
    $(document).on('click', '.tabPacksEntrada .close', function (evento) {
        if (permissoesUsuarioLogado.indexOf('Excluir Pack da NF') === -1) {
            semAcesso();
        } else {
            if (statusAtual == 'ED' || !statusAtual) {
                evento.preventDefault();
                var ulGrupoClicado = $(this).closest('ul').attr('id');
                var tabID = $(this).parents('a').attr('href');
                var tabClass = $(this).parents('a').attr('class');

                var $tabRemover = $(this).parents('li');
                $tabRemover.remove();

                $(tabID).remove();
                var ul = $("#" + ulGrupoClicado + " li");
                var id = 1;
                var btnExcP = '<button style="margin-left: 7px;color:red!important;opacity: 0.5;" data-toggle="tooltip" class="close" type="button" title="Excluir Pack"> ×</button>';
                for (var i = 0; i < ul.length; i++) {
                    if ($(ul[i]).children('a').hasClass(tabClass)) {
                        $(ul[i]).children('a').text(function (i, txt) { return txt.replace(/\d+/, id); });
                        var desc = $.trim($(ul[i]).children('a').text())
                        console.log(desc);

                        console.log(desc.slice(0, desc.length - 1))
                        $(ul[i]).children('a').html('<i class="fa fa-pie-chart" aria-hidden="true"></i> ' + desc.slice(0, desc.length - 1) + btnExcP)
                    }
                }
                $('[data-toggle="tooltip"]').tooltip();
                $("#" + ulGrupoClicado + " li").children("a:not('.add-pack')").first().click();
            }
        }
    });
    $(document).on('click', '.qtdPackNota', function (e) {
        if (statusAtual == 'ED' || !statusAtual) {
            cell = this;
            if ($(this).is('td')) {
                col = $(this).parent().children().index($(this)) + 1;
                row = $(this).parent()[0];
                gridNome = $(this).closest('table').attr('id');
                valorInicial = $(cell).html();
                $(this).html(geraEditorPackNota(1, $(this).html()));
                $(this).find('input[type="text"]').addClass("limiteQtd1000");
                $(this).find('input[type="text"]').focus().select();
            }
        }

    });

    $(document).on('click', '.qtdPackEnt', function (e) {
        if (statusAtual == 'ED' || !statusAtual) {
            cell = this;
            if ($(this).is('td')) {
                col = $(this).parent().children().index($(this)) + 1;
                row = $(this).parent()[0];
                gridNome = $(this).closest('table').attr('id');
                valorInicial = $(cell).html();
                $(this).html(geraEditorPackRecebido(1, $(this).html()));
                $(this).find('input[type="text"]').addClass("limiteQtd1000");
                $(this).find('input[type="text"]').focus().select();
            }
        }

    });
    $(document).on('click', '.qtdPack', function (e) {
        if (statusAtual == 'ED' || !statusAtual) {
            cell = this;
            if ($(this).is('td')) {
                col = $(this).parent().children().index($(this));
                console.log()
                row = $(this).parent()[0];
                gridNome = $(this).closest('table').attr('id');
                valorInicial = $(cell).html().replace(/[^\d]/g, '');
                $(this).html(geraEditor(1, $(this).html().replace(/[^\d]/g, '')))
                $(this).find('input[type="text"]').addClass("limiteQtd10000");
                $(this).find('input[type="text"]').focus().select();
            }
        }
    });
    $("#modalConsultaPedido").on('hidden.bs.modal', function () {
        idsPedAdd = [];
        limparCamposModal();
    });
    $(document).on('shown.bs.tab', '.tabPacksEntrada a[data-toggle="tab"]', function (e) {
        //$('.tabPacksEntrada a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        var target = $($(e.target).attr("href")).attr("class").split(' ')[1];
        $($(e.target).attr("href")).closest('.content-pack').removeClass().addClass('tab-content content-pack clearfix ' + target);
        $(e.target).blur()

    });

    $(document).on('change', '.ckbGridPedEnt', function () {
        var linha = $(this).closest('tr');
        var idPed = tbPedidoNF.row($(linha)).data()[1];
        if (!this.checked) {
            idsPedAdd = $.grep(idsPedAdd, function (value) {
                return value != idPed;
            });
        } else {
            idsPedAdd.push(idPed);
        }
    });
    $(document).on('keyup', '.limiteQtd1000', function (event) {
        var element = event.target;
        var valorInformado = parseInt(element.value);
        var valorInicial = $(element).attr("data-valor-inicial");
        if (valorInformado > 1000) {
            $(element).val($(element).attr("data-valor-inicial"));
        } else {
            $(element).attr("data-valor-inicial", valorInformado.toString());
        }

    });
    $(document).on('keyup', '.limiteQtd10000', function (event) {
        var element = event.target;
        var valorInformado = parseInt(element.value);
        var valorInicial = $(element).attr("data-valor-inicial");
        if (valorInformado > 9999) {
            $(element).val($(element).attr("data-valor-inicial"));
        } else {
            $(element).attr("data-valor-inicial", valorInformado.toString());
        }
    });

    $(document).on('click', '.add-pack', function (evento) {
        if (permissoesUsuarioLogado.indexOf('Adicionar Novo Pack a NF') === -1) {
            semAcesso();
        } else {

            idPedidoPackAddClicado = Number($('#tabNFPedido li.active').attr('id').replace(/[^\d,]/g, ''))
            $.confirm({
                icon: 'fa fa-pencil-square-o',
                type: 'blue',
                title: 'Adicionar Novo Pack',
                columnClass: 'medium',
                containerFluid: true,
                content: '<div class="col-md-12">' +
                    '<div class="row">' +
                    '<div class="col-md-12 form-group">' +
                    '<label class="form-label">Tipo</label>' +
                    '<div class="controls">' +
                    '<label class="lbl-rdb">' +
                    '<input type="radio" class="radio-inline" value="FG" name="optradioTP" checked><span class="outside"><span class="inside"></span></span>Fora da Grade' +
                    '</label>' +
                    '<label class="lbl-rdb">' +
                    '<input type="radio" class="radio-inline" value="DF" name="optradioTP"><span class="outside"><span class="inside"></span></span>Defeito' +
                    '</label>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="row">' +
                    '<div class="col-md-12 form-group">' +
                    '<label class="form-label">Distribuição da Grade</label>' +
                    '<div class="controls">' +
                    '<label class="lbl-rdb">' +
                    '<input type="radio" class="radio-inline" name="optradioDist" value="Completa" checked><span class="outside"><span class="inside"></span></span>Completa' +
                    '</label>' +
                    '<label class="lbl-rdb">' +
                    '<input type="radio" class="radio-inline" value="Cor" name="optradioDist"><span class="outside"><span class="inside"></span></span>Por Cor' +
                    '</label>' +
                    '<label class="lbl-rdb">' +
                    '<input type="radio" class="radio-inline" value="Tamanho" name="optradioDist"><span class="outside"><span class="inside"></span></span>Por Tamanho' +
                    '</label>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>',
                buttons: {
                    confirm: {
                        text: 'Confirmar',
                        btnClass: 'btn-green',
                        action: function () {
                            var self = this;
                            var objConsulta = {};
                            objConsulta.tipo = $(self.$content.find("input[name='optradioTP']:checked")).val();
                            objConsulta.distribuicao = $(self.$content.find("input[name='optradioDist']:checked")).val();
                            objConsulta.idPedido = idPedidoPackAddClicado;
                            idPedidoPackAddClicado = 0;
                            $(".navbar.navbar-default.navbar-fixed-top").addClass('ocultarElemento');
                            $(".bg_load").show();
                            $(".wrapper").show();

                            addPackPedidoEntradasNF(objConsulta);
                        }
                    },
                    cancel: {
                        text: 'Cancelar',
                        btnClass: 'btn-red',
                        action: function () {

                            idPedidoPackAddClicado = 0;
                        }
                    }
                },
                onContentReady: function () {
                    var self = this;


                },
                onOpenBefore: function () {
                    var self = this;
                }
            });
        }
    })

    $(".next-step").click(function (e) {

        var parametroTabIdOrigem = $('#wizard-cad-nf li.active').children()[0].hash.replace('#tab', ''),
            parametroTabIdDestino = $('#wizard-cad-nf li.active').next().children()[0].hash.replace('#tab', '');
        if (validaOperacaoMudancaAbaWizardNF(parametroTabIdOrigem)) {
            mudaEtapaNF('#collapse-tab' + parametroTabIdDestino, '#collapse-tab' + parametroTabIdOrigem);
            $('.tab-content-main').removeClass().addClass('tab-content tab-content-main responsive');

            if (parametroTabIdDestino === 'Duplicata') $('.tab-content-main').addClass('duplicata');
            else if (parametroTabIdDestino === 'Pedido') $('.tab-content-main').addClass('pedido');
        }
    });
    $(".prev-step").click(function (e) {
        var parametroTabIdOrigem = $('#wizard-cad-nf li.active').children()[0].hash.replace('#tab', ''),
            parametroTabIdDestino = $('#wizard-cad-nf li.active').prev().children()[0].hash.replace('#tab', '');
        if (validaOperacaoMudancaAbaWizardNF(parametroTabIdOrigem)) {
            mudaEtapaNF('#collapse-tab' + parametroTabIdDestino, '#collapse-tab' + parametroTabIdOrigem);
            $('.tab-content-main').removeClass().addClass('tab-content tab-content-main responsive');

            if (parametroTabIdDestino === 'Duplicata') $('.tab-content-main').addClass('duplicata');
            else if (parametroTabIdDestino === 'Pedido') $('.tab-content-main').addClass('pedido');
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

                $('.selectpicker').selectpicker('hide');
                $(".navbar.navbar-default.navbar-fixed-top").addClass('ocultarElemento');
                $(".bg_load").show();
                $(".wrapper").show();

                window.location = "../gerenciamento/entradanf.cshtml";

            }
        });
    });
    $(".finish-change").click(function (e) {
        if (validaAbaNota()) criaObjSalvarNF('ED');
    })
    $(".status-change").click(function (e) {
        if (permissoesUsuarioLogado.indexOf('Alterar Status de NF') === -1) {
            semAcesso();
        } else {
            if (validaAbaNota()) {
                var returnedData = $.grep(nfStatus, function (element, index) { return element.status == statusAtual; })[0];
                if (idCadNF && returnedData) {
                    modalAtualizaStatusNF(returnedData, idCadNF)
                } else {
                    if (!idCadNF) {
                        $.confirm({
                            title: 'Atenção!',
                            content: 'É necessário salvar a nota para informar um status!',
                            icon: 'fa fa-warning',
                            theme: 'modern',
                            closeIcon: false,
                            animation: 'scale',
                            typeAnimated: true,
                            type: 'orange',
                            buttons: {
                                okButton: {
                                    text: 'OK'
                                }
                            },

                        });
                    } else {
                        $.confirm({
                            title: 'Atenção!',
                            content: 'Nenhum status de transição!',
                            icon: 'fa fa-warning',
                            theme: 'modern',
                            closeIcon: false,
                            animation: 'scale',
                            typeAnimated: true,
                            type: 'orange',
                            buttons: {
                                okButton: {
                                    text: 'OK'
                                }
                            },

                        });
                    }
                }

            }
        }
    })
    $(document).on('keydown', '.txtInteiro', function (e) {
        console.log(e.keyCode)
        console.log()
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
            (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
            (e.keyCode === 86 && (e.ctrlKey === true || e.metaKey === true)) ||
            (e.keyCode >= 35 && e.keyCode <= 40)) {
            return;
        }
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
            return false;
        }
    })
    $(document).on('keyup', '.txtInteiro', function (e) {
        var element = event.target;
        var validString = element.value.replace(/[^0-9]/g, '');
        if (validString !== element.value) {
            element.value = validString;
        }
    });
    $(document).on('paste', '.txtInteiro', function (e) {
        var paste = e.originalEvent.clipboardData.getData('Text');

        if (isNumber(paste) && Math.floor(paste) == parseInt(paste)) {
            return;
        }
        e.preventDefault();
    })
    $(window).on("load", carregar);
    $('.calendario-range').daterangepicker({
        locale: configuracaoCalendariosPedido,
        autoUpdateInput: false,
        linkedCalendars: true,
        "opens": "left",
        "parentEl": "#principal",
        showDropdowns: true,
        alwaysShowCalendars: true,
        buttonClasses: "btn btn-small",
        cancelClass: "btn-primary",
        ranges: {
            "Na Próxima Semana": recuperaRange('semana'),
            "No Próxima Mês": recuperaRange('mes'),
            "Em 3 Meses": recuperaRange('trimestre'),
            "Em 6 Meses": recuperaRange('semestre')
        }
    }).on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
    }).on('cancel.daterangepicker', function (ev, picker) {
        $(this).val('');
    });

    $('.calendario-single').daterangepicker({
        locale: configuracaoCalendariosPedido,
        autoUpdateInput: false,
        "autoApply": true,
        singleDatePicker: true,
        "opens": "left",
        //"parentEl": "#principal",
        showDropdowns: true
    }).on('outsideClick.daterangepicker', function (ev, picker) {
        if (!isDate($(this).val()))
            $(this).val(picker.startDate.format('DD/MM/YYYY'));
         else {
            if ($(this).data('daterangepicker').minDate > moment($(this).val(), 'DD/MM/YYYY'))
                $(this).val(picker.startDate.format('DD/MM/YYYY'));
            else
                $(this).data('daterangepicker').setStartDate(moment($(this).val(), 'DD/MM/YYYY'));
            
            $(this).data('daterangepicker').clickApply();
        }
    }).on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('DD/MM/YYYY'));
        var classes = $(this).attr('class').split(' ');
        if (classes.length == 3) {
            var dataRef = picker.startDate.toDate();
            var mindate = $("#" + classes[0]).data('daterangepicker').startDate;
            var momentObjStart = moment(dataRef).add(1, 'day');
            $("#" + classes[0]).data('daterangepicker').minDate = momentObjStart;
            $("#" + classes[0]).val(momentObjStart.format('DD/MM/YYYY'));
            if (momentObjStart > mindate) {
                $("#" + classes[0]).data('daterangepicker').setStartDate(momentObjStart);
                $("#" + classes[0]).data('daterangepicker').setEndDate(momentObjStart);
            }

            $("#" + classes[0]).data('daterangepicker').clickApply();
        }
    });
    //);
    $('#drpSeg').on('change', function (e) {
        var objParam = {};
        $("#drpSec").html('<option selected value="">Nenhuma</option>').prop('disabled', true);
        $("#drpSec").selectpicker('refresh');
        $("#drpEsp").html('<option selected value="">Nenhuma</option>').prop('disabled', true);
        $("#drpEsp").selectpicker('refresh');
        if ($('#drpSeg').val()) {
            $('.selectpicker').selectpicker('hide');
            $("#divEsp").addClass('ocultarElemento');
            $('.selectpicker').selectpicker('hide');
            $("#modalLoad").show();
            $("#modalwrapper").show(); $("#drpSec").prop('disabled', false);
            objParam.segmentos = $('#drpSeg').val().join(',').replace(/[^\d,]/g, '');
            carregarSecoes(objParam);
        }

    });
    $('#drpSec').on('change', function (e) {
        var objParam = {};
        $("#drpEsp").html('<option selected value="">Nenhuma</option>').prop('disabled', true);
        $("#drpEsp").selectpicker('refresh');
        if ($('#drpSec').val()) {

            $("#divEsp").addClass('ocultarElemento');
            $('.selectpicker').selectpicker('hide');
            $("#modalLoad").show();
            $("#modalwrapper").show();
            $("#drpEsp").prop('disabled', false)
            objParam.secoes = $('#drpSec').val().join(',');
            objParam.idFornecedor = $('#drpCNPJ').val();
            console.log(objParam)
            carregarEspecie(objParam);
        }
    });
    $('#drpCNPJ').on('change', function (e) {
        var opt = $("#drpCNPJ option[value='" + $('#drpCNPJ').val() + "']").attr('data-tokens').split(';');
        var cnpj = configuraMascaraCnpj(opt[1].trim());
        var rzSocial = opt[3].trim();
        var nomeFantasia = opt[2].trim();
        var info = '<b>Razão Social: </b><br />&nbsp;&nbsp;&nbsp;&nbsp;' + toTitleCase(rzSocial) + '<hr>' +
            '<b>Nome Fantasia: </b><br />&nbsp;&nbsp;&nbsp;&nbsp;' + toTitleCase(nomeFantasia) + '<hr>' +
            '<b>CNPJ:</b><br />&nbsp;&nbsp;&nbsp;&nbsp;' + cnpj;

        $('#tooltipFornecedor').attr('data-original-title', info)
        //$('#tooltipFornecedor').tooltip();
        $('#txtNomeFornecedor').val(nomeFantasia);

    });

});
function mudaEtapaNF(elemShow, elemHide) {
    $(elemShow).collapse("show");
    $(elemHide).collapse("hide");
    $('#wizard-cad-nf a[href="#' + elemShow.replace('#collapse-', '') + '"]').tab('show');
}
function enableDisableCamposNota(habilita) {
    if (!habilita) {
        $('#tabNota').find('input[type=text]').attr("disabled", true);
        $('#tabNota').find('.selectpicker:not([multiple])').attr("disabled", true);
        $('#tabNota').find('.selectpicker:not([disabled]) option').attr("disabled", true);
    } else {
        $('#tabNota').find('input[type=text]').attr("disabled", false);
        $('#tabNota').find('.selectpicker:not([multiple],.keep-disabled)').attr("disabled", false);
        $('#tabNota').find('.selectpicker:not([disabled]) option').attr("disabled", false);
    }
    $(".selectpicker").selectpicker('refresh');
}
function validaOperacaoMudancaAbaWizardNF(origem) {
    switch (origem) {
        case 'Nota':
            return validaAbaNota();
        case 'Pedido':
            var retorno = true;// validaAbaFotoCamposObrigatorios(parametroTab, evento);
            return retorno
        case 'Duplicata':
            return true;
        case 'Resumo':
            return true;
    }
}
function buscarPedidosNFFiltrado() {
    $('.modal-body .selectpicker').selectpicker('hide');
    $("#modalLoad").show();
    $("#modalwrapper").show();
    idsPedAdd = [];
    tbPedidoNF.ajax.reload();
}
function calcula_dv($chave43) {
    var $multiplicadores = 2;
    var $soma_ponderada = 0;
    for (var $m = 0; $m < $chave43.length; $m++) {
        $soma_ponderada += ($chave43.charAt(($chave43.length - 1) - $m) - '0') * $multiplicadores//parseInt($chave43[$i]) * $multiplicadores[$m];
        $multiplicadores++;
        if ($multiplicadores == 10)
            $multiplicadores = 2;
    }

    var resto = $soma_ponderada % 11;

    return (resto == 0 || resto == 1) ? 0 : (11 - resto);
}
function validaAbaNota() {
    var isValido = true;
    var retorno = null;
    var arrayEmi = [11, 12, 13, 14, 15, 16, 17, 21, 22, 23, 24, 25, 26, 27, 28, 29, 31, 32, 33, 35, 41, 42, 43, 50, 51, 52, 53];
    var chave = $("#txtChaveAcesso").val();
    var cnpj = chave.substr(6, 14);
    var estEmi = parseInt(chave.substr(0, 2));
    var mesAno = chave.substr(2, 2) + '/' + chave.substr(4, 2)
    var res = chave.substr(0, 43);
    if (chave.length < 44) {
        retorno = {};
        retorno.elemento = $("#txtChaveAcesso");
        retorno.isInput = true;
        retorno.textoMensagem = 'A chave de acesso deve conter 44 caracteres!';
    } else if (($.inArray(estEmi, arrayEmi) == -1 || !validarCNPJ(cnpj) || res + calcula_dv(res) != chave) && chave != "00000000000000000000000000000000000000000000") {
        retorno = {};
        retorno.elemento = $("#txtChaveAcesso");
        retorno.isInput = true;
        retorno.textoMensagem = 'A chave de acesso é inválida! Confirme os valores digitados antes de prosseguir.';
    } else if (!$("#drpCNPJ").val()) {
        retorno = {};
        retorno.elemento = $("#drpCNPJ");
        retorno.textoMensagem = 'É necessário selecionar um fornecedor antes de prosseguir.';
    } else if (!$("#txtNumNota").val().length) {
        retorno = {};
        retorno.elemento = $("#txtNumNota");
        retorno.isInput = true;
        retorno.textoMensagem = 'Informe o número da nota antes de prosseguir.';
    } else if (!$("#txtSerieNF").val().length) {
        retorno = {};
        retorno.elemento = $("#txtSerieNF");
        retorno.textoMensagem = 'Informe a série da nota antes de prosseguir.';
        retorno.isInput = true;
    } else if (!$("#txtDtEmiNF").val().length) {
        retorno = {};
        retorno.elemento = $("#txtDtEmiNF");
        retorno.textoMensagem = 'Informe a data de emissão da nota antes de prosseguir.';
        retorno.isInput = true;
    }
    if (retorno) {
        isValido = false;
        erroCadCompra(retorno.textoMensagem, "alertDadosNota");
        criaTimeOutNF(retorno.isInput, retorno.elemento);
    }
    return isValido;

}
function criaTimeOutNF(isNotSelect, elemento) {
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

function carregar() {
    //sessionStorage.removeItem("idNFEditar");

    $(function () {
        $('#tooltipFornecedor').tooltip()
    })
    cargaInicialCadastroEntradaNF()

}
function atualizaDadosNota() {
    var tbPlanejamento = $('#' + gridNome).dataTable().api();
    var param = parseInt($('#' + gridNome).find('.txtInteiro').val());
    if (isNaN(param) || param < 0) {
        $('#' + gridNome).find('.txtInteiro').focus().select();
    } else {
        (($('#' + gridNome).find('.txtInteiro').val() === valorInicial) ? $(cell).html(parseInt(valorInicial).toLocaleString('pt-BR')) : $(cell).html($('#' + gridNome).find('.txtInteiro').val()));
        if (param !== parseInt(valorInicial)) {
            var totalQtdItens = tbPlanejamento.rows().data().toArray().sum("totalCor") * param;
            tbPlanejamento.rows().every(function (rowIdx, tableLoop, rowLoop) {
                var data = this.data();
                //data.totalItens = totalQtdItens;
                //data.hasOwnProperty('qtdPack') ?
                data.totalNota = param;
            });
            var colunaFooter = tbPlanejamento.column(col);
            $(colunaFooter.footer()).html(totalQtdItens.toLocaleString('pt-BR'))


            //recalculaTotalColunas(tbPlanejamento, param)
            tbPlanejamento.rows().invalidate().draw();
            tbPlanejamento.columns.adjust().draw();
            tbPlanejamento.rowsgroup.update();
            recalculaTotalLinhaNF(tbPlanejamento);
            recalculaTotalColunas(tbPlanejamento);
            recalculaTotalColunasNF(tbPlanejamento)
            //recalculaDadosPedido()
            //console.log(tabelaPackCadastrados)
        }
        if (retorna) {
            var linhaIndice = tbPlanejamento.rows().count() - 1;
            retorna = false;
            var proximaLinha = tbPlanejamento.rows(linhaIndice).nodes()[0];//;
            cell = $(proximaLinha).find('td.qtdPack:last');
            if ($(cell).html()) {
                col = $(cell).parent().children().index($(cell)) + 1;
                row = $(cell).parent()[0];
                valorInicial = $(cell).html().replace(/[^\d]/g, '');
                $(cell).html(geraEditor(1, valorInicial));
                $(cell).find('input[type="text"]').focus().select();
            }
        }

    }

}
function atualizaDadosRecebido() {
    var tbPlanejamento = $('#' + gridNome).dataTable().api();
    var param = parseInt($('#' + gridNome).find('.txtInteiro').val());
    if (isNaN(param) || param < 0) {
        $('#' + gridNome).find('.txtInteiro').focus().select();
    } else {
        (($('#' + gridNome).find('.txtInteiro').val() === valorInicial) ? $(cell).html(parseInt(valorInicial).toLocaleString('pt-BR')) : $(cell).html($('#' + gridNome).find('.txtInteiro').val()));
        if (param !== parseInt(valorInicial)) {
            var totalQtdItens = tbPlanejamento.rows().data().toArray().sum("totalCor") * param;
            tbPlanejamento.rows().every(function (rowIdx, tableLoop, rowLoop) {
                var data = this.data();
                data.totalRecebido = param;
            });
            var colunaFooter = tbPlanejamento.column(col);
            $(colunaFooter.footer()).html(totalQtdItens.toLocaleString('pt-BR'))

            ///adsaddd

            //recalculaTotalColunas(tbPlanejamento, param)
            tbPlanejamento.rows().invalidate().draw();
            tbPlanejamento.columns.adjust().draw();
            tbPlanejamento.rowsgroup.update();
            recalculaTotalLinhaNF(tbPlanejamento);
            recalculaTotalColunas(tbPlanejamento);
            recalculaTotalColunasNF(tbPlanejamento)
        }
        if (retorna) {
            var linhaIndice = tbPlanejamento.rows().count() - 1;
            retorna = false;
            var proximaLinha = tbPlanejamento.rows(linhaIndice).nodes()[0];//;
            cell = $(proximaLinha).find('td.qtdPack:last');
            if ($(cell).html()) {
                col = $(cell).parent().children().index($(cell)) + 1;
                row = $(cell).parent()[0];
                valorInicial = $(cell).html().replace(/[^\d]/g, '');
                $(cell).html(geraEditor(1, valorInicial));
                $(cell).find('input[type="text"]').focus().select();
            }
        }

    }

}

function perdeFoco() {
    var tbPlanejamento = $('#' + gridNome).dataTable().api();
    var totalRows = tbPlanejamento.rows().count() - 1;
    var linhaIndice = tbPlanejamento.row(row).index();
    console.log($(tbPlanejamento.column(col).header()).html())
    var colunaAtualizada = "tamanho" + converterFormatoVariavel(toTitleCase($(tbPlanejamento.column(col).header()).html()));

    var txtref = $('#' + gridNome).find('.txtInteiro')
    var param = parseInt(txtref.val());
    if (isNaN(param)) {
        param = 0;
        valorInicial = 0
        txtref.val('0')
    }
    ((txtref.val() === valorInicial) ? $(cell).html(parseInt(valorInicial).toLocaleString('pt-BR')) : $(cell).html(txtref.val()));
    if (param !== parseInt(valorInicial)) {
        //var qtdPackAtual = tbPlanejamento.row(row).data().qtdePack;
        //if (!qtdPackAtual) {
        //    qtdPackAtual = tbPlanejamento.row(row).data().qtdPack;
        //}

        tbPlanejamento.row(row).data()[colunaAtualizada] = param;
        recalculaTotalLinhaNF(tbPlanejamento);
        recalculaTotalColunas(tbPlanejamento);
        recalculaTotalColunasNF(tbPlanejamento)
        tbPlanejamento.rows().invalidate().draw();
        //if (qtdPackAtual > 0) {
        //    recalculaDistCustosPackAtualizado(gridNome);
        //}
        //recalculaDadosPedido();
    }
    if (avanca) {
        avanca = false;

        cell = $(cell).next('td.qtdPack');
        if (linhaIndice < totalRows && !cell.length) {
            var proximaLinha = tbPlanejamento.rows(linhaIndice + 1).nodes()[0];//;
            cell = $(proximaLinha).find('td.qtdPack:first');
        }
        $(cell).trigger('click')

    }
    if (retorna) {
        retorna = false;
        cell = $(cell).prev('td.qtdPack');
        if (linhaIndice > 0 && !cell.length) {
            var proximaLinha = tbPlanejamento.rows(linhaIndice - 1).nodes()[0];//;
            cell = $(proximaLinha).find('td.qtdPack:last');
        }
        $(cell).trigger('click')
    }

}
function bloqueiaRefreshQtdPack(elemento, evento) {
    var code = (evento.keyCode ? evento.keyCode : evento.which);
    if (evento.keyCode === 9 && evento.shiftKey === true) {
        evento.preventDefault();
        retorna = true;
        $(elemento).blur();
    }
    if (code === 9 && evento.shiftKey === false || code === 13) {
        evento.preventDefault();
        avanca = true;
        $(elemento).blur();
    }
}

function carregaDadosCadastrados(dadosEntrada) {
    $('#txtChaveAcesso').val(dadosEntrada.chaveAcessoNfe);
    $('#txtNumNota').val(dadosEntrada.numero);
    $('#txtSerieNF').val(dadosEntrada.serie);
    $('#txtAreaObsNF').val(dadosEntrada.observacao);
    $('#txtDtEmiNF').data('daterangepicker').setStartDate(new Date(dadosEntrada.dataEmissao));//.val(dadosEntrada.dataEmissao);
    $('#txtDtEmiNF').data('daterangepicker').setEndDate(new Date(dadosEntrada.dataEmissao));//.val(dadosEntrada.dataEmissao);
    $('#txtDtSaidaNF').data('daterangepicker').setStartDate(new Date(dadosEntrada.dataSaida));//
    $('#txtDtSaidaNF').data('daterangepicker').setEndDate(new Date(dadosEntrada.dataSaida));//
    $('#txtDtEntregaNF').data('daterangepicker').setStartDate(new Date(dadosEntrada.dataEntrega));//.val(dadosEntrada.dataEntrega);
    $('#txtDtEntregaNF').data('daterangepicker').setEndDate(new Date(dadosEntrada.dataEntrega));//.val(dadosEntrada.dataEntrega);
    statusAtual = dadosEntrada.status
    $('#txtDtEntregaNF').val(moment(dadosEntrada.dataEntrega).format('DD/MM/YYYY'))
    $('#txtDtSaidaNF').val(moment(dadosEntrada.dataSaida).format('DD/MM/YYYY'))
    $('#txtDtEmiNF').val(moment(dadosEntrada.dataEmissao).format('DD/MM/YYYY'))
    $('#drpCNPJ').val(dadosEntrada.idFornecedor).trigger('change');
    $('#txtQtdeVol').val(dadosEntrada.qtdeVolume);
    $('#txtValorBaseICMS').val(dadosEntrada.valorBaseIcms.toFixed(2).replace('.', ',')).maskMoney('mask');
    $('#txtValorBaseICMSST').val(dadosEntrada.valorBaseIcmsST.toFixed(2).replace('.', ',')).maskMoney('mask');
    $('#txtValorICMS').val(dadosEntrada.valorIcms.toFixed(2).replace('.', ',')).maskMoney('mask');
    $('#txtValorICMSST').val(dadosEntrada.valorIcmsST.toFixed(2).replace('.', ',')).maskMoney('mask');
    $('#txtValorProduto').val(dadosEntrada.valorProdutos.toFixed(2).replace('.', ',')).maskMoney('mask');
    $('#txtValorFrete').val(dadosEntrada.valorFrete.toFixed(2).replace('.', ',')).maskMoney('mask');
    $('#txtValorSeguro').val(dadosEntrada.valorSeguro.toFixed(2).replace('.', ',')).maskMoney('mask');
    $('#txtValorDesconto').val(dadosEntrada.valorDesconto.toFixed(2).replace('.', ',')).maskMoney('mask');
    $('#txtValorIPI').val(dadosEntrada.valorIPI.toFixed(2).replace('.', ',')).maskMoney('mask');
    $('#txtValorAproxTributos').val(dadosEntrada.valorAproxTributos.toFixed(2).replace('.', ',')).maskMoney('mask');
    $('#txtValorOutros').val(dadosEntrada.valorOutros.toFixed(2).replace('.', ',')).maskMoney('mask');
    $('#txtValorTotal').val(dadosEntrada.valorTotal.toFixed(2).replace('.', ',')).maskMoney('mask');
    $("#drpStatusNFAtual").attr('disabled', true);
    $("#drpStatusNFAtual").selectpicker('val', statusAtual);
}
function carregarPedidosNF() {
    tbPedidoNF = $('#tabelaPedidos').DataTable({
        paging: false, /* define se a tabela deve usar paginação */
        searching: true, /* define se deve usar o campo Buscar dentro da tabela */
        lengthChange: false,
        deferRender: true,
        "order": [[1, "desc"]],
        responsive: true,
        ordering: false,
        scrollCollapse: true,
        destroy: true,
        fixedHeader: true,
        scrollX: true,
        scrollY: '50vh',

        "language": {
            "emptyTable": "Nenhum pedido encontrado",
            "zeroRecords": "Nenhum pedido corresponde ao filtro",
            "paginate": {
                "previous": "Anterior",
                "next": "Próximo"
            }
        },
        drawCallback: function (settings) {
            //$(".ckbGridPedEnt").bootstrapSwitch();
            $(function () {
                $('[data-toggle="tooltip"]').tooltip();
            });
        },
        "ajax": {
            'type': 'POST',
            'cache': false,
            'url': urlApi + 'gerenciamento/entradaNF/RecuperaPedidosFiltrados',
            'data': function (d) {
                return criaObjConsultaPedNf();
            },
            'beforeSend': function (req) {
                req.setRequestHeader('Authorization', sessionStorage.getItem("token"));
            },
            "dataSrc": function (json) {
                console.log(json)
                var retorno = [];
                for (var i = 0; i < json.length; i++) {
                    retorno.push(geraLinhaRetornoPedidoPack(json[i]))
                }

                //$(".bg_load").fadeOut();
                //$(".wrapper").fadeOut();
                //$(".navbar.navbar-default.navbar-fixed-top").removeClass('ocultarElemento');
                //$("div.controls.ocultarElemento").removeClass('ocultarElemento');
                //$("#divSeg").removeClass('ocultarElemento');
                //$("#divForn").removeClass('ocultarElemento');
                //$("#divMarca").removeClass('ocultarElemento');
                ////$("#divSec").removeClass('ocultarElemento');
                //$(".selectpicker").selectpicker('show');
                //$("#divOcultaColuna").removeClass('ocultarElemento');
                $("#modalLoad").fadeOut("slow");
                $("#modalwrapper").fadeOut("slow");
                $('.modal-body .selectpicker').selectpicker('show');
                return retorno;
            }
        }
    });
}
function carregaTabelaTitulo(dados, colunas) {
    $('#tabelaDuplicatas').DataTable({
        paging: false, /* define se a tabela deve usar paginação */
        searching: true, /* define se deve usar o campo Buscar dentro da tabela */
        lengthChange: false,
        deferRender: true,
        responsive: true,
        ordering: false,
        scrollCollapse: true,
        destroy: true,
        //fixedHeader: true,
        scrollX: true,
        scrollY: '50vh',
        data: dados,
        "columns": colunas,
        "info": false,
        "language": {
            "emptyTable": "Nenhum titulo encontrado",
            "zeroRecords": "Nenhum titulo corresponde ao filtro",
            "paginate": {
                "previous": "Anterior",
                "next": "Próximo"
            }
        },

    });
}
function retornaDadosTbTitulosGerados(dados) {
    var colunasTit = [
        { "data": "idTituloPagar", 'visible': false },
        { "data": "documento", 'className': 'separaDireita' },
        {
            "data": "dataVencimento",
            'className': 'separaDireita',
            "render": function (data, type, row, meta) {
                return type === 'display' ? moment(data).format("DD/MM/YYYY") : data;
            }
        },
        {
            "data": "dataEmissao",
            'visible': false,
            "render": function (data, type, row, meta) {
                return type === 'display' ? moment(data).format("DD/MM/YYYY") : data;
            }
        },

        {
            "data": "valor",
            'className': 'separaDireita',
            "render": function (data, type, row, meta) {
                return type === 'display' ? data.toLocaleString('pt-BR', { style: "currency", currency: "BRL" }) : data;
            }
        },
        {
            "data": "valorJuros",
            'className': 'separaDireita',
            "render": function (data, type, row, meta) {
                return type === 'display' ? data.toLocaleString('pt-BR', { style: "currency", currency: "BRL" }) : data;
            }
        },
        {
            "data": "valorMulta",
            'className': 'separaDireita',
            "render": function (data, type, row, meta) {
                return type === 'display' ? data.toLocaleString('pt-BR', { style: "currency", currency: "BRL" }) : data;
            }
        },
        {
            "data": "valorDesconto",
            'className': 'separaDireita',
            "render": function (data, type, row, meta) {
                return type === 'display' ? data.toLocaleString('pt-BR', { style: "currency", currency: "BRL" }) : data;
            }
        },
        {
            "data": "valorAcrescimo",
            'visible': false,
            "render": function (data, type, row, meta) {
                return type === 'display' ? data.toLocaleString('pt-BR', { style: "currency", currency: "BRL" }) : data;
            }
        },
        {
            "data": "valorPagar",
            'className': 'separaDireita',
            "render": function (data, type, row, meta) {
                return type === 'display' ? data.toLocaleString('pt-BR', { style: "currency", currency: "BRL" }) : data;
            }
        },
        {
            "data": "dataLiquidacao",
            'className': 'separaDireita',
            "render": function (data, type, row, meta) {
                return type === 'display' ?
                    data.length ?
                        data : "-" :
                    data;
            }
        },
        { "data": "sequencial", 'visible': false, },
    ];

    cancelaTitGerado = dados.length > 0;
    if (cancelaTitGerado) {
        $('.confirma-titulo').addClass('ocultarElemento');
        $('.gera-titulo').addClass('ocultarElemento');
        $('#txtCadCondPgtoNF').attr("disabled", true);
        $('#tabDuplicata').find('.selectpicker:not([multiple])').attr("disabled", true);
        $('#tabDuplicata').find('.selectpicker:not([disabled]) option').attr("disabled", true);

        if ($.grep(dados, function (element, index) { return element.dataLiquidacao.length > 0; }).length == 0) {
            $('.cancela-titulo').removeClass('ocultarElemento')
        } else {
            $('.cancela-titulo').addClass('ocultarElemento')
        }
    } else {
        $('.cancela-titulo').addClass('ocultarElemento')
        $('.confirma-titulo').removeClass('ocultarElemento').attr("disabled", true);
        $('.gera-titulo').removeClass('ocultarElemento');
        $('#txtCadCondPgtoNF').attr("disabled", false);
        $('#tabDuplicata').find('.selectpicker:not([multiple])').attr("disabled", false);
        $('#tabDuplicata').find('.selectpicker:not([disabled]) option').attr("disabled", false);

    }
    $(".selectpicker").selectpicker('refresh');

    carregaTabelaTitulo(dados, colunasTit)
}
function carregaDadosTitulosGerados(dados) {
    var colunasTit = [
        { "data": "idTituloPagar", 'visible': false },
        { "data": "documento", 'className': 'separaDireita' },
        {
            "data": "dataVencimento",
            'className': 'separaDireita',
            "render": function (data, type, row, meta) {
                return type === 'display' ? moment(data).format("DD/MM/YYYY") : data;
            }
        },
        {
            "data": "dataEmissao",
            'visible': false,
            "render": function (data, type, row, meta) {
                return type === 'display' ? moment(data).format("DD/MM/YYYY") : data;
            }
        },

        {
            "data": "valor",
            'className': 'separaDireita',
            "render": function (data, type, row, meta) {
                return type === 'display' ? data.toLocaleString('pt-BR', { style: "currency", currency: "BRL" }) : data;
            }
        },
        {
            "data": "valorJuros",
            'className': 'separaDireita',
            "render": function (data, type, row, meta) {
                return type === 'display' ? data.toLocaleString('pt-BR', { style: "currency", currency: "BRL" }) : data;
            }
        },
        {
            "data": "valorMulta",
            'className': 'separaDireita',
            "render": function (data, type, row, meta) {
                return type === 'display' ? data.toLocaleString('pt-BR', { style: "currency", currency: "BRL" }) : data;
            }
        },
        {
            "data": "valorDesconto",
            'className': 'separaDireita',
            "render": function (data, type, row, meta) {
                return type === 'display' ? data.toLocaleString('pt-BR', { style: "currency", currency: "BRL" }) : data;
            }
        },
        {
            "data": "valorAcrescimo",
            'visible': false,
            "render": function (data, type, row, meta) {
                return type === 'display' ? data.toLocaleString('pt-BR', { style: "currency", currency: "BRL" }) : data;
            }
        },
        {
            "data": "valorPagar",
            'className': 'separaDireita',
            "render": function (data, type, row, meta) {
                return type === 'display' ? data.toLocaleString('pt-BR', { style: "currency", currency: "BRL" }) : data;
            }
        },
        {
            "data": "dataLiquidacao",
            'className': 'separaDireita',
            "render": function (data, type, row, meta) {
                return type === 'display' ?
                    data.length ?
                        data : "-" :
                    data;
            }
        },
        { "data": "sequencial", 'visible': false, },
    ];
    cancelaTitGerado = dados.length > 0;
    if (cancelaTitGerado) {
        $('.gera-titulo').addClass('ocultarElemento');
        $('.confirma-titulo').attr("disabled", false);
        $('#txtCadCondPgtoNF').attr("disabled", true);
        $('#tabDuplicata').find('.selectpicker:not([multiple])').attr("disabled", true);
        $('#tabDuplicata').find('.selectpicker:not([disabled]) option').attr("disabled", true);
        if ($.grep(dados, function (element, index) { return element.dataLiquidacao.length > 0; }).length == 0) {
            $('.cancela-titulo').removeClass('ocultarElemento')
        } else {
            $('.cancela-titulo').addClass('ocultarElemento')
        }
        $(".selectpicker").selectpicker('refresh');
    }

    carregaTabelaTitulo(dados, colunasTit)
}
function carregaTabelaDesc(dados) {
    var tbDescTitNF = $('#tabelaDescTit').DataTable({
        paging: false, /* define se a tabela deve usar paginação */
        searching: false, /* define se deve usar o campo Buscar dentro da tabela */
        lengthChange: false,
        deferRender: true,
        responsive: true,
        ordering: false,
        scrollCollapse: true,
        destroy: true,
        //fixedHeader: true,
        scrollX: true,
        scrollY: '30vh',
        data: dados,
        "columns": [
            {
                "data": "tipo", // can be null or undefined
                "render": function (data, type, row, meta) {
                    if (type === 'display') {
                        var htmlOpt = $.parseHTML(localStorage.getItem('descCombo'));
                        var retorno = ''
                        if (data == "0") {
                            retorno = '<div style="width: 100%!important;"><select class="selectpicker show-tick form-control cbTipoDescGrid" data-container="body">' + localStorage.getItem('descCombo') + '</select></div>';
                        }
                        else {

                            htmlOpt.map(obj => {
                                if ($(obj).attr("value") === data.toString()) {
                                    retorno = $(obj).text();
                                }

                            });
                        }


                        return retorno;
                    }
                    else return data;
                },

            },
            {
                "data": "fator", // can be null or undefined
                "className": 'percent'
            },
            {
                "data": "valor", // can be null or undefined
                "className": 'money'
            },
            {
                "data": null, // can be null or undefined
                "defaultContent": '<div style="width: 100%!important;"><a href="#" class="btn btn-sm btn-danger excluirDesc" data-toggle="tooltip" data-container="body" title="Excluir" style="margin:3px"><i class="fa fa-close" aria-hidden="true"></i></a></div>',

            }
        ],
        "columnDefs": [
            {
                "targets": "_all",
                "render": function (data, type, row, meta) {
                    if (type === 'display' && meta.col > 0) {
                        if (meta.col == 1) {
                            return Math.round10(data, -2).toLocaleString('pt-BR') + '%';
                        } else if (meta.col == 2) {
                            return data.toLocaleString('pt-BR', { style: "currency", currency: "BRL" });
                        }

                    }
                    else return data;
                }
            }
        ],
        "language": {
            "emptyTable": "Nenhum dado encontrado",
            "zeroRecords": "Nenhum dado corresponde ao filtro",
            "paginate": {
                "previous": "Anterior",
                "next": "Próximo"
            }
        },
        drawCallback: function (settings) {
            var api = this.api();
            var tiposEsc = api.column(0).data().filter(function (value, index) {
                return value > 0 ? true : false;
            });
            for (var i = 0; i < tiposEsc.length; i++) {
                $(".selectpicker.cbTipoDescGrid option[value='" + tiposEsc[i] + "']").attr('disabled', true);
            }
            $(".selectpicker").selectpicker('refresh');
        },
        "info": false
    });
    recalculaTotalNFTit(tbDescTitNF);
}
function carregaTabelaTitPedCusto(dados) {
    $('#tabelaPedCustoTit').DataTable({
        paging: false, /* define se a tabela deve usar paginação */
        searching: false, /* define se deve usar o campo Buscar dentro da tabela */
        lengthChange: false,
        deferRender: true,

        responsive: true,
        ordering: false,
        scrollCollapse: true,
        destroy: true,
        //fixedHeader: true,
        scrollX: true,
        scrollY: '30vh',
        data: dados,
        "columns": [
            {
                "data": 'idPedidoPack', // can be null or undefined
            },
            {
                "data": "tipoPack"
            },
            {
                "data": "valorTotal"
            }
        ],
        "columnDefs": [

            {
                "targets": "_all",
                "render": function (data, type, row, meta) {
                    if (type === 'display' && meta.col == 2) {
                        return data.toLocaleString('pt-BR', { style: "currency", currency: "BRL" });

                    }
                    return data;
                }
            },
        ],
        "language": {
            "emptyTable": "Nenhum dado encontrado",
            "zeroRecords": "Nenhum dado corresponde ao filtro",
            "paginate": {
                "previous": "Anterior",
                "next": "Próximo"
            }
        },
        drawCallback: function (settings) {
            var api = this.api();
            var totNota = api.column(2).data().reduce(function (a, b) {
                return a + b;
            }, 0).toLocaleString('pt-BR', { style: "currency", currency: "BRL" });
            $('.titValRecebido').html(totNota);
            $('.titValTot').html(totNota);
        },
        "info": false


    });
}
function retornaCustoNfTB(dado) {
    var retorno = []
    for (var i = 0; i < dado.length; i++) {
        var objJson = {};
        objJson.idPedidoPack = dado[i].idPedidoPack;
        objJson.tipoPack = dado[i].tipoPack;
        objJson.valorTotal = dado[i].valorTotal;
        retorno.push(objJson);
    }
    return retorno;
}
function addNovoDesconto() {
    if (permissoesUsuarioLogado.indexOf('Gerenciar Descontos/Acrescimos dos Titulos da NF') === -1) {
        semAcesso();
    } else {

        if (!cancelaTitGerado) {
            var tbPlanejamento = $('#tabelaDescTit').dataTable().api();
            var linha = tbPlanejamento.rows().count() - 1
            var dado = tbPlanejamento.row(linha).data();

            if (!dado || (dado.tipo > 0 && dado.fator > 0 && dado.valor > 0)) {
                if (limiteDescAdd > linha + 1) {
                    tbPlanejamento.row.add({ tipo: 0, fator: 0, valor: 0 });
                }
                tbPlanejamento.draw();
                $(".selectpicker").selectpicker('refresh');
            } else {
                $.confirm({
                    title: 'Atenção!',
                    content: 'É necessário preencher todos os campos da ultima linha para executar essa operação!',
                    icon: 'fa fa-warning',
                    theme: 'modern',
                    closeIcon: false,
                    animation: 'scale',
                    typeAnimated: true,
                    type: 'orange',
                    buttons: {
                        okButton: {
                            text: 'OK'
                        }
                    },

                });
            }
        } else {
            $.confirm({
                title: 'Atenção!',
                content: 'Não é possivel executar esta operação, pois já existem titulos confirmados!',
                icon: 'fa fa-warning',
                theme: 'modern',
                closeIcon: false,
                animation: 'scale',
                typeAnimated: true,
                type: 'orange',
                buttons: {
                    okButton: {
                        text: 'OK'
                    }
                },

            });
        }
    }

}
function geraLinhaRetornoPedidoPack(retorno) {
    var pedidosAdd = [];
    $('#tabNFPedido li:not(:last-child)').each(function (i) {
        pedidosAdd.push(Number($(this).attr('id').replace(/[^\d]/g, ''))); // This is your rel value
    });
    console.log(pedidosAdd)
    var pedIndisponivel = retorno.status != 'L' || $.inArray(retorno.idPedido, pedidosAdd) !== -1 ? 'disabled ' : '';
    var linhaRetorno = [
        '<input class="toggle-column ckbGridPedEnt" ' + pedIndisponivel + 'type="checkbox">',//'<input type="checkbox" class="ckbGridPedEnt" data-on-color="success" data-off-color="danger" data-on-text="Sim" data-off-text="Não">',
        retorno.idPedido,
        moment(retorno.dataCadastro).format("DD/MM/YYYY"),
        retorno.codProduto,
        retorno.codigoOriginal,
        retorno.descricaoProduto,
        retorno.produtoReferenciaFornecedor,
        moment(retorno.dataEntregaInicio).format("DD/MM/YYYY") + ' à ' + moment(retorno.dataEntregaFinal).format("DD/MM/YYYY"),
        retorno.qtdeItens.toLocaleString('pt-BR'),
        retorno.qtdePacks.toLocaleString('pt-BR')
    ];
    return linhaRetorno;

}
function retornaTabelaEntPack(id) {
    return '<table id="' + id + '" cellpadding="0" cellspacing="0" class="tbPackEnt cell-border hover table cell nowrap stripe compact pretty"></table>';
}
function criarTabelaPackEntrada(tamanhosPack, naGrade) {
    var tabelaHtml = '<thead><tr>' +
        '<th class="groupHeaderTable customCSSHead" rowspan="2">Referência</th>' +
        '<th class="groupHeaderTable customCSSHead" rowspan="2">Cores</th>' +
        '<th class="groupHeaderTable customCSSHead" colspan="' + (tamanhosPack.length * 2) + '">Tamanho</th>', subTabela = '';
    if (naGrade) {
        tabelaHtml += '<th class="groupHeaderTable customCSSHeadTotal numInt sumItem" rowspan="2" >Total</th>' +
            '<th class="groupHeaderTable customCSSHeadTotal" colspan="3" >Qtde. Packs</th>' +
            '</tr><tr>';
        subTabela += '<th class="groupHeaderTable customCSSHeadTotal totalPed" >Pedido</th>' +
            '<th class="groupHeaderTable customCSSHeadTotal totalMota" >Nota</th>' +
            '<th class="groupHeaderTable customCSSHeadTotal totalRecebido" >Recebido</th>';
    } else {
        tabelaHtml += '<th class="groupHeaderTable customCSSHeadFG numInt sumItem" rowspan="2" >Total</th>' +
            '<th class="groupHeaderTable customCSSHeadFG totalRecebido" rowspan="2" >Recebido</th>' +
            '</tr><tr>';
    }
    var tbItens = ''
    for (var i = 0; i < tamanhosPack.length; i++) {
        tabelaHtml += '<th class="groupHeaderTableRigth customCSSHead separaDireita numInt">' + tamanhosPack[i].descricaoTamanho.toUpperCase() + '</th>'
        tbItens += '<th class="groupHeaderTableRigth separaDireita idItensNF"></th>'
    }
    tabelaHtml += tbItens + subTabela + '</tr></thead>' + retornoRodapeEntPack(tamanhosPack, naGrade);
    return tabelaHtml;
}
function retornoRodapeEntPack(tamanhosPack, naGrade) {
    var tabelaHtml = '<tfoot><tr>' +
        '<th class="groupHeaderTable customCSSHeadTotal" colspan="2">Total</th>';
    var tbItens = ''
    for (var i = 0; i < tamanhosPack.length; i++) {
        tabelaHtml += '<th class="groupHeaderTableRigth customCSSHeadItmRdp">0</th>';
        tbItens += '<th class="idItensNF"></th>'
    }
    tabelaHtml += tbItens + '<th class="groupHeaderTable customCSSHeadTotalRdp">0</th>' +
        '<th class="groupHeaderTable customCSSHeadTotalRdp">0</th>';
    if (naGrade) {
        tabelaHtml += '<th class="groupHeaderTable customCSSHeadTotalRdp">0</th>' +
            '<th class="groupHeaderTable customCSSHeadTotalRdp">0</th>';
    }
    tabelaHtml += '</tr></tfoot>';
    return tabelaHtml;
}

function criarTabPacksPedido(packs, idPedido) {
    var htmlContent = '<div class="tab-content content-pack clearfix" style="border: 1px solid blue !important;">';
    var ulHtml = '<div class="tabbable tabs-left"><ul id="tab-' + idPedido + '" class="nav nav-pills tabPacksEntrada">';
    for (var i = 0; i < packs.length; i++) {
        var btnExcPack = packs[i].tipoPack == 'DG' ? '' :
            '<button style="margin-left: 7px;color:red!important;opacity: 0.5;" data-toggle="tooltip" class="close" type="button" title="Excluir Pack">×</button>'
        ulHtml += '<li><a style="border: 1px solid blue !important;" href="#pack-' + packs[i].idnfPack +
            '" data-toggle="tab" class="tp-' + packs[i].tipoPack + ' ag-' + packs[i].tipoAgrupamento + '" ><i class="fa fa-pie-chart" aria-hidden="true"></i> ' + toTitleCase(packs[i].tipoPackDescricao) +
            btnExcPack + ' </a></li>';
        var tbHtml = $.parseHTML(retornaTabelaEntPack("tblEnt-" + packs[i].idnfPack)), headerTb = criarTabelaPackEntrada(packs[i].packItens[0].dadosTamanho, packs[i].tipoPack == 'DG');

        $(tbHtml).html(headerTb);
        htmlContent += '<div class="tab-pane tp-' + packs[i].tipoPack + '" id="pack-' + packs[i].idnfPack +
            '"><div class="row"><div class="col-md-12 col-sm-12 col-xs-12 table-responsive">' + $(tbHtml).prop('outerHTML') + '</div></div></div>';

    }
    ulHtml += '<li><a href="#" style="border: 1px solid blue !important;" class="add-pack">+ Adicionar Novo Pack</a></li></ul>' +
        htmlContent + '</div></div>';
    $('.span' + idPedido + ' .tabbable.tabs-left').remove();
    $('.span' + idPedido).append($.parseHTML(ulHtml));
    if ($('#tab-' + idPedido + ' li').length > 1) {
        $('#tab-' + idPedido + ' li').children('a').first().click();
        $('[data-toggle="tooltip"]').tooltip();
    }

}
function retornaAgrup(dist) {
    return dist == "Completa" ? "CO" :
        dist == "Cor" ? "PC" :
            "PT"
}
function addAbaPackNovo(idPedido, tipo, pack, dist) {
    var $ulElemento = $('ul#tab-' + idPedido);
    var packTipoIndice = $ulElemento.find('a.tp-' + tipo).length + 1;
    $ulElemento.find('a.add-pack').closest('li').before('<li><a style="border: 1px solid blue !important;" href="#pack-' + pack.idnfPack +
        '" data-toggle="tab" class="tp-' + tipo + ' ag-' + retornaAgrup(dist) + '" ><i class="fa fa-pie-chart" aria-hidden="true"></i> ' + retornaDescAbaPack(tipo, dist) + pack.tipoPackDescricao +
        packTipoIndice +
        '<button style="margin-left: 7px;color:red!important;opacity: 0.5;" data-toggle="tooltip" class="close" type="button" title="Excluir Pack">×</button> </a></li>')
    var tbHtml = $.parseHTML(retornaTabelaEntPack("tblEnt-" + pack.idnfPack)), headerTb = criarTabelaPackEntrada(pack.packItens[0].dadosTamanho, tipo == 'DG');
    $(tbHtml).html(headerTb);
    $ulElemento.closest('div.tabbable.tabs-left').find('div.tab-content:first').append('<div class="tab-pane tp-' + tipo +
        '" id="pack-' + pack.idnfPack +
        '"><div class="row"><div class="col-md-12 col-sm-12 col-xs-12 table-responsive">' + $(tbHtml).prop('outerHTML') + '</div></div></div>');
    var hashTab = 'pack-' + pack.idnfPack;
    $('.nav-pills a[href="#' + hashTab + '"]').tab('show');
    var col = geraColunaPackPed(pack.packItens[0].dadosTamanho, tipo == 'DG')
    var dados = geraCargaPackPedido(pack, tipo == 'DG');
    carregarPackPedEnt("tblEnt-" + pack.idnfPack, dados, col, tipo == 'DG')

}
function retornaDescAbaPack(tipo, dist) {
    var retorno = ''
    if (tipo == 'DF') {
        retorno += 'Defeito ';
    } if (tipo == 'FG') {
        retorno += 'Fora Grade ';
    }
    if (dist !== "Completa") {
        retorno += '(Por ' + dist + ') ';
    }
    return retorno;

}
function carregaPackPedido() {
    if (idsPedAdd.length) {
        var objConsulta = {};
        objConsulta.pedidos = $.map(idsPedAdd, function (el) {
            var obj = {};
            obj.idPedido = Number(el);
            return obj;
        });
        $('#modalConsultaPedido').modal('hide');
        $(".navbar.navbar-default.navbar-fixed-top").addClass('ocultarElemento');
        $(".bg_load").show();
        $(".wrapper").show();
        retornaCargaPedidoEntrada(objConsulta)
    } else {
        $.confirm({
            title: 'Atenção!',
            content: 'É necessário selecionar ao menos um pedido para executar esta operação!',
            icon: 'fa fa-warning',
            theme: 'modern',
            closeIcon: false,
            animation: 'scale',
            typeAnimated: true,
            type: 'orange',
            buttons: {
                okButton: {
                    text: 'OK'
                }
            },

        });
    }

}
function criaFrmDadosProdPed(dados) {
    var foto = dados.fotoProduto ?
        'data:image/' + dados.fotoProduto.extensao.toLowerCase() + ';base64,' + dados.fotoProduto.imagem :
        '../Assets/images/nexttLogo.png'
    var frm = '<fieldset class="frmDados collapsible">' +
        '<legend>Dados do Produto</legend>' +
        '<div class="field-body">' +

        '<div class="col-md-10 col-sm-12 col-xs-12">' +

        '<div class="row">' +
        '<div class="col-md-2 col-sm-12 col-xs-12">' +
        '<h5 ><b>Data Cadastro</b></h5>' +
        '<span class="dtCadProd">' + dados.dataCadastro + '</span>' +
        '</div>' +
        '<div class="col-md-2 col-sm-12 col-xs-12">' +
        '<h5 ><b>Prev. Entrega</b></h5>' +
        '<span class="dtEntProd">' + dados.dataEntregaPrazo + '</span>' +
        '</div>' +
        '<div class="col-md-2 col-sm-12 col-xs-12">' +
        '<h5 ><b>Comprador</b></h5>' +
        '<span class="compProd">' + dados.nomeUsuario + '</span>' +
        '</div>' +
        '<div class="col-md-2 col-sm-12 col-xs-12">' +
        '<h5 ><b>Código</b></h5>' +
        '<span class="codProd">' + dados.codProduto + '</span>' +
        '</div>' +
        '<div class="col-md-2 col-sm-12 col-xs-12">' +
        '<h5 ><b>Marca</b></h5>' +
        '<span class="marcProd">' + dados.descricaoMarca + '</span>' +
        '</div>' +
        '<div class="col-md-2 col-sm-12 col-xs-12">' +
        '<h5 ><b>Descrição</b></h5>' +
        '<span class="descProd">' + dados.descricaoProduto + '</span>' +
        '</div>' +

        '</div>' +

        '<div class="row">' +
        '<div class="col-md-2 col-sm-12 col-xs-12">' +
        '<h5 ><b>Class. Fiscal</b></h5>' +
        '<span class="claFisProd">' + dados.descricaoClassificacao + '</span>' +
        '</div>' +
        '<div class="col-md-2 col-sm-12 col-xs-12">' +
        '<h5 ><b>Cód. Original</b></h5>' +
        '<span class="codOriProd">' + dados.codOriginal + '</span>' +
        '</div>' +
        '<div class="col-md-2 col-sm-12 col-xs-12">' +
        '<h5 ><b>Referência</b></h5>' +
        '<span class="refProd">' + dados.referenciaFornecedor + '</span>' +
        '</div>' +
        '<div class="col-md-2 col-sm-12 col-xs-12">' +
        '<h5 ><b>Uni. Medida</b></h5>' +
        '<span class="uniMedProd">' + dados.unidadeMedidaDescricao + '</span>' +
        '</div>' +
        '<div class="col-md-4 col-sm-12 col-xs-12">' +
        '<h5 ><b>Segmento/Seção/Espécie</b></h5>' +
        '<span class="segProd">' + dados.descricaoSegmento + ' / ' + dados.descricaoSecao + ' / ' + dados.descricaoEspecie + '</span>' +
        '</div>' +

        '</div>' +

        '</div>' +

        '<div class="col-md-2 col-sm-12 col-xs-12">' +
        '<div class="input-icon pull-right">' +
        '<img class="img-responsive" style="width:150px; height:130px" src="' + foto + '" />' +
        '</div>' +
        '</div>' +

        '</div>' +
        '</fieldset>' +
        '<br />' +
        '<h5 style="color:green" class="text-center"><strong>Packs</h5>'

    return frm;
}
function criarAbaPackPedido(pedidoDados, dadosPackEnt) {
    var frmDados = criaFrmDadosProdPed(pedidoDados);
    $('a.add-pedido').closest('li').before('<li id="li' + pedidoDados.idPedido + '"><a href="#tabPedEnt' + pedidoDados.idPedido +
        '" style="border: 1px solid blue !important;" role="tab" data-toggle="tab">Ped ' + ajustaCodigoTamanho(pedidoDados.idPedido, 6) +
        '<button style="margin-left: 7px;color:red!important;opacity: 0.5;" data-toggle="tooltip" class="close" type="button" title="Excluir Pedido">×</button> </a></li>');
    $('#packPedidoNF div.tab-content:first').append('<div class="tab-pane" id="tabPedEnt' + pedidoDados.idPedido +
        '"> <div class="span' + pedidoDados.idPedido + '">' + frmDados + '</div></div>');

    $('.nav-pills a[href="#tabPedEnt' + pedidoDados.idPedido + '"]').tab('show');
    $("#tabPedEnt" + pedidoDados.idPedido + " .frmDados.collapsible").collapsible({
        animation: true,
        speed: "medium"
    });
    criarTabPacksPedido(dadosPackEnt, pedidoDados.idPedido);
    for (var i = 0; i < dadosPackEnt.length; i++) {
        var hashTab = 'pack-' + dadosPackEnt[i].idnfPack;
        $('.nav-pills a[href="#' + hashTab + '"]').tab('show');
        var col = geraColunaPackPed(dadosPackEnt[i].packItens[0].dadosTamanho, dadosPackEnt[i].tipoPack == 'DG')
        var dados = geraCargaPackPedido(dadosPackEnt[i], dadosPackEnt[i].tipoPack == 'DG');
        carregarPackPedEnt("tblEnt-" + dadosPackEnt[i].idnfPack, dados, col, dadosPackEnt[i].tipoPack == 'DG')
    }
}
function criaPainelEntPack(id, titulo) {
    return '<div class="row"><fieldset id="' + id + '" class="collapsible entPackForm"><legend>' + titulo +
        '&nbsp; &nbsp;</legend><div class="field-body"><div class="col-md-12 col-sm-12 col-xs-12 table-responsive"></div></div></fieldset></div>'
}
function geraColunaPackPed(tamanhosPack, naGrade) {
    var classeEditaItem = naGrade ? '' : 'qtdPack '
    var colunasPack = [{ "data": "referenciaItem", 'className': 'separaDireita' }, { "data": "descricaoCor", 'className': 'separaDireita' }];
    for (var i = 0; i < tamanhosPack.length; i++) {
        colunasPack.push(
            {
                "data": "tamanho" + converterFormatoVariavel(toTitleCase(tamanhosPack[i].descricaoTamanho)), 'className': classeEditaItem + 'separaDireita editavelCol'
            },
        );
    };
    for (var i = 0; i < tamanhosPack.length; i++) {
        colunasPack.push(
            {
                "data": "itemId_tamanho" + converterFormatoVariavel(toTitleCase(tamanhosPack[i].descricaoTamanho)), 'className': 'idItensNF'
            },
        );
    };

    colunasPack.push({ "data": "totalCor", 'className': 'separaDireita qtdPackTot' });
    if (naGrade) {
        colunasPack.push(
            { "data": "totalPedido", 'className': 'separaDireita qtdPackPed' },
            { "data": "totalNota", 'className': 'separaDireita qtdPackNota' });
    }
    colunasPack.push({ "data": "totalRecebido", 'className': 'separaDireita qtdPackEnt' });
    return colunasPack;
}
function geraCargaPackPedido(pack, naGrade) {
    var retorno = [];
    var totalItens = 0;
    for (var i = 0; i < pack.packItens.length; i++) {
        var objPack = {};
        var totalCor = 0;
        objPack.referenciaItem = pack.packItens[i].referenciaItem;
        objPack.descricaoCor = pack.packItens[i].descricaoCor;
        for (var j = 0; j < pack.packItens[i].dadosTamanho.length; j++) {
            objPack["tamanho" + converterFormatoVariavel(toTitleCase(pack.packItens[i].dadosTamanho[j].descricaoTamanho))] = pack.packItens[i].dadosTamanho[j].qtdeItens;
            totalCor += pack.packItens[i].dadosTamanho[j].qtdeItens
        }
        for (var j = 0; j < pack.packItens[i].dadosTamanho.length; j++) {
            objPack["itemId_tamanho" + converterFormatoVariavel(toTitleCase(pack.packItens[i].dadosTamanho[j].descricaoTamanho))] =
                pack.packItens[i].dadosTamanho[j].idPackProdutoItem + '_' + pack.packItens[i].dadosTamanho[j].idProdutoItem;
        }
        objPack.totalCor = totalCor;
        if (naGrade) {
            objPack.totalPedido = pack.qtdePedido;
            objPack.totalNota = pack.qtdeNota;
        }
        objPack.totalRecebido = pack.qtdeEntregue;
        retorno.push(objPack);
    }
    console.log(retorno)
    return retorno;

}
function criaObjConsultaPedNf() {
    //$('.selectpicker').selectpicker('hide');
    //$(".navbar.navbar-default.navbar-fixed-top").addClass('ocultarElemento');
    ////objEnvio = {};
    //objEnvio.codigo = "2";
    ////var statusAtual = retornaStatusValor($(this).closest('tr').children().eq(12).html());
    //$('.btnFooters .exibeBtn').addClass('ocultarElemento');
    //carregaPedidoSintetico(objEnvio)
    //$(".bg_load").show();
    //$(".wrapper").show();

    var objConsulta = {};
    objConsulta.idPedido = $("#txtIdPed").val();
    objConsulta.segmentos = $.map($('#drpSeg option:selected'), function (elSeg) {
        var obj = {};
        var idSeg = Number($(elSeg).val().replace(/[^\d,]/g, ''));
        obj.idSegmento = idSeg;
        obj.secoes = $.map($('#drpSec option:selected'), function (elSec) {
            var token = $(elSec).data('tokens').split(';')[0];
            if (Number(token.split('-')[0]) === idSeg) {
                var objSec = {};
                var idSec = Number(token.split('-')[1]);
                objSec.idSecao = idSec;
                objSec.especies = $.map($('#drpEsp option:selected'), function (elEsp) {
                    var tokenEsp = $(elEsp).data('tokens').split(';')[0];
                    if (idSec === Number(tokenEsp.split('-')[0])) {
                        var objEsp = {};
                        objEsp.idEspecie = Number($(elEsp).val().split('-')[0])
                        return objEsp;
                    }
                });
                return objSec;
            }
        });
        return obj;
    });
    objConsulta.codigoProduto = $("#txtIdProd").val();

    objConsulta.dataEntregaInicio = formataStringData($('#txtDtEntregaPed').val().split(' - ')[0]);
    objConsulta.dataEntregaFinal = formataStringData($('#txtDtEntregaPed').val().split(' - ')[1]);
    objConsulta.fornecedores = $.map($('#drpCNPJ option:selected'), function (el) {
        var obj = {};
        obj.idFornecedor = Number($(el).val());
        return obj;
    });
    objConsulta.marcas = $.map($('#drpMarc option:selected'), function (el) {
        var obj = {};
        obj.idMarca = Number($(el).val());
        return obj;
    });
    objConsulta.filiais = $.map($('#drpFiliais option:selected'), function (el) {
        var obj = {};
        obj.idFilial = Number($(el).val());
        return obj;
    });
    objConsulta.statusNFFornecedores = $.map($('#cbStatus option:selected'), function (el) {
        var obj = {};
        obj.status = $(el).val();
        return obj;
    });
    return objConsulta;
}
function carregarPackPedEnt(id, dados, coluna, naGrade) {
    var agrupaLinha = [-1, 0], dados, colunas;
    if (naGrade) {
        agrupaLinha.unshift(-3, -2);
    }
    var tbEntPackPed = $('#' + id).DataTable({
        paging: false, /* define se a tabela deve usar paginação */
        searching: false, /* define se deve usar o campo Buscar dentro da tabela */
        lengthChange: false,
        rowsGroup: agrupaLinha,
        destroy: true,
        ordering: false,
        scrollCollapse: true,
        deferRender: true,
        responsive: true,
        data: dados,
        "columnDefs": [
            {
                "targets": "idItensNF",
                "visible": false
            },
            {
                "targets": "groupHeaderTableRigth",
                "orderable": false,
                'className': 'dt-body-center groupHeaderTableRigth'
            },
            {
                "targets": "_all",
                "render": function (data, type, row, meta) {
                    if (type === 'display' && meta.col > 1 && isNumber(data)) {

                        return data.toLocaleString('pt-BR')

                    }
                    else return data;
                }
            }
        ],
        "info": false,
        columns: coluna
    })

    recalculaTotalLinhaNF(tbEntPackPed);
    recalculaTotalColunas(tbEntPackPed);
    recalculaTotalColunasNF(tbEntPackPed)
    tbEntPackPed.rows().invalidate().draw();

}
function geraEditorDesc(tipo, val) {
    var elemento = '';
    val = typeof val === "undefined" || val === null ? '' : val;
    switch (tipo) {
        case 'Monetario':
            if (!val.length) val = "0"; else val = val.replace('.', ',');
            elemento = '<td colspan="3"><div style="width: 100%!important;"><input onkeyup="validaValorDesc(this,event)" onblur="perdeFocoDesc(this)" data-initial-val="' + val + '"  data-prefix="R$ " data-select-all-on-focus="true" data-affixes-stay="true" data-allow-zero="true" data-thousands="." data-decimal="," data-precision="2" type="text" class="form-control descMon" style="width:inherit!important" value="' + val + '" /></div></td>';
            break;
        case 'Percentual':
            if (!val.length) val = "0"; else val = val.replace('.', ',');

            elemento = '<td colspan="3"><div style="width: 100%!important;"><input onkeyup="validaValorDesc(this,event)" onblur="perdeFocoDesc(this)" data-initial-val="' + val +
                '" data-suffix="%" data-max-val="100" data-min-val="0" data-select-all-on-focus="true" data-affixes-stay="true" data-allow-zero="true" type="text" class="form-control descPerc" style="width:inherit!important" value="' + val + '" /></div></td>';
            break;
    }
    return elemento;

}
function validaValorDesc(e, evento) {
    var code = (evento.keyCode ? evento.keyCode : evento.which);
    if (code === 9 || code === 13) {
        $(e).blur();
    } else {
        var isPerc = $(e).hasClass('descPerc');
        var valIni = Number($(e).attr("data-initial-val").replace(',', '.'));
        var valAtual = $(e).maskMoney('unmasked')[0];
        if (isPerc) {
            var limMax = parseInt($(e).attr("data-max-val"));
            var limMin = parseInt($(e).attr("data-min-val"));
            var valAtu = valAtual <= limMax && valAtual >= limMin ? valAtual.toString().replace('.', ',') : valIni.toString().replace('.', ',');
            $(e).attr("data-initial-val", valAtu);
            $(e).val(valAtu).maskMoney('mask');
        } else {
            $(e).attr("data-initial-val", valAtual);
            $(e).val(valAtual.toString().replace('.', ',')).maskMoney('mask');
        }

    }
}
function recalculaTotalNFTit(tbAPI) {
    tbAPI.columns.adjust().draw();
    var apiPedCusto = $('#tabelaPedCustoTit').dataTable().api(), totCust = apiPedCusto.column(2).data().reduce(function (a, b) {
        return a + b;
    }, 0);
    var htmlOpt = $.parseHTML(localStorage.getItem('descCombo'));
    tbAPI.rows().every(function (rowIdx, tableLoop, rowLoop) {
        var tipo = '';
        htmlOpt.map(obj => {
            if ($(obj).attr("value") === tbAPI.row(rowIdx).data().tipo.toString()) {
                tipo = $(obj).data('tokens');
            }
        });
        if (tipo) {
            switch (tipo) {
                case 'D':
                    totCust -= tbAPI.row(rowIdx).data().valor;
                    break;
                case 'A':
                    totCust += tbAPI.row(rowIdx).data().valor;
                    break;
                default:
            }
        }
    });

    $('label.titValTot').html(totCust.toLocaleString('pt-BR', { style: "currency", currency: "BRL" }));

}
function perdeFocoDesc(e) {
    //cbTipoDescGrid
    var apiPedCusto = $('#tabelaPedCustoTit').dataTable().api(), totCust = apiPedCusto.column(2).data().reduce(function (a, b) {
        return a + b;
    }, 0);
    var tbPlanejamento = $('#' + gridNome).dataTable().api(), colunaAtualizada = $(e).hasClass('descPerc') ? 'fator' : 'valor';

    if (colunaAtualizada == 'fator') {
        tbPlanejamento.row(row).data().valor = totCust * ($(e).maskMoney('unmasked')[0] / 100)
    } else {
        tbPlanejamento.row(row).data().fator = ($(e).maskMoney('unmasked')[0] * 100) / totCust;
    }
    //$('#txtValTotalDup').maskMoney('unmasked')[0]

    tbPlanejamento.row($(row).index()).data()[colunaAtualizada] = $(e).maskMoney('unmasked')[0];
    var dadosCarga = tbPlanejamento.data().toArray();
    tbPlanejamento.clear();
    tbPlanejamento.data(tbPlanejamento).rows.add(dadosCarga);
    tbPlanejamento.draw();
    tbPlanejamento.columns.adjust().draw();
    recalculaTotalNFTit(tbPlanejamento)
    $(".selectpicker").selectpicker('refresh');
}
function geraDadosTabelaDesc(dados) {
    var dadosRetorno = []
    var apiPedCusto = $('#tabelaPedCustoTit').dataTable().api(), totCust = apiPedCusto.column(2).data().reduce(function (a, b) {
        return a + b;
    }, 0);
    if (dados.length)
        for (var i = 0; i < dados.length; i++)
            dadosRetorno.push({ tipo: dados[i].idTipoDescontoAcrescimo, valor: dados[i].valor, fator: (dados[i].valor * 100) / totCust })
    console.log(dadosRetorno)
    carregaTabelaDesc(dadosRetorno);

}
function desabilitaEdicaNF() {
    $('#tabNota').find('input[type=text]').attr("disabled", true);
    $('#tabNota').find('.selectpicker:not([multiple])').attr("disabled", true);
    $('#tabNota').find('.selectpicker:not([disabled]) option').attr("disabled", true);
    $('#tabNota').find(".selectpicker").selectpicker('destroy').selectpicker({
        liveSearch: false,
        actionsBox: false,
    });
    $('#tabPedido').find('input[type=text]').attr("disabled", true);
    $('#tabPedido').find('.selectpicker:not([multiple])').attr("disabled", true);
    $('#tabPedido').find('.selectpicker:not([disabled]) option').attr("disabled", true);
    $('#tabPedido').find(".selectpicker").selectpicker('destroy').selectpicker({
        liveSearch: false,
        actionsBox: false,
    });
    $('a button.close').remove();
    $('a.add-pack').closest('li').remove();
    $('a.add-pedido').closest('li').remove();
    $('#txtAreaObsNF').attr("disabled", true);
    if (statusAtual == 'CF') {
        $('.gera-titulo').addClass('ocultarElemento');
        $('.confirma-titulo').addClass('ocultarElemento');
        $('#txtCadCondPgtoNF').attr("disabled", true);
        $('.cancela-titulo').addClass('ocultarElemento')
        $('#tabDuplicata').find('.selectpicker:not([multiple])').attr("disabled", true);
        $('#tabDuplicata').find('.selectpicker:not([disabled]) option').attr("disabled", true);

    }
}
function validaInputCondPgtoNF(e) {
    var keyCode = e.which ? e.which : e.keyCode, dInput = $("#txtCadCondPgtoNF").val(), retorno = keyCode >= 48 && keyCode <= 57 || specialKeys.indexOf(keyCode) !== -1;
    if (keyCode === specialKeys[1]) retorno = (dInput.length > 0 && dInput.slice(-1) !== '+');
    return retorno;
}
function validaBlurCondPgtoNF() {
    var $txtCondPg = $("#txtCadCondPgtoNF"), arrayValidar = $txtCondPg.val().split('+');
    if (!validaArrayCondPgtoNF(arrayValidar)) {
        $txtCondPg.popover({
            title: '<h5 class="custom-title"><span class="glyphicon glyphicon-exclamation-sign orange"></span> Atenção!</h5>',
            content: "<p>É necessário que as datas estejam em ordem crescente. Exemplo:</p>" +
                '<ul class="fa-ul">' +
                '<li><i class="fa-li fa fa-check green"></i><strong>30+60+90</strong></li>' +
                '<li><i class="fa-li fa fa-ban red"></i><strong>1+10+5</strong></li>' +
                '</ul>',
            html: true,
            trigger: 'manual',
            container: 'body',
            placement: 'auto'
        });
        $txtCondPg.popover('show');
        $txtCondPg.focus().select();
        setTimeout(function () {
            $txtCondPg.popover('destroy');
        }, 5000);
    }
}
function validaArrayCondPgtoNF(arrayCondPgtoValidar) {
    var valorAnterior = arrayCondPgtoValidar[0], retorno = true;
    for (i = 1; i < arrayCondPgtoValidar.length; ++i) {
        if (parseInt(arrayCondPgtoValidar[i]) < parseInt(valorAnterior)) {
            retorno = false;
            break;
        } else {
            valorAnterior = arrayCondPgtoValidar[i];
        }
    }
    return retorno;
}
function carregaValPadraoDuplicata(dados) {
    var valorTotalNota = dados.pedidosDuplicata.reduce(function (sum, pedVal) {
        return sum + pedVal.valorTotal;
    }, 0);
    $("#txtCadCondPgtoNF").val(dados.plano);
    $('#txtValTotalDup').val(valorTotalNota.toFixed(2).replace('.', ',')).maskMoney('mask');
    $("#drpTpDoc").selectpicker('val', dados.idFormaPagamento);
    $("#drpGrpEmpDup").selectpicker('val', dados.idGrupoEmpresaFaturamento);

}