﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nextt_Gestao_Compra.Dominio.Entidades
{
    public class EnumAtributoTipo
    {
       public enum TipoAtributo
        {
            Texto = 0,
            Numerico = 1,
            Monetario = 2,
            Percentual = 3,
            Data = 4,
            Boleano = 5
        }
    }
}
