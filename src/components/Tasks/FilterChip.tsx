type filterChipProps = {
    value: string;
    label: string;
    isSelected: boolean;
    onSelect: () => void;
}

export default function FilterChip({ value, label, isSelected, onSelect }: filterChipProps) {
    const baseStyles = "inline-flex min-h-[44px] items-center justify-center rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60";
    const stateStyles = isSelected
        ? "border-primary/30 bg-primary text-white shadow-sm"
        : "border-border bg-bg-input text-text-secondary hover:bg-bg-card";

    return (
        <button
            type="button"
            value={value}
            onClick={onSelect}
            className={`${baseStyles} ${stateStyles}`}>
            {label}
        </button>
    )
}