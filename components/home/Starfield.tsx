// components/home/Starfield.tsx
// Lightweight, CSS-only starfield + aurora blobs.
// No external libs. Respects reduced motion.

export default function Starfield() {
    return (
      <div aria-hidden className="starfield-root">
        {/* Parallax star layers */}
        <div className="starfield layer-a" />
        <div className="starfield layer-b" />
  
        {/* Aurora fog blobs */}
        <div className="aurora blob-1" />
        <div className="aurora blob-2" />
      </div>
    );
  }