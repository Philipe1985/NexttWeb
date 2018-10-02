$(function () {

    function editableTable() {

        function restoreRow(oTable, nRow) {
            var aData = oTable.fnGetData(nRow);
            var jqTds = $('>td', nRow);

            for (var i = 0, iLen = jqTds.length; i < iLen; i++) {
                oTable.fnUpdate(aData[i], nRow, i, false);
            }

            oTable.fnDraw();
        }

        function editRow(oTable, nRow) {
            var aData = oTable.fnGetData(nRow);
            var jqTds = $('>td', nRow);
            /*jqTds[0].innerHTML = aData[0];*/
            jqTds[1].innerHTML = '<input type="text" maxlength="200" class="form-control small editar-este" value="' + aData[1] + '">';
            /*jqTds[1].innerHTML = '<input type="checkbox" class="switch" checked data-size="small"></input>';*/
            jqTds[2].innerHTML = '<div class="text-center"><a class="edit btn btn-success" href=""><i class="fa fa-check"></i> Salvar</a></div>';

            $('.editar-este').focus();
            $('.editar-este').on("click", function () {
                $('.editar-este').val('');
                $('.editar-este').focus();
            });
            $('.editar-este').on("mouseover", function () {
                jQuery(".sortable_table").sortable("disable")
            });
            $('.editar-este').on("mouseout", function () {
                jQuery(".sortable_table").sortable("enable")
            });
        }

        function saveRow(oTable, nRow) {
            var jqInputs = $('input', nRow);

            var id = nRow.children[0].innerHTML;
            var checked = '';
            if (jqInputs[1].checked)
                checked = 'checked';

            oTable.fnUpdate(jqInputs[0].value, nRow, 1, false);
            /*oTable.fnUpdate('<input type="checkbox" class="switch" checked data-size="small"></input>', nRow, 1, false);*/
            oTable.fnUpdate("<input type='checkbox' data-on-text='Sim' data-off-text='N&atilde;o' data-on-color='success' data-off-color='danger' class='switch' " + checked + " id='ativo-etapa-negocio-" + id + "' onchange='atualizarAtivoEtapaNegocio(\"" + id + "\", document.getElementById(\"ativo-etapa-negocio-" + id + "\").checked)' data-size='small'>", nRow, 3, false);
            oTable.fnUpdate('<div class="text-center"><a class="edit btn btn-dark" href=""><i class="fa fa-pencil-square-o"></i> Editar</a> </div>', nRow, 2, false);
            oTable.fnDraw();
            jQuery("[type='checkbox']").bootstrapSwitch();
        }

        function cancelEditRow(oTable, nRow) {
            var jqInputs = $('input', nRow);
            oTable.fnUpdate(jqInputs[1].value, nRow, 1, false);
            /*oTable.fnUpdate(jqInputs[1].value, nRow, 1, false);*/
            oTable.fnUpdate('<a class="edit btn btn-dark" href=""><i class="fa fa-pencil-square-o"></i> Editar</a>', nRow, 2, false);
            oTable.fnDraw();
        }

        var oTable = $('#table-editable').dataTable({
            "aLengthMenu": [
                [5, 15, 20, -1],
                [5, 15, 20, "All"] // change per page values here
            ],
            "sDom" : "<'row'<'col-md-6 filter-left'f><'col-md-6'T>r>t<'row'<'col-md-6'i><'col-md-6'p>>",
            "oTableTools": {},
            "bSortClasses": {},
            // set the initial value
            "sAjaxSource": "~/services/general.ashx?acao=recarregarListagemComoEncontrou",
            "iDisplayLength": 10,
            "bPaginate": false,
            "sPaginationType": "bootstrap",
            "oLanguage": {
                "sLengthMenu": "_MENU_ records per page",
                "oPaginate": {
                    "sPrevious": "Prev",
                    "sNext": "Next"
                },
                "sSearch": "" 
            },
            "aoColumnDefs": [{
                    'bSortable': false,
                    'aTargets': [0, 1, 2, 3]
                }
            ],
            "aaSortingFixed": [[0, 'desc']]
        });

        //jQuery('#table-edit_wrapper .dataTables_filter input').addClass("form-control medium"); // modify table search input
        //jQuery('#table-edit_wrapper .dataTables_length select').addClass("form-control xsmall"); // modify table per page dropdown

        var nEditing = null;

        $('#table-edit_new').click(function (e) {
            if ($('.editar-este').length != 0) {
                alert('Já há um registro sendo editado, você deve salvá-lo antes de editar outro.');
                $('.editar-este').focus();
            }

            else {
                e.preventDefault();
                var id = '';/*novoComoEncontrou();oTable[0].rows.length;*/
                jQuery.ajax({
                    type: "POST",
                    url: '~/services/general.ashx?acao=novoComoEncontrou',
                    data: "",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (msg) {
                        id = msg[0]['ID'];
                        var aiNew = oTable.fnAddData([id, 'Nome', '<p class="text-center"><a class="edit btn btn-dark" href=""><i class="fa fa-pencil-square-o"></i> Editar</a></p>',
                        '<input type="checkbox" data-on-text="Sim" data-off-text="N&atilde;o" data-on-color="success" checked data-off-color="danger" class="switch" id="ativo-como-encontrou-' + id + '" onchange="atualizarAtivoComoEncontrou(\'' + id + '\', document.getElementById(\'ativo-como-encontrou-' + id + '\').checked)" data-size="small">']);
                        var nRow = oTable.fnGetNodes(aiNew[0]);
                        editRow(oTable, nRow);
                        nEditing = nRow;
                        jQuery("[type='checkbox']").bootstrapSwitch();
                        oTable.fnDraw();
                    }
                });
            }
        });

        $('#table-editable a.delete').live('click', function (e) {
            e.preventDefault();

            if (confirm("Are you sure to delete this row ?") == false) {
                return;
            }

            var nRow = $(this).parents('tr')[0];
            oTable.fnDeleteRow(nRow);

            // alert("Deleted! Do not forget to do some ajax to sync with backend :)");
        });

        $('#table-editable a.cancel').live('click', function (e) {
            e.preventDefault();
            if ($(this).attr("data-mode") == "new") {
                var nRow = $(this).parents('tr')[0];
                oTable.fnDeleteRow(nRow);
            } else {
                restoreRow(oTable, nEditing);
                nEditing = null;
            }
        });

        $('#table-editable a.edit').live('click', function (e) {
            e.preventDefault();
            /* Get the row as a parent of the link that was clicked on */
            var nRow = $(this).parents('tr')[0];

            if (nEditing !== null && nEditing != nRow) {
                alert('Já há um registro sendo editado, você deve salvá-lo antes de editar outro.');
                $('.editar-este').focus();
            } else if (nEditing == nRow && this.innerHTML == '<i class="fa fa-check"></i> Salvar') {
                /* This row is being edited and should be saved */
                saveRow(oTable, nEditing);
                atualizarRegistro(nEditing.cells[0].childNodes[0].data, nEditing.cells[1].childNodes[0].data);
                nEditing = null;
                /*alert("Updated! Do not forget to do some ajax to sync with backend :)");*/
                
            } else {
                 /* No row currently being edited */
                editRow(oTable, nRow);
                nEditing = nRow;
            }
        });

        $('.dataTables_filter input').attr("placeholder", "Search a user...");

        function atualizarRegistro(id, valor) {
            jQuery.ajax({
                type: "POST",
                url: '~/services/general.ashx?acao=atualizarDescricaoComoEncontrou' + '&comoEncontrou=' + id + '&descricao=' + valor,
                data: "",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (msg) {
                }
            });
        }

    };

    editableTable();














    function editableEtapa() {

        function restoreRow(oTable, nRow) {
            var aData = oTable.fnGetData(nRow);
            var jqTds = $('>td', nRow);

            for (var i = 0, iLen = jqTds.length; i < iLen; i++) {
                oTable.fnUpdate(aData[i], nRow, i, false);
            }

            oTable.fnDraw();
            removarColunaOrdem();
        }

        function editRow(oTable, nRow) {
            var aData = oTable.fnGetData(nRow);
            var jqTds = $('>td', nRow);
            /*jqTds[0].innerHTML = aData[0];*/
            jqTds[2].innerHTML = '<input type="text" maxlength="200" class="form-control small editar-este" value="' + aData[2] + '">';
            /*jqTds[1].innerHTML = '<input type="checkbox" class="switch" checked data-size="small"></input>';*/
            jqTds[3].innerHTML = '<div class="text-center"><a class="edit btn btn-success" href=""><i class="fa fa-check"></i> Salvar</a></div>';

            $('.editar-este').focus();
            $('.editar-este').on("click", function () {
                $('.editar-este').val('');
                $('.editar-este').focus();
            });
            $('.editar-este').on("mouseover", function () {
                jQuery(".sortable_table").sortable("disable")
            });
            $('.editar-este').on("mouseout", function () {
                jQuery(".sortable_table").sortable("enable")
            });

            $('.text-center').on("mouseover", function () {
                jQuery(".sortable_table").sortable("disable")
            });

            $('.text-center').on("mouseout", function () {
                jQuery(".sortable_table").sortable("enable")
            });

            removarColunaOrdem();
            oTable.fnDraw();
        }

        function saveRow(oTable, nRow) {
            var jqInputs = $('input', nRow);

            var id = nRow.children[1].innerHTML;
            var checked = '';
            if (jqInputs[2].checked)
                checked = 'checked';

            oTable.fnUpdate(jqInputs[0].value, nRow, 2, false);
            oTable.fnUpdate("<input runat='server' type='text' style='height: 35px;' value='" + jqInputs[1].value + "' name='highlight-color' class='pick-a-color'>", nRow, 4, false);
            oTable.fnUpdate("<input type='checkbox' data-on-text='Sim' data-off-text='N&atilde;o' data-on-color='success' data-off-color='danger' class='switch' " + checked + " id='ativo-etapa-negocio-" + id + "' onchange='atualizarAtivoEtapaNegocio(\"" + id + "\", document.getElementById(\"ativo-etapa-negocio-" + id + "\").checked)' data-size='small'>", nRow, 5, false);
            /*oTable.fnUpdate('<input type="checkbox" class="switch" checked data-size="small"></input>', nRow, 1, false);*/
            oTable.fnUpdate('<div class="text-center"><a class="edit btn btn-dark" href=""><i class="fa fa-pencil-square-o"></i> Editar</a> </div>', nRow, 3, false);
            oTable.fnDraw();
            jQuery("[type='checkbox']").bootstrapSwitch();
            removarColunaOrdem();
        }

        function cancelEditRow(oTable, nRow) {
            var jqInputs = $('input', nRow);
            oTable.fnUpdate(jqInputs[0].value, nRow, 2, false);
            /*oTable.fnUpdate(jqInputs[1].value, nRow, 1, false);*/
            oTable.fnUpdate('<a class="edit btn btn-dark" href=""><i class="fa fa-pencil-square-o"></i> Editar</a>', nRow, 3, false);
            oTable.fnDraw();

            removarColunaOrdem();
        }

        var oTable = $('#etapas').dataTable({
            "aLengthMenu": [
                [5, 15, 20, -1],
                [5, 15, 20, "All"] // change per page values here
            ],
            "sDom": "<'row'<'col-md-6 filter-left'f><'col-md-6'T>r>t<'row'<'col-md-6'i><'col-md-6'p>>",
            "oTableTools": {},
            // set the initial value
            "sAjaxSource": "~/services/general.ashx?acao=recarregarListagemEtapasNegocio",
            "iDisplayLength": 10,
            "bPaginate": false,
            "sPaginationType": "bootstrap",
            "oLanguage": {
                "sLengthMenu": "_MENU_ records per page",
                "oPaginate": {
                    "sPrevious": "Prev",
                    "sNext": "Next"
                },
                "sSearch": ""
            },
            "aoColumnDefs": [{
                'bSortable': false,
                'aTargets': [0, 1, 2, 3, 4, 5]
            }
            ]
        });

        //jQuery('#table-edit_wrapper .dataTables_filter input').addClass("form-control medium"); // modify table search input
        //jQuery('#table-edit_wrapper .dataTables_length select').addClass("form-control xsmall"); // modify table per page dropdown

        var nEditing = null;

        $('#etapas_new').click(function (e) {

            if ($('.editar-este').length != 0) {
                alert('Já há um registro sendo editado, você deve salvá-lo antes de editar outro.');
                $('.editar-este').focus();
            }

            else {
                e.preventDefault();
                var id = '';/*novoComoEncontrou();oTable[0].rows.length;*/
                jQuery.ajax({
                    type: "POST",
                    url: '~/services/general.ashx?acao=novaEtapaNegocio',
                    data: "",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (msg) {
                        id = msg[0]['ID'];
                        var aiNew = oTable.fnAddData(['0', id, 'Nome', '<p class="text-center"><a class="edit btn btn-dark" href=""><i class="fa fa-pencil-square-o"></i> Editar</a></p>', "<input runat='server' type='text' style='height: 35px;' value='' name='highlight-color' class='pick-a-color'>",
                        '<input type="checkbox" data-on-text="Sim" data-off-text="N&atilde;o" data-on-color="success" checked data-off-color="danger" class="switch" id="ativo-etapa-negocio-' + id + '" onchange="atualizarAtivoEtapaNegocio(\'' + id + '\', document.getElementById(\'ativo-etapa-negocio-' + id + '\').checked)" data-size="small">']);
                        var nRow = oTable.fnGetNodes(aiNew[0]);
                        editRow(oTable, nRow);
                        nEditing = nRow;

                        $('.hex-pound').remove();
                        $('.input-group-btn').remove();
                        $('.pick-a-color').pickAColor({
                            showSpectrum: true,
                            showSavedColors: true,
                            saveColorsPerElement: true,
                            fadeMenuToggle: true,
                            showAdvanced: true,
                            showBasicColors: false,
                            showHexInput: true,
                            allowBlank: true,
                            inlineDropdown: true
                        });

                        $('.color-menu').on("mouseover", function () {
                            jQuery(".sortable_table").sortable("disable")
                        });

                        $('.color-menu').on("mouseout", function () {
                            jQuery(".sortable_table").sortable("enable")
                        });

                        $('.pick-a-color-markup').on("mouseover", function () {
                            jQuery(".sortable_table").sortable("disable")
                        });

                        $('.pick-a-color-markup').on("mouseout", function () {
                            jQuery(".sortable_table").sortable("enable")
                        });

                        $('.edit').on("mouseover", function () {
                            jQuery(".sortable_table").sortable("disable")
                        });

                        $('.edit').on("mouseout", function () {
                            jQuery(".sortable_table").sortable("enable")
                        });

                        $('.switch-toggle').on("mouseover", function () {
                            jQuery(".sortable_table").sortable("disable")
                        });

                        $('.switch-toggle').on("mouseout", function () {
                            jQuery(".sortable_table").sortable("enable")
                        });

                        $('.pick-a-color').change(function () {
                            salvarCores();
                        });

                        removarColunaOrdem();
                        jQuery("[type='checkbox']").bootstrapSwitch();
                        oTable.fnDraw();
                    }
                });
            }
        });

        $('#etapas a.delete').live('click', function (e) {
            e.preventDefault();

            if (confirm("Are you sure to delete this row ?") == false) {
                return;
            }

            var nRow = $(this).parents('tr')[0];
            oTable.fnDeleteRow(nRow);

            // alert("Deleted! Do not forget to do some ajax to sync with backend :)");
        });

        $('#etapas a.cancel').live('click', function (e) {
            e.preventDefault();
            if ($(this).attr("data-mode") == "new") {
                var nRow = $(this).parents('tr')[0];
                oTable.fnDeleteRow(nRow);
            } else {
                restoreRow(oTable, nEditing);
                nEditing = null;
            }
        });

        $('#etapas a.edit').live('click', function (e) {
            e.preventDefault();
            /* Get the row as a parent of the link that was clicked on */
            var nRow = $(this).parents('tr')[0];

            if (nEditing !== null && nEditing != nRow) {
                /*restoreRow(oTable, nEditing);
                editRow(oTable, nRow);
                nEditing = nRow;
                jQuery(".sortable_table").sortable("disable");*/

                alert('Já há um registro sendo editado, você deve salvá-lo antes de editar outro.');
                $('.editar-este').focus();

            } else if (nEditing == nRow && this.innerHTML == '<i class="fa fa-check"></i> Salvar') {
                /* This row is being edited and should be saved */
                saveRow(oTable, nEditing);
                atualizarRegistroEtapaNegocio(nEditing.cells[1].childNodes[0].data, nEditing.cells[2].childNodes[0].data);
                $('.hex-pound').remove();
                $('.input-group-btn').remove();
                $('.pick-a-color').pickAColor({
                    showSpectrum: true,
                    showSavedColors: true,
                    saveColorsPerElement: true,
                    fadeMenuToggle: true,
                    showAdvanced: true,
                    showBasicColors: false,
                    showHexInput: true,
                    allowBlank: true,
                    inlineDropdown: true
                });

                $('.color-menu').on("mouseover", function () {
                    jQuery(".sortable_table").sortable("disable")
                });

                $('.color-menu').on("mouseout", function () {
                    jQuery(".sortable_table").sortable("enable")
                });

                $('.pick-a-color-markup').on("mouseover", function () {
                    jQuery(".sortable_table").sortable("disable")
                });

                $('.pick-a-color-markup').on("mouseout", function () {
                    jQuery(".sortable_table").sortable("enable")
                });

                $('.edit').on("mouseover", function () {
                    jQuery(".sortable_table").sortable("disable")
                });

                $('.edit').on("mouseout", function () {
                    jQuery(".sortable_table").sortable("enable")
                });

                $('.switch-toggle').on("mouseover", function () {
                    jQuery(".sortable_table").sortable("disable")
                });

                $('.switch-toggle').on("mouseout", function () {
                    jQuery(".sortable_table").sortable("enable")
                });

                $('.pick-a-color').change(function () {
                    salvarCores();
                });

                nEditing = null;

                removarColunaOrdem();

                /*alert("Updated! Do not forget to do some ajax to sync with backend :)");*/

            } else {
                /* No row currently being edited */
                editRow(oTable, nRow);
                nEditing = nRow;
                $('.editar-este').focus();
                $('.editar-este').on("click", function () {
                    $('.editar-este').val('');
                    $('.editar-este').focus();
                });
            }
        });

        $('.dataTables_filter input').attr("placeholder", "Search a user...");

        function atualizarRegistroEtapaNegocio(id, valor) {
            jQuery.ajax({
                type: "POST",
                url: '~/services/general.ashx?acao=atualizarDescricaoEtapaNegocio' + '&etapaNegocio=' + id + '&descricao=' + valor,
                data: "",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (msg) {
                }
            });
        }

        function removarColunaOrdem() {
            for (var linha = 0; linha < $('#etapas').children()[1].children.length; linha++)
                if ($('#etapas').children()[1].children[linha] != undefined && $('#etapas').children()[1].children[linha].children[1] != undefined)
                    $('#etapas').children()[1].children[linha].children[1].style.display = 'none';
        }

        function salvarCores() {
            var etapas = $('#tabelaEtapas')[0].children;
            var etapaNegocio = '';
            var cor = '';

            for (var i = 0; i < etapas.length; i++) {
                if (etapas[i].children[4] != undefined) {
                    etapaNegocio = '';
                    cor = '';

                    etapaNegocio = etapas[i].children[1].innerHTML;
                    if (etapas[i].children[4].children[0].children[1] != undefined && etapas[i].children[4].children[0].children[1].value != undefined)
                        cor = etapas[i].children[4].children[0].children[1].value;
                    else if (etapas[i].children[4].children[0].children[0].children[0] != undefined && etapas[i].children[4].children[0].children[0].children[0].value != undefined)
                        cor = etapas[i].children[4].children[0].children[0].children[0].value;
                    else if (etapas[i].children[4].children[0].children[0].children[0].children[1] != undefined && etapas[i].children[4].children[0].children[0].children[0].children[1].value != undefined)
                        cor = etapas[i].children[4].children[0].children[0].children[0].children[1].value;
                    else if (etapas[i].children[4].children[0].children[0].children[1] != undefined && etapas[i].children[4].children[0].children[0].children[1].value != undefined)
                        cor = etapas[i].children[4].children[0].children[0].children[1].value;

                    jQuery.ajax({
                        url: '~/services/general.ashx?acao=atualizarCorEtapaNegocio&etapaNegocio=' + etapaNegocio + '&cor=' + cor
                    });
                }
            }

            /*setTimeout('salvarCores()', 3000);*/
        }
    };

    editableEtapa();
});