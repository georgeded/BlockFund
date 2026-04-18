'use client';

import { useState } from 'react';
import Link from 'next/link';
import BFLogo from './BFLogo';

function ExternalModal({ href, label, onClose }: { href: string; label: string; onClose: () => void }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box p-8 text-center" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-color)' }}>
          Leave BlockFund?
        </h2>
        <p className="text-sm mb-6" style={{ color: 'var(--text-lighter)' }}>
          You are about to visit an external site:
          <br />
          <span className="font-mono text-xs">{href}</span>
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={onClose} className="btn-pill">
            Stay
          </button>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            onClick={onClose}
          >
            Visit {label}
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Footer() {
  const [modal, setModal] = useState<'linkedin' | 'github' | null>(null);

  const CONTRACT = process.env.NEXT_PUBLIC_BF_CONTRACT_ADDRESS || '';

  return (
    <>
      <footer
        className="w-full mt-auto"
        style={{
          background: 'var(--modal-bg)',
          borderTop: '2px solid var(--text-color)',
          color: 'var(--text-color)',
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <BFLogo className="w-8 h-8" style={{ color: 'var(--text-color)' }} />
              <span className="font-bold text-lg">BlockFund</span>
            </div>
            <p className="text-sm" style={{ color: 'var(--text-lighter)' }}>
              A community-driven ERC-20 token on the Sepolia testnet. Built for learning, built for the future.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-1" style={{ color: 'var(--text-lighter)' }}>
              Navigate
            </h4>
            {[
              { label: 'Home', href: '/' },
              { label: 'Learn', href: '/learn' },
              { label: 'Use', href: '/use' },
              { label: 'Participate', href: '/participate' },
              { label: 'News', href: '/news' },
              { label: 'Graphs', href: '/graphs' },
              { label: 'Chat', href: '/chat' },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm hover:underline"
                style={{ color: 'var(--text-color)' }}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-1" style={{ color: 'var(--text-lighter)' }}>
              Token Info
            </h4>
            <p className="text-xs font-mono break-all" style={{ color: 'var(--text-lighter)' }}>
              {CONTRACT}
            </p>
            <a
              href={`https://sepolia.etherscan.io/token/${CONTRACT}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:underline"
              style={{ color: 'var(--text-color)' }}
            >
              View on Etherscan ↗
            </a>
            <a
              href="https://app.uniswap.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:underline"
              style={{ color: 'var(--text-color)' }}
            >
              Trade on Uniswap ↗
            </a>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-1" style={{ color: 'var(--text-lighter)' }}>
              Connect
            </h4>
            <button
              onClick={() => setModal('linkedin')}
              className="text-sm text-left hover:underline"
              style={{ color: 'var(--text-color)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              LinkedIn ↗
            </button>
            <button
              onClick={() => setModal('github')}
              className="text-sm text-left hover:underline"
              style={{ color: 'var(--text-color)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              GitHub ↗
            </button>
            <Link href="/register" className="text-sm hover:underline" style={{ color: 'var(--text-color)' }}>
              Register
            </Link>
          </div>
        </div>

        <div
          className="text-center text-xs py-4"
          style={{ borderTop: '1px solid var(--text-lighter)', color: 'var(--text-lighter)' }}
        >
          © {new Date().getFullYear()} BlockFund. All rights reserved. For educational purposes only.
        </div>
      </footer>

      {modal === 'linkedin' && (
        <ExternalModal
          href="https://www.linkedin.com/in/georgios-dedebilis/"
          label="LinkedIn"
          onClose={() => setModal(null)}
        />
      )}
      {modal === 'github' && (
        <ExternalModal
          href="https://github.com/gdede"
          label="GitHub"
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}
