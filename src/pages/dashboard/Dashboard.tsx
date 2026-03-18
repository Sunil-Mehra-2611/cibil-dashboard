import React from 'react';
import { 
  Users, 
  FileText, 
  TrendingUp, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  MoreVertical,
  Download
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Card, CardStat } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Table } from '../../components/common/Table';
import { Badge } from '../../components/common/Button';

const Dashboard: React.FC = () => {
  // Mock Data
  const incomeData = [
    { name: 'Jan', value: 45000 },
    { name: 'Feb', value: 52000 },
    { name: 'Mar', value: 48000 },
    { name: 'Apr', value: 61000 },
    { name: 'May', value: 55000 },
    { name: 'Jun', value: 67000 },
  ];

  const bankTypeData = [
    { name: 'Public', value: 400 },
    { name: 'Private', value: 300 },
    { name: 'Foreign', value: 150 },
    { name: 'Co-op', value: 100 },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  const recentUploads = [
    { id: 1, name: 'CIBIL_DATA_MARCH.txt', date: '2026-03-15', size: '156 MB', records: '1.2L', status: 'Completed' },
    { id: 2, name: 'BUREAU_BATCH_02.txt', date: '2026-03-14', size: '89 MB', records: '45K', status: 'Completed' },
    { id: 3, name: 'RECORDS_SYNC_DAILY.txt', date: '2026-03-13', size: '12 MB', records: '12K', status: 'Failed' },
    { id: 4, name: 'CIBIL_HISTORICAL_2025.txt', date: '2026-03-10', size: '1.2 GB', records: '8.5L', status: 'Completed' },
  ];

  const columns = [
    {
      header: 'File Name',
      accessorKey: 'name',
      cell: (info: any) => (
        <div className="flex items-center">
          <FileText size={16} className="text-slate-400 mr-2" />
          <span className="font-medium text-slate-900">{info.getValue()}</span>
        </div>
      )
    },
    { header: 'Upload Date', accessorKey: 'date' },
    { header: 'Records', accessorKey: 'records' },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (info: any) => {
        const status = info.getValue();
        return (
          <Badge variant={status === 'Completed' ? 'success' : 'danger'}>
            {status}
          </Badge>
        );
      }
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-500">Welcome back! Here's what's happening today.</p>
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
          value="12,45,280" 
          icon={Users} 
          trend={{ value: 12.5, positive: true }} 
        />
        <CardStat 
          title="Records Processed" 
          value="8.2M" 
          icon={FileText} 
          trend={{ value: 8.2, positive: true }} 
        />
        <CardStat 
          title="Avg. Credit Score" 
          value="742" 
          icon={TrendingUp} 
          trend={{ value: 2.1, positive: false }} 
        />
        <CardStat 
          title="Total Inquiries" 
          value="45,120" 
          icon={CreditCard} 
          trend={{ value: 15.4, positive: true }} 
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Income Trends" subtitle="Average monthly income distribution over time">
          <div className="h-[300px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={incomeData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Bank Type Distribution" subtitle="Records by financial institution type">
          <div className="h-[300px] mt-4 flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bankTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {bankTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col space-y-2 mr-8">
              {bankTypeData.map((entry, index) => (
                <div key={entry.name} className="flex items-center text-sm">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index] }}></div>
                  <span className="text-slate-600">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card title="Recent Data Uploads" headerAction={<Button variant="ghost" size="sm">View All</Button>}>
        <div className="mt-2">
          <Table columns={columns} data={recentUploads} />
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
