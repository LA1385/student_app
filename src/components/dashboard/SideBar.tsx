import Icon from "@/components/shared/Icon";

export default function SideBar() {
    const Navigations = [
        {name:'Dashboard', icon: 'Home', link: "/dashboard"},
        { name: 'Task', icon: 'Task', link: "/dashboard/task" },
        { name: 'Progress', icon: 'Progress', link: "/dashboard/progress"},
        {name: 'Tools', icon: 'Tools', link: "/dashboard/tools"},
    ]
    return (
        <div>
            {Navigations.map((feature, index) => (
                <div key={index} >
                    <Icon name={feature.icon} />
                    <span>{feature.name}</span>
                </div>
            ))}    
        </div>
    )
}
