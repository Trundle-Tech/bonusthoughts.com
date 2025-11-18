"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface LeadMagnetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LeadMagnetModal({ isOpen, onClose }: LeadMagnetModalProps) {
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
      link.href = "/playbooks/c-suite-ai-playbook.pdf";
      link.download = "C-Suite-AI-Playbook.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
        setSubmitted(false);
        setFormData({ name: "", email: "", company: "" });
      }, 2000);
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
                  C-Suite AI Playbook
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="mb-6 text-sm text-[#D4C4B0]"
                >
                  7 Proven MVPs That Delivered 6-Figure ROI in &lt;30 Days
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-6 rounded-lg border border-[#CC785C]/20 bg-[#CC785C]/10 p-4"
                >
                  <p className="text-xs font-semibold text-[#CC785C] mb-2">
                    INSIDE THE PLAYBOOK:
                  </p>
                  <ul className="text-xs text-[#D4C4B0] space-y-1">
                    <li>✓ The 3 AI projects that move the needle for executives</li>
                    <li>✓ When to build vs. buy (and how to decide in 48 hours)</li>
                    <li>✓ Hiring roadmap for 10–16 week delivery</li>
                    <li>✓ ROI calculator for board meetings</li>
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
                      className="w-full rounded-lg border border-[#F4EDE4]/20 bg-[#F4EDE4]/5 px-4 py-3 text-sm text-[#F4EDE4] placeholder-[#A8826B] transition-colors focus:border-[#CC785C]/50 focus:outline-none focus:ring-1 focus:ring-[#CC785C]/50"
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
                      className="w-full rounded-lg border border-[#F4EDE4]/20 bg-[#F4EDE4]/5 px-4 py-3 text-sm text-[#F4EDE4] placeholder-[#A8826B] transition-colors focus:border-[#CC785C]/50 focus:outline-none focus:ring-1 focus:ring-[#CC785C]/50"
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
                      className="w-full rounded-lg border border-[#F4EDE4]/20 bg-[#F4EDE4]/5 px-4 py-3 text-sm text-[#F4EDE4] placeholder-[#A8826B] transition-colors focus:border-[#CC785C]/50 focus:outline-none focus:ring-1 focus:ring-[#CC785C]/50"
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
                      className="w-full bg-gradient-to-r from-[#CC785C] to-[#E8956D] py-3 text-sm font-semibold text-[#191919] transition-all hover:scale-105 hover:shadow-lg hover:shadow-[#CC785C]/50 disabled:opacity-50"
                    >
                      {isSubmitting ? "Sending..." : "Get Instant Access →"}
                    </Button>
                  </motion.div>

                  <p className="text-xs text-[#A8826B] text-center">
                    We'll send the playbook + a follow-up on open slots.
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
                  <div className="h-12 w-12 rounded-full bg-[#CC785C]/20 flex items-center justify-center">
                    <span className="text-2xl">✓</span>
                  </div>
                </motion.div>
                <h3 className="text-lg font-bold text-[#F4EDE4] mb-2">
                  Check your inbox!
                </h3>
                <p className="text-sm text-[#D4C4B0]">
                  Your playbook is downloading. We'll also send you available slots.
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
