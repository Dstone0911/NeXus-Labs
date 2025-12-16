import React, { useState, useEffect } from 'react';
import { Token, Transaction, BridgeResult, WalletState } from './types';
import BridgeConsole from './components/BridgeConsole';
import Portfolio from './components/Portfolio';
import Ledger from './components/Ledger';
import MarketTicker from './components/MarketTicker';
import StakingVault from './components/StakingVault';
import { Box, Coins, Terminal, Wifi, Wallet, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import { ethers } from 'ethers';

const App: React.FC = () => {
  // --- Wallet Connection State ---
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [networkName, setNetworkName] = useState<string>('');

  // --- DApp State ---
  // Default values are now zeroed out to prioritize real balances when connected
  const [wallet, setWallet] = useState<WalletState>({
    [Token.SEPOLIA_ETH]: 0,
    [Token.GOERLI_ETH]: 0,
    [Token.MUMBAI_MATIC]: 0,
    [Token.SOL_DEVNET]: 0, // Cannot fetch Solana balance via ethers
    [Token.BASE_SEPOLIA]: 0
  });

  const [alchemyGold, setAlchemyGold] = useState<number>(0);
  const [stakedGold, setStakedGold] = useState<number>(0);
  const [voidDust, setVoidDust] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Simulate Yield generation
  useEffect(() => {
      if (stakedGold <= 0) return;
      const interval = setInterval(() => {
          setVoidDust(prev => prev + (stakedGold * 0.01));
      }, 1000);
      return () => clearInterval(interval);
  }, [stakedGold]);

  const mapChainIdToToken = (chainId: bigint): Token | null => {
      // Chain IDs
      switch (Number(chainId)) {
          case 11155111: return Token.SEPOLIA_ETH;
          case 5: return Token.GOERLI_ETH;
          case 80001: return Token.MUMBAI_MATIC;
          case 84532: return Token.BASE_SEPOLIA;
          default: return null;
      }
  };

  const handleConnect = async () => {
      if (!window.ethereum) {
          alert("No crypto wallet found. Please install MetaMask.");
          return;
      }

      setIsConnecting(true);
      try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          
          // Request access
          await provider.send("eth_requestAccounts", []);
          
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          const network = await provider.getNetwork();
          
          setWalletAddress(`${address.substring(0, 6)}...${address.substring(address.length - 4)}`);
          setNetworkName(network.name);
          setIsConnected(true);

          // Fetch Balance for the connected chain
          const balanceWei = await provider.getBalance(address);
          const balanceEth = parseFloat(ethers.formatEther(balanceWei));

          const mappedToken = mapChainIdToToken(network.chainId);
          
          setWallet(prev => {
              const newState = { ...prev };
              if (mappedToken) {
                  newState[mappedToken] = balanceEth;
              } else {
                  console.warn("Connected to unsupported network for this demo:", network.name);
              }
              // We keep SOL_DEVNET as a simulation since we can't connect phantom easily here
              newState[Token.SOL_DEVNET] = 500; 
              return newState;
          });

          // Optional: Listen for chain changes
          window.ethereum.on('chainChanged', () => {
             window.location.reload();
          });
          
      } catch (error) {
          console.error("Connection Failed", error);
          alert("Failed to connect wallet.");
      } finally {
          setIsConnecting(false);
      }
  };

  const handleBridgeComplete = (result: BridgeResult, inputToken: Token, inputAmount: number) => {
    // Optimistically update UI
    setWallet(prev => ({
      ...prev,
      [inputToken]: Math.max(0, prev[inputToken] - inputAmount)
    }));

    if (result.success) {
      setAlchemyGold(prev => prev + result.yieldAmount);
    }

    const newTx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      inputToken,
      inputAmount,
      outputAmount: result.yieldAmount,
      story: result.story,
      type: result.transmutationType
    };

    setTransactions(prev => [newTx, ...prev]);
  };

  const handleStake = (amount: number) => {
      setAlchemyGold(prev => prev - amount);
      setStakedGold(prev => prev + amount);
      const newTx: Transaction = {
          id: Math.random().toString(36).substr(2, 9),
          timestamp: Date.now(),
          inputToken: "GOLD" as any,
          inputAmount: amount,
          outputAmount: 0,
          story: "Locked in the vault for eternity (or until unstake)",
          type: "STAKE_DEPOSIT"
      }
      setTransactions(prev => [newTx, ...prev]);
  };

  const handleUnstake = (amount: number) => {
      setStakedGold(0);
      setAlchemyGold(prev => prev + amount);
      setVoidDust(0);
       const newTx: Transaction = {
          id: Math.random().toString(36).substr(2, 9),
          timestamp: Date.now(),
          inputToken: "STAKED_GOLD" as any,
          inputAmount: amount,
          outputAmount: amount,
          story: "Escaped the vault with some pockets full of dust.",
          type: "STAKE_WITHDRAW"
      }
      setTransactions(prev => [newTx, ...prev]);
      alert(`You claimed ${voidDust.toFixed(2)} Void Dust! (It immediately disintegrated).`);
  };

  const handleFaucet = () => {
    alert("This is a live Mainnet app now. Use a real faucet (like Alchemy Sepolia Faucet) to get tokens!");
  };

  // --- Render Landing Page if not connected ---
  if (!isConnected) {
    return (
        <div className="min-h-screen bg-[#050505] text-slate-200 font-sans flex flex-col items-center justify-center relative overflow-hidden">
             {/* Background Effects */}
             <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
                  style={{ backgroundImage: 'radial-gradient(circle at center, #333 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
             </div>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-mystic/10 rounded-full blur-[100px] animate-pulse"></div>

             <div className="relative z-10 text-center max-w-2xl px-6">
                 <div className="inline-flex items-center justify-center p-4 bg-mystic/10 rounded-2xl border border-mystic/30 mb-8 shadow-lg shadow-mystic/20">
                    <Box size={48} className="text-mystic" />
                 </div>
                 <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500">
                     The Testnet Alchemist
                 </h1>
                 <p className="text-xl text-gray-400 mb-10 leading-relaxed">
                     The first autonomous DeFi protocol powered by Gemini AI. 
                     Bridge your <span className="text-emerald-400 font-bold">real testnet assets</span> into <span className="text-gold font-bold">Alchemical Gold</span>.
                 </p>
                 
                 <button 
                    onClick={handleConnect}
                    disabled={isConnecting}
                    className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-gradient-to-r from-mystic to-indigo-600 rounded-lg hover:from-indigo-600 hover:to-mystic hover:shadow-lg hover:shadow-mystic/50 disabled:opacity-70 disabled:cursor-wait"
                 >
                    {isConnecting ? (
                        <span className="flex items-center gap-2">
                            <Loader2 className="animate-spin" />
                            INITIALIZING WEB3...
                        </span>
                    ) : (
                        <span className="flex items-center gap-2 text-lg">
                            <Wallet size={20} />
                            CONNECT WALLET
                            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </span>
                    )}
                 </button>

                 <div className="mt-8 flex justify-center gap-6 text-xs text-gray-500 font-mono uppercase tracking-widest">
                     <span className="flex items-center gap-1"><ShieldCheck size={12} /> Non-Custodial</span>
                     <span className="flex items-center gap-1"><Terminal size={12} /> v3.0.0-rc1</span>
                 </div>
             </div>
        </div>
    )
  }

  // --- Render Main App ---
  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-mystic selection:text-white flex flex-col">
      <MarketTicker />
      
      {/* Background Grid */}
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      <nav className="relative z-10 border-b border-gray-800 bg-black/50 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-mystic/20 p-2 rounded-lg border border-mystic/50">
                <Box className="text-mystic" size={24} />
              </div>
              <div>
                <span className="font-bold text-xl tracking-tight text-white block">Alchemy.fi</span>
                <span className="text-[10px] text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Live Connection
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-green-900/20 border border-green-900/50 rounded text-xs text-green-400 font-mono">
                    <Wifi size={12} />
                    {networkName || 'Unknown Net'}
                </div>
                <button onClick={handleFaucet} className="text-xs text-gray-500 hover:text-white font-mono transition-colors">
                    [ FAUCET ]
                </button>
                <div className="flex items-center gap-2 bg-gray-900 px-4 py-1.5 rounded-full border border-gray-700 hover:border-gold/50 transition-colors cursor-pointer">
                    <Coins size={14} className="text-gold" />
                    <span className="font-mono font-bold text-gold">{alchemyGold.toFixed(2)} GOLD</span>
                </div>
                <div className="flex items-center gap-2 bg-mystic/10 px-3 py-1.5 rounded-lg border border-mystic/30 text-xs font-mono text-mystic">
                    <Wallet size={12} />
                    {walletAddress}
                </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <BridgeConsole 
                    onBridgeComplete={handleBridgeComplete} 
                    wallet={wallet}
                />
                <StakingVault 
                    balance={alchemyGold}
                    stakedAmount={stakedGold}
                    voidDust={voidDust}
                    onStake={handleStake}
                    onUnstake={handleUnstake}
                />
            </div>
            <Ledger transactions={transactions} />
          </div>

          <div className="lg:col-span-1 space-y-6">
             <div className="h-[300px]">
                <Portfolio wallet={wallet} alchemyGold={alchemyGold + stakedGold} />
             </div>
             
             <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4 text-gray-400">
                    <Terminal size={18} />
                    <span className="font-mono text-sm font-bold uppercase">System Logs</span>
                </div>
                <div className="font-mono text-xs space-y-2 text-gray-500 max-h-[150px] overflow-y-auto custom-scrollbar">
                    <p>> Initializing Alchemical Core...</p>
                    <p>> Connected to Gemini v2.5 Flash...</p>
                    <p className="text-green-500">> Oracle Online.</p>
                    <p className="text-emerald-500">> Wallet Connected: {walletAddress}</p>
                    {networkName && <p>> Network Detected: {networkName}</p>}
                    <p>> Syncing blocks... (99.9%)</p>
                    {transactions.length > 0 && <p className="text-blue-400">> New Block Mined: {transactions[0].id}</p>}
                </div>
             </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;