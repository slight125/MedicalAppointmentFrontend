import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  MoreHorizontal,
  UserCheck,
  UserX
} from 'lucide-react';
import { fetchAllUsers, updateUser, deleteUser as deleteUserApi } from '../../utils/api';
import api from '../../utils/api';

const userSchema = z.object({
  firstname: z.string().min(2, 'First name must be at least 2 characters'),
  lastname: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  role: z.enum(['user', 'doctor', 'admin']),
  status: z.enum(['active', 'inactive', 'suspended']),
});

type UserFormData = z.infer<typeof userSchema>;

interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  role: 'user' | 'doctor' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  lastLogin: string;
  appointments: number;
}

const AdminUserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  useEffect(() => {
    async function loadUsers() {
      setLoading(true);
      try {
        const res = await fetchAllUsers();
        const backendUsers = res.data?.data || res.data || [];
        // Map backend users to local User type
        const mappedUsers = backendUsers.map((u: any) => ({
          id: u.user_id?.toString() || u.id?.toString() || '',
          firstname: u.firstname || '',
          lastname: u.lastname || '',
          email: u.email || '',
          phone: u.contact_phone || u.phone || '',
          role: u.role || 'user',
          status: u.status || 'active',
          createdAt: u.created_at || u.createdAt || '',
          lastLogin: u.last_login || u.lastLogin || '',
          appointments: u.appointments_count || u.appointments || 0
        }));
        setUsers(mappedUsers);
      } catch (err) {
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    reset();
  };

  const onSubmit = async (data: UserFormData) => {
    try {
      if (selectedUser) {
        // Update existing user
        await updateUser(selectedUser.id, data);
        const updatedUser = { ...selectedUser, ...data };
        setUsers(users.map(u => u.id === selectedUser.id ? updatedUser : u));
        toast.success('User updated successfully');
      } else {
        // Add new user (register)
        const res = await api.post('/auth/register', {
          firstname: data.firstname,
          lastname: data.lastname,
          email: data.email,
          password: 'TempPass123!', // You may want to prompt for password or auto-generate
          contact_phone: data.phone,
          role: data.role,
          status: data.status
        });
        const u = res.data.user;
        setUsers([{ 
          id: u.user_id?.toString() || u.id?.toString() || '',
          firstname: u.firstname || '',
          lastname: u.lastname || '',
          email: u.email || '',
          phone: u.contact_phone || u.phone || '',
          role: u.role || 'user',
          status: u.status || 'active',
          createdAt: u.created_at || u.createdAt || '',
          lastLogin: u.last_login || u.lastLogin || '',
          appointments: u.appointments_count || u.appointments || 0
        }, ...users]);
        toast.success('User created successfully');
      }
      handleCloseModal();
    } catch {
      toast.error('Failed to save user');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setValue('firstname', user.firstname);
    setValue('lastname', user.lastname);
    setValue('email', user.email);
    setValue('phone', user.phone);
    setValue('role', user.role);
    setValue('status', user.status);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setValue('firstname', user.firstname);
    setValue('lastname', user.lastname);
    setValue('email', user.email);
    setValue('phone', user.phone);
    setValue('role', user.role);
    setValue('status', user.status);
    setIsModalOpen(true);
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    reset();
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUserApi(userId);
        setUsers(users.filter(u => u.id !== userId));
        toast.success('User deleted successfully');
      } catch {
        toast.error('Failed to delete user');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-base-content dark:text-gray-100 flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              User Management
            </h1>
            <p className="text-base-content/70 dark:text-gray-300 mt-2">
              Manage system users, roles, and permissions
            </p>
          </div>
          <button
            onClick={handleAddUser}
            className="btn btn-primary gap-2 dark:bg-blue-400 dark:text-gray-900"
          >
            <Plus className="h-4 w-4" />
            Add User
          </button>
        </div>

        {/* Search and Filters */}
        <div className="card bg-base-200 dark:bg-gray-800 shadow-lg mb-6">
          <div className="card-body">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="form-control flex-1">
                <div className="input-group">
                  <span>
                    <Search className="h-4 w-4 dark:text-gray-200" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search users by name or email..."
                    className="input input-bordered w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="form-control">
                <div className="input-group">
                  <span>
                    <Filter className="h-4 w-4 dark:text-gray-200" />
                  </span>
                  <select
                    className="select select-bordered bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    title="Filter by role"
                  >
                    <option value="all">All Roles</option>
                    <option value="user">Users</option>
                    <option value="doctor">Doctors</option>
                    <option value="admin">Admins</option>
                  </select>
                </div>
              </div>
              
              <div className="form-control">
                <select
                  className="select select-bordered bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  title="Filter by status"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="card bg-white dark:bg-gray-900 shadow-lg">
          <div className="card-body p-0">
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                    <th>User</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Appointments</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar placeholder">
                            <div className="bg-neutral-focus text-neutral-content rounded-full w-10">
                              <span className="text-sm dark:text-gray-100">{user.firstname.charAt(0)}{user.lastname.charAt(0)}</span>
                            </div>
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 dark:text-gray-100">{user.firstname} {user.lastname}</div>
                            <div className="text-sm flex items-center gap-1 text-gray-500 dark:text-gray-400">
                              <Eye className="h-3 w-3" />
                              {user.email}
                            </div>
                            <div className="text-sm flex items-center gap-1 text-gray-500 dark:text-gray-400">
                              <MoreHorizontal className="h-3 w-3" />
                              {user.phone}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 flex items-center gap-1">
                          {user.role === 'admin' && <UserX className="h-3 w-3 mr-1" />}
                          {user.role === 'doctor' && <UserCheck className="h-3 w-3 mr-1" />}
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </td>
                      <td>
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-700/60 text-green-800 dark:text-green-200">
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </span>
                      </td>
                      <td className="text-gray-900 dark:text-gray-100">{user.appointments}</td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewUser(user)}
                            className="btn btn-sm btn-ghost dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                            title="View user details"
                          >
                            👁️
                          </button>
                          <button
                            onClick={() => handleEditUser(user)}
                            className="btn btn-sm btn-ghost dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                            title="Edit user"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="btn btn-sm btn-ghost text-error dark:text-red-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                            title="Delete user"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-base-content/30 dark:text-gray-700 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-base-content/70 dark:text-gray-300 mb-2">
                  No Users Found
                </h3>
                <p className="text-base-content/50 dark:text-gray-400">
                  {searchTerm || roleFilter !== 'all' || statusFilter !== 'all'
                    ? 'Try adjusting your search criteria'
                    : 'No users available'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* User Modal */}
        {isModalOpen && (
          <div className="modal modal-open flex items-center justify-center">
            <div className="modal-box max-w-xl w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-2xl shadow-xl p-8">
              <h3 className="font-bold text-2xl mb-6 text-center">
                {selectedUser ? 'Edit User' : 'Add New User'}
              </h3>
              <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="label-text dark:text-gray-100 font-semibold">First Name</label>
                  <input
                    type="text"
                    className="input input-bordered bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700"
                    placeholder="Enter first name"
                    {...register('firstname')}
                  />
                  {errors.firstname && <p className="text-error text-xs mt-1">{errors.firstname.message}</p>}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="label-text dark:text-gray-100 font-semibold">Last Name</label>
                  <input
                    type="text"
                    className="input input-bordered bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700"
                    placeholder="Enter last name"
                    {...register('lastname')}
                  />
                  {errors.lastname && <p className="text-error text-xs mt-1">{errors.lastname.message}</p>}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="label-text dark:text-gray-100 font-semibold">Email</label>
                  <input
                    type="email"
                    className="input input-bordered bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700"
                    placeholder="Enter email address"
                    {...register('email')}
                  />
                  {errors.email && <p className="text-error text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="label-text dark:text-gray-100 font-semibold">Phone</label>
                  <input
                    type="tel"
                    className="input input-bordered bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700"
                    placeholder="Enter phone number"
                    {...register('phone')}
                  />
                  {errors.phone && <p className="text-error text-xs mt-1">{errors.phone.message}</p>}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="label-text dark:text-gray-100 font-semibold">Role</label>
                  <select
                    className="select select-bordered bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700"
                    {...register('role')}
                    title="Select user role"
                  >
                    <option value="user">User</option>
                    <option value="doctor">Doctor</option>
                    <option value="admin">Admin</option>
                  </select>
                  {errors.role && <p className="text-error text-xs mt-1">{errors.role.message}</p>}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="label-text dark:text-gray-100 font-semibold">Status</label>
                  <select
                    className="select select-bordered bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700"
                    {...register('status')}
                    title="Select user status"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                  {errors.status && <p className="text-error text-xs mt-1">{errors.status.message}</p>}
                </div>
                <div className="col-span-1 md:col-span-2 flex justify-end gap-4 mt-4">
                  <button
                    type="button"
                    className="btn btn-ghost dark:text-gray-100"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary dark:bg-blue-400 dark:text-gray-900">
                    {selectedUser ? 'Update User' : 'Create User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUserManagement;
