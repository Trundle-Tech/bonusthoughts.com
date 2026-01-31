"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  ArrowLeft,
  CheckCircle,
  Zap,
  FileText,
  Users,
  TrendingUp,
  Lightbulb,
  Target,
  Clock,
  Sparkles,
  Building2
} from "lucide-react";
import Link from "next/link";
import {
  AIToolCard,
  EnterpriseToolCard,
  IDEToolCard,
  DecisionMatrix,
  PromptTemplate,
  SetupChecklist
} from "@/components/training";
import {
  aiTools,
  enterpriseTools,
  aiIDEs,
  useCaseMatrix,
  promptTemplates,
  setupChecklistItems
} from "@/components/training/data";
import { trackEmailClick, trackTrainingGuideSection } from "@/lib/analytics";
import { useScrollTracking } from "@/hooks/use-scroll-tracking";
import { useTimeTracking } from "@/hooks/use-time-tracking";

export default function TrainingGuidePage() {
  // Analytics tracking
  useScrollTracking("training-guide");
  useTimeTracking("training-guide");

  const checklistWithIcons = setupChecklistItems.map((item, i) => ({
    ...item,
    icon: [Target, Users, FileText, Zap, Lightbulb, TrendingUp, Clock][i]
  }));

  return (
    <div className="min-h-screen bg-[#191919] text-[#F4EDE4]">
      {/* Header */}
      <nav className="sticky top-0 z-50 border-b border-[#F4EDE4]/10 backdrop-blur-xl print:hidden">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-[#D4C4B0] hover:text-[#F4EDE4] transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to BonusThoughts</span>
            </Link>
            <div className="flex items-center gap-2 text-cyan-400">
              <GraduationCap className="h-5 w-5" />
              <span className="font-semibold hidden sm:inline">Training Guide</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 mb-6">
            <GraduationCap className="h-4 w-4 text-cyan-400" />
            <span className="text-sm font-medium text-cyan-400">AI Tools Training Guide</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Which AI Tool for <span className="text-cyan-400">Which Task</span>
          </h1>
          <p className="text-xl text-[#D4C4B0] max-w-2xl mx-auto">
            A practical guide to Claude, ChatGPT, Gemini, Copilot, and the rest—so you know exactly what to use and when.
          </p>
        </motion.div>

        {/* Table of Contents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16 p-6 rounded-2xl border border-[#F4EDE4]/10 bg-[#F4EDE4]/5"
        >
          <h2 className="text-lg font-semibold mb-4">In This Guide</h2>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            {[
              { href: "#ai-assistants", text: "AI Assistants Compared (Claude, ChatGPT, Gemini, Grok)" },
              { href: "#enterprise", text: "Enterprise Tools (Copilot, Perplexity, GitHub Copilot)" },
              { href: "#ai-ides", text: "AI-Powered IDEs & Agents (Claude Code, Cowork, Cursor, Windsurf)" },
              { href: "#matrix", text: "Task → Tool Decision Matrix" },
              { href: "#prompts", text: "Prompt Templates That Work" },
              { href: "#setup", text: "Enterprise Setup Checklist" },
              { href: "#training", text: "Custom Programs & AI Academy" },
            ].map((item) => (
              <a key={item.href} href={item.href} className="flex items-center gap-2 text-[#D4C4B0] hover:text-cyan-400 transition-colors">
                <CheckCircle className="h-4 w-4 text-cyan-400" />
                {item.text}
              </a>
            ))}
          </div>
        </motion.div>

        {/* AI Assistants Section */}
        <section id="ai-assistants" className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-2">AI Assistants Compared</h2>
            <p className="text-[#D4C4B0] mb-8">The big four—and when to use each one.</p>
            <div className="grid gap-6">
              {aiTools.map((tool, index) => (
                <AIToolCard key={tool.name} tool={tool} index={index} />
              ))}
            </div>
          </motion.div>
        </section>

        {/* Enterprise Tools Section */}
        <section id="enterprise" className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-2">Enterprise & Productivity Tools</h2>
            <p className="text-[#D4C4B0] mb-8">AI that integrates with your existing workflow.</p>
            <div className="grid gap-6">
              {enterpriseTools.map((tool, index) => (
                <EnterpriseToolCard key={tool.name} tool={tool} index={index} />
              ))}
            </div>
          </motion.div>
        </section>

        {/* AI-Powered IDEs & Agents Section */}
        <section id="ai-ides" className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-2">AI-Powered IDEs & Agents</h2>
            <p className="text-[#D4C4B0] mb-8">The next generation of work environments—AI agents that understand your codebase, documents, and files, executing complex tasks autonomously.</p>
            <div className="grid gap-6">
              {aiIDEs.map((tool, index) => (
                <IDEToolCard key={tool.name} tool={tool} index={index} />
              ))}
            </div>
          </motion.div>
        </section>

        {/* Decision Matrix */}
        <section id="matrix" className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-2">Task → Tool Decision Matrix</h2>
            <p className="text-[#D4C4B0] mb-8">Quick reference: what to use for what.</p>
            <DecisionMatrix rows={useCaseMatrix} />
          </motion.div>
        </section>

        {/* Prompt Templates */}
        <section id="prompts" className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-2">Prompt Templates That Work</h2>
            <p className="text-[#D4C4B0] mb-8">Copy, customize, and use. These patterns get better results than "just asking."</p>
            <div className="grid gap-6">
              {promptTemplates.map((template, index) => (
                <PromptTemplate key={template.title} template={template} index={index} />
              ))}
            </div>
          </motion.div>
        </section>

        {/* Setup Checklist */}
        <section id="setup" className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-2">Enterprise Setup Checklist</h2>
            <p className="text-[#D4C4B0] mb-8">Rolling out AI tools to your team? Don't skip these.</p>
            <SetupChecklist items={checklistWithIcons} />
          </motion.div>
        </section>

        {/* CTA */}
        <section id="training" className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl font-bold text-center">Ready to Level Up Your Team?</h2>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Custom Programs */}
              <div className="rounded-2xl border border-[#4a7c59]/30 bg-gradient-to-br from-[#4a7c59]/10 to-[#2d5945]/10 p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#4a7c59]/20">
                    <Building2 className="h-6 w-6 text-[#4a7c59]" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#F4EDE4]">Custom Programs</h3>
                </div>
                <p className="text-[#D4C4B0] mb-6">
                  Tailored AI training built around your team's actual workflows. We assess your needs, design a curriculum, and deliver hands-on sessions that stick.
                </p>
                <ul className="space-y-2 text-sm text-[#D4C4B0] mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#4a7c59]" />
                    On-site or remote delivery
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#4a7c59]" />
                    Role-specific training tracks
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#4a7c59]" />
                    Account setup & workflow configuration
                  </li>
                </ul>
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-[#4a7c59] to-[#5a8a65] px-6 py-5 text-base font-semibold text-[#191919] transition-all hover:scale-105 hover:shadow-xl hover:shadow-[#4a7c59]/50"
                  onClick={() => {
                    trackEmailClick('Custom AI Training Program', 'Design a Custom Program', 'training-guide');
                    window.location.href = 'mailto:director@bonusthoughts.com?subject=Custom%20AI%20Training%20Program&body=Hi%2C%0A%0AI%27m%20interested%20in%20a%20custom%20AI%20training%20program%20for%20my%20team.%0A%0ATeam%20size%3A%20%0ARoles%2Fdepartments%3A%20%0ACurrent%20AI%20tool%20usage%3A%20%0AGoals%3A%20%0A%0ALooking%20forward%20to%20hearing%20from%20you.';
                  }}
                >
                  Design a Custom Program →
                </Button>
              </div>

              {/* AI Academy */}
              <div className="rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-cyan-400/10 to-[#4a7c59]/10 p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-400/20">
                    <Sparkles className="h-6 w-6 text-cyan-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#F4EDE4]">AI Academy</h3>
                </div>
                <p className="text-[#D4C4B0] mb-6">
                  Structured teaching sessions to get your team fluent in AI tools. From beginner fundamentals to advanced prompt engineering and automation.
                </p>
                <ul className="space-y-2 text-sm text-[#D4C4B0] mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-cyan-400" />
                    Half-day, full-day, or multi-session formats
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-cyan-400" />
                    Live demos with real use cases
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-cyan-400" />
                    Hands-on exercises & templates
                  </li>
                </ul>
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-cyan-500 to-cyan-400 px-6 py-5 text-base font-semibold text-[#191919] transition-all hover:scale-105 hover:shadow-xl hover:shadow-cyan-400/50"
                  onClick={() => {
                    trackEmailClick('AI Academy Teaching Session', 'Book a Teaching Session', 'training-guide');
                    window.location.href = 'mailto:director@bonusthoughts.com?subject=AI%20Academy%20Teaching%20Session&body=Hi%2C%0A%0AI%27m%20interested%20in%20booking%20an%20AI%20teaching%20session.%0A%0ATeam%20size%3A%20%0APreferred%20format%20(half-day%2Ffull-day%2Fmulti-session)%3A%20%0ATools%20of%20interest%3A%20%0A%0ALooking%20forward%20to%20hearing%20from%20you.';
                  }}
                >
                  Book a Teaching Session →
                </Button>
              </div>
            </div>

            <p className="text-center text-sm text-[#D4C4B0]">
              Not sure which option fits? <a href="mailto:director@bonusthoughts.com?subject=AI%20Training%20Question&body=Hi%2C%0A%0AI%27m%20not%20sure%20which%20training%20option%20fits%20my%20team%20best.%20Can%20we%20chat%3F%0A%0ATeam%20size%3A%20%0ACurrent%20situation%3A%20%0A%0AThanks!" className="text-cyan-400 hover:underline">Send us a message</a> and we'll figure it out together.
            </p>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#F4EDE4]/10 py-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center">
          <p className="text-sm text-[#3a5a47]">
            © 2025 BonusThoughts. Custom AI development. Forward deployed engineers.
          </p>
        </div>
      </footer>
    </div>
  );
}
