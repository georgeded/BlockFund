'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import BFLogo from '@/components/BFLogo';

const CONTRACT = process.env.NEXT_PUBLIC_BF_CONTRACT_ADDRESS || '';
const ETHERSCAN_KEY = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY || '';

async function fetchTxCount(): Promise<number | null> {
  try {
    const url = `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${CONTRACT}&startblock=0&endblock=99999999&sort=asc&apikey=${ETHERSCAN_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.status === '1') return data.result.length;
    return null;
  } catch {
    return null;
  }
}

export default function HomePage() {
  const [txCount, setTxCount] = useState<number | null>(null);

  useEffect(() => {
    fetchTxCount().then(setTxCount);
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-24 overflow-hidden">
        <div
          className="absolute inset-0 -z-10 opacity-20"
          style={{
            backgroundImage: 'url(/images/blockchain_purple_background.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <BFLogo className="w-24 h-24 mb-6" style={{ color: 'var(--text-color)' }} />
        <h1 className="text-4xl md:text-6xl font-bold mb-4" style={{ color: 'var(--text-color)' }}>
          BlockFund
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mb-8" style={{ color: 'var(--text-lighter)' }}>
          A community-driven ERC-20 token on the Sepolia testnet — learn, participate, and grow together in DeFi.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/learn" className="btn-pill">
            Learn More
          </Link>
          <Link href="/use" className="btn-primary">
            Get BF Tokens
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="w-full py-12 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { label: 'Total BF Supply', value: '1,000,000' },
            { label: 'Transactions', value: txCount !== null ? txCount.toLocaleString() : '—' },
            { label: 'BF in DeFi', value: '1,000' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl p-6 text-center shadow-md"
              style={{
                background: 'var(--modal-bg)',
                border: '2px solid var(--text-color)',
                boxShadow: 'var(--box-shadow)',
              }}
            >
              <p className="text-3xl font-bold mb-2" style={{ color: 'var(--text-color)' }}>
                {stat.value}
              </p>
              <p className="text-sm" style={{ color: 'var(--text-lighter)' }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Get Started */}
      <section className="w-full py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10" style={{ color: 'var(--text-color)' }}>
            Get Started
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link
              href="/learn#secondDiv"
              className="group rounded-2xl p-8 flex flex-col gap-4 transition-transform duration-300 hover:scale-105"
              style={{
                background: 'var(--modal-bg)',
                border: '2px solid var(--text-color)',
                boxShadow: 'var(--box-shadow)',
              }}
            >
              <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: 'var(--button-bg)' }}>
                <Image src="/images/cube_metaverse_icon.png" alt="Holder Benefits" width={32} height={32} />
              </div>
              <h3 className="text-xl font-semibold" style={{ color: 'var(--text-color)' }}>
                Holder Benefits
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-lighter)' }}>
                Discover the exclusive benefits of holding BF tokens — from community access to DeFi rewards.
              </p>
              <span className="text-sm font-medium mt-auto" style={{ color: 'var(--button-bg)' }}>
                Learn more →
              </span>
            </Link>

            <Link
              href="/learn#thirdDiv"
              className="group rounded-2xl p-8 flex flex-col gap-4 transition-transform duration-300 hover:scale-105"
              style={{
                background: 'var(--modal-bg)',
                border: '2px solid var(--text-color)',
                boxShadow: 'var(--box-shadow)',
              }}
            >
              <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: 'var(--button-bg)' }}>
                <Image src="/images/coin_stack_image.png" alt="Get BF" width={32} height={32} />
              </div>
              <h3 className="text-xl font-semibold" style={{ color: 'var(--text-color)' }}>
                Get BF Tokens
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-lighter)' }}>
                Learn how to acquire BF tokens on Uniswap using Sepolia ETH and start participating today.
              </p>
              <span className="text-sm font-medium mt-auto" style={{ color: 'var(--button-bg)' }}>
                Get started →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Hero image strip */}
      <section className="w-full">
        <div className="relative w-full" style={{ height: '280px' }}>
          <Image
            src="/images/blockfund_landscape_image.jpg"
            alt="BlockFund landscape"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
          <div
            className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6"
            style={{ background: 'rgba(0,0,0,0.5)' }}
          >
            <h2 className="text-3xl font-bold mb-3">Join the Community</h2>
            <p className="text-base max-w-xl mb-6 opacity-90">
              Register, engage in the holder chat, vote on proposals, and shape the future of BlockFund.
            </p>
            <Link href="/participate" className="btn-pill">
              Participate Now
            </Link>
          </div>
        </div>
      </section>

      {/* Shape divider */}
      <div className="w-full overflow-hidden leading-none" style={{ lineHeight: 0 }}>
        <svg viewBox="0 0 1200 80" preserveAspectRatio="none" className="w-full" style={{ height: '60px' }}>
          <path d="M0,0 C300,80 900,0 1200,60 L1200,80 L0,80 Z" className="shape-fill" />
        </svg>
      </div>
    </>
  );
}
