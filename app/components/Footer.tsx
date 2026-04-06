"use client";
import Link from "next/link";
import { Zap, MessageCircle, Mail, ArrowUpRight } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Home", href: "/" },
    { label: "Live Demos", href: "/demos" },
    { label: "Services", href: "/services" },
    { label: "Contact", href: "/contact" },
  ],
  Services: [
    { label: "WhatsApp Bots", href: "/services" },
    { label: "Voice AI / IVR", href: "/services" },
    { label: "Lead Automation", href: "/services" },
    { label: "Custom AI Builds", href: "/services" },
  ],
  Company: [
    { label: "Use Cases", href: "/use-cases" },
    { label: "Case Study", href: "/use-cases" },
    { label: "Admin Dashboard", href: "/admin" },
    { label: "Blog", href: "#" },
    { label: "Contact", href: "/contact" },
  ],
};

const socialLinks = [
  { label: "WhatsApp", href: "https://wa.me/1234567890", icon: MessageCircle },
  { label: "Email", href: "mailto:hello@agentra.com", icon: Mail },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="mb-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-blue to-brand-purple">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight">
                Agentra<span className="text-brand-blue">.</span>
              </span>
            </Link>
            <p className="mb-6 max-w-sm text-sm leading-relaxed text-slate-400">
              AI agents for sales, support, and operations. We build systems
              that run your business 24/7 — so you can focus on growth.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition-all hover:bg-white/10 hover:text-white hover:border-white/20"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-300">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1 text-sm text-slate-400 transition-colors hover:text-white"
                    >
                      {link.label}
                      <ArrowUpRight className="h-3 w-3 opacity-0 transition-all group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 md:flex-row">
          <p className="text-xs text-slate-600">
            &copy; {new Date().getFullYear()} Agentra Systems. All rights
            reserved.
          </p>
          <p className="text-xs text-slate-600">
            Built with AI. Powered by ambition.
          </p>
        </div>
      </div>
    </footer>
  );
}