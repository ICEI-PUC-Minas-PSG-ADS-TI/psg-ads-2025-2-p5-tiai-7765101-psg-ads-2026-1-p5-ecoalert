import { Link } from "react-router-dom"

import { createUser } from "@/services/userService"
import { useCadastro } from "@/hooks/useCadastro"
import { Button } from "@/components/Button/Button";
import { Input } from "@/components/Input/Input";
import { RegisterForm } from "@/components/RegisterForm/RegisterForm";

export default function Cadastro(){

    const {form, handleChange} = useCadastro();

    async function handleSubmit(){
        const user = {
            name: form.name,
            lastName: form.lastName,
            email: form.email,
            cpf: form.cpf,
            phone:{
                ddd: form.phone.substring(0,2),
                number: form.phone.substring(2)
            },
            password: form.password,
            address:{
                cep: form.cep,
                street: form.street,
                neighborhood: form.neighborhood,
                city: form.city,
                state: form.state,
                number: form.number
            }
        };

        try {
            await createUser(user);
            alert("Usuário cadastrado")
        }
        catch (error){
            alert("Erro ao cadastrar usuário")
        }
        
    }

    return(
        <div>
           <RegisterForm />
        </div>
    )
}

