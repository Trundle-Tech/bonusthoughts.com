"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

interface PromptTemplateData {
  title: string;
  template: string;
  useFor: string;
}

interface PromptTemplateProps {
  template: PromptTemplateData;
  index: number;
}

export function PromptTemplate({ template, index }: PromptTemplateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="p-6 border-[#F4EDE4]/10 bg-[#F4EDE4]/5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-[#F4EDE4]">{template.title}</h3>
          <span className="text-xs text-[#5a8a65] bg-[#5a8a65]/10 px-2 py-1 rounded-full">
            {template.useFor}
          </span>
        </div>
        <pre className="text-sm text-[#D4C4B0] bg-[#191919] p-4 rounded-lg overflow-x-auto whitespace-pre-wrap font-mono">
          {template.template}
        </pre>
      </Card>
    </motion.div>
  );
}
