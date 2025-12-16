import React, { useEffect, useState } from 'react';
import { getMarketData } from '../services/alchemyService';
import { MarketData } from '../types';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

const MarketTicker: React.FC = () => {
  const [data, setData] = useState<MarketData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getMarketData();
      setData(result);
    };
    fetchData();
    const interval = setInterval(fetchData, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  if (!data) return <div className="h-10 bg-black/80 border-b border-gray-800 animate-pulse"></div>;

  const TrendIcon = data.marketTrend === 'bullish' ? TrendingUp : (data.marketTrend === 'bearish' ? TrendingDown : Activity);
  const trendColor = data.marketTrend === 'bullish' ? 'text-green-400' : (data.marketTrend === 'bearish' ? 'text-red-400' : 'text-mystic');

  return (
    <div className="h-10 bg-black/80 border-b border-gray-800 flex items-center overflow-hidden relative z-20">
      <div className="px-4 bg-gray-900 h-full flex items-center gap-2 border-r border-gray-800 z-10 shrink-0">
         <span className="text-gold font-bold font-mono">GOLD</span>
         <span className={`font-mono ${trendColor}`}>${data.goldPrice.toFixed(2)}</span>
         <TrendIcon size={16} className={trendColor} />
      </div>
      <div className="whitespace-nowrap animate-marquee flex items-center gap-8 px-4 text-xs font-mono text-gray-400">
         {data.headlines.map((headline, i) => (
             <span key={i} className="flex items-center gap-2">
                 <span className="text-gray-600">+++</span>
                 {headline.toUpperCase()}
             </span>
         ))}
         {/* Duplicate for seamless loop */}
         {data.headlines.map((headline, i) => (
             <span key={`dup-${i}`} className="flex items-center gap-2">
                 <span className="text-gray-600">+++</span>
                 {headline.toUpperCase()}
             </span>
         ))}
      </div>
      <style>{`
        .animate-marquee {
            animation: marquee 20s linear infinite;
        }
        @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default MarketTicker;