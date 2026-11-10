import type { ReactNode } from "react";

import type { Piece } from "@/lib/catalog";

const page = "#F6E6D0";
const kraft = "#DFB88D";
const copper = "#962E17";
const green = "#5C6B4A";
const linework = "#220A04";

export function PrintArt({ piece }: { piece: Piece }) {
  return (
    <svg viewBox="0 0 320 420" role="img" aria-label={piece.title} className="h-auto w-full">
      <rect width="320" height="420" fill={kraft} />
      <rect x="24" y="24" width="272" height="372" fill={page} />
      <Marks />
      {plates[piece.slug] ?? <Fallback />}
    </svg>
  );
}

function Marks() {
  return (
    <g fill="none" stroke={linework} strokeWidth="1" opacity="0.55">
      <path d="M24 40 H40 M32 24 V40" />
      <path d="M280 40 H296 M288 24 V40" />
      <path d="M24 380 H40 M32 380 V396" />
      <path d="M280 380 H296 M288 380 V396" />
    </g>
  );
}

function Fallback() {
  return <rect x="70" y="90" width="180" height="220" fill="none" stroke={linework} />;
}

const plates: Record<string, ReactNode> = {
  "threshold-no-4": (
    <g>
      {Array.from({ length: 14 }, (_, index) => (
        <line
          key={index}
          x1="58"
          x2="262"
          y1={78 + index * 18}
          y2={78 + index * 18}
          stroke={linework}
          strokeWidth={index % 5 === 0 ? 1.4 : 0.6}
          opacity={index > 9 ? 0.35 : 0.8}
        />
      ))}
      <rect x="196" y="96" width="14" height="188" fill={copper} />
    </g>
  ),
  "bowl-late": (
    <g>
      <ellipse cx="160" cy="248" rx="92" ry="16" fill="none" stroke={linework} strokeWidth="1.2" />
      <path d="M78 246 C78 150 242 150 242 246" fill="none" stroke={linework} strokeWidth="1.6" />
      <path d="M108 214 C130 196 176 188 206 206" fill="none" stroke={green} strokeWidth="1.2" />
      <ellipse cx="188" cy="286" rx="46" ry="8" fill={copper} opacity="0.85" />
    </g>
  ),
  "fence-study": (
    <g stroke={linework} strokeLinecap="square">
      {([48, 72, 96, 120, 168, 192, 216, 248] as const).map((x, index) => (
        <line key={x} x1={x} x2={x} y1={index === 3 ? 150 : 92} y2="330" strokeWidth={index % 2 ? 2 : 1} />
      ))}
      <line x1="40" x2="270" y1="330" y2="330" strokeWidth="1.2" />
      <line x1="40" x2="270" y1="118" y2="118" stroke={green} strokeWidth="0.8" />
    </g>
  ),
  "two-intervals": (
    <g>
      <rect x="62" y="96" width="128" height="168" fill={kraft} stroke={linework} />
      <rect x="132" y="168" width="124" height="132" fill={page} stroke={linework} />
      <rect x="132" y="168" width="58" height="96" fill={copper} />
    </g>
  ),
  "night-register": (
    <g>
      <rect x="58" y="78" width="204" height="260" fill={linework} />
      {Array.from({ length: 9 }, (_, index) => (
        <line
          key={index}
          x1="74"
          x2="246"
          y1={108 + index * 22}
          y2={108 + index * 22}
          stroke={page}
          strokeWidth="0.7"
          opacity="0.7"
        />
      ))}
      <circle cx="214" cy="196" r="7" fill={page} />
    </g>
  ),
  "orchard-plan": (
    <g>
      {Array.from({ length: 5 }, (_, row) =>
        Array.from({ length: 4 }, (_, column) => {
          const crossed = (row === 1 && column === 2) || (row === 3 && column === 0) || (row === 4 && column === 3);
          const cx = 86 + column * 46;
          const cy = 110 + row * 48;
          return (
            <g key={`${row}-${column}`}>
              <circle cx={cx} cy={cy} r={crossed ? 5 : 3.5} fill={crossed ? "none" : green} stroke={linework} />
              {crossed ? (
                <path d={`M${cx - 7} ${cy - 7} L${cx + 7} ${cy + 7} M${cx + 7} ${cy - 7} L${cx - 7} ${cy + 7}`} stroke={copper} />
              ) : null}
            </g>
          );
        }),
      )}
    </g>
  ),
  "red-margin": (
    <g>
      <rect x="228" y="64" width="28" height="292" fill={copper} />
      <line x1="64" x2="210" y1="210" y2="210" stroke={linework} strokeWidth="0.6" />
    </g>
  ),
  "kitchen-north": (
    <g>
      <rect x="78" y="86" width="164" height="210" fill="none" stroke={linework} strokeWidth="1.4" />
      <line x1="160" x2="160" y1="86" y2="296" stroke={linework} />
      <line x1="78" x2="242" y1="191" y2="191" stroke={linework} />
      <path d="M176 250 C176 220 206 214 206 188" fill="none" stroke={green} strokeWidth="1.5" />
      <circle cx="206" cy="182" r="4" fill={green} />
      <rect x="86" y="98" width="66" height="84" fill={kraft} opacity="0.7" />
    </g>
  ),
};
