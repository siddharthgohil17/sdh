import Link from 'next/link';
import PostEditor from '@/components/admin/PostEditor';

export const metadata = { title: 'New Post | Admin' };

export default function NewPostPage() {
  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/posts" className="text-brand-muted hover:text-brand-gold transition-colors text-sm">
          ← All Posts
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-2xl font-display font-bold text-brand-charcoal">New Post</h1>
      </div>
      <PostEditor />
    </div>
  );
}
