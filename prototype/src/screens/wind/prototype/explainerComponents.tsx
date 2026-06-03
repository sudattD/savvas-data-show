// PROTOTYPE — reusable inline SVG components for the three wind turbine
// explainer sub-scenes. Each component is a self-contained SVG diagram
// rendered inside a card on the left column of the split-pane scene layout.

// --------------------------------------------------------------------------
// Sub-scene 3a — blade aerofoil cross-section with lift/drag arrows
// --------------------------------------------------------------------------

export function BladeCrossSection({
  className,
  windSpeed = 6,
  bladeLength = 40,
}: {
  className?: string;
  windSpeed?: number;
  bladeLength?: number;
}) {
  // Spin duration decreases as wind picks up
  const spinDur = Math.max(2, 10 - windSpeed * 0.45);
  // Blade visual length scales with the slider
  const bladeLen = 80 + bladeLength * 1.8;
  // Tower colour
  const towColor = '#4a5a72';

  return (
    <svg viewBox="0 0 800 520" className={className} preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="sky-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7ab8e0" />
          <stop offset="60%" stopColor="#c4e2f0" />
          <stop offset="100%" stopColor="#e8f4f8" />
        </linearGradient>
        <linearGradient id="ground-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7ba35a" />
          <stop offset="100%" stopColor="#4d7a33" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="800" height="520" fill="url(#sky-grad)" />

      {/* Clouds — drift at different speeds */}
      <g fill="#ffffff" opacity={0.5}>
        <ellipse cx={120} cy={60} rx={70} ry={22}><animate attributeName="cx" values="120;200;120" dur={`${20 - windSpeed}s`} repeatCount="indefinite" /></ellipse>
        <ellipse cx={160} cy={55} rx={50} ry={18}><animate attributeName="cx" values="160;240;160" dur={`${20 - windSpeed}s`} repeatCount="indefinite" /></ellipse>
        <ellipse cx={600} cy={80} rx={80} ry={24}><animate attributeName="cx" values="600;520;600" dur={`${24 - windSpeed}s`} repeatCount="indefinite" /></ellipse>
        <ellipse cx={650} cy={74} rx={55} ry={18}><animate attributeName="cx" values="650;570;650" dur={`${24 - windSpeed}s`} repeatCount="indefinite" /></ellipse>
      </g>

      {/* Wind streaks visible at higher speeds */}
      {windSpeed > 6 && Array.from({ length: Math.ceil(windSpeed * 0.3) }).map((_, i) => (
        <path key={i} d={`M${i * 100},${100 + i * 30} q${60 + windSpeed * 5},0 ${120 + windSpeed * 10},0`} fill="none" stroke="#ffffff" strokeWidth={1.5} opacity={0.2 + windSpeed * 0.015}>
          <animate attributeName="opacity" values={`${0.1 + windSpeed * 0.01};${0.3 + windSpeed * 0.02};${0.1 + windSpeed * 0.01}`} dur={`${1.5 - windSpeed * 0.05}s`} repeatCount="indefinite" />
        </path>
      ))}

      {/* Ground */}
      <path d="M0,480 Q200,460 400,475 T800,465 V520 H0 Z" fill="url(#ground-grad)" />
      <path d="M0,505 Q400,490 800,500 V520 H0 Z" fill="#3d6b28" opacity={0.5} />

      {/* === TURBINE === */}
      <g transform="translate(400 0)">
        {/* Tower — tapered */}
        <path d="M-28,200 L-14,330 L-12,480 L12,480 L14,330 L28,200 Z" fill={towColor} />
        <path d="M-28,200 L-14,330 L-12,480 L12,480 L14,330 L28,200 Z" fill="none" stroke="#3a4a62" strokeWidth={1} opacity={0.3} />
        {/* Tower highlight (left side) */}
        <path d="M-28,200 L-22,280 L-10,280 L-14,200 Z" fill="#6a7a92" opacity={0.3} />

        {/* Nacelle */}
        <rect x={-55} y={155} width={120} height={45} rx={6} fill="#5c6b82" />
        <rect x={-55} y={155} width={120} height={45} rx={6} fill="none" stroke="#3a4a62" strokeWidth={1} />
        {/* Nacelle highlight */}
        <rect x={-50} y={158} width={110} height={8} rx={3} fill="#7a8ba3" opacity={0.4} />

        {/* 3-blade rotor at the front of the nacelle */}
        <g style={{ transformOrigin: '-55px 177px', animation: `windspin ${spinDur}s linear infinite` }}>
          {[0, 120, 240].map((d, i) => (
            <path
              key={i}
              d={`M-55,177 L-${(55 + bladeLen * 0.08).toFixed(0)},${(177 - bladeLen).toFixed(0)} L-${(55 - bladeLen * 0.08).toFixed(0)},${(177 - bladeLen).toFixed(0)} Z`}
              fill="#94a3b8"
              stroke="#64748b"
              strokeWidth={1}
              opacity={0.9}
              transform={`rotate(${d} -55 177)`}
            />
          ))}
        </g>
        {/* Hub cone */}
        <path d="M-55,167 Q-65,177 -55,187 Q-45,177 -55,167 Z" fill="#475569" />
        <circle cx={-55} cy={177} r={10} fill="#5c6b82" stroke="#3a4a62" strokeWidth={1.5} />
        <circle cx={-55} cy={177} r={4} fill="#94a3b8" />
      </g>

      {/* Wind particles blowing left to right through the turbine */}
      {Array.from({ length: Math.ceil(2 + windSpeed * 0.5) }).map((_, i) => (
        <circle key={i} r={2} fill="#93c5fd" opacity={0.4}>
          <animate attributeName="cx" values={`${50 - i * 40};${750 - i * 40}`} dur={`${2 + i * 0.3 - windSpeed * 0.07}s`} repeatCount="indefinite" />
          <animate attributeName="cy" values={`${180 + i * 20 + windSpeed};${180 + i * 20 + windSpeed}`} dur={`${2 + i * 0.3 - windSpeed * 0.07}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.6;0" dur={`${2 + i * 0.3 - windSpeed * 0.07}s`} repeatCount="indefinite" />
        </circle>
      ))}

      {/* Labels */}
      <rect x={10} y={6} width={160} height={26} rx={4} fill="#1e293b" opacity={0.7} />
      <text x={16} y={23} fill="#93c5fd" fontSize={12} fontFamily="monospace" fontWeight="bold">
        {windSpeed.toFixed(1)} m/s
      </text>
      <rect x={630} y={6} width={160} height={26} rx={4} fill="#1e293b" opacity={0.7} />
      <text x={636} y={23} fill="#cbd5e1" fontSize={12} fontFamily="monospace" fontWeight="bold">
        {bladeLength}m blades
      </text>
      <rect x={320} y={490} width={160} height={22} rx={4} fill="#1e293b" opacity={0.55} />
      <text x={400} y={505} textAnchor="middle" fill="#e0e8f0" fontSize={10} fontFamily="monospace" fontWeight="bold">
        {spinDur.toFixed(1)}s per rotation
      </text>
    </svg>
  );
}

// --------------------------------------------------------------------------
// Sub-scene 3b — gear train + generator cutaway
// --------------------------------------------------------------------------

export function GearTrain({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 260" className={className} preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="gearGrad1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#64748b" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
        <linearGradient id="gearGrad2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
      </defs>

      {/* Low-speed shaft (horizontal bar from the left) */}
      <rect x={0} y={118} width={120} height={16} rx={4} fill="#64748b" />
      <text x={6} y={108} fill="#94a3b8" fontSize={9} fontFamily="sans-serif">~20 RPM</text>

      {/* Large gear */}
      <g transform="translate(170 125)">
        <circle cx={0} cy={0} r={48} fill="url(#gearGrad1)" stroke="#1e293b" strokeWidth={2} />
        {/* Gear teeth */}
        {Array.from({ length: 16 }, (_, i) => i * 22.5).map((d) => (
          <rect key={d} x={-6} y={-56} width={12} height={16} rx={2} fill="#475569" transform={`rotate(${d})`} />
        ))}
        <circle cx={0} cy={0} r={16} fill="#1e293b" />
        <circle cx={0} cy={0} r={8} fill="#64748b" />
        <text x={0} y={-60} textAnchor="middle" fill="#94a3b8" fontSize={8} fontFamily="sans-serif">80 teeth</text>
      </g>

      {/* Small gear */}
      <g transform="translate(310 125)">
        <circle cx={0} cy={0} r={24} fill="url(#gearGrad2)" stroke="#1e293b" strokeWidth={2} />
        {Array.from({ length: 8 }, (_, i) => i * 45).map((d) => (
          <rect key={d} x={-4} y={-30} width={8} height={10} rx={1.5} fill="#64748b" transform={`rotate(${d})`} />
        ))}
        <circle cx={0} cy={0} r={8} fill="#1e293b" />
        <circle cx={0} cy={0} r={4} fill="#94a3b8" />
        <text x={0} y={-32} textAnchor="middle" fill="#94a3b8" fontSize={8} fontFamily="sans-serif">8 teeth</text>
      </g>

      {/* High-speed shaft */}
      <rect x={334} y={118} width={100} height={16} rx={4} fill="#94a3b8" />
      <text x={370} y={108} fill="#cbd5e1" fontSize={9} fontFamily="sans-serif">~1200+ RPM</text>

      {/* Generator */}
      <g transform="translate(470 125)">
        <rect x={-30} y={-46} width={60} height={92} rx={6} fill="#334155" stroke="#64748b" strokeWidth={2} />
        <rect x={-20} y={-34} width={40} height={68} rx={3} fill="#1e293b" />
        {/* Rotor inside */}
        <ellipse cx={0} cy={0} rx={12} ry={5} fill="none" stroke="#f59e0b" strokeWidth={2.5} opacity={0.9}>
          <animate attributeName="rx" values="12;9;12" dur="0.25s" repeatCount="indefinite" />
        </ellipse>
        <text x={0} y={4} textAnchor="middle" fill="#f59e0b" fontSize={16} fontFamily="monospace" fontWeight="bold">G</text>
        {/* Copper windings */}
        {[-24, -12, 0, 12, 24].map((x) => (
          <rect key={x} x={x - 2} y={-28} width={4} height={56} rx={1} fill="#b45309" opacity={0.5} />
        ))}
      </g>
      <text x={470} y={185} textAnchor="middle" fill="#f59e0b" fontSize={10} fontFamily="sans-serif" fontWeight="bold">GENERATOR</text>

      {/* Arrow from large gear to small gear */}
      <path d="M218,125 Q260,90 286,125" fill="none" stroke="#f59e0b" strokeWidth={2} strokeDasharray="4 4" opacity={0.7}>
        <animate attributeName="stroke-dashoffset" from="16" to="0" dur="0.8s" repeatCount="indefinite" />
      </path>
      <text x={252} y={90} textAnchor="middle" fill="#f59e0b" fontSize={9} fontFamily="sans-serif">10:1 gear ratio</text>
    </svg>
  );
}

// --------------------------------------------------------------------------
// Sub-scene 3c — power flow path diagram
// --------------------------------------------------------------------------

export function PowerFlowPath({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 700 240" className={className} preserveAspectRatio="xMidYMid meet">
      <defs>
        <marker id="pfArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 Z" fill="#f59e0b" />
        </marker>
        <style>{`@keyframes pfpSpin { to { transform: rotate(360deg); } }`}</style>
      </defs>

      {/* Background */}
      <rect x={0} y={0} width={700} height={240} rx={10} fill="#f8fafc" />
      <rect x={0} y={0} width={700} height={240} rx={10} fill="none" stroke="#e2e8f0" strokeWidth={1} />

      {/* ===== Ground line ===== */}
      <line x1={0} y1={170} x2={700} y2={170} stroke="#cbd5e1" strokeWidth={1.5} strokeDasharray="4 3" />

      {/* ===== 1. Turbine (generator + tower cable combined) ===== */}
      <g transform="translate(90 94)">
        {/* Tower */}
        <rect x={-5} y={0} width={10} height={76} fill="#94a3b8" rx={1} />
        {/* Nacelle */}
        <rect x={-18} y={-14} width={44} height={24} rx={4} fill="#475569" />
        {/* Blades */}
        <g style={{ transformOrigin: '4px 0px', animation: 'pfpSpin 4s linear infinite' }}>
          {[0, 120, 240].map((d) => (
            <rect key={d} x={1} y={-36} width={6} height={38} rx={2} fill="#64748b" transform={`rotate(${d} 4 0)`} />
          ))}
          <circle cx={4} cy={0} r={5} fill="#475569" />
        </g>
        {/* Generator label inside nacelle */}
        <text x={4} y={3} textAnchor="middle" fill="#f59e0b" fontSize={10} fontFamily="monospace" fontWeight="bold">G</text>
        {/* Amber power line down tower */}
        <rect x={-1.5} y={16} width={3} height={56} rx={1.5} fill="#f59e0b" opacity={0.85}>
          <animate attributeName="opacity" values="0.4;1;0.4" dur="1s" repeatCount="indefinite" />
        </rect>
        {/* Label below */}
        <text x={4} y={92} textAnchor="middle" fill="#334155" fontSize={10} fontFamily="sans-serif" fontWeight={700}>Generator</text>
        <text x={4} y={104} textAnchor="middle" fill="#64748b" fontSize={8} fontFamily="sans-serif">medium voltage</text>
      </g>

      {/* ===== Arrow 1→2 ===== */}
      <g transform="translate(135 94)">
        <path d="M0,0 L32,0" fill="none" stroke="#f59e0b" strokeWidth={2.5} markerEnd="url(#pfArrow)" />
        <text x={16} y={-8} textAnchor="middle" fill="#94a3b8" fontSize={7} fontFamily="sans-serif">cable</text>
      </g>

      {/* ===== 2. Tower ===== */}
      <g transform="translate(210 94)">
        {/* Tower cross-section */}
        <path d="M-12,0 L-8,-70 L8,-70 L12,0 Z" fill="#e2e8f0" stroke="#94a3b8" strokeWidth={1} />
        <path d="M-12,0 L-8,-70 L8,-70 L12,0 Z" fill="none" stroke="#cbd5e1" strokeWidth={0.5} />
        {/* Internal cable */}
        <rect x={-2} y={-66} width={4} height={62} rx={2} fill="#f59e0b" opacity={0.85}>
          <animate attributeName="opacity" values="0.4;1;0.4" dur="0.8s" repeatCount="indefinite" />
        </rect>
        <text x={0} y={92} textAnchor="middle" fill="#334155" fontSize={10} fontFamily="sans-serif" fontWeight={700}>Tower cable</text>
        <text x={0} y={104} textAnchor="middle" fill="#64748b" fontSize={8} fontFamily="sans-serif">carries power down</text>
      </g>

      {/* ===== Arrow 2→3 ===== */}
      <path d="M225,94 L255,94" fill="none" stroke="#f59e0b" strokeWidth={2.5} markerEnd="url(#pfArrow)" />

      {/* ===== 3. Transformer ===== */}
      <g transform="translate(320 94)">
        <rect x={-22} y={-28} width={44} height={40} rx={4} fill="#334155" stroke="#1e293b" strokeWidth={1.5} />
        {/* Cooling fins */}
        {[-26, 26].map((sx) =>
          [0, 8, 16, 24].map((dy) => (
            <rect key={`${sx}-${dy}`} x={sx} y={-24 + dy} width={4} height={6} rx={0.8} fill="#475569" />
          ))
        )}
        {/* Bushings */}
        {[-8, 0, 8].map((x) => (
          <rect key={x} x={x - 1.5} y={-34} width={3} height={6} rx={1} fill="#64748b" />
        ))}
        {/* Step-up arrow */}
        <path d="M-6,4 L0,-8 L6,4" fill="none" stroke="#f59e0b" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        <line x1={-10} y1={8} x2={10} y2={8} stroke="#f59e0b" strokeWidth={2} strokeLinecap="round" />
        <text x={0} y={54} textAnchor="middle" fill="#334155" fontSize={10} fontFamily="sans-serif" fontWeight={700}>Transformer</text>
        <text x={0} y={66} textAnchor="middle" fill="#64748b" fontSize={8} fontFamily="sans-serif">steps up voltage</text>
      </g>

      {/* ===== Arrow 3→4 ===== */}
      <path d="M345,94 L375,94" fill="none" stroke="#f59e0b" strokeWidth={2.5} markerEnd="url(#pfArrow)" />

      {/* ===== 4. Transmission ===== */}
      <g transform="translate(450 94)">
        {/* Pylon */}
        <path d="M0,-36 L-12,-14 L-8,-14 L-10,4 L-6,4 L-6,-8 L0,0 L6,-8 L6,4 L10,4 L8,-14 L12,-14 Z" fill="#60a5fa" opacity={0.7} stroke="#3b82f6" strokeWidth={0.8} />
        <line x1={-16} y1={-20} x2={16} y2={-20} stroke="#60a5fa" strokeWidth={1.5} />
        <line x1={-12} y1={-8} x2={12} y2={-8} stroke="#60a5fa" strokeWidth={1.5} />
        {/* Lines */}
        <g fill="none" stroke="#94a3b8" strokeWidth={1.2} opacity={0.6}>
          <path d="M16,-26 L45,-22" />
          <path d="M16,-14 L45,-10" />
          <path d="M16,-2 L45,2" />
        </g>
        {/* Pulse */}
        <circle cx={28} cy={-20} r={2.5} fill="#f59e0b">
          <animate attributeName="cx" values="16;46" dur="1.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0" dur="1.5s" repeatCount="indefinite" />
        </circle>
        <text x={2} y={54} textAnchor="middle" fill="#334155" fontSize={10} fontFamily="sans-serif" fontWeight={700}>The grid</text>
        <text x={2} y={66} textAnchor="middle" fill="#64748b" fontSize={8} fontFamily="sans-serif">transmission lines</text>
      </g>

      {/* ===== Arrow 4→5 ===== */}
      <path d="M465,94 L500,94" fill="none" stroke="#f59e0b" strokeWidth={2.5} markerEnd="url(#pfArrow)" />

      {/* ===== 5. Homes ===== */}
      <g transform="translate(580 94)">
        {/* House 1 */}
        <g transform="translate(-18 0)">
          <rect x={-9} y={-8} width={18} height={18} rx={1.5} fill="#e2e8f0" stroke="#94a3b8" strokeWidth={1} />
          <path d="M-11,-8 L0,-22 L11,-8" fill="none" stroke="#94a3b8" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <rect x={-4} y={0} width={8} height={5} rx={1} fill="#f59e0b" opacity={0.5}>
            <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2s" repeatCount="indefinite" />
          </rect>
        </g>
        {/* House 2 */}
        <g transform="translate(8 0)">
          <rect x={-8} y={-2} width={16} height={12} rx={1.5} fill="#e2e8f0" stroke="#94a3b8" strokeWidth={1} />
          <path d="M-10,-2 L0,-14 L10,-2" fill="none" stroke="#94a3b8" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <rect x={-3} y={3} width={6} height={4} rx={1} fill="#f59e0b" opacity={0.5}>
            <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2.5s" repeatCount="indefinite" />
          </rect>
        </g>
        {/* Building */}
        <g transform="translate(30 0)">
          <rect x={-8} y={-4} width={16} height={14} rx={1.5} fill="#f1f5f9" stroke="#94a3b8" strokeWidth={1} />
          <rect x={-5} y={-1} width={4} height={3} fill="#93c5fd" opacity={0.6} />
          <rect x={1} y={-1} width={4} height={3} fill="#93c5fd" opacity={0.6} />
          <rect x={-5} y={4} width={4} height={3} fill="#93c5fd" opacity={0.6} />
          <rect x={1} y={4} width={4} height={3} fill="#93c5fd" opacity={0.6} />
        </g>
        <text x={4} y={32} textAnchor="middle" fill="#334155" fontSize={10} fontFamily="sans-serif" fontWeight={700}>Homes</text>
        <text x={4} y={44} textAnchor="middle" fill="#64748b" fontSize={8} fontFamily="sans-serif">schools &amp; factories</text>
      </g>

      {/* ===== Title ===== */}
      <text x={350} y={188} textAnchor="middle" fill="#94a3b8" fontSize={9} fontFamily="sans-serif">The Path to Your Home</text>
    </svg>
  );
}
