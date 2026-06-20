import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Globe, GraduationCap } from 'lucide-react';
import { Button } from '../../components/Common/Button';
import Navbar from '../../components/Navbar/Navbar';
import AboutSection from '../../components/About/AboutSection';
import StatCounter from '../../components/Stats/StatCounter';
import HomepageGallery from '../../components/Gallery/HomepageGallery';
import CountryGrid from '../../components/Countries/CountryCard';
import FeaturesGrid from '../../components/WhyChoose/FeaturesGrid';
import JourneyTimeline from '../../components/StudentJourney/JourneyTimeline';
import ContactSection from '../../components/Contact/ContactSection';
import Footer from '../../components/Footer/Footer';

export default function HomePage() {
  const handleScrollToCountries = () => {
    const element = document.querySelector('#countries');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="home" className="min-h-screen bg-primary-bg text-primary-text relative">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-[#112D4E]">

        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Lighter Video Overlay (25%-40% opacity) */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background: 'linear-gradient(180deg, rgba(17, 45, 78, 0) 0%, rgba(17, 45, 78, 0.13) 50%, rgba(17, 45, 78, 0) 100%)'
          }}
        />

        {/* Content Container */}
        <div className="relative z-20 max-w-4xl mx-auto px-6 text-center flex flex-col items-center justify-center h-full space-y-6 sm:space-y-8 pt-12">

          {/* Top Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#112D4E]/40 border border-[#DBE2EF]/20 text-[#DBE2EF] text-xs sm:text-sm font-bold uppercase tracking-wider"
          >
            <GraduationCap className="w-4 h-4 text-[#3F72AF]" />
            <span>NMC & WHO Approved Universities</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl text-white tracking-tight leading-[1.15]"
          >
            Your Medical Dream <br />
            <span className="text-[#DBE2EF]">Starts Here</span>
          </motion.h1>

          {/* Description */}


          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-wrap gap-4 justify-center items-center pt-2"
          >
            <Link to="/apply">
              <Button
                variant="primary"
                className="gap-2 group px-8 py-3.5 bg-[#3F72AF] text-[#F9F7F7] hover:bg-[#3F72AF]/95 border-none text-sm font-semibold rounded-lg"
              >
                <span>Apply Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button
              variant="secondary"
              onClick={handleScrollToCountries}
              className="gap-2 px-8 py-3.5 bg-transparent text-white border border-[#DBE2EF]/40 hover:bg-white/10 hover:border-[#DBE2EF] text-sm font-semibold rounded-lg"
            >
              <Globe className="w-4 h-4 text-[#3F72AF]" />
              <span>Explore Countries</span>
            </Button>
          </motion.div>

        </div>

        {/* Soft Bottom Transition Gradient */}

      </section>

      {/* ABOUT US SECTION */}
      <AboutSection />

      {/* STATS SECTION */}
      <StatCounter />

      {/* IMAGE GALLERY SECTION */}
      <HomepageGallery />

      {/* COUNTRIES SECTION */}
      <CountryGrid />

      {/* WHY CHOOSE SVET */}
      <FeaturesGrid />

      {/* STUDENT JOURNEY */}
      <JourneyTimeline />

      {/* CTA BANNER */}
      <section className="py-20 bg-primary-blue text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 space-y-6 relative z-10">
          <h2 className="font-display font-extrabold text-3xl md:text-5xl text-white">
            Ready To Start Your Medical Journey?
          </h2>
          <p className="text-sm sm:text-base text-blue-100/80 font-light max-w-xl mx-auto leading-relaxed">
            Take the first step towards becoming a globally recognized doctor. Fill out the application form in 5 minutes and check your eligibility.
          </p>
          <div className="pt-2">
            <Link to="/apply">
              <Button variant="glass" className="px-8 py-3 bg-white text-primary-blue border-white hover:bg-secondary-bg hover:text-primary-blue text-sm font-bold group gap-2">
                <span>Apply Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <ContactSection />

      <Footer />
    </div>
  );
}
