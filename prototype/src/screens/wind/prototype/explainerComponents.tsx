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
        💨 {windSpeed.toFixed(1)} m/s
      </text>
      <rect x={630} y={6} width={160} height={26} rx={4} fill="#1e293b" opacity={0.7} />
      <text x={636} y={23} fill="#cbd5e1" fontSize={12} fontFamily="monospace" fontWeight="bold">
        📏 {bladeLength}m blades
      </text>
      <rect x={320} y={490} width={160} height={22} rx={4} fill="#1e293b" opacity={0.55} />
      <text x={400} y={505} textAnchor="middle" fill="#e0e8f0" fontSize={10} fontFamily="monospace" fontWeight="bold">
        ⏱ {spinDur.toFixed(1)}s per rotation
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
    <svg viewBox="0 0 600 280" className={className} preserveAspectRatio="xMidYMid meet">
      {/* Turbine silhouette */}
      <g transform="translate(80 60)">
        {/* Tower */}
        <rect x={-4} y={0} width={8} height={120} fill="#475569" />
        {/* Nacelle */}
        <rect x={-16} y={-12} width={40} height={24} rx={4} fill="#64748b" />
        {/* Blades */}
        <g style={{ transformOrigin: '4px 0px', animation: 'windspin 4s linear infinite' }}>
          {[0, 120, 240].map((d) => (
            <rect key={d} x={1} y={-40} width={6} height={42} rx={2} fill="#475569" transform={`rotate(${d} 4 0)`} />
          ))}
          <circle cx={4} cy={0} r={5} fill="#64748b" />
        </g>
        {/* Amber power line down tower */}
        <rect x={-1} y={24} width={2} height={96} fill="#f59e0b" opacity={0.8}>
          <animate attributeName="opacity" values="0.4;1;0.4" dur="1s" repeatCount="indefinite" />
        </rect>
      </g>

      {/* Arrow from nacelle */}
      <path d="M116,72 L160,72" fill="none" stroke="#f59e0b" strokeWidth={3} strokeDasharray="6 6">
        <animate attributeName="stroke-dashoffset" from="24" to="0" dur="0.8s" repeatCount="indefinite" />
      </path>

      {/* Transformer box */}
      <g transform="translate(200 50)">
        <rect x={-16} y={-14} width={32} height={28} rx={3} fill="#1e293b" stroke="#f59e0b" strokeWidth={2} />
        <text x={0} y={4} textAnchor="middle" fill="#f59e0b" fontSize={12} fontFamily="monospace" fontWeight="bold">⇢</text>
        <text x={0} y={24} textAnchor="middle" fill="#94a3b8" fontSize={8} fontFamily="sans-serif">TRANSFORMER</text>
      </g>

      {/* Transmission lines */}
      <g fill="none" stroke="#64748b" strokeWidth={2} opacity={0.6}>
        {[-8, 0, 8].map((offset) => (
          <path key={offset} d={`M232,64 Q300,64 360,72 T460,80`} transform={`translate(0 ${offset})`} />
        ))}
      </g>
      {/* Pulses along line */}
      <circle cx={300} cy={68} r={4} fill="#fbbf24">
        <animate attributeName="cx" values="232;460" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0.2;1" dur="2s" repeatCount="indefinite" />
      </circle>

      {/* City/homes at the end */}
      <g transform="translate(490 50)" fill="#334155">
        {[0, 20, 45, 65, 90].map((x, i) => (
          <rect key={i} x={x} y={-12 - i * 8} width={16} height={12 + i * 8} rx={1} />
        ))}
        {[[5, -6], [24, -10], [48, -12], [68, -8], [94, -14]].map(([wx, wy], j) => (
          <rect key={j} x={wx} y={wy} width={3} height={3} fill="#fbbf24" opacity={0.8} />
        ))}
      </g>

      {/* Ground */}
      <line x1={0} y1={200} x2={600} y2={200} stroke="#334155" strokeWidth={2} opacity={0.5} />
    </svg>
  );
}
