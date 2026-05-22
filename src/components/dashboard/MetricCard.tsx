export default function MetricCard({ label, value }: { label: string, value: number }) {
    return (
        <div>
            <p>{value}</p>
            <p>{label}</p>
        </div>
    )
}
