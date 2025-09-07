import { AnalyticsCard } from '@/components/admin/AnalyticsCard';
import { Stethoscope, MessageSquare, Users, Clock } from 'lucide-react';

interface MetricsCardsProps {
  stats: {
    totalDoctors: number;
    totalReviews: number;
    totalUsers: number;
    pendingReviews: number;
    reviewsTrend?: {
      value: number;
      isPositive: boolean;
    };
  } | undefined;
}

export function MetricsCards({ stats }: MetricsCardsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <AnalyticsCard
        title="Total Doctors"
        value={stats?.totalDoctors || 0}
        description="Registered medical professionals"
        icon={Stethoscope}
        variant="primary"
      />
      <AnalyticsCard
        title="Total Reviews"
        value={stats?.totalReviews || 0}
        description="Patient feedback submissions"
        icon={MessageSquare}
        trend={stats?.reviewsTrend}
        variant="success"
      />
      <AnalyticsCard
        title="Active Users"
        value={stats?.totalUsers || 0}
        description="Registered platform users"
        icon={Users}
        variant="warning"
      />
      <AnalyticsCard
        title="Pending Reviews"
        value={stats?.pendingReviews || 0}
        description="Awaiting moderation"
        icon={Clock}
        variant="danger"
      />
    </div>
  );
}