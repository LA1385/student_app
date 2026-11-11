import Link from "next/link";
import ToolCard from "@/components/dashboard/ToolCard";
import { DASHBOARD_TOOLS_LIMIT, TOOLS } from "@/lib/tools";

export default function DashboardToolList() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-text">Student Tools</h2>
        <Link
          href="/dashboard/tools"
          className="text-sm text-primary font-medium hover:underline"
        >
          View All
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {TOOLS.slice(0, DASHBOARD_TOOLS_LIMIT).map((tool) => (
          <ToolCard
            key={tool.id}
            icon={tool.icon}
            name={tool.name}
            href={tool.href}
          />
        ))}
      </div>
    </div>
  );
}
