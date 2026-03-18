import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Search, 
  Calendar,
  Clock,
  Globe,
  Monitor,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Table } from '../../components/common/Table';
import { Button } from '../../components/common/Button';
import { adminService } from '../../services/api';
import { format } from 'date-fns';

interface LoginActivityEntry {
  id: number;
  user_id: number | null;
  identifier: string;
  email: string;
  login_time: string;
  ip_address: string;
  user_agent: string;
  success: boolean;
  failure_reason: string | null;
}

const LoginActivity: React.FC = () => {
  const [activities, setActivities] = useState<LoginActivityEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await adminService.getLoginActivity({ limit: 50, offset: 0 });
        setActivities(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch login activities');
      } finally {
        setIsLoading(false);
      }
    };
    fetchActivities();
  }, []);

  const columns = [
    {
      header: 'User / Identifier',
      accessorKey: 'identifier',
      cell: (info: any) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-900">{info.getValue()}</span>
          <span className="text-xs text-slate-500">{info.row.original.email}</span>
        </div>
      )
    },
    {
      header: 'Status',
      accessorKey: 'success',
      cell: (info: any) => (
        <div className="flex items-center">
          {info.getValue() ? (
            <div className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded-lg text-xs font-black uppercase tracking-widest">
              <CheckCircle2 size={12} className="mr-1.5" />
              Success
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="flex items-center text-red-600 bg-red-50 px-2 py-1 rounded-lg text-xs font-black uppercase tracking-widest w-fit">
                <XCircle size={12} className="mr-1.5" />
                Failed
              </div>
              {info.row.original.failure_reason && (
                <span className="text-[10px] text-red-400 mt-1 font-bold">{info.row.original.failure_reason}</span>
              )}
            </div>
          )}
        </div>
      )
    },
    {
      header: 'Login Time',
      accessorKey: 'login_time',
      cell: (info: any) => (
        <div className="flex items-center text-slate-600">
          <Clock size={14} className="mr-1.5 text-slate-400" />
          <span className="text-sm font-medium">
            {format(new Date(info.getValue()), 'MMM dd, HH:mm:ss')}
          </span>
        </div>
      )
    },
    {
      header: 'IP Address',
      accessorKey: 'ip_address',
      cell: (info: any) => (
        <div className="flex items-center text-slate-600">
          <Globe size={14} className="mr-1.5 text-slate-400" />
          <span className="text-sm font-mono">{info.getValue()}</span>
        </div>
      )
    },
    {
      header: 'Device / Browser',
      accessorKey: 'user_agent',
      cell: (info: any) => {
        const ua = info.getValue();
        let browserName = 'Unknown';
        if (ua.includes('Chrome')) browserName = 'Chrome';
        else if (ua.includes('Firefox')) browserName = 'Firefox';
        else if (ua.includes('Safari')) browserName = 'Safari';
        
        return (
          <div className="flex items-center text-slate-500 max-w-[200px] truncate" title={ua}>
            <Monitor size={14} className="mr-1.5 shrink-0" />
            <span className="text-xs truncate">{browserName}</span>
          </div>
        );
      }
    }
  ];

  const filteredActivities = activities.filter(activity => 
    activity.identifier.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.ip_address.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Login Activity Audit</h1>
          <p className="text-slate-500 font-medium">Monitor system access and security events across all users.</p>
        </div>
        <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
          <Shield size={18} className="text-primary-600" />
          <span className="text-sm font-black text-slate-700 uppercase tracking-widest">Admin Auditing</span>
        </div>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="relative w-full max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by user, email, or IP..." 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none text-sm transition-all font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-8 rounded-xl flex flex-col items-center text-center">
            <AlertCircle size={40} className="mb-4 opacity-50" />
            <h3 className="font-black uppercase tracking-widest mb-1">Failed to Load Audit Logs</h3>
            <p className="text-sm font-medium opacity-80">{error}</p>
            <Button variant="outline" size="sm" className="mt-6" onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        ) : (
          <div className="-mx-6">
            <Table columns={columns} data={filteredActivities} />
            {filteredActivities.length === 0 && (
              <div className="py-20 text-center">
                <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No activity records found</p>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default LoginActivity;
