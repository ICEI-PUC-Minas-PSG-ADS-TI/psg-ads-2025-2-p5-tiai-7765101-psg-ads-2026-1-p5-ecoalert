import { createBrowserRouter, Navigate } from 'react-router-dom'

import App from '@/App'
import PrivateLayout from '@/layouts/PrivateLayout'
import PublicLayout from '@/layouts/PublicLayout'
import Cadastro from '@/pages/Cadastro/Cadastro'
import Home from '@/pages/Home/Home'
import Login from '@/pages/Login/Login'

function NotFound() {
  return <h1>Pagina nao encontrada</h1>
}

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate replace to="/login" />,
      },
      {
        element: <PublicLayout />,
        children: [
          {
            path: '/login',
            element: <Login />,
          },
          {
            path: '/cadastro',
            element: <Cadastro />,
          },
        ],
      },
      {
        element: <PrivateLayout />,
        children: [
          {
            path: '/home',
            element: <Home />,
          },
        ],
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
])
