function modal(options) {
    var deferredObject = $.Deferred();
    var defaults = {
        type: "alert", //alert, prompt,confirm 
        modalSize: 'modal-sm', //modal-sm, modal-lg
        okButtonText: 'Ok',
        cancelButtonText: 'Cancel',
        yesButtonText: 'Sim',
        noButtonText: 'Não',
        headerText: 'Atenção',
        messageText: 'Message',
        alertType: 'default', //default, primary, success, info, warning, danger
        inputFieldType: 'text', //could ask for number,email,etc
        titleClass:''
    }
    $.extend(defaults, options);

    var _show = function () {
        var headClass = "navbar-default";
        switch (defaults.alertType) {
            case "primary":
                headClass = "alert-primary";
                break;
            case "success":
                headClass = "alert-success";
                break;
            case "info":
                headClass = "alert-info";
                break;
            case "warning":
                headClass = "alert-warning";
                break;
            case "danger":
                headClass = "alert-danger";
                break;
        }
        $('BODY').append(
            '<div id="modalAlerta" class="modal fade">' +
            '<div class="modal-dialog ' + defaults.modalSize + '">' +
            '<div class="modal-content">' +
            '<div id="modalAlerta-header" class="modal-header ' + headClass + '">' +
            //'<button id="close-button" type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
            '<h4 id="modalAlerta-title" class="modal-title">Modal title</h4>' +
            '</div>' +
            '<div id="modalAlerta-body" class="modal-body">' +
            '<div id="modalAlerta-message" ></div>' +
            '</div>' +
            '<div id="modalAlerta-footer" class="modal-footer">' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>'
        );

        $('.modal-header').css({
            'padding': '5px 15px',
            '-webkit-border-top-left-radius': '5px',
            '-webkit-border-top-right-radius': '5px',
            '-moz-border-radius-topleft': '5px',
            '-moz-border-radius-topright': '5px',
            'border-top-left-radius': '5px',
            'border-top-right-radius': '5px'
        });
        if (defaults.titleClass.length) {
            $('#modalAlerta-title').addClass(defaults.titleClass)
        }
        $('#modalAlerta-title').html(defaults.headerText);
        $('#modalAlerta-message').html(defaults.messageText);

        var keyb = "false", backd = "static";
        var calbackParam = "";
        switch (defaults.type) {
            case 'alert':
                $('#modalAlerta-footer').html('<button class="btn btn-' + defaults.alertType + '">' + defaults.okButtonText + '</button>').on('click', ".btn", function () {
                    calbackParam = true;
                    $('#modalAlerta').modal('hide');
                });
                break;
            case 'confirm':
                var btnhtml = '<button id="alok-btn" class="btn btn-success">' + defaults.yesButtonText + '</button>';
                if (defaults.noButtonText && defaults.noButtonText.length > 0) {
                    btnhtml += '<button id="alclose-btn" class="btn btn-danger">' + defaults.noButtonText + '</button>';
                }
                $('#modalAlerta-footer').html(btnhtml).on('click', 'button', function (e) {
                    if (e.target.id === 'alok-btn') {
                        calbackParam = true;
                        $('#modalAlerta').modal('hide');
                    } else if (e.target.id === 'alclose-btn') {
                        calbackParam = false;
                        $('#modalAlerta').modal('hide');
                    }
                });
                break;
            case 'prompt':
                $('#modalAlerta-message').html(defaults.messageText + '<br /><br /><div class="form-group"><input type="' +
                    defaults.inputFieldType + '" class="form-control" id="prompt" /></div>');
                $('#modalAlerta-footer').html('<button class="btn btn-primary">' + defaults.okButtonText + '</button>').on('click', ".btn", function () {
                    calbackParam = $('#prompt').val();
                    $('#modalAlerta').modal('hide');
                });
                break;
        }

        $('#modalAlerta').modal({
            show: false,
            backdrop: backd,
            keyboard: keyb
        }).on('hidden.bs.modal', function (e) {
            $('#modalAlerta').remove();
            deferredObject.resolve(calbackParam);
        }).on('shown.bs.modal', function (e) {
            if ($('#prompt').length > 0) {
                $('#prompt').focus();
            }
        }).modal('show');
    }
    _show();
    return deferredObject.promise();
}