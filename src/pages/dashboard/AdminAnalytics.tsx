import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie,
  Cell, Legend, LineChart, Line, CartesianGrid, AreaChart, Area
} from "recharts";
import { DateRangePicker } from "@types/react-date-range";
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
  const [activeChart, setActiveChart] = useState("appointments");

  useEffect(() => {
    fetchAnalyticsData();
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
    <div className="min-h-screen bg-base-200 py-8 px-4 md:px-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary">Analytics Dashboard</h1>
          <button
            onClick={handleExport}
            className="btn btn-primary"
          >
            Export Report
          </button>
        </div>

        <div className="bg-base-100 rounded-xl p-4 shadow-lg">
          <DateRangePicker
            ranges={[dateRange]}
            onChange={item => setDateRange(item.selection)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Appointments Chart */}
          <div className="bg-base-100 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Appointments Trend</h2>
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
          <div className="bg-base-100 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Revenue Overview</h2>
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
          <div className="bg-base-100 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Payment Status</h2>
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
                  {data?.payments.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* User Growth */}
          <div className="bg-base-100 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">User Growth</h2>
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
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;