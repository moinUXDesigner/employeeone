import { useState } from 'react';
import { Users, CheckCircle, Clock, AlertCircle, TrendingUp, Award, Search } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const OfficerDashboard = () => {
  const [viewLevel, setViewLevel] = useState<'employee' | 'officer'>('officer');

  // Stats for officer level view
  const officerStats = [
    {
      title: 'Total Subordinates',
      value: '24',
      change: '+2 from last year',
      icon: Users,
      color: 'blue',
    },
    {
      title: 'Pending Reviews',
      value: '8',
      change: '3 due this week',
      icon: Clock,
      color: 'orange',
    },
    {
      title: 'Completed Reviews',
      value: '16',
      change: '67% completion',
      icon: CheckCircle,
      color: 'green',
    },
    {
      title: 'Avg Team Score',
      value: '82.5',
      change: '+3.2 from last year',
      icon: TrendingUp,
      color: 'purple',
    },
  ];

  // Employee level data
  const subordinates = [
    { id: 'EMP101', name: 'Alice Johnson', designation: 'Manager', status: 'Pending Review', score: 85, dueDate: 'Mar 15, 2026' },
    { id: 'EMP102', name: 'Bob Smith', designation: 'Senior Executive', status: 'Under Review', score: 78, dueDate: 'Mar 12, 2026' },
    { id: 'EMP103', name: 'Carol White', designation: 'Manager', status: 'Completed', score: 92, dueDate: 'Mar 8, 2026' },
    { id: 'EMP104', name: 'David Brown', designation: 'Executive', status: 'Pending Review', score: 0, dueDate: 'Mar 20, 2026' },
    { id: 'EMP105', name: 'Emma Davis', designation: 'Senior Executive', status: 'Completed', score: 88, dueDate: 'Mar 5, 2026' },
    { id: 'EMP106', name: 'Frank Miller', designation: 'Manager', status: 'Under Review', score: 75, dueDate: 'Mar 18, 2026' },
  ];

  // Grade distribution data
  const gradeDistribution = [
    { name: 'Outstanding', value: 3, color: '#10b981' },
    { name: 'Very Good', value: 8, color: '#3b82f6' },
    { name: 'Good', value: 10, color: '#f59e0b' },
    { name: 'Average', value: 3, color: '#ef4444' },
  ];

  // Performance trend data
  const performanceTrend = [
    { month: 'Apr', avg: 75 },
    { month: 'May', avg: 78 },
    { month: 'Jun', avg: 80 },
    { month: 'Jul', avg: 79 },
    { month: 'Aug', avg: 82 },
    { month: 'Sep', avg: 83 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-700';
      case 'Under Review': return 'bg-blue-100 text-blue-700';
      case 'Pending Review': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Team Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor and manage your team's performance</p>
        </div>
        
        {/* View Toggle */}
        <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-white">
          <button
            onClick={() => setViewLevel('officer')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewLevel === 'officer'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Officer Level
          </button>
          <button
            onClick={() => setViewLevel('employee')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewLevel === 'employee'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Employee Level
          </button>
        </div>
      </div>

      {viewLevel === 'officer' ? (
        <>
          {/* Officer Level Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {officerStats.map((stat, idx) => (
              <div key={idx} className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm text-gray-600 mb-2">{stat.title}</h3>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-2 rounded-lg ${
                    stat.color === 'blue' ? 'bg-blue-100' :
                    stat.color === 'orange' ? 'bg-orange-100' :
                    stat.color === 'green' ? 'bg-green-100' :
                    'bg-purple-100'
                  }`}>
                    <stat.icon className={`w-6 h-6 ${
                      stat.color === 'blue' ? 'text-blue-600' :
                      stat.color === 'orange' ? 'text-orange-600' :
                      stat.color === 'green' ? 'text-green-600' :
                      'text-purple-600'
                    }`} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium">Review Pending KRAs</span>
              </button>
              <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Award className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium">Submit Evaluations</span>
              </button>
              <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Users className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium">Team Overview</span>
              </button>
              <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-medium">View Alerts</span>
              </button>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Trend */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Team Performance Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={performanceTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="avg" fill="#3b82f6" key="avg-bar" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Grade Distribution */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Grade Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={gradeDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {gradeDistribution.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Employee Level View */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h3 className="font-semibold text-gray-900">Subordinates ({subordinates.length})</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search employees..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-full sm:w-64"
                  />
                </div>
              </div>
            </div>

            {/* Table - Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Designation
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {subordinates.map((emp) => (
                    <tr key={emp.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                            {emp.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{emp.name}</div>
                            <div className="text-sm text-gray-500">{emp.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{emp.designation}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(emp.status)}`}>
                          {emp.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-900">
                          {emp.score > 0 ? emp.score : '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{emp.dueDate}</td>
                      <td className="px-6 py-4">
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cards - Mobile */}
            <div className="md:hidden divide-y divide-gray-200">
              {subordinates.map((emp) => (
                <div key={emp.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {emp.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900">{emp.name}</div>
                      <div className="text-sm text-gray-500">{emp.id} • {emp.designation}</div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(emp.status)}`}>
                      {emp.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                    <div>
                      <span className="text-gray-500">Score: </span>
                      <span className="font-medium text-gray-900">{emp.score > 0 ? emp.score : '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Due: </span>
                      <span className="font-medium text-gray-900">{emp.dueDate}</span>
                    </div>
                  </div>
                  <button className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                    Review
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OfficerDashboard;