var arrayPackDistribuicao = [], arrayQtdLimitePack = [], arrayPackFinalDistribuido = [], sobraTotal = 0, somaSobras = 0, packNovo = true;
function recalculaTotalLinha(tabelaApi) {
    tabelaApi.rows().every(function () {
        var d = this.data();
        d.totalCor = 0;
        $.each(d, function (key, val) {
            if (key.indexOf("tamanho") > -1) {
                d.totalCor += parseInt(val);
            }
        });
    });
}
function recalculaTotalLinhaFiliais(dados) {
    dados[0].total = 0;
    dados[1].total = 0;
    dados[2].total = 0;
    dados[3].total = 0;
    dados[4].total = 0;
    dados[5].total = 0;
    dados[6].total = 0;
    dados[7].total = 0;
    dados[8].total = 0;
    dados[9].total = 0;
    dados[10].total = 0;
    var qtFil = 0;
    $.each(dados[1], function (key, val) {
        if (key.indexOf("filial") > -1) {
            dados[1].total += dados[1][key];
            dados[2].total += dados[2][key];
            dados[3].total += dados[3][key];
            dados[5].total += dados[5][key];
            dados[7].total += dados[7][key];
            dados[8].total += dados[8][key];
            dados[9].total += dados[9][key];
            dados[10].total += dados[10][key];
            qtFil++
        }
    });
    dados[6].total = dados[7].total ? dados[8].total / dados[7].total : 0;
    dados[10].total = qtFil ? dados[10].total / qtFil : 0;
    return dados;
}
function recalculaTotalLinhaMov(dados) {
    dados[0].total = 0;
    dados[1].total = 0;
    dados[2].total = 0;
    dados[3].total = 0;
    dados[4].total = 0;
    dados[5].total = 0;
    dados[6].total = 0;
    var qtFil = 0;
    $.each(dados[1], function (key, val) {
        if (key.indexOf("filial") > -1) {
            dados[1].total += dados[1][key];
            dados[3].total += dados[3][key];
            dados[4].total += dados[4][key];
            dados[5].total += dados[5][key];
            dados[6].total += dados[6][key];
            qtFil++
        }
    });
    dados[2].total = dados[3].total ? dados[4].total / dados[3].total : 0;
    dados[6].total = qtFil ? dados[6].total / qtFil : 0;
    return dados;
}
function recalculaTotalColunas(tabelaApi) {
    tabelaApi.columns(".numInt").every(function () {
        $(this.footer()).html(
            this
                .data()
                .reduce(function (a, b) {
                    return a + b;
                })
        );
    });
}
function trataDadosFilial(idPack, dados) {
    var totalItemPack = $("#tblPackCad" + idPack).dataTable().api().column(".sumItem")
        .data()
        .reduce(function (a, b) {
            return a + b;
        });
    var custoBruto = $('#txtCustoBrutoPed').maskMoney('unmasked')[0];
    dados = calculaItensCustoPackFilial(totalItemPack, custoBruto, dados);
    return dados;
}
function calculaItensCustoPackFilial(qtdItensPack, vlrCusto, dados) {
    var qtdFil = 0, totalItens = 0, totalVal = 0, medVal = 0;
    $.each(dados[1], function (key, val) {
        if (key.indexOf("filial") > -1) {
            qtdFil++;
            dados[2][key] = dados[1][key] * qtdItensPack;
            dados[3][key] = dados[2][key] * vlrCusto;
            totalItens += dados[2][key];
            totalVal += dados[3][key];
            medVal += dados[10][key];
        }
        dados[2].total = totalItens;
        dados[3].total = totalVal / qtdFil;
        dados[10].total = medVal / qtdFil;
    });
    return dados;
}
function comparaPacksCadastradoa(tabelaApi, idPack) {
    tabelaPackCadastrados.map(obj => {
        if (obj.idTabela === tbRefNome) {
            obj.packGrupos = atualizaGrpQtdAlterado(novaQtdGrp, obj.packGrupos, indiceGrp, obj.qtdPck)
            for (var i = 0; i < obj.packGrupos.length; i++) {
                calculaDistribuicaoFilialGrupo(obj.packGrupos[i])
            }
            recalcPackGrpsFiliais(tbRefNome.replace('tblPackCad', ''), obj.packGrupos);
        }
        return obj;
    })

    for (var i = 0; i < tabelaPackCadastrados.length; i++) {
        var tbPlanejamento = $('#' + tabelaPackCadastrados[i].idTabela).dataTable().api();
    }
}
function validaPossuiGrupo(id) {
    var hasGrp = $('ul#tabDadosDist' + id + ' li').length > 1;
    if (!hasGrp) {
        erroCadCompra("Crie os grupos de filiais para distribuição nos packs existentes!", "alertCadPack");
    }
    return hasGrp;
}
function validaPackQtd(tabelaApi, idTab) {
    var retorno = false;
    var filteredData = tabelaApi.columns(".qtdPackCadastrado")
        .data()
        .flatten()
        .filter(function (value, index) {
            return value > 0 ? true : false;
        });
    if (filteredData[0]) {
        retorno = validaPossuiGrupo(idTab);
    } else {
        erroCadCompra("Informe a quantidade de compra nos packs existentes!", "alertCadPack");
    }
    return retorno;
}
function validaAddPack(tabelaApi, idTab) {
    var retorno = false;
    var filteredData = tabelaApi.columns(".numInt")
        .data()
        .flatten()
        .filter(function (value, index) {
            return value > 0 ? true : false;
        });
    if (filteredData[0]) {
        retorno = validaPackQtd(tabelaApi, idTab);
    } else {
        erroCadCompra("Informe a quantidade de itens nos packs existentes!", "alertCadPack");
    }

    return retorno;
}
function validaPackRepetido(tabelaApi, idTab) {
    var cadastrados = $.grep(tabelaPackCadastrados, function (el) {
        return el.idTabela !== 'tblPackCad' + idTab;
    })
    var dadosRepetido = checaPackRepetido(tabelaApi, cadastrados);
    if (dadosRepetido.length) {
        var msgErroDuplicidade = ' é uma duplicidade do'
        if (dadosRepetido.length === 1) {
            msgErroDuplicidade += ' pack ' + dadosRepetido[0].idTabela.replace(/\D/g, "");
        } else {
            msgErroDuplicidade += 's packs ';
            for (var i = 0; i < dadosRepetido.length; i++) {
                if (i + 1 === dadosRepetido.length) {
                    msgErroDuplicidade += ' e ' + dadosRepetido[i].idTabela.replace(/\D/g, "");
                } else if (i === 0) {
                    msgErroDuplicidade += dadosRepetido[i].idTabela.replace(/\D/g, "");
                } else {
                    msgErroDuplicidade += ', ' + dadosRepetido[i].idTabela.replace(/\D/g, "");
                }
            }
        }
        erroCadCompra("O pack " + idTab + msgErroDuplicidade + ". Exclua ou altere os packs repetidos!", "alertCadPack");
    }
    return dadosRepetido;
}
function checaPackRepetido(tabelaApi, arrayValidar) {
    var tabelasCadastradas = arrayValidar;
    if (arrayValidar.length) {
        tabelaApi.rows().every(function (rowIdx, tableLoop, rowLoop) {
            var data = this.data();
            tabelasCadastradas = comparaDadosLinha(data, rowIdx, tabelasCadastradas);
        });
    }
    return tabelasCadastradas;
}
function comparaDadosLinha(dadosNovoPack, indiceLinha, arrayCadastrado) {
    var arrayRetorno = [];
    for (var i = 0; i < arrayCadastrado.length; i++) {
        var dados = arrayCadastrado[i].dadosLinha[indiceLinha];
        var retorno = true, count = 0;
        $.each(dados, function (key, value) {
            if ($.isNumeric(value) && parseInt(value) !== parseInt(dadosNovoPack[key]) && retorno && key !== 'totalCor' && key !== 'qtdPack') {
                retorno = false;
            }
        });
        if (retorno) {
            arrayRetorno.push(arrayCadastrado[i]);
        }
    }
    return arrayRetorno;
}

function excluirPack(tbIdExcluir) {
    tabelaPackCadastrados = $.grep(tabelaPackCadastrados, function (el) {
        return el.idTabela !== 'tblPackCad' + tbIdExcluir;
    })
    var tabs = $("#tabPacksCad li:not(:last)");
    for (var i = 0; i < tabs.length; i++) {
        $(tabs[i]).children('a').html('Pack ' + (i + 1) +
            '<button style="margin-left: 7px;color:red!important;opacity: 0.5;" data-toggle="tooltip" class="close" type="button" title="Excluir Pack">×</button> ');
    }
}
function validaSalvarPedido() {
    var retornoValido = true
    for (var i = 0; i < tabelaPackCadastrados.length; i++) {
        var tbChecar = $('#' + tabelaPackCadastrados[i].idTabela).dataTable().api();
        var idTab = tabelaPackCadastrados[i].idTabela.replace(/\D/g, "");
        retornoValido = validaAddPack(tbChecar, idTab);
        if (retornoValido) {
            var packRepetido = validaPackRepetido(tbChecar, idTab);
            if (packRepetido.length) {
                retornoValido = false;
                break;
            } else {
                retornoValido = validaQtdGrupoSalvar(tabelaPackCadastrados[i].packGrupos, tabelaPackCadastrados[i].qtdPck);
                if (!retornoValido) break;
            }
        } else {
            break
        }
    }
    return retornoValido;
}
function validaQtdGrupoSalvar(grupos, packTotal) {
    var retornoValido = true, totalGrupos = grupos.sum("qtdParticipacaoGrupo");
    if (!totalGrupos) {
        totalGrupos = grupos.sum("qtdGrupoCadastrada");
    }
    console.log(packTotal)
    console.log(totalGrupos)
    if (totalGrupos !== packTotal) {
        retornoValido = false;
        erroCadCompra("A soma dos packs nos grupos deve ser igual a quantidade de packs comprados!", "alertCadPack");
    } else {
        for (var i = 0; i < grupos.length; i++) {
            var qtdGrp = grupos[i].qtdParticipacaoGrupo;
            if (!qtdGrp) {
                qtdGrp = grupos[i].qtdGrupoCadastrada
            }
            retornoValido = validaQtdFiliaisGrupoSalvar(grupos[i].filiais, qtdGrp);
            if (!retornoValido) {
                break;
            }
        }
    }
    return retornoValido;
}
function validaQtdFiliaisGrupoSalvar(filiais, packTotalGrupo) {
    var retornoValido = true, totalFiliais = filiais.sum("qtdParticipacaoFilial");
    if (!totalFiliais) {
        totalFiliais = filiais.sum("qtdePack");
    }
    if (totalFiliais !== packTotalGrupo) {
        retornoValido = false;
        erroCadCompra("A quantidade de packs nas filiais deve ser igual ao limite do grupo!", "alertCadPack");
    }
    return retornoValido;
}
function recalculaDistCustos() {
    tabelaPackCadastrados.map(obj => {
        for (var i = 0; i < obj.packGrupos.length; i++) {
            var dadosOrganizado = transposeObjetoDistribuicaoPack(obj.packGrupos[i].filiais)
            var qtdParticipacaoFilial = dadosOrganizado.qtdParticipacaoFilial;
            if (!qtdParticipacaoFilial) {
                qtdParticipacaoFilial = dadosOrganizado.qtdePack;
            }
            var dadosPk = [
                dadosOrganizado.idFilial,
                qtdParticipacaoFilial,
                dadosOrganizado.totalItens,
                dadosOrganizado.totalCusto,
                dadosOrganizado.partAtualizada,
                dadosOrganizado.partVendas,
                dadosOrganizado.partCobertura,
                dadosOrganizado.qtdeVenda,
                dadosOrganizado.qtdeEstoque,
                dadosOrganizado.qtdeCarteira,
                dadosOrganizado.vlrMedio
            ];
            dadosPk = trataDadosFilial(obj.idTabela.replace('tblPackCad', ''), dadosPk)
            dadosPk = recalculaTotalLinhaFiliais(dadosPk)
            var tbPlanejamento = $("#tblGrpPack" + obj.packGrupos[i].idGrupo + '_' + obj.idTabela.replace('tblPackCad', '')).dataTable().api();
            tbPlanejamento.clear();
            tbPlanejamento.data(tbPlanejamento).rows.add(dadosPk);
            tbPlanejamento.draw();
        }


        return obj;
    })

}
function recalculaDistCustosPackAtualizado(id) {
    tabelaPackCadastrados.map(obj => {
        if (obj.idTabela === id) {
            for (var i = 0; i < obj.packGrupos.length; i++) {
                var dadosOrganizado = transposeObjetoDistribuicaoPack(obj.packGrupos[i].filiais)
                var qtdParticipacaoFilial = dadosOrganizado.qtdParticipacaoFilial;
                if (!qtdParticipacaoFilial) {
                    qtdParticipacaoFilial = dadosOrganizado.qtdePack;
                }
                var dadosPk = [
                    dadosOrganizado.idFilial,
                    qtdParticipacaoFilial,
                    dadosOrganizado.totalItens,
                    dadosOrganizado.totalCusto,
                    dadosOrganizado.partAtualizada,
                    dadosOrganizado.partVendas,
                    dadosOrganizado.partCobertura,
                    dadosOrganizado.qtdeVenda,
                    dadosOrganizado.qtdeEstoque,
                    dadosOrganizado.qtdeCarteira,
                    dadosOrganizado.vlrMedio
                ];
                dadosPk = trataDadosFilial(obj.idTabela.replace('tblPackCad', ''), dadosPk)
                dadosPk = recalculaTotalLinhaFiliais(dadosPk)
                var tbPlanejamento = $("#tblGrpPack" + obj.packGrupos[i].idGrupo + '_' + obj.idTabela.replace('tblPackCad', '')).dataTable().api();
                tbPlanejamento.clear();
                tbPlanejamento.data(tbPlanejamento).rows.add(dadosPk);
                tbPlanejamento.draw();
            }

        }


        return obj;
    })

}
//Cálculos Pack Distribuição por Grupo
function calculaDistribuicaoTotalPackGrp(objGrupos, qtdPack) {
    var qtdSobra = 0;
    for (var i = 0; i < objGrupos.length; i++) {
        objGrupos[i].qtdParticipacaoGrupo = parseInt(objGrupos[i].participacaoGrupo / 100 * qtdPack);
        qtdSobra += objGrupos[i].qtdParticipacaoGrupo;
    }
    if (qtdPack - qtdSobra > 0) {
        for (var j = 0; j < objGrupos.length; j++) {
            if (qtdPack - qtdSobra === 0) { break; }
            objGrupos[j].qtdParticipacaoGrupo += 1;
            qtdSobra += 1;
        }
    }
    for (var k = 0; k < objGrupos.length; k++) {
        calculaDistribuicaoFilialGrupo(objGrupos[k]);
    }
    return objGrupos;
}
function calculaDistribuicaoFilialGrupo(objGrupos) {
    var vlrRecalc = 0;
    objGrupos.qtdParticipacaoGrupo ?
        vlrRecalc = objGrupos.qtdParticipacaoGrupo :
        vlrRecalc = objGrupos.qtdGrupoCadastrada;
    var qtdSobraFilial = 0;
    for (var i = 0; i < objGrupos.filiais.length; i++) {
        objGrupos.filiais[i].qtdParticipacaoFilial = parseInt(objGrupos.filiais[i].partVendas / 100 * vlrRecalc);
        objGrupos.filiais[i].partAtualizada = 0;
        qtdSobraFilial += objGrupos.filiais[i].qtdParticipacaoFilial;
    }
    if (vlrRecalc - qtdSobraFilial > 0) {
        for (var j = 0; j < objGrupos.filiais.length; j++) {
            if (vlrRecalc - qtdSobraFilial === 0) { break; }
            objGrupos.filiais[j].qtdParticipacaoFilial += 1;
            qtdSobraFilial += 1;
        }
    }
}
function validaAlteracaoFilial(filialDadosTabela, idLimite, valorNovo, valorLimite) {
    var valorAjuste = 0, retorno = true;
    $.each(filialDadosTabela, function (key, value) {
        if (key.indexOf('filial') > -1 && parseInt(key.replace(/\D/g, "")) < idLimite) {
            valorAjuste += value;
        }
    });
    if (valorLimite - valorAjuste - valorNovo < 0) {
        retorno = false;
    }
    return retorno;
}
function excluirGrupoPack(grupoExcluido, gruposCadastrados, totalPacks) {
    var qtdSomada = 0, percRedistribuir = grupoExcluido.participacaoGrupo / (gruposCadastrados.length - 1);
    var grpsNovos = gruposCadastrados.map(obj => {
        if (obj.idGrupo !== grupoExcluido.idGrupo) {
            var percAjustado = obj.participacaoGrupo + percRedistribuir,
                qtdRec = parseInt((totalPacks * percAjustado) / 100);
            obj.qtdParticipacaoGrupo ?
                obj.qtdParticipacaoGrupo = qtdRec :
                obj.qtdGrupoCadastrada = qtdRec;
            qtdSomada += qtdRec;
        }
        return obj;
    }).filter(obj => obj.idGrupo !== grupoExcluido.idGrupo);
    var valorAjuste = totalPacks - qtdSomada;
    if (valorAjuste !== 0) {
        while (valorAjuste !== 0) {
            console.log(valorAjuste)
            for (var i = 0; i < grpsNovos.length; i++) {
                if (valorAjuste > 0) {
                    grpsNovos[i].qtdParticipacaoGrupo ?
                        grpsNovos[i].qtdParticipacaoGrupo++ :
                        grpsNovos[i].qtdGrupoCadastrada++;
                    valorAjuste--;
                } else if (valorAjuste < 0) {
                    grpsNovos[i].qtdParticipacaoGrupo ?
                        grpsNovos[i].qtdParticipacaoGrupo-- :
                        grpsNovos[i].qtdGrupoCadastrada--;
                    valorAjuste++;
                } else {
                    break;
                }
            }
        }
    }
    grpsNovos.map(obj => {
        var qtdGrpPerc = 0;
        obj.qtdParticipacaoGrupo ?
            qtdGrpPerc = obj.qtdParticipacaoGrupo * 100 / totalPacks :
            qtdGrpPerc = obj.qtdGrupoCadastrada * 100 / totalPacks;
        obj.participacaoGrupo = qtdGrpPerc;
        return obj;
    });
    return grpsNovos;
}
function recalcPckFilialAlterada(filialAtualizada, filiais, qtdAtualizar, qtdGrp, variavelQtd, totalDistGrp) {
    var iniciarAjuste = false, valorAjuste = 0, indiceAjuste = 0;
    for (var i = 0; i < filiais.length; i++) {
        if (filiais[i].idFilial === filialAtualizada) {
            var qtdParticipacaoFilial = filiais[i][variavelQtd];
            valorAjuste = (qtdGrp - totalDistGrp) + qtdParticipacaoFilial - qtdAtualizar;
            filiais[i][variavelQtd] = qtdAtualizar;
            iniciarAjuste = true;
            indiceAjuste = i + 1;
        }
        filiais[i].partAtualizada = filiais[i][variavelQtd] * 100 / qtdGrp;
    }
    if (filiais.length > indiceAjuste && valorAjuste) {
        while (valorAjuste !== 0) {
            for (var j = indiceAjuste; j < filiais.length; j++) {
                if (iniciarAjuste && valorAjuste > 0) {
                    filiais[j][variavelQtd] += 1;
                    valorAjuste -= 1;
                } else if (iniciarAjuste && valorAjuste < 0 && filiais[j][variavelQtd] > 0) {
                    filiais[j][variavelQtd] -= 1;
                    valorAjuste += 1;
                }
                filiais[j].partAtualizada = filiais[j][variavelQtd] * 100 / qtdGrp;
            }
        }
    } else if (valorAjuste !== 0) {
        erroCadCompra("A quantidade de packs distribuidos nas filial deve ser igual ao limite designado para o grupo!", "alertCadPack");
    }
    return filiais;
}
function recalcPackGrpsFiliais(idPack, grupos) {
    for (var i = 0; i < grupos.length; i++) {
        var hashTab = 'grupo' + grupos[i].idGrupo + '_' + idPack;
        $('.nav-pills a[href="#' + hashTab + '"]').tab('show');
        //aqui
        var colreg = geraColunaDistribuicao(grupos[i].filiais);

        var dadosOrganizado = transposeObjetoDistribuicaoPack(grupos[i].filiais);
        var dadosPk = [
            dadosOrganizado.idFilial,
            dadosOrganizado.qtdParticipacaoFilial,
            dadosOrganizado.totalItens,
            dadosOrganizado.totalCusto,
            dadosOrganizado.partAtualizada,
            dadosOrganizado.partVendas,
            dadosOrganizado.partCobertura,
            dadosOrganizado.qtdeVenda,
            dadosOrganizado.qtdeEstoque,
            dadosOrganizado.qtdeCarteira,
            dadosOrganizado.vlrMedio
        ];
        dadosPck = trataDadosFilial(idPack, dadosPk)
        dadosPck = recalculaTotalLinhaFiliais(dadosPk)
        var valTxtGrp = grupos[i].qtdParticipacaoGrupo ?
            grupos[i].qtdParticipacaoGrupo :
            grupos[i].qtdGrupoCadastrada;
        $("#txtQtdGrpPack" + grupos[i].idGrupo + '_' + idPack).val(valTxtGrp);
        var tbChange = $("#tblGrpPack" + grupos[i].idGrupo + '_' + idPack).dataTable().api();
        tbChange.clear();
        tbChange.data(tbChange).rows.add(dadosPk);
        tbChange.draw();
    }
    $('#tabDadosDist' + idPack + ' li').children('a').first().click();
}
function atualizaGrpQtdAlterado(novoValor, grupos, indiceGrp, totalGrupo) {
    var participacaoNova = novoValor * 100 / totalGrupo;
    var totalQtdDist = 0;
    var totalPorcentagem = 0;
    var qtdLinha = 0;
    var partRef = 0;
    grupos.map(obj => {
        if (obj.idGrupo < indiceGrp) {
            obj.qtdParticipacaoGrupo ?
                qtdLinha += obj.qtdParticipacaoGrupo :
                qtdLinha += obj.qtdGrupoCadastrada;
        }
        return obj;
    });
    if (qtdLinha + novoValor <= totalGrupo) {
        qtdLinha = 0;
        grupos.map(obj => {
            if (obj.idGrupo <= indiceGrp) {

                if (obj.idGrupo === indiceGrp) {
                    partRef = obj.participacaoGrupo - participacaoNova;
                    obj.participacaoGrupo = participacaoNova;
                    obj.qtdParticipacaoGrupo ?
                        obj.qtdParticipacaoGrupo = novoValor :
                        obj.qtdGrupoCadastrada = novoValor;
                }
                obj.qtdParticipacaoGrupo ?
                    totalQtdDist += obj.qtdParticipacaoGrupo :
                    totalQtdDist += obj.qtdGrupoCadastrada;
                totalPorcentagem += obj.participacaoGrupo;
            }
            else if (obj.idGrupo > indiceGrp) {
                qtdLinha++;
            }
            return obj;
        });
        totalPorcentagem += partRef;
        var acrecimoPorcentagem = qtdLinha ? totalPorcentagem / qtdLinha : totalPorcentagem;
        grupos.map(obj => {
            if (obj.idGrupo > indiceGrp) {
                var perc = obj.participacaoGrupo + acrecimoPorcentagem;
                var qtdGrpNova = 0
                qtdGrpNova = parseInt((totalGrupo - totalQtdDist) * perc / 100);
                obj.qtdParticipacaoGrupo ?
                    obj.qtdParticipacaoGrupo = qtdGrpNova :
                    obj.qtdGrupoCadastrada = qtdGrpNova;
                obj.participacaoGrupo = qtdGrpNova * 100 / totalGrupo;
            }

            return obj;
        });
    }

    console.log(grupos);
    return grupos;
}
//Cálculos Valor Bruto Cad. Produto
function calculaAlteracaoDescAcre(elementoAlterado, elementoLinkado, tipoValor, updateCustos) {
    var custoBruto = $('#txtCustoBrutoPed').maskMoney('unmasked')[0], $txtCustoParcial = $('#txtCustoParcialPed'), $txtCustoFinal = $('#txtCustoFinalPed'),
        $txtElLink = $('#' + elementoLinkado), $txtElAlt = $(elementoAlterado), resultado;
    tipoValor === 'perc' ? resultado = $txtElAlt.maskMoney('unmasked')[0] / 100 * custoBruto : resultado = $txtElAlt.maskMoney('unmasked')[0] * 100 / custoBruto;
    resultado = Math.round10(resultado, -2).toFixed(2);
    if (tipoValor === 'perc') $txtElLink.data().initail = parseFloat(resultado);
    $txtElLink.val(resultado.replace('.', ',')).maskMoney('mask');
    if (updateCustos) atualizaCustos();
}
function atualizaCustos() {
    var custoBruto = $('#txtCustoBrutoPed').maskMoney('unmasked')[0], $txtCustoParcial = $('#txtCustoParcialPed'), $txtCustoFinal = $('#txtCustoFinalPed'),
        //Valores
        vlrVendor = $('#txtVlrVendor').maskMoney('unmasked')[0], vlrDesconto = $('#txtDescontoPedVlr').maskMoney('unmasked')[0],
        vlrPontualidade = $('#txtVlrPontualidade').maskMoney('unmasked')[0], vlrIPI = $('#txtIPIVlrPed').maskMoney('unmasked')[0],
        vlrIcms = $('#txtIcmsVlrPed').maskMoney('unmasked')[0], vlrPis = $('#txtPisVlrPed').maskMoney('unmasked')[0],
        vlrCofins = $('#txtCofinsVlrPed').maskMoney('unmasked')[0],
        //Calculos
        resultParcial = custoBruto + vlrVendor - vlrPontualidade - vlrDesconto,
        resultFinal = custoBruto + vlrIPI + vlrVendor - vlrPontualidade - vlrDesconto;
    //Tratamento
    var inputParcial = Math.round10(resultParcial, -2).toFixed(2).replace('.', ',');
    var inputFinal = Math.round10(resultFinal, -2).toFixed(2).replace('.', ',');
    //Atualização
    $txtCustoParcial.val(inputParcial).maskMoney('mask');
    $txtCustoFinal.val(inputFinal).maskMoney('mask');
}
function calculaAlteracaoCusto() {
    //IDs Valor
    if (tabelaPackCadastrados && tabelaPackCadastrados.length) {
        recalculaDistCustos();
    }
    var vendorMoney = 'txtVlrVendor', descontoMoney = 'txtDescontoPedVlr', pontualidadeMoney = 'txtVlrPontualidade', ipiMoney = 'txtIPIVlrPed',
        icmsMoney = 'txtIcmsVlrPed', pisMoney = 'txtPisVlrPed', cofinsMoney = 'txtCofinsVlrPed';
    //Elementos Porcentagem
    var vendorElePerc = document.getElementById('txtPercVendor'), descontoElePerc = document.getElementById('txtDescontoPedPerc'),
        pontualidadeElePerc = document.getElementById('txtPercPontualidade'), ipiElePerc = document.getElementById('txtIPIPercPed'),
        icmsElePerc = document.getElementById('txtIcmsPercPed'), pisElePerc = document.getElementById('txtPisPercPed'),
        cofinsElePerc = document.getElementById('txtCofinsPercPed');
    //Atualização Valores
    calculaAlteracaoDescAcre(vendorElePerc, vendorMoney, 'perc', false);
    calculaAlteracaoDescAcre(descontoElePerc, descontoMoney, 'perc', false);
    calculaAlteracaoDescAcre(pontualidadeElePerc, pontualidadeMoney, 'perc', false);
    calculaAlteracaoDescAcre(icmsElePerc, icmsMoney, 'perc', false);
    calculaAlteracaoDescAcre(pisElePerc, pisMoney, 'perc', false);
    calculaAlteracaoDescAcre(cofinsElePerc, cofinsMoney, 'perc', false);
    calculaAlteracaoDescAcre(ipiElePerc, ipiMoney, 'perc', true);
}
function validaValorImputado(valor) {
    var custoBruto = $('#txtCustoBrutoPed').maskMoney('unmasked')[0];
    return custoBruto >= valor;
}

//Tratamento Objeto Distribuição Filial
function transposeObjetoDistribuicaoPack(objetoFiliais) {
    var novoObjeto = {};
    $.each(objetoFiliais, function (i, objeto) {
        for (var prop in objeto) {
            if (novoObjeto[prop]) {
                novoObjeto[prop]['filial' + (i + 1)] = objeto[prop];
                if (!novoObjeto[prop].total) {
                    novoObjeto[prop].total = 0;
                }
                novoObjeto[prop].total += novoObjeto[prop]['filial' + (i + 1)]
            }
            else novoObjeto[prop] =
                { 'descricao': toTitleCase(prop.replace(/([A-Z]+)/g, " $1").replace(/([A-Z][a-z])/g, "$1")), ['filial' + (i + 1)]: objeto[prop] };
        }

    });
    return novoObjeto;
}
function criaColunaTotal(dadosOrganizado) {

}
function criaObjPedidoPack() {
    var packObjRetorno = [];
    for (var i = 0; i < tabelaPackCadastrados.length; i++) {
        var objJson = {};
        objJson.pack = parseInt(tabelaPackCadastrados[i].idTabela.replace(/\D/g, ""));
        objJson.pedidoPackDistribuicao = criaArrayDistribuicao(tabelaPackCadastrados[i].packGrupos);
        objJson.pedidoPackProdutoItem = criaArrayProdutoitem(tabelaPackCadastrados[i].dadosLinha.toArray());
        objJson.qtde = tabelaPackCadastrados[i].qtdPck;
        packObjRetorno.push(objJson);
    }
    return packObjRetorno;
}
function criaObjPedido(status) {

    var pedidoRetorno = {
        "codigo": parseInt($("#txtProdutoPed").val()),
        "idProduto": parseInt($("#txtIDProd").val()),
        "idFornecedor": parseInt($('#drpCNPJ').val()),
        "idUsuarioCadastro": sessionStorage.getItem("id_usuario"),
        "referenciaFornecedor": $('#txtRefPed').val(),
        "observacao": $('#txtAreaObsPed').val(),
        "precoCusto": $('#txtCustoBrutoPed').maskMoney('unmasked')[0],
        "precoVenda": $('#txtPrVendaPed').maskMoney('unmasked')[0],
        "desconto": $('#txtDescontoPedPerc').maskMoney('unmasked')[0],
        "descontoPontualidade": $('#txtPercPontualidade').maskMoney('unmasked')[0],
        "acrescimo": $('#txtPercVendor').maskMoney('unmasked')[0],
        "ipi": $('#txtIPIPercPed').maskMoney('unmasked')[0],
        "icms": $('#txtIcmsPercPed').maskMoney('unmasked')[0],
        "qualidadeValor": $('#txtQldNotaPed').maskMoney('unmasked')[0],
        "qualidadeQtde": $('#txtQldProdPed').maskMoney('unmasked')[0],
        "dataCadastro": new Date().toISOString(),
        "dataEntregaInicio": formatarDataEnvio(moment($('#txtDtEntregaPed').data('daterangepicker').startDate.toDate())),
        "dataEntregaFinal": formatarDataEnvio(moment($('#txtDtEntregaPed').data('daterangepicker').endDate.toDate())),
        "dataToleranciaAtrasoInicio": formatarDataEnvio(moment($('#txtDtEntregaFinalPed').data('daterangepicker').startDate.toDate())),
        "dataToleranciaAtrasoFinal": formatarDataEnvio(moment($('#txtDtEntregaFinalPed').data('daterangepicker').endDate.toDate())),
        "status": status,
        "idGrupoTamanho": parseInt($("#drpTamanhoCategoria").val()),
        "idMarca": parseInt($("#drpMarc").val()),
        "idSecao": parseInt($("#drpSec").val()),
        "idEspecie": parseInt($("#drpEsp").val()),
        "idClassificacaoFiscal": parseInt($("#drpClassificacao").val()),
        "descricao": $("#txtDescPed").val(),
        "descricaoReduzida": $("#txtDescResPed").val()
    };
    $("#drpTamanhoCategoria option:selected").each(function () {
        pedidoRetorno.idGrupoTamanho = parseInt($(this).attr('data-tokens').split(',')[0]);
    });
    if (compraId) {
        pedidoRetorno.idPedido = parseInt(compraId);
    }
    return pedidoRetorno;
}
function criaArrayDistribuicao(arrayGrupos) {
    var arrayRetorno = [];
    for (var i = 0; i < arrayGrupos.length; i++) {
        for (var j = 0; j < arrayGrupos[i].filiais.length; j++) {
            var objJson = {};
            objJson.grupoFilial = arrayGrupos[i].idGrupo;
            objJson.idFilial = arrayGrupos[i].filiais[j].idFilial;
            if (typeof arrayGrupos[i].filiais[j].qtdParticipacaoFilial === 'undefined') {
                objJson.qtde = arrayGrupos[i].filiais[j].qtdePack
            } else {
                objJson.qtde = arrayGrupos[i].filiais[j].qtdParticipacaoFilial
            }
            arrayRetorno.push(objJson);
        }
    }
    return arrayRetorno;
}
function criaArrayProdutoitem(arrayPack) {
    var idItem = 1, idProduto = parseInt($("#txtIDProd").val()), arrayRetorno = [];
    for (var i = 0; i < arrayPack.length; i++) {
        var corItem = coresNovasCadastradas.filter(function (el) {
            var confirmado = false;
            if (typeof arrayPack[i].cores === 'undefined') {
                confirmado = el.descricao === arrayPack[i].descricaoCor
            } else {
                confirmado = el.descricao === arrayPack[i].cores
            }
            return confirmado;
        })[0];
        var referencia = arrayPack[i].referencia;
        if (typeof arrayPack[i].referencia === 'undefined') {
            referencia = arrayPack[i].referenciaItem;
        }

        $.each(arrayPack[i], function (key, value) {
            if (key.indexOf('tamanho') > -1) {
                var objJson = {};
                objJson.idProduto = idProduto;
                objJson.item = idItem;
                objJson.idTamanho = tamanhoTexto.filter(function (el) { return el.descricao === key.replace('tamanho', ''); })[0].id;
                objJson.cor = corItem;
                objJson.referencia = referencia;
                objJson.qtde = value;
                arrayRetorno.push(objJson);
                idItem += 1;
            }
        });
    }
    return arrayRetorno;
}
function criaObjCondFormaPgto() {
    var idsFormas = $("#drpFrmPgtoPed").val().map(Number), arrayRetorno = [], pedID = 0;
    if (compraId) {
        pedID = parseInt(compraId);
    }
    for (var i = 0; i < idsFormas.length; i++) {
        arrayRetorno.push({
            "idCondicaoPagamento": parseInt($("#drpCondPgtoPed").val()),
            "idFormaPagamento": idsFormas[i],
            'idPedido': pedID
        });
    }
    return arrayRetorno;
}
function salvarPedidoOpcao() {
    $.confirm({
        icon: 'fa fa-gift',
        type: 'blue',
        title: 'Salvar Pedido!',
        content: 'Confirme a operação desejada!',
        containerFluid: true,
        buttons: {
            confirm: {
                text: 'Finalizar',
                btnClass: 'btn-success',
                isHidden: true,
                action: function () {
                    geraPedidoSalvar('F');
                }
            },
            finish: {
                text: 'Aprovar',
                btnClass: 'btn-success',
                isHidden: true,
                action: function () {
                    var objEnvio = {};
                    objEnvio.status = 'L'
                    objEnvio.codigo = compraId;
                    atualizarStatus(objEnvio);
                }
            },
            change: {
                isHidden: true,
                text: 'Salvar',
                btnClass: 'btn-primary',
                action: function () {
                    geraPedidoSalvar('A');
                }
            },
            cancel: {
                isHidden: true,
                text: 'Cancelar',
                btnClass: 'btn-danger',
                action: function () {
                    var objEnvio = {};
                    objEnvio.status = 'C'
                    objEnvio.codigo = compraId;
                    atualizarStatus(objEnvio);
                }
            },
            edit: {
                isHidden: true,
                text: 'Editar',
                btnClass: 'btn-primary',
                action: function () {
                    var objEnvio = {};
                    objEnvio.status = 'A'
                    sessionStorage.setItem('Editar', '1');
                    objEnvio.codigo = compraId;
                    atualizarStatus(objEnvio);
                }
            },
            back: {
                text: 'Voltar',
                btnClass: 'btn-info'
            },
        },
        onContentReady: function () {
            var self = this;
            var statusPedido = sessionStorage.getItem("pedidoStatus");
            if (statusPedido) {
                if (statusPedido === 'A') {
                    self.buttons.confirm.show();
                    self.buttons.change.show();
                    self.buttons.cancel.show();
                } else if (statusPedido === 'F') {
                    self.buttons.finish.show();
                    self.buttons.edit.show();
                    self.buttons.cancel.show();
                } else if (statusPedido === 'L') {
                    self.buttons.edit.show();
                    self.buttons.cancel.show();
                } else if (statusPedido === 'C') {
                    self.buttons.edit.show();
                }
            } else {
                self.buttons.confirm.show();
                self.buttons.change.show();
            }

        }
    });
}
function geraPedidoSalvar(status) {
    $('.selectpicker').selectpicker('hide');
    $(".navbar.navbar-default.navbar-fixed-top").addClass('ocultarElemento');
    $(".bg_load").show();
    $(".wrapper").show();
    var pedidoEnvio = {};
    if ($("#drpCondPgtoPed").val() === '0') {
        var objCondNova = {};
        $("#drpCondPgtoPed option:selected").each(function () {
            objCondNova.condicao = $(this).text();
        });
        pedidoEnvio.condicaoPagamento = objCondNova;
    }
    sessionStorage.setItem("salvarStatus", status)

    pedidoEnvio.pedido = criaObjPedido(status);
    pedidoEnvio.pedidoCondicaoFormaPagamento = criaObjCondFormaPgto();
    pedidoEnvio.pedidoPack = criaObjPedidoPack();
    pedidoEnvio.produtoAtributo = criaArrayAtributo($("#pnlAttrProd"));
    pedidoEnvio.pedidoAtributo = criaArrayAtributo($("#pnlAttrPed"));
    salvarPedido(pedidoEnvio);
}
function retornaPackCadColunas(tamanhos) {
    var colunasPack = [{ "data": "referenciaItem", 'className': 'separaDireita' }, { "data": "descricaoCor", 'className': 'separaDireita' }];
    for (var i = 0; i < tamanhos.length; i++) {
        colunasPack.push({ "data": "tamanho" + converterFormatoVariavel(tamanhos[i].descricaoTamanho), 'className': 'numInt qtdPack separaDireita' });
    };
    colunasPack.push({ "data": "totalCor", 'className': 'separaDireita' }, { "data": "qtdePack", 'className': 'qtdPackCadastrado separaDireita' });
    return colunasPack;
}
function retornaPackCadColunasAtualizar(descCor, descRef, descQtd) {
    var colunasPack = [{ "data": descRef, 'className': 'separaDireita' }, { "data": descCor, 'className': 'separaDireita' }];
    for (var i = 0; i < tamanhosGrade.length; i++) {
        colunasPack.push({ "data": "tamanho" + converterFormatoVariavel(tamanhosGrade[i]), 'className': 'numInt qtdPack separaDireita' });
    };
    colunasPack.push({ "data": "totalCor", 'className': 'separaDireita' }, { "data": descQtd, 'className': 'qtdPackCadastrado separaDireita' });
    return colunasPack;
}
function retornaPackCadDados(packItens) {
    var retorno = [];
    for (var i = 0; i < packItens.length; i++) {
        var objPack = {};
        var totalCor = 0;
        objPack.referenciaItem = packItens[i].referenciaItem;
        objPack.descricaoCor = packItens[i].descricaoCor;
        for (var j = 0; j < packItens[i].dadosTamanho.length; j++) {
            objPack["tamanho" + converterFormatoVariavel(packItens[i].dadosTamanho[j].descricaoTamanho)] =
                packItens[i].dadosTamanho[j].qtdeItens;
            totalCor += packItens[i].dadosTamanho[j].qtdeItens
        }
        objPack.totalCor = totalCor;
        objPack.qtdePack = packItens[i].dadosTamanho[0].qtdePack;
        retorno.push(objPack);
    }
    console.log(retorno)
    return retorno;
}
function calculaResdistribuicaoQtdPkGrp(idTbl) {
    var objTabela = tabelaPackCadastrados.filter(function (el) { return el.idTabela === idTbl; });
    console.log(objTabela);
}
function criaArrayAtributo(pnl) {
    var retorno = [];

    var retorno = criaObjAttr(pnl.find('.attrTexto'), retorno);
    var retorno = criaObjAttr(pnl.find('.attrNum'), retorno);
    var retorno = criaObjAttr(pnl.find('.attrMon'), retorno);
    var retorno = criaObjAttr(pnl.find('.attrPerc'), retorno);
    var retorno = criaObjAttr(pnl.find('.attrData'), retorno);
    var retorno = criaObjAttrBool(pnl.find('.attrBool'), retorno);
    var retorno = criaObjAttrLista(pnl.find('.selectpicker.listAttr'), retorno);
    return retorno;
}
function criaObjAttr(el, retornoArray) {
    for (var i = 0; i < el.length; i++) {
        var objRetorno = {};
        objRetorno.idPedido = compraId ? parseInt(compraId) : 0;
        objRetorno.idProduto = parseInt($("#txtIDProd").val());
        console.log($(el[i]))
        objRetorno.idTipoAtributo = parseInt($(el[i]).attr('id').replace(/\D/g, ""));
        objRetorno.valor = trataAttrNumerico($(el[i]));
        retornoArray.push(objRetorno);
    }
    return retornoArray;
}
function trataAttrNumerico(el) {
    var retorno = '';
    if (el.hasClass('attrNum')) {
        if (parseInt(el.attr('data-precision')) === 0) {
            retorno = el.val().replace('.', '')
        } else {
            retorno = el.maskMoney('unmasked')[0].toString()
        }
    } else if (el.hasClass('money') || el.hasClass('percent')) {
        retorno = el.maskMoney('unmasked')[0].toString();
    } else {
        retorno = el.val();
    }
    return retorno;
}
function criaObjAttrBool(el, retornoArray) {
    for (var i = 0; i < el.length; i++) {
        var objRetorno = {};
        objRetorno.idPedido = compraId ? parseInt(compraId) : 0;
        objRetorno.idProduto = parseInt($("#txtIDProd").val());
        objRetorno.idTipoAtributo = parseInt($(el[i]).parent().attr('id').replace(/\D/g, ""));
        objRetorno.valor = $(el[i]).hasClass('active') ? 'true' : 'false';
        retornoArray.push(objRetorno);
    }
    return retornoArray;
}
function criaObjAttrLista(el, retornoArray) {
    for (var i = 0; i < el.length; i++) {
        var $option = $(el[i]).find('option:not([data-hidden])');
        for (var j = 0; j < $option.length; j++) {
            var objRetorno = {};
            objRetorno.idPedido = compraId ? parseInt(compraId) : 0;
            objRetorno.idProduto = parseInt($("#txtIDProd").val());
            objRetorno.idTipoAtributo = parseInt($($option[j]).val());
            objRetorno.valor = $($option[j]).is(':selected') ? '1' : '0';
            retornoArray.push(objRetorno);
        }
    }
    return retornoArray;
}
//Carga Grade Dinamica
function cargaReferencia(qtdCor, qtdTamanho) {
    var retorno = [];
    if (!referenciaGrade.length) {
        retorno = cargaCor(referenciaGrade.length, qtdTamanho);
    } else if (qtdCor && qtdTamanho) {
        retorno = geraCargaGradeTresColuna();
    }
    else if (qtdCor) {
        retorno = geraCargaGradeDuasColuna('referenciaGrade', 'coresGrade');

    } else if (qtdTamanho) {
        retorno = geraCargaGradeDuasColuna('referenciaGrade', 'tamanhosGrade');

    } else {
        retorno = geraCargaGradeUmaColuna('referenciaGrade');
    }
    return retorno;
}
function cargaCor(qtdreferencia, qtdTamanho) {
    var retorno = [];
    if (!coresGrade.length) {
        retorno = cargaTamanho(qtdreferencia, coresGrade.length);
    } else if (qtdreferencia && qtdTamanho) {
        retorno = geraCargaGradeTresColuna();
    } else if (qtdreferencia) {
        retorno = geraCargaGradeDuasColuna('referenciaGrade', 'coresGrade');

    } else if (qtdTamanho) {
        retorno = geraCargaGradeDuasColuna('coresGrade', 'tamanhosGrade');

    } else {
        retorno = geraCargaGradeUmaColuna('coresGrade');
    }
    return retorno;
}
function cargaTamanho(qtdreferencia, qtdCor) {
    var retorno = [];
    if (qtdreferencia && qtdCor) {
        retorno = geraCargaGradeTresColuna();
    } else if (qtdreferencia) {
        retorno = geraCargaGradeDuasColuna('referenciaGrade', 'tamanhosGrade');

    } else if (qtdCor) {
        retorno = geraCargaGradeDuasColuna('coresGrade', 'tamanhosGrade');

    } else {
        retorno = geraCargaGradeUmaColuna('tamanhosGrade');
    }
    return retorno;
}
function geraCargaGradeUmaColuna(primeira) {
    var dadosGrade = [];
    var colunaGrade1 = window[primeira];
    var linhaPackNovo;
    if (primeira === 'tamanhosGrade') {
        linhaPackNovo = {};
        for (var j = 0; j < colunaGrade1.length; j++) {

            linhaPackNovo["tamanho" + converterFormatoVariavel(colunaGrade1[j])] = '';
        }
        dadosGrade.push(linhaPackNovo);
    }
    else {
        var dataStr1 = primeira.replace('Grade', '');
        for (var k = 0; k < colunaGrade1.length; k++) {
            linhaPackNovo = {};
            linhaPackNovo[dataStr1] = colunaGrade1[k];
            dadosGrade.push(linhaPackNovo);
        }
    }

    return dadosGrade;
}
function geraCargaGradeDuasColuna(primeira, segunda) {
    var dadosGrade = [];
    var colunaGrade1 = window[primeira];
    var colunaGrade2 = window[segunda];
    var dataStr1 = primeira.replace('Grade', '');
    var dataStr2 = segunda.replace('Grade', '');
    var j, k, linhaPackNovo;
    if (segunda === 'tamanhosGrade') {
        for (j = 0; j < colunaGrade1.length; j++) {
            linhaPackNovo = {};
            linhaPackNovo[dataStr1] = colunaGrade1[j];
            for (k = 0; k < colunaGrade2.length; k++) {
                linhaPackNovo["tamanho" + converterFormatoVariavel(colunaGrade2[k])] = '';
            }
            dadosGrade.push(linhaPackNovo);
        }
    }
    else {
        for (k = 0; k < colunaGrade1.length; k++) {
            for (j = 0; j < colunaGrade2.length; j++) {
                linhaPackNovo = {};
                linhaPackNovo[dataStr1] = colunaGrade1[k];
                linhaPackNovo[dataStr2] = colunaGrade2[j];
                dadosGrade.push(linhaPackNovo);
            }
        }
    }
    return dadosGrade;
}
function geraCargaGradeTresColuna() {
    var dadosGrade = [];
    for (var i = 0; i < referenciaGrade.length; i++) {
        for (var j = 0; j < coresGrade.length; j++) {
            var linhaPackNovo = {};
            linhaPackNovo.referencia = referenciaGrade[i];
            linhaPackNovo.cores = coresGrade[j];
            for (var k = 0; k < tamanhosGrade.length; k++) {
                linhaPackNovo["tamanho" + converterFormatoVariavel(tamanhosGrade[k])] = '';
            }
            dadosGrade.push(linhaPackNovo);
        }
    }
    return dadosGrade;
}
function addColunaPack() {
    tabelaPackCadastrados.map(obj => {
        var dtDados = removeChavesObjeto(obj.dadosLinha, obj.qtdPck);
        carregaTabPackCadastrado(obj.idTabela.replace(/\D/g, ""))
        var tbl = carregarPackGradeAtualizada(obj.idTabela, dtDados)
        obj.dadosLinha = tbl.rows().data();
    })
    recalculaDistCustos();
}
function addLinhaPack(descCor, descRef, qtd, total) {
    var dadosGrade = [];
    for (var i = 0; i < referenciaGrade.length; i++) {
        for (var j = 0; j < coresGrade.length; j++) {
            var linhaPackNovo = {};
            linhaPackNovo[descRef] = referenciaGrade[i];
            linhaPackNovo[descCor] = coresGrade[j];
            for (var k = 0; k < tamanhosGrade.length; k++) {
                linhaPackNovo["tamanho" + converterFormatoVariavel(tamanhosGrade[k])] = 0;
            }
            linhaPackNovo[total] = 0;
            linhaPackNovo[qtd] = 0;
            dadosGrade.push(linhaPackNovo);
        }
    }
    return dadosGrade;
}
function removeChavesObjeto(dadosPackGrade, qtdPck) {
    var retorno = {};
    var dadosRetornoTratado = dadosPackGrade.toArray();
    var listRefRemover = dadosPackGrade.map(function (e) {
        if (e.referencia) {
            if (referenciaGrade.indexOf(e.referencia) === -1) return e.referencia
        } else {
            if (referenciaGrade.indexOf(e.referenciaItem) === -1) return e.referenciaItem
        }
    }).toArray().filter(function (obj) {
        return (typeof obj !== 'undefined');
    });
    var listCorRemover = dadosPackGrade.map(function (e) {
        if (e.cores) {
            if (coresGrade.indexOf(e.cores) === -1) return e.cores
        } else {
            if (coresGrade.indexOf(e.descricaoCor) === -1) return e.descricaoCor
        }
    }).toArray().filter(function (obj) {
        return (typeof obj !== 'undefined');
    });
    var listTamVariavel = [], listTamRemover = [];
    for (var k = 0; k < tamanhosGrade.length; k++) {
        listTamVariavel.push("tamanho" + converterFormatoVariavel(tamanhosGrade[k]));
    }
    var descCor = '', descRef = '', descQtd = '';
    $.each(dadosPackGrade[0], function (key, val) {
        if (key.indexOf("tamanho") > -1 && listTamVariavel.indexOf(key) === -1) {
            listTamRemover.push(key);
        }
        if (key.toLowerCase().indexOf("cor") > -1 && key !== 'totalCor') {
            descCor = key;
        }
        if (key.toLowerCase().indexOf("referencia") > -1) {
            descRef = key;
        }
        if (key.toLowerCase().indexOf("qtd") > -1) {
            descQtd = key;
        }
    });
    var dadosPackAtualizado = addLinhaPack(descCor, descRef, descQtd, 'totalCor');

    if (listTamRemover.length) {
        dadosRetornoTratado = removeTamanhoPack(dadosRetornoTratado, listTamRemover);
    }
    if (listRefRemover.length) {
        dadosRetornoTratado = removeReferenciaPack(dadosRetornoTratado, listRefRemover);
    }
    if (listCorRemover.length) {
        dadosRetornoTratado = removeCorPack(dadosRetornoTratado, listCorRemover);
    }
    retorno.colunas = retornaPackCadColunasAtualizar(descCor, descRef, descQtd);

    retorno.dados = adicionaChavesObjeto(dadosRetornoTratado, dadosPackAtualizado, descCor, descRef, descQtd, qtdPck)
    return retorno;
}
function adicionaChavesObjeto(dadosPackGrade, dadosAtualizarGrade, descCor, descRef, descQtd, qtdPack) {
    for (var i = 0; i < dadosPackGrade.length; i++) {
        for (var j = 0; j < dadosAtualizarGrade.length; j++) {
            var qtdLinhaCor = 0;
            if (dadosAtualizarGrade[j][descRef] === dadosPackGrade[i][descRef] &&
                dadosAtualizarGrade[j][descCor] === dadosPackGrade[i][descCor]) {
                $.each(dadosPackGrade[i], function (key, val) {
                    if (key.indexOf("tamanho") > -1) {
                        dadosAtualizarGrade[j][key] = val;
                        qtdLinhaCor += val;
                    }
                });
                dadosAtualizarGrade[j].totalCor = qtdLinhaCor;
            }



            dadosAtualizarGrade[j][descQtd] = qtdPack;
        }
    }
    return dadosAtualizarGrade;
}
function removeReferenciaPack(dadosPackGrade, refRemover) {
    var dadosRetornoCarga = [];
    for (var i = 0; i < refRemover.length; i++) {
        for (var j = 0; j < dadosPackGrade.length; j++) {
            var descRef = '';
            dadosPackGrade[j].referencia ? descRef = dadosPackGrade[j].referencia : descRef = dadosPackGrade[j].referenciaItem;
            if (refRemover[i] !== descRef) {
                dadosRetornoCarga.push(dadosPackGrade[j]);
            }
        }
    }
    return dadosRetornoCarga;
}
function removeCorPack(dadosPackGrade, corRemover) {
    var dadosRetornoCarga = [];
    for (var i = 0; i < corRemover.length; i++) {
        for (var j = 0; j < dadosPackGrade.length; j++) {
            var descCor = '';
            dadosPackGrade[j].cores ? descCor = dadosPackGrade[j].cores : descCor = dadosPackGrade[j].descricaoCor;
            if (corRemover[i] !== descCor) {
                dadosRetornoCarga.push(dadosPackGrade[j]);
            }
        }
    }
    return dadosRetornoCarga;
}
function removeTamanhoPack(dadosPackGrade, tamRemover) {
    for (var i = 0; i < tamRemover.length; i++) {
        dadosPackGrade.map(obj => {
            $.each(obj, function (key, val) {
                if (key.indexOf("tamanho") > -1 && key === tamRemover[i]) {
                    delete obj[key]
                }
            });
        });
    }
    return dadosPackGrade;
}

