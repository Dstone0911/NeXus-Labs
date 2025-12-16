import React, { useState } from 'react';
import { Token, BridgeResult } from '../types';
import { transmuteTokens } from '../services/alchemyService';
import { Loader2, ArrowRight, Zap, AlertTriangle } from 'lucide-react';

interface BridgeConsoleProps {
  onBridgeComplete: (result: BridgeResult, inputToken: Token, inputAmount: number) => void;
  wallet: Record<string, number>;
}

const BridgeConsole: React.FC<BridgeConsoleProps> = ({ onBridgeComplete, wallet }) => {
  const [selectedToken, setSelectedToken] = useState<Token>(Token.SEPOLIA_ETH);
  const [amount, setAmount] = useState<string>('1');
  const [isLoading, setIsLoading] = useState(false);

  const handleTransmute = async () => {
    if (isLoading) return;
    
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;
    if (wallet[selectedToken] < numAmount) {
        alert("Insufficient testnet balance!");
        return;
    }

    setIsLoading(true);
    try {
      const result = await transmuteTokens(selectedToken, numAmount);
      onBridgeComplete(result, selectedToken, numAmount);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-void border border-mystic/30 rounded-xl p-6 shadow-2xl shadow-mystic/10 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-mystic to-transparent opacity-50"></div>
      
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-mystic to-cyan-400">
          Dark Matter Bridge
        </h2>
        <p className="text-xs text-gray-500 mt-2 font-mono uppercase tracking-widest">
          Transmuting Testnet Dust to Mainnet Dreams
        </p>
      </div>

      <div className="space-y-6">
        {/* From Section */}
        <div className="bg-black/40 p-4 rounded-lg border border-gray-800">
          <label className="text-xs text-gray-400 mb-2 block font-mono">FROM (TESTNET)</label>
          <div className="flex gap-4 items-center">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-transparent text-3xl font-bold text-white w-full focus:outline-none"
              placeholder="0.0"
            />
            <select
              value={selectedToken}
              onChange={(e) => setSelectedToken(e.target.value as Token)}
              className="bg-gray-900 border border-gray-700 text-gray-300 text-sm rounded-lg focus:ring-mystic focus:border-mystic block p-2.5"
            >
              {Object.values(Token).map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="text-right text-xs text-gray-500 mt-2">
            Balance: {wallet[selectedToken].toFixed(4)}
          </div>
        </div>

        {/* Direction Indicator */}
        <div className="flex justify-center -my-3 relative z-10">
          <div className="bg-gray-900 rounded-full p-2 border border-gray-700 text-mystic animate-pulse">
            <ArrowRight size={20} className="rotate-90 md:rotate-0" />
          </div>
        </div>

        {/* To Section */}
        <div className="bg-black/40 p-4 rounded-lg border border-gray-800 relative group">
          <label className="text-xs text-gray-400 mb-2 block font-mono">TO (ALCHEMICAL MAINNET)</label>
          <div className="flex gap-4 items-center justify-between">
            <div className="text-3xl font-bold text-gray-500 blur-[2px] group-hover:blur-0 transition-all duration-500">
              ???
            </div>
            <div className="flex items-center gap-2 bg-gold/10 text-gold px-3 py-1 rounded-full border border-gold/20">
               <Zap size={14} />
               <span className="font-mono text-sm font-bold">GOLD</span>
            </div>
          </div>
           <div className="text-right text-xs text-gray-500 mt-2">
            Protocol: Gemini Oracle v2.5
          </div>
        </div>

        <button
          onClick={handleTransmute}
          disabled={isLoading}
          className={`w-full py-4 rounded-lg font-bold text-lg tracking-wider transition-all duration-300 ${
            isLoading 
              ? 'bg-gray-800 cursor-not-allowed text-gray-500' 
              : 'bg-gradient-to-r from-mystic to-indigo-600 hover:from-indigo-600 hover:to-mystic text-white shadow-lg hover:shadow-mystic/50'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin" />
              TRANSMUTING...
            </span>
          ) : (
            "INITIATE BRIDGE"
          )}
        </button>

        <div className="flex items-start gap-2 bg-red-900/10 border border-red-900/30 p-3 rounded text-xs text-red-400/80">
            <AlertTriangle size={14} className="mt-0.5 shrink-0" />
            <p>Warning: This is a simulation. Real testnet tokens have no value. We are generating 'value' through AI hallucination. Do not attempt to use Alchemical Gold for groceries.</p>
        </div>
      </div>
    </div>
  );
};

export default BridgeConsole;
