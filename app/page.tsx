"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Bot, Database, MessageSquare, Plug, Eye, Target, Users, Cpu, Receipt, GraduationCap, Play, Rocket, Terminal, Code2, Sparkles } from "lucide-react";
import Link from "next/link";
import { trackEmailClick, trackNavClick } from "@/lib/analytics";
import { useScrollTracking } from "@/hooks/use-scroll-tracking";
import { useTimeTracking } from "@/hooks/use-time-tracking";

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // Analytics tracking
  useScrollTracking("homepage");
  useTimeTracking("homepage");

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // JSON-LD Structured Data
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "BonusThoughts",
    "url": "https://bonusthoughts.com",
    "logo": "https://bonusthoughts.com/logo.png",
    "description": "AI Development Agency with Forward Deployed Engineers",
    "sameAs": [
      "https://x.com/nlynch_ai"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "director@bonusthoughts.com",
      "contactType": "Sales"
    }
  };

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Nick Lynch",
    "jobTitle": "Founder & AI Engineer",
    "description": "AI engineer specializing in agents, RAG systems, and LLM applications. Forward deployed approach to custom AI development.",
    "url": "https://bonusthoughts.com",
    "sameAs": "https://x.com/nlynch_ai",
    "credentials": [
      "Production AI Systems",
      "SDVOSB Certified"
    ]
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Custom AI Development & Training",
    "description": "Forward deployed AI engineers who build your AI ideas. Plus on-site AI training for Claude, GPT-4, Gemini. Agents, RAG systems, LLM apps. 2-8 week delivery.",
    "provider": {
      "@type": "Organization",
      "name": "BonusThoughts",
      "url": "https://bonusthoughts.com"
    },
    "areaServed": "US",
    "serviceType": [
      "AI Agent Development",
      "RAG System Development",
      "LLM Application Development",
      "AI Integration Services",
      "Computer Vision Development",
      "Corporate AI Training",
      "Claude Training",
      "GPT-4 Training",
      "Gemini Training"
    ]
  };

  const capabilities = [
    {
      name: "AI Agents",
      icon: Bot,
      color: "from-[#4a7c59]/20 to-[#5a8a65]/20",
      description: "Autonomous agents for research, outreach, data processing, and workflow automation. Claude, GPT-4, open-source models."
    },
    {
      name: "RAG Systems",
      icon: Database,
      color: "from-[#5a6b3e]/20 to-[#6a9a75]/20",
      description: "Search your documents and knowledge bases. Production-grade retrieval with proper chunking, embeddings, and evaluation."
    },
    {
      name: "LLM Applications",
      icon: MessageSquare,
      color: "from-[#4a7c59]/20 to-[#3a5a47]/20",
      description: "Chat interfaces, content generation, classification, summarization pipelines. Prompt engineering included."
    },
    {
      name: "AI Integrations",
      icon: Plug,
      color: "from-[#6a9a75]/20 to-[#5a6b3e]/20",
      description: "Connect AI to Salesforce, Slack, internal databases, APIs. Make AI work where your team already works."
    },
    {
      name: "Computer Vision",
      icon: Eye,
      color: "from-[#3a5a47]/20 to-[#2d5945]/20",
      description: "Image classification, object detection, document processing. Manufacturing, medical, security applications."
    },
    {
      name: "AI Training",
      icon: GraduationCap,
      color: "from-[#4a7c59]/20 to-[#5a8a65]/20",
      description: "On-site courses for Claude, GPT-4, Gemini, and more. We train your team, set up accounts, and get everyone productive fast."
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#191919] text-[#F4EDE4]">
      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a3a2e]/30 via-[#191919] to-[#2d5945]/20" />

      {/* Mouse follower effect */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-0"
        animate={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(74, 124, 89, 0.15), transparent 80%)`,
        }}
        transition={{ type: "tween", ease: "linear", duration: 0.2 }}
      />

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="sticky top-0 z-50 border-b border-[#F4EDE4]/10 backdrop-blur-xl"
      >
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center justify-between">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-lg font-bold bg-gradient-to-r from-[#4a7c59] to-[#5a8a65] bg-clip-text text-transparent sm:text-2xl"
            >
              BonusThoughts
            </motion.div>
            <div className="flex gap-4 text-xs font-medium sm:gap-8 sm:text-sm">
              <motion.a
                whileHover={{ y: -2 }}
                href="#industries"
                className="transition-colors hover:text-[#5a8a65]"
              >
                What We Build
              </motion.a>
              <motion.a
                whileHover={{ y: -2 }}
                href="#training"
                className="transition-colors hover:text-cyan-400"
              >
                Training
              </motion.a>
              <motion.a
                whileHover={{ y: -2 }}
                href="#contact"
                className="transition-colors hover:text-[#5a8a65]"
              >
                Contact
              </motion.a>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="mb-8 inline-block"
          >
            <div className="relative">
              <h1 className="text-5xl font-black tracking-tight sm:text-7xl md:text-8xl lg:text-9xl">
                <span className="text-[#F4EDE4]">We Build Your</span>
                <br />
                <span className="bg-gradient-to-r from-[#4a7c59] via-[#5a8a65] to-[#5a6b3e] bg-clip-text text-transparent">
                  AI Ideas.
                </span>
              </h1>
              <motion.div
                className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-r from-[#4a7c59]/30 to-[#5a6b3e]/30 blur-3xl"
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mx-auto mb-8 max-w-2xl text-base text-[#D4C4B0] sm:text-xl md:text-2xl"
          >
            AI that takes action. Not just chatbots—systems that process, transact, and deliver.
            <br />
            <span className="font-semibold text-[#5a8a65]">Forward deployed engineers who build alongside your team.</span>
          </motion.p>

          {/* Trust Signals */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mb-8 flex flex-wrap items-center justify-center gap-3 text-xs sm:gap-6 sm:text-sm"
          >
            <div className="flex items-center gap-2 rounded-full border border-[#4a7c59]/30 bg-[#4a7c59]/10 px-4 py-2 backdrop-blur-sm">
              <div className="relative">
                <div className="h-2 w-2 rounded-full bg-[#4a7c59]" />
                <div className="absolute inset-0 h-2 w-2 animate-ping rounded-full bg-[#4a7c59] opacity-75" />
              </div>
              <span className="font-medium text-[#F4EDE4]">Forward Deployed Engineers</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-[#F4EDE4]/20 bg-[#F4EDE4]/5 px-4 py-2 backdrop-blur-sm">
              <div className="relative">
                <div className="h-2 w-2 rounded-full bg-cyan-400" />
                <div className="absolute inset-0 h-2 w-2 animate-ping rounded-full bg-cyan-400 opacity-75" />
              </div>
              <span className="font-medium text-[#D4C4B0]">2-8 Week Delivery</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-[#F4EDE4]/20 bg-[#F4EDE4]/5 px-4 py-2 backdrop-blur-sm">
              <div className="relative">
                <div className="h-2 w-2 rounded-full bg-[#5a8a65]" />
                <div className="absolute inset-0 h-2 w-2 animate-ping rounded-full bg-[#5a8a65] opacity-75" />
              </div>
              <span className="font-medium text-[#D4C4B0]">Production AI</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex flex-col gap-4 sm:flex-row sm:justify-center"
          >
            <Button
              size="lg"
              className="group relative overflow-hidden bg-gradient-to-r from-[#4a7c59] to-[#5a8a65] px-6 py-4 text-base font-semibold text-[#191919] transition-all hover:scale-105 hover:shadow-2xl hover:shadow-[#4a7c59]/50 sm:px-8 sm:py-6 sm:text-lg"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onClick={() => {
                trackEmailClick('AI Project Inquiry', 'Describe Your Project', 'hero');
                window.location.href = 'mailto:director@bonusthoughts.com?subject=AI%20Project%20Inquiry&body=Hi%2C%0A%0AI%27m%20interested%20in%20discussing%20an%20AI%20project.%0A%0AProject%20type%3A%20%0ATimeline%3A%20%0ABrief%20description%3A%20%0A%0ALooking%20forward%20to%20hearing%20from%20you.';
              }}
            >
              <motion.span
                className="relative z-10"
                animate={{ x: isHovering ? 5 : 0 }}
              >
                Describe Your Project →
              </motion.span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#5a8a65] to-[#4a7c59]"
                initial={{ x: "100%" }}
                animate={{ x: isHovering ? 0 : "100%" }}
                transition={{ duration: 0.3 }}
              />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-[#4a7c59]/40 bg-[#F4EDE4]/5 px-6 py-4 text-base font-semibold text-[#F4EDE4] backdrop-blur-sm transition-all hover:border-[#4a7c59]/70 hover:bg-[#F4EDE4]/10 sm:px-8 sm:py-6 sm:text-lg"
              onClick={() => document.getElementById('case-studies')?.scrollIntoView({ behavior: 'smooth' })}
            >
              See Our Builds
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.4 }}
            className="mt-4 text-center text-sm text-[#D4C4B0]"
          >
            <span className="font-semibold text-[#5a8a65]">Free scoping call</span> · Fixed pricing · No fluff
          </motion.p>
        </motion.div>
      </section>

      {/* Forward Deployed Engineers Section */}
      <section className="relative z-10 mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="mb-8 text-4xl font-bold text-[#F4EDE4] sm:text-5xl">
            Engineers Who Build With You
          </h2>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-[#D4C4B0] mb-8">
            Not offshore. Not outsourced. Forward deployed to your team.
          </p>

          <div className="grid gap-6 md:grid-cols-3 mt-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0 }}
              className="rounded-lg border border-[#F4EDE4]/10 bg-[#F4EDE4]/5 p-6 backdrop-blur-sm"
            >
              <Users className="h-8 w-8 text-[#4a7c59] mb-4" />
              <h3 className="mb-2 text-xl font-bold text-[#4a7c59]">Embedded With Your Team</h3>
              <p className="text-sm text-[#D4C4B0]">Our engineers join your Slack, attend your standups, and work your hours. Not consultants who disappear—builders who ship.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-lg border border-[#F4EDE4]/10 bg-[#F4EDE4]/5 p-6 backdrop-blur-sm"
            >
              <Cpu className="h-8 w-8 text-[#5a8a65] mb-4" />
              <h3 className="mb-2 text-xl font-bold text-[#5a8a65]">AI Specialists</h3>
              <p className="text-sm text-[#D4C4B0]">We've deployed production AI across agents, RAG, computer vision, and LLM apps. We know the pitfalls and shortcuts.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-lg border border-[#F4EDE4]/10 bg-[#F4EDE4]/5 p-6 backdrop-blur-sm"
            >
              <Receipt className="h-8 w-8 text-cyan-400 mb-4" />
              <h3 className="mb-2 text-xl font-bold text-cyan-400">Fixed Scope, Fixed Price</h3>
              <p className="text-sm text-[#D4C4B0]">After our scoping call, you get a concrete proposal with timeline and price. No hourly billing. No scope creep.</p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Industries Section */}
      <section id="industries" className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="mb-16 text-center text-5xl font-bold">
            <span className="bg-gradient-to-r from-[#4a7c59] to-[#5a8a65] bg-clip-text text-transparent">
              What We Build
            </span>
          </h2>
          <p className="text-center text-[#D4C4B0] max-w-2xl mx-auto mb-12">
            Production AI systems. Shipped in weeks, not quarters.
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((industry, index) => (
              <motion.div
                key={industry.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <Card
                  className={`group relative flex h-full min-h-[220px] sm:min-h-[280px] flex-col overflow-hidden border-[#F4EDE4]/10 bg-gradient-to-br ${industry.color} p-5 sm:p-8 backdrop-blur-sm transition-all hover:border-[#4a7c59]/50 hover:shadow-2xl hover:shadow-[#4a7c59]/20`}
                >
                  {/* Organic background shapes - unique per card - hidden on mobile */}
                  {index === 0 && (
                    <div className="absolute -right-12 -top-12 h-32 w-32 md:h-48 md:w-48 bg-[#4a7c59]/20 md:bg-[#4a7c59]/30 blur-2xl md:blur-3xl hidden sm:block" style={{ borderRadius: '40% 60% 70% 30% / 60% 30% 70% 40%' }} />
                  )}
                  {index === 1 && (
                    <>
                      <div className="absolute -left-4 top-4 md:-left-8 md:top-8 h-24 w-24 md:h-32 md:w-32 bg-[#5a8a65]/20 md:bg-[#5a8a65]/30 blur-2xl md:blur-3xl hidden sm:block" style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }} />
                      <div className="absolute -right-2 bottom-8 md:-right-4 md:bottom-12 h-32 w-32 md:h-40 md:w-40 bg-[#2d5945]/20 md:bg-[#2d5945]/30 blur-2xl md:blur-3xl hidden sm:block" style={{ borderRadius: '30% 70% 70% 30% / 30% 60% 40% 70%' }} />
                    </>
                  )}
                  {index === 2 && (
                    <>
                      <div className="absolute left-2 top-2 md:left-4 md:top-4 h-20 w-20 md:h-24 md:w-24 bg-[#5a8a65]/20 md:bg-[#5a8a65]/30 blur-xl md:blur-2xl hidden sm:block" style={{ borderRadius: '50% 50% 50% 50% / 60% 40% 60% 40%' }} />
                      <div className="absolute right-4 top-12 md:right-8 md:top-16 h-24 w-24 md:h-28 md:w-28 bg-[#4a7c59]/20 md:bg-[#4a7c59]/30 blur-xl md:blur-2xl hidden sm:block" style={{ borderRadius: '40% 60% 60% 40% / 50% 50% 50% 50%' }} />
                    </>
                  )}
                  {index === 3 && (
                    <>
                      <div className="absolute -left-4 top-1/4 md:-left-8 h-40 w-40 md:h-56 md:w-56 bg-[#5a8a65]/20 md:bg-[#5a8a65]/30 blur-2xl md:blur-3xl hidden sm:block" style={{ borderRadius: '40% 60% 60% 40% / 70% 30% 70% 30%' }} />
                      <div className="absolute -right-4 bottom-1/4 md:-right-8 h-32 w-32 md:h-48 md:w-48 bg-[#4a7c59]/20 md:bg-[#4a7c59]/30 blur-2xl md:blur-3xl hidden sm:block" style={{ borderRadius: '60% 40% 40% 60% / 30% 70% 30% 70%' }} />
                    </>
                  )}
                  {index === 4 && (
                    <div className="absolute left-1/2 top-1/2 h-48 w-48 md:h-64 md:w-64 -translate-x-1/2 -translate-y-1/2 bg-[#2d5945]/20 md:bg-[#2d5945]/30 blur-2xl md:blur-3xl hidden sm:block" style={{ borderRadius: '50%' }} />
                  )}
                  {index === 5 && (
                    <>
                      <div className="absolute left-0 top-0 h-32 md:h-40 w-full bg-[#4a7c59]/20 md:bg-[#4a7c59]/30 blur-2xl md:blur-3xl hidden sm:block" style={{ borderRadius: '30% 70% 0% 0% / 30% 70% 0% 0%' }} />
                      <div className="absolute bottom-0 right-0 h-32 md:h-40 w-1/2 md:w-2/3 bg-[#5a8a65]/20 md:bg-[#5a8a65]/30 blur-2xl md:blur-3xl hidden sm:block" style={{ borderRadius: '0% 0% 70% 30% / 0% 0% 70% 30%' }} />
                    </>
                  )}

                  <div className="relative z-10 flex flex-1 flex-col">
                    <motion.div
                      className="relative mb-4 inline-block"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                      {/* Pulse wave rings */}
                      <motion.div
                        className="absolute inset-0 -m-4"
                        initial={{ opacity: 0, scale: 1 }}
                        whileHover={{
                          opacity: [0, 0.4, 0],
                          scale: [1, 1.1],
                        }}
                        transition={{
                          duration: 2.5,
                          ease: "easeOut",
                          times: [0, 0.2, 1],
                        }}
                      >
                        <div className="absolute inset-0 rounded-full border-2 border-cyan-400/60" />
                      </motion.div>
                      <motion.div
                        className="absolute inset-0 -m-4"
                        initial={{ opacity: 0, scale: 1 }}
                        whileHover={{
                          opacity: [0, 0.3, 0],
                          scale: [1, 2.2],
                        }}
                        transition={{
                          duration: 2.5,
                          ease: "easeOut",
                          times: [0, 0.2, 1],
                          delay: 0.3,
                        }}
                      >
                        <div className="absolute inset-0 rounded-full border-2 border-cyan-400/40" />
                      </motion.div>
                      <industry.icon className="relative h-12 w-12 sm:h-16 sm:w-16 text-[#4a7c59] stroke-[1.1] transition-colors group-hover:text-[#5a8a65]" />
                    </motion.div>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#F4EDE4]">
                      {industry.name}
                    </h3>
                    <p className="mt-2 text-sm sm:text-base text-[#D4C4B0]">
                      {industry.description}
                    </p>
                  </div>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-[#4a7c59]/0 to-[#5a8a65]/0 group-hover:from-[#4a7c59]/10 group-hover:to-[#5a8a65]/10"
                    transition={{ duration: 0.3 }}
                  />
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Mission-Critical Section */}
      <section className="relative z-10 px-0 py-12 sm:mx-auto sm:max-w-7xl sm:px-6 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-none border-y border-[#4a7c59]/20 bg-gradient-to-br from-[#191919]/80 to-[#2a2a2a]/80 p-6 backdrop-blur-xl sm:rounded-3xl sm:border sm:from-[#191919] sm:to-[#2a2a2a] sm:p-12 md:p-16"
        >
          {/* Subtle geometric background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute left-10 top-10 h-32 w-32 rounded-full border border-[#4a7c59]" />
            <div className="absolute bottom-10 right-10 h-24 w-24 rotate-45 border border-cyan-400" />
            <div className="absolute right-1/4 top-1/3 h-16 w-16 border border-[#5a8a65]" />
          </div>

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8 text-center"
            >
              <h2 className="mb-4 text-4xl font-bold text-[#F4EDE4] sm:text-5xl">
                How We Work
                <span className="bg-gradient-to-r from-[#4a7c59] to-[#5a8a65] bg-clip-text text-transparent">
                  {" "}
                </span>
              </h2>
              <p className="mx-auto max-w-3xl text-lg leading-relaxed text-[#D4C4B0]">
                We're not here to sell you a platform or follow a template. We understand your operation, see what's possible, and execute with focus.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid gap-8 md:grid-cols-3"
            >
              <div className="group rounded-2xl border border-[#F4EDE4]/10 bg-[#F4EDE4]/0 p-6 backdrop-blur-sm transition-all hover:border-[#4a7c59]/30 hover:bg-[#F4EDE4]/5 sm:bg-[#F4EDE4]/5 sm:hover:bg-[#F4EDE4]/10">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#4a7c59]/10">
                  <Users className="h-6 w-6 text-[#4a7c59]" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-[#F4EDE4]">Dedicated Engineers</h3>
                <p className="text-[#D4C4B0]">
                  1-2 engineers assigned to your project full-time until delivery. Not juggling five clients—focused on yours.
                </p>
              </div>

              <div className="group rounded-2xl border border-[#F4EDE4]/10 bg-[#F4EDE4]/0 p-6 backdrop-blur-sm transition-all hover:border-cyan-400/30 hover:bg-[#F4EDE4]/5 sm:bg-[#F4EDE4]/5 sm:hover:bg-[#F4EDE4]/10">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-cyan-400/20">
                  <Play className="h-6 w-6 text-cyan-400" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-[#F4EDE4]">Weekly Demos</h3>
                <p className="text-[#D4C4B0]">
                  See progress every week. Give feedback. Course-correct early. No surprises at the end.
                </p>
              </div>

              <div className="group rounded-2xl border border-[#F4EDE4]/10 bg-[#F4EDE4]/0 p-6 backdrop-blur-sm transition-all hover:border-[#5a8a65]/30 hover:bg-[#F4EDE4]/5 sm:bg-[#F4EDE4]/5 sm:hover:bg-[#F4EDE4]/10">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#5a8a65]/20">
                  <Rocket className="h-6 w-6 text-[#5a8a65]" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-[#F4EDE4]">
                  Shipped AI at Scale
                </h3>
                <p className="text-[#D4C4B0]">
                  Production systems across finance, healthcare, legal, and operations. We've seen what works and what fails.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Approach & Process Section */}
      <section id="innovation" className="relative z-10 px-0 py-16 sm:mx-auto sm:max-w-5xl sm:px-6 sm:py-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-none border-y border-[#F4EDE4]/10 bg-gradient-to-br from-[#4a7c59]/15 to-[#2d5945]/15 p-6 backdrop-blur-xl sm:rounded-3xl sm:border sm:from-[#4a7c59]/20 sm:to-[#2d5945]/20 sm:p-12"
        >
          <motion.div
            className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-[#4a7c59]/30 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-[#5a8a65]/30 blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />

          <div className="relative z-10">
            <h2 className="mb-6 text-center text-4xl font-bold text-[#F4EDE4] sm:text-5xl">
              The Process
            </h2>

            <p className="max-w-2xl mx-auto text-center text-lg text-[#D4C4B0] mb-10">
              From conversation to execution. Clear thinking, then action.
            </p>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-[#F4EDE4]/10 bg-[#F4EDE4]/0 p-6 backdrop-blur-sm sm:bg-[#F4EDE4]/5">
                <p className="mb-4 text-2xl font-bold text-[#4a7c59]">1. Scope</p>
                <p className="text-sm text-[#D4C4B0]">You describe the problem. We ask the right questions. You leave with project outline, timeline, and fixed price.</p>
              </div>

              <div className="rounded-xl border border-[#5a8a65]/20 bg-[#5a8a65]/0 p-6 backdrop-blur-sm sm:bg-[#5a8a65]/10">
                <p className="mb-4 text-2xl font-bold text-[#5a8a65]">2. Deploy</p>
                <p className="text-sm text-[#D4C4B0]">We assign engineers to your project. They join your Slack, attend your standups, work your hours.</p>
              </div>

              <div className="rounded-xl border border-[#00E5FF]/20 bg-[#00E5FF]/0 p-6 backdrop-blur-sm sm:bg-[#00E5FF]/5">
                <p className="mb-4 text-2xl font-bold text-cyan-400">3. Build</p>
                <p className="text-sm text-[#D4C4B0]">Iterative development with weekly demos. You see progress, give feedback, no surprises.</p>
              </div>

              <div className="rounded-xl border border-[#4a7c59]/20 bg-[#4a7c59]/0 p-6 backdrop-blur-sm sm:bg-[#4a7c59]/10">
                <p className="mb-4 text-2xl font-bold text-[#5a8a65]">4. Ship</p>
                <p className="text-sm text-[#D4C4B0]">We document everything, train your team, and hand off clean code. You own it.</p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#4a7c59] to-[#5a8a65] px-8 py-6 text-lg font-semibold text-[#191919] transition-all hover:scale-105 hover:shadow-2xl hover:shadow-[#4a7c59]/50"
                onClick={() => {
                  trackEmailClick('AI Project Inquiry', 'Describe Your Project', 'process-section');
                  window.location.href = 'mailto:director@bonusthoughts.com?subject=AI%20Project%20Inquiry&body=Hi%2C%0A%0AI%27m%20interested%20in%20discussing%20an%20AI%20project.%0A%0AProject%20type%3A%20%0ATimeline%3A%20%0ABrief%20description%3A%20%0A%0ALooking%20forward%20to%20hearing%20from%20you.';
                }}
              >
                Describe Your Project →
              </Button>
              <p className="mt-4 text-sm text-[#D4C4B0]">
                <span className="font-semibold text-[#5a8a65]">Free scoping call</span> · Get a fixed quote in 48 hours
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Case Studies Section */}
      <section id="case-studies" className="relative z-10 mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="mb-4 text-center text-5xl font-bold">
            <span className="bg-gradient-to-r from-[#4a7c59] to-[#5a8a65] bg-clip-text text-transparent">
              AI Builds in Production
            </span>
          </h2>
          <p className="text-center text-[#D4C4B0] mb-12">
            Real systems. Real results. AI that takes action.
          </p>

          <div className="grid gap-6 md:grid-cols-3 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0 }}
              className="rounded-lg border border-[#F4EDE4]/10 bg-[#F4EDE4]/5 p-6 backdrop-blur-sm"
            >
              <span className="inline-block px-3 py-1 text-xs font-semibold bg-[#4a7c59]/20 text-[#4a7c59] rounded-full mb-4">Customer Operations</span>
              <h3 className="mb-2 text-xl font-bold text-[#F4EDE4]">Conversational AI Platform</h3>
              <p className="text-sm text-[#D4C4B0] mb-4">Inbound/outbound AI with tool access—collects payments, books appointments, handles inquiries 24/7.</p>
              <p className="text-sm font-semibold text-[#4a7c59]">"AI that doesn't just talk—it transacts."</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-lg border border-[#F4EDE4]/10 bg-[#F4EDE4]/5 p-6 backdrop-blur-sm"
            >
              <span className="inline-block px-3 py-1 text-xs font-semibold bg-[#5a8a65]/20 text-[#5a8a65] rounded-full mb-4">Document Intelligence</span>
              <h3 className="mb-2 text-xl font-bold text-[#F4EDE4]">Tax Categorization Engine</h3>
              <p className="text-sm text-[#D4C4B0] mb-4">OCR + LLM pipeline that automatically categorizes charges to appropriate tax categories.</p>
              <p className="text-sm font-semibold text-[#5a8a65]">"Hours of manual work → seconds of AI processing."</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-lg border border-[#F4EDE4]/10 bg-[#F4EDE4]/5 p-6 backdrop-blur-sm"
            >
              <span className="inline-block px-3 py-1 text-xs font-semibold bg-cyan-400/20 text-cyan-400 rounded-full mb-4">Sales Intelligence</span>
              <h3 className="mb-2 text-xl font-bold text-[#F4EDE4]">AI-Enhanced CRM</h3>
              <p className="text-sm text-[#D4C4B0] mb-4">Email content analysis that auto-updates pipeline, surfaces opportunities, keeps data fresh.</p>
              <p className="text-sm font-semibold text-cyan-400">"Your CRM updates itself."</p>
            </motion.div>
          </div>

          <p className="text-center text-sm text-[#D4C4B0] mb-8">
            Also: Location intelligence platforms, audit-proof reporting systems, workflow automation, and more.
          </p>

          <div className="text-center">
            <p className="mb-6 text-lg text-[#D4C4B0]">
              <span className="font-semibold text-[#F4EDE4]">Have an AI idea?</span>
              <br />
              Let's talk about what's possible.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-[#4a7c59] to-[#5a8a65] px-8 py-6 text-lg font-semibold text-[#191919] transition-all hover:scale-105 hover:shadow-2xl hover:shadow-[#4a7c59]/50"
              onClick={() => {
                trackEmailClick('AI Project Inquiry', 'Describe Your Project', 'case-studies');
                window.location.href = 'mailto:director@bonusthoughts.com?subject=AI%20Project%20Inquiry&body=Hi%2C%0A%0AI%27m%20interested%20in%20discussing%20an%20AI%20project.%0A%0AProject%20type%3A%20%0ATimeline%3A%20%0ABrief%20description%3A%20%0A%0ALooking%20forward%20to%20hearing%20from%20you.';
              }}
            >
              Describe Your Project →
            </Button>
          </div>
        </motion.div>
      </section>

      {/* AI Training Section */}
      <section id="training" className="relative z-10 mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-3xl border border-cyan-400/30 bg-gradient-to-br from-cyan-400/10 to-[#4a7c59]/10 p-6 backdrop-blur-xl sm:p-12 md:p-16"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#4a7c59]/20 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center gap-3 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2">
                <GraduationCap className="h-5 w-5 text-cyan-400" />
                <span className="text-sm font-semibold text-cyan-400">On-Site AI Training</span>
              </div>
            </div>

            <h2 className="mb-6 text-center text-4xl font-bold text-[#F4EDE4] sm:text-5xl">
              Get Your Team <span className="text-cyan-400">AI-Ready</span>
            </h2>

            <p className="mx-auto mb-10 max-w-2xl text-center text-lg text-[#D4C4B0]">
              We come to you. Hands-on training on today's most powerful AI tools.
              Your team leaves with accounts set up, workflows configured, and real skills—not just theory.
            </p>

            {/* AI Assistants */}
            <div className="mb-8">
              <h3 className="text-center text-sm font-semibold text-[#D4C4B0] uppercase tracking-wider mb-4">AI Assistants</h3>
              <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                <div className="rounded-xl border border-[#F4EDE4]/10 bg-[#F4EDE4]/5 p-4 text-center">
                  <p className="text-xl font-bold text-cyan-400 mb-1">Claude</p>
                  <p className="text-xs text-[#D4C4B0]">Anthropic</p>
                </div>
                <div className="rounded-xl border border-[#F4EDE4]/10 bg-[#F4EDE4]/5 p-4 text-center">
                  <p className="text-xl font-bold text-[#4a7c59] mb-1">ChatGPT</p>
                  <p className="text-xs text-[#D4C4B0]">OpenAI</p>
                </div>
                <div className="rounded-xl border border-[#F4EDE4]/10 bg-[#F4EDE4]/5 p-4 text-center">
                  <p className="text-xl font-bold text-[#5a8a65] mb-1">Gemini</p>
                  <p className="text-xs text-[#D4C4B0]">Google</p>
                </div>
                <div className="rounded-xl border border-[#F4EDE4]/10 bg-[#F4EDE4]/5 p-4 text-center">
                  <p className="text-xl font-bold text-[#D4C4B0] mb-1">Grok</p>
                  <p className="text-xs text-[#D4C4B0]">xAI</p>
                </div>
              </div>
            </div>

            {/* Enterprise & Productivity */}
            <div className="mb-8">
              <h3 className="text-center text-sm font-semibold text-[#D4C4B0] uppercase tracking-wider mb-4">Enterprise & Productivity</h3>
              <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
                <div className="rounded-xl border border-[#F4EDE4]/10 bg-[#F4EDE4]/5 p-4 text-center">
                  <p className="text-xl font-bold text-cyan-400 mb-1">Microsoft Copilot</p>
                  <p className="text-xs text-[#D4C4B0]">Office 365 Integration</p>
                </div>
                <div className="rounded-xl border border-[#F4EDE4]/10 bg-[#F4EDE4]/5 p-4 text-center">
                  <p className="text-xl font-bold text-[#4a7c59] mb-1">Perplexity</p>
                  <p className="text-xs text-[#D4C4B0]">Research & Citations</p>
                </div>
                <div className="rounded-xl border border-[#F4EDE4]/10 bg-[#F4EDE4]/5 p-4 text-center">
                  <p className="text-xl font-bold text-[#5a8a65] mb-1">GitHub Copilot</p>
                  <p className="text-xs text-[#D4C4B0]">Developer Productivity</p>
                </div>
              </div>
            </div>

            {/* AI-Powered IDEs & Agents */}
            <div className="mb-8">
              <h3 className="text-center text-sm font-semibold text-[#D4C4B0] uppercase tracking-wider mb-4">AI-Powered IDEs & Agents</h3>
              <div className="grid gap-4 grid-cols-2 md:grid-cols-5">
                <div className="rounded-xl border border-[#F4EDE4]/10 bg-[#F4EDE4]/5 p-4 text-center">
                  <p className="text-xl font-bold text-cyan-400 mb-1">Claude Code</p>
                  <p className="text-xs text-[#D4C4B0]">Agentic CLI & IDE</p>
                </div>
                <div className="rounded-xl border border-[#F4EDE4]/10 bg-[#F4EDE4]/5 p-4 text-center">
                  <p className="text-xl font-bold text-cyan-400 mb-1">Claude Cowork</p>
                  <p className="text-xs text-[#D4C4B0]">Desktop Agent</p>
                </div>
                <div className="rounded-xl border border-[#F4EDE4]/10 bg-[#F4EDE4]/5 p-4 text-center">
                  <p className="text-xl font-bold text-[#4a7c59] mb-1">Cursor</p>
                  <p className="text-xs text-[#D4C4B0]">AI-First IDE</p>
                </div>
                <div className="rounded-xl border border-[#F4EDE4]/10 bg-[#F4EDE4]/5 p-4 text-center">
                  <p className="text-xl font-bold text-[#5a8a65] mb-1">Windsurf</p>
                  <p className="text-xs text-[#D4C4B0]">Codeium IDE</p>
                </div>
                <div className="rounded-xl border border-[#F4EDE4]/10 bg-[#F4EDE4]/5 p-4 text-center">
                  <p className="text-xl font-bold text-[#D4C4B0] mb-1">Antigravity</p>
                  <p className="text-xs text-[#D4C4B0]">Google Agentic IDE</p>
                </div>
              </div>
            </div>

            {/* Open Source & Specialized */}
            <div className="mb-10">
              <h3 className="text-center text-sm font-semibold text-[#D4C4B0] uppercase tracking-wider mb-4">Open Source & Specialized</h3>
              <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                <div className="rounded-xl border border-[#F4EDE4]/10 bg-[#F4EDE4]/5 p-4 text-center">
                  <p className="text-xl font-bold text-cyan-400 mb-1">Llama 4</p>
                  <p className="text-xs text-[#D4C4B0]">Meta (Open Source)</p>
                </div>
                <div className="rounded-xl border border-[#F4EDE4]/10 bg-[#F4EDE4]/5 p-4 text-center">
                  <p className="text-xl font-bold text-[#4a7c59] mb-1">DeepSeek</p>
                  <p className="text-xs text-[#D4C4B0]">Open Source Reasoning</p>
                </div>
                <div className="rounded-xl border border-[#F4EDE4]/10 bg-[#F4EDE4]/5 p-4 text-center">
                  <p className="text-xl font-bold text-[#5a8a65] mb-1">Mistral</p>
                  <p className="text-xs text-[#D4C4B0]">European Alternative</p>
                </div>
                <div className="rounded-xl border border-[#F4EDE4]/10 bg-[#F4EDE4]/5 p-4 text-center">
                  <p className="text-xl font-bold text-[#D4C4B0] mb-1">Midjourney</p>
                  <p className="text-xs text-[#D4C4B0]">Image Generation</p>
                </div>
              </div>
            </div>

            <div className="text-center mb-8">
              <p className="text-sm text-[#D4C4B0] mb-6">
                <span className="font-semibold text-[#F4EDE4]">Half-day, full-day, or multi-day options</span> · Customized to your team's needs · Accounts set up before we leave
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-cyan-500 to-cyan-400 px-8 py-6 text-lg font-semibold text-[#191919] transition-all hover:scale-105 hover:shadow-2xl hover:shadow-cyan-400/50"
                  onClick={() => {
                    trackEmailClick('AI Training Inquiry', 'Book a Training', 'training-section');
                    window.location.href = 'mailto:director@bonusthoughts.com?subject=AI%20Training%20Inquiry&body=Hi%2C%0A%0AI%27m%20interested%20in%20AI%20training%20for%20my%20team.%0A%0ATeam%20size%3A%20%0ATools%20of%20interest%3A%20%0APreferred%20format%20(half-day%2Ffull-day%2Fmulti-day)%3A%20%0A%0ALooking%20forward%20to%20hearing%20from%20you.';
                  }}
                >
                  Book a Training →
                </Button>
                <Link
                  href="/training-guide"
                  className="inline-flex items-center justify-center border-2 border-cyan-400/40 bg-[#F4EDE4]/5 px-8 py-6 text-lg font-semibold text-[#F4EDE4] backdrop-blur-sm transition-all hover:border-cyan-400/70 hover:bg-[#F4EDE4]/10 rounded-md"
                  onClick={() => trackNavClick('/training-guide', 'homepage')}
                >
                  View Training Guide
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Final CTA Section */}
      <section className="relative z-10 mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="overflow-hidden rounded-3xl border border-[#5a8a65]/30 bg-gradient-to-br from-[#5a8a65]/10 to-[#4a7c59]/10 p-6 backdrop-blur-xl sm:p-12 md:p-16 text-center"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-4 text-3xl font-bold text-[#F4EDE4] sm:text-4xl"
          >
            Ready to get started?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mb-8 max-w-2xl text-lg text-[#D4C4B0]"
          >
            Whether you need a custom AI system built or want to train your team on the latest tools—let's talk about what would move the needle for you.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-[#4a7c59] to-[#5a8a65] px-8 py-6 text-lg font-semibold text-[#191919] transition-all hover:scale-105 hover:shadow-2xl hover:shadow-[#4a7c59]/50"
              onClick={() => {
                trackEmailClick('AI Project Inquiry', 'Schedule a Call', 'final-cta');
                window.location.href = 'mailto:director@bonusthoughts.com?subject=AI%20Project%20Inquiry&body=Hi%2C%0A%0AI%27m%20interested%20in%20discussing%20an%20AI%20project.%0A%0AProject%20type%3A%20%0ATimeline%3A%20%0ABrief%20description%3A%20%0A%0ALooking%20forward%20to%20hearing%20from%20you.';
              }}
            >
              Schedule a Call →
            </Button>
            <Link
              href="/training-guide"
              className="inline-flex items-center justify-center border-2 border-[#4a7c59]/40 bg-[#F4EDE4]/5 px-8 py-6 text-lg font-semibold text-[#F4EDE4] backdrop-blur-sm transition-all hover:border-[#4a7c59]/70 hover:bg-[#F4EDE4]/10 rounded-md"
              onClick={() => trackNavClick('/training-guide', 'homepage')}
            >
              View Training Guide
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer id="contact" className="relative z-10 border-t border-[#F4EDE4]/10 py-12">
        <div className="mx-auto max-w-7xl px-6">
          {/* Trust Signals */}
          <div className="mb-8 flex flex-wrap items-center justify-center gap-4 text-sm text-[#3a5a47]">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="h-1.5 w-1.5 rounded-full bg-[#4a7c59]" />
                <div className="absolute inset-0 h-1.5 w-1.5 animate-ping rounded-full bg-[#4a7c59] opacity-75" />
              </div>
              <span>SDVOSB Certified</span>
            </div>
            <div className="hidden text-[#F4EDE4]/20 sm:block">|</div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                <div className="absolute inset-0 h-1.5 w-1.5 animate-ping rounded-full bg-cyan-400 opacity-75" />
              </div>
              <span>SAM Registered</span>
            </div>
            <div className="hidden text-[#F4EDE4]/20 sm:block">|</div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="h-1.5 w-1.5 rounded-full bg-[#5a8a65]" />
                <div className="absolute inset-0 h-1.5 w-1.5 animate-ping rounded-full bg-[#5a8a65] opacity-75" />
              </div>
              <span>Production AI</span>
            </div>
          </div>

          {/* Footer Links & Contact */}
          <div className="text-center space-y-6">
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <motion.a
                whileHover={{ y: -2 }}
                href="mailto:director@bonusthoughts.com?subject=AI%20Project%20Inquiry&body=Hi%2C%0A%0AI%27m%20interested%20in%20discussing%20an%20AI%20project.%0A%0AProject%20type%3A%20%0ATimeline%3A%20%0ABrief%20description%3A%20%0A%0ALooking%20forward%20to%20hearing%20from%20you."
                className="transition-colors hover:text-[#5a8a65] font-semibold"
              >
                Describe Your Project
              </motion.a>
              <span className="text-[#F4EDE4]/20">|</span>
              <motion.a
                whileHover={{ y: -2 }}
                href="https://x.com/nlynch_ai"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-[#5a8a65]"
              >
                @nlynch_AI on X
              </motion.a>
              <span className="text-[#F4EDE4]/20">|</span>
              <motion.a
                whileHover={{ y: -2 }}
                href="mailto:director@bonusthoughts.com"
                className="transition-colors hover:text-[#5a8a65]"
              >
                director@bonusthoughts.com
              </motion.a>
            </div>
            <p className="text-[#3a5a47] text-sm">
              © 2025 BonusThoughts. Custom AI development. Forward deployed engineers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
