import React from 'react';
import { motion } from 'framer-motion';
import {
  Globe,
  GraduationCap,
  HeartHandshake,
  Stethoscope,
  Building,
  FileText,
  Plane,
  Compass
} from 'lucide-react';
import aboutImage from '../../assets/about_medical_students.png';

export default function AboutSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const stats = [
    {
      icon: <Globe className="w-6 h-6 text-[#3F72AF]" />,
      value: "10+ Countries",
      label: "Global Destinations"
    },
    {
      icon: <GraduationCap className="w-7 h-6 text-[#3F72AF]" />,
      value: "100% Admission Support",
      label: "Success & Enrollment Rate"
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-[#3F72AF]" />,
      value: "End-to-End Support",
      label: "Complete Admission Cycle"
    },
    {
      icon: <Stethoscope className="w-6 h-6 text-[#3F72AF]" />,
      value: "MBBS & BDS Programs",
      label: "Top Government Universities"
    }
  ];

  const features = [
    {
      icon: <Building className="w-5 h-5 text-[#3F72AF]" />,
      title: "University Selection",
      desc: "Tailored counseling to match you with NMC & WHO approved medical institutions matching your budget."
    },
    {
      icon: <FileText className="w-5 h-5 text-[#3F72AF]" />,
      title: "Documentation Support",
      desc: "Accurate translation, apostille, and verification services for transcripts and eligibility forms."
    },
    {
      icon: <Plane className="w-5 h-5 text-[#3F72AF]" />,
      title: "Visa Assistance",
      desc: "Comprehensive visa guidance, mock interviews, and submission support to ensure high approval rates."
    },
    {
      icon: <Compass className="w-5 h-5 text-[#3F72AF]" />,
      title: "Overseas Guidance",
      desc: "Pre-departure briefings, airport reception, and local hostel/campus onboarding support."
    }
  ];

  return (
    <section id="about" className="py-24 bg-[#F9F7F7] border-b border-[#DBE2EF] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 space-y-20">

        {/* ROW 1: Heading/Intro Text + Image (Two-Column Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3F72AF]/10 border border-[#3F72AF]/20 text-[#3F72AF] text-xs font-bold uppercase tracking-wider"
            >
              <span>About SVET</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#112D4E] leading-tight"
            >
              Your Trusted Partner for <br />
              <span className="text-[#3F72AF]">Global Medical Education</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-[#3F72AF]/90 font-light leading-relaxed max-w-2xl"
            >
              Sri Venkateshwara Educational Trust (SVET) is a premier overseas medical education advisory trust. We bridge the gap between aspiring students and world-class government medical universities offering internationally accredited MBBS and BDS degrees. Our vision is to ensure quality medical education is accessible, transparent, and seamless for every aspiring doctor.
            </motion.p>
          </div>

          {/* Right Image Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="lg:col-span-5 flex justify-center"
          >
            <div className="relative w-full max-w-md lg:max-w-full">
              <div className="absolute -inset-3 rounded-2xl border-2 border-dashed border-[#DBE2EF] -z-10 pointer-events-none" />
              <div className="relative rounded-2xl overflow-hidden border border-[#DBE2EF] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
                <img
                  src={aboutImage}
                  alt="Medical education global workspace and study advisory"
                  className="w-full h-auto object-cover object-center max-h-[380px]"
                />
              </div>
            </div>
          </motion.div>

        </div>

        {/* ROW 2: Statistics Cards (Full-Width 4-Column Grid) */}
        <div className="space-y-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="bg-white p-6 rounded-xl border border-[#DBE2EF] shadow-[0_4px_12px_rgba(0,0,0,0.01)] flex flex-col justify-between h-36 hover:border-[#3F72AF]/50 transition-colors"
              >
                <div className="p-2 w-fit bg-[#DBE2EF]/30 rounded-lg">
                  {stat.icon}
                </div>
                <div className="space-y-1">
                  <h4 className="font-display font-bold text-lg text-[#112D4E]">{stat.value}</h4>
                  <p className="text-xs text-[#3F72AF]/85 font-light">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* ROW 3: Why Choose SVET (Full-Width Centered Header + 4-Column Grid) */}
        <div className="space-y-12 pt-4">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs uppercase tracking-widest text-[#3F72AF] font-bold">SVET Advantages</span>
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display font-extrabold text-2xl sm:text-3xl text-[#112D4E]"
            >
              Why Choose SVET
            </motion.h3>
            <p className="text-sm text-[#3F72AF]/90 font-light leading-relaxed">
              We guide students and parents through every milestone of international medical admissions with absolute integrity and care.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="flex flex-col gap-4 p-6 rounded-xl bg-white border border-[#DBE2EF] hover:border-[#3F72AF]/50 transition-colors shadow-[0_4px_12px_rgba(0,0,0,0.01)]"
              >
                <div className="p-2 w-fit bg-[#DBE2EF]/30 rounded-lg shrink-0">
                  {feature.icon}
                </div>
                <div className="space-y-2">
                  <h4 className="font-display font-bold text-base text-[#112D4E]">{feature.title}</h4>
                  <p className="text-xs sm:text-[13px] text-[#3F72AF]/95 leading-relaxed font-light">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
}
