var fullDate = new Date();
var twoDigitMonth = (fullDate.getMonth() + 1) + ""; if (twoDigitMonth.length === 1) twoDigitMonth = "0" + twoDigitMonth;
var twoDigitDate = fullDate.getDate() + ""; if (twoDigitDate.length === 1) twoDigitDate = "0" + twoDigitDate;
var currentDate = twoDigitDate + "/" + twoDigitMonth + "/" + fullDate.getFullYear();
$(document).ready(function () {
    $.confirm({
        icon: 'glyphicon glyphicon-edit',
        type: 'blue',
        title: 'Cadastrar Fornecedor!',
        content:  '<h4>Selecione a modalidade de cadastro</h4>' +
        '<div class="phradio">' +
        '<div class="phradio-primary">' +
        '<input type="radio" name="radio" id="radio5" />' +
        '<label for="radio5">Pessoa Física</label>' +
        '</div>' +
        '<div class="phradio-primary">' +
        '<input type="radio" name="radio" id="radio6" />' +
        '<label for="radio6">Pessoa Jurídica</label>' +
        '</div>' +
        '</div>',
        buttons: {
            confirm: {
                text: 'Avançar',
                btnClass: 'btn-blue',
                action: function () {
                    $(".cadForn").fadeIn(3000);   

                }
            },
            
        }
    }); 
    (function ($) {
        fakewaffle.responsiveTabs(['xs', 'sm']);
    })(jQuery);
    $('.panel-group.responsive').on("show.bs.collapse", ".collapse", function (e) {
        var current = $(e.target).context.id.replace(/collapse-tab/g, '');
        if (!validaOperacaoPassoWizard(current, 'cliqueTabPanel')) {
            e.preventDefault();
        } else {
            $('.panel-group.responsive').find('.collapse.in').collapse('hide');
        }
    });
    $('#wizard-cad-forn  a.deco-none').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });
    $(".next-step").click(function (e) {
        var parametroTab = $('#wizard-cad-forn li.active').children()[0].hash.replace('#tab', '');
        if (validaOperacaoPassoWizard(parametroTab, 'nextt')) {
            var tabAtiva = $('#wizard-cad-forn li.active').next().children()[0].hash.replace('#', '#collapse-');
            mudaEtapa(tabAtiva, '#collapse-tab' + parametroTab);
        }
    });
    $(".prev-step").click(function (e) {
        var parametroTab = $('#wizard-cad-forn li.active').children()[0].hash.replace('#tab', '');
        if (validaOperacaoPassoWizard(parametroTab, 'back')) {
            var tabAtiva = $('#wizard-cad-forn li.active').prev().children()[0].hash.replace('#', '#collapse-');
            mudaEtapa(tabAtiva, '#collapse-tab' + parametroTab);
        }
    });

    $(window).load(function () {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
            $.fn.selectpicker.Constructor.DEFAULTS.mobile = true;
        }
    });

    $('#txtDtEntregaPed').daterangepicker({
        locale: configuracaoCalendarios,
        dateLimit: {
            "year": 1
        },
        "parentEl": "#principal",
        showDropdowns: true,
        alwaysShowCalendars: true,
        buttonClasses: "btn btn-small",
        cancelClass: "btn-primary",
        startDate: moment(),
        endDate: moment().endOf("month"),
        opens: 'left',
        linkedCalendars: false,
        ranges: {
            "Na Semana": recuperaRange('semana'),
            "No Mês Anterior": recuperaRange('mes'),
            "Último Semestre": recuperaRange('semestre'),
            "No Ano": recuperaRange('ano')
        }
    });

    $("#frmDados.collapsible").collapsible({
        animation: true,
        speed: "medium"
    });

    $("#frmAdcional.collapsible").collapsible({
        collapsed: true,
        animation: true,
        speed: "medium"
    });

    $('.navbar-fixed-top').find('.navbar-center').html('Cadastro de Fornecedor');
    $(".ckbCadPedido").bootstrapSwitch();
    $('.selectpicker').selectpicker('refresh');
    $('#txtDtCadastro').val(currentDate);
    $(document).on('keydown', '.txtInteiro', function (e) {
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
            (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
            (e.keyCode >= 35 && e.keyCode <= 40)) {
            return;
        }
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    })
    $('.calendario').daterangepicker({
        locale: configuracaoCalendarios,
        dateLimit: {
            "year": 1
        },
        //"parentEl": "#main-content",
        showDropdowns: true,
        alwaysShowCalendars: true,
        buttonClasses: "btn btn-md",
        cancelClass: "btn-primary",
        startDate: moment().startOf('month'),
        endDate: moment(),
        opens: 'center',
        linkedCalendars: false,
        ranges: {
            "Na Semana": recuperaRange('semana'),
            "No Mês Anterior": recuperaRange('mes'),
            "Último Semestre": recuperaRange('semestre'),
            "No Ano": recuperaRange('ano')
        }
    });
})
function mudaEtapa(elemShow, elemHide) {
    $(elemShow).collapse("show");
    $(elemHide).collapse("hide");
    $('#wizard-cad-ped a[href="#' + elemShow.replace('#collapse-', '') + '"]').tab('show');
}
//function validaOperacaoPassoWizard(parametroTab, evento) {
//    if (evento !== 'cliqueTabPanel') {
//        switch (parametroTab) {
//            case 'Dados':
//                return true;
//            case 'Grade':
//                return validaGrade(evento);
//            case 'Pack':
//                return validaPacksCadastradosExiste();
//            case 'Foto':
//                criaDistribuicaoFilial()
//                return true;
//            case 'Distribuicao':
//                return true;
//        }
//    } else {
//        switch (parametroTab) {
//            case 'Dados':
//                return true;
//            case 'Grade':
//                return true;
//            case 'Pack':
//                return validaGrade(evento);
//            case 'Foto':
//                if (validaPacksCadastradosExiste()) {
//                    criaDistribuicaoFilial();
//                    return true;
//                }
//                return false;
//            case 'Distribuicao':
//                return validaPacksCadastradosExiste();
//        }
//    }

//}
var room = 1;
function enderecoCadastro() {
    $(this).attr("onclick", "new_function_name()")
    var objTo = document.getElementById('address_fields')
    var copied = $('#address_register')
    var divtest = document.createElement("div");
    divtest.setAttribute("class", "form-group removeclass" + room);
    var rdiv = 'removeclass' + room;
    divtest.innerHTML = '<div class="col-sm-4 nopadding"><div class="form-group"> <input type="text" class="form-control" id="txtEndereco" name="txtEndereco[]" value="" placeholder="Digite o endereço"></div></div><div class="col-sm-1 nopadding"><div class="form-group"> <input type="text" class="form-control" id="txtNumero" name="txtNumero[]" value="" placeholder="Nº"></div></div><div class="col-sm-2 nopadding"><div class="form-group"> <input type="text" class="form-control" id="txtComplemento" name="txtComplemento[]" value="" placeholder="Complemento"></div></div><div class="col-sm-2 nopadding"><div class="form-group"> <input type="text" class="form-control" id="txtBairro" name="txtBairro[]" value="" placeholder="Bairro"></div></div><div class="col-sm-2 nopadding"><div class="form-group"> <input type="text" class="form-control" id="txtCidade" name="txtCidade[]" value="" placeholder="Cidade"></div></div><div class="col-sm-1 nopadding"><div class="form-group"><div class="input-group"> <select class="form-control" id="drpEstado" name="drpEstado[]" style="font-size: smaller!important;"><option value="">UF</option><option value="2015">2015</option><option value="2016">2016</option><option value="2017">2017</option><option value="2018">2018</option> </select><div class="input-group-btn"> <button class="btn btn-danger" type="button" onclick="remove_enderecoCadastro(' + room + ');">-</button></div></div></div></div>';

    objTo.appendChild(divtest)
}
function remove_enderecoCadastro(rid) {
    $('.removeclass' + rid).remove();
}
(function ($) {
    $(function () {

        var addFormGroup = function (event) {
            event.preventDefault();

            var $formGroup = $(this).closest('.form-group');
            var $multipleFormGroup = $formGroup.closest('.multiple-form-group');
            var $formGroupClone = $formGroup.clone();

            $(this)
                .toggleClass('btn-success btn-add btn-danger btn-remove')
                .html('–');

            $formGroupClone.find('input').val('');
            $formGroupClone.find('.concept').text('Telefone Comercial');
            $formGroupClone.insertAfter($formGroup);

            var $lastFormGroupLast = $multipleFormGroup.find('.form-group:last');
            if ($multipleFormGroup.data('max') <= countFormGroup($multipleFormGroup)) {
                $lastFormGroupLast.find('.btn-add').attr('disabled', true);
            }
        };

        var removeFormGroup = function (event) {
            event.preventDefault();

            var $formGroup = $(this).closest('.form-group');
            var $multipleFormGroup = $formGroup.closest('.multiple-form-group');

            var $lastFormGroupLast = $multipleFormGroup.find('.form-group:last');
            if ($multipleFormGroup.data('max') >= countFormGroup($multipleFormGroup)) {
                $lastFormGroupLast.find('.btn-add').attr('disabled', false);
            }

            $formGroup.remove();
        };

        var selectFormGroup = function (event) {
            event.preventDefault();

            var $selectGroup = $(this).closest('.input-group-select');
            var param = $(this).attr("href").replace("#", "");
            var concept = $(this).text();

            $selectGroup.find('.concept').text(concept);
            $selectGroup.find('.input-group-select-val').val(param);

        }

        var countFormGroup = function ($form) {
            return $form.find('.form-group').length;
        };

        $(document).on('click', '.btn-add', addFormGroup);
        $(document).on('click', '.btn-remove', removeFormGroup);
        $(document).on('click', '.dropdown-menu a', selectFormGroup);

    });
})(jQuery);