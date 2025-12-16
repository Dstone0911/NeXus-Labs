import React, { useState, useEffect } from 'react';
import { getStakingAPY } from '../services/alchemyService';
import { StakingInfo } from '../types';
import { Lock, Unlock, Sparkles, Loader2 } from 'lucide-react';

interface StakingVaultProps {
  balance: number;
  onStake: (amount: number) => void;
  onUnstake: (amount: number) => void;
  stakedAmount: number;
  voidDust: number;
}

const StakingVault: React.FC<StakingVaultProps> = ({ balance, onStake, onUnstake, stakedAmount, voidDust }) => {
  const [stakingInfo, setStakingInfo] = useState<StakingInfo | null>(null);
  const [inputAmount, setInputAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchAPY = async () => {
        const info = await getStakingAPY();
        setStakingInfo(info);
    };
    fetchAPY();
  }, []);

  const handleStake = async () => {
    const val = parseFloat(inputAmount);
    if (!val || val > balance) return;
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 1500)); // Fake delay
    onStake(val);
    setInputAmount('');
    setIsProcessing(false);
  };

  const handleUnstake = async () => {
      // Unstake all
      setIsProcessing(true);
      await new Promise(r => setTimeout(r, 1500));
      onUnstake(stakedAmount);
      setIsProcessing(false);
  }

  return (
    <div className="bg-void border border-emerald-900/30 rounded-xl p-6 relative overflow-hidden group">
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all"></div>
      
      <div className="flex justify-between items-start mb-6">
        <div>
            <h3 className="text-lg font-bold text-gray-200 font-mono flex items-center gap-2">
                <Lock size={18} className="text-emerald-500" />
                Staking Vault
            </h3>
            <p className="text-xs text-emerald-600/80 font-mono mt-1">MAINNET VALIDATOR NODE [ACTIVE]</p>
        </div>
        <div className="text-right">
            <div className="text-xs text-gray-500 font-mono">CURRENT APY</div>
            <div className="text-2xl font-bold text-emerald-400 font-mono">
                {stakingInfo ? `${stakingInfo.apy.toLocaleString()}%` : '---%'}
            </div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wide">
                {stakingInfo?.reason}
            </div>
        </div>
      </div>

      <div className="bg-black/40 rounded-lg p-4 border border-gray-800 mb-4">
          <div className="flex justify-between items-end mb-2">
              <span className="text-xs text-gray-400 font-mono">STAKED GOLD</span>
              <span className="text-xl font-bold text-white font-mono">{stakedAmount.toFixed(4)}</span>
          </div>
          <div className="flex justify-between items-end">
              <span className="text-xs text-gray-400 font-mono">EARNED VOID DUST</span>
              <span className="text-xl font-bold text-purple-400 font-mono flex items-center gap-2">
                  <Sparkles size={14} />
                  {voidDust.toFixed(2)}
              </span>
          </div>
      </div>

      <div className="space-y-3">
          <div className="flex gap-2">
              <input 
                type="number" 
                placeholder="Amount to Stake"
                value={inputAmount}
                onChange={(e) => setInputAmount(e.target.value)}
                className="bg-gray-900 border border-gray-700 text-white text-sm rounded-lg block w-full p-2.5 focus:ring-emerald-500 focus:border-emerald-500 font-mono"
              />
              <button 
                onClick={() => setInputAmount(balance.toString())}
                className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-mono px-3 rounded border border-gray-600"
              >
                  MAX
              </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button 
                onClick={handleStake}
                disabled={isProcessing || stakedAmount > 0} 
                className={`flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold font-mono uppercase tracking-wide transition-all ${stakedAmount > 0 ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-emerald-900/50 hover:bg-emerald-800 border border-emerald-700/50 text-emerald-100'}`}
            >
                {isProcessing ? <Loader2 size={14} className="animate-spin" /> : 'Stake'}
            </button>
            <button 
                onClick={handleUnstake}
                disabled={isProcessing || stakedAmount <= 0}
                className={`flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold font-mono uppercase tracking-wide transition-all ${stakedAmount <= 0 ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-300'}`}
            >
                {isProcessing ? <Loader2 size={14} className="animate-spin" /> : 'Unstake'}
            </button>
          </div>
      </div>
    </div>
  );
};

export default StakingVault;