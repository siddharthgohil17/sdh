import Link from 'next/link';
import { getAllPosts } from '@/lib/supabase';
import { CATEGORIES, formatDate } from '@/lib/utils';

export const revalidate = 0;

async function getStats() {
  try {
    const all = await getAllPosts({ published: false });
    const published = all.filter((p) => p.is_published);
    const drafts = all.filter((p) => !p.is_published);
    const byCategory = CATEGORIES.map((cat) => ({
      ...cat,
      count: all.filter((p) => p.category === cat.id).length,
    })).filter((c) => c.count > 0);
    return { all, published, drafts, byCategory };
  } catch {
    return { all: [], published: [], drafts: [], byCategory: [] };
  }
}

export default async function AdminDashboard() {
  const { all, published, drafts, byCategory } = await getStats();
  const recent = all.slice(0, 5);

  const stats = [
    { label: 'Total Posts', value: all.length, icon: '📝', color: '#C9A84C' },
    { label: 'Published', value: published.length, icon: '✅', color: '#10B981' },
    { label: 'Drafts', value: drafts.length, icon: '📋', color: '#6366F1' },
    { label: 'Categories Used', value: byCategory.length, icon: '🗂️', color: '#EC4899' },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-charcoal">Dashboard</h1>
          <p className="text-brand-muted mt-1">Welcome back! Here's what's happening on SmartDealsHub.</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-2 px-6 py-3 bg-brand-gold text-brand-dark rounded-xl font-semibold hover:bg-brand-gold-light transition-colors"
        >
          <span>✏️</span> New Post
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl">{s.icon}</span>
              <span className="text-3xl font-display font-bold" style={{ color: s.color }}>{s.value}</span>
            </div>
            <p className="text-sm text-brand-muted font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Posts */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-brand-charcoal">Recent Posts</h2>
            <Link href="/admin/posts" className="text-sm text-brand-gold hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recent.length === 0 && (
              <div className="px-6 py-10 text-center text-brand-muted">
                <p className="text-3xl mb-2">📝</p>
                <p>No posts yet. <Link href="/admin/posts/new" className="text-brand-gold">Create your first one!</Link></p>
              </div>
            )}
            {recent.map((post) => {
              const cat = CATEGORIES.find((c) => c.id === post.category);
              return (
                <div key={post.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-brand-charcoal truncate">{post.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {cat && <span className="text-xs" style={{ color: cat.color }}>{cat.icon} {cat.label}</span>}
                      <span className="text-xs text-brand-muted">{formatDate(post.created_at)}</span>
                    </div>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${post.is_published ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                    {post.is_published ? 'Published' : 'Draft'}
                  </span>
                  <Link href={`/admin/posts/${post.id}/edit`} className="text-brand-gold hover:text-brand-gold-light text-sm font-medium">
                    Edit
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-brand-charcoal">Posts by Category</h2>
          </div>
          <div className="p-6 space-y-4">
            {byCategory.length === 0 && (
              <p className="text-brand-muted text-sm text-center py-4">No data yet</p>
            )}
            {byCategory.map((cat) => {
              const pct = all.length > 0 ? Math.round((cat.count / all.length) * 100) : 0;
              return (
                <div key={cat.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium flex items-center gap-1.5">
                      {cat.icon} <span className="truncate max-w-[130px]">{cat.label}</span>
                    </span>
                    <span className="text-xs text-brand-muted font-mono">{cat.count}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: cat.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="px-6 pb-6 space-y-2">
            <p className="text-xs text-brand-muted uppercase tracking-wider font-semibold mb-3">Quick Actions</p>
            <Link href="/admin/posts/new" className="flex items-center gap-2 text-sm text-brand-charcoal hover:text-brand-gold transition-colors">
              <span>✏️</span> Write new post
            </Link>
            <Link href="/blog" target="_blank" className="flex items-center gap-2 text-sm text-brand-charcoal hover:text-brand-gold transition-colors">
              <span>🌐</span> View live site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
