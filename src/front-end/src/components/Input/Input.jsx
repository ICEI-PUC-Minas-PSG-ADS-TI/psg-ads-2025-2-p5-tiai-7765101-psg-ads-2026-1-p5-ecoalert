import "./style.css"

export default function Input({title, type="text",name, onChange}){
    return(
        <input 
            type={type}
            name={name}
            onChange={onChange}
            placeholder={title}
        />
    )
}