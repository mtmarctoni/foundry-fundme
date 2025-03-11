import { useState } from 'react'

import TopBar from './components/TopBar.tsx'
import { useContract } from './hooks/useContract.ts'
import { useMetaMask } from './hooks/useMetamask.ts'
import { FundMe as CONTRACT_ADDRESS } from './config/contract-address.json'

function App() {
  const [amount, setAmount] = useState('')
  const [usdAmount, setUsdAmount] = useState('')
  const { account, error: walletError, isConnecting, provider, network, connect } = useMetaMask()
  const { fundContract, ethPrice, getConversionRate, convertUsdToEth, error: contractError, isLoading } = useContract(provider)


  const handleFund = async () => {
    if (!account) {
      await connect()
      return
    }
    await fundContract(amount)
  }

  const handleAmountChange = (value: string) => {
    setAmount(value)
    const ethAmount = parseFloat(value) || 0
    setUsdAmount(getConversionRate(ethAmount).toFixed(2))
  }

  const handleUsdAmountChange = (value: string) => {
    setUsdAmount(value)
    const usdAmount = parseFloat(value) || 0
    setAmount(convertUsdToEth(usdAmount).toFixed(6))
  }

  return (
    <div className="min-h-screen bg-mesh dark:bg-gray-900 transition-all duration-500 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-accent-500/20 dark:from-primary-900/30 dark:to-accent-900/30 backdrop-blur-3xl"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float dark:bg-accent-900"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float animation-delay-2000 dark:bg-primary-900"></div>

      <div className="max-w-3xl mx-auto relative">
        {/* Dark Mode and Wallet Connect*/}
        <TopBar
          account={account}
          network={network}
          isConnecting={isConnecting}
          connect={connect}
        />

        <div className="backdrop-blur-lg bg-gray-600/20 dark:bg-gray-800/50 rounded-3xl shadow-2xl overflow-hidden border border-white/20 dark:border-gray-700/50">
          {/* Header */}
          <div className="px-6 py-12 bg-gradient-to-r from-primary-500 to-accent-500 dark:from-primary-700 dark:to-accent-700 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/10 bg-grid animate-gradient"></div>
            <h1 className="text-5xl font-bold text-white text-center mb-4 mt-8 relative z-10 animate-float">
              FundMe Smart Contract
            </h1>
            <p className="mt-2 text-white/90 text-center text-xl relative z-10">
              Secure, transparent, and efficient crowdfunding on the blockchain
            </p>
            {ethPrice > 0 && (
              <div>
              <p className="mt-4 text-white/80 text-center text-lg relative z-10">
                Current ETH Price: ${ethPrice.toFixed(2)}
              </p>
                </div>
            )}
          </div>

          {/* Main Content */}
          <div className="px-8 py-10 backdrop-blur-lg relative z-10">
            {/* Error Messages */}
            {(walletError || contractError) && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500">
                {walletError || contractError}
              </div>
            )}

            {/* Funding Section */}
            <div className="space-y-6">
              <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 dark:border-gray-700/50">
                <label htmlFor="amount" className="block text-lg font-medium text-white dark:text-white/90">
                  Amount to Fund (ETH)
                </label>
                <div className="mt-2 relative rounded-xl shadow-sm">
                  <input
                    type="number"
                    name="amount"
                    id="amount"
                    className="block w-full px-4 py-4 bg-white/5 border-white/10 rounded-xl focus:ring-accent-500 focus:border-accent-500 text-white placeholder-white/50 text-lg transition-all duration-200"
                    placeholder="0.0"
                    value={amount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <span className="text-white/70 text-lg">ETH</span>
                  </div>
                </div>
                <div>
                    <label htmlFor="usd-amount" className="block text-lg font-medium text-white dark:text-white/90">
                      Amount in USD
                    </label>
                    <div className="mt-2 relative rounded-xl shadow-sm">
                      <input
                        type="number"
                        id="usd-amount"
                        className="block w-full px-4 py-4 bg-white/5 border-white/10 rounded-xl focus:ring-accent-500 focus:border-accent-500 text-white placeholder-white/50 text-lg transition-all duration-200"
                        placeholder="0.00"
                        value={usdAmount}
                        onChange={(e) => handleUsdAmountChange(e.target.value)}
                      />
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <span className="text-white/70 text-lg">USD</span>
                      </div>
                    </div>
                  </div>
                <p className="mt-3 text-white/70 text-base">
                  Minimum contribution: 5 USD
                </p>
              </div>

              <button
                onClick={handleFund}
                disabled={isLoading || parseFloat(usdAmount) < 5}
                className={`w-full flex justify-center py-4 px-6 rounded-xl text-lg font-medium text-white transform hover:-translate-y-1 transition-all duration-200
                  ${(isLoading || parseFloat(usdAmount) < 5)
                    ? 'bg-gradient-to-r from-primary-400/50 to-accent-400/50 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 shadow-lg hover:shadow-xl'
                  }`}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div>
                ) : parseFloat(usdAmount) < 5 ? 'Minimum 5 USD required' : account ? 'Fund Contract' : 'Connect Wallet'}
              </button>
            </div>

            {/* Contract Info */}
            <div className="mt-12 border-t border-white/10 pt-8">
              <h2 className="text-2xl font-bold text-white dark:text-white/90">Contract Details</h2>
              <dl className="mt-6 space-y-4">
                <div className="flex justify-between items-center p-4 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10">
                  <dt className="text-lg text-white/70">Contract Address</dt>
                  <dd className="text-lg text-white font-mono">{CONTRACT_ADDRESS}</dd>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10">
                  <dt className="text-lg text-white/70">Author</dt>
                  <dd className="text-lg text-white">mtmarctoni</dd>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10">
                  <dt className="text-lg text-white/70">Price Feed</dt>
                  <dd className="text-lg text-white">Chainlink ETH/USD</dd>
                </div>
              </dl>
            </div>

            {/* Features */}
            <div className="mt-12 border-t border-white/10 pt-8">
              <h2 className="text-2xl font-bold text-white dark:text-white/90">Features</h2>
              <ul className="mt-6 grid gap-4">
                <li className="flex items-start p-6 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 transform hover:scale-[1.02] transition-all duration-200">
                  <div className="flex-shrink-0">
                    <svg className="h-8 w-8 text-accent-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-4 text-lg text-white/90">
                    Automatic ETH/USD price conversion using Chainlink Oracle
                  </p>
                </li>
                <li className="flex items-start p-6 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 transform hover:scale-[1.02] transition-all duration-200">
                  <div className="flex-shrink-0">
                    <svg className="h-8 w-8 text-accent-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-4 text-lg text-white/90">
                    Secure owner-only withdrawal function with optimized gas usage
                  </p>
                </li>
                <li className="flex items-start p-6 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 transform hover:scale-[1.02] transition-all duration-200">
                  <div className="flex-shrink-0">
                    <svg className="h-8 w-8 text-accent-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-4 text-lg text-white/90">
                    Gas-optimized operations with efficient storage management
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App;