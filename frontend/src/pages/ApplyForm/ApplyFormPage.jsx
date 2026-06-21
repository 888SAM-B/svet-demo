import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Users, 
  BookOpen, 
  Award, 
  FileUp, 
  CheckSquare, 
  ArrowLeft, 
  ArrowRight, 
  Loader2, 
  Sparkles,
  Upload, 
  Check,
  Home,
  LayoutDashboard,
  FileDown,
  Eye,
  Trash2,
  X
} from 'lucide-react';
import { useApplication } from '../../context/ApplicationContext';
import { Button } from '../../components/Common/Button';
import { Card } from '../../components/Common/Card';
import Navbar from '../../components/Navbar/Navbar';
import { generateApplicationPdf } from '../../utils/generateApplicationPdf';
import { studentApi } from '../../services/studentApi';

const STEPS = [
  { label: 'Personal', icon: <User className="w-4 h-4" /> },
  { label: 'Parent', icon: <Users className="w-4 h-4" /> },
  { label: 'Academic', icon: <BookOpen className="w-4 h-4" /> },
  { label: 'NEET', icon: <Award className="w-4 h-4" /> },
  { label: 'Documents', icon: <FileUp className="w-4 h-4" /> },
  { label: 'Review', icon: <CheckSquare className="w-4 h-4" /> },
];

const INITIAL_FORM_STATE = {
  personal: {
    name: '',
    gender: '',
    dob: '',
    aadhaar: '',
    community: '',
    passportNo: '',
  },
  parent: {
    parentName: '',
    mobile1: '',
    mobile2: '',
    address: '',
    district: '',
    pincode: '',
  },
  academic: {
    hscGroup: '',
    hscRegisterNo: '',
    physicsMarks: '',
    chemistryMarks: '',
    biologyMarks: '',
    totalMarks: '',
  },
  neet: {
    score: '',
    applicationNumber: '',
    interestedCountry: '',
  },
  documents: {
    marksheet: '',
    neetApp: '',
    neetScore: '',
    photo: '',
    tc: '',
    passportFront: '',
  }
};

export default function ApplyFormPage() {
  const navigate = useNavigate();
  const { addApplication, isSaving } = useApplication();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [uploadingDoc, setUploadingDoc] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [previewFile, setPreviewFile] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedAppId, setSubmittedAppId] = useState('');

  const location = useLocation();

  // Track Application Status States
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [trackIdentifier, setTrackIdentifier] = useState('');
  const [trackDob, setTrackDob] = useState('');
  const [trackedApplication, setTrackedApplication] = useState(null);
  const [trackError, setTrackError] = useState('');
  const [isTrackLoading, setIsTrackLoading] = useState(false);
  const [isTrackPdfGenerating, setIsTrackPdfGenerating] = useState(false);

  // Monitor URL search params for track=true request
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('track') === 'true') {
      setIsStatusModalOpen(true);
      navigate('/apply', { replace: true });
    }
  }, [location, navigate]);

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1) {
      const { name, gender, dob, aadhaar, community } = formData.personal;
      if (!name.trim()) newErrors.name = 'Applicant name is required';
      if (!gender) newErrors.gender = 'Gender is required';
      if (!dob) newErrors.dob = 'Date of Birth is required';
      if (!aadhaar.trim()) {
        newErrors.aadhaar = 'Aadhaar number is required';
      } else if (!/^\d{12}$/.test(aadhaar.replace(/\s/g, ''))) {
        newErrors.aadhaar = 'Aadhaar must be a 12-digit number';
      }
      if (!community) newErrors.community = 'Community is required';
    }

    if (step === 2) {
      const { parentName, mobile1, address, district, pincode } = formData.parent;
      if (!parentName.trim()) newErrors.parentName = 'Parent name is required';
      if (!mobile1.trim()) {
        newErrors.mobile1 = 'Mobile number is required';
      } else if (!/^\d{10}$/.test(mobile1)) {
        newErrors.mobile1 = 'Enter a valid 10-digit mobile number';
      }
      if (!address.trim()) newErrors.address = 'Address is required';
      if (!district.trim()) newErrors.district = 'District is required';
      if (!pincode.trim()) {
        newErrors.pincode = 'Pincode is required';
      } else if (!/^\d{6}$/.test(pincode)) {
        newErrors.pincode = 'Enter a valid 6-digit pincode';
      }
    }

    if (step === 3) {
      const { hscGroup, hscRegisterNo, physicsMarks, chemistryMarks, biologyMarks, totalMarks } = formData.academic;
      if (!hscGroup) newErrors.hscGroup = 'HSC group is required';
      if (!hscRegisterNo.trim()) newErrors.hscRegisterNo = 'Register number is required';
      
      const p = parseFloat(physicsMarks);
      if (isNaN(p) || p < 0 || p > 100) newErrors.physicsMarks = 'Physics marks (0-100)';
      const c = parseFloat(chemistryMarks);
      if (isNaN(c) || c < 0 || c > 100) newErrors.chemistryMarks = 'Chemistry marks (0-100)';
      const b = parseFloat(biologyMarks);
      if (isNaN(b) || b < 0 || b > 100) newErrors.biologyMarks = 'Biology marks (0-100)';
      
      const t = parseFloat(totalMarks);
      if (isNaN(t) || t < 0) newErrors.totalMarks = 'Overall marks required';
    }

    if (step === 4) {
      const { score, applicationNumber, interestedCountry } = formData.neet;
      const s = parseInt(score);
      if (isNaN(s) || s < 0 || s > 720) newErrors.score = 'NEET score (0-720)';
      if (!applicationNumber.trim()) newErrors.applicationNumber = 'NEET Application number is required';
      if (!interestedCountry) newErrors.interestedCountry = 'Select country';
    }

    if (step === 5) {
      const { marksheet, neetApp, neetScore, photo, tc } = formData.documents;
      if (!marksheet) newErrors.marksheet = 'Required';
      if (!neetApp) newErrors.neetApp = 'Required';
      if (!neetScore) newErrors.neetScore = 'Required';
      if (!photo) newErrors.photo = 'Required';
      if (!tc) newErrors.tc = 'Required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleDocUpload = (field, file) => {
    if (!file) return;

    setUploadingDoc(prev => ({ ...prev, [field]: 0 }));
    let progress = 0;
    
    const interval = setInterval(() => {
      progress += 10;
      setUploadingDoc(prev => ({ ...prev, [field]: progress }));
      
      if (progress >= 100) {
        clearInterval(interval);
        handleInputChange('documents', field, file.name);
        setUploadedFiles(prev => ({ ...prev, [field]: file }));
        setUploadingDoc(prev => {
          const updated = { ...prev };
          delete updated[field];
          return updated;
        });
      }
    }, 100);
  };

  const handleRemoveDoc = (field) => {
    handleInputChange('documents', field, '');
    setUploadedFiles(prev => {
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });
  };

  const handlePreviewDoc = (field) => {
    const file = uploadedFiles[field];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewFile({
        name: file.name,
        url: url,
        type: file.type
      });
    }
  };

  const handleTrackSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!trackIdentifier.trim() || !trackDob) {
      setTrackError('Please enter both Reference ID/Aadhaar and DOB.');
      return;
    }
    setIsTrackLoading(true);
    setTrackError('');
    setTrackedApplication(null);

    try {
      const data = await studentApi.checkStatus(trackIdentifier.trim(), trackDob);
      setTrackedApplication(data);
    } catch (err) {
      console.error('Tracking failed:', err);
      setTrackError(err.message || 'Application not found. Please check your credentials.');
    } finally {
      setIsTrackLoading(false);
    }
  };

  const handleDownloadTrackedPdf = async () => {
    if (!trackedApplication || isTrackPdfGenerating) return;
    setIsTrackPdfGenerating(true);

    try {
      await generateApplicationPdf(trackedApplication, `SVET-Application-${trackedApplication.id}.pdf`);
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('PDF download failed. Please try again.');
    } finally {
      setIsTrackPdfGenerating(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const submissionData = {
        personal: { ...formData.personal },
        parent: { ...formData.parent },
        academic: {
          ...formData.academic,
          physicsMarks: parseFloat(formData.academic.physicsMarks),
          chemistryMarks: parseFloat(formData.academic.chemistryMarks),
          biologyMarks: parseFloat(formData.academic.biologyMarks),
          totalMarks: parseFloat(formData.academic.totalMarks),
        },
        neet: {
          ...formData.neet,
          score: parseInt(formData.neet.score),
        },
      };

      const form = new FormData();
      form.append('payload', JSON.stringify(submissionData));
      
      // Map every uploaded file with its document_type
      if (uploadedFiles.marksheet) form.append('marksheet', uploadedFiles.marksheet);
      if (uploadedFiles.neetApp) form.append('neetApp', uploadedFiles.neetApp);
      if (uploadedFiles.neetScore) form.append('neetScore', uploadedFiles.neetScore);
      if (uploadedFiles.photo) form.append('photo', uploadedFiles.photo);
      if (uploadedFiles.tc) form.append('tc', uploadedFiles.tc);
      if (uploadedFiles.passportFront) form.append('passportFront', uploadedFiles.passportFront);

      const result = await addApplication(form);
      setSubmittedAppId(result.id);
      setIsSubmitted(true);
    } catch (e) {
      console.error(e);
      alert(e.message || 'Failed to submit application. Please check form validation rules and try again.');
    }
  };

  const [isPdfGenerating, setIsPdfGenerating] = useState(false);

  const handleDownloadReceipt = async () => {
    if (isPdfGenerating) return;
    setIsPdfGenerating(true);
    const student = {
      id: submittedAppId,
      personal: formData.personal,
      parent: formData.parent,
      academic: formData.academic,
      neet: formData.neet,
      documents: formData.documents,
      createdDate: new Date().toISOString()
    };


    try {
      await generateApplicationPdf(student, `SVET-Application-${submittedAppId}.pdf`);
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('PDF download failed. Please try again.');
    } finally {
      setIsPdfGenerating(false);
    }
  };




  const inputClass = (hasError) => `w-full bg-white border rounded-lg px-4 py-3 text-sm text-primary-text focus:outline-none focus:border-secondary-blue focus:ring-1 focus:ring-secondary-blue/30 h-12 transition-colors ${
    hasError ? 'border-red-500' : 'border-border-color'
  }`;

  return (
    <div className="min-h-screen bg-primary-bg text-primary-text relative flex flex-col justify-between pt-28">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 w-full flex-grow py-8 relative z-10">
        
        {!isSubmitted ? (
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <h2 className="font-display font-extrabold text-3xl text-primary-blue">
                Admission Application Form
              </h2>
              <p className="text-sm text-secondary-text font-light">
                Provide correct information as per educational records to check university eligibility.
              </p>
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setIsStatusModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2 border border-secondary-blue/30 text-secondary-blue bg-secondary-blue/5 hover:bg-secondary-blue/10 rounded-full text-xs font-semibold transition-all cursor-pointer shadow-sm hover:shadow"
              >
                Already Applied? Track Application Status
              </button>
            </div>

            {/* Progress Tracker */}
            <div className="bg-white border border-border-color rounded-xl p-4 flex justify-between items-center overflow-x-auto gap-4 shadow-sm">
              {STEPS.map((step, index) => {
                const stepNum = index + 1;
                const isActive = stepNum === currentStep;
                const isCompleted = stepNum < currentStep;
                return (
                  <div key={step.label} className="flex items-center gap-2 shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border font-display text-xs font-bold transition-all duration-200 ${
                      isActive 
                        ? 'bg-secondary-blue border-secondary-blue text-white shadow-sm'
                        : isCompleted
                          ? 'bg-primary-blue/10 border-primary-blue text-primary-blue'
                          : 'bg-white border-border-color text-secondary-text'
                    }`}>
                      {isCompleted ? <Check className="w-4 h-4" /> : step.icon}
                    </div>
                    <span className={`text-xs font-semibold ${
                      isActive ? 'text-secondary-blue' : isCompleted ? 'text-primary-blue' : 'text-secondary-text'
                    }`}>
                      {step.label}
                    </span>
                    {index < STEPS.length - 1 && (
                      <div className="w-4 h-[1px] bg-border-color hidden sm:block ml-2" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Step Wizard Container */}
            <Card className="bg-white border border-border-color p-6 md:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  
                  {/* STEP 1: PERSONAL DETAILS */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <h3 className="font-display font-bold text-lg text-primary-blue border-b border-border-color pb-2">
                        Step 1: Personal Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                          <label className="text-[11px] text-secondary-text uppercase font-bold tracking-wider">Applicant Name *</label>
                          <input 
                            type="text" 
                            value={formData.personal.name}
                            onChange={(e) => handleInputChange('personal', 'name', e.target.value)}
                            placeholder="Full Name (as in marksheet)"
                            className={inputClass(errors.name)}
                          />
                          {errors.name && <p className="text-[11px] text-red-500 font-semibold">{errors.name}</p>}
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] text-secondary-text uppercase font-bold tracking-wider">Gender *</label>
                          <select 
                            value={formData.personal.gender}
                            onChange={(e) => handleInputChange('personal', 'gender', e.target.value)}
                            className={inputClass(errors.gender)}
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                          {errors.gender && <p className="text-[11px] text-red-500 font-semibold">{errors.gender}</p>}
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] text-secondary-text uppercase font-bold tracking-wider">Date of Birth *</label>
                          <input 
                            type="date" 
                            value={formData.personal.dob}
                            onChange={(e) => handleInputChange('personal', 'dob', e.target.value)}
                            className={inputClass(errors.dob)}
                          />
                          {errors.dob && <p className="text-[11px] text-red-500 font-semibold">{errors.dob}</p>}
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] text-secondary-text uppercase font-bold tracking-wider">Aadhaar Number *</label>
                          <input 
                            type="text" 
                            maxLength={12}
                            value={formData.personal.aadhaar}
                            onChange={(e) => handleInputChange('personal', 'aadhaar', e.target.value.replace(/\D/g, ''))}
                            placeholder="12 digit Aadhaar number"
                            className={inputClass(errors.aadhaar)}
                          />
                          {errors.aadhaar && <p className="text-[11px] text-red-500 font-semibold">{errors.aadhaar}</p>}
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] text-secondary-text uppercase font-bold tracking-wider">Community *</label>
                          <select 
                            value={formData.personal.community}
                            onChange={(e) => handleInputChange('personal', 'community', e.target.value)}
                            className={inputClass(errors.community)}
                          >
                            <option value="">Select Community</option>
                            <option value="OC">OC</option>
                            <option value="BC">BC</option>
                            <option value="MBC">MBC</option>
                            <option value="BCM">BCM</option>
                            <option value="SC">SC</option>
                            <option value="ST">ST</option>
                          </select>
                          {errors.community && <p className="text-[11px] text-red-500 font-semibold">{errors.community}</p>}
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] text-secondary-text uppercase font-bold tracking-wider">Passport Number (Optional)</label>
                          <input 
                            type="text" 
                            value={formData.personal.passportNo}
                            onChange={(e) => handleInputChange('personal', 'passportNo', e.target.value.toUpperCase())}
                            placeholder="Enter passport number if available"
                            className="w-full bg-white border border-border-color rounded-lg px-4 py-3 text-sm text-primary-text focus:outline-none focus:border-secondary-blue focus:ring-1 focus:ring-secondary-blue/30 h-12"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: PARENT DETAILS */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <h3 className="font-display font-bold text-lg text-primary-blue border-b border-border-color pb-2">
                        Step 2: Parent Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                          <label className="text-[11px] text-secondary-text uppercase font-bold tracking-wider">Parent / Guardian Name *</label>
                          <input 
                            type="text" 
                            value={formData.parent.parentName}
                            onChange={(e) => handleInputChange('parent', 'parentName', e.target.value)}
                            placeholder="Parent Name"
                            className={inputClass(errors.parentName)}
                          />
                          {errors.parentName && <p className="text-[11px] text-red-500 font-semibold">{errors.parentName}</p>}
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] text-secondary-text uppercase font-bold tracking-wider">Mobile Number 1 *</label>
                          <input 
                            type="tel" 
                            maxLength={10}
                            value={formData.parent.mobile1}
                            onChange={(e) => handleInputChange('parent', 'mobile1', e.target.value.replace(/\D/g, ''))}
                            placeholder="Primary contact"
                            className={inputClass(errors.mobile1)}
                          />
                          {errors.mobile1 && <p className="text-[11px] text-red-500 font-semibold">{errors.mobile1}</p>}
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] text-secondary-text uppercase font-bold tracking-wider">Mobile Number 2 (Optional)</label>
                          <input 
                            type="tel" 
                            maxLength={10}
                            value={formData.parent.mobile2}
                            onChange={(e) => handleInputChange('parent', 'mobile2', e.target.value.replace(/\D/g, ''))}
                            placeholder="Secondary contact"
                            className="w-full bg-white border border-border-color rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-secondary-blue h-12"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] text-secondary-text uppercase font-bold tracking-wider">District *</label>
                          <input 
                            type="text" 
                            value={formData.parent.district}
                            onChange={(e) => handleInputChange('parent', 'district', e.target.value)}
                            placeholder="District e.g. Salem"
                            className={inputClass(errors.district)}
                          />
                          {errors.district && <p className="text-[11px] text-red-500 font-semibold">{errors.district}</p>}
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] text-secondary-text uppercase font-bold tracking-wider">Pincode *</label>
                          <input 
                            type="text" 
                            maxLength={6}
                            value={formData.parent.pincode}
                            onChange={(e) => handleInputChange('parent', 'pincode', e.target.value.replace(/\D/g, ''))}
                            placeholder="6 digit pincode"
                            className={inputClass(errors.pincode)}
                          />
                          {errors.pincode && <p className="text-[11px] text-red-500 font-semibold">{errors.pincode}</p>}
                        </div>

                        <div className="space-y-1.5 md:col-span-2">
                          <label className="text-[11px] text-secondary-text uppercase font-bold tracking-wider">Communication Address *</label>
                          <textarea 
                            value={formData.parent.address}
                            onChange={(e) => handleInputChange('parent', 'address', e.target.value)}
                            placeholder="Full door address"
                            rows={3}
                            className={`w-full bg-white border rounded-lg p-4 text-sm text-primary-text focus:outline-none focus:border-secondary-blue focus:ring-1 focus:ring-secondary-blue/30 transition-colors ${
                              errors.address ? 'border-red-500' : 'border-border-color'
                            }`}
                          />
                          {errors.address && <p className="text-[11px] text-red-500 font-semibold">{errors.address}</p>}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: ACADEMIC DETAILS */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <h3 className="font-display font-bold text-lg text-primary-blue border-b border-border-color pb-2">
                        Step 3: Academic Information (+2 / HSC)
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                          <label className="text-[11px] text-secondary-text uppercase font-bold tracking-wider">HSC Group *</label>
                          <select 
                            value={formData.academic.hscGroup}
                            onChange={(e) => handleInputChange('academic', 'hscGroup', e.target.value)}
                            className={inputClass(errors.hscGroup)}
                          >
                            <option value="">Select Group</option>
                            <option value="Biology / Maths">Biology / Maths</option>
                            <option value="Pure Science">Pure Science</option>
                            <option value="Others">Others</option>
                          </select>
                          {errors.hscGroup && <p className="text-[11px] text-red-500 font-semibold">{errors.hscGroup}</p>}
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] text-secondary-text uppercase font-bold tracking-wider">HSC Register Number *</label>
                          <input 
                            type="text" 
                            value={formData.academic.hscRegisterNo}
                            onChange={(e) => handleInputChange('academic', 'hscRegisterNo', e.target.value)}
                            placeholder="HSC Register Number"
                            className={inputClass(errors.hscRegisterNo)}
                          />
                          {errors.hscRegisterNo && <p className="text-[11px] text-red-500 font-semibold">{errors.hscRegisterNo}</p>}
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] text-secondary-text uppercase font-bold tracking-wider">Physics Marks (out of 100) *</label>
                          <input 
                            type="number" 
                            max={100}
                            value={formData.academic.physicsMarks}
                            onChange={(e) => handleInputChange('academic', 'physicsMarks', e.target.value)}
                            placeholder="Physics score"
                            className={inputClass(errors.physicsMarks)}
                          />
                          {errors.physicsMarks && <p className="text-[11px] text-red-500 font-semibold">{errors.physicsMarks}</p>}
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] text-secondary-text uppercase font-bold tracking-wider">Chemistry Marks (out of 100) *</label>
                          <input 
                            type="number" 
                            max={100}
                            value={formData.academic.chemistryMarks}
                            onChange={(e) => handleInputChange('academic', 'chemistryMarks', e.target.value)}
                            placeholder="Chemistry score"
                            className={inputClass(errors.chemistryMarks)}
                          />
                          {errors.chemistryMarks && <p className="text-[11px] text-red-500 font-semibold">{errors.chemistryMarks}</p>}
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] text-secondary-text uppercase font-bold tracking-wider">Biology Marks (out of 100) *</label>
                          <input 
                            type="number" 
                            max={100}
                            value={formData.academic.biologyMarks}
                            onChange={(e) => handleInputChange('academic', 'biologyMarks', e.target.value)}
                            placeholder="Biology score"
                            className={inputClass(errors.biologyMarks)}
                          />
                          {errors.biologyMarks && <p className="text-[11px] text-red-500 font-semibold">{errors.biologyMarks}</p>}
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] text-secondary-text uppercase font-bold tracking-wider">Overall Total Marks *</label>
                          <input 
                            type="number" 
                            value={formData.academic.totalMarks}
                            onChange={(e) => handleInputChange('academic', 'totalMarks', e.target.value)}
                            placeholder="HSC Total (e.g. 540)"
                            className={inputClass(errors.totalMarks)}
                          />
                          {errors.totalMarks && <p className="text-[11px] text-red-500 font-semibold">{errors.totalMarks}</p>}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 4: NEET DETAILS */}
                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <h3 className="font-display font-bold text-lg text-primary-blue border-b border-border-color pb-2">
                        Step 4: NEET Details & Preference
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                          <label className="text-[11px] text-secondary-text uppercase font-bold tracking-wider">NEET Score (out of 720) *</label>
                          <input 
                            type="number" 
                            max={720}
                            value={formData.neet.score}
                            onChange={(e) => handleInputChange('neet', 'score', e.target.value)}
                            placeholder="NEET Score e.g. 350"
                            className={inputClass(errors.score)}
                          />
                          {errors.score && <p className="text-[11px] text-red-500 font-semibold">{errors.score}</p>}
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] text-secondary-text uppercase font-bold tracking-wider">NEET Application Number *</label>
                          <input 
                            type="text" 
                            value={formData.neet.applicationNumber}
                            onChange={(e) => handleInputChange('neet', 'applicationNumber', e.target.value)}
                            placeholder="NEET Registration Number"
                            className={inputClass(errors.applicationNumber)}
                          />
                          {errors.applicationNumber && <p className="text-[11px] text-red-500 font-semibold">{errors.applicationNumber}</p>}
                        </div>

                        <div className="space-y-1.5 md:col-span-2">
                          <label className="text-[11px] text-secondary-text uppercase font-bold tracking-wider">Interested Country *</label>
                          <select 
                            value={formData.neet.interestedCountry}
                            onChange={(e) => handleInputChange('neet', 'interestedCountry', e.target.value)}
                            className={inputClass(errors.interestedCountry)}
                          >
                            <option value="">Select Interested Country</option>
                            <option value="Uzbekistan">Uzbekistan</option>
                            <option value="Malaysia">Malaysia</option>
                            <option value="Russia">Russia</option>
                            <option value="UK">UK</option>
                            <option value="Germany">Germany</option>
                            <option value="USA">USA</option>
                            <option value="Kyrgyzstan">Kyrgyzstan</option>
                            <option value="Philippines">Philippines</option>
                            <option value="Georgia">Georgia</option>
                            <option value="Singapore">Singapore</option>
                          </select>
                          {errors.interestedCountry && <p className="text-[11px] text-red-500 font-semibold">{errors.interestedCountry}</p>}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 5: DOCUMENT UPLOAD */}
                  {currentStep === 5 && (
                    <div className="space-y-6">
                      <div className="border-b border-border-color pb-2">
                        <h3 className="font-display font-bold text-lg text-primary-blue">
                          Step 5: Document Upload
                        </h3>
                        <p className="text-xs text-secondary-text mt-0.5">Please attach copies of documents for verification.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { label: '+2 Marksheet *', key: 'marksheet' },
                          { label: 'NEET Application *', key: 'neetApp' },
                          { label: 'NEET Score Card *', key: 'neetScore' },
                          { label: 'Passport Size Photo *', key: 'photo' },
                          { label: 'Transfer Certificate *', key: 'tc' },
                          { label: 'Passport Front Page (Optional)', key: 'passportFront' }
                        ].map((doc) => {
                          const isUploading = uploadingDoc[doc.key] !== undefined;
                          const uploadPercent = uploadingDoc[doc.key] || 0;
                          const hasFile = formData.documents[doc.key];

                          return (
                            <div key={doc.key} className="bg-white border border-border-color rounded-xl p-4 flex flex-col justify-between gap-3 relative overflow-hidden shadow-sm">
                              
                              {/* Background loading bar */}
                              {isUploading && (
                                <div 
                                  className="absolute bottom-0 left-0 h-1 bg-secondary-blue transition-all duration-100 pointer-events-none"
                                  style={{ width: `${uploadPercent}%` }}
                                />
                              )}

                              <div className="flex items-start justify-between gap-3">
                                <div className="space-y-1 overflow-hidden flex-1">
                                  <span className="text-xs font-bold text-primary-blue block">{doc.label}</span>
                                  {hasFile ? (
                                    <div className="flex items-center gap-1">
                                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" strokeWidth={3} />
                                      <span className="text-[10px] text-emerald-600 truncate block font-bold" title={hasFile}>{hasFile}</span>
                                    </div>
                                  ) : isUploading ? (
                                    <span className="text-[10px] text-secondary-blue block">Uploading... {uploadPercent}%</span>
                                  ) : (
                                    <span className="text-[10px] text-secondary-text block">No file selected</span>
                                  )}
                                </div>

                                <div className="shrink-0 flex items-center gap-2">
                                  {hasFile ? (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() => handlePreviewDoc(doc.key)}
                                        className="p-1.5 rounded-lg bg-secondary-bg border border-border-color text-secondary-text hover:text-primary-blue hover:bg-border-color transition-colors cursor-pointer flex items-center justify-center"
                                        title="Preview Document"
                                      >
                                        <Eye className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveDoc(doc.key)}
                                        className="p-1.5 rounded-lg bg-red-50 border border-red-200 text-red-500 hover:bg-red-100 transition-colors cursor-pointer flex items-center justify-center"
                                        title="Remove Document"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </>
                                  ) : (
                                    <label className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer border transition-colors ${
                                      isUploading 
                                        ? 'bg-secondary-blue/10 border-secondary-blue text-secondary-blue pointer-events-none'
                                        : errors[doc.key] 
                                          ? 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100'
                                          : 'bg-secondary-bg border-border-color text-secondary-text hover:bg-border-color hover:text-primary-blue'
                                    }`}>
                                      <Upload className="w-3.5 h-3.5" />
                                      <input 
                                        type="file" 
                                        className="hidden" 
                                        onChange={(e) => handleDocUpload(doc.key, e.target.files[0])}
                                        disabled={isUploading}
                                      />
                                    </label>
                                  )}
                                </div>
                              </div>
                              
                              {errors[doc.key] && !hasFile && (
                                <p className="text-[10px] text-red-500 font-semibold leading-none">{errors[doc.key]}</p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* STEP 6: REVIEW & SUBMIT */}
                  {currentStep === 6 && (
                    <div className="space-y-6">
                      <h3 className="font-display font-bold text-lg text-primary-blue border-b border-border-color pb-2">
                        Step 6: Review & Submit
                      </h3>
                      
                      <div className="space-y-6 text-sm text-left">
                        {/* Personal info */}
                        <div className="space-y-2">
                          <h4 className="text-xs uppercase tracking-wider text-secondary-blue font-bold">1. Personal Information</h4>
                          <div className="grid grid-cols-2 gap-4 bg-primary-bg border border-border-color rounded-lg p-4 text-xs font-light">
                            <div><strong className="text-primary-blue font-medium">Name:</strong> {formData.personal.name}</div>
                            <div><strong className="text-primary-blue font-medium">Gender:</strong> {formData.personal.gender}</div>
                            <div><strong className="text-primary-blue font-medium">Date of Birth:</strong> {formData.personal.dob}</div>
                            <div><strong className="text-primary-blue font-medium">Aadhaar:</strong> {formData.personal.aadhaar}</div>
                            <div><strong className="text-primary-blue font-medium">Community:</strong> {formData.personal.community}</div>
                            <div><strong className="text-primary-blue font-medium">Passport:</strong> {formData.personal.passportNo || 'N/A'}</div>
                          </div>
                        </div>

                        {/* Parent info */}
                        <div className="space-y-2">
                          <h4 className="text-xs uppercase tracking-wider text-secondary-blue font-bold">2. Parent & Contact Information</h4>
                          <div className="grid grid-cols-2 gap-4 bg-primary-bg border border-border-color rounded-lg p-4 text-xs font-light">
                            <div><strong className="text-primary-blue font-medium">Parent Name:</strong> {formData.parent.parentName}</div>
                            <div><strong className="text-primary-blue font-medium">Mobile 1:</strong> {formData.parent.mobile1}</div>
                            <div><strong className="text-primary-blue font-medium">Mobile 2:</strong> {formData.parent.mobile2 || 'N/A'}</div>
                            <div><strong className="text-primary-blue font-medium">District:</strong> {formData.parent.district}</div>
                            <div><strong className="text-primary-blue font-medium">Pincode:</strong> {formData.parent.pincode}</div>
                            <div className="col-span-2"><strong className="text-primary-blue font-medium">Address:</strong> {formData.parent.address}</div>
                          </div>
                        </div>

                        {/* Academic info */}
                        <div className="space-y-2">
                          <h4 className="text-xs uppercase tracking-wider text-secondary-blue font-bold">3. Academic Information</h4>
                          <div className="grid grid-cols-2 gap-4 bg-primary-bg border border-border-color rounded-lg p-4 text-xs font-light">
                            <div><strong className="text-primary-blue font-medium">HSC Group:</strong> {formData.academic.hscGroup}</div>
                            <div><strong className="text-primary-blue font-medium">Register No:</strong> {formData.academic.hscRegisterNo}</div>
                            <div><strong className="text-primary-blue font-medium">Physics:</strong> {formData.academic.physicsMarks}</div>
                            <div><strong className="text-primary-blue font-medium">Chemistry:</strong> {formData.academic.chemistryMarks}</div>
                            <div><strong className="text-primary-blue font-medium">Biology:</strong> {formData.academic.biologyMarks}</div>
                            <div><strong className="text-primary-blue font-medium">HSC Total:</strong> {formData.academic.totalMarks}</div>
                          </div>
                        </div>

                        {/* NEET info */}
                        <div className="space-y-2">
                          <h4 className="text-xs uppercase tracking-wider text-secondary-blue font-bold">4. NEET Details & Preference</h4>
                          <div className="grid grid-cols-2 gap-4 bg-primary-bg border border-border-color rounded-lg p-4 text-xs font-light">
                            <div><strong className="text-primary-blue font-medium">NEET Score:</strong> {formData.neet.score}</div>
                            <div><strong className="text-primary-blue font-medium">NEET Application No:</strong> {formData.neet.applicationNumber}</div>
                            <div className="col-span-2"><strong className="text-primary-blue font-medium">Interested Country:</strong> {formData.neet.interestedCountry}</div>
                          </div>
                        </div>

                        {/* Documents */}
                        <div className="space-y-2">
                          <h4 className="text-xs uppercase tracking-wider text-secondary-blue font-bold">5. Uploaded Documents</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-primary-bg border border-border-color rounded-lg p-4 text-xs font-light">
                            {Object.entries(formData.documents).map(([key, val]) => (
                              <div key={key} className="flex justify-between border-b border-border-color pb-1">
                                <span className="capitalize text-secondary-text">{key.replace(/([A-Z])/g, ' $1')}:</span>
                                <span className="text-emerald-600 truncate max-w-[180px] font-bold">{val || 'Not uploaded'}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>

              {/* Navigation buttons */}
              <div className="flex justify-between items-center border-t border-border-color pt-6 mt-8">
                {currentStep > 1 ? (
                  <Button variant="secondary" onClick={handlePrev} className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </Button>
                ) : (
                  <div />
                )}

                {currentStep < 6 ? (
                  <Button variant="primary" onClick={handleNext} className="gap-2">
                    <span>Next</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button variant="primary" onClick={handleSubmit} disabled={isSaving} className="gap-2 px-8">
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-white fill-current" />
                        <span>Submit Application</span>
                      </>
                    )}
                  </Button>
                )}
              </div>
            </Card>
          </div>
        ) : (
          /* SUCCESS PAGE */
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="max-w-md mx-auto"
          >
            <Card className="text-center space-y-6 p-8 bg-white border border-border-color shadow-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500" />
              
              <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center mx-auto shadow-sm">
                <Check className="w-10 h-10 text-emerald-500 stroke-[3]" />
              </div>

              <div className="space-y-2">
                <h3 className="font-display font-extrabold text-2xl text-primary-blue">
                  Application Submitted Successfully
                </h3>
                <p className="text-xs text-secondary-text font-light leading-relaxed">
                  Our team will contact you shortly. Your unique Reference ID is:
                </p>
                <div className="px-4 py-2 rounded-lg bg-primary-bg border border-border-color inline-block font-mono text-sm text-secondary-blue font-bold tracking-wider">
                  {submittedAppId}
                </div>
              </div>

              <p className="text-xs text-secondary-text font-light">
                Our overseas education consultants will review your NEET credentials and contact you within 24 hours.
              </p>

              <hr className="border-border-color my-4" />

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleDownloadReceipt}
                  disabled={isPdfGenerating}
                  className={`w-full gap-2 py-3 flex items-center justify-center rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                    isPdfGenerating
                      ? 'border-emerald-200 text-emerald-400 bg-emerald-50/30 cursor-not-allowed'
                      : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50/50 bg-white'
                  }`}
                >
                  {isPdfGenerating ? (
                    <>
                      <svg className="w-4 h-4 animate-spin text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Generating PDF...</span>
                    </>
                  ) : (
                    <>
                      <FileDown className="w-4 h-4 text-emerald-600" />
                      <span>Download Application PDF</span>
                    </>
                  )}
                </button>
                <Link to="/">
                  <Button variant="secondary" className="w-full gap-2 py-3 justify-center">
                    <Home className="w-4 h-4 text-secondary-blue" />
                    <span>Go Home</span>
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        )}

      </div>

      {/* Document Preview Modal */}
      <AnimatePresence>
        {previewFile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary-blue/70 backdrop-blur-sm"
            onClick={() => setPreviewFile(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl h-[80vh] flex flex-col overflow-hidden relative"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border-color shrink-0">
                <h3 className="font-display font-extrabold text-lg text-primary-blue truncate max-w-[80%]">
                  Preview: {previewFile.name}
                </h3>
                <button
                  type="button"
                  onClick={() => setPreviewFile(null)}
                  className="p-1.5 rounded-lg hover:bg-primary-bg text-secondary-text hover:text-primary-blue transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 bg-secondary-bg overflow-auto p-4 flex items-center justify-center">
                {previewFile.type.startsWith('image/') ? (
                  <img
                    src={previewFile.url}
                    alt={previewFile.name}
                    className="max-w-full max-h-full object-contain rounded"
                  />
                ) : previewFile.type === 'application/pdf' ? (
                  <iframe
                    src={previewFile.url}
                    title={previewFile.name}
                    className="w-full h-full rounded border-0"
                  />
                ) : (
                  <div className="text-center space-y-4 p-8">
                    <p className="text-sm text-secondary-text">Preview not supported for this file type.</p>
                    <a
                      href={previewFile.url}
                      download={previewFile.name}
                      className="inline-flex items-center justify-center px-4 py-2 bg-secondary-blue text-white rounded-lg font-semibold text-xs hover:bg-secondary-blue/90 transition-colors"
                    >
                      Download to View
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Track Application Status Modal */}
      <AnimatePresence>
        {isStatusModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary-blue/70 backdrop-blur-sm"
            onClick={() => {
              setIsStatusModalOpen(false);
              setTrackedApplication(null);
              setTrackError('');
            }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border-color shrink-0 bg-primary-bg">
                <h3 className="font-display font-extrabold text-lg text-primary-blue">
                  Track Application Status
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setIsStatusModalOpen(false);
                    setTrackedApplication(null);
                    setTrackError('');
                  }}
                  className="p-1.5 rounded-lg hover:bg-white text-secondary-text hover:text-primary-blue transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6">
                {!trackedApplication ? (
                  <form onSubmit={handleTrackSubmit} className="space-y-4">
                    <p className="text-xs text-secondary-text font-light">
                      Enter your Reference ID (e.g., SVET-2026-021) or your 12-digit Aadhaar Number, along with your Date of Birth to view your application status.
                    </p>

                    <div className="space-y-1.5">
                      <label className="text-[11px] text-secondary-text uppercase font-bold tracking-wider">
                        Reference ID or Aadhaar Number *
                      </label>
                      <input
                        type="text"
                        value={trackIdentifier}
                        onChange={(e) => setTrackIdentifier(e.target.value)}
                        placeholder="e.g. SVET-2026-021 or 12-digit Aadhaar"
                        className="w-full bg-white border border-border-color rounded-lg px-4 py-3 text-sm text-primary-text focus:outline-none focus:border-secondary-blue focus:ring-1 focus:ring-secondary-blue/30 h-12 transition-colors"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] text-secondary-text uppercase font-bold tracking-wider">
                        Date of Birth *
                      </label>
                      <input
                        type="date"
                        value={trackDob}
                        onChange={(e) => setTrackDob(e.target.value)}
                        className="w-full bg-white border border-border-color rounded-lg px-4 py-3 text-sm text-primary-text focus:outline-none focus:border-secondary-blue focus:ring-1 focus:ring-secondary-blue/30 h-12 transition-colors"
                        required
                      />
                    </div>

                    {trackError && (
                      <p className="text-xs text-red-500 font-semibold">{trackError}</p>
                    )}

                    <button
                      type="submit"
                      disabled={isTrackLoading}
                      className="w-full bg-secondary-blue text-white rounded-lg h-12 font-semibold text-sm hover:bg-secondary-blue/90 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isTrackLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin animate-spin-fast" />
                          <span>Searching...</span>
                        </>
                      ) : (
                        <span>Check Status</span>
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="space-y-6">
                    {/* Status Ribbon */}
                    <div className="text-center p-4 bg-primary-bg rounded-xl border border-border-color space-y-2">
                      <span className="text-xs text-secondary-text block">Current Application Status</span>
                      <div className="inline-flex">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                          trackedApplication.status === 'Accepted'
                            ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                            : trackedApplication.status === 'Rejected'
                              ? 'bg-red-500/10 text-red-600 border border-red-500/20'
                              : trackedApplication.status === 'Under Review'
                                ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                                : 'bg-blue-500/10 text-blue-600 border border-blue-500/20'
                        }`}>
                          {trackedApplication.status}
                        </span>
                      </div>
                      {trackedApplication.notes && (
                        <p className="text-xs text-secondary-text font-light italic mt-2">
                          Note: "{trackedApplication.notes}"
                        </p>
                      )}
                    </div>

                    {/* Candidate Details Summary */}
                    <div className="space-y-3">
                      <h4 className="text-[11px] text-secondary-text uppercase font-bold tracking-wider border-b border-border-color pb-1">
                        Application Summary
                      </h4>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs font-light">
                        <div className="col-span-2 sm:col-span-1">
                          <strong className="text-primary-blue font-medium">Reference ID:</strong>
                          <span className="ml-1 font-mono font-semibold">{trackedApplication.id}</span>
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                          <strong className="text-primary-blue font-medium">Applicant Name:</strong>
                          <span className="ml-1 font-semibold">{trackedApplication.personal.name}</span>
                        </div>
                        <div>
                          <strong className="text-primary-blue font-medium">DOB:</strong>
                          <span className="ml-1">{trackedApplication.personal.dob}</span>
                        </div>
                        <div>
                          <strong className="text-primary-blue font-medium">Aadhaar:</strong>
                          <span className="ml-1 font-mono">XXXX-XXXX-{trackedApplication.personal.aadhaar.slice(-4)}</span>
                        </div>
                        <div>
                          <strong className="text-primary-blue font-medium">Pref. Country:</strong>
                          <span className="ml-1 font-semibold">{trackedApplication.neet.interestedCountry}</span>
                        </div>
                        <div>
                          <strong className="text-primary-blue font-medium">NEET Score:</strong>
                          <span className="ml-1 font-semibold">{trackedApplication.neet.score} / 720</span>
                        </div>
                      </div>
                    </div>

                    {/* Download PDF button */}
                    <button
                      type="button"
                      onClick={handleDownloadTrackedPdf}
                      disabled={isTrackPdfGenerating}
                      className={`w-full gap-2 h-11 flex items-center justify-center rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                        isTrackPdfGenerating
                          ? 'border-emerald-200 text-emerald-400 bg-emerald-50/30 cursor-not-allowed'
                          : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50/50 bg-white'
                      }`}
                    >
                      {isTrackPdfGenerating ? (
                        <>
                          <svg className="w-4 h-4 animate-spin text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Generating PDF...</span>
                        </>
                      ) : (
                        <>
                          <FileDown className="w-4 h-4 text-emerald-600" />
                          <span>Download Application PDF</span>
                        </>
                      )}
                    </button>

                    {/* Action buttons */}
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setTrackedApplication(null);
                          setTrackError('');
                        }}
                        className="flex-1 bg-white border border-border-color text-secondary-text rounded-lg h-11 font-semibold text-xs hover:bg-primary-bg transition-colors cursor-pointer"
                      >
                        Back to Search
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsStatusModalOpen(false);
                          setTrackedApplication(null);
                          setTrackError('');
                        }}
                        className="flex-1 bg-primary-blue text-white rounded-lg h-11 font-semibold text-xs hover:bg-primary-blue/90 transition-colors cursor-pointer"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
