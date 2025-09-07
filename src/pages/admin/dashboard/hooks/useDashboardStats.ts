import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { subDays } from 'date-fns';

export const useDashboardStats = (refreshKey: number) => {
  return useQuery({
    queryKey: ['admin-enhanced-stats', refreshKey],
    queryFn: async () => {
      const [
        doctorsResult, 
        reviewsResult, 
        usersResult, 
        pendingReviewsResult,
        recentReviewsResult,
        approvedReviewsResult
      ] = await Promise.all([
        supabase.from('doctors').select('id, average_rating, total_reviews', { count: 'exact' }),
        supabase.from('reviews').select('id, created_at', { count: 'exact' }),
        supabase.from('profiles').select('id, created_at', { count: 'exact' }),
        supabase.from('reviews').select('id', { count: 'exact' }).eq('status', 'pending'),
        supabase.from('reviews').select('created_at').gte('created_at', subDays(new Date(), 7).toISOString()),
        supabase.from('reviews').select('id', { count: 'exact' }).eq('status', 'approved')
      ]);

      // Calculate trends (7 days vs previous 7 days)
      const weekAgo = subDays(new Date(), 7);
      const twoWeeksAgo = subDays(new Date(), 14);
      
      const currentWeekReviews = recentReviewsResult.data?.length || 0;
      const [previousWeekReviewsResult] = await Promise.all([
        supabase.from('reviews')
          .select('id', { count: 'exact' })
          .gte('created_at', twoWeeksAgo.toISOString())
          .lt('created_at', weekAgo.toISOString())
      ]);

      const previousWeekReviews = previousWeekReviewsResult.count || 0;
      const reviewsTrend = previousWeekReviews > 0 
        ? ((currentWeekReviews - previousWeekReviews) / previousWeekReviews) * 100 
        : 0;

      // Calculate average rating
      const doctors = doctorsResult.data || [];
      const totalRating = doctors.reduce((sum, doctor) => sum + (doctor.average_rating || 0), 0);
      const avgRating = doctors.length > 0 ? (totalRating / doctors.length) : 0;

      // Top performing doctors
      const topDoctors = doctors
        .filter(d => d.total_reviews > 0)
        .sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0))
        .slice(0, 5);

      return {
        totalDoctors: doctorsResult.count || 0,
        totalReviews: reviewsResult.count || 0,
        totalUsers: usersResult.count || 0,
        pendingReviews: pendingReviewsResult.count || 0,
        approvedReviews: approvedReviewsResult.count || 0,
        averageRating: avgRating.toFixed(1),
        reviewsTrend: {
          value: Math.abs(reviewsTrend),
          isPositive: reviewsTrend >= 0
        },
        topDoctors,
        activityRate: ((reviewsResult.count || 0) / (usersResult.count || 1)).toFixed(1),
        approvalRate: approvedReviewsResult.count && reviewsResult.count 
          ? (((approvedReviewsResult.count || 0) / (reviewsResult.count || 1)) * 100).toFixed(1)
          : '0'
      };
    },
  });
};