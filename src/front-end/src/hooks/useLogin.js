import { useState } from "react";

export function useLogin() {
    const [form, setForm] = useState({ 
        email: "",
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