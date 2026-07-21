'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import {
  ShoppingBag,
  Home,
  ShoppingCart,
  Heart,
  Package,
  PlusCircle,
  LayoutDashboard,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Shield,
  Store
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const pathname = usePathname();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on path change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const isSellerOrAdmin = user?.role === 'admin' || user?.role === 'sales_person' || user?.role === 'sales';
  const isAdmin = user?.role === 'admin';

  // Helper for role label display
  const getRoleLabel = (role: string) => {
    if (role === 'admin') return { text: 'Admin', class: 'admin' };
    if (role === 'sales_person' || role === 'sales') return { text: 'Seller', class: 'seller' };
    return { text: 'Buyer', class: 'buyer' };
  };

  const roleInfo = user?.role ? getRoleLabel(user.role) : null;

  return (
    <>
      <header className="navbar">
        <div className="nav-container">
          {/* Logo / Brand Name */}
          <Link href="/" className="nav-logo">
            <div className="nav-logo-icon">
              <ShoppingBag size={20} />
            </div>
            <span>RBAC Store</span>
          </Link>

          {/* Center Navigation Links */}
          <nav className="nav-center">
            <Link
              href="/"
              className={`nav-link ${pathname === '/' ? 'active' : ''}`}
            >
              <Home size={18} />
              <span>Home</span>
            </Link>

            <Link
              href="/cart"
              className={`nav-link ${pathname === '/cart' ? 'active' : ''}`}
            >
              <ShoppingCart size={18} />
              <span>Cart</span>
              <span className="badge-count">{cartCount}</span>
            </Link>

            <Link
              href="/wishlist"
              className={`nav-link ${pathname === '/wishlist' ? 'active' : ''}`}
            >
              <Heart size={18} />
              <span>Wishlist</span>
              <span className="badge-count">{wishlistCount}</span>
            </Link>

            <Link
              href="/orders"
              className={`nav-link ${pathname === '/orders' ? 'active' : ''}`}
            >
              <Package size={18} />
              <span>Orders</span>
            </Link>
          </nav>

          {/* Right Section Desktop */}
          <div className="nav-right nav-right-desktop">
            {user ? (
              <>
                {/* Role-Based Navigation Buttons */}
                {isSellerOrAdmin && (
                  <Link href="/products/new" className="btn-seller-action">
                    <PlusCircle size={16} />
                    <span>Add Product</span>
                  </Link>
                )}

                {/* Seller Dashboard Button */}
                {(user?.role === 'sales_person' || user?.role === 'sales') && (
                  <Link href="/dashboard/seller" className="btn-seller-action" style={{ background: 'var(--accent-blue-light)', color: 'var(--accent-blue)' }}>
                    <Store size={16} />
                    <span>Shop Dashboard</span>
                  </Link>
                )}

                {/* Admin Dashboard Button */}
                {isAdmin && (
                  <Link href="/dashboard/admin" className="btn-admin-action">
                    <LayoutDashboard size={16} />
                    <span>Admin Dashboard</span>
                  </Link>
                )}

                {/* User Dropdown */}
                <div className="user-dropdown-wrapper" ref={dropdownRef}>
                  <button
                    className="user-trigger-btn"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    aria-expanded={isDropdownOpen}
                  >
                    <div className="user-avatar">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="user-name">{user.business_name || user.name || 'Account'}</span>
                    <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
                  </button>

                  {isDropdownOpen && (
                    <div className="user-dropdown-menu">
                      <div className="dropdown-user-header">
                        <div className="dropdown-user-name">{user.name}</div>
                        {user.business_name && (
                          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-blue)', marginTop: '2px' }}>
                            {user.business_name}
                          </div>
                        )}
                        <div className="dropdown-user-email">{user.email}</div>
                        {roleInfo && (
                          <span className={`role-badge ${roleInfo.class}`}>
                            {roleInfo.text}
                          </span>
                        )}
                      </div>

                      {(user?.role === 'sales_person' || user?.role === 'sales') && (
                        <Link
                          href="/dashboard/seller"
                          className="dropdown-item"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <Store size={16} />
                          <span>Seller Dashboard</span>
                        </Link>
                      )}

                      {isAdmin && (
                        <Link
                          href="/dashboard/admin"
                          className="dropdown-item"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <Shield size={16} />
                          <span>Admin Control</span>
                        </Link>
                      )}

                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          logout();
                        }}
                        className="dropdown-item logout"
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="btn-nav-outline">
                  Log In
                </Link>
                <Link href="/register" className="btn-nav-primary">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            className="mobile-toggle-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-drawer open">
          <Link
            href="/"
            className={`nav-link ${pathname === '/' ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Home size={18} />
            <span>Home</span>
          </Link>

          <Link
            href="/cart"
            className={`nav-link ${pathname === '/cart' ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <ShoppingCart size={18} />
            <span>Cart</span>
            <span className="badge-count" style={{ marginLeft: 'auto' }}>{cartCount}</span>
          </Link>

          <Link
            href="/wishlist"
            className={`nav-link ${pathname === '/wishlist' ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Heart size={18} />
            <span>Wishlist</span>
            <span className="badge-count" style={{ marginLeft: 'auto' }}>{wishlistCount}</span>
          </Link>

          <Link
            href="/orders"
            className={`nav-link ${pathname === '/orders' ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Package size={18} />
            <span>Orders</span>
          </Link>

          <hr style={{ border: 'none', borderTop: '1px solid var(--surface-border)', margin: '0.25rem 0' }} />

          {user ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem' }}>
                <div className="user-avatar" style={{ width: '38px', height: '38px', fontSize: '1rem' }}>
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{user.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{user.email}</div>
                  {roleInfo && (
                    <span className={`role-badge ${roleInfo.class}`} style={{ marginTop: '0.25rem' }}>
                      {roleInfo.text}
                    </span>
                  )}
                </div>
              </div>

              {isSellerOrAdmin && (
                <Link
                  href="/products/new"
                  className="btn-seller-action"
                  style={{ justifyContent: 'center' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <PlusCircle size={18} />
                  <span>Add Product</span>
                </Link>
              )}

              {(user?.role === 'sales_person' || user?.role === 'sales') && (
                <Link
                  href="/dashboard/seller"
                  className="btn-seller-action"
                  style={{ justifyContent: 'center' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Store size={18} />
                  <span>Seller Dashboard</span>
                </Link>
              )}

              {isAdmin && (
                <Link
                  href="/dashboard/admin"
                  className="btn-admin-action"
                  style={{ justifyContent: 'center' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LayoutDashboard size={18} />
                  <span>Admin Dashboard</span>
                </Link>
              )}

              <Link
                href="/profile"
                className="dropdown-item"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <UserIcon size={18} />
                <span>Profile</span>
              </Link>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  logout();
                }}
                className="dropdown-item logout"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Link
                href="/login"
                className="btn-nav-outline"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="btn-nav-primary"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </>
  );
}
