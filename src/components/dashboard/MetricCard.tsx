type Props = {
    label: string
    value: number | string
    icon?: React.ReactNode
    variant?: 'default' | 'highlighted'
}

export default function MetricCard({ label, value, icon, variant = 'default' }: Props) {
    const isHighlighted = variant === 'highlighted';

    return (
        <div className={
            isHighlighted 
                ? "relative bg-primary md:bg-bg-card md:border md:border-border rounded-2xl p-4 flex flex-col md:flex-col-reverse gap-1 shadow-sm hover:shadow-md transition-shadow duration-150"
                : "relative bg-bg-card border border-border rounded-2xl p-4 flex flex-col md:flex-col-reverse gap-1 shadow-sm hover:shadow-md transition-shadow duration-150"
        }>
            <p className={
                isHighlighted 
                    ? "text-2xl md:text-3xl font-bold text-white md:text-primary tracking-tight" 
                    : "text-2xl md:text-3xl font-bold text-primary tracking-tight"
            }>
                {value}
            </p>
            <p className={
                isHighlighted 
                    ? "text-xs font-semibold text-white/70 md:text-text-muted uppercase" 
                    : "text-xs font-semibold text-text-muted uppercase "
            }>
                {label}
            </p>
            {icon && (
                <div className={
                    isHighlighted
                        ? "absolute top-3 right-1 md:right-3 w-7 h-7 rounded-lg bg-white/20 text-white md:bg-primary-light md:text-primary flex items-center justify-center transition-colors"
                        : "absolute top-3 right-1 md:right-3 w-7 h-7 rounded-lg bg-primary-light text-primary flex items-center justify-center transition-colors"
                }>
                    {icon}
                </div>
            )}
        </div>
    )
}

