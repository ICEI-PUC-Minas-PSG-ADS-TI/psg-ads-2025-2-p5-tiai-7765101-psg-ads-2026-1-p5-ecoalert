import Input from "@/components/Input/Input"
import Button from "@/components/Button/Button"
import { Link, useNavigate } from "react-router-dom"

import { login } from "@/services/userService"
import { useLogin } from "@/hooks/useLogin"
import { persistAuthSession } from "@/utils/auth"

function Login(){
    const {form, handleChange} = useLogin();
    const navigate = useNavigate();

    async function handleSubmit(){
        const user = {
            email: form.email,
            password: form.password
        }

        try {
            const response = await login(user);
            console.log(response);
            persistAuthSession(response);
            alert("Usuário logado")
            navigate("/home");
        }catch (error){
            console.log(error)
        }
    }

    return(
        <div>
            <h1>Login</h1>

            <div className="form">
                <Input title="Usuário" onChange={handleChange} name={'email'}/>
                <Input title="Senha" onChange={handleChange} name={'password'}/>
                
                <Button text="Entrar" onClick={handleSubmit}/>
            </div>
            <Link to="/cadastro">Não tem conta? Faça cadastro</Link>
        </div>
    )
}

export default Login
