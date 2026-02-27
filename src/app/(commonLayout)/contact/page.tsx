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
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
          
          {/* LEFT: CONTACT INFO */}
          <div className="space-y-8">
            
            <div className="flex items-start gap-4 bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition">
              <MapPin className="text-red-500" />
              <div>
                <h3 className="text-lg font-semibold">Our Address</h3>
                <p className="text-gray-600">
                  123 Food Street, Dhaka, Bangladesh
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition">
              <Phone className="text-red-500" />
              <div>
                <h3 className="text-lg font-semibold">Phone</h3>
                <p className="text-gray-600">
                  +880 1234-567890
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition">
              <Mail className="text-red-500" />
              <div>
                <h3 className="text-lg font-semibold">Email</h3>
                <p className="text-gray-600">
                  support@foodhub.com
                </p>
              </div>
            </div>

          </div>

          {/* RIGHT: CONTACT FORM */}
          <div className="bg-white p-8 rounded-2xl shadow-sm">
            <h2 className="text-2xl font-bold mb-6">
              Send us a Message
            </h2>

            <form className="space-y-5">
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  rows={4}
                  placeholder="Write your message..."
                  className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400"
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