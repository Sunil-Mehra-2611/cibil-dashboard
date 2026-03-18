import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
  footer?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className, 
  title, 
  subtitle, 
  headerAction,
  footer 
}) => {
  return (
    <div className={cn("bg-white rounded-xl border border-slate-200 overflow-hidden card-shadow", className)}>
      {(title || subtitle || headerAction) && (
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            {title && <h3 className="text-lg font-semibold text-slate-900 leading-tight">{title}</h3>}
            {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
      {footer && (
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
          {footer}
        </div>
      )}
    </div>
  );
};

export const CardStat: React.FC<{
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: { value: number; positive: boolean };
  className?: string;
}> = ({ title, value, icon: Icon, trend, className }) => {
  return (
    <div className={cn("bg-white rounded-xl p-6 border border-slate-200 card-shadow", className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h4 className="text-2xl font-bold text-slate-900 mt-1">{value}</h4>
          {trend && (
            <div className="flex items-center mt-2">
              <span className={cn(
                "text-xs font-medium px-1.5 py-0.5 rounded-full flex items-center",
                trend.positive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
              )}>
                {trend.positive ? '+' : '-'}{trend.value}%
              </span>
              <span className="text-xs text-slate-400 ml-1.5 whitespace-nowrap">vs last month</span>
            </div>
          )}
        </div>
        <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600">
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};
