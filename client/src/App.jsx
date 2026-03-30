import React, { useState } from 'react'
import axios from 'axios'
import { Wallet, Coins, Plus, List, ArrowRight, ShieldCheck } from 'lucide-react'
import ErrorBoundary from './components/error-boundary'
import { AppCrashPage, SectionCrashCard } from './components/error-fallbacks'

const API_BASE = 'http://localhost:5000/api'

function AppHeader({ address, onConnectWallet }) {
  return (
    <header className="mb-16 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-stellar-blue p-2">
          <Coins className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          Soro<span className="text-stellar-blue">Mint</span>
        </h1>
      </div>

      <button
        onClick={onConnectWallet}
        className="btn-primary flex items-center gap-2"
      >
        <Wallet size={18} />
        {address ? `${address.substring(0, 6)}...${address.slice(-4)}` : 'Connect Wallet'}
      </button>
    </header>
  )
}

function MintTokenPanel({
  address,
  formData,
  isMinting,
  onFormChange,
  onSubmit,
}) {
  return (
    <section className="lg:col-span-1">
      <div className="glass-card">
        <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold">
          <Plus size={20} className="text-stellar-blue" />
          Mint New Token
        </h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-400">Token Name</label>
            <input
              type="text"
              placeholder="e.g. My Stellar Asset"
              className="input-field w-full"
              value={formData.name}
              onChange={(event) => onFormChange({ name: event.target.value })}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-400">Symbol</label>
            <input
              type="text"
              placeholder="e.g. MSA"
              className="input-field w-full"
              value={formData.symbol}
              onChange={(event) => onFormChange({ symbol: event.target.value })}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-400">Decimals</label>
            <input
              type="number"
              className="input-field w-full"
              value={formData.decimals}
              onChange={(event) => onFormChange({ decimals: parseInt(event.target.value, 10) || 0 })}
              required
            />
          </div>
          <button
            type="submit"
            disabled={isMinting || !address}
            className="btn-primary mt-4 flex w-full items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isMinting ? 'Deploying...' : 'Mint Token'}
            {!isMinting && <ArrowRight size={18} />}
          </button>
        </form>
      </div>
    </section>
  )
}

function AssetsPanel({ address, tokens }) {
  return (
    <section className="lg:col-span-2">
      <div className="glass-card min-h-[400px]">
        <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold">
          <List size={20} className="text-stellar-blue" />
          My Assets
        </h2>

        {!address ? (
          <div className="flex h-64 flex-col items-center justify-center text-slate-500">
            <ShieldCheck size={48} className="mb-4 opacity-20" />
            <p>Connect your wallet to see your assets</p>
          </div>
        ) : tokens.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center text-slate-500">
            <p>No tokens minted yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 text-sm text-slate-400">
                  <th className="pb-4 font-medium">Name</th>
                  <th className="pb-4 font-medium">Symbol</th>
                  <th className="pb-4 font-medium">Contract ID</th>
                  <th className="pb-4 font-medium">Decimals</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {tokens.map((token, index) => (
                  <tr key={index} className="group transition-colors hover:bg-white/5">
                    <td className="py-4 font-medium">{token.name}</td>
                    <td className="py-4 text-slate-300">{token.symbol}</td>
                    <td className="max-w-[120px] truncate py-4 font-mono text-sm text-stellar-blue">
                      {token.contractId}
                    </td>
                    <td className="py-4 text-slate-400">{token.decimals}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}

const defaultAppComponents = {
  Header: AppHeader,
  MintPanel: MintTokenPanel,
  AssetsPanel,
}

function App({ components = defaultAppComponents }) {
  const Header = components.Header ?? defaultAppComponents.Header
  const MintPanel = components.MintPanel ?? defaultAppComponents.MintPanel
  const TokensPanel = components.AssetsPanel ?? defaultAppComponents.AssetsPanel

  const [address, setAddress] = useState('')
  const [tokens, setTokens] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    decimals: 7,
  })
  const [isMinting, setIsMinting] = useState(false)

  // Placeholder for Wallet Connection (Freighter/Albedo)
  const connectWallet = async () => {
    // In a real app, use @stellar/freighter-api
    const mockAddress = `GB...${Math.random().toString(36).substring(7).toUpperCase()}`
    setAddress(mockAddress)
    fetchTokens(mockAddress)
  }

  const fetchTokens = async (userAddress) => {
    try {
      const response = await axios.get(`${API_BASE}/tokens/${userAddress}`)
      const tokenList = response.data?.data ?? response.data ?? []
      setTokens(Array.isArray(tokenList) ? tokenList : [])
    } catch (err) {
      console.error('Error fetching tokens', err)
    }
  }

  const handleMint = async (e) => {
    e.preventDefault()
    if (!address) return alert('Connect wallet first');
    
    setIsMinting(true)
    try {
      // Logic for Minting:
      // 1. Sign transaction on client (Freighter)
      // 2. Submit to Soroban RPC
      // 3. Save metadata to server
      const mockContractId = `C${Math.random().toString(36).substring(2, 10).toUpperCase()}`
      
      const response = await axios.post(`${API_BASE}/tokens`, {
        ...formData,
        contractId: mockContractId,
        ownerPublicKey: address,
      })

      const createdToken = response.data?.data ?? response.data
      setTokens((currentTokens) => [...currentTokens, createdToken])
      setFormData({ name: '', symbol: '', decimals: 7 })
      alert('Token Minted Successfully!')
    } catch (err) {
      alert(`Minting failed: ${err.message}`)
    } finally {
      setIsMinting(false)
    }
  }

  const updateFormData = (updates) => {
    setFormData((currentData) => ({
      ...currentData,
      ...updates,
    }))
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <Header address={address} onConnectWallet={connectWallet} />

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <ErrorBoundary
          context={{ area: 'mint-panel' }}
          resetKeys={[address, formData.name, formData.symbol, formData.decimals, isMinting]}
          fallbackRender={({ resetErrorBoundary }) => (
            <SectionCrashCard
              className="lg:col-span-1"
              title="Mint form temporarily unavailable"
              description="The token creation panel hit an unexpected issue. You can retry this section without reloading the rest of the app."
              onRetry={resetErrorBoundary}
            />
          )}
        >
          <MintPanel
            address={address}
            formData={formData}
            isMinting={isMinting}
            onFormChange={updateFormData}
            onSubmit={handleMint}
          />
        </ErrorBoundary>

        <ErrorBoundary
          context={{ area: 'assets-panel' }}
          resetKeys={[address, tokens.length]}
          fallbackRender={({ resetErrorBoundary }) => (
            <SectionCrashCard
              className="lg:col-span-2"
              title="Asset list unavailable"
              description="The asset table crashed, but the rest of the dashboard is still running. Retry this section or refresh the page."
              onRetry={resetErrorBoundary}
            />
          )}
        >
          <TokensPanel address={address} tokens={tokens} />
        </ErrorBoundary>
      </main>
      
      <footer className="mt-16 pt-8 border-t border-white/5 text-center text-slate-500 text-sm">
        <p>&copy; 2026 SoroMint Platform. Built on Soroban.</p>
      </footer>
    </div>
  )
}

export function AppRoot(props) {
  return (
    <ErrorBoundary
      context={{ area: 'main-app' }}
      fallbackRender={() => <AppCrashPage />}
    >
      <App {...props} />
    </ErrorBoundary>
  )
}

export default App
