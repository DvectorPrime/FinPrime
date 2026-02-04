'use client'
import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  PieChart, 
  Cpu, 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  CheckCircle2, 
} from 'lucide-react';
import Image from 'next/image';
import logo from "../public/logo.png"
import logoWhite from "../public/logo-white.png"
import { useThemeDetector } from '@/hooks/themeContext';

import { useRouter } from 'next/navigation';

const App = () => {
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false);

  const isDark = useThemeDetector()

  // Sync with system preference on mount
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div>
      <title>FinPrime</title>
      <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
        {/* Navigation */}
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
        }`}>
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

            {
              isDark ? 
              <Image src={logoWhite} alt='FinPrime' width={32} height={32}></Image> : 
              <Image src={logo} alt='FinPrime' width={32} height={32}></Image>
            }

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-8">
              <a></a>
              <div className="flex items-center gap-6 pl-8 dark:border-slate-800">
                <button className="text-sm font-semibold hover:text-blue-600 transition-colors" onClick={() => {router.push("/login")}}>Login</button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-md hover:shadow-lg active:scale-95" onClick={() => {router.push("/signup")}}>
                  Get Started
                </button>
              </div>
            </div>

            <div className="md:hidden flex items-center gap-4">
              <button className="w-30 bg-blue-600 text-white py-4 rounded-xl font-bold" onClick={() => {router.push("/login")}}>Login</button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 text-center lg:text-left animate-in fade-in slide-in-from-left-8 duration-700">
              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
                Take Control of <span className="text-blue-600">Your Finances</span> with Confidence.
              </h1>
              <p className="text-xl text-slate-500 dark:text-slate-400 max-w-xl mx-auto lg:mx-0">
                Track expenses, manage budgets, and understand your money — all in one place. Powered by AI to help you save more.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-bold shadow-xl shadow-blue-500/20 transition-all hover:-translate-y-1" onClick={() => {router.push("/signup")}}>
                  Get Started Free
                </button>
              </div>
            </div>
            <div className="relative animate-in fade-in zoom-in duration-1000">
              {/* Abstract decorative background */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl" />
              
              <div className="relative rounded-4xl overflow-hidden border-8 border-white dark:border-slate-900 shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800" 
                  alt="Financial Dashboard" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24 bg-slate-50 dark:bg-slate-900/30">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <h2 className="text-4xl font-bold">Unlock Your Financial Potential</h2>
              <p className="text-slate-500 dark:text-slate-400">Everything you need to master your personal economy in one intuitive platform.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Smart Expense Tracking", desc: "Automatically categorize transactions and gain insights with intuitive charts.", icon: <BarChart3 className="text-blue-500" /> },
                { title: "Monthly Budget Control", desc: "Set and stick to your budget goals. Get alerts when you're nearing limits.", icon: <PieChart className="text-indigo-500" /> },
                { title: "AI Financial Insights", desc: "Leverage AI to predict future spending, identify savings, and optimize.", icon: <Cpu className="text-emerald-500" /> },
                { title: "Secure & Private", desc: "Your data is encrypted with industry-leading security measures.", icon: <ShieldCheck className="text-amber-500" /> }
              ].map((feat, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 p-8 rounded-4xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all group hover:-translate-y-2">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center mb-6 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    {feat.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4">{feat.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section id="workflow" className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-bold">Simple Steps to Financial Freedom</h2>
            </div>
            
            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Connecting line for desktop */}
              <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-slate-100 dark:bg-slate-800" />
              
              {[
                { step: "1", title: "Sign Up", desc: "Create your secure FinPrime account in minutes and connect your bank accounts.", icon: <CheckCircle2 /> },
                { step: "2", title: "Track & Budget", desc: "Effortlessly monitor your transactions and set smart budgets tailored to you.", icon: <BarChart3 /> },
                { step: "3", title: "Get Insights", desc: "Receive personalized AI-driven advice to help you achieve your goals faster.", icon: <Cpu /> }
              ].map((item, i) => (
                <div key={i} className="relative text-center space-y-6">
                  <div className="relative z-10 w-12 h-12 mx-auto bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                    {item.step}
                  </div>
                  <div className="w-20 h-20 mx-auto bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center text-blue-600">
                    {item.icon}
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-bold">{item.title}</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Security / Trust Section */}
        <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h3 className="text-xl font-medium mb-12 text-slate-500 dark:text-slate-400">
              Built with privacy and security at its core, so your financial data is always safe.
            </h3>
            <div className="flex items-center justify-center gap-12 md:gap-24 grayscale opacity-60">
               <ShieldCheck size={48} />
               <Lock size={48} />
               <CreditCard size={48} />
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-32">
          <div className="max-w-5xl mx-auto px-6">
            <div className="bg-blue-600 rounded-[3rem] p-12 lg:p-20 text-center text-white space-y-8 relative overflow-hidden">
              {/* Abstract blobs for visual depth */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full -ml-20 -mb-20 blur-3xl" />
              
              <h2 className="text-4xl lg:text-5xl font-bold relative z-10">
                Ready to start making smarter financial decisions today?
              </h2>
              <div className="relative z-10 pt-4">
                <button className="bg-white text-blue-600 hover:bg-slate-100 px-10 py-4 rounded-full text-lg font-bold shadow-2xl transition-all hover:scale-105 active:scale-95" onClick={() => {router.push("/signup")}}>
                  Create Free Account
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="pb-10 border-t border-slate-100 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-6">            
            <div className="text-center pt-8 dark:border-slate-800 text-slate-400 text-xs font-medium">
              © 2026 FinPrime. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;