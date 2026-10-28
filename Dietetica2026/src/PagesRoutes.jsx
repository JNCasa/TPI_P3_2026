import { Navigate, Route, Routes } from 'react-router-dom'
import AboutUs from './Pages/AboutUs.jsx'
import Cart from './Pages/Cart.jsx'
import CreateAccount from './Pages/CreateAccount.jsx'
import FrequentQuestions from './Pages/FrequentQuestions.jsx'
import Home from './Pages/Home.jsx'
import ListProducts from './Pages/ListProducts.jsx'
import ListUsers from './Pages/ListUsers.jsx'
import LogIn from './Pages/LogIn.jsx'
import Store from './Pages/Store.jsx'
import Ticket from './Pages/Ticket.jsx'
// Entrás a / o /Store → ves la tienda.
// Desde /Store, "Ver compra" abre /Cart; desde ahí se continúa a /Ticket.

// Entrás a /LogIn → ves el login.

// Entrás a /CreateAccount → ves la creación de cuenta.

// Entrás a /ListProducts → ves la lista de productos.

// Entrás a /ListUsers → ves la lista de usuarios.

function PagesRoutes({
  catalogProducts,
  products,
  setProducts,
  visible_del_padre,
  setVisible_del_padre,
}) {
  const roleHome =
    visible_del_padre === 'Cliente'
      ? '/Store'
      : visible_del_padre === 'Administrador'
        ? '/ListUsers'
        : visible_del_padre === 'Vendedor'
          ? '/ListProducts'
          : '/LogIn'

  return (
    <main className="pages-section">
      <Routes>
        <Route path="/" element={<Home userRole={visible_del_padre} />} />
        <Route
          path="/Store"
          element={
            visible_del_padre === 'Cliente' ? (
              <Store
                visible_del_padre={visible_del_padre}
                catalogProducts={catalogProducts}
                setProducts={setProducts}
              />
            ) : (
              <Navigate to={roleHome} replace />
            )
          }
        />
        <Route
          path="/Cart"
          element={
            visible_del_padre === 'Cliente' ? (
              <Cart products={products} />
            ) : (
              <Navigate to={roleHome} replace />
            )
          }
        />
        <Route
          path="/Ticket"
          element={
            visible_del_padre === 'Cliente' ? (
              <Ticket products={products} setProducts={setProducts} />
            ) : (
              <Navigate to={roleHome} replace />
            )
          }
        />
        <Route
          path="/LogIn"
          element={<LogIn setVisible_del_padre={setVisible_del_padre} />}
        />
        <Route path="/CreateAccount" element={<CreateAccount />} />
        <Route path="/AboutUs" element={<AboutUs />} />
        <Route path="/FrequentQuestions" element={<FrequentQuestions />} />
        <Route
          path="/ListProducts"
          element={
            visible_del_padre === 'Vendedor' ? (
              <ListProducts />
            ) : (
              <Navigate to={roleHome} replace />
            )
          }
        />
        <Route
          path="/ListUsers"
          element={
            visible_del_padre === 'Administrador' ? (
              <ListUsers />
            ) : (
              <Navigate to={roleHome} replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
  )
}

export default PagesRoutes
