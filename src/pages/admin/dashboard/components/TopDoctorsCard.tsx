import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';

interface TopDoctorsCardProps {
  topDoctors: Array<{
    id: string;
    average_rating: number;
    total_reviews: number;
  }> | undefined;
}

export function TopDoctorsCard({ topDoctors }: TopDoctorsCardProps) {
  return (
    <Card className="transition-all duration-300 hover:shadow-card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          Top Rated Doctors
        </CardTitle>
        <CardDescription>
          Highest rated medical professionals
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topDoctors && topDoctors.length > 0 ? (
            topDoctors.map((doctor, index) => (
              <div key={doctor.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-sm">Doctor #{doctor.id.slice(0, 8)}</p>
                    <p className="text-xs text-muted-foreground">
                      {doctor.total_reviews} reviews
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  {(doctor.average_rating || 0).toFixed(1)}
                </Badge>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No rated doctors yet
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}