"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Activity, Bot, Database, MessageSquareMore } from "lucide-react";
import { useLiveSiteData } from "@/app/components/useLiveSiteData";

const signalFeed = ["Neural routing", "Lead scoring", "Voice AI", "CRM relay", "Agent uptime"];

export default function SystemPulse() {
  const shouldReduceMotion = useReducedMotion();
  const { metrics } = useLiveSiteData();

  const pulseItems = [
    {
      icon: MessageSquareMore,
      label: "Leads Captured",
      value: `${metrics.totalLeadsCaptured}`,
      tone: "text-brand-blue",
    },
    {
      icon: Bot,
      label: "Voice Sessions",
      value: `${metrics.totalVoiceSessions}`,
      tone: "text-brand-purple",
    },
    {
      icon: Database,
      label: "Qualified Leads",
      value: `${metrics.totalQualifiedLeads}`,
      tone: "text-brand-cyan",
    },
    {
      icon: Activity,
      label: "Completion Rate",
      value: `${metrics.qualificationRate}%`,
      tone: "text-brand-green",
    },
  ];

  const liveSignalCopy = metrics.featuredBusinessTypes.length
    ? `Recent demand from ${metrics.featuredBusinessTypes.join(", ")} businesses is flowing through the AI stack.`
    : "Every lead, call, and sync is now visualized from your real capture pipeline.";

  return (
    <section className="relative py-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="rounded-3xl border border-white/5 bg-white/[0.03] p-4 md:p-6">
          <div className="mb-4 overflow-hidden rounded-2xl border border-white/5 bg-black/20 px-4 py-3">
            <motion.div
              animate={shouldReduceMotion ? { x: 0 } : { x: [0, -180] }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 18, repeat: Infinity, ease: "linear" }}
              className="flex min-w-max flex-wrap items-center gap-6 text-[11px] uppercase tracking-[0.18em] text-slate-400 md:flex-nowrap md:tracking-[0.24em]"
            >
              {[...signalFeed, ...signalFeed].map((item, index) => (
                <div key={`${item}-${index}`} className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-brand-cyan" />
                  <span>{item}</span>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-[repeat(4,minmax(0,1fr))_1.2fr]">
            {pulseItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="rounded-2xl border border-white/5 bg-black/10 p-5"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-500">{item.label}</p>
                    <Icon className={`h-4 w-4 ${item.tone}`} />
                  </div>
                  <p className={`mt-3 text-3xl font-bold ${item.tone}`}>
                    {item.value}
                  </p>
                </motion.div>
              );
            })}

            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.28 }}
              className="relative hidden overflow-hidden rounded-2xl border border-white/5 bg-black/20 xl:block"
            >
              <Image
                src="/art/neural-vault.svg"
                alt="Futuristic lead intelligence scene"
                width={900}
                height={680}
                className="h-full w-full object-cover opacity-90"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-brand-cyan">
                  Live Signal
                </p>
                <p className="mt-2 text-sm font-medium text-white">
                  {liveSignalCopy}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}