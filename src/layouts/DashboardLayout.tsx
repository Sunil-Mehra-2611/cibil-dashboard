import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import {
  LayoutDashboard,
  Users,
  Upload,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  User as UserIcon,
  Search,
  AlertTriangle
} from 'lucide-react';

import { cn } from '../utils/cn';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';

const Sidebar = ({ isOpen, toggleSidebar }: { isOpen: boolean, toggleSidebar: () => void }) => {
  const { user } = useAuth();

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Customers', icon: Users, path: '/customers' },
    { name: 'Reports', icon: FileText, path: '/reports' },
  ];

  if (user?.role === 'admin') {
    navItems.push(
      { name: 'File Upload', icon: Upload, path: '/upload' },
      { name: 'User Management', icon: Settings, path: '/users' }
    );
  }

  return (
    <aside className={cn(
      "fixed top-0 left-0 z-40 h-screen transition-transform bg-white border-r border-slate-200 w-64",
      !isOpen && "-translate-x-full lg:translate-x-0"
    )}>
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">C</span>
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">CIBIL Bureau</span>
          </div>
          <button onClick={toggleSidebar} className="lg:hidden text-slate-500 hover:text-slate-900">
            <X size={20} />
          </button>
        </div>

        {/* Sidebar Content */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors group",
                isActive
                  ? "bg-primary-50 text-primary-600"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon className={cn(
                "mr-3 h-5 w-5",
                "group-hover:text-primary-600"
              )} />
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
              <UserIcon size={20} />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

const Navbar = ({ toggleSidebar, onLogoutClick }: { toggleSidebar: () => void, onLogoutClick: () => void }) => {
  return (
    <nav className="fixed top-0 z-30 w-full bg-white border-b border-slate-200 h-16 lg:pl-64">
      <div className="px-4 h-full flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={toggleSidebar} className="lg:hidden text-slate-500 hover:text-slate-900">
            <Menu size={24} />
          </button>

          <div className="hidden sm:flex items-center bg-slate-100 px-3 py-1.5 rounded-lg w-64 lg:w-96 border border-slate-200">
            <Search size={18} className="text-slate-400 mr-2" />
            <input
              type="text"
              placeholder="Search customers (PAN, Phone, ID)..."
              className="bg-transparent border-none focus:outline-none text-sm w-full placeholder-slate-400"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={onLogoutClick}
            className="flex items-center space-x-2 text-sm font-medium text-slate-600 hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
          >
            <LogOut size={18} />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

const DashboardLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogout = () => {
    logout();
    setIsLogoutModalOpen(false);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar toggleSidebar={toggleSidebar} onLogoutClick={() => setIsLogoutModalOpen(true)} />
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <main className="pt-16 lg:pl-64 h-full min-h-screen">
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </main>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title="Sign Out Confirmation"
        size="sm"
        footer={
          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => setIsLogoutModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleLogout}>
              Sign Out
            </Button>
          </div>
        }
      >
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-red-50 rounded-full text-red-600 shrink-0">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900">Are you sure you want to sign out?</h4>
            <p className="mt-1 text-sm text-slate-500">
              You will need to enter your credentials again to access the dashboard.
            </p>
          </div>
        </div>
      </Modal>

      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
