import { motion } from "framer-motion";

interface CreatureSpriteProps {
  creatureId: string;
  size?: "sm" | "md" | "lg";
  animate?: boolean;
}

const sizeMap = { sm: 64, md: 120, lg: 160 };

function GlitchFox({ w, animate }: { w: number; animate: boolean }) {
  return (
    <svg viewBox="0 0 100 100" width={w} height={w}>
      <defs>
        <linearGradient id="gf-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#60a5fa" />
        </linearGradient>
      </defs>
      <motion.g animate={animate ? { x: [0, 2, -1, 0], opacity: [1, 0.8, 1] } : {}} transition={{ duration: 1.5, repeat: Infinity }}>
        <polygon points="50,15 75,40 70,70 30,70 25,40" fill="url(#gf-grad)" opacity="0.9" />
        <polygon points="25,40 10,20 35,30" fill="#60a5fa" opacity="0.7" />
        <polygon points="75,40 90,20 65,30" fill="#60a5fa" opacity="0.7" />
        <circle cx="40" cy="42" r="4" fill="#0f172a" />
        <circle cx="60" cy="42" r="4" fill="#0f172a" />
        <circle cx="41" cy="41" r="1.5" fill="#fff" />
        <circle cx="61" cy="41" r="1.5" fill="#fff" />
        <path d="M44 52 Q50 56 56 52" stroke="#1e3a5f" fill="none" strokeWidth="1.5" />
        <motion.path d="M65 65 Q80 75 85 90" stroke="#3b82f6" fill="none" strokeWidth="3" strokeLinecap="round" animate={animate ? { d: ["M65 65 Q80 75 85 90", "M65 65 Q85 70 90 85", "M65 65 Q80 75 85 90"] } : {}} transition={{ duration: 2, repeat: Infinity }} opacity="0.6" />
        <motion.rect x="30" y="50" width="4" height="2" fill="#93c5fd" opacity="0.5" animate={animate ? { opacity: [0.5, 0, 0.5], x: [30, 55, 30] } : {}} transition={{ duration: 0.8, repeat: Infinity }} />
        <motion.rect x="60" y="35" width="3" height="2" fill="#93c5fd" opacity="0.4" animate={animate ? { opacity: [0.4, 0, 0.4], x: [60, 40, 60] } : {}} transition={{ duration: 1.2, repeat: Infinity }} />
      </motion.g>
    </svg>
  );
}

function MossGolem({ w, animate }: { w: number; animate: boolean }) {
  return (
    <svg viewBox="0 0 100 100" width={w} height={w}>
      <defs>
        <linearGradient id="mg-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#166534" />
          <stop offset="100%" stopColor="#14532d" />
        </linearGradient>
      </defs>
      <motion.g animate={animate ? { y: [0, -2, 0] } : {}} transition={{ duration: 3, repeat: Infinity }}>
        <rect x="30" y="30" width="40" height="50" rx="8" fill="url(#mg-grad)" />
        <rect x="20" y="40" width="14" height="30" rx="5" fill="#15803d" opacity="0.8" />
        <rect x="66" y="40" width="14" height="30" rx="5" fill="#15803d" opacity="0.8" />
        <rect x="35" y="75" width="12" height="15" rx="4" fill="#14532d" />
        <rect x="53" y="75" width="12" height="15" rx="4" fill="#14532d" />
        <circle cx="42" cy="48" r="5" fill="#fbbf24" opacity="0.9" />
        <circle cx="58" cy="48" r="5" fill="#fbbf24" opacity="0.9" />
        <circle cx="42" cy="48" r="2" fill="#0f172a" />
        <circle cx="58" cy="48" r="2" fill="#0f172a" />
        <motion.circle cx="35" cy="35" r="3" fill="#22c55e" opacity="0.6" animate={animate ? { r: [3, 4, 3] } : {}} transition={{ duration: 2, repeat: Infinity }} />
        <motion.circle cx="60" cy="32" r="2.5" fill="#4ade80" opacity="0.5" animate={animate ? { r: [2.5, 3.5, 2.5] } : {}} transition={{ duration: 2.5, repeat: Infinity }} />
        <path d="M30 35 Q25 20 35 18" stroke="#22c55e" fill="none" strokeWidth="2" opacity="0.5" />
        <path d="M65 33 Q70 18 60 15" stroke="#4ade80" fill="none" strokeWidth="2" opacity="0.4" />
      </motion.g>
    </svg>
  );
}

function MirrorShade({ w, animate }: { w: number; animate: boolean }) {
  return (
    <svg viewBox="0 0 100 100" width={w} height={w}>
      <defs>
        <linearGradient id="ms-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
        <linearGradient id="ms-grad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <motion.g animate={animate ? { scaleX: [1, 1.02, 0.98, 1] } : {}} transition={{ duration: 3, repeat: Infinity }}>
        <ellipse cx="50" cy="50" rx="25" ry="35" fill="url(#ms-grad)" opacity="0.9" />
        <ellipse cx="50" cy="50" rx="25" ry="35" fill="url(#ms-grad2)" stroke="#c4b5fd" strokeWidth="1" />
        <ellipse cx="43" cy="42" rx="4" ry="5" fill="#0f172a" />
        <ellipse cx="57" cy="42" rx="4" ry="5" fill="#0f172a" />
        <circle cx="44" cy="41" r="1.5" fill="#e9d5ff" />
        <circle cx="58" cy="41" r="1.5" fill="#e9d5ff" />
        <motion.path d="M40 58 Q50 66 60 58" stroke="#e9d5ff" fill="none" strokeWidth="1.5" animate={animate ? { d: ["M40 58 Q50 66 60 58", "M38 57 Q50 68 62 57", "M40 58 Q50 66 60 58"] } : {}} transition={{ duration: 4, repeat: Infinity }} />
        <motion.ellipse cx="50" cy="50" rx="28" ry="38" fill="none" stroke="#c4b5fd" strokeWidth="0.5" opacity="0.3" animate={animate ? { rx: [28, 30, 28], ry: [38, 40, 38], opacity: [0.3, 0.1, 0.3] } : {}} transition={{ duration: 2, repeat: Infinity }} />
      </motion.g>
    </svg>
  );
}

function VoidMoth({ w, animate }: { w: number; animate: boolean }) {
  return (
    <svg viewBox="0 0 100 100" width={w} height={w}>
      <defs>
        <radialGradient id="vm-grad" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="100%" stopColor="#1e293b" />
        </radialGradient>
      </defs>
      <motion.g animate={animate ? { y: [0, -4, 0] } : {}} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}>
        <ellipse cx="50" cy="50" rx="8" ry="18" fill="#334155" />
        <motion.ellipse cx="30" cy="42" rx="18" ry="22" fill="url(#vm-grad)" opacity="0.8" animate={animate ? { rx: [18, 20, 18], ry: [22, 20, 22] } : {}} transition={{ duration: 1.5, repeat: Infinity }} />
        <motion.ellipse cx="70" cy="42" rx="18" ry="22" fill="url(#vm-grad)" opacity="0.8" animate={animate ? { rx: [18, 20, 18], ry: [22, 20, 22] } : {}} transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }} />
        <circle cx="30" cy="38" r="3" fill="#94a3b8" opacity="0.4" />
        <circle cx="70" cy="38" r="3" fill="#94a3b8" opacity="0.4" />
        <circle cx="25" cy="48" r="2" fill="#64748b" opacity="0.3" />
        <circle cx="75" cy="48" r="2" fill="#64748b" opacity="0.3" />
        <circle cx="46" cy="40" r="2.5" fill="#e2e8f0" opacity="0.7" />
        <circle cx="54" cy="40" r="2.5" fill="#e2e8f0" opacity="0.7" />
        <circle cx="46" cy="40" r="1" fill="#0f172a" />
        <circle cx="54" cy="40" r="1" fill="#0f172a" />
        <line x1="46" y1="30" x2="40" y2="18" stroke="#64748b" strokeWidth="1" />
        <line x1="54" y1="30" x2="60" y2="18" stroke="#64748b" strokeWidth="1" />
        <circle cx="40" cy="18" r="2" fill="#94a3b8" opacity="0.5" />
        <circle cx="60" cy="18" r="2" fill="#94a3b8" opacity="0.5" />
        <motion.circle cx="50" cy="80" r="2" fill="#94a3b8" opacity="0.2" animate={animate ? { cx: 50, cy: [80, 90, 95], r: [2, 1, 0.5], opacity: [0.2, 0.05, 0] } : {}} transition={{ duration: 2, repeat: Infinity }} />
      </motion.g>
    </svg>
  );
}

function CircuitSprite({ w, animate }: { w: number; animate: boolean }) {
  return (
    <svg viewBox="0 0 100 100" width={w} height={w}>
      <defs>
        <linearGradient id="cs-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
        <linearGradient id="cs-glow" x1="50%" y1="50%" x2="50%" y2="0%">
          <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#bfdbfe" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.g
        animate={
          animate
            ? {
                x: [0, 2, -1, 1, 0],
                y: [0, -1, 2, 0, 0],
                rotate: [0, 4, -3, 2, 0],
              }
            : {}
        }
        transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "50px 50px" }}
      >
        {/* Jagged flight trail */}
        <motion.path
          d="M72 42 L58 50 L48 44 L38 52 L28 46"
          fill="none"
          stroke="#60a5fa"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.5"
          animate={animate ? { opacity: [0.5, 0.15, 0.5] } : {}}
          transition={{ duration: 0.6, repeat: Infinity }}
        />
        <motion.circle cx="72" cy="42" r="2" fill="#93c5fd" animate={animate ? { opacity: [0.6, 0.2, 0.6] } : {}} transition={{ duration: 0.5, repeat: Infinity }} />
        <motion.circle cx="58" cy="50" r="1.5" fill="#93c5fd" opacity="0.5" animate={animate ? { opacity: [0.5, 0.1, 0.5] } : {}} transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }} />
        <motion.circle cx="48" cy="44" r="1.5" fill="#93c5fd" opacity="0.4" animate={animate ? { opacity: [0.4, 0.1, 0.4] } : {}} transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }} />
        {/* Body: rounded firefly-like shape */}
        <ellipse cx="50" cy="50" rx="14" ry="18" fill="url(#cs-grad)" opacity="0.95" />
        <ellipse cx="50" cy="48" rx="10" ry="12" fill="url(#cs-glow)" opacity="0.6" />
        {/* Circuit traces on body */}
        <path d="M42 44 L46 48 L42 52" fill="none" stroke="#bfdbfe" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
        <path d="M58 44 L54 48 L58 52" fill="none" stroke="#bfdbfe" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
        <path d="M44 38 Q50 42 56 38" fill="none" stroke="#93c5fd" strokeWidth="0.8" opacity="0.6" />
        {/* Eyes / sensor nodes */}
        <motion.circle cx="45" cy="46" r="3" fill="#0f172a" animate={animate ? { scale: [1, 1.1, 1] } : {}} transition={{ duration: 0.4, repeat: Infinity }} />
        <motion.circle cx="55" cy="46" r="3" fill="#0f172a" animate={animate ? { scale: [1, 1.1, 1] } : {}} transition={{ duration: 0.4, repeat: Infinity, delay: 0.2 }} />
        <circle cx="45" cy="45" r="0.8" fill="#fff" />
        <circle cx="55" cy="45" r="0.8" fill="#fff" />
        {/* Core glow */}
        <motion.circle
          cx="50"
          cy="50"
          r="4"
          fill="#bfdbfe"
          opacity="0.7"
          animate={animate ? { r: [4, 6, 4], opacity: [0.7, 0.4, 0.7] } : {}}
          transition={{ duration: 0.7, repeat: Infinity }}
        />
        {/* Small spark */}
        <motion.line
          x1="50"
          y1="36"
          x2="50"
          y2="32"
          stroke="#e0f2fe"
          strokeWidth="1"
          strokeLinecap="round"
          animate={animate ? { opacity: [0.8, 0, 0.8] } : {}}
          transition={{ duration: 0.3, repeat: Infinity }}
        />
      </motion.g>
    </svg>
  );
}

function RumbleRoot({ w, animate }: { w: number; animate: boolean }) {
  return (
    <svg viewBox="0 0 100 100" width={w} height={w}>
      <motion.g animate={animate ? { rotate: [0, 3, -3, 0] } : {}} transition={{ duration: 1, repeat: Infinity }} style={{ transformOrigin: "50px 55px" }}>
        <circle cx="50" cy="55" r="22" fill="#4d7c0f" />
        <path d="M35 45 Q30 30 20 35" stroke="#65a30d" fill="none" strokeWidth="3" strokeLinecap="round" />
        <path d="M65 45 Q70 30 80 35" stroke="#65a30d" fill="none" strokeWidth="3" strokeLinecap="round" />
        <path d="M40 70 Q35 85 30 88" stroke="#65a30d" fill="none" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M60 70 Q65 85 70 88" stroke="#65a30d" fill="none" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M50 75 Q50 88 50 92" stroke="#65a30d" fill="none" strokeWidth="2" strokeLinecap="round" />
        <motion.circle cx="42" cy="50" r="5" fill="#fbbf24" animate={animate ? { r: [5, 5.5, 5] } : {}} transition={{ duration: 1.5, repeat: Infinity }} />
        <motion.circle cx="58" cy="50" r="5" fill="#fbbf24" animate={animate ? { r: [5, 5.5, 5] } : {}} transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }} />
        <circle cx="42" cy="50" r="2" fill="#0f172a" />
        <circle cx="58" cy="50" r="2" fill="#0f172a" />
      </motion.g>
    </svg>
  );
}

function GiggleWisp({ w, animate }: { w: number; animate: boolean }) {
  return (
    <svg viewBox="0 0 100 100" width={w} height={w}>
      <defs>
        <radialGradient id="gw-grad" cx="50%" cy="40%">
          <stop offset="0%" stopColor="#e9d5ff" />
          <stop offset="60%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.3" />
        </radialGradient>
      </defs>
      <motion.g animate={animate ? { y: [0, -6, 0] } : {}} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
        <motion.circle cx="50" cy="45" r="22" fill="url(#gw-grad)" opacity="0.8" animate={animate ? { r: [22, 24, 22] } : {}} transition={{ duration: 1.5, repeat: Infinity }} />
        <motion.circle cx="50" cy="45" r="28" fill="none" stroke="#c084fc" strokeWidth="0.5" opacity="0.3" animate={animate ? { r: [28, 32, 28], opacity: [0.3, 0.1, 0.3] } : {}} transition={{ duration: 2, repeat: Infinity }} />
        <circle cx="43" cy="40" r="3" fill="#0f172a" opacity="0.7" />
        <circle cx="57" cy="40" r="3" fill="#0f172a" opacity="0.7" />
        <circle cx="44" cy="39" r="1" fill="#fff" />
        <circle cx="58" cy="39" r="1" fill="#fff" />
        <motion.ellipse cx="50" cy="52" rx="5" ry="3" fill="#0f172a" opacity="0.5" animate={animate ? { ry: [3, 5, 3], rx: [5, 6, 5] } : {}} transition={{ duration: 0.6, repeat: Infinity }} />
        <motion.circle cx="35" cy="60" r="1.5" fill="#d8b4fe" opacity="0.4" animate={animate ? { cx: 35, cy: [60, 70, 75], r: 1.5, opacity: [0.4, 0.1, 0] } : {}} transition={{ duration: 2, repeat: Infinity }} />
        <motion.circle cx="65" cy="58" r="1" fill="#d8b4fe" opacity="0.3" animate={animate ? { cx: 65, cy: [58, 68, 73], r: 1, opacity: [0.3, 0.1, 0] } : {}} transition={{ duration: 2.5, repeat: Infinity }} />
      </motion.g>
    </svg>
  );
}

function PhaseHound({ w, animate }: { w: number; animate: boolean }) {
  return (
    <svg viewBox="0 0 100 100" width={w} height={w}>
      <defs>
        <linearGradient id="ph-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="100%" stopColor="#1e293b" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      <motion.g animate={animate ? { x: [0, 3, -3, 0], opacity: [1, 0.7, 1] } : {}} transition={{ duration: 3, repeat: Infinity }}>
        <ellipse cx="50" cy="50" rx="25" ry="18" fill="url(#ph-grad)" />
        <polygon points="30,40 18,22 35,35" fill="#475569" opacity="0.8" />
        <polygon points="70,40 82,22 65,35" fill="#475569" opacity="0.8" />
        <circle cx="42" cy="46" r="4" fill="#e2e8f0" opacity="0.8" />
        <circle cx="58" cy="46" r="4" fill="#e2e8f0" opacity="0.8" />
        <circle cx="42" cy="46" r="2" fill="#0f172a" />
        <circle cx="58" cy="46" r="2" fill="#0f172a" />
        <ellipse cx="50" cy="55" rx="4" ry="2" fill="#1e293b" opacity="0.6" />
        <rect x="32" y="63" width="5" height="14" rx="2" fill="#334155" opacity="0.7" />
        <rect x="42" y="65" width="5" height="12" rx="2" fill="#334155" opacity="0.7" />
        <rect x="53" y="65" width="5" height="12" rx="2" fill="#334155" opacity="0.7" />
        <rect x="63" y="63" width="5" height="14" rx="2" fill="#334155" opacity="0.7" />
        <motion.ellipse cx="50" cy="50" rx="28" ry="20" fill="none" stroke="#64748b" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.3" animate={animate ? { opacity: [0.3, 0.1, 0.3] } : {}} transition={{ duration: 2, repeat: Infinity }} />
      </motion.g>
    </svg>
  );
}

function EmberNewt({ w, animate }: { w: number; animate: boolean }) {
  return (
    <svg viewBox="0 0 100 100" width={w} height={w}>
      <motion.g animate={animate ? { x: [0, 2, 0] } : {}} transition={{ duration: 2, repeat: Infinity }}>
        <ellipse cx="50" cy="55" rx="18" ry="12" fill="#166534" />
        <ellipse cx="50" cy="48" rx="10" ry="8" fill="#15803d" />
        <circle cx="46" cy="45" r="2" fill="#fbbf24" />
        <circle cx="54" cy="45" r="2" fill="#fbbf24" />
        <circle cx="46" cy="45" r="0.8" fill="#0f172a" />
        <circle cx="54" cy="45" r="0.8" fill="#0f172a" />
        <rect x="30" y="52" width="8" height="4" rx="2" fill="#15803d" />
        <rect x="62" y="52" width="8" height="4" rx="2" fill="#15803d" />
        <path d="M32 60 Q22 62 18 70" stroke="#166534" fill="none" strokeWidth="3" strokeLinecap="round" />
        <path d="M68 55 Q78 55 85 60 Q88 65 82 68" stroke="#166534" fill="none" strokeWidth="4" strokeLinecap="round" />
        <motion.circle cx="42" cy="52" r="2" fill="#f97316" opacity="0.7" animate={animate ? { opacity: [0.7, 0.3, 0.7], r: [2, 2.5, 2] } : {}} transition={{ duration: 1, repeat: Infinity }} />
        <motion.circle cx="55" cy="58" r="1.5" fill="#ef4444" opacity="0.6" animate={animate ? { opacity: [0.6, 0.2, 0.6], r: [1.5, 2, 1.5] } : {}} transition={{ duration: 1.3, repeat: Infinity }} />
        <motion.circle cx="48" cy="60" r="1.8" fill="#fb923c" opacity="0.5" animate={animate ? { opacity: [0.5, 0.2, 0.5] } : {}} transition={{ duration: 0.8, repeat: Infinity }} />
      </motion.g>
    </svg>
  );
}

function FogWraith({ w, animate }: { w: number; animate: boolean }) {
  return (
    <svg viewBox="0 0 100 100" width={w} height={w}>
      <defs>
        <radialGradient id="fw-grad" cx="50%" cy="30%">
          <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#475569" stopOpacity="0.1" />
        </radialGradient>
      </defs>
      <motion.g animate={animate ? { y: [0, -3, 0] } : {}} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
        <motion.ellipse cx="50" cy="40" rx="25" ry="20" fill="url(#fw-grad)" animate={animate ? { rx: [25, 28, 25], ry: [20, 18, 20] } : {}} transition={{ duration: 4, repeat: Infinity }} />
        <motion.ellipse cx="50" cy="60" rx="20" ry="15" fill="url(#fw-grad)" opacity="0.5" animate={animate ? { rx: [20, 22, 20] } : {}} transition={{ duration: 3, repeat: Infinity }} />
        <circle cx="43" cy="38" r="3" fill="#e2e8f0" opacity="0.5" />
        <circle cx="57" cy="38" r="3" fill="#e2e8f0" opacity="0.5" />
        <circle cx="43" cy="38" r="1.5" fill="#1e293b" opacity="0.5" />
        <circle cx="57" cy="38" r="1.5" fill="#1e293b" opacity="0.5" />
        <motion.ellipse cx="50" cy="75" rx="18" ry="8" fill="#64748b" opacity="0.15" animate={animate ? { rx: [18, 22, 18], opacity: [0.15, 0.05, 0.15] } : {}} transition={{ duration: 3, repeat: Infinity }} />
      </motion.g>
    </svg>
  );
}

function PrismBeetle({ w, animate }: { w: number; animate: boolean }) {
  return (
    <svg viewBox="0 0 100 100" width={w} height={w}>
      <motion.g animate={animate ? { rotate: [0, 2, -2, 0] } : {}} transition={{ duration: 2, repeat: Infinity }} style={{ transformOrigin: "50px 55px" }}>
        <ellipse cx="50" cy="55" rx="20" ry="22" fill="#7c3aed" opacity="0.8" />
        <ellipse cx="50" cy="55" rx="14" ry="18" fill="#6d28d9" opacity="0.6" />
        <line x1="50" y1="33" x2="50" y2="77" stroke="#a78bfa" strokeWidth="1" opacity="0.4" />
        <circle cx="50" cy="42" r="6" fill="#1e293b" opacity="0.8" />
        <circle cx="48" cy="41" r="1.5" fill="#f43f5e" />
        <circle cx="52" cy="41" r="1.5" fill="#3b82f6" />
        <line x1="42" y1="35" x2="35" y2="22" stroke="#8b5cf6" strokeWidth="1.5" />
        <line x1="58" y1="35" x2="65" y2="22" stroke="#8b5cf6" strokeWidth="1.5" />
        <circle cx="35" cy="22" r="2" fill="#a78bfa" opacity="0.6" />
        <circle cx="65" cy="22" r="2" fill="#a78bfa" opacity="0.6" />
        <rect x="33" y="60" width="4" height="10" rx="1" fill="#6d28d9" opacity="0.6" transform="rotate(-15 35 65)" />
        <rect x="63" y="60" width="4" height="10" rx="1" fill="#6d28d9" opacity="0.6" transform="rotate(15 65 65)" />
        <rect x="29" y="52" width="4" height="10" rx="1" fill="#6d28d9" opacity="0.5" transform="rotate(-30 31 57)" />
        <rect x="67" y="52" width="4" height="10" rx="1" fill="#6d28d9" opacity="0.5" transform="rotate(30 69 57)" />
        <motion.circle cx="42" cy="50" r="1.5" fill="#f43f5e" opacity="0.5" animate={animate ? { fill: ["#f43f5e", "#3b82f6", "#22c55e", "#f43f5e"] } : {}} transition={{ duration: 2, repeat: Infinity }} />
        <motion.circle cx="58" cy="50" r="1.5" fill="#3b82f6" opacity="0.5" animate={animate ? { fill: ["#3b82f6", "#22c55e", "#f43f5e", "#3b82f6"] } : {}} transition={{ duration: 2, repeat: Infinity }} />
        <motion.circle cx="50" cy="62" r="1.5" fill="#22c55e" opacity="0.5" animate={animate ? { fill: ["#22c55e", "#f43f5e", "#3b82f6", "#22c55e"] } : {}} transition={{ duration: 2, repeat: Infinity }} />
      </motion.g>
    </svg>
  );
}

function ToxicSlime({ w, animate }: { w: number; animate: boolean }) {
  return (
    <svg viewBox="0 0 100 100" width={w} height={w}>
      <defs>
        <radialGradient id="ts-grad" cx="50%" cy="40%">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#166534" />
        </radialGradient>
      </defs>
      <motion.g animate={animate ? { y: [0, -2, 0] } : {}} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
        <motion.ellipse cx="50" cy="60" rx="28" ry="20" fill="url(#ts-grad)" opacity="0.85" animate={animate ? { rx: [28, 30, 26, 28], ry: [20, 18, 22, 20] } : {}} transition={{ duration: 2, repeat: Infinity }} />
        <motion.circle cx="40" cy="48" r="3" fill="#bbf7d0" opacity="0.6" animate={animate ? { cx: 40, cy: [48, 42, 38], r: [3, 2, 1], opacity: [0.6, 0.3, 0] } : {}} transition={{ duration: 2, repeat: Infinity }} />
        <motion.circle cx="55" cy="50" r="2" fill="#86efac" opacity="0.5" animate={animate ? { cx: 55, cy: [50, 44, 40], r: [2, 1.5, 0.5], opacity: [0.5, 0.2, 0] } : {}} transition={{ duration: 2.5, repeat: Infinity }} />
        <motion.circle cx="62" cy="52" r="2.5" fill="#bbf7d0" opacity="0.4" animate={animate ? { cx: 62, cy: [52, 45, 39], r: 2.5, opacity: [0.4, 0.2, 0] } : {}} transition={{ duration: 3, repeat: Infinity }} />
        <circle cx="42" cy="55" r="4" fill="#0f172a" opacity="0.7" />
        <circle cx="58" cy="55" r="4" fill="#0f172a" opacity="0.7" />
        <circle cx="43" cy="54" r="1.5" fill="#fff" />
        <circle cx="59" cy="54" r="1.5" fill="#fff" />
        <motion.path d="M45 65 Q50 68 55 65" stroke="#15803d" fill="none" strokeWidth="1.5" animate={animate ? { d: ["M45 65 Q50 68 55 65", "M45 65 Q50 70 55 65", "M45 65 Q50 68 55 65"] } : {}} transition={{ duration: 1.5, repeat: Infinity }} />
        <motion.ellipse cx="50" cy="78" rx="22" ry="4" fill="#166534" opacity="0.3" animate={animate ? { rx: [22, 24, 22] } : {}} transition={{ duration: 2, repeat: Infinity }} />
      </motion.g>
    </svg>
  );
}

function SparkGolem({ w, animate }: { w: number; animate: boolean }) {
  return (
    <svg viewBox="0 0 100 100" width={w} height={w}>
      <defs>
        <linearGradient id="sg-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#b45309" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>
      </defs>
      <motion.g animate={animate ? { y: [0, -1, 0] } : {}} transition={{ duration: 1.5, repeat: Infinity }}>
        <rect x="35" y="25" width="30" height="25" rx="3" fill="url(#sg-grad)" />
        <rect x="30" y="50" width="40" height="30" rx="4" fill="#92400e" />
        <rect x="22" y="52" width="10" height="22" rx="3" fill="#78350f" opacity="0.8" />
        <rect x="68" y="52" width="10" height="22" rx="3" fill="#78350f" opacity="0.8" />
        <rect x="36" y="78" width="10" height="12" rx="3" fill="#78350f" />
        <rect x="54" y="78" width="10" height="12" rx="3" fill="#78350f" />
        <rect x="40" y="30" width="8" height="6" rx="1" fill="#fbbf24" opacity="0.8" />
        <rect x="52" y="30" width="8" height="6" rx="1" fill="#fbbf24" opacity="0.8" />
        <circle cx="44" cy="33" r="2" fill="#0f172a" />
        <circle cx="56" cy="33" r="2" fill="#0f172a" />
        <line x1="43" y1="42" x2="57" y2="42" stroke="#fbbf24" strokeWidth="1.5" opacity="0.6" />
        <motion.line x1="25" y1="55" x2="18" y2="48" stroke="#fbbf24" strokeWidth="1.5" opacity="0.7" animate={animate ? { x1: 25, y1: 55, x2: [18, 15, 18], y2: [48, 45, 48], opacity: [0.7, 0, 0.7] } : {}} transition={{ duration: 0.5, repeat: Infinity }} />
        <motion.line x1="75" y1="58" x2="82" y2="52" stroke="#fbbf24" strokeWidth="1.5" opacity="0.6" animate={animate ? { x1: 75, y1: 58, x2: [82, 85, 82], y2: 52, opacity: [0.6, 0, 0.6] } : {}} transition={{ duration: 0.7, repeat: Infinity }} />
        <motion.circle cx="50" cy="60" r="1" fill="#fde68a" animate={animate ? { cx: 50, cy: [60, 55, 60], r: 1, opacity: [1, 0, 1] } : {}} transition={{ duration: 0.4, repeat: Infinity }} />
      </motion.g>
    </svg>
  );
}

function FlaskPhantom({ w, animate }: { w: number; animate: boolean }) {
  return (
    <svg viewBox="0 0 100 100" width={w} height={w}>
      <defs>
        <linearGradient id="fp-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <motion.g animate={animate ? { y: [0, -3, 0] } : {}} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
        <path d="M40 20 L40 40 L25 75 Q25 85 50 85 Q75 85 75 75 L60 40 L60 20 Z" fill="none" stroke="#94a3b8" strokeWidth="2" opacity="0.5" />
        <line x1="35" y1="20" x2="65" y2="20" stroke="#94a3b8" strokeWidth="2" opacity="0.5" />
        <motion.ellipse cx="50" cy="55" rx="15" ry="20" fill="url(#fp-grad)" animate={animate ? { rx: [15, 17, 13, 15], ry: [20, 18, 22, 20] } : {}} transition={{ duration: 3, repeat: Infinity }} />
        <motion.circle cx="45" cy="48" r="3" fill="#e9d5ff" opacity="0.5" animate={animate ? { cx: [45, 47, 43, 45], opacity: [0.5, 0.3, 0.6, 0.5] } : {}} transition={{ duration: 2, repeat: Infinity }} />
        <motion.circle cx="55" cy="48" r="3" fill="#e9d5ff" opacity="0.5" animate={animate ? { cx: [55, 53, 57, 55], opacity: [0.5, 0.3, 0.6, 0.5] } : {}} transition={{ duration: 2, repeat: Infinity }} />
        <circle cx="45" cy="48" r="1.5" fill="#7c3aed" opacity="0.6" />
        <circle cx="55" cy="48" r="1.5" fill="#7c3aed" opacity="0.6" />
        <motion.path d="M44 58 Q50 62 56 58" stroke="#c4b5fd" fill="none" strokeWidth="1" opacity="0.4" animate={animate ? { opacity: [0.4, 0.1, 0.4] } : {}} transition={{ duration: 2, repeat: Infinity }} />
        <motion.circle cx="38" cy="65" r="2" fill="#06b6d4" opacity="0.3" animate={animate ? { cx: 38, cy: [65, 60, 65], r: 2, opacity: [0.3, 0.1, 0.3] } : {}} transition={{ duration: 2, repeat: Infinity }} />
        <motion.circle cx="60" cy="70" r="1.5" fill="#a78bfa" opacity="0.3" animate={animate ? { cx: 60, cy: [70, 65, 70], r: 1.5, opacity: [0.3, 0.1, 0.3] } : {}} transition={{ duration: 2.5, repeat: Infinity }} />
      </motion.g>
    </svg>
  );
}

function PixelKnight({ w, animate }: { w: number; animate: boolean }) {
  return (
    <svg viewBox="0 0 100 100" width={w} height={w}>
      <motion.g animate={animate ? { y: [0, -2, 0] } : {}} transition={{ duration: 1.5, repeat: Infinity }}>
        <rect x="40" y="18" width="20" height="6" fill="#ec4899" />
        <rect x="38" y="24" width="24" height="16" fill="#db2777" />
        <rect x="42" y="28" width="5" height="4" fill="#0f172a" />
        <rect x="53" y="28" width="5" height="4" fill="#0f172a" />
        <rect x="46" y="34" width="8" height="2" fill="#831843" />
        <rect x="36" y="40" width="28" height="24" fill="#be185d" />
        <rect x="34" y="40" width="6" height="4" fill="#ec4899" opacity="0.8" />
        <rect x="60" y="40" width="6" height="4" fill="#ec4899" opacity="0.8" />
        <rect x="24" y="42" width="12" height="6" rx="1" fill="#f9a8d4" opacity="0.7" />
        <rect x="64" y="42" width="12" height="6" rx="1" fill="#f9a8d4" opacity="0.7" />
        <motion.rect x="18" y="38" width="8" height="4" fill="#fbbf24" animate={animate ? { rotate: [0, -10, 0] } : {}} transition={{ duration: 1, repeat: Infinity }} style={{ transformOrigin: "22px 40px" }} />
        <rect x="38" y="64" width="10" height="14" fill="#9d174d" />
        <rect x="52" y="64" width="10" height="14" fill="#9d174d" />
        <rect x="36" y="76" width="14" height="4" fill="#831843" />
        <rect x="50" y="76" width="14" height="4" fill="#831843" />
      </motion.g>
    </svg>
  );
}

function NeonSerpent({ w, animate }: { w: number; animate: boolean }) {
  return (
    <svg viewBox="0 0 100 100" width={w} height={w}>
      <defs>
        <linearGradient id="ns-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="33%" stopColor="#a855f7" />
          <stop offset="66%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
      <motion.g animate={animate ? { x: [0, 2, -2, 0] } : {}} transition={{ duration: 3, repeat: Infinity }}>
        <motion.path d="M20 50 Q30 30 40 50 Q50 70 60 50 Q70 30 80 50" stroke="url(#ns-grad)" fill="none" strokeWidth="5" strokeLinecap="round" animate={animate ? { d: ["M20 50 Q30 30 40 50 Q50 70 60 50 Q70 30 80 50", "M20 50 Q30 70 40 50 Q50 30 60 50 Q70 70 80 50", "M20 50 Q30 30 40 50 Q50 70 60 50 Q70 30 80 50"] } : {}} transition={{ duration: 2, repeat: Infinity }} />
        <motion.path d="M20 50 Q30 30 40 50 Q50 70 60 50 Q70 30 80 50" stroke="#fff" fill="none" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" animate={animate ? { d: ["M20 50 Q30 30 40 50 Q50 70 60 50 Q70 30 80 50", "M20 50 Q30 70 40 50 Q50 30 60 50 Q70 70 80 50", "M20 50 Q30 30 40 50 Q50 70 60 50 Q70 30 80 50"], opacity: [0.4, 0.2, 0.4] } : {}} transition={{ duration: 2, repeat: Infinity }} />
        <circle cx="80" cy="50" r="5" fill="#22d3ee" opacity="0.8" />
        <circle cx="82" cy="48" r="1.5" fill="#0f172a" />
        <circle cx="82" cy="52" r="1.5" fill="#0f172a" />
        <motion.circle cx="18" cy="50" r="2" fill="#f43f5e" opacity="0.5" animate={animate ? { opacity: [0.5, 0.1, 0.5], r: [2, 3, 2] } : {}} transition={{ duration: 1, repeat: Infinity }} />
        <motion.circle cx="40" cy="50" r="1.5" fill="#a855f7" opacity="0.4" animate={animate ? { opacity: [0.4, 0.8, 0.4] } : {}} transition={{ duration: 1.5, repeat: Infinity }} />
        <motion.circle cx="60" cy="50" r="1.5" fill="#3b82f6" opacity="0.4" animate={animate ? { opacity: [0.4, 0.8, 0.4] } : {}} transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }} />
      </motion.g>
    </svg>
  );
}

function CabinetGhost({ w, animate }: { w: number; animate: boolean }) {
  return (
    <svg viewBox="0 0 100 100" width={w} height={w}>
      <motion.g animate={animate ? { opacity: [1, 0.6, 1] } : {}} transition={{ duration: 3, repeat: Infinity }}>
        <rect x="25" y="15" width="50" height="70" rx="3" fill="#334155" opacity="0.7" />
        <rect x="30" y="20" width="40" height="30" rx="2" fill="#1e293b" />
        <motion.ellipse cx="50" cy="40" rx="12" ry="16" fill="#94a3b8" opacity="0.2" animate={animate ? { opacity: [0.2, 0.4, 0.2], ry: [16, 18, 16] } : {}} transition={{ duration: 2, repeat: Infinity }} />
        <motion.circle cx="45" cy="36" r="2.5" fill="#e2e8f0" opacity="0.4" animate={animate ? { opacity: [0.4, 0.7, 0.4] } : {}} transition={{ duration: 1.5, repeat: Infinity }} />
        <motion.circle cx="55" cy="36" r="2.5" fill="#e2e8f0" opacity="0.4" animate={animate ? { opacity: [0.4, 0.7, 0.4] } : {}} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }} />
        <circle cx="45" cy="36" r="1" fill="#0f172a" opacity="0.5" />
        <circle cx="55" cy="36" r="1" fill="#0f172a" opacity="0.5" />
        <rect x="35" y="55" width="12" height="3" rx="1" fill="#475569" opacity="0.5" />
        <rect x="53" y="55" width="12" height="3" rx="1" fill="#475569" opacity="0.5" />
        <rect x="42" y="62" width="16" height="6" rx="2" fill="#475569" opacity="0.4" />
        <motion.rect x="30" y="22" width="3" height="2" fill="#64748b" opacity="0.3" animate={animate ? { opacity: [0.3, 0.8, 0.3] } : {}} transition={{ duration: 0.8, repeat: Infinity }} />
        <motion.rect x="36" y="26" width="2" height="2" fill="#94a3b8" opacity="0.2" animate={animate ? { opacity: [0.2, 0.6, 0.2] } : {}} transition={{ duration: 1, repeat: Infinity }} />
      </motion.g>
    </svg>
  );
}

function TideLurker({ w, animate }: { w: number; animate: boolean }) {
  return (
    <svg viewBox="0 0 100 100" width={w} height={w}>
      <defs>
        <linearGradient id="tl-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0e7490" />
          <stop offset="100%" stopColor="#164e63" />
        </linearGradient>
      </defs>
      <motion.path d="M15 70 Q30 60 50 70 Q70 80 85 70" stroke="#0ea5e9" fill="none" strokeWidth="2" opacity="0.3" animate={animate ? { d: ["M15 70 Q30 60 50 70 Q70 80 85 70", "M15 70 Q30 80 50 70 Q70 60 85 70", "M15 70 Q30 60 50 70 Q70 80 85 70"] } : {}} transition={{ duration: 3, repeat: Infinity }} />
      <motion.g animate={animate ? { y: [0, -3, 0] } : {}} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}>
        <motion.path d="M30 65 Q28 45 22 30" stroke="url(#tl-grad)" fill="none" strokeWidth="5" strokeLinecap="round" animate={animate ? { d: ["M30 65 Q28 45 22 30", "M30 65 Q25 48 20 35", "M30 65 Q28 45 22 30"] } : {}} transition={{ duration: 2, repeat: Infinity }} />
        <motion.path d="M45 60 Q43 40 40 25" stroke="url(#tl-grad)" fill="none" strokeWidth="6" strokeLinecap="round" animate={animate ? { d: ["M45 60 Q43 40 40 25", "M45 60 Q47 42 42 28", "M45 60 Q43 40 40 25"] } : {}} transition={{ duration: 2.2, repeat: Infinity }} />
        <motion.path d="M55 60 Q57 38 60 22" stroke="url(#tl-grad)" fill="none" strokeWidth="6" strokeLinecap="round" animate={animate ? { d: ["M55 60 Q57 38 60 22", "M55 60 Q53 40 58 28", "M55 60 Q57 38 60 22"] } : {}} transition={{ duration: 1.8, repeat: Infinity }} />
        <motion.path d="M70 65 Q72 48 78 35" stroke="url(#tl-grad)" fill="none" strokeWidth="4" strokeLinecap="round" animate={animate ? { d: ["M70 65 Q72 48 78 35", "M70 65 Q75 50 80 38", "M70 65 Q72 48 78 35"] } : {}} transition={{ duration: 2.4, repeat: Infinity }} />
        <circle cx="40" cy="25" r="2" fill="#0e7490" opacity="0.5" />
        <circle cx="60" cy="22" r="2" fill="#0e7490" opacity="0.5" />
        <motion.circle cx="50" cy="80" r="12" fill="#164e63" opacity="0.3" animate={animate ? { r: [12, 14, 12], opacity: [0.3, 0.15, 0.3] } : {}} transition={{ duration: 3, repeat: Infinity }} />
      </motion.g>
    </svg>
  );
}

function RustCrab({ w, animate }: { w: number; animate: boolean }) {
  return (
    <svg viewBox="0 0 100 100" width={w} height={w}>
      <motion.g animate={animate ? { x: [0, 2, -2, 0] } : {}} transition={{ duration: 2, repeat: Infinity }}>
        <ellipse cx="50" cy="55" rx="22" ry="15" fill="#b45309" />
        <ellipse cx="50" cy="55" rx="18" ry="12" fill="#92400e" opacity="0.6" />
        <circle cx="42" cy="48" r="4" fill="#fbbf24" opacity="0.8" />
        <circle cx="58" cy="48" r="4" fill="#fbbf24" opacity="0.8" />
        <circle cx="42" cy="48" r="2" fill="#0f172a" />
        <circle cx="58" cy="48" r="2" fill="#0f172a" />
        <line x1="38" y1="44" x2="32" y2="35" stroke="#78350f" strokeWidth="2" />
        <line x1="62" y1="44" x2="68" y2="35" stroke="#78350f" strokeWidth="2" />
        <circle cx="32" cy="35" r="3" fill="#b45309" opacity="0.7" />
        <circle cx="68" cy="35" r="3" fill="#b45309" opacity="0.7" />
        <motion.path d="M22 50 Q15 45 12 40" stroke="#78350f" fill="none" strokeWidth="3" strokeLinecap="round" animate={animate ? { d: ["M22 50 Q15 45 12 40", "M22 50 Q15 42 10 38", "M22 50 Q15 45 12 40"] } : {}} transition={{ duration: 1.5, repeat: Infinity }} />
        <motion.path d="M78 50 Q85 45 88 40" stroke="#78350f" fill="none" strokeWidth="3" strokeLinecap="round" animate={animate ? { d: ["M78 50 Q85 45 88 40", "M78 50 Q85 42 90 38", "M78 50 Q85 45 88 40"] } : {}} transition={{ duration: 1.5, repeat: Infinity }} />
        <line x1="30" y1="65" x2="24" y2="78" stroke="#78350f" strokeWidth="2" />
        <line x1="38" y1="68" x2="34" y2="80" stroke="#78350f" strokeWidth="2" />
        <line x1="62" y1="68" x2="66" y2="80" stroke="#78350f" strokeWidth="2" />
        <line x1="70" y1="65" x2="76" y2="78" stroke="#78350f" strokeWidth="2" />
        <circle cx="45" cy="57" r="1.5" fill="#d97706" opacity="0.4" />
        <circle cx="55" cy="60" r="1" fill="#d97706" opacity="0.3" />
      </motion.g>
    </svg>
  );
}

function DepthAngler({ w, animate }: { w: number; animate: boolean }) {
  return (
    <svg viewBox="0 0 100 100" width={w} height={w}>
      <defs>
        <radialGradient id="da-grad" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#4338ca" />
          <stop offset="100%" stopColor="#1e1b4b" />
        </radialGradient>
      </defs>
      <motion.g animate={animate ? { y: [0, -3, 0] } : {}} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
        <ellipse cx="50" cy="55" rx="25" ry="18" fill="url(#da-grad)" />
        <polygon points="75,50 90,45 90,60 75,58" fill="#312e81" opacity="0.7" />
        <polygon points="25,48 15,38 15,45" fill="#312e81" opacity="0.6" />
        <polygon points="25,58 15,68 15,60" fill="#312e81" opacity="0.6" />
        <circle cx="38" cy="52" r="5" fill="#e0e7ff" opacity="0.6" />
        <circle cx="38" cy="52" r="2.5" fill="#0f172a" />
        <circle cx="39" cy="51" r="1" fill="#c7d2fe" />
        <path d="M30 42 Q28 30 35 22" stroke="#4338ca" fill="none" strokeWidth="2" strokeLinecap="round" />
        <motion.circle cx="35" cy="22" r="4" fill="#22d3ee" opacity="0.8" animate={animate ? { opacity: [0.8, 0.3, 0.8], r: [4, 5, 4] } : {}} transition={{ duration: 1.5, repeat: Infinity }} />
        <motion.circle cx="35" cy="22" r="6" fill="none" stroke="#22d3ee" strokeWidth="0.5" opacity="0.3" animate={animate ? { r: [6, 10, 6], opacity: [0.3, 0, 0.3] } : {}} transition={{ duration: 1.5, repeat: Infinity }} />
        <path d="M42 62 L46 66 L42 64 L48 68 L44 66 L50 70" stroke="#e0e7ff" fill="none" strokeWidth="0.5" opacity="0.3" />
        <motion.circle cx="55" cy="48" r="1" fill="#818cf8" opacity="0.4" animate={animate ? { opacity: [0.4, 0.8, 0.4] } : {}} transition={{ duration: 2, repeat: Infinity }} />
        <motion.circle cx="62" cy="55" r="1" fill="#6366f1" opacity="0.3" animate={animate ? { opacity: [0.3, 0.6, 0.3] } : {}} transition={{ duration: 2.5, repeat: Infinity }} />
      </motion.g>
    </svg>
  );
}

function SignalWraith({ w, animate }: { w: number; animate: boolean }) {
  return (
    <svg viewBox="0 0 100 100" width={w} height={w}>
      <defs>
        <linearGradient id="sw-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#d97706" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <motion.g animate={animate ? { x: [0, 1, -1, 2, 0], opacity: [1, 0.7, 1, 0.8, 1] } : {}} transition={{ duration: 2, repeat: Infinity }}>
        <motion.path d="M50 20 Q48 30 50 40 Q52 50 50 60 Q48 70 50 80" stroke="#f59e0b" fill="none" strokeWidth="3" strokeLinecap="round" animate={animate ? { d: ["M50 20 Q48 30 50 40 Q52 50 50 60 Q48 70 50 80", "M50 20 Q52 30 50 40 Q48 50 50 60 Q52 70 50 80", "M50 20 Q48 30 50 40 Q52 50 50 60 Q48 70 50 80"] } : {}} transition={{ duration: 1.5, repeat: Infinity }} />
        <motion.path d="M40 25 Q38 35 40 45 Q42 55 40 65 Q38 72 40 78" stroke="#d97706" fill="none" strokeWidth="2" strokeLinecap="round" opacity="0.6" animate={animate ? { d: ["M40 25 Q38 35 40 45 Q42 55 40 65 Q38 72 40 78", "M40 25 Q42 35 40 45 Q38 55 40 65 Q42 72 40 78", "M40 25 Q38 35 40 45 Q42 55 40 65 Q38 72 40 78"] } : {}} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }} />
        <motion.path d="M60 25 Q62 35 60 45 Q58 55 60 65 Q62 72 60 78" stroke="#d97706" fill="none" strokeWidth="2" strokeLinecap="round" opacity="0.6" animate={animate ? { d: ["M60 25 Q62 35 60 45 Q58 55 60 65 Q62 72 60 78", "M60 25 Q58 35 60 45 Q62 55 60 65 Q58 72 60 78", "M60 25 Q62 35 60 45 Q58 55 60 65 Q62 72 60 78"] } : {}} transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }} />
        <circle cx="46" cy="35" r="3" fill="#fbbf24" opacity="0.6" />
        <circle cx="54" cy="35" r="3" fill="#fbbf24" opacity="0.6" />
        <circle cx="46" cy="35" r="1.5" fill="#0f172a" opacity="0.5" />
        <circle cx="54" cy="35" r="1.5" fill="#0f172a" opacity="0.5" />
        <motion.circle cx="50" cy="50" r="8" fill="none" stroke="#f59e0b" strokeWidth="0.5" opacity="0.3" animate={animate ? { r: [8, 15, 8], opacity: [0.3, 0, 0.3] } : {}} transition={{ duration: 2, repeat: Infinity }} />
      </motion.g>
    </svg>
  );
}

function FrequencyBat({ w, animate }: { w: number; animate: boolean }) {
  return (
    <svg viewBox="0 0 100 100" width={w} height={w}>
      <motion.g animate={animate ? { y: [0, -4, 0] } : {}} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
        <ellipse cx="50" cy="50" rx="8" ry="12" fill="#1e293b" />
        <motion.path d="M42 45 Q30 30 15 35 Q12 45 20 55 Q30 60 42 55" fill="#0f172a" opacity="0.9" animate={animate ? { d: ["M42 45 Q30 30 15 35 Q12 45 20 55 Q30 60 42 55", "M42 45 Q30 35 18 38 Q15 48 22 56 Q30 58 42 55", "M42 45 Q30 30 15 35 Q12 45 20 55 Q30 60 42 55"] } : {}} transition={{ duration: 1.5, repeat: Infinity }} />
        <motion.path d="M58 45 Q70 30 85 35 Q88 45 80 55 Q70 60 58 55" fill="#0f172a" opacity="0.9" animate={animate ? { d: ["M58 45 Q70 30 85 35 Q88 45 80 55 Q70 60 58 55", "M58 45 Q70 35 82 38 Q85 48 78 56 Q70 58 58 55", "M58 45 Q70 30 85 35 Q88 45 80 55 Q70 60 58 55"] } : {}} transition={{ duration: 1.5, repeat: Infinity }} />
        <circle cx="40" cy="32" r="8" fill="none" stroke="#334155" strokeWidth="2" />
        <circle cx="40" cy="32" r="5" fill="none" stroke="#475569" strokeWidth="1.5" />
        <circle cx="60" cy="32" r="8" fill="none" stroke="#334155" strokeWidth="2" />
        <circle cx="60" cy="32" r="5" fill="none" stroke="#475569" strokeWidth="1.5" />
        <circle cx="47" cy="47" r="2" fill="#f59e0b" opacity="0.8" />
        <circle cx="53" cy="47" r="2" fill="#f59e0b" opacity="0.8" />
        <circle cx="47" cy="47" r="0.8" fill="#0f172a" />
        <circle cx="53" cy="47" r="0.8" fill="#0f172a" />
        <polygon points="48,54 50,57 52,54" fill="#334155" />
        <motion.circle cx="50" cy="60" r="1" fill="#f59e0b" opacity="0.3" animate={animate ? { cx: 50, cy: [60, 70, 80], r: [1, 2, 3], opacity: [0.3, 0.1, 0] } : {}} transition={{ duration: 2, repeat: Infinity }} />
      </motion.g>
    </svg>
  );
}

function StaticOwl({ w, animate }: { w: number; animate: boolean }) {
  return (
    <svg viewBox="0 0 100 100" width={w} height={w}>
      <motion.g animate={animate ? { x: [0, 0.5, -0.5, 0] } : {}} transition={{ duration: 0.5, repeat: Infinity }}>
        <ellipse cx="50" cy="50" rx="22" ry="28" fill="#475569" />
        <polygon points="32,35 20,18 38,30" fill="#64748b" />
        <polygon points="68,35 80,18 62,30" fill="#64748b" />
        {animate && Array.from({ length: 12 }).map((_, i) => (
          <motion.rect key={i} x={32 + (i % 4) * 10} y={35 + Math.floor(i / 4) * 10} width="6" height="3" fill={i % 3 === 0 ? "#e2e8f0" : i % 3 === 1 ? "#94a3b8" : "#64748b"} opacity="0.4" animate={{ opacity: [0.4, 0.1, 0.6, 0.2, 0.4] }} transition={{ duration: 0.3 + i * 0.05, repeat: Infinity }} />
        ))}
        <circle cx="42" cy="42" r="7" fill="#e2e8f0" opacity="0.7" />
        <circle cx="58" cy="42" r="7" fill="#e2e8f0" opacity="0.7" />
        <motion.circle cx="42" cy="42" r="3" fill="#0f172a" animate={animate ? { r: [3, 3.5, 3] } : {}} transition={{ duration: 2, repeat: Infinity }} />
        <motion.circle cx="58" cy="42" r="3" fill="#0f172a" animate={animate ? { r: [3, 3.5, 3] } : {}} transition={{ duration: 2, repeat: Infinity, delay: 0.2 }} />
        <circle cx="43" cy="41" r="1" fill="#fff" />
        <circle cx="59" cy="41" r="1" fill="#fff" />
        <polygon points="48,52 50,56 52,52" fill="#94a3b8" />
        <motion.line x1="30" y1="65" x2="30" y2="75" stroke="#94a3b8" strokeWidth="0.5" opacity="0.3" animate={animate ? { opacity: [0.3, 0.6, 0.3] } : {}} transition={{ duration: 0.8, repeat: Infinity }} />
        <motion.line x1="70" y1="62" x2="70" y2="72" stroke="#94a3b8" strokeWidth="0.5" opacity="0.3" animate={animate ? { opacity: [0.3, 0.6, 0.3] } : {}} transition={{ duration: 1, repeat: Infinity }} />
      </motion.g>
    </svg>
  );
}

function ShelfMimic({ w, animate }: { w: number; animate: boolean }) {
  return (
    <svg viewBox="0 0 100 100" width={w} height={w}>
      <motion.g animate={animate ? { y: [0, -1, 0] } : {}} transition={{ duration: 3, repeat: Infinity }}>
        <rect x="22" y="15" width="56" height="70" rx="2" fill="#78350f" opacity="0.8" />
        <rect x="22" y="15" width="56" height="2" fill="#92400e" />
        <rect x="22" y="35" width="56" height="2" fill="#92400e" />
        <rect x="22" y="55" width="56" height="2" fill="#92400e" />
        <rect x="22" y="75" width="56" height="2" fill="#92400e" />
        <rect x="28" y="18" width="8" height="16" rx="1" fill="#b45309" opacity="0.6" />
        <rect x="38" y="20" width="6" height="14" rx="1" fill="#a16207" opacity="0.5" />
        <rect x="46" y="18" width="10" height="16" rx="1" fill="#854d0e" opacity="0.6" />
        <rect x="60" y="19" width="7" height="15" rx="1" fill="#a16207" opacity="0.5" />
        <rect x="30" y="38" width="9" height="16" rx="1" fill="#854d0e" opacity="0.5" />
        <rect x="42" y="40" width="8" height="14" rx="1" fill="#b45309" opacity="0.6" />
        <rect x="54" y="38" width="12" height="16" rx="1" fill="#a16207" opacity="0.5" />
        <motion.circle cx="35" cy="62" r="2.5" fill="#fbbf24" opacity="0.5" animate={animate ? { opacity: [0.5, 0.8, 0.5] } : {}} transition={{ duration: 2, repeat: Infinity }} />
        <motion.circle cx="62" cy="64" r="2.5" fill="#fbbf24" opacity="0.5" animate={animate ? { opacity: [0.5, 0.8, 0.5] } : {}} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} />
        <circle cx="35" cy="62" r="1" fill="#0f172a" opacity="0.6" />
        <circle cx="62" cy="64" r="1" fill="#0f172a" opacity="0.6" />
        <motion.path d="M40 70 Q50 73 58 70" stroke="#78350f" fill="none" strokeWidth="1" opacity="0.4" animate={animate ? { opacity: [0.4, 0.1, 0.4] } : {}} transition={{ duration: 3, repeat: Infinity }} />
      </motion.g>
    </svg>
  );
}

function DustDjinn({ w, animate }: { w: number; animate: boolean }) {
  return (
    <svg viewBox="0 0 100 100" width={w} height={w}>
      <defs>
        <linearGradient id="dd-grad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#78716c" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#a8a29e" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#d6d3d1" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <motion.g animate={animate ? { y: [0, -2, 0] } : {}} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}>
        <motion.path d="M40 85 Q35 65 45 50 Q40 35 50 20" stroke="url(#dd-grad)" fill="none" strokeWidth="8" strokeLinecap="round" animate={animate ? { d: ["M40 85 Q35 65 45 50 Q40 35 50 20", "M40 85 Q45 65 42 50 Q48 35 50 20", "M40 85 Q35 65 45 50 Q40 35 50 20"] } : {}} transition={{ duration: 3, repeat: Infinity }} />
        <motion.path d="M60 85 Q65 65 55 50 Q60 35 50 20" stroke="url(#dd-grad)" fill="none" strokeWidth="8" strokeLinecap="round" animate={animate ? { d: ["M60 85 Q65 65 55 50 Q60 35 50 20", "M60 85 Q55 65 58 50 Q52 35 50 20", "M60 85 Q65 65 55 50 Q60 35 50 20"] } : {}} transition={{ duration: 3, repeat: Infinity }} />
        <motion.circle cx="46" cy="30" r="2.5" fill="#d6d3d1" opacity="0.5" animate={animate ? { opacity: [0.5, 0.8, 0.5] } : {}} transition={{ duration: 1.5, repeat: Infinity }} />
        <motion.circle cx="54" cy="30" r="2.5" fill="#d6d3d1" opacity="0.5" animate={animate ? { opacity: [0.5, 0.8, 0.5] } : {}} transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }} />
        <circle cx="46" cy="30" r="1" fill="#0f172a" opacity="0.4" />
        <circle cx="54" cy="30" r="1" fill="#0f172a" opacity="0.4" />
        {animate && Array.from({ length: 8 }).map((_, i) => (
          <motion.circle key={i} cx={40 + Math.random() * 20} cy={30 + i * 7} r={1 + Math.random()} fill={i % 2 === 0 ? "#fbbf24" : "#d6d3d1"} opacity="0.3" animate={{ opacity: [0.3, 0.6, 0.3], cx: [40 + i * 3, 45 + i * 2, 40 + i * 3] }} transition={{ duration: 1.5 + i * 0.2, repeat: Infinity }} />
        ))}
      </motion.g>
    </svg>
  );
}

function PorcelainWatcher({ w, animate }: { w: number; animate: boolean }) {
  return (
    <svg viewBox="0 0 100 100" width={w} height={w}>
      <defs>
        <radialGradient id="pw-grad" cx="50%" cy="40%">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="100%" stopColor="#e7e5e4" />
        </radialGradient>
      </defs>
      <motion.g animate={animate ? { y: [0, -1, 0] } : {}} transition={{ duration: 4, repeat: Infinity }}>
        <circle cx="50" cy="32" r="16" fill="url(#pw-grad)" />
        <circle cx="50" cy="32" r="16" fill="none" stroke="#d6d3d1" strokeWidth="1" />
        <motion.circle cx="44" cy="30" r="4" fill="#fafaf9" stroke="#a8a29e" strokeWidth="0.5" animate={animate ? { r: [4, 4.5, 4] } : {}} transition={{ duration: 3, repeat: Infinity }} />
        <motion.circle cx="56" cy="30" r="4" fill="#fafaf9" stroke="#a8a29e" strokeWidth="0.5" animate={animate ? { r: [4, 4.5, 4] } : {}} transition={{ duration: 3, repeat: Infinity }} />
        <circle cx="44" cy="30" r="2.5" fill="#1c1917" />
        <circle cx="56" cy="30" r="2.5" fill="#1c1917" />
        <circle cx="45" cy="29" r="0.8" fill="#fff" />
        <circle cx="57" cy="29" r="0.8" fill="#fff" />
        <circle cx="44" cy="38" r="2" fill="#fecdd3" opacity="0.3" />
        <circle cx="56" cy="38" r="2" fill="#fecdd3" opacity="0.3" />
        <path d="M47 36 Q50 38 53 36" stroke="#a8a29e" fill="none" strokeWidth="0.8" />
        <path d="M42 50 Q50 48 58 50" stroke="#d6d3d1" fill="none" strokeWidth="1" />
        <rect x="38" y="50" width="24" height="30" rx="4" fill="#e7e5e4" />
        <rect x="38" y="50" width="24" height="30" rx="4" fill="none" stroke="#d6d3d1" strokeWidth="1" />
        <rect x="30" y="52" width="10" height="4" rx="2" fill="#e7e5e4" />
        <rect x="60" y="52" width="10" height="4" rx="2" fill="#e7e5e4" />
        <rect x="42" y="78" width="6" height="8" rx="2" fill="#d6d3d1" />
        <rect x="52" y="78" width="6" height="8" rx="2" fill="#d6d3d1" />
        <motion.circle cx="50" cy="32" r="18" fill="none" stroke="#fecdd3" strokeWidth="0.5" opacity="0.2" animate={animate ? { r: [18, 22, 18], opacity: [0.2, 0, 0.2] } : {}} transition={{ duration: 3, repeat: Infinity }} />
      </motion.g>
    </svg>
  );
}

const CREATURE_MAP: Record<string, (props: { w: number; animate: boolean }) => JSX.Element> = {
  glitch_fox: GlitchFox,
  moss_golem: MossGolem,
  mirror_shade: MirrorShade,
  void_moth: VoidMoth,
  circuit_sprite: CircuitSprite,
  rumble_root: RumbleRoot,
  giggle_wisp: GiggleWisp,
  phase_hound: PhaseHound,
  ember_newt: EmberNewt,
  fog_wraith: FogWraith,
  prism_beetle: PrismBeetle,
  toxic_slime: ToxicSlime,
  spark_golem: SparkGolem,
  flask_phantom: FlaskPhantom,
  pixel_knight: PixelKnight,
  neon_serpent: NeonSerpent,
  cabinet_ghost: CabinetGhost,
  tide_lurker: TideLurker,
  rust_crab: RustCrab,
  depth_angler: DepthAngler,
  signal_wraith: SignalWraith,
  frequency_bat: FrequencyBat,
  static_owl: StaticOwl,
  shelf_mimic: ShelfMimic,
  dust_djinn: DustDjinn,
  porcelain_watcher: PorcelainWatcher,
};

export function CreatureSprite({ creatureId, size = "md", animate = true }: CreatureSpriteProps) {
  const w = sizeMap[size];
  const Comp = CREATURE_MAP[creatureId];
  if (!Comp) {
    return (
      <div style={{ width: w, height: w }} className="flex items-center justify-center text-muted-foreground font-mono text-2xl">
        ?
      </div>
    );
  }
  return <Comp w={w} animate={animate} />;
}
