import { Download, FileText, Calendar, Filter, Search, Plus, X, Edit2, Trash2, Clock, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

const Reports = () => {
  const [showScheduleManager, setShowScheduleManager] = useState(false);
  const [schedules, setSchedules] = useState([
    {
      id: 1,
      name: 'Monthly Grade Distribution',
      reportType: 'Grade Distribution Report',
      frequency: 'Monthly',
      day: '1',
      time: '09:00',
      format: 'PDF',
      recipients: 'hrd@organization.gov.in',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Weekly Compliance Report',
      reportType: 'Audit Trail Log',
      frequency: 'Weekly',
      day: 'Monday',
      time: '08:00',
      format: 'Excel',
      recipients: 'admin@organization.gov.in',
      status: 'Active'
    },
    {
      id: 3,
      name: 'Quarterly Performance Summary',
      reportType: 'Unit Performance Report',
      frequency: 'Quarterly',
      day: '1',
      time: '10:00',
      format: 'PDF',
      recipients: 'management@organization.gov.in',
      status: 'Paused'
    }
  ]);

  const handleDeleteSchedule = (id: number) => {
    setSchedules(schedules.filter(s => s.id !== id));
    toast.success('Schedule deleted successfully!');
  };

  const handleToggleStatus = (id: number) => {
    setSchedules(schedules.map(s => 
      s.id === id ? { ...s, status: s.status === 'Active' ? 'Paused' : 'Active' } : s
    ));
    toast.success('Schedule status updated!');
  };

  const reportTypes = [
    {
      title: 'Individual PMS Report',
      description: 'Download detailed PMS report for a specific employee',
      icon: FileText,
      type: 'individual'
    },
    {
      title: 'Unit Performance Report',
      description: 'Consolidated report for a department or wing',
      icon: FileText,
      type: 'unit'
    },
    {
      title: 'Audit Trail Log',
      description: 'Complete history of all changes and actions',
      icon: FileText,
      type: 'audit'
    },
    {
      title: 'Grade Distribution Report',
      description: 'Statistical analysis of grade distribution',
      icon: FileText,
      type: 'grades'
    },
  ];

  const recentReports = [
    { name: 'Operations Wing - Q4 Report.pdf', date: 'Mar 8, 2026', size: '2.4 MB', user: 'HRD Admin', status: 'Ready' },
    { name: 'Individual PMS - EMP001.pdf', date: 'Mar 7, 2026', size: '856 KB', user: 'John Doe', status: 'Ready' },
    { name: 'Audit Trail - February 2026.xlsx', date: 'Mar 1, 2026', size: '1.2 MB', user: 'System', status: 'Ready' },
    { name: 'Grade Distribution - Q3.pdf', date: 'Feb 28, 2026', size: '1.8 MB', user: 'HRD Admin', status: 'Ready' },
    { name: 'Department Report - Tech Wing.xlsx', date: 'Feb 25, 2026', size: '3.2 MB', user: 'Jane Smith', status: 'Ready' },
  ];

  const handleDownload = (reportName: string) => {
    toast.success(`Downloading ${reportName}...`);
    // Simulate download
  };

  const handleGenerateReport = (reportType: string) => {
    toast.success('Report generated successfully!');
    // Simulate report generation
  };

  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
        <p className="text-gray-600 mt-1">Generate and download PMS reports</p>
      </div>

      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        {reportTypes.map((report, idx) => (
          <div key={idx} className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <report.icon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{report.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{report.description}</p>
                <button 
                  onClick={() => handleGenerateReport(report.title)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base w-full sm:w-auto justify-center"
                >
                  <Download className="w-4 h-4" />
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Report Filters */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Custom Report Generator</h2>
          <p className="text-sm text-gray-600 mt-1">Configure and generate custom reports</p>
        </div>
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
                <option>Individual PMS Report</option>
                <option>Unit Performance Report</option>
                <option>Audit Trail Log</option>
                <option>Grade Distribution Report</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department/Wing</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
                <option>All Departments</option>
                <option>Operations</option>
                <option>Technology</option>
                <option>Finance</option>
                <option>HR</option>
                <option>Marketing</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <div className="flex gap-2">
                <input type="date" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                <span className="flex items-center text-gray-500 text-sm">to</span>
                <input type="date" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
                <option>PDF</option>
                <option>Excel (XLSX)</option>
                <option>CSV</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button 
              onClick={() => handleGenerateReport('Custom Report')}
              className="flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              <Download className="w-4 h-4" />
              Generate Report
            </button>
            <button className="flex items-center justify-center gap-2 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
              <Filter className="w-4 h-4" />
              Advanced Filters
            </button>
            <button className="flex items-center justify-center gap-2 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
              <Calendar className="w-4 h-4" />
              Schedule Report
            </button>
          </div>
        </div>
      </div>

      {/* Recent Reports - Table View */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="font-semibold text-gray-900">Recently Generated Reports</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search reports..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-full sm:w-64"
              />
            </div>
          </div>
        </div>
        
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Report Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Generated By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentReports.map((report, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <span className="font-medium text-gray-900">{report.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{report.user}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{report.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{report.size}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => handleDownload(report.name)}
                      className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-gray-200">
          {recentReports.map((report, idx) => (
            <div key={idx} className="p-4 hover:bg-gray-50">
              <div className="flex items-start gap-3 mb-3">
                <FileText className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 mb-1 break-words">{report.name}</p>
                  <p className="text-sm text-gray-600">
                    Generated by {report.user}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                <div>
                  <span className="text-gray-500">Date: </span>
                  <span className="text-gray-900">{report.date}</span>
                </div>
                <div>
                  <span className="text-gray-500">Size: </span>
                  <span className="text-gray-900">{report.size}</span>
                </div>
              </div>
              <button 
                onClick={() => handleDownload(report.name)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Scheduled Reports */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Scheduled Reports</h2>
            <button 
              onClick={() => setShowScheduleManager(true)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Manage Schedules
            </button>
          </div>
        </div>
        <div className="p-4 sm:p-6">
          <div className="space-y-3">
            {schedules.filter(s => s.status === 'Active').map((schedule) => (
              <div key={schedule.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 border border-gray-200 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{schedule.name}</p>
                  <p className="text-xs text-gray-600">
                    Runs {schedule.frequency === 'Weekly' ? `every ${schedule.day}` : `on ${schedule.day}`} at {schedule.time}
                  </p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded font-medium self-start sm:self-center">
                  {schedule.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Schedule Management Modal */}
      {showScheduleManager && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Manage Report Schedules</h2>
                <p className="text-sm text-gray-600 mt-1">Create and manage automated report generation schedules</p>
              </div>
              <button
                onClick={() => setShowScheduleManager(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto flex-1 p-6">
              {/* Add New Schedule Button */}
              <div className="mb-6">
                <button 
                  onClick={() => toast.success('Create new schedule feature coming soon!')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Create New Schedule
                </button>
              </div>

              {/* Schedules List */}
              <div className="space-y-4">
                {schedules.map((schedule) => (
                  <div key={schedule.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 p-4 border-b border-gray-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{schedule.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">Report Type: {schedule.reportType}</p>
                        </div>
                        <span className={`px-3 py-1 ${schedule.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} text-xs rounded-full font-medium`}>
                          {schedule.status}
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Calendar className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 uppercase font-medium">Frequency</p>
                            <p className="text-sm text-gray-900 mt-1">
                              {schedule.frequency} - {schedule.frequency === 'Weekly' ? `Every ${schedule.day}` : `Day ${schedule.day}`}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <Clock className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 uppercase font-medium">Time</p>
                            <p className="text-sm text-gray-900 mt-1">{schedule.time}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <FileText className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 uppercase font-medium">Format</p>
                            <p className="text-sm text-gray-900 mt-1">{schedule.format}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-orange-100 rounded-lg">
                            <Mail className="w-5 h-5 text-orange-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 uppercase font-medium">Recipients</p>
                            <p className="text-sm text-gray-900 mt-1 break-all">{schedule.recipients}</p>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                        <button 
                          onClick={() => handleToggleStatus(schedule.id)}
                          className={`flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors ${
                            schedule.status === 'Active' ? 'border-red-300 text-red-700' : 'border-green-300 text-green-700'
                          }`}
                        >
                          {schedule.status === 'Active' ? 'Pause Schedule' : 'Activate Schedule'}
                        </button>
                        <button 
                          onClick={() => toast.success('Edit feature coming soon!')}
                          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </button>
                        <button 
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete "${schedule.name}"?`)) {
                              handleDeleteSchedule(schedule.id);
                            }
                          }}
                          className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 text-sm font-medium transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                        <button 
                          onClick={() => toast.success(`Running ${schedule.name} now...`)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
                        >
                          Run Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {schedules.length === 0 && (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No schedules configured</p>
                  <p className="text-sm text-gray-500 mt-1">Create your first automated report schedule</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end">
              <button
                onClick={() => setShowScheduleManager(false)}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;