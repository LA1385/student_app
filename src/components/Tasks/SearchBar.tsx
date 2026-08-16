type searchBarProps = {
    type: string;
    searchValue: string;
    placeholder?: string;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchBar({ type, searchValue, placeholder, onSearchChange }: searchBarProps) {
    return (
        <div>
            <input
                type={type}
                value={searchValue}
                onChange={onSearchChange}
                placeholder={placeholder}
                className=""
            />
        </div>
    )
}
