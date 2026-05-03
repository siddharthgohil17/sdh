import Link from 'next/link';
import { CATEGORIES } from '@/lib/utils';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-brand-dark dark:bg-black text-gray-400 border-t border-brand-gold/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="text-2xl font-display font-bold">
              <span style={{ background: 'linear-gradient(135deg, #FF8C00, #FFD700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Smart</span>
              <span className="text-white">Deals</span>
              <span style={{ background: 'linear-gradient(135deg, #FF8C00, #FFD700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Hub</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed">
              Curated Amazon product reviews and deals across every niche — written to help you shop smarter.
            </p>
            <p className="mt-4 text-xs text-brand-muted">
              ⚠️ As an Amazon Associate, we earn from qualifying purchases. Prices and availability are subject to change.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">Categories</h3>
            <div className="grid grid-cols-2 gap-1">
              {CATEGORIES.slice(0, 8).map((cat) => (
                <Link key={cat.id} href={`/category/${cat.id}`} className="text-sm py-1 hover:text-brand-gold transition-colors flex items-center gap-1">
                  <span className="text-xs">{cat.icon}</span> {cat.label.split(' ')[0]}
                </Link>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-brand-gold transition-colors">Home</Link></li>
              <li><Link href="/blog" className="hover:text-brand-gold transition-colors">All Posts</Link></li>
              <li><Link href="/admin" className="hover:text-brand-gold transition-colors">Admin Dashboard</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-brand-gold/10 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-brand-muted">
          <p>© {year} SmartDealsHub. All rights reserved.</p>
          <p>Built with ❤️ for smart shoppers worldwide.</p>
        </div>
      </div>
    </footer>
  );
}
