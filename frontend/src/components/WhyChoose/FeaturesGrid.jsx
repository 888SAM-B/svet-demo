import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../Common/Card';
import { GraduationCap, ShieldCheck, Home, Globe } from 'lucide-react';

export default function FeaturesGrid() {
  const features = [
    {
      title: 'Admission Guidance',
      desc: 'Complete counselling and support from selecting the university to receiving your official seat allocation letters.',
      icon: <GraduationCap className="w-6 h-6 text-secondary-blue" />,
    },
    {
      title: 'Visa Assistance',
      desc: 'Expert visa processing with 99.8% approval rates, ensuring document verification, translation, and interview preparation.',
      icon: <ShieldCheck className="w-6 h-6 text-secondary-blue" />,
    },
    {
      title: 'Hostel Support',
      desc: 'Guaranteed safe and fully-furnished university hostel rooms with separate options for boys and girls, including Indian mess.',
      icon: <Home className="w-6 h-6 text-secondary-blue" />,
    },
    {
      title: 'Global Opportunities',
      desc: 'Earn degrees recognized by WHO, NMC (India), USMLE (USA), and PLAB (UK) to practice medicine anywhere globally.',
      icon: <Globe className="w-6 h-6 text-secondary-blue" />,
    },
  ];

  return (
    <section id="why-choose" className="py-20 bg-secondary-bg/30 border-y border-border-color">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-widest text-secondary-blue font-bold">Our Key Pillars</span>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-primary-blue">
            Why Choose SVET
          </h2>
          <p className="text-sm text-secondary-text font-light">
            Sri Venkateshwara Educational Trust stands for absolute transparency, reliable guidance, and end-to-end student support until graduation.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <Card
                hoverGlow
                className="h-full flex flex-col justify-between bg-white border border-border-color p-8 hover:border-secondary-blue/40"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary-blue/10 flex items-center justify-center border border-secondary-blue/20">
                    {feature.icon}
                  </div>
                  <h4 className="font-display font-bold text-lg text-primary-blue">
                    {feature.title}
                  </h4>
                  <p className="text-xs text-secondary-text font-light leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
