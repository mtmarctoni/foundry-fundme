import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

import { FundMe as CONTRACT_ADDRESS } from '../config/contract-address.json'
import { abi as CONTRACT_ABI } from '../config/FundMe.json'
import {type Provider} from '../types/types'

export function useContract(provider: Provider) {
    const [error, setError] = useState<string>('')
    const [isLoading, setIsLoading] = useState(false)
    const [ethPrice, setEthPrice] = useState<number>(0)

    useEffect(() => {
        if (provider) {
          getPrice()
          const interval = setInterval(getPrice, 30000) // Update price every 30 seconds
          return () => clearInterval(interval)
        }
      }, [provider])
  
    const getPrice = async () => {
      if (!provider) return 0
      
      try {
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)
          const priceFeed = await contract.getPriceFeed()
          
        const aggregator = new ethers.Contract(
          priceFeed,
          [
            'function latestRoundData() external view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)'
          ],
          provider
        )
        
        const { answer } = await aggregator.latestRoundData()
        // Convert to 18 decimals like in the Solidity code
        const priceInWei = BigInt(answer) * BigInt(10000000000)
        // Convert to a regular number for display
        const price = Number(ethers.formatUnits(priceInWei, 18))
        setEthPrice(price)
        return price
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
          if (String(err.message).includes('not decode result data')) {
              setError('Contract not deploy yet in this network');
              console.error(
                  'Contract not deploy yet in this network'
              );
              
          }
        console.error('Error fetching ETH price:', err)
        return 0
      }
    }
  
    const getConversionRate = (ethAmount: number) => {
      if (!ethPrice || ethPrice === 0) return 0
      // Convert ETH amount to Wei
      const ethAmountInWei = ethers.parseEther(ethAmount.toString())
      // Multiply by price and divide by 1e18 (same as Solidity)
      const ethPriceInWei = ethers.parseEther(ethPrice.toString())
      const usdAmount = (ethAmountInWei * ethPriceInWei) / BigInt(1e18)
      // Convert back to regular number
      return Number(ethers.formatEther(usdAmount))
    }
  
    const convertUsdToEth = (usdAmount: number) => {
      if (!ethPrice || ethPrice === 0) return 0
      return usdAmount / ethPrice
    }
  
    const fundContract = async (amount: string) => {
      if (!provider) {
        setError('Please connect your wallet first')
        return
      }
  
      try {
        setIsLoading(true)
        const signer = await provider.getSigner()
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
        
        const tx = await contract.fund({
          value: ethers.parseEther(amount),
        })
        
        await tx.wait()
        setError('')
        return true
      } catch (err) {
        console.error(err)
        setError('Transaction failed')
        return false
      } finally {
        setIsLoading(false)
      }
    }
  
    return { 
      fundContract, 
      error, 
      isLoading, 
      getPrice, 
      getConversionRate,
      convertUsdToEth, 
      ethPrice 
    }
  }