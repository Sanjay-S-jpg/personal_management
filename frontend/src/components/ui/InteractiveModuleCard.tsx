import React, { useRef } from 'react';

interface InteractiveModuleCardProps {
  children: React.ReactNode;
  active?: boolean;
  glowColor?: string;
  onClick?: () => void;
}

export const InteractiveModuleCard: React.FC<
  InteractiveModuleCardProps
> = ({
  children,
  active = true,
  glowColor = '99,102,241',
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !active) return;

    const rect = cardRef.current.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const rotateY = ((x / rect.width) - 0.5) * 8;
    const rotateX = ((y / rect.height) - 0.5) * -8;

    cardRef.current.style.transform = `
      perspective(900px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateY(-4px)
    `;

    cardRef.current.style.setProperty(
      '--mouse-x',
      `${x}px`
    );

    cardRef.current.style.setProperty(
      '--mouse-y',
      `${y}px`
    );
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;

    cardRef.current.style.transform = '';
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        '--glow-color': glowColor,
      } as React.CSSProperties}
      className={`
        group relative overflow-hidden
        rounded-2xl border border-neutral-800
        bg-neutral-950
        transition-all duration-200 ease-out
        ${active ? 'cursor-pointer' : 'cursor-default'}
        hover:border-neutral-600
        hover:shadow-[0_20px_60px_rgba(var(--glow-color),0.16)]
      `}
    >
      {/* Cursor-following glow */}
      {active && (
        <div
          className="
            pointer-events-none
            absolute inset-0
            opacity-0
            transition-opacity duration-300
            group-hover:opacity-100
          "
          style={{
            background: `
              radial-gradient(
                300px circle at var(--mouse-x) var(--mouse-y),
                rgba(var(--glow-color), 0.16),
                transparent 70%
              )
            `,
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};