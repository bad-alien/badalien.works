'use client';

interface AIAvatarProps {
  size?: number;
  showStatus?: boolean;
  statusBorderColor?: string;
}

export default function AIAvatar({
  size = 28,
  showStatus = false,
  statusBorderColor = '#0A0A0A',
}: AIAvatarProps) {
  const dotSize = Math.max(8, Math.round(size * 0.32));
  const labelSize = Math.max(10, Math.round(size * 0.45));
  const ringInset = Math.max(2, Math.round(size * 0.1));

  return (
    <span
      className="relative inline-flex items-center justify-center rounded-full shrink-0"
      style={{
        width: size,
        height: size,
        background: 'radial-gradient(circle at 30% 30%, #FF8C5A, #E05A2A)',
        boxShadow: `0 0 0 ${ringInset}px rgba(255, 107, 53, 0.18)`,
      }}
      aria-hidden="true"
    >
      <span
        style={{
          color: '#2A1408',
          fontFamily: 'var(--font-outfit, "Outfit", sans-serif)',
          fontWeight: 700,
          fontSize: labelSize,
          lineHeight: 1,
          letterSpacing: '-0.02em',
        }}
      >
        AI
      </span>
      {showStatus && (
        <span
          className="absolute"
          style={{
            width: dotSize,
            height: dotSize,
            right: -2,
            bottom: -2,
            borderRadius: '9999px',
            background: '#22C55E',
            boxShadow: `0 0 0 2px ${statusBorderColor}`,
          }}
        />
      )}
    </span>
  );
}
