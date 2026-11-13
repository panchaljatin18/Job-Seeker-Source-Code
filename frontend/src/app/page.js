import Navbar from "@/Components/layout/Navbar";
import Footer from "@/Components/layout/Footer";
import Hero from "@/sections/HomePage/Hero/Hero";
import Stats from "@/sections/HomePage/Stats/Stats";
import FeaturedJobs from "@/sections/HomePage/FeaturedJobs/FeaturedJobs";
import PopularCategories from "@/sections/HomePage/PopularCategories/PopularCategories";
import TopCompanies from "@/sections/HomePage/TopCompanies/TopCompanies";
import HowItWorks from "@/sections/HomePage/HowItWorks/HowItWorks";
import Testimonials from "@/sections/HomePage/Testimonials/Testimonials";
import CtaBanner from "@/sections/HomePage/CtaBanner/CtaBanner";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-[#0F172A] selection:bg-[#EFF6FF] selection:text-[#2563EB]">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Stats />
        <FeaturedJobs />
        <PopularCategories />
        <TopCompanies />
        <HowItWorks />
        <Testimonials />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
}
