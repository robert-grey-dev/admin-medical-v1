import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Calendar, Filter } from 'lucide-react';

export function QuickActions() {
  return (
    <Card className="border-dashed border-2 border-muted">
      <CardContent className="flex items-center justify-center py-8">
        <div className="text-center space-y-4">
          <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto" />
          <div>
            <h3 className="font-semibold">Quick Actions</h3>
            <p className="text-sm text-muted-foreground">
              Review pending submissions, manage doctors, or export data
            </p>
          </div>
          <div className="flex gap-2 justify-center">
            <Button variant="outline" size="sm" className="gap-2">
              <Calendar className="h-4 w-4" />
              Schedule Report
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Advanced Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}