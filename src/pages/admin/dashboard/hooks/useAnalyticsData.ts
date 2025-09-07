import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';

export const useAnalyticsData = (timeRange: string) => {
  return useQuery({
    queryKey: ['admin-analytics', timeRange],
    queryFn: async () => {
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const startDate = subDays(new Date(), days);

      const [reviewsData, ratingsData, usersData] = await Promise.all([
        supabase
          .from('reviews')
          .select('created_at, status')
          .gte('created_at', startDate.toISOString()),
        supabase
          .from('reviews')
          .select('rating, created_at')
          .eq('status', 'approved')
          .gte('created_at', startDate.toISOString()),
        supabase
          .from('profiles')
          .select('created_at')
          .gte('created_at', startDate.toISOString())
      ]);

      // Process reviews timeline
      const reviewsTimeline = Array.from({ length: days }, (_, i) => {
        const date = format(subDays(new Date(), days - 1 - i), 'MMM dd');
        const dayStart = startOfDay(subDays(new Date(), days - 1 - i));
        const dayEnd = endOfDay(subDays(new Date(), days - 1 - i));
        
        const dayReviews = reviewsData.data?.filter(review => {
          const reviewDate = new Date(review.created_at);
          return reviewDate >= dayStart && reviewDate <= dayEnd;
        }) || [];

        return {
          name: date,
          value: dayReviews.length,
          pending: dayReviews.filter(r => r.status === 'pending').length,
          approved: dayReviews.filter(r => r.status === 'approved').length
        };
      });

      // Process ratings distribution
      const ratingsDistribution = [1, 2, 3, 4, 5].map(rating => ({
        name: `${rating} ★`,
        value: ratingsData.data?.filter(r => r.rating === rating).length || 0
      }));

      // Process user registrations
      const userRegistrations = Array.from({ length: Math.min(days, 30) }, (_, i) => {
        const date = format(subDays(new Date(), Math.min(days, 30) - 1 - i), 'MMM dd');
        const dayStart = startOfDay(subDays(new Date(), Math.min(days, 30) - 1 - i));
        const dayEnd = endOfDay(subDays(new Date(), Math.min(days, 30) - 1 - i));
        
        const dayUsers = usersData.data?.filter(user => {
          const userDate = new Date(user.created_at);
          return userDate >= dayStart && userDate <= dayEnd;
        }) || [];

        return {
          name: date,
          value: dayUsers.length
        };
      });

      return {
        reviewsTimeline,
        ratingsDistribution,
        userRegistrations
      };
    },
  });
};