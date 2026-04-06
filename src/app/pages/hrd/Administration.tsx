import { useState } from 'react';
import { Save, Upload, Plus, Trash2, Edit } from 'lucide-react';

const Administration = () => {
  const [activeTab, setActiveTab] = useState('authority');

  const tabs = [
    { id: 'authority', label: 'Authority Matrix' },
    { id: 'timeline', label: 'Timeline Configuration' },
    { id: 'grades', label: 'Grade Bands' },
    { id: 'users', label: 'User Mapping' },
    { id: 'deputation', label: 'Deputation Upload' },
  ];

  const authorityMatrix = [
    { grade: 'E1-E3', ro: 'One level up', rvo: 'Two levels up', aa: 'Three levels up' },
    { grade: 'E4-E6', ro: 'One level up', rvo: 'Two levels up', aa: 'Department Head' },
    { grade: 'E7-E8', ro: 'Department Head', rvo: 'Division Head', aa: 'CMD' },
  ];

  const timelineConfig = [
    { phase: 'KRA Setting', startDate: '2026-04-01', endDate: '2026-04-15', status: 'upcoming' },
    { phase: 'Mid-Year Review', startDate: '2026-10-01', endDate: '2026-10-15', status: 'upcoming' },
    { phase: 'Self Assessment', startDate: '2027-01-01', endDate: '2027-01-15', status: 'upcoming' },
    { phase: 'RO Evaluation', startDate: '2027-01-16', endDate: '2027-02-15', status: 'upcoming' },
  ];

  const gradeBands = [
    { grade: 'Outstanding', minScore: 9.0, maxScore: 10.0, color: 'green' },
    { grade: 'Very Good', minScore: 8.0, maxScore: 8.99, color: 'blue' },
    { grade: 'Good', minScore: 7.0, maxScore: 7.99, color: 'yellow' },
    { grade: 'Average', minScore: 6.0, maxScore: 6.99, color: 'orange' },
    { grade: 'Below Average', minScore: 0, maxScore: 5.99, color: 'red' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Administration</h1>
        <p className="text-gray-600 mt-1">Configure PMS system settings and parameters</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Authority Matrix Tab */}
          {activeTab === 'authority' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900">Authority Matrix Configuration</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Plus className="w-4 h-4" />
                  Add Grade Level
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Grade Level</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Reporting Officer</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Reviewing Officer</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Accepting Authority</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {authorityMatrix.map((row, idx) => (
                      <tr key={idx} className="border-b border-gray-100">
                        <td className="py-3 px-4 text-sm font-medium text-gray-900">{row.grade}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{row.ro}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{row.rvo}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{row.aa}</td>
                        <td className="py-3 px-4 text-center">
                          <button className="p-1 text-blue-600 hover:bg-blue-50 rounded mr-2">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end">
                <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Timeline Configuration Tab */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900">PMS Timeline Configuration</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Plus className="w-4 h-4" />
                  Add Phase
                </button>
              </div>

              <div className="space-y-4">
                {timelineConfig.map((phase, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phase Name</label>
                        <input
                          type="text"
                          defaultValue={phase.phase}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                        <input
                          type="date"
                          defaultValue={phase.startDate}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                        <input
                          type="date"
                          defaultValue={phase.endDate}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div className="flex items-end">
                        <button className="w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50">
                          <Trash2 className="w-4 h-4 mx-auto" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Save className="w-4 h-4" />
                  Save Timeline
                </button>
              </div>
            </div>
          )}

          {/* Grade Bands Tab */}
          {activeTab === 'grades' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900">Grade Band Settings</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Grade</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Min Score</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Max Score</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Color</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gradeBands.map((grade, idx) => (
                      <tr key={idx} className="border-b border-gray-100">
                        <td className="py-3 px-4">
                          <input
                            type="text"
                            defaultValue={grade.grade}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            step="0.1"
                            defaultValue={grade.minScore}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-center"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            step="0.1"
                            defaultValue={grade.maxScore}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-center"
                          />
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs ${
                            grade.color === 'green' ? 'bg-green-100 text-green-700' :
                            grade.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                            grade.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                            grade.color === 'orange' ? 'bg-orange-100 text-orange-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {grade.grade}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end">
                <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Save className="w-4 h-4" />
                  Save Grade Bands
                </button>
              </div>
            </div>
          )}

          {/* User Mapping Tab */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900">User Role Mapping</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Plus className="w-4 h-4" />
                  Add User
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Search by name or employee ID..."
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                />
                <select className="px-4 py-2 border border-gray-300 rounded-lg">
                  <option>All Departments</option>
                  <option>Operations</option>
                  <option>Technology</option>
                  <option>Finance</option>
                </select>
                <select className="px-4 py-2 border border-gray-300 rounded-lg">
                  <option>All Roles</option>
                  <option>Employee</option>
                  <option>RO</option>
                  <option>RVO</option>
                  <option>AA</option>
                </select>
              </div>

              <div className="text-center py-12 text-gray-500">
                <p>User mapping configuration interface</p>
                <p className="text-sm mt-2">Upload CSV or configure individual user mappings</p>
              </div>
            </div>
          )}

          {/* Deputation Upload Tab */}
          {activeTab === 'deputation' && (
            <div className="space-y-4">
              <h2 className="font-semibold text-gray-900 mb-4">Deputation Employee Upload</h2>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Upload employee deputation data</p>
                <p className="text-sm text-gray-500 mb-4">
                  Supported formats: CSV, Excel (max 5MB)
                </p>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Choose File
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">Upload Instructions</h3>
                <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                  <li>File must contain columns: Employee ID, Name, Current Location, Deputedation Location, Start Date, End Date</li>
                  <li>Employee ID must match existing employee records</li>
                  <li>Dates should be in YYYY-MM-DD format</li>
                  <li>Maximum 1000 rows per file</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-3">Recent Uploads</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">deputation_Q1_2026.csv</p>
                      <p className="text-xs text-gray-600">Uploaded on Mar 1, 2026 • 45 records</p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Success</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Administration;
