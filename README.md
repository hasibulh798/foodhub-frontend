# 🎨 Food Hub Frontend - Premium Culinary Experience

A world-class, highly interactive food delivery frontend. Designed for speed, aesthetics, and a seamless user journey from discovery to delivery.

---

## ✨ Features

- **🚀 Next.js 15 App Router**: Leveraging the latest in server components and optimized routing.
- **💎 Premium UI/UX**:
  - **Framer Motion**: Smooth micro-animations and transitions.
  - **Tailwind CSS**: A fully responsive, modern design system.
  - **Glassmorphism**: Elegant, modern interfaces with depth and blur effects.
- **🛒 Advanced Cart System**:
  - **Persistence**: Cart survives page reloads via `localStorage`.
  - **Single-Vendor Protection**: Intelligent cart clearing when switching restaurants.
  - **Dynamic Fees**: Real-time delivery fee calculation based on the provider.
- **🔐 Multi-Role Dashboards**:
  - **Customer**: Track orders, manage profile, and view history.
  - **Provider**: Professional interface for menu management and order processing.
- **📱 Responsive Design**: Fully optimized for Mobile, Tablet, and Desktop.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Form Handling**: React Hook Form & Zod
- **Auth**: Better Auth (Client-side integration)

---

## ⚙️ Installation & Setup

### 1. Clone & Install
```bash
git clone <your-frontend-repo-url>
cd frontend
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_BASE_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
AUTH_URL=http://localhost:5000/api/auth
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the application.

---

## 🚦 Main Routes

- **`/`**: Stunning home page with category filters.
- **`/meals`**: Advanced meal discovery with interactive filters.
- **`/restaurants/[id]`**: Deep-dive into specific restaurant menus.
- **`/cart`**: Beautifully designed checkout preparation area.
- **`/checkout`**: Secure finalization with payment selection.
- **`/dashboard`**: Secure portal for orders and settings.

---

## 📄 License
This project is licensed under the MIT License.

---
**Crafted with ❤️ for Food Enthusiasts**
