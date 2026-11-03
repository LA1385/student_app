import { ArrowLeftRight, Calculator, FileOutput, Files, Grid2X2, Images, ListTree, MessageSquarePlus, PackageOpen, Scissors } from "lucide-react";
import { createElement, type ReactNode } from "react";

export type Tool = {
    id: string;
    icon: ReactNode;
    name: string;
    description?: string;
    href: string;
};

export const TOOLS: Tool[] = [
    { id: "cgpa-calculator", icon: createElement(Calculator, { className: " text-primary" }), name: "CGPA Calculator", href: "https://studentoolss.com/gpa" },
    { id: "unit-converter", icon: createElement(ArrowLeftRight, { className: " text-primary" }), name: "Unit Converter", href: "https://studentoolss.com/unit-converter" },
    { id: "merge-files", icon: createElement(Files, { className: " text-primary" }), name: "Merge PDF Files", href: "https://www.ilovepdf.com/merge_pdf" },
    { id: "file-compression", icon: createElement(PackageOpen, { className: " text-primary" }), name: "Compress PDF", href: "https://www.ilovepdf.com/compress_pdf" },
    { id: "split-pdf", icon: createElement(Scissors, { className: " text-primary" }), name: "Split PDF", href: "https://studentoolss.com/pdf-split" },
    { id: "images-to-pdf", icon: createElement(Images, { className: " text-primary" }), name: "Scanned Images to PDF", href: "https://studentoolss.com/images-to-pdf" },
    { id: "request-tools", icon: createElement(MessageSquarePlus, { className: " text-primary" }), name: "Request a tool", href: "https://studentoolss.com/feedback" },
    { id: "pdf-to-word", icon: createElement(FileOutput, { className: " text-primary" }), name: "Convert PDF to Word", href: "https://www.ilovepdf.com/pdf_to_word" },
    { id: "organize-pdf", icon: createElement(ListTree, { className: " text-primary" }), name: "Organize PDF", href: "https://studentoolss.com/organize-pdf" },
    { id: "other-tools", icon: createElement(Grid2X2, { className: " text-primary" }), name: "Other Tools", href: "https://www.ilovepdf.com/" },

];

export const DASHBOARD_TOOLS_LIMIT = 4;
