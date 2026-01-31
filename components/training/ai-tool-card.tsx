"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

interface AITool {
  name: string;
  company: string;
  bestFor: string[];
  models: string[];
  pricing: string;
  color: string;
}

interface AIToolCardProps {
  tool: AITool;
  index: number;
}

export function AIToolCard({ tool, index }: AIToolCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="p-6 border-[#F4EDE4]/10 bg-[#F4EDE4]/5">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h3 className={`text-2xl font-bold text-${tool.color}`}>{tool.name}</h3>
              <span className="text-sm text-[#D4C4B0]">by {tool.company}</span>
            </div>
            <div className="mb-4">
              <p className="text-sm font-medium text-[#F4EDE4] mb-2">Best for:</p>
              <div className="flex flex-wrap gap-2">
                {tool.bestFor.map((use) => (
                  <span key={use} className="px-2 py-1 text-xs rounded-full bg-[#F4EDE4]/10 text-[#D4C4B0]">
                    {use}
                  </span>
                ))}
              </div>
            </div>
            <div className="mb-3">
              <p className="text-sm font-medium text-[#F4EDE4] mb-1">Models:</p>
              <p className="text-sm text-[#D4C4B0]">{tool.models.join(" • ")}</p>
            </div>
            <p className="text-sm text-[#5a8a65]">{tool.pricing}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
