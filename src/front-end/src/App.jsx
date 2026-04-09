import './App.css'
import { Outlet } from 'react-router-dom'
import { AuthContextProvider } from '@/contexts/AuthContext'

function App() {
  return (
    <AuthContextProvider>
      <main>
        <Outlet />
      </main>
    </AuthContextProvider>
  )
}

export default App
