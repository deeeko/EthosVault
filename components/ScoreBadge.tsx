'use client';

import { getScoreLevel } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface ScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function ScoreBadge({ score, size = 'md', showLabel = true }: ScoreBadgeProps) {
  const level = getScoreLevel(score);
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span
      className={cn(
        "score-badge font-semibold inline-flex items-center gap-1.5",
        sizeClasses[size]
      )}
      style={{ 
        backgroundColor: `${level.color}20`,
        color: level.color,
        border: `1px solid ${level.color}40`
      }}
    >
      <span 
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: level.color }}
      ></span>
      {score}
      {showLabel && (
        <span className="opacity-80">• {level.label}</span>
      )}
    </span>
  );
}
