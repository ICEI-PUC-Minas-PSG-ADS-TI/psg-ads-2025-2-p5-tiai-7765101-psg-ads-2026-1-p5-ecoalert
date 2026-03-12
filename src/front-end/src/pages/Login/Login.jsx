import Input from "../../components/Input/Input"
import Button from "../../components/Button/Button"

function Login(){
    return(
        <div>
            <h1>Login</h1>

            <div className="form">
                <Input title="Usuário"/>
                <Input title="Senha"/>
                
                <Button text="Entrar"/>
            </div>
        </div>
    )
}

export default Login
