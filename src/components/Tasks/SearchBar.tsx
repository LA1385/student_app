import { Search } from "lucide-react";

type searchBarProps = {
    type: string;
    searchValue: string;
    placeholder?: string;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchBar({ type, searchValue, placeholder, onSearchChange }: searchBarProps) {
    return (
        <div className="relative w-full">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
                type={type}
                value={searchValue}
                onChange={onSearchChange}
                placeholder={placeholder}
                className="w-full min-h-[44px] rounded-3xl border border-border bg-bg-input py-3 pl-11 pr-4 text-sm text-text placeholder:text-text-placeholder transition-colors duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
        </div>
    )
}
