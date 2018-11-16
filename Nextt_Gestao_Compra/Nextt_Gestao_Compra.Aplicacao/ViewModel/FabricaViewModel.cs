using Nextt_Gestao_Compra.Dominio.Entidades;
using RDI_Gerenciador_Usuario.Aplicacao.Gerenciador;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http.Routing;

namespace Nextt_Gestao_Compra.Aplicacao.ViewModel
{
    public class FabricaViewModel
    {
        private UrlHelper _UrlHelper;
        private GerenciadorUsuarioAplicacao _appGerenciadorUsuario;

        public FabricaViewModel(HttpRequestMessage request, GerenciadorUsuarioAplicacao appGerenciadorUsuario)
        {
            _UrlHelper = new UrlHelper(request);
            _appGerenciadorUsuario = appGerenciadorUsuario;
        }


        //public Fornecedor CriarFornecedor(DadosPrePedido dadosCadastro)
        //{
        //    return new Fornecedor()
        //    {
        //        IDFornecedor = dadosCadastro.IDFornecedor,
        //        CNPJ = String.Empty,
        //        RazaoSocial = dadosCadastro.RazaoSocial,
        //        NomeFantasia = dadosCadastro.RazaoSocial
        //    };
        //}
        public Marca CriarMarca(DadosPrePedido dadosCadastro)
        {
            return new Marca()
            {
                IDMarca = dadosCadastro.IDMarca,
                Nome = dadosCadastro.DescricaoMarca
            };
        }
        public Secao CriarSecao(DadosPrePedido dadosCadastro)
        {
            return new Secao()
            {
                IDSecao = dadosCadastro.IDSecao,
                Descricao = dadosCadastro.DescricaoSecao
            };
        }
        public Especie CriarEspecie(DadosPrePedido dadosCadastro)
        {
            return new Especie()
            {
                DescricaoSecao = dadosCadastro.DescricaoSecao,
                IDEspecie = dadosCadastro.IDEspecie,
                DescricaoEspecie = dadosCadastro.DescricaoEspecie
            };
        }
        public ComboFiltroVM Criar(Segmento segmento)
        {
            return new ComboFiltroVM
            {
                Valor = segmento.IDSegmento + "-" + segmento.Descricao.Trim(),
                Token = segmento.IDSegmento + "-" + segmento.Descricao,
                Descricao = segmento.Descricao.Trim()
            };
        }

        public ComboFiltroVM Criar(Fornecedor fornecedor)
        {
            return new ComboFiltroVM
            {
                Valor = fornecedor.IDFornecedor.ToString(),
                Token = fornecedor.IDFornecedor + " " + fornecedor.CNPJ + " " + fornecedor.NomeFantasia + " " + fornecedor.RazaoSocial,
                Descricao = fornecedor.NomeFantasia
            };
        }
        public ComboFiltroVM Criar(Marca marca)
        {
            return new ComboFiltroVM
            {
                Valor = marca.IDMarca.ToString(),
                Token = marca.IDMarca + " " + marca.Nome,
                Descricao = marca.Nome
            };
        }
        public ComboFiltroVM Criar(Atributos atributos)
        {


            return new ComboFiltroVM
            {
                Valor = atributos.IDTipoAtributo.ToString(),
                Token = atributos.IDTipoAtributo + ";" + atributos.Descricao.Trim(),
                Descricao = atributos.Descricao.Trim(),
                DadosAdicionais = new List<string>
            {
                atributos.ValorDefault
            }
            };
        }
        public ComboFiltroVM Criar(Secao secao)
        {
            return new ComboFiltroVM
            {
                Valor = secao.IDSecao + "-" + secao.Descricao.Trim(),
                Token = secao.IDSegmento + "-" + secao.IDSecao + ";" + secao.Descricao.Trim(),
                Descricao = secao.Descricao.Trim()
            };
        }
        public ComboFiltroVM Criar(Especie especie)
        {
            return new ComboFiltroVM
            {
                Valor = especie.IDEspecie + "-" + especie.DescricaoEspecie.Trim(),
                Token = especie.IDSecao + "-" + especie.DescricaoSecao.Trim() + ";" + especie.IDEspecie + "-"  + especie.DescricaoEspecie.Trim(),
                Descricao = especie.DescricaoEspecie.Trim()
            };
        }

        public ComboFiltroVM Criar(FormaPgto forma)
        {
            return new ComboFiltroVM
            {
                Valor = forma.IDFormaPagamento.ToString(),
                Token = forma.IDFormaPagamento + " " + forma.DescricaoFormaPagamento.Trim(),
                Descricao = forma.DescricaoFormaPagamento.Trim()
            };
        }
        public ComboFiltroVM Criar(ReferenciaProduto referenciaProduto)
        {
            return new ComboFiltroVM
            {
                Valor = referenciaProduto.Referencia,
                Token = referenciaProduto.IDProduto + "," + referenciaProduto.Referencia.Trim(),
                Descricao = referenciaProduto.Referencia.Trim(),
            };
        }

        public ComboFiltroVM Criar(ClassificacaoFiscal classificacao)
        {

            return new ComboFiltroVM
            {
                Valor = classificacao.IDClassificacaoFiscal.ToString(),
                Token = classificacao.Pis.ToString(CultureInfo.CreateSpecificCulture("en-US")) +
                "," + classificacao.Confins.ToString(CultureInfo.CreateSpecificCulture("en-US")) +
                ";" + classificacao.CodigoFiscal.Trim() + "," + classificacao.DescricaoClassificacao.Trim(),
                Descricao = classificacao.CodigoFiscal.Trim() + " - " + classificacao.DescricaoClassificacao.Trim(),
            };
        }

        public ComboFiltroVM Criar(CondicaoPgto condicao)
        {
            return new ComboFiltroVM
            {
                Valor = condicao.IDCondicaoPagamento.ToString(),
                Token = condicao.IDCondicaoPagamento + " " + condicao.Condicao.Trim(),
                Descricao = condicao.Condicao.Trim()
            };
        }
        public ComboFiltroVM Criar(Cor cor)
        {
            return new ComboFiltroVM
            {
                Valor = cor.Descricao.Trim(),
                Token = cor.IDCor + "," + cor.Descricao.Trim(),
                Descricao = cor.Descricao.Trim(),
                DadosAdicionais = cor.CorRGB.Split(new char[] { '/' }).ToList()
            };
        }
        public ComboFiltroVM Criar(GrupoTamanho tamanho)
        {
            var dadosAdicionais = new List<string>();
            if (tamanho.IDTamanho == 0)
            {
                throw new Exception("Existe tamanho retornado sem a coluna 'IDTamanho' definida para ele.");
            }
            if (String.IsNullOrEmpty(tamanho.Descricao))
            {
                throw new Exception("Existe tamanho retornado sem a coluna 'Descricao' definida para ele.");
            }

            if (tamanho.ForaGrade)
            {
                dadosAdicionais.Add(",gradeInvalida");
            }
            return new ComboFiltroVM
            {
                Valor = tamanho.Descricao.Trim(),
                Token = tamanho.IDTamanho + "," + tamanho.Descricao.Trim(),
                Descricao = tamanho.Descricao.Trim(),
                DadosAdicionais = dadosAdicionais
            };
        }
        public ComboFiltroVM Criar(GrupoFilial grupo)
        {
            var dadosAdicionais = new List<string>
            {
                grupo.ParticipacaoGrupo.ToString()
            };
            if (grupo.IDGrupoFilial == 0)
            {
                throw new Exception("Existe grupo retornado sem a coluna 'IDGrupoFilial' definida para ele.");
            }
            return new ComboFiltroVM
            {
                Valor = grupo.IDGrupoFilial.ToString(),
                Token = grupo.IDGrupoFilial + "," + grupo.Descricao.Trim(),
                Descricao = grupo.Descricao.Trim(),
                DadosAdicionais = dadosAdicionais
            };
        }
        public ComboFiltroVM CriarComboFilial(GrupoFilial filial)
        {
            return new ComboFiltroVM
            {
                Valor = filial.IDFilial.ToString(),
                Token = filial.IDFilial + "," + filial.Filial_Nome.Trim(),
                Descricao = filial.Filial_Nome.Trim()
            };
        }
        public ComboFiltroVM Criar(UsuarioGerenciamento usuario)
        {
            return new ComboFiltroVM
            {
                Valor = usuario.IDUsuario,
                Token = usuario.IDUsuario + "," + usuario.NomeUsuario.Trim(),
                Descricao = usuario.NomeUsuario.Trim()
            };
        }
    }
}