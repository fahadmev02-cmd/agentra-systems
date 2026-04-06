"use client";

import { motion } from "framer-motion";
import { Blocks, Rocket, ScanSearch } from "lucide-react";

const steps = [
  {
    icon: ScanSearch,
    title: "Audit the workflow",
    text: "We find the repetitive conversations, decisions, and follow-ups slowing the business down.",
  },
  {
    icon: Blocks,
    title: "Design the agent",
    text: "We map prompts, tools, integrations, escalation logic, and measurable outcomes.",
  },
  {
    icon: Rocket,
    title: "Deploy and refine",
    text: "The system goes live fast, then we tune performance using real traffic and business metrics.",
  },
];

export default function HowItWorks() {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <span className="mb-6 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-slate-300">
            How It Works
          </span>
          <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">
            Simple Process, <span className="text-gradient">Operational Outcome</span>
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="rounded-3xl border border-white/5 bg-white/[0.04] p-8"
              >
                <div className="mb-5 inline-flex rounded-2xl bg-white/5 p-4">
                  <Icon className="h-6 w-6 text-brand-blue" />
                </div>
                <p className="mb-3 text-sm text-slate-500">Step 0{index + 1}</p>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="mt-4 leading-relaxed text-slate-400">{step.text}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}