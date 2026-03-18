import React, { useEffect, useState } from 'react';
import { 
  Users, 
  FileText, 
  Clock,
  MoreVertical,
  Download,
  Calendar,
  DollarSign
} from 'lucide-react';
import { 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell
} from 'recharts';
import { Card, CardStat } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Table } from '../../components/common/Table';
import { Badge } from '../../components/common/Button';
import { adminService, userService } from '../../services/api';
import { useAuth } from '../../store/AuthContext';
import { format } from 'date-fns';

interface DashboardData {
  summary: {
    total_customers: number;
    total_records: number;
    latest_upload_date: string;
    average_income: number;
  };
  bank_distribution: Array<{
    bank_type: string;
    count: number;
  }>;
  recent_uploads: Array<{
    upload_id: number;
    records_inserted: number;
    uploaded_at: string;
  }>;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = user?.role === 'admin' 
          ? await adminService.getDashboardStats() 
          : await userService.getDashboardStats();
        setData(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch dashboard data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, [user?.role]);

  const columns = [
    {
      header: 'Upload ID',
      accessorKey: 'upload_id',
      cell: (info: any) => (
        <span className="font-bold text-slate-900">#{info.getValue()}</span>
      )
    },
    { 
      header: 'Records Inserted', 
      accessorKey: 'records_inserted',
      cell: (info: any) => info.getValue().toLocaleString()
    },
    { 
      header: 'Uploaded At', 
      accessorKey: 'uploaded_at',
      cell: (info: any) => format(new Date(info.getValue()), 'MMM dd, yyyy HH:mm')
    },
    {
      header: 'Status',
      id: 'status',
      cell: () => (
        <Badge variant="success">
          Completed
        </Badge>
      )
    },
    {
      header: '',
      id: 'actions',
      cell: () => (
        <button className="text-slate-400 hover:text-slate-600">
          <MoreVertical size={16} />
        </button>
      )
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl">
        {error || 'No data available'}
      </div>
    );
  }

  const { summary, bank_distribution, recent_uploads } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {user?.role === 'admin' ? 'Admin Dashboard' : 'User Dashboard'}
          </h1>
          <p className="text-slate-500">Real-time CIBIL Bureau statistics and activity.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" leftIcon={<Clock size={18} />}>
            Last 30 Days
          </Button>
          <Button variant="primary" leftIcon={<Download size={18} />}>
            Export PDF
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <CardStat 
          title="Total Customers" 
          value={summary.total_customers.toLocaleString()} 
          icon={Users} 
          trend={{ value: 4.2, positive: true }} 
        />
        <CardStat 
          title="Total Records" 
          value={summary.total_records.toLocaleString()} 
          icon={FileText} 
          trend={{ value: 2.1, positive: true }} 
        />
        <CardStat 
          title="Avg. Monthly Income" 
          value={`₹${summary.average_income.toLocaleString()}`} 
          icon={DollarSign} 
        />
        <CardStat 
          title="Latest Upload" 
          value={format(new Date(summary.latest_upload_date), 'MMM dd')} 
          icon={Calendar} 
        />
      </div>

      {/* Bank Distribution Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1" title="Bank Distribution" subtitle="Records by financial institution type">
          <div className="h-[300px] mt-4 flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={bank_distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="bank_type"
                >
                  {bank_distribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: any) => [Number(value).toLocaleString(), 'Records']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-4 mt-6 w-full px-4">
              {bank_distribution.map((entry, index) => (
                <div key={entry.bank_type} className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2 shrink-0" style={{ backgroundColor: COLORS[index] }}></div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{entry.bank_type}</span>
                    <span className="text-sm font-black text-slate-900">{entry.count.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Recent Data Uploads */}
        <Card className="lg:col-span-2" title="Recent Data Uploads" headerAction={<Button variant="ghost" size="sm">View All</Button>}>
          <div className="mt-2">
            <Table columns={columns} data={recent_uploads} />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
