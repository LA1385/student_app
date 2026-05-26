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
                <main>
                    {children}
                </main>
                <BottomNav />
            </div>
        )
}

