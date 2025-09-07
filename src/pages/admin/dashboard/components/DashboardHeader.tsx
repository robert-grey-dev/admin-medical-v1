import { Button } from '@/components/ui/button';
import { RefreshCw, Download } from 'lucide-react';

interface DashboardHeaderProps {
  onRefresh: () => void;
  onExport: () => void;
  isLoading: boolean;
}

export function DashboardHeader({ onRefresh, onExport, isLoading }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Analytics Dashboard
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Comprehensive medical portal analytics and insights
        </p>
      </div>
      <div className="flex gap-3">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRefresh}
          disabled={isLoading}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onExport}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>
    </div>
  );
}