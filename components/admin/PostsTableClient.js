'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { deletePost, updatePost } from '@/lib/supabase';
import { getCategoryById, formatDate, CATEGORIES } from '@/lib/utils';

export default function PostsTableClient({ initialPosts }) {
  const [posts, setPosts] = useState(initialPosts);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [deleting, setDeleting] = useState(null);
  const router = useRouter();

  const filtered = posts.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat ? p.category === filterCat : true;
    const matchStatus = filterStatus === 'published' ? p.is_published : filterStatus === 'draft' ? !p.is_published : true;
    return matchSearch && matchCat && matchStatus;
  });

  async function handleDelete(id) {
    if (!confirm('Delete this post permanently?')) return;
    setDeleting(id);
    try {
      await deletePost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      alert('Failed to delete: ' + e.message);
    }
    setDeleting(null);
  }

  async function handleTogglePublish(post) {
    try {
      const updated = await updatePost(post.id, {
        is_published: !post.is_published,
        published_at: !post.is_published ? new Date().toISOString() : post.published_at,
      });
      setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, ...updated } : p)));
    } catch (e) {
      alert('Failed to update: ' + e.message);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 p-5 border-b border-gray-100">
        <input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-gold"
        />
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-gold bg-white"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-gold bg-white"
        >
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-5 py-3 font-semibold text-brand-muted">Title</th>
              <th className="text-left px-5 py-3 font-semibold text-brand-muted">Category</th>
              <th className="text-left px-5 py-3 font-semibold text-brand-muted">Status</th>
              <th className="text-left px-5 py-3 font-semibold text-brand-muted">Date</th>
              <th className="text-right px-5 py-3 font-semibold text-brand-muted">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-brand-muted">
                  No posts found. <Link href="/admin/posts/new" className="text-brand-gold hover:underline">Create one!</Link>
                </td>
              </tr>
            )}
            {filtered.map((post) => {
              const cat = getCategoryById(post.category);
              return (
                <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium text-brand-charcoal line-clamp-1">{post.title}</p>
                    {post.excerpt && <p className="text-xs text-brand-muted mt-0.5 line-clamp-1">{post.excerpt}</p>}
                  </td>
                  <td className="px-5 py-4">
                    {cat ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
                        style={{ background: cat.color + '15', color: cat.color }}>
                        {cat.icon} {cat.label.split(' ')[0]}
                      </span>
                    ) : <span className="text-brand-muted">—</span>}
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => handleTogglePublish(post)}
                      className={`text-xs px-3 py-1 rounded-full font-semibold transition-colors ${post.is_published
                        ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    >
                      {post.is_published ? '✅ Published' : '📋 Draft'}
                    </button>
                  </td>
                  <td className="px-5 py-4 text-brand-muted text-xs whitespace-nowrap">
                    {formatDate(post.created_at)}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-3">
                      {post.is_published && (
                        <Link href={`/blog/${post.slug}`} target="_blank"
                          className="text-xs text-blue-500 hover:underline">View</Link>
                      )}
                      <Link href={`/admin/posts/${post.id}/edit`}
                        className="text-xs text-brand-gold hover:underline font-medium">Edit</Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        disabled={deleting === post.id}
                        className="text-xs text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
                      >
                        {deleting === post.id ? '...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-gray-100 text-xs text-brand-muted">
        Showing {filtered.length} of {posts.length} posts
      </div>
    </div>
  );
}
