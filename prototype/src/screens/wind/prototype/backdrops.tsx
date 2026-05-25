// PROTOTYPE — per-scene cinematic backdrops for the Wind Power Curve quest.
// The activity tells the story of one turbine across half a day, so the
// backdrops walk a matching time-of-day arc:
//
//   dawn   → Welcome           (the quest begins, sun rising over the farm)
//   day    → Meet Your Guide   (bright morning at a wind-energy field station)
//   cutawayBlades → Catching the Wind (looking up through spinning blades)
//   cutawayNacelle → Inside the Nacelle (gearbox & generator close-up)
//   cutawayGrid → From Turbine to Grid (power flowing to the grid)
//   windy  → Watch It Work     (a brisk, active afternoon — blades spinning hard)
//   cutaway → How It Works     (technical cross-section — a turbine laid bare)
//   dusk   → Notice & Wonder   (golden hour — calm, reflective)
//   reveal → Act 3             (nightfall — the curve traced in light overhead)
//
// All hand-drawn SVG so no image assets are needed. Rendered crisp during the
// between-scene pause, then blurred behind the scene content.

// Act 1 walks a half-day arc (dawn → dusk). Act 2 ("Investigate") gets one
// Act-wide technical backdrop: a turbine as a blueprint line-drawing on
// engineering grid paper. Act 3 ("Reveal") gets one Act-wide night backdrop:
// the day is done and the power curve hangs overhead, traced in light.
export type BackdropVariant = 'dawn' | 'day' | 'windy' | 'cutaway' | 'cutawayBlades' | 'cutawayNacelle' | 'cutawayGrid' | 'dusk' | 'blueprint' | 'reveal';

// Shared turbine — tower + three blades rotating around the hub at (0,-150).
function Turbine({
  x,
  y,
  s = 1,
  fill,
  dur = 8,
}: {
  x: number;
  y: number;
  s?: number;
  fill: string;
  dur?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-5} y={-150} width={10} height={150} fill={fill} />
      <g style={{ transformOrigin: '0px -150px', animation: `windspin ${dur}s linear infinite` }}>
        {[0, 120, 240].map((d) => (
          <rect
            key={d}
            x={-4.5}
            y={-242}
            width={9}
            height={94}
            rx={4}
            fill={fill}
            transform={`rotate(${d} 0 -150)`}
          />
        ))}
        <circle cx={0} cy={-150} r={8} fill={fill} />
      </g>
    </g>
  );
}

function Cloud({ x, y, s = 1, fill = '#ffffff', opacity = 0.9 }: { x: number; y: number; s?: number; fill?: string; opacity?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity}>
      <ellipse cx={0} cy={0} rx={60} ry={26} fill={fill} />
      <ellipse cx={42} cy={-10} rx={42} ry={30} fill={fill} />
      <ellipse cx={-44} cy={-4} rx={38} ry={24} fill={fill} />
      <ellipse cx={6} cy={-22} rx={34} ry={26} fill={fill} />
    </g>
  );
}

export function SceneBackdrop({ variant }: { variant: BackdropVariant }) {
  return (
    <svg viewBox="0 0 1600 800" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <style>{`
        @keyframes windspin { to { transform: rotate(360deg); } }
        @keyframes bgdrift { to { transform: translateX(140px); } }
      `}</style>

      {variant === 'dawn' && (
        <>
          <defs>
            <linearGradient id="bg-dawn" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#16243f" />
              <stop offset="34%" stopColor="#4a3a6b" />
              <stop offset="64%" stopColor="#c25e7e" />
              <stop offset="86%" stopColor="#f0a07a" />
              <stop offset="100%" stopColor="#fbd59e" />
            </linearGradient>
          </defs>
          <rect width="1600" height="800" fill="url(#bg-dawn)" />
          {/* fading stars */}
          {[
            [180, 90], [340, 160], [520, 70], [760, 130], [1020, 95],
            [1260, 150], [1420, 80], [620, 220], [1140, 230],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r={i % 3 === 0 ? 2.4 : 1.6} fill="#ffffff" opacity={0.55} />
          ))}
          {/* rising sun */}
          <circle cx={800} cy={640} r={170} fill="#ffe6b0" opacity={0.35} />
          <ellipse cx={800} cy={640} rx={95} ry={92} fill="#ffe9bc" />
          {/* hills */}
          <path d="M0,560 Q400,490 800,545 T1600,520 V800 H0 Z" fill="#5b4a73" opacity="0.9" />
          <path d="M0,650 Q500,580 1000,645 T1600,620 V800 H0 Z" fill="#3e3357" />
          {/* distant turbine row */}
          <Turbine x={210} y={560} s={0.62} fill="#1c2438" dur={11} />
          <Turbine x={470} y={540} s={0.72} fill="#1c2438" dur={9} />
          <Turbine x={760} y={552} s={0.6} fill="#1c2438" dur={12} />
          <Turbine x={1080} y={538} s={0.78} fill="#1c2438" dur={10} />
          <Turbine x={1380} y={556} s={0.66} fill="#1c2438" dur={9.5} />
        </>
      )}

      {variant === 'day' && (
        <>
          <defs>
            <linearGradient id="bg-day" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5fb4e8" />
              <stop offset="55%" stopColor="#a9dcf2" />
              <stop offset="100%" stopColor="#e4f5fb" />
            </linearGradient>
          </defs>
          <rect width="1600" height="800" fill="url(#bg-day)" />
          <circle cx={1320} cy={150} r={120} fill="#fff8d8" opacity={0.45} />
          <circle cx={1320} cy={150} r={62} fill="#fffbe8" />
          <g style={{ animation: 'bgdrift 60s linear infinite' }}>
            <Cloud x={300} y={170} s={1.1} />
            <Cloud x={780} y={120} s={0.85} opacity={0.8} />
            <Cloud x={1150} y={240} s={1} opacity={0.85} />
          </g>
          {/* hills */}
          <path d="M0,540 Q400,470 800,525 T1600,500 V800 H0 Z" fill="#7ba35a" />
          <path d="M0,640 Q500,580 1000,635 T1600,610 V800 H0 Z" fill="#587b3c" />
          {/* field station beside a turbine base */}
          <g transform="translate(560 660)">
            <rect x={-70} y={-58} width={140} height={58} fill="#e7ecef" />
            <path d="M-82,-58 L0,-92 L82,-58 Z" fill="#9aa6ad" />
            <rect x={-46} y={-40} width={26} height={26} fill="#8fc7e6" />
            <rect x={18} y={-40} width={26} height={40} fill="#6b7b86" />
            <line x1={48} y1={-92} x2={48} y2={-128} stroke="#6b7b86" strokeWidth={4} />
            <circle cx={48} cy={-130} r={5} fill="#ef4444" />
          </g>
          <Turbine x={720} y={650} s={1.05} fill="#eef3f6" dur={7} />
          <Turbine x={1080} y={620} s={0.92} fill="#eef3f6" dur={8} />
          <Turbine x={1380} y={642} s={0.8} fill="#dde6ea" dur={7.5} />
        </>
      )}

      {variant === 'windy' && (
        <>
          <defs>
            <linearGradient id="bg-windy" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6f8298" />
              <stop offset="55%" stopColor="#aab7c6" />
              <stop offset="100%" stopColor="#cdd6df" />
            </linearGradient>
          </defs>
          <rect width="1600" height="800" fill="url(#bg-windy)" />
          <circle cx={1080} cy={170} r={70} fill="#eef1f4" opacity={0.55} />
          {/* streaked, fast-moving clouds */}
          <g style={{ animation: 'bgdrift 22s linear infinite' }}>
            {[[200, 130], [620, 90], [980, 200], [1300, 140]].map(([cx, cy], i) => (
              <ellipse key={i} cx={cx} cy={cy} rx={140} ry={20} fill="#e8edf1" opacity={0.7} />
            ))}
          </g>
          {/* wind streaks */}
          {[260, 360, 470].map((y, i) => (
            <path
              key={i}
              d={`M${120 + i * 40},${y} q120,-26 260,0 t260,0`}
              fill="none"
              stroke="#ffffff"
              strokeWidth={3}
              strokeLinecap="round"
              opacity={0.35}
            />
          ))}
          <path d="M0,560 Q400,500 800,550 T1600,535 V800 H0 Z" fill="#67785f" />
          <path d="M0,660 Q500,610 1000,655 T1600,640 V800 H0 Z" fill="#44513f" />
          {/* large active turbines */}
          <Turbine x={420} y={720} s={1.55} fill="#2b3340" dur={3} />
          <Turbine x={1120} y={700} s={1.35} fill="#2b3340" dur={3.4} />
          <Turbine x={1480} y={690} s={0.9} fill="#3a4350" dur={3.8} />
        </>
      )}

      {variant === 'cutawayBlades' && (
        <>
          <defs>
            <linearGradient id="bg-cutawayBlades" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6f8298" />
              <stop offset="40%" stopColor="#8a9baa" />
              <stop offset="100%" stopColor="#2d3a4a" />
            </linearGradient>
          </defs>
          <rect width="1600" height="800" fill="url(#bg-cutawayBlades)" />
          {/* Cloudy sky texture */}
          {[[100, 60], [400, 90], [750, 50], [1100, 110], [1400, 70]].map(([cx, cy], i) => (
            <ellipse key={i} cx={cx} cy={cy} rx={220} ry={40} fill="#fff" opacity={0.04 + i * 0.01} />
          ))}
          {/* Large blade shapes — low-angle perspective looking up.
              The entire hub rotates so the blades spin continuously,
              matching Dr. Vela's narration about the turning rotor. */}
          <g transform="translate(800 400)" fill="#1a2635" opacity={0.7} style={{ transformOrigin: '800px 340px', animation: 'windspin 10s linear infinite' }}>
            {/* Blade 1 — curving up-left */}
            <path d="M-20,-100 Q-260,-340 -480,-480 Q-460,-520 -260,-400 Q-60,-260 0,-40 Z" />
            {/* Blade 2 — curving up-right */}
            <path d="M20,-100 Q260,-340 480,-480 Q460,-520 260,-400 Q60,-260 0,-40 Z" />
            {/* Blade 3 — going straight up */}
            <path d="M-15,-100 L-40,-480 L15,-480 L15,-100 Z" />
            {/* Hub center */}
            <circle cx={0} cy={-60} r={28} fill="#2d3a4a" />
          </g>
          <path d="M764,420 L778,800 H822 L836,420 Z" fill="#1a2635" opacity={0.6} />
          <g stroke="#ffffff" strokeLinecap="round" fill="none" opacity={0.2}>
            {[100, 200, 320, 450, 560, 700, 820, 950].map((y, i) => (
              <path key={i} d={`M${60 + i * 40},${y} q160,-30 340,0`} strokeWidth={2 + (i % 3)}>
                <animate attributeName="opacity" values="0.1;0.3;0.1" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
              </path>
            ))}
          </g>
        </>
      )}

      {variant === 'cutawayNacelle' && (
        <>
          <defs>
            <linearGradient id="bg-cutawayNacelle" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0c1f3c" />
              <stop offset="50%" stopColor="#1a3257" />
              <stop offset="100%" stopColor="#2d4850" />
            </linearGradient>
            <linearGradient id="nacelle-glow" x1="0.5" y1="0" x2="0.5" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>
          <rect width="1600" height="800" fill="url(#bg-cutawayNacelle)" />
          {Array.from({ length: 26 }, (_, i) => i * 64).map((x) => (
            <line key={`nv${x}`} x1={x} y1={0} x2={x} y2={800} stroke="#fff" strokeWidth={1} opacity={0.03} />
          ))}
          {Array.from({ length: 14 }, (_, i) => i * 64).map((y) => (
            <line key={`nh${y}`} x1={0} y1={y} x2={1600} y2={y} stroke="#fff" strokeWidth={1} opacity={0.03} />
          ))}
          <ellipse cx={800} cy={400} rx={300} ry={150} fill="url(#nacelle-glow)" />
          <g transform="translate(800 280)">
            <rect x={-200} y={-60} width={400} height={120} rx={16} fill="#94a3b8" opacity={0.15} stroke="#b0c4de" strokeWidth={2} />
            <rect x={-160} y={-8} width={120} height={16} rx={4} fill="#7a8ba3" />
            <circle cx={-160} cy={0} r={18} fill="#5c6b82" stroke="#7a8ba3" strokeWidth={2} />
            <g transform="translate(-40 0)">
              <circle cx={0} cy={0} r={34} fill="#3a4a62" stroke="#7a8ba3" strokeWidth={2.5} />
              <circle cx={34} cy={0} r={18} fill="#4a5a72" stroke="#7a8ba3" strokeWidth={2.5} />
              {Array.from({ length: 16 }, (_, i) => i * 22.5).map((d) => (
                <line key={d} x1={0} y1={-36} x2={0} y2={-42} stroke="#7a8ba3" strokeWidth={3.5} transform={`rotate(${d})`} opacity={0.7}>
                  <animateTransform attributeName="transform" type="rotate" from={`${d}`} to={`${d + 360}`} dur="3s" repeatCount="indefinite" />
                </line>
              ))}
              <circle cx={0} cy={0} r={6} fill="#7a8ba3" />
              <circle cx={34} cy={0} r={5} fill="#7a8ba3" />
            </g>
            <rect x={54} y={-5} width={100} height={10} rx={3} fill="#94a3b8" />
            <rect x={154} y={-36} width={60} height={72} rx={6} fill="#3a4a62" stroke="#7a8ba3" strokeWidth={2.5} />
            <rect x={162} y={-24} width={44} height={48} rx={3} fill="#4a5a72" />
            <ellipse cx={184} cy={0} rx={16} ry={7} fill="none" stroke="#f59e0b" strokeWidth={2.5} opacity={0.9}>
              <animate attributeName="rx" values="16;12;16" dur="0.3s" repeatCount="indefinite" />
            </ellipse>
            <text x={184} y={4} textAnchor="middle" fill="#f59e0b" fontSize={18} fontFamily="monospace" fontWeight="bold">G</text>
          </g>
          <g fontFamily="sans-serif" fontSize={11} fill="#cfe2f5">
            <line x1={760} y1={225} x2={720} y2={160} stroke="#7a8ba3" strokeWidth={1.5} />
            <rect x={600} y={135} width={135} height={38} rx={4} fill="#1e293b" fillOpacity={0.75} />
            <text x={610} y={155} fontSize={11} fontWeight="bold" fill="#e0e8f0">LOW-SPEED SHAFT</text>
            <text x={610} y={168} fontSize={9} fill="#94a3b8">~20 RPM from rotor</text>
            <line x1={760} y1={265} x2={680} y2={330} stroke="#7a8ba3" strokeWidth={1.5} />
            <rect x={555} y={330} width={140} height={38} rx={4} fill="#1e293b" fillOpacity={0.75} />
            <text x={565} y={350} fontSize={11} fontWeight="bold" fill="#e0e8f0">GEARBOX</text>
            <text x={565} y={363} fontSize={9} fill="#94a3b8">10:1 speed increase</text>
            <line x1={984} y1={265} x2={1020} y2={330} stroke="#7a8ba3" strokeWidth={1.5} />
            <rect x={1025} y={330} width={145} height={38} rx={4} fill="#1e293b" fillOpacity={0.75} />
            <text x={1035} y={350} fontSize={11} fontWeight="bold" fill="#e0e8f0">GENERATOR</text>
            <text x={1035} y={363} fontSize={9} fill="#94a3b8">Motion → electricity</text>
          </g>
        </>
      )}

      {variant === 'cutawayGrid' && (
        <>
          <defs>
            <linearGradient id="bg-cutawayGrid" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2c2150" />
              <stop offset="35%" stopColor="#7a3a7e" />
              <stop offset="65%" stopColor="#e06a4f" />
              <stop offset="85%" stopColor="#f7a64d" />
              <stop offset="100%" stopColor="#1a1a2a" />
            </linearGradient>
          </defs>
          <rect width="1600" height="800" fill="url(#bg-cutawayGrid)" />
          <circle cx={1100} cy={480} r={80} fill="#ffd89a" opacity={0.3} />
          <circle cx={1100} cy={480} r={45} fill="#ffe7ad" />
          <path d="M0,580 Q200,540 400,570 T800,560 T1200,580 T1600,560 V800 H0 Z" fill="#2a1e35" opacity={0.8} />
          <path d="M0,660 Q300,620 600,650 T1200,640 T1600,660 V800 H0 Z" fill="#161026" />
          <g transform="translate(300 420)">
            <rect x={-5} y={0} width={10} height={180} fill="#1a1530" />
            <g style={{ transformOrigin: '0px 0px', animation: 'windspin 5s linear infinite' }}>
              {[0, 120, 240].map((d) => (
                <rect key={d} x={-5} y={-90} width={10} height={95} rx={4} fill="#1a1530" transform={`rotate(${d} 0 0)`} />
              ))}
              <circle cx={0} cy={0} r={8} fill="#1a1530" />
            </g>
          </g>
          <path d="M295,420 L295,600" fill="none" stroke="#f59e0b" strokeWidth={4} opacity={0.8} strokeLinecap="round">
            <animate attributeName="stroke-dashoffset" from="60" to="0" dur="1s" repeatCount="indefinite" />
            <animate attributeName="stroke-dasharray" values="8,12" dur="1s" repeatCount="indefinite" />
          </path>
          <rect x={310} y={590} width={30} height={24} rx={2} fill="#3a2a40" stroke="#f59e0b" strokeWidth={1.5} />
          <text x={325} y={606} textAnchor="middle" fill="#f59e0b" fontSize={10} fontFamily="monospace" fontWeight="bold">⇢</text>
          <g fill="none" stroke="#94a3b8" strokeWidth={2} opacity={0.5}>
            {[-20, 0, 20].map((offset) => (
              <path key={offset} d={`M340,600 Q500,560 700,580 T1100,570 T1400,575`} transform={`translate(0 ${offset})`} />
            ))}
          </g>
          <circle cx={500} cy={580} r={4} fill="#fbbf24">
            <animate attributeName="cx" values="340;1400" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0.3;1" dur="3s" repeatCount="indefinite" />
          </circle>
          <g transform="translate(1200 620)" fill="#1a1530">
            {[0, 30, 55, 85, 110].map((x, i) => (
              <rect key={i} x={x} y={-24 - i * 10} width={20} height={24 + i * 10} rx={1} />
            ))}
            {[0, 60].map((x) => (
              <rect key={`h${x}`} x={x} y={-12} width={14} height={12} />
            ))}
            {[[5, -16], [10, -28], [40, -22], [65, -20], [70, -36], [95, -30]].map(([wx, wy], i) => (
              <rect key={i} x={wx} y={wy} width={4} height={4} fill="#fbbf24" opacity={0.8} />
            ))}
          </g>
          <text x={660} y={760} textAnchor="middle" fill="#e0e8f0" fontSize={12} fontFamily="sans-serif" fontWeight="bold" opacity={0.6}>
            THE ELECTRICAL GRID ⚡
          </text>
        </>
      )}

      {variant === 'cutaway' && (
        <>
          <defs>
            <linearGradient id="bg-cutaway" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1a2b4c" />
              <stop offset="50%" stopColor="#2d4370" />
              <stop offset="100%" stopColor="#4a618f" />
            </linearGradient>
            <linearGradient id="nacelle-body" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d1d9e6" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>
            <linearGradient id="tower-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#5c6b82" />
              <stop offset="30%" stopColor="#94a3b8" />
              <stop offset="70%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#5c6b82" />
            </linearGradient>
          </defs>
          <rect width="1600" height="800" fill="url(#bg-cutaway)" />

          {/* Grid lines (subtle reference behind the turbine) */}
          {Array.from({ length: 26 }, (_, i) => i * 64).map((x) => (
            <line key={`cv${x}`} x1={x} y1={0} x2={x} y2={800} stroke="#fff" strokeWidth={1} opacity={0.04} />
          ))}
          {Array.from({ length: 14 }, (_, i) => i * 64).map((y) => (
            <line key={`ch${y}`} x1={0} y1={y} x2={1600} y2={y} stroke="#fff" strokeWidth={1} opacity={0.04} />
          ))}

          {/* Tower — cross-section cutaway showing internal cable */}
          <g transform="translate(800 0)">
            {/* Tower exterior (left, right half-shells) */}
            <path d="M-48,260 L-22,560 L-18,620 L-18,800 L-40,800 L-48,260 Z" fill="#5c6b82" opacity={0.6} />
            <path d="M48,260 L22,560 L18,620 L18,800 L40,800 L48,260 Z" fill="#5c6b82" opacity={0.6} />
            {/* Tower interior — the empty space between */}
            <path d="M-18,620 L-22,560 L22,560 L18,620 Z" fill="#2d4370" opacity={0.4} />
            {/* Power cable running down inside the tower */}
            <path
              d="M0,260 L0,800"
              fill="none"
              stroke="#f59e0b"
              strokeWidth={3}
              opacity={0.8}
              strokeLinecap="round"
            >
              <animate attributeName="stroke-dashoffset" from="160" to="0" dur="2s" repeatCount="indefinite" />
              <animate attributeName="stroke-dasharray" values="8,12" dur="2s" repeatCount="indefinite" />
            </path>
            {/* Arrow labels on the cable */}
            <polygon points="-6,400 6,400 0,412" fill="#f59e0b" opacity={0.6}>
              <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2s" repeatCount="indefinite" />
            </polygon>
            <polygon points="-6,520 6,520 0,532" fill="#f59e0b" opacity={0.6}>
              <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2s" repeatCount="indefinite" />
            </polygon>
          </g>

          {/* Nacelle — cutaway box with internal parts */}
          <g transform="translate(800 100)">
            {/* Nacelle housing (semi-transparent shell) */}
            <rect x={-120} y={-48} width={240} height={96} rx={12} fill="url(#nacelle-body)" opacity={0.35} stroke="#7a8ba3" strokeWidth={2} />
            {/* Nacelle outline */}
            <rect x={-120} y={-48} width={240} height={96} rx={12} fill="none" stroke="#b0c4de" strokeWidth={1.5} opacity={0.7} />
            {/* Low-speed shaft from hub */}
            <rect x={20} y={-6} width={100} height={12} rx={3} fill="#7a8ba3" />
            {/* Gearbox: large ⇐ small gears */}
            <g transform="translate(30 0)">
              <circle cx={0} cy={0} r={22} fill="#3a4a62" stroke="#7a8ba3" strokeWidth={1.5} />
              <circle cx={22} cy={0} r={12} fill="#4a5a72" stroke="#7a8ba3" strokeWidth={1.5} />
              <circle cx={0} cy={0} r={3} fill="#7a8ba3" />
              <circle cx={22} cy={0} r={3} fill="#7a8ba3" />
            </g>
            {/* High-speed shaft from gearbox to generator */}
            <rect x={62} y={-4} width={78} height={8} rx={2} fill="#94a3b8" />
            {/* Generator */}
            <rect x={140} y={-28} width={46} height={56} rx={4} fill="#3a4a62" stroke="#7a8ba3" strokeWidth={1.5} />
            <rect x={148} y={-18} width={30} height={36} rx={2} fill="#4a5a72" />
            {/* Generator rotation indicator */}
            <ellipse cx={163} cy={0} rx={10} ry={4} fill="none" stroke="#f59e0b" strokeWidth={1.5} opacity={0.8}>
              <animate attributeName="rx" values="10;8;10" dur="0.4s" repeatCount="indefinite" />
            </ellipse>
            {/* Generator label "G" */}
            <text x={163} y={3} textAnchor="middle" fill="#94a3b8" fontSize={11} fontFamily="monospace" fontWeight="bold">G</text>

            {/* Labels with leader lines */}
            <g fontFamily="sans-serif" fontSize={10} fill="#e0e8f0">
              {/* Hub / blades label */}
              <line x1={-80} y1={-10} x2={-80} y2={-80} stroke="#7a8ba3" strokeWidth={1} strokeDasharray="3 3" />
              <text x={-120} y={-90} fontSize={9} fill="#cfe2f5">BLADES & HUB</text>
              <text x={-120} y={-78} fontSize={8} fill="#94a3b8">Wind spins the rotor</text>

              {/* Gearbox label */}
              <line x1={30} y1={-30} x2={30} y2={-80} stroke="#7a8ba3" strokeWidth={1} strokeDasharray="3 3" />
              <text x={10} y={-90} fontSize={9} fill="#cfe2f5">GEARBOX</text>
              <text x={10} y={-78} fontSize={8} fill="#94a3b8">Spins up the shaft</text>

              {/* Generator label */}
              <line x1={163} y1={-35} x2={163} y2={-80} stroke="#7a8ba3" strokeWidth={1} strokeDasharray="3 3" />
              <text x={140} y={-90} fontSize={9} fill="#cfe2f5">GENERATOR</text>
              <text x={140} y={-78} fontSize={8} fill="#94a3b8">Motion → electricity</text>
            </g>

            {/* Spinning blades (visible above the nacelle, connected to hub) */}
            <g style={{ transformOrigin: '-80px 0px', animation: 'windspin 6s linear infinite' }}>
              {[0, 120, 240].map((d) => (
                <path
                  key={d}
                  d="M-82,-4 L-140,-64 L-144,-58 L-84,-2 Z"
                  fill="#94a3b8"
                  opacity={0.7}
                  transform={`rotate(${d} -80 0)`}
                />
              ))}
              <circle cx={-80} cy={0} r={10} fill="#7a8ba3" />
            </g>

            {/* Wind particles flowing from left to right through blades */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <circle
                key={i}
                cx={-200}
                cy={-20 + i * 12}
                r={2}
                fill="#ffffff"
                opacity={0.4}
              >
                <animate
                  attributeName="cx"
                  values={`${-200 - i * 40};${40 - i * 40}`}
                  dur={`${2 + i * 0.3}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.5;0.9;0.5;0"
                  dur={`${2 + i * 0.3}s`}
                  repeatCount="indefinite"
                />
              </circle>
            ))}
          </g>

          {/* Ground line */}
          <line x1={0} y1={620} x2={1600} y2={620} stroke="#2d4370" strokeWidth={2} opacity={0.5} />
          <path d="M0,620 Q200,600 400,618 T800,620 T1200,615 T1600,620 V800 H0 Z" fill="#1a2b4c" opacity={0.6} />

          {/* Transformer and grid connection at tower base */}
          <g transform="translate(740 640)">
            <rect x={0} y={0} width={40} height={32} rx={3} fill="#3a4a62" stroke="#7a8ba3" strokeWidth={1} />
            <text x={20} y={20} textAnchor="middle" fill="#f59e0b" fontSize={9} fontFamily="monospace" fontWeight="bold">⇢</text>
            <text x={-28} y={20} textAnchor="middle" fill="#94a3b8" fontSize={8} fontFamily="sans-serif">TO GRID</text>
            <line x1={40} y1={16} x2={72} y2={16} stroke="#f59e0b" strokeWidth={2} opacity={0.7} strokeDasharray="4 4">
              <animate attributeName="stroke-dashoffset" from="16" to="0" dur="1s" repeatCount="indefinite" />
            </line>
          </g>

          {/* Power label — animated from generator down */}
          <g transform="translate(840 100)">
            <text x={0} y={-80} textAnchor="middle" fill="#f59e0b" fontSize={11} fontFamily="sans-serif" fontWeight="bold" opacity={0.8}>
              POWER ⇣
              <animate attributeName="opacity" values="0.8;0.3;0.8" dur="1.5s" repeatCount="indefinite" />
            </text>
          </g>
        </>
      )}

      {variant === 'dusk' && (
        <>
          <defs>
            <linearGradient id="bg-dusk" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2c2150" />
              <stop offset="40%" stopColor="#7a3a7e" />
              <stop offset="70%" stopColor="#e06a4f" />
              <stop offset="89%" stopColor="#f7a64d" />
              <stop offset="100%" stopColor="#ffd89a" />
            </linearGradient>
          </defs>
          <rect width="1600" height="800" fill="url(#bg-dusk)" />
          <circle cx={800} cy={560} r={240} fill="#ffdf9e" opacity={0.3} />
          <ellipse cx={800} cy={560} rx={135} ry={130} fill="#ffe7ad" />
          {/* warm haze bands */}
          {[470, 510, 548].map((y, i) => (
            <ellipse key={i} cx={800} cy={y} rx={760 - i * 40} ry={9} fill="#ffcaa0" opacity={0.3} />
          ))}
          <path d="M0,580 Q420,520 840,565 T1600,545 V800 H0 Z" fill="#3a2d3a" opacity="0.92" />
          <path d="M0,670 Q520,615 1040,660 T1600,640 V800 H0 Z" fill="#211a20" />
          <Turbine x={300} y={585} s={0.9} fill="#15101a" dur={9} />
          <Turbine x={640} y={570} s={1.05} fill="#15101a" dur={8} />
          <Turbine x={1010} y={580} s={0.78} fill="#15101a" dur={10} />
          <Turbine x={1340} y={566} s={0.95} fill="#15101a" dur={8.6} />
        </>
      )}

      {variant === 'blueprint' && (
        <>
          <defs>
            <linearGradient id="bg-blue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0c2143" />
              <stop offset="60%" stopColor="#173356" />
              <stop offset="100%" stopColor="#244a78" />
            </linearGradient>
          </defs>
          <rect width="1600" height="800" fill="url(#bg-blue)" />
          {/* engineering grid paper */}
          {Array.from({ length: 26 }, (_, i) => i * 64).map((x) => (
            <line key={`bv${x}`} x1={x} y1={0} x2={x} y2={800} stroke="#6f9fd0" strokeWidth={1} opacity={0.14} />
          ))}
          {Array.from({ length: 14 }, (_, i) => i * 64).map((y) => (
            <line key={`bh${y}`} x1={0} y1={y} x2={1600} y2={y} stroke="#6f9fd0" strokeWidth={1} opacity={0.14} />
          ))}
          {/* the sketched power curve — what Act 2 investigates */}
          <path
            d="M180,700 C520,692 760,470 1420,210"
            fill="none"
            stroke="#7ec8f5"
            strokeWidth={3}
            strokeDasharray="9 8"
            opacity={0.55}
          />
          {/* turbine as a blueprint line-drawing */}
          <g transform="translate(800 720)" stroke="#cfe2f5" strokeWidth={3} fill="none">
            <path d="M-22,0 L-9,-300 L9,-300 L22,0 Z" />
            <rect x={-26} y={-326} width={52} height={26} rx={4} />
            <g style={{ transformOrigin: '0px -313px', animation: 'windspin 14s linear infinite' }}>
              {[0, 120, 240].map((d) => (
                <rect key={d} x={-7} y={-470} width={14} height={150} rx={7} transform={`rotate(${d} 0 -313)`} />
              ))}
              <circle cx={0} cy={-313} r={13} />
            </g>
          </g>
          {/* dimension line */}
          <g stroke="#7ec8f5" strokeWidth={2} opacity={0.5}>
            <line x1={120} y1={150} x2={120} y2={720} />
            <line x1={112} y1={150} x2={128} y2={150} />
            <line x1={112} y1={720} x2={128} y2={720} />
            {[280, 430, 580].map((y) => (
              <line key={y} x1={114} y1={y} x2={126} y2={y} />
            ))}
          </g>
          <line x1={0} y1={720} x2={1600} y2={720} stroke="#cfe2f5" strokeWidth={2} opacity={0.6} />
        </>
      )}

      {variant === 'reveal' && (
        <>
          <defs>
            <linearGradient id="bg-reveal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#070b24" />
              <stop offset="44%" stopColor="#161f47" />
              <stop offset="76%" stopColor="#34406d" />
              <stop offset="100%" stopColor="#5f6788" />
            </linearGradient>
            <linearGradient id="reveal-curve" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#7dd3fc" />
              <stop offset="58%" stopColor="#bae6fd" />
              <stop offset="100%" stopColor="#fde68a" />
            </linearGradient>
          </defs>
          <rect width="1600" height="800" fill="url(#bg-reveal)" />
          {/* aurora — soft glowing bands high in the night sky */}
          {[
            ['#3f7fd6', 0.16, 150],
            ['#46c9b4', 0.13, 210],
            ['#8a6fd6', 0.1, 110],
          ].map(([fill, op, cy], i) => (
            <ellipse
              key={i}
              cx={800}
              cy={cy as number}
              rx={860}
              ry={70}
              fill={fill as string}
              opacity={op as number}
            />
          ))}
          {/* stars */}
          {[
            [120, 70], [260, 140], [410, 60], [560, 120], [690, 200], [830, 90],
            [980, 160], [1130, 70], [1280, 140], [1420, 80], [1500, 210],
            [200, 240], [470, 230], [1040, 250], [1340, 250], [620, 40],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r={i % 4 === 0 ? 2.6 : 1.6} fill="#ffffff" opacity={0.7} />
          ))}
          {/* the revealed power curve, traced in light across the sky:
              flat (cut-in) → quadratic (ramp-up) → flat (rated) */}
          <g strokeLinecap="round" fill="none">
            <path
              d="M170,470 H470 C660,470 850,360 1010,200 H1430"
              stroke="url(#reveal-curve)"
              strokeWidth={16}
              opacity={0.22}
            />
            <path
              d="M170,470 H470 C660,470 850,360 1010,200 H1430"
              stroke="url(#reveal-curve)"
              strokeWidth={4}
            />
          </g>
          {/* data points glinting along the curve */}
          {[
            [250, 470], [380, 470], [560, 452], [680, 405], [800, 330],
            [910, 262], [1010, 200], [1180, 200], [1340, 200],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r={4} fill="#e0f2fe" opacity={0.95} />
          ))}
          {/* hills + the turbine farm, dark against the night */}
          <path d="M0,600 Q420,540 840,585 T1600,560 V800 H0 Z" fill="#1b2142" opacity="0.95" />
          <path d="M0,690 Q520,635 1040,680 T1600,655 V800 H0 Z" fill="#0c1029" />
          <Turbine x={250} y={610} s={0.78} fill="#080b1f" dur={10} />
          <Turbine x={600} y={588} s={0.96} fill="#080b1f" dur={8.5} />
          <Turbine x={960} y={600} s={0.7} fill="#080b1f" dur={11} />
          <Turbine x={1290} y={584} s={0.88} fill="#080b1f" dur={9} />
          {/* aircraft-warning lights blinking on the hubs */}
          {[
            [250, 610 - 150 * 0.78],
            [600, 588 - 150 * 0.96],
            [960, 600 - 150 * 0.7],
            [1290, 584 - 150 * 0.88],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r={4.5} fill="#f87171">
              <animate
                attributeName="opacity"
                values="1;0.15;1"
                dur="2.4s"
                begin={`${i * 0.5}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
        </>
      )}
    </svg>
  );
}
