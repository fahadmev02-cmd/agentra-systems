"use client";
import { motion } from "framer-motion";
import { MessageCircle, Workflow, BrainCircuit } from "lucide-react";
import { useLiveSiteData } from "@/app/components/useLiveSiteData";

const services = [
  {
    icon: MessageCircle,
    title: "AI Agents",
    color: "from-brand-green/20 to-brand-green/5",
    iconColor: "text-brand-green",
    items: [
      "WhatsApp Bots",
      "Telegram Bots",
      "Website Chatbots",
      "Voice Agents / IVR",
    ],
  },
  {
    icon: Workflow,
    title: "Automation Systems",
    color: "from-brand-blue/20 to-brand-blue/5",
    iconColor: "text-brand-blue",
    items: [
      "Lead Capture Pipelines",
      "Follow-up Automation",
      "Booking Systems",
      "CRM Workflows",
    ],
  },
  {
    icon: BrainCircuit,
    title: "Custom AI Builds",
    color: "from-brand-purple/20 to-brand-purple/5",
    iconColor: "text-brand-purple",
    items: [
      "Internal AI Tools",
      "AI Copilots",
      "Niche Workflow Automation",
      "Full Custom Integrations",
    ],
  },
];

export default function Services() {
  const { popularCategories } = useLiveSiteData();
  const topCategory = popularCategories[0]?.category || "Live lead categories";
  const topCategoryProfile = (() => {
    const normalized = topCategory.toLowerCase();
    if (normalized.includes("launch") || normalized.includes("new business")) {
      return {
        description: "Current live demand is strongest around launch-stage intake flows and first-touch automation systems.",
        items: ["Launch intake forms", "Lead qualification", "Offer routing", "Follow-up systems"],
      };
    }
    if (normalized.includes("real estate")) {
      return {
        description: "Current live demand is strongest around fast inquiry response, qualification, and booking automation.",
        items: ["Inquiry response bots", "Budget capture", "Follow-up flows", "Consultation booking"],
      };
    }
    if (normalized.includes("fitness") || normalized.includes("gym")) {
      return {
        description: "Current live demand is strongest around coaching delivery, plan automation, and upsell-ready lead nurturing.",
        items: ["Coaching bots", "Plan delivery", "Daily check-ins", "Premium upsell flows"],
      };
    }
    return {
      description: "Current live demand is shaping the service stack around real captured business categories instead of static assumptions.",
      items: ["AI agents", "Workflow automation", "Lead routing", "CRM sync"],
    };
  })();

  const dynamicServices = services.map((service, index) =>
    index === 0
      ? {
          ...service,
          title: `${service.title} for ${topCategory}`,
          items: topCategoryProfile.items,
        }
      : service,
  );

  return (
    <section id="services" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-cyan/20 bg-brand-cyan/5 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-brand-cyan mb-6">
            What We Build
          </span>
          <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">
            AI Systems That <span className="text-gradient">Actually Work</span>
          </h2>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
            {topCategoryProfile.description}
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {dynamicServices.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="group rounded-3xl glass p-8 transition-all hover:bg-white/[0.07]"
              >
                <div
                  className={`mb-6 inline-flex rounded-2xl bg-gradient-to-br ${s.color} p-4`}
                >
                  <Icon className={`h-7 w-7 ${s.iconColor}`} />
                </div>
                <h3 className="text-xl font-bold mb-4">{s.title}</h3>
                <ul className="space-y-3">
                  {s.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 text-slate-300"
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${s.iconColor} bg-current`}
                      />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
