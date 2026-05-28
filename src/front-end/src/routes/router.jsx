import { createBrowserRouter } from 'react-router-dom'

import App from '@/App'
import PrivateLayout from '@/layouts/PrivateLayout'
import PublicLayout from '@/layouts/PublicLayout'
import Cadastro from '@/pages/Cadastro/Cadastro'
import Home from '@/pages/Home/Home'
import Landing from '@/pages/Landing/Landing'
import Login from '@/pages/Login/Login'
import Sensores from '@/pages/Sensores/Sensores'

function NotFound() {
  return <h1>Pagina nao encontrada</h1>
}

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          {
            index: true,
            element: <Landing />,
          },
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
          {
            path: '/sensores',
            element: <Sensores />,
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
