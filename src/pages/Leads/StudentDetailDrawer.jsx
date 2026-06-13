import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Users, BookOpen, Trophy, FileUp, ExternalLink } from 'lucide-react';
import { Card } from '../../components/Common/Card';

export default function StudentDetailDrawer({ student, onClose }) {
  const [activeTab, setActiveTab] = useState('personal');

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
                        onClick={() => alert(`Simulated document preview for file: ${filename}`)}
                        className="flex items-center gap-1 text-[10px] uppercase font-bold text-secondary-blue hover:text-primary-blue hover:underline transition-colors shrink-0 cursor-pointer"
                      >
                        <span>Preview</span>
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

        {/* Drawer slide-out panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="relative w-full max-w-lg h-full bg-primary-bg border-l border-border-color flex flex-col shadow-2xl z-10"
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
            
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-primary-bg hover:bg-border-color text-secondary-text hover:text-primary-blue transition-colors cursor-pointer border border-border-color/40"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation tabs */}
          <div className="px-6 border-b border-border-color flex gap-2 bg-white overflow-x-auto">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
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
          <div className="p-6 border-t border-border-color bg-white text-center text-[10px] text-secondary-text font-semibold">
            System Lead created at {new Date(student.createdDate).toLocaleString()}
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
