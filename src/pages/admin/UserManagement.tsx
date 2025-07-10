import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, Plus, Edit, Trash2, Shield, Mail, Phone } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface User {
  id: string;
  name: string;
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
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'user' as 'user' | 'doctor' | 'admin',
    status: 'active' as 'active' | 'inactive' | 'suspended'
  });

  useEffect(() => {
    // Mock user data for development
    const mockUsers: User[] = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1-555-0123',
        role: 'user',
        status: 'active',
        createdAt: '2024-01-15',
        lastLogin: '2024-03-10',
        appointments: 12
      },
      {
        id: '2',
        name: 'Dr. Sarah Wilson',
        email: 'sarah.wilson@hospital.com',
        phone: '+1-555-0456',
        role: 'doctor',
        status: 'active',
        createdAt: '2023-11-20',
        lastLogin: '2024-03-11',
        appointments: 245
      },
      {
        id: '3',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '+1-555-0789',
        role: 'user',
        status: 'inactive',
        createdAt: '2024-02-01',
        lastLogin: '2024-02-28',
        appointments: 3
      },
      {
        id: '4',
        name: 'Dr. Michael Chen',
        email: 'michael.chen@hospital.com',
        phone: '+1-555-0321',
        role: 'doctor',
        status: 'active',
        createdAt: '2023-09-15',
        lastLogin: '2024-03-11',
        appointments: 189
      },
      {
        id: '5',
        name: 'Admin User',
        email: 'admin@hospital.com',
        phone: '+1-555-1000',
        role: 'admin',
        status: 'active',
        createdAt: '2023-01-01',
        lastLogin: '2024-03-11',
        appointments: 0
      }
    ];

    // Simulate API call
    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, []);

  const getRoleBadge = (role: string) => {
    const baseClasses = "badge badge-sm";
    switch (role) {
      case 'admin':
        return `${baseClasses} badge-error`;
      case 'doctor':
        return `${baseClasses} badge-primary`;
      case 'user':
        return `${baseClasses} badge-neutral`;
      default:
        return baseClasses;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "badge badge-sm";
    switch (status) {
      case 'active':
        return `${baseClasses} badge-success`;
      case 'inactive':
        return `${baseClasses} badge-warning`;
      case 'suspended':
        return `${baseClasses} badge-error`;
      default:
        return baseClasses;
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status
    });
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'user',
      status: 'active'
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setIsEditMode(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'user',
      status: 'active'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (selectedUser) {
        // Update existing user
        const updatedUser = { ...selectedUser, ...formData };
        setUsers(users.map(u => u.id === selectedUser.id ? updatedUser : u));
        toast.success('User updated successfully');
      } else {
        // Add new user
        const newUser: User = {
          id: Date.now().toString(),
          ...formData,
          createdAt: new Date().toISOString().split('T')[0],
          lastLogin: 'Never',
          appointments: 0
        };
        setUsers([newUser, ...users]);
        toast.success('User created successfully');
      }
      handleCloseModal();
    } catch {
      toast.error('Failed to save user');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        setUsers(users.filter(u => u.id !== userId));
        toast.success('User deleted successfully');
      } catch {
        toast.error('Failed to delete user');
      }
    }
  };

  const handleStatusChange = async (userId: string, newStatus: 'active' | 'inactive' | 'suspended') => {
    try {
      setUsers(users.map(u => 
        u.id === userId ? { ...u, status: newStatus } : u
      ));
      toast.success(`User status updated to ${newStatus}`);
    } catch {
      toast.error('Failed to update user status');
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
    <div className="min-h-screen bg-base-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-base-content flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              User Management
            </h1>
            <p className="text-base-content/70 mt-2">
              Manage system users, roles, and permissions
            </p>
          </div>
          <button
            onClick={handleAddUser}
            className="btn btn-primary gap-2"
          >
            <Plus className="h-4 w-4" />
            Add User
          </button>
        </div>

        {/* Search and Filters */}
        <div className="card bg-base-200 shadow-lg mb-6">
          <div className="card-body">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="form-control flex-1">
                <div className="input-group">
                  <span>
                    <Search className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search users by name or email..."
                    className="input input-bordered w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="form-control">
                <div className="input-group">
                  <span>
                    <Filter className="h-4 w-4" />
                  </span>
                  <select
                    className="select select-bordered"
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
                  className="select select-bordered"
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
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body p-0">
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Appointments</th>
                    <th>Last Login</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover">
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar placeholder">
                            <div className="bg-neutral-focus text-neutral-content rounded-full w-10">
                              <span className="text-sm">{user.name.charAt(0)}</span>
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">{user.name}</div>
                            <div className="text-sm opacity-50 flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {user.email}
                            </div>
                            <div className="text-sm opacity-50 flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {user.phone}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={getRoleBadge(user.role)}>
                          {user.role === 'admin' && <Shield className="h-3 w-3 mr-1" />}
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </td>
                      <td>
                        <div className="dropdown dropdown-bottom">
                          <label tabIndex={0} className={`${getStatusBadge(user.status)} cursor-pointer`}>
                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                          </label>
                          <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-32">
                            <li>
                              <button onClick={() => handleStatusChange(user.id, 'active')}>
                                Active
                              </button>
                            </li>
                            <li>
                              <button onClick={() => handleStatusChange(user.id, 'inactive')}>
                                Inactive
                              </button>
                            </li>
                            <li>
                              <button onClick={() => handleStatusChange(user.id, 'suspended')}>
                                Suspended
                              </button>
                            </li>
                          </ul>
                        </div>
                      </td>
                      <td>{user.appointments}</td>
                      <td>{new Date(user.lastLogin).toLocaleDateString()}</td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewUser(user)}
                            className="btn btn-sm btn-ghost"
                            title="View user details"
                          >
                            👁️
                          </button>
                          <button
                            onClick={() => handleEditUser(user)}
                            className="btn btn-sm btn-ghost"
                            title="Edit user"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="btn btn-sm btn-ghost text-error"
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
                <Users className="h-16 w-16 text-base-content/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-base-content/70 mb-2">
                  No Users Found
                </h3>
                <p className="text-base-content/50">
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
          <div className="modal modal-open">
            <div className="modal-box max-w-2xl">
              <h3 className="font-bold text-lg mb-4">
                {isEditMode ? (selectedUser ? 'Edit User' : 'Add New User') : 'User Details'}
              </h3>
              
              {isEditMode ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Name</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered"
                      placeholder="Enter full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <input
                      type="email"
                      className="input input-bordered"
                      placeholder="Enter email address"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Phone</span>
                    </label>
                    <input
                      type="tel"
                      className="input input-bordered"
                      placeholder="Enter phone number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Role</span>
                    </label>
                    <select
                      className="select select-bordered"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value as 'user' | 'doctor' | 'admin' })}
                      title="Select user role"
                    >
                      <option value="user">User</option>
                      <option value="doctor">Doctor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Status</span>
                    </label>
                    <select
                      className="select select-bordered"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' | 'suspended' })}
                      title="Select user status"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>

                  <div className="modal-action">
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={handleCloseModal}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {selectedUser ? 'Update User' : 'Create User'}
                    </button>
                  </div>
                </form>
              ) : (
                selectedUser && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-base-content/70">Name</label>
                        <p className="text-base-content font-medium">{selectedUser.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-base-content/70">Email</label>
                        <p className="text-base-content font-medium">{selectedUser.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-base-content/70">Phone</label>
                        <p className="text-base-content font-medium">{selectedUser.phone}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-base-content/70">Role</label>
                        <p>
                          <span className={getRoleBadge(selectedUser.role)}>
                            {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
                          </span>
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-base-content/70">Status</label>
                        <p>
                          <span className={getStatusBadge(selectedUser.status)}>
                            {selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
                          </span>
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-base-content/70">Appointments</label>
                        <p className="text-base-content font-medium">{selectedUser.appointments}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-base-content/70">Created</label>
                        <p className="text-base-content font-medium">
                          {new Date(selectedUser.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-base-content/70">Last Login</label>
                        <p className="text-base-content font-medium">
                          {selectedUser.lastLogin === 'Never' ? 'Never' : new Date(selectedUser.lastLogin).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="modal-action">
                      <button
                        className="btn btn-ghost"
                        onClick={handleCloseModal}
                      >
                        Close
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={() => setIsEditMode(true)}
                      >
                        Edit User
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUserManagement;
