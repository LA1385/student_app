'use client';

type InputProps = {
    inputTitle:string
    value:string;
    type: 'text'| 'date' | 'time';
    onChange: (e:  React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    error?: string;
}

export default function Input({ inputTitle, placeholder, type, onChange, error, value }: InputProps) {

  return (
    <div>
        <label htmlFor="">{inputTitle}</label>

        <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        />

        {error? <p>This input field cannot be empty</p> : ""}
    </div>
  );
}