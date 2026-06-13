import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../Common/Card';
import { Award, Globe2, HeartHandshake } from 'lucide-react';

export const Counter = ({ end, duration = 1500, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const progressPercentage = Math.min(progress / duration, 1);

      setCount(Math.floor(progressPercentage * end));

      if (progressPercentage < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, hasStarted]);

  return <span ref={elementRef}>{count}{suffix}</span>;
};

export default function StatCounter() {
  const stats = [

    {
      id: 2,
      number: 10,
      suffix: "+",
      label: "Countries Offered",
      sub: "Top destinations across Europe and Asia",
      icon: <Globe2 className="w-6 h-6 text-secondary-blue" />,
    },
    {
      id: 1,
      number: 500,
      suffix: "+",
      label: "Students Guided",
      sub: "Successfully placed in global medical colleges",
      icon: <Award className="w-6 h-6 text-secondary-blue" />,
    },
    {
      id: 3,
      number: 100,
      suffix: "%",
      label: "Dedicated Support",
      sub: "From documents to visa & hostel allocation",
      icon: <HeartHandshake className="w-6 h-6 text-secondary-blue" />,
    },
  ];

  return (
    <section className="py-12 bg-white border-y border-border-color">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <Card hoverGlow className="flex items-center gap-6 bg-white p-6 md:p-8">
                <div className="w-12 h-12 rounded-xl bg-secondary-blue/10 flex items-center justify-center border border-secondary-blue/20 shrink-0">
                  {stat.icon}
                </div>
                <div>
                  <h3 className="font-display font-bold text-3xl text-primary-blue tracking-tight leading-none mb-1">
                    <Counter end={stat.number} suffix={stat.suffix} />
                  </h3>
                  <p className="font-sans font-bold text-xs text-secondary-blue tracking-wider mb-1 uppercase">
                    {stat.label}
                  </p>
                  <p className="text-xs text-secondary-text font-light leading-relaxed">
                    {stat.sub}
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
