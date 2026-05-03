# 🛒 SmartDealsHub — Setup Guide

A full-stack Next.js 14 blog site for Amazon product reviews with:
- **Public site** with SEO-optimized blog & category pages
- **Admin dashboard** to write, publish & manage posts
- **Supabase** as the database backend
- **12 product categories** built-in (expand anytime)

---

## 🚀 Quick Start

### Step 1 — Install Dependencies

```bash
cd smartdealshub
npm install
```

---

### Step 2 — Set Up Supabase

1. Go to [supabase.com](https://supabase.com) → **New Project**
2. Name it `smartdealshub`, choose a region close to you
3. Once created, go to **SQL Editor → New Query**
4. Paste the full contents of `supabase-schema.sql` and click **Run**

---

### Step 3 — Create an Admin User

In Supabase Dashboard → **Authentication → Users → Add User**:
- Email: `admin@smartdealshub.com`
- Password: *(choose a strong password)*
- Click **Create User**

---

### Step 4 — Configure Environment Variables

Copy `.env.local.example` → `.env.local` and fill in your values:

```bash
cp .env.local.example .env.local
```

Find your keys in Supabase Dashboard → **Settings → API**:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=SmartDealsHub

ADMIN_EMAIL=admin@smartdealshub.com
ADMIN_PASSWORD=your_strong_password
```

---

### Step 5 — Run the Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 📁 Project Structure

```
smartdealshub/
├── app/
│   ├── page.js                   # Homepage (featured + recent posts)
│   ├── blog/
│   │   ├── page.js               # All posts listing
│   │   └── [slug]/page.js        # Individual post (SEO optimized)
│   ├── category/
│   │   └── [category]/page.js    # Category pages
│   └── admin/
│       ├── page.js               # Dashboard stats
│       ├── posts/
│       │   ├── page.js           # All posts table
│       │   ├── new/page.js       # New post form
│       │   └── [id]/edit/page.js # Edit existing post
│       └── layout.js             # Admin sidebar layout
├── components/
│   ├── Navbar.js                 # Public navigation
│   ├── Footer.js                 # Footer with categories
│   ├── BlogCard.js               # Post card (normal + featured)
│   └── admin/
│       ├── Sidebar.js            # Admin navigation sidebar
│       ├── PostEditor.js         # Rich text post editor
│       └── PostsTableClient.js   # Posts table with filters
├── lib/
│   ├── supabase.js               # DB queries & auth helpers
│   └── utils.js                  # Categories, slug, date utils
└── supabase-schema.sql           # Run this in Supabase SQL editor
```

---

## 🗂️ Built-in Categories

| ID | Label | Icon |
|---|---|---|
| `electronics` | Electronics & Gadgets | ⚡ |
| `home-kitchen` | Home & Kitchen | 🏠 |
| `health-beauty` | Health & Beauty | ✨ |
| `books` | Books & Education | 📚 |
| `sports` | Sports & Outdoors | 🏋️ |
| `fashion` | Fashion & Apparel | 👗 |
| `toys` | Toys & Games | 🎮 |
| `automotive` | Automotive | 🚗 |
| `office` | Office & Stationery | 💼 |
| `garden` | Garden & Tools | 🌱 |
| `food` | Food & Grocery | 🍎 |
| `pets` | Pet Supplies | 🐾 |

To add more, edit `lib/utils.js` → `CATEGORIES` array.

---

## 🔍 SEO Features

- **Dynamic `<title>` and `<meta description>`** per post
- **Open Graph tags** for social sharing (Facebook, Twitter)
- **JSON-LD structured data** on every post page (Article schema)
- **Canonical URLs** and robots meta
- **ISR (Incremental Static Regeneration)** — pages rebuild every 60s
- **`generateStaticParams`** pre-renders all post slugs at build time
- **Semantic HTML** with proper heading hierarchy

---

## 🛠️ Admin Dashboard Features

- 📊 **Stats overview** — total posts, published, drafts, categories used
- 📋 **Posts table** — search, filter by category + status
- ✏️ **Rich text editor** (Quill) — headings, bold, lists, images, links
- 👁️ **Content preview** mode — see how post looks before publishing
- 🔍 **SEO panel** — custom title, meta description, live Google SERP preview
- 🖼️ **Cover image** — URL input with live thumbnail preview
- 🛒 **Amazon link** — per-post affiliate link
- 🚀 **One-click publish/draft** toggle
- 🗂️ **Auto-slug** generated from title (editable)
- ⏱️ **Read time** auto-calculated from word count

---

## 🌐 Deployment (Vercel — Recommended)

```bash
npm install -g vercel
vercel
```

Add all `.env.local` variables in Vercel Dashboard → Project → Settings → Environment Variables.

Then redeploy:
```bash
vercel --prod
```

Update `NEXT_PUBLIC_SITE_URL` to your live domain.

---

## ⚠️ Affiliate Disclaimer

Add this to your site footer and each post:

> *As an Amazon Associate, SmartDealsHub earns from qualifying purchases. Product prices and availability are accurate as of the date/time indicated and are subject to change.*

This is required by the Amazon Associates Program.

---

## 📬 Support

Built for SmartDealsHub. Extend freely — add more categories, image uploads via Supabase Storage, newsletter signups, and more!
