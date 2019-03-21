var urlApi = 'http://localhost:52928/api/GestaoCompra/', urlToken = 'http://localhost:52928/';
    Array.prototype.sum = function (prop) {
        var total = 0;
        for (var i = 0, _len = this.length; i < _len; i++) {
            total += this[i][prop];
        }
        return total;
    };
    Array.prototype.equals = function (array) {
        return this.length === array.length &&
            this.every(function (this_i, i) { return this_i === array[i] })
    };
    Date.prototype.addHours = function (h) {
        this.setHours(this.getHours() + h);
        return this;
    };
    Date.prototype.addMinutes = function (m) {
        this.setMinutes(this.getMinutes() + m);
        return this;
    };
    var nomesCoresCSS = [], nomesCoresPtCSS = [], sizePaletaLine = 5;
    var configuracaoCalendarios = {
        "format": "DD/MM/YYYY",
        "separator": " - ",
        "applyLabel": "Aplicar",
        "cancelLabel": "Cancelar",
        "fromLabel": "De",
        "toLabel": "Até",
        "customRangeLabel": "Período Customizado",
        "daysOfWeek": [
            "Dom",
            "Seg",
            "Ter",
            "Qua",
            "Qui",
            "Sex",
            "Sab"
        ],
        "monthNames": [
            "Janeiro",
            "Fevereiro",
            "Março",
            "Abril",
            "Maio",
            "Junho",
            "Julho",
            "Agosto",
            "Setembro",
            "Outubro",
            "Novembro",
            "Dezembro"
        ],
        "firstDay": 0
    };
    var configuracaoCalendariosPedido = {
        "format": "DD/MM/YYYY",
        "separator": " - ",
        "applyLabel": "Aplicar",
        "cancelLabel": "Limpar",
        "fromLabel": "De",
        "toLabel": "Até",
        "customRangeLabel": "Período Customizado",
        "daysOfWeek": [
            "Dom",
            "Seg",
            "Ter",
            "Qua",
            "Qui",
            "Sex",
            "Sab"
        ],
        "monthNames": [
            "Janeiro",
            "Fevereiro",
            "Março",
            "Abril",
            "Maio",
            "Junho",
            "Julho",
            "Agosto",
            "Setembro",
            "Outubro",
            "Novembro",
            "Dezembro"
        ],
        "firstDay": 0
    };

    function recuperaRange(parametro) {
        if (parametro === "semestre") {
            return [moment().add(6, 'month').startOf('month'), moment().add(6, 'month').endOf('month')];
        } else if (parametro === "trimestre") {
            return [moment().add(3, 'month').startOf('month'), moment().add(3, 'month').endOf('month')];
        } else if (parametro === "mes") {
            return [moment().add(1, 'month').startOf('month'), moment().add(1, 'month').endOf('month')];
        } else if (parametro === "semana") {
            return [moment().add(1, 'weeks').startOf('week'), moment().add(1, 'weeks').endOf('week')];
        }
    }
    function validaInputCondPgto(e) {
        var keyCode = e.which ? e.which : e.keyCode, dInput = $("#txtCadCondPgtoPed").val(), retorno = keyCode >= 48 && keyCode <= 57 || specialKeys.indexOf(keyCode) !== -1;
        if (keyCode === specialKeys[1]) retorno = (dInput.length > 0 && dInput.slice(-1) !== '+');
        return retorno;
    }
    function recuperaStartDateFinalEntrega() {
        var diaMinimo = $('#txtDtEntregaPed').data('daterangepicker').endDate.toDate();
        var startRetorno = moment(diaMinimo).add(1, 'days').toDate();

        return startRetorno;
    }
    function geraEditor(tipo, valorInicial) {
        var idTxtBox = "";
        if (tipo === 1) {
            classFiltro = "txtInteiro";
        } else if (tipo === 2) {
            valorInicial = valorInicial;
            classFiltro = "txtDecimal";
        }
        return '<div class="controls" style="height: 20px;"><input type="text" class="form-control ' + classFiltro + '" style="height: 20px;font-size: small;"' +
            'onkeydown="bloqueiaRefreshQtdPack(this,event)" onblur="perdeFoco()" data-valor-inicial="' + valorInicial + '"  value="' + valorInicial + '" /></div>';
    }
    function geraEditorPack(tipo, valorInicial) {
        if (tipo === 1) {
            classFiltro = "txtInteiro";
        } else if (tipo === 2) {
            valorInicial = valorInicial;
            classFiltro = "txtDecimal";
        }
        return '<div class="controls" style="height: 20px;"><input type="text" class="form-control ' + classFiltro + '" style="height: 20px;font-size: small;"' +
            'onkeydown="bloqueiaRefreshQtdPack(this,event)" onblur="atualizaDadosTxtBox()" value="' + valorInicial + '" /></div>';
    }
    function geraEditorPackCadastrado(tipo, valorInicial) {
        if (tipo === 1) {
            classFiltro = "txtInteiro";
        } else if (tipo === 2) {
            valorInicial = valorInicial;
            classFiltro = "txtDecimal";
        }
        return '<div class="controls" style="height: 20px;"><input type="text" class="form-control ' + classFiltro + '" style="height: 20px;font-size: small;"' +
            'onkeydown="bloqueiaRefresh(this,event)" onblur="atualizaDadosPack()" value="' + valorInicial + '" /></div>';
    }
    function geraEditorPackNota(tipo, valorInicial) {
        if (tipo === 1) {
            classFiltro = "txtInteiro";
        } else if (tipo === 2) {
            valorInicial = valorInicial;
            classFiltro = "txtDecimal";
        }
        return '<div class="controls" style="height: 20px;"><input type="text" class="form-control ' + classFiltro + '" style="height: 20px;font-size: small;"' +
            'onkeydown="bloqueiaRefresh(this,event)" onblur="atualizaDadosNota()" value="' + valorInicial + '" /></div>';
    }
    function geraEditorPackRecebido(tipo, valorInicial) {
        if (tipo === 1) {
            classFiltro = "txtInteiro";
        } else if (tipo === 2) {
            valorInicial = valorInicial;
            classFiltro = "txtDecimal";
        }
        return '<div class="controls" style="height: 20px;"><input type="text" class="form-control ' + classFiltro + '" style="height: 20px;font-size: small;"' +
            'onkeydown="bloqueiaRefresh(this,event)" onblur="atualizaDadosRecebido()" value="' + valorInicial + '" /></div>';
    }
    function bloqueiaRefresh(elemento, evento) {
        var code = evento.keyCode ? evento.keyCode : evento.which;
        if (evento.keyCode === 9 && evento.shiftKey === true) {
            retorna = true;
            evento.preventDefault();
        }
        if (code === 9 || code === 13) {
            $(elemento).blur();
        }
    }
    function converterFormatoVariavel(str) {
        return str.replace(/(?:^|\s)\w/g, function (match) {
            return match.toUpperCase().replace(/\s/g, '');
        });
    }
    function validaEmail(emailString) {
        var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
        return pattern.test(emailString);
    }
    function funcaoInativa() {
        var texto = 'Desculpe! Esta funcionalidade encontra-se inativa no momento.', titulo = 'Operação inválida';

        modal({
            type: "alert",
            messageText: texto,
            alertType: 'info',
            headerText: titulo
        });
    };;
    function tratamentoErro(erro) {
        console.log(erro)
        var mensagem = '';
    
        if (erro.responseJSON.exceptionMessage !== null && erro.responseJSON.exceptionMessage) {
            mensagem = erro.responseJSON.exceptionMessage;
        } else if (erro.responseJSON.error_description !== null && erro.responseJSON.error_description) {
            mensagem = erro.responseJSON.error_description;
        } else {
            mensagem = erro.responseJSON.message;
        }

        if (erro.responseJSON.modelState !== null && erro.responseJSON.modelState) {
            mensagem = mensagem + '<br /><hr><ul class="fa-ul">';
            $.each(erro.responseJSON.modelState, function (indice, objeto) {
                for (var i = 0; i < objeto.length; i++) {
                    mensagem = mensagem + '<li><i class="fa-li fa fa-ban"></i>' + (i + 1) + 'º- <strong>' + objeto[i] + '</strong>;</li>';
                    //objeto[i]
                }
            })
            //for (var i = 0; i < erro.responseJSON.modelState['motivo'].length; i++) {

            //    mensagem = mensagem + '<li><i class="fa-li fa fa-ban"></i>' + (i + 1) + 'º- <strong>' + erro.responseJSON.modelState['motivo'][i] + '</strong>;</li>';
            //}
            mensagem = mensagem + '</ul>';
        }
        return mensagem;
    }

    function retornaQtdDadosJson(obj) { return Object.keys(obj).length; };;
    (function () {
        function decimalAdjust(type, value, exp) {
            if (typeof exp === 'undefined' || +exp === 0) {
                return Math[type](value);
            }
            value = +value;
            exp = +exp;
            if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
                return NaN;
            }
            value = value.toString().split('e');
            value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
            value = value.toString().split('e');
            return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
        }

        if (!Math.round10) {
            Math.round10 = function (value, exp) {
                return decimalAdjust('round', value, exp);
            };
        }
        if (!Math.floor10) {
            Math.floor10 = function (value, exp) {
                return decimalAdjust('floor', value, exp);
            };
        }
        if (!Math.ceil10) {
            Math.ceil10 = function (value, exp) {
                return decimalAdjust('ceil', value, exp);
            };
        }
    })();
