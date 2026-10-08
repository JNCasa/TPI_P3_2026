import { Navigate, Route, Routes } from 'react-router-dom'
import AboutUs from './Pages/AboutUs.jsx'
import Cart from './Pages/Cart.jsx'
import CreateAccount from './Pages/CreateAccount.jsx'
import FrequentQuestions from './Pages/FrequentQuestions.jsx'
import ListProducts from './Pages/ListProducts.jsx'
import ListUsers from './Pages/ListUsers.jsx'
import LogIn from './Pages/LogIn.jsx'
import Store from './Pages/Store.jsx'

function PagesRoutes() {
  return (
    <main className="pages-section">
      <Routes>
        <Route path="/" element={<Store />} />
        <Route path="/Store" element={<Store />} />
        <Route path="/LogIn" element={<LogIn />} />
        <Route path="/CreateAccount" element={<CreateAccount />} />
        <Route path="/AboutUs" element={<AboutUs />} />
        <Route path="/FrequentQuestions" element={<FrequentQuestions />} />
        <Route path="/ListProducts" element={<ListProducts />} />
        <Route path="/ListUsers" element={<ListUsers />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
  )
}

export default PagesRoutes
