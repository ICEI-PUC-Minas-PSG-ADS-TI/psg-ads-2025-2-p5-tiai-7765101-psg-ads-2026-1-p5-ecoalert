import { useState } from "react"
import "./style.css"

export default function Input({title}){

    const [name, setName] = useState("")

    return(
        <input 
            type="text"
            placeholder={title}
            value={name}
            onChange={(e) => setName(e.target.value)}
        />
    )
}