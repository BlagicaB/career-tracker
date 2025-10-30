import { DashboardMetricCard } from '../DashboardMetricCard'
import { Briefcase } from 'lucide-react'

export default function DashboardMetricCardExample() {
  return (
    <DashboardMetricCard
      title="Total Applications"
      value={24}
      icon={Briefcase}
      trend="+3 this week"
    />
  )
}
