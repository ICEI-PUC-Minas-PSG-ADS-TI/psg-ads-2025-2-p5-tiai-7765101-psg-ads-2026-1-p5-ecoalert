import './App.css'
import { Routes, Route } from 'react-router-dom'

import Login from './pages/Login/Login'
import Cadastro from './pages/Cadastro/Cadastro'
//import Home from './pages/Home/Home'

function App() {

  return (
    <>
    <Routes>
      <Route path="/login" element={<Login/>}/>
      <Route path="/cadastro" element={<Cadastro/>}/>
    </Routes>
    </>
  )
}

export default App
