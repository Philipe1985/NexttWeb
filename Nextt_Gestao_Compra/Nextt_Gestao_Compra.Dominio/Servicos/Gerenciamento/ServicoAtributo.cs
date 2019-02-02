using Nextt_Gestao_Compra.Dominio.Entidades;
using Nextt_Gestao_Compra.Dominio.Interfaces.Repositorio.Gerenciamento;
using Nextt_Gestao_Compra.Dominio.Interfaces.Servico.Gerenciamento;
using System.Collections;
using System.Collections.Generic;

namespace Nextt_Gestao_Compra.Dominio.Servicos.Gerenciamento
{
    public class ServicoAtributo : ServicoPadrao<Parametros>, IServicoAtributo
    {
        private readonly IRepositorioAtributo _atributoRepositorio;
        public ServicoAtributo(IRepositorioAtributo atributoRepositorio) : base(atributoRepositorio)
        {
            _atributoRepositorio = atributoRepositorio;
        }

        public List<IEnumerable> BuscaAtributoEditar(string parametros)
        {
            return _atributoRepositorio.BuscaAtributoEditar(parametros);
        }

        public List<IEnumerable> BuscaAtributosSintetico(string parametros)
        {
            return _atributoRepositorio.BuscaAtributosSintetico(parametros);
        }

        public List<IEnumerable> CarregaFiltrosPesquisa()
        {
            return _atributoRepositorio.CarregaFiltrosPesquisa();
        }

        public void ExluirAtributo(string atributoJson)
        {
            _atributoRepositorio.ExluirAtributo(atributoJson);
        }

        public void SalvarAtributo(string atributoJson)
        {
            _atributoRepositorio.SalvarAtributo(atributoJson);
        }
    }
}
