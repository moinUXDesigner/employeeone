import { Search, Clock, Eye, Filter } from 'lucide-react';
import { Link } from 'react-router';
import { useEffect, useState } from 'react';

const PendingApprovals = () => {
  const [userRole, setUserRole] = useState<'RO' | 'RVO' | 'AA'>('RO');

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole') as any;
    setUserRole(storedRole || 'RO');
  }, []);

  // Customize content based on role
  const isAA = userRole === 'AA';
  const isRVO = userRole === 'RVO';
  
  const pageTitle = isAA ? 'Final Approvals' : isRVO ? 'Pending Reviews (RVO)' : 'Pending Approvals';
  const pageDescription = isAA 
    ? 'Final approval of performance evaluations' 
    : isRVO
    ? 'Review evaluations completed by Reporting Officers'
    : 'Review and approve performance evaluations';

  const pendingItems = [
    {
      id: '1',
      employeeId: 'EMP001',
      employeeName: 'John Doe',
      designation: 'Senior Manager',
      type: isAA ? 'Final Approval' : 'KRA Approval',
      submittedOn: 'Mar 5, 2026',
      deadline: 'Mar 15, 2026',
      daysLeft: 6,
      status: 'pending'
    },
    {
      id: '2',
      employeeId: 'EMP002',
      employeeName: 'Jane Smith',
      designation: 'Manager',
      type: isAA ? 'Final Approval' : 'Final Evaluation',
      submittedOn: 'Mar 1, 2026',
      deadline: 'Mar 10, 2026',
      daysLeft: 1,
      status: 'urgent'
    },
    {
      id: '3',
      employeeId: 'EMP003',
      employeeName: 'Robert Johnson',
      designation: 'Assistant Manager',
      type: isAA ? 'Final Approval' : 'Mid-Year Review',
      submittedOn: 'Mar 7, 2026',
      deadline: 'Mar 20, 2026',
      daysLeft: 11,
      status: 'pending'
    },
  ];

  // Determine review link based on role
  const getReviewLink = (employeeId: string) => {
    if (isAA) return `/aa/approval/${employeeId}`;
    if (isRVO) return `/rvo/review/${employeeId}`;
    return `/review/evaluation/${employeeId}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">{pageTitle}</h1>
        <p className="text-gray-600 mt-1">{pageDescription}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Total Pending</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">15</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Urgent (&lt; 3 days)</p>
          <p className="text-2xl font-bold text-red-600 mt-1">3</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Completed This Month</p>
          <p className="text-2xl font-bold text-green-600 mt-1">28</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Avg. Review Time</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">2.5d</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by employee name or ID..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg">
            <option>All Types</option>
            <option>KRA Approval</option>
            <option>Final Evaluation</option>
            <option>Mid-Year Review</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Pending Items List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Pending Reviews</h2>
        </div>
        <div className="divide-y divide-gray-200 max-h-[400px] overflow-y-auto">
          {pendingItems.map((item) => (
            <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900 truncate">{item.employeeName}</h3>
                    <span className="text-xs text-gray-500">{item.employeeId}</span>
                    {item.status === 'urgent' && (
                      <span className="px-1.5 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-wider rounded border border-red-100">
                        Urgent
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-600">
                    <span className="font-medium text-gray-700">{item.designation}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <span>{item.type}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <div className="flex items-center gap-1">
                      <Clock className={`w-3.5 h-3.5 ${item.daysLeft <= 3 ? 'text-red-500' : 'text-gray-400'}`} />
                      <span className={item.daysLeft <= 3 ? 'text-red-600 font-medium' : ''}>
                        {item.daysLeft}d left
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  to={getReviewLink(item.employeeId)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors ml-4 shrink-0"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Review
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PendingApprovals;