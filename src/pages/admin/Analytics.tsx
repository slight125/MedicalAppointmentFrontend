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

const AdminAnalytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [dateRange, setDateRange] = useState('30');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock analytics data for development
    const mockData: AnalyticsData = {
      totalUsers: 1234,
      totalDoctors: 45,
      totalAppointments: 2890,
      totalRevenue: 145600,
      appointmentsToday: 23,
      pendingAppointments: 45,
      completedAppointments: 2678,
      cancelledAppointments: 167,
      monthlyStats: [
        { month: 'Jan 2024', appointments: 245, revenue: 12300, users: 89 },
        { month: 'Feb 2024', appointments: 289, revenue: 14500, users: 102 },
        { month: 'Mar 2024', appointments: 324, revenue: 16200, users: 118 },
        { month: 'Apr 2024', appointments: 298, revenue: 14900, users: 95 },
        { month: 'May 2024', appointments: 356, revenue: 17800, users: 134 },
        { month: 'Jun 2024', appointments: 387, revenue: 19350, users: 156 }
      ],
      appointmentsByStatus: [
        { status: 'Completed', count: 2678, percentage: 87.2 },
        { status: 'Cancelled', count: 167, percentage: 5.8 },
        { status: 'Pending', count: 45, percentage: 1.6 },
        { status: 'In Progress', count: 156, percentage: 5.4 }
      ],
      revenueByMonth: [
        { month: 'Jan', amount: 12300 },
        { month: 'Feb', amount: 14500 },
        { month: 'Mar', amount: 16200 },
        { month: 'Apr', amount: 14900 },
        { month: 'May', amount: 17800 },
        { month: 'Jun', amount: 19350 }
      ]
    };

    // Simulate API call
    setTimeout(() => {
      setAnalyticsData(mockData);
      setLoading(false);
    }, 1000);
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
    <div className="min-h-screen bg-base-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-base-content flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-primary" />
              Analytics Dashboard
            </h1>
            <p className="text-base-content/70 mt-2">
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
          <div className="card bg-gradient-to-br from-primary to-primary/80 text-primary-content shadow-lg">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold opacity-90">Total Users</h3>
                  <p className="text-3xl font-bold">{analyticsData.totalUsers.toLocaleString()}</p>
                </div>
                <Users className="h-12 w-12 opacity-80" />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm opacity-90">+12% from last month</span>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-secondary to-secondary/80 text-secondary-content shadow-lg">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold opacity-90">Total Appointments</h3>
                  <p className="text-3xl font-bold">{analyticsData.totalAppointments.toLocaleString()}</p>
                </div>
                <Calendar className="h-12 w-12 opacity-80" />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Clock className="h-4 w-4" />
                <span className="text-sm opacity-90">{analyticsData.appointmentsToday} today</span>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-success to-success/80 text-success-content shadow-lg">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold opacity-90">Total Revenue</h3>
                  <p className="text-3xl font-bold">${analyticsData.totalRevenue.toLocaleString()}</p>
                </div>
                <DollarSign className="h-12 w-12 opacity-80" />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm opacity-90">+8% from last month</span>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-info to-info/80 text-info-content shadow-lg">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold opacity-90">Active Doctors</h3>
                  <p className="text-3xl font-bold">{analyticsData.totalDoctors}</p>
                </div>
                <Activity className="h-12 w-12 opacity-80" />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <FileText className="h-4 w-4" />
                <span className="text-sm opacity-90">All available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Appointment Status Distribution */}
          <div className="card bg-base-200 shadow-lg">
            <div className="card-body">
              <h3 className="text-xl font-bold text-base-content mb-4">Appointment Status Distribution</h3>
              <div className="space-y-4">
                {analyticsData.appointmentsByStatus.map((status, index) => (
                  <div key={status.status} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className={`w-4 h-4 rounded-full ${
                          index === 0 ? 'bg-success' :
                          index === 1 ? 'bg-error' :
                          index === 2 ? 'bg-warning' : 'bg-info'
                        }`}
                      ></div>
                      <span className="font-medium">{status.status}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold">{status.count}</span>
                      <span className="text-sm text-base-content/70 ml-2">({status.percentage}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Monthly Revenue Trend */}
          <div className="card bg-base-200 shadow-lg">
            <div className="card-body">
              <h3 className="text-xl font-bold text-base-content mb-4">Monthly Revenue Trend</h3>
              <div className="space-y-3">
                {analyticsData.revenueByMonth.map((month) => {
                  const maxRevenue = Math.max(...analyticsData.revenueByMonth.map(m => m.amount));
                  const percentage = (month.amount / maxRevenue) * 100;
                  
                  return (
                    <div key={month.month} className="flex items-center gap-3">
                      <span className="text-sm font-medium w-8">{month.month}</span>
                      <div className="flex-1 bg-base-300 rounded-full h-4 relative">
                        <div 
                          className="bg-primary h-4 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold w-16 text-right">
                        ${month.amount.toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Statistics Table */}
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body">
            <h3 className="text-xl font-bold text-base-content mb-4">Monthly Statistics</h3>
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
                        <td className="font-medium">{stat.month}</td>
                        <td>{stat.appointments}</td>
                        <td>${stat.revenue.toLocaleString()}</td>
                        <td>{stat.users}</td>
                        <td>
                          {growthRate !== 'N/A' && (
                            <span className={`badge ${parseFloat(growthRate) >= 0 ? 'badge-success' : 'badge-error'}`}>
                              {parseFloat(growthRate) >= 0 ? '+' : ''}{growthRate}%
                            </span>
                          )}
                          {growthRate === 'N/A' && <span className="text-base-content/50">-</span>}
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
          <div className="card bg-base-200 shadow-lg">
            <div className="card-body text-center">
              <h4 className="text-lg font-semibold text-base-content mb-2">Pending Appointments</h4>
              <p className="text-3xl font-bold text-warning">{analyticsData.pendingAppointments}</p>
              <p className="text-sm text-base-content/70">Requiring attention</p>
            </div>
          </div>

          <div className="card bg-base-200 shadow-lg">
            <div className="card-body text-center">
              <h4 className="text-lg font-semibold text-base-content mb-2">Completed Today</h4>
              <p className="text-3xl font-bold text-success">{analyticsData.appointmentsToday}</p>
              <p className="text-sm text-base-content/70">Appointments finished</p>
            </div>
          </div>

          <div className="card bg-base-200 shadow-lg">
            <div className="card-body text-center">
              <h4 className="text-lg font-semibold text-base-content mb-2">Success Rate</h4>
              <p className="text-3xl font-bold text-primary">
                {((analyticsData.completedAppointments / analyticsData.totalAppointments) * 100).toFixed(1)}%
              </p>
              <p className="text-sm text-base-content/70">Completion rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
