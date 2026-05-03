import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getPostBySlug, getAllPosts } from '@/lib/supabase';
import { getCategoryById, formatDate } from '@/lib/utils';

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const posts = await getAllPosts({});
    return posts.map((p) => ({ slug: p.slug }));
  } catch { return []; }
}

export async function generateMetadata({ params }) {
  try {
    const post = await getPostBySlug(params.slug);
    if (!post) return {};
    return {
      title: post.seo_title || post.title,
      description: post.seo_description || post.excerpt,
      openGraph: {
        title: post.seo_title || post.title,
        description: post.seo_description || post.excerpt,
        images: post.cover_image ? [{ url: post.cover_image, width: 1200, height: 630 }] : [],
        type: 'article',
        publishedTime: post.published_at,
      },
    };
  } catch { return {}; }
}

export default async function BlogPostPage({ params }) {
  let post;
  try {
    post = await getPostBySlug(params.slug);
  } catch { notFound(); }
  if (!post) notFound();

  const cat = getCategoryById(post.category);

  return (
    <>
      <Navbar />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: post.title,
          description: post.excerpt,
          image: post.cover_image,
          datePublished: post.published_at || post.created_at,
          dateModified: post.updated_at || post.created_at,
          author: { '@type': 'Organization', name: 'SmartDealsHub' },
          publisher: {
            '@type': 'Organization',
            name: 'SmartDealsHub',
            logo: { '@type': 'ImageObject', url: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png` },
          },
        }),
      }} />

      <main>
        {/* Cover Image */}
        {post.cover_image && (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8">
            <div className="relative h-64 md:h-[400px] rounded-2xl overflow-hidden">
              <Image src={post.cover_image} alt={post.title} fill className="object-cover" priority />
            </div>
          </div>
        )}

        <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10 min-h-screen">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-brand-muted mb-6">
            <Link href="/" className="hover:text-brand-gold transition-colors">Home</Link>
            <span className="text-gray-300">/</span>
            <Link href="/blog" className="hover:text-brand-gold transition-colors">Blog</Link>
            {cat && (
              <>
                <span className="text-gray-300">/</span>
                <Link href={`/category/${cat.id}`} className="hover:text-brand-gold transition-colors"
                  style={{ color: cat.color }}>
                  {cat.icon} {cat.label}
                </Link>
              </>
            )}
          </nav>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {cat && (
              <Link href={`/category/${cat.id}`}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                style={{ background: cat.color + '15', color: cat.color }}>
                {cat.icon} {cat.label}
              </Link>
            )}
            <span className="text-sm text-brand-muted">{formatDate(post.published_at || post.created_at)}</span>
            {post.read_time && <span className="text-sm text-brand-muted">· {post.read_time} min read</span>}
          </div>

          {/* Title */}
          <h1 className="font-display text-4xl md:text-5xl font-bold text-brand-charcoal dark:text-gray-100 leading-tight mb-6">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xl text-brand-muted leading-relaxed mb-8 border-l-4 border-brand-gold pl-5 italic font-display">
              {post.excerpt}
            </p>
          )}

          {/* Amazon CTA */}
          {post.amazon_link && (
            <a
              href={post.amazon_link}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="flex items-center justify-between bg-brand-gold/10 dark:bg-brand-gold/5 border border-brand-gold/30 rounded-2xl p-5 mb-10 hover:bg-brand-gold/20 transition-colors group"
            >
              <div>
                <p className="text-xs text-brand-gold font-semibold uppercase tracking-wider mb-1">Amazon Deal</p>
                <p className="font-display text-lg font-bold text-brand-charcoal dark:text-gray-100">Check Current Price on Amazon</p>
                <p className="text-sm text-brand-muted mt-0.5">Prices and availability may vary</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-brand-gold flex items-center justify-center text-white group-hover:scale-110 transition-transform flex-shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </a>
          )}

          {/* Body */}
          <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.content }} />

          {/* Bottom CTA */}
          {post.amazon_link && (
            <div className="mt-12 text-center">
              <a
                href={post.amazon_link}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-block px-10 py-4 bg-brand-gold text-brand-dark font-bold rounded-full hover:bg-brand-gold-light transition-colors text-lg"
              >
                🛒 Buy on Amazon
              </a>
              <p className="text-xs text-brand-muted mt-3">* Affiliate link — we may earn a commission</p>
            </div>
          )}
        </article>

      </main>
      <Footer />
    </>
  );
}
