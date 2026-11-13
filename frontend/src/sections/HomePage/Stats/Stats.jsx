"use client";

import React, { useState, useRef, useEffect } from "react";
import { Briefcase, Building2, Users, TrendingUp } from "lucide-react";

// Ultra-smooth 60fps Count Up Component
function CountUpNumber({ target, suffix, isVisible }) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isVisible || hasAnimated.current || target === 0) return;

    const duration = 1800;
    let startTime = null;
    let animationFrameId = null;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.floor(easeOutProgress * target);

      setCount(currentVal);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setCount(target);
        hasAnimated.current = true;
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible, target]);

  return (
    <span className="tabular-nums">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export default function Stats() {
  const [isVisible, setIsVisible] = useState(false);
  const [liveStats, setLiveStats] = useState({
    jobs: null,
    companies: null,
  });

  const sectionRef = useRef(null);

  // Fetch live counts from API
  useEffect(() => {
    async function fetchCounts() {
      try {
        const [jobsRes, companiesRes] = await Promise.all([
          fetch("/api/jobs"),
          fetch("/api/companies"),
        ]);
        const jobsData = await jobsRes.json();
        const companiesData = await companiesRes.json();

        setLiveStats({
          jobs: jobsData.success ? jobsData.total : null,
          companies: companiesData.success ? companiesData.total : null,
        });
      } catch (err) {
        console.error("Failed to fetch live stats:", err);
      }
    }
    fetchCounts();
  }, []);

  // IntersectionObserver for count-up animation trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Build stats using live data where available, fallback to static values
  const stats = [
    {
      target: liveStats.jobs !== null ? liveStats.jobs : 500,
      suffix: liveStats.jobs !== null ? "+" : "+",
      label: "Active Jobs",
      Icon: Briefcase,
      bgColor: "bg-[#EFF6FF] text-[#2563EB]",
    },
    {
      target: liveStats.companies !== null ? liveStats.companies : 200,
      suffix: "+",
      label: "Top Companies",
      Icon: Building2,
      bgColor: "bg-[#ECFDF5] text-[#10B981]",
    },
    {
      target: 10000,
      suffix: "+",
      label: "Job Seekers",
      Icon: Users,
      bgColor: "bg-[#F5F3FF] text-[#7C3AED]",
    },
    {
      target: 95,
      suffix: "%",
      label: "Success Rate",
      Icon: TrendingUp,
      bgColor: "bg-[#ECFDF5] text-[#10B981]",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative z-30 max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 -mt-6 sm:-mt-10 mb-20 sm:mb-28"
    >
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-100 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 lg:divide-x divide-slate-100">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-4 ${idx > 0 ? "pt-4 sm:pt-0 lg:pl-8" : ""}`}
          >
            <div
              className={`w-14 h-14 rounded-2xl ${stat.bgColor} flex items-center justify-center shrink-0 shadow-2xs hover:scale-105 transition-transform`}
            >
              <stat.Icon className="w-7 h-7 stroke-[2.2]" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight leading-tight min-w-[75px]">
                <CountUpNumber
                  target={stat.target}
                  suffix={stat.suffix}
                  isVisible={isVisible}
                />
              </div>
              <div className="text-sm font-medium text-[#64748B] mt-0.5">
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
