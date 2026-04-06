"use client";
import { motion, useReducedMotion } from "framer-motion";
import { MessageCircle, Headphones, Phone, Target } from "lucide-react";
import { useLiveSiteData } from "@/app/components/useLiveSiteData";
const toneMap = {
  blue: {
    icon: MessageCircle,
    color: "text-brand-blue",
    bgColor: "bg-brand-blue/10",
    borderColor: "border-brand-blue/20",
  },
  cyan: {
    icon: Phone,
    color: "text-brand-cyan",
    bgColor: "bg-brand-cyan/10",
    borderColor: "border-brand-cyan/20",
  },
  purple: {
    icon: Target,
    color: "text-brand-purple",
    bgColor: "bg-brand-purple/10",
    borderColor: "border-brand-purple/20",
  },
  green: {
    icon: Headphones,
    color: "text-brand-green",
    bgColor: "bg-brand-green/10",
    borderColor: "border-brand-green/20",
  },
};

function LiveLeadCard({ card }: { card: ReturnType<typeof useLiveSiteData>["demoCards"][number] }) {
  const shouldReduceMotion = useReducedMotion();
  const theme = toneMap[card.tone];
  const Icon = theme.icon;

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
      className={`rounded-3xl border ${theme.borderColor} glass overflow-hidden`}
    >
      <div className={`${theme.bgColor} border-b px-6 py-4 ${theme.borderColor}`}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`rounded-xl p-2 ${theme.bgColor}`}>
              <Icon className={`h-5 w-5 ${theme.color}`} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">{card.title}</h3>
              <p className="text-xs text-slate-400">{card.subtitle}</p>
            </div>
          </div>
          <span className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] ${theme.bgColor} ${theme.color}`}>
            {card.status}
          </span>
        </div>
      </div>

      <div className="space-y-3 p-4">
        <div className="flex justify-end">
          <div className="max-w-[88%] rounded-2xl rounded-br-md bg-gradient-to-r from-brand-blue to-brand-purple px-4 py-3 text-sm text-white">
            {card.primaryMessage}
          </div>
        </div>
        <div className="flex justify-start">
          <div className="max-w-[88%] rounded-2xl rounded-bl-md bg-white/5 px-4 py-3 text-sm text-slate-200">
            {card.responseMessage}
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 p-4">
        <div className="flex flex-wrap gap-2">
          {card.chips.map((chip) => (
            <span key={chip} className={`rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] ${theme.bgColor} ${theme.color}`}>
              {chip}
            </span>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-400">{card.contact}</p>
      </div>
    </motion.div>
  );
}

export default function DemoShowroom() {
  const { demoCards } = useLiveSiteData();
  const hasLiveCards = demoCards.some((card) => card.sourceLabel !== "Showcase Demo");

  return (
    <section id="demos" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-blue/20 bg-brand-blue/5 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-brand-blue mb-6">
            Live Lead Feed
          </span>
          <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">
            Demo Workflows. <span className="text-gradient">Live When Available.</span>
          </h2>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
            {hasLiveCards
              ? "This showcase prioritizes real captured workflows and fills any empty slots with polished demo scenarios."
              : "This showcase is currently displaying polished demo scenarios until more qualified live records are available."}
          </p>
        </motion.div>
        <div className="grid gap-6 md:grid-cols-2">
          {demoCards.length > 0 ? (
            demoCards.map((card) => <LiveLeadCard key={card.id} card={card} />)
          ) : (
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center text-slate-400 md:col-span-2">
              As soon as new inquiries or voice sessions are captured, this feed will populate automatically.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
