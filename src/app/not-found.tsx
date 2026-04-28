"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 overflow-hidden relative font-sans">
      {/* Decorative Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] animate-pulse [animation-delay:1000ms]" />

      <div className="text-center relative z-10 max-w-2xl mx-auto">
        {/* Animated 404 Text */}
        <h1 className="text-[120px] md:text-[200px] font-black text-white leading-none tracking-tighter drop-shadow-2xl select-none">
          <span className="inline-block hover:scale-110 hover:rotate-3 transition-transform cursor-default">4</span>
          <span className="inline-block text-orange-500 hover:-translate-y-4 transition-transform cursor-default mx-[-5px] md:mx-[-10px]">0</span>
          <span className="inline-block hover:scale-110 hover:-rotate-3 transition-transform cursor-default">4</span>
        </h1>

        <div className="mt-8 space-y-4 px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Oops! Lost in the Food Hub?
          </h2>
          <p className="text-gray-400 text-base md:text-lg max-w-md mx-auto leading-relaxed">
            The page you're looking for seems to have been devoured by our hungry delivery partners. Let's get you back on track!
          </p>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 px-6">
          <Link
            href="/"
            className="w-full sm:w-auto px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-orange-500/20 active:scale-95 text-center"
          >
            Back to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto px-8 py-4 bg-gray-900 border border-gray-800 hover:bg-gray-800 text-white font-bold rounded-2xl transition-all active:scale-95"
          >
            Go Back
          </button>
        </div>

        {/* Support Links */}
        <div className="mt-16 pt-8 border-t border-gray-900/50">
          <p className="text-sm text-gray-500 mb-4 font-medium uppercase tracking-widest text-[10px]">
            Need help finding something?
          </p>
          <div className="flex justify-center gap-8 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-600">
            <Link href="/meals" className="hover:text-orange-500 transition-colors">Meals</Link>
            <Link href="/providers" className="hover:text-orange-500 transition-colors">Restaurants</Link>
            <Link href="/" className="hover:text-orange-500 transition-colors">Support</Link>
          </div>
        </div>
      </div>

      {/* Decorative floating dots */}
      <div className="absolute top-10 left-10 w-2 h-2 bg-orange-500/20 rounded-full animate-bounce" />
      <div className="absolute top-40 right-20 w-3 h-3 bg-blue-500/20 rounded-full animate-pulse" />
      <div className="absolute bottom-20 left-1/2 w-2 h-2 bg-white/10 rounded-full animate-ping" />
    </div>
  );
}
