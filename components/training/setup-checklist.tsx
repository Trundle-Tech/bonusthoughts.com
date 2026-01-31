"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface ChecklistItem {
  icon: LucideIcon;
  title: string;
  desc: string;
}

interface SetupChecklistProps {
  items: ChecklistItem[];
}

export function SetupChecklist({ items }: SetupChecklistProps) {
  return (
    <div className="grid gap-4">
      {items.map((item, index) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.05 }}
          className="flex items-start gap-4 p-4 rounded-xl border border-[#F4EDE4]/10 bg-[#F4EDE4]/5"
        >
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-cyan-400/10 flex items-center justify-center">
            <item.icon className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="font-semibold text-[#F4EDE4]">{item.title}</h3>
            <p className="text-sm text-[#D4C4B0]">{item.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
