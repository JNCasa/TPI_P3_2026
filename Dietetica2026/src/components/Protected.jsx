import { Navigate, Outlet } from 'react-router-dom'

// recibe estas prop-->
// <Protected
//   userRole={visible_del_padre}
//   allowedRole="Cliente"
//   isLoading={isSessionLoading}
// />
function Protected({ userRole, allowedRole, isLoading }) {
  const rutasPorRol = {
    Cliente: '/Store',
    Administrador: '/ListUsers',
    Vendedor: '/ListProducts',
  }

  if (isLoading) {
    return <p role="status">Verificando sesión...</p>
  }

  if (!userRole) {
    return <Navigate to="/LogIn" replace />
  }

  if (userRole !== allowedRole) {
    return <Navigate to={rutasPorRol[userRole] ?? '/LogIn'} replace />
  }
// ver linea 10
  return <Outlet />
}

export default Protected
