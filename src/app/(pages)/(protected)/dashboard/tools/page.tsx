import ToolCard from "@/components/dashboard/ToolCard";
import { TOOLS } from "@/lib/tools";

export default function ToolsPage() {
    return (
        <div className="p-4 md:p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-text">Student Tools</h1>
                <p className="mt-1 text-sm text-text-muted">
                    Helpful tools for your academic workflow.
                </p>
            </div>

            <div className="grid grid-cols-2 items-stretch gap-3 md:grid-cols-3">
                {TOOLS.map((tool) => (
                    <ToolCard
                        key={tool.id}
                        icon={tool.icon}
                        name={tool.name}
                        description={tool.description}
                        href={tool.href}
                    />
                ))}
                <div className="flex min-h-[148px] items-center justify-center rounded-xl border-2 border-dashed border-border-strong bg-bg-card p-4 text-center text-sm text-text-muted">
                    More tools coming soon
                </div>
            </div>
        </div>
    );
}
