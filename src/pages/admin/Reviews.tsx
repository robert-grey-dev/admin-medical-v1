import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { Star, Search, CheckCircle, XCircle, Trash2, Filter } from 'lucide-react';

const Reviews = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedReviews, setSelectedReviews] = useState<string[]>([]);
  const queryClient = useQueryClient();

  // Получение отзывов
  const { data: reviews, isLoading } = useQuery({
    queryKey: ['admin-reviews', searchTerm, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('reviews')
        .select(`
          *,
          doctors (
            name,
            specialty
          )
        `)
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter as 'pending' | 'approved' | 'rejected');
      }

      if (searchTerm) {
        query = query.or(`patient_name.ilike.%${searchTerm}%,review_text.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  // Мутация для обновления статуса отзыва
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: 'pending' | 'approved' | 'rejected' }) => {
      const { error } = await supabase
        .from('reviews')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
      toast({
        title: "Status Updated",
        description: "Review status successfully changed",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update review status",
      });
    },
  });

  // Мутация для удаления отзыва
  const deleteReviewMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
      toast({
        title: "Review Deleted",
        description: "Review successfully removed from system",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete review",
      });
    },
  });

  // Массовые действия
  const handleBulkAction = async (action: 'approve' | 'reject') => {
    if (selectedReviews.length === 0) return;

    const status: 'approved' | 'rejected' = action === 'approve' ? 'approved' : 'rejected';
    
    try {
      await Promise.all(
        selectedReviews.map(id => 
          updateStatusMutation.mutateAsync({ id, status })
        )
      );
      setSelectedReviews([]);
    } catch (error) {
      
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { variant: "secondary" as const, label: "Pending" },
      approved: { variant: "default" as const, label: "Approved" },
      rejected: { variant: "destructive" as const, label: "Rejected" },
    };
    
    const config = variants[status as keyof typeof variants];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Review Management</h1>
          <p className="text-muted-foreground mt-2">
            Moderate and manage patient reviews
          </p>
        </div>
      </div>

      {/* Фильтры и поиск */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by patient name or review text..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Массовые действия */}
          {selectedReviews.length > 0 && (
            <div className="flex gap-2 mt-4 p-4 bg-muted rounded-lg">
              <span className="text-sm text-muted-foreground mr-2">
                Selected {selectedReviews.length} reviews:
              </span>
              <Button
                size="sm"
                onClick={() => handleBulkAction('approve')}
                className="h-8"
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleBulkAction('reject')}
                className="h-8"
              >
                <XCircle className="h-4 w-4 mr-1" />
                Reject
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Таблица отзывов */}
      <Card>
        <CardHeader>
          <CardTitle>
            Reviews ({reviews?.length || 0})
          </CardTitle>
          <CardDescription>
            Complete list of reviews with moderation options
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={reviews?.length > 0 && selectedReviews.length === reviews.length}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedReviews(reviews?.map(r => r.id) || []);
                      } else {
                        setSelectedReviews([]);
                      }
                    }}
                  />
                </TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Review</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews?.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedReviews.includes(review.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedReviews([...selectedReviews, review.id]);
                        } else {
                          setSelectedReviews(selectedReviews.filter(id => id !== review.id));
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{review.patient_name}</p>
                      <p className="text-sm text-muted-foreground">{review.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{review.doctors?.name}</p>
                      <p className="text-sm text-muted-foreground">{review.doctors?.specialty}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="text-sm truncate" title={review.review_text}>
                      {review.review_text}
                    </p>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(review.status)}
                  </TableCell>
                  <TableCell>
                    {new Date(review.created_at).toLocaleDateString('ru-RU')}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {review.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateStatusMutation.mutate({ id: review.id, status: 'approved' })}
                            className="h-8 w-8 p-0"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateStatusMutation.mutate({ id: review.id, status: 'rejected' })}
                            className="h-8 w-8 p-0"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteReviewMutation.mutate(review.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {reviews?.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No reviews found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Reviews;