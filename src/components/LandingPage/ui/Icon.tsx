import { Bell, BarChart2, Hammer, Calendar, AlertCircle, LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  'Bell': Bell,
  'chart': BarChart2,
  'Tools': Hammer,
  'Calender': Calendar, // Intentionally matching the typo in features data
};

type IconProps = {
  name: string;
  className?: string;
};

export default function Icon({ name, className }: IconProps) {
  const LucideComponent = iconMap[name] || AlertCircle;
  return <LucideComponent className={className} />;
}
