using Nextt_Gestao_Compra.Dominio.Entidades;
using Nextt_Gestao_Compra.Dominio.Interfaces.Repositorio.Gerenciamento;
using Nextt_Gestao_Compra.Dominio.Interfaces.Servico.Gerenciamento;
using System.Collections;
using System.Collections.Generic;

namespace Nextt_Gestao_Compra.Dominio.Servicos.Gerenciamento
{
    public class ServicoDistribuicao : ServicoPadrao<Parametros>, IServicoDistribuicao
    {
        private readonly IRepositorioDistribuicao _distribuicaoRepositorio;
        public ServicoDistribuicao(IRepositorioDistribuicao distribuicaoRepositorio) : base(distribuicaoRepositorio)
        {
            _distribuicaoRepositorio = distribuicaoRepositorio;
        }

        public List<IEnumerable> CarregaFiltrosPesquisa()
        {
            return _distribuicaoRepositorio.CarregaFiltrosPesquisa();
        }
    }
}
