"use client";

import { motion } from "framer-motion";
import { Calendar, User, ArrowRight, BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const posts = [
  {
    slug: "art-of-slow-cooking",
    title: "The Art of Slow Cooking: Modern Techniques",
    excerpt: "Discover how traditional slow cooking is being redefined by modern technology...",
    date: "May 12, 2026",
    author: "Chef Isabella",
    image: "/blogs/slow-cooking-cover.jpg",
    category: "Culinary Tips"
  },
  {
    slug: "hidden-gems-in-city",
    title: "10 Must-Visit Hidden Gems in the City",
    excerpt: "Our food critics explored the back alleys to find the most authentic flavors...",
    date: "May 10, 2026",
    author: "Marco Rossi",
    image: "/blogs/hidden-gems-cover.jpg",
    category: "Dining Guide"
  },
  {
    slug: "sustainability-in-kitchen",
    title: "Sustainability in Your Kitchen: A Guide",
    excerpt: "Learn how to reduce waste and choose eco-friendly ingredients for your home...",
    date: "May 08, 2026",
    author: "Emma Green",
    image: "/blogs/sustainability-cover.jpg",
    category: "Eco Living"
  }
];

export default function BlogSection() {
  return (
    <section className="py-32 bg-muted/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em]"
            >
              <BookOpen size={14} />
              Culinary Journal
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-none sm:leading-tight dark:text-white"
            >
              Stories from the <br /><span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Kitchen</span>
            </motion.h2>
          </div>
          <Link href="/blogs">
            <motion.button
                whileHover={{ gap: "1.5rem" }}
                className="flex items-center gap-3 text-sm font-black uppercase tracking-widest text-primary transition-all group"
            >
                View All Stories <ArrowRight size={20} />
            </motion.button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.map((post, i) => (
            <motion.article
              key={post.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="group flex flex-col bg-card rounded-[2.5rem] overflow-hidden border border-border/50 hover:border-primary/20 hover:shadow-2xl transition-all duration-500"
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute top-6 left-6">
                    <span className="px-4 py-1.5 rounded-full bg-black/50 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest border border-white/20">
                        {post.category}
                    </span>
                </div>
              </div>

              <div className="p-8 flex flex-col flex-1 space-y-4">
                <div className="flex items-center gap-6 text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-primary" />
                        {post.date}
                    </div>
                    <div className="flex items-center gap-2">
                        <User size={14} className="text-primary" />
                        {post.author}
                    </div>
                </div>
                
                <h3 className="text-2xl font-black leading-tight group-hover:text-primary transition-colors">
                    {post.title}
                </h3>
                
                <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                    {post.excerpt}
                </p>

                <div className="pt-4 mt-auto">
                    <Link href={`/blogs/${post.slug}`} className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest group/link text-zinc-900 dark:text-white hover:text-red-500 transition-colors">
                        Read Experience 
                        <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
