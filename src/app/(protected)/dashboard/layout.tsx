import NavBar from "@/components/dashboard/NavBar";
import BottomNav from "@/components/dashboard/BottomNav";
import SideBar from "@/components/dashboard/SideBar";

export default function ProtectedLayout({
    children}: {
    children: React.ReactNode}) {
        return (
            <div>
                <aside>
                    <SideBar />
                </aside>
                <div className="flex flex-col">
                    <NavBar />
                    <main className="p-4">
                        {children}
                    </main>
                </div>
                <nav>
                    <BottomNav />
                </nav>
            </div>
        )
}
