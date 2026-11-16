import { Check } from "lucide-react";

type EmptyStateCardProps = {
    title: string;
    description: string;
}

export default function EmptyStateCard({title, description}: EmptyStateCardProps){
    return(
    <div className="rounded-2xl border border-border bg-bg-card px-6 py-10 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-border bg-bg-input text-text-muted">
            <Check className="h-5 w-5" />
        </div>
        <p className="mt-4 text-lg font-semibold text-text">{title}</p>
        <p className="mt-1 text-sm leading-6 text-text-secondary">{description}</p>
    </div>
    )
}