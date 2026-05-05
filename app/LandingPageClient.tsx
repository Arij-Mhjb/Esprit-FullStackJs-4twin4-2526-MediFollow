"use client";

import Link from "next/link";

import "./landing-animations.css";
// import LanguageSwitcher from "@/components/LanguageSwitcher";
import Activity from "lucide-react/dist/esm/icons/activity";
import X from "lucide-react/dist/esm/icons/x";
import ArrowUp from "lucide-react/dist/esm/icons/arrow-up";
import Sparkles from "lucide-react/dist/esm/icons/sparkles";
import Zap from "lucide-react/dist/esm/icons/zap";
import Award from "lucide-react/dist/esm/icons/award";
import Heart from "lucide-react/dist/esm/icons/heart";
import Building2 from "lucide-react/dist/esm/icons/building-2";
import ChevronDown from "lucide-react/dist/esm/icons/chevron-down";
import Menu from "lucide-react/dist/esm/icons/menu";
import MessageCircle from "lucide-react/dist/esm/icons/message-circle";
import Shield from "lucide-react/dist/esm/icons/shield";
import Star from "lucide-react/dist/esm/icons/star";
import TrendingUp from "lucide-react/dist/esm/icons/trending-up";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useState, useEffect } from "react";

import { useLanguage } from "@/app/SettingsContext";


// Component for the loading state of the 3D model
const Medical3DLoading = () => {
  const { t } = useLanguage();
  return (
    <div className="flex h-[500px] w-full items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100">
      <div className="text-center">
        <div className="mx-auto mb-4 size-16 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        <p className="text-gray-600">{t("common.loading")}</p>
      </div>
    </div>
  );
};

const MedicalHumanBody3D = dynamic(
  () => import("@/components/MedicalHumanBody3D"),
  {
    ssr: false,
    loading: () => <Medical3DLoading />,
  }
);

const PartnersSection = dynamic(() => import("./landing/PartnersSection"), { ssr: false });
const FeaturesSection = dynamic(() => import("./landing/FeaturesSection"), { ssr: false });
const HowItWorksSection = dynamic(() => import("./landing/HowItWorksSection"), { ssr: false });
const TestimonialsSection = dynamic(() => import("./landing/TestimonialsSection"), { ssr: false });
const MedicalGallery = dynamic(() => import("./landing/MedicalGallery"), { ssr: false });
const BenefitsSection = dynamic(() => import("./landing/BenefitsSection"), { ssr: false });
const FaqSection = dynamic(() => import("./landing/FaqSection"), { ssr: false });
const FooterSection = dynamic(() => import("./landing/FooterSection"), { ssr: false });

export default function LandingPageClient() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [show3DModel, setShow3DModel] = useState(false);
  const { t } = useLanguage();

  // Optimized scroll listener
  useEffect(() => {
    const timer = setTimeout(() => {
      setShow3DModel(true);
    }, 500);

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Enhanced */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/98 border-b border-gray-200/50 shadow-lg backdrop-blur-xl"
            : "border-b border-gray-100 bg-white/95 backdrop-blur-md"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between px-6 py-3.5">
          {/* Logo - Enhanced */}
          <Link
            href="/"
            className="group flex items-center space-x-3 transition-all duration-300 hover:scale-105"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 opacity-0 blur-lg transition-opacity group-hover:opacity-50"></div>
              <div className="relative flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 p-2 shadow-lg shadow-blue-500/30 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-blue-500/50">
                <Activity className="size-7 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 bg-clip-text text-2xl font-black leading-none text-transparent">
                MediFollow
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                {t("common.subtitle")}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Enhanced */}
          <nav className="hidden items-center space-x-1 lg:flex">
            <Link
              href="/"
              className="group relative px-4 py-2 text-sm font-semibold text-gray-700 transition-all duration-300 hover:text-blue-600"
            >
              <span className="relative z-10">{t("nav.home")}</span>
              <span className="absolute inset-0 rounded-lg bg-blue-50 opacity-0 transition-all duration-300 group-hover:opacity-100"></span>
              <span className="absolute bottom-0 left-1/2 h-0.5 w-0 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:left-2 group-hover:w-[calc(100%-1rem)]"></span>
            </Link>
            <Link
              href="#features"
              className="group relative px-4 py-2 text-sm font-semibold text-gray-700 transition-all duration-300 hover:text-blue-600"
            >
              <span className="relative z-10">{t("nav.features")}</span>
              <span className="absolute inset-0 rounded-lg bg-blue-50 opacity-0 transition-all duration-300 group-hover:opacity-100"></span>
              <span className="absolute bottom-0 left-1/2 h-0.5 w-0 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:left-2 group-hover:w-[calc(100%-1rem)]"></span>
            </Link>
            <Link
              href="#testimonials"
              className="group relative px-4 py-2 text-sm font-semibold text-gray-700 transition-all duration-300 hover:text-blue-600"
            >
              <span className="relative z-10">{t("nav.testimonials")}</span>
              <span className="absolute inset-0 rounded-lg bg-blue-50 opacity-0 transition-all duration-300 group-hover:opacity-100"></span>
              <span className="absolute bottom-0 left-1/2 h-0.5 w-0 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:left-2 group-hover:w-[calc(100%-1rem)]"></span>
            </Link>
            <Link
              href="/contact"
              className="group relative px-4 py-2 text-sm font-semibold text-gray-700 transition-all duration-300 hover:text-blue-600"
            >
              <span className="relative z-10">{t("nav.contact")}</span>
              <span className="absolute inset-0 rounded-lg bg-blue-50 opacity-0 transition-all duration-300 group-hover:opacity-100"></span>
              <span className="absolute bottom-0 left-1/2 h-0.5 w-0 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:left-2 group-hover:w-[calc(100%-1rem)]"></span>
            </Link>

            {/* Separator */}
            <div className="mx-2 h-8 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>

            {/* Call to Action Badge */}
            <div className="flex items-center space-x-2 rounded-full border border-green-200/50 bg-gradient-to-r from-green-50 to-emerald-50 px-3 py-1.5">
              <div className="size-2 animate-pulse rounded-full bg-green-500"></div>
              <span className="text-xs font-bold text-green-700">
                {t("nav.support")}
              </span>
            </div>
          </nav>


          <div className="hidden items-center space-x-3 lg:flex">
            <Link
              href="/login"
              className="group relative overflow-hidden rounded-xl px-6 py-2.5 text-sm font-semibold text-gray-700 transition-all duration-300 hover:text-blue-600"
            >
              <span className="relative z-10">{t("nav.login")}</span>
              <span className="absolute inset-0 rounded-xl bg-gray-100 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
            </Link>
            <Link
              href="/register"
              className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-blue-500/50"
            >
              <span className="relative z-10 flex items-center space-x-2">
                <span>{t("nav.register")}</span>
                <Sparkles className="size-4" />
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-blue-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
              <div className="absolute -right-12 -top-12 size-32 rounded-full bg-white/20 blur-2xl transition-all duration-500 group-hover:scale-150"></div>
            </Link>
          </div>

          {/* Mobile Menu Button - Enhanced */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="group relative rounded-xl p-2.5 transition-all duration-300 hover:bg-gray-100 lg:hidden"
            aria-label="Menu"
          >
            <div className="relative size-6">
              {mobileMenuOpen ? (
                <X className="size-6 text-gray-700 transition-transform duration-300 group-hover:rotate-90" />
              ) : (
                <Menu className="size-6 text-gray-700 transition-transform duration-300 group-hover:scale-110" />
              )}
            </div>
            {!mobileMenuOpen && (
              <span className="absolute right-1 top-1 size-2 animate-pulse rounded-full bg-blue-600"></span>
            )}
          </button>
        </div>

        {/* Mobile Menu - Enhanced */}
        {mobileMenuOpen && (
          <div className="bg-white/98 animate-fade-in border-t border-gray-200/50 shadow-2xl backdrop-blur-xl lg:hidden">
            <nav className="container mx-auto flex flex-col space-y-2 p-6">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="group flex items-center space-x-3 rounded-xl px-4 py-3 font-semibold text-gray-700 transition-all hover:bg-blue-50 hover:text-blue-600"
              >
                <div className="flex size-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 transition-transform group-hover:scale-110">
                  <Activity className="size-4" />
                </div>
                <span>{t("nav.home")}</span>
              </Link>
              <Link
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="group flex items-center space-x-3 rounded-xl px-4 py-3 font-semibold text-gray-700 transition-all hover:bg-blue-50 hover:text-blue-600"
              >
                <div className="flex size-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600 transition-transform group-hover:scale-110">
                  <Zap className="size-4" />
                </div>
                <span>{t("nav.features")}</span>
              </Link>
              <Link
                href="#testimonials"
                onClick={() => setMobileMenuOpen(false)}
                className="group flex items-center space-x-3 rounded-xl px-4 py-3 font-semibold text-gray-700 transition-all hover:bg-blue-50 hover:text-blue-600"
              >
                <div className="flex size-8 items-center justify-center rounded-lg bg-green-100 text-green-600 transition-transform group-hover:scale-110">
                  <Star className="size-4" />
                </div>
                <span>{t("nav.testimonials")}</span>
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="group flex items-center space-x-3 rounded-xl px-4 py-3 font-semibold text-gray-700 transition-all hover:bg-blue-50 hover:text-blue-600"
              >
                <div className="flex size-8 items-center justify-center rounded-lg bg-orange-100 text-orange-600 transition-transform group-hover:scale-110">
                  <MessageCircle className="size-4" />
                </div>
                <span>{t("nav.contact")}</span>
              </Link>

              <div className="mt-4 flex flex-col space-y-3 border-t border-gray-200 pt-4">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl border-2 border-gray-200 px-6 py-3.5 text-center font-bold text-gray-700 transition-all hover:border-blue-300 hover:bg-gray-50 hover:text-blue-600"
                >
                  {t("nav.login")}
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 px-6 py-3.5 text-center font-bold text-white shadow-xl shadow-blue-500/30"
                >
                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    <span>{t("nav.register")}</span>
                    <Sparkles className="size-4" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-blue-700 to-blue-600 opacity-0 transition-opacity group-hover:opacity-100"></div>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Spacer for fixed header */}
      <div className="h-[72px]"></div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="hover:shadow-3xl animate-fade-in fixed bottom-8 right-8 z-50 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white shadow-2xl shadow-blue-500/40 transition-all hover:-translate-y-1"
          aria-label={t("common.backToTop")}
        >
          <ArrowUp className="size-6" />
        </button>
      )}

      {/* Hero Section - Improved with 3D Model */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-green-50 py-24">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-40 -top-40 size-80 rounded-full bg-blue-200/20 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 size-80 rounded-full bg-green-200/20 blur-3xl"></div>
        </div>

        <div className="container relative mx-auto px-6">
          {/* Grid Layout: Text Left, 3D Model Right */}
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            {/* Left Column - Text Content */}
            <div className="text-center lg:text-left">
              <div className="animate-fade-in-down mb-6 inline-flex items-center space-x-2 rounded-full bg-blue-100 px-5 py-2 text-blue-700 shadow-sm">
                <Shield className="size-5" />
                <span className="text-sm font-semibold">
                  {t("hero.badge")}
                </span>
              </div>
              <h1 className="animate-fade-in mb-8 text-5xl font-extrabold leading-tight text-gray-900 lg:text-6xl">
                {t("hero.title1")} <br />
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                  {t("hero.title2")}
                </span>
              </h1>
              <p className="animate-fade-in-up mb-10 text-lg leading-relaxed text-gray-600 lg:text-xl">
                {t("hero.desc")}
              </p>
              <div className="animate-fade-in-up flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
                <Link
                  href="/register"
                  className="group inline-flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-10 py-5 text-lg font-bold text-white shadow-xl shadow-blue-500/30 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/40"
                >
                  <span>{t("hero.cta")}</span>
                  <TrendingUp className="size-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="#features"
                  className="inline-flex items-center justify-center space-x-2 rounded-xl border-2 border-blue-600 bg-white px-10 py-5 text-lg font-bold text-blue-600 transition-all hover:border-blue-700 hover:bg-blue-50"
                >
                  <span>{t("hero.discover")}</span>
                  <ChevronDown className="size-5" />
                </Link>
              </div>

              {/* Mini Stats under buttons - Mobile/Tablet */}
              <div className="mt-12 grid grid-cols-2 gap-4 lg:hidden">
                <div className="rounded-xl bg-white/80 p-4 shadow-lg backdrop-blur-sm">
                  <div className="bg-gradient-to-br from-blue-600 to-blue-800 bg-clip-text text-3xl font-black text-transparent">
                    24/7
                  </div>
                    <p className="text-sm font-medium text-gray-600">
                      {t("hero.stats.surveillance")}
                    </p>
                </div>
                <div className="rounded-xl bg-white/80 p-4 shadow-lg backdrop-blur-sm">
                  <div className="bg-gradient-to-br from-green-600 to-green-800 bg-clip-text text-3xl font-black text-transparent">
                    &lt;2s
                  </div>
                  <p className="text-sm font-medium text-gray-600">{t("hero.stats.alerts")}</p>
                </div>
              </div>
            </div>

            {/* Right Column - 3D Model */}
            <div className="animate-fade-in-up relative">
              {show3DModel ? <MedicalHumanBody3D /> : <Medical3DLoading />}
              {/* Info badge floating */}
              <div className="absolute -bottom-4 -left-4 hidden lg:block">
                <div className="rounded-xl bg-white p-4 shadow-2xl">
                  <div className="flex items-center space-x-3">
                    <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-800">
                      <Activity className="size-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        {t("hero.stats.realtime")}
                      </p>
                      <p className="text-xs text-gray-600">
                        {t("hero.stats.vitals")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Stats - Desktop Only */}
          <div className="mx-auto mt-20 hidden max-w-6xl grid-cols-4 gap-6 lg:grid">
            <div className="group rounded-2xl bg-white p-8 text-center shadow-xl transition-all hover:-translate-y-2 hover:shadow-2xl">
              <div className="mb-3 bg-gradient-to-br from-blue-600 to-blue-800 bg-clip-text text-5xl font-black text-transparent">
                24/7
              </div>
              <p className="font-medium text-gray-600">{t("hero.stats.surveillance")}</p>
              <Activity className="mx-auto mt-3 size-8 text-blue-600 opacity-20 transition-opacity group-hover:opacity-100" />
            </div>
            <div className="group rounded-2xl bg-white p-8 text-center shadow-xl transition-all hover:-translate-y-2 hover:shadow-2xl">
              <div className="mb-3 bg-gradient-to-br from-green-600 to-green-800 bg-clip-text text-5xl font-black text-transparent">
                &lt;2s
              </div>
              <p className="font-medium text-gray-600">{t("hero.stats.alerts")}</p>
              <Zap className="mx-auto mt-3 size-8 text-green-600 opacity-20 transition-opacity group-hover:opacity-100" />
            </div>
            <div className="group rounded-2xl bg-white p-8 text-center shadow-xl transition-all hover:-translate-y-2 hover:shadow-2xl">
              <div className="mb-3 bg-gradient-to-br from-purple-600 to-purple-800 bg-clip-text text-5xl font-black text-transparent">
                100%
              </div>
              <p className="font-medium text-gray-600">{t("hero.stats.blockchain")}</p>
              <Shield className="mx-auto mt-3 size-8 text-purple-600 opacity-20 transition-opacity group-hover:opacity-100" />
            </div>
            <div className="group rounded-2xl bg-white p-8 text-center shadow-xl transition-all hover:-translate-y-2 hover:shadow-2xl">
              <div className="mb-3 bg-gradient-to-br from-orange-600 to-orange-800 bg-clip-text text-5xl font-black text-transparent">
                5k+
              </div>
              <p className="font-medium text-gray-600">{t("hero.stats.patients")}</p>
              <Award className="mx-auto mt-3 size-8 text-orange-600 opacity-20 transition-opacity group-hover:opacity-100" />
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section (Lazy Loaded) */}
      <PartnersSection />

      {/* Features Section (Lazy Loaded) */}
      <FeaturesSection />

      {/* How It Works Section (Lazy Loaded) */}
      <HowItWorksSection />

      {/* Testimonials Section (Lazy Loaded) */}
      <TestimonialsSection />

      {/* Medical Gallery Section (Lazy Loaded) */}
      <MedicalGallery />

      {/* Benefits Section (Lazy Loaded) */}
      <BenefitsSection />

      {/* FAQ Section (Lazy Loaded) */}
      <FaqSection />

      {/* CTA Section - Keeping it static as it's small */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 py-24 text-white">
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute -right-40 -top-40 size-96 rounded-full bg-white blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 size-96 rounded-full bg-white blur-3xl"></div>
        </div>

        <div className="container relative mx-auto px-6 text-center">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 inline-flex items-center space-x-2 rounded-full bg-white/20 px-5 py-2 backdrop-blur-sm">
              <Zap className="size-5" />
              <span className="text-sm font-semibold">{t("cta.badge")}</span>
            </div>
            <h2 className="mb-6 text-5xl font-extrabold leading-tight">
              {t("cta.title")}
            </h2>
            <p className="mb-10 text-2xl font-light leading-relaxed opacity-90">
              {t("cta.desc")}
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/register"
                className="group inline-flex items-center justify-center space-x-3 rounded-xl bg-white px-10 py-5 text-lg font-bold text-blue-600 shadow-2xl transition-all hover:-translate-y-1 hover:bg-gray-50 hover:shadow-2xl"
              >
                <span>{t("cta.button")}</span>
                <Heart className="size-6 transition-transform group-hover:scale-110" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center space-x-3 rounded-xl border-2 border-white bg-transparent px-10 py-5 text-lg font-bold text-white transition-all hover:bg-white/10"
              >
                <span>{t("nav.login")}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section (Lazy Loaded) */}
      <FooterSection />
      {/* LanguageSwitcher is now global in RootLayout */}
    </div>
  );
}
