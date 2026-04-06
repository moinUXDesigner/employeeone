import { Search, Eye, Filter, CheckCircle } from "lucide-react";
import { Link } from "react-router";
import { useEffect, useState } from "react";

const RecentlyCompleted = () => {
  const [userRole, setUserRole] = useState<"RO" | "RVO" | "AA">(
    "RO",
  );

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole") as any;
    setUserRole(storedRole || "RO");
  }, []);

  // Customize content based on role
  const isAA = userRole === "AA";
  const isRVO = userRole === "RVO";

  const pageTitle = isAA
    ? "Recently Approved"
    : isRVO
      ? "Recently Reviewed"
      : "Recently Completed";
  const pageDescription = isAA
    ? "View recently approved performance evaluations"
    : isRVO
      ? "View recently reviewed evaluations"
      : "View recently completed performance evaluations";

  const completedItems = [
    {
      id: "1",
      employeeId: "EMP010",
      employeeName: "Sarah Wilson",
      designation: "Senior Manager",
      type: isAA ? "Final Approval" : "Final Evaluation",
      completedOn: "Mar 8, 2026",
      completedBy: "You",
      score: "85.5",
      grade: "Gold",
    },
    {
      id: "2",
      employeeId: "EMP011",
      employeeName: "Michael Brown",
      designation: "Manager",
      type: isAA ? "Final Approval" : "KRA Approval",
      completedOn: "Mar 7, 2026",
      completedBy: "You",
      score: "92.0",
      grade: "Platinum",
    },
    {
      id: "3",
      employeeId: "EMP012",
      employeeName: "Emily Davis",
      designation: "Assistant Manager",
      type: isAA ? "Final Approval" : "Mid-Year Review",
      completedOn: "Mar 6, 2026",
      completedBy: "You",
      score: "78.5",
      grade: "Gold",
    },
    {
      id: "4",
      employeeId: "EMP013",
      employeeName: "David Martinez",
      designation: "Senior Executive",
      type: isAA ? "Final Approval" : "Final Evaluation",
      completedOn: "Mar 5, 2026",
      completedBy: "You",
      score: "68.0",
      grade: "Silver",
    },
    {
      id: "5",
      employeeId: "EMP014",
      employeeName: "Lisa Anderson",
      designation: "Manager",
      type: isAA ? "Final Approval" : "KRA Approval",
      completedOn: "Mar 4, 2026",
      completedBy: "You",
      score: "90.5",
      grade: "Platinum",
    },
  ];

  // Determine review link based on role
  const getReviewLink = (employeeId: string) => {
    if (isAA) return `/aa/approval/${employeeId}`;
    if (isRVO) return `/rvo/review/${employeeId}`;
    return `/review/evaluation/${employeeId}`;
  };

  const getGradeBadgeColor = (grade: string) => {
    switch (grade) {
      case "Platinum":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "Gold":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Silver":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "Bronze":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          {pageTitle}
        </h1>
        <p className="text-gray-600 mt-1">{pageDescription}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 hidden">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">
            Completed This Month
          </p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            28
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">
            Avg. Review Time
          </p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            2.5d
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Avg. Score</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">
            82.9
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">This Week</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            12
          </p>
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
          <select className="px-4 py-2 border border-gray-300 rounded-lg">
            <option>All Grades</option>
            <option>Platinum</option>
            <option>Gold</option>
            <option>Silver</option>
            <option>Bronze</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            More Filters
          </button>
        </div>
      </div>

      {/* Completed Items List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">
              Completed Evaluations
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-600" />
              {completedItems.length} evaluations
            </div>
          </div>
        </div>
        <div className="divide-y divide-gray-200 max-h-[400px] overflow-y-auto">
          {completedItems.map((item) => (
            <div
              key={item.id}
              className="p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1.5">
                    <h3 className="font-medium text-gray-900">
                      {item.employeeName}
                    </h3>
                    <span className="text-sm text-gray-600">
                      ({item.employeeId})
                    </span>
                    <span
                      className={`px-2.5 py-1 text-xs font-semibold rounded border ${getGradeBadgeColor(item.grade)}`}
                    >
                      {item.grade}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {item.designation}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>
                      <span className="font-medium text-gray-900">{item.type}</span>
                    </span>
                    <span>•</span>
                    <span>
                      Completed: <span className="font-medium text-gray-900">{item.completedOn}</span>
                    </span>
                    <span>•</span>
                    <span>
                      Score: <span className="font-bold text-blue-600">{item.score}</span>
                    </span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-green-600">Completed</span>
                    </div>
                  </div>
                </div>

                <Link
                  to={getReviewLink(item.employeeId)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 ml-4"
                >
                  <Eye className="w-4 h-4" />
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentlyCompleted;