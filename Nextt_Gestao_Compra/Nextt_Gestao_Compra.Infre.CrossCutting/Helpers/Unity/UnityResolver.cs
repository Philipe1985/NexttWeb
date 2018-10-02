using Microsoft.Practices.Unity;
using System;
using System.Collections.Generic;
using System.Web.Http.Dependencies;

namespace Nextt_Gestao_Compra.Infre.CrossCutting.Helpers.Unity
{
    class UnityResolver
    {
    }
}
public class UnityResolver : IDependencyResolver
{
    protected IUnityContainer container;
    public UnityResolver(IUnityContainer container)
    {
        this.container = container ?? throw new ArgumentNullException("container");
    }
    public object GetService(Type serviceType)
    {
        try
        {
            return container.Resolve(serviceType);
        }
        catch (ResolutionFailedException)
        {
            return null;
        }
    }
    public IEnumerable<object> GetServices(Type serviceType)
    {
        try
        {
            return container.ResolveAll(serviceType);
        }
        catch (ResolutionFailedException)
        {
            return new List<object>();
        }
    }
    public void Dispose()
    {
        container.Dispose();
    }
    public IDependencyScope BeginScope()
    {
        var child = container.CreateChildContainer();
        return new UnityResolver(child);
    }
}

