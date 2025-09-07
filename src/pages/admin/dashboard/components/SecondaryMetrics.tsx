import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Activity, TrendingUp } from 'lucide-react';

interface SecondaryMetricsProps {
  stats: {
    averageRating: string;
    activityRate: string;
    approvalRate: string;
  } | undefined;
}

export function SecondaryMetrics({ stats }: SecondaryMetricsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="transition-all duration-300 hover:shadow-card-hover">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          <Star className="h-5 w-5 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">
            {stats?.averageRating || '0.0'} ★
          </div>
          <p className="text-xs text-muted-foreground">
            Across all doctors
          </p>
        </CardContent>
      </Card>

      <Card className="transition-all duration-300 hover:shadow-card-hover">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Activity Rate</CardTitle>
          <Activity className="h-5 w-5 text-medical-blue" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-medical-blue">
            {stats?.activityRate || '0.0'}
          </div>
          <p className="text-xs text-muted-foreground">
            Reviews per user
          </p>
        </CardContent>
      </Card>

      <Card className="transition-all duration-300 hover:shadow-card-hover">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
          <TrendingUp className="h-5 w-5 text-medical-green" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-medical-green">
            {stats?.approvalRate || '0'}%
          </div>
          <p className="text-xs text-muted-foreground">
            Reviews approved
          </p>
        </CardContent>
      </Card>
    </div>
  );
}