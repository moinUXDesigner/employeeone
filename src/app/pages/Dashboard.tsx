import { Clock, AlertCircle, CheckCircle, FileText } from 'lucide-react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

const Dashboard = () => {
  const navigate = useNavigate();

  const statusCards = [
    {
      title: 'KRA Submission',
      status: 'Pending',
      deadline: '15 days left',
      icon: FileText,
      color: 'orange',
      action: 'Complete KRA Entry',
      route: '/my-pms/kra-entry'
    },
    {
      title: 'Mid-Year Review',
      status: 'Not Started',
      deadline: '45 days left',
      icon: Clock,
      color: 'blue',
      action: 'Start Review',
      route: '/my-pms/mid-year-review'
    },
    {
      title: 'Previous Appraisal',
      status: 'Completed',
      grade: 'Very Good',
      icon: CheckCircle,
      color: 'green',
      action: 'View Details',
      route: '/my-pms/final-score'
    }
  ];

  const pendingActions = [
    { task: 'Submit KRA for approval', priority: 'High', dueDate: 'Mar 24, 2026' },
    { task: 'Update progress for Q4', priority: 'Medium', dueDate: 'Mar 30, 2026' },
    { task: 'Complete training module', priority: 'Low', dueDate: 'Apr 5, 2026' },
  ];

  const timeline = [
    { phase: 'KRA Setting', date: 'Apr 1 - Apr 15', status: 'upcoming' },
    { phase: 'Mid-Year Review', date: 'Oct 1 - Oct 15', status: 'upcoming' },
    { phase: 'Final Evaluation', date: 'Mar 1 - Mar 31', status: 'current' },
    { phase: 'Grade Disclosure', date: 'Apr 15', status: 'upcoming' },
  ];

  const handleAction = (route: string, action: string) => {
    navigate(route);
    toast.success(`Navigating to ${action}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's your PMS overview</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {statusCards.map((card, idx) => (
          <div key={idx} className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 p-2.5 hover:shadow-sm transition-all border-l-4 lg:border-l-4" style={{ borderLeftColor: card.color === 'orange' ? '#f97316' : card.color === 'blue' ? '#2563eb' : '#16a34a' }}>
            <div 
              className={`p-2 rounded-lg shrink-0 ${
                card.color === 'orange' ? 'bg-orange-50' :
                card.color === 'blue' ? 'bg-blue-50' :
                'bg-green-50'
              }`}
            >
              <card.icon className={`w-5 h-5 ${
                card.color === 'orange' ? 'text-orange-600' :
                card.color === 'blue' ? 'text-blue-600' :
                'text-green-600'
              }`} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-gray-900 truncate leading-none mb-1">{card.title}</h3>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className={`px-1 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter shrink-0 ${
                  card.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                  card.status === 'Not Started' ? 'bg-gray-100 text-gray-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {card.status}
                </span>
                {card.deadline && (
                  <p className="text-[10px] text-gray-500 flex items-center gap-0.5 whitespace-nowrap">
                    <Clock className="w-2.5 h-2.5 opacity-60" />
                    {card.deadline}
                  </p>
                )}
                {card.grade && (
                  <p className="text-[10px] text-gray-500 font-medium border-l border-gray-200 pl-1.5 ml-0.5 whitespace-nowrap">
                    Grade: {card.grade}
                  </p>
                )}
              </div>
            </div>
            <button 
              onClick={() => handleAction(card.route, card.action)}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all shadow-xs ${
                card.color === 'orange' ? 'bg-orange-600 text-white hover:bg-orange-700' :
                card.color === 'blue' ? 'bg-blue-600 text-white hover:bg-blue-700' :
                'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {card.action.split(' ')[0]}
            </button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Pending Actions */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Pending Actions</h2>
          </div>
          <div className="p-4 sm:p-6">
            <div className="space-y-4">
              {pendingActions.map((action, idx) => (
                <div key={idx} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0">
                  <AlertCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                    action.priority === 'High' ? 'text-red-500' :
                    action.priority === 'Medium' ? 'text-orange-500' :
                    'text-blue-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{action.task}</p>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        action.priority === 'High' ? 'bg-red-100 text-red-700' :
                        action.priority === 'Medium' ? 'bg-orange-100 text-orange-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {action.priority}
                      </span>
                      <span className="text-xs text-gray-500">Due: {action.dueDate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">PMS Timeline</h2>
          </div>
          <div className="p-4 sm:p-6">
            <div className="space-y-4">
              {timeline.map((phase, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                      phase.status === 'current' ? 'bg-blue-600' :
                      phase.status === 'completed' ? 'bg-green-600' :
                      'bg-gray-300'
                    }`} />
                    {idx < timeline.length - 1 && (
                      <div className="w-0.5 h-12 bg-gray-200 my-1" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="text-sm font-medium text-gray-900">{phase.phase}</p>
                    <p className="text-xs text-gray-500 mt-1">{phase.date}</p>
                    {phase.status === 'current' && (
                      <span className="inline-block mt-2 text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                        In Progress
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;