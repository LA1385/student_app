import { Calculator, FileArchive, FilePlus2, RefreshCw } from "lucide-react";
import { createElement, type ReactNode } from "react";

export type Tool = {
    id: string;
    icon: ReactNode;
    name: string;
    href: string;
};

export const TOOLS: Tool[] = [
    { id: "cgpa-calculator", icon: createElement(Calculator, { className: " text-primary" }), name: "CGPA Calculator", href: "/tools/calculator" },
    { id: "converter", icon: createElement(RefreshCw, { className: " text-primary" }), name: "Converter", href: "/tools/converter" },
    { id: "merge-files", icon: createElement(FilePlus2, { className: " text-primary" }), name: "Merge Files", href: "/tools/file-compression" },
    { id: "file-compression", icon: createElement(FileArchive, { className: " text-primary" }), name: "File Compression", href: "/tools/zip" },
];

export const DASHBOARD_TOOLS_LIMIT = 4;
