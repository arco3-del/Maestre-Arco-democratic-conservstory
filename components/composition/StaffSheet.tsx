import React from 'react';

interface StaffSheetProps {
    composition: string[];
}

const SYMBOL_MAP: { [key: string]: string } = {
    'Quarter Note': '𝅘𝅥',
    'Half Note': '𝅗𝅥',
    'Whole Note': '𝅝',
    'Eighth Note': '𝅘𝅥𝅮',
    'Piano': 'boldsymbol{p}',
    'Forte': 'boldsymbol{f}',
    'Cresc.': 'cresc.',
    'Slur': '⌒',
    'Staccato': '˙',
    'Fermata': '𝄐',
};

export const StaffSheet: React.FC<StaffSheetProps> = ({ composition }) => {
    return (
        <div 
            className="w-full h-48 bg-gray-900/50 rounded-lg border border-gray-700 p-4 flex items-center overflow-x-auto"
            style={{
                backgroundImage: `
                    repeating-linear-gradient(to bottom, 
                        transparent, transparent 19.5%, 
                        #4a5568 19.5%, #4a5568 20.5%, 
                        transparent 20.5%, transparent 39.5%, 
                        #4a5568 39.5%, #4a5568 40.5%, 
                        transparent 40.5%, transparent 59.5%, 
                        #4a5568 59.5%, #4a5568 60.5%, 
                        transparent 60.5%, transparent 79.5%, 
                        #4a5568 79.5%, #4a5568 80.5%, 
                        transparent 80.5%, transparent 100%
                    )
                `,
                 backgroundSize: '100% 50%',
                 backgroundPosition: 'center center',
                 backgroundRepeat: 'no-repeat'
            }}
        >
            <div className="flex items-center h-full space-x-2 text-white text-5xl font-mono">
                <span className="text-6xl">𝄞</span>
                {composition.map((symbolKey, index) => (
                     <span key={index} className="transition-opacity duration-300 animate-fade-in">
                        {SYMBOL_MAP[symbolKey] || symbolKey}
                     </span>
                ))}
                 {composition.length === 0 && (
                    <p className="text-gray-500 text-lg ml-4">Your composition begins here...</p>
                 )}
            </div>
        </div>
    );
};
