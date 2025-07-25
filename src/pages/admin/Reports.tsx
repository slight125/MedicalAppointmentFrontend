import React, { useState, useEffect } from 'react';
import { FileText, Download, Calendar, Filter, TrendingUp, Users, DollarSign } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { downloadReport } from '../../utils/api';

interface ReportData {
  id: string;
  title: string;
  description: string;
  type: 'appointments' | 'users' | 'revenue' | 'prescriptions' | 'analytics';
  generatedAt: string;
  dataCount: number;
  status: 'ready' | 'generating' | 'failed';
}

const AdminReports: React.FC = () => {
  const [reports, setReports] = useState<ReportData[]>([]);
  const [selectedReportType, setSelectedReportType] = useState<string>('all');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock reports data for development
    const mockReports: ReportData[] = [
      {
        id: '1',
        title: 'Monthly Appointments Report',
        description: 'Comprehensive report of all appointments for the current month',
        type: 'appointments',
        generatedAt: '2024-03-11T10:30:00Z',
        dataCount: 1245,
        status: 'ready'
      },
      {
        id: '2',
        title: 'User Registration Analytics',
        description: 'Analysis of new user registrations and demographics',
        type: 'users',
        generatedAt: '2024-03-10T15:45:00Z',
        dataCount: 89,
        status: 'ready'
      },
      {
        id: '3',
        title: 'Revenue Report - Q1 2024',
        description: 'Financial summary and revenue breakdown for Q1',
        type: 'revenue',
        generatedAt: '2024-03-08T09:15:00Z',
        dataCount: 456,
        status: 'ready'
      },
      {
        id: '4',
        title: 'Prescription Analytics',
        description: 'Prescription patterns and medication analysis',
        type: 'prescriptions',
        generatedAt: '2024-03-05T14:20:00Z',
        dataCount: 789,
        status: 'ready'
      },
      {
        id: '5',
        title: 'System Usage Analytics',
        description: 'Overall platform usage and performance metrics',
        type: 'analytics',
        generatedAt: '2024-03-01T11:00:00Z',
        dataCount: 2340,
        status: 'generating'
      }
    ];

    // Simulate API call
    setTimeout(() => {
      setReports(mockReports);
      setLoading(false);
    }, 1000);
  }, []);

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'appointments':
        return <Calendar className="h-5 w-5" />;
      case 'users':
        return <Users className="h-5 w-5" />;
      case 'revenue':
        return <DollarSign className="h-5 w-5" />;
      case 'prescriptions':
        return <FileText className="h-5 w-5" />;
      case 'analytics':
        return <TrendingUp className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case 'appointments':
        return 'text-primary';
      case 'users':
        return 'text-secondary';
      case 'revenue':
        return 'text-success';
      case 'prescriptions':
        return 'text-warning';
      case 'analytics':
        return 'text-info';
      default:
        return 'text-base-content';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return 'badge badge-success badge-sm';
      case 'generating':
        return 'badge badge-warning badge-sm';
      case 'failed':
        return 'badge badge-error badge-sm';
      default:
        return 'badge badge-neutral badge-sm';
    }
  };

  const filteredReports = reports.filter(report => 
    selectedReportType === 'all' || report.type === selectedReportType
  );

  const handleGenerateReport = async (type: string) => {
    setIsGenerating(true);
    
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newReport: ReportData = {
        id: Date.now().toString(),
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} Report`,
        description: `Generated report for ${type} data`,
        type: type as 'appointments' | 'users' | 'revenue' | 'prescriptions' | 'analytics',
        generatedAt: new Date().toISOString(),
        dataCount: Math.floor(Math.random() * 1000) + 100,
        status: 'ready'
      };
      
      setReports([newReport, ...reports]);
      toast.success('Report generated successfully');
    } catch {
      toast.error('Failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadReport = async (reportType: string) => {
    try {
      const res = await downloadReport(reportType);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${reportType}-report.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Report downloaded successfully');
    } catch {
      toast.error('Failed to download report');
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        setReports(reports.filter(r => r.id !== reportId));
        toast.success('Report deleted successfully');
      } catch {
        toast.error('Failed to delete report');
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
    <div className="min-h-screen bg-base-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-base-content flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              Reports & Analytics
            </h1>
            <p className="text-base-content/70 mt-2">
              Generate and manage system reports
            </p>
          </div>
        </div>

        {/* Quick Report Generation */}
        <div className="card bg-base-200 shadow-lg mb-8">
          <div className="card-body">
            <h3 className="text-xl font-bold text-base-content mb-4">Generate New Report</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Start Date</span>
                </label>
                <input
                  type="date"
                  className="input input-bordered"
                  placeholder="Select start date"
                  title="Select start date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">End Date</span>
                </label>
                <input
                  type="date"
                  className="input input-bordered"
                  placeholder="Select end date"
                  title="Select end date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Report Type</span>
                </label>
                <select
                  className="select select-bordered"
                  title="Select report type"
                >
                  <option value="appointments">Appointments</option>
                  <option value="users">Users</option>
                  <option value="revenue">Revenue</option>
                  <option value="prescriptions">Prescriptions</option>
                  <option value="analytics">Analytics</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <button
                onClick={() => handleGenerateReport('appointments')}
                disabled={isGenerating}
                className="btn btn-outline btn-primary gap-2"
              >
                <Calendar className="h-4 w-4" />
                Appointments
              </button>
              
              <button
                onClick={() => handleGenerateReport('users')}
                disabled={isGenerating}
                className="btn btn-outline btn-secondary gap-2"
              >
                <Users className="h-4 w-4" />
                Users
              </button>
              
              <button
                onClick={() => handleGenerateReport('revenue')}
                disabled={isGenerating}
                className="btn btn-outline btn-success gap-2"
              >
                <DollarSign className="h-4 w-4" />
                Revenue
              </button>
              
              <button
                onClick={() => handleGenerateReport('prescriptions')}
                disabled={isGenerating}
                className="btn btn-outline btn-warning gap-2"
              >
                <FileText className="h-4 w-4" />
                Prescriptions
              </button>
              
              <button
                onClick={() => handleGenerateReport('analytics')}
                disabled={isGenerating}
                className="btn btn-outline btn-info gap-2"
              >
                <TrendingUp className="h-4 w-4" />
                Analytics
              </button>
            </div>

            {isGenerating && (
              <div className="mt-4 flex items-center gap-3 text-primary">
                <div className="loading loading-spinner loading-sm"></div>
                <span>Generating report...</span>
              </div>
            )}
          </div>
        </div>

        {/* Filter Controls */}
        <div className="card bg-base-200 shadow-lg mb-6">
          <div className="card-body">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="form-control">
                <div className="input-group">
                  <span>
                    <Filter className="h-4 w-4" />
                  </span>
                  <select
                    className="select select-bordered"
                    value={selectedReportType}
                    onChange={(e) => setSelectedReportType(e.target.value)}
                    title="Filter by report type"
                  >
                    <option value="all">All Reports</option>
                    <option value="appointments">Appointments</option>
                    <option value="users">Users</option>
                    <option value="revenue">Revenue</option>
                    <option value="prescriptions">Prescriptions</option>
                    <option value="analytics">Analytics</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reports List */}
        <div className="grid gap-4">
          {filteredReports.map((report) => (
            <div key={report.id} className="card bg-base-200 shadow-lg">
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={getReportTypeColor(report.type)}>
                        {getReportIcon(report.type)}
                      </span>
                      <h3 className="text-lg font-semibold text-base-content">
                        {report.title}
                      </h3>
                      <span className={getStatusBadge(report.status)}>
                        {report.status}
                      </span>
                    </div>
                    <p className="text-base-content/70 mb-3">
                      {report.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-base-content/60">
                      <span>Generated: {new Date(report.generatedAt).toLocaleString()}</span>
                      <span>Records: {report.dataCount.toLocaleString()}</span>
                      <span className="capitalize">{report.type} Report</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {report.status === 'ready' && (
                      <button
                        onClick={() => handleDownloadReport(report.type)}
                        className="btn btn-sm btn-primary gap-2"
                        title="Download report"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteReport(report.id)}
                      className="btn btn-sm btn-ghost text-error"
                      title="Delete report"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredReports.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-base-content/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-base-content/70 mb-2">
                No Reports Found
              </h3>
              <p className="text-base-content/50">
                {selectedReportType !== 'all'
                  ? 'No reports available for the selected type'
                  : 'Generate your first report to get started'}
              </p>
            </div>
          )}
        </div>

        {/* Report Templates */}
        <div className="card bg-base-200 shadow-lg mt-8">
          <div className="card-body">
            <h3 className="text-xl font-bold text-base-content mb-4">Report Templates</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="card bg-base-100 shadow">
                <div className="card-body">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    Daily Operations
                  </h4>
                  <p className="text-sm text-base-content/70">
                    Daily summary of appointments, admissions, and activities
                  </p>
                  <button className="btn btn-sm btn-outline mt-2">Use Template</button>
                </div>
              </div>
              
              <div className="card bg-base-100 shadow">
                <div className="card-body">
                  <h4 className="font-semibold flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-success" />
                    Financial Summary
                  </h4>
                  <p className="text-sm text-base-content/70">
                    Revenue, payments, and financial performance metrics
                  </p>
                  <button className="btn btn-sm btn-outline mt-2">Use Template</button>
                </div>
              </div>
              
              <div className="card bg-base-100 shadow">
                <div className="card-body">
                  <h4 className="font-semibold flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-info" />
                    Performance Analytics
                  </h4>
                  <p className="text-sm text-base-content/70">
                    System performance, user engagement, and growth metrics
                  </p>
                  <button className="btn btn-sm btn-outline mt-2">Use Template</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
