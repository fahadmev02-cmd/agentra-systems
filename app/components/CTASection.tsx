"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  LoaderCircle,
  MessageCircle,
  Phone,
  Mail,
  CheckCircle2,
  User,
  X,
} from "lucide-react";

export default function CTASection() {
  const [leadForm, setLeadForm] = useState({
    name: "",
    businessType: "",
    email: "",
    phoneNumber: "",
    requirement: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [showInstantCallForm, setShowInstantCallForm] = useState(false);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [callError, setCallError] = useState("");
  const [callSuccess, setCallSuccess] = useState("");
  const [isStartingCall, setIsStartingCall] = useState(false);

  const readJsonSafely = async <T,>(response: Response) => {
    const text = await response.text();

    if (!text) {
      return null as T | null;
    }

    try {
      return JSON.parse(text) as T;
    } catch {
      return null as T | null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setIsSubmittingLead(true);

    try {
      const response = await fetch("/api/contact-lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(leadForm),
      });

      const result = await readJsonSafely<{
        error?: string;
      }>(response);

      if (!response.ok) {
        throw new Error(result?.error || "Could not submit your details.");
      }

      setSubmitted(true);
      setLeadForm({
        name: "",
        businessType: "",
        email: "",
        phoneNumber: "",
        requirement: "",
      });
      setTimeout(() => {
        setSubmitted(false);
      }, 3000);
      window.dispatchEvent(new Event("agentra:data-refresh"));
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Could not submit your details.",
      );
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const updateLeadForm = (field: keyof typeof leadForm, value: string) => {
    setLeadForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetCallModal = () => {
    setShowInstantCallForm(false);
    setName("");
    setPhoneNumber("");
    setCallError("");
    setCallSuccess("");
    setIsStartingCall(false);
  };

  const handleCloseCallModal = () => {
    setIsCallModalOpen(false);
    resetCallModal();
  };

  const handleStartCall = async (e: React.FormEvent) => {
    e.preventDefault();
    setCallError("");
    setCallSuccess("");
    setIsStartingCall(true);

    try {
      const response = await fetch("/api/strategy-call", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phoneNumber,
        }),
      });

      const result = await readJsonSafely<{
        error?: string;
        message?: string;
      }>(response);

      if (!response.ok) {
        throw new Error(result?.error || "Could not start the AI call.");
      }

      setCallSuccess(
        result?.message ||
          "The AI assistant is calling now. Keep your phone nearby.",
      );
      setPhoneNumber("");
      setName("");
      window.dispatchEvent(new Event("agentra:data-refresh"));
    } catch (error) {
      setCallError(
        error instanceof Error
          ? error.message
          : "Could not start the AI call.",
      );
    } finally {
      setIsStartingCall(false);
    }
  };

  return (
    <section id="cta" className="relative py-24 lg:py-32">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-[150px]" />
        <div className="absolute right-1/4 top-1/4 h-[420px] w-[420px] rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="overflow-hidden rounded-3xl border border-cyan-300/10 bg-slate-950/70 shadow-[0_30px_120px_rgba(6,12,24,0.55)] backdrop-blur-2xl"
        >
          <div className="grid gap-10 p-8 md:p-12 lg:grid-cols-[0.95fr_1.05fr] lg:p-16">
            <div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="mb-8 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/5 px-4 py-1.5"
              >
                <span className="h-2 w-2 rounded-full bg-brand-green animate-pulse" />
                <span className="text-xs font-medium uppercase tracking-[0.2em] text-cyan-300">
                  Ready To Automate
                </span>
              </motion.div>

              <h2 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
                Stop Hiring For
                <br />
                Repetitive Work.
                <br />
                <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-brand-purple bg-clip-text text-transparent">
                  Start Automating It.
                </span>
              </h2>

              <p className="mt-6 max-w-xl text-lg text-slate-300">
                Tell us what your business does, what kind of customers you serve,
                and where automation can help. We will review it and map the right AI system.
              </p>

              <div className="mt-8 grid gap-3 text-sm text-slate-300">
                {[
                  "Lead capture and qualification flows",
                  "Voice AI, WhatsApp, and support automation",
                  "Custom systems based on your business type",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3"
                  >
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <a
                  href="https://wa.me/1234567890?text=I%20want%20an%20AI%20agent%20for%20my%20business"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-cyan-400 via-brand-blue to-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-cyan-500/25 transition-all hover:scale-105 hover:shadow-cyan-400/40 active:scale-95"
                >
                  <MessageCircle className="h-5 w-5" />
                  Get Your AI Agent
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setIsCallModalOpen(true);
                  }}
                  className="inline-flex items-center gap-3 rounded-full border border-cyan-300/15 bg-white/5 px-8 py-4 text-lg font-semibold backdrop-blur transition-all hover:border-cyan-300/30 hover:bg-white/10"
                >
                  <Phone className="h-5 w-5" />
                  Book Strategy Call
                </button>
              </div>

              <p className="mt-8 text-xs text-slate-500">
                Free workflow audit for qualified businesses • No spam • Reply within 24hrs
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 md:p-8">
              <div className="mb-6">
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
                  Free Workflow Audit
                </p>
                <h3 className="mt-2 text-2xl font-bold text-white md:text-3xl">
                  Share your business details
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  Give us the important info and we will review the best automation setup for your business.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Name
                    </label>
                    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3">
                      <User className="h-4 w-4 text-slate-500" />
                      <input
                        type="text"
                        value={leadForm.name}
                        onChange={(e) => updateLeadForm("name", e.target.value)}
                        placeholder="Your full name"
                        required
                        className="w-full bg-transparent text-sm text-white placeholder-slate-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Type of business
                    </label>
                    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3">
                      <Building2 className="h-4 w-4 text-slate-500" />
                      <input
                        type="text"
                        value={leadForm.businessType}
                        onChange={(e) => updateLeadForm("businessType", e.target.value)}
                        placeholder="Gym, clinic, ecommerce, real estate..."
                        required
                        className="w-full bg-transparent text-sm text-white placeholder-slate-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Email
                    </label>
                    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3">
                      <Mail className="h-4 w-4 text-slate-500" />
                      <input
                        type="email"
                        value={leadForm.email}
                        onChange={(e) => updateLeadForm("email", e.target.value)}
                        placeholder="you@business.com"
                        required
                        className="w-full bg-transparent text-sm text-white placeholder-slate-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Mobile number
                    </label>
                    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3">
                      <Phone className="h-4 w-4 text-slate-500" />
                      <input
                        type="tel"
                        value={leadForm.phoneNumber}
                        onChange={(e) => updateLeadForm("phoneNumber", e.target.value)}
                        placeholder="+92xxxxxxxxxx"
                        required
                        className="w-full bg-transparent text-sm text-white placeholder-slate-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    What do you want to automate?
                  </label>
                  <textarea
                    value={leadForm.requirement}
                    onChange={(e) => updateLeadForm("requirement", e.target.value)}
                    placeholder="Describe your current process, leads, support, bookings, follow-ups, or any custom automation need."
                    rows={5}
                    className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/10"
                  />
                </div>

                {formError && (
                  <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {formError}
                  </p>
                )}

                {submitted && (
                  <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-brand-green/20 bg-brand-green/10 px-4 py-3 text-sm text-brand-green"
                  >
                    Thanks. Your details have been captured and we will reach out soon.
                  </motion.p>
                )}

                <button
                  type="submit"
                  disabled={isSubmittingLead}
                  className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-400 via-brand-blue to-blue-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmittingLead ? (
                    <LoaderCircle className="h-5 w-5 animate-spin" />
                  ) : submitted ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <Mail className="h-5 w-5" />
                  )}
                  Send My Business Details
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>

      {isCallModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#08101f] p-6 shadow-2xl shadow-black/40"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-brand-blue">
                  Strategy Call
                </p>
                <h3 className="mt-2 text-2xl font-bold text-white">
                  Do you want to start the call now?
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  Our AI assistant will call immediately, speak in English,
                  Hindi, or Hinglish, qualify the lead naturally, and save the
                  result into your lead sheet automatically.
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseCallModal}
                className="rounded-full border border-white/10 p-2 text-slate-400 transition-colors hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {!showInstantCallForm ? (
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowInstantCallForm(true);
                    setCallError("");
                    setCallSuccess("");
                  }}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-brand-blue to-brand-purple px-5 py-4 text-base font-semibold text-white transition-transform hover:scale-[1.01]"
                >
                  <Phone className="h-5 w-5" />
                  Yes, start the AI call now
                </button>
                <a
                  href="https://calendly.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-base font-semibold text-slate-200 transition-colors hover:bg-white/10"
                >
                  Schedule Instead
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            ) : (
              <form onSubmit={handleStartCall} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Name (optional)
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-brand-blue/50 focus:ring-2 focus:ring-brand-blue/20"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Phone number
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+92xxxxxxxxxx"
                    required
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-brand-blue/50 focus:ring-2 focus:ring-brand-blue/20"
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    Use international format so the AI can call instantly.
                  </p>
                </div>

                {callError && (
                  <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {callError}
                  </p>
                )}

                {callSuccess && (
                  <p className="rounded-2xl border border-brand-green/20 bg-brand-green/10 px-4 py-3 text-sm text-brand-green">
                    {callSuccess}
                  </p>
                )}

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="submit"
                    disabled={isStartingCall}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-blue to-brand-purple px-5 py-3 font-semibold text-white transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isStartingCall ? (
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : (
                      <Phone className="h-4 w-4" />
                    )}
                    Trigger AI Call
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowInstantCallForm(false)}
                    className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-slate-200 transition-colors hover:bg-white/10"
                  >
                    Back
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </section>
  );
}