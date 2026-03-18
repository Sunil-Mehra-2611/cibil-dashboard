import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  ChevronDown,
  Download,
  Eye,
  User,
  Phone,
  CreditCard,
  Calendar,
  X,
  Plus,
} from "lucide-react";
import { Card } from "../../components/common/Card";
import { Button, Badge } from "../../components/common/Button";
import { Table } from "../../components/common/Table";

const CustomerList: React.FC = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Mock Data
  const customers = [
    {
      id: "CUST-10021",
      name: "Rahul Sharma",
      pan: "ABCDE1234F",
      phone: "9876543210",
      score: 785,
      bank: "HDFC Bank",
      income: "₹1.2L",
      status: "Approved",
    },
    {
      id: "CUST-10022",
      name: "Priya Singh",
      pan: "FGHIJ5678K",
      phone: "9876543211",
      score: 642,
      bank: "ICICI Bank",
      income: "₹85K",
      status: "Pending",
    },
    {
      id: "CUST-10023",
      name: "Amit Verma",
      pan: "LMNO P9012Q",
      phone: "9876543212",
      score: 812,
      bank: "SBI",
      income: "₹2.5L",
      status: "Approved",
    },
    {
      id: "CUST-10024",
      name: "Sneha Kapur",
      pan: "RSTUV3456W",
      phone: "9876543213",
      score: 580,
      bank: "Axis Bank",
      income: "₹45K",
      status: "Rejected",
    },
    {
      id: "CUST-10025",
      name: "Vikram Joshi",
      pan: "XYZAB7890C",
      phone: "9876543214",
      score: 720,
      bank: "Kotak Bank",
      income: "₹1.1L",
      status: "Approved",
    },
    {
      id: "CUST-10026",
      name: "Anjali Desai",
      pan: "DEFGH1234I",
      phone: "9876543215",
      score: 690,
      bank: "HDFC Bank",
      income: "₹95K",
      status: "Pending",
    },
    {
      id: "CUST-10027",
      name: "Suresh Iyer",
      pan: "JKLMN5678O",
      phone: "9876543216",
      score: 755,
      bank: "ICICI Bank",
      income: "₹1.8L",
      status: "Approved",
    },
  ];

  const columns = [
    {
      header: "Customer ID",
      accessorKey: "id",
      cell: (info: any) => (
        <span className="font-semibold text-primary-600">
          {info.getValue()}
        </span>
      ),
    },
    {
      header: "Name",
      accessorKey: "name",
      cell: (info: any) => (
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mr-3 shrink-0">
            <User size={14} />
          </div>
          <span className="font-medium text-slate-900">{info.getValue()}</span>
        </div>
      ),
    },
    { header: "PAN", accessorKey: "pan" },
    { header: "Phone", accessorKey: "phone" },
    {
      header: "Credit Score",
      accessorKey: "score",
      cell: (info: any) => {
        const score = info.getValue();
        let color = "text-green-600";
        if (score < 600) color = "text-red-600";
        else if (score < 700) color = "text-amber-600";
        return <span className={color + " font-bold"}>{score}</span>;
      },
    },
    { header: "Bank Type", accessorKey: "bank" },
    {
      header: "Status",
      accessorKey: "status",
      cell: (info: any) => {
        const status = info.getValue();
        return (
          <Badge
            variant={
              status === "Approved"
                ? "success"
                : status === "Pending"
                  ? "warning"
                  : "danger"
            }
          >
            {status}
          </Badge>
        );
      },
    },
    {
      header: "Action",
      id: "actions",
      cell: (info: any) => (
        <Link to={`/customers/${info.row.original.id}`}>
          <Button variant="ghost" size="sm" leftIcon={<Eye size={14} />}>
            View Details
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">
            Customer Repository
          </h1>
          <p className="text-slate-500">
            Search and filter through all customers in the CIBIL Bureau
            database.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" leftIcon={<Download size={18} />}>
            Export CSV
          </Button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <Card className="overflow-visible">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by ID, PAN, Phone, or Name..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none text-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant={showFilters ? "primary" : "outline"}
              leftIcon={<Filter size={18} />}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filters
              {showFilters ? (
                <X size={14} className="ml-2" />
              ) : (
                <ChevronDown size={14} className="ml-2" />
              )}
            </Button>
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase">
                Bank Type
              </label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none">
                <option value="">All Banks</option>
                <option value="public">Public Banks</option>
                <option value="private">Private Banks</option>
                <option value="foreign">Foreign Banks</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase">
                Credit Score Range
              </label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none">
                <option value="">Any Score</option>
                <option value="750+">750 & Above (Excellent)</option>
                <option value="700-749">700 - 749 (Good)</option>
                <option value="600-699">600 - 699 (Fair)</option>
                <option value="<600">Below 600 (Poor)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase">
                Status
              </label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none">
                <option value="">All Statuses</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase">
                Upload Date Range
              </label>
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                <Calendar size={14} className="text-slate-400 mr-2" />
                <span className="text-sm text-slate-600">
                  Select Date Range
                </span>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Customer Table */}
      <Card className="px-0 py-0 overflow-hidden">
        <Table columns={columns} data={customers} />
      </Card>

      {/* Quick View Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center">
          <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600 mr-4 shrink-0">
            <User size={20} />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Average Score</p>
            <p className="text-lg font-bold text-slate-900">712</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center">
          <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600 mr-4 shrink-0">
            <Phone size={20} />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">
              Recent Applications
            </p>
            <p className="text-lg font-bold text-slate-900">145 Today</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center">
          <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600 mr-4 shrink-0">
            <CreditCard size={20} />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Total Defaults</p>
            <p className="text-lg font-bold text-slate-900">12%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerList;
