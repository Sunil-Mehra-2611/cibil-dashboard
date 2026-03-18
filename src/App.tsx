import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './store/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Dashboard from './pages/dashboard/Dashboard';
import FileUpload from './pages/upload/FileUpload';
import CustomerList from './pages/customer/CustomerList';
import CustomerDetail from './pages/customer/CustomerDetail';
import UserManagement from './pages/users/UserManagement';
import Reports from './pages/reports/Reports';

const Unauthorized = () => (
  <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
    <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mb-6 shadow-xl">
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
    </div>
    <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-2">Access Denied</h1>
    <p className="text-slate-500 max-w-md font-medium leading-relaxed">You do not have the necessary permissions to view this page. Please contact your administrator if you believe this is an error.</p>
    <div className="mt-8">
      <a href="/dashboard" className="px-6 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all shadow-lg hover:shadow-primary-600/20 active:scale-95 uppercase tracking-widest text-xs">Back to Safety</a>
    </div>
  </div>
);

const NotFound = () => (
  <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
    <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-3xl flex items-center justify-center mb-6 border-4 border-white shadow-lg">
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2-4 2-4 2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
    </div>
    <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-2">Page Not Found</h1>
    <p className="text-slate-500 max-w-md font-medium leading-relaxed">The page you are looking for might have been moved, renamed, or is temporarily unavailable.</p>
    <div className="mt-8">
      <a href="/dashboard" className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg active:scale-95 uppercase tracking-widest text-xs">Return Home</a>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected Routes Wrapper */}
          <Route element={<ProtectedRoute children={<DashboardLayout />} />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/customers" element={<CustomerList />} />
            <Route path="/customers/:id" element={<CustomerDetail />} />
            <Route path="/reports" element={<Reports />} />

            {/* Admin Only Routes - Now correctly nested without double layout */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/upload" element={<FileUpload />} />
              <Route path="/users" element={<UserManagement />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
