import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, Users } from 'lucide-react';

const Analytics = () => {
  const gradeDistribution = [
    { name: 'Outstanding', value: 12, color: '#10b981' },
    { name: 'Very Good', value: 35, color: '#3b82f6' },
    { name: 'Good', value: 28, color: '#f59e0b' },
    { name: 'Average', value: 20, color: '#ef4444' },
    { name: 'Below Average', value: 5, color: '#dc2626' },
  ];

  const wingPerformance = [
    { wing: 'Operations', avgScore: 8.2, count: 45 },
    { wing: 'Technology', avgScore: 8.5, count: 38 },
    { wing: 'Finance', avgScore: 7.8, count: 32 },
    { wing: 'HR', avgScore: 8.1, count: 25 },
    { wing: 'Marketing', avgScore: 8.3, count: 30 },
  ];

  const complianceData = [
    { phase: 'KRA Submission', submitted: 95, pending: 5 },
    { phase: 'RO Evaluation', submitted: 88, pending: 12 },
    { phase: 'RVO Review', submitted: 82, pending: 18 },
    { phase: 'AA Approval', submitted: 75, pending: 25 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-1">Performance metrics and compliance tracking</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Employees</p>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">170</p>
          <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            +5% from last year
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Avg. Score</p>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">8.2</p>
          <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            +0.3 from last year
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Outstanding %</p>
            <AlertTriangle className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">12%</p>
          <p className="text-xs text-orange-600 mt-1">
            Above 10% threshold
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Completion Rate</p>
            <TrendingDown className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">88%</p>
          <p className="text-xs text-blue-600 mt-1">
            22 pending evaluations
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grade Distribution */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Grade Distribution</h2>
            <p className="text-sm text-gray-600 mt-1">Overall performance grade breakdown</p>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={gradeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
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
            
            <div className="mt-4 grid grid-cols-2 gap-2">
              {gradeDistribution.map((grade) => (
                <div key={grade.name} className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: grade.color }} />
                  <span className="text-gray-700">{grade.name}: {grade.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wing-wise Performance */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Wing-wise Performance</h2>
            <p className="text-sm text-gray-600 mt-1">Average score by department</p>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={wingPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="wing" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="avgScore" fill="#3b82f6" name="Avg Score" />
              </BarChart>
            </ResponsiveContainer>
            
            <div className="mt-4 text-sm text-gray-600">
              <p>Highest: Technology (8.5) • Lowest: Finance (7.8)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Tracker */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Compliance Report</h2>
          <p className="text-sm text-gray-600 mt-1">Track progress across PMS phases</p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {complianceData.map((phase) => (
              <div key={phase.phase}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{phase.phase}</span>
                  <span className="text-sm text-gray-600">
                    {phase.submitted}% ({phase.pending} pending)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      phase.submitted >= 90 ? 'bg-green-600' :
                      phase.submitted >= 75 ? 'bg-blue-600' :
                      'bg-orange-600'
                    }`}
                    style={{ width: `${phase.submitted}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Outstanding % Alert */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-orange-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-orange-900 mb-1">Outstanding Grade Alert</h3>
            <p className="text-sm text-orange-700 mb-3">
              The percentage of "Outstanding" grades (12%) exceeds the recommended threshold of 10%.
              This may require moderation committee review.
            </p>
            <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm">
              Initiate Moderation Review
            </button>
          </div>
        </div>
      </div>

      {/* Non-Submission Tracker */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Non-Submission Tracker</h2>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Employee</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Wing</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Pending Phase</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Days Overdue</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-sm text-gray-900">EMP045 - Alex Turner</td>
                  <td className="py-3 px-4 text-sm text-gray-900">Finance</td>
                  <td className="py-3 px-4 text-sm text-gray-900">KRA Submission</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">5 days</span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-sm text-blue-600 hover:text-blue-700">Send Reminder</button>
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-sm text-gray-900">EMP067 - Maria Garcia</td>
                  <td className="py-3 px-4 text-sm text-gray-900">Operations</td>
                  <td className="py-3 px-4 text-sm text-gray-900">Mid-Year Review</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">2 days</span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-sm text-blue-600 hover:text-blue-700">Send Reminder</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;