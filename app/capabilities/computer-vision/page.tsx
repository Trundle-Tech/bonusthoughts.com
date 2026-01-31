"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Eye, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { trackEmailClick, trackCapabilityView } from "@/lib/analytics";
import { useScrollTracking } from "@/hooks/use-scroll-tracking";
import { useTimeTracking } from "@/hooks/use-time-tracking";
import { useEffect } from "react";

export default function ComputerVisionPage() {
  // Analytics tracking
  useScrollTracking("computer-vision");
  useTimeTracking("computer-vision");

  useEffect(() => {
    trackCapabilityView("Computer Vision");
  }, []);
  const useCases = [
    {
      title: "Image Classification",
      description: "Automatically categorize images at scale. Product photos, defect detection, content moderation—trained on your specific use case."
    },
    {
      title: "Object Detection",
      description: "Find and locate objects in images and video. Inventory counting, safety monitoring, quality inspection—real-time or batch processing."
    },
    {
      title: "Document Processing",
      description: "Extract structured data from documents, invoices, receipts, and forms. OCR plus AI understanding for accurate data extraction."
    },
    {
      title: "Visual Inspection",
      description: "Automated quality control for manufacturing. Detect defects, measure dimensions, ensure compliance—with AI that learns your standards."
    }
  ];

  const features = [
    "Custom model training on your data",
    "Pre-trained models for common tasks",
    "Real-time video processing",
    "Edge deployment for on-premise needs",
    "OCR and document understanding",
    "Integration with existing camera systems"
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
              <Eye className="h-12 w-12 text-cyan-400" />
            </div>
            <span className="text-sm font-semibold text-cyan-400 uppercase tracking-wider">What We Build</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 to-[#4a7c59] bg-clip-text text-transparent">
              Computer Vision
            </span>
          </h1>

          <p className="text-xl text-[#D4C4B0] max-w-3xl mb-8">
            AI that sees. Image classification, object detection, document processing, and visual inspection for manufacturing, medical, and security applications.
          </p>

          <Button
            size="lg"
            className="bg-gradient-to-r from-cyan-500 to-cyan-400 px-8 py-6 text-lg font-semibold text-[#191919] transition-all hover:scale-105 hover:shadow-2xl hover:shadow-cyan-400/50"
            onClick={() => {
              trackEmailClick('Computer Vision Project Inquiry', 'Discuss Your Vision Project', 'computer-vision-hero');
              window.location.href = 'mailto:director@bonusthoughts.com?subject=Computer%20Vision%20Project%20Inquiry&body=Hi%2C%0A%0AI%27m%20interested%20in%20a%20computer%20vision%20solution.%0A%0AUse%20case%3A%20%0ACurrent%20situation%3A%20%0ATimeline%3A%20%0A%0ALooking%20forward%20to%20hearing%20from%20you.';
            }}
          >
            Discuss Your Vision Project →
          </Button>
        </motion.div>
      </section>

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
                <h3 className="text-xl font-bold text-cyan-400 mb-3">{useCase.title}</h3>
                <p className="text-[#D4C4B0]">{useCase.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="relative z-10 mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-cyan-400/10 to-[#2d5945]/10 p-8 sm:p-12"
        >
          <h2 className="text-3xl font-bold mb-8 text-[#F4EDE4]">How We Build Vision Systems</h2>

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

      <section className="relative z-10 mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-cyan-400/10 to-[#4a7c59]/10 p-8 sm:p-12 text-center"
        >
          <h2 className="text-3xl font-bold mb-4 text-[#F4EDE4]">Ready to give your systems sight?</h2>
          <p className="text-lg text-[#D4C4B0] mb-8 max-w-2xl mx-auto">
            Tell us what you need to see and analyze. We'll build the vision.
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-cyan-500 to-cyan-400 px-8 py-6 text-lg font-semibold text-[#191919] transition-all hover:scale-105 hover:shadow-2xl hover:shadow-cyan-400/50"
            onClick={() => {
              trackEmailClick('Computer Vision Project Inquiry', 'Describe Your Project', 'computer-vision-cta');
              window.location.href = 'mailto:director@bonusthoughts.com?subject=Computer%20Vision%20Project%20Inquiry&body=Hi%2C%0A%0AI%27m%20interested%20in%20a%20computer%20vision%20solution.%0A%0AUse%20case%3A%20%0ACurrent%20situation%3A%20%0ATimeline%3A%20%0A%0ALooking%20forward%20to%20hearing%20from%20you.';
            }}
          >
            Describe Your Project →
          </Button>
          <p className="mt-4 text-sm text-[#D4C4B0]">
            <span className="font-semibold text-cyan-400">Free scoping call</span> · Fixed pricing · No fluff
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
