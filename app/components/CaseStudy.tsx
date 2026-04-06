"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useLiveSiteData } from "@/app/components/useLiveSiteData";
import {
  Award,
  Clock,
  Users,
  TrendingUp,
  Zap,
  ArrowRight,
} from "lucide-react";

export default function CaseStudy() {
  const { caseStudy } = useLiveSiteData();

  return (
    <section className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-yellow-500/20 bg-yellow-500/5 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-yellow-400 mb-6">
            <Award className="h-3 w-3" /> Case Study
          </span>
          <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">
            Proof, Not <span className="text-gradient">Promises</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl glass-strong overflow-hidden"
        >
          <div className="bg-gradient-to-r from-brand-blue/10 to-brand-purple/10 px-8 py-6 border-b border-white/5">
            <h3 className="text-2xl font-bold">
              {caseStudy.title}
            </h3>
            <p className="mt-2 text-slate-400">
              {caseStudy.subtitle}
            </p>
          </div>

          <div className="grid gap-8 border-b border-white/5 p-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <p className="max-w-2xl text-base leading-relaxed text-slate-300">
                {caseStudy.overview}
              </p>

              <div className="mt-6 flex flex-wrap gap-3 text-xs uppercase tracking-[0.18em] text-slate-400">
                {caseStudy.chips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative overflow-hidden rounded-[28px] border border-white/10 bg-black/20"
            >
              <Image
                src="/art/ai-command-center.svg"
                alt="Futuristic automation dashboard"
                width={1200}
                height={900}
                className="h-auto w-full"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-6">
                <p className="text-xs uppercase tracking-[0.24em] text-brand-cyan">
                  Before / After Automation
                </p>
                <p className="mt-2 max-w-sm text-sm text-slate-200">
                  One operator became an always-on AI funnel that educates,
                  nurtures, and upgrades customers automatically.
                </p>
              </div>
            </motion.div>
          </div>

          <div className="p-8 grid gap-8 md:grid-cols-3">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-red-400 font-semibold">
                <span className="h-3 w-3 rounded-full bg-red-400/20 border border-red-400" />
                Problem
              </div>
              <ul className="space-y-2 text-sm text-slate-400">
                {caseStudy.problem.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-brand-blue font-semibold">
                <Zap className="h-4 w-4" /> Solution
              </div>
              <ul className="space-y-2 text-sm text-slate-400">
                {caseStudy.solution.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-brand-green font-semibold">
                <TrendingUp className="h-4 w-4" /> Result
              </div>
              <div className="grid grid-cols-2 gap-3">
                {caseStudy.results.map((item, index) => {
                  const icons = [Users, Clock, Zap, TrendingUp];
                  const Icon = icons[index % icons.length];
                  return (
                    <div
                      key={item.label}
                      className="rounded-xl border border-white/10 bg-white/5 p-3 text-center"
                    >
                      <Icon className="mx-auto mb-1 h-4 w-4 text-brand-green" />
                      <p className="font-mono text-lg font-bold text-gradient">
                        {item.value}
                      </p>
                      <p className="text-[10px] text-slate-500">{item.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="px-8 pb-8">
            <a
              href="#cta"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-blue to-brand-purple px-6 py-3 font-medium text-white hover:scale-105 transition-transform"
            >
              Get Similar Results <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}