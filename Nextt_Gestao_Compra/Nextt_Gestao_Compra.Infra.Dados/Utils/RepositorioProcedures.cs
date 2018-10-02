using System;
using System.Collections;
using System.Collections.Generic;
using System.Data.Common;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;

namespace Nextt_Gestao_Compra.Infra.Dados.Utils
{
    public static class RepositorioProcedures
    {
        public static MultiplosResultSetEncapsulador MultiplosResults(this DbContext db, string storedProcedure)
        {
            return new MultiplosResultSetEncapsulador(db, storedProcedure);
        }
        public static EnvioXML EnviarXML(this DbContext db, string storedProcedure)
        {
            return new EnvioXML(db, storedProcedure);
        }
        public class MultiplosResultSetEncapsulador
        {
            private readonly DbContext _db;
            private readonly string _storedProcedure;
            public List<Func<IObjectContextAdapter, DbDataReader, IEnumerable>> _resultSets;
            public MultiplosResultSetEncapsulador(DbContext db, string storedProcedure)
            {
                _db = db;
                _storedProcedure = storedProcedure;
                _resultSets = new List<Func<IObjectContextAdapter, DbDataReader, IEnumerable>>();
            }
            public MultiplosResultSetEncapsulador With<TResult>()
            {
                _resultSets.Add((adapter, reader) => adapter
                    .ObjectContext
                    .Translate<TResult>(reader)
                    .ToList());
                return this;
            }
            public List<IEnumerable> Executar()
            {
                var results = new List<IEnumerable>();
                using (var connection = _db.Database.Connection)
                {
                    connection.Open();
                    var command = connection.CreateCommand();
                    
                    command.CommandTimeout = 0;
                    command.CommandText = "EXEC " + _storedProcedure;
                    using (var reader = command.ExecuteReader())
                    {
                        if (reader.FieldCount == 0)
                        {
                            return null;
                        }
                        var adapter = ((IObjectContextAdapter)_db);
                        foreach (var resultSet in _resultSets)
                        {
                            results.Add(resultSet(adapter, reader));
                            reader.NextResult();
                        }
                    }
                    return results;
                }
            }
        }
        public class EnvioXML
        {
            private readonly DbContext _db;
            private readonly string _storedProcedure;
            public EnvioXML(DbContext db, string storedProcedure)
            {
                _db = db;
                _storedProcedure = storedProcedure;
            }
            public bool Executar()
            {
                var retorno = false;
                using (var connection = _db.Database.Connection)
                {
                    connection.Open();
                    var command = connection.CreateCommand();
                    command.CommandText = "EXEC " + _storedProcedure;
                    var concluido = command.ExecuteNonQuery();
                    if (concluido > 0)
                        retorno = true;
                }
                return retorno;

            }
        }
    }
}
