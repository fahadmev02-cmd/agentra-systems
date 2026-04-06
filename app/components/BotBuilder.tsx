"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  Globe,
  Phone,
  Send,
  Layers,
  ChevronRight,
  Sparkles,
  DollarSign,
  Clock,
  TrendingUp,
  RotateCcw,
} from "lucide-react";

const platforms = [
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  { id: "website", label: "Website Chat", icon: Globe },
  { id: "ivr", label: "IVR / Voice", icon: Phone },
  { id: "telegram", label: "Telegram", icon: Send },
  { id: "multi", label: "Multi-channel", icon: Layers },
];

const useCases = [
  "Sales & Lead Gen",
  "Customer Support",
  "Appointment Booking",
  "Lead Qualification",
  "Internal Ops",
  "Custom Workflow",
];

const budgets = [
  { id: "starter", label: "Starter", range: "$500 - $1,500" },
  { id: "growth", label: "Growth", range: "$1,500 - $5,000" },
  { id: "scale", label: "Scale", range: "$5,000 - $15,000" },
  { id: "custom", label: "Enterprise", range: "Custom" },
];

export default function BotBuilder() {
  const [step, setStep] = useState(1);
  const [platform, setPlatform] = useState("");
  const [useCase, setUseCase] = useState("");
  const [budget, setBudget] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<{
    solution: string;
    price: string;
    timeline: string;
    roi: string;
  } | null>(null);

  const generate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const platformLabel =
        platforms.find((item) => item.id === platform)?.label || platform;
      setResult({
        solution: `${platformLabel} ${useCase} AI Agent — automated end-to-end with CRM integration, smart routing and analytics.`,
        price: budgets.find((item) => item.id === budget)?.range || "$2K - $5K",
        timeline:
          budget === "starter"
            ? "5 - 7 days"
            : budget === "growth"
              ? "10 - 14 days"
              : "3 - 4 weeks",
        roi: "80 - 95% reduction in manual response time",
      });
      setIsGenerating(false);
    }, 2500);
  };

  const reset = () => {
    setStep(1);
    setPlatform("");
    setUseCase("");
    setBudget("");
    setResult(null);
    setIsGenerating(false);
  };

  return (
    <section id="builder" className="relative py-24 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-purple/5 to-transparent" />
      <div className="relative mx-auto max-w-4xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-purple/20 bg-brand-purple/5 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-brand-purple mb-6">
            AI Bot Builder
          </span>
          <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">
            Design Your AI Agent <span className="text-gradient">in 30 Seconds</span>
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            Answer 3 questions and get a personalized recommendation.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl glass-strong p-8 md:p-10"
        >
          <div className="mb-8 flex items-center gap-2">
            {[1, 2, 3].map((progressStep) => (
              <div key={progressStep} className="flex-1 flex items-center gap-2">
                <div
                  className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                    step >= progressStep
                      ? "bg-gradient-to-r from-brand-blue to-brand-purple"
                      : "bg-white/10"
                  }`}
                />
                {progressStep < 3 && (
                  <ChevronRight className="h-4 w-4 text-slate-600" />
                )}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && !result && !isGenerating && (
              <motion.div
                key="s1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className="text-xl font-semibold mb-6">1. Choose Your Platform</h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                  {platforms.map((platformItem) => {
                    const Icon = platformItem.icon;
                    return (
                      <button
                        key={platformItem.id}
                        onClick={() => {
                          setPlatform(platformItem.id);
                          setStep(2);
                        }}
                        className={`rounded-2xl border p-4 text-center transition-all hover:scale-105 ${
                          platform === platformItem.id
                            ? "border-brand-blue bg-brand-blue/10"
                            : "border-white/10 bg-white/5"
                        }`}
                      >
                        <Icon className="mx-auto mb-2 h-6 w-6 text-slate-300" />
                        <span className="text-xs font-medium">{platformItem.label}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === 2 && !result && !isGenerating && (
              <motion.div
                key="s2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className="text-xl font-semibold mb-6">2. Select Use Case</h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {useCases.map((useCaseItem) => (
                    <button
                      key={useCaseItem}
                      onClick={() => {
                        setUseCase(useCaseItem);
                        setStep(3);
                      }}
                      className={`rounded-2xl border p-4 text-sm font-medium transition-all hover:scale-105 ${
                        useCase === useCaseItem
                          ? "border-brand-purple bg-brand-purple/10"
                          : "border-white/10 bg-white/5"
                      }`}
                    >
                      {useCaseItem}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="mt-4 text-sm text-slate-500 hover:text-slate-300"
                >
                  ← Back
                </button>
              </motion.div>
            )}

            {step === 3 && !result && !isGenerating && (
              <motion.div
                key="s3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className="text-xl font-semibold mb-6">3. Select Budget Range</h3>
                <div className="grid grid-cols-2 gap-3">
                  {budgets.map((budgetItem) => (
                    <button
                      key={budgetItem.id}
                      onClick={() => {
                        setBudget(budgetItem.id);
                        generate();
                      }}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition-all hover:scale-105 hover:border-white/20"
                    >
                      <p className="font-semibold">{budgetItem.label}</p>
                      <p className="text-sm text-slate-400">{budgetItem.range}</p>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setStep(2)}
                  className="mt-4 text-sm text-slate-500 hover:text-slate-300"
                >
                  ← Back
                </button>
              </motion.div>
            )}

            {isGenerating && (
              <motion.div
                key="gen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-12 text-center"
              >
                <Sparkles className="mx-auto h-10 w-10 text-brand-purple animate-pulse mb-4" />
                <p className="text-lg font-medium">Analyzing business requirements...</p>
                <p className="text-sm text-slate-400 mt-2">
                  Generating recommended AI stack...
                </p>
              </motion.div>
            )}

            {result && (
              <motion.div
                key="res"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Your AI Agent Recommendation</h3>
                  <button
                    onClick={reset}
                    className="flex items-center gap-1 text-sm text-slate-400 hover:text-white"
                  >
                    <RotateCcw className="h-4 w-4" /> Restart
                  </button>
                </div>
                <div className="rounded-2xl border border-brand-blue/20 bg-brand-blue/5 p-6 mb-6">
                  <p className="text-sm text-slate-400 mb-2">Suggested Build</p>
                  <p className="text-lg font-medium">{result.solution}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  {[
                    {
                      icon: DollarSign,
                      label: "Est. Cost",
                      value: result.price,
                      color: "text-brand-green",
                    },
                    {
                      icon: Clock,
                      label: "Timeline",
                      value: result.timeline,
                      color: "text-brand-cyan",
                    },
                    {
                      icon: TrendingUp,
                      label: "ROI Impact",
                      value: result.roi,
                      color: "text-brand-purple",
                    },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.label}
                        className="rounded-xl border border-white/10 bg-white/5 p-4 text-center"
                      >
                        <Icon className={`mx-auto h-5 w-5 mb-2 ${item.color}`} />
                        <p className="text-xs text-slate-400">{item.label}</p>
                        <p className="text-sm font-semibold mt-1">{item.value}</p>
                      </div>
                    );
                  })}
                </div>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="#cta"
                    className="rounded-full bg-gradient-to-r from-brand-blue to-brand-purple px-6 py-3 font-medium text-white hover:scale-105 transition-transform"
                  >
                    Start Build →
                  </a>
                  <a
                    href="#cta"
                    className="rounded-full border border-white/10 bg-white/5 px-6 py-3 font-medium hover:bg-white/10"
                  >
                    Get Proposal on WhatsApp
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
