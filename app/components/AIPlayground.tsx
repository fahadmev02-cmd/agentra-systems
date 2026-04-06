"use client";

import { motion } from "framer-motion";
import { Brain, CheckCircle2, Sparkles, Wand2 } from "lucide-react";

const prompts = [
  "Qualify new real estate leads and book viewings.",
  "Answer clinic FAQs, confirm availability, and send reminders.",
  "Recover abandoned carts with WhatsApp follow-ups.",
];

export default function AIPlayground() {
  return (
    <section id="playground" className="relative py-24 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-cyan/5 to-transparent" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 text-center"
        >
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-cyan/20 bg-brand-cyan/5 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-brand-cyan">
            <Sparkles className="h-3 w-3" /> AI Playground
          </span>
          <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">
            Turn a Workflow Into an <span className="text-gradient">Agent</span>
          </h2>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-white/5 bg-white/[0.04] p-8"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-2xl bg-brand-purple/10 p-3">
                <Wand2 className="h-5 w-5 text-brand-purple" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Prompt-to-System Preview</h3>
                <p className="text-sm text-slate-400">
                  These are the kinds of high-leverage flows we productize.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {prompts.map((prompt, index) => (
                <motion.div
                  key={prompt}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="rounded-2xl border border-white/5 bg-black/10 p-4"
                >
                  <p className="text-sm text-slate-300">{prompt}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl glass-strong p-8"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-2xl bg-brand-blue/10 p-3">
                <Brain className="h-5 w-5 text-brand-blue" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">What Gets Delivered</h3>
                <p className="text-sm text-slate-400">
                  A working automation layer, not a prototype deck.
                </p>
              </div>
            </div>

            <div className="space-y-4 text-sm text-slate-300">
              {[
                "Conversation flows mapped to business outcomes.",
                "CRM, calendar, and messaging integrations wired in.",
                "Fallback logic and human handoff included.",
                "Analytics for conversion, speed, and workload reduction.",
              ].map((item) => (
                <div key={item} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-green" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}