import { BrowserRouter } from 'react-router-dom'
import './assets/css/App.css'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { useTheme } from './context/useTheme.js'
import Footer from './components/Footer/Footer.jsx'
import Header from './components/Header/Header.jsx'
import WhatsappComp from './components/WhatsappComp/WhatsappComp.jsx'
import PagesRoutes from './PagesRoutes.jsx'
import { useEffect, useState } from 'react'
import { obtenerUsuarioActual, obtenerRol } from './services/auth.js'
import { resolveProductImage } from './utils/productImage.js'

function AppLayout({
  catalogProducts,
  products,
  setProducts,
  visible_del_padre,
  setVisible_del_padre,
  isSessionLoading,
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
        isSessionLoading={isSessionLoading}
      />
      <Footer />
      {!isSessionLoading &&
        (!visible_del_padre || visible_del_padre === 'Cliente') && <WhatsappComp />}
    </div>
  )
}

function App() {
  const [catalogProducts, setCatalogProducts] = useState([])
  const [products, setProducts] = useState([])
  const [visible_del_padre, setVisible_del_padre] = useState('')
  const [isSessionLoading, setIsSessionLoading] = useState(
    () => Boolean(localStorage.getItem('token')),
  )

  // Al recargar, valida la sesión guardada consultando el backend protegido /me.
  useEffect(() => {
    if (!localStorage.getItem('token')) return

    obtenerUsuarioActual()
      .then((usuario) => setVisible_del_padre(obtenerRol(usuario)))
      .catch(() => setVisible_del_padre(''))
      .finally(() => setIsSessionLoading(false))
  }, [])

  useEffect(() => {
    if (isSessionLoading || !visible_del_padre) return undefined

    const token = localStorage.getItem('token')?.trim()
    if (!token) return undefined

    const controller = new AbortController()

    fetch('/api/Productos', {
      signal: controller.signal,
      headers: { Authorization: `Bearer ${token}` },
    })
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
          stock: Number(product.stock) || 0,
          image: resolveProductImage(product.imagen),
        })))
      })
      .catch((error) => {
        if (error.name !== 'AbortError') console.error(error)
      })

    return () => controller.abort()
  }, [isSessionLoading, visible_del_padre])

  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppLayout
          catalogProducts={catalogProducts}
          products={products}
          setProducts={setProducts}
          visible_del_padre={visible_del_padre}
          setVisible_del_padre={setVisible_del_padre}
          isSessionLoading={isSessionLoading}
        />
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
