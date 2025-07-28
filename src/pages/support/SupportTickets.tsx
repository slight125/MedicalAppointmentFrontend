import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../../store';
import { MessageCircle, Plus, Search, Filter } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { fetchUserComplaints, submitComplaint, deleteComplaint } from '../../utils/api';
import api from '../../utils/api';
import appointmentAPI from '../../utils/api/appointmentAPI';

interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'technical' | 'billing' | 'appointment' | 'general';
  createdAt: string;
  updatedAt: string;
  responses: {
    id: string;
    message: string;
    isStaff: boolean;
    staffName?: string;
    timestamp: string;
  }[];
  appointmentId?: string;
  patientEmail?: string;
  patientPhone?: string;
  appointmentDate?: string;
}

const SupportTickets: React.FC = () => {
  const { user } = useAppSelector(state => state.auth);
  
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [newTicketForm, setNewTicketForm] = useState({
    title: '',
    description: '',
    category: 'general',
    priority: 'medium'
  });
  const [doctorPatientIds, setDoctorPatientIds] = useState<string[]>([]);
  const [showOnlyMyPatients, setShowOnlyMyPatients] = useState(false);

  // Edit ticket
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: '', description: '', category: 'general', priority: 'medium' });

  // If doctor, fetch their patient IDs
  useEffect(() => {
    if (user?.role === 'doctor') {
      appointmentAPI.getDoctorAppointments?.().then(res => {
        const patientIds = (res.data || []).map((appt: any) => appt.user_id?.toString()).filter(Boolean);
        setDoctorPatientIds(Array.from(new Set(patientIds)));
      });
    }
  }, [user]);

  useEffect(() => {
    // For doctors, fetch all complaints and filter for their patients
    if (user?.role === 'doctor') {
      api.get('/support/doctor').then((res: any) => {
        const complaints = (res.data || []).map((c: any) => ({
          id: c.complaint_id.toString(),
          userId: c.user_id?.toString() || '',
          userName: c.user_name || 'User',
          title: c.subject,
          description: c.description,
          status: (c.status || 'open').toLowerCase(),
          priority: c.priority || 'medium',
          category: c.category || 'general',
          createdAt: c.created_at,
          updatedAt: c.updated_at,
          appointmentId: c.related_appointment_id,
          patientEmail: c.user_email,
          patientPhone: c.user_phone,
          appointmentDate: c.appointment_date,
          responses: [],
        }));
        setTickets(complaints);
      }).catch(() => {
        toast.error('Failed to load support tickets');
      });
    } else {
      fetchUserComplaints()
        .then((res: any) => {
          const complaints = (res.data || []).map((c: any) => ({
            id: c.complaint_id.toString(),
            userId: c.user_id?.toString() || '',
            userName: user ? `${user.firstname} ${user.lastname}` : 'User',
            title: c.subject,
            description: c.description,
            status: (c.status || 'open').toLowerCase(),
            priority: c.priority || 'medium',
            category: c.category || 'general',
            createdAt: c.created_at,
            updatedAt: c.updated_at,
            appointmentId: c.related_appointment_id,
            responses: [],
          }));
          setTickets(complaints);
        })
        .catch(() => {
          toast.error('Failed to load support tickets');
        });
    }
  }, [user]);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitComplaint({
        subject: newTicketForm.title,
        description: newTicketForm.description,
        category: newTicketForm.category,
        priority: newTicketForm.priority,
      });
      toast.success('Support ticket created successfully');
      setIsNewTicketModalOpen(false);
      setNewTicketForm({
        title: '',
        description: '',
        category: 'general',
        priority: 'medium',
      });
      // Refresh tickets
      fetchUserComplaints()
        .then((res: any) => {
          const complaints = (res.data || []).map((c: any) => ({
            id: c.complaint_id.toString(),
            userId: c.user_id?.toString() || '',
            userName: user ? `${user.firstname} ${user.lastname}` : 'User',
            title: c.subject,
            description: c.description,
            status: (c.status || 'open').toLowerCase(),
            priority: c.priority || 'medium',
            category: c.category || 'general',
            createdAt: c.created_at,
            updatedAt: c.updated_at,
            responses: [],
          }));
          setTickets(complaints);
        });
    } catch {
      toast.error('Failed to create support ticket');
    }
  };

  const handleDeleteTicket = async (ticketId: string) => {
    if (!window.confirm('Are you sure you want to delete this support ticket?')) return;
    try {
      await deleteComplaint(ticketId);
      toast.success('Support ticket deleted');
      setIsEditing(false);
      setSelectedTicket(null);
      // Refresh tickets
      fetchUserComplaints()
        .then((res: any) => {
          const complaints = (res.data || []).map((c: any) => ({
            id: c.complaint_id.toString(),
            userId: c.user_id?.toString() || '',
            userName: user ? `${user.firstname} ${user.lastname}` : 'User',
            title: c.subject,
            description: c.description,
            status: (c.status || 'open').toLowerCase(),
            priority: 'medium',
            category: 'general',
            createdAt: c.created_at,
            updatedAt: c.updated_at,
            responses: [],
          }));
          setTickets(complaints);
        });
    } catch {
      toast.error('Failed to delete support ticket');
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedTicket) return;
    try {
      await api.patch(`/support/${selectedTicket.id}`, {
        subject: editForm.title,
        description: editForm.description,
        category: editForm.category,
        priority: editForm.priority,
      });
      toast.success('Support ticket updated');
      setIsEditing(false);
      setSelectedTicket({
        ...selectedTicket,
        title: editForm.title,
        description: editForm.description,
        category: editForm.category as SupportTicket['category'],
        priority: editForm.priority as SupportTicket['priority'],
      });
      // Refresh tickets
      fetchUserComplaints()
        .then((res: any) => {
          const complaints = (res.data || []).map((c: any) => ({
            id: c.complaint_id.toString(),
            userId: c.user_id?.toString() || '',
            userName: user ? `${user.firstname} ${user.lastname}` : 'User',
            title: c.subject,
            description: c.description,
            status: (c.status || 'open').toLowerCase(),
            priority: 'medium',
            category: 'general',
            createdAt: c.created_at,
            updatedAt: c.updated_at,
            responses: [],
          }));
          setTickets(complaints);
        });
    } catch {
      toast.error('Failed to update support ticket');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 bg-white dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-blue-700 dark:text-blue-300">Support Tickets</h1>
      <p className="mb-6 text-blue-600 dark:text-blue-200">Get help and support for your medical care</p>
      {/* Search & Filter Bar */}
      <div className="bg-gray-100 dark:bg-gray-800 rounded-xl shadow p-6 mb-8 border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1 flex items-center gap-2">
          <Search className="w-5 h-5 text-blue-500" />
                  <input
                    type="text"
            className="input input-bordered w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                    placeholder="Search tickets..."
                    value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-blue-500" />
                  <select
            className="select select-bordered bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                    value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                <select
            className="select select-bordered bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
                >
                  <option value="all">All Priority</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              {user?.role === 'doctor' && (
            <label className="flex items-center gap-2 ml-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showOnlyMyPatients}
                onChange={e => setShowOnlyMyPatients(e.target.checked)}
                className="checkbox checkbox-primary"
              />
              <span className="text-blue-600 dark:text-blue-300 text-sm">Show only my patients</span>
            </label>
          )}
        </div>
      </div>
      {/* Tickets List */}
      <div className="space-y-6">
        {tickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <MessageCircle className="w-16 h-16 text-blue-400 mb-4" />
            <div className="text-lg font-semibold text-blue-600 dark:text-blue-300 mb-2">No Support Tickets Found</div>
            <div className="text-blue-500 dark:text-blue-400">Create your first support ticket to get help</div>
          </div>
        ) : (
          tickets
            .filter(ticket =>
              (statusFilter === 'all' || ticket.status === statusFilter) &&
              (priorityFilter === 'all' || ticket.priority === priorityFilter) &&
              (!showOnlyMyPatients || doctorPatientIds.includes(ticket.userId)) &&
              (ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                ticket.description.toLowerCase().includes(searchTerm.toLowerCase()))
            )
            .map(ticket => (
              <div key={ticket.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow p-6 flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle className="w-5 h-5 text-blue-500" />
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{ticket.title}</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${ticket.status === 'open' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : ticket.status === 'resolved' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}>{ticket.status}</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${ticket.priority === 'urgent' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' : ticket.priority === 'high' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' : ticket.priority === 'medium' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}>{ticket.priority}</span>
                  </div>
                  <div className="text-gray-700 dark:text-gray-200 mb-2">{ticket.description}</div>
                  {user?.role === 'doctor' && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Patient: {ticket.userName} | Email: {ticket.patientEmail} | Phone: {ticket.patientPhone}</div>
                  )}
                  <div className="text-xs text-gray-400">Created: {new Date(ticket.createdAt).toLocaleString()}</div>
                </div>
                {/* Actions (e.g., view, respond, delete) can go here */}
                <div className="flex gap-2 mt-4">
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => {
                      setEditForm({
                        title: ticket.title,
                        description: ticket.description,
                        category: ticket.category,
                        priority: ticket.priority,
                      });
                      setSelectedTicket(ticket);
                      setIsEditing(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-error btn-sm"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this support ticket?')) {
                        handleDeleteTicket(ticket.id);
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
        )}
      </div>
      {/* Add Ticket Modal */}
      {isNewTicketModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 w-full max-w-lg relative">
            <button
              className="absolute top-4 right-4 btn btn-ghost btn-sm"
              onClick={() => setIsNewTicketModalOpen(false)}
              aria-label="Close New Ticket Modal"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4 text-blue-700 dark:text-blue-300">Create New Support Ticket</h2>
            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Title</label>
                <input
                  className="input input-bordered w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  value={newTicketForm.title}
                  onChange={e => setNewTicketForm({ ...newTicketForm, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Description</label>
                <textarea
                  className="textarea textarea-bordered w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  value={newTicketForm.description}
                  onChange={e => setNewTicketForm({ ...newTicketForm, description: e.target.value })}
                  required
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block font-medium mb-1">Category</label>
                  <select
                    className="select select-bordered w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                    value={newTicketForm.category}
                    onChange={e => setNewTicketForm({ ...newTicketForm, category: e.target.value })}
                  >
                    <option value="general">General</option>
                    <option value="technical">Technical</option>
                    <option value="billing">Billing</option>
                    <option value="appointment">Appointment</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block font-medium mb-1">Priority</label>
                  <select
                    className="select select-bordered w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                    value={newTicketForm.priority}
                    onChange={e => setNewTicketForm({ ...newTicketForm, priority: e.target.value })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setIsNewTicketModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Edit Ticket Modal */}
      {isEditing && selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 w-full max-w-lg relative">
            <button
              className="absolute top-4 right-4 btn btn-ghost btn-sm"
              onClick={() => setIsEditing(false)}
              aria-label="Close Edit Modal"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4 text-blue-700 dark:text-blue-300">Edit Support Ticket</h2>
            <form onSubmit={e => { e.preventDefault(); handleSaveEdit(); }} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Title</label>
                <input
                  className="input input-bordered w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  value={editForm.title}
                  onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Description</label>
                <textarea
                  className="textarea textarea-bordered w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  value={editForm.description}
                  onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                  required
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block font-medium mb-1">Category</label>
                  <select
                    className="select select-bordered w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                    value={editForm.category}
                    onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                  >
                    <option value="general">General</option>
                    <option value="technical">Technical</option>
                    <option value="billing">Billing</option>
                    <option value="appointment">Appointment</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block font-medium mb-1">Priority</label>
                  <select
                    className="select select-bordered w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                    value={editForm.priority}
                    onChange={e => setEditForm({ ...editForm, priority: e.target.value })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Add floating button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          className="btn btn-primary btn-lg rounded-full shadow-lg flex items-center gap-2"
          onClick={() => setIsNewTicketModalOpen(true)}
          aria-label="Add Support Ticket"
        >
          <Plus className="w-6 h-6" />
          New Ticket
        </button>
      </div>
    </div>
  );
};

export default SupportTickets;
