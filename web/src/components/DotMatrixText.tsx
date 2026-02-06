import React, { useEffect, useState } from 'react';
import { useThemeContext } from '@/contexts/themeContext';

const DotMatrixText: React.FC = () => {
  const { isDark } = useThemeContext();
  const [dots, setDots] = useState<boolean[][]>([]);

  // "iMail Rates" 的点阵字体数据 (每个字符7x5的点阵)
  const dotMatrix = [
    // i
    [
      [0,1,0],
      [0,0,0],
      [0,1,0],
      [0,1,0],
      [0,1,0],
      [0,1,0],
      [0,1,0],
    ],
    // M
    [
      [1,0,0,0,1],
      [1,1,0,1,1],
      [1,0,1,0,1],
      [1,0,0,0,1],
      [1,0,0,0,1],
      [1,0,0,0,1],
      [1,0,0,0,1],
    ],
    // a
    [
      [0,0,0,0],
      [0,0,0,0],
      [0,1,1,0],
      [0,0,0,1],
      [0,1,1,1],
      [1,0,0,1],
      [0,1,1,1],
    ],
    // i
    [
      [0,1,0],
      [0,0,0],
      [0,1,0],
      [0,1,0],
      [0,1,0],
      [0,1,0],
      [0,1,0],
    ],
    // l
    [
      [0,1,0],
      [0,1,0],
      [0,1,0],
      [0,1,0],
      [0,1,0],
      [0,1,0],
      [0,1,1],
    ],
    // 空格
    [
      [0,0],
      [0,0],
      [0,0],
      [0,0],
      [0,0],
      [0,0],
      [0,0],
    ],
    // R
    [
      [1,1,1,0],
      [1,0,0,1],
      [1,0,0,1],
      [1,1,1,0],
      [1,0,1,0],
      [1,0,0,1],
      [1,0,0,1],
    ],
    // a
    [
      [0,0,0,0],
      [0,0,0,0],
      [0,1,1,0],
      [0,0,0,1],
      [0,1,1,1],
      [1,0,0,1],
      [0,1,1,1],
    ],
    // t
    [
      [0,1,0],
      [0,1,0],
      [1,1,1],
      [0,1,0],
      [0,1,0],
      [0,1,0],
      [0,0,1],
    ],
    // e
    [
      [0,0,0,0],
      [0,0,0,0],
      [0,1,1,0],
      [1,0,0,1],
      [1,1,1,1],
      [1,0,0,0],
      [0,1,1,1],
    ],
    // s
    [
      [0,0,0,0],
      [0,0,0,0],
      [0,1,1,1],
      [1,0,0,0],
      [0,1,1,0],
      [0,0,0,1],
      [1,1,1,0],
    ],
  ];

  useEffect(() => {
    // 将所有字符的点阵合并成一个大的点阵
    const fullMatrix: boolean[][] = [];
    for (let row = 0; row < 7; row++) {
      const rowDots: boolean[] = [];
      dotMatrix.forEach((char, charIndex) => {
        char[row].forEach(dot => {
          rowDots.push(dot === 1);
        });
        // 字符间距
        if (charIndex < dotMatrix.length - 1) {
          rowDots.push(false);
        }
      });
      fullMatrix.push(rowDots);
    }
    setDots(fullMatrix);
  }, []);

  const dotColor = isDark ? 'bg-purple-500' : 'bg-emerald-500';
  const glowColor = isDark 
    ? 'shadow-[0_0_8px_rgba(168,85,247,0.6)]' 
    : 'shadow-[0_0_8px_rgba(16,185,129,0.6)]';

  // 每个点由3x4的小点组成
  const renderMultiDot = (isActive: boolean, baseDelay: number) => {
    const miniDots = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        miniDots.push(
          <div
            key={`${i}-${j}`}
            className={`w-[2px] h-[2px] rounded-full transition-all duration-300 ${
              isActive 
                ? `${dotColor} ${glowColor} opacity-100` 
                : 'bg-gray-700/40 opacity-20'
            }`}
            style={{
              animationDelay: `${baseDelay + (i * 4 + j) * 5}ms`,
            }}
          />
        );
      }
    }
    return miniDots;
  };

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="inline-block">
        {dots.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-[12px] mb-[12px]">
            {row.map((dot, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="grid grid-cols-3 gap-[2px]"
              >
                {renderMultiDot(dot, (rowIndex * row.length + colIndex) * 14)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DotMatrixText;
