import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface PortfolioProps {
  wallet: Record<string, number>;
  alchemyGold: number;
}

const COLORS = ['#8b5cf6', '#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#fbbf24'];

const Portfolio: React.FC<PortfolioProps> = ({ wallet, alchemyGold }) => {
  
  const data = [
    ...Object.entries(wallet).map(([name, value]) => ({ name, value })),
    { name: 'Alchemical Gold', value: alchemyGold }
  ].filter(item => item.value > 0);

  return (
    <div className="bg-void border border-gray-800 rounded-xl p-6 h-full flex flex-col">
      <h3 className="text-lg font-bold text-gray-300 font-mono mb-4 border-b border-gray-800 pb-2">Asset Allocation</h3>
      
      <div className="flex-1 min-h-[200px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.name === 'Alchemical Gold' ? '#fbbf24' : COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
                contentStyle={{ backgroundColor: '#000', borderColor: '#333', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
            />
          </PieChart>
        </ResponsiveContainer>
        
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="text-xs text-gray-500">TOTAL TVL</div>
            <div className="text-xl font-bold text-white">∞</div>
        </div>
      </div>

      <div className="space-y-3 mt-4 overflow-y-auto max-h-[200px] custom-scrollbar">
        {data.map((item, idx) => (
            <div key={item.name} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                    <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.name === 'Alchemical Gold' ? '#fbbf24' : COLORS[idx % COLORS.length] }}
                    />
                    <span className="text-gray-400">{item.name}</span>
                </div>
                <span className="font-mono text-white">{item.value.toFixed(2)}</span>
            </div>
        ))}
      </div>
    </div>
  );
};

export default Portfolio;