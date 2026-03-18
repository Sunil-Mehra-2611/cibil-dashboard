import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  CreditCard, 
  Briefcase, 
  Shield, 
  History, 
  FileText,
  TrendingUp,
  AlertTriangle,
  ExternalLink,
  Eye
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button, Badge } from '../../components/common/Button';
import { cn } from '../../utils/cn';
import { clsx } from 'clsx';

const CustomerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('basic');

  // Mock data for a specific customer
  const customer = {
    id: id || 'CUST-10021',
    name: 'Rahul Sharma',
    pan: 'ABCDE1234F',
    phone: '+91 98765 43210',
    email: 'rahul.sharma@example.com',
    dob: '12 May 1985',
    address: 'Flat 402, Sunshine Apartments, Powai, Mumbai - 400076',
    score: 785,
    status: 'Approved',
    accounts: [
      { id: 'ACC-1', bank: 'HDFC Bank', type: 'Personal Loan', limit: '₹5,00,000', balance: '₹1,24,500', status: 'Active', openedOn: '15 Jan 2023' },
      { id: 'ACC-2', bank: 'ICICI Bank', type: 'Credit Card', limit: '₹2,50,000', balance: '₹42,000', status: 'Active', openedOn: '10 Mar 2022' },
      { id: 'ACC-3', bank: 'SBI', type: 'Home Loan', limit: '₹45,00,000', balance: '₹38,50,000', status: 'Active', openedOn: '05 Nov 2020' },
    ],
    history: [
      { date: '20 Mar 2026', event: 'Credit score updated to 785', type: 'positive' },
      { date: '15 Jan 2026', event: 'New inquiry from HDFC Bank', type: 'neutral' },
      { date: '10 Dec 2025', event: 'Personal loan fully repaid - ICICI', type: 'positive' },
      { date: '05 Sep 2025', event: 'Missed payment reported by Axis Bank', type: 'negative' },
    ]
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: User },
    { id: 'accounts', label: 'Account Details', icon: CreditCard },
    { id: 'documents', label: 'Identity Documents', icon: Shield },
    { id: 'history', label: 'History Timeline', icon: History },
  ];

  return (
    <div className="space-y-6">
      {/* Back Button and Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/customers')}
            className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 text-slate-500 transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-slate-900">{customer.name}</h1>
              <Badge variant="success">{customer.status}</Badge>
            </div>
            <p className="text-sm text-slate-500">ID: {customer.id} | Last updated: 20 Mar 2026</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" leftIcon={<Download size={18} />}>
            Full Report PDF
          </Button>
          <Button variant="primary" leftIcon={<ExternalLink size={18} />}>
            Request Live Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Profile Card Summary */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 border-4 border-white shadow-sm">
                <User size={48} />
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-900">{customer.name}</h3>
            <p className="text-sm text-slate-500 font-medium">{customer.pan}</p>
            
            <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Credit Score</p>
                <p className="text-2xl font-black text-green-600 mt-1">{customer.score}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Risk Category</p>
                <p className="text-sm font-bold text-green-700 bg-green-50 px-2 py-1 rounded-full mt-1">Low Risk</p>
              </div>
            </div>

            <div className="mt-6 flex flex-col space-y-3 text-left bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex items-center text-sm">
                <Phone size={14} className="text-slate-400 mr-2" />
                <span className="text-slate-600">{customer.phone}</span>
              </div>
              <div className="flex items-center text-sm">
                <Mail size={14} className="text-slate-400 mr-2" />
                <span className="text-slate-600 truncate">{customer.email}</span>
              </div>
              <div className="flex items-start text-sm">
                <MapPin size={14} className="text-slate-400 mr-2 mt-0.5" />
                <span className="text-slate-600 leading-tight">{customer.address}</span>
              </div>
            </div>
          </Card>

          <Card title="Bureau Health" className="bg-slate-900 text-white border-none shadow-xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-xs uppercase font-bold">Total Exposure</span>
                <span className="text-sm font-bold">₹52,40,000</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-xs uppercase font-bold">Active Accounts</span>
                <span className="text-sm font-bold">03</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-xs uppercase font-bold">Inquiries (3M)</span>
                <span className="text-sm font-bold">02</span>
              </div>
              <div className="pt-2">
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-500 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <p className="text-[10px] text-slate-500 mt-2 text-center uppercase tracking-widest font-black">Score Confidence: High</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs and Detail Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Tab Navigation */}
          <div className="flex items-center p-1 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 flex items-center justify-center space-x-2 py-2.5 text-sm font-bold rounded-lg transition-all",
                  activeTab === tab.id 
                    ? "bg-primary-600 text-white shadow-md" 
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                <tab.icon size={18} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {activeTab === 'basic' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
                <Card title="Personal Information">
                  <dl className="space-y-4">
                    <div className="flex justify-between border-b border-slate-50 pb-2">
                      <dt className="text-sm text-slate-500">Full Name</dt>
                      <dd className="text-sm font-semibold text-slate-900">{customer.name}</dd>
                    </div>
                    <div className="flex justify-between border-b border-slate-50 pb-2">
                      <dt className="text-sm text-slate-500">Date of Birth</dt>
                      <dd className="text-sm font-semibold text-slate-900">{customer.dob}</dd>
                    </div>
                    <div className="flex justify-between border-b border-slate-50 pb-2">
                      <dt className="text-sm text-slate-500">Gender</dt>
                      <dd className="text-sm font-semibold text-slate-900">Male</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-slate-500">Marital Status</dt>
                      <dd className="text-sm font-semibold text-slate-900">Married</dd>
                    </div>
                  </dl>
                </Card>
                <Card title="Employment Details">
                  <div className="flex items-start mb-6 bg-slate-50 p-4 rounded-xl">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-slate-400 mr-4 border border-slate-200">
                      <Briefcase size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Senior Product Manager</p>
                      <p className="text-xs text-slate-500 font-medium">Global Tech Solutions Pvt Ltd</p>
                    </div>
                  </div>
                  <dl className="space-y-4">
                    <div className="flex justify-between border-b border-slate-50 pb-2">
                      <dt className="text-sm text-slate-500">Annual Income</dt>
                      <dd className="text-sm font-semibold text-slate-900">₹14,50,000</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-slate-500">Experience</dt>
                      <dd className="text-sm font-semibold text-slate-900">12 Years</dd>
                    </div>
                  </dl>
                </Card>
                <Card title="Address History" className="md:col-span-2">
                   <div className="space-y-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 shrink-0 mt-1">
                          <MapPin size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">Current Residence (since 2018)</p>
                          <p className="text-sm text-slate-600">{customer.address}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shrink-0 mt-1">
                          <MapPin size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-500">Previous Residence (2014-2018)</p>
                          <p className="text-sm text-slate-500">Sector 14, Vashi, Navi Mumbai - 400703</p>
                        </div>
                      </div>
                   </div>
                </Card>
              </div>
            )}

            {activeTab === 'accounts' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                {customer.accounts.map((acc, idx) => (
                  <Card key={idx} className="hover:border-primary-200 transition-colors cursor-pointer group">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-slate-50 group-hover:bg-primary-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-primary-600 transition-colors border border-slate-100">
                          <CreditCard size={24} />
                        </div>
                        <div>
                          <p className="text-lg font-bold text-slate-900 leading-tight">{acc.bank}</p>
                          <div className="flex items-center mt-1">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{acc.type}</span>
                            <span className="mx-2 text-slate-300">•</span>
                            <span className="text-xs font-bold text-slate-400">{acc.id}</span>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-right">
                        <div>
                          <p className="text-[10px] text-slate-400 font-black uppercase mb-1">Total Limit</p>
                          <p className="text-sm font-bold text-slate-900">{acc.limit}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-black uppercase mb-1">Current Balance</p>
                          <p className="text-sm font-bold text-slate-900">{acc.balance}</p>
                        </div>
                        <div className="hidden md:block">
                          <p className="text-[10px] text-slate-400 font-black uppercase mb-1">Status</p>
                          <Badge variant="success">{acc.status}</Badge>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
                
                <div className="flex items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all cursor-pointer">
                  <div className="flex flex-col items-center">
                    <TrendingUp size={32} className="mb-2 opacity-20" />
                    <p className="text-sm font-bold">Inquiry Trend: Decreasing (positive)</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-300">
                <Card className="flex flex-col items-center p-8">
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                    <FileText size={32} />
                  </div>
                  <h4 className="font-bold text-slate-900">PAN Card</h4>
                  <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-black">{customer.pan}</p>
                  <Button variant="ghost" size="sm" className="mt-4" leftIcon={<Eye size={14} />}>View Image</Button>
                </Card>
                <Card className="flex flex-col items-center p-8">
                  <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-4">
                    <FileText size={32} />
                  </div>
                  <h4 className="font-bold text-slate-900">Aadhar Card</h4>
                  <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-black">**** **** 4567</p>
                  <Button variant="ghost" size="sm" className="mt-4" leftIcon={<Eye size={14} />}>View Image</Button>
                </Card>
                <Card className="flex flex-col items-center p-8 opacity-50 grayscale">
                  <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mb-4 border-2 border-dashed border-slate-200">
                    <Shield size={32} />
                  </div>
                  <h4 className="font-bold text-slate-400">Passport</h4>
                  <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-black">Not Provided</p>
                  <Button variant="ghost" size="sm" className="mt-4" disabled>Not Available</Button>
                </Card>
              </div>
            )}

            {activeTab === 'history' && (
              <Card title="Activity Log" className="animate-in fade-in duration-300">
                <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                  {customer.history.map((item, idx) => (
                    <div key={idx} className="relative">
                      <div className={cn(
                        "absolute -left-[27px] top-1.5 w-4 h-4 rounded-full border-2 border-white ring-4 ring-transparent",
                        item.type === 'positive' ? "bg-green-500" : item.type === 'negative' ? "bg-red-500" : "bg-slate-400"
                      )}></div>
                      <div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{item.date}</p>
                        <p className="text-sm font-bold text-slate-900 mt-1">{item.event}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail;
