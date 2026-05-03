import Link from 'next/link';
import { getAllPosts } from '@/lib/supabase';
import { getCategoryById, formatDate } from '@/lib/utils';
import PostsTableClient from '@/components/admin/PostsTableClient';

export const revalidate = 0;

export default async function AdminPostsPage() {
  let posts = [];
  try { posts = await getAllPosts({ published: false }); } catch {}

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-charcoal">All Posts</h1>
          <p className="text-brand-muted mt-1">{posts.length} post{posts.length !== 1 ? 's' : ''} total</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-2 px-6 py-3 bg-brand-gold text-brand-dark rounded-xl font-semibold hover:bg-brand-gold-light transition-colors"
        >
          ✏️ New Post
        </Link>
      </div>
      <PostsTableClient initialPosts={posts} />
    </div>
  );
}
