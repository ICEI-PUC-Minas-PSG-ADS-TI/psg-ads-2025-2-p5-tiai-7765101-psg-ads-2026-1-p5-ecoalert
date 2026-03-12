import Input from "../../components/Input/Input"
import Button from "../../components/Button/Button"
import { Link } from "react-router-dom"

function Login(){
    return(
        <div>
            <h1>Login</h1>

            <div className="form">
                <Input title="Usuário"/>
                <Input title="Senha"/>
                
                <Button text="Entrar"/>
            </div>
            <Link to="/cadastro">Não tem conta? Faça cadastro</Link>
        </div>
    )
}

export default Login
