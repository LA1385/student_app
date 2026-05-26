"use client"

import { SquareArrowOutUpRight } from "lucide-react";

export default function ToolCard({ name, icon, href, description }: {
    name: string
    icon: React.ReactNode
    href: string
    description?: string
}) {
    return (
        <div className="relative bg-bg-card border border-border rounded-xl hover:border-border-strong hover:shadow-sm transition-all duration-150">
            <a 
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4"
            >
                <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center mb-3">
                    {icon}
                </div>
                <h3 className="text-sm font-semibold text-text mb-1">{name}</h3>
                {description && (
                    <p className="text-xs text-text-muted line-clamp-2">{description}</p>
                )}
                <SquareArrowOutUpRight className="absolute top-3 right-3 w-3.5 h-3.5 text-text-muted" />
            </a>
        </div>
    )
}

