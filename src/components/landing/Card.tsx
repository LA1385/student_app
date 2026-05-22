import Icon from "@/components/shared/Icon";

type cardProps = {
    icon: string;
    title: string;
    description: string;
}

export default function Card({ icon, title, description }: cardProps) {
    return (
        <div className="bg-[--bg-card] border border-transparent dark:border-white/5 p-10 rounded-[1.5rem] flex flex-col gap-6 text-left shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1.5 transition-all duration-500">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center mb-1">
                <Icon name={icon} className="text-primary w-6 h-6 stroke-[2px]" />
            </div>
            <div className="flex flex-col gap-2.5">
                <h3 className="text-xl font-bold text-[--text] tracking-tight">{title}</h3>
                <p className="text-[--text-secondary] text-base leading-relaxed font-medium">{description}</p>
            </div>
        </div>
    )
}
