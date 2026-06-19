# RevouShop

> A full-stack e-commerce web application built with Next.js 16, Tailwind CSS, and the App Router — featuring authentication, protected routes, cart management, and full product CRUD.

## Live Demo

**Deployed on Vercel:** https://project-3-alpha-jade.vercel.app/

---

## Overview

RevouShop is a responsive e-commerce application with a product catalog, detailed product pages, shopping cart, user authentication, and an admin dashboard for managing inventory. It integrates two external APIs — FakeStore API for product data and Platzi Fake Store API for authentication and CRUD operations.

---

## Features Implemented

### Home Page
- Hero section with call-to-action buttons and key stats
- Category filter buttons (All, Electronics, Fashion, Home, Sports, Beauty)
- Dynamic product filtering using `useState` and `useEffect`
- Product grid with card components
- Promotional banner section

### Product Listing Page (`/product`)
- Full product catalog with search and category filters
- Live filtering using `useMemo` for performance
- Product count display

### Product Detail Page (`/product/[id]`)
- Dynamic routing via App Router
- Interactive image gallery with thumbnail switcher
- Quantity counter (+/−) with minimum of 1
- Add to Cart with authentication guard (redirects to login if not logged in)
- In Stock / Out of Stock badge
- Trust badges (free delivery, returns, warranty, secure checkout)
- Related products fetched from the same category
- Breadcrumb navigation
- Dynamic browser tab title via `useEffect`

### Shopping Cart (`/cart`)
- Protected route — requires login
- Add, remove, and update item quantities
- Coupon code support (`REVOU10` for 10% off)
- Free shipping threshold ($50+)
- Order summary with subtotal, discount, shipping, and total
- Cart persisted in `localStorage`

### Authentication (`/login`)
- Login via Platzi Fake Store API JWT
- Role-based routing — admin users redirected to `/admin`, customers to `/`
- Session persisted in `localStorage` and cookies
- Demo credentials shown on login page
- Show/hide password toggle
- Enter key support

### Navbar
- Logo linking to home
- Navigation links (Home, Product, Promotions)
- Cart count badge
- User dropdown when logged in: shows name, email, Admin Dashboard link (admin only), and Sign Out
- Sign In button when logged out

### Admin Dashboard (`/admin`)
- Protected route — requires login AND admin role
- Product table with search and category filters
- Stats cards (Total Products, In Stock, Out of Stock, Categories)
- Add / Edit product modal with form validation
- Delete confirmation modal
- Toast notifications for all actions
- Loading and error states with retry

### Footer
- Brand description and social media links
- Quick links: Shop, Support, Company
- Payment method icons (Visa, Mastercard, GoPay)
- Copyright notice

### Dark Mode
- Automatic dark mode via `prefers-color-scheme` media query
- Full CSS variable theming for all colors

---

## Technologies Used

| Technology | Purpose |
|---|---|
| [Next.js 16](https://nextjs.org/) | React framework, App Router, API routes, Proxy |
| [React](https://react.dev/) | UI components, hooks (`useState`, `useEffect`, `useCallback`, `useMemo`) |
| [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first styling |
| [TypeScript](https://www.typescriptlang.org/) | Type safety across components and API routes |
| [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) | Typography via `next/font/google` |
| [FakeStore API](https://fakestoreapi.com/) | Product data source |
| [Platzi Fake Store API](https://fakeapi.platzi.com/) | Authentication (JWT) and CRUD operations |
| SVG Icons | Custom SVG icons as React components |
| [Vercel](https://vercel.com/) | Deployment and hosting |

---

## Architecture

### Data Flow
- Product data is fetched from FakeStore API via `/api/products` (Next.js API route)
- Auth is handled via `/api/auth` which proxies to Platzi API and returns JWT + user profile
- CRUD operations (POST, PUT, DELETE) go through `/api/products` and `/api/products/[id]` which call Platzi API

### State Management
- `AuthContext` — global auth state (user, token, isAuthenticated, login, logout)
- `CartContext` — global cart state (items, addItem, removeItem, updateQuantity, subtotal)
- Both contexts persist state via `localStorage` and restore on mount
- `auth_token` and `user_role` cookies enable server-side route protection via `proxy.ts`

### Route Protection
- `proxy.ts` (Next.js 16 Proxy) guards `/admin` (requires token + admin role) and `/cart` (requires token)
- Unauthorized users are redirected to `/login` with a `redirect` query param

---

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   └── page.tsx              # Admin dashboard (protected)
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── route.ts          # Login (POST) and logout (DELETE)
│   │   │   └── products/
│   │   │       ├── route.ts          # GET all, POST product
│   │   │       └── [id]/
│   │   │           └── route.ts      # GET, PUT, DELETE by id
│   │   ├── cart/
│   │   │   └── page.tsx              # Shopping cart (protected)
│   │   ├── login/
│   │   │   └── page.tsx              # Login page
│   │   ├── product/
│   │   │   ├── page.tsx              # Product listing page
│   │   │   └── [id]/
│   │   │       └── page.tsx          # Dynamic product detail route
│   │   ├── ProductDetail/
│   │   │   └── ProductDetail.tsx     # Product detail UI component
│   │   ├── globals.css               # Tailwind + CSS variables + dark mode
│   │   ├── layout.tsx                # Root layout with providers and font
│   │   └── page.tsx                  # Home page
│   ├── component/
│   │   ├── Card.tsx                  # Product card component
│   │   ├── Footer.tsx                # Footer component
│   │   └── Navbar.tsx                # Navbar with auth dropdown and cart badge
│   ├── context/
│   │   ├── Authcontext.tsx           # Auth context and provider
│   │   └── Cartcontext.tsx           # Cart context and provider
│   └── lib/
│       └── api.js                    # API helper functions
├── proxy.ts                          # Next.js 16 route protection
├── public/
│   ├── icons/                        # SVG icon files
│   └── screenshots/                  # Screenshots for README
├── .gitignore
├── next.config.js
├── package.json
└── tsconfig.json
```

---

## Getting Started

```bash
# Install dependencies
bun install

# Run development server
bun dev

# Build for production
bun run build

# Start production server
bun run start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@mail.com | admin123 |
| Customer | shopper@revou.com | changeme |

---

## Screenshots

### Home Page
![Home Page](/public/screenshots/Home.png)

### Product Detail Page
![Product Detail](/public/screenshots/product-detail.png)

---

## Author

**Developed by:** Satria Pamungkas

Built as part of the **Revou Next.JS Development** course assignment.

## License

This project is for educational purposes only.

[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/FR3B1BQd)
