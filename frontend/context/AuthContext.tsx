'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../lib/api';
import { saveToken, getToken, removeToken } from '../lib/auth';
import { useRouter } from 'next/navigation';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: string;
  businessName?: string;
}

export interface AuthResult {
  success: boolean;
  user?: any;
  error?: string;
}

interface AuthContextType {
  user: any;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (
    dataOrName: string | RegisterPayload,
    email?: string,
    password?: string,
    role?: string,
    businessName?: string
  ) => Promise<AuthResult>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (token) {
      api.get('/auth/me')
        .then((res) => setUser(res.data))
        .catch(() => {
          removeToken();
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<AuthResult> => {
    try {
      const res = await api.post('/auth/login', { email, password });
      saveToken(res.data.token);
      setUser(res.data.user);
      return { success: true, user: res.data.user };
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message || 'Login failed. Invalid credentials.';
      return { success: false, error: errorMsg };
    }
  };

  const register = async (
    dataOrName: string | RegisterPayload,
    emailParam?: string,
    passwordParam?: string,
    roleParam: string = 'user',
    businessNameParam?: string
  ): Promise<AuthResult> => {
    let name: string, email: string, password: string, role: string, businessName: string | undefined;

    if (typeof dataOrName === 'string') {
      name = dataOrName;
      email = emailParam || '';
      password = passwordParam || '';
      role = roleParam || 'user';
      businessName = businessNameParam;
    } else {
      name = dataOrName.name;
      email = dataOrName.email;
      password = dataOrName.password;
      role = dataOrName.role || 'user';
      businessName = dataOrName.businessName;
    }

    const payload: any = { name, email, password, role };
    if (role === 'sales_person' && businessName) {
      payload.businessName = businessName;
      payload.business_name = businessName;
    }

    try {
      const res = await api.post('/auth/register', payload);
      saveToken(res.data.token);
      setUser(res.data.user);
      return { success: true, user: res.data.user };
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message || 'Registration failed. Please try again.';
      return { success: false, error: errorMsg };
    }
  };

  const logout = () => {
    removeToken();
    setUser(null);
    if (typeof window !== 'undefined') {
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
