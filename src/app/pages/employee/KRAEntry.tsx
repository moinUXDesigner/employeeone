import { useState } from "react";
import {
  Plus,
  Trash2,
  Save,
  Send,
  Eye,
  X,
  Edit2,
  LayoutGrid,
  List,
  Upload,
  PenTool,
  Shield,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";

interface KRA {
  id: string;
  kpi: string;
  targetAnnual: string;
  actualAchievement: string;
  sourceRefNo: string;
  sourceFiles?: string[]; // Array of file names
  employeeNotes: string;
  startDate?: string;
  endDate?: string;
}

const KRAEntry = () => {
  const [kras, setKras] = useState<KRA[]>([]);
  const [showExamples, setShowExamples] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState<"card" | "table">(
    "card",
  );
  const [showSubmitPopup, setShowSubmitPopup] = useState(false);
  const [formData, setFormData] = useState<KRA>({
    id: "",
    kpi: "",
    targetAnnual: "",
    actualAchievement: "",
    sourceRefNo: "",
    sourceFiles: [],
    employeeNotes: "",
    startDate: "",
    endDate: "",
  });

  // Example KPIs for reference
  const exampleKPIs = [
    {
      kpi: "Project Delivery and Timeline Management",
      targetAnnual:
        "Complete 95% of assigned projects within scheduled timeline and budget",
      actualAchievement:
        "Completed 92% of projects within timeline",
      sourceRefNo:
        "Annual Project Plan 2025-26, Department Strategic Goals Document",
    },
    {
      kpi: "Customer Satisfaction Score",
      targetAnnual:
        "Achieve minimum 4.2/5.0 average customer satisfaction rating across all service touchpoints",
      actualAchievement: "Achieved 4.5/5.0 rating",
      sourceRefNo:
        "Customer Service Excellence Framework, Monthly Feedback Reports",
    },
    {
      kpi: "Process Improvement and Innovation",
      targetAnnual:
        "Implement at least 3 process improvement initiatives resulting in 10% efficiency gain",
      actualAchievement:
        "Implemented 4 initiatives with 12% efficiency gain",
      sourceRefNo:
        "Operational Excellence Policy, Innovation Guidelines 2025",
    },
    {
      kpi: "Team Development and Mentoring",
      targetAnnual:
        "Conduct quarterly skill development sessions and mentor 2 junior team members",
      actualAchievement:
        "Conducted 4 sessions and mentored 3 team members",
      sourceRefNo:
        "HR Development Policy, Training Calendar 2025-26",
    },
    {
      kpi: "Quality and Compliance Adherence",
      targetAnnual:
        "Maintain 100% compliance with quality standards and zero critical audit findings",
      actualAchievement:
        "Maintained 100% compliance with zero findings",
      sourceRefNo:
        "ISO Quality Standards, Compliance Manual Section 4.2",
    },
    {
      kpi: "Stakeholder Engagement",
      targetAnnual:
        "Organize monthly stakeholder meetings with 90% attendance and action item closure rate",
      actualAchievement:
        "Achieved 93% attendance and 95% closure rate",
      sourceRefNo:
        "Stakeholder Management Framework, Communication Policy",
    },
  ];

  const addKRA = () => {
    setFormData({
      id: Date.now().toString(),
      kpi: "",
      targetAnnual: "",
      actualAchievement: "",
      sourceRefNo: "",
      sourceFiles: [],
      employeeNotes: "",
      startDate: "",
      endDate: "",
    });
    setShowForm(true);
  };

  const removeKRA = (id: string) => {
    setKras(kras.filter((kra) => kra.id !== id));
    toast.success("KPI removed");
  };

  const updateFormData = (
    field: keyof KRA,
    value: string | number | string[],
  ) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSourceFilesChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const fileNames = Array.from(files).map(
      (file) => file.name,
    );
    const existingFiles = formData.sourceFiles || [];
    updateFormData("sourceFiles", [
      ...existingFiles,
      ...fileNames,
    ]);
    toast.success(
      `${files.length} file(s) attached to source reference`,
    );
  };

  const removeSourceFile = (fileName: string) => {
    const updatedFiles = (formData.sourceFiles || []).filter(
      (f) => f !== fileName,
    );
    updateFormData("sourceFiles", updatedFiles);
    toast.success("File removed");
  };

  const saveKRA = () => {
    // Validation
    if (!formData.kpi.trim()) {
      toast.error("Please enter KRA title");
      return;
    }
    if (!formData.targetAnnual.trim()) {
      toast.error("Please enter annual target");
      return;
    }
    if (!formData.sourceRefNo.trim()) {
      toast.error("Please enter source reference");
      return;
    }

    // Check if editing existing or adding new
    const existingIndex = kras.findIndex(
      (k) => k.id === formData.id,
    );
    if (existingIndex !== -1) {
      // Update existing
      const updated = [...kras];
      updated[existingIndex] = formData;
      setKras(updated);
      toast.success("KPI updated successfully");
    } else {
      // Add new
      setKras([...kras, formData]);
      toast.success("KPI saved successfully");
    }

    setShowForm(false);
  };

  const editKRA = (kra: KRA) => {
    setFormData(kra);
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
  };

  const handleSaveDraft = () => {
    toast.success("Draft saved successfully!");
  };

  const handleSubmit = () => {
    setShowSubmitPopup(true);
  };

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name
      .split(".")
      .pop()
      ?.toLowerCase();

    if (fileExtension === "csv") {
      // Handle CSV
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const rows = text
          .split("\n")
          .filter((row) => row.trim());

        // Skip header row and parse data
        const importedKRAs: KRA[] = rows
          .slice(1)
          .map((row, index) => {
            const cols = row
              .split(",")
              .map((col) => col.trim().replace(/^"|"$/g, ""));
            return {
              id: Date.now().toString() + index,
              kpi: cols[0] || "",
              targetAnnual: cols[1] || "",
              actualAchievement: cols[2] || "",
              sourceRefNo: cols[3] || "",
              sourceFiles: [],
              employeeNotes: cols[4] || "",
            };
          })
          .filter((kra) => kra.kpi); // Filter out empty rows

        setKras([...kras, ...importedKRAs]);
        toast.success(
          `${importedKRAs.length} KPI(s) imported successfully from CSV!`,
        );
        event.target.value = ""; // Reset file input
      };
      reader.readAsText(file);
    } else if (
      fileExtension === "xlsx" ||
      fileExtension === "xls"
    ) {
      // Handle Excel
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(
            e.target?.result as ArrayBuffer,
          );
          const workbook = XLSX.read(data, { type: "array" });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData: any[] =
            XLSX.utils.sheet_to_json(worksheet);

          // Map Excel columns to KRA structure
          const importedKRAs: KRA[] = jsonData
            .map((row, index) => ({
              id: Date.now().toString() + index,
              kpi:
                row["KPI"] ||
                row["kpi"] ||
                row["KRA/KPI"] ||
                "",
              targetAnnual:
                row["Target"] ||
                row["target"] ||
                row["Target (Annual)"] ||
                "",
              actualAchievement:
                row["Achievement"] ||
                row["achievement"] ||
                row["Actual Achievement"] ||
                "",
              sourceRefNo:
                row["Source"] ||
                row["source"] ||
                row["Source Ref. No."] ||
                "",
              sourceFiles: [],
              employeeNotes:
                row["Notes"] ||
                row["notes"] ||
                row["Employee Notes"] ||
                "",
            }))
            .filter((kra) => kra.kpi); // Filter out empty rows

          setKras([...kras, ...importedKRAs]);
          toast.success(
            `${importedKRAs.length} KPI(s) imported successfully from Excel!`,
          );
          event.target.value = ""; // Reset file input
        } catch (error) {
          toast.error(
            "Error parsing Excel file. Please check the format.",
          );
          console.error(error);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      toast.error("Please upload a CSV or Excel file");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            KRA Entry
          </h1>
          <p className="text-gray-600 mt-1">
            Define your Key Result Areas and Key Performance
            Indicators
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSaveDraft}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">Save Draft</span>
            <span className="sm:hidden">Save</span>
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Send className="w-4 h-4" />
            Submit
          </button>
        </div>
      </div>

      {/* Basic Information */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h2 className="font-semibold text-gray-900">
                Section I - Basic Information
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Officer details and reporting hierarchy
              </p>
            </div>
            
            {/* Period of Report */}
            <div className="flex items-center gap-4 bg-white border border-blue-200 rounded-lg px-4 py-3 flex-shrink-0">
              <div className="text-center">
                <label className="block text-xs font-medium text-blue-600 mb-1">
                  Start Date
                </label>
                <p className="text-lg font-bold text-blue-900">
                  01.04.2025
                </p>
              </div>
              <div className="w-8 h-0.5 bg-blue-300"></div>
              <div className="text-center">
                <label className="block text-xs font-medium text-blue-600 mb-1">
                  End Date
                </label>
                <p className="text-lg font-bold text-blue-900">
                  31.03.2026
                </p>
              </div>
              <div className="ml-2 px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full whitespace-nowrap">
                FY 2025-26
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Officer Information */}
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Name of Officer
                </label>
                <p className="text-base font-medium text-gray-900">
                  John Doe
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Employee ID
                </label>
                <p className="text-base font-medium text-gray-900">
                  EMP001
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Cadre/Wing
                </label>
                <p className="text-base font-medium text-gray-900">
                  Technical Services
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Designation
                </label>
                <p className="text-base font-medium text-gray-900">
                  Senior Manager
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Place of Posting
                </label>
                <p className="text-base font-medium text-gray-900">
                  Head Office, Mumbai
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Date of Joining (current post)
                </label>
                <p className="text-base font-medium text-gray-900">
                  15 Jan 2024
                </p>
              </div>
            </div>
          </div>

          {/* Period of Report and Reporting Hierarchy - Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-6">
            {/* Reporting Hierarchy */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Reporting Hierarchy
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Reporting Officer */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold text-xs">
                      RO
                    </div>
                    <h4 className="text-sm font-semibold text-gray-900">
                      Reporting Officer
                    </h4>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900">
                      Sarah Williams
                    </p>
                    <p className="text-xs text-gray-600">
                      EMP450
                    </p>
                  </div>
                </div>

                {/* Reviewing Officer */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold text-xs">
                      RVO
                    </div>
                    <h4 className="text-sm font-semibold text-gray-900">
                      Reviewing Officer
                    </h4>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900">
                      Michael Chen
                    </p>
                    <p className="text-xs text-gray-600">
                      EMP789
                    </p>
                  </div>
                </div>

                {/* Accepting Authority */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-orange-600 flex items-center justify-center text-white font-semibold text-xs">
                      AA
                    </div>
                    <h4 className="text-sm font-semibold text-gray-900">
                      Accepting Authority
                    </h4>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900">
                      Robert Kumar
                    </p>
                    <p className="text-xs text-gray-600">
                      EMP156
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KRA/KPI Planning */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-2">
            <div className="flex-1">
              <h2 className="font-semibold text-gray-900">
                Section II Part 1 - KRA/KPI Planning
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Define your Key Performance Indicators
              </p>
            </div>
            <div className="flex gap-2">
              {/* View Toggle */}
              {!showForm && kras.length > 0 && (
                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode("card")}
                    className={`flex items-center gap-2 px-3 py-2 text-sm ${
                      viewMode === "card"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                    <span className="hidden sm:inline">
                      Card
                    </span>
                  </button>
                  <button
                    onClick={() => setViewMode("table")}
                    className={`flex items-center gap-2 px-3 py-2 text-sm border-l border-gray-300 ${
                      viewMode === "table"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <List className="w-4 h-4" />
                    <span className="hidden sm:inline">
                      Table
                    </span>
                  </button>
                </div>
              )}
              <button
                onClick={() => setShowExamples(true)}
                className="flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
              >
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">
                  View Example
                </span>
                <span className="sm:hidden">Example</span>
              </button>
              <button
                onClick={addKRA}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">
                  Add KPI
                </span>
                <span className="sm:hidden">Add</span>
              </button>
              <label className="flex hidden items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">
                  Upload KRA
                </span>
                <span className="sm:hidden">Upload</span>
                <input
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Show Form when editing */}
          {showForm && (
            <div className="border border-blue-300 bg-blue-50 rounded-lg p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-semibold text-gray-900 text-lg">
                  {kras.find((k) => k.id === formData.id)
                    ? "Edit KPI"
                    : "Add New KPI"}
                </h3>
                <button
                  onClick={cancelForm}
                  className="p-1 text-gray-600 hover:bg-white rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    KRA/KPI{" "}
                    <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.kpi}
                    onChange={(e) =>
                      updateFormData("kpi", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                    placeholder="Enter KRA/KPI"
                  />
                </div>

                {/* KPI Date Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      KPI Start Date
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) =>
                        updateFormData(
                          "startDate",
                          e.target.value,
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      KPI End Date
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) =>
                        updateFormData(
                          "endDate",
                          e.target.value,
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target (Annual){" "}
                    <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    value={formData.targetAnnual}
                    onChange={(e) =>
                      updateFormData(
                        "targetAnnual",
                        e.target.value,
                      )
                    }
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                    placeholder="Enter annual target"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Actual Achievement{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.actualAchievement}
                    onChange={(e) =>
                      updateFormData(
                        "actualAchievement",
                        e.target.value,
                      )
                    }
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                    placeholder="Enter actual achievement"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Source Ref. No.{" "}
                    <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.sourceRefNo}
                    onChange={(e) =>
                      updateFormData(
                        "sourceRefNo",
                        e.target.value,
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                    placeholder="Enter source reference number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attach Source Files
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      multiple
                      onChange={handleSourceFilesChange}
                      className="hidden"
                      id="sourceFiles"
                    />
                    <label
                      htmlFor="sourceFiles"
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      Upload Files
                    </label>
                  </div>
                  {formData.sourceFiles &&
                    formData.sourceFiles.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Attached Files:
                        </p>
                        <ul className="list-disc pl-5">
                          {formData.sourceFiles.map(
                            (file, index) => (
                              <li
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <span className="text-sm text-gray-900">
                                  {file}
                                </span>
                                <button
                                  onClick={() =>
                                    removeSourceFile(file)
                                  }
                                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                                  title="Remove File"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </li>
                            ),
                          )}
                        </ul>
                      </div>
                    )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employee Notes - Constraints / Support
                    Required
                    <span className="text-gray-500 text-xs ml-2">
                      (Optional, 3-5 lines)
                    </span>
                  </label>
                  <textarea
                    value={formData.employeeNotes}
                    onChange={(e) =>
                      updateFormData(
                        "employeeNotes",
                        e.target.value,
                      )
                    }
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                    placeholder="Enter any constraints faced or support required (optional, 3-5 lines)"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={cancelForm}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-white"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={saveKRA}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Save className="w-4 h-4" />
                    Save KPI
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* KPI Cards or Empty State */}
          {!showForm && kras.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                <Plus className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No KPIs Added Yet
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Click the "Add KPI" button above to start
                defining your Key Performance Indicators for
                this appraisal period.
              </p>
              <button
                onClick={addKRA}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-5 h-5" />
                Add Your First KPI
              </button>
            </div>
          ) : (
            !showForm && (
              <>
                {viewMode === "card" ? (
                  // Card View
                  <div className="space-y-4">
                    {kras.map((kra, index) => (
                      <div
                        key={kra.id}
                        className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                              <span className="text-blue-700 font-semibold text-xs">
                                #{index + 1}
                              </span>
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">
                                {kra.kpi}
                              </h3>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => editKRA(kra)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                              title="Edit KPI"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => removeKRA(kra.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                              title="Delete KPI"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-10">
                          <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase mb-0.5">
                              Target (Annual)
                            </label>
                            <p className="text-sm text-gray-900 line-clamp-2">
                              {kra.targetAnnual}
                            </p>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase mb-0.5">
                              Actual Achievement
                            </label>
                            <p className="text-sm text-gray-900 line-clamp-2">
                              {kra.actualAchievement ||
                                "Not yet recorded"}
                            </p>
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-gray-500 uppercase mb-0.5">
                              Source Ref. No.
                            </label>
                            <p className="text-sm text-gray-900 truncate">
                              {kra.sourceRefNo}
                            </p>
                            {kra.sourceFiles &&
                              kra.sourceFiles.length > 0 && (
                                <div className="mt-1">
                                  <p className="text-xs text-gray-500">
                                    Attachments:
                                  </p>
                                  <ul className="list-disc pl-4">
                                    {kra.sourceFiles.map(
                                      (file, idx) => (
                                        <li
                                          key={idx}
                                          className="text-xs text-blue-600 truncate"
                                        >
                                          {file}
                                        </li>
                                      ),
                                    )}
                                  </ul>
                                </div>
                              )}
                          </div>

                          {kra.employeeNotes && (
                            <div className="md:col-span-2">
                              <label className="block text-xs font-medium text-gray-500 uppercase mb-0.5">
                                Employee Notes
                              </label>
                              <p className="text-sm text-gray-900 italic line-clamp-2">
                                {kra.employeeNotes}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Table View
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-12">
                            #
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            KRA/KPI
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Target (Annual)
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Actual Achievement
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Source Ref. No.
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Employee Notes
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-24">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {kras.map((kra, index) => (
                          <tr
                            key={kra.id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-4 py-4 text-sm">
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-blue-700 font-semibold text-xs">
                                  {index + 1}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <p className="font-medium text-gray-900">
                                {kra.kpi}
                              </p>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-900 max-w-xs">
                              {kra.targetAnnual}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-900 max-w-xs">
                              {kra.actualAchievement ||
                                "Not yet recorded"}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-900 max-w-xs">
                              {kra.sourceRefNo}
                              {kra.sourceFiles &&
                                kra.sourceFiles.length > 0 && (
                                  <div className="mt-1">
                                    <p className="text-xs text-gray-500">
                                      Attachments:{" "}
                                      {kra.sourceFiles.length}{" "}
                                      file(s)
                                    </p>
                                  </div>
                                )}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-900 max-w-xs">
                              {kra.employeeNotes ? (
                                <span className="italic">
                                  {kra.employeeNotes}
                                </span>
                              ) : (
                                <span className="text-gray-400">
                                  -
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => editKRA(kra)}
                                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                                  title="Edit KPI"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() =>
                                    removeKRA(kra.id)
                                  }
                                  className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                  title="Delete KPI"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2">
        <button className="flex items-center gap-2 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          <Save className="w-4 h-4" />
          Save Draft
        </button>
        <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Send className="w-4 h-4" />
          Submit
        </button>
      </div>

      {/* Example KPI Modal */}
      {showExamples && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Example KPI Template
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Reference examples to help you define your
                  KRAs
                </p>
              </div>
              <button
                onClick={() => setShowExamples(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto flex-1 p-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-900">
                  <strong>Note:</strong> These are sample KPIs
                  for reference. Customize them according to
                  your role, responsibilities, and
                  organizational goals.
                </p>
              </div>

              <div className="space-y-6">
                {exampleKPIs.map((example, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-5 bg-gray-50"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">
                        KPI #{index + 1}
                      </h3>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 uppercase mb-1">
                          KRA/KPI
                        </label>
                        <p className="text-sm text-gray-900 font-medium">
                          {example.kpi}
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 uppercase mb-1">
                          Target (Annual)
                        </label>
                        <p className="text-sm text-gray-900">
                          {example.targetAnnual}
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 uppercase mb-1">
                          Actual Achievement
                        </label>
                        <p className="text-sm text-gray-900">
                          {example.actualAchievement}
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 uppercase mb-1">
                          Source Ref. No.
                        </label>
                        <p className="text-sm text-gray-900">
                          {example.sourceRefNo}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowExamples(false)}
                className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Popup */}
      {showSubmitPopup && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Submit KRA Entry
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Choose your submission method
                </p>
              </div>
              <button
                onClick={() => setShowSubmitPopup(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="space-y-3">
                <button
                  onClick={() => {
                    toast.success(
                      "KRA submitted successfully via e-Sign!",
                    );
                    setShowSubmitPopup(false);
                  }}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
                >
                  <PenTool className="w-5 h-5" />
                  <span className="font-semibold">e-Sign</span>
                </button>

                <button
                  onClick={() => {
                    toast.success(
                      "KRA submitted successfully via DSC!",
                    );
                    setShowSubmitPopup(false);
                  }}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg"
                >
                  <Shield className="w-5 h-5" />
                  <span className="font-semibold">DSC</span>
                </button>

                <button
                  onClick={() => {
                    toast.success(
                      "KRA downloaded successfully!",
                    );
                    setShowSubmitPopup(false);
                  }}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all shadow-md hover:shadow-lg"
                >
                  <Download className="w-5 h-5" />
                  <span className="font-semibold">
                    Download
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KRAEntry;