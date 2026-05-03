import { notFound } from 'next/navigation';
import Link from 'next/link';
import PostEditor from '@/components/admin/PostEditor';
import { getPostById } from '@/lib/supabase';

export const metadata = { title: 'Edit Post | Admin' };

export default async function EditPostPage({ params }) {
  let post;
  try {
    post = await getPostById(params.id);
  } catch { notFound(); }
  if (!post) notFound();

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/posts" className="text-brand-muted hover:text-brand-gold transition-colors text-sm">
          ← All Posts
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-2xl font-display font-bold text-brand-charcoal line-clamp-1">Edit: {post.title}</h1>
        {post.is_published && post.slug && (
          <Link href={`/blog/${post.slug}`} target="_blank"
            className="ml-auto text-sm px-4 py-1.5 border border-brand-gold/30 text-brand-gold rounded-full hover:bg-brand-gold/10 transition-colors">
            🌐 View Live
          </Link>
        )}
      </div>
      <PostEditor post={post} />
    </div>
  );
}
