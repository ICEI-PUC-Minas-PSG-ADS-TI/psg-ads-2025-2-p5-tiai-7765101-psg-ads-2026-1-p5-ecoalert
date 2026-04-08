import { createRoot } from 'react-dom/client'
import './index.css'
import { ThemeContextProvider } from '@/contexts/ThemeContext'
import { RouterProvider } from 'react-router-dom'
import { router } from '@/routes/router'

createRoot(document.getElementById('root')).render(
  <ThemeContextProvider>
    <RouterProvider router={router} />
  </ThemeContextProvider>,
)
