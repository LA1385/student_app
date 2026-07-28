'use client'

type ButtonProps = {
    value : string;
    label : string;
    isSelected: boolean;
    onSelect: () => void;
}


export default function Button({value, label, isSelected, onSelect}: ButtonProps){
    return(
        <button 
        // Can change the conditional styling when agent is orking
        onClick ={onSelect}
        className={isSelected? 'bg-red': 'bg-white'}
        value = {value}>
            {label}
        </button>
    )
    

}