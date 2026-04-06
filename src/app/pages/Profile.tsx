import { useState } from 'react';
import { User, Mail, Phone, MapPin, Building, Calendar, Briefcase, Save, Edit2 } from 'lucide-react';
import { toast } from 'sonner';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Details
    fullName: 'John Doe',
    email: 'john.doe@organization.in',
    phone: '+91 98765 43210',
    dateOfBirth: '1990-05-15',
    address: '123 Green Park, New Delhi - 110016',
    
    // Employment Details
    employeeId: 'EMP001',
    designation: 'Senior Manager',
    department: 'Operations',
    wing: 'Technical Wing',
    grade: 'A',
    dateOfJoining: '2018-04-01',
    reportingOfficer: 'Jane Smith (RO)',
    reviewingOfficer: 'Robert Johnson (RVO)',
    location: 'New Delhi HQ',
  });

  const handleSave = () => {
    // Save profile changes
    toast.success('Profile updated successfully!');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data if needed
  };

  const InfoField = ({ 
    icon: Icon, 
    label, 
    value, 
    name, 
    type = 'text' 
  }: { 
    icon: any; 
    label: string; 
    value: string; 
    name: string; 
    type?: string;
  }) => (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <Icon className="w-4 h-4" />
        {label}
      </label>
      {isEditing ? (
        <input
          type={type}
          name={name}
          value={value}
          onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
      ) : (
        <p className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900">{value}</p>
      )}
    </div>
  );

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-1">Manage your personal and employment information</p>
        </div>
        
        <div className="flex gap-3">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Profile Picture Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-semibold">
            {formData.fullName.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-semibold text-gray-900">{formData.fullName}</h2>
            <p className="text-gray-600">{formData.designation}</p>
            <p className="text-sm text-gray-500 mt-1">{formData.employeeId} • {formData.department}</p>
          </div>
          {isEditing && (
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium">
              Change Photo
            </button>
          )}
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoField
              icon={User}
              label="Full Name"
              value={formData.fullName}
              name="fullName"
            />
            <InfoField
              icon={Mail}
              label="Email Address"
              value={formData.email}
              name="email"
              type="email"
            />
            <InfoField
              icon={Phone}
              label="Phone Number"
              value={formData.phone}
              name="phone"
              type="tel"
            />
            <InfoField
              icon={Calendar}
              label="Date of Birth"
              value={formData.dateOfBirth}
              name="dateOfBirth"
              type="date"
            />
            <div className="md:col-span-2">
              <InfoField
                icon={MapPin}
                label="Address"
                value={formData.address}
                name="address"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Employment Information */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Employment Information</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoField
              icon={User}
              label="Employee ID"
              value={formData.employeeId}
              name="employeeId"
            />
            <InfoField
              icon={Briefcase}
              label="Designation"
              value={formData.designation}
              name="designation"
            />
            <InfoField
              icon={Building}
              label="Department"
              value={formData.department}
              name="department"
            />
            <InfoField
              icon={Building}
              label="Wing"
              value={formData.wing}
              name="wing"
            />
            <InfoField
              icon={User}
              label="Grade"
              value={formData.grade}
              name="grade"
            />
            <InfoField
              icon={Calendar}
              label="Date of Joining"
              value={formData.dateOfJoining}
              name="dateOfJoining"
              type="date"
            />
            <InfoField
              icon={User}
              label="Reporting Officer"
              value={formData.reportingOfficer}
              name="reportingOfficer"
            />
            <InfoField
              icon={User}
              label="Reviewing Officer"
              value={formData.reviewingOfficer}
              name="reviewingOfficer"
            />
            <InfoField
              icon={MapPin}
              label="Work Location"
              value={formData.location}
              name="location"
            />
          </div>
        </div>
      </div>

      {/* PMS History Summary */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">PMS History</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[
              { year: '2025-26', status: 'In Progress', grade: '-', score: '-' },
              { year: '2024-25', status: 'Completed', grade: 'Very Good', score: '88/100' },
              { year: '2023-24', status: 'Completed', grade: 'Very Good', score: '85/100' },
              { year: '2022-23', status: 'Completed', grade: 'Good', score: '78/100' },
            ].map((record, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-lg gap-3">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Assessment Year {record.year}</p>
                  <p className="text-sm text-gray-600 mt-1">Grade: {record.grade} • Score: {record.score}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium self-start sm:self-center ${
                  record.status === 'Completed' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {record.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
