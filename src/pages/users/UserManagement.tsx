import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Shield,
  User as UserIcon,
  CheckCircle2,
  Mail,
  Lock,
  AlertCircle,
  Calendar,
  Eye,
  CheckCircle,
} from "lucide-react";
import { Card, CardStat } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { Table } from "../../components/common/Table";
import { Modal } from "../../components/common/Modal";
import { adminService } from "../../services/api";
import { format } from "date-fns";
import { Link } from "react-router-dom";

interface UserData {
  id: number;
  username: string;
  email: string;
  role: "admin" | "user";
  created_at: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user" as "admin" | "user",
  });

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await adminService.getUsers();
      setUsers(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await adminService.createUser(formData);
      setIsAddModalOpen(false);
      setFormData({ username: "", email: "", password: "", role: "user" });
      setSuccessMessage("User account created successfully");
      fetchUsers();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setIsSubmitting(true);
    setError(null);
    try {
      // Only send fields that are allowed for patching
      const patchData: any = {
        username: formData.username,
        email: formData.email,
        role: formData.role,
      };
      // Only include password if provided
      if (formData.password) patchData.password = formData.password;

      await adminService.updateUser(selectedUser.id, patchData);
      setIsEditModalOpen(false);
      setSuccessMessage("User account updated successfully");
      fetchUsers();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await adminService.deleteUser(selectedUser.id);
      setIsDeleteModalOpen(false);
      setSuccessMessage("User account deleted successfully");
      fetchUsers();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (user: UserData) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: "",
      role: user.role,
    });
    setError(null);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (user: UserData) => {
    setSelectedUser(user);
    setError(null);
    setIsDeleteModalOpen(true);
  };

  const columns = [
    {
      header: "System User",
      accessorKey: "username",
      cell: (info: any) => (
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 mr-3.5 shrink-0 border border-slate-200">
            <UserIcon size={18} />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-slate-900 leading-tight uppercase tracking-tight">
              {info.getValue()}
            </span>
            <span className="text-xs text-slate-500 font-bold">
              {info.row.original.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Role",
      accessorKey: "role",
      cell: (info: any) => {
        const role = info.getValue();
        return (
          <div className="flex items-center space-x-2 font-black uppercase tracking-widest text-[10px]">
            <Shield
              size={14}
              className={
                role === "admin" ? "text-primary-600" : "text-slate-400"
              }
            />
            <span
              className={
                role === "admin" ? "text-primary-600" : "text-slate-600"
              }
            >
              {role}
            </span>
          </div>
        );
      },
    },
    {
      header: "Created On",
      accessorKey: "created_at",
      cell: (info: any) => (
        <div className="flex items-center text-slate-600 font-bold text-xs uppercase tracking-widest">
          <Calendar size={12} className="mr-1.5 opacity-50" />
          {format(new Date(info.getValue()), "MMM dd, yyyy")}
        </div>
      ),
    },
    {
      header: "Actions",
      id: "actions",
      cell: (info: any) => (
        <div className="flex items-center space-x-1">
          <button
            onClick={() => openEditModal(info.row.original)}
            className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all active:scale-90"
            title="Edit User"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => openDeleteModal(info.row.original)}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all active:scale-90"
            title="Delete User"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Success Notification */}
      {successMessage && (
        <div className="fixed top-20 right-8 z-50 bg-green-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 animate-in fade-in slide-in-from-right-4">
          <CheckCircle size={24} />
          <div>
            <p className="font-black uppercase tracking-widest text-xs">
              Success
            </p>
            <p className="text-sm font-bold opacity-90">{successMessage}</p>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">
            System Access Control
          </h1>
          <p className="text-slate-500 font-medium">
            Create and manage internal accounts for the CIBIL Bureau Dashboard.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Link to="/login-activity">
            <Button variant="outline" leftIcon={<Eye size={18} />}>
              Audit Logs
            </Button>
          </Link>
          <Button
            variant="primary"
            leftIcon={<Plus size={18} />}
            onClick={() => {
              setFormData({
                username: "",
                email: "",
                password: "",
                role: "user",
              });
              setError(null);
              setIsAddModalOpen(true);
            }}
          >
            Add New User
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CardStat
          title="Total Admins"
          value={users
            .filter((u) => u.role === "admin")
            .length.toString()
            .padStart(2, "0")}
          icon={Shield}
        />
        <CardStat
          title="Standard Users"
          value={users
            .filter((u) => u.role === "user")
            .length.toString()
            .padStart(2, "0")}
          icon={UserIcon}
        />
        <CardStat title="New Today" value="00" icon={CheckCircle2} />
      </div>

      <Card>
        <div className="flex items-center justify-between mb-8">
          <div className="relative w-full max-w-sm">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none text-sm transition-all font-semibold"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="-mx-6">
            <Table columns={columns} data={filteredUsers} />
            {filteredUsers.length === 0 && (
              <div className="py-20 text-center">
                <p className="text-slate-400 font-black uppercase tracking-widest text-sm">
                  No users found matching your search
                </p>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Add User Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create New System Account"
        size="md"
        footer={
          <div className="flex space-x-3 w-full">
            <Button
              className="flex-1"
              variant="outline"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              variant="primary"
              onClick={handleCreateUser}
              disabled={isSubmitting}
              isLoading={isSubmitting}
            >
              Create Account
            </Button>
          </div>
        }
      >
        <form className="space-y-4" onSubmit={handleCreateUser}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center text-sm font-bold">
              <AlertCircle size={18} className="mr-2 shrink-0" />
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-500 mb-1.5 uppercase tracking-widest ml-1">
                Full Username
              </label>
              <div className="relative">
                <UserIcon
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none text-sm font-bold"
                  placeholder="johndoe"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 mb-1.5 uppercase tracking-widest ml-1">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="email"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none text-sm font-bold"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-500 mb-1.5 uppercase tracking-widest ml-1">
                Access Role
              </label>
              <div className="relative">
                <Shield
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
                <select
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none text-sm font-bold text-slate-700 appearance-none"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      role: e.target.value as "admin" | "user",
                    })
                  }
                >
                  <option value="user">Standard User</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 mb-1.5 uppercase tracking-widest ml-1">
                System Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="password"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none text-sm font-bold"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        </form>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Modify System Account"
        size="md"
        footer={
          <div className="flex space-x-3 w-full">
            <Button
              className="flex-1"
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              variant="primary"
              onClick={handleUpdateUser}
              disabled={isSubmitting}
              isLoading={isSubmitting}
            >
              Save Changes
            </Button>
          </div>
        }
      >
        <form className="space-y-4" onSubmit={handleUpdateUser}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center text-sm font-bold">
              <AlertCircle size={18} className="mr-2 shrink-0" />
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-500 mb-1.5 uppercase tracking-widest ml-1">
                Full Username
              </label>
              <div className="relative">
                <UserIcon
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none text-sm font-bold"
                  placeholder="johndoe"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 mb-1.5 uppercase tracking-widest ml-1">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="email"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none text-sm font-bold"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-500 mb-1.5 uppercase tracking-widest ml-1">
                Access Role
              </label>
              <div className="relative">
                <Shield
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
                <select
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none text-sm font-bold text-slate-700 appearance-none"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      role: e.target.value as "admin" | "user",
                    })
                  }
                >
                  <option value="user">Standard User</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 mb-1.5 uppercase tracking-widest ml-1">
                New Password (Optional)
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="password"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none text-sm font-bold"
                  placeholder="Leave blank to keep current"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete User Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete System Account"
        size="sm"
        footer={
          <div className="flex space-x-3 w-full">
            <Button
              className="flex-1"
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              variant="danger"
              onClick={handleDeleteUser}
              disabled={isSubmitting}
              isLoading={isSubmitting}
            >
              Confirm Delete
            </Button>
          </div>
        }
      >
        <div className="flex flex-col items-center text-center py-4">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-4">
            <Trash2 size={32} />
          </div>
          <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
            Are you sure?
          </h3>
          <p className="text-sm text-slate-500 mt-2 font-medium">
            You are about to delete the account for{" "}
            <span className="font-bold text-slate-900">
              {selectedUser?.username}
            </span>
            . This action cannot be undone.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default UserManagement;
