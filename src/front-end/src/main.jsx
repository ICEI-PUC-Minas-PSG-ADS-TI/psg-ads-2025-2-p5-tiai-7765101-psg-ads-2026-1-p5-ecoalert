import { createRoot } from 'react-dom/client'
import './index.css'
import { ThemeContextProvider } from '@/contexts/ThemeContext'
import { RouterProvider } from 'react-router-dom'
import { router } from '@/routes/router'
import { FlashMessageProvider } from './contexts/FlashMessageContext'

createRoot(document.getElementById('root')).render(
  <ThemeContextProvider>
    <FlashMessageProvider>
      <RouterProvider router={router} />
    </FlashMessageProvider>
  </ThemeContextProvider>,
)
