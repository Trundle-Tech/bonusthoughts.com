"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

interface EnterpriseTool {
  name: string;
  description: string;
  useCases: string[];
  pricing: string;
  tip: string;
}

interface EnterpriseToolCardProps {
  tool: EnterpriseTool;
  index: number;
}

export function EnterpriseToolCard({ tool, index }: EnterpriseToolCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="p-6 border-[#F4EDE4]/10 bg-[#F4EDE4]/5">
        <h3 className="text-xl font-bold text-[#F4EDE4] mb-2">{tool.name}</h3>
        <p className="text-[#D4C4B0] mb-4">{tool.description}</p>
        <div className="mb-4">
          <p className="text-sm font-medium text-[#F4EDE4] mb-2">Use cases:</p>
          <div className="flex flex-wrap gap-2">
            {tool.useCases.map((use) => (
              <span key={use} className="px-2 py-1 text-xs rounded-full bg-[#F4EDE4]/10 text-[#D4C4B0]">
                {use}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm">
          <span className="text-[#5a8a65]">{tool.pricing}</span>
          <span className="hidden sm:block text-[#F4EDE4]/20">|</span>
          <span className="text-cyan-400">💡 {tool.tip}</span>
        </div>
      </Card>
    </motion.div>
  );
}
