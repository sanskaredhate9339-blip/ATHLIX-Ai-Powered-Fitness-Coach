import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  Sparkles, Camera, Dumbbell, MessageSquare, 
  CheckCircle, ArrowRight, Star, ChevronDown, 
  Menu, X, ShieldAlert 
} from 'lucide-react';

export const Landing: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const features = [
    {
      title: 'AI Food Calorie Estimate',
      description: 'Snap a photo of your meal. Our vision model identifies foods, estimates weights, and returns calories & macronutrients instantly.',
      icon: Camera,
      color: 'from-violet-500 to-indigo-500',
    },
    {
      title: 'AI Workout Planner',
      description: 'Get custom weekly splits generated specifically for your goals, equipment, schedule, and experience levels.',
      icon: Dumbbell,
      color: 'from-cyan-500 to-blue-500',
    },
    {
      title: 'Camera Form Correction',
      description: 'Real-time skeleton overlays analyze squat depths, elbows, and postures, giving instant audio cues to protect your joints.',
      icon: Sparkles,
      color: 'from-emerald-500 to-teal-500',
    },
    {
      title: '24/7 AI Coach Chat',
      description: 'A conversational intelligence that knows your metrics and guides your diet plans, exercise choices, and motivation.',
      icon: MessageSquare,
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Streaks Habit Tracking',
      description: 'Daily check-offs and interactive heatmaps for water, sleep, protein goals, and steps to build healthy routines.',
      icon: CheckCircle,
      color: 'from-amber-500 to-orange-500',
    },
    {
      title: 'Progress Analytics',
      description: 'Beautiful Recharts line, bar, and donut charts track weights, body fat, caloric trends, and weekly report metrics.',
      icon: ShieldAlert,
      color: 'from-rose-500 to-red-500',
    }
  ];

  const faqs = [
    {
      q: 'How accurate is the AI Food photo analysis?',
      a: 'Our food estimation is powered by GPT-4o Vision. It analyzes your plate\'s volume and visual ingredients to give a highly accurate approximation of calories, protein, carbs, and fats. You can always edit the pre-filled fields manually before saving.'
    },
    {
      q: 'Do I need special hardware for Form Analysis?',
      a: 'No! It runs fully in your standard mobile or desktop browser using your built-in camera feed. MediaPipe Pose performs joint tracking directly on your device, ensuring complete privacy.'
    },
    {
      q: 'Can I install Athlix as an app?',
      a: 'Yes, Athlix is a Progressive Web App (PWA). You can tap "Add to Home Screen" in your browser menu on iOS or Chrome on Android, and it will install with offline storage support and launch full-screen.'
    },
    {
      q: 'Is there a free trial for AI services?',
      a: 'Absolutely. Athlix offers a fully functional Free Tier which includes habit logs, weight charts, and basic templates. Premium features like GPT-4o custom plans and real-time vision analyses are included in our Pro trials.'
    }
  ];

  return (
    <div className="min-h-screen bg-bg-app text-text-main overflow-x-hidden selection:bg-primary selection:text-white">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-border-custom px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-btn flex items-center justify-center font-heading font-extrabold text-lg tracking-wider text-white shadow-glow">
            A
          </div>
          <span className="font-heading font-extrabold text-xl tracking-wide bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent">
            ATHLIX
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-text-muted">
          <a href="#features" className="hover:text-text-main transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-text-main transition-colors">How It Works</a>
          <a href="#pricing" className="hover:text-text-main transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-text-main transition-colors">FAQ</a>
        </div>

        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <Link to="/dashboard" className="px-5 py-2.5 rounded-xl gradient-btn text-sm font-semibold flex items-center gap-2">
              Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-text-muted hover:text-text-main transition-colors">
                Log In
              </Link>
              <Link to="/register" className="px-5 py-2.5 rounded-xl gradient-btn text-sm font-semibold">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-text-muted hover:text-text-main">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-40 bg-bg-app/95 backdrop-blur-lg flex flex-col p-6 gap-6 md:hidden">
          <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-lg text-text-muted">Features</a>
          <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-lg text-text-muted">How It Works</a>
          <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="text-lg text-text-muted">Pricing</a>
          <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="text-lg text-text-muted">FAQ</a>
          <hr className="border-border-custom my-2" />
          {isAuthenticated ? (
            <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="py-3 rounded-xl gradient-btn text-center font-semibold">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-center py-2 text-text-muted">
                Log In
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="py-3 rounded-xl gradient-btn text-center font-semibold">
                Get Started
              </Link>
            </>
          )}
        </div>
      )}

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 px-6 flex flex-col items-center text-center overflow-hidden">
        {/* Decorative background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-accent/15 rounded-full blur-[100px] pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-bg-surface-alt border border-border-custom text-xs font-semibold text-primary-light mb-6 shadow-glow">
            <Sparkles className="w-3.5 h-3.5" /> Next Generation AI Fitness Coaching PWA
          </div>
          <h1 className="font-heading font-extrabold text-4xl sm:text-6xl md:text-7.5xl leading-tight tracking-tight text-text-main mb-6">
            The Complete Fitness Studio <br />
            <span className="bg-gradient-to-r from-[#A78BFA] via-[#06B6D4] to-[#7C3AED] bg-clip-text text-transparent">
              Powered by Real AI.
            </span>
          </h1>
          <p className="text-base sm:text-xl text-text-muted max-w-2xl mx-auto mb-10 leading-relaxed font-sans">
            Athlix brings together diet estimation, workout design, camera form alignment, and coaching feedback into a single premium Progressive Web App. Installable on any device.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link to={isAuthenticated ? '/dashboard' : '/register'} className="w-full sm:w-auto px-8 py-4 rounded-2xl gradient-btn text-base font-bold flex items-center justify-center gap-3">
              {isAuthenticated ? 'Enter Dashboard' : 'Start Free Trial'} <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#features" className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-bg-surface-alt hover:bg-bg-surface border border-border-custom text-base font-bold transition-all text-text-muted hover:text-text-main text-center">
              Explore Features
            </a>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 md:py-28 px-6 max-w-7xl mx-auto relative">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-text-main mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-text-muted max-w-lg mx-auto">
            Stop switching between distinct tracking apps. Athlix unites nutrition, programming, and execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-panel p-8 rounded-3xl relative overflow-hidden group hover:border-primary/30 transition-all duration-300"
              >
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${feat.color} opacity-5 group-hover:opacity-10 blur-xl transition-opacity`} />
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feat.color} flex items-center justify-center text-white mb-6 shadow-premium`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-xl text-text-main mb-3">
                  {feat.title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed font-sans">
                  {feat.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 md:py-28 bg-bg-surface border-y border-border-custom px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 md:mb-24">
            <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-text-main mb-4">
              How Athlix Transforms Your Fitness
            </h2>
            <p className="text-text-muted max-w-lg mx-auto">
              Three simple steps to unlock high-fidelity tracking and AI coaching.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-heading font-extrabold text-2xl text-primary-light mb-6 shadow-glow">
                1
              </div>
              <h3 className="font-heading font-bold text-xl text-text-main mb-3">Create Profile</h3>
              <p className="text-sm text-text-muted max-w-xs leading-relaxed">
                Provide your height, weight, goals, experience level, and available equipment in our wizard.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center font-heading font-extrabold text-2xl text-accent mb-6 shadow-glow">
                2
              </div>
              <h3 className="font-heading font-bold text-xl text-text-main mb-3">Generate Plan</h3>
              <p className="text-sm text-text-muted max-w-xs leading-relaxed">
                Let GPT-4o design a custom workout and meal structure tailored specifically to you.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100/10 border border-emerald-500/20 flex items-center justify-center font-heading font-extrabold text-2xl text-emerald-400 mb-6 shadow-glow">
                3
              </div>
              <h3 className="font-heading font-bold text-xl text-text-main mb-3">Execute & Analyze</h3>
              <p className="text-sm text-text-muted max-w-xs leading-relaxed">
                Use your camera for real-time form checks, track water & macros daily, and watch progress charts soar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-text-main mb-4">
            Coaches & Athletes Love Athlix
          </h2>
          <p className="text-text-muted">
            Hear from our members who replaced multiple subscriptions with one smart app.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-8 rounded-3xl">
            <div className="flex items-center gap-1 text-amber-500 mb-4">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
            </div>
            <p className="text-sm text-text-muted italic mb-6">
              "The AI nutrition image analyzer is a game-changer. I just take a photo of my lunch bowl, check the estimated protein, and press save. Seamless!"
            </p>
            <div className="flex items-center gap-4">
              <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100" className="w-10 h-10 rounded-full object-cover" alt="User avatar" />
              <div>
                <h4 className="font-heading font-semibold text-sm text-text-main">David K.</h4>
                <span className="text-xs text-text-muted">Amateur Powerlifter</span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-3xl">
            <div className="flex items-center gap-1 text-amber-500 mb-4">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
            </div>
            <p className="text-sm text-text-muted italic mb-6">
              "Squatting depth checking via web-cam works incredibly well. The voice coach prompts me when I don't reach parallel, which helps me focus on form."
            </p>
            <div className="flex items-center gap-4">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" className="w-10 h-10 rounded-full object-cover" alt="User avatar" />
              <div>
                <h4 className="font-heading font-semibold text-sm text-text-main">Sarah T.</h4>
                <span className="text-xs text-text-muted">Crossfit Enthusiast</span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-3xl">
            <div className="flex items-center gap-1 text-amber-500 mb-4">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
            </div>
            <p className="text-sm text-text-muted italic mb-6">
              "Chatting with the AI coach is like talking to a real personal trainer. It knows my equipment limits and suggests alternate workouts instantly."
            </p>
            <div className="flex items-center gap-4">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" className="w-10 h-10 rounded-full object-cover" alt="User avatar" />
              <div>
                <h4 className="font-heading font-semibold text-sm text-text-main">Marcus L.</h4>
                <span className="text-xs text-text-muted">Calisthenics Athlete</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 md:py-28 bg-bg-surface px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-text-main mb-4">
              Transparent, Flexible Plans
            </h2>
            <p className="text-text-muted">
              Start free and scale up as you unlock heavy routines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <div className="glass-panel p-8 rounded-3xl flex flex-col justify-between">
              <div>
                <h3 className="font-heading font-extrabold text-lg text-text-muted uppercase tracking-wider mb-2">Free</h3>
                <div className="text-3xl font-heading font-extrabold text-text-main mb-6">$0</div>
                <ul className="text-sm text-text-muted flex flex-col gap-3.5 mb-8">
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary-light" /> Local weight tracking</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary-light" /> Standard habit planner</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary-light" /> Exercise library browsing</li>
                </ul>
              </div>
              <Link to="/register" className="py-3 rounded-2xl border border-border-custom hover:bg-bg-surface-alt text-center text-sm font-semibold transition-all">
                Get Started
              </Link>
            </div>

            {/* Pro */}
            <div className="glass-panel p-8 rounded-3xl border-primary/50 relative overflow-hidden flex flex-col justify-between shadow-premium">
              <div className="absolute top-0 right-0 px-4 py-1.5 bg-primary text-[10px] font-bold text-white uppercase tracking-wider rounded-bl-2xl">
                Most Popular
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-lg text-primary-light uppercase tracking-wider mb-2">Pro</h3>
                <div className="text-3xl font-heading font-extrabold text-text-main mb-6">$9.99<span className="text-sm text-text-muted font-normal">/mo</span></div>
                <ul className="text-sm text-text-muted flex flex-col gap-3.5 mb-8">
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-accent" /> Unlimited AI workout builds</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-accent" /> AI Food photo calorie estimation</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-accent" /> Live webcam Form analysis</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-accent" /> Chat Coach history sync</li>
                </ul>
              </div>
              <Link to="/register" className="py-3 rounded-2xl gradient-btn text-center text-sm font-semibold">
                Start Free Trial
              </Link>
            </div>

            {/* Elite */}
            <div className="glass-panel p-8 rounded-3xl flex flex-col justify-between">
              <div>
                <h3 className="font-heading font-extrabold text-lg text-text-muted uppercase tracking-wider mb-2">Elite</h3>
                <div className="text-3xl font-heading font-extrabold text-text-main mb-6">$29.99<span className="text-sm text-text-muted font-normal">/mo</span></div>
                <ul className="text-sm text-text-muted flex flex-col gap-3.5 mb-8">
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary-light" /> Custom nutritionist audits</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary-light" /> Unlocked coaching calls</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary-light" /> Early access beta trackers</li>
                </ul>
              </div>
              <Link to="/register" className="py-3 rounded-2xl border border-border-custom hover:bg-bg-surface-alt text-center text-sm font-semibold transition-all">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section id="faq" className="py-20 md:py-28 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-text-main mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-text-muted">
            Got queries? We have answers.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div 
                key={index} 
                className="glass-panel rounded-2xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left font-heading font-bold text-base text-text-main hover:text-primary-light transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-text-muted transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-sm text-text-muted leading-relaxed font-sans">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-custom py-12 px-6 bg-bg-surface text-center text-sm text-text-muted font-sans">
        <div className="flex justify-center items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg gradient-btn flex items-center justify-center font-heading font-extrabold text-sm text-white">
            A
          </div>
          <span className="font-heading font-extrabold text-base tracking-wide bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent">
            ATHLIX
          </span>
        </div>
        <p className="mb-6">Personal health and wellness coaching Progressive Web App.</p>
        <p className="text-xs">&copy; {new Date().getFullYear()} Athlix Inc. All rights reserved.</p>
      </footer>
    </div>
  );
};
