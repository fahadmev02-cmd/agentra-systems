"use client";
import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { MessageCircle, Headphones, Phone, Target, Sparkles, X } from "lucide-react";
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

type DemoConversation = {
  user: string;
  agent: string;
};

function buildDemoConversation(title: string, primaryMessage: string, responseMessage: string): DemoConversation[] {
  return [
    {
      user: `I want to see how the ${title.toLowerCase()} works for my business.`,
      agent: responseMessage,
    },
    {
      user: "What will the AI actually handle for me?",
      agent: primaryMessage,
    },
    {
      user: "What happens after a lead replies?",
      agent: "The system qualifies the lead, captures contact details, tags the requirement, and routes the conversation into your workflow or admin pipeline.",
    },
  ];
}

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

function InteractiveDemoModal({
  card,
  onClose,
}: {
  card: ReturnType<typeof useLiveSiteData>["demoCards"][number];
  onClose: () => void;
}) {
  const theme = toneMap[card.tone];
  const conversation = useMemo(
    () => buildDemoConversation(card.title, card.primaryMessage, card.responseMessage),
    [card.primaryMessage, card.responseMessage, card.title],
  );
  const [step, setStep] = useState(0);
  const activeConversation = conversation.slice(0, step + 1);

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-[#08101f] shadow-2xl shadow-black/40">
        <div className={`flex items-start justify-between gap-4 border-b px-6 py-5 ${theme.borderColor}`}>
          <div>
            <p className={`text-xs uppercase tracking-[0.2em] ${theme.color}`}>Interactive Demo Agent</p>
            <h3 className="mt-2 text-2xl font-bold text-white">{card.title}</h3>
            <p className="mt-2 text-sm text-slate-400">This is a clickable product demo. It is not a real lead record.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 p-2 text-slate-400 transition-colors hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <div className="mb-4 flex items-center gap-2 text-sm text-slate-400">
              <Sparkles className={`h-4 w-4 ${theme.color}`} />
              Demo conversation
            </div>
            <div className="space-y-4">
              {activeConversation.map((item, index) => (
                <div key={`${item.user}-${index}`} className="space-y-3">
                  <div className="flex justify-end">
                    <div className="max-w-[88%] rounded-2xl rounded-br-md bg-gradient-to-r from-brand-blue to-brand-purple px-4 py-3 text-sm text-white">
                      {item.user}
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="max-w-[88%] rounded-2xl rounded-bl-md bg-white/5 px-4 py-3 text-sm text-slate-200">
                      {item.agent}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setStep((current) => Math.min(conversation.length - 1, current + 1))}
                disabled={step >= conversation.length - 1}
                className="rounded-full bg-gradient-to-r from-brand-blue to-brand-purple px-5 py-3 text-sm font-semibold text-white transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Continue Demo
              </button>
              <button
                type="button"
                onClick={() => setStep(0)}
                className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 transition-colors hover:bg-white/10"
              >
                Restart
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">What this demo shows</p>
            <div className="mt-4 space-y-4 text-sm text-slate-300">
              <p>{card.primaryMessage}</p>
              <p>{card.responseMessage}</p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {card.chips.map((chip) => (
                <span key={chip} className={`rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] ${theme.bgColor} ${theme.color}`}>
                  {chip}
                </span>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-cyan-300/10 bg-cyan-300/5 p-4 text-sm text-slate-300">
              Click <span className="font-semibold text-white">Continue Demo</span> to see the agent reply in real time inside this modal.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DemoShowroom() {
  const { demoCards } = useLiveSiteData();
  const hasLiveCards = demoCards.some((card) => card.sourceLabel !== "Showcase Demo");
  const [selectedCard, setSelectedCard] = useState<ReturnType<typeof useLiveSiteData>["demoCards"][number] | null>(null);

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
          <p className="mt-3 text-sm text-slate-500 max-w-2xl mx-auto">
            Click any card below to open an interactive demo agent.
          </p>
        </motion.div>
        <div className="grid gap-6 md:grid-cols-2">
          {demoCards.length > 0 ? (
            demoCards.map((card) => (
              <button
                key={card.id}
                type="button"
                onClick={() => setSelectedCard(card)}
                className="text-left transition-transform hover:scale-[1.01]"
              >
                <LiveLeadCard card={card} />
              </button>
            ))
          ) : (
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center text-slate-400 md:col-span-2">
              As soon as new inquiries or voice sessions are captured, this feed will populate automatically.
            </div>
          )}
        </div>
      </div>
      {selectedCard ? <InteractiveDemoModal card={selectedCard} onClose={() => setSelectedCard(null)} /> : null}
    </section>
  );
}
