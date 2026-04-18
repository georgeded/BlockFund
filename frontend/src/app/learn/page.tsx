import Image from 'next/image';

export const metadata = { title: 'Learn – BlockFund' };

const CONTRACT = process.env.NEXT_PUBLIC_BF_CONTRACT_ADDRESS || '';

export default function LearnPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 flex flex-col gap-20">
      {/* Section 1 – What is BlockFund */}
      <section id="firstDiv" className="flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-color)' }}>
            What is BlockFund?
          </h1>
          <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--text-lighter)' }}>
            BlockFund (BF) is a community-driven ERC-20 token deployed on the Ethereum Sepolia testnet. It is designed
            to demonstrate decentralised governance, DeFi participation, and token economics in a safe, zero-cost
            environment using test ETH.
          </p>
          <p className="text-base leading-relaxed" style={{ color: 'var(--text-lighter)' }}>
            The contract address is{' '}
            <a
              href={`https://sepolia.etherscan.io/token/${CONTRACT}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm underline"
              style={{ color: 'var(--button-bg)' }}
            >
              {CONTRACT}
            </a>
            . With a fixed supply of 1,000,000 BF, every token holder has a voice.
          </p>
        </div>
        <div className="flex-shrink-0">
          <Image
            src="/images/blockchain_web3_image.png"
            alt="Blockchain Web3"
            width={280}
            height={280}
            className="rounded-2xl"
          />
        </div>
      </section>

      {/* Section 2 – Holder Benefits */}
      <section id="secondDiv" className="flex flex-col md:flex-row-reverse items-center gap-10">
        <div className="flex-1">
          <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-color)' }}>
            Holder Benefits
          </h2>
          <ul className="flex flex-col gap-3 text-base" style={{ color: 'var(--text-lighter)' }}>
            {[
              'Exclusive access to the BlockFund live chat room',
              'Real-time price and market data via the Graphs dashboard',
              'Curated crypto news feed updated every 60 seconds',
              'Governance participation — vote on proposals and community decisions',
              'Early access to future BlockFund initiatives and airdrops',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 text-lg" style={{ color: 'var(--button-bg)' }}>✦</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-shrink-0">
          <Image
            src="/images/coin_stack_image.png"
            alt="Coin stack"
            width={240}
            height={240}
            className="rounded-2xl"
          />
        </div>
      </section>

      {/* Section 3 – How to get BF */}
      <section id="thirdDiv" className="flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1">
          <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-color)' }}>
            How to Get BF Tokens
          </h2>
          <ol className="flex flex-col gap-4 text-base" style={{ color: 'var(--text-lighter)' }}>
            {[
              'Install MetaMask and add the Sepolia testnet.',
              'Get free Sepolia ETH from a public faucet (e.g. sepoliafaucet.com).',
              'Visit the Use page for a step-by-step swap guide on Uniswap.',
              'Import the BF token contract into MetaMask to see your balance.',
              'Register on BlockFund and sign in to access holder-only features.',
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-4">
                <span
                  className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  style={{ background: 'var(--button-bg)' }}
                >
                  {i + 1}
                </span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="flex-shrink-0">
          <Image
            src="/images/bank_image.png"
            alt="Bank"
            width={240}
            height={240}
            className="rounded-2xl"
          />
        </div>
      </section>
    </div>
  );
}
