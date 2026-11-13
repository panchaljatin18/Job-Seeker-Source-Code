"use client";

import Link from "next/link";
import { Code, BarChart3, Palette, Send, Users, TrendingUp, Headphones, FileText, Calculator, Monitor, Heart, LayoutGrid, ArrowRight } from "lucide-react";
import { popularCategories } from "@/data/mockData";

function PopularCategories() {
  const iconMap = {
    Code: Code,
    BarChart3: BarChart3,
    Palette: Palette,
    Send: Send,
    Users: Users,
    TrendingUp: TrendingUp,
    Headphones: Headphones,
    FileText: FileText,
    Calculator: Calculator,
    Monitor: Monitor,
    Heart: Heart,
    LayoutGrid: LayoutGrid
  };
  return (
    <section className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 mb-20 sm:mb-28">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
            Popular Categories
          </h2>
          <p className="text-[#64748B] text-sm sm:text-base mt-1.5 font-normal">
            Explore jobs by your interest
          </p>
        </div>
        <Link
          href="/jobs"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2563EB] hover:text-blue-700 hover:underline group"
        >
          <span>View All Categories</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {popularCategories.map((cat) => {
          const IconComp = iconMap[cat.iconName] || LayoutGrid;
          return (
            <div
              key={cat.id || cat.name}
              className="bg-white rounded-xl border border-slate-200/70 p-4 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col justify-between"
            >
              <div
                className={`w-10 h-10 rounded-xl ${cat.bgColor} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
              >
                <IconComp className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors line-clamp-1">
                  {cat.name}
                </h3>
                <p className="text-[11px] font-medium text-[#64748B] mt-1">
                  {cat.jobsCount}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default PopularCategories;