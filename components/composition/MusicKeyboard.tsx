import React from 'react';

interface MusicKeyboardProps {
    onAddSymbol: (symbol: string) => void;
    onDeleteSymbol: () => void;
}

const Key: React.FC<{ symbol: string; label: string; onClick: () => void; className?: string; }> = ({ symbol, label, onClick, className = '' }) => (
    <button 
        onClick={onClick}
        title={label}
        className={`h-16 w-16 flex flex-col items-center justify-center bg-gray-700/50 rounded-md border border-gray-600 hover:bg-amber-500/20 hover:border-amber-500 transition-all text-white font-mono text-2xl ${className}`}
    >
        {symbol}
        <span className="text-xs mt-1 opacity-70">{label}</span>
    </button>
);

export const MusicKeyboard: React.FC<MusicKeyboardProps> = ({ onAddSymbol, onDeleteSymbol }) => {
    const symbols = {
        notes: [
            { symbol: '𝅘𝅥', label: 'Quarter' },
            { symbol: '𝅗𝅥', label: 'Half' },
            { symbol: '𝅝', label: 'Whole' },
            { symbol: '𝅘𝅥𝅮', label: 'Eighth' },
        ],
        dynamics: [
            { symbol: 'boldsymbol{p}', label: 'Piano' },
            { symbol: 'boldsymbol{f}', label: 'Forte' },
            { symbol: 'cresc.', label: 'Cresc.' },
        ],
        articulations: [
            { symbol: '⌒', label: 'Slur' },
            { symbol: '˙', label: 'Staccato' },
            { symbol: ' fermata', label: 'Fermata' },
        ],
    };

    return (
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 mt-4">
            <div className="flex flex-wrap justify-center gap-3">
                {symbols.notes.map(s => <Key key={s.label} symbol={s.symbol} label={s.label} onClick={() => onAddSymbol(s.label + ' Note')} />)}
                <div className="w-px bg-gray-600 mx-2"></div>
                {symbols.dynamics.map(s => <Key key={s.label} symbol={s.label} label={s.label} onClick={() => onAddSymbol(s.label)} />)}
                <div className="w-px bg-gray-600 mx-2"></div>
                {symbols.articulations.map(s => <Key key={s.label} symbol={s.symbol} label={s.label} onClick={() => onAddSymbol(s.label)} />)}
                 <div className="w-px bg-gray-600 mx-2"></div>
                 <button 
                    onClick={onDeleteSymbol}
                    title="Delete Last Symbol"
                    className="h-16 w-16 flex flex-col items-center justify-center bg-red-900/50 rounded-md border border-red-700 hover:bg-red-500/20 hover:border-red-500 transition-all text-white"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 002.828 0L18 12M3 12l6.414-6.414a2 2 0 012.828 0L18 12" /></svg>
                     <span className="text-xs mt-1 opacity-70">Delete</span>
                </button>
            </div>
        </div>
    );
};
