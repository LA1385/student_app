"use client"

import { ThemeProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes";

export default function ThemeProviderComponent({ children, ...props }: ThemeProviderProps) {
    return <ThemeProvider {...props}>{children}</ThemeProvider>;
}
