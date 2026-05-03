import slugify from 'slugify';

export const CATEGORIES = [
  { id: 'electronics', label: 'Electronics & Gadgets', icon: '⚡', color: '#3B82F6' },
  { id: 'home-kitchen', label: 'Home & Kitchen', icon: '🏠', color: '#10B981' },
  { id: 'health-beauty', label: 'Health & Beauty', icon: '✨', color: '#EC4899' },
  { id: 'books', label: 'Books & Education', icon: '📚', color: '#8B5CF6' },
  { id: 'sports', label: 'Sports & Outdoors', icon: '🏋️', color: '#F59E0B' },
  { id: 'fashion', label: 'Fashion & Apparel', icon: '👗', color: '#EF4444' },
  { id: 'toys', label: 'Toys & Games', icon: '🎮', color: '#14B8A6' },
  { id: 'automotive', label: 'Automotive', icon: '🚗', color: '#6366F1' },
  { id: 'office', label: 'Office & Stationery', icon: '💼', color: '#F97316' },
  { id: 'garden', label: 'Garden & Tools', icon: '🌱', color: '#22C55E' },
  { id: 'food', label: 'Food & Grocery', icon: '🍎', color: '#DC2626' },
  { id: 'pets', label: 'Pet Supplies', icon: '🐾', color: '#D97706' },
];

export function getCategoryById(id) {
  return CATEGORIES.find((c) => c.id === id);
}

export function createSlug(title) {
  return slugify(title, { lower: true, strict: true });
}

export function estimateReadTime(content) {
  const words = content?.replace(/<[^>]+>/g, '').split(/\s+/).length || 0;
  return Math.max(1, Math.ceil(words / 200));
}

export function truncate(str, n) {
  return str?.length > n ? str.slice(0, n - 1) + '…' : str;
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}
