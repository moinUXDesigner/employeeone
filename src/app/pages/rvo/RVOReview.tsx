import { useState, useEffect } from "react";
import {
  Save,
  Send,
  ArrowLeft,
  CheckCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Check,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Edit,
  RefreshCw,
} from "lucide-react";
import { useParams, Link, useNavigate } from "react-router";
import { toast } from "sonner";
import React from "react";

const RVOReview = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [currentKRAIndex, setCurrentKRAIndex] = useState(0);
  const [integrityCheck, setIntegrityCheck] = useState(false);
  const [sealedCover, setSealedCover] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showSourceDetails, setShowSourceDetails] = useState(false);

  // RVO Specific: Revise Ratings Mode - Independent for each step
  const [reviseKRAMode, setReviseKRAMode] = useState(false);
  const [reviseAttributesMode, setReviseAttributesMode] = useState(false);
  const [reviseCompetenciesMode, setReviseCompetenciesMode] = useState(false);
  const [reviseSummaryMode, setReviseSummaryMode] = useState(false);
  const [reviseTrainingMode, setReviseTrainingMode] = useState(false);

  // Get user role from localStorage
  const userRole =
    (localStorage.getItem("userRole") as
      | "Employee"
      | "RO"
      | "RVO"
      | "AA"
      | "HRD") || "RVO";

  // Listen to sidebar toggle events
  useEffect(() => {
    const handleSidebarToggle = (event: CustomEvent) => {
      setSidebarCollapsed(event.detail.collapsed);
    };

    // Load initial state
    const saved = localStorage.getItem("sidebarCollapsed");
    setSidebarCollapsed(saved === "true");

    window.addEventListener(
      "sidebarToggle",
      handleSidebarToggle as EventListener,
    );
    return () => {
      window.removeEventListener(
        "sidebarToggle",
        handleSidebarToggle as EventListener,
      );
    };
  }, []);

  // Load saved KRAs from localStorage
  useEffect(() => {
    if (employeeId) {
      try {
        const savedKras = localStorage.getItem(`evaluation_kras_${employeeId}`);
        if (savedKras) {
          const parsedKras = JSON.parse(savedKras);
          setKras(parsedKras);
          console.log("Loaded saved KRAs:", parsedKras);
        }
      } catch (error) {
        console.error("Error loading saved KRAs:", error);
      }
    }
  }, [employeeId]);

  // Overall Summary fields (RO's)
  const [keyOutcomes, setKeyOutcomes] = useState("");
  const [strengths, setStrengths] = useState("");
  const [areasForImprovement, setAreasForImprovement] = useState("");
  const [overallAssessment, setOverallAssessment] = useState("");

  // RVO's Summary fields
  const [rvoKeyOutcomes, setRvoKeyOutcomes] = useState("");
  const [rvoStrengths, setRvoStrengths] = useState("");
  const [rvoAreasForImprovement, setRvoAreasForImprovement] = useState("");
  const [rvoOverallAssessment, setRvoOverallAssessment] = useState("");

  // RVO Final Remarks
  const [rvoRemarks, setRvoRemarks] = useState("");
  const [rvoRecommendations, setRvoRecommendations] = useState("");

  // Integrity & Vigilance fields
  const [integrityRemarks, setIntegrityRemarks] = useState("");

  // Training fields
  interface Training {
    id: string;
    title: string;
    description: string;
    priority: "high" | "medium" | "low";
  }
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [showTrainingForm, setShowTrainingForm] = useState(false);
  const [currentTraining, setCurrentTraining] = useState<Training>({
    id: "",
    title: "",
    description: "",
    priority: "medium",
  });
  const [isEditingTraining, setIsEditingTraining] = useState(false);

  // RVO Training fields
  const [rvoTrainings, setRvoTrainings] = useState<Training[]>([]);
  const [showRvoTrainingForm, setShowRvoTrainingForm] = useState(false);
  const [currentRvoTraining, setCurrentRvoTraining] = useState<Training>({
    id: "",
    title: "",
    description: "",
    priority: "medium",
  });
  const [isEditingRvoTraining, setIsEditingRvoTraining] = useState(false);

  const handleAddTrainingClick = () => {
    setCurrentTraining({
      id: Date.now().toString(),
      title: "",
      description: "",
      priority: "medium",
    });
    setIsEditingTraining(false);
    setShowTrainingForm(true);
  };

  const handleSaveTraining = () => {
    if (!currentTraining.title.trim()) {
      toast.error("Please enter a training title");
      return;
    }

    if (isEditingTraining) {
      setTrainings(
        trainings.map((t) =>
          t.id === currentTraining.id ? currentTraining : t,
        ),
      );
    } else {
      setTrainings([...trainings, currentTraining]);
    }

    setShowTrainingForm(false);
    setCurrentTraining({
      id: "",
      title: "",
      description: "",
      priority: "medium",
    });
  };

  const handleCancelTraining = () => {
    setShowTrainingForm(false);
    setCurrentTraining({
      id: "",
      title: "",
      description: "",
      priority: "medium",
    });
  };

  const handleEditTraining = (training: Training) => {
    setCurrentTraining(training);
    setIsEditingTraining(true);
    setShowTrainingForm(true);
  };

  const removeTraining = (id: string) => {
    setTrainings(trainings.filter((t) => t.id !== id));
  };

  const updateCurrentTraining = (field: keyof Training, value: string) => {
    setCurrentTraining({ ...currentTraining, [field]: value });
  };

  // RVO Training handlers
  const handleAddRvoTrainingClick = () => {
    setCurrentRvoTraining({
      id: Date.now().toString(),
      title: "",
      description: "",
      priority: "medium",
    });
    setIsEditingRvoTraining(false);
    setShowRvoTrainingForm(true);
  };

  const handleSaveRvoTraining = () => {
    if (!currentRvoTraining.title.trim()) {
      toast.error("Please enter a training title");
      return;
    }

    if (isEditingRvoTraining) {
      setRvoTrainings(
        rvoTrainings.map((t) =>
          t.id === currentRvoTraining.id ? currentRvoTraining : t,
        ),
      );
    } else {
      setRvoTrainings([...rvoTrainings, currentRvoTraining]);
    }

    setShowRvoTrainingForm(false);
    setCurrentRvoTraining({
      id: "",
      title: "",
      description: "",
      priority: "medium",
    });
  };

  const handleCancelRvoTraining = () => {
    setShowRvoTrainingForm(false);
    setCurrentRvoTraining({
      id: "",
      title: "",
      description: "",
      priority: "medium",
    });
  };

  const handleEditRvoTraining = (training: Training) => {
    setCurrentRvoTraining(training);
    setIsEditingRvoTraining(true);
    setShowRvoTrainingForm(true);
  };

  const removeRvoTraining = (id: string) => {
    setRvoTrainings(rvoTrainings.filter((t) => t.id !== id));
  };

  const updateCurrentRvoTraining = (field: keyof Training, value: string) => {
    setCurrentRvoTraining({ ...currentRvoTraining, [field]: value });
  };

  // Section 3A - Personal Attributes
  const personalAttributes = [
    {
      sl_no: 1,
      attribute: "Integrity & Ethics",
      weightage_percent: 15,
    },
    {
      sl_no: 2,
      attribute: "Discipline / Dependability",
      weightage_percent: 15,
    },
    {
      sl_no: 3,
      attribute:
        "Communication / Perception / Understanding Capabilities",
      weightage_percent: 15,
    },
    {
      sl_no: 4,
      attribute: "Creativity",
      weightage_percent: 10,
    },
    {
      sl_no: 5,
      attribute: "Teamwork / Collaboration",
      weightage_percent: 15,
    },
    {
      sl_no: 6,
      attribute: "Initiative / Proactiveness",
      weightage_percent: 10,
    },
    {
      sl_no: 7,
      attribute: "Stakeholder / Consumer Orientation",
      weightage_percent: 10,
    },
    {
      sl_no: 8,
      attribute: "Punctuality / Promptness",
      weightage_percent: 10,
    },
  ];

  const [attributeRatings, setAttributeRatings] = useState<{
    [key: number]: string;
  }>({});
  const [attributeRemarks, setAttributeRemarks] = useState<{
    [key: number]: string;
  }>({});

  // RVO Attribute Ratings
  const [rvoAttributeRatings, setRvoAttributeRatings] = useState<{
    [key: number]: string;
  }>({});
  const [rvoAttributeRemarks, setRvoAttributeRemarks] = useState<{
    [key: number]: string;
  }>({});

  // Section 3B - Functional Competencies
  const functionalCompetencies = [
    {
      sl_no: 1,
      competency: "Job Knowledge / Domain Capability",
      weightage_percent: 20,
    },
    {
      sl_no: 2,
      competency: "Planning & Organizing",
      weightage_percent: 15,
    },
    {
      sl_no: 3,
      competency: "Problem Solving / Decision Support",
      weightage_percent: 15,
    },
    {
      sl_no: 4,
      competency: "Quality Orientation",
      weightage_percent: 10,
    },
    {
      sl_no: 5,
      competency: "Safety & Compliance Orientation",
      weightage_percent: 15,
    },
    {
      sl_no: 6,
      competency:
        "Digital / Systems Usage (e-Office / SAP / Tools)",
      weightage_percent: 15,
    },
    {
      sl_no: 7,
      competency: "Drafting Skills",
      weightage_percent: 10,
    },
  ];

  const [competencyRatings, setCompetencyRatings] = useState<{
    [key: number]: string;
  }>({});
  const [competencyRemarks, setCompetencyRemarks] = useState<{
    [key: number]: string;
  }>({});

  // RVO Competency Ratings
  const [rvoCompetencyRatings, setRvoCompetencyRatings] = useState<{
    [key: number]: string;
  }>({});
  const [rvoCompetencyRemarks, setRvoCompetencyRemarks] = useState<{
    [key: number]: string;
  }>({});

  // Calculate scores
  const calculateScore = (rating: string, weightage: number) => {
    if (!rating) return "-";
    return ((parseFloat(rating) * weightage) / 100).toFixed(2);
  };

  const calculateTotalScore = (
    ratings: { [key: number]: string },
    items: any[],
  ) => {
    let total = 0;
    items.forEach((item) => {
      const rating = ratings[item.sl_no];
      if (rating) {
        total += (parseFloat(rating) * item.weightage_percent) / 100;
      }
    });
    return total.toFixed(2);
  };

  // Check if remark is required based on rating
  const isRemarkRequired = (rating: string) => {
    if (!rating) return false;
    const ratingNum = parseInt(rating);
    return ratingNum <= 2 || ratingNum >= 9;
  };

  // Helper function to calculate KRA score
  const calculateKRAScore = (rating: string, weightage: string) => {
    if (!rating || !weightage) return "";
    return ((parseFloat(rating) / 10) * parseFloat(weightage)).toFixed(2);
  };

  const [kras, setKras] = useState([
    {
      id: "1",
      sl: "1",
      code: "KRA-001",
      kpi: "Customer Service Excellence - Maintain high standards of customer service and satisfaction",
      targetAnnual:
        "Customer satisfaction rating above 4.5/5 and response time within 24 hours",
      actualAchievement:
        "Achieved 4.7/5 rating with average response time of 18 hours",
      sourceRefNo: "CS-2026-001",
      uploadedFiles: [
        { name: "Customer_Feedback_Report_Q1.pdf", url: "#" },
        { name: "Response_Time_Analysis.xlsx", url: "#" },
      ],
      status: "Approved" as const,
      type: "initial" as const,
      ro: {
        rating: "9",
        weightagePercent: "25",
        score: "22.50",
        validationNotes: "Excellent customer service delivery throughout the year.",
      },
      rvo: {
        rating: "",
        weightagePercent: "",
        score: "",
        validationNotes: "",
      },
      aa: "",
      aaValidationNotes: "",
    },
    {
      id: "2",
      sl: "2",
      code: "KRA-002",
      kpi: "Process Improvement - Identify and implement process improvements to enhance operational efficiency",
      targetAnnual:
        "Implement 3 process improvements with cost savings of INR 50,000",
      actualAchievement:
        "Implemented 4 improvements with total cost savings of INR 65,000",
      sourceRefNo: "PI-2026-002",
      uploadedFiles: [
        { name: "Process_Improvement_Report.pdf", url: "#" },
        { name: "Cost_Savings_Analysis.xlsx", url: "#" },
        { name: "Implementation_Timeline.pdf", url: "#" },
      ],
      status: "Pending" as const,
      type: "initial" as const,
      ro: {
        rating: "8",
        weightagePercent: "20",
        score: "16.00",
        validationNotes: "Exceeded targets with significant cost savings.",
      },
      rvo: {
        rating: "",
        weightagePercent: "",
        score: "",
        validationNotes: "",
      },
      aa: "",
      aaValidationNotes: "",
    },
    {
      id: "3",
      sl: "3",
      code: "KRA-003",
      kpi: "Team Collaboration - Foster effective collaboration within the team and across departments",
      targetAnnual:
        "Participate in 2 cross-functional projects with team satisfaction score of 4.0+",
      actualAchievement:
        "Participated in 3 projects with team satisfaction score of 4.3",
      sourceRefNo: "TC-2026-003",
      uploadedFiles: [{ name: "Team_Feedback_Survey.pdf", url: "#" }],
      status: "Approved" as const,
      type: "revised" as const,
      ro: {
        rating: "8",
        weightagePercent: "15",
        score: "12.00",
        validationNotes: "Strong collaboration and team leadership.",
      },
      rvo: {
        rating: "",
        weightagePercent: "",
        score: "",
        validationNotes: "",
      },
      aa: "",
      aaValidationNotes: "",
    },
  ]);

  const steps = [
    {
      number: 1,
      title: "Basic Info",
      fullTitle: "Basic Information",
    },
    { number: 2, title: "KRA Rating", fullTitle: "KRA Rating" },
    {
      number: 3,
      title: "Personal",
      fullTitle: "Personal Attributes",
    },
    {
      number: 4,
      title: "Functional",
      fullTitle: "Functional Competencies",
    },
    {
      number: 5,
      title: "Summary",
      fullTitle: "Overall Summary",
    },
    {
      number: 6,
      title: "Training",
      fullTitle: "Training Needs",
    },
    {
      number: 7,
      title: "Review",
      fullTitle: "RVO Review",
    },
  ];

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        // Basic info is read-only, always valid
        return true;

      case 2:
        // KRA validation - Check if all KRAs have ratings (RO role)
        // For now, we'll make this optional to allow progression
        return true;

      case 3:
        // Personal Attributes validation - RO ratings are pre-filled
        return true;

      case 4:
        // Functional Competencies validation - RO ratings are pre-filled
        return true;

      case 5:
        // Overall Summary validation - RO summary is pre-filled
        return true;

      case 6:
        // Training validation - RO trainings are pre-filled
        return true;

      case 7:
        // RVO Review validation
        return true;

      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      // Save KRAs to localStorage when leaving step 2
      if (currentStep === 2) {
        try {
          localStorage.setItem(
            `evaluation_kras_${employeeId}`,
            JSON.stringify(kras),
          );
          console.log("KRAs saved:", kras);
        } catch (error) {
          console.error("Error saving KRAs:", error);
        }
      }

      // Mark current step as completed
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }

      if (currentStep < 7) {
        setCurrentStep(currentStep + 1);
        toast.success("Progress saved");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        // Final step - show confirmation
        setShowConfirmation(true);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleStepClick = (step: number) => {
    // Allow jumping to completed steps or the next step
    if (
      completedSteps.includes(step) ||
      step === currentStep ||
      step === currentStep + 1
    ) {
      setCurrentStep(step);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSaveDraft = () => {
    toast.success("Draft saved successfully!");
  };

  const handleFinalSubmit = () => {
    toast.success("RVO Review submitted successfully!");
    setShowConfirmation(false);
    // Navigate back or perform other actions
    navigate("/review/pending-approvals");
  };

  const handlePrevKRA = () => {
    if (currentKRAIndex > 0) {
      setCurrentKRAIndex(currentKRAIndex - 1);
    }
  };

  const handleNextKRA = () => {
    if (currentKRAIndex < kras.length - 1) {
      setCurrentKRAIndex(currentKRAIndex + 1);
    }
  };

  // Pre-populate RO ratings for attributes
  useEffect(() => {
    const roAttributeRatings: { [key: number]: string } = {
      1: "9",
      2: "8",
      3: "8",
      4: "7",
      5: "9",
      6: "8",
      7: "8",
      8: "9",
    };
    const roAttributeRemarks: { [key: number]: string } = {
      1: "High integrity",
      8: "Always punctual",
    };
    setAttributeRatings(roAttributeRatings);
    setAttributeRemarks(roAttributeRemarks);

    // RO Competency ratings
    const roCompetencyRatings: { [key: number]: string } = {
      1: "8",
      2: "8",
      3: "7",
      4: "8",
      5: "9",
      6: "7",
      7: "7",
    };
    const roCompetencyRemarks: { [key: number]: string } = {
      5: "Excellent safety awareness",
    };
    setCompetencyRatings(roCompetencyRatings);
    setCompetencyRemarks(roCompetencyRemarks);

    // RO Summary
    setKeyOutcomes(
      "Successfully delivered 5 major projects ahead of schedule. Demonstrated excellent leadership in managing cross-functional teams. Maintained high client satisfaction throughout the year.",
    );
    setStrengths(
      "Strong project management and execution capabilities. Excellent communication and stakeholder management. Proactive problem-solving approach.",
    );
    setAreasForImprovement(
      "Can improve on technical documentation. Opportunity to enhance strategic planning skills.",
    );
    setOverallAssessment(
      "The officer has demonstrated exceptional performance throughout the year, consistently exceeding targets and maintaining high standards of work quality. Their leadership and collaborative approach have been instrumental in team success.",
    );

    // RO Training
    setTrainings([
      {
        id: "1",
        title: "Advanced Project Management",
        description: "To enhance project planning and execution skills",
        priority: "high",
      },
      {
        id: "2",
        title: "Strategic Leadership Program",
        description: "Develop strategic thinking and leadership capabilities",
        priority: "medium",
      },
    ]);
  }, []);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        // Step 1: Basic Information
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
            <h2 className="font-semibold text-gray-900 mb-4">
              Section I - Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
                <p className="text-base font-medium text-gray-900">EMP001</p>
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
        );

      case 2:
        // Step 2: KRA Rating - Full Width Redesign
        const currentKRA = kras[currentKRAIndex];

        return (
          <div className="space-y-0 -mt-4">
            {/* Fixed KRA Navigation Pills - Below Stepper */}
            <div
              className="fixed top-[109px] sm:top-[120px] md:top-[190px] left-0 lg:left-64 right-0 z-[8] bg-white border-b border-gray-200 transition-all duration-300"
              style={{
                left:
                  typeof window !== "undefined" &&
                  window.innerWidth >= 1024
                    ? sidebarCollapsed
                      ? "5rem"
                      : "16rem"
                    : "0",
              }}
            >
              <div className="px-4 lg:px-8 pt-2 pb-3">
                {/* Mobile: Title + Arrow Navigation */}
                <div className="md:hidden flex items-center justify-between mb-3">
                  <div>
                    <h2 className="text-base font-bold text-gray-900">
                      Section II – KRA Rating
                    </h2>
                    <p className="text-xs text-gray-600 mt-0.5">
                      Review RO's ratings
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrevKRA}
                      disabled={currentKRAIndex === 0}
                      className={`p-1.5 rounded-lg ${
                        currentKRAIndex === 0
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-blue-600 hover:bg-blue-50"
                      }`}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <span className="text-xs text-gray-600">
                      {currentKRAIndex + 1}/{kras.length}
                    </span>

                    <button
                      onClick={handleNextKRA}
                      disabled={currentKRAIndex === kras.length - 1}
                      className={`p-1.5 rounded-lg ${
                        currentKRAIndex === kras.length - 1
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-blue-600 hover:bg-blue-50"
                      }`}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Desktop: Title + Horizontal Pills */}
                <div className="hidden md:flex items-center justify-between gap-6">
                  <div className="flex-shrink-0">
                    <h2 className="text-base font-bold text-gray-900">
                      Section II – KRA Rating
                    </h2>
                    <p className="text-xs text-gray-600 mt-0.5">
                      Review RO's ratings
                    </p>
                  </div>

                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {kras.map((kra, index) => (
                      <button
                        key={kra.id}
                        onClick={() => setCurrentKRAIndex(index)}
                        className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                          currentKRAIndex === index
                            ? "bg-blue-600 text-white shadow-sm"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {kra.code}
                        {kra.ro.rating && (
                          <Check className="inline-block w-3.5 h-3.5 ml-1.5" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content - Full Width, No Nested Cards */}
            <div className="px-4 lg:px-8 pt-[140px] sm:pt-[150px] md:pt-[100px] pb-[220px] md:pb-[180px] space-y-6">
              {/* KRA Details Section */}
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold bg-blue-100 text-blue-700">
                        {currentKRA.code}
                      </span>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                          currentKRA.type === "initial"
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {currentKRA.type === "initial"
                          ? "Initial"
                          : "Revised"}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-gray-900 mb-3">
                      KRA / KPI
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {currentKRA.kpi}
                    </p>
                  </div>

                  {currentKRA.status && (
                    <span
                      className={`ml-4 flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
                        currentKRA.status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {currentKRA.status === "Approved" && (
                        <CheckCircle className="w-3.5 h-3.5" />
                      )}
                      {currentKRA.status}
                    </span>
                  )}
                </div>

                <div className="h-px bg-gray-200"></div>

                {/* Target & Achievement Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                      Target (Annual)
                    </label>
                    <p className="text-sm text-gray-900">
                      {currentKRA.targetAnnual}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                      Actual Achievement
                    </label>
                    <p className="text-sm text-gray-900">
                      {currentKRA.actualAchievement}
                    </p>
                  </div>
                </div>

                <div className="h-px bg-gray-200"></div>

                {/* Source Ref & Files */}
                <div className="space-y-3">
                  {/* Collapsible Header */}
                  <button
                    onClick={() =>
                      setShowSourceDetails(!showSourceDetails)
                    }
                    className="w-full flex items-center justify-between py-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      Source & Attachments
                    </span>
                    {showSourceDetails ? (
                      <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                  </button>

                  {/* Collapsible Content */}
                  {showSourceDetails && (
                    <div className="space-y-3 pl-2">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                          Source Ref No.
                        </label>
                        <p className="text-sm text-gray-900 font-mono">
                          {currentKRA.sourceRefNo}
                        </p>
                      </div>

                      {currentKRA.uploadedFiles &&
                        currentKRA.uploadedFiles.length > 0 && (
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                              Attached Files (
                              {currentKRA.uploadedFiles.length})
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {currentKRA.uploadedFiles.map(
                                (file, idx) => (
                                  <a
                                    key={idx}
                                    href={file.url}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors"
                                  >
                                    <svg
                                      className="w-3.5 h-3.5"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                      />
                                    </svg>
                                    {file.name}
                                  </a>
                                ),
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  )}
                </div>
              </div>

              <div className="h-px bg-gray-300"></div>

              {/* RO Evaluation Section - Read Only */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-900">
                  RO Evaluation (Submitted)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Rating */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Rating (1-10)
                    </label>
                    <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-900 font-semibold">
                      {currentKRA.ro.rating || "—"}
                    </div>
                  </div>

                  {/* Weightage */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Weightage (%)
                    </label>
                    <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-900 font-semibold">
                      {currentKRA.ro.weightagePercent || "—"}
                    </div>
                  </div>

                  {/* Score */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Score
                    </label>
                    <div className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-blue-50 text-blue-600 font-semibold">
                      {currentKRA.ro.score || "—"}
                    </div>
                  </div>
                </div>

                {/* RO Validation Notes */}
                {currentKRA.ro.validationNotes && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      RO's Validation Notes
                    </label>
                    <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                      {currentKRA.ro.validationNotes}
                    </div>
                  </div>
                )}
              </div>

              {/* Revise Ratings Toggle Button */}
              {!reviseKRAMode && (
                <div className="flex justify-center">
                  <button
                    onClick={() => setReviseKRAMode(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-medium transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Revise Ratings
                  </button>
                </div>
              )}

              {/* RVO Revision Section */}
              {reviseKRAMode && (
                <>
                  <div className="h-px bg-gray-200"></div>

                  <div className="space-y-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-amber-900">
                        RVO Revision
                      </h3>
                      <button
                        onClick={() => setReviseKRAMode(false)}
                        className="text-xs text-amber-700 hover:text-amber-900 underline"
                      >
                        Cancel Revision
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Rating */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                          Revised Rating (1-10){" "}
                          <span className="text-red-600">*</span>
                        </label>
                        <select
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                          value={currentKRA.rvo.rating}
                          onChange={(e) => {
                            const newKras = [...kras];
                            newKras[currentKRAIndex].rvo.rating =
                              e.target.value;
                            newKras[currentKRAIndex].rvo.score =
                              calculateKRAScore(
                                e.target.value,
                                newKras[currentKRAIndex].ro
                                  .weightagePercent,
                              );
                            setKras(newKras);
                          }}
                        >
                          <option value="">Select rating</option>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
                            (num) => (
                              <option key={num} value={num}>
                                {num}
                              </option>
                            ),
                          )}
                        </select>
                      </div>

                      {/* Weightage (Read-only from RO) */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                          Weightage (%)
                        </label>
                        <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-900 font-semibold">
                          {currentKRA.ro.weightagePercent || "—"}
                        </div>
                      </div>

                      {/* Score (Auto-calculated) */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                          Revised Score
                        </label>
                        <div className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-amber-100 text-amber-700 font-semibold">
                          {currentKRA.rvo.score || "—"}
                        </div>
                      </div>
                    </div>

                    {/* RVO Validation Notes */}
                    <div className="space-y-2">
                      <label className="block text-xs font-medium text-gray-700">
                        RVO's Validation Notes{" "}
                        <span className="text-red-600">*</span>
                      </label>
                      <textarea
                        rows={3}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none bg-white"
                        placeholder="Provide justification for the revision..."
                        value={currentKRA.rvo.validationNotes}
                        onChange={(e) => {
                          const newKras = [...kras];
                          newKras[
                            currentKRAIndex
                          ].rvo.validationNotes = e.target.value;
                          setKras(newKras);
                        }}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        );

      case 3:
        // Step 3: Personal Attributes
        return (
          <div className="space-y-6">
            <div className={`bg-white rounded-lg border ${reviseAttributesMode ? "border-amber-300" : "border-gray-200"}`}>
              <div className={`p-4 md:p-6 md:py-3 border-b ${reviseAttributesMode ? "border-amber-200 bg-amber-50" : "border-gray-200"}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-gray-900">
                      Section III (A) - Personal Attributes
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Total Weightage: 100%
                    </p>
                  </div>
                  {reviseAttributesMode ? (
                    <button
                      type="button"
                      onClick={() => setReviseAttributesMode(false)}
                      className="text-xs text-amber-700 hover:text-amber-900 underline"
                    >
                      Cancel Revision
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setReviseAttributesMode(true)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-xs font-medium transition-colors"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Revise Ratings
                    </button>
                  )}
                </div>
              </div>
              <div className="p-4 md:p-6">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead className="sticky top-0 z-10">
                      {reviseAttributesMode && (
                        <tr>
                          <th colSpan={2} className="border border-gray-200 px-2 md:px-3 py-1.5 text-center text-xs font-semibold text-gray-500 bg-gray-50" />
                          <th colSpan={3} className="border border-gray-200 px-2 md:px-3 py-1.5 text-center text-xs font-semibold text-blue-700 bg-blue-50">
                            RO Assessment
                          </th>
                          <th colSpan={3} className="border border-gray-200 px-2 md:px-3 py-1.5 text-center text-xs font-semibold text-amber-700 bg-amber-50">
                            RVO Revision
                          </th>
                          <th className="border border-gray-200 px-2 md:px-3 py-1.5 bg-gray-50" />
                        </tr>
                      )}
                      <tr className={reviseAttributesMode ? "bg-gray-50" : "bg-gray-50"}>
                        <th className="border border-gray-200 px-2 md:px-3 py-2 text-left text-xs md:text-sm font-semibold text-gray-900 bg-gray-50 w-12">
                          Sl. No.
                        </th>
                        <th className="border border-gray-200 px-2 md:px-3 py-2 text-left text-xs md:text-sm font-semibold text-gray-900 bg-gray-50">
                          Attribute
                        </th>
                        <th className={`border border-gray-200 px-2 md:px-3 py-2 text-left text-xs md:text-sm font-semibold text-gray-900 ${reviseAttributesMode ? "bg-blue-50" : "bg-gray-50"}`}>
                          RO Rating
                        </th>
                        <th className={`border border-gray-200 px-2 md:px-3 py-2 text-left text-xs md:text-sm font-semibold text-gray-900 ${reviseAttributesMode ? "bg-blue-50" : "bg-gray-50"}`}>
                          RO Remark
                        </th>
                        <th className={`border border-gray-200 px-2 md:px-3 py-2 text-center text-xs md:text-sm font-semibold text-gray-900 ${reviseAttributesMode ? "bg-blue-50" : "bg-gray-50"}`}>
                          {reviseAttributesMode ? "RO Score" : "Score"}
                        </th>
                        {reviseAttributesMode && (
                          <>
                            <th className="border border-amber-300 px-2 md:px-3 py-2 text-left text-xs md:text-sm font-semibold text-amber-800 bg-amber-50">
                              RVO Rating (1-10)
                            </th>
                            <th className="border border-amber-300 px-2 md:px-3 py-2 text-left text-xs md:text-sm font-semibold text-amber-800 bg-amber-50">
                              RVO Remark
                            </th>
                            <th className="border border-amber-300 px-2 md:px-3 py-2 text-center text-xs md:text-sm font-semibold text-amber-800 bg-amber-50">
                              RVO Score
                            </th>
                          </>
                        )}
                        {!reviseAttributesMode && (
                          <th className="border border-gray-200 px-2 md:px-3 py-2 text-center text-xs md:text-sm font-semibold text-gray-900 bg-gray-50">
                            Weightage (%)
                          </th>
                        )}
                        {reviseAttributesMode && (
                          <th className="border border-gray-200 px-2 md:px-3 py-2 text-center text-xs md:text-sm font-semibold text-gray-900 bg-gray-50">
                            Wt. (%)
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {personalAttributes.map((attr) => (
                        <tr key={attr.sl_no} className="hover:bg-gray-50 bg-white">
                          <td className="border border-gray-200 px-2 md:px-3 py-2 text-xs md:text-sm text-gray-900">
                            {attr.sl_no}
                          </td>
                          <td className="border border-gray-200 px-2 md:px-3 py-2 text-xs md:text-sm text-gray-900">
                            {attr.attribute}
                          </td>
                          <td className={`border border-gray-200 px-2 md:px-3 py-2 ${reviseAttributesMode ? "bg-blue-50/30" : ""}`}>
                            <div className="w-full px-2 md:px-3 py-1.5 text-xs md:text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-900 font-semibold text-center">
                              {attributeRatings[attr.sl_no] || "—"}
                            </div>
                          </td>
                          <td className={`border border-gray-200 px-2 md:px-3 py-2 ${reviseAttributesMode ? "bg-blue-50/30" : ""}`}>
                            <div className="w-full px-2 md:px-3 py-1.5 text-xs md:text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                              {attributeRemarks[attr.sl_no] || "—"}
                            </div>
                          </td>
                          <td className={`border border-gray-200 px-2 md:px-3 py-2 text-xs md:text-sm text-blue-600 font-semibold text-center ${reviseAttributesMode ? "bg-blue-50/30" : ""}`}>
                            {calculateScore(attributeRatings[attr.sl_no] || "", attr.weightage_percent)}
                          </td>
                          {reviseAttributesMode && (
                            <>
                              <td className="border border-amber-300 px-2 md:px-3 py-2 bg-amber-50/30">
                                <input
                                  type="number"
                                  min="1"
                                  max="10"
                                  className="w-full px-2 md:px-3 py-1.5 text-xs md:text-sm border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                                  placeholder="1-10"
                                  value={rvoAttributeRatings[attr.sl_no] || ""}
                                  onChange={(e) =>
                                    setRvoAttributeRatings({
                                      ...rvoAttributeRatings,
                                      [attr.sl_no]: e.target.value,
                                    })
                                  }
                                />
                              </td>
                              <td className="border border-amber-300 px-2 md:px-3 py-2 bg-amber-50/30">
                                <input
                                  type="text"
                                  className="w-full px-2 md:px-3 py-1.5 text-xs md:text-sm border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                                  placeholder="Enter remark..."
                                  value={rvoAttributeRemarks[attr.sl_no] || ""}
                                  onChange={(e) =>
                                    setRvoAttributeRemarks({
                                      ...rvoAttributeRemarks,
                                      [attr.sl_no]: e.target.value,
                                    })
                                  }
                                />
                              </td>
                              <td className="border border-amber-300 px-2 md:px-3 py-2 text-xs md:text-sm text-amber-600 font-semibold text-center bg-amber-50/30">
                                {calculateScore(rvoAttributeRatings[attr.sl_no] || "", attr.weightage_percent)}
                              </td>
                            </>
                          )}
                          <td className="border border-gray-200 px-2 md:px-3 py-2 text-xs md:text-sm text-gray-900 text-center font-medium">
                            {attr.weightage_percent}%
                          </td>
                        </tr>
                      ))}
                      <tr className={`font-semibold sticky bottom-0 ${reviseAttributesMode ? "bg-amber-50" : "bg-blue-50"}`}>
                        <td
                          colSpan={4}
                          className={`border border-gray-200 px-2 md:px-3 py-2 text-xs md:text-sm text-gray-900 text-right ${reviseAttributesMode ? "bg-amber-50" : "bg-blue-50"}`}
                        >
                          Total Score:
                        </td>
                        <td className={`border border-gray-200 px-2 md:px-3 py-2 text-xs md:text-sm font-bold text-center ${reviseAttributesMode ? "text-blue-600 bg-blue-50" : "text-blue-600 bg-blue-50"}`}>
                          {calculateTotalScore(attributeRatings, personalAttributes)}
                        </td>
                        {reviseAttributesMode && (
                          <>
                            <td colSpan={2} className="border border-amber-300 px-2 md:px-3 py-2 text-xs md:text-sm text-gray-900 text-right bg-amber-100">
                              RVO Total:
                            </td>
                            <td className="border border-amber-300 px-2 md:px-3 py-2 text-xs md:text-sm text-amber-700 font-bold text-center bg-amber-100">
                              {calculateTotalScore(rvoAttributeRatings, personalAttributes)}
                            </td>
                          </>
                        )}
                        <td aria-label="Weightage" className={`border border-gray-200 px-2 md:px-3 py-2 ${reviseAttributesMode ? "bg-amber-50" : "bg-blue-50"}`} />
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        // Step 4: Functional Competencies
        return (
          <div className="space-y-6">
            <div className={`bg-white rounded-lg border ${reviseCompetenciesMode ? "border-amber-300" : "border-gray-200"}`}>
              <div className={`p-4 md:p-6 border-b ${reviseCompetenciesMode ? "border-amber-200 bg-amber-50" : "border-gray-200"}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-gray-900">
                      Section III (B) - Functional Competencies
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Total Weightage: 100%
                    </p>
                  </div>
                  {reviseCompetenciesMode ? (
                    <button
                      type="button"
                      onClick={() => setReviseCompetenciesMode(false)}
                      className="text-xs text-amber-700 hover:text-amber-900 underline"
                    >
                      Cancel Revision
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setReviseCompetenciesMode(true)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-xs font-medium transition-colors"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Revise Ratings
                    </button>
                  )}
                </div>
              </div>
              <div className="p-4 md:p-6">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead className="sticky top-0 z-10">
                      {reviseCompetenciesMode && (
                        <tr>
                          <th colSpan={2} className="border border-gray-200 px-2 md:px-3 py-1.5 text-center text-xs font-semibold text-gray-500 bg-gray-50" />
                          <th colSpan={3} className="border border-gray-200 px-2 md:px-3 py-1.5 text-center text-xs font-semibold text-blue-700 bg-blue-50">
                            RO Assessment
                          </th>
                          <th colSpan={3} className="border border-gray-200 px-2 md:px-3 py-1.5 text-center text-xs font-semibold text-amber-700 bg-amber-50">
                            RVO Revision
                          </th>
                          <th className="border border-gray-200 px-2 md:px-3 py-1.5 bg-gray-50" />
                        </tr>
                      )}
                      <tr className="bg-gray-50">
                        <th className="border border-gray-200 px-2 md:px-3 py-2 text-left text-xs md:text-sm font-semibold text-gray-900 bg-gray-50 w-12">
                          Sl. No.
                        </th>
                        <th className="border border-gray-200 px-2 md:px-3 py-2 text-left text-xs md:text-sm font-semibold text-gray-900 bg-gray-50">
                          Competency
                        </th>
                        <th className={`border border-gray-200 px-2 md:px-3 py-2 text-left text-xs md:text-sm font-semibold text-gray-900 ${reviseCompetenciesMode ? "bg-blue-50" : "bg-gray-50"}`}>
                          RO Rating
                        </th>
                        <th className={`border border-gray-200 px-2 md:px-3 py-2 text-left text-xs md:text-sm font-semibold text-gray-900 ${reviseCompetenciesMode ? "bg-blue-50" : "bg-gray-50"}`}>
                          RO Remark
                        </th>
                        <th className={`border border-gray-200 px-2 md:px-3 py-2 text-center text-xs md:text-sm font-semibold text-gray-900 ${reviseCompetenciesMode ? "bg-blue-50" : "bg-gray-50"}`}>
                          {reviseCompetenciesMode ? "RO Score" : "Score"}
                        </th>
                        {reviseCompetenciesMode && (
                          <>
                            <th className="border border-amber-300 px-2 md:px-3 py-2 text-left text-xs md:text-sm font-semibold text-amber-800 bg-amber-50">
                              RVO Rating (1-10)
                            </th>
                            <th className="border border-amber-300 px-2 md:px-3 py-2 text-left text-xs md:text-sm font-semibold text-amber-800 bg-amber-50">
                              RVO Remark
                            </th>
                            <th className="border border-amber-300 px-2 md:px-3 py-2 text-center text-xs md:text-sm font-semibold text-amber-800 bg-amber-50">
                              RVO Score
                            </th>
                          </>
                        )}
                        <th className="border border-gray-200 px-2 md:px-3 py-2 text-center text-xs md:text-sm font-semibold text-gray-900 bg-gray-50">
                          {reviseCompetenciesMode ? "Wt. (%)" : "Weightage (%)"}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {functionalCompetencies.map((comp) => (
                        <tr key={comp.sl_no} className="hover:bg-gray-50 bg-white">
                          <td className="border border-gray-200 px-2 md:px-3 py-2 text-xs md:text-sm text-gray-900">
                            {comp.sl_no}
                          </td>
                          <td className="border border-gray-200 px-2 md:px-3 py-2 text-xs md:text-sm text-gray-900">
                            {comp.competency}
                          </td>
                          <td className={`border border-gray-200 px-2 md:px-3 py-2 ${reviseCompetenciesMode ? "bg-blue-50/30" : ""}`}>
                            <div className="w-full px-2 md:px-3 py-1.5 text-xs md:text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-900 font-semibold text-center">
                              {competencyRatings[comp.sl_no] || "—"}
                            </div>
                          </td>
                          <td className={`border border-gray-200 px-2 md:px-3 py-2 ${reviseCompetenciesMode ? "bg-blue-50/30" : ""}`}>
                            <div className="w-full px-2 md:px-3 py-1.5 text-xs md:text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                              {competencyRemarks[comp.sl_no] || "—"}
                            </div>
                          </td>
                          <td className={`border border-gray-200 px-2 md:px-3 py-2 text-xs md:text-sm text-blue-600 font-semibold text-center ${reviseCompetenciesMode ? "bg-blue-50/30" : ""}`}>
                            {calculateScore(competencyRatings[comp.sl_no] || "", comp.weightage_percent)}
                          </td>
                          {reviseCompetenciesMode && (
                            <>
                              <td className="border border-amber-300 px-2 md:px-3 py-2 bg-amber-50/30">
                                <select
                                  className="w-full px-2 md:px-3 py-1.5 text-xs md:text-sm border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                                  value={rvoCompetencyRatings[comp.sl_no] || ""}
                                  onChange={(e) =>
                                    setRvoCompetencyRatings({
                                      ...rvoCompetencyRatings,
                                      [comp.sl_no]: e.target.value,
                                    })
                                  }
                                >
                                  <option value="">Select</option>
                                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                    <option key={num} value={num}>{num}</option>
                                  ))}
                                </select>
                              </td>
                              <td className="border border-amber-300 px-2 md:px-3 py-2 bg-amber-50/30">
                                <input
                                  type="text"
                                  className="w-full px-2 md:px-3 py-1.5 text-xs md:text-sm border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                                  placeholder="Enter remark..."
                                  value={rvoCompetencyRemarks[comp.sl_no] || ""}
                                  onChange={(e) =>
                                    setRvoCompetencyRemarks({
                                      ...rvoCompetencyRemarks,
                                      [comp.sl_no]: e.target.value,
                                    })
                                  }
                                />
                              </td>
                              <td className="border border-amber-300 px-2 md:px-3 py-2 text-xs md:text-sm text-amber-600 font-semibold text-center bg-amber-50/30">
                                {calculateScore(rvoCompetencyRatings[comp.sl_no] || "", comp.weightage_percent)}
                              </td>
                            </>
                          )}
                          <td className="border border-gray-200 px-2 md:px-3 py-2 text-xs md:text-sm text-gray-900 text-center font-medium">
                            {comp.weightage_percent}%
                          </td>
                        </tr>
                      ))}
                      <tr className={`font-semibold sticky bottom-0 ${reviseCompetenciesMode ? "bg-amber-50" : "bg-blue-50"}`}>
                        <td
                          colSpan={4}
                          className={`border border-gray-200 px-2 md:px-3 py-2 text-xs md:text-sm text-gray-900 text-right ${reviseCompetenciesMode ? "bg-amber-50" : "bg-blue-50"}`}
                        >
                          Total Score:
                        </td>
                        <td className={`border border-gray-200 px-2 md:px-3 py-2 text-xs md:text-sm text-blue-600 font-bold text-center ${reviseCompetenciesMode ? "bg-blue-50" : "bg-blue-50"}`}>
                          {calculateTotalScore(competencyRatings, functionalCompetencies)}
                        </td>
                        {reviseCompetenciesMode && (
                          <>
                            <td colSpan={2} className="border border-amber-300 px-2 md:px-3 py-2 text-xs md:text-sm text-gray-900 text-right bg-amber-100">
                              RVO Total:
                            </td>
                            <td className="border border-amber-300 px-2 md:px-3 py-2 text-xs md:text-sm text-amber-700 font-bold text-center bg-amber-100">
                              {calculateTotalScore(rvoCompetencyRatings, functionalCompetencies)}
                            </td>
                          </>
                        )}
                        <td aria-label="Weightage" className={`border border-gray-200 px-2 md:px-3 py-2 ${reviseCompetenciesMode ? "bg-amber-50" : "bg-blue-50"}`} />
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        // Step 5: Overall Summary (RO's - Read Only)
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 md:p-6 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">
                  Section IV - Overall Summary (RO's Assessment)
                </h2>
              </div>
              <div className="p-3 md:p-4 md:pb-10">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Key outcomes delivered
                    </label>
                    <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-700">
                      {keyOutcomes}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Strength observed
                    </label>
                    <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-700">
                      {strengths}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      One improvement area for next year
                    </label>
                    <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-700">
                      {areasForImprovement}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Overall assessment
                    </label>
                    <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-700">
                      {overallAssessment}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Revise Summary Button */}
            {!reviseSummaryMode && (
              <div className="flex justify-center">
                <button
                  onClick={() => setReviseSummaryMode(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-medium transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Revise Summary
                </button>
              </div>
            )}

            {/* RVO Revision Summary */}
            {reviseSummaryMode && (
              <div className="bg-white rounded-lg border border-amber-300">
                <div className="p-4 md:p-6 md:py-3 border-b border-amber-200 bg-amber-50">
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-amber-900">
                      RVO's Revised Summary
                    </h2>
                    <button
                      onClick={() => setReviseSummaryMode(false)}
                      className="text-xs text-amber-700 hover:text-amber-900 underline"
                    >
                      Cancel Revision
                    </button>
                  </div>
                </div>
                <div className="p-3 md:p-4 md:pb-10">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Key outcomes delivered
                      </label>
                      <textarea
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                        placeholder="1-3 lines"
                        value={rvoKeyOutcomes}
                        onChange={(e) => setRvoKeyOutcomes(e.target.value)}
                      />
                      <p className="text-xs text-gray-500 mt-0.5">1-3 lines</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Strength observed
                      </label>
                      <textarea
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                        placeholder="1-2 lines"
                        value={rvoStrengths}
                        onChange={(e) => setRvoStrengths(e.target.value)}
                      />
                      <p className="text-xs text-gray-500 mt-0.5">1-2 lines</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        One improvement area for next year
                      </label>
                      <textarea
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                        placeholder="Enter improvement area for next year..."
                        value={rvoAreasForImprovement}
                        onChange={(e) =>
                          setRvoAreasForImprovement(e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Overall assessment
                      </label>
                      <textarea
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                        placeholder="Minimum 3 lines"
                        value={rvoOverallAssessment}
                        onChange={(e) =>
                          setRvoOverallAssessment(e.target.value)
                        }
                      />
                      <p className="text-xs text-gray-500 mt-0.5">
                        Minimum 3 lines
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 6:
        // Step 6: Training Needs (RO's - Read Only)
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 md:p-6 border-b border-gray-200">
                <div>
                  <h2 className="font-semibold text-gray-900">
                    Section VI - Training Needs (RO's Identification)
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Training programs identified by RO
                  </p>
                </div>
              </div>

              <div className="p-3 md:p-4">
                <div>
                  {trainings.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p className="text-sm">
                        No training needs added yet.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-2 px-3 text-xs font-medium text-gray-700">
                              #
                            </th>
                            <th className="text-left py-2 px-3 text-xs font-medium text-gray-700">
                              Training Title
                            </th>
                            <th className="text-left py-2 px-3 text-xs font-medium text-gray-700">
                              Description
                            </th>
                            <th className="text-left py-2 px-3 text-xs font-medium text-gray-700">
                              Priority
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {trainings.map((training, index) => (
                            <tr
                              key={training.id}
                              className="border-b border-gray-100"
                            >
                              <td className="py-2 px-3 text-sm text-gray-900">
                                {index + 1}
                              </td>
                              <td className="py-2 px-3 text-sm text-gray-900">
                                {training.title}
                              </td>
                              <td className="py-2 px-3 text-sm text-gray-600 max-w-xs">
                                {training.description || "-"}
                              </td>
                              <td className="py-2 px-3">
                                <span
                                  className={`text-xs px-2 py-1 rounded ${
                                    training.priority === "high"
                                      ? "bg-red-100 text-red-700"
                                      : training.priority === "medium"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : "bg-green-100 text-green-700"
                                  }`}
                                >
                                  {training.priority.charAt(0).toUpperCase() +
                                    training.priority.slice(1)}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Revise Training Button */}
            {!reviseTrainingMode && (
              <div className="flex justify-center">
                <button
                  onClick={() => setReviseTrainingMode(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-medium transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Revise Training Needs
                </button>
              </div>
            )}

            {/* RVO Revision Training */}
            {reviseTrainingMode && (
              <div className="bg-white rounded-lg border border-amber-300">
                <div className="p-4 md:p-6 border-b border-amber-200 bg-amber-50 flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-amber-900">
                      RVO's Additional Training Needs
                    </h2>
                    <p className="text-sm text-amber-700 mt-1">
                      Add additional training programs you recommend
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!showRvoTrainingForm && (
                      <button
                        onClick={handleAddRvoTrainingClick}
                        className="flex items-center gap-2 px-3 py-1.5 bg-amber-700 text-white rounded-lg hover:bg-amber-800 text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        Add Training
                      </button>
                    )}
                    <button
                      onClick={() => setReviseTrainingMode(false)}
                      className="text-xs text-amber-700 hover:text-amber-900 underline"
                    >
                      Cancel Revision
                    </button>
                  </div>
                </div>

                <div className="p-3 md:p-4">
                  {showRvoTrainingForm ? (
                    // RVO Training Form
                    <div className="border border-amber-200 rounded-lg p-3 bg-amber-50">
                      <h3 className="text-sm font-medium text-gray-900 mb-3">
                        {isEditingRvoTraining ? "Edit Training" : "New Training"}
                      </h3>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Training Title <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="text"
                            value={currentRvoTraining.title}
                            onChange={(e) =>
                              updateCurrentRvoTraining("title", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                            placeholder="e.g., Advanced Project Management, Leadership Skills, etc."
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Description
                          </label>
                          <textarea
                            value={currentRvoTraining.description}
                            onChange={(e) =>
                              updateCurrentRvoTraining("description", e.target.value)
                            }
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                            placeholder="Describe the training program and how it will benefit..."
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Priority Level <span className="text-red-600">*</span>
                          </label>
                          <select
                            value={currentRvoTraining.priority}
                            onChange={(e) =>
                              updateCurrentRvoTraining("priority", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                          >
                            <option value="high">High Priority</option>
                            <option value="medium">Medium Priority</option>
                            <option value="low">Low Priority</option>
                          </select>
                        </div>

                        <div className="flex gap-2 justify-end pt-2">
                          <button
                            onClick={handleCancelRvoTraining}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveRvoTraining}
                            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm"
                          >
                            {isEditingRvoTraining ? "Update" : "Save"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // RVO Training Table
                    <div>
                      {rvoTrainings.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <p className="text-sm">
                            No additional training needs added yet.
                          </p>
                          <p className="text-xs mt-1">
                            Click "Add Training" to get started.
                          </p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-gray-200">
                                <th className="text-left py-2 px-3 text-xs font-medium text-gray-700">
                                  #
                                </th>
                                <th className="text-left py-2 px-3 text-xs font-medium text-gray-700">
                                  Training Title
                                </th>
                                <th className="text-left py-2 px-3 text-xs font-medium text-gray-700">
                                  Description
                                </th>
                                <th className="text-left py-2 px-3 text-xs font-medium text-gray-700">
                                  Priority
                                </th>
                                <th className="text-right py-2 px-3 text-xs font-medium text-gray-700">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {rvoTrainings.map((training, index) => (
                                <tr
                                  key={training.id}
                                  className="border-b border-gray-100"
                                >
                                  <td className="py-2 px-3 text-sm text-gray-900">
                                    {index + 1}
                                  </td>
                                  <td className="py-2 px-3 text-sm text-gray-900">
                                    {training.title}
                                  </td>
                                  <td className="py-2 px-3 text-sm text-gray-600 max-w-xs truncate">
                                    {training.description || "-"}
                                  </td>
                                  <td className="py-2 px-3">
                                    <span
                                      className={`text-xs px-2 py-1 rounded ${
                                        training.priority === "high"
                                          ? "bg-red-100 text-red-700"
                                          : training.priority === "medium"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : "bg-green-100 text-green-700"
                                      }`}
                                    >
                                      {training.priority.charAt(0).toUpperCase() +
                                        training.priority.slice(1)}
                                    </span>
                                  </td>
                                  <td className="py-2 px-3">
                                    <div className="flex items-center justify-end gap-1">
                                      <button
                                        onClick={() => handleEditRvoTraining(training)}
                                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                        title="Edit"
                                      >
                                        <Edit className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => removeRvoTraining(training.id)}
                                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                                        title="Delete"
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
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );

      case 7:
        // Step 7: RVO Review & Final Submission
        return (
          <div className="space-y-6">
            {/* Review Summary */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 md:p-6 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">
                  Evaluation Summary
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Review all sections before final submission
                </p>
              </div>
              <div className="p-4 md:p-6">
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {/* Basic Info Summary */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-blue-700">
                          Employee ID:
                        </span>
                        <span className="ml-2 text-blue-900 font-medium">
                          {employeeId}
                        </span>
                      </div>
                      <div>
                        <span className="text-blue-700">Name:</span>
                        <span className="ml-2 text-blue-900 font-medium">
                          John Doe
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* KRA Summary */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      KRA Ratings
                    </h3>
                    <p className="text-sm text-gray-600">
                      {kras.filter((k) => k.ro.rating).length} of{" "}
                      {kras.length} KRAs rated by RO
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      RVO Revisions:{" "}
                      {kras.filter((k) => k.rvo.rating).length} KRAs
                    </p>
                  </div>

                  {/* Attributes Summary */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Personal Attributes
                    </h3>
                    <p className="text-sm text-gray-600">
                      RO Total Score:{" "}
                      <span className="font-semibold text-blue-600">
                        {calculateTotalScore(
                          attributeRatings,
                          personalAttributes,
                        )}
                      </span>
                    </p>
                    {Object.keys(rvoAttributeRatings).length > 0 && (
                      <p className="text-sm text-gray-600 mt-1">
                        RVO Total Score:{" "}
                        <span className="font-semibold text-amber-600">
                          {calculateTotalScore(
                            rvoAttributeRatings,
                            personalAttributes,
                          )}
                        </span>
                      </p>
                    )}
                  </div>

                  {/* Competencies Summary */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Functional Competencies
                    </h3>
                    <p className="text-sm text-gray-600">
                      RO Total Score:{" "}
                      <span className="font-semibold text-blue-600">
                        {calculateTotalScore(
                          competencyRatings,
                          functionalCompetencies,
                        )}
                      </span>
                    </p>
                    {Object.keys(rvoCompetencyRatings).length > 0 && (
                      <p className="text-sm text-gray-600 mt-1">
                        RVO Total Score:{" "}
                        <span className="font-semibold text-amber-600">
                          {calculateTotalScore(
                            rvoCompetencyRatings,
                            functionalCompetencies,
                          )}
                        </span>
                      </p>
                    )}
                  </div>

                  {/* Warning */}
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-24">
                    <p className="text-sm text-orange-900">
                      <strong>Important:</strong> Once submitted, this
                      RVO review cannot be edited. Please ensure all
                      information is accurate before proceeding.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* RVO's Final Remarks */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 md:p-6 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">
                  RVO's Final Assessment
                </h2>
              </div>
              <div className="p-4 md:p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      RVO's Remarks <span className="text-red-600">*</span>
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      placeholder="Provide your overall assessment and remarks..."
                      value={rvoRemarks}
                      onChange={(e) => setRvoRemarks(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Recommendations
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      placeholder="Any specific recommendations for the employee's development..."
                      value={rvoRecommendations}
                      onChange={(e) =>
                        setRvoRecommendations(e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="">
      {/* Header - Fixed below navbar, respects sidebar */}
      <div
        className="fixed top-[20px] sm:top-[60px] left-0 lg:left-64 right-0 z-10 bg-white border-b border-gray-200 transition-all duration-300"
        style={{
          left:
            typeof window !== "undefined" && window.innerWidth >= 1024
              ? sidebarCollapsed
                ? "5rem"
                : "16rem"
              : "0",
        }}
      >
        <div className="px-4 lg:px-6 py-2 sm:py-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/review/pending-approvals"
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                title="Back to Approvals"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div className="leading-tight">
                <h1 className="text-sm sm:text-lg font-bold text-gray-900">
                  RVO Review & Moderation
                </h1>
                <p className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-tight">
                  Employee ID: {employeeId}
                </p>
              </div>
            </div>
            <button
              onClick={handleSaveDraft}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-xs font-bold text-gray-700 shadow-sm transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              SAVE DRAFT
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Stepper - Fixed below header, respects sidebar */}
      <div
        className="hidden md:block fixed top-[109px] sm:top-[125px] left-0 lg:left-64 right-0 z-[9] bg-white border-b border-gray-200 shadow-sm transition-all duration-300"
        style={{
          left:
            typeof window !== "undefined" && window.innerWidth >= 1024
              ? sidebarCollapsed
                ? "5rem"
                : "16rem"
              : "0",
        }}
      >
        <div className="px-6 lg:px-8 py-2.5">
          <div className="flex items-start">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="flex-1 flex flex-col items-center relative"
              >
                {/* Connecting line - positioned at circle center */}
                {index < steps.length - 1 && (
                  <div
                    className="absolute top-3 left-1/2 right-0 h-0.5 -translate-y-1/2 z-0"
                    style={{ width: "calc(100% - 0.75rem)" }}
                  >
                    <div
                      className={`h-full ${
                        completedSteps.includes(step.number)
                          ? "bg-green-600"
                          : "bg-gray-200"
                      }`}
                    />
                  </div>
                )}

                {/* Step circle - smaller dot */}
                <div className="relative z-10">
                  <button
                    onClick={() => handleStepClick(step.number)}
                    disabled={
                      !completedSteps.includes(step.number) &&
                      step.number !== currentStep &&
                      step.number !== currentStep + 1
                    }
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                      currentStep === step.number
                        ? "bg-blue-600 text-white"
                        : completedSteps.includes(step.number)
                          ? "bg-green-600 text-white cursor-pointer hover:bg-green-700"
                          : "bg-gray-200 text-gray-500"
                    } ${
                      !completedSteps.includes(step.number) &&
                      step.number !== currentStep &&
                      step.number !== currentStep + 1
                        ? "cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {completedSteps.includes(step.number) && (
                      <Check className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Step label */}
                <span
                  className={`mt-1.5 text-xs font-medium whitespace-nowrap ${
                    currentStep === step.number
                      ? "text-blue-600"
                      : "text-gray-600"
                  }`}
                >
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Spacer for fixed header and stepper */}
      <div className="h-[72px] sm:h-[109px] md:h-[130px]"></div>

      {/* Mobile Stepper */}
      <div className="md:hidden">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-900">
              Step {currentStep} of 7
            </span>
            <span className="text-sm text-gray-600">
              {steps[currentStep - 1].fullTitle}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 7) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="px-4 lg:px-8">{renderStepContent()}</div>

      {/* Desktop Navigation Buttons */}
      <div
        className="hidden md:flex fixed bottom-0 left-0 lg:left-64 right-0 justify-between items-center gap-3 bg-white border-t border-gray-200 p-4 z-10 transition-all duration-300"
        style={{
          left:
            typeof window !== "undefined" && window.innerWidth >= 1024
              ? sidebarCollapsed
                ? "5rem"
                : "16rem"
              : "0",
        }}
      >
        <button
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className={`flex items-center gap-1.5 px-4 py-1.5 text-sm border border-gray-300 rounded-lg ${
            currentStep === 1
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-50"
          }`}
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Previous
        </button>

        <div className="flex gap-2">
          <button
            onClick={handleSaveDraft}
            className="flex items-center gap-1.5 px-4 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Save className="w-3.5 h-3.5" />
            Save Draft
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-4 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {currentStep === 7 ? (
              <>
                <Send className="w-3.5 h-3.5" />
                Forward to AA
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Fixed Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40">
        <div className="flex gap-2">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg font-medium ${
              currentStep === 1
                ? "opacity-50 cursor-not-allowed text-gray-400"
                : "hover:bg-gray-50 text-gray-700"
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            Prev
          </button>

          <button
            onClick={handleSaveDraft}
            className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Save className="w-5 h-5" />
          </button>

          <button
            onClick={handleNext}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            {currentStep === 7 ? (
              <>
                <Send className="w-5 h-5" />
                Submit
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Total Score Summary - Fixed above bottom nav (only on Step 2) */}
      {currentStep === 2 && (
        <div
          className="fixed bottom-[72px] md:bottom-[60px] left-0 lg:left-64 right-0 z-[8] bg-white border-t border-gray-200 shadow-lg transition-all duration-300 px-4 lg:px-8 py-3"
          style={{
            left:
              typeof window !== "undefined" &&
              window.innerWidth >= 1024
                ? sidebarCollapsed
                  ? "5rem"
                  : "16rem"
                : "0",
          }}
        >
          <div className="-mx-4 lg:-mx-8 bg-gradient-to-r from-blue-600 to-blue-700 border-y border-blue-800 shadow-lg px-3 py-1.5 lg:px-4 lg:py-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div>
                  <h4 className="text-xs font-semibold text-white leading-tight">
                    Total Score Summary (RO)
                  </h4>
                  <p className="text-[10px] text-blue-100 leading-tight">
                    {
                      kras.filter(
                        (k) => k.ro.rating && k.ro.weightagePercent,
                      ).length
                    }{" "}
                    / {kras.length} KRAs
                  </p>
                </div>
                <div className="text-center px-2">
                  <div className="text-lg font-bold text-white leading-tight">
                    {kras
                      .reduce(
                        (sum, k) => sum + (parseFloat(k.ro.score) || 0),
                        0,
                      )
                      .toFixed(2)}
                  </div>
                  <p className="text-[10px] text-blue-100 leading-tight">
                    Total
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="bg-white/95 backdrop-blur-sm rounded px-2 py-1">
                  <div className="text-[10px] text-gray-600 leading-tight">
                    Weightage
                  </div>
                  <div className="text-xs font-semibold text-gray-900 leading-tight">
                    {kras
                      .reduce(
                        (sum, k) =>
                          sum + (parseFloat(k.ro.weightagePercent) || 0),
                        0,
                      )
                      .toFixed(0)}
                    %
                  </div>
                </div>
                <div className="bg-white/95 backdrop-blur-sm rounded px-2 py-1">
                  <div className="text-[10px] text-gray-600 leading-tight">
                    Avg Rating
                  </div>
                  <div className="text-xs font-semibold text-gray-900 leading-tight">
                    {kras.filter((k) => k.ro.rating).length > 0
                      ? (
                          kras.reduce(
                            (sum, k) =>
                              sum + (parseFloat(k.ro.rating) || 0),
                            0,
                          ) / kras.filter((k) => k.ro.rating).length
                        ).toFixed(1)
                      : "—"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-md">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Send className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Confirm Submission
                </h3>
                <p className="text-sm text-gray-600">
                  Forward to Accepting Authority
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-700 mb-6">
              Are you sure you want to submit this RVO review? This action
              cannot be undone and the evaluation will be forwarded to the
              Accepting Authority.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleFinalSubmit}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RVOReview;
