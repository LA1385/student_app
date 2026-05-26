import type { Metadata } from "next";
import ThemeProviderComponent from "@/components/providers/ThemeProvider";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import AuthProvider from "@/components/providers/AuthProvider";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Student App",
  description: "A web application for students to manage their deadlines and access useful tools",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <ThemeProviderComponent attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProviderComponent>
        </AuthProvider>
      </body>
    </html>
  );
}