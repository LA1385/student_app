type filterChipProps = {
    value: string;
    label: string;
    isSelected: boolean;
    onSelect: () => void;
}

export default function FilterChip({ value, label, isSelected, onSelect }: filterChipProps) {
    return (
        <button
            type="button"
            value={value}
            onClick={onSelect}
            className= {isSelected ? "bg-primary text-white" : "bg-bg-input text-text"}>
                {label}
            </button>
    )
}