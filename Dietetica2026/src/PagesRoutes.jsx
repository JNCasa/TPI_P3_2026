import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
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
import Protected from './components/Protected.jsx'
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
  isSessionLoading,
}) {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <main className="pages-section">
      <Routes>
        <Route path="/" element={<Home userRole={visible_del_padre} />} />
        <Route path="/LogIn" element={<LogIn setVisible_del_padre={setVisible_del_padre} />} />
        <Route path="/CreateAccount" element={<CreateAccount />} />
        <Route path="/AboutUs" element={<AboutUs />} />
        <Route path="/FrequentQuestions" element={<FrequentQuestions />} />

        <Route
          element={
            <Protected
              userRole={visible_del_padre}
              allowedRole="Cliente"
              isLoading={isSessionLoading}
            />
          }
        >
          <Route
            path="/Store"
            element={
              <Store
                visible_del_padre={visible_del_padre}
                catalogProducts={catalogProducts}
                setProducts={setProducts}
              />
            }
          />
          <Route
            path="/Cart"
            element={
              <Cart products={products} setProducts={setProducts} />
            }
          />
          <Route
            path="/Ticket"
            element={
              <Ticket products={products} setProducts={setProducts} />
            }
          />
        </Route>

        <Route
          element={
            <Protected
              userRole={visible_del_padre}
              allowedRole="Vendedor"
              isLoading={isSessionLoading}
            />
          }
        >
          <Route path="/ListProducts" element={<ListProducts />} />
        </Route>

        <Route
          element={
            <Protected
              userRole={visible_del_padre}
              allowedRole="Administrador"
              isLoading={isSessionLoading}
            />
          }
        >
          <Route path="/ListUsers" element={<ListUsers />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
  )
}

export default PagesRoutes
