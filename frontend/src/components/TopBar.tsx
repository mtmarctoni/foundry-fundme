import { useEffect, useState } from 'react';

import { type Account } from '../types/types';

interface Props {
    account: Account;
    network: string;
    connect: () => void;
    isConnecting: boolean;
};

const TopBar = ({ account, network, connect, isConnecting }: Props) => {
    const [isDark, setIsDark] = useState<boolean>(false);

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [isDark])

    const formatAddress = (address: Account) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`
    }
    
    return (
        <div className="">

        <div className="absolute top-4 right-4 z-10 flex items-center space-x-4">
            <div className="flex space-x-10 items-center p-2 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10">
                <dd className="text-lg text-white font-mono">Network</dd>
                <dt className="text-lg text-white/70">{network}</dt>
            </div>
            <button
                onClick={connect}
                disabled={isConnecting}
                className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-lg shadow-lg hover:shadow-xl transition-all duration-200 border border-white/20 text-white font-medium"
            >
                {isConnecting ? 'Connecting...' : account ? formatAddress(account) : 'Connect Wallet'}
            </button>
            <button
                onClick={() => setIsDark(!isDark)}
                className="p-3 rounded-full bg-white/10 backdrop-blur-lg shadow-lg hover:shadow-xl transition-all duration-200 border border-white/20 group"
            >
                {isDark ? (
                    <svg className="w-6 h-6 text-yellow-300 group-hover:text-yellow-200 transition-colors duration-200" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                    </svg>
                ) : (
                    <svg className="w-6 h-6 text-primary-600 group-hover:text-primary-500 transition-colors duration-200" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                )}
            </button>
            </div>
        </div>
            
    );
};

export default TopBar;