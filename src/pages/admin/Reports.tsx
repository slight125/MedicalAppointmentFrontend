import React from 'react';
import { FileText, Download, Calendar, Users, DollarSign } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { downloadReport } from '../../utils/api';

const REPORT_TYPES = [
  { type: 'appointments', label: 'Appointments', icon: <Calendar className="h-5 w-5" /> },
  { type: 'users', label: 'Users', icon: <Users className="h-5 w-5" /> },
  { type: 'revenue', label: 'Revenue', icon: <DollarSign className="h-5 w-5" /> },
  { type: 'prescriptions', label: 'Prescriptions', icon: <FileText className="h-5 w-5" /> },
];

const AdminReports: React.FC = () => {
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

  return (
    <div className="min-h-screen bg-base-100 dark:bg-gray-900 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-base-content dark:text-gray-100 flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary dark:text-blue-400" />
              Reports & Analytics
            </h1>
            <p className="text-base-content/70 dark:text-gray-300 mt-2">
              Download system reports as CSV files
            </p>
          </div>
        </div>
        <div className="grid gap-6">
          {REPORT_TYPES.map((report) => (
            <div key={report.type} className="card bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg">
              <div className="card-body flex flex-row items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-primary dark:text-blue-400">{report.icon}</span>
                  <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">{report.label} Report</span>
                </div>
                <button
                  onClick={() => handleDownloadReport(report.type)}
                  className="btn btn-primary gap-2"
                  title={`Download ${report.label} report`}
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
