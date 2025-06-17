import React, { useState } from 'react';

// Professional Animated Menu Component
export default function ProMenu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuTitles = ["Home", "Features", "Contact"];

  return (
    <div className="professional-mode menu-container">
      <input
        type="checkbox"
        id="menu"
        checked={menuOpen}
        onChange={() => setMenuOpen((v) => !v)}
        style={{ display: 'none' }}
      />
      <label htmlFor="menu">
        <div className="menu"></div>
      </label>
      <div className="box">
        {menuTitles.map((title, idx) => (
          <h1 className="pro-menu-title" key={title}>{title}</h1>
        ))}
        <div className="move-item"></div>
      </div>
    </div>
  );
}
