import Carousel from '@/components/Carousel';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = { title: 'Use – BlockFund' };

const CONTRACT = process.env.NEXT_PUBLIC_BF_CONTRACT_ADDRESS || '';

export default function UsePage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16 flex flex-col gap-20">
      {/* Section 1 – Overview */}
      <section className="flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-color)' }}>
            Using BlockFund Tokens
          </h1>
          <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--text-lighter)' }}>
            BlockFund (BF) tokens operate on the Ethereum Sepolia testnet. You can acquire them by swapping test ETH on
            Uniswap, then use them to unlock holder-only features such as the live chat, news feed, and market charts.
          </p>
          <p className="text-base leading-relaxed" style={{ color: 'var(--text-lighter)' }}>
            Contract:{' '}
            <a
              href={`https://sepolia.etherscan.io/token/${CONTRACT}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs underline break-all"
              style={{ color: 'var(--button-bg)' }}
            >
              {CONTRACT}
            </a>
          </p>
        </div>
        <div className="flex-shrink-0">
          <Image
            src="/images/crypto_globe_image.png"
            alt="Crypto globe"
            width={260}
            height={260}
            className="rounded-2xl"
          />
        </div>
      </section>

      {/* Section 2 – 3D Carousel Swap Guide */}
      <section className="flex flex-col gap-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-color)' }}>
            Step-by-Step Swap Guide
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-lighter)' }}>
            Follow these steps to acquire BF tokens on Uniswap using Sepolia ETH.
          </p>
        </div>
        <Carousel />
        <div className="text-center">
          <a
            href={`https://app.uniswap.org/#/swap?outputCurrency=${CONTRACT}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pill inline-block"
          >
            Open Uniswap ↗
          </a>
        </div>
      </section>

      {/* Section 3 – Accordion / More info */}
      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold" style={{ color: 'var(--text-color)' }}>
          Frequently Asked Questions
        </h2>
        {[
          {
            q: 'Do I need real ETH?',
            a: 'No. BlockFund runs on the Sepolia testnet. You only need Sepolia ETH, which is free from public faucets.',
          },
          {
            q: 'Which wallet should I use?',
            a: 'MetaMask is recommended. Add Sepolia as a custom network and import the BF token contract address.',
          },
          {
            q: 'How do I register on BlockFund?',
            a: 'Visit the Register page, enter your Ethereum public key and a password. Once registered, sign in from any page.',
          },
          {
            q: 'What happens if I have zero BF tokens?',
            a: 'Holder-only pages (News, Graphs, Chat) will redirect you to the home page. You must hold at least some BF to access them.',
          },
        ].map((item) => (
          <details
            key={item.q}
            className="rounded-xl p-5 cursor-pointer"
            style={{
              background: 'var(--modal-bg)',
              border: '2px solid var(--text-color)',
              boxShadow: 'var(--box-shadow)',
            }}
          >
            <summary className="font-semibold text-base list-none flex justify-between items-center" style={{ color: 'var(--text-color)' }}>
              {item.q}
              <span className="text-xl" style={{ color: 'var(--text-lighter)' }}>+</span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-lighter)' }}>
              {item.a}
            </p>
          </details>
        ))}
      </section>

      {/* CTA */}
      <section className="text-center">
        <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-color)' }}>
          Ready to get started?
        </h2>
        <p className="text-sm mb-6" style={{ color: 'var(--text-lighter)' }}>
          Register your account and start exploring all BlockFund has to offer.
        </p>
        <Link href="/register" className="btn-pill">
          Register Now
        </Link>
      </section>
    </div>
  );
}
