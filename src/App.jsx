import { useState, useEffect, useMemo } from "react";

const NIKAH_DATE = new Date("2026-04-11T10:00:00");

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
      hue: ["#d4b483","#c9a96e","#e8d5a8","#b8965a","#f0e2b6"][i % 5],
    })), [count]);
  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", overflow:"hidden", zIndex:0 }}>
      {petals.map(p => (
        <div key={p.id} style={{
          position:"absolute", top:"-20px", left:p.left,
          width:p.size, height:p.size,
          background:p.hue, borderRadius:"50% 0 50% 0",
          animation:`petalFall ${p.dur} ${p.delay} linear infinite`,
          opacity:0.55,
        }}/>
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
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0 }}>
      {stars.map(s => (
        <div key={s.id} style={{
          position:"absolute", left:s.left, top:s.top,
          width:s.size, height:s.size, borderRadius:"50%",
          background:"#d4b483",
          animation:`twinkle ${s.dur} ${s.delay} ease-in-out infinite`,
          opacity:0.5,
        }}/>
      ))}
    </div>
  );
}

function GeomBorder() {
  return (
    <svg viewBox="0 0 400 40" xmlns="http://www.w3.org/2000/svg"
      style={{ width:"100%", height:"28px", display:"block", opacity:0.5 }}>
      <defs>
        <pattern id="gp" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <polygon points="20,2 38,11 38,29 20,38 2,29 2,11" fill="none" stroke="#c9a045" strokeWidth="1"/>
          <polygon points="20,8 32,14 32,26 20,32 8,26 8,14" fill="none" stroke="#c9a045" strokeWidth="0.6"/>
          <circle cx="20" cy="20" r="3" fill="#c9a045" opacity="0.7"/>
          <line x1="0" y1="20" x2="8" y2="20" stroke="#c9a045" strokeWidth="0.6"/>
          <line x1="32" y1="20" x2="40" y2="20" stroke="#c9a045" strokeWidth="0.6"/>
        </pattern>
      </defs>
      <rect width="400" height="40" fill="url(#gp)"/>
    </svg>
  );
}

function Divider() {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:"12px", margin:"14px 0" }}>
      <div style={{ flex:1, height:"1px", background:"linear-gradient(to right, transparent, #c9a045)" }}/>
      <span style={{ color:"#c9a045", fontSize:"13px", letterSpacing:"6px" }}>✦ ✦ ✦</span>
      <div style={{ flex:1, height:"1px", background:"linear-gradient(to left, transparent, #c9a045)" }}/>
    </div>
  );
}

function Tile({ value, label }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"6px" }}>
      <div style={{
        background:"linear-gradient(160deg,#1e3a2f,#0f2018)",
        border:"1px solid rgba(201,160,69,0.5)",
        borderRadius:"4px",
        minWidth:"clamp(52px,13vw,72px)",
        padding:"10px 6px",
        textAlign:"center",
        boxShadow:"0 6px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(201,160,69,0.15)",
        fontFamily:"'Playfair Display', serif",
        fontWeight:700,
        fontSize:"clamp(1.3rem,5vw,1.9rem)",
        color:"#f0e2b6",
        letterSpacing:"0.04em",
      }}>
        {String(value ?? 0).padStart(2,"0")}
      </div>
      <div style={{
        fontFamily:"'Playfair Display', serif",
        fontSize:"clamp(0.5rem,1.2vw,0.6rem)",
        letterSpacing:"0.35em",
        textTransform:"uppercase",
        color:"#c9a045",
      }}>{label}</div>
    </div>
  );
}

function EnvelopePage({ onOpen }) {
  const [phase, setPhase] = useState("idle");
  const handleClick = () => {
    if (phase !== "idle") return;
    setPhase("lifting");
    setTimeout(() => setPhase("open"), 900);
    setTimeout(() => onOpen(), 1800);
  };

  return (
    <div onClick={handleClick} style={{
      minHeight:"100vh",
      background:"radial-gradient(ellipse at 60% 30%, #0d2b1e 0%, #081a10 50%, #030d07 100%)",
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      cursor: phase === "idle" ? "pointer" : "default",
      position:"relative", overflow:"hidden",
    }}>
      <Stars/>
      <Petals count={18}/>
      <div style={{
        position:"absolute", top:"6%", right:"8%",
        width:"54px", height:"54px", borderRadius:"50%",
        boxShadow:"inset -14px -4px 0 0 #c9a045",
        opacity:0.35, animation:"moonGlow 4s ease-in-out infinite",
      }}/>

      <div style={{ position:"relative", zIndex:2, display:"flex", flexDirection:"column", alignItems:"center" }}>
        <div style={{
          fontFamily:"'Amiri', serif",
          fontSize:"clamp(1.1rem,3.5vw,1.8rem)",
          color:"#c9a045",
          marginBottom:"8px",
          textShadow:"0 0 20px rgba(201,160,69,0.4)",
          animation:"fadeInDown 1s ease both",
        }}>﷽</div>

        <div style={{
          fontFamily:"'Playfair Display', serif",
          fontSize:"clamp(0.62rem,1.6vw,0.78rem)",
          letterSpacing:"0.4em",
          textTransform:"uppercase",
          color:"rgba(201,160,69,0.7)",
          marginBottom:"32px",
          animation:"fadeInDown 1s 0.2s ease both",
        }}>You are cordially invited</div>

        <div style={{
          position:"relative",
          width:"clamp(260px,58vw,420px)",
          height:"clamp(170px,40vw,280px)",
          animation: phase === "lifting"
            ? "envelopeLift 0.9s ease forwards"
            : "floatEnv 4s ease-in-out infinite",
          filter:"drop-shadow(0 20px 60px rgba(201,160,69,0.22))",
        }}>
          <div style={{
            position:"absolute", inset:0,
            background:"linear-gradient(160deg,#fffdf5,#f5e9cc,#eddbb0)",
            borderRadius:"4px 4px 10px 10px",
            border:"1.5px solid #c9a045", overflow:"hidden",
          }}>
            <div style={{
              position:"absolute", bottom:0, left:0, width:0, height:0,
              borderBottom:"clamp(85px,21vw,140px) solid #e8d09a",
              borderRight:"clamp(130px,29vw,210px) solid transparent",
            }}/>
            <div style={{
              position:"absolute", bottom:0, right:0, width:0, height:0,
              borderBottom:"clamp(85px,21vw,140px) solid #e0c488",
              borderLeft:"clamp(130px,29vw,210px) solid transparent",
            }}/>
            <div style={{
              position:"absolute",
              bottom:"clamp(22px,6vw,38px)", left:"50%",
              transform:"translateX(-50%)",
              width:"clamp(48px,11vw,72px)", height:"clamp(48px,11vw,72px)",
              background:"radial-gradient(circle at 35% 35%,#1a5c36,#0b3520)",
              borderRadius:"50%",
              border:"2px solid #c9a045",
              display:"flex", alignItems:"center", justifyContent:"center",
              boxShadow:"0 4px 20px rgba(0,0,0,0.4)", zIndex:5,
            }}>
              <span style={{ color:"#c9a045", fontFamily:"'Amiri', serif", fontSize:"clamp(11px,2.5vw,16px)" }}>M&R</span>
            </div>
          </div>
          <div style={{
            position:"absolute", top:0, left:0, right:0, height:"55%",
            transformOrigin:"top center",
            transform: phase === "open" ? "rotateX(-165deg)" : "rotateX(0deg)",
            transition:"transform 0.7s ease", zIndex:10,
          }}>
            <div style={{
              width:0, height:0,
              borderTop:"clamp(85px,21vw,140px) solid #f2e2b8",
              borderLeft:"clamp(130px,29vw,210px) solid transparent",
              borderRight:"clamp(130px,29vw,210px) solid transparent",
              filter:"drop-shadow(0 4px 6px rgba(0,0,0,0.1))",
            }}/>
          </div>
        </div>

        {phase === "idle" && (
          <div style={{
            marginTop:"36px",
            display:"flex", flexDirection:"column", alignItems:"center", gap:"10px",
            animation:"fadeInUp 1s 0.6s ease both",
          }}>
            <div style={{
              color:"#c9a045",
              fontFamily:"'Playfair Display', serif",
              fontSize:"clamp(0.75rem,2vw,0.9rem)",
              letterSpacing:"0.22em", opacity:0.8,
            }}>✦ Tap to open ✦</div>
            <div style={{
              width:"2px", height:"28px",
              background:"linear-gradient(to bottom,#c9a045,transparent)",
              animation:"pulse 1.5s ease-in-out infinite",
            }}/>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Great+Vibes&family=Amiri:ital,wght@0,400;0,700;1,400&display=swap');
        @keyframes petalFall{0%{transform:translateY(-20px) rotate(0);opacity:0}10%{opacity:.6}90%{opacity:.4}100%{transform:translateY(110vh) rotate(540deg);opacity:0}}
        @keyframes floatEnv{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
        @keyframes envelopeLift{0%{transform:translateY(0) scale(1);opacity:1}50%{transform:translateY(-28px) scale(1.04);opacity:1}100%{transform:translateY(-110px) scale(0.55) rotate(4deg);opacity:0}}
        @keyframes fadeInDown{from{opacity:0;transform:translateY(-16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeInUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes twinkle{0%,100%{opacity:.15;transform:scale(1)}50%{opacity:.9;transform:scale(2)}}
        @keyframes moonGlow{0%,100%{opacity:.35}50%{opacity:.55}}
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
      minHeight:"100vh",
      background:"radial-gradient(ellipse at 60% 20%, #0d2b1e 0%, #081a10 55%, #030d07 100%)",
      display:"flex", alignItems:"center", justifyContent:"center",
      padding:"32px 16px", position:"relative", overflow:"hidden",
    }}>
      <Stars count={60}/>
      <Petals count={22}/>
      <div style={{
        position:"fixed", top:"4%", right:"5%",
        width:"50px", height:"50px", borderRadius:"50%",
        boxShadow:"inset -13px -3px 0 0 #c9a045",
        opacity:0.3, pointerEvents:"none",
      }}/>

      <div style={{
        position:"relative", zIndex:2,
        maxWidth:"700px", width:"100%",
        opacity: vis ? 1 : 0,
        transform: vis ? "scale(1)" : "scale(0.88)",
        transition:"all 1.1s cubic-bezier(0.23,1,0.32,1)",
      }}>
        <div style={{
          background:"linear-gradient(170deg,#fdfaf2 0%,#f7edcf 45%,#f0e0b0 100%)",
          borderRadius:"6px",
          border:"1.5px solid rgba(201,160,69,0.45)",
          padding:"clamp(28px,6vw,52px) clamp(22px,7vw,60px)",
          boxShadow:"0 50px 130px rgba(0,0,0,0.65), 0 0 0 8px rgba(201,160,69,0.1), inset 0 0 100px rgba(201,160,69,0.04)",
          position:"relative", overflow:"hidden",
        }}>

          {/* Corner ornaments */}
          {[{t:8,l:8,rot:0},{t:8,r:8,rot:90},{b:8,r:8,rot:180},{b:8,l:8,rot:270}].map((cs,i)=>(
            <svg key={i} viewBox="0 0 32 32" width="32" height="32"
              style={{ position:"absolute", top:cs.t, bottom:cs.b, left:cs.l, right:cs.r,
                transform:`rotate(${cs.rot}deg)`, opacity:0.45 }}>
              <path d="M2 2 L16 2 M2 2 L2 16" stroke="#c9a045" strokeWidth="1.5" fill="none"/>
              <path d="M6 2 L2 6" stroke="#c9a045" strokeWidth="0.8" fill="none"/>
              <circle cx="2" cy="2" r="2" fill="#c9a045"/>
            </svg>
          ))}

          {/* Bismillah */}
          <div style={{ textAlign:"center", ...fade(0) }}>
            <div style={{
              fontFamily:"'Amiri', serif",
              fontSize:"clamp(1.4rem,4.5vw,2.2rem)",
              color:"#1a5c36",
              marginBottom:"4px",
              textShadow:"0 2px 8px rgba(26,92,54,0.15)",
            }}>﷽</div>
            <div style={{
              fontFamily:"'Cormorant Garamond', serif",
              fontStyle:"italic",
              fontSize:"clamp(0.7rem,1.8vw,0.86rem)",
              color:"#6b5020",
              letterSpacing:"0.14em",
              marginBottom:"8px",
            }}>In the name of Allah, most gracious and merciful</div>
            <GeomBorder/>
          </div>

          {/* Invite line */}
          <div style={{ textAlign:"center", ...fade(0.1), margin:"14px 0 4px" }}>
            <div style={{
              fontFamily:"'Cormorant Garamond', serif",
              fontStyle:"italic",
              fontSize:"clamp(0.8rem,2.2vw,0.98rem)",
              color:"#5c3d15",
              lineHeight:1.9, letterSpacing:"0.03em",
            }}>
              Cordially invite your esteemed presence and blessings<br/>
              with family on the auspicious occasion of the marriage of our son
            </div>
          </div>

          <Divider/>

          {/* Groom */}
          <div style={{ textAlign:"center", ...fade(0.2) }}>
            <div style={{
              fontFamily:"'Great Vibes', cursive",
              fontSize:"clamp(2.4rem,9vw,4.6rem)",
              color:"#1a5c36",
              lineHeight:1.05,
              textShadow:"1px 2px 0 rgba(201,160,69,0.2)",
            }}>Masood Abdul Samad</div>
            <div style={{
              fontFamily:"'Cormorant Garamond', serif",
              fontStyle:"italic",
              fontSize:"clamp(0.7rem,1.8vw,0.83rem)",
              color:"#7a5c2a",
              marginTop:"6px",
              lineHeight:1.9,
            }}>
              S/o. Late P.P Abdul Samad &amp; Rasheeda Samad<br/>
              <span style={{ fontSize:"clamp(0.65rem,1.6vw,0.78rem)", opacity:0.85 }}>
                Grand S/o. Late P.CP Mahamood Haji &amp; Late A.P Sulaiman Haji
              </span>
            </div>
          </div>

          {/* With */}
          <div style={{ textAlign:"center", margin:"12px 0 8px", ...fade(0.28) }}>
            <div style={{ display:"flex", alignItems:"center", gap:"14px", justifyContent:"center" }}>
              <div style={{ flex:1, height:"1px", background:"linear-gradient(to right,transparent,#c9a045)" }}/>
              <span style={{
                fontFamily:"'Playfair Display', serif",
                fontStyle:"italic",
                fontSize:"clamp(1rem,3vw,1.3rem)",
                color:"#c9a045",
                letterSpacing:"0.25em",
              }}>with</span>
              <div style={{ flex:1, height:"1px", background:"linear-gradient(to left,transparent,#c9a045)" }}/>
            </div>
          </div>

          {/* Bride */}
          <div style={{ textAlign:"center", ...fade(0.35) }}>
            <div style={{
              fontFamily:"'Great Vibes', cursive",
              fontSize:"clamp(2.4rem,9vw,4.6rem)",
              color:"#8b1a3a",
              lineHeight:1.05,
              textShadow:"1px 2px 0 rgba(201,160,69,0.2)",
            }}>Raasha Musadhique</div>
            <div style={{
              fontFamily:"'Cormorant Garamond', serif",
              fontStyle:"italic",
              fontSize:"clamp(0.7rem,1.8vw,0.83rem)",
              color:"#7a5c2a",
              marginTop:"6px",
              lineHeight:1.9,
            }}>
              D/o. Musadhique PTP &amp; Shamna Musadhique
            </div>
          </div>

          <div style={{ margin:"8px 0" }}><GeomBorder/></div>

          {/* Events grid */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"clamp(10px,2.5vw,18px)", margin:"14px 0", ...fade(0.42) }}>
            {/* Nikah */}
            <div style={{
              background:"linear-gradient(160deg,rgba(26,92,54,0.09),rgba(26,92,54,0.15))",
              border:"1px solid rgba(26,92,54,0.3)",
              borderRadius:"4px",
              padding:"clamp(14px,3vw,20px) clamp(10px,2.5vw,16px)",
              textAlign:"center",
            }}>
              <div style={{
                fontFamily:"'Playfair Display', serif",
                fontSize:"clamp(0.55rem,1.4vw,0.66rem)",
                letterSpacing:"0.4em", textTransform:"uppercase",
                color:"#1a5c36", marginBottom:"8px",
              }}>Nikah</div>
              <div style={{
                fontFamily:"'Great Vibes', cursive",
                fontSize:"clamp(1.3rem,4vw,1.9rem)",
                color:"#1a5c36", lineHeight:1.1,
              }}>Saturday</div>
              <div style={{
                fontFamily:"'Playfair Display', serif",
                fontWeight:700,
                fontSize:"clamp(1rem,3.5vw,1.5rem)",
                color:"#0f3d20", letterSpacing:"0.04em", margin:"4px 0",
              }}>11 April 2026</div>
              <div style={{
                fontFamily:"'Cormorant Garamond', serif",
                fontStyle:"italic",
                fontSize:"clamp(0.76rem,2vw,0.9rem)",
                color:"#3a7a55", marginBottom:"8px",
              }}>10:00 AM</div>
              <div style={{ height:"1px", background:"rgba(26,92,54,0.25)", margin:"8px 0" }}/>
              <div style={{
                fontFamily:"'Cormorant Garamond', serif",
                fontSize:"clamp(0.7rem,1.8vw,0.83rem)",
                color:"#5c3d15", lineHeight:1.8, fontStyle:"italic",
              }}>
                Hidayathul Islam Masjid<br/>Ikambakam, Kannur
              </div>
            </div>

            {/* Reception */}
            <div style={{
              background:"linear-gradient(160deg,rgba(139,26,58,0.09),rgba(139,26,58,0.15))",
              border:"1px solid rgba(139,26,58,0.3)",
              borderRadius:"4px",
              padding:"clamp(14px,3vw,20px) clamp(10px,2.5vw,16px)",
              textAlign:"center",
            }}>
              <div style={{
                fontFamily:"'Playfair Display', serif",
                fontSize:"clamp(0.55rem,1.4vw,0.66rem)",
                letterSpacing:"0.4em", textTransform:"uppercase",
                color:"#8b1a3a", marginBottom:"8px",
              }}>Reception</div>
              <div style={{
                fontFamily:"'Great Vibes', cursive",
                fontSize:"clamp(1.3rem,4vw,1.9rem)",
                color:"#8b1a3a", lineHeight:1.1,
              }}>Sunday</div>
              <div style={{
                fontFamily:"'Playfair Display', serif",
                fontWeight:700,
                fontSize:"clamp(1rem,3.5vw,1.5rem)",
                color:"#5a0f25", letterSpacing:"0.04em", margin:"4px 0",
              }}>12 April 2026</div>
              <div style={{
                fontFamily:"'Cormorant Garamond', serif",
                fontStyle:"italic",
                fontSize:"clamp(0.76rem,2vw,0.9rem)",
                color:"#a0385a", marginBottom:"8px",
              }}>1:00 PM Onwards</div>
              <div style={{ height:"1px", background:"rgba(139,26,58,0.25)", margin:"8px 0" }}/>
              <div style={{
                fontFamily:"'Cormorant Garamond', serif",
                fontSize:"clamp(0.7rem,1.8vw,0.83rem)",
                color:"#5c3d15", lineHeight:1.8, fontStyle:"italic",
              }}>
                Rasheeda's<br/>Hidayath Nagar<br/>Taliparamba
              </div>
            </div>
          </div>

          {/* Countdown */}
          <div style={{ textAlign:"center", ...fade(0.5), margin:"14px 0" }}>
            <div style={{
              fontFamily:"'Playfair Display', serif",
              fontSize:"clamp(0.55rem,1.4vw,0.66rem)",
              letterSpacing:"0.45em", textTransform:"uppercase",
              color:"#7a5c2a", marginBottom:"14px",
            }}>Counting down to the Nikah</div>
            <div style={{ display:"flex", justifyContent:"center", gap:"clamp(8px,2.5vw,20px)" }}>
              <Tile value={d} label="Days"/>
              <Tile value={h} label="Hours"/>
              <Tile value={m} label="Mins"/>
              <Tile value={s} label="Secs"/>
            </div>
          </div>

          <div style={{ margin:"8px 0" }}><GeomBorder/></div>

          {/* Footer */}
          <div style={{ textAlign:"center", ...fade(0.58) }}>
            <div style={{
              fontFamily:"'Amiri', serif",
              fontSize:"clamp(1rem,3.2vw,1.4rem)",
              color:"#1a5c36",
              marginBottom:"8px",
              letterSpacing:"0.08em",
            }}>رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ</div>
            <div style={{
              fontFamily:"'Cormorant Garamond', serif",
              fontStyle:"italic",
              fontSize:"clamp(0.8rem,2vw,1rem)",
              color:"#6b5020",
              letterSpacing:"0.12em",
              lineHeight:2,
            }}>
              "Dua is the best present"<br/>
              <span style={{
                fontFamily:"'Playfair Display', serif",
                fontStyle:"normal",
                fontSize:"clamp(0.62rem,1.5vw,0.74rem)",
                letterSpacing:"0.32em",
                textTransform:"uppercase",
                color:"#a07230",
              }}>Your dignified presence with your family is humbly requested</span>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Great+Vibes&family=Amiri:ital,wght@0,400;0,700;1,400&display=swap');
        @keyframes petalFall{0%{transform:translateY(-20px) rotate(0);opacity:0}10%{opacity:.6}90%{opacity:.4}100%{transform:translateY(110vh) rotate(540deg);opacity:0}}
        @keyframes twinkle{0%,100%{opacity:.15;transform:scale(1)}50%{opacity:.85;transform:scale(2)}}
      `}</style>
    </div>
  );
}

export default function App() {
  const [opened, setOpened] = useState(false);
  return opened ? <InvitationCard /> : <EnvelopePage onOpen={() => setOpened(true)} />;
}