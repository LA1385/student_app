import Link from "next/link";
import ThemeToggle from "../ui/ThemeToggle";
import Logo from "@/assets/logo.png";


export default function Navbar() {
    return (
        <nav className="bg-[--bg-page]/80 backdrop-blur-xl w-full z-50 sticky top-0 border-b border-black/5 dark:border-white/[0.03] transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 py-5 flex flex-row justify-between items-center">
                {/* App logo & name */}
                <Link href="/" className="flex flex-row items-center gap-x-2.5 group">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold group-hover:bg-primary-hover transition-colors shadow-sm shadow-primary/20">
                        {/* Placeholder for real logo img */}
                        <img src={Logo.src} alt="Logo" className="w-full h-full object-contain" />  
                    </div>
                    <div className="text-[1.35rem] font-extrabold tracking-tight text-[--text]">   
                        Student App
                    </div>
                </Link>

                {/* Features & Sign in */}
                <div className="flex items-center gap-x-6">
                    {/* The design has Features and Testimonials but user text didn't explicitly request to add them here, keeping standard SignIn button for now, but padded beautifully. */}
                    <button className="bg-primary hover:bg-primary-hover text-white rounded-xl px-6 py-2.5 font-semibold transition-all shadow-sm shadow-primary/25 hover:shadow-primary/40 text-sm">
                        Sign In
                    </button>

                    <div className="h-6 w-px bg-[--border] mx-1 hidden sm:block"></div>

                    <ThemeToggle />
                </div>
            </div>
        </nav>
    )
}