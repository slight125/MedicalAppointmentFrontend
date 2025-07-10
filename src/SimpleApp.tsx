import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useAppDispatch } from './store'
import { setDarkMode } from './store/slices/themeSlice'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import SimpleHome from './pages/public/SimpleHome'
import About from './pages/public/About'
import Services from './pages/public/Services'
import Contact from './pages/public/Contact'

function SimpleApp() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    // Initialize theme from localStorage
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('darkMode') === 'true'
      dispatch(setDarkMode(savedTheme))
      
      // Apply theme to document
      if (savedTheme) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }, [dispatch])

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<SimpleHome />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#22c55e',
            },
          },
          error: {
            style: {
              background: '#ef4444',
            },
          },
        }}
      />
    </>
  )
}

export default SimpleApp
