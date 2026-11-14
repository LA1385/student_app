type Props = {
    label: string
    value?: number | string
    icon?: React.ReactNode
    variant?: 'default' | 'highlighted'
    error?: string
}

export default function MetricCard({ label, value, icon, variant = 'default', error }: Props) {
    const isHighlighted = variant === 'highlighted';
    const hasError = Boolean(error);

    return (
        <div className={`relative rounded-2xl border p-4 flex flex-col md:flex-col-reverse gap-1 shadow-sm transition-shadow duration-150 ${
            hasError
                ? "border-urgent/50 bg-urgent/10"
                : isHighlighted
                    ? "border-border bg-primary md:bg-bg-card"
                    : "border-border bg-bg-card"
        }`}>
            <p className={
                hasError
                    ? "text-2xl font-bold text-urgent tracking-tight"
                    : isHighlighted 
                    ? "text-2xl md:text-3xl font-bold text-white md:text-primary tracking-tight" 
                    : "text-2xl md:text-3xl font-bold text-primary tracking-tight"
            }>
                {error ? "—" : value}
            </p>
            <p className={
                hasError
                    ? "text-xs font-semibold text-urgent uppercase"
                    : isHighlighted 
                    ? "text-xs font-semibold text-white/70 md:text-text-muted uppercase" 
                    : "text-xs font-semibold text-text-muted uppercase "
            }>
                {label}
            </p>
            {error && (
                <p role="status" className="text-[10px] font-medium text-urgent">
                    Unavailable
                </p>
            )}
            {icon && (
                <div className={
                    hasError
                        ? "absolute top-3 right-1 md:right-3 w-7 h-7 rounded-lg bg-urgent/20 text-urgent flex items-center justify-center transition-colors"
                        : isHighlighted
                        ? "absolute top-3 right-1 md:right-3 w-7 h-7 rounded-lg bg-white/20 text-white md:bg-primary-light md:text-primary flex items-center justify-center transition-colors"
                        : "absolute top-3 right-1 md:right-3 w-7 h-7 rounded-lg bg-primary-light text-primary flex items-center justify-center transition-colors"
                }>
                    {icon}
                </div>
            )}
        </div>
    )
}

