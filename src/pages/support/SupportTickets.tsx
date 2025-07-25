import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../../store';
import { MessageCircle, Plus, Clock, CheckCircle, AlertCircle, Search, Filter } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { fetchUserComplaints, submitComplaint, deleteComplaint } from '../../utils/api';
import api from '../../utils/api';

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
}

const SupportTickets: React.FC = () => {
  const { user } = useAppSelector(state => state.auth);
  
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [newMessage, setNewMessage] = useState('');
  const [newTicketForm, setNewTicketForm] = useState<{
    title: string;
    description: string;
    category: 'technical' | 'billing' | 'appointment' | 'general';
    priority: 'low' | 'medium' | 'high' | 'urgent';
  }>({
    title: '',
    description: '',
    category: 'general',
    priority: 'medium'
  });

  // Edit ticket
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: '', description: '' });

  useEffect(() => {
    fetchUserComplaints()
      .then((res: any) => {
        // Map backend complaints to SupportTicket format
        const complaints = (res.data || []).map((c: any) => ({
          id: c.complaint_id.toString(),
          userId: c.user_id?.toString() || '',
          userName: user ? `${user.firstname} ${user.lastname}` : 'User',
          title: c.subject,
          description: c.description,
          status: (c.status || 'open').toLowerCase(),
          priority: c.priority || 'medium', // Not in backend, default
          category: c.category || 'general', // Not in backend, default
          createdAt: c.created_at,
          updatedAt: c.updated_at,
          responses: [], // Not in backend, can be extended
        }));
        setTickets(complaints);
      })
      .catch(() => {
        toast.error('Failed to load support tickets');
      });
  }, [user]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="h-4 w-4 text-error" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-warning" />;
      case 'resolved':
      case 'closed':
        return <CheckCircle className="h-4 w-4 text-success" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "badge badge-sm";
    switch (status) {
      case 'open':
        return `${baseClasses} badge-error`;
      case 'in-progress':
        return `${baseClasses} badge-warning`;
      case 'resolved':
        return `${baseClasses} badge-success`;
      case 'closed':
        return `${baseClasses} badge-neutral`;
      default:
        return baseClasses;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const baseClasses = "badge badge-sm badge-outline";
    switch (priority) {
      case 'urgent':
        return `${baseClasses} badge-error`;
      case 'high':
        return `${baseClasses} badge-warning`;
      case 'medium':
        return `${baseClasses} badge-info`;
      case 'low':
        return `${baseClasses} badge-neutral`;
      default:
        return baseClasses;
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleViewTicket = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTicket(null);
    setNewMessage('');
  };

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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTicket || !newMessage.trim()) return;
    
    try {
      // TODO: Replace with real API call
      const newResponse = {
        id: Date.now().toString(),
        message: newMessage,
        isStaff: false,
        timestamp: new Date().toISOString()
      };
      
      const updatedTicket = {
        ...selectedTicket,
        responses: [...selectedTicket.responses, newResponse],
        updatedAt: new Date().toISOString()
      };
      
      setSelectedTicket(updatedTicket);
      setTickets(tickets.map(t => t.id === selectedTicket.id ? updatedTicket : t));
      setNewMessage('');
      toast.success('Message sent successfully');
    } catch {
      toast.error('Failed to send message');
    }
  };

  // Delete ticket
  const handleDeleteTicket = async (ticketId: string) => {
    if (!window.confirm('Are you sure you want to delete this support ticket?')) return;
    try {
      await deleteComplaint(ticketId);
      toast.success('Support ticket deleted');
      setIsModalOpen(false);
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

  const handleEditTicket = () => {
    if (!selectedTicket) return;
    setEditForm({ title: selectedTicket.title, description: selectedTicket.description });
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedTicket) return;
    try {
      await api.patch(`/support/${selectedTicket.id}`, {
        subject: editForm.title,
        description: editForm.description,
      });
      toast.success('Support ticket updated');
      setIsEditing(false);
      setSelectedTicket({ ...selectedTicket, title: editForm.title, description: editForm.description });
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
    <div className="min-h-screen bg-base-100">
      <div className="w-full max-w-screen-2xl mx-auto px-6 lg:px-12 xl:px-16 2xl:px-20 py-6 lg:py-8 xl:py-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 lg:mb-12 xl:mb-16 gap-6 lg:gap-8">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-base-content flex items-center gap-4 lg:gap-6 mb-4 leading-tight">
              <MessageCircle className="h-8 w-8 lg:h-12 lg:w-12 xl:h-16 xl:w-16 text-primary" />
              Support Tickets
            </h1>
            <p className="text-base-content/70 text-lg lg:text-xl xl:text-2xl">
              Get help and support for your medical care
            </p>
          </div>
          <button
            onClick={() => setIsNewTicketModalOpen(true)}
            className="btn btn-primary gap-3 px-8 lg:px-10 py-4 lg:py-5 text-xl lg:text-2xl w-full lg:w-auto"
          >
            <Plus className="h-6 w-6 lg:h-7 lg:w-7" />
            New Ticket
          </button>
        </div>

        {/* Search and Filters */}
        <div className="card bg-base-200 shadow-lg mb-8 lg:mb-12 border border-gray-100">
          <div className="card-body p-6 lg:p-8 xl:p-10">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 xl:gap-10">
              <div className="form-control flex-1">
                <div className="input-group">
                  <span className="px-4 lg:px-6">
                    <Search className="h-6 w-6 lg:h-7 lg:w-7" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search tickets..."
                    className="input input-bordered w-full text-lg lg:text-xl py-4"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="form-control">
                <div className="input-group">
                  <span className="px-4 lg:px-6">
                    <Filter className="h-6 w-6 lg:h-7 lg:w-7" />
                  </span>
                  <select
                    className="select select-bordered text-lg lg:text-xl py-4"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    title="Filter by status"
                  >
                    <option value="all">All Status</option>
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
              
              <div className="form-control">
                <select
                  className="select select-bordered"
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  title="Filter by priority"
                >
                  <option value="all">All Priority</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Tickets List */}
        <div className="grid gap-4">
          {filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              className="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => handleViewTicket(ticket)}
            >
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(ticket.status)}
                      <h3 className="text-lg font-semibold text-base-content">
                        {ticket.title}
                      </h3>
                      <span className={getStatusBadge(ticket.status)}>
                        {ticket.status.replace('-', ' ')}
                      </span>
                      <span className={getPriorityBadge(ticket.priority)}>
                        {ticket.priority}
                      </span>
                    </div>
                    <p className="text-base-content/70 mb-3 line-clamp-2">
                      {ticket.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-base-content/60">
                      <span>#{ticket.id}</span>
                      <span>{ticket.category}</span>
                      <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                      {ticket.responses.length > 0 && (
                        <span>{ticket.responses.length} response{ticket.responses.length !== 1 ? 's' : ''}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredTickets.length === 0 && (
            <div className="text-center py-12">
              <MessageCircle className="h-16 w-16 text-base-content/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-base-content/70 mb-2">
                No Support Tickets Found
              </h3>
              <p className="text-base-content/50">
                {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                  ? 'Try adjusting your search criteria'
                  : 'Create your first support ticket to get help'}
              </p>
            </div>
          )}
        </div>

        {/* View Ticket Modal */}
        {isModalOpen && selectedTicket && (
          <div className="modal modal-open">
            <div className="modal-box max-w-4xl max-h-screen">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    {getStatusIcon(selectedTicket.status)}
                    {isEditing ? (
                      <input
                        className="input input-bordered text-lg font-bold"
                        value={editForm.title}
                        onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                      />
                    ) : (
                      selectedTicket.title
                    )}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={getStatusBadge(selectedTicket.status)}>
                      {selectedTicket.status.replace('-', ' ')}
                    </span>
                    <span className={getPriorityBadge(selectedTicket.priority)}>
                      {selectedTicket.priority}
                    </span>
                    <span className="badge badge-ghost badge-sm">
                      {selectedTicket.category}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => handleDeleteTicket(selectedTicket.id)}
                  >
                    Delete
                  </button>
                  {isEditing ? (
                    <button
                      className="btn btn-sm btn-success"
                      onClick={handleSaveEdit}
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      className="btn btn-sm btn-info"
                      onClick={handleEditTicket}
                    >
                      Edit
                    </button>
                  )}
                  <button
                    className="btn btn-sm btn-ghost"
                    onClick={() => { setIsEditing(false); handleCloseModal(); }}
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="divider"></div>

              {/* Original Message */}
              <div className="mb-6">
                <div className="chat chat-start">
                  <div className="chat-header">
                    {selectedTicket.userName}
                    <time className="text-xs opacity-50 ml-2">
                      {new Date(selectedTicket.createdAt).toLocaleString()}
                    </time>
                  </div>
                 {isEditing ? (
                   <textarea
                     className="textarea textarea-bordered w-full"
                     value={editForm.description}
                     onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                   />
                 ) : (
                   <div className="chat-bubble chat-bubble-primary">
                     {selectedTicket.description}
                   </div>
                 )}
                </div>
              </div>

              {/* Responses */}
              <div className="max-h-96 overflow-y-auto mb-4">
                {selectedTicket.responses.map((response) => (
                  <div
                    key={response.id}
                    className={`chat ${response.isStaff ? 'chat-end' : 'chat-start'}`}
                  >
                    <div className="chat-header">
                      {response.isStaff ? response.staffName : selectedTicket.userName}
                      <time className="text-xs opacity-50 ml-2">
                        {new Date(response.timestamp).toLocaleString()}
                      </time>
                    </div>
                    <div className={`chat-bubble ${response.isStaff ? 'chat-bubble-secondary' : 'chat-bubble-primary'}`}>
                      {response.message}
                    </div>
                  </div>
                ))}
              </div>

              {/* Send Message Form */}
              {selectedTicket.status !== 'closed' && (
                <form onSubmit={handleSendMessage} className="mt-4">
                  <div className="form-control">
                    <textarea
                      className="textarea textarea-bordered h-24"
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      required
                    />
                  </div>
                  <div className="modal-action">
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={handleCloseModal}
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={!newMessage.trim()}
                    >
                      Send Message
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* New Ticket Modal */}
        {isNewTicketModalOpen && (
          <div className="modal modal-open">
            <div className="modal-box max-w-2xl bg-white dark:bg-gray-900 rounded-lg shadow-2xl p-8">
              <h3 className="font-bold text-lg mb-4 text-gray-700 dark:text-gray-100">Create New Support Ticket</h3>
              <form onSubmit={handleCreateTicket} className="space-y-0">
                <div className="form-control flex flex-col mb-4">
                  <label className="label mb-2">
                    <span className="label-text text-gray-700 dark:text-gray-200 font-medium">Title</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered border border-gray-300 focus:border-blue-600 dark:border-gray-700 dark:focus:border-blue-400 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md px-4 py-2 w-full"
                    placeholder="Brief description of your issue"
                    value={newTicketForm.title}
                    onChange={(e) => setNewTicketForm({ ...newTicketForm, title: e.target.value })}
                    required
                  />
                </div>
                <div className="form-control flex flex-col mb-4">
                  <label className="label mb-2">
                    <span className="label-text text-gray-700 dark:text-gray-200 font-medium">Category</span>
                  </label>
                  <select
                    className="select select-bordered border border-gray-300 focus:border-blue-600 dark:border-gray-700 dark:focus:border-blue-400 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md px-4 py-2 w-full"
                    value={newTicketForm.category}
                    onChange={(e) => setNewTicketForm({ ...newTicketForm, category: e.target.value as 'technical' | 'billing' | 'appointment' | 'general' })}
                    title="Select category"
                  >
                    <option value="general">General</option>
                    <option value="technical">Technical Issue</option>
                    <option value="billing">Billing</option>
                    <option value="appointment">Appointment</option>
                  </select>
                </div>
                <div className="form-control flex flex-col mb-4">
                  <label className="label mb-2">
                    <span className="label-text text-gray-700 dark:text-gray-200 font-medium">Priority</span>
                  </label>
                  <select
                    className="select select-bordered border border-gray-300 focus:border-blue-600 dark:border-gray-700 dark:focus:border-blue-400 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md px-4 py-2 w-full"
                    value={newTicketForm.priority}
                    onChange={(e) => setNewTicketForm({ ...newTicketForm, priority: e.target.value as 'low' | 'medium' | 'high' | 'urgent' })}
                    title="Select priority"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div className="form-control flex flex-col mb-4">
                  <label className="label mb-2">
                    <span className="label-text text-gray-700 dark:text-gray-200 font-medium">Description</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered h-32 border border-gray-300 focus:border-blue-600 dark:border-gray-700 dark:focus:border-blue-400 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md px-4 py-2 w-full"
                    placeholder="Provide detailed information about your issue..."
                    value={newTicketForm.description}
                    onChange={(e) => setNewTicketForm({ ...newTicketForm, description: e.target.value })}
                    required
                  />
                </div>
                <div className="modal-action flex justify-end gap-4">
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
      </div>
    </div>
  );
};

export default SupportTickets;
