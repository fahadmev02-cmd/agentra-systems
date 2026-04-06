"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CalendarDays, Headphones, MessageCircle, Phone, ShieldCheck, Sparkles, Target, X } from "lucide-react";
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

type DemoScenarioId = "sales" | "support" | "booking" | "qualification";

type DemoMessage = {
  speaker: "agent" | "user";
  text: string;
};

type DemoOption = {
  label: string;
  userMessage: string;
  agentReply: string;
};

type DemoStep = {
  prompt: string;
  options: DemoOption[];
};

type DemoScenario = {
  id: DemoScenarioId;
  title: string;
  subtitle: string;
  preview: string;
  detail: string;
  sourceLabel: string;
  chips: string[];
  tone: keyof typeof toneMap;
  steps: DemoStep[];
};

function createDemoScenarios(categoryHint?: string) {
  const category = categoryHint || "service business";

  return [
    {
      id: "sales",
      title: "Sales Demo Agent",
      subtitle: `Closes inbound ${category.toLowerCase()} leads with smart follow-up`,
      preview: "Handles pricing questions, objections, and next-step nudges for new prospects.",
      detail: "Built to convert cold or warm traffic into qualified conversations, callbacks, and booked sales opportunities.",
      sourceLabel: "Interactive Sales Flow",
      chips: ["Sales", "Pricing", "Objection Handling"],
      tone: "blue",
      steps: [
        {
          prompt: "Hi, I can help you compare plans, explain pricing, and qualify the best offer. What does your business need most right now?",
          options: [
            {
              label: "I want more leads",
              userMessage: "I want more leads coming in every week.",
              agentReply: "Then I would position an inbound automation stack: instant lead reply, qualification, and follow-up sequences so your team only handles serious prospects.",
            },
            {
              label: "How much does it cost?",
              userMessage: "How much does an automation setup usually cost?",
              agentReply: "We usually scope by workflow complexity, channels, and integrations. I would first qualify your lead volume and business type, then recommend the right range.",
            },
          ],
        },
        {
          prompt: "I can narrow this down quickly. Which sales bottleneck hurts the most?",
          options: [
            {
              label: "Slow replies",
              userMessage: "My team replies too slowly and we lose leads.",
              agentReply: "That is a strong fit for instant AI replies plus human escalation rules. It reduces response time and keeps hot leads warm automatically.",
            },
            {
              label: "Weak follow-up",
              userMessage: "We get leads, but the follow-up is inconsistent.",
              agentReply: "Then the system should automate reminder sequences, qualification tags, and re-engagement so no serious lead gets dropped.",
            },
          ],
        },
      ],
    },
    {
      id: "support",
      title: "Support Demo Agent",
      subtitle: "Answers common questions and routes complex requests cleanly",
      preview: "Handles support conversations, FAQ coverage, and escalation to your human team.",
      detail: "Built for brands that need 24/7 support coverage without making the experience feel robotic.",
      sourceLabel: "Interactive Support Flow",
      chips: ["Support", "FAQ", "Escalation"],
      tone: "green",
      steps: [
        {
          prompt: "Welcome back. I can help with account issues, pricing questions, and urgent support requests. What should I solve first?",
          options: [
            {
              label: "Need an answer now",
              userMessage: "I need an answer right now without waiting for the team.",
              agentReply: "That is exactly where an FAQ and workflow agent helps. It can resolve repeated questions instantly and escalate edge cases with the full context attached.",
            },
            {
              label: "Need human support",
              userMessage: "I still want a human when it gets complicated.",
              agentReply: "The agent can collect the issue, confirm urgency, and pass the ticket to your team only when human handling is actually needed.",
            },
          ],
        },
        {
          prompt: "Which support metric would you improve first?",
          options: [
            {
              label: "Reduce backlog",
              userMessage: "I need to reduce backlog and ticket load.",
              agentReply: "Then I would automate repetitive support intents first, because that removes the highest-volume requests from your manual queue.",
            },
            {
              label: "Improve satisfaction",
              userMessage: "I want faster and cleaner support replies.",
              agentReply: "Then the best design is instant first-response AI, structured escalation, and message consistency across every channel.",
            },
          ],
        },
      ],
    },
    {
      id: "booking",
      title: "Booking Demo Agent",
      subtitle: "Captures intent and books calls, demos, or appointments automatically",
      preview: "Built for calendars, consultation funnels, and appointment-driven businesses.",
      detail: "Designed to collect the right details before booking so your schedule stays reserved for qualified opportunities.",
      sourceLabel: "Interactive Booking Flow",
      chips: ["Booking", "Scheduling", "Reminders"],
      tone: "cyan",
      steps: [
        {
          prompt: "I can help book a demo, consultation, or appointment. Which experience do you want to automate?",
          options: [
            {
              label: "Sales demos",
              userMessage: "I want visitors to book sales demos directly.",
              agentReply: "Then the agent should qualify budget, business type, and urgency before it exposes your calendar, so your team only speaks with serious prospects.",
            },
            {
              label: "Client appointments",
              userMessage: "I want clients to book appointments without manual back-and-forth.",
              agentReply: "That flow works well with availability checks, reminders, and follow-up confirmation messages across web, voice, or WhatsApp.",
            },
          ],
        },
        {
          prompt: "What causes the most booking friction today?",
          options: [
            {
              label: "Too many no-shows",
              userMessage: "No-shows are wasting our time.",
              agentReply: "Then the workflow should include reminders, confirmation prompts, and rebooking nudges so time slots do not die silently.",
            },
            {
              label: "Manual coordination",
              userMessage: "My team spends too much time coordinating slots manually.",
              agentReply: "Then the booking assistant should handle time selection, collect booking context, and sync the final appointment details automatically.",
            },
          ],
        },
      ],
    },
    {
      id: "qualification",
      title: "Qualification Demo Agent",
      subtitle: `Screens ${category.toLowerCase()} inquiries before they hit your team`,
      preview: "Captures contact details, intent, budget, and urgency before handoff.",
      detail: "Ideal for businesses that want to stop wasting time on low-fit leads and route high-fit ones faster.",
      sourceLabel: "Interactive Qualification Flow",
      chips: ["Qualification", "Lead Scoring", "Routing"],
      tone: "purple",
      steps: [
        {
          prompt: "I can qualify the lead before your team gets involved. What is the first filter you care about most?",
          options: [
            {
              label: "Budget fit",
              userMessage: "I want to filter by budget first.",
              agentReply: "Then the agent should ask spending range early, classify the lead automatically, and route high-fit prospects into the next step immediately.",
            },
            {
              label: "Need urgency",
              userMessage: "I want to know how urgent the lead is.",
              agentReply: "That works well with a short urgency and timeline sequence so your team can prioritize ready-to-buy conversations first.",
            },
          ],
        },
        {
          prompt: "What should happen after qualification is complete?",
          options: [
            {
              label: "Route to sales",
              userMessage: "Send qualified leads straight to sales.",
              agentReply: "Then the workflow should pass the conversation summary, contact details, and qualification tags into your pipeline instantly.",
            },
            {
              label: "Send nurture follow-up",
              userMessage: "Keep lower-fit leads in a nurture sequence.",
              agentReply: "Then the system should separate hot and warm prospects, start the right follow-up sequence, and keep your team focused on the strongest matches.",
            },
          ],
        },
      ],
    },
  ] satisfies DemoScenario[];
}

function DemoScenarioCard({ card }: { card: DemoScenario }) {
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
            Interactive
          </span>
        </div>
      </div>

      <div className="space-y-3 p-4">
        <div className="flex justify-start">
          <div className="max-w-[88%] rounded-2xl rounded-bl-md bg-white/5 px-4 py-3 text-sm text-slate-200">
            {card.preview}
          </div>
        </div>
        <div className="rounded-2xl border border-white/5 bg-black/10 px-4 py-3 text-sm text-slate-400">
          {card.detail}
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
        <p className="mt-3 text-xs text-slate-400">Click to open the live-style demo conversation.</p>
      </div>
    </motion.div>
  );
}

function InteractiveDemoModal({
  card,
  onClose,
}: {
  card: DemoScenario;
  onClose: () => void;
}) {
  const theme = toneMap[card.tone];
  const timeoutsRef = useRef<number[]>([]);
  const [step, setStep] = useState(0);
  const [messages, setMessages] = useState<DemoMessage[]>([{ speaker: "agent", text: card.steps[0].prompt }]);
  const [isTyping, setIsTyping] = useState(false);
  const currentStep = card.steps[step];

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    };
  }, []);

  function restartDemo() {
    timeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    timeoutsRef.current = [];
    setStep(0);
    setIsTyping(false);
    setMessages([{ speaker: "agent", text: card.steps[0].prompt }]);
  }

  function handleOptionSelect(option: DemoOption) {
    if (!currentStep || isTyping) {
      return;
    }

    setMessages((current) => [...current, { speaker: "user", text: option.userMessage }]);
    setIsTyping(true);

    const replyTimeout = window.setTimeout(() => {
      setMessages((current) => [...current, { speaker: "agent", text: option.agentReply }]);

      const nextStep = step + 1;
      if (nextStep < card.steps.length) {
        const promptTimeout = window.setTimeout(() => {
          setMessages((current) => [...current, { speaker: "agent", text: card.steps[nextStep].prompt }]);
          setStep(nextStep);
          setIsTyping(false);
        }, 650);
        timeoutsRef.current.push(promptTimeout);
        return;
      }

      setIsTyping(false);
      setStep(nextStep);
    }, 900);

    timeoutsRef.current.push(replyTimeout);
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-[#08101f] shadow-2xl shadow-black/40">
        <div className={`flex items-start justify-between gap-4 border-b px-6 py-5 ${theme.borderColor}`}>
          <div>
            <p className={`text-xs uppercase tracking-[0.2em] ${theme.color}`}>Interactive Demo Agent</p>
            <h3 className="mt-2 text-2xl font-bold text-white">{card.title}</h3>
            <p className="mt-2 text-sm text-slate-400">This is a clickable simulation with selectable replies, typing states, and a dedicated workflow path.</p>
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
              {messages.map((message, index) => (
                <div key={`${message.speaker}-${index}`} className={message.speaker === "user" ? "flex justify-end" : "flex justify-start"}>
                  <div className={message.speaker === "user"
                    ? "max-w-[88%] rounded-2xl rounded-br-md bg-gradient-to-r from-brand-blue to-brand-purple px-4 py-3 text-sm text-white"
                    : "max-w-[88%] rounded-2xl rounded-bl-md bg-white/5 px-4 py-3 text-sm text-slate-200"}>
                    {message.text}
                  </div>
                </div>
              ))}
              {isTyping ? (
                <div className="flex justify-start">
                  <div className="inline-flex items-center gap-2 rounded-2xl rounded-bl-md bg-white/5 px-4 py-3 text-sm text-slate-300">
                    <span>Agent is typing</span>
                    <span className="flex gap-1">
                      <span className="h-2 w-2 animate-demo-typing rounded-full bg-slate-400 [animation-delay:0ms]" />
                      <span className="h-2 w-2 animate-demo-typing rounded-full bg-slate-400 [animation-delay:180ms]" />
                      <span className="h-2 w-2 animate-demo-typing rounded-full bg-slate-400 [animation-delay:360ms]" />
                    </span>
                  </div>
                </div>
              ) : null}
            </div>
            <div className="mt-6 space-y-3">
              {currentStep ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {currentStep.options.map((option) => (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => handleOptionSelect(option)}
                      disabled={isTyping}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm font-medium text-slate-200 transition-all hover:border-cyan-300/30 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
                  Demo flow complete. Restart it or open another agent to test a different conversation path.
                </div>
              )}
              <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={restartDemo}
                className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 transition-colors hover:bg-white/10"
              >
                Restart
              </button>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">What this demo shows</p>
            <div className="mt-4 space-y-4 text-sm text-slate-300">
              <p>{card.preview}</p>
              <p>{card.detail}</p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {card.chips.map((chip) => (
                <span key={chip} className={`rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] ${theme.bgColor} ${theme.color}`}>
                  {chip}
                </span>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-cyan-300/10 bg-cyan-300/5 p-4 text-sm text-slate-300">
              Select one of the reply options to push the conversation forward. Each agent has its own sales, support, booking, or qualification path.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DemoShowroom() {
  const { popularCategories } = useLiveSiteData();
  const scenarioCards = useMemo(
    () => createDemoScenarios(popularCategories[0]?.category),
    [popularCategories],
  );
  const [selectedCard, setSelectedCard] = useState<DemoScenario | null>(null);

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
            Interactive Demo Agents
          </span>
          <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">
            Choose A Demo. <span className="text-gradient">Test It Like A Buyer.</span>
          </h2>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
            These are real interactive product demos with selectable replies, simulated typing, and separate conversation flows for sales, support, booking, and lead qualification.
          </p>
          <p className="mt-3 text-sm text-slate-500 max-w-2xl mx-auto">
            Click any card below to open the agent and drive the conversation yourself.
          </p>
        </motion.div>
        <div className="grid gap-6 md:grid-cols-2">
          {scenarioCards.map((card) => (
              <button
                key={card.id}
                type="button"
                onClick={() => setSelectedCard(card)}
                className="text-left transition-transform hover:scale-[1.01]"
              >
                <DemoScenarioCard card={card} />
              </button>
            ))}
        </div>
      </div>
      {selectedCard ? <InteractiveDemoModal card={selectedCard} onClose={() => setSelectedCard(null)} /> : null}
    </section>
  );
}
