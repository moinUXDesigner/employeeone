import { useState } from 'react';
import { Activity as ActivityIcon, User, FileText, CheckCircle, Edit, Trash2, Download, Upload, Clock, Filter, Search } from 'lucide-react';

const Activity = () => {
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const activities = [
    {
      id: 1,
      user: 'John Doe (You)',
      userId: 'EMP001',
      action: 'Updated KRA Entry',
      target: 'Form A - KRA Setting',
      timestamp: '2 minutes ago',
      date: 'Mar 9, 2026 10:45 AM',
      type: 'update',
      icon: Edit,
      color: 'blue'
    },
    {
      id: 2,
      user: 'Sarah Wilson (RO)',
      userId: 'RO001',
      action: 'Reviewed and Approved',
      target: 'KRA - EMP002',
      timestamp: '1 hour ago',
      date: 'Mar 9, 2026 09:30 AM',
      type: 'approval',
      icon: CheckCircle,
      color: 'green'
    },
    {
      id: 3,
      user: 'John Doe (You)',
      userId: 'EMP001',
      action: 'Downloaded Report',
      target: 'Individual PMS Report Q4',
      timestamp: '3 hours ago',
      date: 'Mar 9, 2026 07:15 AM',
      type: 'download',
      icon: Download,
      color: 'purple'
    },
    {
      id: 4,
      user: 'HRD Admin',
      userId: 'HRD001',
      action: 'Created Schedule',
      target: 'Monthly Grade Distribution Report',
      timestamp: '5 hours ago',
      date: 'Mar 9, 2026 05:20 AM',
      type: 'create',
      icon: FileText,
      color: 'orange'
    },
    {
      id: 5,
      user: 'Michael Brown (RVO)',
      userId: 'RVO001',
      action: 'Submitted Evaluation',
      target: 'Performance Evaluation - EMP003',
      timestamp: 'Yesterday',
      date: 'Mar 8, 2026 04:30 PM',
      type: 'submit',
      icon: Upload,
      color: 'indigo'
    },
    {
      id: 6,
      user: 'John Doe (You)',
      userId: 'EMP001',
      action: 'Viewed Dashboard',
      target: 'My Dashboard',
      timestamp: 'Yesterday',
      date: 'Mar 8, 2026 02:15 PM',
      type: 'view',
      icon: ActivityIcon,
      color: 'gray'
    },
    {
      id: 7,
      user: 'Emily Davis (AA)',
      userId: 'AA001',
      action: 'Approved Final Rating',
      target: 'Final Rating - EMP005',
      timestamp: '2 days ago',
      date: 'Mar 7, 2026 11:00 AM',
      type: 'approval',
      icon: CheckCircle,
      color: 'green'
    },
    {
      id: 8,
      user: 'John Doe (You)',
      userId: 'EMP001',
      action: 'Updated Profile',
      target: 'User Profile Settings',
      timestamp: '2 days ago',
      date: 'Mar 7, 2026 09:45 AM',
      type: 'update',
      icon: User,
      color: 'blue'
    },
    {
      id: 9,
      user: 'HRD Admin',
      userId: 'HRD001',
      action: 'Generated Report',
      target: 'Audit Trail Log - February 2026',
      timestamp: '3 days ago',
      date: 'Mar 6, 2026 03:20 PM',
      type: 'create',
      icon: FileText,
      color: 'orange'
    },
    {
      id: 10,
      user: 'John Doe (You)',
      userId: 'EMP001',
      action: 'Submitted KRA',
      target: 'Form A - KRA Setting FY 2025-26',
      timestamp: '4 days ago',
      date: 'Mar 5, 2026 10:00 AM',
      type: 'submit',
      icon: Upload,
      color: 'indigo'
    }
  ];

  const getIconColor = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-100 text-blue-600';
      case 'green': return 'bg-green-100 text-green-600';
      case 'purple': return 'bg-purple-100 text-purple-600';
      case 'orange': return 'bg-orange-100 text-orange-600';
      case 'indigo': return 'bg-indigo-100 text-indigo-600';
      case 'gray': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const filteredActivities = activities.filter(activity => {
    const matchesType = filterType === 'all' || activity.type === filterType;
    const matchesSearch = activity.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          activity.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          activity.target.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const activityStats = [
    { label: 'Total Activities', value: activities.length, color: 'blue' },
    { label: 'Your Activities', value: activities.filter(a => a.user.includes('You')).length, color: 'green' },
    { label: 'Approvals', value: activities.filter(a => a.type === 'approval').length, color: 'purple' },
    { label: 'Updates', value: activities.filter(a => a.type === 'update').length, color: 'orange' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Activity Log</h1>
        <p className="text-gray-600 mt-1">Track all system activities and user actions</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="all">All Activities</option>
              <option value="update">Updates</option>
              <option value="approval">Approvals</option>
              <option value="download">Downloads</option>
              <option value="create">Created</option>
              <option value="submit">Submitted</option>
              <option value="view">Viewed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Recent Activities</h2>
          <p className="text-sm text-gray-600 mt-1">
            {filteredActivities.length} {filteredActivities.length === 1 ? 'activity' : 'activities'} found
          </p>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block max-h-[400px] overflow-y-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  Target
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  Type
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredActivities.map((activity) => (
                <tr key={activity.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
                        {activity.user.split(' ').slice(0, 2).map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{activity.user}</div>
                        <div className="text-sm text-gray-500">{activity.userId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900">{activity.action}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700">{activity.target}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{activity.timestamp}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{activity.date}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      activity.type === 'approval' ? 'bg-green-100 text-green-700' :
                      activity.type === 'update' ? 'bg-blue-100 text-blue-700' :
                      activity.type === 'download' ? 'bg-purple-100 text-purple-700' :
                      activity.type === 'create' ? 'bg-orange-100 text-orange-700' :
                      activity.type === 'submit' ? 'bg-indigo-100 text-indigo-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {activity.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-gray-200">
          {filteredActivities.map((activity) => (
            <div key={activity.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                  {activity.user.split(' ').slice(0, 2).map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 mb-1">{activity.user}</div>
                  <div className="text-sm text-gray-600 mb-1">{activity.action}</div>
                  <div className="text-sm text-gray-700">{activity.target}</div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  activity.type === 'approval' ? 'bg-green-100 text-green-700' :
                  activity.type === 'update' ? 'bg-blue-100 text-blue-700' :
                  activity.type === 'download' ? 'bg-purple-100 text-purple-700' :
                  activity.type === 'create' ? 'bg-orange-100 text-orange-700' :
                  activity.type === 'submit' ? 'bg-indigo-100 text-indigo-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {activity.type}
                </span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600 ml-14">
                <Clock className="w-4 h-4" />
                <span>{activity.timestamp}</span>
                <span className="mx-2">•</span>
                <span className="text-xs">{activity.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredActivities.length === 0 && (
          <div className="p-12 text-center">
            <ActivityIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No activities found</p>
            <p className="text-sm text-gray-500 mt-1">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Activity;