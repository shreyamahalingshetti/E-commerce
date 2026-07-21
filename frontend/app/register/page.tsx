'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ShoppingBag,
  Store,
  Shield,
  ArrowRight
} from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'user' | 'sales_person'>('user');
  const [businessName, setBusinessName] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!email.trim()) {
      setError('Please enter a valid email address.');
      return;
    }

    if (role === 'sales_person' && !businessName.trim()) {
      setError('Please enter your Business / Shop Name.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await register({
        name,
        email,
        password,
        role,
        businessName: role === 'sales_person' ? businessName.trim() : undefined
      });

      if (res && res.success === false) {
        setError(res.error || 'Registration failed. Please try again.');
        return;
      }

      if (role === 'sales_person') {
        router.push('/dashboard/seller');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || 'Registration failed. Please try again.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        {/* Card Header with Logo */}
        <div className="auth-header">
          <div className="brand-badge">
            <ShoppingBag size={18} />
            <span>RBAC Store</span>
          </div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Choose your account type and get started in seconds</p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Full Name Input */}
          <div className="form-group">
            <label className="form-label" htmlFor="name-input">
              Full Name
            </label>
            <div className="input-wrapper">
              <span className="input-icon">
                <User size={18} />
              </span>
              <input
                id="name-input"
                type="text"
                className="form-input"
                placeholder="Alex Morgan"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError(null);
                }}
                required
              />
            </div>
          </div>

          {/* Email Input */}
          <div className="form-group">
            <label className="form-label" htmlFor="email-input">
              Email Address
            </label>
            <div className="input-wrapper">
              <span className="input-icon">
                <Mail size={18} />
              </span>
              <input
                id="email-input"
                type="email"
                className="form-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                required
                autoComplete="email"
              />
            </div>
          </div>

          {/* Role Selector Segmented Control (Buyer / Seller only) */}
          <div className="form-group">
            <label className="form-label">I am a:</label>
            <div className="role-segmented-container" role="radiogroup" aria-label="Select role">
              <button
                type="button"
                className={`role-segment-btn ${role === 'user' ? 'active' : ''}`}
                onClick={() => setRole('user')}
                role="radio"
                aria-checked={role === 'user'}
              >
                <ShoppingBag size={16} />
                <span>Buyer</span>
              </button>

              <button
                type="button"
                className={`role-segment-btn ${role === 'sales_person' ? 'active' : ''}`}
                onClick={() => setRole('sales_person')}
                role="radio"
                aria-checked={role === 'sales_person'}
              >
                <Store size={16} />
                <span>Seller</span>
              </button>
            </div>
          </div>

          {/* Conditional Business/Shop Name Input for Seller */}
          {role === 'sales_person' && (
            <div className="form-group">
              <label className="form-label" htmlFor="business-name-input">
                Business / Shop Name <span style={{ color: 'var(--accent-pink)', marginLeft: '2px' }}>*</span>
              </label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <Store size={18} />
                </span>
                <input
                  id="business-name-input"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Apex Tech Store"
                  value={businessName}
                  onChange={(e) => {
                    setBusinessName(e.target.value);
                    if (error) setError(null);
                  }}
                  required
                />
              </div>
            </div>
          )}

          {/* Password Input */}
          <div className="form-group">
            <label className="form-label" htmlFor="password-input">
              Password
            </label>
            <div className="input-wrapper">
              <span className="input-icon">
                <Lock size={18} />
              </span>
              <input
                id="password-input"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="form-group">
            <label className="form-label" htmlFor="confirm-password-input">
              Confirm Password
            </label>
            <div className="input-wrapper">
              <span className="input-icon">
                <Lock size={18} />
              </span>
              <input
                id="confirm-password-input"
                type={showConfirmPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (error) setError(null);
                }}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Error Message Container */}
          {error && (
            <div className="error-alert" role="alert">
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? (
              <span>Creating account...</span>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Card Footer Link */}
        <div className="auth-footer">
          <span>Already have an account?</span>
          <Link href="/login" className="auth-link">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
