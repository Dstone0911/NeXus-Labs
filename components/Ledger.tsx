import React from 'react';
import { Transaction } from '../types';
import { ScrollText, ExternalLink } from 'lucide-react';

interface LedgerProps {
  transactions: Transaction[];
}

const Ledger: React.FC<LedgerProps> = ({ transactions }) => {
  if (transactions.length === 0) return null;

  return (
    <div className="mt-8">
       <h3 className="text-xl font-bold text-gray-300 font-mono mb-4 flex items-center gap-2">
           <ScrollText className="text-mystic" />
           Immutable Ledger of Transmutations
       </h3>
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
           {transactions.slice().reverse().map((tx) => (
               <div key={tx.id} className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 hover:border-mystic/40 transition-colors">
                   <div className="flex justify-between items-start mb-2">
                       <span className="text-xs font-mono text-gray-500">{new Date(tx.timestamp).toLocaleTimeString()}</span>
                       <span className="bg-mystic/20 text-mystic text-[10px] px-2 py-0.5 rounded border border-mystic/30 uppercase tracking-wide">
                           {tx.type}
                       </span>
                   </div>
                   <div className="flex items-center gap-2 mb-3">
                       <span className="text-red-400 font-mono text-sm">-{tx.inputAmount} {tx.inputToken}</span>
                       <ArrowIcon />
                       <span className="text-gold font-mono font-bold">+{tx.outputAmount.toFixed(2)} GOLD</span>
                   </div>
                   <p className="text-sm text-gray-400 italic border-l-2 border-gray-700 pl-3 leading-relaxed">
                       "{tx.story}"
                   </p>
                   <div className="mt-3 pt-3 border-t border-gray-800 flex justify-end">
                       <a href="#" className="text-xs text-gray-600 hover:text-mystic flex items-center gap-1 transition-colors">
                           View on Etherscan (Fake) <ExternalLink size={10} />
                       </a>
                   </div>
               </div>
           ))}
       </div>
    </div>
  );
};

const ArrowIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12"></line>
        <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
)

export default Ledger;