
import React from 'react';

interface PageHeaderProps {
    title: string;
    description: string;
    insight: string;
    tag?: string;
    engine?: string;
    children?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    description,
    insight,
    tag,
    engine,
    children
}) => {
    return (
        <div className="space-y-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900">{title}</h2>
                        {tag && (
                            <div className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded uppercase tracking-widest">
                                {tag}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2 py-2">
                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] whitespace-nowrap">
                            {insight}
                        </span>
                        <div className="h-px flex-1 bg-slate-100" />
                    </div>

                    <p className="text-slate-500 max-w-2xl font-medium leading-relaxed">
                        {description}
                    </p>
                </div>

                {(engine || children) && (
                    <div className="flex flex-col items-end gap-2">
                        {engine && (
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 text-right">
                                    Engine: {engine}
                                </span>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-xs font-bold text-slate-600 uppercase tracking-tighter">Strategic Core Ready</span>
                                </div>
                            </div>
                        )}
                        {children}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PageHeader;
