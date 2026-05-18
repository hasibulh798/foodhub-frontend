import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Facebook, Linkedin, Quote, Share2, Twitter, User } from "lucide-react";

// Robust static data for the rich reading experience
const BLOG_POSTS = {
  "art-of-slow-cooking": {
    title: "The Art of Slow Cooking: Modern Techniques",
    excerpt: "Discover how traditional slow cooking is being redefined by modern technology...",
    date: "May 12, 2026",
    author: {
      name: "Chef Isabella",
      role: "Executive Culinary Director",
      image: "/blogs/chef-isabella.jpg"
    },
    readTime: "6 min read",
    image: "/blogs/slow-cooking-cover.jpg",
    category: "Culinary Tips",
    tags: ["Cooking", "Technique", "Gourmet", "Slow Food"],
    content: (
      <>
        <p className="first-letter:text-7xl first-letter:font-black first-letter:text-red-500 first-letter:mr-3 first-letter:float-left text-lg md:text-xl leading-relaxed text-zinc-700 dark:text-zinc-300 font-medium mb-8">
          Slow cooking has historically been viewed as a weekend luxury, a culinary process reserved for Sunday roasts and holiday feasts. However, as modern lifestyles accelerate, the ancient art of cooking low and slow is experiencing a massive renaissance—redefined by innovative culinary technology.
        </p>
        <p className="text-lg md:text-xl leading-relaxed text-zinc-700 dark:text-zinc-300 font-medium mb-8">
          The magic of slow cooking lies in its profound ability to transform tough, inexpensive cuts of meat into meltingly tender masterpieces, and humble root vegetables into rich, caramelized flavor bombs. It is a process of patience, where time does the heavy lifting, breaking down complex proteins and melding aromatics into a deeply unified flavor profile.
        </p>
        
        <h3 className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white mt-12 mb-6">The Sous-Vide Revolution</h3>
        <p className="text-lg md:text-xl leading-relaxed text-zinc-700 dark:text-zinc-300 font-medium mb-8">
          Enter the sous-vide machine, a device that has transitioned from high-end Michelin-starred kitchens directly onto the modern home countertop. By vacuum-sealing ingredients and submerging them in a precisely temperature-controlled water bath, the sous-vide method eliminates the guesswork of traditional slow cooking. 
        </p>

        <blockquote className="my-12 p-8 md:p-12 bg-red-50/50 dark:bg-red-500/5 rounded-3xl border-l-4 border-red-500 relative">
          <Quote className="absolute top-6 left-6 text-red-500/20 w-16 h-16 -z-10" />
          <p className="text-2xl md:text-3xl font-medium italic text-zinc-800 dark:text-zinc-200 leading-snug">
            "Patience is the secret ingredient that modern technology can perfectly regulate, but never entirely replace."
          </p>
          <footer className="mt-4 text-sm font-bold text-red-600 uppercase tracking-widest">— Chef Isabella</footer>
        </blockquote>

        <h3 className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white mt-12 mb-6">Mastering the Dutch Oven</h3>
        <p className="text-lg md:text-xl leading-relaxed text-zinc-700 dark:text-zinc-300 font-medium mb-8">
          Despite the rise of smart cookers, the enameled cast-iron Dutch oven remains an undisputed champion. Its exceptional heat retention and heavy lid create a self-basting environment that is impossible to replicate with lighter cookware. For the best results, always start by aggressively searing your proteins on the stovetop before deglazing the pan and moving the entire vessel to a low-temperature oven.
        </p>
        <p className="text-lg md:text-xl leading-relaxed text-zinc-700 dark:text-zinc-300 font-medium mb-8">
          Ultimately, modern slow cooking is about choosing the right tool for your schedule while honoring the fundamental chemistry of flavor development. Whether you prefer the set-and-forget convenience of a digital multi-cooker or the romantic, aromatic ritual of a Sunday braise in a cast-iron pot, the reward is always worth the wait.
        </p>
      </>
    )
  },
  "hidden-gems-in-city": {
    title: "10 Must-Visit Hidden Gems in the City",
    excerpt: "Our food critics explored the back alleys to find the most authentic flavors...",
    date: "May 10, 2026",
    author: {
      name: "Marco Rossi",
      role: "Lead Food Critic",
      image: "/blogs/marco-rossi.jpg"
    },
    readTime: "8 min read",
    image: "/blogs/hidden-gems-cover.jpg",
    category: "Dining Guide",
    tags: ["Local", "Review", "City Guide", "Street Food"],
    content: (
      <>
        <p className="text-lg md:text-xl leading-relaxed text-zinc-700 dark:text-zinc-300 font-medium mb-8">
          While the grand avenues and towering skyscrapers boast some of the world's most highly decorated dining establishments, the true culinary heartbeat of the city often lies tucked away in unmarked alleys, basement food halls, and unassuming neighborhood corners.
        </p>
        <p className="text-lg md:text-xl leading-relaxed text-zinc-700 dark:text-zinc-300 font-medium mb-8">
          Over the past three months, our dedicated team of undercover food critics bypassed the flashy neon signs and popular reservation apps to uncover the ten most extraordinary hidden gems this city has to offer. Prepare your palate for an adventure.
        </p>
        
        <h3 className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white mt-12 mb-6">1. The Noodle Whisperer of South Block</h3>
        <p className="text-lg md:text-xl leading-relaxed text-zinc-700 dark:text-zinc-300 font-medium mb-8">
          Behind a completely blank black door next to a dry cleaner, you'll find what can only be described as noodle perfection. Chef Lin hand-pulls his noodles to order, tossing them in a chili oil secret family recipe that has remained unchanged for five generations. There are no menus; you simply sit down and eat what is served.
        </p>

        <h3 className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white mt-12 mb-6">2. Midnight Bakery</h3>
        <p className="text-lg md:text-xl leading-relaxed text-zinc-700 dark:text-zinc-300 font-medium mb-8">
          Operating exclusively between the hours of 11 PM and 4 AM, this underground bakery serves the city's night shift workers and insomniac foodies. Their signature sea-salt caramel croissants, warm from the oven at 2 AM, are a transformative spiritual experience.
        </p>

        <div className="my-12 grid grid-cols-2 gap-4">
          <div className="relative h-64 rounded-2xl overflow-hidden">
             <Image src="/blogs/hidden-restaurant-1.jpg" alt="Hidden restaurant" fill className="object-cover" />
          </div>
          <div className="relative h-64 rounded-2xl overflow-hidden">
             <Image src="/blogs/hidden-restaurant-2.jpg" alt="Secret menu" fill className="object-cover" />
          </div>
        </div>

        <p className="text-lg md:text-xl leading-relaxed text-zinc-700 dark:text-zinc-300 font-medium mb-8">
          The beauty of these hidden gems is not just in the exceptional quality of their food, but in the passion and unyielding dedication of the artisans behind the counter. They don't cook for Instagram; they cook for the love of the craft.
        </p>
      </>
    )
  },
  "sustainability-in-kitchen": {
    title: "Sustainability in Your Kitchen: A Guide",
    excerpt: "Learn how to reduce waste and choose eco-friendly ingredients for your home...",
    date: "May 08, 2026",
    author: {
      name: "Emma Green",
      role: "Eco-Culinary Writer",
      image: "/blogs/emma-green.jpg"
    },
    readTime: "5 min read",
    image: "/blogs/sustainability-cover.jpg",
    category: "Eco Living",
    tags: ["Sustainability", "Zero Waste", "Local", "Organic"],
    content: (
      <>
        <p className="text-lg md:text-xl leading-relaxed text-zinc-700 dark:text-zinc-300 font-medium mb-8">
          The journey to a more sustainable planet begins exactly where we sustain ourselves: the kitchen. As environmental awareness grows, home cooks and professional chefs alike are recognizing the massive impact of their sourcing, cooking, and disposal habits.
        </p>
        <p className="text-lg md:text-xl leading-relaxed text-zinc-700 dark:text-zinc-300 font-medium mb-8">
          Transitioning to an eco-friendly kitchen doesn't require a complete overnight overhaul. Rather, it is about making conscious, incremental changes that collectively reduce our carbon footprint and minimize food waste.
        </p>
        
        <blockquote className="my-12 p-8 md:p-12 bg-emerald-50/50 dark:bg-emerald-500/5 rounded-3xl border-l-4 border-emerald-500 relative">
          <Quote className="absolute top-6 left-6 text-emerald-500/20 w-16 h-16 -z-10" />
          <p className="text-2xl md:text-3xl font-medium italic text-zinc-800 dark:text-zinc-200 leading-snug">
            "We don't need a handful of people doing zero-waste perfectly. We need millions of people doing it imperfectly."
          </p>
        </blockquote>

        <h3 className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white mt-12 mb-6">Root-to-Stem Cooking</h3>
        <p className="text-lg md:text-xl leading-relaxed text-zinc-700 dark:text-zinc-300 font-medium mb-8">
          One of the most effective ways to combat food waste is embracing the root-to-stem philosophy. Those carrot tops? They make a vibrant, peppery pesto. Potato peels can be tossed in olive oil and baked into crispy, rustic chips. Broccoli stems, often discarded, are sweet and tender when peeled and sliced into a stir-fry or slaw.
        </p>
        <p className="text-lg md:text-xl leading-relaxed text-zinc-700 dark:text-zinc-300 font-medium mb-8">
          By rethinking what we consider "scraps," we not only reduce landfill contributions but also unlock entirely new textures and flavor profiles in our daily cooking. Start small: keep a freezer bag for vegetable peelings and onion skins. When full, boil it down to create a rich, free, and incredibly flavorful vegetable broth.
        </p>
      </>
    )
  }
};

export default async function BlogDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = BLOG_POSTS[slug as keyof typeof BLOG_POSTS];

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF] dark:bg-[#060606] p-4 text-center">
          <h2 className="text-4xl font-black mb-4 dark:text-white">Story Not Found</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mb-8 max-w-md">The culinary journal entry you are looking for does not exist or has been moved to the archives.</p>
          <Link href="/" className="inline-flex items-center gap-2 bg-red-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-red-700 transition-all active:scale-95 shadow-lg shadow-red-600/20">
              <ArrowLeft size={18} />
              Return Home
          </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#060606] pb-24">
      {/* 1. Ultra-Minimal Reading Header */}
      <header className="pt-12 md:pt-20 pb-10 px-6 max-w-4xl mx-auto">
        <Link 
            href="/#blogs" 
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-red-500 transition-colors mb-10"
        >
            <ArrowLeft size={14} /> Back to Journal
        </Link>
        
        <div className="space-y-6 text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-red-50 dark:bg-red-500/10 text-red-600 text-[10px] font-black uppercase tracking-widest">
                {post.category}
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-zinc-900 dark:text-white tracking-tight leading-[1.1] text-balance mx-auto">
                {post.title}
            </h1>
            <p className="text-lg md:text-2xl text-zinc-500 dark:text-zinc-400 font-medium max-w-2xl mx-auto italic leading-relaxed">
                {post.excerpt}
            </p>
        </div>

        {/* Author & Meta Row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12 pt-8 border-t border-zinc-100 dark:border-zinc-900">
            <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-zinc-100 dark:border-zinc-800 shadow-sm">
                    <Image src={post.author.image} alt={post.author.name} fill className="object-cover" />
                </div>
                <div className="text-left">
                    <p className="text-sm font-black text-zinc-900 dark:text-white">{post.author.name}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{post.author.role}</p>
                </div>
            </div>
            
            <div className="hidden sm:block w-px h-8 bg-zinc-200 dark:bg-zinc-800" />
            
            <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                <div className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-red-500" />
                    {post.date}
                </div>
                <div className="flex items-center gap-1.5">
                    <Clock size={14} className="text-red-500" />
                    {post.readTime}
                </div>
            </div>
        </div>
      </header>

      {/* 2. Massive Hero Image */}
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 mb-16 md:mb-24">
        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl">
            <Image 
                src={post.image} 
                alt={post.title} 
                fill 
                className="object-cover"
                priority
            />
        </div>
      </div>

      {/* 3. Article Content (Read Experience) */}
      <article className="max-w-3xl mx-auto px-6">
        <div className="prose prose-lg md:prose-xl prose-zinc dark:prose-invert prose-headings:font-black prose-p:font-medium max-w-none">
            {post.content}
        </div>

        {/* Footer Tags & Share */}
        <div className="mt-20 pt-10 border-t border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mr-2">Tags:</span>
                {post.tags.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1 bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer">
                        {tag}
                    </span>
                ))}
            </div>
            
            <div className="flex items-center gap-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Share:</span>
                <button className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                    <Facebook size={16} />
                </button>
                <button className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-sky-50 hover:text-sky-500 transition-colors">
                    <Twitter size={16} />
                </button>
                <button className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:text-zinc-900 transition-colors">
                    <Share2 size={16} />
                </button>
            </div>
        </div>

        {/* Author Bio Box */}
        <div className="mt-16 p-8 md:p-10 bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
            <div className="w-24 h-24 rounded-2xl overflow-hidden relative shrink-0">
                <Image src={post.author.image} alt={post.author.name} fill className="object-cover" />
            </div>
            <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-red-500 mb-2">Written By</h4>
                <p className="text-xl font-black text-zinc-900 dark:text-white mb-2">{post.author.name}</p>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium leading-relaxed mb-4">
                    {post.author.name} is a renowned culinary expert and food critic dedicated to exploring the intersection of modern lifestyle and traditional dining. 
                </p>
                <button className="text-[10px] font-black uppercase tracking-widest text-zinc-900 dark:text-white border-b-2 border-red-500 pb-0.5 hover:text-red-500 transition-colors">
                    View all posts
                </button>
            </div>
        </div>
      </article>
      
      {/* Read Next Section */}
      <div className="max-w-6xl mx-auto px-6 mt-24">
        <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-10 text-center">Continue Reading</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {Object.entries(BLOG_POSTS)
                .filter(([s]) => s !== slug)
                .slice(0, 2)
                .map(([s, relatedPost]) => (
                <Link href={`/blogs/${s}`} key={s} className="group flex flex-col sm:flex-row gap-6 bg-white dark:bg-zinc-900 p-4 rounded-3xl border border-zinc-100 dark:border-zinc-800 hover:shadow-xl hover:border-red-100 dark:hover:border-red-500/30 transition-all">
                    <div className="relative w-full sm:w-32 h-40 sm:h-32 rounded-2xl overflow-hidden shrink-0">
                        <Image src={relatedPost.image} alt={relatedPost.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <div className="flex flex-col justify-center space-y-2">
                        <span className="text-[9px] font-black uppercase tracking-widest text-red-500">{relatedPost.category}</span>
                        <h4 className="text-base font-black text-zinc-900 dark:text-white group-hover:text-red-600 transition-colors leading-tight line-clamp-2">
                            {relatedPost.title}
                        </h4>
                        <p className="text-xs font-bold text-zinc-400 mt-2">{relatedPost.readTime}</p>
                    </div>
                </Link>
            ))}
        </div>
      </div>

    </div>
  );
}
