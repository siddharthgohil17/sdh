'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createPost, updatePost } from '@/lib/supabase';
import { CATEGORIES, createSlug, estimateReadTime } from '@/lib/utils';
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false, loading: () => <div className="h-80 bg-gray-50 rounded-xl animate-pulse" /> });

const QUILL_MODULES = {
  toolbar: [
    [{ header: [2, 3, 4, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote', 'code-block'],
    ['link', 'image'],
    ['clean'],
  ],
};

export default function PostEditor({ post = null }) {
  const router = useRouter();
  const isEdit = !!post;

  const [form, setForm] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    cover_image: post?.cover_image || '',
    amazon_link: post?.amazon_link || '',
    category: post?.category || '',
    seo_title: post?.seo_title || '',
    seo_description: post?.seo_description || '',
    is_published: post?.is_published ?? false,
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(false);
  const slugManuallyEdited = useRef(isEdit);

  // Auto-generate slug from title
  useEffect(() => {
    if (!slugManuallyEdited.current && form.title) {
      setForm((f) => ({ ...f, slug: createSlug(f.title) }));
    }
  }, [form.title]);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setSaved(false);
  }

  async function handleSave(publish = null) {
    if (!form.title.trim()) { setError('Title is required.'); return; }
    if (!form.slug.trim())  { setError('Slug is required.'); return; }
    if (!form.content.trim()) { setError('Content is required.'); return; }
    if (!form.category) { setError('Please select a category.'); return; }

    setError('');
    setSaving(true);

    const payload = {
      ...form,
      read_time: estimateReadTime(form.content),
      is_published: publish !== null ? publish : form.is_published,
      published_at: (publish || form.is_published) ? (post?.published_at || new Date().toISOString()) : null,
      updated_at: new Date().toISOString(),
    };

    try {
      if (isEdit) {
        await updatePost(post.id, payload);
      } else {
        const created = await createPost({ ...payload, created_at: new Date().toISOString() });
        router.push(`/admin/posts/${created.id}/edit`);
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setError(e.message);
    }
    setSaving(false);
  }

  const cat = CATEGORIES.find((c) => c.id === form.category);

  return (
    <div className="flex gap-6">
      {/* Main Editor */}
      <div className="flex-1 min-w-0 space-y-5">

        {/* Title */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">Post Title *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="e.g. Best Wireless Earbuds Under $50 (2025 Review)"
            className="w-full text-2xl font-display font-bold text-brand-charcoal border-0 outline-none placeholder-gray-300 bg-transparent"
          />
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-brand-muted">Slug:</span>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => { slugManuallyEdited.current = true; set('slug', e.target.value); }}
              className="flex-1 text-xs font-mono text-brand-gold border-0 outline-none bg-transparent"
            />
          </div>
        </div>

        {/* Excerpt */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">Excerpt / Intro</label>
          <textarea
            value={form.excerpt}
            onChange={(e) => set('excerpt', e.target.value)}
            rows={3}
            placeholder="A short, compelling summary shown on cards and in search results..."
            className="w-full text-sm text-brand-charcoal border-0 outline-none resize-none placeholder-gray-300 bg-transparent leading-relaxed"
          />
          <p className="text-xs text-brand-muted mt-1">{form.excerpt.length}/200 chars</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <label className="text-xs font-semibold text-brand-muted uppercase tracking-wider">Content *</label>
            <button onClick={() => setPreview(!preview)}
              className="text-xs px-3 py-1 rounded-full border border-gray-200 text-brand-muted hover:border-brand-gold hover:text-brand-gold transition-colors">
              {preview ? '✏️ Edit' : '👁️ Preview'}
            </button>
          </div>
          <div className="p-4">
            {preview ? (
              <div className="blog-content min-h-80 px-2" dangerouslySetInnerHTML={{ __html: form.content }} />
            ) : (
              <ReactQuill
                theme="snow"
                value={form.content}
                onChange={(val) => set('content', val)}
                modules={QUILL_MODULES}
              />
            )}
          </div>
        </div>

        {/* SEO */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-4">🔍 SEO Settings</label>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-brand-muted mb-1">SEO Title (60 chars max)</label>
              <input
                type="text"
                value={form.seo_title}
                onChange={(e) => set('seo_title', e.target.value)}
                placeholder={form.title || 'Defaults to post title'}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-gold"
              />
              <p className="text-xs text-right mt-1" style={{ color: form.seo_title.length > 60 ? 'red' : '#888' }}>
                {form.seo_title.length}/60
              </p>
            </div>
            <div>
              <label className="block text-xs text-brand-muted mb-1">Meta Description (160 chars max)</label>
              <textarea
                value={form.seo_description}
                onChange={(e) => set('seo_description', e.target.value)}
                rows={3}
                placeholder={form.excerpt || 'Defaults to excerpt'}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-gold resize-none"
              />
              <p className="text-xs text-right mt-1" style={{ color: form.seo_description.length > 160 ? 'red' : '#888' }}>
                {form.seo_description.length}/160
              </p>
            </div>
          </div>

          {/* SERP Preview */}
          <div className="mt-5 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <p className="text-xs text-brand-muted font-semibold mb-2 uppercase tracking-wider">Google Preview</p>
            <p className="text-blue-600 text-base font-medium leading-tight truncate">
              {form.seo_title || form.title || 'Your Post Title Here'}
            </p>
            <p className="text-green-700 text-xs mt-0.5">smartdealshub.com › blog › {form.slug || 'post-slug'}</p>
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">
              {form.seo_description || form.excerpt || 'Your meta description will appear here...'}
            </p>
          </div>
        </div>
      </div>

      {/* Sidebar Panel */}
      <div className="w-80 flex-shrink-0 space-y-5">

        {/* Publish */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-brand-charcoal mb-4">Publish</h3>

          {error && <p className="text-red-500 text-sm bg-red-50 rounded-lg px-3 py-2 mb-3">{error}</p>}
          {saved && <p className="text-emerald-600 text-sm bg-emerald-50 rounded-lg px-3 py-2 mb-3">✅ Changes saved!</p>}

          <div className="space-y-2">
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="w-full py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-brand-charcoal hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : '💾 Save Draft'}
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="w-full py-2.5 bg-brand-gold text-brand-dark rounded-xl text-sm font-bold hover:bg-brand-gold-light transition-colors disabled:opacity-50"
            >
              {saving ? 'Publishing...' : form.is_published ? '🔄 Update & Publish' : '🚀 Publish Post'}
            </button>
          </div>

          {isEdit && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-brand-muted">Status</span>
              <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${form.is_published ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                {form.is_published ? 'Published' : 'Draft'}
              </span>
            </div>
          )}
        </div>

        {/* Category */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-brand-charcoal mb-3">Category *</h3>
          <div className="grid grid-cols-1 gap-1.5 max-h-64 overflow-y-auto">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => set('category', c.id)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-all ${
                  form.category === c.id
                    ? 'text-white shadow-sm'
                    : 'bg-gray-50 text-brand-muted hover:bg-gray-100'
                }`}
                style={form.category === c.id ? { background: c.color } : {}}
              >
                <span>{c.icon}</span> {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cover Image */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-brand-charcoal mb-3">Cover Image</h3>
          <input
            type="url"
            value={form.cover_image}
            onChange={(e) => set('cover_image', e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-gold"
          />
          {form.cover_image && (
            <div className="mt-3 rounded-xl overflow-hidden aspect-video bg-gray-100">
              <img src={form.cover_image} alt="Cover preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display='none'} />
            </div>
          )}
        </div>

        {/* Amazon Link */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-brand-charcoal mb-1">Amazon Affiliate Link</h3>
          <p className="text-xs text-brand-muted mb-3">Paste your Amazon Associates URL here</p>
          <input
            type="url"
            value={form.amazon_link}
            onChange={(e) => set('amazon_link', e.target.value)}
            placeholder="https://www.amazon.com/dp/..."
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-gold"
          />
          {form.amazon_link && (
            <a href={form.amazon_link} target="_blank" rel="noopener noreferrer"
              className="text-xs text-brand-gold hover:underline mt-2 block truncate">
              🔗 {form.amazon_link}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
