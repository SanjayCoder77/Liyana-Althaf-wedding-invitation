import { useState, useEffect, useMemo, useRef } from "react";

const NIKAH_DATE = new Date("2026-05-09T10:00:00");

function useCountdown(target) {
  const [t, setT] = useState({});
  useEffect(() => {
    const calc = () => {
      const diff = target - new Date();
      if (diff <= 0) return setT({ d: 0, h: 0, m: 0, s: 0 });
      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [target]);
  return t;
}

function Petals({ count = 20 }) {
  const petals = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${(i * 37 + 11) % 100}%`,
      delay: `${(i * 1.3) % 9}s`,
      dur: `${7 + (i % 5)}s`,
      size: `${9 + (i % 8)}px`,
      hue: ["#d4b483", "#8a6d3b", "#c9a96e", "#1a5c36", "#a88942"][i % 5],
    })), [count]);
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
      {petals.map(p => (
        <div key={p.id} style={{
          position: "absolute", top: "-20px", left: p.left,
          width: p.size, height: p.size,
          background: p.hue, borderRadius: "50% 0 50% 0",
          animation: `petalFall ${p.dur} ${p.delay} linear infinite`,
          opacity: 0.55,
        }} />
      ))}
    </div>
  );
}

function Stars({ count = 50 }) {
  const stars = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${(i * 19 + 3) % 100}%`,
      top: `${(i * 37 + 7) % 100}%`,
      delay: `${(i * 0.4) % 4}s`,
      dur: `${2 + (i % 3)}s`,
      size: `${1 + (i % 3)}px`,
    })), [count]);
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
      {stars.map(s => (
        <div key={s.id} style={{
          position: "absolute", left: s.left, top: s.top,
          width: s.size, height: s.size, borderRadius: "50%",
          background: "#d4b483",
          animation: `twinkle ${s.dur} ${s.delay} ease-in-out infinite`,
          opacity: 0.5,
        }} />
      ))}
    </div>
  );
}

function GeomBorder() {
  return (
    <svg viewBox="0 0 400 40" xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "28px", display: "block", opacity: 0.5 }}>
      <defs>
        <pattern id="gp" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <polygon points="20,2 38,11 38,29 20,38 2,29 2,11" fill="none" stroke="#c9a045" strokeWidth="1" />
          <polygon points="20,8 32,14 32,26 20,32 8,26 8,14" fill="none" stroke="#c9a045" strokeWidth="0.6" />
          <circle cx="20" cy="20" r="3" fill="#c9a045" opacity="0.7" />
          <line x1="0" y1="20" x2="8" y2="20" stroke="#c9a045" strokeWidth="0.6" />
          <line x1="32" y1="20" x2="40" y2="20" stroke="#c9a045" strokeWidth="0.6" />
        </pattern>
      </defs>
      <rect width="400" height="40" fill="url(#gp)" />
    </svg>
  );
}

function Divider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "14px 0" }}>
      <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, transparent, #c9a045)" }} />
      <span style={{ color: "#c9a045", fontSize: "13px", letterSpacing: "6px" }}>✦ ✦ ✦</span>
      <div style={{ flex: 1, height: "1px", background: "linear-gradient(to left, transparent, #c9a045)" }} />
    </div>
  );
}

function Tile({ value, label }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
      <div style={{
        background: "linear-gradient(160deg,#fffdf5,#f5ebcc)",
        border: "1px solid rgba(201,160,69,0.5)",
        borderRadius: "4px",
        minWidth: "clamp(52px,13vw,72px)",
        padding: "10px 6px",
        textAlign: "center",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08), inset 0 1px 0 #fff",
        fontFamily: "'Cinzel', serif",
        fontWeight: 600,
        fontSize: "clamp(1.1rem,4vw,1.5rem)",
        color: "#5c3d15",
        letterSpacing: "0.04em",
      }}>
        {String(value ?? 0).padStart(2, "0")}
      </div>
      <div style={{
        fontFamily: "'Cinzel', serif",
        fontSize: "clamp(0.45rem,1vw,0.55rem)",
        letterSpacing: "0.35em",
        textTransform: "uppercase",
        color: "#8a6d3b",
      }}>{label}</div>
    </div>
  );
}

function ScratchCard({ children }) {
  const canvasRef = useRef(null);
  const particlesCanvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isScratched, setIsScratched] = useState(false);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const pCanvas = particlesCanvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || !pCanvas) return;

    let particles = [];

    const t = setTimeout(() => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      pCanvas.width = rect.width;
      pCanvas.height = rect.height;

      const ctx = canvas.getContext('2d');
      const pCtx = pCanvas.getContext('2d');

      // Draw rich gold foil background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#c9a045');
      gradient.addColorStop(0.3, '#f2e2b8');
      gradient.addColorStop(0.5, '#8a6d3b');
      gradient.addColorStop(0.7, '#f2e2b8');
      gradient.addColorStop(1, '#c9a045');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add elegant noise texture
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      for (let i = 0; i < 2000; i++) {
        ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 1.5, 1.5);
      }
      ctx.fillStyle = 'rgba(0,0,0,0.05)';
      for (let i = 0; i < 2000; i++) {
        ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 1.5, 1.5);
      }

      // Elegant inner border
      ctx.strokeStyle = 'rgba(255,255,255,0.4)';
      ctx.lineWidth = 1;
      ctx.strokeRect(6, 6, canvas.width - 12, canvas.height - 12);
      ctx.strokeStyle = 'rgba(0,0,0,0.1)';
      ctx.strokeRect(8, 8, canvas.width - 16, canvas.height - 16);

      // Elegant text
      ctx.fillStyle = '#5c3d15';
      ctx.font = '600 15px "Cinzel", serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(255,255,255,0.6)';
      ctx.shadowBlur = 4;
      ctx.fillText('✦ SCRATCH TO REVEAL ✦', canvas.width / 2, canvas.height / 2);
      ctx.shadowBlur = 0;

      let isDrawing = false;
      let lastPos = null;

      const getMousePos = (e) => {
        const r = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
          x: (clientX - r.left) * (canvas.width / r.width),
          y: (clientY - r.top) * (canvas.height / r.height)
        };
      };

      const scratch = (e) => {
        if (!isDrawing) return;
        if (e.cancelable) e.preventDefault();
        const { x, y } = getMousePos(e);

        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = 45;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        if (lastPos) {
          ctx.moveTo(lastPos.x, lastPos.y);
          ctx.lineTo(x, y);
          ctx.stroke();
        } else {
          ctx.arc(x, y, 22.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Spawn gold spark particles
        for(let i=0; i<4; i++) {
          particles.push({
            x: x + (Math.random()-0.5)*20,
            y: y + (Math.random()-0.5)*20,
            vx: (Math.random()-0.5)*5,
            vy: (Math.random()-0.5)*5 - 2, // slightly upwards
            life: 1,
            size: Math.random()*3 + 1,
            hue: Math.random() > 0.5 ? '#fceabb' : '#c9a045'
          });
        }

        lastPos = { x, y };
      };

      const startDrawing = (e) => {
        isDrawing = true;
        lastPos = getMousePos(e);
        scratch(e);
      };
      
      let scratchComplete = false;
      let scratchCount = 0;
      const endDrawing = () => {
        if (!isDrawing) return;
        isDrawing = false;
        lastPos = null;
        scratchCount++;

        if (scratchComplete) return;

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        let clearPixels = 0;
        for (let i = 3; i < data.length; i += 4) {
          if (data[i] === 0) clearPixels++;
        }
        
        // Reveal if user has swiped 1 time or cleared more than 5% of the card
        if (scratchCount >= 1 || clearPixels / (data.length / 4) > 0.05) {
          setIsScratched(true);
          scratchComplete = true;
          // Big explosion of particles!
          for(let i=0; i<150; i++) {
             particles.push({
              x: canvas.width/2,
              y: canvas.height/2,
              vx: (Math.random()-0.5)*20,
              vy: (Math.random()-0.5)*20,
              life: 1,
              size: Math.random()*5 + 2,
              hue: ['#fceabb', '#c9a045', '#fffdf5', '#8a6d3b'][Math.floor(Math.random()*4)]
            });
          }
        }
      };

      canvas.addEventListener('mousedown', startDrawing);
      canvas.addEventListener('mousemove', scratch, { passive: false });
      window.addEventListener('mouseup', endDrawing);
      canvas.addEventListener('touchstart', startDrawing, { passive: false });
      canvas.addEventListener('touchmove', scratch, { passive: false });
      window.addEventListener('touchend', endDrawing);

      // Particle rendering loop
      const renderParticles = () => {
        pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
        for(let i=particles.length-1; i>=0; i--) {
          let p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.15; // gravity
          p.life -= 0.02; // fade out
          
          if(p.life <= 0) {
            particles.splice(i, 1);
            continue;
          }
          
          pCtx.globalAlpha = Math.max(0, p.life);
          pCtx.fillStyle = p.hue;
          pCtx.beginPath();
          pCtx.arc(p.x, p.y, p.size, 0, Math.PI*2);
          pCtx.fill();
        }
        pCtx.globalAlpha = 1;
        animationRef.current = requestAnimationFrame(renderParticles);
      };
      renderParticles();

      return () => {
        canvas.removeEventListener('mousedown', startDrawing);
        canvas.removeEventListener('mousemove', scratch);
        window.removeEventListener('mouseup', endDrawing);
        canvas.removeEventListener('touchstart', startDrawing);
        canvas.removeEventListener('touchmove', scratch);
        window.removeEventListener('touchend', endDrawing);
        if(animationRef.current) cancelAnimationFrame(animationRef.current);
      };
    }, 100);

    return () => clearTimeout(t);
  }, []);

  return (
    <div ref={containerRef} style={{
      position: 'relative', display: 'inline-block', margin: '0 auto',
      padding: '24px 40px', minWidth: '320px',
    }}>
      <div style={{ 
        opacity: 1, 
        transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isScratched ? 'scale(1.05)' : 'scale(1)',
      }}>
        {children}
      </div>
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: isScratched ? 0 : 1,
          transition: 'opacity 0.8s ease',
          pointerEvents: isScratched ? 'none' : 'auto',
          cursor: 'crosshair',
          borderRadius: '4px',
          boxShadow: isScratched ? 'none' : '0 8px 24px rgba(201,160,69,0.2)',
        }}
      />
      <canvas
        ref={particlesCanvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      />
    </div>
  );
}

function CurtainPage({ onOpen, onInteract }) {
  const [phase, setPhase] = useState("idle");
  const handleClick = () => {
    if (phase !== "idle") return;
    if (onInteract) onInteract();
    setPhase("opening");
    setTimeout(() => onOpen(), 1400);
  };

  return (
    <div onClick={handleClick} style={{
      minHeight: "100vh",
      background: "#111",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      cursor: phase === "idle" ? "pointer" : "default",
      position: "relative", overflow: "hidden",
    }}>

      {/* Background revealed behind curtains */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at 60% 30%, #fdfbf7 0%, #f5f0e1 50%, #eaddc5 100%)",
        zIndex: 0
      }}>
        <Stars />
        <Petals count={18} />
      </div>

      {/* Left Curtain */}
      <div style={{
        position: "absolute", top: 0, bottom: 0, left: 0, width: "50%",
        background: "#154a2b",
        boxShadow: "4px 0 15px rgba(0,0,0,0.3)",
        transform: phase === "opening" ? "translateX(-100%)" : "translateX(0)",
        transition: "transform 1.5s cubic-bezier(0.65, 0.05, 0.36, 1)",
        zIndex: 10,
        display: "flex", justifyContent: "flex-end",
        overflow: "hidden"
      }}>
        <div style={{ width: "8px", height: "100%", background: "linear-gradient(to right, #c9a045, #8a6d3b)", zIndex: 2 }} />
        {/* Cotton Cloth Texture & Folds */}
        <div style={{
          position: "absolute", inset: 0,
          background: `
            repeating-linear-gradient(45deg, rgba(0,0,0,0.02) 0px, rgba(0,0,0,0.02) 1px, transparent 1px, transparent 2px),
            repeating-linear-gradient(-45deg, rgba(255,255,255,0.01) 0px, rgba(255,255,255,0.01) 1px, transparent 1px, transparent 2px),
            linear-gradient(to right, 
              rgba(0,0,0,0.05) 0%, 
              rgba(0,0,0,0.15) 12%, 
              rgba(255,255,255,0.02) 24%, 
              rgba(0,0,0,0.1) 36%, 
              rgba(0,0,0,0.2) 48%, 
              rgba(255,255,255,0.01) 60%, 
              rgba(0,0,0,0.08) 72%, 
              rgba(0,0,0,0.18) 84%, 
              rgba(255,255,255,0.02) 92%, 
              rgba(0,0,0,0.1) 100%
            ),
            linear-gradient(to bottom, rgba(255,255,255,0.03) 0%, transparent 15%, rgba(0,0,0,0.25) 100%),
            #1e6b3e
          `,
          pointerEvents: "none"
        }} />
      </div>

      {/* Right Curtain */}
      <div style={{
        position: "absolute", top: 0, bottom: 0, right: 0, width: "50%",
        background: "#154a2b",
        boxShadow: "-4px 0 15px rgba(0,0,0,0.3)",
        transform: phase === "opening" ? "translateX(100%)" : "translateX(0)",
        transition: "transform 1.5s cubic-bezier(0.65, 0.05, 0.36, 1)",
        zIndex: 10,
        display: "flex", justifyContent: "flex-start",
        overflow: "hidden"
      }}>
        <div style={{ width: "8px", height: "100%", background: "linear-gradient(to left, #c9a045, #8a6d3b)", zIndex: 2 }} />
        {/* Cotton Cloth Texture & Folds */}
        <div style={{
          position: "absolute", inset: 0,
          background: `
            repeating-linear-gradient(45deg, rgba(0,0,0,0.02) 0px, rgba(0,0,0,0.02) 1px, transparent 1px, transparent 2px),
            repeating-linear-gradient(-45deg, rgba(255,255,255,0.01) 0px, rgba(255,255,255,0.01) 1px, transparent 1px, transparent 2px),
            linear-gradient(to left, 
              rgba(0,0,0,0.05) 0%, 
              rgba(0,0,0,0.15) 12%, 
              rgba(255,255,255,0.02) 24%, 
              rgba(0,0,0,0.1) 36%, 
              rgba(0,0,0,0.2) 48%, 
              rgba(255,255,255,0.01) 60%, 
              rgba(0,0,0,0.08) 72%, 
              rgba(0,0,0,0.18) 84%, 
              rgba(255,255,255,0.02) 92%, 
              rgba(0,0,0,0.1) 100%
            ),
            linear-gradient(to bottom, rgba(255,255,255,0.03) 0%, transparent 15%, rgba(0,0,0,0.25) 100%),
            #1e6b3e
          `,
          pointerEvents: "none"
        }} />
      </div>

      {/* Center Seal */}
      <div style={{
        position: "absolute", zIndex: 20,
        display: "flex", flexDirection: "column", alignItems: "center",
        transform: phase === "opening" ? "scale(1.5)" : "scale(1)",
        opacity: phase === "opening" ? 0 : 1,
        transition: "transform 1s ease, opacity 0.8s ease",
        pointerEvents: "none"
      }}>
        <div style={{
          width: "clamp(70px,15vw,100px)", height: "clamp(70px,15vw,100px)",
          background: "radial-gradient(circle at 30% 30%, #c9a045, #8a6d3b)",
          borderRadius: "50%",
          border: "2px solid #fffdf5",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 8px 25px rgba(0,0,0,0.6)",
          marginBottom: "30px"
        }}>
          <div style={{
            width: "88%", height: "88%", borderRadius: "50%",
            border: "1px dashed rgba(255,255,255,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ color: "#fffdf5", fontFamily: "'Amiri', serif", fontSize: "clamp(18px,4vw,28px)" }}>L&A</span>
          </div>
        </div>

        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: "10px",
          animation: "fadeInUp 1s 0.6s ease both",
        }}>
          <div style={{
            color: "#c9a045",
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(0.85rem,2vw,1.1rem)",
            letterSpacing: "0.22em",
            textShadow: "0 2px 4px rgba(0,0,0,0.8)",
            background: "rgba(0,0,0,0.3)",
            padding: "4px 12px",
            borderRadius: "20px",
          }}>✦ Tap to open ✦</div>
          <div style={{
            width: "2px", height: "28px",
            background: "linear-gradient(to bottom,#c9a045,transparent)",
            animation: "pulse 1.5s ease-in-out infinite",
          }} />
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Alex+Brush&family=Cinzel:wght@400;500;600&family=Amiri:ital,wght@0,400;0,700;1,400&display=swap');
        @keyframes petalFall{0%{transform:translateY(-20px) rotate(0);opacity:0}10%{opacity:.6}90%{opacity:.4}100%{transform:translateY(110vh) rotate(540deg);opacity:0}}
        @keyframes fadeInUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:.3}50%{opacity:1}}
      `}</style>
    </div>
  );
}

function InvitationCard() {
  const [vis, setVis] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVis(true), 80); return () => clearTimeout(t); }, []);
  const { d, h, m, s } = useCountdown(NIKAH_DATE);

  const fade = (delay) => ({
    opacity: vis ? 1 : 0,
    transform: vis ? "translateY(0)" : "translateY(22px)",
    transition: `opacity 0.9s ${delay}s ease, transform 0.9s ${delay}s ease`,
  });

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(170deg,#fdfbf7 0%,#f5f0e1 45%,#eaddc5 100%)",
      display: "flex", flexDirection: "column",
      padding: "clamp(40px, 6vw, 64px) 16px", position: "relative", boxSizing: "border-box", overflowX: "hidden"
    }}>
      <Stars count={60} />
      <Petals count={22} />
      <div style={{
        position: "fixed", top: "4%", right: "5%",
        width: "50px", height: "50px", borderRadius: "50%",
        boxShadow: "inset -13px -3px 0 0 #c9a045",
        opacity: 0.3, pointerEvents: "none",
      }} />

      <div style={{
        position: "relative", zIndex: 2, margin: "auto",
        maxWidth: "700px", width: "100%",
        opacity: vis ? 1 : 0,
        transform: vis ? "scale(1)" : "scale(0.88)",
        transition: "all 1.1s cubic-bezier(0.23,1,0.32,1)",
      }}>
        <div style={{
          padding: "clamp(16px,4vw,32px) 0",
          position: "relative",
        }}>

          {/* Corner ornaments */}
          {[{ t: -16, l: 0, rot: 0 }, { t: -16, r: 0, rot: 90 }, { b: -16, r: 0, rot: 180 }, { b: -16, l: 0, rot: 270 }].map((cs, i) => (
            <svg key={i} viewBox="0 0 32 32" width="40" height="40"
              style={{
                position: "absolute", top: cs.t, bottom: cs.b, left: cs.l, right: cs.r,
                transform: `rotate(${cs.rot}deg)`, opacity: 0.45
              }}>
              <path d="M2 2 L16 2 M2 2 L2 16" stroke="#c9a045" strokeWidth="1.5" fill="none" />
              <path d="M6 2 L2 6" stroke="#c9a045" strokeWidth="0.8" fill="none" />
              <circle cx="2" cy="2" r="2" fill="#c9a045" />
            </svg>
          ))}

          {/* Bismillah */}
          <div style={{ textAlign: "center", ...fade(0) }}>
            <div style={{
              fontFamily: "'Amiri', serif",
              fontSize: "clamp(1.2rem,4vw,1.8rem)",
              color: "#1a5c36",
              marginBottom: "12px",
              textShadow: "0 2px 8px rgba(26,92,54,0.15)",
            }}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
          </div>

          {/* Invite line */}
          <div style={{ textAlign: "center", ...fade(0.1), margin: "14px 0 20px" }}>
            <div style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "clamp(0.75rem,2vw,0.9rem)",
              color: "#5c3d15",
              lineHeight: 1.6, letterSpacing: "0.1em",
            }}>
              You Are Invited To<br />
              The Wedding Of
            </div>
          </div>

          {/* Couple */}
          <div style={{ textAlign: "center", ...fade(0.2) }}>
            <div style={{
              fontFamily: "'Alex Brush', cursive",
              fontSize: "clamp(2.5rem,8vw,4rem)",
              color: "#1a5c36",
              lineHeight: 1.1,
              textShadow: "1px 2px 0 rgba(201,160,69,0.2)",
            }}>Liyana</div>
            <div style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "clamp(1rem,3vw,1.4rem)",
              color: "#1a5c36",
              margin: "8px 0",
            }}>&amp;</div>
            <div style={{
              fontFamily: "'Alex Brush', cursive",
              fontSize: "clamp(2.5rem,8vw,4rem)",
              color: "#1a5c36",
              lineHeight: 1.1,
              textShadow: "1px 2px 0 rgba(201,160,69,0.2)",
            }}>Althaf Hussain</div>
          </div>

          <div style={{ margin: "24px 0" }}><GeomBorder /></div>

          {/* Date & Venue */}
          <div style={{ textAlign: "center", ...fade(0.42) }}>
            <ScratchCard>
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
              }}>
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "clamp(16px,4vw,28px)",
                  fontFamily: "'Cinzel', serif", color: "#1a5c36"
                }}>
                  <div style={{ fontSize: "clamp(0.8rem,2.5vw,1rem)", letterSpacing: "0.15em", textTransform: "uppercase" }}>May</div>
                  <div style={{ width: "1px", height: "clamp(35px,6vw,45px)", background: "#1a5c36", opacity: 0.4 }}></div>
                  <div style={{ fontSize: "clamp(3rem,8vw,4rem)", lineHeight: 1, fontWeight: 500, letterSpacing: "-0.02em" }}>09</div>
                  <div style={{ width: "1px", height: "clamp(35px,6vw,45px)", background: "#1a5c36", opacity: 0.4 }}></div>
                  <div style={{ fontSize: "clamp(0.8rem,2.5vw,1rem)", letterSpacing: "0.15em", textTransform: "uppercase" }}>Saturday</div>
                </div>
                <div style={{
                  fontFamily: "'Cinzel', serif", fontSize: "clamp(1.2rem,3vw,1.5rem)",
                  color: "#1a5c36", letterSpacing: "0.4em", marginTop: "12px",
                  paddingLeft: "0.4em" // optically center due to letter-spacing
                }}>2026</div>
              </div>
            </ScratchCard>

            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(0.8rem,2.5vw,1rem)",
              color: "#5c3d15",
              lineHeight: 1.8,
              letterSpacing: "0.05em",
              marginTop: "24px"
            }}>
              Paradise Convention Centre<br />
              <strong>Karuvarakundu</strong>
            </div>

            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap", marginTop: "16px" }}>
              <a href="https://maps.google.com/?q=Paradise+Convention+Centre+Karuvarakundu" target="_blank" rel="noreferrer" style={{
                display: "inline-block", padding: "8px 24px",
                background: "#1a5c36", color: "#fff", textDecoration: "none",
                borderRadius: "4px", fontFamily: "'Cinzel', serif",
                fontSize: "clamp(0.7rem,1.8vw,0.85rem)", letterSpacing: "0.1em",
                boxShadow: "0 4px 12px rgba(26,92,54,0.3)",
                transition: "transform 0.2s"
              }}
                onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
              >View Location</a>

              <a href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Liyana+%26+Althaf+Wedding&dates=20260509T043000Z/20260509T143000Z&details=You+are+cordially+invited+to+the+wedding+of+Liyana+%26+Althaf!&location=Paradise+Convention+Centre,+Karuvarakundu" target="_blank" rel="noreferrer" style={{
                display: "inline-block", padding: "8px 24px",
                background: "transparent", color: "#1a5c36", textDecoration: "none",
                border: "1px solid #1a5c36",
                borderRadius: "4px", fontFamily: "'Cinzel', serif",
                fontSize: "clamp(0.7rem,1.8vw,0.85rem)", letterSpacing: "0.1em",
                transition: "transform 0.2s, background 0.2s, color 0.2s"
              }}
                onMouseOver={(e) => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.background = "#1a5c36"; e.currentTarget.style.color = "#fff"; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#1a5c36"; }}
              >Add to Calendar</a>
            </div>

            <div style={{
              fontFamily: "'Alex Brush', cursive",
              fontSize: "clamp(1.4rem,4vw,2rem)",
              color: "#5c3d15",
              marginTop: "24px",
            }}>
              Reception to follow
            </div>
          </div>



          {/* Countdown */}
          <div style={{ textAlign: "center", ...fade(0.5), margin: "20px 0 10px" }}>
            <div style={{ display: "flex", justifyContent: "center", gap: "clamp(6px,2vw,16px)" }}>
              <Tile value={d} label="Days" />
              <Tile value={h} label="Hours" />
              <Tile value={m} label="Mins" />
              <Tile value={s} label="Secs" />
            </div>
          </div>
          
          {/* Footer */}
          <div style={{ textAlign: "center", ...fade(0.6), marginTop: "60px", marginBottom: "10px" }}>
            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(0.7rem, 2vw, 0.85rem)",
              color: "#8a6d3b",
              letterSpacing: "0.05em",
            }}>
              Made with <span style={{ color: "#c9a045" }}>♥</span> by{' '}
              <a 
                href="https://wa.me/918921229989?text=Hi!%20I%20would%20like%20to%20enquire%20about%20a%20digital%20invitation%20card." 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  color: "#1a5c36",
                  textDecoration: "none",
                  fontWeight: 600,
                  borderBottom: "1px solid rgba(26,92,54,0.3)",
                  paddingBottom: "1px",
                  transition: "opacity 0.2s"
                }}
                onMouseOver={(e) => e.currentTarget.style.opacity = 0.7}
                onMouseOut={(e) => e.currentTarget.style.opacity = 1}
              >
                nextcards.ai
              </a>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Alex+Brush&family=Cinzel:wght@400;500;600&family=Amiri:ital,wght@0,400;0,700;1,400&display=swap');
        @keyframes petalFall{0%{transform:translateY(-20px) rotate(0);opacity:0}10%{opacity:.6}90%{opacity:.4}100%{transform:translateY(110vh) rotate(540deg);opacity:0}}
        @keyframes twinkle{0%,100%{opacity:.15;transform:scale(1)}50%{opacity:.85;transform:scale(2)}}
      `}</style>
    </div>
  );
}

export default function App() {
  const [opened, setOpened] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  const handleInteract = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      if (audioRef.current) {
        audioRef.current.play().catch(err => console.error("Audio playback blocked", err));
      }
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/bgm.m4a" loop />
      {opened ? <InvitationCard /> : <CurtainPage onInteract={handleInteract} onOpen={() => setOpened(true)} />}
      
      {hasInteracted && (
        <button
          onClick={toggleMute}
          title={isMuted ? "Unmute" : "Mute"}
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            background: "rgba(255,253,245,0.7)",
            border: "1px solid rgba(201,160,69,0.5)",
            color: "#1a5c36",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 9999,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            backdropFilter: "blur(4px)",
            transition: "transform 0.2s, background 0.2s"
          }}
          onMouseOver={(e) => { e.currentTarget.style.transform = "scale(1.1)"; e.currentTarget.style.background = "rgba(255,253,245,0.95)"; }}
          onMouseOut={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.background = "rgba(255,253,245,0.7)"; }}
        >
          {isMuted ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <line x1="23" y1="9" x2="17" y2="15"></line>
              <line x1="17" y1="9" x2="23" y2="15"></line>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
          )}
        </button>
      )}
    </>
  );
}