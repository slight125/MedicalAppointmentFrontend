import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie,
  Cell, Legend, LineChart, Line, CartesianGrid, AreaChart, Area
} from "recharts";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import api from "../../utils/api";

const COLORS = ["#6366f1", "#22d3ee", "#f59e42", "#f43f5e", "#10b981", "#eab308"];

interface AnalyticsData {
  appointments: any[];
  payments: any[];
  revenue: any[];
  userGrowth: any[];
}

const AdminAnalytics: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
    key: "selection"
  });
  const [loading, setLoading] = useState(true);
  const [topDoctors, setTopDoctors] = useState<any[]>([]);
  const [topDiagnoses, setTopDiagnoses] = useState<any[]>([]);
  const [revenueByDoctor, setRevenueByDoctor] = useState<any[]>([]);
  const [ticketResolution, setTicketResolution] = useState<{ averageHours: number, count: number } | null>(null);

  useEffect(() => {
    fetchAnalyticsData();
    api.get('/admin/analytics/top-doctors')
      .then(res => setTopDoctors(res.data.map((doc: any) => ({ ...doc, fullName: `${doc.first_name} ${doc.last_name}` }))))
      .catch(() => setTopDoctors([]));
    api.get('/admin/analytics/top-diagnoses')
      .then(res => setTopDiagnoses(res.data))
      .catch(() => setTopDiagnoses([]));
    api.get('/admin/analytics/revenue-by-doctor')
      .then(res => setRevenueByDoctor(res.data.map((doc: any) => ({ ...doc, fullName: `${doc.first_name} ${doc.last_name}` })))); // No .catch() needed
    api.get('/admin/analytics/ticket-resolution-time')
      .then(res => setTicketResolution(res.data))
      .catch(() => setTicketResolution(null));
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    try {
      const [appointments, payments, revenue, userGrowth] = await Promise.all([
        api.get(`/admin/analytics/appointments?start=${dateRange.startDate.toISOString()}&end=${dateRange.endDate.toISOString()}`),
        api.get(`/admin/analytics/payments?start=${dateRange.startDate.toISOString()}&end=${dateRange.endDate.toISOString()}`),
        api.get(`/admin/analytics/revenue?start=${dateRange.startDate.toISOString()}&end=${dateRange.endDate.toISOString()}`),
        api.get(`/admin/analytics/user-growth?start=${dateRange.startDate.toISOString()}&end=${dateRange.endDate.toISOString()}`)
      ]);

      setData({
        appointments: appointments.data,
        payments: payments.data,
        revenue: revenue.data,
        userGrowth: userGrowth.data
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await api.get(`/admin/analytics/export?start=${dateRange.startDate.toISOString()}&end=${dateRange.endDate.toISOString()}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'analytics-report.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error exporting analytics:", error);
    }
  };

  if (loading) {
    return <div>Loading analytics...</div>;
  }

  return (
    <div className="min-h-screen bg-base-200 dark:bg-gray-900 py-8 px-4 md:px-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary dark:text-blue-400">Analytics Dashboard</h1>
          <button
            onClick={handleExport}
            className="btn btn-primary"
          >
            Export Report
          </button>
        </div>

        <div className="bg-base-100 dark:bg-gray-900 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-800">
          <DateRangePicker
            ranges={[dateRange]}
            onChange={(item: any) => setDateRange(item.selection)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Appointments Chart */}
          <div className="bg-base-100 dark:bg-white/5 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Appointments Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data?.appointments}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="count" fill="#6366f1" stroke="#4F46E5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue Chart */}
          <div className="bg-base-100 dark:bg-white/5 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Revenue Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data?.revenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="#10b981" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Payment Status */}
          <div className="bg-base-100 dark:bg-white/5 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Payment Status</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data?.payments}
                  dataKey="value"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {data?.payments.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* User Growth */}
          <div className="bg-base-100 dark:bg-white/5 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">User Growth</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data?.userGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#f59e42" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Doctors by Appointments */}
          <div className="bg-base-100 dark:bg-white/5 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Top Doctors by Appointments</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topDoctors} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" dataKey="appointmentCount" />
                <YAxis type="category" dataKey="fullName" width={150} />
                <Tooltip />
                <Bar dataKey="appointmentCount" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-base-100 dark:bg-white/5 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Most Common Diagnoses</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topDiagnoses} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" dataKey="count" />
                <YAxis type="category" dataKey="diagnosis" width={200} />
                <Tooltip />
                <Bar dataKey="count" fill="#22d3ee" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-base-100 dark:bg-white/5 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Revenue by Doctor</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueByDoctor} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" dataKey="revenue" />
                <YAxis type="category" dataKey="fullName" width={150} />
                <Tooltip />
                <Bar dataKey="revenue" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-base-100 dark:bg-white/5 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Ticket Resolution Time</h2>
            {ticketResolution ? (
              <div className="text-lg font-bold text-blue-700 dark:text-blue-400">
                Average Resolution Time: {ticketResolution.averageHours.toFixed(2)} hours ({ticketResolution.count} tickets)
              </div>
            ) : (
              <div className="text-gray-400 dark:text-gray-500">No data available.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;