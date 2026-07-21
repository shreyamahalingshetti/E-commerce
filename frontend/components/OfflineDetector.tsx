'use client';

import React, { useState, useEffect } from 'react';
import { WifiOff, SignalLow, RefreshCw, X } from 'lucide-react';

export default function OfflineDetector() {
  const [isOffline, setIsOffline] = useState(false);
  const [isSlowConnection, setIsSlowConnection] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Initial check
    if (typeof window !== 'undefined') {
      setIsOffline(!navigator.onLine);

      const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      if (conn) {
        const checkConnectionSpeed = () => {
          if (conn.effectiveType === '2g' || conn.effectiveType === 'slow-2g' || conn.saveData) {
            setIsSlowConnection(true);
          } else {
            setIsSlowConnection(false);
          }
        };
        checkConnectionSpeed();
        conn.addEventListener?.('change', checkConnectionSpeed);
      }
    }

    const handleOnline = () => {
      setIsOffline(false);
      setDismissed(false);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setDismissed(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (dismissed || (!isOffline && !isSlowConnection)) {
    return null;
  }

  return (
    <div
      style={{
        width: '100%',
        backgroundColor: isOffline ? '#ef4444' : '#f59e0b',
        color: '#ffffff',
        padding: '0.6rem 1.2rem',
        fontSize: '0.875rem',
        fontWeight: 500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 9999,
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15)',
        transition: 'all 0.3s ease'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        {isOffline ? <WifiOff size={18} /> : <SignalLow size={18} />}
        <span>
          {isOffline
            ? 'You are currently offline. Check your internet connection.'
            : 'Slow network detected (2G/High latency). Retrying requests automatically.'}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
        {isOffline && (
          <button
            onClick={() => window.location.reload()}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '4px',
              color: '#fff',
              padding: '0.2rem 0.6rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.8rem'
            }}
          >
            <RefreshCw size={14} /> Retry
          </button>
        )}
        <button
          onClick={() => setDismissed(true)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            padding: '2px',
            display: 'flex',
            alignItems: 'center'
          }}
          aria-label="Dismiss network warning"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
