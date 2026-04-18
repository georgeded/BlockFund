'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  publicKey: string | null;
  balance: number | null;
  login: (publicKey: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  publicKey: null,
  balance: null,
  login: async () => ({ success: false }),
  logout: () => {},
});

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
const ETHERSCAN_KEY = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY || '';
const CONTRACT = process.env.NEXT_PUBLIC_BF_CONTRACT_ADDRESS || '';
const TOKEN_DECIMALS = 18;

async function fetchBalance(key: string): Promise<number | null> {
  try {
    const url = `https://api-sepolia.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${CONTRACT}&address=${key}&tag=latest&apikey=${ETHERSCAN_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.status === '1') {
      return parseInt(data.result, 10) / Math.pow(10, TOKEN_DECIMALS);
    }
    return null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('isLoggedIn') === 'true';
    const storedKey = localStorage.getItem('publicKey');
    if (stored && storedKey) {
      fetchBalance(storedKey).then((bal) => {
        if (bal !== null && bal > 0) {
          setIsLoggedIn(true);
          setPublicKey(storedKey);
          setBalance(bal);
        } else {
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('publicKey');
        }
      });
    }
  }, []);

  async function login(key: string, password: string) {
    try {
      const res = await fetch(`${BACKEND_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicKey: key, password }),
      });
      const data = await res.json();
      if (!data.success) {
        return { success: false, error: data.error || 'Incorrect public key or password' };
      }

      const bal = await fetchBalance(key);
      if (bal === null) {
        return { success: false, error: 'Failed to fetch token balance' };
      }
      if (bal <= 0) {
        return { success: false, error: 'This address does not hold any BlockFund tokens' };
      }

      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('publicKey', key);
      setIsLoggedIn(true);
      setPublicKey(key);
      setBalance(bal);
      return { success: true };
    } catch {
      return { success: false, error: 'Error connecting to server' };
    }
  }

  function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('publicKey');
    setIsLoggedIn(false);
    setPublicKey(null);
    setBalance(null);
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, publicKey, balance, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
