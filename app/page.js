import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogCard from '@/components/BlogCard';
import { getAllPosts } from '@/lib/supabase';
import { CATEGORIES } from '@/lib/utils';

export const revalidate = 60; // ISR — revalidate every 60 seconds

async function getData() {
  try {
    const posts = await getAllPosts({ limit: 10 });
    return posts;
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const posts = await getData();
  const featured = posts.slice(0, 2);
  const recent = posts.slice(2, 8);

  return (
    <>
      <Navbar />
      <main>

        {/* ── Hero ─────────────────────────────────────── */}
        <section className="bg-brand-dark overflow-hidden relative">
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #C9A84C 1px, transparent 0)', backgroundSize: '32px 32px' }} />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <span className="inline-block px-4 py-1.5 rounded-full border border-brand-gold/40 text-brand-gold text-xs font-semibold tracking-widest uppercase mb-6">
              Your Trusted Deal Guide
            </span>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
              Smart<span className="shimmer-text">Deals</span>Hub
            </h1>
            <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Curated Amazon product reviews across every niche — electronics, home, beauty, books, and beyond. Honest. Researched. Deal-ready.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/blog" className="px-8 py-3 bg-brand-gold text-brand-dark rounded-full font-bold hover:bg-brand-gold-light transition-colors">
                Explore All Posts
              </Link>
              <Link href="/category/electronics" className="px-8 py-3 border border-brand-gold/40 text-brand-gold rounded-full font-medium hover:bg-brand-gold/10 transition-colors">
                Browse Categories
              </Link>
            </div>
          </div>
        </section>

        {/* ── Categories ───────────────────────────────── */}
        <section className="py-14 bg-white dark:bg-brand-charcoal border-b border-gray-100 dark:border-brand-gray">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.id}`}
                  className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all hover:shadow-md text-sm font-medium"
                  style={{ borderColor: cat.color + '44', color: cat.color, background: cat.color + '08' }}
                >
                  <span className="text-lg">{cat.icon}</span>
                  <span>{cat.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">

          {/* ── Featured Posts ────────────────────────── */}
          {featured.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-brand-gold text-xs font-semibold uppercase tracking-widest mb-1">Handpicked</p>
                  <h2 className="font-display text-3xl font-bold text-brand-charcoal dark:text-gray-100">Featured Posts</h2>
                </div>
                <Link href="/blog" className="text-sm text-brand-gold font-medium hover:underline">View all →</Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featured.map((post) => <BlogCard key={post.id} post={post} featured />)}
              </div>
            </section>
          )}

          {/* ── Recent Posts ──────────────────────────── */}
          {recent.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-brand-gold text-xs font-semibold uppercase tracking-widest mb-1">Latest</p>
                  <h2 className="font-display text-3xl font-bold text-brand-charcoal dark:text-gray-100">Recent Reviews</h2>
                </div>
                <Link href="/blog" className="text-sm text-brand-gold font-medium hover:underline">View all →</Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recent.map((post) => <BlogCard key={post.id} post={post} />)}
              </div>
            </section>
          )}

          {/* ── Empty State ───────────────────────────── */}
          {posts.length === 0 && (
            <section className="text-center py-20">
              <p className="text-5xl mb-4">🚀</p>
              <h2 className="font-display text-3xl font-bold text-brand-charcoal mb-3">Coming Soon!</h2>
              <p className="text-brand-muted mb-8">SmartDealsHub is warming up. Head to the dashboard to publish your first post.</p>
              <Link href="/admin" className="px-8 py-3 bg-brand-gold text-brand-dark rounded-full font-bold hover:bg-brand-gold-light transition-colors">
                Go to Dashboard
              </Link>
            </section>
          )}

          {/* ── CTA ───────────────────────────────────── */}
          <section className="bg-brand-dark rounded-3xl p-10 text-center">
            <h2 className="font-display text-3xl font-bold text-white mb-4">Never Miss a Deal</h2>
            <p className="text-gray-400 max-w-lg mx-auto mb-8">We review hundreds of Amazon products so you can shop smarter across every category.</p>
            <Link href="/blog" className="inline-block px-8 py-3 bg-brand-gold text-brand-dark rounded-full font-bold hover:bg-brand-gold-light transition-colors">
              Start Reading →
            </Link>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
