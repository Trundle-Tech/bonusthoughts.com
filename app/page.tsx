"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LeadMagnetModal } from "@/components/lead-magnet-modal";
import { useEffect, useState } from "react";
import { Heart, DollarSign, Factory, Zap, Wheat, Rocket } from "lucide-react";

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isPlaybookModalOpen, setIsPlaybookModalOpen] = useState(false);

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
    "description": "AI Program Director for executive teams",
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
    "jobTitle": "AI Program Director",
    "description": "Former Intelligence Community architect. Built AI systems powering federal operations. Veteran-led AI Program Director.",
    "url": "https://bonusthoughts.com",
    "sameAs": "https://x.com/nlynch_ai",
    "credentials": [
      "TS/SCI Security Clearance",
      "SDVOSB Certified",
      "SAM Registered"
    ]
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "AI Program Direction",
    "description": "Veteran-led AI program direction for executives with teams but no velocity. Direct your AI initiatives like military operations—10-16 weeks instead of 18 months.",
    "provider": {
      "@type": "Organization",
      "name": "BonusThoughts",
      "url": "https://bonusthoughts.com"
    },
    "areaServed": "US",
    "priceRange": "$25000-$500000",
    "offers": [
      {
        "@type": "Offer",
        "name": "Program Diagnostic",
        "price": "25000",
        "priceCurrency": "USD",
        "description": "2-week AI audit + 90-day roadmap + hiring plan"
      },
      {
        "@type": "Offer",
        "name": "Director Retainer",
        "price": "15000",
        "priceCurrency": "USD",
        "priceValidUntil": "2025-12-31",
        "description": "Monthly retainer for ongoing AI program direction (6-18 months)"
      }
    ]
  };

  const capabilities = [
    {
      name: "AI Strategy & Roadmap",
      icon: Heart,
      color: "from-[#4a7c59]/20 to-[#5a8a65]/20",
      description: "Where to start. What to kill. Prioritized 90-day roadmap. Get your team aligned on what actually matters."
    },
    {
      name: "Technology Architecture",
      icon: DollarSign,
      color: "from-[#5a6b3e]/20 to-[#6a9a75]/20",
      description: "Design systems that fit your constraints. Make technical choices that align with your actual needs, not trends."
    },
    {
      name: "Team & Hiring Plans",
      icon: Factory,
      color: "from-[#4a7c59]/20 to-[#3a5a47]/20",
      description: "Who you actually need. When to hire. What titles make sense. Build the right team for the work."
    },
    {
      name: "Conversational AI Agents",
      icon: Zap,
      color: "from-[#6a9a75]/20 to-[#5a6b3e]/20",
      description: "Phone agents replacing IVRs. CRM-integrated workflows. 80%+ pipeline completion. Real customer interaction."
    },
    {
      name: "Geospatial & Computer Vision",
      icon: Wheat,
      color: "from-[#3a5a47]/20 to-[#2d5945]/20",
      description: "Intelligence from imagery. Real-time analysis. Mission-critical insights. Proven at scale."
    },
    {
      name: "Data Integrity & Reporting",
      icon: Rocket,
      color: "from-[#4a7c59]/20 to-[#5a8a65]/20",
      description: "Zero-loss data pipelines. Ground truth reporting. Board-ready ROI dashboards. No surprises."
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
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold bg-gradient-to-r from-[#4a7c59] to-[#5a8a65] bg-clip-text text-transparent"
            >
              BonusThoughts
            </motion.div>
            <div className="flex gap-8 text-sm font-medium">
              <motion.a
                whileHover={{ y: -2 }}
                href="#industries"
                className="transition-colors hover:text-[#5a8a65]"
              >
                Capabilities
              </motion.a>
              <motion.a
                whileHover={{ y: -2 }}
                href="#innovation"
                className="transition-colors hover:text-[#5a8a65]"
              >
                Approach
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
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-32">
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
              <h1 className="text-7xl font-black tracking-tight sm:text-8xl md:text-9xl">
                <span className="bg-gradient-to-r from-[#4a7c59] via-[#5a8a65] to-[#5a6b3e] bg-clip-text text-transparent">
                  Bespoke
                </span>
                <br />
                <span className="text-[#F4EDE4]">Solutions.</span>
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
            className="mx-auto mb-8 max-w-2xl text-xl text-[#D4C4B0] sm:text-2xl"
          >
            Technology built for problems that don't fit templates.
            <br />
            <span className="font-semibold text-[#5a8a65]">Making things that matter.</span>
          </motion.p>

          {/* Trust Signals */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mb-10 flex flex-wrap items-center justify-center gap-6 text-sm"
          >
            <div className="flex items-center gap-2 rounded-full border border-[#4a7c59]/30 bg-[#4a7c59]/10 px-4 py-2 backdrop-blur-sm">
              <div className="relative">
                <div className="h-2 w-2 rounded-full bg-[#4a7c59]" />
                <div className="absolute inset-0 h-2 w-2 animate-ping rounded-full bg-[#4a7c59] opacity-75" />
              </div>
              <span className="font-medium text-[#F4EDE4]">SDVOSB Certified</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-[#F4EDE4]/20 bg-[#F4EDE4]/5 px-4 py-2 backdrop-blur-sm">
              <div className="relative">
                <div className="h-2 w-2 rounded-full bg-cyan-400" />
                <div className="absolute inset-0 h-2 w-2 animate-ping rounded-full bg-cyan-400 opacity-75" />
              </div>
              <span className="font-medium text-[#D4C4B0]">People First Tech</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-[#F4EDE4]/20 bg-[#F4EDE4]/5 px-4 py-2 backdrop-blur-sm">
              <div className="relative">
                <div className="h-2 w-2 rounded-full bg-[#5a8a65]" />
                <div className="absolute inset-0 h-2 w-2 animate-ping rounded-full bg-[#5a8a65] opacity-75" />
              </div>
              <span className="font-medium text-[#D4C4B0]">SAM Registered</span>
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
              className="group relative overflow-hidden bg-gradient-to-r from-[#4a7c59] to-[#5a8a65] px-8 py-6 text-lg font-semibold text-[#191919] transition-all hover:scale-105 hover:shadow-2xl hover:shadow-[#4a7c59]/50"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onClick={() => window.open('https://calendly.com/nicklynch-bonusthoughts', '_blank')}
            >
              <motion.span
                className="relative z-10"
                animate={{ x: isHovering ? 5 : 0 }}
              >
                Start a Conversation →
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
              className="border-2 border-[#4a7c59]/40 bg-[#F4EDE4]/5 px-8 py-6 text-lg font-semibold text-[#F4EDE4] backdrop-blur-sm transition-all hover:border-[#4a7c59]/70 hover:bg-[#F4EDE4]/10"
              onClick={() => document.getElementById('case-studies')?.scrollIntoView({ behavior: 'smooth' })}
            >
              See What We Build
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.4 }}
            className="mt-4 text-center text-sm text-[#D4C4B0]"
          >
            <span className="font-semibold text-[#5a8a65]">Exploratory conversation</span> · See if we're a fit · No obligations
          </motion.p>
        </motion.div>
      </section>

      {/* About/Background Section */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="mb-8 text-4xl font-bold text-[#F4EDE4] sm:text-5xl">
            Built for Complexity
          </h2>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-[#D4C4B0] mb-8">
           Experience building technology for problems that don't have obvious answers. Now applying that approach to select clients with unique challenges.
          </p>

          <div className="grid gap-6 md:grid-cols-3 mt-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0 }}
              className="rounded-lg border border-[#F4EDE4]/10 bg-[#F4EDE4]/5 p-6 backdrop-blur-sm"
            >
              <h3 className="mb-2 text-xl font-bold text-[#4a7c59]">Geospatial</h3>
              <p className="text-sm text-[#D4C4B0]">Computer Vision Techniques worthy of classified environments. TS/SCI cleared.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-lg border border-[#F4EDE4]/10 bg-[#F4EDE4]/5 p-6 backdrop-blur-sm"
            >
              <h3 className="mb-2 text-xl font-bold text-[#5a8a65]">All-Source Intelligence</h3>
              <p className="text-sm text-[#D4C4B0]">High Value targeting. Mission planning. Know how to use data to meet the intent.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-lg border border-[#F4EDE4]/10 bg-[#F4EDE4]/5 p-6 backdrop-blur-sm"
            >
              <h3 className="mb-2 text-xl font-bold text-cyan-400">Production AI Systems</h3>
              <p className="text-sm text-[#D4C4B0]">Solutions aren't complex platforms anymore. </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Industries Section */}
      <section id="industries" className="relative z-10 mx-auto max-w-7xl px-6 py-24">
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
                  className={`group relative flex h-full min-h-[280px] flex-col overflow-hidden border-[#F4EDE4]/10 bg-gradient-to-br ${industry.color} p-8 backdrop-blur-sm transition-all hover:border-[#4a7c59]/50 hover:shadow-2xl hover:shadow-[#4a7c59]/20`}
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
                      <industry.icon className="relative h-16 w-16 text-[#4a7c59] stroke-[1.1] transition-colors group-hover:text-[#5a8a65]" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-[#F4EDE4]">
                      {industry.name}
                    </h3>
                    <p className="mt-2 text-[#D4C4B0]">
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
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-3xl border border-[#4a7c59]/20 bg-gradient-to-br from-[#191919] to-[#2a2a2a] p-12 backdrop-blur-xl md:p-16"
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
                Why Choose
                <span className="bg-gradient-to-r from-[#4a7c59] to-[#5a8a65] bg-clip-text text-transparent">
                  {" "}Bespoke
                </span>
              </h2>
              <p className="mx-auto max-w-3xl text-lg leading-relaxed text-[#D4C4B0]">
                When off-the-shelf doesn't work. When your challenge requires someone who understands complexity. Taking on a limited number of clients means full attention to what makes your problem unique.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid gap-8 md:grid-cols-3"
            >
              <div className="group rounded-2xl border border-[#F4EDE4]/10 bg-[#F4EDE4]/5 p-6 backdrop-blur-sm transition-all hover:border-[#4a7c59]/30 hover:bg-[#F4EDE4]/10">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#4a7c59]/10">
                  <div className="relative h-2.5 w-2.5 rounded-full bg-[#4a7c59]">
                    <div className="absolute inset-0 h-2 w-2 animate-ping rounded-full bg-[#4a7c59] opacity-75" />
                  </div>
                </div>
                <h3 className="mb-2 text-xl font-bold text-[#F4EDE4]">Selective Engagement</h3>
                <p className="text-[#D4C4B0]">
                  Only a few clients at a time. Deep focus on problems that matter.
                  No assembly line solutions.
                </p>
              </div>

              <div className="group rounded-2xl border border-[#F4EDE4]/10 bg-[#F4EDE4]/5 p-6 backdrop-blur-sm transition-all hover:border-cyan-400/30 hover:bg-[#F4EDE4]/10">
                <div className="mb-4 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-400/20">
                  <div className="relative h-3.5 w-3.5 rounded-full bg-cyan-400">
                    <div className="absolute inset-0 h-3 w-3 animate-ping rounded-full bg-cyan-400 opacity-75" />
                  </div>
                </div>
                <h3 className="mb-2 text-xl font-bold text-[#F4EDE4]">Built for Complexity</h3>
                <p className="text-[#D4C4B0]">
                  Classified environments. Special operations. Production systems.
                  Experience with problems that have no template.
                </p>
              </div>

              <div className="group rounded-2xl border border-[#F4EDE4]/10 bg-[#F4EDE4]/5 p-6 backdrop-blur-sm transition-all hover:border-[#5a8a65]/30 hover:bg-[#F4EDE4]/10">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#5a8a65]/20">
                  <div className="relative h-3.5 w-3.5 rounded-full bg-[#5a8a65]">
                    <div className="absolute inset-0 h-3 w-3 animate-ping rounded-full bg-[#5a8a65] opacity-20" />
                  </div>
                </div>
                <h3 className="mb-2 text-xl font-bold text-[#F4EDE4]">
                  Cleared & Certified
                </h3>
                <p className="text-[#D4C4B0]">
                  TS/SCI cleared. SDVOSB certified. SAM registered.
                  Can work on sensitive challenges when needed.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Pricing & Process Section */}
      <section id="innovation" className="relative z-10 mx-auto max-w-5xl px-6 py-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-3xl border border-[#F4EDE4]/10 bg-gradient-to-br from-[#4a7c59]/20 to-[#2d5945]/20 p-12 backdrop-blur-xl"
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
            <h2 className="mb-12 text-center text-4xl font-bold text-[#F4EDE4] sm:text-5xl">
              How We Work
            </h2>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-[#F4EDE4]/10 bg-[#F4EDE4]/5 p-6 backdrop-blur-sm">
                <p className="mb-4 text-2xl font-bold text-[#4a7c59]">Program Diagnostic</p>
                <p className="text-sm text-[#D4C4B0] mb-2">2-week audit</p>
                <ul className="text-sm text-[#D4C4B0] space-y-1">
                  <li>• Full AI audit</li>
                  <li>• 90-day roadmap</li>
                  <li>• Hiring plan</li>
                  <li>• Vendor recommendations</li>
                </ul>
              </div>

              <div className="rounded-xl border border-[#5a8a65]/20 bg-[#5a8a65]/10 p-6 backdrop-blur-sm">
                <p className="mb-4 text-2xl font-bold text-[#5a8a65]">Director Retainer</p>
                <p className="text-sm text-[#D4C4B0] mb-2">6–18 months</p>
                <ul className="text-sm text-[#D4C4B0] space-y-1">
                  <li>• Weekly syncs</li>
                  <li>• Architecture decisions</li>
                  <li>• Vendor negotiation</li>
                  <li>• Team coaching</li>
                </ul>
              </div>

              <div className="rounded-xl border border-[#00E5FF]/20 bg-[#00E5FF]/5 p-6 backdrop-blur-sm">
                <p className="mb-4 text-2xl font-bold text-cyan-400">Outcome Guarantee</p>
                <p className="text-sm text-[#D4C4B0] mb-2">Fixed-price delivery</p>
                <ul className="text-sm text-[#D4C4B0] space-y-1">
                  <li>• End-to-end program</li>
                  <li>• Your team + my oversight</li>
                  <li>• Weekly sprints</li>
                  <li>• Production-ready AI</li>
                </ul>
              </div>

              <div className="rounded-xl border border-[#4a7c59]/20 bg-[#4a7c59]/10 p-6 backdrop-blur-sm">
                <p className="mb-4 text-2xl font-bold text-[#5a8a65]">Business Infrastructure</p>
                <p className="text-sm text-[#D4C4B0] mb-2">Full stack setup</p>
                <ul className="text-sm text-[#D4C4B0] space-y-1">
                  <li>• Website development</li>
                  <li>• Google Workspace</li>
                  <li>• Business tools & integrations</li>
                  <li>• Operational foundation</li>
                </ul>
              </div>
            </div>

            <div className="mt-10 text-center">
              <p className="text-[#D4C4B0] mb-6">
                Every engagement is tailored. Start with a conversation to see if we're a fit.
              </p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#4a7c59] to-[#5a8a65] px-8 py-6 text-lg font-semibold text-[#191919] transition-all hover:scale-105 hover:shadow-2xl hover:shadow-[#4a7c59]/50"
                onClick={() => window.open('https://calendly.com/nicklynch-bonusthoughts', '_blank')}
              >
                Start a Conversation →
              </Button>
              <p className="mt-4 text-sm text-[#D4C4B0]">
                <span className="font-semibold text-[#5a8a65]">Exploratory conversation</span> · See if we're a fit · No obligations
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Case Studies Section */}
      <section id="case-studies" className="relative z-10 mx-auto max-w-7xl px-6 py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="mb-16 text-center text-5xl font-bold">
            <span className="bg-gradient-to-r from-[#4a7c59] to-[#5a8a65] bg-clip-text text-transparent">
              Recent Work
            </span>
          </h2>

          <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0 }}
              className="rounded-xl border border-[#F4EDE4]/10 bg-gradient-to-br from-[#4a7c59]/10 to-[#5a8a65]/10 p-8 backdrop-blur-sm hover:border-[#4a7c59]/50 transition-all"
            >
              <div className="mb-4 text-sm font-semibold text-[#4a7c59]">LOGISTICS & CRM</div>
              <h3 className="mb-3 text-2xl font-bold text-[#F4EDE4]">Conversational AI Agents</h3>
              <p className="mb-4 text-[#D4C4B0]">Phone agents replacing legacy IVR. CRM-integrated workflows. 80%+ pipeline completion without human touch.</p>
              <p className="text-lg font-bold text-[#4a7c59]">Real customer impact</p>
              <p className="text-sm text-[#3a5a47]">16-week engagement</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-xl border border-[#F4EDE4]/10 bg-gradient-to-br from-[#5a8a65]/10 to-[#5a6b3e]/10 p-8 backdrop-blur-sm hover:border-[#5a8a65]/50 transition-all"
            >
              <div className="mb-4 text-sm font-semibold text-[#5a8a65]">GEOSPATIAL INTELLIGENCE</div>
              <h3 className="mb-3 text-2xl font-bold text-[#F4EDE4]">Computer Vision for Intel</h3>
              <p className="mb-4 text-[#D4C4B0]">Automated analysis of classified imagery. Real-time threat detection. Mission-critical insights at scale.</p>
              <p className="text-lg font-bold text-[#5a8a65]">Proven in production</p>
              <p className="text-sm text-[#3a5a47]">Ongoing engagement</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-xl border border-[#F4EDE4]/10 bg-gradient-to-br from-[#00E5FF]/10 to-cyan-400/10 p-8 backdrop-blur-sm hover:border-cyan-400/50 transition-all"
            >
              <div className="mb-4 text-sm font-semibold text-cyan-400">DATA INTEGRITY</div>
              <h3 className="mb-3 text-2xl font-bold text-[#F4EDE4]">Zero-Loss Data Pipelines</h3>
              <p className="mb-4 text-[#D4C4B0]">Ground-truth reporting from source. No data loss across comms channels. Board-ready ROI dashboards.</p>
              <p className="text-lg font-bold text-cyan-400">Trust & accuracy</p>
              <p className="text-sm text-[#3a5a47]">Q1 2026 availability</p>
            </motion.div>
          </div>

          <div className="mt-12 text-center">
            <p className="mb-6 text-lg text-[#D4C4B0]">
              <span className="font-semibold text-[#F4EDE4]">Taking on select new clients</span>
              <br />
              Unique challenges that require thoughtful, custom solutions.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-[#4a7c59] to-[#5a8a65] px-8 py-6 text-lg font-semibold text-[#191919] transition-all hover:scale-105 hover:shadow-2xl hover:shadow-[#4a7c59]/50"
              onClick={() => window.open('https://calendly.com/nicklynch-bonusthoughts', '_blank')}
            >
              Start a Conversation →
            </Button>
            <p className="mt-4 text-sm text-[#D4C4B0]">
              <span className="font-semibold text-[#5a8a65]">Exploratory conversation</span> · See if we're a fit · No obligations
            </p>
          </div>
        </motion.div>
      </section>

      {/* Lead Magnet CTA Section */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="overflow-hidden rounded-3xl border border-[#5a8a65]/30 bg-gradient-to-br from-[#5a8a65]/10 to-[#4a7c59]/10 p-12 backdrop-blur-xl md:p-16 text-center"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-4 text-3xl font-bold text-[#F4EDE4] sm:text-4xl"
          >
            Not ready to book yet?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mb-8 max-w-2xl text-lg text-[#D4C4B0]"
          >
            Download the <span className="font-semibold text-[#5a8a65]">C-Suite AI Playbook</span>: 7 MVPs that delivered 6-figure ROI in under 30 days. See the framework before committing to a call.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-[#4a7c59] to-[#5a8a65] px-8 py-6 text-lg font-semibold text-[#191919] transition-all hover:scale-105 hover:shadow-2xl hover:shadow-[#4a7c59]/50"
              onClick={() => setIsPlaybookModalOpen(true)}
            >
              Get Free Playbook →
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#F4EDE4]/10 py-12">
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
              <span>Active Security Clearances</span>
            </div>
          </div>

          {/* Footer Links & Contact */}
          <div className="text-center space-y-6">
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <motion.a
                whileHover={{ y: -2 }}
                href="https://calendly.com/nicklynch-bonusthoughts"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-[#5a8a65] font-semibold"
              >
                Start a Conversation
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
              © 2025 BonusThoughts. Bespoke technology solutions for complex challenges.
            </p>
          </div>
        </div>
      </footer>

      {/* Lead Magnet Modal */}
      <LeadMagnetModal
        isOpen={isPlaybookModalOpen}
        onClose={() => setIsPlaybookModalOpen(false)}
      />
    </div>
  );
}
