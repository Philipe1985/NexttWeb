var tbProduto;
$(document).ready(function () {
    $(window).on("load", carregar);
    $('#drpSeg').on('change', function (e) {
        $('#divEsp').addClass('ocultarElemento');
        $("#drpEsp").html('');
        $('#divSec').addClass('ocultarElemento');
        $("#drpSec").html('');

        var objParam = {};
        if ($('#drpSeg').val()) {
            if ($('#divSec').hasClass('ocultarElemento')) {
                $('#divSec').removeClass('ocultarElemento');
            }
            $('.selectpicker').selectpicker('hide');
            $(".navbar.navbar-default.navbar-fixed-top").addClass('ocultarElemento');
            $(".bg_load").show();
            $(".wrapper").show();
            objParam.segmentos = $('#drpSeg').val().join(',').replace(/[^\d,]/g, '');
            console.log(objParam)
            carregarSecoes(objParam);
        }
    });
    $('#drpSec').on('change', function (e) {

        var objParam = {};
        $('#divEsp').addClass('ocultarElemento');
        $("#drpEsp").html('');
        if ($('#drpSec').val()) {
            $('#drpSec').selectpicker('toggle');
            $('.selectpicker').selectpicker('hide');
            $(".navbar.navbar-default.navbar-fixed-top").addClass('ocultarElemento');
            $(".bg_load").show();
            $(".wrapper").show();
            objParam.secoes = $('#drpSec').val().join(',');
            carregarEspecie(objParam);
        }
    });
    
    $(document).on('click', '.distribuirProduto', function (evento) {

        //if (permissoesUsuarioLogado.indexOf('Cadastrar Atributos') === -1) {
        //    semAcesso();
        //} else {
            
            $('.selectpicker').selectpicker('hide');
            $(".navbar.navbar-default.navbar-fixed-top").addClass('ocultarElemento');
            $(".bg_load").show();
            $(".wrapper").show();
            window.location = "../gerenciamento/distribuicaoproduto.cshtml";
      //  }
    });
})
function carregar() {
    sessionStorage.removeItem('compra');
    sessionStorage.removeItem('cadastroNovo');
    sessionStorage.removeItem('cadastroProduto');
    sessionStorage.removeItem('fornSelecionado');
    sessionStorage.removeItem('produtosLista');
    sessionStorage.removeItem("produtosComprarSelecionados");
    sessionStorage.removeItem("pedidoId");
    sessionStorage.removeItem("pedidoStatus");
    carregaFiltrosDistribuicao();
}

function buscarProdutosDistribuicao() {
    $(".navbar.navbar-default.navbar-fixed-top").addClass('ocultarElemento');
    $('.selectpicker').selectpicker('hide');
    $(".bg_load").show();
    $(".wrapper").show();
    var mock = [];
    for (var i = 0; i < 10; i++) {
        var itemMock = {};
        itemMock.idProduto = i + 1;
        itemMock.codProduto = ajustaCodigoTamanho(((i + 1) * 9).toString(), 9);
        itemMock.descricaoProduto = "Camisa " + i;
        itemMock.descricaoMarca = "Polo Wear";
        itemMock.referencia = "Teste Ref";
        itemMock.qtdEstoque = 1100 + i;
        itemMock.dtUltEntrega = moment().subtract(i, 'days').format("DD/MM/YYYY");
        itemMock.dtCadastro = moment().subtract(i, 'years').format("DD/MM/YYYY");
        mock.push(itemMock);
    }
    tbProduto.clear();
    tbProduto.data(tbProduto).rows.add(mock);
    tbProduto.draw();
    $(".bg_load").fadeOut();
    $(".wrapper").fadeOut();
    $('.selectpicker').selectpicker('show');
    $(".navbar.navbar-default.navbar-fixed-top").removeClass('ocultarElemento');
}
function inicializarTbDistribuicao() {
    tbProduto = $('#tabelaProdutos').DataTable({
        deferRender: true,
        ordering: true,
        responsive: true,
        searching: true,
        paging: false,
        "order": [[2, 'desc']],
        scrollX: true,
        scrollY: '50vh',
        "columnDefs": [
            {
                "targets": 0,
                "visible": false,

            },
            {
                "targets": 1,
                'className': 'dt-body-center'

            },
            {
                "targets": [2, 3, 4],
                'className': 'dt-body-left'
            },
            {
                "targets": 5,
                "type": "formatted-num",
                'className': 'dt-body-center'

            },
            {
                "targets": [6, 7],
                "type": "date-eu",
                'className': 'dt-body-center'
            },
            {
                "targets": 8,
                "orderable": false,
                'className': 'dt-body-center'
            }
        ],
        "language": {
            "emptyTable": "Nenhum produto encontrado",
            "zeroRecords": "Nenhum produto corresponde ao filtro"
        },
        destroy: true,
        fixedHeader: true,
        data: [],
        columns: [
            { "data": "idProduto", visible: false },
            { "data": "codProduto" },
            {"data": "descricaoProduto"},
            { "data": "descricaoMarca"},
            { "data": "referencia" },
            {
                "data": "qtdEstoque",
                "render": function (data, type, row, meta) {
                    return data.toLocaleString('pt-BR') ;
                }
            },
            { "data": "dtUltEntrega" },
            { "data": "dtCadastro" },
            {
                "data": null,
                "defaultContent": '<a href="#" class="btn btn-primary distribuirProduto" data-toggle="tooltip" data-container="body" title="Distribuir Produto"><i class="flaticon-movement" aria-hidden="true"></i></a>'
            }
        ],
        "drawCallback": function (settings) {
            $(function () {
                $('[data-toggle="tooltip"]').tooltip();
            });
        }

    });
}


