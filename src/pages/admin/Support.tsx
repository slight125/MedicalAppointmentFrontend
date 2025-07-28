import React, { useState, useEffect } from 'react';
import { Mail, User, CheckCircle, XCircle } from 'lucide-react';
import { fetchAdminComplaints, deleteComplaint, updateComplaintStatus, fetchComplaintMessages, addComplaintMessage } from '../../utils/api';

interface Ticket {
  id: string;
  subject: string;
  user: string;
  email: string;
  status: string; // allow any status string from backend
  createdAt: string;
  messages: { sender: string; message: string; time: string }[];
  description?: string; // Added for ticket subject and description
}

const AdminSupport: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  // No pagination
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [reply, setReply] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadTickets() {
      try {
        const res = await fetchAdminComplaints();
        // If paginated, use res.data.complaints; else, use res.data or res
        const backendTickets = res.data.complaints || res.data || res;
        setTickets(backendTickets.map((t: any) => ({
          id: t.complaint_id, // always use integer complaint_id
          subject: t.subject || '',
          user: t.user_name || t.user || '',
          email: t.user_email || t.email || '',
          status: t.status || 'open',
          createdAt: t.created_at || t.createdAt || '',
          messages: t.messages || [],
          description: t.description || '' // Assuming description is part of the backend response
        })));
      } catch {
        setTickets([]);
      }
    }
    loadTickets();
  }, []);

  // Fetch messages when a ticket is selected
  useEffect(() => {
    if (selectedTicket) {
      setLoadingMessages(true);
      fetchComplaintMessages(selectedTicket.id)
        .then(res => setMessages(res.data))
        .catch(() => setMessages([]))
        .finally(() => setLoadingMessages(false));
    } else {
      setMessages([]);
    }
  }, [selectedTicket]);

  const handleReply = async () => {
    if (selectedTicket && reply.trim()) {
      try {
        await addComplaintMessage(selectedTicket.id, reply);
        setReply('');
        // Refresh messages
        const res = await fetchComplaintMessages(selectedTicket.id);
        setMessages(res.data);
      } catch {}
    }
  };

  const handleDeleteTicket = async (ticketId: string) => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      try {
        await deleteComplaint(ticketId);
        setTickets(tickets.filter(t => t.id !== ticketId));
      } catch {
        // handle error
      }
    }
  };

  // Filter tickets by search
  const filteredTickets = tickets.filter(ticket => {
    const q = search.toLowerCase();
    return (
      ticket.subject.toLowerCase().includes(q) ||
      ticket.user.toLowerCase().includes(q) ||
      ticket.email.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 dark:text-gray-100">Support Tickets</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="mb-4 flex flex-col gap-2">
            <h2 className="text-lg font-semibold dark:text-gray-100">Tickets</h2>
            <input
              type="text"
              className="input input-bordered input-sm w-full max-w-xs dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700"
              placeholder="Search by subject, user, or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <ul className="space-y-4 overflow-y-auto" style={{ maxHeight: 500 }}>
            {filteredTickets.map(ticket => (
              <li key={ticket.id} className={`border rounded-lg p-4 cursor-pointer ${selectedTicket?.id === ticket.id ? 'bg-blue-50 dark:bg-blue-900/30' : 'bg-white dark:bg-gray-900'} border-gray-200 dark:border-gray-700`} onClick={() => setSelectedTicket(ticket)}>
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-gray-700 dark:text-gray-200" />
                  <span className="font-medium dark:text-gray-100">{ticket.user}</span>
                  <Mail className="w-4 h-4 ml-2 text-gray-700 dark:text-gray-200" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">{ticket.email}</span>
                  <select
                    value={ticket.status}
                    onChange={async (e) => {
                      try {
                        await updateComplaintStatus(ticket.id, e.target.value);
                        setTickets(tickets.map(t => t.id === ticket.id ? { ...t, status: e.target.value } : t));
                      } catch {}
                    }}
                    className="ml-2 select select-xs select-bordered dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700"
                    style={{ minWidth: 90 }}
                  >
                    <option value="open">Open</option>
                    <option value="pending">Pending</option>
                    <option value="closed">Closed</option>
                    <option value="resolved">Resolved</option>
                  </select>
                  <button
                    className="ml-auto btn btn-xs btn-error"
                    onClick={e => { e.stopPropagation(); handleDeleteTicket(ticket.id); }}
                    title="Delete ticket"
                  >
                    Delete
                  </button>
                </div>
                <div className="font-semibold dark:text-gray-100">{ticket.subject}</div>
                <div className="text-xs text-gray-400 dark:text-gray-500">{ticket.createdAt}</div>
                <div className="mt-2">
                  {ticket.status === 'open' && <span className="text-green-600 dark:text-green-400 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Open</span>}
                  {ticket.status === 'pending' && <span className="text-yellow-600 dark:text-yellow-400 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Pending</span>}
                  {ticket.status === 'closed' && <span className="text-red-600 dark:text-red-400 flex items-center gap-1"><XCircle className="w-3 h-3" /> Closed</span>}
                  {ticket.status === 'resolved' && <span className="text-blue-600 dark:text-blue-400 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Resolved</span>}
                </div>
              </li>
            ))}
          </ul>
          {/* No pagination controls */}
        </div>
        <div>
          {selectedTicket ? (
            <div className="flex flex-col h-full">
              <h2 className="text-lg font-semibold mb-2 dark:text-gray-100">Conversation</h2>
              {/* Ticket subject and description */}
              <div className="mb-2 p-2 rounded bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700">
                <div className="font-bold text-blue-900 dark:text-blue-200">{selectedTicket.subject}</div>
                {selectedTicket.description && (
                  <div className="text-gray-700 dark:text-gray-300 mt-1">{selectedTicket.description}</div>
                )}
              </div>
              <div className="border rounded-lg p-4 mb-4 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 flex-1 overflow-y-auto" style={{ minHeight: 120, maxHeight: 250 }}>
                {loadingMessages ? (
                  <div className="dark:text-gray-200">Loading messages...</div>
                ) : messages.length === 0 ? (
                  <div className="text-gray-400 dark:text-gray-500">No messages yet.</div>
                ) : messages.map((msg, idx) => (
                  <div key={idx} className="mb-2">
                    <span className="font-bold text-blue-700 dark:text-blue-400">{msg.sender_role || 'User'}:</span> <span className="dark:text-gray-100">{msg.message}</span>
                    <div className="text-xs text-gray-400 dark:text-gray-500">{new Date(msg.created_at).toLocaleString()}</div>
                  </div>
                ))}
              </div>
              <div className="mt-2">
                <textarea
                  className="w-full border rounded p-2 mb-2 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700"
                  rows={3}
                  value={reply}
                  onChange={e => setReply(e.target.value)}
                  placeholder="Type your reply..."
                />
                <button className="btn btn-primary" onClick={handleReply}>Send Reply</button>
              </div>
            </div>
          ) : (
            <div className="text-gray-500 dark:text-gray-400">Select a ticket to view and reply.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSupport;
