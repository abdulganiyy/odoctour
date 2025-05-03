"use client";
import { useRouter } from "next/navigation";
import Header from "@/components/custom/Header";
import Hero from "@/components/custom/Hero";
import Services from "@/components/custom/Services";
import Testimonials from "@/components/custom/Testimonials";
import Footer from "@/components/custom/Footer";

export default function Home() {
  const router = useRouter();

  return (
    <div>
      <Header />
      <Hero />
      <Services />
      <Testimonials />
      <Footer />
    </div>
  );
}
