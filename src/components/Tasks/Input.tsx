'use client';

type InputProps = {
    inputTitle: string;
    value: string;
    type: 'text' | 'date' | 'time';
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    error?: string;
}

export default function Input({ inputTitle, placeholder, type, onChange, error, value }: InputProps) {
    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-text-secondary">{inputTitle}</label>

            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full min-h-[44px] rounded-3xl border px-4 py-3 text-text bg-bg-input placeholder:text-text-placeholder transition-colors duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20 ${error ? 'border-urgent' : 'border-border'}`}
            />

            {error ? <p className="text-sm font-medium text-urgent">{error}</p> : null}
        </div>
    );
}
