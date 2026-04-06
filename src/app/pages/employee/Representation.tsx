import { Upload, Clock, Send, FileText } from 'lucide-react';

const Representation = () => {
  const timeRemaining = '10 days 5 hours';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Representation</h1>
        <p className="text-gray-600 mt-1">Submit representation against your performance evaluation</p>
      </div>

      {/* Timer Alert */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start gap-3">
        <Clock className="w-5 h-5 text-orange-600 mt-0.5" />
        <div className="flex-1">
          <p className="font-medium text-orange-900">Submission Deadline</p>
          <p className="text-sm text-orange-700 mt-1">
            You have <span className="font-semibold">{timeRemaining}</span> remaining to submit your representation
          </p>
        </div>
      </div>

      {/* Evaluation Details */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Your Evaluation Summary</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Overall Score</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">8.5</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Grade</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">Very Good</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">KRA Score</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">8.5</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Disclosed On</p>
              <p className="text-sm font-medium text-gray-900 mt-1">Mar 15, 2026</p>
            </div>
          </div>
        </div>
      </div>

      {/* Representation Form */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Submit Representation</h2>
          <p className="text-sm text-gray-600 mt-1">
            You may submit a representation if you disagree with any aspect of your evaluation
          </p>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {/* Representation Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Representation Details <span className="text-red-600">*</span>
              </label>
              <textarea
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Please provide detailed reasons for your representation. Be specific about which aspects of the evaluation you disagree with and provide supporting facts..."
              />
              <p className="text-sm text-gray-600 mt-2">
                Please be professional and factual in your representation
              </p>
            </div>

            {/* Supporting Documents */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Supporting Documents
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  PDF, Word, or Excel (max 10MB)
                </p>
                <input type="file" className="hidden" multiple />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Upload any supporting documents that substantiate your representation
              </p>
            </div>

            {/* Uploaded Files Preview */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">Uploaded Documents</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">project_achievements.pdf</p>
                      <p className="text-xs text-gray-600">2.4 MB</p>
                    </div>
                  </div>
                  <button className="text-sm text-red-600 hover:text-red-700">Remove</button>
                </div>
              </div>
            </div>

            {/* Declaration */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="declaration"
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="declaration" className="text-sm text-gray-700">
                  I declare that the information provided in this representation is true and accurate to
                  the best of my knowledge. I understand that any false or misleading information may
                  result in disciplinary action.
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Previous Representations */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Representation History</h2>
        </div>
        <div className="p-6">
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No previous representations submitted</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2">
        <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          Cancel
        </button>
        <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Send className="w-4 h-4" />
          Submit Representation
        </button>
      </div>
    </div>
  );
};

export default Representation;
