var footerTemplate = '<div class="file-thumbnail-footer" style ="height:94px">\n' +
    '  <input class="kv-input kv-new form-control input-sm form-control-sm text-center {TAG_CSS_NEW}" value="{caption}" placeholder="Digite uma legenda...">\n' +
    '  <input class="kv-input kv-init form-control input-sm form-control-sm text-center {TAG_CSS_INIT}" value="{TAG_VALUE}" placeholder="Digite uma legenda...">\n' +
    '   <div class="small" style="margin:15px 0 2px 0">{size}</div> \n{indicator}\n{actions}\n' +
    '</div>', imagemObjPlugin;
var photo = new Image();
function criaInputImagem(listImage, configPV, configRodape) {

    imagemObjPlugin = $("#imgUpload").fileinput({
        language: "pt-BR",
        overwriteInitial: false,
        initialPreview: listImage,
        initialPreviewConfig: configPV,
        resizeImage: true,
        maxImageWidth: '90%',
        maxImageHeight: '90%',
        purifyHtml: true,
        showClose: false,
        showRemove: false,
        showCancel: false,
        showUploadedThumbs: false,
        showUpload: false,
        showCaption: false,
        maxFileCount: 20,
        //ajaxSettings: {
        //    beforeSend: function (req) {
        //        req.setRequestHeader('Authorization', sessionStorage.getItem("token"));
        //    }
        //},
        validateInitialCount: true,
        uploadUrl: urlApi + 'gerenciamento/compra/SalvarImagem',
        uploadExtraData: function (previewId, index) {
            var obj = {};
            var idProdFoto = sessionStorage.getItem('idProdutoImagens')
            obj.idProduto = parseInt(idProdFoto);
            return obj;
        },
        //removeLabel: "Excluir Pendentes",
        //uploadLabel: "Salvar Pendentes",
        //uploadClass: "btn btn-primary",
        //removeClass: "btn btn-danger",
        dropZoneTitle: "",
        uploadIcon: "",
        buttonLabelClass: '',
        browseLabel: "Adicionar/Capturar",
        browseClass: "btn btn-success",
        browseIcon: "",
        browseOnZoneClick: false,
        removeIcon: '',
        removeTitle: '',
        elErrorContainer: '#kv-avatar-errors-2',
        msgErrorClass: 'alert alert-block alert-danger',
        autoOrientImage: true,
        allowedFileExtensions: ["jpg", "jpeg", "png"],
        layoutTemplates: {
            footer: footerTemplate,
            actions: '<div class="file-actions">\n' +
                '    <div class="file-footer-buttons">\n' +
                '        {delete} {zoom}' +
                '    </div>\n' +
                '    <div class="clearfix"></div>\n' +
                '</div>'
        },
        previewThumbTags: {
            '{TAG_VALUE}': '',
            '{TAG_CSS_NEW}': '',
            '{TAG_CSS_INIT}': 'kv-hidden'
        },
        initialPreviewThumbTags: configRodape,
    });
    
}
function geraPreviewConfig(arrayOriginal, objConfig) {
    arrayOriginal.push({
        caption: '',
        size: objConfig.imagem.length,
        key: objConfig.idProdutoFoto,
        url: urlApi + 'gerenciamento/compra/excluirImagem',
        extra: { id: objConfig.idProdutoFoto, idProduto: objConfig.idProduto }
    })
    return arrayOriginal;
}
function geraImagemInput(arrayOriginal, objConfig, ) {
    console.log(objConfig)
    var img = document.createElement('img');
    img.src = 'data:image/' + objConfig.extensao.toLowerCase() + ';base64,' + objConfig.imagem;
    img.style.maxHeight = '90%';
    img.style.maxWidth = '90%';
    img.className = 'file-preview-image';
    arrayOriginal.push(img.outerHTML);
    return arrayOriginal;
}
function geraRodapePreview(arrayOriginal) {
    arrayOriginal.push({ '{TAG_VALUE}': '', '{TAG_CSS_NEW}': 'kv-hidden', '{TAG_CSS_INIT}': '' });
    return arrayOriginal;
}
function removerExtArquivo(nomeArquivo) {
    var indiceUltimoPonto = nomeArquivo.lastIndexOf(".");
    if (indiceUltimoPonto === -1) return nomeArquivo;
    else return nomeArquivo.substr(0, indiceUltimoPonto);
}
function validaNovoNomeImg(nome) {
    var retorno = {};
    if (!nome) {
        retorno.texto = 'Informe uma descrição para prosseguir!';
        retorno.status = false;
    }
    else if (nome === nomeInicialImagem) {
        retorno.texto = 'A descrição nova deve ser diferente da anterior para prosseguir!'
        retorno.status = false;
    }
    else if (padronizarString(nome, "_").length < 4) {
        retorno.texto = 'Informe uma descrição com no minimo 4 caracteres alfanumericos!'
        retorno.status = false;
    }
    else if (padronizarString(nome, "_").length > 10) {
        retorno.texto = 'Informe uma descrição com no maximo 10 caracteres, incluindo os espaço!'
        retorno.status = false;
    }
    else if (nome) {
        retorno.texto = padronizarString(nome, "_");
        retorno.status = true;
    }
    return retorno;
}

function salvarImagens(file) {
    var objEnvio = {};
    objEnvio.idProduto = parseInt($("#txtIDProd").val());
    objEnvio.extensao = file.type.split('/')[1].toUpperCase();

    var reader = new FileReader();
    reader.onload = function () {
        var myArray = this.result;
        var longInt8View = new Uint8Array(myArray);

        // this doesn't seem to do anything as Uint8Array only contains 8 bit values , so all values are already in range 0-255
        for (var i = 0; i < longInt8View.length; i++) {
            longInt8View[i] = i % 255;
        }
        objEnvio.imagem = myArray;
        console.log(objEnvio);
    }
    reader.readAsArrayBuffer(file);
    return objEnvio;
}
