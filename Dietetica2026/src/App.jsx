import { BrowserRouter } from 'react-router-dom'
import './assets/css/App.css'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { useTheme } from './context/useTheme.js'
import Footer from './components/Footer/Footer.jsx'
import Header from './components/Header/Header.jsx'
import WhatsappComp from './components/WhatsappComp/WhatsappComp.jsx'
import PagesRoutes from './PagesRoutes.jsx'
import { useEffect, useState } from 'react'
import initialProducts from './data/products.js'
import { obtenerUsuarioActual, obtenerRol } from './services/auth.js'

function AppLayout({
  catalogProducts,
  products,
  setProducts,
  visible_del_padre,
  setVisible_del_padre,
}) {
  const { mode } = useTheme()

  return (
    <div className="app-shell" data-theme={mode}>
      <Header
        userRole={visible_del_padre}
        setVisible_del_padre={setVisible_del_padre}
      />
      <PagesRoutes
        catalogProducts={catalogProducts}
        products={products}
        setProducts={setProducts}
        visible_del_padre={visible_del_padre}
        setVisible_del_padre={setVisible_del_padre}
      />
      <Footer />
      <WhatsappComp />
    </div>
  )
}

function App() {
  const [catalogProducts, setCatalogProducts] = useState(initialProducts)
  const [products, setProducts] = useState([])
  const [visible_del_padre, setVisible_del_padre] = useState('')

  // Al recargar, valida la sesión guardada consultando el backend protegido /me.
  useEffect(() => {
    if (!localStorage.getItem('token')) return

    obtenerUsuarioActual()
      .then((usuario) => setVisible_del_padre(obtenerRol(usuario)))
      .catch(() => setVisible_del_padre(''))
  }, [])

  useEffect(() => {
    fetch('/api/Productos')
      .then((response) => {
        if (!response.ok) throw new Error('Error al cargar productos')
        return response.json()
      })
      .then((data) => {
        if (!Array.isArray(data)) throw new Error('La respuesta de productos no es válida')
        setCatalogProducts(data.map((product) => ({
          id: product.id_producto,
          title: product.nombre_producto ?? product.titulo,
          description: product.descripcion ?? '',
          weight: product.peso,
          price: product.precio,
          image: product.imagen.startsWith('/')
            ? product.imagen
            : `/images/${product.imagen}`,
        })))
      })
      .catch((error) => console.error(error))
  }, [])

  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppLayout
          catalogProducts={catalogProducts}
          products={products}
          setProducts={setProducts}
          visible_del_padre={visible_del_padre}
          setVisible_del_padre={setVisible_del_padre}
        />
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
