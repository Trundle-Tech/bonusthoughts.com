"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GraduationCap, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { trackEmailClick, trackNavClick, trackCapabilityView } from "@/lib/analytics";
import { useScrollTracking } from "@/hooks/use-scroll-tracking";
import { useTimeTracking } from "@/hooks/use-time-tracking";
import { useEffect } from "react";

export default function AITrainingPage() {
  // Analytics tracking
  useScrollTracking("ai-training");
  useTimeTracking("ai-training");

  useEffect(() => {
    trackCapabilityView("AI Training");
  }, []);
  const courses = [
    {
      title: "AI Assistants Masterclass",
      description: "Claude, ChatGPT, Gemini, Grok—learn when to use each, how to prompt effectively, and how to integrate them into daily work."
    },
    {
      title: "Enterprise AI Tools",
      description: "Microsoft Copilot, Perplexity for research, GitHub Copilot for developers. Get your team productive on the tools that matter."
    },
    {
      title: "Prompt Engineering",
      description: "Beyond basic prompting. Chain-of-thought, few-shot learning, structured outputs. Turn your team into power users."
    },
    {
      title: "AI for Specific Roles",
      description: "Sales, marketing, operations, legal, HR—customized training for how each team should use AI in their workflow."
    }
  ];

  const features = [
    "On-site at your location or virtual",
    "Half-day, full-day, or multi-day options",
    "Accounts set up before we leave",
    "Custom exercises with your real data",
    "Follow-up support and resources",
    "Executive briefings available"
  ];

  const tools = [
    { name: "Claude", company: "Anthropic" },
    { name: "ChatGPT", company: "OpenAI" },
    { name: "Gemini", company: "Google" },
    { name: "Grok", company: "xAI" },
    { name: "Microsoft Copilot", company: "Microsoft" },
    { name: "Perplexity", company: "Research" },
    { name: "GitHub Copilot", company: "GitHub" },
    { name: "Midjourney", company: "Image Gen" }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#191919] text-[#F4EDE4]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a3a2e]/30 via-[#191919] to-[#2d5945]/20" />

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

      <section className="relative z-10 mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-cyan-400/20 border border-cyan-400/30">
              <GraduationCap className="h-12 w-12 text-cyan-400" />
            </div>
            <span className="text-sm font-semibold text-cyan-400 uppercase tracking-wider">What We Offer</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 to-[#5a8a65] bg-clip-text text-transparent">
              AI Training
            </span>
          </h1>

          <p className="text-xl text-[#D4C4B0] max-w-3xl mb-8">
            On-site courses for Claude, GPT-4, Gemini, and more. We train your team, set up accounts, and get everyone productive fast. Not theory—real skills.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-cyan-400 px-8 py-6 text-lg font-semibold text-[#191919] transition-all hover:scale-105 hover:shadow-2xl hover:shadow-cyan-400/50"
              onClick={() => {
                trackEmailClick('AI Training Inquiry', 'Book Training', 'ai-training-hero');
                window.location.href = 'mailto:director@bonusthoughts.com?subject=AI%20Training%20Inquiry&body=Hi%2C%0A%0AI%27m%20interested%20in%20AI%20training%20for%20my%20team.%0A%0ATeam%20size%3A%20%0ATools%20of%20interest%3A%20%0APreferred%20format%20(half-day%2Ffull-day%2Fmulti-day)%3A%20%0A%0ALooking%20forward%20to%20hearing%20from%20you.';
              }}
            >
              Book Training →
            </Button>
            <Link
              href="/training-guide"
              className="inline-flex items-center justify-center border-2 border-cyan-400/40 bg-[#F4EDE4]/5 px-8 py-6 text-lg font-semibold text-[#F4EDE4] backdrop-blur-sm transition-all hover:border-cyan-400/70 hover:bg-[#F4EDE4]/10 rounded-md"
              onClick={() => trackNavClick('/training-guide', 'ai-training')}
            >
              View Training Guide
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Tools We Train On */}
      <section className="relative z-10 mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold mb-8 text-[#F4EDE4]">Tools We Train On</h2>

          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            {tools.map((tool, index) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="rounded-xl border border-[#F4EDE4]/10 bg-[#F4EDE4]/5 p-4 text-center"
              >
                <p className="text-lg font-bold text-cyan-400 mb-1">{tool.name}</p>
                <p className="text-xs text-[#D4C4B0]">{tool.company}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Course Types */}
      <section className="relative z-10 mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold mb-8 text-[#F4EDE4]">Training Programs</h2>

          <div className="grid gap-6 md:grid-cols-2">
            {courses.map((course, index) => (
              <motion.div
                key={course.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-xl border border-[#F4EDE4]/10 bg-[#F4EDE4]/5 p-6"
              >
                <h3 className="text-xl font-bold text-cyan-400 mb-3">{course.title}</h3>
                <p className="text-[#D4C4B0]">{course.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-cyan-400/10 to-[#2d5945]/10 p-8 sm:p-12"
        >
          <h2 className="text-3xl font-bold mb-8 text-[#F4EDE4]">What's Included</h2>

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
                <CheckCircle className="h-5 w-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                <span className="text-[#D4C4B0]">{feature}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="relative z-10 mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-cyan-400/10 to-[#4a7c59]/10 p-8 sm:p-12 text-center"
        >
          <h2 className="text-3xl font-bold mb-4 text-[#F4EDE4]">Ready to upskill your team?</h2>
          <p className="text-lg text-[#D4C4B0] mb-8 max-w-2xl mx-auto">
            Tell us about your team and goals. We'll design a training program that fits.
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-cyan-500 to-cyan-400 px-8 py-6 text-lg font-semibold text-[#191919] transition-all hover:scale-105 hover:shadow-2xl hover:shadow-cyan-400/50"
            onClick={() => {
              trackEmailClick('AI Training Inquiry', 'Book Training', 'ai-training-cta');
              window.location.href = 'mailto:director@bonusthoughts.com?subject=AI%20Training%20Inquiry&body=Hi%2C%0A%0AI%27m%20interested%20in%20AI%20training%20for%20my%20team.%0A%0ATeam%20size%3A%20%0ATools%20of%20interest%3A%20%0APreferred%20format%20(half-day%2Ffull-day%2Fmulti-day)%3A%20%0A%0ALooking%20forward%20to%20hearing%20from%20you.';
            }}
          >
            Book Training →
          </Button>
          <p className="mt-4 text-sm text-[#D4C4B0]">
            <span className="font-semibold text-cyan-400">Free consultation</span> · Custom curriculum · Real results
          </p>
        </motion.div>
      </section>

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
