'use client';

import Image from 'next/image';

export default function InteractiveGridBackground() {
  // Create array for grid tiles
  const gridTiles = Array.from({ length: 100 }, (_, i) => i);

  return (
    <div className="interactive-grid-bg">
      <div className="interactive-card">
        <div className="interactive-card__img">
          <Image 
            src="/8bitlogo.svg" 
            alt="Portman 8-bit Logo" 
            width={160}
            height={160}
            className="interactive-logo"
          />
          <div className="interactive-card__grid-effect">
            {gridTiles.map((index) => (
              <div key={index} className="interactive-card__grid-effect-tile" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
