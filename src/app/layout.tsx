import type { Metadata } from "next";
import Navbar from "@/components/LandingPage/layout/Navbar";
import Footer from "@/components/LandingPage/layout/Footer";
import ThemeProviderComponent from "@/components/LandingPage/layout/ThemeProvider";
import "./globals.css";

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
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <ThemeProviderComponent attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </ThemeProviderComponent>
      </body>
    </html>
  );
}