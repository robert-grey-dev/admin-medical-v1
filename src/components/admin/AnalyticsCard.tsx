import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  variant?: 'primary' | 'success' | 'warning' | 'danger';
}

export function AnalyticsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
  variant = 'primary'
}: AnalyticsCardProps) {
  const variantStyles = {
    primary: 'bg-gradient-primary text-white',
    success: 'bg-gradient-success text-white',
    warning: 'bg-gradient-warning text-white',
    danger: 'bg-gradient-danger text-white'
  };

  return (
    <Card 
      className={cn(
        'relative overflow-hidden transition-all duration-300 hover:shadow-card-hover group',
        className
      )}
    >
      <div 
        className={cn(
          'absolute inset-0 opacity-10 transition-opacity duration-300 group-hover:opacity-20',
          variantStyles[variant]
        )}
      />
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn(
          'p-2 rounded-lg transition-transform duration-300 group-hover:scale-110',
          variant === 'primary' ? 'bg-medical-blue/10 text-medical-blue' :
          variant === 'success' ? 'bg-medical-green/10 text-medical-green' :
          variant === 'warning' ? 'bg-medical-orange/10 text-medical-orange' :
          'bg-medical-red/10 text-medical-red'
        )}>
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10">
        <div className="flex items-baseline justify-between">
          <div className="text-3xl font-bold text-foreground">
            {value}
          </div>
          {trend && (
            <div className={cn(
              'flex items-center text-sm font-medium',
              trend.isPositive ? 'text-medical-green' : 'text-medical-red'
            )}>
              <span className={cn(
                'mr-1',
                trend.isPositive ? '↗' : '↘'
              )}>
                {trend.isPositive ? '↗' : '↘'}
              </span>
              {Math.abs(trend.value)}%
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}