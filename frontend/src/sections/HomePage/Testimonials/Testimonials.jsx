"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { testimonialsData } from "@/data/mockData";

export default function Testimonials() {
  return (
    <section className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 mb-20 sm:mb-28">
      <div className="flex items-end justify-between mb-8 sm:mb-10">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
            What Job Seekers Say
          </h2>
          <p className="text-[#64748B] text-sm sm:text-base mt-1.5 font-normal">
            Real stories from people who found their dream jobs
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            aria-label="Previous testimonial"
            className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-[#475569] hover:border-[#2563EB] hover:text-[#2563EB] hover:bg-[#EFF6FF] transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            aria-label="Next testimonial"
            className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-[#475569] hover:border-[#2563EB] hover:text-[#2563EB] hover:bg-[#EFF6FF] transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonialsData.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-6 flex items-start gap-4 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
          >
            <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 border-2 border-slate-100 shadow-sm">
              <Image
                src={item.avatar}
                alt={item.name}
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed font-normal italic">
                {item.quote}
              </p>
              <div className="mt-3">
                <h3 className="text-sm font-bold text-[#0F172A] leading-tight">
                  {item.name}
                </h3>
                <p className="text-xs font-medium text-[#64748B] mt-0.5">
                  {item.role}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}