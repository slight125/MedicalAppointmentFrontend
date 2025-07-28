import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign, 
  Activity,
  Clock,
  FileText
} from 'lucide-react';
import {
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { fetchAdminSummaryAnalytics, fetchAdminBookingTrends, fetchAdminRevenueAnalytics, fetchAdminAppointmentStatus } from '../../utils/api';

interface AnalyticsData {
  totalUsers: number;
  totalDoctors: number;
  totalAppointments: number;
  totalRevenue: number;
  appointmentsToday: number;
  pendingAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  monthlyStats: {
    month: string;
    appointments: number;
    revenue: number;
    users: number;
  }[];
  appointmentsByStatus: {
    status: string;
    count: number;
    percentage: number;
  }[];
  revenueByMonth: {
    month: string;
    amount: number;
  }[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const AdminAnalytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [dateRange, setDateRange] = useState('30');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchAdminSummaryAnalytics(),
      fetchAdminBookingTrends(Number(dateRange)),
      fetchAdminRevenueAnalytics(Number(dateRange)),
      fetchAdminAppointmentStatus()
    ]).then(([summaryRes, bookingsRes, revenueRes, statusRes]) => {
      const summary = summaryRes.data;
      const bookings = bookingsRes.data;
      const revenue = revenueRes.data;
      const status = statusRes.data;
      setAnalyticsData({
        totalUsers: summary.totals.users,
        totalDoctors: summary.totals.doctors,
        totalAppointments: summary.totals.appointments,
        totalRevenue: summary.totals.revenue,
        appointmentsToday: bookings.length > 0 ? bookings[bookings.length - 1].count : 0,
        pendingAppointments: status.statusBreakdown?.find((s: any) => s.status === 'Pending')?.count || 0,
        completedAppointments: status.statusBreakdown?.find((s: any) => s.status === 'Completed')?.count || 0,
        cancelledAppointments: status.statusBreakdown?.find((s: any) => s.status === 'Cancelled')?.count || 0,
        monthlyStats: bookings.map((b: any) => ({
          month: b.date,
          appointments: b.count,
          revenue: revenue.dailyRevenue?.find((r: any) => r.date === b.date)?.revenue || 0,
          users: 0 // Not available in backend, set to 0 or fetch separately
        })),
        appointmentsByStatus: status.statusBreakdown?.map((s: any) => ({
          status: s.status,
          count: s.count,
          percentage: 0 // Not available, can be calculated if needed
        })) || [],
        revenueByMonth: revenue.dailyRevenue?.map((r: any) => ({
          month: r.date,
          amount: r.revenue
        })) || []
      });
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, [dateRange]);

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-base-content mb-2">No Data Available</h2>
          <p className="text-base-content/70">Unable to load analytics data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-base-content dark:text-gray-100 flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-primary" />
              Analytics Dashboard
            </h1>
            <p className="text-base-content/70 dark:text-gray-400 mt-2">
              Comprehensive insights into system performance and usage
            </p>
          </div>
          <div className="form-control">
            <select
              className="select select-bordered"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              title="Select date range"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-primary to-primary/80 bg-opacity-90 text-gray-900 dark:text-gray-100 dark:bg-gradient-to-br dark:from-blue-900 dark:to-blue-700 shadow-lg border border-gray-200 dark:border-gray-800">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold opacity-90 dark:text-gray-100">Total Users</h3>
                  <p className="text-3xl font-bold dark:text-gray-100">{analyticsData.totalUsers.toLocaleString()}</p>
                </div>
                <Users className="h-12 w-12 opacity-80" />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm opacity-90 dark:text-gray-200">+12% from last month</span>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-secondary to-secondary/80 bg-opacity-90 text-gray-900 dark:text-gray-100 dark:bg-gradient-to-br dark:from-purple-900 dark:to-purple-700 shadow-lg border border-gray-200 dark:border-gray-800">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold opacity-90 dark:text-gray-100">Total Appointments</h3>
                  <p className="text-3xl font-bold dark:text-gray-100">{analyticsData.totalAppointments.toLocaleString()}</p>
                </div>
                <Calendar className="h-12 w-12 opacity-80" />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Clock className="h-4 w-4" />
                <span className="text-sm opacity-90 dark:text-gray-200">{analyticsData.appointmentsToday} today</span>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-accent to-accent/80 bg-opacity-90 text-gray-900 dark:text-gray-100 dark:bg-gradient-to-br dark:from-green-900 dark:to-green-700 shadow-lg border border-gray-200 dark:border-gray-800">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold opacity-90 dark:text-gray-100">Total Revenue</h3>
                  <p className="text-3xl font-bold dark:text-gray-100">${analyticsData.totalRevenue.toLocaleString()}</p>
                </div>
                <DollarSign className="h-12 w-12 opacity-80" />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm opacity-90 dark:text-gray-200">+8% from last month</span>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-info to-info/80 bg-opacity-90 text-gray-900 dark:text-gray-100 dark:bg-gradient-to-br dark:from-cyan-900 dark:to-cyan-700 shadow-lg border border-gray-200 dark:border-gray-800">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold opacity-90 dark:text-gray-100">Active Doctors</h3>
                  <p className="text-3xl font-bold dark:text-gray-100">{analyticsData.totalDoctors}</p>
                </div>
                <Activity className="h-12 w-12 opacity-80" />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <FileText className="h-4 w-4" />
                <span className="text-sm opacity-90 dark:text-gray-200">All available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Appointment Status Distribution */}
          <div className="card bg-base-100 dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-800">
            <div className="card-body">
              <h3 className="text-xl font-bold text-base-content dark:text-gray-100 mb-4">Appointment Status Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analyticsData.appointmentsByStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ status, percentage }) => `${status}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {analyticsData.appointmentsByStatus.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly Revenue Trend */}
          <div className="card bg-base-100 dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-800">
            <div className="card-body">
              <h3 className="text-xl font-bold text-base-content dark:text-gray-100 mb-4">Monthly Revenue Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analyticsData.revenueByMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                  <Area type="monotone" dataKey="amount" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Monthly Statistics Table */}
        <div className="card bg-base-100 dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-800">
          <div className="card-body">
            <h3 className="text-xl font-bold text-base-content dark:text-gray-100 mb-4">Monthly Statistics</h3>
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Appointments</th>
                    <th>Revenue</th>
                    <th>New Users</th>
                    <th>Growth Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {analyticsData.monthlyStats.map((stat, index) => {
                    const prevStat = analyticsData.monthlyStats[index - 1];
                    const growthRate = prevStat 
                      ? ((stat.appointments - prevStat.appointments) / prevStat.appointments * 100).toFixed(1)
                      : 'N/A';
                    
                    return (
                      <tr key={stat.month}>
                        <td className="font-medium dark:text-gray-100">{stat.month}</td>
                        <td className="dark:text-gray-100">{stat.appointments}</td>
                        <td className="dark:text-gray-100">${stat.revenue.toLocaleString()}</td>
                        <td className="dark:text-gray-100">{stat.users}</td>
                        <td>
                          {growthRate !== 'N/A' && (
                            <span className={`badge ${parseFloat(growthRate) >= 0 ? 'badge-success dark:bg-green-700 dark:text-gray-100' : 'badge-error dark:bg-red-700 dark:text-gray-100'}`}>
                              {parseFloat(growthRate) >= 0 ? '+' : ''}{growthRate}%
                            </span>
                          )}
                          {growthRate === 'N/A' && <span className="text-base-content/50 dark:text-gray-500">-</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="card bg-base-100 dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-800">
            <div className="card-body text-center">
              <h3 className="text-lg font-semibold text-base-content dark:text-gray-100 mb-2">Pending Appointments</h3>
              <p className="text-3xl font-bold text-warning dark:text-yellow-400">{analyticsData.pendingAppointments}</p>
            </div>
          </div>
          <div className="card bg-base-100 dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-800">
            <div className="card-body text-center">
              <h3 className="text-lg font-semibold text-base-content dark:text-gray-100 mb-2">Completed Today</h3>
              <p className="text-3xl font-bold text-success dark:text-green-400">{analyticsData.completedAppointments}</p>
            </div>
          </div>
          <div className="card bg-base-100 dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-800">
            <div className="card-body text-center">
              <h3 className="text-lg font-semibold text-base-content dark:text-gray-100 mb-2">Cancelled</h3>
              <p className="text-3xl font-bold text-error dark:text-red-400">{analyticsData.cancelledAppointments}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
