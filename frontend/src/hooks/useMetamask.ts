import { useState, useEffect } from 'react'
import { ethers } from 'ethers'

import { type Provider, type Account } from '../types/types'

export function useMetaMask() {
  const [account, setAccount] = useState<Account>('')
  const [error, setError] = useState<string>('')
  const [isConnecting, setIsConnecting] = useState(false)
    const [provider, setProvider] = useState<Provider>(null)
    const [network, setNetwork] = useState<string>('')

  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum)
        setProvider(provider)
        // set network
        provider.getNetwork().then((network) => {
            if (network && Number(network.chainId) === 31337) {
                setNetwork('Local Network: anvil-hardhat')
            } else {
                setNetwork(network.name)
                console.log(network);
            }
            
        })
        
        
        window.ethereum.on('accountsChanged', (accounts: Account[]) => {
            if (accounts.length > 0) {
          setAccount(accounts[0])
        } else {
            setAccount('')
        }
    })
    
    window.ethereum.on('chainChanged', () => {
        window.location.reload()
          
      })
    }
  }, [])

  const connect = async () => {
    if (!window.ethereum) {
      setError('Please install MetaMask!')
      return
    }

    try {
      setIsConnecting(true)
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
      setAccount(accounts[0])
      setError('')
    } catch (err) {
      setError('Failed to connect to MetaMask')
      console.error(err)
    } finally {
      setIsConnecting(false)
    }
  }

    return {
        account,
        error,
        isConnecting,
        provider,
        network,
        connect
    }
}