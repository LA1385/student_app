import Icon from "@/components/shared/Icon";

export default function BottomNav() {
    const Navigations = [
        {icon: 'Home', link: "/dashboard"},
        { icon: 'Task', link: "/dashboard/task" },
        {icon: 'Progress', link: "/dashboard/progress"},
        {icon: 'Tools', link: "/dashboard/tools"},
    ]
    return (
        <div>
            {Navigations.map((feature, index) => (
                <div key={index}>
                    <Icon name={feature.icon} />
                </div>
            ))}    
        </div>
    )
}
