import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogCard from '@/components/BlogCard';
import { getAllPosts } from '@/lib/supabase';
import { CATEGORIES } from '@/lib/utils';
import Link from 'next/link';

export const revalidate = 60;

export const metadata = {
  title: 'All Posts',
  description: 'Browse all SmartDealsHub product reviews, buying guides, and Amazon deals across every category.',
};

export default async function BlogPage({ searchParams }) {
  const category = searchParams?.category || null;
  let posts = [];
  try {
    posts = await getAllPosts({ category });
  } catch {}

  const activeCat = CATEGORIES.find((c) => c.id === category);

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">

        {/* Header */}
        <div className="mb-10">
          <p className="text-brand-gold text-xs font-semibold uppercase tracking-widest mb-2">
            {activeCat ? activeCat.label : 'All Categories'}
          </p>
          <h1 className="font-display text-4xl font-bold text-brand-charcoal dark:text-gray-100">
            {activeCat ? `${activeCat.icon} ${activeCat.label}` : 'All Posts'}
          </h1>
          <p className="text-brand-muted mt-2">{posts.length} article{posts.length !== 1 ? 's' : ''} found</p>
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-10">
          <Link href="/blog"
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${!category ? 'bg-brand-gold text-brand-dark' : 'bg-white dark:bg-brand-charcoal border border-gray-200 dark:border-brand-gray text-brand-muted hover:border-brand-gold hover:text-brand-gold'}`}>
            All
          </Link>
          {CATEGORIES.map((cat) => (
            <Link key={cat.id} href={`/blog?category=${cat.id}`}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${category === cat.id ? 'bg-brand-gold text-brand-dark' : 'bg-white dark:bg-brand-charcoal border border-gray-200 dark:border-brand-gray text-brand-muted hover:border-brand-gold hover:text-brand-gold'}`}>
              {cat.icon} {cat.label}
            </Link>
          ))}
        </div>

        {/* Posts Grid */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => <BlogCard key={post.id} post={post} />)}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">{activeCat?.icon || '📝'}</p>
            <h2 className="font-display text-2xl font-bold text-brand-charcoal dark:text-gray-100 mb-2">No posts yet</h2>
            <p className="text-brand-muted mb-6">Be the first to publish in this category.</p>
            <Link href="/admin/posts/new" className="px-6 py-2.5 bg-brand-gold text-brand-dark rounded-full font-semibold">
              Write a Post
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
