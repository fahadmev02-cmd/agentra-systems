"use client";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import {
  ArrowRight,
  Play,
  MessageSquare,
  Bot,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { useLiveSiteData } from "@/app/components/useLiveSiteData";

const heroParticles = [
  { left: "12%", top: "18%", duration: 3.2, delay: 0.1 },
  { left: "24%", top: "72%", duration: 4.6, delay: 0.8 },
  { left: "31%", top: "34%", duration: 5.1, delay: 0.3 },
  { left: "43%", top: "82%", duration: 3.8, delay: 1.1 },
  { left: "57%", top: "26%", duration: 6.2, delay: 0.5 },
  { left: "64%", top: "58%", duration: 4.1, delay: 1.4 },
  { left: "71%", top: "14%", duration: 5.7, delay: 0.2 },
  { left: "83%", top: "41%", duration: 3.5, delay: 0.9 },
  { left: "91%", top: "67%", duration: 4.9, delay: 1.6 },
  { left: "18%", top: "48%", duration: 5.4, delay: 0.4 },
  { left: "28%", top: "8%", duration: 3.9, delay: 1.3 },
  { left: "49%", top: "63%", duration: 6.4, delay: 0.7 },
  { left: "59%", top: "88%", duration: 4.3, delay: 1.8 },
  { left: "76%", top: "76%", duration: 5.8, delay: 0.6 },
  { left: "88%", top: "22%", duration: 3.6, delay: 1.2 },
];

const heroArtwork = [
  {
    title: "Neural Vault",
    tag: "Lead intelligence",
    image: "/art/neural-vault.svg",
    className: "bottom-2 -left-12 w-56",
  },
];

export default function HeroSection() {
  const shouldReduceMotion = useReducedMotion();
  const { metrics } = useLiveSiteData();
  const [typedText, setTypedText] = useState("");
  const [activeEvent, setActiveEvent] = useState(0);
  const headline = "AI Agents That Replace Human Work";
  const accentStart = headline.indexOf("Human Work");
  const baseText = typedText.slice(0, accentStart);
  const accentText = typedText.slice(accentStart);
  const panelEvents = [
    {
      icon: MessageSquare,
      label: "Website inquiries",
      text: `${metrics.totalWebsiteInquiries} business requests captured from the site`,
      color: "border-brand-blue/30 bg-brand-blue/10",
    },
    {
      icon: Bot,
      label: "Voice AI sessions",
      text: `${metrics.totalVoiceSessions} strategy calls launched through the AI flow`,
      color: "border-brand-purple/30 bg-brand-purple/10",
    },
    {
      icon: Calendar,
      label: "Qualified leads",
      text: `${metrics.totalQualifiedLeads} leads exported into the Excel pipeline`,
      color: "border-brand-cyan/30 bg-brand-cyan/10",
    },
    {
      icon: TrendingUp,
      label: "Completion rate",
      text: `${metrics.qualificationRate}% of voice sessions are being completed`,
      color: "border-brand-green/30 bg-brand-green/10",
    },
  ];

  useEffect(() => {
    if (shouldReduceMotion) {
      setTypedText(headline);
      return;
    }

    let i = 0;
    const interval = setInterval(() => {
      if (i <= headline.length) {
        setTypedText(headline.slice(0, i));
        i++;
      } else clearInterval(interval);
    }, 45);
    return () => clearInterval(interval);
  }, [headline, shouldReduceMotion]);

  useEffect(() => {
    if (shouldReduceMotion) {
      return;
    }

    const interval = setInterval(() => {
      setActiveEvent((prev) => (prev + 1) % panelEvents.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [shouldReduceMotion]);

  return (
    <section className="relative min-h-screen overflow-hidden pt-20">
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-16 hidden h-[520px] w-[520px] -translate-x-1/2 rounded-full border border-cyan-300/20 halo-ring lg:block" />
        <div className="absolute left-1/2 top-16 hidden h-[520px] w-[520px] -translate-x-1/2 rounded-full border border-blue-400/15 halo-ring [animation-direction:reverse] lg:block" />
        <div className="absolute top-0 right-0 h-[320px] w-[320px] rounded-full bg-cyan-400/10 blur-[72px] md:h-[460px] md:w-[460px] md:blur-[96px] lg:h-[600px] lg:w-[600px] lg:blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[260px] w-[260px] rounded-full bg-blue-500/10 blur-[72px] md:h-[380px] md:w-[380px] md:blur-[96px] lg:h-[500px] lg:w-[500px] lg:blur-[120px]" />
        <div className="absolute left-1/2 top-24 hidden h-48 w-px -translate-x-1/2 bg-gradient-to-b from-cyan-300/0 via-cyan-300/80 to-cyan-300/0 opacity-90 md:block" />
        {!shouldReduceMotion && heroParticles.slice(0, 8).map((particle, i) => (
          <motion.div
            key={i}
            className={`absolute h-1 w-1 rounded-full bg-brand-blue/30 ${i > 4 ? "hidden md:block" : ""}`}
            style={{
              left: particle.left,
              top: particle.top,
            }}
            animate={{ y: [0, -30, 0], opacity: [0.2, 0.8, 0.2] }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid min-h-[calc(100vh-5rem)] items-center gap-12 py-20 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55 }}
          >
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-cyan/20 bg-brand-cyan/5 px-4 py-1.5"
            >
              <span className="h-2 w-2 rounded-full bg-brand-cyan animate-pulse" />
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-brand-cyan">
                Live AI Showroom • {metrics.liveCallSessions} Active Calls
              </span>
            </motion.div>

            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="text-white">{baseText}</span>
              <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(56,189,248,0.16)]">
                {accentText}
              </span>
                <span className="ml-1 inline-block h-[0.9em] w-[3px] animate-pulse align-middle bg-cyan-300" />
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-400 md:text-xl">
              From WhatsApp bots to full business automation — we build systems
              that capture leads, answer customers, and run operations{" "}
              <span className="text-white font-medium">24/7</span>.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 text-xs uppercase tracking-[0.18em] text-slate-400">
              {[
                "Voice AI Qualification",
                "WhatsApp Automation",
                metrics.featuredBusinessTypes[0]
                  ? `${metrics.featuredBusinessTypes[0]} Workflows`
                  : "Realtime CRM Sync",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-cyan-300/10 bg-slate-900/70 px-4 py-2 text-slate-300 backdrop-blur"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#demos"
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 via-brand-blue to-blue-600 px-7 py-3.5 font-medium text-white shadow-lg shadow-cyan-500/20 transition-all hover:shadow-cyan-400/40 hover:scale-105 active:scale-95"
              >
                <Play className="h-4 w-4" />
                Try Live Demo
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#cta"
                className="inline-flex items-center gap-2 rounded-full border border-cyan-300/10 bg-slate-900/60 px-7 py-3.5 font-medium backdrop-blur transition-all hover:border-cyan-300/25 hover:bg-slate-800/70"
              >
                Get Your AI Agent
              </a>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-4">
              <span className="text-xs uppercase tracking-wider text-slate-500">
                Powered by
              </span>
              {["OpenAI", "Twilio", "WhatsApp", "Meta"].map((name) => (
                <span
                  key={name}
                  className="rounded-lg border border-white/5 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-400"
                >
                  {name}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="relative hidden lg:block"
          >
            {heroArtwork.map((art, index) => (
              <motion.div
                key={art.title}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
                animate={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: [0, -6, 0] }}
                transition={shouldReduceMotion ? { duration: 0.3 } : { duration: 8, delay: 0.25 + index * 0.2, repeat: Infinity }}
                className={`absolute z-20 overflow-hidden rounded-2xl border border-cyan-300/10 bg-slate-950/70 p-2 ${art.className}`}
              >
                <div className="overflow-hidden rounded-xl border border-white/10">
                  <Image
                    src={art.image}
                    alt={art.title}
                    width={320}
                    height={240}
                    className="h-auto w-full"
                  />
                </div>
                <div className="mt-3 px-1 pb-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white">
                    {art.title}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400">{art.tag}</p>
                </div>
              </motion.div>
            ))}

            <div className={shouldReduceMotion ? "" : "animate-float"}>
              <div className="cyber-frame rounded-[32px] border-cyan-300/10 bg-slate-950/70 p-6 shadow-2xl shadow-cyan-950/30">
                <div className="mb-5 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-400">
                    Agent Control Panel
                  </span>
                  <span className="flex items-center gap-2 rounded-full bg-brand-green/10 px-3 py-1 text-xs font-medium text-brand-green">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-green animate-pulse" />
                    Live
                  </span>
                </div>
                <div className="space-y-3">
                  {panelEvents.map((event, i) => {
                    const Icon = event.icon;
                    return (
                      <motion.div
                        key={i}
                        animate={shouldReduceMotion ? { opacity: 1 } : {
                          scale: activeEvent === i ? 1.01 : 1,
                          opacity: activeEvent === i ? 1 : 0.72,
                        }}
                        transition={{ duration: 0.25 }}
                        className={`flex items-center gap-4 rounded-2xl border p-4 transition-all ${event.color}`}
                      >
                        <Icon className="h-5 w-5 text-slate-300 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-slate-500">{event.label}</p>
                          <p className="mt-0.5 text-sm">{event.text}</p>
                        </div>
                        {activeEvent === i && (
                          <div className="ml-auto h-2 w-2 rounded-full bg-brand-green animate-pulse flex-shrink-0" />
                        )}
                      </motion.div>
                    );
                  })}
                </div>
                <div className="mt-5 grid grid-cols-3 gap-3">
                  {[
                    { label: "Active", value: `${metrics.liveCallSessions}` },
                    { label: "Completed", value: `${metrics.completedVoiceSessions}` },
                    { label: "Leads", value: `${metrics.totalLeadsCaptured}` },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="rounded-xl border border-white/5 bg-white/5 p-3 text-center"
                    >
                      <p className="font-mono text-lg font-bold text-gradient">
                        {s.value}
                      </p>
                      <p className="text-xs text-slate-500">{s.label}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                  <Image
                    src="/art/automation-grid.svg"
                    alt="Automation systems dashboard"
                    width={900}
                    height={640}
                    className="h-auto w-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
