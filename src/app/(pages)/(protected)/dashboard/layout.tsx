import NavBar from "@/components/dashboard/NavBar";
import BottomNav from "@/components/dashboard/BottomNav";
import SideBar from "@/components/dashboard/SideBar";

export default function ProtectedLayout({
    children}: {
    children: React.ReactNode}) {
        return (
            <div className="min-h-screen bg-bg-page text-text">
                <NavBar />
                <SideBar />
                <main className="min-h-screen px-4 pb-20 pt-14 md:pl-64 md:pr-12 md:pb-8">
                    {children}
                </main>
                <BottomNav />
            </div>
        )
}

