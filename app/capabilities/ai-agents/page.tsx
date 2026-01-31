"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Bot, ArrowLeft, CheckCircle, Zap, Target, Users } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import { trackEmailClick, trackCapabilityView } from "@/lib/analytics";
import { useScrollTracking } from "@/hooks/use-scroll-tracking";
import { useTimeTracking } from "@/hooks/use-time-tracking";
import { useEffect } from "react";

export default function AIAgentsPage() {
  // Analytics tracking
  useScrollTracking("ai-agents");
  useTimeTracking("ai-agents");

  useEffect(() => {
    trackCapabilityView("AI Agents");
  }, []);
  const useCases = [
    {
      title: "Research Agents",
      description: "Autonomous agents that gather, synthesize, and summarize information from multiple sources. Perfect for market research, competitive analysis, and due diligence."
    },
    {
      title: "Outreach Agents",
      description: "AI that personalizes and manages communication at scale. Email sequences, follow-ups, and lead qualification—all automated with human-like quality."
    },
    {
      title: "Data Processing Agents",
      description: "Agents that extract, transform, and categorize data from documents, emails, and databases. Turn unstructured chaos into structured insights."
    },
    {
      title: "Workflow Automation",
      description: "Multi-step agents that coordinate across your tools. Trigger actions in Salesforce, update spreadsheets, send notifications—all from natural language."
    }
  ];

  const features = [
    "Claude, GPT-4, or open-source models based on your needs",
    "Tool use and function calling for real actions",
    "Memory and context management for multi-turn tasks",
    "Human-in-the-loop workflows when needed",
    "Observability and logging for debugging",
    "Production-ready error handling and retries"
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#191919] text-[#F4EDE4]">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a3a2e]/30 via-[#191919] to-[#2d5945]/20" />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-[#F4EDE4]/10 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-lg font-bold bg-gradient-to-r from-[#4a7c59] to-[#5a8a65] bg-clip-text text-transparent sm:text-2xl">
              BonusThoughts
            </Link>
            <Link href="/#industries" className="flex items-center gap-2 text-sm text-[#D4C4B0] hover:text-[#5a8a65] transition-colors">
              <ArrowLeft className="h-4 w-4" />
              All Capabilities
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-[#4a7c59]/20 border border-[#4a7c59]/30">
              <Bot className="h-12 w-12 text-[#4a7c59]" />
            </div>
            <span className="text-sm font-semibold text-[#4a7c59] uppercase tracking-wider">What We Build</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-[#4a7c59] to-[#5a8a65] bg-clip-text text-transparent">
              AI Agents
            </span>
          </h1>

          <p className="text-xl text-[#D4C4B0] max-w-3xl mb-8">
            Autonomous agents that don't just chat—they take action. Research, outreach, data processing, and workflow automation. AI that works while you sleep.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-[#4a7c59] to-[#5a8a65] px-8 py-6 text-lg font-semibold text-[#191919] transition-all hover:scale-105 hover:shadow-2xl hover:shadow-[#4a7c59]/50"
              onClick={() => {
                trackEmailClick('AI Agents Project Inquiry', 'Discuss Your Agent Project', 'ai-agents-hero');
                window.location.href = 'mailto:director@bonusthoughts.com?subject=AI%20Agents%20Project%20Inquiry&body=Hi%2C%0A%0AI%27m%20interested%20in%20building%20an%20AI%20agent%20solution.%0A%0AUse%20case%3A%20%0ACurrent%20workflow%3A%20%0ATimeline%3A%20%0A%0ALooking%20forward%20to%20hearing%20from%20you.';
              }}
            >
              Discuss Your Agent Project →
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Use Cases Section */}
      <section className="relative z-10 mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold mb-8 text-[#F4EDE4]">What We Build</h2>

          <div className="grid gap-6 md:grid-cols-2">
            {useCases.map((useCase, index) => (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-xl border border-[#F4EDE4]/10 bg-[#F4EDE4]/5 p-6"
              >
                <h3 className="text-xl font-bold text-[#4a7c59] mb-3">{useCase.title}</h3>
                <p className="text-[#D4C4B0]">{useCase.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-2xl border border-[#4a7c59]/30 bg-gradient-to-br from-[#4a7c59]/10 to-[#2d5945]/10 p-8 sm:p-12"
        >
          <h2 className="text-3xl font-bold mb-8 text-[#F4EDE4]">How We Build Agents</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-start gap-3"
              >
                <CheckCircle className="h-5 w-5 text-[#4a7c59] mt-0.5 flex-shrink-0" />
                <span className="text-[#D4C4B0]">{feature}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-2xl border border-[#5a8a65]/30 bg-gradient-to-br from-[#5a8a65]/10 to-[#4a7c59]/10 p-8 sm:p-12 text-center"
        >
          <h2 className="text-3xl font-bold mb-4 text-[#F4EDE4]">Ready to build an AI agent?</h2>
          <p className="text-lg text-[#D4C4B0] mb-8 max-w-2xl mx-auto">
            Tell us what you want automated. We'll scope it, price it, and ship it in weeks.
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-[#4a7c59] to-[#5a8a65] px-8 py-6 text-lg font-semibold text-[#191919] transition-all hover:scale-105 hover:shadow-2xl hover:shadow-[#4a7c59]/50"
            onClick={() => {
              trackEmailClick('AI Agents Project Inquiry', 'Describe Your Project', 'ai-agents-cta');
              window.location.href = 'mailto:director@bonusthoughts.com?subject=AI%20Agents%20Project%20Inquiry&body=Hi%2C%0A%0AI%27m%20interested%20in%20building%20an%20AI%20agent%20solution.%0A%0AUse%20case%3A%20%0ACurrent%20workflow%3A%20%0ATimeline%3A%20%0A%0ALooking%20forward%20to%20hearing%20from%20you.';
            }}
          >
            Describe Your Project →
          </Button>
          <p className="mt-4 text-sm text-[#D4C4B0]">
            <span className="font-semibold text-[#5a8a65]">Free scoping call</span> · Fixed pricing · No fluff
          </p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#F4EDE4]/10 py-8">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-[#3a5a47] text-sm">
            © 2025 BonusThoughts. Custom AI development. Forward deployed engineers.
          </p>
        </div>
      </footer>
    </div>
  );
}
