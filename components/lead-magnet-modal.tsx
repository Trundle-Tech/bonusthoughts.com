"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface LeadMagnetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LeadMagnetModal({ isOpen, onClose }: LeadMagnetModalProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission (in production, this would send to your backend/email service)
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);

      // Trigger PDF download
      const link = document.createElement("a");
      link.href = "/playbooks/ai-tools-training-guide.pdf";
      link.download = "AI-Tools-Training-Guide.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Navigate to training guide page after brief delay
      setTimeout(() => {
        onClose();
        setSubmitted(false);
        setFormData({ name: "", email: "", company: "" });
        router.push("/training-guide");
      }, 1500);
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative z-50 w-full max-w-md overflow-hidden rounded-2xl border border-[#F4EDE4]/10 bg-[#191919] p-8 shadow-2xl"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-[#D4C4B0] transition-colors hover:text-[#F4EDE4]"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            {!submitted ? (
              <div>
                <motion.h2
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mb-2 text-2xl font-bold text-[#F4EDE4]"
                >
                  AI Tools Training Guide
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="mb-6 text-sm text-[#D4C4B0]"
                >
                  Which AI tool for which task—a practical guide for teams
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-6 rounded-lg border border-cyan-400/20 bg-cyan-400/10 p-4"
                >
                  <p className="text-xs font-semibold text-cyan-400 mb-2">
                    INSIDE THE GUIDE:
                  </p>
                  <ul className="text-xs text-[#D4C4B0] space-y-1">
                    <li>✓ Claude vs ChatGPT vs Gemini—when to use each</li>
                    <li>✓ Best AI tools by role (Sales, Dev, Research, etc.)</li>
                    <li>✓ Prompt templates that actually work</li>
                    <li>✓ Setup checklist for enterprise deployment</li>
                  </ul>
                </motion.div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    <input
                      type="text"
                      name="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-lg border border-[#F4EDE4]/20 bg-[#F4EDE4]/5 px-4 py-3 text-sm text-[#F4EDE4] placeholder-[#3a5a47] transition-colors focus:border-[#4a7c59]/50 focus:outline-none focus:ring-1 focus:ring-[#4a7c59]/50"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <input
                      type="email"
                      name="email"
                      placeholder="your@company.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-lg border border-[#F4EDE4]/20 bg-[#F4EDE4]/5 px-4 py-3 text-sm text-[#F4EDE4] placeholder-[#3a5a47] transition-colors focus:border-[#4a7c59]/50 focus:outline-none focus:ring-1 focus:ring-[#4a7c59]/50"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                  >
                    <input
                      type="text"
                      name="company"
                      placeholder="Company name"
                      value={formData.company}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-lg border border-[#F4EDE4]/20 bg-[#F4EDE4]/5 px-4 py-3 text-sm text-[#F4EDE4] placeholder-[#3a5a47] transition-colors focus:border-[#4a7c59]/50 focus:outline-none focus:ring-1 focus:ring-[#4a7c59]/50"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-[#4a7c59] to-[#5a8a65] py-3 text-sm font-semibold text-[#191919] transition-all hover:scale-105 hover:shadow-lg hover:shadow-[#4a7c59]/50 disabled:opacity-50"
                    >
                      {isSubmitting ? "Sending..." : "Get Instant Access →"}
                    </Button>
                  </motion.div>

                  <p className="text-xs text-[#3a5a47] text-center">
                    We'll send the guide + info on training availability.
                  </p>
                </form>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.6 }}
                  className="mb-4 inline-block"
                >
                  <div className="h-12 w-12 rounded-full bg-[#4a7c59]/20 flex items-center justify-center">
                    <span className="text-2xl">✓</span>
                  </div>
                </motion.div>
                <h3 className="text-lg font-bold text-[#F4EDE4] mb-2">
                  You're in!
                </h3>
                <p className="text-sm text-[#D4C4B0]">
                  PDF downloading... Opening the full guide now.
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
