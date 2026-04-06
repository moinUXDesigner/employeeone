import { useState } from 'react';
import { LayoutGrid, List, Filter, Eye, Edit, CheckCircle, Clock, X, RotateCcw, Save, Upload } from 'lucide-react';
import KRACard from '../../components/KRACard';
import { toast } from 'sonner';

const ViewKRAs = () => {
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [filterType, setFilterType] = useState<'all' | 'initial' | 'revised'>('all');
  const [selectedKRA, setSelectedKRA] = useState<typeof kras[0] | null>(null);
  const [reviseKRA, setReviseKRA] = useState<typeof kras[0] | null>(null);

  // Revise form state
  const [reviseKPI, setReviseKPI] = useState('');
  const [reviseTarget, setReviseTarget] = useState('');
  const [reviseAchievement, setReviseAchievement] = useState('');
  const [reviseSourceRef, setReviseSourceRef] = useState('');

  // Always show employee-level view (no evaluation fields) in View KRAs page
  const userRole = 'Employee' as const;

  const kras = [
    {
      id: '1',
      sl: '1',
      code: 'KRA-001',
      kpi: 'Customer Service Excellence - Maintain high standards of customer service and satisfaction',
      targetAnnual: 'Customer satisfaction rating above 4.5/5 and response time within 24 hours',
      actualAchievement: 'Achieved 4.7/5 rating with average response time of 18 hours',
      sourceRefNo: 'CS-2026-001',
      uploadedFiles: [
        { name: 'Customer_Feedback_Report_Q1.pdf', url: '#' },
        { name: 'Response_Time_Analysis.xlsx', url: '#' },
      ],
      status: 'Approved' as const,
      type: 'initial' as const,
      ro: {
        rating: '9',
        weightagePercent: '25',
        score: '2.25',
        validationNotes: 'Excellent performance in customer service. Exceeded targets consistently.',
      },
      rvo: {
        rating: '9',
        weightagePercent: '25',
        score: '2.25',
        validationNotes: 'Outstanding achievement. Recommends for recognition.',
      },
      aa: 'Approved with commendation',
      aaValidationNotes: 'Exemplary performance in customer service domain.',
    },
    {
      id: '2',
      sl: '2',
      code: 'KRA-002',
      kpi: 'Process Improvement - Identify and implement process improvements to enhance operational efficiency',
      targetAnnual: 'Implement 3 process improvements with cost savings of INR 50,000',
      actualAchievement: 'Implemented 4 improvements with total cost savings of INR 65,000',
      sourceRefNo: 'PI-2026-002',
      uploadedFiles: [
        { name: 'Process_Improvement_Report.pdf', url: '#' },
        { name: 'Cost_Savings_Analysis.xlsx', url: '#' },
        { name: 'Implementation_Timeline.pdf', url: '#' },
      ],
      status: 'Pending' as const,
      type: 'initial' as const,
      ro: {
        rating: '8',
        weightagePercent: '20',
        score: '1.6',
        validationNotes: 'Good performance. Exceeded the target number of improvements.',
      },
      rvo: {
        rating: '8',
        weightagePercent: '20',
        score: '1.6',
        validationNotes: 'Agrees with RO assessment. Good initiative shown.',
      },
      aa: '',
      aaValidationNotes: '',
    },
    {
      id: '3',
      sl: '3',
      code: 'KRA-003',
      kpi: 'Team Collaboration - Foster effective collaboration within the team and across departments',
      targetAnnual: 'Participate in 2 cross-functional projects with team satisfaction score of 4.0+',
      actualAchievement: 'Participated in 3 projects with team satisfaction score of 4.3',
      sourceRefNo: 'TC-2026-003',
      uploadedFiles: [
        { name: 'Team_Feedback_Survey.pdf', url: '#' },
      ],
      status: 'Approved' as const,
      type: 'revised' as const,
      ro: {
        rating: '8',
        weightagePercent: '15',
        score: '1.2',
        validationNotes: 'Strong collaboration skills demonstrated.',
      },
      rvo: {
        rating: '',
        weightagePercent: '',
        score: '',
        validationNotes: '',
      },
      aa: '',
      aaValidationNotes: '',
    },
  ];

  const filteredKRAs = kras.filter(kra => {
    if (filterType === 'all') return true;
    return kra.type === filterType;
  });

  const handleReviseClick = (kra: typeof kras[0]) => {
    setReviseKRA(kra);
    setReviseKPI(kra.kpi);
    setReviseTarget(kra.targetAnnual);
    setReviseAchievement(kra.actualAchievement);
    setReviseSourceRef(kra.sourceRefNo);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">View KRA/KPIs</h1>
        <p className="text-gray-600 mt-1">View all your Key Result Areas and Key Performance Indicators</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | 'initial' | 'revised')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="all">All KRA/KPIs</option>
              <option value="initial">Initial KRA/KPIs</option>
              <option value="revised">Revised KRA/KPIs</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('card')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${
                viewMode === 'card'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="text-sm font-medium">Card</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <List className="w-4 h-4" />
              <span className="text-sm font-medium">Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold">{filteredKRAs.length}</span> KRA/KPI{filteredKRAs.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Card View */}
      {viewMode === 'card' && (
        <div className="space-y-6 divide-y divide-gray-200 max-h-[calc(100vh-400px)] overflow-y-auto">
          {filteredKRAs.map((kra) => (
            <KRACard key={kra.id} kra={kra} userRole={userRole} />
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SL / Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    KRA / KPI
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Target
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
                {filteredKRAs.map((kra) => (
                  <tr key={kra.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">SL: {kra.sl}</div>
                      <div className="text-xs text-gray-500">{kra.code}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 line-clamp-2">{kra.kpi}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {kra.type && (
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          kra.type === 'initial' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-purple-100 text-purple-700'
                        }`}>
                          {kra.type === 'initial' ? 'Initial' : 'Revised'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 line-clamp-2 max-w-xs">{kra.targetAnnual}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {kra.status && (
                        <span className={`px-2 py-1 text-xs font-medium rounded-full inline-flex items-center gap-1 ${
                          kra.status === 'Approved' 
                            ? 'bg-green-100 text-green-700'
                            : kra.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {kra.status === 'Approved' ? (
                            <>
                              <CheckCircle className="w-3 h-3" />
                              Approved
                            </>
                          ) : kra.status === 'Pending' ? (
                            <>
                              <Clock className="w-3 h-3" />
                              Pending
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3" />
                              Draft
                            </>
                          )}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setSelectedKRA(kra)}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                        <button 
                          onClick={() => handleReviseClick(kra)}
                          className="text-purple-600 hover:text-purple-700 text-sm font-medium inline-flex items-center gap-1"
                        >
                          <RotateCcw className="w-4 h-4" />
                          Revise
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-gray-200">
            {filteredKRAs.map((kra) => (
              <div key={kra.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        SL: {kra.sl}
                      </span>
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {kra.code}
                      </span>
                    </div>
                    <h3 className="text-sm text-gray-900 line-clamp-2">{kra.kpi}</h3>
                  </div>
                  {kra.status && (
                    <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full flex-shrink-0 ${
                      kra.status === 'Approved' 
                        ? 'bg-green-100 text-green-700'
                        : kra.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {kra.status}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                  {kra.type && (
                    <span className={`px-2 py-1 font-medium rounded ${
                      kra.type === 'initial' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {kra.type === 'initial' ? 'Initial' : 'Revised'}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setSelectedKRA(kra)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center gap-1"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                  <button 
                    onClick={() => handleReviseClick(kra)}
                    className="text-purple-600 hover:text-purple-700 text-sm font-medium inline-flex items-center gap-1"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Revise
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredKRAs.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Filter className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No KRA/KPIs Found</h3>
          <p className="text-gray-600">Try adjusting your filter to see more results.</p>
        </div>
      )}

      {/* KRA Details Modal */}
      {selectedKRA && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedKRA(null)}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">KRA/KPI Details</h2>
                <p className="text-sm text-gray-600 mt-1">{selectedKRA.code} • SL: {selectedKRA.sl}</p>
              </div>
              <button
                onClick={() => setSelectedKRA(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              <KRACard kra={selectedKRA} userRole={userRole} />
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-2 sticky bottom-0">
              <button
                onClick={() => setSelectedKRA(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Revise KRA Modal */}
      {reviseKRA && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={() => setReviseKRA(null)}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Revise KRA</h2>
                <p className="text-sm text-gray-600 mt-1">Based on {reviseKRA.code} • SL: {reviseKRA.sl}</p>
              </div>
              <button
                onClick={() => setReviseKRA(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  KRA / KPI <span className="text-red-600">*</span>
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter KRA / KPI..."
                  value={reviseKPI}
                  onChange={(e) => setReviseKPI(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target (Annual) <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter target..."
                    value={reviseTarget}
                    onChange={(e) => setReviseTarget(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Actual Achievement <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter actual achievement..."
                    value={reviseAchievement}
                    onChange={(e) => setReviseAchievement(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Source Ref. No. <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter source ref. no..."
                  value={reviseSourceRef}
                  onChange={(e) => setReviseSourceRef(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Supporting Documents</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    id="file-upload-revise"
                    multiple
                  />
                  <label htmlFor="file-upload-revise" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PDF, DOC, XLS, or images (max 10MB each)
                    </p>
                  </label>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-2 sticky bottom-0">
              <button
                onClick={() => setReviseKRA(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  toast.success('Revised KRA submitted successfully!');
                  setReviseKRA(null);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Save className="w-4 h-4" />
                Submit Revision
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewKRAs;