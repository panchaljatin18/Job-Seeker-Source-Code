"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Briefcase, ChevronDown, Menu, X, LogIn } from "lucide-react";

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isHomeActive = pathname === "/";
  const isJobsActive = pathname === "/jobs" || pathname?.startsWith("/jobs");
  const isCompaniesActive = pathname === "/companies" || pathname?.startsWith("/companies");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        isScrolled
          ? "bg-[#EFF6FF]/95 backdrop-blur-md border-b border-blue-100/80 shadow-xs"
          : "bg-[#EFF6FF] border-b border-transparent"
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-[76px]">
          <Link href="/" className="flex items-center py-1">
            <Image
              src="/tecjob-logo.webp"
              alt="TecJob - YOUR NEXT OPPORTUNITY"
              width={280}
              height={94}
              quality={100}
              unoptimized
              className="h-12 sm:h-13 md:h-14 w-auto object-contain"
              priority
            />
          </Link>

          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              href="/"
              className={`px-3.5 py-2 text-sm transition-colors rounded-lg ${
                isHomeActive
                  ? "font-bold text-[#2563EB] bg-white shadow-xs border border-blue-100/70"
                  : "font-medium text-[#475569] hover:text-[#2563EB] hover:bg-white/70"
              }`}
            >
              Home
            </Link>
            <Link
              href="/jobs"
              className={`px-3.5 py-2 text-sm transition-colors rounded-lg ${
                isJobsActive
                  ? "font-bold text-[#2563EB] bg-white shadow-xs border border-blue-100/70"
                  : "font-medium text-[#475569] hover:text-[#2563EB] hover:bg-white/70"
              }`}
            >
              Jobs
            </Link>
            <Link
              href="/companies"
              className={`px-3.5 py-2 text-sm transition-colors rounded-lg ${
                isCompaniesActive
                  ? "font-bold text-[#2563EB] bg-white shadow-xs border border-blue-100/70"
                  : "font-medium text-[#475569] hover:text-[#2563EB] hover:bg-white/70"
              }`}
            >
              Companies
            </Link>
            <div className="relative group">
              <button className="px-3.5 py-2 text-sm font-medium text-[#475569] hover:text-[#2563EB] hover:bg-white/70 rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer">
                Resources
                <ChevronDown className="w-4 h-4 text-[#64748B] group-hover:text-[#2563EB] transition-transform group-hover:rotate-180" />
              </button>
            </div>
            <Link
              href="#"
              className="px-3.5 py-2 text-sm font-medium text-[#475569] hover:text-[#2563EB] hover:bg-white/70 rounded-lg transition-colors"
            >
              About
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#2563EB] hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-md shadow-blue-600/20 transition-all hover:shadow-lg hover:shadow-blue-600/30"
            >
              <LogIn className="w-4 h-4 stroke-[2.2]" />
              <span>Login / Sign Up</span>
            </Link>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-[#0F172A] hover:bg-white/70 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-[#EFF6FF] border-b border-blue-100 px-4 pt-3 pb-6 space-y-2.5 shadow-xl">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2.5 text-base ${
              isHomeActive
                ? "font-bold text-[#2563EB] bg-white rounded-lg shadow-xs"
                : "font-medium text-[#0F172A] hover:bg-white/70 rounded-lg"
            }`}
          >
            Home
          </Link>
          <Link
            href="/jobs"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2.5 text-base ${
              isJobsActive
                ? "font-bold text-[#2563EB] bg-white rounded-lg shadow-xs"
                : "font-medium text-[#0F172A] hover:bg-white/70 rounded-lg"
            }`}
          >
            Jobs
          </Link>
          <Link
            href="/companies"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2.5 text-base ${
              isCompaniesActive
                ? "font-bold text-[#2563EB] bg-white rounded-lg shadow-xs"
                : "font-medium text-[#0F172A] hover:bg-white/70 rounded-lg"
            }`}
          >
            Companies
          </Link>
          <Link
            href="#"
            className="block px-3 py-2.5 text-base font-medium text-[#0F172A] hover:bg-white/70 rounded-lg"
          >
            Resources
          </Link>
          <Link
            href="#"
            className="block px-3 py-2.5 text-base font-medium text-[#0F172A] hover:bg-white/70 rounded-lg"
          >
            About
          </Link>
          <div className="pt-4 border-t border-blue-200/50">
            <Link
              href="/auth"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white bg-[#2563EB] hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-md transition-colors"
            >
              <LogIn className="w-4 h-4 stroke-[2.2]" />
              <span>Login / Sign Up</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
