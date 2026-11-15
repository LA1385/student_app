import Card from "@/components/landing/Card";
import SignInBtn from "@/components/shared/SignInBtn";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";


export default async function Home() {
    const session = await auth();
    if (session) {
        redirect("/dashboard");
    }

    const FeaturesData = [
        {
            icon: 'Bell',
            title: 'Smart Reminders',
            description: 'Set reminders for assignments, tests and exams. Get notified by email and in-app — automatically, ahead of time.'
        },
        {
            icon: 'chart',
            title: 'Stay on top of Notifications',
            description: 'Get timely notifications about overdue tasks and upcoming deadlines at a glance on your personal dashboard.'
        },
        {
            icon: 'Tools',
            title: 'Student Tool Hub',
            description: 'Access 11 built-in tools — GPA calculator, PDF tools, citation generator, timetable maker and more. All in one place.'
        },
        {
            icon: 'Calender',
            title: 'Never Feel Behind',
            description: 'Colour-coded priorities show you exactly what needs attention — red means urgent, green means you are good.'
        },
    ]

    return (
        <div className="bg-bg-page min-h-screen relative overflow-hidden transition-colors duration-300">
            {/* Subtle Top Gradient Glow */}
            <div className="absolute top-0 inset-x-0 h-[500px] w-full bg-gradient-to-b from-primary/5 to-transparent pointer-events-none blur-3xl -z-10 dark:from-primary/10"></div>
            
            <div className="max-w-7xl mx-auto px-6 pt-16 pb-24 relative">
                {/* Hero Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center pt-8 pb-20">
                    <div className="lg:col-span-5 flex flex-col items-start gap-8 z-10">
                        <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-extrabold text-text tracking-tight leading-[1.05]">
                            Never Miss A <br className="hidden md:block" />
                            <span className="text-primary tracking-tight">Deadline Again.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-text-secondary leading-relaxed font-medium">
                            Your smart academic companion — track assignments, exams, tasks and events, get reminded automatically, and access every tool you need. Built for students, by a student.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mt-2">
                           <SignInBtn text="Sign in with Google"/>
                        </div>
                    </div>

                    {/* App Screenshot */}
                    <div className="lg:col-span-7 w-full ml-0 lg:ml-8 mt-8 lg:mt-0">
                        <Image
                            src="/lightmode.png"
                            alt="Scholarly task dashboard in light mode"
                            width={268}
                            height={611}
                            sizes="(max-width: 1023px) 100vw, 58vw"
                            loading="lazy"
                            className="h-auto w-full max-w-full object-contain dark:hidden"
                        />
                        <Image
                            src="/darkmode.png"
                            alt="Scholarly task dashboard in dark mode"
                            width={1366}
                            height={768}
                            sizes="(max-width: 1023px) 100vw, 58vw"
                            loading="lazy"
                            className="hidden h-auto w-full max-w-full object-contain dark:block"
                        />
                    </div>
                </div>
            </div>

            {/* Features Background Container */}
            <div className="bg-bg-sidebar py-32 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Section Header */}
                    <div className="flex justify-center mb-8">
                        <div className="text-text text-2xl md:text-3xl font-bold hover:text-primary transition-colors px-6 py-3.5 text-center flex items-center gap-2 group">
                            Explore Features
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
                        {FeaturesData.map((feature, index) => (
                            <Card key={index} icon={feature.icon} title={feature.title} description={feature.description} />
                        ))}
                    </div>
                </div>
            </div>

        </div>
    )
}
