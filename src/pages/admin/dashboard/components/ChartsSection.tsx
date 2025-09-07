import { AdvancedChart } from '@/components/admin/AdvancedChart';

interface ChartsSectionProps {
  analyticsData: {
    reviewsTimeline: any[];
    ratingsDistribution: any[];
    userRegistrations: any[];
  } | undefined;
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
}

export function ChartsSection({ analyticsData, timeRange, onTimeRangeChange }: ChartsSectionProps) {
  return (
    <>
      {/* Advanced Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <AdvancedChart
          title="Reviews Timeline"
          description="Review submissions over time"
          data={analyticsData?.reviewsTimeline || []}
          type="area"
          timeRange={timeRange}
          onTimeRangeChange={onTimeRangeChange}
        />
        
        <AdvancedChart
          title="Ratings Distribution"
          description="How patients rate their doctors"
          data={analyticsData?.ratingsDistribution || []}
          type="pie"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AdvancedChart
            title="User Registrations"
            description="New user sign-ups over time"
            data={analyticsData?.userRegistrations || []}
            type="bar"
          />
        </div>
      </div>
    </>
  );
}