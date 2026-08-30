"use client";

/**
 * Anatomy Tutor — CORPUS o'quv yordamchisi.
 * Yagona, izchil vizual tizim: binafsha "core" orb + orbit halqa + ifodali yuz.
 * 8 holat: IDLE · HAPPY · CURIOUS · THINKING · ENCOURAGING · CONCERNED ·
 *          CELEBRATING · WELCOME_BACK.
 * Faqat CSS motion (premium, subtle) — tashqi kutubxona yuklamaydi, offline ishlaydi.
 */

import type { TutorState } from "@/utils/activity";

const TONE: Record<TutorState, { main: string; soft: string; deep: string }> = {
  IDLE: { main: "#6C5CE7", soft: "#A29BFE", deep: "#5A4BD1" },
  HAPPY: { main: "#6C5CE7", soft: "#A29BFE", deep: "#5A4BD1" },
  CURIOUS: { main: "#7E63E0", soft: "#B3A6F7", deep: "#6350C4" },
  THINKING: { main: "#8B6CFF", soft: "#C0B3FF", deep: "#6D52D9" },
  ENCOURAGING: { main: "#00B894", soft: "#5ED4BC", deep: "#009B7D" },
  CONCERNED: { main: "#8891B0", soft: "#B4BCD4", deep: "#6D7696" },
  CELEBRATING: { main: "#FD79A8", soft: "#FFA8C6", deep: "#E45E8E" },
  WELCOME_BACK: { main: "#6C5CE7", soft: "#A29BFE", deep: "#5A4BD1" },
};

export function AnatomyTutor({ state, size = 84 }: { state: TutorState; size?: number }) {
  const t = TONE[state];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 128 128"
      fill="none"
      role="img"
      aria-label="Anatomiya o'qituvchisi"
      style={{ overflow: "visible" }}
    >
      <defs>
        <radialGradient id="rx-core" cx="38%" cy="32%" r="80%">
          <stop offset="0%" stopColor={t.soft} />
          <stop offset="55%" stopColor={t.main} />
          <stop offset="100%" stopColor={t.deep} />
        </radialGradient>
        <filter id="rx-shadow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor={t.deep} floodOpacity="0.28" />
        </filter>
      </defs>

      {/* orbit halqa */}
      <g className="rx-orbit rx-tf" style={{ transformOrigin: "64px 64px" }}>
        <circle cx="64" cy="64" r="57" stroke={t.main} strokeOpacity="0.28" strokeWidth="2" strokeDasharray="3 9" strokeLinecap="round" />
        <circle cx="121" cy="64" r="3.2" fill={t.main} />
      </g>

      {/* core orb */}
      <g className="rx-breathe rx-tf" style={{ transformOrigin: "64px 64px" }} filter="url(#rx-shadow)">
        <circle cx="64" cy="64" r="42" fill="url(#rx-core)" />
        <ellipse cx="52" cy="48" rx="20" ry="12" fill="white" opacity="0.16" />
      </g>

      {/* yuz — holatga qarab */}
      <Face state={state} tone={t} />
    </svg>
  );
}

function Face({ state, tone }: { state: TutorState; tone: { main: string; soft: string; deep: string } }) {
  const ink = "#2D3436";

  if (state === "THINKING") {
    return (
      <g>
        <g className="rx-eyes rx-tf" style={{ transformOrigin: "64px 62px" }}>
          <circle cx="52" cy="62" r="4.6" fill={ink} />
          <circle cx="76" cy="62" r="4.6" fill={ink} />
        </g>
        <path d="M60 74 q4 3 8 0" stroke={ink} strokeWidth="2.6" strokeLinecap="round" />
        {/* fikrlash nuqtalari */}
        <circle className="rx-think-dot rx-tf" cx="96" cy="42" r="3" fill={tone.main} />
        <circle className="rx-think-dot rx-tf" cx="106" cy="42" r="3" fill={tone.main} style={{ animationDelay: ".2s" }} />
        <circle className="rx-think-dot rx-tf" cx="116" cy="42" r="3" fill={tone.main} style={{ animationDelay: ".4s" }} />
      </g>
    );
  }

  if (state === "CURIOUS") {
    return (
      <g>
        <g className="rx-eyes rx-tf" style={{ transformOrigin: "64px 62px" }}>
          <circle cx="52" cy="62" r="4.6" fill={ink} />
          <circle cx="76" cy="62" r="4.6" fill={ink} />
        </g>
        <path d="M44 52 q5 -4 9 0" stroke={ink} strokeWidth="2.6" strokeLinecap="round" fill="none" />
        <path d="M70 76 q4 4 8 0" stroke={ink} strokeWidth="2.6" strokeLinecap="round" fill="none" />
        <text x="108" y="66" fontSize="20" fontWeight="800" fill={tone.main}>?</text>
      </g>
    );
  }

  if (state === "CONCERNED") {
    return (
      <g>
        <g className="rx-eyes rx-tf" style={{ transformOrigin: "64px 62px" }}>
          <circle cx="52" cy="63" r="4.6" fill={ink} />
          <circle cx="76" cy="63" r="4.6" fill={ink} />
        </g>
        <path d="M45 51 l9 6 M83 51 l-9 6" stroke={ink} strokeWidth="2.6" strokeLinecap="round" />
        <path d="M60 77 q4 -3 8 0" stroke={ink} strokeWidth="2.6" strokeLinecap="round" fill="none" />
      </g>
    );
  }

  if (state === "CELEBRATING") {
    return (
      <g>
        {/* kulib ko'zlar */}
        <g className="rx-eyes rx-tf" style={{ transformOrigin: "64px 60px" }}>
          <path d="M46 58 q6 6 12 0" stroke={ink} strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M70 58 q6 6 12 0" stroke={ink} strokeWidth="3" strokeLinecap="round" fill="none" />
        </g>
        <path d="M54 66 q10 12 20 0 q10 12 20 0 z" fill={ink} />
        <path d="M44 72 q-2 5 -7 7" stroke={tone.deep} strokeWidth="2.4" strokeLinecap="round" fill="none" />
        <path d="M84 72 q2 5 7 7" stroke={tone.deep} strokeWidth="2.4" strokeLinecap="round" fill="none" />
        {/* sparkle */}
        <g fill={tone.deep}>
          <path className="rx-twinkle rx-tf" d="M28 34 l2.4 6 6 2.4 -6 2.4 -2.4 6 -2.4 -6 -6 -2.4 6 -2.4 z" style={{ transformOrigin: "28px 44px" }} />
          <path className="rx-twinkle rx-tf" d="M100 30 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 z" style={{ transformOrigin: "100px 38px", animationDelay: ".4s" }} />
          <path className="rx-twinkle rx-tf" d="M96 90 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 z" style={{ transformOrigin: "96px 98px", animationDelay: ".8s" }} />
        </g>
      </g>
    );
  }

  if (state === "WELCOME_BACK") {
    return (
      <g>
        {/* qo'l (to'lqin) */}
        <g className="rx-wave rx-tf" style={{ transformOrigin: "104px 66px" }}>
          <circle cx="104" cy="46" r="9" fill={tone.soft} />
          <circle cx="104" cy="46" r="9" fill="none" stroke={tone.main} strokeOpacity="0.4" strokeWidth="2" />
        </g>
        <g className="rx-eyes rx-tf" style={{ transformOrigin: "64px 62px" }}>
          <path d="M46 58 q6 6 12 0" stroke={ink} strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M70 58 q6 6 12 0" stroke={ink} strokeWidth="3" strokeLinecap="round" fill="none" />
        </g>
        <path d="M56 70 q8 9 16 0" stroke={ink} strokeWidth="3" strokeLinecap="round" fill="none" />
      </g>
    );
  }

  if (state === "ENCOURAGING") {
    return (
      <g>
        <g className="rx-eyes rx-tf" style={{ transformOrigin: "64px 60px" }}>
          <path d="M46 58 q6 6 12 0" stroke={ink} strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M70 58 q6 6 12 0" stroke={ink} strokeWidth="3" strokeLinecap="round" fill="none" />
        </g>
        <path d="M56 68 q8 8 16 0" stroke={ink} strokeWidth="3" strokeLinecap="round" fill="none" />
        <path className="rx-float rx-tf" d="M24 30 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3 z" fill={tone.deep} style={{ transformOrigin: "24px 42px" }} />
      </g>
    );
  }

  // IDLE / HAPPY
  const happy = state === "HAPPY";
  return (
    <g>
      <g className="rx-eyes rx-tf" style={{ transformOrigin: "64px 62px" }}>
        {happy ? (
          <>
            <path d="M46 58 q6 6 12 0" stroke={ink} strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M70 58 q6 6 12 0" stroke={ink} strokeWidth="3" strokeLinecap="round" fill="none" />
          </>
        ) : (
          <>
            <circle cx="52" cy="62" r="4.6" fill={ink} />
            <circle cx="76" cy="62" r="4.6" fill={ink} />
          </>
        )}
      </g>
      <path
        d={happy ? "M54 66 q10 12 20 0" : "M58 74 q6 6 12 0"}
        stroke={ink}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {happy && (
        <>
          <circle cx="42" cy="70" r="4" fill={tone.soft} opacity="0.6" />
          <circle cx="86" cy="70" r="4" fill={tone.soft} opacity="0.6" />
        </>
      )}
    </g>
  );
}
