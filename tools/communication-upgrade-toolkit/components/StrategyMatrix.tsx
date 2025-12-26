
import React from 'react';
import { Search, UserPlus, Target, History, UserCheck } from 'lucide-react';
import PageHeader from './PageHeader';
import { STRATEGY_DATA } from '../data/strategyMatrix';

const StrategyMatrix: React.FC = () => {
  const getIcon = (index: number, color: 'rose' | 'sky') => {
    const icons = [
      <Target key="target" className={`text-${color}-600`} />,
      <History key="history" className={`text-${color}-600`} />,
      <UserCheck key="usercheck" className={`text-${color}-600`} />
    ];
    return icons[index];
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="3R 戰略導航圖"
        tag="Standard Logic"
        insight="Before planning, clarify your position: Are you reacting, or repositioning?"
        description="放在辦公桌上的 Quick Reference Guide。開會前瞄一眼，確認自己要切換成「偵探模式」還是「教練模式」。"
      />

      <div className="grid lg:grid-cols-2 gap-8">
        {STRATEGY_DATA.map((category, catIdx) => (
          <section key={catIdx} className={`bg-${category.color}-50/50 rounded-3xl p-8 border border-${category.color}-100 relative overflow-hidden group`}>
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
              {category.color === 'rose' ? <Search className="w-32 h-32 text-rose-600" /> : <UserPlus className="w-32 h-32 text-sky-600" />}
            </div>

            <div className="flex items-center gap-3 mb-8">
              <div className={`w-12 h-12 bg-${category.color}-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-${category.color}-200`}>
                {category.color === 'rose' ? <Search className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />}
              </div>
              <div>
                <h3 className={`text-xl font-bold text-${category.color}-900`}>{category.title}</h3>
                <p className={`text-${category.color}-600 font-medium text-sm`}>{category.mode}</p>
              </div>
            </div>

            <div className="space-y-8 relative z-10">
              {category.points.map((point, pIdx) => (
                <MatrixItem
                  key={pIdx}
                  icon={getIcon(pIdx, category.color)}
                  title={point.title}
                  goal={point.goal}
                  items={point.items}
                  color={category.color}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

interface MatrixItemProps {
  icon: React.ReactNode;
  title: string;
  goal: string;
  items: string[];
  color: 'rose' | 'sky';
}

const MatrixItem: React.FC<MatrixItemProps> = ({ icon, title, goal, items, color }) => {
  const bgColors = {
    rose: 'bg-rose-100/50',
    sky: 'bg-sky-100/50'
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className={`p-1.5 rounded-lg ${bgColors[color]}`}>
          {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { className: 'w-4 h-4' }) : icon}
        </div>
        <h4 className="font-bold text-slate-800">{title}</h4>
      </div>
      <div className="ml-9">
        <p className="text-sm font-bold mb-2 text-slate-900">{goal}</p>
        <ul className="space-y-1.5">
          {items.map((item, idx) => (
            <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
              <span className={`w-1 h-1 rounded-full mt-2 flex-shrink-0 ${color === 'rose' ? 'bg-rose-400' : 'bg-sky-400'}`} />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StrategyMatrix;
