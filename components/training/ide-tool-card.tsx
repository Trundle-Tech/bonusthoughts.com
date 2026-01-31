"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Terminal } from "lucide-react";

interface IDETool {
  name: string;
  company: string;
  description: string;
  features: string[];
  pricing: string;
  bestFor: string;
  color: string;
}

interface IDEToolCardProps {
  tool: IDETool;
  index: number;
}

const colorMap: Record<string, { bg: string; text: string }> = {
  "cyan-400": { bg: "bg-cyan-400/20", text: "text-cyan-400" },
  "[#4a7c59]": { bg: "bg-[#4a7c59]/20", text: "text-[#4a7c59]" },
  "[#5a8a65]": { bg: "bg-[#5a8a65]/20", text: "text-[#5a8a65]" },
  "[#D4C4B0]": { bg: "bg-[#D4C4B0]/20", text: "text-[#D4C4B0]" },
};

export function IDEToolCard({ tool, index }: IDEToolCardProps) {
  const colors = colorMap[tool.color] || colorMap["cyan-400"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="p-6 border-[#F4EDE4]/10 bg-[#F4EDE4]/5">
        <div className="flex items-start gap-4 mb-4">
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${colors.bg}`}>
            <Terminal className={`h-5 w-5 ${colors.text}`} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#F4EDE4]">{tool.name}</h3>
            <p className="text-sm text-[#D4C4B0]">{tool.company}</p>
          </div>
        </div>
        <p className="text-[#D4C4B0] mb-4">{tool.description}</p>
        <div className="mb-4">
          <p className="text-sm font-medium text-[#F4EDE4] mb-2">Features:</p>
          <div className="flex flex-wrap gap-2">
            {tool.features.map((feature) => (
              <span key={feature} className="px-2 py-1 text-xs rounded-full bg-[#F4EDE4]/10 text-[#D4C4B0]">
                {feature}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm">
          <span className="text-[#5a8a65]">{tool.pricing}</span>
          <span className="hidden sm:block text-[#F4EDE4]/20">|</span>
          <span className="text-cyan-400">Best for: {tool.bestFor}</span>
        </div>
      </Card>
    </motion.div>
  );
}
