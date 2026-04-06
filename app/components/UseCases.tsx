"use client";
import { motion } from "framer-motion";
import { Dumbbell, Building2, ShoppingCart, Scissors } from "lucide-react";
import { useLiveSiteData } from "@/app/components/useLiveSiteData";

const cases = [
  {
    icon: Dumbbell,
    title: "Gym & Fitness",
    color: "text-brand-green",
    border: "border-brand-green/20",
    bg: "bg-brand-green/10",
    description:
      "AI trainer on WhatsApp — sends workouts, handles diet questions, daily check-ins, upsells premium plans.",
    metrics: ["50+ users automated", "Zero manual replies", "3x plan upgrades"],
  },
  {
    icon: Building2,
    title: "Real Estate",
    color: "text-brand-blue",
    border: "border-brand-blue/20",
    bg: "bg-brand-blue/10",
    description:
      "Lead follow-up agent — instantly responds to inquiries, qualifies budget and timeline, books consultations.",
    metrics: [
      "90% faster response",
      "Lead score automation",
      "Calendar integration",
    ],
  },
  {
    icon: ShoppingCart,
    title: "Ecommerce",
    color: "text-brand-purple",
    border: "border-brand-purple/20",
    bg: "bg-brand-purple/10",
    description:
      "Support automation — order tracking, returns handling, product FAQs, abandoned cart recovery.",
    metrics: ["80% tickets resolved", "24/7 support", "Revenue recovery"],
  },
  {
    icon: Scissors,
    title: "Clinics & Salons",
    color: "text-brand-cyan",
    border: "border-brand-cyan/20",
    bg: "bg-brand-cyan/10",
    description:
      "AI receptionist — answers questions, checks availability, books appointments, sends reminders.",
    metrics: ["No missed bookings", "Auto reminders", "Reduced no-shows"],
  },
];

export default function UseCases() {
  const { popularCategories } = useLiveSiteData();
  const iconMap = [Dumbbell, Building2, ShoppingCart, Scissors];
  const colorMap = [
    { color: "text-brand-green", border: "border-brand-green/20", bg: "bg-brand-green/10" },
    { color: "text-brand-blue", border: "border-brand-blue/20", bg: "bg-brand-blue/10" },
    { color: "text-brand-purple", border: "border-brand-purple/20", bg: "bg-brand-purple/10" },
    { color: "text-brand-cyan", border: "border-brand-cyan/20", bg: "bg-brand-cyan/10" },
  ];

  const dynamicCases = popularCategories.length > 0
    ? popularCategories.slice(0, 4).map((entry, index) => ({
        icon: iconMap[index % iconMap.length],
        title: entry.category,
        ...colorMap[index % colorMap.length],
        description: `Live pipeline data shows repeated demand coming from ${entry.category.toLowerCase()} businesses, so this use-case card now adapts to current lead activity instead of fixed placeholder copy.`,
        metrics: [`${entry.count} captured leads`, "Live category signal", "Automation-ready pipeline"],
      }))
    : cases;

  return (
    <section id="cases" className="relative py-24 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-blue/5 to-transparent" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-green/20 bg-brand-green/5 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-brand-green mb-6">
            Use Cases
          </span>
          <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">
            Built Around <span className="text-gradient">Real Business Work</span>
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {dynamicCases.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-3xl border ${c.border} glass p-8 transition-all hover:bg-white/[0.07]`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`rounded-xl ${c.bg} p-3`}>
                    <Icon className={`h-6 w-6 ${c.color}`} />
                  </div>
                  <h3 className="text-xl font-bold">{c.title}</h3>
                </div>
                <p className="text-slate-400 mb-6 leading-relaxed">
                  {c.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {c.metrics.map((m) => (
                    <span
                      key={m}
                      className={`rounded-full ${c.bg} px-3 py-1 text-xs font-medium ${c.color}`}
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
