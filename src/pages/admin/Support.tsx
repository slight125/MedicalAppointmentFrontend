import React, { useState, useEffect } from 'react';
import { Mail, User, CheckCircle, XCircle } from 'lucide-react';

interface Ticket {
  id: string;
  subject: string;
  user: string;
  email: string;
  status: 'open' | 'closed' | 'pending';
  createdAt: string;
  messages: { sender: string; message: string; time: string }[];
}

const mockTickets: Ticket[] = [
  {
    id: '1',
    subject: 'Unable to login',
    user: 'John Doe',
    email: 'john.doe@example.com',
    status: 'open',
    createdAt: '2025-07-20',
    messages: [
      { sender: 'John Doe', message: 'I cannot login to my account.', time: '2025-07-20 10:00' },
      { sender: 'Admin', message: 'We are looking into it.', time: '2025-07-20 10:30' }
    ]
  },
  {
    id: '2',
    subject: 'Prescription not received',
    user: 'Jane Smith',
    email: 'jane.smith@example.com',
    status: 'pending',
    createdAt: '2025-07-19',
    messages: [
      { sender: 'Jane Smith', message: 'I did not get my prescription.', time: '2025-07-19 09:00' }
    ]
  }
];

const AdminSupport: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [reply, setReply] = useState('');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => setTickets(mockTickets), 500);
  }, []);

  const handleReply = () => {
    if (selectedTicket && reply.trim()) {
      const updated = tickets.map(t =>
        t.id === selectedTicket.id
          ? { ...t, messages: [...t.messages, { sender: 'Admin', message: reply, time: new Date().toISOString() }] }
          : t
      );
      setTickets(updated);
      setSelectedTicket({ ...selectedTicket, messages: [...selectedTicket.messages, { sender: 'Admin', message: reply, time: new Date().toISOString() }] });
      setReply('');
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Support Tickets</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold mb-4">Tickets</h2>
          <ul className="space-y-4">
            {tickets.map(ticket => (
              <li key={ticket.id} className={`border rounded-lg p-4 cursor-pointer ${selectedTicket?.id === ticket.id ? 'bg-blue-50' : 'bg-white'}`} onClick={() => setSelectedTicket(ticket)}>
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4" />
                  <span className="font-medium">{ticket.user}</span>
                  <Mail className="w-4 h-4 ml-2" />
                  <span className="text-xs text-gray-500">{ticket.email}</span>
                </div>
                <div className="font-semibold">{ticket.subject}</div>
                <div className="text-xs text-gray-400">{ticket.createdAt}</div>
                <div className="mt-2">
                  {ticket.status === 'open' && <span className="text-green-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Open</span>}
                  {ticket.status === 'pending' && <span className="text-yellow-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Pending</span>}
                  {ticket.status === 'closed' && <span className="text-red-600 flex items-center gap-1"><XCircle className="w-3 h-3" /> Closed</span>}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div>
          {selectedTicket ? (
            <div>
              <h2 className="text-lg font-semibold mb-2">Conversation</h2>
              <div className="border rounded-lg p-4 mb-4 bg-gray-50">
                {selectedTicket.messages.map((msg, idx) => (
                  <div key={idx} className="mb-2">
                    <span className="font-bold text-blue-700">{msg.sender}:</span> <span>{msg.message}</span>
                    <div className="text-xs text-gray-400">{msg.time}</div>
                  </div>
                ))}
              </div>
              <textarea
                className="w-full border rounded p-2 mb-2"
                rows={3}
                value={reply}
                onChange={e => setReply(e.target.value)}
                placeholder="Type your reply..."
              />
              <button className="btn btn-primary" onClick={handleReply}>Send Reply</button>
            </div>
          ) : (
            <div className="text-gray-500">Select a ticket to view and reply.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSupport;
