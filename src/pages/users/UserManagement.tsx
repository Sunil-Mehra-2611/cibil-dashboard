import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Shield, 
  User as UserIcon,
  CheckCircle2,
  XCircle,
  Mail,
  Lock,
  AlertCircle
} from 'lucide-react';
import { Card, CardStat } from '../../components/common/Card';
import { Button, Badge } from '../../components/common/Button';
import { Table } from '../../components/common/Table';
import { Modal } from '../../components/common/Modal';
import { authService } from '../../services/api';

const UserManagement: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user'
  });

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await authService.register(formData);
      setIsAddModalOpen(false);
      setFormData({ username: '', email: '', password: '', role: 'user' });
      // In a real app, you would probably refresh the user list here.
      alert('User created successfully');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to create user');
    } finally {
      setIsLoading(false);
    }
  };

  // Mock Data
  const users = [
    { id: '1', name: 'Admin User', email: 'admin@cibil.com', role: 'admin', status: 'Active', lastLogin: '2 hours ago' },
    { id: '2', name: 'Siddharth Vora', email: 'sid.v@cibil.com', role: 'user', status: 'Active', lastLogin: '1 day ago' },
    { id: '3', name: 'Neha Gupta', email: 'neha.g@cibil.com', role: 'user', status: 'Inactive', lastLogin: '5 days ago' },
    { id: '4', name: 'Rajesh Mehra', email: 'rajesh.m@cibil.com', role: 'admin', status: 'Active', lastLogin: '1 hour ago' },
  ];

  const columns = [
    {
      header: 'User',
      accessorKey: 'name',
      cell: (info: any) => (
        <div className="flex items-center">
          <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mr-3 shrink-0">
            <UserIcon size={16} />
          </div>
          <div>
            <span className="font-bold text-slate-900 block">{info.getValue()}</span>
            <span className="text-xs text-slate-500">{info.row.original.email}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Role',
      accessorKey: 'role',
      cell: (info: any) => (
        <div className="flex items-center space-x-1.5 font-bold uppercase tracking-widest text-[10px]">
          <Shield size={12} className={info.getValue() === 'admin' ? "text-primary-600" : "text-slate-400"} />
          <span className={info.getValue() === 'admin' ? "text-primary-600" : "text-slate-600"}>{info.getValue()}</span>
        </div>
      )
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (info: any) => {
        const status = info.getValue();
        return (
          <div className="flex items-center">
            {status === 'Active' ? (
              <CheckCircle2 size={14} className="text-green-500 mr-1.5" />
            ) : (
              <XCircle size={14} className="text-red-400 mr-1.5" />
            )}
            <span className={status === 'Active' ? "text-green-700 font-bold" : "text-red-700 font-bold"}>{status}</span>
          </div>
        );
      }
    },
    { header: 'Last Login', accessorKey: 'lastLogin' },
    {
      header: '',
      id: 'actions',
      cell: () => (
        <div className="flex items-center space-x-2">
          <button className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
            <Edit size={16} />
          </button>
          <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <Trash2 size={16} />
          </button>
          <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <MoreVertical size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">User Management</h1>
          <p className="text-slate-500 font-medium">Control system access, assign roles, and monitor user activity.</p>
        </div>
        <div className="flex items-center">
          <Button variant="primary" leftIcon={<Plus size={18} />} onClick={() => setIsAddModalOpen(true)}>
            Add New User
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CardStat title="Total Admins" value="02" icon={Shield} />
        <CardStat title="Standard Users" value="14" icon={UserIcon} />
        <CardStat title="Active Sessions" value="03" icon={CheckCircle2} />
      </div>

      <Card>
        <div className="flex items-center justify-between mb-6">
          <div className="relative w-full max-w-sm">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none text-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="-mx-6">
           <Table columns={columns} data={users} />
        </div>
      </Card>

      {/* Add User Modal */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        title="Add New System User"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button 
              variant="primary" 
              onClick={handleCreateUser}
              disabled={isLoading}
              isLoading={isLoading}
            >
              Create User Account
            </Button>
          </>
        }
      >
        <form className="space-y-4" onSubmit={handleCreateUser}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md flex items-center text-sm">
              <AlertCircle size={18} className="mr-2 shrink-0" />
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5 uppercase tracking-wide text-[11px]">Username</label>
            <div className="relative">
              <UserIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none text-sm font-medium" 
                placeholder="johndoe"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5 uppercase tracking-wide text-[11px]">Email Address</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="email" 
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none text-sm font-medium" 
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5 uppercase tracking-wide text-[11px]">User Role</label>
              <select 
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none text-sm font-bold text-slate-600"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option value="user">Standard User</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5 uppercase tracking-wide text-[11px]">Temporary Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="password" 
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none text-sm" 
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UserManagement;
