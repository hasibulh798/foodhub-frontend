"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Globe, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Contact form data:", data);
    setIsSubmitting(false);
    setIsSuccess(true);
    toast.success("Message sent successfully!");
    reset();
    
    // Reset success state after 5 seconds
    setTimeout(() => setIsSuccess(false), 5000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] overflow-hidden">
      {/* ─── Hero / Header ─── */}
      <section className="relative pt-20 pb-32">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(255,100,0,0.05),transparent_50%)]" />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 dark:bg-orange-950/30 rounded-full text-orange-600 mb-6">
              <MessageSquare size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Contact Support</span>
            </div>
            <h1 className="text-6xl lg:text-7xl font-black text-gray-900 dark:text-white tracking-tighter leading-none mb-6">
              Get in <span className="text-orange-600">Touch.</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400 font-medium">
              We're here to help! Whether you're a customer with a question or a 
              restaurant looking to partner, our team is ready to assist.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── Contact Content ─── */}
      <section className="pb-32 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-16">
          
          {/* Left Column: Info */}
          <div className="lg:col-span-5 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-8 tracking-tight">Contact Information</h2>
              <div className="grid gap-6">
                <ContactInfoCard 
                  icon={MapPin} 
                  title="Visit Us" 
                  details="123 Food Street, Gulshan-2, Dhaka, Bangladesh" 
                  color="bg-blue-500" 
                />
                <ContactInfoCard 
                  icon={Phone} 
                  title="Call Support" 
                  details="+880 1234-567890 (24/7 Helpline)" 
                  color="bg-orange-500" 
                />
                <ContactInfoCard 
                  icon={Mail} 
                  title="Email Us" 
                  details="support@foodhub.com, partners@foodhub.com" 
                  color="bg-red-500" 
                />
                <ContactInfoCard 
                  icon={Clock} 
                  title="Working Hours" 
                  details="Mon - Sun: 09:00 AM - 12:00 AM" 
                  color="bg-emerald-500" 
                />
              </div>

              {/* Socials / Global */}
              <div className="mt-12 p-8 bg-gray-50 dark:bg-zinc-900 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-1">Global Presence</h4>
                  <p className="text-xs text-gray-500 font-medium">Available in 25+ cities nationwide.</p>
                </div>
                <Globe className="text-gray-300 dark:text-zinc-700" size={40} />
              </div>
            </motion.div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-zinc-900 rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-zinc-800"
            >
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex flex-col items-center justify-center py-20 text-center"
                  >
                    <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center mb-8 shadow-xl shadow-emerald-500/10">
                      <CheckCircle2 size={48} />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Message Sent!</h2>
                    <p className="text-gray-500 dark:text-gray-400 font-medium max-w-sm">
                      Thank you for reaching out. Our team will get back to you within 24 hours.
                    </p>
                    <button 
                      onClick={() => setIsSuccess(false)}
                      className="mt-10 text-orange-600 font-black uppercase tracking-widest text-xs hover:underline"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <motion.form 
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                        <input 
                          {...register("name")}
                          placeholder="John Doe"
                          className="w-full h-14 bg-gray-50/50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 rounded-2xl px-6 outline-none focus:bg-white dark:focus:bg-zinc-800 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-medium text-gray-900 dark:text-white"
                        />
                        {errors.name && <p className="text-[10px] font-bold text-red-500 ml-2 mt-1 uppercase tracking-widest">{errors.name.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                        <input 
                          {...register("email")}
                          placeholder="john@example.com"
                          className="w-full h-14 bg-gray-50/50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 rounded-2xl px-6 outline-none focus:bg-white dark:focus:bg-zinc-800 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-medium text-gray-900 dark:text-white"
                        />
                        {errors.email && <p className="text-[10px] font-bold text-red-500 ml-2 mt-1 uppercase tracking-widest">{errors.email.message}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Subject</label>
                      <input 
                        {...register("subject")}
                        placeholder="Inquiry about partnership"
                        className="w-full h-14 bg-gray-50/50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 rounded-2xl px-6 outline-none focus:bg-white dark:focus:bg-zinc-800 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-medium text-gray-900 dark:text-white"
                      />
                      {errors.subject && <p className="text-[10px] font-bold text-red-500 ml-2 mt-1 uppercase tracking-widest">{errors.subject.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Message</label>
                      <textarea 
                        {...register("message")}
                        rows={5}
                        placeholder="Tell us how we can help..."
                        className="w-full bg-gray-50/50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 rounded-2xl p-6 outline-none focus:bg-white dark:focus:bg-zinc-800 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-medium text-gray-900 dark:text-white resize-none"
                      />
                      {errors.message && <p className="text-[10px] font-bold text-red-500 ml-2 mt-1 uppercase tracking-widest">{errors.message.message}</p>}
                    </div>

                    <button 
                      disabled={isSubmitting}
                      className="w-full h-16 bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-xl shadow-orange-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send size={18} />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── FAQ / Help Footer ─── */}
      <section className="bg-gray-50/50 dark:bg-zinc-900/30 py-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="text-center md:text-left">
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Need immediate help?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Check our help center for quick answers to common questions.</p>
           </div>
           <button className="px-8 py-4 border-2 border-gray-200 dark:border-zinc-700 hover:border-orange-600 dark:hover:border-orange-600 rounded-2xl text-xs font-black uppercase tracking-widest transition-all text-gray-600 dark:text-gray-400 hover:text-orange-600">View Help Center</button>
        </div>
      </section>
    </div>
  );
}

function ContactInfoCard({ icon: Icon, title, details, color }: any) {
  return (
    <div className="group flex items-center gap-6 p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 hover:shadow-xl hover:border-orange-500/30 transition-all duration-300">
      <div className={`w-14 h-14 ${color} text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
        <Icon size={24} />
      </div>
      <div>
        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{title}</h4>
        <p className="text-sm font-bold text-gray-900 dark:text-white leading-relaxed">{details}</p>
      </div>
    </div>
  );
}