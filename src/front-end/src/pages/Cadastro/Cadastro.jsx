import Input from "../../components/Input/Input"
import Button from "../../components/Button/Button"

export default function Cadastro(){
    return(
        <div>
            <h1>Cadastro</h1>

            <div className="form">
            <Input title="Nome" type="text"/>
                <Input title="Sobrenome" type="text"/>
                <Input title="Email" type="email"/>
                <Input title="CPF" type="text"/>
                <Input title="Telefone"/>
                <label htmlFor="">Endereço</label>
                <Input title="CEP"/>
                <Input title="Rua"/>
                <Input title="Bairro"/>
                <Input title="Cidade"/>
                <Input title="Estado"/>
                <Input title="Número" type="number"/>
                <Input title="Senha" type="text"/>
                
                <Button text="Registrar"/>
            </div>
        </div>
    )
}


