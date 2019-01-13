var jc2;
$(function () {

    $("#give_feedback").click(function () {
        var jc = $.confirm({
            icon: 'fa fa-spinner fa-spin',
            title: 'Aguarde!',
            content: 'Seu feedback está sendo enviado!',
            closeIcon: false,
            type: 'orange',
            animation: 'scale',
            buttons: {
                okButton: {
                    text: 'ok'
                }
            },
            onContentReady: function () {
                // when content is fetched & rendered in DOM
                setTimeout(function () {
                    setTimeout(function () {
                        setTimeout(function () {
                            jc.close()
                        }, 4000);
                    }, 4000);
                }, 4000);
            },
            onOpenBefore: function () {
                // before the modal is displayed.
                this.buttons.okButton.hide();
            },
            onDestroy: function () {
                jc2 = $.confirm({
                    title: 'Muito obrigado pela sua colaboração!',
                    content: 'Seu feedback foi enviado corretamente. Vamos trabalhar com ele para melhorar os nossos serviços.',
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
                        }, 6000);
                    },
                    onOpenBefore: function () {
                        // before the modal is displayed.
                        this.buttons.okButton.hide();
                    },
                    onDestroy: function () { salvarDadosCompra(true) }
                });
            },
        });
        $("#main_popup").hide();
    });
    $("#send_letter").click(function () {
        var jc = $.confirm({
            title: 'Aguardaremos sua colaboração!',
            content: 'Vamos aguardar seu feedback no futuro para nos ajudar a melhorar os nossos serviços.',
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
                    jc.close()
                }, 6000);
            },
            onOpenBefore: function () {
                this.buttons.okButton.hide();
            },
            onDestroy: function () { salvarDadosCompra(false) }
        });
    });
    $('.rating').magicRatingInit({
        success: function (magicRatingWidget, rating) {
            $(magicRatingWidget).data("currentRating", rating)
        }
    });

});

$(function () {
    $('.mat-input-outer label').click(function () {
        $(this).prev('input').focus();
    });
    $('.mat-input-outer input').focusin(function () {
        $(this).next('label').addClass('active');
    });
    $('.mat-input-outer input').focusout(function () {
        if (!$(this).val()) {
            $(this).next('label').removeClass('active');
        } else {
            $(this).next('label').addClass('active');
        }
    });

});

function salvarDadosCompra(comFeedback) {
    var dadosOrigemCompra = JSON.parse(sessionStorage.getItem("produtosLista")), codProd = $("#txtProdutoPed").val(), codForn = $("#drpCNPJ").val();
    if (sessionStorage.getItem("cadastroNovo")) {
        continuarCompraProdNovo()
    } else {
        $(".bg_load").show();
        $(".wrapper").show(); 
        if (dadosOrigemCompra) {
            for (var i = 0; i < dadosOrigemCompra.length; i++) {
                if (dadosOrigemCompra[i].codProduto === codProd && dadosOrigemCompra[i].idFornecedor === codForn ) {
                    dadosOrigemCompra[i].status = true;
                    dadosOrigemCompra[i].idPedido = compraId;
                }
            }
            sessionStorage.removeItem('compra');
            sessionStorage.removeItem('pedidoId');
            sessionStorage.setItem("produtosLista", JSON.stringify(dadosOrigemCompra));
            window.location = "../gerenciamento/compraprodutos.cshtml";
        } else if (compraId) {
            window.location = "../gerenciamento/pedido.cshtml";
        } else {
            window.location = "../gerenciamento/compra.cshtml";
        }
    }

}

$.fn.magicRatingInit = function (config) {
    for (var k = 0; k < $(this).length; k++) {
        var magicRatingWidget = $($(this)[k]), currentRating = magicRatingWidget.data("currentRating");
        var lblAval = magicRatingWidget.attr('id').replace('rating', '#aval');
        if (currentRating <= 1) {
            $(lblAval).removeAttr('class').addClass("label label-danger").html('Péssimo');
        } else if (currentRating === 2 || currentRating === 3) {
            $(lblAval).removeAttr('class').addClass("label label-warning").html('Ruim');
        }
        else if (currentRating === 4 || currentRating === 5) {
            $(lblAval).removeAttr('class').addClass("label label-default").html('Regular');
        }
        else if (currentRating === 6 || currentRating === 7) {
            $(lblAval).removeAttr('class').addClass("label label-info").html('Bom');
        }
        else if (currentRating === 8 || currentRating === 9) {
            $(lblAval).removeAttr('class').addClass("label label-primary").html('Ótimo');
        }
        else if (currentRating > 9) {
            $(lblAval).removeAttr('class').addClass("label label-success").html('Excelente');
        }
        if (magicRatingWidget.data("iconGood") === null) {
            magicRatingWidget.data("iconGood", config.iconGood !== null ? config.iconGood : "fa-star");
        };
        if (magicRatingWidget.data("iconBad") === null) {
            magicRatingWidget.data("iconBad", config.iconBad !== null ? config.iconBad : "fa-star-o");
        };
        if (magicRatingWidget.data("maxMark") === null) {
            magicRatingWidget.data("maxMark", config.maxMark !== null ? config.maxMark : 10);
        }
        magicRatingWidget.html("");

        for (i = 1; i <= magicRatingWidget.data("maxMark"); i++) {
            if (i <= magicRatingWidget.data("currentRating")) {
                magicRatingWidget.append('<i class=" ' + magicRatingWidget.data("iconGood") + ' magic-rating-icon" aria-hidden="true" data-default=true data-rating=' + i + '></i>');
            } else {
                magicRatingWidget.append('<i class=" ' + magicRatingWidget.data("iconBad") + ' magic-rating-icon" aria-hidden="true" data-default=false data-rating=' + i + '></i>');
            }
        }
        magicRatingWidget.on("mouseleave", function () {
            var widget = $(this);
            var rating = widget.data("currentRating")
            var labelAval = widget.attr('id').replace('rating', '#aval');
            if (rating <= 1) {
                $(labelAval).removeAttr('class').addClass("label label-danger").html('Péssimo');
            } else if (rating === 2 || rating === 3) {
                $(labelAval).removeAttr('class').addClass("label label-warning").html('Ruim');
            }
            else if (rating === 4 || rating === 5) {
                $(labelAval).removeAttr('class').addClass("label label-default").html('Regular');
            }
            else if (rating === 6 || rating === 7) {
                $(labelAval).removeAttr('class').addClass("label label-info").html('Bom');
            }
            else if (rating === 8 || rating === 9) {
                $(labelAval).removeAttr('class').addClass("label label-primary").html('Ótimo');
            }
            else if (rating > 9) {
                $(labelAval).removeAttr('class').addClass("label label-success").html('Excelente');
            }
            widget.children().each(function () {
                var icon = $(this);
                if (icon.data("default") && !icon.hasClass("fa-star")) {
                    icon.removeClass(widget.data("iconBad"));
                    icon.addClass(widget.data("iconGood"));
                } else if (!icon.data("default") && !icon.hasClass("fa-star-o")) {
                    icon.removeClass(widget.data("iconGood"));
                    icon.addClass(widget.data("iconBad"));
                }
            });
        });
        magicRatingWidget.on("click", ".magic-rating-icon", function () {
            var icon = $(this);
            var widget = icon.parent();
            var rating = icon.data("rating");
            widget.children().each(function () {
                if ($(this).data("rating") <= rating) {
                    if (!$(this).hasClass(widget.data("iconGood"))) {
                        $(this).removeClass(widget.data("iconBad"));
                        $(this).addClass(widget.data("iconGood"));
                    };
                    $(this).data("default", true);
                } else {
                    if (!$(this).hasClass(widget.data("iconBad"))) {
                        $(this).removeClass(widget.data("iconGood"));
                        $(this).addClass(widget.data("iconBad"));
                    }
                    $(this).data("default", false);
                }
            });
            var labelAval = $(widget).attr('id').replace('rating', '#aval');
            if (rating <= 1) {
                $(labelAval).removeAttr('class').addClass("label label-danger").html('Péssimo');
            } else if (rating === 2 || rating === 3) {
                $(labelAval).removeAttr('class').addClass("label label-warning").html('Ruim');
            }
            else if (rating === 4 || rating === 5) {
                $(labelAval).removeAttr('class').addClass("label label-default").html('Regular');
            }
            else if (rating === 6 || rating === 7) {
                $(labelAval).removeAttr('class').addClass("label label-info").html('Bom');
            }
            else if (rating === 8 || rating === 9) {
                $(labelAval).removeAttr('class').addClass("label label-primary").html('Ótimo');
            }
            else if (rating > 9) {
                $(labelAval).removeAttr('class').addClass("label label-success").html('Excelente');
            }
            var callbackSuccess = config.success.bind(null, widget, rating);
            callbackSuccess();
        });

        // Init hover icons
        magicRatingWidget.on("mouseenter", ".magic-rating-icon", function () {
            var icon = $(this);
            var rating = icon.data("rating");
            var widget = icon.parent();
            var labelAval = $(widget).attr('id').replace('rating', '#aval');
            if (rating <= 1) {
                $(labelAval).removeAttr('class').addClass("label label-danger").html('Péssimo');
            } else if (rating === 2 || rating === 3) {
                $(labelAval).removeAttr('class').addClass("label label-warning").html('Ruim');
            }
            else if (rating === 4 || rating === 5) {
                $(labelAval).removeAttr('class').addClass("label label-default").html('Regular');
            }
            else if (rating === 6 || rating === 7) {
                $(labelAval).removeAttr('class').addClass("label label-info").html('Bom');
            }
            else if (rating === 8 || rating === 9) {
                $(labelAval).removeAttr('class').addClass("label label-primary").html('Ótimo');
            }
            else if (rating > 9) {
                $(labelAval).removeAttr('class').addClass("label label-success").html('Excelente');
            }
            widget.children().each(function () {
                if ($(this).data("rating") <= rating) {
                    if (!$(this).hasClass(widget.data("iconGood"))) {
                        $(this).removeClass(widget.data("iconBad"));
                        $(this).addClass(widget.data("iconGood"));
                    };
                } else {
                    if (!$(this).hasClass(widget.data("iconBad"))) {
                        $(this).removeClass(widget.data("iconGood"));
                        $(this).addClass(widget.data("iconBad"));
                    }
                }
            });
        });
    }
};
