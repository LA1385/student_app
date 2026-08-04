'use client'

type ButtonProps = {
    value: string;
    label: string;
    isSelected: boolean;
    onSelect: () => void;
}

const selectedChipClasses = {
    default: 'bg-primary text-white border border-primary/30 shadow-sm',
    Low: 'bg-later/15 text-later border border-later',
    Medium: 'bg-upcoming/15 text-upcoming border border-upcoming',
    High: 'bg-urgent/15 text-urgent border border-urgent',
};

export default function Button({ value, label, isSelected, onSelect }: ButtonProps) {
    const baseStyles = 'inline-flex items-center justify-center min-h-[44px] rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60';
    const stateStyles = isSelected
        ? selectedChipClasses[value as keyof typeof selectedChipClasses] ?? selectedChipClasses.default
        : 'bg-bg-input text-text-secondary border border-border hover:bg-bg-card';

    return (
        <button
            type="button"
            onClick={onSelect}
            className={`${baseStyles} ${stateStyles}`}
            value={value}
        >
            {label}
        </button>
    );
}
