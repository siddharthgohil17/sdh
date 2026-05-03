import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogCard from '@/components/BlogCard';
import { getAllPosts } from '@/lib/supabase';
import { getCategoryById, CATEGORIES } from '@/lib/utils';
import Link from 'next/link';

export const revalidate = 60;

export async function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.id }));
}

export async function generateMetadata({ params }) {
  const cat = getCategoryById(params.category);
  if (!cat) return {};
  return {
    title: `${cat.label} Reviews & Deals`,
    description: `Best ${cat.label} product reviews and Amazon deals curated by SmartDealsHub.`,
  };
}

export default async function CategoryPage({ params }) {
  const cat = getCategoryById(params.category);
  if (!cat) notFound();

  let posts = [];
  try { posts = await getAllPosts({ category: params.category }); } catch {}

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <div className="bg-brand-dark py-16 text-center">
          <p className="text-6xl mb-4">{cat.icon}</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-3">{cat.label}</h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            In-depth reviews and best Amazon deals in {cat.label} — researched so you don&apos;t have to.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => <BlogCard key={post.id} post={post} />)}
            </div>
          ) : (
            <div className="text-center py-24">
              <h2 className="font-display text-2xl font-bold text-brand-charcoal dark:text-gray-100 mb-2">No posts in {cat.label} yet</h2>
              <p className="text-brand-muted mb-6">Check back soon — we&apos;re working on it!</p>
              <Link href="/blog" className="px-6 py-2.5 bg-brand-gold text-brand-dark rounded-full font-semibold">
                Browse All Posts
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
