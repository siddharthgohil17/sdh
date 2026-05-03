'use client';
import Link from 'next/link';
import { useState } from 'react';
import { CATEGORIES } from '@/lib/utils';
import ThemeToggle from '@/components/ThemeToggle';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-brand-dark/95 backdrop-blur border-b border-brand-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-display font-bold">
              <span style={{ background: 'linear-gradient(135deg, #FF8C00, #FFD700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Smart</span>
              <span className="text-white">Deals</span>
              <span style={{ background: 'linear-gradient(135deg, #FF8C00, #FFD700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Hub</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm text-gray-300 hover:text-brand-gold transition-colors font-medium">
              Home
            </Link>
            <Link href="/blog" className="text-sm text-gray-300 hover:text-brand-gold transition-colors font-medium">
              All Posts
            </Link>

            {/* Categories Dropdown */}
            <div className="relative" onMouseEnter={() => setCatOpen(true)} onMouseLeave={() => setCatOpen(false)}>
              <button className="text-sm text-gray-300 hover:text-brand-gold transition-colors font-medium flex items-center gap-1">
                Categories
                <svg className={`w-4 h-4 transition-transform ${catOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {catOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-72 bg-brand-charcoal border border-brand-gold/20 rounded-xl shadow-2xl p-3 grid grid-cols-2 gap-1">
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.id}`}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-brand-gray text-gray-300 hover:text-brand-gold transition-colors text-sm"
                    >
                      <span>{cat.icon}</span>
                      <span className="truncate">{cat.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <ThemeToggle />
            <Link
              href="/admin"
              className="text-sm px-4 py-1.5 bg-brand-gold text-brand-dark rounded-full font-semibold hover:bg-brand-gold-light transition-colors"
            >
              Dashboard
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-brand-charcoal border-t border-brand-gold/20 px-4 pb-4">
          <div className="pt-4 space-y-2">
            <Link href="/" className="block py-2 text-gray-300 hover:text-brand-gold">Home</Link>
            <Link href="/blog" className="block py-2 text-gray-300 hover:text-brand-gold">All Posts</Link>
            <div className="pt-2 border-t border-brand-gray">
              <p className="text-xs text-brand-muted uppercase tracking-wider mb-2">Categories</p>
              <div className="grid grid-cols-2 gap-1">
                {CATEGORIES.map((cat) => (
                  <Link key={cat.id} href={`/category/${cat.id}`} className="flex items-center gap-2 py-1.5 text-sm text-gray-400 hover:text-brand-gold">
                    <span>{cat.icon}</span> {cat.label}
                  </Link>
                ))}
              </div>
            </div>
            <Link href="/admin" className="block mt-3 text-center py-2 bg-brand-gold text-brand-dark rounded-full font-semibold">
              Dashboard
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
