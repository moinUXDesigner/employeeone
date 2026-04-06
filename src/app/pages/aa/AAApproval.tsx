import { useState, useEffect } from "react";
import {
  Save,
  Lock,
  ArrowLeft,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Check,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Shield,
} from "lucide-react";
import { useParams, Link, useNavigate } from "react-router";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Training {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
}

interface KRA {
  id: string;
  sl: string;
  code: string;
  kpi: string;
  targetAnnual: string;
  actualAchievement: string;
  sourceRefNo: string;
  uploadedFiles: { name: string; url: string }[];
  status: "Approved" | "Pending";
  type: "initial" | "revised";
  ro: { rating: string; weightagePercent: string; score: string; validationNotes: string };
  rvo: { rating: string; weightagePercent: string; score: string; validationNotes: string };
  aa: { rating: string; justification: string; overridden: boolean };
}

// ─── Component ────────────────────────────────────────────────────────────────
const AAApproval = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();

  // Stepper
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [currentKRAIndex, setCurrentKRAIndex] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showSourceDetails, setShowSourceDetails] = useState(false);

  // Lock confirmation
  const [showLockConfirmation, setShowLockConfirmation] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  // Override toggles per section
  const [overrideAttributes, setOverrideAttributes] = useState(false);
  const [overrideCompetencies, setOverrideCompetencies] = useState(false);

  // ── RO Attribute Ratings (pre-populated) ──
  const [attributeRatings, setAttributeRatings] = useState<{ [k: number]: string }>({});
  const [attributeRemarks, setAttributeRemarks] = useState<{ [k: number]: string }>({});

  // ── RVO Attribute Ratings (pre-populated) ──
  const [rvoAttributeRatings, setRvoAttributeRatings] = useState<{ [k: number]: string }>({});
  const [rvoAttributeRemarks, setRvoAttributeRemarks] = useState<{ [k: number]: string }>({});

  // ── AA Attribute Overrides ──
  const [aaAttributeRatings, setAaAttributeRatings] = useState<{ [k: number]: string }>({});
  const [aaAttributeJustifications, setAaAttributeJustifications] = useState<{ [k: number]: string }>({});

  // ── RO Competency Ratings ──
  const [competencyRatings, setCompetencyRatings] = useState<{ [k: number]: string }>({});
  const [competencyRemarks, setCompetencyRemarks] = useState<{ [k: number]: string }>({});

  // ── RVO Competency Ratings ──
  const [rvoCompetencyRatings, setRvoCompetencyRatings] = useState<{ [k: number]: string }>({});
  const [rvoCompetencyRemarks, setRvoCompetencyRemarks] = useState<{ [k: number]: string }>({});

  // ── AA Competency Overrides ──
  const [aaCompetencyRatings, setAaCompetencyRatings] = useState<{ [k: number]: string }>({});
  const [aaCompetencyJustifications, setAaCompetencyJustifications] = useState<{ [k: number]: string }>({});

  // ── Summary ──
  const [keyOutcomes, setKeyOutcomes] = useState("");
  const [strengths, setStrengths] = useState("");
  const [areasForImprovement, setAreasForImprovement] = useState("");
  const [overallAssessment, setOverallAssessment] = useState("");
  const [rvoKeyOutcomes, setRvoKeyOutcomes] = useState("");
  const [rvoStrengths, setRvoStrengths] = useState("");
  const [rvoAreasForImprovement, setRvoAreasForImprovement] = useState("");
  const [rvoOverallAssessment, setRvoOverallAssessment] = useState("");

  // ── AA Final Remarks ──
  const [aaRemarks, setAaRemarks] = useState("");
  const [aaDecision, setAaDecision] = useState<"agree" | "override" | "">("");
  const [aaOverallJustification, setAaOverallJustification] = useState("");
  const [integrityConfirmed, setIntegrityConfirmed] = useState(false);

  // ── Training ──
  const [roTrainings, setRoTrainings] = useState<Training[]>([]);
  const [rvoTrainings, setRvoTrainings] = useState<Training[]>([]);
  const [aaTrainings, setAaTrainings] = useState<Training[]>([]);
  const [showAaTrainingForm, setShowAaTrainingForm] = useState(false);
  const [currentAaTraining, setCurrentAaTraining] = useState<Training>({ id: "", title: "", description: "", priority: "medium" });

  // ── KRAs ──
  const [kras, setKras] = useState<KRA[]>([
    {
      id: "1", sl: "1", code: "KRA-001",
      kpi: "Customer Service Excellence - Maintain high standards of customer service and satisfaction",
      targetAnnual: "Customer satisfaction rating above 4.5/5 and response time within 24 hours",
      actualAchievement: "Achieved 4.7/5 rating with average response time of 18 hours",
      sourceRefNo: "CS-2026-001",
      uploadedFiles: [{ name: "Customer_Feedback_Report_Q1.pdf", url: "#" }, { name: "Response_Time_Analysis.xlsx", url: "#" }],
      status: "Approved", type: "initial",
      ro: { rating: "9", weightagePercent: "25", score: "22.50", validationNotes: "Excellent customer service delivery throughout the year." },
      rvo: { rating: "9", weightagePercent: "25", score: "22.50", validationNotes: "Concur with RO. Exceptional service standards maintained." },
      aa: { rating: "", justification: "", overridden: false },
    },
    {
      id: "2", sl: "2", code: "KRA-002",
      kpi: "Process Improvement - Identify and implement process improvements to enhance operational efficiency",
      targetAnnual: "Implement 3 process improvements with cost savings of INR 50,000",
      actualAchievement: "Implemented 4 improvements with total cost savings of INR 65,000",
      sourceRefNo: "PI-2026-002",
      uploadedFiles: [{ name: "Process_Improvement_Report.pdf", url: "#" }, { name: "Cost_Savings_Analysis.xlsx", url: "#" }],
      status: "Pending", type: "initial",
      ro: { rating: "8", weightagePercent: "20", score: "16.00", validationNotes: "Exceeded targets with significant cost savings." },
      rvo: { rating: "8", weightagePercent: "20", score: "16.00", validationNotes: "Agreed. Strong process improvement mindset." },
      aa: { rating: "", justification: "", overridden: false },
    },
    {
      id: "3", sl: "3", code: "KRA-003",
      kpi: "Team Collaboration - Foster effective collaboration within the team and across departments",
      targetAnnual: "Participate in 2 cross-functional projects with team satisfaction score of 4.0+",
      actualAchievement: "Participated in 3 projects with team satisfaction score of 4.3",
      sourceRefNo: "TC-2026-003",
      uploadedFiles: [{ name: "Team_Feedback_Survey.pdf", url: "#" }],
      status: "Approved", type: "revised",
      ro: { rating: "8", weightagePercent: "15", score: "12.00", validationNotes: "Strong collaboration and team leadership." },
      rvo: { rating: "7", weightagePercent: "15", score: "10.50", validationNotes: "Good collaboration but room for improvement in cross-dept initiatives." },
      aa: { rating: "", justification: "", overridden: false },
    },
  ]);

  // ─── Personal Attributes data ──────────────────────────────────────────────
  const personalAttributes = [
    { sl_no: 1, attribute: "Integrity & Ethics", weightage_percent: 15 },
    { sl_no: 2, attribute: "Discipline / Dependability", weightage_percent: 15 },
    { sl_no: 3, attribute: "Communication / Perception / Understanding Capabilities", weightage_percent: 15 },
    { sl_no: 4, attribute: "Creativity", weightage_percent: 10 },
    { sl_no: 5, attribute: "Teamwork / Collaboration", weightage_percent: 15 },
    { sl_no: 6, attribute: "Initiative / Proactiveness", weightage_percent: 10 },
    { sl_no: 7, attribute: "Stakeholder / Consumer Orientation", weightage_percent: 10 },
    { sl_no: 8, attribute: "Punctuality / Promptness", weightage_percent: 10 },
  ];

  // ─── Functional Competencies data ─────────────────────────────────────────
  const functionalCompetencies = [
    { sl_no: 1, competency: "Job Knowledge / Domain Capability", weightage_percent: 20 },
    { sl_no: 2, competency: "Planning & Organizing", weightage_percent: 15 },
    { sl_no: 3, competency: "Problem Solving / Decision Support", weightage_percent: 15 },
    { sl_no: 4, competency: "Quality Orientation", weightage_percent: 10 },
    { sl_no: 5, competency: "Safety & Compliance Orientation", weightage_percent: 15 },
    { sl_no: 6, competency: "Digital / Systems Usage (e-Office / SAP / Tools)", weightage_percent: 15 },
    { sl_no: 7, competency: "Drafting Skills", weightage_percent: 10 },
  ];

  // ─── Steps ─────────────────────────────────────────────────────────────────
  const steps = [
    { number: 1, title: "Basic Info", fullTitle: "Basic Information" },
    { number: 2, title: "KRA Rating", fullTitle: "KRA Rating" },
    { number: 3, title: "Personal", fullTitle: "Personal Attributes" },
    { number: 4, title: "Functional", fullTitle: "Functional Competencies" },
    { number: 5, title: "Summary", fullTitle: "Overall Summary" },
    { number: 6, title: "Training", fullTitle: "Training Needs" },
    { number: 7, title: "Final", fullTitle: "AA Final Decision" },
  ];

  // ─── Helpers ───────────────────────────────────────────────────────────────
  const calculateScore = (rating: string, weightage: number) => {
    if (!rating) return "-";
    return ((parseFloat(rating) * weightage) / 100).toFixed(2);
  };

  const calculateTotalScore = (ratings: { [k: number]: string }, items: { sl_no: number; weightage_percent: number }[]) => {
    let total = 0;
    items.forEach((item) => {
      const r = ratings[item.sl_no];
      if (r) total += (parseFloat(r) * item.weightage_percent) / 100;
    });
    return total.toFixed(2);
  };

  const getEffectiveRating = (roRating: string, rvoRating: string, aaRating: string) => {
    if (aaRating) return aaRating;
    if (rvoRating) return rvoRating;
    return roRating;
  };

  const ratingsAgree = (ro: string, rvo: string) => ro === rvo;

  // ─── Lifecycle ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const handleSidebarToggle = (event: CustomEvent) => setSidebarCollapsed(event.detail.collapsed);
    const saved = localStorage.getItem("sidebarCollapsed");
    setSidebarCollapsed(saved === "true");
    window.addEventListener("sidebarToggle", handleSidebarToggle as EventListener);
    return () => window.removeEventListener("sidebarToggle", handleSidebarToggle as EventListener);
  }, []);

  useEffect(() => {
    // Pre-populate RO ratings
    setAttributeRatings({ 1: "9", 2: "8", 3: "8", 4: "7", 5: "9", 6: "8", 7: "8", 8: "9" });
    setAttributeRemarks({ 1: "High integrity", 8: "Always punctual" });
    setRvoAttributeRatings({ 1: "9", 2: "8", 3: "9", 4: "7", 5: "9", 6: "8", 7: "8", 8: "9" });
    setRvoAttributeRemarks({ 1: "Excellent ethics & integrity", 3: "Very good communication" });

    setCompetencyRatings({ 1: "8", 2: "8", 3: "7", 4: "8", 5: "9", 6: "7", 7: "7" });
    setCompetencyRemarks({ 5: "Excellent safety awareness" });
    setRvoCompetencyRatings({ 1: "8", 2: "8", 3: "8", 4: "8", 5: "9", 6: "7", 7: "7" });
    setRvoCompetencyRemarks({ 3: "Good problem solving skills" });

    setKeyOutcomes("Successfully delivered 5 major projects ahead of schedule. Demonstrated excellent leadership in managing cross-functional teams. Maintained high client satisfaction throughout the year.");
    setStrengths("Strong project management and execution capabilities. Excellent communication and stakeholder management. Proactive problem-solving approach.");
    setAreasForImprovement("Can improve on technical documentation. Opportunity to enhance strategic planning skills.");
    setOverallAssessment("The officer has demonstrated exceptional performance throughout the year, consistently exceeding targets and maintaining high standards of work quality.");
    setRvoKeyOutcomes("Concurs with RO on all key outcomes. Additionally noted strong mentoring of junior staff.");
    setRvoStrengths("Strong leadership and cross-functional collaboration. Excellent stakeholder management.");
    setRvoAreasForImprovement("Focus on documentation practices and digital upskilling.");
    setRvoOverallAssessment("RVO concurs with RO's overall assessment. Employee is recommended for promotion consideration.");

    setRoTrainings([
      { id: "1", title: "Advanced Project Management", description: "To enhance project planning and execution skills", priority: "high" },
      { id: "2", title: "Strategic Leadership Program", description: "Develop strategic thinking and leadership capabilities", priority: "medium" },
    ]);
    setRvoTrainings([
      { id: "1", title: "Digital Transformation Certification", description: "Upskill in digital tools and SAP modules", priority: "medium" },
    ]);
  }, []);

  // ─── Navigation ────────────────────────────────────────────────────────────
  const handleNext = () => {
    if (!completedSteps.includes(currentStep)) setCompletedSteps([...completedSteps, currentStep]);
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
      toast.success("Progress saved");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setShowLockConfirmation(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) { setCurrentStep(currentStep - 1); window.scrollTo({ top: 0, behavior: "smooth" }); }
  };

  const handleStepClick = (step: number) => {
    if (completedSteps.includes(step) || step === currentStep || step === currentStep + 1) {
      setCurrentStep(step);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSaveDraft = () => toast.success("Draft saved successfully!");

  const handleFinalLock = () => {
    if (!aaRemarks.trim()) { toast.error("Please add your final remarks before locking."); return; }
    if (!integrityConfirmed) { toast.error("Please confirm the integrity declaration."); return; }
    setIsLocked(true);
    setShowLockConfirmation(false);
    toast.success("Record finalized and locked successfully!");
    setTimeout(() => navigate("/review/pending-approvals"), 2000);
  };

  // ─── KRA helpers ───────────────────────────────────────────────────────────
  const updateKraAA = (id: string, field: keyof KRA["aa"], value: string | boolean) => {
    setKras(kras.map((k) => k.id === id ? { ...k, aa: { ...k.aa, [field]: value } } : k));
  };

  const handlePrevKRA = () => { if (currentKRAIndex > 0) setCurrentKRAIndex(currentKRAIndex - 1); };
  const handleNextKRA = () => { if (currentKRAIndex < kras.length - 1) setCurrentKRAIndex(currentKRAIndex + 1); };

  // ─── AA Training helpers ───────────────────────────────────────────────────
  const handleSaveAaTraining = () => {
    if (!currentAaTraining.title.trim()) { toast.error("Please enter a training title"); return; }
    setAaTrainings([...aaTrainings, { ...currentAaTraining, id: Date.now().toString() }]);
    setCurrentAaTraining({ id: "", title: "", description: "", priority: "medium" });
    setShowAaTrainingForm(false);
  };

  // ─── Shared UI helpers ─────────────────────────────────────────────────────
  const DiffBadge = ({ ro, rvo }: { ro: string; rvo: string }) => {
    const agree = ratingsAgree(ro, rvo);
    return agree ? (
      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-green-100 text-green-700">
        <Check className="w-2.5 h-2.5" /> Agreed
      </span>
    ) : (
      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-orange-100 text-orange-700">
        <AlertTriangle className="w-2.5 h-2.5" /> Differs
      </span>
    );
  };

  // ─── Step renderers ────────────────────────────────────────────────────────
  const renderStepContent = () => {
    switch (currentStep) {

      // ── Step 1: Basic Info ─────────────────────────────────────────────────
      case 1:
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Section I - Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {[
                ["Name of Officer", "John Doe"],
                ["Employee ID", employeeId || "EMP001"],
                ["Cadre / Wing", "Technical Services"],
                ["Designation", "Senior Manager"],
                ["Grade", "Grade A1"],
                ["Place of Posting", "Head Office"],
                ["Date of Joining (Current Post)", "15 Jan 2024"],
                ["Reporting Officer", "Sarah Wilson"],
                ["Reviewing Officer", "Michael Brown"],
                ["Period of Appraisal", "01 Apr 2025 – 31 Mar 2026"],
              ].map(([label, value]) => (
                <div key={label}>
                  <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
                  <p className="text-sm font-semibold text-gray-900">{value}</p>
                </div>
              ))}
            </div>

            {/* Workflow status pill */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="text-xs font-medium text-gray-500 mb-3">Workflow Status</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Employee", color: "bg-green-100 text-green-700", status: "Submitted" },
                  { label: "RO", color: "bg-green-100 text-green-700", status: "Reviewed" },
                  { label: "RVO", color: "bg-green-100 text-green-700", status: "Reviewed" },
                  { label: "AA", color: "bg-blue-100 text-blue-700", status: "Pending" },
                ].map((s) => (
                  <div key={s.label} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${s.color} text-xs font-medium`}>
                    <CheckCircle className="w-3 h-3" />
                    {s.label}: {s.status}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      // ── Step 2: KRA Rating ────────────────────────────────────────────────
      case 2: {
        const currentKRA = kras[currentKRAIndex];
        return (
          <div className="space-y-0 -mt-4">
            {/* Sticky KRA Nav Pills */}
            <div
              className="fixed top-[109px] sm:top-[120px] md:top-[190px] left-0 lg:left-64 right-0 z-[8] bg-white border-b border-gray-200 transition-all duration-300"
              style={{ left: typeof window !== "undefined" && window.innerWidth >= 1024 ? sidebarCollapsed ? "5rem" : "16rem" : "0" }}
            >
              <div className="px-4 lg:px-8 pt-2 pb-3">
                <div className="hidden md:flex items-center justify-between gap-6">
                  <div className="flex-shrink-0">
                    <h2 className="text-base font-bold text-gray-900">Section II – KRA Ratings</h2>
                    <p className="text-xs text-gray-600 mt-0.5">Review RO &amp; RVO ratings, override if required</p>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {kras.map((kra, index) => (
                      <button
                        type="button"
                        key={kra.id}
                        onClick={() => setCurrentKRAIndex(index)}
                        className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium text-sm transition-all ${currentKRAIndex === index ? "bg-blue-600 text-white shadow-sm" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                      >
                        {kra.code}
                        {kra.ro.rating && <Check className="inline-block w-3.5 h-3.5 ml-1.5" />}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Mobile */}
                <div className="md:hidden flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-gray-900">Section II – KRA</h2>
                    <p className="text-xs text-gray-600">{currentKRA.code}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" title="Previous KRA" onClick={handlePrevKRA} disabled={currentKRAIndex === 0} className={`p-1.5 rounded-lg ${currentKRAIndex === 0 ? "text-gray-300 cursor-not-allowed" : "text-blue-600 hover:bg-blue-50"}`}><ChevronLeft className="w-5 h-5" /></button>
                    <span className="text-xs text-gray-600">{currentKRAIndex + 1}/{kras.length}</span>
                    <button type="button" title="Next KRA" onClick={handleNextKRA} disabled={currentKRAIndex === kras.length - 1} className={`p-1.5 rounded-lg ${currentKRAIndex === kras.length - 1 ? "text-gray-300 cursor-not-allowed" : "text-blue-600 hover:bg-blue-50"}`}><ChevronRight className="w-5 h-5" /></button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main KRA content */}
            <div className="px-4 lg:px-8 pt-[140px] sm:pt-[150px] md:pt-[100px] pb-[220px] md:pb-[180px] space-y-6">
              {/* KRA Header */}
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold bg-blue-100 text-blue-700">{currentKRA.code}</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${currentKRA.type === "initial" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{currentKRA.type === "initial" ? "Initial" : "Revised"}</span>
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 mb-2">KRA / KPI</h3>
                    <p className="text-sm text-gray-700 leading-relaxed">{currentKRA.kpi}</p>
                  </div>
                  {currentKRA.status && (
                    <span className={`ml-4 flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${currentKRA.status === "Approved" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                      {currentKRA.status === "Approved" && <CheckCircle className="w-3.5 h-3.5" />}
                      {currentKRA.status}
                    </span>
                  )}
                </div>
                <div className="h-px bg-gray-200" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Target (Annual)</label>
                    <p className="text-sm text-gray-900">{currentKRA.targetAnnual}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Actual Achievement</label>
                    <p className="text-sm text-gray-900">{currentKRA.actualAchievement}</p>
                  </div>
                </div>
                <div className="h-px bg-gray-200" />

                {/* Source collapse */}
                <div>
                  <button type="button" onClick={() => setShowSourceDetails(!showSourceDetails)} className="w-full flex items-center justify-between py-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Source &amp; Attachments</span>
                    {showSourceDetails ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                  </button>
                  {showSourceDetails && (
                    <div className="pl-2 space-y-3 mt-2">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Source Ref No.</label>
                        <p className="text-sm text-gray-900 font-mono">{currentKRA.sourceRefNo}</p>
                      </div>
                      {currentKRA.uploadedFiles.length > 0 && (
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Attached Files</label>
                          <div className="flex flex-wrap gap-2">
                            {currentKRA.uploadedFiles.map((file, idx) => (
                              <a key={idx} href={file.url} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                                {file.name}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="h-px bg-gray-300" />

              {/* RO + RVO side-by-side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* RO */}
                <div className="rounded-lg border border-blue-200 bg-blue-50/40 p-4 space-y-3">
                  <h3 className="text-sm font-bold text-blue-800">RO Evaluation</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Rating (1-10)</label>
                      <div className="px-3 py-2 text-sm border border-blue-200 rounded-lg bg-white text-gray-900 font-bold text-center">{currentKRA.ro.rating || "—"}</div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Weightage (%)</label>
                      <div className="px-3 py-2 text-sm border border-blue-200 rounded-lg bg-white text-gray-900 font-semibold text-center">{currentKRA.ro.weightagePercent ? `${currentKRA.ro.weightagePercent}%` : "—"}</div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Score</label>
                    <div className="px-3 py-2 text-sm border border-blue-200 rounded-lg bg-white text-blue-700 font-bold text-center">{currentKRA.ro.score || "—"}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Validation Notes</label>
                    <div className="px-3 py-2 text-sm border border-blue-200 rounded-lg bg-white text-gray-700 min-h-[40px]">{currentKRA.ro.validationNotes || "—"}</div>
                  </div>
                </div>

                {/* RVO */}
                <div className="rounded-lg border border-amber-200 bg-amber-50/40 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-amber-800">RVO Evaluation</h3>
                    <DiffBadge ro={currentKRA.ro.rating} rvo={currentKRA.rvo.rating} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Rating (1-10)</label>
                      <div className="px-3 py-2 text-sm border border-amber-200 rounded-lg bg-white text-gray-900 font-bold text-center">{currentKRA.rvo.rating || "—"}</div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Weightage (%)</label>
                      <div className="px-3 py-2 text-sm border border-amber-200 rounded-lg bg-white text-gray-900 font-semibold text-center">{currentKRA.rvo.weightagePercent ? `${currentKRA.rvo.weightagePercent}%` : "—"}</div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Score</label>
                    <div className="px-3 py-2 text-sm border border-amber-200 rounded-lg bg-white text-amber-700 font-bold text-center">{currentKRA.rvo.score || "—"}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Validation Notes</label>
                    <div className="px-3 py-2 text-sm border border-amber-200 rounded-lg bg-white text-gray-700 min-h-[40px]">{currentKRA.rvo.validationNotes || "—"}</div>
                  </div>
                </div>
              </div>

              {/* AA Override for this KRA */}
              <div className={`rounded-lg border ${currentKRA.aa.overridden ? "border-green-300 bg-green-50/30" : "border-gray-200 bg-gray-50"} p-4`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-gray-900">AA Override</h3>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div
                      onClick={() => updateKraAA(currentKRA.id, "overridden", !currentKRA.aa.overridden)}
                      className={`relative w-10 h-5 rounded-full transition-colors ${currentKRA.aa.overridden ? "bg-green-600" : "bg-gray-300"}`}
                    >
                      <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${currentKRA.aa.overridden ? "translate-x-5" : ""}`} />
                    </div>
                    <span className="text-xs font-medium text-gray-700">{currentKRA.aa.overridden ? "Override Active" : "Override Off"}</span>
                  </label>
                </div>

                {currentKRA.aa.overridden ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">AA Rating (1-10) <span className="text-red-600">*</span></label>
                        <input
                          type="number" min="1" max="10"
                          className="w-full px-3 py-2 text-sm border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                          placeholder="1-10"
                          value={currentKRA.aa.rating}
                          onChange={(e) => updateKraAA(currentKRA.id, "rating", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">Effective Score</label>
                        <div className="px-3 py-2 text-sm border border-green-200 rounded-lg bg-white text-green-700 font-bold">
                          {currentKRA.aa.rating && currentKRA.rvo.weightagePercent
                            ? ((parseFloat(currentKRA.aa.rating) / 10) * parseFloat(currentKRA.rvo.weightagePercent)).toFixed(2)
                            : "—"}
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">Justification for Override <span className="text-red-600">*</span></label>
                      <textarea
                        rows={3}
                        className="w-full px-3 py-2 text-sm border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                        placeholder="Provide detailed justification for overriding the RVO rating..."
                        value={currentKRA.aa.justification}
                        onChange={(e) => updateKraAA(currentKRA.id, "justification", e.target.value)}
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 italic">AA accepts RVO rating. Enable override to modify.</p>
                )}
              </div>

              {/* KRA Mobile nav */}
              <div className="flex md:hidden justify-between pt-2">
                <button type="button" onClick={handlePrevKRA} disabled={currentKRAIndex === 0} className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm border ${currentKRAIndex === 0 ? "opacity-40 cursor-not-allowed border-gray-200 text-gray-400" : "border-gray-300 hover:bg-gray-50"}`}><ChevronLeft className="w-4 h-4" /> Prev KRA</button>
                <button type="button" onClick={handleNextKRA} disabled={currentKRAIndex === kras.length - 1} className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm border ${currentKRAIndex === kras.length - 1 ? "opacity-40 cursor-not-allowed border-gray-200 text-gray-400" : "border-gray-300 hover:bg-gray-50"}`}>Next KRA <ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        );
      }

      // ── Step 3: Personal Attributes ───────────────────────────────────────
      case 3: {
        return (
          <div className="space-y-4">
            <div className={`bg-white rounded-lg border ${overrideAttributes ? "border-green-300" : "border-gray-200"}`}>
              <div className={`p-4 md:p-6 md:py-3 border-b ${overrideAttributes ? "border-green-200 bg-green-50" : "border-gray-200"}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-gray-900">Section III (A) – Personal Attributes</h2>
                    <p className="text-sm text-gray-600 mt-0.5">Total Weightage: 100%</p>
                  </div>
                  {overrideAttributes ? (
                    <button type="button" onClick={() => setOverrideAttributes(false)} className="text-xs text-green-700 hover:text-green-900 underline">Cancel Override</button>
                  ) : (
                    <button type="button" onClick={() => setOverrideAttributes(true)} className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs font-medium transition-colors">
                      <Shield className="w-3 h-3" /> Override
                    </button>
                  )}
                </div>
              </div>
              <div className="p-4 md:p-6">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-xs md:text-sm">
                    <thead className="sticky top-0 z-10">
                      {overrideAttributes && (
                        <tr>
                          <th colSpan={2} className="border border-gray-200 px-2 py-1.5 bg-gray-50" />
                          <th colSpan={3} className="border border-blue-200 px-2 py-1.5 text-center font-semibold text-blue-700 bg-blue-50">RO Assessment</th>
                          <th colSpan={3} className="border border-amber-200 px-2 py-1.5 text-center font-semibold text-amber-700 bg-amber-50">RVO Assessment</th>
                          <th colSpan={3} className="border border-green-300 px-2 py-1.5 text-center font-semibold text-green-700 bg-green-50">AA Override</th>
                          <th className="border border-gray-200 px-2 py-1.5 bg-gray-50" />
                        </tr>
                      )}
                      <tr className="bg-gray-50">
                        <th className="border border-gray-200 px-2 py-2 text-left font-semibold text-gray-900 w-10">Sl.</th>
                        <th className="border border-gray-200 px-2 py-2 text-left font-semibold text-gray-900">Attribute</th>
                        <th className={`border px-2 py-2 text-center font-semibold text-gray-900 ${overrideAttributes ? "border-blue-200 bg-blue-50" : "border-gray-200 bg-gray-50"}`}>RO Rating</th>
                        <th className={`border px-2 py-2 text-left font-semibold text-gray-900 ${overrideAttributes ? "border-blue-200 bg-blue-50" : "border-gray-200 bg-gray-50"}`}>RO Remark</th>
                        <th className={`border px-2 py-2 text-center font-semibold text-gray-900 ${overrideAttributes ? "border-blue-200 bg-blue-50" : "border-gray-200 bg-gray-50"}`}>{overrideAttributes ? "RO Score" : "RO Score"}</th>
                        {overrideAttributes && (
                          <>
                            <th className="border border-amber-200 px-2 py-2 text-center font-semibold text-amber-800 bg-amber-50">RVO Rating</th>
                            <th className="border border-amber-200 px-2 py-2 text-left font-semibold text-amber-800 bg-amber-50">RVO Remark</th>
                            <th className="border border-amber-200 px-2 py-2 text-center font-semibold text-amber-800 bg-amber-50">RVO Score</th>
                            <th className="border border-green-300 px-2 py-2 text-center font-semibold text-green-800 bg-green-50">AA Rating</th>
                            <th className="border border-green-300 px-2 py-2 text-left font-semibold text-green-800 bg-green-50">Justification</th>
                            <th className="border border-green-300 px-2 py-2 text-center font-semibold text-green-800 bg-green-50">Final Score</th>
                          </>
                        )}
                        {!overrideAttributes && (
                          <>
                            <th className="border border-gray-200 px-2 py-2 text-center font-semibold text-gray-900 bg-gray-50">RVO Rating</th>
                            <th className="border border-gray-200 px-2 py-2 text-left font-semibold text-gray-900 bg-gray-50">RVO Remark</th>
                            <th className="border border-gray-200 px-2 py-2 text-center font-semibold text-gray-900 bg-gray-50">RVO Score</th>
                          </>
                        )}
                        <th className="border border-gray-200 px-2 py-2 text-center font-semibold text-gray-900 bg-gray-50">Wt. (%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {personalAttributes.map((attr) => {
                        const roR = attributeRatings[attr.sl_no] || "";
                        const rvoR = rvoAttributeRatings[attr.sl_no] || "";
                        const aaR = aaAttributeRatings[attr.sl_no] || "";
                        const effectiveR = getEffectiveRating(roR, rvoR, aaR);
                        return (
                          <tr key={attr.sl_no} className={`hover:bg-gray-50 bg-white ${!ratingsAgree(roR, rvoR) && !overrideAttributes ? "bg-orange-50/40" : ""}`}>
                            <td className="border border-gray-200 px-2 py-2 text-gray-900">{attr.sl_no}</td>
                            <td className="border border-gray-200 px-2 py-2 text-gray-900">{attr.attribute}</td>
                            {/* RO */}
                            <td className={`border px-2 py-2 ${overrideAttributes ? "border-blue-200 bg-blue-50/20" : "border-gray-200"}`}>
                              <div className="px-2 py-1 border border-gray-300 rounded bg-gray-50 font-bold text-center text-gray-900">{roR || "—"}</div>
                            </td>
                            <td className={`border px-2 py-2 ${overrideAttributes ? "border-blue-200 bg-blue-50/20" : "border-gray-200"}`}>
                              <div className="px-2 py-1 border border-gray-300 rounded bg-gray-50 text-gray-700 min-w-[80px]">{attributeRemarks[attr.sl_no] || "—"}</div>
                            </td>
                            <td className={`border px-2 py-2 text-blue-600 font-semibold text-center ${overrideAttributes ? "border-blue-200 bg-blue-50/20" : "border-gray-200"}`}>
                              {calculateScore(roR, attr.weightage_percent)}
                            </td>
                            {/* RVO */}
                            {overrideAttributes ? (
                              <>
                                <td className="border border-amber-200 px-2 py-2 bg-amber-50/20">
                                  <div className="px-2 py-1 border border-amber-200 rounded bg-white font-bold text-center text-gray-900">{rvoR || "—"}</div>
                                </td>
                                <td className="border border-amber-200 px-2 py-2 bg-amber-50/20">
                                  <div className="px-2 py-1 border border-amber-200 rounded bg-white text-gray-700 min-w-[80px]">{rvoAttributeRemarks[attr.sl_no] || "—"}</div>
                                </td>
                                <td className="border border-amber-200 px-2 py-2 text-amber-600 font-semibold text-center bg-amber-50/20">
                                  {calculateScore(rvoR, attr.weightage_percent)}
                                </td>
                                {/* AA Override */}
                                <td className="border border-green-300 px-2 py-2 bg-green-50/30">
                                  <input
                                    type="number" min="1" max="10"
                                    className="w-16 px-2 py-1 text-xs border border-green-300 rounded focus:ring-1 focus:ring-green-500 bg-white"
                                    placeholder="1-10"
                                    value={aaR}
                                    onChange={(e) => setAaAttributeRatings({ ...aaAttributeRatings, [attr.sl_no]: e.target.value })}
                                  />
                                </td>
                                <td className="border border-green-300 px-2 py-2 bg-green-50/30">
                                  <input
                                    type="text"
                                    className="w-full min-w-[100px] px-2 py-1 text-xs border border-green-300 rounded focus:ring-1 focus:ring-green-500 bg-white"
                                    placeholder="Justification..."
                                    value={aaAttributeJustifications[attr.sl_no] || ""}
                                    onChange={(e) => setAaAttributeJustifications({ ...aaAttributeJustifications, [attr.sl_no]: e.target.value })}
                                  />
                                </td>
                                <td className="border border-green-300 px-2 py-2 text-green-700 font-semibold text-center bg-green-50/30">
                                  {calculateScore(effectiveR, attr.weightage_percent)}
                                </td>
                              </>
                            ) : (
                              <>
                                <td className="border border-gray-200 px-2 py-2">
                                  <div className="flex items-center gap-1.5">
                                    <div className="px-2 py-1 border border-gray-300 rounded bg-gray-50 font-bold text-center text-gray-900 w-12">{rvoR || "—"}</div>
                                    <DiffBadge ro={roR} rvo={rvoR} />
                                  </div>
                                </td>
                                <td className="border border-gray-200 px-2 py-2">
                                  <div className="px-2 py-1 border border-gray-300 rounded bg-gray-50 text-gray-700 min-w-[80px]">{rvoAttributeRemarks[attr.sl_no] || "—"}</div>
                                </td>
                                <td className="border border-gray-200 px-2 py-2 text-amber-600 font-semibold text-center">
                                  {calculateScore(rvoR, attr.weightage_percent)}
                                </td>
                              </>
                            )}
                            <td className="border border-gray-200 px-2 py-2 text-gray-900 text-center font-medium">{attr.weightage_percent}%</td>
                          </tr>
                        );
                      })}
                      {/* Totals row */}
                      <tr className={`font-semibold ${overrideAttributes ? "bg-green-50" : "bg-blue-50"}`}>
                        <td colSpan={4} className={`border border-gray-200 px-2 py-2 text-right text-gray-900 ${overrideAttributes ? "bg-green-50" : "bg-blue-50"}`}>Total Score:</td>
                        <td className="border border-gray-200 px-2 py-2 text-blue-600 font-bold text-center bg-blue-50">{calculateTotalScore(attributeRatings, personalAttributes)}</td>
                        {overrideAttributes && (
                          <>
                            <td colSpan={2} className="border border-amber-200 px-2 py-2 text-right text-gray-900 bg-amber-100">RVO:</td>
                            <td className="border border-amber-200 px-2 py-2 text-amber-700 font-bold text-center bg-amber-100">{calculateTotalScore(rvoAttributeRatings, personalAttributes)}</td>
                            <td colSpan={2} className="border border-green-300 px-2 py-2 text-right text-gray-900 bg-green-100">AA Final:</td>
                            <td className="border border-green-300 px-2 py-2 text-green-700 font-bold text-center bg-green-100">
                              {calculateTotalScore(
                                Object.fromEntries(personalAttributes.map((a) => [a.sl_no, getEffectiveRating(attributeRatings[a.sl_no] || "", rvoAttributeRatings[a.sl_no] || "", aaAttributeRatings[a.sl_no] || "")])),
                                personalAttributes,
                              )}
                            </td>
                          </>
                        )}
                        {!overrideAttributes && (
                          <>
                            <td colSpan={2} className="border border-gray-200 px-2 py-2 text-right text-gray-900 bg-amber-50">RVO Total:</td>
                            <td className="border border-gray-200 px-2 py-2 text-amber-600 font-bold text-center bg-amber-50">{calculateTotalScore(rvoAttributeRatings, personalAttributes)}</td>
                          </>
                        )}
                        <td aria-label="Weightage" className={`border border-gray-200 px-2 py-2 ${overrideAttributes ? "bg-green-50" : "bg-blue-50"}`} />
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );
      }

      // ── Step 4: Functional Competencies ──────────────────────────────────
      case 4: {
        return (
          <div className="space-y-4">
            <div className={`bg-white rounded-lg border ${overrideCompetencies ? "border-green-300" : "border-gray-200"}`}>
              <div className={`p-4 md:p-6 border-b ${overrideCompetencies ? "border-green-200 bg-green-50" : "border-gray-200"}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-gray-900">Section III (B) – Functional Competencies</h2>
                    <p className="text-sm text-gray-600 mt-0.5">Total Weightage: 100%</p>
                  </div>
                  {overrideCompetencies ? (
                    <button type="button" onClick={() => setOverrideCompetencies(false)} className="text-xs text-green-700 hover:text-green-900 underline">Cancel Override</button>
                  ) : (
                    <button type="button" onClick={() => setOverrideCompetencies(true)} className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs font-medium transition-colors">
                      <Shield className="w-3 h-3" /> Override
                    </button>
                  )}
                </div>
              </div>
              <div className="p-4 md:p-6">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-xs md:text-sm">
                    <thead className="sticky top-0 z-10">
                      {overrideCompetencies && (
                        <tr>
                          <th colSpan={2} className="border border-gray-200 px-2 py-1.5 bg-gray-50" />
                          <th colSpan={3} className="border border-blue-200 px-2 py-1.5 text-center font-semibold text-blue-700 bg-blue-50">RO Assessment</th>
                          <th colSpan={3} className="border border-amber-200 px-2 py-1.5 text-center font-semibold text-amber-700 bg-amber-50">RVO Assessment</th>
                          <th colSpan={3} className="border border-green-300 px-2 py-1.5 text-center font-semibold text-green-700 bg-green-50">AA Override</th>
                          <th className="border border-gray-200 px-2 py-1.5 bg-gray-50" />
                        </tr>
                      )}
                      <tr className="bg-gray-50">
                        <th className="border border-gray-200 px-2 py-2 text-left font-semibold text-gray-900 w-10">Sl.</th>
                        <th className="border border-gray-200 px-2 py-2 text-left font-semibold text-gray-900">Competency</th>
                        <th className={`border px-2 py-2 text-center font-semibold text-gray-900 ${overrideCompetencies ? "border-blue-200 bg-blue-50" : "border-gray-200 bg-gray-50"}`}>RO Rating</th>
                        <th className={`border px-2 py-2 text-left font-semibold text-gray-900 ${overrideCompetencies ? "border-blue-200 bg-blue-50" : "border-gray-200 bg-gray-50"}`}>RO Remark</th>
                        <th className={`border px-2 py-2 text-center font-semibold text-gray-900 ${overrideCompetencies ? "border-blue-200 bg-blue-50" : "border-gray-200 bg-gray-50"}`}>RO Score</th>
                        {overrideCompetencies && (
                          <>
                            <th className="border border-amber-200 px-2 py-2 text-center font-semibold text-amber-800 bg-amber-50">RVO Rating</th>
                            <th className="border border-amber-200 px-2 py-2 text-left font-semibold text-amber-800 bg-amber-50">RVO Remark</th>
                            <th className="border border-amber-200 px-2 py-2 text-center font-semibold text-amber-800 bg-amber-50">RVO Score</th>
                            <th className="border border-green-300 px-2 py-2 text-center font-semibold text-green-800 bg-green-50">AA Rating</th>
                            <th className="border border-green-300 px-2 py-2 text-left font-semibold text-green-800 bg-green-50">Justification</th>
                            <th className="border border-green-300 px-2 py-2 text-center font-semibold text-green-800 bg-green-50">Final Score</th>
                          </>
                        )}
                        {!overrideCompetencies && (
                          <>
                            <th className="border border-gray-200 px-2 py-2 text-center font-semibold text-gray-900 bg-gray-50">RVO Rating</th>
                            <th className="border border-gray-200 px-2 py-2 text-left font-semibold text-gray-900 bg-gray-50">RVO Remark</th>
                            <th className="border border-gray-200 px-2 py-2 text-center font-semibold text-gray-900 bg-gray-50">RVO Score</th>
                          </>
                        )}
                        <th className="border border-gray-200 px-2 py-2 text-center font-semibold text-gray-900 bg-gray-50">Wt. (%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {functionalCompetencies.map((comp) => {
                        const roR = competencyRatings[comp.sl_no] || "";
                        const rvoR = rvoCompetencyRatings[comp.sl_no] || "";
                        const aaR = aaCompetencyRatings[comp.sl_no] || "";
                        const effectiveR = getEffectiveRating(roR, rvoR, aaR);
                        return (
                          <tr key={comp.sl_no} className={`hover:bg-gray-50 bg-white ${!ratingsAgree(roR, rvoR) && !overrideCompetencies ? "bg-orange-50/40" : ""}`}>
                            <td className="border border-gray-200 px-2 py-2 text-gray-900">{comp.sl_no}</td>
                            <td className="border border-gray-200 px-2 py-2 text-gray-900">{comp.competency}</td>
                            <td className={`border px-2 py-2 ${overrideCompetencies ? "border-blue-200 bg-blue-50/20" : "border-gray-200"}`}>
                              <div className="px-2 py-1 border border-gray-300 rounded bg-gray-50 font-bold text-center text-gray-900">{roR || "—"}</div>
                            </td>
                            <td className={`border px-2 py-2 ${overrideCompetencies ? "border-blue-200 bg-blue-50/20" : "border-gray-200"}`}>
                              <div className="px-2 py-1 border border-gray-300 rounded bg-gray-50 text-gray-700 min-w-[80px]">{competencyRemarks[comp.sl_no] || "—"}</div>
                            </td>
                            <td className={`border px-2 py-2 text-blue-600 font-semibold text-center ${overrideCompetencies ? "border-blue-200 bg-blue-50/20" : "border-gray-200"}`}>
                              {calculateScore(roR, comp.weightage_percent)}
                            </td>
                            {overrideCompetencies ? (
                              <>
                                <td className="border border-amber-200 px-2 py-2 bg-amber-50/20">
                                  <div className="px-2 py-1 border border-amber-200 rounded bg-white font-bold text-center text-gray-900">{rvoR || "—"}</div>
                                </td>
                                <td className="border border-amber-200 px-2 py-2 bg-amber-50/20">
                                  <div className="px-2 py-1 border border-amber-200 rounded bg-white text-gray-700 min-w-[80px]">{rvoCompetencyRemarks[comp.sl_no] || "—"}</div>
                                </td>
                                <td className="border border-amber-200 px-2 py-2 text-amber-600 font-semibold text-center bg-amber-50/20">
                                  {calculateScore(rvoR, comp.weightage_percent)}
                                </td>
                                <td className="border border-green-300 px-2 py-2 bg-green-50/30">
                                  <select
                                    title={`AA rating for ${comp.competency}`}
                                    className="w-16 px-1 py-1 text-xs border border-green-300 rounded focus:ring-1 focus:ring-green-500 bg-white"
                                    value={aaR}
                                    onChange={(e) => setAaCompetencyRatings({ ...aaCompetencyRatings, [comp.sl_no]: e.target.value })}
                                  >
                                    <option value="">—</option>
                                    {[1,2,3,4,5,6,7,8,9,10].map((n) => <option key={n} value={n}>{n}</option>)}
                                  </select>
                                </td>
                                <td className="border border-green-300 px-2 py-2 bg-green-50/30">
                                  <input
                                    type="text"
                                    className="w-full min-w-[100px] px-2 py-1 text-xs border border-green-300 rounded focus:ring-1 focus:ring-green-500 bg-white"
                                    placeholder="Justification..."
                                    value={aaCompetencyJustifications[comp.sl_no] || ""}
                                    onChange={(e) => setAaCompetencyJustifications({ ...aaCompetencyJustifications, [comp.sl_no]: e.target.value })}
                                  />
                                </td>
                                <td className="border border-green-300 px-2 py-2 text-green-700 font-semibold text-center bg-green-50/30">
                                  {calculateScore(effectiveR, comp.weightage_percent)}
                                </td>
                              </>
                            ) : (
                              <>
                                <td className="border border-gray-200 px-2 py-2">
                                  <div className="flex items-center gap-1.5">
                                    <div className="px-2 py-1 border border-gray-300 rounded bg-gray-50 font-bold text-center text-gray-900 w-12">{rvoR || "—"}</div>
                                    <DiffBadge ro={roR} rvo={rvoR} />
                                  </div>
                                </td>
                                <td className="border border-gray-200 px-2 py-2">
                                  <div className="px-2 py-1 border border-gray-300 rounded bg-gray-50 text-gray-700 min-w-[80px]">{rvoCompetencyRemarks[comp.sl_no] || "—"}</div>
                                </td>
                                <td className="border border-gray-200 px-2 py-2 text-amber-600 font-semibold text-center">
                                  {calculateScore(rvoR, comp.weightage_percent)}
                                </td>
                              </>
                            )}
                            <td className="border border-gray-200 px-2 py-2 text-gray-900 text-center font-medium">{comp.weightage_percent}%</td>
                          </tr>
                        );
                      })}
                      <tr className={`font-semibold ${overrideCompetencies ? "bg-green-50" : "bg-blue-50"}`}>
                        <td colSpan={4} className={`border border-gray-200 px-2 py-2 text-right text-gray-900 ${overrideCompetencies ? "bg-green-50" : "bg-blue-50"}`}>Total Score:</td>
                        <td className="border border-gray-200 px-2 py-2 text-blue-600 font-bold text-center bg-blue-50">{calculateTotalScore(competencyRatings, functionalCompetencies)}</td>
                        {overrideCompetencies && (
                          <>
                            <td colSpan={2} className="border border-amber-200 px-2 py-2 text-right text-gray-900 bg-amber-100">RVO:</td>
                            <td className="border border-amber-200 px-2 py-2 text-amber-700 font-bold text-center bg-amber-100">{calculateTotalScore(rvoCompetencyRatings, functionalCompetencies)}</td>
                            <td colSpan={2} className="border border-green-300 px-2 py-2 text-right text-gray-900 bg-green-100">AA Final:</td>
                            <td className="border border-green-300 px-2 py-2 text-green-700 font-bold text-center bg-green-100">
                              {calculateTotalScore(
                                Object.fromEntries(functionalCompetencies.map((c) => [c.sl_no, getEffectiveRating(competencyRatings[c.sl_no] || "", rvoCompetencyRatings[c.sl_no] || "", aaCompetencyRatings[c.sl_no] || "")])),
                                functionalCompetencies,
                              )}
                            </td>
                          </>
                        )}
                        {!overrideCompetencies && (
                          <>
                            <td colSpan={2} className="border border-gray-200 px-2 py-2 text-right text-gray-900 bg-amber-50">RVO Total:</td>
                            <td className="border border-gray-200 px-2 py-2 text-amber-600 font-bold text-center bg-amber-50">{calculateTotalScore(rvoCompetencyRatings, functionalCompetencies)}</td>
                          </>
                        )}
                        <td aria-label="Weightage" className={`border border-gray-200 px-2 py-2 ${overrideCompetencies ? "bg-green-50" : "bg-blue-50"}`} />
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );
      }

      // ── Step 5: Overall Summary ───────────────────────────────────────────
      case 5:
        return (
          <div className="space-y-4">
            {/* RO Summary */}
            <div className="bg-white rounded-lg border border-blue-200">
              <div className="p-4 md:p-5 border-b border-blue-200 bg-blue-50">
                <h2 className="font-semibold text-blue-900">Section IV – RO's Overall Summary</h2>
              </div>
              <div className="p-4 md:p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                {[["Key Outcomes Delivered", keyOutcomes], ["Strengths Observed", strengths], ["Area for Improvement", areasForImprovement], ["Overall Assessment", overallAssessment]].map(([label, value]) => (
                  <div key={label} className={label === "Overall Assessment" ? "md:col-span-2" : ""}>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">{label}</label>
                    <div className="px-3 py-2.5 border border-blue-200 rounded-lg bg-white text-sm text-gray-800 min-h-[56px]">{value || <span className="text-gray-400 italic">Not provided</span>}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* RVO Summary */}
            <div className="bg-white rounded-lg border border-amber-200">
              <div className="p-4 md:p-5 border-b border-amber-200 bg-amber-50">
                <h2 className="font-semibold text-amber-900">RVO's Overall Summary</h2>
              </div>
              <div className="p-4 md:p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                {[["Key Outcomes (RVO)", rvoKeyOutcomes], ["Strengths (RVO)", rvoStrengths], ["Area for Improvement (RVO)", rvoAreasForImprovement], ["Overall Assessment (RVO)", rvoOverallAssessment]].map(([label, value]) => (
                  <div key={label} className={label.includes("Overall") ? "md:col-span-2" : ""}>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">{label}</label>
                    <div className="px-3 py-2.5 border border-amber-200 rounded-lg bg-white text-sm text-gray-800 min-h-[56px]">{value || <span className="text-gray-400 italic">Not provided</span>}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      // ── Step 6: Training Needs ────────────────────────────────────────────
      case 6:
        return (
          <div className="space-y-4">
            {/* RO Training */}
            <div className="bg-white rounded-lg border border-blue-200">
              <div className="p-4 border-b border-blue-200 bg-blue-50">
                <h2 className="font-semibold text-blue-900">RO's Training Recommendations</h2>
              </div>
              <div className="p-4">
                {roTrainings.length === 0 ? <p className="text-sm text-gray-500 italic">None added.</p> : (
                  <div className="space-y-2">
                    {roTrainings.map((t, i) => (
                      <div key={t.id} className="flex items-start gap-3 p-3 border border-blue-100 rounded-lg bg-blue-50/30">
                        <span className="text-xs font-bold text-blue-600 mt-0.5">{i + 1}.</span>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">{t.title}</p>
                          {t.description && <p className="text-xs text-gray-600 mt-0.5">{t.description}</p>}
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded font-medium ${t.priority === "high" ? "bg-red-100 text-red-700" : t.priority === "medium" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>{t.priority.charAt(0).toUpperCase() + t.priority.slice(1)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* RVO Training */}
            <div className="bg-white rounded-lg border border-amber-200">
              <div className="p-4 border-b border-amber-200 bg-amber-50">
                <h2 className="font-semibold text-amber-900">RVO's Additional Training Recommendations</h2>
              </div>
              <div className="p-4">
                {rvoTrainings.length === 0 ? <p className="text-sm text-gray-500 italic">None added.</p> : (
                  <div className="space-y-2">
                    {rvoTrainings.map((t, i) => (
                      <div key={t.id} className="flex items-start gap-3 p-3 border border-amber-100 rounded-lg bg-amber-50/30">
                        <span className="text-xs font-bold text-amber-600 mt-0.5">{i + 1}.</span>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">{t.title}</p>
                          {t.description && <p className="text-xs text-gray-600 mt-0.5">{t.description}</p>}
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded font-medium ${t.priority === "high" ? "bg-red-100 text-red-700" : t.priority === "medium" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>{t.priority.charAt(0).toUpperCase() + t.priority.slice(1)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* AA Additional Training */}
            <div className="bg-white rounded-lg border border-green-300">
              <div className="p-4 border-b border-green-200 bg-green-50 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-green-900">AA's Additional Training (Optional)</h2>
                  <p className="text-xs text-green-700 mt-0.5">Add any additional training you recommend</p>
                </div>
                {!showAaTrainingForm && (
                  <button type="button" onClick={() => setShowAaTrainingForm(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs font-medium">
                    + Add Training
                  </button>
                )}
              </div>
              <div className="p-4">
                {showAaTrainingForm ? (
                  <div className="border border-green-200 rounded-lg p-4 bg-green-50/30 space-y-3">
                    <h3 className="text-sm font-semibold text-gray-900">New Training Recommendation</h3>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Title <span className="text-red-600">*</span></label>
                      <input type="text" value={currentAaTraining.title} onChange={(e) => setCurrentAaTraining({ ...currentAaTraining, title: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-white" placeholder="Training program name..." />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                      <textarea rows={2} value={currentAaTraining.description} onChange={(e) => setCurrentAaTraining({ ...currentAaTraining, description: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-white" placeholder="Brief description..." />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Priority</label>
                      <select title="Training priority" value={currentAaTraining.priority} onChange={(e) => setCurrentAaTraining({ ...currentAaTraining, priority: e.target.value as "high" | "medium" | "low" })} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-white">
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                    <div className="flex gap-2 justify-end pt-1">
                      <button type="button" onClick={() => setShowAaTrainingForm(false)} className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700">Cancel</button>
                      <button type="button" onClick={handleSaveAaTraining} className="px-4 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700">Save</button>
                    </div>
                  </div>
                ) : aaTrainings.length === 0 ? (
                  <p className="text-sm text-gray-500 italic text-center py-4">No additional training added. Click "Add Training" to add.</p>
                ) : (
                  <div className="space-y-2">
                    {aaTrainings.map((t, i) => (
                      <div key={t.id} className="flex items-start gap-3 p-3 border border-green-200 rounded-lg bg-green-50/30">
                        <span className="text-xs font-bold text-green-700 mt-0.5">{i + 1}.</span>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">{t.title}</p>
                          {t.description && <p className="text-xs text-gray-600 mt-0.5">{t.description}</p>}
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded font-medium ${t.priority === "high" ? "bg-red-100 text-red-700" : t.priority === "medium" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>{t.priority.charAt(0).toUpperCase() + t.priority.slice(1)}</span>
                        <button type="button" onClick={() => setAaTrainings(aaTrainings.filter((x) => x.id !== t.id))} className="text-red-400 hover:text-red-600 text-xs ml-1">✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      // ── Step 7: AA Final Decision ─────────────────────────────────────────
      case 7:
        return (
          <div className="space-y-4">
            {/* Score Summary Card */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 md:p-5 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">Score Summary</h2>
                <p className="text-sm text-gray-500 mt-0.5">RO vs RVO vs AA (if overridden)</p>
              </div>
              <div className="p-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700">Section</th>
                      <th className="px-4 py-2.5 text-center text-xs font-semibold text-blue-700 bg-blue-50">RO Score</th>
                      <th className="px-4 py-2.5 text-center text-xs font-semibold text-amber-700 bg-amber-50">RVO Score</th>
                      <th className="px-4 py-2.5 text-center text-xs font-semibold text-green-700 bg-green-50">AA Override</th>
                      <th className="px-4 py-2.5 text-center text-xs font-semibold text-gray-700">Final Score</th>
                      <th className="px-4 py-2.5 text-center text-xs font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        section: "KRA Performance",
                        ro: kras.reduce((s, k) => s + (k.ro.rating && k.ro.weightagePercent ? (parseFloat(k.ro.rating) / 10) * parseFloat(k.ro.weightagePercent) : 0), 0).toFixed(2),
                        rvo: kras.reduce((s, k) => s + (k.rvo.rating && k.rvo.weightagePercent ? (parseFloat(k.rvo.rating) / 10) * parseFloat(k.rvo.weightagePercent) : 0), 0).toFixed(2),
                        aaOverridden: kras.some((k) => k.aa.overridden),
                        aa: kras.reduce((s, k) => { const r = k.aa.overridden ? k.aa.rating : k.rvo.rating; return s + (r && k.rvo.weightagePercent ? (parseFloat(r) / 10) * parseFloat(k.rvo.weightagePercent) : 0); }, 0).toFixed(2),
                      },
                      {
                        section: "Personal Attributes",
                        ro: calculateTotalScore(attributeRatings, personalAttributes),
                        rvo: calculateTotalScore(rvoAttributeRatings, personalAttributes),
                        aaOverridden: overrideAttributes && Object.keys(aaAttributeRatings).length > 0,
                        aa: overrideAttributes ? calculateTotalScore(Object.fromEntries(personalAttributes.map((a) => [a.sl_no, getEffectiveRating(attributeRatings[a.sl_no] || "", rvoAttributeRatings[a.sl_no] || "", aaAttributeRatings[a.sl_no] || "")])), personalAttributes) : calculateTotalScore(rvoAttributeRatings, personalAttributes),
                      },
                      {
                        section: "Functional Competencies",
                        ro: calculateTotalScore(competencyRatings, functionalCompetencies),
                        rvo: calculateTotalScore(rvoCompetencyRatings, functionalCompetencies),
                        aaOverridden: overrideCompetencies && Object.keys(aaCompetencyRatings).length > 0,
                        aa: overrideCompetencies ? calculateTotalScore(Object.fromEntries(functionalCompetencies.map((c) => [c.sl_no, getEffectiveRating(competencyRatings[c.sl_no] || "", rvoCompetencyRatings[c.sl_no] || "", aaCompetencyRatings[c.sl_no] || "")])), functionalCompetencies) : calculateTotalScore(rvoCompetencyRatings, functionalCompetencies),
                      },
                    ].map((row) => (
                      <tr key={row.section} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.section}</td>
                        <td className="px-4 py-3 text-center text-sm font-semibold text-blue-600 bg-blue-50/40">{row.ro}</td>
                        <td className="px-4 py-3 text-center text-sm font-semibold text-amber-600 bg-amber-50/40">{row.rvo}</td>
                        <td className="px-4 py-3 text-center text-sm font-semibold text-green-600 bg-green-50/40">{row.aaOverridden ? row.aa : <span className="text-gray-400 text-xs">No override</span>}</td>
                        <td className="px-4 py-3 text-center text-sm font-bold text-gray-900">{row.aa}</td>
                        <td className="px-4 py-3 text-center">
                          {row.aaOverridden ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium"><Shield className="w-3 h-3" /> AA Override</span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium"><CheckCircle className="w-3 h-3" /> Accepted</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* AA Decision */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 md:p-5 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">AA's Final Assessment</h2>
              </div>
              <div className="p-4 md:p-5 space-y-4">
                {/* Concur / Override decision */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Overall Decision <span className="text-red-600">*</span></label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <label className={`flex items-center gap-3 flex-1 p-3 border-2 rounded-lg cursor-pointer transition-colors ${aaDecision === "agree" ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300"}`}>
                      <input type="radio" name="aaDecision" value="agree" checked={aaDecision === "agree"} onChange={() => setAaDecision("agree")} className="w-4 h-4 text-green-600" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Concur with RVO</p>
                        <p className="text-xs text-gray-500">Accept RVO's assessment in full</p>
                      </div>
                    </label>
                    <label className={`flex items-center gap-3 flex-1 p-3 border-2 rounded-lg cursor-pointer transition-colors ${aaDecision === "override" ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-gray-300"}`}>
                      <input type="radio" name="aaDecision" value="override" checked={aaDecision === "override"} onChange={() => setAaDecision("override")} className="w-4 h-4 text-orange-600" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Partial / Full Override</p>
                        <p className="text-xs text-gray-500">Overrides already applied in previous steps</p>
                      </div>
                    </label>
                  </div>
                </div>

                {aaDecision === "override" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Overall Justification for Override <span className="text-red-600">*</span></label>
                    <textarea
                      rows={3}
                      value={aaOverallJustification}
                      onChange={(e) => setAaOverallJustification(e.target.value)}
                      className="w-full px-3 py-2.5 text-sm border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 bg-white"
                      placeholder="Provide overall justification for the override decision..."
                    />
                  </div>
                )}

                {/* AA Remarks */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">AA's Remarks <span className="text-red-600">*</span></label>
                  <textarea
                    rows={4}
                    value={aaRemarks}
                    onChange={(e) => setAaRemarks(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-white"
                    placeholder="Provide your overall assessment, observations and recommendations..."
                  />
                </div>

                {/* Integrity Declaration */}
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <input
                    type="checkbox" id="integrity"
                    checked={integrityConfirmed}
                    onChange={(e) => setIntegrityConfirmed(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <label htmlFor="integrity" className="text-sm text-gray-700 cursor-pointer">
                    I, the Accepting Authority, confirm that I have reviewed this appraisal record in its entirety and that the assessment is fair, objective, and free from bias. I am satisfied with the ratings and remarks provided, and I authorize the finalization and locking of this record.
                  </label>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-20">
                  <p className="text-xs text-red-800 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <strong>Irreversible Action:</strong>&nbsp;Finalizing and locking this record is permanent. The appraisal cannot be modified after locking. Please review all sections carefully before proceeding.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // ─── Main Layout ───────────────────────────────────────────────────────────
  return (
    <div className="">
      {/* Fixed Header */}
      <div
        className="fixed top-[20px] sm:top-[60px] left-0 lg:left-64 right-0 z-10 bg-white border-b border-gray-200 transition-all duration-300"
        style={{ left: typeof window !== "undefined" && window.innerWidth >= 1024 ? sidebarCollapsed ? "5rem" : "16rem" : "0" }}
      >
        <div className="px-4 lg:px-6 py-2 sm:py-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <Link to="/review/pending-approvals" className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div className="leading-tight">
                <h1 className="text-sm sm:text-lg font-bold text-gray-900">AA Final Approval</h1>
                <p className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-tight">Employee ID: {employeeId}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isLocked && (
                <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-bold">
                  <Lock className="w-3.5 h-3.5" /> Record Locked
                </span>
              )}
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={isLocked}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-xs font-bold text-gray-700 shadow-sm transition-colors disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                SAVE DRAFT
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Stepper */}
      <div
        className="hidden md:block fixed top-[109px] sm:top-[125px] left-0 lg:left-64 right-0 z-[9] bg-white border-b border-gray-200 shadow-sm transition-all duration-300"
        style={{ left: typeof window !== "undefined" && window.innerWidth >= 1024 ? sidebarCollapsed ? "5rem" : "16rem" : "0" }}
      >
        <div className="px-6 lg:px-8 py-2.5">
          <div className="flex items-start">
            {steps.map((step, index) => (
              <div key={step.number} className="flex-1 flex flex-col items-center relative">
                {index < steps.length - 1 && (
                  <div className="absolute top-3 left-1/2 right-0 h-0.5 -translate-y-1/2 z-0" style={{ width: "calc(100% - 0.75rem)" }}>
                    <div className={`h-full ${completedSteps.includes(step.number) ? "bg-green-600" : "bg-gray-200"}`} />
                  </div>
                )}
                <div className="relative z-10">
                  <button
                    type="button"
                    onClick={() => handleStepClick(step.number)}
                    disabled={!completedSteps.includes(step.number) && step.number !== currentStep && step.number !== currentStep + 1}
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                      currentStep === step.number ? "bg-green-600 text-white" :
                      completedSteps.includes(step.number) ? "bg-green-600 text-white cursor-pointer hover:bg-green-700" : "bg-gray-200 text-gray-500"
                    } ${!completedSteps.includes(step.number) && step.number !== currentStep && step.number !== currentStep + 1 ? "cursor-not-allowed" : ""}`}
                  >
                    {completedSteps.includes(step.number) && <Check className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <span className={`mt-1.5 text-xs font-medium whitespace-nowrap ${currentStep === step.number ? "text-green-600" : "text-gray-600"}`}>{step.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="h-[72px] sm:h-[109px] md:h-[130px]" />

      {/* Mobile Stepper */}
      <div className="md:hidden">
        <div className="bg-white rounded-lg border border-gray-200 p-4 mx-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-900">Step {currentStep} of 7</span>
            <span className="text-sm text-gray-600">{steps[currentStep - 1].fullTitle}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-600 h-2 rounded-full transition-all duration-300" style={{ width: `${(currentStep / 7) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="px-4 lg:px-8">{renderStepContent()}</div>

      {/* Desktop Bottom Nav */}
      <div
        className="hidden md:flex fixed bottom-0 left-0 lg:left-64 right-0 justify-between items-center gap-3 bg-white border-t border-gray-200 p-4 z-10 transition-all duration-300"
        style={{ left: typeof window !== "undefined" && window.innerWidth >= 1024 ? sidebarCollapsed ? "5rem" : "16rem" : "0" }}
      >
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentStep === 1 || isLocked}
          className={`flex items-center gap-1.5 px-4 py-1.5 text-sm border border-gray-300 rounded-lg ${currentStep === 1 || isLocked ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"}`}
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Previous
        </button>
        <div className="flex gap-2">
          <button type="button" onClick={handleSaveDraft} disabled={isLocked} className="flex items-center gap-1.5 px-4 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50">
            <Save className="w-3.5 h-3.5" /> Save Draft
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={isLocked}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-sm rounded-lg text-white disabled:opacity-50 ${currentStep === 7 ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {currentStep === 7 ? (<><Lock className="w-3.5 h-3.5" /> Finalize &amp; Lock</>) : (<>Next <ChevronRight className="w-3.5 h-3.5" /></>)}
          </button>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 z-40">
        <div className="flex gap-2">
          <button type="button" onClick={handlePrevious} disabled={currentStep === 1 || isLocked} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium ${currentStep === 1 || isLocked ? "opacity-50 cursor-not-allowed text-gray-400" : "hover:bg-gray-50 text-gray-700"}`}>
            <ChevronLeft className="w-4 h-4" /> Prev
          </button>
          <button type="button" title="Save Draft" onClick={handleSaveDraft} disabled={isLocked} className="flex items-center justify-center px-3 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50">
            <Save className="w-4 h-4" />
          </button>
          <button type="button" onClick={handleNext} disabled={isLocked} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white disabled:opacity-50 ${currentStep === 7 ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"}`}>
            {currentStep === 7 ? (<><Lock className="w-4 h-4" /> Lock</>) : (<>Next <ChevronRight className="w-4 h-4" /></>)}
          </button>
        </div>
      </div>

      {/* Lock Confirmation Modal */}
      {showLockConfirmation && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Lock className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Finalize &amp; Lock Record</h3>
                <p className="text-sm text-gray-600 mt-1">You are about to permanently lock the appraisal record for <strong>{employeeId}</strong>. This action cannot be undone.</p>
              </div>
            </div>

            {/* Final checklist */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p className="text-xs font-semibold text-gray-700 mb-2">Pre-lock checklist:</p>
              {[
                ["All sections reviewed", true],
                ["AA remarks filled", aaRemarks.trim().length > 0],
                ["Overall decision selected", aaDecision !== ""],
                ["Integrity declaration confirmed", integrityConfirmed],
              ].map(([label, done]) => (
                <div key={label as string} className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${done ? "bg-green-500" : "bg-red-400"}`}>
                    {done ? <Check className="w-2.5 h-2.5 text-white" /> : <span className="text-white text-[9px] font-bold">✕</span>}
                  </div>
                  <span className={`text-xs ${done ? "text-gray-700" : "text-red-600 font-medium"}`}>{label as string}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-1">
              <button type="button" onClick={() => setShowLockConfirmation(false)} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button
                type="button"
                onClick={handleFinalLock}
                disabled={!aaRemarks.trim() || !integrityConfirmed || aaDecision === ""}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Lock className="w-4 h-4" /> Confirm &amp; Lock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AAApproval;
