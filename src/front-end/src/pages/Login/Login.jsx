import { Link, useNavigate } from "react-router-dom"

import { login } from "@/services/userService"
import { useLogin } from "@/hooks/useLogin"
import { persistAuthSession } from "@/utils/auth"
import { Button } from "@/components/Button/Button";
import { Input } from "@/components/Input/Input";

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
                <Input label="Usuário" onChange={handleChange} name={'email'}/>
                <Input label="Senha" onChange={handleChange} name={'password'}/>
                
                <Button onClick={handleSubmit} shape="square">Entrar</Button>
            </div>
            <Link to="/cadastro">Não tem conta? Faça cadastro</Link>
        </div>
    )
}

export default Login
