import Input from "../../components/Input/Input"
import Button from "../../components/Button/Button"
import { Link } from "react-router-dom"

import {createUser} from "../../services/userService"
import { useCadastro } from "../../hooks/useCadastro"

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
            console.log(error)
        }
        
    }

    return(
        <div>
            <h1>Cadastro</h1>

            <div className="form">
                <Input title="Nome" type="text" name="name" onChange={handleChange}/>
                <Input title="Sobrenome" type="text" name="lastName" onChange={handleChange}/>
                <Input title="Email" type="email" name="email" onChange={handleChange}/>
                <Input title="CPF" type="text" name="cpf" onChange={handleChange}/>
                <Input title="Telefone" name="phone" onChange={handleChange}/>

                <label htmlFor="">Endereço</label>
                <Input title="CEP" name="cep" onChange={handleChange}/>
                <Input title="Rua" name="street" onChange={handleChange}/>
                <Input title="Bairro" name="neighborhood" onChange={handleChange}/>
                <Input title="Cidade" name="city" onChange={handleChange}/>
                <Input title="Estado" name="state" onChange={handleChange}/>
                <Input title="Número" type="number" name="number" onChange={handleChange}/>
                <Input title="Senha" type="password" name="password" onChange={handleChange}/>
                
                <Button text="Registrar" onClick={handleSubmit}/>
            </div>
            <Link to="/login">Já tem conta? Faça login</Link>
        </div>
    )
}


