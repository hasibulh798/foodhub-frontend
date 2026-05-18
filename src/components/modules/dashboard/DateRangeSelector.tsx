"use client";

import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Check } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type DateRangeType = "today" | "7days" | "30days" | "90days" | "all";

interface DateRangeSelectorProps {
  onRangeChange: (range: DateRangeType) => void;
  currentRange: DateRangeType;
}

const RANGES: { label: string; value: DateRangeType }[] = [
  { label: "Today", value: "today" },
  { label: "Last 7 Days", value: "7days" },
  { label: "Last 30 Days", value: "30days" },
  { label: "Last 90 Days", value: "90days" },
  { label: "All Time", value: "all" },
];

export const DateRangeSelector = ({ onRangeChange, currentRange }: DateRangeSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-2xl h-12 px-6 border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-card/50 backdrop-blur-xl font-bold flex items-center gap-3 shadow-sm hover:shadow-md transition-all"
      >
        <CalendarIcon size={18} className="text-primary" />
        <span className="text-sm">
          {RANGES.find((r) => r.value === currentRange)?.label}
        </span>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-3 w-56 p-2 bg-card border border-border/50 rounded-3xl shadow-2xl z-50 backdrop-blur-2xl"
            >
              {RANGES.map((range) => (
                <button
                  key={range.value}
                  onClick={() => {
                    onRangeChange(range.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                    currentRange === range.value
                      ? "bg-primary text-white"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {range.label}
                  {currentRange === range.value && <Check size={16} />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
