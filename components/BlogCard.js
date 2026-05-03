import Link from 'next/link';
import Image from 'next/image';
import { getCategoryById, formatDate } from '@/lib/utils';

export default function BlogCard({ post, featured = false }) {
  const cat = getCategoryById(post.category);

  if (featured) {
    return (
      <Link href={`/blog/${post.slug}`} className="group block">
        <article className="relative rounded-2xl overflow-hidden bg-brand-charcoal card-hover h-[460px]">
          {post.cover_image && (
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              className="object-cover opacity-60 group-hover:opacity-70 transition-opacity duration-500"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-7">
            {cat && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3"
                style={{ background: cat.color + '22', color: cat.color, border: `1px solid ${cat.color}44` }}>
                {cat.icon} {cat.label}
              </span>
            )}
            <h2 className="font-display text-2xl font-bold text-white leading-tight mb-2 group-hover:text-brand-gold-light transition-colors">
              {post.title}
            </h2>
            <p className="text-gray-300 text-sm line-clamp-2 mb-3">{post.excerpt}</p>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span>{formatDate(post.published_at || post.created_at)}</span>
              {post.read_time && <><span>·</span><span>{post.read_time} min read</span></>}
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="bg-white dark:bg-brand-charcoal rounded-xl overflow-hidden shadow-sm card-hover border border-gray-100 dark:border-brand-gray">
        {post.cover_image && (
          <div className="relative h-40 overflow-hidden">
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        )}
        <div className="p-4">
          {cat && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium mb-2"
              style={{ background: cat.color + '15', color: cat.color }}>
              {cat.icon} {cat.label}
            </span>
          )}
          <h3 className="font-display text-base font-bold text-brand-charcoal dark:text-gray-100 leading-snug mb-3 group-hover:text-brand-gold transition-colors line-clamp-2">
            {post.title}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 dark:text-gray-500">{formatDate(post.published_at || post.created_at)}</span>
            {post.amazon_link && (
              <span className="text-xs text-brand-gold font-semibold">Amazon Deal →</span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
