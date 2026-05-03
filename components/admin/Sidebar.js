'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '📊', exact: true },
  { href: '/admin/posts', label: 'All Posts', icon: '📝' },
  { href: '/admin/posts/new', label: 'New Post', icon: '✏️' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-brand-dark border-r border-brand-gold/10 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-brand-gold/10">
        <Link href="/admin" className="block">
          <p className="font-display text-xl font-bold text-white">
            Smart<span className="text-brand-gold">Deals</span>Hub
          </p>
          <p className="text-xs text-brand-muted mt-0.5">Admin Dashboard</p>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href) && !(item.exact && pathname !== item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'bg-brand-gold text-brand-dark'
                  : 'text-gray-400 hover:bg-brand-gray hover:text-white'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-brand-gold/10 space-y-2">
        <Link href="/" target="_blank"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-brand-gray transition-colors">
          <span>🌐</span> View Site
        </Link>
      </div>
    </aside>
  );
}
