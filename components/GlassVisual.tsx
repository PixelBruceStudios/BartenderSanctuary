import React from 'react';

interface GlassVisualProps {
  glassType: string;
  size?: number;
  className?: string;
}

// Color palettes by glass type / drink family
const glassColors: Record<string, { fill: string; stroke: string; liquid: string }> = {
  'Highball':     { fill: '#e8f4f8', stroke: '#a0c4d4', liquid: '#f4e4bc' },
  'Collins':      { fill: '#e8f4f8', stroke: '#a0c4d4', liquid: '#f4e4bc' },
  'Rocks':        { fill: '#f0f0f0', stroke: '#c0c0c0', liquid: '#c9a050' },
  'Coupe':        { fill: '#f5f0f8', stroke: '#c4b0d4', liquid: '#f8e8d0' },
  'Champagne flute': { fill: '#f8f8f8', stroke: '#d0d0d0', liquid: '#f0d080' },
  'Flute':        { fill: '#f8f8f8', stroke: '#d0d0d0', liquid: '#f0d080' },
  'Wine':         { fill: '#f8f0f0', stroke: '#d4b0b0', liquid: '#c44d4d' },
  'Wine Glass':   { fill: '#f8f0f0', stroke: '#d4b0b0', liquid: '#c44d4d' },
  'Hurricane':    { fill: '#fff0e8', stroke: '#d4b0a0', liquid: '#f08050' },
  'Shot':         { fill: '#f8f8f8', stroke: '#c0c0c0', liquid: '#d4a040' },
  'Irish Coffee Glass': { fill: '#f5f0e8', stroke: '#b0a090', liquid: '#3d2b1f' },
  'Julep Cup':    { fill: '#e8e8e8', stroke: '#a0a0a0', liquid: '#90d890' },
  'Copper Mug':   { fill: '#e8d8c8', stroke: '#b08060', liquid: '#e8c080' },
  'Pousse Café Glass': { fill: '#f0f0f0', stroke: '#c0c0c0', liquid: '#c06030' },
  'Tiki':         { fill: '#f0e8d0', stroke: '#a08060', liquid: '#e07050' },
};

function getColors(glassType: string) {
  return glassColors[glassType] || { fill: '#f0f0f0', stroke: '#c0c0c0', liquid: '#d4a040' };
}

export default function GlassVisual({ glassType, size = 200, className = '' }: GlassVisualProps) {
  const colors = getColors(glassType);
  const viewBox = 100;

  // Map glass type to SVG path id
  const glassId = glassType.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-');
  const key = `glass-${glassId}`;

  // Generic glass SVG paths (all sized to fit 0-100 viewBox)
  const glassPaths: Record<string, React.ReactNode> = {
    'glass-highball': (
      <g key={key}>
        {/* Glass body */}
        <path d="M 35 20 L 35 75 Q 35 85 50 85 Q 65 85 65 75 L 65 20 Z" fill={colors.fill} stroke={colors.stroke} strokeWidth="2" />
        {/* Liquid */}
        <path d="M 37 35 L 37 73 Q 37 82 50 82 Q 63 82 63 73 L 63 35 Z" fill={colors.liquid} opacity="0.7" />
        {/* Rim */}
        <ellipse cx="50" cy="20" rx="15" ry="3" fill="none" stroke={colors.stroke} strokeWidth="2" />
        {/* Highlight */}
        <path d="M 40 25 L 40 70" stroke="white" strokeWidth="2" opacity="0.4" strokeLinecap="round" />
      </g>
    ),
    'glass-rocks': (
      <g key={key}>
        <path d="M 30 25 L 30 80 Q 30 90 50 90 Q 70 90 70 80 L 70 25 Z" fill={colors.fill} stroke={colors.stroke} strokeWidth="2" />
        <path d="M 32 40 L 32 78 Q 32 87 50 87 Q 68 87 68 78 L 68 40 Z" fill={colors.liquid} opacity="0.7" />
        <ellipse cx="50" cy="25" rx="20" ry="4" fill="none" stroke={colors.stroke} strokeWidth="2" />
        <path d="M 35 30 L 35 75" stroke="white" strokeWidth="3" opacity="0.35" strokeLinecap="round" />
      </g>
    ),
    'glass-coupe': (
      <g key={key}>
        {/* Stem */}
        <line x1="50" y1="55" x2="50" y2="88" stroke={colors.stroke} strokeWidth="2" />
        {/* Base */}
        <ellipse cx="50" cy="90" rx="18" ry="3" fill={colors.fill} stroke={colors.stroke} strokeWidth="2" />
        {/* Bowl */}
        <path d="M 30 30 Q 30 55 50 55 Q 70 55 70 30" fill={colors.fill} stroke={colors.stroke} strokeWidth="2" />
        <path d="M 32 32 Q 32 52 50 52 Q 68 52 68 32" fill={colors.liquid} opacity="0.7" />
        <ellipse cx="50" cy="30" rx="20" ry="4" fill="none" stroke={colors.stroke} strokeWidth="2" />
        <path d="M 35 35 Q 35 50 50 50" stroke="white" strokeWidth="2" opacity="0.3" fill="none" />
      </g>
    ),
    'glass-shot': (
      <g key={key}>
        <rect x="38" y="30" width="24" height="50" rx="2" fill={colors.fill} stroke={colors.stroke} strokeWidth="2" />
        <rect x="40" y="38" width="20" height="40" rx="1" fill={colors.liquid} opacity="0.7" />
        <ellipse cx="50" cy="30" rx="12" ry="2" fill="none" stroke={colors.stroke} strokeWidth="2" />
        <path d="M 42 35 L 42 65" stroke="white" strokeWidth="2" opacity="0.3" strokeLinecap="round" />
      </g>
    ),
    'glass-wine-glass': (
      <g key={key}>
        {/* Stem */}
        <line x1="50" y1="50" x2="50" y2="88" stroke={colors.stroke} strokeWidth="2" />
        {/* Base */}
        <ellipse cx="50" cy="90" rx="16" ry="3" fill={colors.fill} stroke={colors.stroke} strokeWidth="2" />
        {/* Bowl */}
        <path d="M 30 20 Q 30 50 50 50 Q 70 50 70 20" fill={colors.fill} stroke={colors.stroke} strokeWidth="2" />
        <path d="M 32 22 Q 32 48 50 48 Q 68 48 68 22" fill={colors.liquid} opacity="0.7" />
        <ellipse cx="50" cy="20" rx="20" ry="4" fill="none" stroke={colors.stroke} strokeWidth="2" />
        <path d="M 35 25 Q 35 45 50 45" stroke="white" strokeWidth="2" opacity="0.3" fill="none" />
      </g>
    ),
    'glass-hurricane': (
      <g key={key}>
        <path d="M 32 15 Q 32 75 50 75 Q 68 75 68 15 Z" fill={colors.fill} stroke={colors.stroke} strokeWidth="2" />
        <path d="M 34 25 Q 34 72 50 72 Q 66 72 66 25 Z" fill={colors.liquid} opacity="0.7" />
        <ellipse cx="50" cy="15" rx="18" ry="3" fill="none" stroke={colors.stroke} strokeWidth="2" />
        <path d="M 38 20 L 38 65" stroke="white" strokeWidth="2" opacity="0.3" strokeLinecap="round" />
      </g>
    ),
    'glass-collins': (
      <g key={key}>
        <path d="M 36 15 L 38 80 Q 38 88 50 88 Q 62 88 62 80 L 64 15 Z" fill={colors.fill} stroke={colors.stroke} strokeWidth="2" />
        <path d="M 38 30 L 40 77 Q 40 84 50 84 Q 60 84 60 77 L 62 30 Z" fill={colors.liquid} opacity="0.7" />
        <ellipse cx="50" cy="15" rx="14" ry="3" fill="none" stroke={colors.stroke} strokeWidth="2" />
        <path d="M 42 20 L 42 70" stroke="white" strokeWidth="2" opacity="0.3" strokeLinecap="round" />
      </g>
    ),
    'glass-irish-coffee-glass': (
      <g key={key}>
        {/* Mug body */}
        <path d="M 35 22 L 35 78 Q 35 86 50 86 Q 65 86 65 78 L 65 22 Z" fill={colors.fill} stroke={colors.stroke} strokeWidth="2" />
        {/* Handle */}
        <path d="M 65 35 Q 80 35 80 50 Q 80 65 65 65" fill="none" stroke={colors.stroke} strokeWidth="2" />
        {/* Liquid */}
        <rect x="37" y="30" width="26" height="50" fill={colors.liquid} opacity="0.7" />
        {/* Rim */}
        <ellipse cx="50" cy="22" rx="15" ry="3" fill="none" stroke={colors.stroke} strokeWidth="2" />
        {/* Highlight */}
        <path d="M 40 27 L 40 75" stroke="white" strokeWidth="2" opacity="0.3" strokeLinecap="round" />
      </g>
    ),
    'glass-julep-cup': (
      <g key={key}>
        {/* Cup body */}
        <path d="M 28 25 L 32 82 Q 32 90 50 90 Q 68 90 68 82 L 72 25 Z" fill={colors.fill} stroke={colors.stroke} strokeWidth="2" />
        {/* Handle */}
        <path d="M 72 40 Q 88 40 88 55 Q 88 70 72 70" fill="none" stroke={colors.stroke} strokeWidth="2" />
        {/* Liquid */}
        <path d="M 32 35 L 34 80 Q 34 87 50 87 Q 66 87 66 80 L 68 35 Z" fill={colors.liquid} opacity="0.7" />
        {/* Rim */}
        <ellipse cx="50" cy="25" rx="22" ry="4" fill="none" stroke={colors.stroke} strokeWidth="2" />
        {/* Highlight */}
        <path d="M 38 30 L 38 75" stroke="white" strokeWidth="2" opacity="0.3" strokeLinecap="round" />
      </g>
    ),
    'glass-copper-mug': (
      <g key={key}>
        {/* Mug body */}
        <path d="M 35 25 L 35 80 Q 35 88 50 88 Q 65 88 65 80 L 65 25 Z" fill={colors.fill} stroke={colors.stroke} strokeWidth="2" />
        {/* Handle */}
        <path d="M 65 35 Q 80 35 80 52 Q 80 68 65 68" fill="none" stroke={colors.stroke} strokeWidth="2.5" />
        {/* Liquid */}
        <rect x="37" y="30" width="26" height="50" fill={colors.liquid} opacity="0.7" />
        {/* Rim */}
        <ellipse cx="50" cy="25" rx="15" ry="3" fill="none" stroke={colors.stroke} strokeWidth="2" />
        {/* Highlight */}
        <path d="M 40 30 L 40 75" stroke="white" strokeWidth="2" opacity="0.3" strokeLinecap="round" />
      </g>
    ),
    'glass-pousse-café-glass': (
      <g key={key}>
        <path d="M 42 10 L 43 85 Q 43 90 50 90 Q 57 90 57 85 L 58 10 Z" fill={colors.fill} stroke={colors.stroke} strokeWidth="2" />
        <path d="M 44 20 L 44 82 Q 44 87 50 87 Q 56 87 56 82 L 56 20 Z" fill={colors.liquid} opacity="0.7" />
        <ellipse cx="50" cy="10" rx="8" ry="2" fill="none" stroke={colors.stroke} strokeWidth="2" />
        <path d="M 46 15 L 46 75" stroke="white" strokeWidth="1.5" opacity="0.3" strokeLinecap="round" />
      </g>
    ),
    'glass-tiki': (
      <g key={key}>
        {/* Tiki mug body - ceramic shape with face */}
        <path d="M 32 30 Q 30 50 35 75 Q 40 88 50 88 Q 60 88 65 75 Q 70 50 68 30 Z" fill={colors.fill} stroke={colors.stroke} strokeWidth="2" />
        {/* Liquid */}
        <path d="M 36 40 Q 35 55 40 72 Q 45 82 50 82 Q 55 82 60 72 Q 65 55 64 40 Z" fill={colors.liquid} opacity="0.7" />
        {/* Rim */}
        <ellipse cx="50" cy="30" rx="18" ry="4" fill="none" stroke={colors.stroke} strokeWidth="2" />
        {/* Face - simple tiki eyes/mouth */}
        <circle cx="42" cy="50" r="3" fill={colors.stroke} />
        <circle cx="58" cy="50" r="3" fill={colors.stroke} />
        <path d="M 44 62 Q 50 68 56 62" stroke={colors.stroke} strokeWidth="2" fill="none" />
      </g>
    ),
  };

  // Normalize glass type to key
  const normalized = glassType.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-');
  const pathKey = `glass-${normalized}`;
  
  // Alias mapping for variations
  const aliases: Record<string, string> = {
    'glass-wine': 'glass-wine-glass',
    'glass-flute': 'glass-champagne-flute',
    'glass-champagne': 'glass-champagne-flute',
    'glass-tumbler': 'glass-rocks',
    'glass-lowball': 'glass-rocks',
    'glass-old-fashioned': 'glass-rocks',
  };
  
  const svgKey = aliases[pathKey] || pathKey;
  const svgContent = glassPaths[svgKey] || glassPaths['glass-rocks'];

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${viewBox} ${viewBox}`}
      className={className}
      style={{ display: 'block' }}
    >
      {svgContent}
    </svg>
  );
}
