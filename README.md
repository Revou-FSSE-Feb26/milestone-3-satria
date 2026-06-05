# RevouShop

A modern e-commerce product listing and detail page built with Next.js and Tailwind CSS.

## Live Demo

**Deployed on Vercel:** https://project-3-alpha-jade.vercel.app/

---

## Overview

RevouShop is a responsive e-commerce web application featuring a product catalog with category filtering, and a fully interactive product detail page. Users can browse products, filter by category, view product details with image thumbnails, adjust quantity, and navigate seamlessly between pages using client-side routing.

---

## Features Implemented

### Home Page
- Hero section with call-to-action buttons and key stats
- Category filter buttons (All, Electronics, Fashion, Home, Sports, Beauty)
- Dynamic product filtering using `useState` and `useEffect`
- Product grid with card components
- Promotional banner section

### Product Card
- Displays product image, badge, rating, title, description, and price
- Original price with strikethrough for discounted items
- Hover animations (lift + scale image)
- Clickable — navigates to product detail page using `next/link`

### Product Detail Page
- Dynamic routing via `/product/[id]`
- Interactive image gallery with thumbnail switcher
- Active thumbnail highlights and updates main image on click
- Quantity counter (+/−) with minimum of 1
- In Stock / Out of Stock badge
- Color swatches support
- Trust badges (free delivery, returns, warranty, secure checkout)
- Favorite and share action buttons
- Related products section
- Breadcrumb navigation
- Dynamic browser tab title via `useEffect`

### Navbar
- Logo linking to home
- Navigation links (Home uses `next/link` for client-side navigation)
- Cart count badge loaded from `localStorage` via `useEffect`
- Search, cart, and user icon buttons

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
| [Next.js 15+](https://nextjs.org/) | React framework, file-based routing, App Router |
| [React](https://react.dev/) | UI components, `useState`, `useEffect` |
| [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first styling |
| [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) | Typography via `next/font/google` |
| SVG Icons | Custom SVG icons as React components |
| TypeScript | Layout file typed with Next.js metadata types |
| [Vercel](https://vercel.com/) | Deployment and hosting |

---

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── product/
│   │   │   └── [id]/
│   │   │       └── page.jsx          # Dynamic product detail route
│   │   ├── ProductDetail/
│   │   │   └── ProductDetail.jsx     # Product detail UI component
│   │   ├── favicon.ico
│   │   ├── globals.css               # Tailwind + CSS variables + dark mode
│   │   ├── layout.tsx                # Root layout with font and metadata
│   │   └── page.tsx                  # Home page
│   └── component/
│       ├── Card.jsx                  # Product card component
│       ├── Footer.jsx                # Footer component
│       └── Navbar.jsx                # Navbar with cart and navigation
├── public/
│   ├── icons/                        # SVG icon files
│   ├── product/                      # Product image files
│   └── screenshots/                  # Screeshots image for readme file
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
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

## Screenshots

### Home Page
![Home Page](/public/screenshots/home.png)

### Product Detail Page
![Product Detail](/public/screenshots/product-detail.png)

---

## Author

**Satria Pamungkas** — © 2026 All rights reserved.

[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/FR3B1BQd)
