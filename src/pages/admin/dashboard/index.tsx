import { useState } from 'react';
import { DashboardHeader } from './components/DashboardHeader';
import { MetricsCards } from './components/MetricsCards';
import { SecondaryMetrics } from './components/SecondaryMetrics';
import { ChartsSection } from './components/ChartsSection';
import { TopDoctorsCard } from './components/TopDoctorsCard';
import { QuickActions } from './components/QuickActions';
import { useDashboardStats } from './hooks/useDashboardStats';
import { useAnalyticsData } from './hooks/useAnalyticsData';

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [refreshKey, setRefreshKey] = useState(0);

  const { data: stats, isLoading: statsLoading } = useDashboardStats(refreshKey);
  const { data: analyticsData } = useAnalyticsData(timeRange);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleExport = () => {
    if (!stats || !analyticsData) return;
    
    // Create CSV content
    const csvData = [
      ['Metric', 'Value', 'Description'],
      ['Total Doctors', stats.totalDoctors, 'Registered medical professionals'],
      ['Total Reviews', stats.totalReviews, 'Patient feedback submissions'],
      ['Total Users', stats.totalUsers, 'Registered platform users'],
      ['Pending Reviews', stats.pendingReviews, 'Awaiting moderation'],
      ['Average Rating', stats.averageRating, 'Across all doctors'],
      ['Activity Rate', stats.activityRate, 'Reviews per user'],
      ['Approval Rate', `${stats.approvalRate}%`, 'Reviews approved'],
      [],
      ['Date', 'Total Reviews', 'Pending Reviews', 'Approved Reviews'],
      ...analyticsData.reviewsTimeline.map(item => [
        item.name,
        item.value,
        item.pending,
        item.approved
      ]),
      [],
      ['Rating', 'Count'],
      ...analyticsData.ratingsDistribution.map(item => [
        item.name,
        item.value
      ])
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `medical-portal-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <DashboardHeader 
        onRefresh={handleRefresh}
        onExport={handleExport}
        isLoading={statsLoading}
      />

      <MetricsCards stats={stats} />

      <SecondaryMetrics stats={stats} />

      <ChartsSection 
        analyticsData={analyticsData}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
      />

      <div className="lg:col-span-1">
        <TopDoctorsCard topDoctors={stats?.topDoctors} />
      </div>

      <QuickActions />
    </div>
  );
};

export default Dashboard;