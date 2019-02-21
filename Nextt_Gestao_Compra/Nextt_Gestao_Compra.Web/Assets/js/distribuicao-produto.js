var tbHistorico
$(document).ready(function () {
    $(window).on("load", carregar);
    $(document).on('click', '#btnVoltarGerenciarDist', function (evento) {

        //if (permissoesUsuarioLogado.indexOf('Cadastrar Atributos') === -1) {
        //    semAcesso();
        //} else {
        //  }
    });
})
function carregar() {

    var mock = [];
    for (var i = 0; i < 10; i++) {
        var itemMock = {};
        itemMock.idProduto = i + 1;
        itemMock.dtDistribuicao = moment().subtract(i, 'months').format("DD/MM/YYYY");
        itemMock.qtdPacks = 20;
        itemMock.qtdGrade = 50;
        itemMock.qtdItens = 1000;
        itemMock.qtdPackDist = 10;
        itemMock.qtdItensDist = 200;        
        mock.push(itemMock);
    }
    inicializarTbDistHistorico(mock) 
}
function retornarPesquisa() {

    $('.selectpicker').selectpicker('hide');
    $(".navbar.navbar-default.navbar-fixed-top").addClass('ocultarElemento');
    $(".bg_load").show();
    $(".wrapper").show();
    window.location = "../gerenciamento/distribuicao.cshtml";
}
function criarDistribuicao() {

    $('.selectpicker').selectpicker('hide');
    $(".navbar.navbar-default.navbar-fixed-top").addClass('ocultarElemento');
    $(".bg_load").show();
    $(".wrapper").show();
    window.location = "../cadastro/distribuicaogrupo.cshtml";
}
function inicializarTbDistHistorico(dados) {
    tbProduto = $('#tabelaHitorico').DataTable({
        deferRender: true,
        ordering: true,
        responsive: true,
        searching: true,
        paging: false,
        "order": [[1, 'desc']],
        scrollX: true,
        scrollY: '50vh',
        "columnDefs": [
            {
                "targets": 0,
                "visible": false,

            },
            {
                "targets": 1,
                "type": "date-eu",
                'className': 'dt-body-center'

            },
            {
                "targets": [2, 3, 4, 5,6],
                "type": "formatted-num",
                'className': 'dt-body-center'
            },
            {
                "targets": 7,
                "orderable": false,
                'className': 'dt-body-center'
            },
        ],
        "language": {
            "emptyTable": "Nenhum produto encontrado",
            "zeroRecords": "Nenhum produto corresponde ao filtro"
        },
        destroy: true,
        fixedHeader: true,
        data: dados,
        columns: [
            { "data": "idProduto", visible: false },
            { "data": "dtDistribuicao" },
            {
                "data": "qtdPacks",
                "render": function (data, type, row, meta) {
                    return data.toLocaleString('pt-BR');
                }
            },
            {
                "data": "qtdGrade",
                "render": function (data, type, row, meta) {
                    return data.toLocaleString('pt-BR');
                }
            },
            {
                "data": "qtdItens",
                "render": function (data, type, row, meta) {
                    return data.toLocaleString('pt-BR');
                }
            },
            {
                "data": "qtdPackDist",
                "render": function (data, type, row, meta) {
                    return data.toLocaleString('pt-BR');
                }
            },
            {
                "data": "qtdItensDist",
                "render": function (data, type, row, meta) {
                    return data.toLocaleString('pt-BR');
                }
            },
            {
                "data": null,
                "defaultContent": '<a href="#" class="btn btn-primary distribuicaoDetalhe" data-toggle="tooltip" data-container="body" title="Detalhe da Distribuicao"><i class="flaticon-view" aria-hidden="true"></i></a>'
            }
        ],
        "drawCallback": function (settings) {
            $(function () {
                $('[data-toggle="tooltip"]').tooltip();
            });
            $(".bg_load").fadeOut();
            $(".wrapper").fadeOut();
            var $menuTitulo = $(".navbar.navbar-default.navbar-fixed-top");
            $menuTitulo.removeClass('ocultarElemento');
            $menuTitulo.find('.navbar-header .navbar-center').text('Distribuição de Produtos');

        }

    });
}