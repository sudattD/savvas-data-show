// PROTOTYPE — per-scene cinematic backdrops for the Wind Power Curve quest.
// The activity tells the story of one turbine across half a day, so the
// backdrops walk a matching time-of-day arc:
//
//   dawn   → Welcome           (the quest begins, sun rising over the farm)
//   day    → Meet Your Guide   (bright morning at a wind-energy field station)
//   windy  → Watch It Work     (a brisk, active afternoon — blades spinning hard)
//   dusk   → Notice & Wonder   (golden hour — calm, reflective)
//   reveal → Act 3             (nightfall — the curve traced in light overhead)
//
// All hand-drawn SVG so no image assets are needed. Rendered crisp during the
// between-scene pause, then blurred behind the scene content.

// Act 1 walks a half-day arc (dawn → dusk). Act 2 ("Investigate") gets one
// Act-wide technical backdrop: a turbine as a blueprint line-drawing on
// engineering grid paper. Act 3 ("Reveal") gets one Act-wide night backdrop:
// the day is done and the power curve hangs overhead, traced in light.
export type BackdropVariant = 'dawn' | 'day' | 'windy' | 'dusk' | 'blueprint' | 'reveal';

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
