import { useState } from "react";

export function useCadastro() {
    const [form, setForm] = useState({ 
        name: "",
        lastName: "",
        email: "",
        cpf: "",
        phone: "",
        cep: "",
        street: "",
        neighborhood: "",
        city: "",
        state: "",
        number: "",
        password: ""
    })
    
    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    return {form, handleChange}
}