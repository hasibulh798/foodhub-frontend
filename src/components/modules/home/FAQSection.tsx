"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, HelpCircle } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "How does Food Hub guarantee quality?",
    answer: "We only partner with restaurants that pass our 50-point gourmet quality audit. Each provider is verified for hygiene, ingredient quality, and culinary excellence before joining our platform."
  },
  {
    question: "What are the delivery charges?",
    answer: "Delivery fees are calculated based on your distance from the restaurant. However, we offer a 'Gourmet Pass' that provides free delivery for all orders above ৳500."
  },
  {
    question: "Can I schedule orders in advance?",
    answer: "Absolutely! You can schedule meals up to 7 days in advance. Perfect for event catering, business lunches, or simply planning your weekly culinary journey."
  },
  {
    question: "What is your refund policy?",
    answer: "If your meal doesn't meet our quality standard or arrives significantly late, we offer instant 'Hub Credits' or a full refund to your original payment method."
  },
  {
    question: "How do I become a Culinary Partner?",
    answer: "If you run a professional kitchen and share our passion for excellence, you can apply through our 'Provider Portal'. We review applications within 48 hours."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] -z-10" />
      
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-20 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em]"
          >
            <HelpCircle size={14} />
            Common Inquiries
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-none sm:leading-tight dark:text-white"
          >
            Curiosity <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Satisfied</span>
          </motion.h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "rounded-[2rem] border border-border/50 transition-all duration-500 overflow-hidden",
                openIndex === i ? "bg-muted/30 border-primary/20 shadow-xl" : "bg-card hover:bg-muted/10 hover:border-border"
              )}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-8 py-7 flex items-center justify-between text-left group"
              >
                <span className={cn(
                    "text-lg font-bold transition-colors group-hover:text-primary",
                    openIndex === i ? "text-primary" : "text-foreground"
                )}>
                    {faq.question}
                </span>
                <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500",
                    openIndex === i ? "bg-primary text-white rotate-180" : "bg-muted group-hover:bg-primary/10 group-hover:text-primary"
                )}>
                    {openIndex === i ? <Minus size={18} /> : <Plus size={18} />}
                </div>
              </button>
              
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "circOut" }}
                  >
                    <div className="px-8 pb-8 text-muted-foreground font-medium leading-relaxed italic">
                        {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
