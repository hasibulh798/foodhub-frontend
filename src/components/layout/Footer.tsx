export default function Footer() {
  return (
    <footer
      className="bg-cover bg-center text-gray-300"
      style={{
        backgroundImage: "url('/4.webp')",
      }}
    >
      <div className="bg-black/80">
        <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-4 gap-10">
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li>About</li>
              <li>Contact</li>
              <li>Blog</li>
              <li>Help</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Information</h4>
            <ul className="space-y-2">
              <li>Privacy</li>
              <li>Terms</li>
              <li>Delivery Info</li>
              <li>Tracking</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Top Cuisines</h4>
            <ul className="space-y-2">
              <li>Italian</li>
              <li>Chinese</li>
              <li>Mexican</li>
              <li>Thai</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4 text-xl">
              <span>🐦</span>
              <span>📘</span>
              <span>📸</span>
              <span>▶</span>
            </div>
          </div>
        </div>

        <div className="text-center py-6 border-t border-gray-700 text-sm">
          © 2026 FoodHub. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
