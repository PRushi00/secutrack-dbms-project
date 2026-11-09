import React from 'react';
import { Severity } from '../types';

interface SeverityBadgeProps {
  severity: Severity | string;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({
  severity,
  size = 'md',
  showDot = true,
}) => {
  const norm = (severity || 'Low').toLowerCase();

  let bgClass = 'bg-blue-500/10 text-blue-400 border-blue-500/20';
  let dotClass = 'bg-blue-400';

  if (norm === 'critical') {
    bgClass = 'bg-[#FF626D]/15 text-[#FF626D] border-[#FF626D]/30';
    dotClass = 'bg-[#FF626D] shadow-[0_0_8px_#FF626D]';
  } else if (norm === 'high') {
    bgClass = 'bg-[#FF884D]/15 text-[#FF884D] border-[#FF884D]/30';
    dotClass = 'bg-[#FF884D] shadow-[0_0_8px_#FF884D]';
  } else if (norm === 'medium') {
    bgClass = 'bg-[#F5B942]/15 text-[#F5B942] border-[#F5B942]/30';
    dotClass = 'bg-[#F5B942] shadow-[0_0_8px_#F5B942]';
  } else if (norm === 'low') {
    bgClass = 'bg-[#45C99A]/15 text-[#45C99A] border-[#45C99A]/30';
    dotClass = 'bg-[#45C99A] shadow-[0_0_8px_#45C99A]';
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium border rounded-full font-mono tracking-wide ${sizeClasses[size]} ${bgClass}`}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />}
      {severity.toUpperCase()}
    </span>
  );
};

