import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="bg-gray-50">
      
      {/* HERO SECTION */}
      <section className="bg-red-500 text-white py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Contact Us
          </h1>
          <p className="text-lg text-white/90">
            Have questions or need help? We’d love to hear from you.
          </p>
        </div>
      </section>

      {/* CONTACT SECTION */}
<section className="py-16 px-4 bg-gray-50 dark:bg-gray-950 transition-colors">
  <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
    
    {/* LEFT: CONTACT INFO */}
    <div className="space-y-8">
      
      <div className="flex items-start gap-4 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm hover:shadow-md transition border border-gray-200 dark:border-gray-700">
        <MapPin className="text-red-500" />
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Our Address
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            123 Food Street, Dhaka, Bangladesh
          </p>
        </div>
      </div>

      <div className="flex items-start gap-4 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm hover:shadow-md transition border border-gray-200 dark:border-gray-700">
        <Phone className="text-red-500" />
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Phone
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            +880 1234-567890
          </p>
        </div>
      </div>

      <div className="flex items-start gap-4 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm hover:shadow-md transition border border-gray-200 dark:border-gray-700">
        <Mail className="text-red-500" />
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Email
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            support@foodhub.com
          </p>
        </div>
      </div>

    </div>

    {/* RIGHT: CONTACT FORM */}
    <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Send us a Message
      </h2>

      <form className="space-y-5">
        
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Your Name
          </label>
          <input
            type="text"
            placeholder="Enter your name"
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Email Address
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Message
          </label>
          <textarea
            rows={4}
            placeholder="Write your message..."
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition"
        >
          Send Message
        </button>

      </form>
    </div>

  </div>
</section>
    </div>
  );
}