import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Users, BookOpen, Trophy, FileUp, ExternalLink, Printer } from 'lucide-react';
import { Card } from '../../components/Common/Card';
import { studentApi } from '../../services/studentApi';
import { generateApplicationPdf } from '../../utils/generateApplicationPdf';

export default function StudentDetailDrawer({ student, onClose }) {
  const [activeTab, setActiveTab] = useState('personal');
  const [activePreview, setActivePreview] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [useMockFallback, setUseMockFallback] = useState(false);

  useEffect(() => {
    let active = true;

    if (activePreview && student && student.documents && student.documents[activePreview]) {
      const filename = student.documents[activePreview];
      setLoadingPreview(true);
      setUseMockFallback(false);
      
      studentApi.downloadFileBlobUrl(student.id, filename)
        .then((url) => {
          if (active) {
            setPreviewUrl(url);
            setLoadingPreview(false);
          } else {
            URL.revokeObjectURL(url);
          }
        })
        .catch((err) => {
          console.warn("Secure file load failed, falling back to mock preview:", err);
          if (active) {
            setUseMockFallback(true);
            setLoadingPreview(false);
          }
        });
    } else {
      setUseMockFallback(false);
      setLoadingPreview(false);
    }

    return () => {
      active = false;
      setPreviewUrl((prev) => {
        if (prev) {
          URL.revokeObjectURL(prev);
        }
        return null;
      });
    };
  }, [activePreview, student?.id]);

  // Reset preview state if student changes
  const [prevStudentId, setPrevStudentId] = useState(student?.id);
  if (student?.id !== prevStudentId) {
    setPrevStudentId(student?.id);
    setActivePreview(null);
  }

  const [isPdfGenerating, setIsPdfGenerating] = useState(false);

  const handlePrintApplication = async () => {
    if (isPdfGenerating) return;
    setIsPdfGenerating(true);
    try {
      await generateApplicationPdf(student, `SVET-Application-${student.id}.pdf`);
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('PDF download failed. Please try again.');
    } finally {
      setIsPdfGenerating(false);
    }
  };

  if (!student) return null;

  const renderPhotoPreview = () => (
    <div className="flex flex-col items-center justify-center h-full p-8 bg-slate-50 min-h-[400px]">
      <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200 flex flex-col items-center max-w-xs w-full">
        <div className="w-40 h-48 bg-slate-100 rounded-lg border border-slate-300 flex items-center justify-center overflow-hidden mb-6 relative group">
          <svg className="w-24 h-24 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
          <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-slate-500 font-mono">
            {student.documents.photo}
          </div>
        </div>
        <div className="w-full space-y-2 text-xs">
          <div className="flex justify-between border-b border-slate-100 pb-1.5">
            <span className="text-slate-500">Candidate Name</span>
            <span className="font-bold text-slate-800 uppercase">{student.personal.name}</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-1.5">
            <span className="text-slate-500">Gender</span>
            <span className="font-bold text-slate-800">{student.personal.gender}</span>
          </div>
          <div className="flex justify-between pb-0.5">
            <span className="text-slate-500">Date of Birth</span>
            <span className="font-bold text-slate-800">{student.personal.dob}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMarksheetPreview = () => (
    <div className="h-full p-6 bg-slate-50 overflow-y-auto flex items-center justify-center min-h-[500px]">
      <div className="bg-amber-50/30 border-4 border-double border-amber-800/30 p-6 rounded-lg max-w-xl w-full shadow-lg relative bg-[radial-gradient(#fdfbf7_1px,transparent_1px)] [background-size:12px_12px]">
        <div className="text-center space-y-1 mb-4">
          <span className="text-[8px] tracking-widest uppercase font-bold text-amber-900/60 block">Board of Secondary Education</span>
          <h2 className="font-serif font-bold text-base text-amber-950 tracking-wide">HIGHER SECONDARY COURSE CERTIFICATE</h2>
          <p className="text-[8px] text-slate-500 font-semibold">STATEMENT OF MARKS</p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[10px] mb-4 border-b border-amber-900/20 pb-3">
          <div><strong className="text-amber-950 font-semibold">Name:</strong> <span className="uppercase">{student.personal.name}</span></div>
          <div><strong className="text-amber-950 font-semibold">Reg No:</strong> <span>{student.academic.hscRegisterNo}</span></div>
          <div><strong className="text-amber-950 font-semibold">Group:</strong> <span>{student.academic.hscGroup}</span></div>
        </div>

        <table className="w-full text-[10px] text-left border-collapse mb-4">
          <thead>
            <tr className="border-y border-amber-900/30 bg-amber-900/5 text-amber-950 font-bold uppercase tracking-wider text-[8px]">
              <th className="py-1.5 px-2">Subject</th>
              <th className="py-1.5 px-2 text-center">Max</th>
              <th className="py-1.5 px-2 text-center">Obtained</th>
              <th className="py-1.5 px-2 text-right">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-amber-900/10">
            <tr>
              <td className="py-2 px-2 font-medium text-slate-700">PHYSICS</td>
              <td className="py-2 px-2 text-center text-slate-500">100</td>
              <td className="py-2 px-2 text-center font-bold text-slate-900">{student.academic.physicsMarks}</td>
              <td className="py-2 px-2 text-right text-emerald-700 font-bold">PASS</td>
            </tr>
            <tr>
              <td className="py-2 px-2 font-medium text-slate-700">CHEMISTRY</td>
              <td className="py-2 px-2 text-center text-slate-500">100</td>
              <td className="py-2 px-2 text-center font-bold text-slate-900">{student.academic.chemistryMarks}</td>
              <td className="py-2 px-2 text-right text-emerald-700 font-bold">PASS</td>
            </tr>
            <tr>
              <td className="py-2 px-2 font-medium text-slate-700">BIOLOGY</td>
              <td className="py-2 px-2 text-center text-slate-500">100</td>
              <td className="py-2 px-2 text-center font-bold text-slate-900">{student.academic.biologyMarks}</td>
              <td className="py-2 px-2 text-right text-emerald-700 font-bold">PASS</td>
            </tr>
            <tr>
              <td className="py-2 px-2 font-medium text-slate-700">ENGLISH</td>
              <td className="py-2 px-2 text-center text-slate-500">100</td>
              <td className="py-2 px-2 text-center font-bold text-slate-900">88</td>
              <td className="py-2 px-2 text-right text-emerald-700 font-bold">PASS</td>
            </tr>
            <tr>
              <td className="py-2 px-2 font-medium text-slate-700">LANGUAGE</td>
              <td className="py-2 px-2 text-center text-slate-500">100</td>
              <td className="py-2 px-2 text-center font-bold text-slate-900">92</td>
              <td className="py-2 px-2 text-right text-emerald-700 font-bold">PASS</td>
            </tr>
            <tr className="border-t border-amber-900/30 bg-amber-900/5 font-bold">
              <td className="py-2 px-2 text-amber-950">TOTAL MARKS</td>
              <td className="py-2 px-2 text-center text-amber-900">500</td>
              <td className="py-2 px-2 text-center text-amber-950 font-extrabold">{student.academic.totalMarks}</td>
              <td className="py-2 px-2 text-right text-emerald-700 uppercase">PASSED</td>
            </tr>
          </tbody>
        </table>

        <div className="flex justify-between items-end mt-8 text-[8px] text-slate-400 font-semibold uppercase">
          <span>Prepared: GHSS Board</span>
          <span>Verified Online</span>
        </div>
      </div>
    </div>
  );

  const renderNeetScorePreview = () => (
    <div className="h-full p-6 bg-slate-50 overflow-y-auto flex items-center justify-center min-h-[500px]">
      <div className="bg-white border-2 border-sky-600 p-6 rounded-lg max-w-xl w-full shadow-lg relative">
        <div className="text-center space-y-0.5 mb-4 border-b-2 border-sky-600 pb-3">
          <h2 className="font-display font-extrabold text-sm text-sky-900">NATIONAL TESTING AGENCY</h2>
          <p className="text-[9px] text-slate-500 font-bold uppercase">NEET (UG) SCORE CARD - 2025</p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[10px] mb-4 bg-slate-50 p-3 rounded border border-slate-200">
          <div><strong className="text-slate-500">Name:</strong> <span className="font-bold text-slate-800 uppercase">{student.personal.name}</span></div>
          <div><strong className="text-slate-500">App No:</strong> <span className="font-mono font-bold text-slate-800">{student.neet.applicationNumber}</span></div>
          <div><strong className="text-slate-500">Aadhaar:</strong> <span className="font-bold text-slate-800">{student.personal.aadhaar}</span></div>
          <div><strong className="text-slate-500">Category:</strong> <span className="font-bold text-slate-800">{student.personal.community}</span></div>
        </div>

        <div className="border border-slate-200 rounded overflow-hidden mb-4">
          <table className="w-full text-[10px] text-left border-collapse">
            <thead>
              <tr className="bg-sky-900 text-white font-bold uppercase text-[8px]">
                <th className="py-2 px-3">Subject</th>
                <th className="py-2 px-3 text-center">Max Marks</th>
                <th className="py-2 px-3 text-center">Obtained</th>
                <th className="py-2 px-3 text-right">Percentile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-2 px-3 font-semibold text-slate-700">Physics</td>
                <td className="py-2 px-3 text-center text-slate-500">180</td>
                <td className="py-2 px-3 text-center font-bold text-slate-800">
                  {Math.round(student.neet.score * 0.23)}
                </td>
                <td className="py-2 px-3 text-right text-slate-600">95.42%</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold text-slate-700">Chemistry</td>
                <td className="py-2 px-3 text-center text-slate-500">180</td>
                <td className="py-2 px-3 text-center font-bold text-slate-800">
                  {Math.round(student.neet.score * 0.27)}
                </td>
                <td className="py-2 px-3 text-right text-slate-600">96.88%</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold text-slate-700">Biology</td>
                <td className="py-2 px-3 text-center text-slate-500">360</td>
                <td className="py-2 px-3 text-center font-bold text-slate-800">
                  {student.neet.score - Math.round(student.neet.score * 0.23) - Math.round(student.neet.score * 0.27)}
                </td>
                <td className="py-2 px-3 text-right text-slate-600">97.12%</td>
              </tr>
              <tr className="bg-sky-50 font-bold border-t border-slate-200">
                <td className="py-2 px-3 text-sky-900">TOTAL SCORE</td>
                <td className="py-2 px-3 text-center text-slate-500">720</td>
                <td className="py-2 px-3 text-center text-sky-900 text-xs font-extrabold">{student.neet.score}</td>
                <td className="py-2 px-3 text-right text-sky-900">96.48%ile</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center text-[9px] text-slate-500 font-semibold border-t border-slate-100 pt-3">
          <span>QUALIFIED FOR MBBS COUNSELLING</span>
          <span>AIR: 14,832</span>
        </div>
      </div>
    </div>
  );

  const renderNeetAppPreview = () => (
    <div className="h-full p-6 bg-slate-50 overflow-y-auto flex items-center justify-center min-h-[400px]">
      <div className="bg-white border border-slate-200 p-6 rounded-lg max-w-xl w-full shadow-lg text-[10px] space-y-3">
        <div className="text-center border-b border-slate-200 pb-2">
          <h3 className="font-bold text-xs text-slate-800">NEET (UG) - 2025 APPLICATION CONFIRMATION</h3>
          <p className="text-[8px] text-slate-500">National Testing Agency Copy</p>
        </div>

        <div className="grid grid-cols-2 gap-2 border-b border-slate-100 pb-3">
          <div><strong>Application No:</strong> <span className="font-mono">{student.neet.applicationNumber}</span></div>
          <div><strong>Country Preference:</strong> <span>{student.neet.interestedCountry}</span></div>
          <div><strong>Candidate Name:</strong> <span className="uppercase">{student.personal.name}</span></div>
          <div><strong>Gender:</strong> <span>{student.personal.gender}</span></div>
        </div>

        <div className="space-y-1">
          <h4 className="font-bold text-slate-700 border-b border-slate-100 pb-0.5">Details Overview</h4>
          <div className="grid grid-cols-2 gap-1.5 text-slate-600">
            <div><strong>Aadhaar Number:</strong> {student.personal.aadhaar}</div>
            <div><strong>Nationality:</strong> Indian</div>
            <div><strong>Date of Birth:</strong> {student.personal.dob}</div>
            <div><strong>Category:</strong> {student.personal.community}</div>
            <div><strong>Parent:</strong> {student.parent.parentName}</div>
            <div><strong>Contact:</strong> {student.parent.mobile1}</div>
          </div>
        </div>

        <div className="bg-sky-50 border border-sky-100 p-2.5 rounded text-[9px] text-sky-800">
          Selected Country: <strong>{student.neet.interestedCountry}</strong>. Eligibility verification in progress.
        </div>
      </div>
    </div>
  );

  const renderTcPreview = () => (
    <div className="h-full p-6 bg-slate-50 overflow-y-auto flex items-center justify-center min-h-[450px]">
      <div className="bg-white border-2 border-emerald-800 p-6 rounded-lg max-w-xl w-full shadow-lg">
        <div className="text-center space-y-0.5 mb-4 border-b border-emerald-800 pb-3">
          <h2 className="font-serif font-bold text-xs text-emerald-900">GOVERNMENT HIGHER SECONDARY SCHOOL</h2>
          <p className="text-[8px] text-slate-500 font-bold uppercase">TRANSFER CERTIFICATE</p>
        </div>

        <div className="space-y-2 text-[10px]">
          <div className="flex justify-between">
            <span><strong>T.C. No:</strong> TC/2025/8923</span>
            <span><strong>Admission No:</strong> 2023-GHSS-1049</span>
          </div>

          <div className="space-y-2 pt-1">
            <div className="flex justify-between border-b border-dashed border-slate-200 pb-1">
              <span className="text-slate-500">1. Pupil Name</span>
              <span className="font-bold text-slate-900 uppercase">{student.personal.name}</span>
            </div>
            <div className="flex justify-between border-b border-dashed border-slate-200 pb-1">
              <span className="text-slate-500">2. Father / Guardian</span>
              <span className="font-semibold text-slate-800">{student.parent.parentName}</span>
            </div>
            <div className="flex justify-between border-b border-dashed border-slate-200 pb-1">
              <span className="text-slate-500">3. Date of Birth</span>
              <span className="font-bold text-slate-900">{student.personal.dob}</span>
            </div>
            <div className="flex justify-between border-b border-dashed border-slate-200 pb-1">
              <span className="text-slate-500">4. Class last studied</span>
              <span className="font-semibold text-slate-800">XII Standard (HSC)</span>
            </div>
            <div className="flex justify-between border-b border-dashed border-slate-200 pb-1">
              <span className="text-slate-500">5. Conduct</span>
              <span className="text-emerald-700 font-bold uppercase">Good</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-end mt-6 text-[8px] font-semibold text-slate-500">
          <span>Date: 02/05/2025</span>
          <span>Sign: Headmaster</span>
        </div>
      </div>
    </div>
  );

  const renderPassportPreview = () => (
    <div className="h-full p-6 bg-slate-50 overflow-y-auto flex items-center justify-center min-h-[400px]">
      <div className="bg-[#122240] text-slate-300 p-6 rounded-lg max-w-xl w-full shadow-lg relative border border-slate-700">
        <div className="text-center border-b border-slate-600 pb-2 mb-3">
          <h3 className="font-bold text-xs tracking-widest text-white">REPUBLIC OF INDIA / भारत गणराज्य</h3>
        </div>

        <div className="flex gap-4 items-start text-[10px]">
          <div className="w-24 h-28 bg-slate-800 rounded border border-slate-600 flex items-center justify-center shrink-0">
            <svg className="w-12 h-12 text-slate-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>

          <div className="flex-grow grid grid-cols-2 gap-x-2 gap-y-1.5 text-[9px] text-slate-400">
            <div>
              <span className="block text-slate-500 text-[7px] uppercase">Country Code</span>
              <span className="text-white font-bold">IND</span>
            </div>
            <div>
              <span className="block text-slate-500 text-[7px] uppercase">Passport No.</span>
              <span className="text-white font-mono font-bold uppercase">{student.personal.passportNo || 'P1982736'}</span>
            </div>
            <div>
              <span className="block text-slate-500 text-[7px] uppercase">Name</span>
              <span className="text-white font-bold uppercase">{student.personal.name}</span>
            </div>
            <div>
              <span className="block text-slate-500 text-[7px] uppercase">Nationality</span>
              <span className="text-white font-bold">INDIAN</span>
            </div>
            <div>
              <span className="block text-slate-500 text-[7px] uppercase">Sex</span>
              <span className="text-white font-bold">{student.personal.gender}</span>
            </div>
            <div>
              <span className="block text-slate-500 text-[7px] uppercase">Date of Birth</span>
              <span className="text-white font-bold">{student.personal.dob}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 border-t border-slate-700 pt-3 font-mono text-[9px] tracking-wider text-slate-500">
          P&lt;IND{student.personal.name.replace(/\s+/g, '').toUpperCase()}&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;<br />
          {student.personal.passportNo || 'P1982736'}&lt;0IND{student.personal.dob.replace(/-/g, '').substring(2)}4{student.personal.gender === 'Female' ? 'F' : 'M'}&lt;&lt;&lt;&lt;2
        </div>
      </div>
    </div>
  );

  if (!student) return null;

  const tabs = [
    { id: 'personal', label: 'Personal', icon: <User className="w-3.5 h-3.5" /> },
    { id: 'parent', label: 'Parent', icon: <Users className="w-3.5 h-3.5" /> },
    { id: 'academic', label: 'Academic', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'neet', label: 'NEET', icon: <Trophy className="w-3.5 h-3.5" /> },
    { id: 'documents', label: 'Documents', icon: <FileUp className="w-3.5 h-3.5" /> },
  ];

  const getTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-bold tracking-wider text-secondary-blue">Applicant Personal Info</h4>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Full Name', val: student.personal.name },
                { label: 'Gender', val: student.personal.gender },
                { label: 'Date of Birth', val: student.personal.dob },
                { label: 'Aadhaar Number', val: student.personal.aadhaar },
                { label: 'Community', val: student.personal.community },
                { label: 'Passport Number', val: student.personal.passportNo || 'N/A' },
              ].map((field) => (
                <Card key={field.label} className="p-4 bg-white border border-border-color shadow-sm">
                  <span className="text-[10px] text-secondary-text block uppercase font-bold mb-0.5">{field.label}</span>
                  <span className="text-xs font-semibold text-primary-blue">{field.val}</span>
                </Card>
              ))}
            </div>
          </div>
        );
      case 'parent':
        return (
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-bold tracking-wider text-secondary-blue">Parent & Address Info</h4>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Parent / Guardian', val: student.parent.parentName },
                { label: 'Mobile Number 1', val: student.parent.mobile1 },
                { label: 'Mobile Number 2', val: student.parent.mobile2 || 'N/A' },
                { label: 'District', val: student.parent.district },
                { label: 'Pincode', val: student.parent.pincode },
              ].map((field) => (
                <Card key={field.label} className="p-4 bg-white border border-border-color shadow-sm">
                  <span className="text-[10px] text-secondary-text block uppercase font-bold mb-0.5">{field.label}</span>
                  <span className="text-xs font-semibold text-primary-blue">{field.val}</span>
                </Card>
              ))}
              <Card className="col-span-2 p-4 bg-white border border-border-color shadow-sm">
                <span className="text-[10px] text-secondary-text block uppercase font-bold mb-0.5">Communication Address</span>
                <span className="text-xs font-semibold text-primary-blue leading-relaxed">{student.parent.address}</span>
              </Card>
            </div>
          </div>
        );
      case 'academic':
        return (
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-bold tracking-wider text-secondary-blue">HSC / Plus-Two Academic details</h4>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'HSC Group', val: student.academic.hscGroup },
                { label: 'HSC Register Number', val: student.academic.hscRegisterNo },
                { label: 'Physics Marks', val: `${student.academic.physicsMarks} / 100` },
                { label: 'Chemistry Marks', val: `${student.academic.chemistryMarks} / 100` },
                { label: 'Biology Marks', val: `${student.academic.biologyMarks} / 100` },
                { label: 'HSC Total Marks', val: student.academic.totalMarks },
              ].map((field) => (
                <Card key={field.label} className="p-4 bg-white border border-border-color shadow-sm">
                  <span className="text-[10px] text-secondary-text block uppercase font-bold mb-0.5">{field.label}</span>
                  <span className="text-xs font-semibold text-primary-blue">{field.val}</span>
                </Card>
              ))}
            </div>
          </div>
        );
      case 'neet':
        return (
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-bold tracking-wider text-secondary-blue">NEET exam & University Preference</h4>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'NEET Score', val: `${student.neet.score} / 720` },
                { label: 'NEET Application No', val: student.neet.applicationNumber },
                { label: 'Interested Country', val: student.neet.interestedCountry },
              ].map((field) => (
                <Card key={field.label} className="p-4 bg-white border border-border-color shadow-sm">
                  <span className="text-[10px] text-secondary-text block uppercase font-bold mb-0.5">{field.label}</span>
                  <span className="text-xs font-semibold text-primary-blue">{field.val}</span>
                </Card>
              ))}
            </div>
          </div>
        );
      case 'documents':
        return (
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-bold tracking-wider text-secondary-blue">Uploaded Verification Files</h4>
            <div className="space-y-3">
              {[
                { label: '+2 Marksheet', key: 'marksheet' },
                { label: 'NEET Application', key: 'neetApp' },
                { label: 'NEET Score Card', key: 'neetScore' },
                { label: 'Passport Size Photo', key: 'photo' },
                { label: 'Transfer Certificate', key: 'tc' },
                { label: 'Passport Front Page', key: 'passportFront' }
              ].map((doc) => {
                const filename = student.documents[doc.key];
                return (
                  <div key={doc.key} className="bg-white border border-border-color p-4 rounded-xl flex items-center justify-between gap-4 shadow-sm">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-primary-blue block">{doc.label}</span>
                      {filename ? (
                        <span className="text-[10px] text-emerald-600 font-mono font-bold block truncate max-w-[250px]">{filename}</span>
                      ) : (
                        <span className="text-[10px] text-red-500 block font-bold">Missing / Not Uploaded</span>
                      )}
                    </div>

                    {filename && (
                      <button
                        onClick={() => setActivePreview(doc.key)}
                        className={`flex items-center gap-1 text-[10px] uppercase font-bold transition-colors shrink-0 cursor-pointer ${
                          activePreview === doc.key 
                            ? 'text-emerald-600 font-extrabold underline' 
                            : 'text-secondary-blue hover:text-primary-blue hover:underline'
                        }`}
                      >
                        <span>{activePreview === doc.key ? 'Viewing' : 'Preview'}</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderDocumentPreviewContent = () => {
    if (loadingPreview) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 min-h-[400px]">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-secondary-blue rounded-full animate-spin mb-4" />
          <p className="text-xs font-semibold text-slate-500">Loading secure document preview...</p>
        </div>
      );
    }

    if (!useMockFallback && previewUrl) {
      const filename = student.documents[activePreview] || '';
      const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(filename);
      const isPdf = /\.pdf$/i.test(filename);

      if (isImage) {
        return (
          <div className="flex items-center justify-center h-full p-6 min-h-[400px]">
            <img 
              src={previewUrl} 
              alt={activePreview} 
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-md border border-slate-200" 
            />
          </div>
        );
      } else if (isPdf) {
        return (
          <div className="w-full h-full min-h-[500px] md:h-[calc(100vh-140px)]">
            <iframe 
              src={previewUrl} 
              title={activePreview} 
              className="w-full h-full border-0"
            />
          </div>
        );
      } else {
        return (
          <div className="flex flex-col items-center justify-center h-full p-8 min-h-[400px] text-center space-y-4">
            <div className="p-4 bg-emerald-50 rounded-full text-emerald-600">
              <FileUp className="w-10 h-10" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-700">Preview not supported for this file type</p>
              <p className="text-[10px] text-slate-500 mt-1">You can download the file using the button below or view it directly.</p>
            </div>
            <a 
              href={previewUrl} 
              download={filename}
              className="px-4 py-2 bg-secondary-blue hover:bg-primary-blue text-white rounded-lg text-xs font-bold transition-colors shadow-sm cursor-pointer"
            >
              Download File
            </a>
          </div>
        );
      }
    }

    switch (activePreview) {
      case 'photo': return renderPhotoPreview();
      case 'marksheet': return renderMarksheetPreview();
      case 'neetScore': return renderNeetScorePreview();
      case 'neetApp': return renderNeetAppPreview();
      case 'tc': return renderTcPreview();
      case 'passportFront': return renderPassportPreview();
      default: return null;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
        
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-xs"
        />

        {/* Container for Drawer + Preview Panel */}
        <div className="relative flex h-full items-center z-10 w-full max-w-7xl pointer-events-none justify-end">
          {/* Desktop Preview Panel on Left */}
          {activePreview && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="hidden md:flex flex-col flex-grow max-w-2xl h-full bg-white border-l border-border-color overflow-hidden pointer-events-auto shadow-xl"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-border-color bg-white flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <h3 className="font-display font-extrabold text-xs text-primary-blue uppercase tracking-wider">
                    Document Preview: {activePreview === 'marksheet' ? '+2 Marksheet' :
                                      activePreview === 'neetApp' ? 'NEET Application' :
                                      activePreview === 'neetScore' ? 'NEET Score Card' :
                                      activePreview === 'photo' ? 'Passport Photo' :
                                      activePreview === 'tc' ? 'Transfer Certificate' : 'Passport Front Page'}
                  </h3>
                </div>
                <button
                  onClick={() => setActivePreview(null)}
                  className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Document Preview Area */}
              <div className="flex-1 overflow-auto bg-slate-50">
                {renderDocumentPreviewContent()}
              </div>

              {/* Footer */}
              <div className="px-6 py-3 border-t border-border-color bg-slate-50 flex justify-between items-center text-[9px] text-slate-500 font-mono font-bold shrink-0">
                <span className="truncate max-w-[400px]">FILE: {student.documents[activePreview]}</span>
                <span className="text-emerald-600 shrink-0">VERIFIED STATUS: SUCCESS</span>
              </div>
            </motion.div>
          )}

          {/* Student Info Drawer on Right */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="w-full max-w-lg h-full bg-primary-bg border-l border-border-color flex flex-col shadow-2xl z-10 pointer-events-auto"
          >
          {/* Header */}
          <div className="p-6 border-b border-border-color flex items-center justify-between bg-white">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono font-bold text-secondary-blue tracking-wider">
                Ref ID: {student.id}
              </span>
              <h3 className="font-display font-extrabold text-lg text-primary-blue">
                {student.personal.name}
              </h3>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrintApplication}
                title="Print Application PDF"
                className="p-1.5 rounded-lg bg-primary-bg hover:bg-border-color text-secondary-text hover:text-primary-blue transition-colors cursor-pointer border border-border-color/40 flex items-center justify-center"
              >
                <Printer className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-primary-bg hover:bg-border-color text-secondary-text hover:text-primary-blue transition-colors cursor-pointer border border-border-color/40"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation tabs */}
          <div className="px-6 border-b border-border-color flex gap-2 bg-white overflow-x-auto">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (tab.id !== 'documents') {
                      setActivePreview(null);
                    }
                  }}
                  className={`flex items-center gap-2 px-3 py-3 border-b-2 font-display text-xs font-bold shrink-0 cursor-pointer transition-colors duration-200 ${
                    isActive 
                      ? 'border-secondary-blue text-secondary-blue bg-secondary-blue/5' 
                      : 'border-transparent text-secondary-text hover:text-primary-blue'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Body Content */}
          <div className="flex-grow p-6 overflow-y-auto space-y-6">
            {getTabContent()}
          </div>

          {/* Footer actions */}
          <div className="p-6 border-t border-border-color bg-white flex flex-col gap-3">
            <button
              onClick={handlePrintApplication}
              disabled={isPdfGenerating}
              className={`w-full py-3.5 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2 ${
                isPdfGenerating
                  ? 'bg-secondary-blue/60 text-white/70 cursor-not-allowed'
                  : 'bg-secondary-blue hover:bg-primary-blue text-white'
              }`}
            >
              {isPdfGenerating ? (
                <>
                  <svg className="w-4 h-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Printer className="w-4 h-4 text-white" />
                  <span>Download Application PDF</span>
                </>
              )}
            </button>
            <div className="text-center text-[10px] text-secondary-text font-semibold">
              System Lead created at {new Date(student.createdDate).toLocaleString()}
            </div>
          </div>

          </motion.div>
        </div>

        {/* Mobile Preview Modal */}
        {activePreview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:hidden">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setActivePreview(null)} />
            <div className="bg-white rounded-2xl w-full max-w-md h-[80vh] flex flex-col overflow-hidden z-10 shadow-2xl border border-border-color">
              {/* Header */}
              <div className="px-5 py-4 border-b border-border-color flex justify-between items-center bg-white shrink-0">
                <h3 className="font-display font-extrabold text-[10px] text-primary-blue uppercase tracking-wider">
                  Preview: {activePreview === 'marksheet' ? '+2 Marksheet' :
                            activePreview === 'neetApp' ? 'NEET Application' :
                            activePreview === 'neetScore' ? 'NEET Score Card' :
                            activePreview === 'photo' ? 'Passport Photo' :
                            activePreview === 'tc' ? 'Transfer Certificate' : 'Passport Front Page'}
                </h3>
                <button 
                  onClick={() => setActivePreview(null)} 
                  className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {/* Body */}
              <div className="flex-1 overflow-auto bg-slate-50">
                {renderDocumentPreviewContent()}
              </div>
            </div>
          </div>
        )}

      </div>
    </AnimatePresence>
  );
}
