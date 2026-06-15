import React from 'react';
import { motion } from 'framer-motion';
import { 
  UserPlus, 
  FileText, 
  Compass, 
  CheckCircle, 
  FileSpreadsheet, 
  PlaneTakeoff 
} from 'lucide-react';
import { Card } from '../Common/Card';

export default function JourneyTimeline() {
  const steps = [
    {
      title: 'Register Profile',
      desc: 'Submit your basic profile and NEET details on our secure portal to speak to a Senior Admission Advisor.',
      icon: <UserPlus className="w-5 h-5 text-secondary-blue" />
    },
    {
      title: 'Upload Documents',
      desc: 'Upload copies of your 10th & 12th marksheets, NEET score card, and passport. Our team verifies eligibility.',
      icon: <FileText className="w-5 h-5 text-secondary-blue" />
    },
    {
      title: 'Academic Counselling',
      desc: 'Get personalized counselling to select the best medical college fitting your budget, preferred country, and clinical training.',
      icon: <Compass className="w-5 h-5 text-secondary-blue" />
    },
    {
      title: 'Admission Offer',
      desc: 'We secure your provisional and official Admission Offer Letters directly from the chosen government medical university.',
      icon: <CheckCircle className="w-5 h-5 text-secondary-blue" />
    },
    {
      title: 'Visa & Loan Support',
      desc: 'Get full visa assistance, including embassy interview preparation, document legalization, and bank loan documentation.',
      icon: <FileSpreadsheet className="w-5 h-5 text-secondary-blue" />
    },
    {
      title: 'Fly Abroad',
      desc: 'Attend pre-departure briefings. We coordinate group travel, airport pickup, university registration, and hostel settlement.',
      icon: <PlaneTakeoff className="w-5 h-5 text-secondary-blue" />
    }
  ];

  return (
    <section id="journey" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-widest text-secondary-blue font-bold">Your Admission Roadmap</span>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-primary-blue">
            6 Steps to Your Medical Career
          </h2>
          <p className="text-sm text-secondary-text font-light">
            We handle the complexities of overseas university admissions, legal compliance, and travel planning, making your journey seamless.
          </p>
        </div>

        {/* Timeline Path */}
        <div className="relative max-w-3xl mx-auto">
          {/* Vertical Line */}
          <div className="absolute left-4 md:left-1/2 top-2 bottom-2 w-0.5 bg-border-color -translate-x-1/2" />

          {/* Steps */}
          <div className="space-y-10">
            {steps.map((step, index) => {
              const isEven = index % 2 === 0;
              const stepNum = String(index + 1).padStart(2, '0');
              
              return (
                <div key={index} className="flex flex-col md:flex-row items-start md:items-center relative">
                  
                  {/* Icon Circle */}
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white border-2 border-secondary-blue flex items-center justify-center z-10 shadow-sm">
                    {step.icon}
                  </div>

                  {/* Content card left/right */}
                  <div className={`w-full pl-12 md:pl-0 md:w-1/2 flex ${isEven ? 'md:justify-end md:pr-10' : 'md:justify-start md:pl-10 md:order-2'}`}>
                    <motion.div
                      initial={{ opacity: 0, x: isEven ? -20 : 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-100px' }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="w-full max-w-md"
                    >
                      <Card className="bg-white border border-border-color p-5 hover:border-secondary-blue/40">
                        <div className="flex justify-between items-start gap-4 mb-2">
                          <h4 className="font-display font-bold text-base text-primary-blue leading-tight">
                            {step.title}
                          </h4>
                          <span className="text-sm font-display font-black text-secondary-blue/30 tracking-wider">
                            {stepNum}
                          </span>
                        </div>
                        <p className="text-xs text-secondary-text font-light leading-relaxed">
                          {step.desc}
                        </p>
                      </Card>
                    </motion.div>
                  </div>

                  {/* Spacer for other side in md layout */}
                  <div className="hidden md:block w-1/2" />
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
