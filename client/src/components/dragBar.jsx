import React, { useRef, useState } from "react";

function DraggableBar() {
  const barRef = useRef(null);
  const draggingRef = useRef(false);
  const startRef = useRef({ mouseX: 0, mouseY: 0, x: 0, y: 0 });

  const [pos, setPos] = useState({ x: 20, y: 120 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (e) => {
    if (!draggingRef.current) return;

    const clientX = e.type.startsWith("touch") ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.startsWith("touch") ? e.touches[0].clientY : e.clientY;

    const dx = clientX - startRef.current.mouseX;
    const dy = clientY - startRef.current.mouseY;

    const newX = startRef.current.x + dx;
    const newY = startRef.current.y + dy;

    const el = barRef.current;
    const w = el?.offsetWidth || 60;
    const h = el?.offsetHeight || 60;

    const maxX = window.innerWidth - w - 8;
    const maxY = window.innerHeight - h - 8;

    setPos({
      x: Math.min(Math.max(newX, 8), maxX),
      y: Math.min(Math.max(newY, 8), maxY),
    });
  };

  const handleUp = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setIsDragging(false);

    const el = barRef.current;
    const w = el?.offsetWidth || 60;

    const centerX = pos.x + w / 2;
    const snapLeft = centerX < window.innerWidth / 2;
    const targetX = snapLeft ? 12 : window.innerWidth - w - 12;

    setIsAnimating(true);
    setPos((prev) => ({ ...prev, x: targetX }));

    setTimeout(() => setIsAnimating(false), 280);

    window.removeEventListener("mousemove", handleMove);
    window.removeEventListener("mouseup", handleUp);
    window.removeEventListener("touchmove", handleMove);
    window.removeEventListener("touchend", handleUp);
  };

  const handleDown = (e) => {
    e.preventDefault();

    const clientX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;

    draggingRef.current = true;
    setIsDragging(true);

    startRef.current = { mouseX: clientX, mouseY: clientY, x: pos.x, y: pos.y };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    window.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("touchend", handleUp);
  };

  return (
    <div
      ref={barRef}
      onMouseDown={handleDown}
      onTouchStart={handleDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        left: pos.x,
        top: pos.y,
        transition: isAnimating
          ? "left 0.28s cubic-bezier(.22,.99,.36,1), transform 0.3s ease"
          : "transform 0.3s ease",
        transform: isDragging 
          ? "scale(1.1) rotate(-2deg)" 
          : isHovered 
            ? "scale(1.05)" 
            : "scale(1)",
        animation: !isDragging ? "float 3s ease-in-out infinite" : "none",
      }}
      className="fixed z-[9999] select-none touch-none cursor-grab active:cursor-grabbing group"
    >
      {/* Glow effect behind */}
      <div 
        className={`absolute -inset-3 bg-gradient-to-r from-green-400 via-emerald-500 to-lime-400 
                    rounded-2xl blur-xl transition-opacity duration-500
                    ${isHovered || isDragging ? 'opacity-80' : 'opacity-40'}`}
      />
      
      {/* Pulsing ring */}
      <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl opacity-75 animate-pulse" />
      
      {/* Main button container */}
      <div className="relative bg-gradient-to-br from-green-500 via-emerald-500 to-green-600 
                      rounded-2xl p-[2px] shadow-2xl">
        <div className="bg-gradient-to-br from-white to-green-50 rounded-xl px-5 py-3 
                        flex items-center gap-3 min-w-[100px]">
          
          {/* Animated icon */}
          <div className="relative">
            <span className="text-2xl" style={{ 
              animation: !isDragging ? "bounce-subtle 2s ease-in-out infinite" : "none" 
            }}>
              📝
            </span>
            {/* Notification dot */}
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
          </div>
          
          {/* Text */}
          <div className="flex flex-col">
            <span className="text-green-800 font-bold text-sm leading-tight">Notes</span>
            <span className="text-green-600 text-[10px] font-medium opacity-75">Drag me!</span>
          </div>
          
          {/* Drag indicator */}
          <div className="flex flex-col gap-0.5 ml-1 opacity-50 group-hover:opacity-100 transition-opacity">
            <div className="w-1 h-1 bg-green-500 rounded-full" />
            <div className="w-1 h-1 bg-green-500 rounded-full" />
            <div className="w-1 h-1 bg-green-500 rounded-full" />
          </div>
        </div>
      </div>
      
      {/* Floating particles */}
      <div 
        className="absolute -top-2 -right-2 w-3 h-3 bg-yellow-400 rounded-full shadow-lg"
        style={{ animation: "float-particle 2s ease-in-out infinite" }}
      />
      <div 
        className="absolute -bottom-2 -left-2 w-2 h-2 bg-lime-400 rounded-full shadow-lg"
        style={{ animation: "float-particle 2.5s ease-in-out infinite 0.5s" }}
      />
      
      {/* Inline keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) ${isDragging ? 'scale(1.1) rotate(-2deg)' : isHovered ? 'scale(1.05)' : 'scale(1)'}; }
          50% { transform: translateY(-8px) ${isDragging ? 'scale(1.1) rotate(-2deg)' : isHovered ? 'scale(1.05)' : 'scale(1)'}; }
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes float-particle {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 1; }
          50% { transform: translateY(-6px) rotate(180deg); opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}

export default DraggableBar;
