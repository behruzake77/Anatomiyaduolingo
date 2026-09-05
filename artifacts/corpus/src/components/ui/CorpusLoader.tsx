import { useId } from "react";
import { cn } from "@/utils/cn";
import "./CorpusLoader.css";

// Adapted from the Uiverse.io loader by SelfMadeSystem, supplied by the user.
// Each letter uses a 64 × 64 canvas and a normalized 360-unit stroke.
const LETTERS = [
  {
    letter: "C",
    gradient: "violet",
    path: "M 53 13 C 48 8 41 5 32 5 C 17 5 5 17 5 32 S 17 59 32 59 C 41 59 48 56 53 51",
  },
  {
    letter: "O",
    gradient: "sunset",
    path: "M 32 32 m 0 -27 a 27 27 0 1 1 0 54 a 27 27 0 1 1 0 -54",
  },
  {
    letter: "R",
    gradient: "mint",
    path: "M 10 59 V 5 H 33 C 46 5 54 11 54 22 S 46 39 33 39 H 10 M 34 39 L 55 59",
  },
  {
    letter: "P",
    gradient: "violet",
    path: "M 12 59 V 5 H 33 C 46 5 54 11 54 22 S 46 39 33 39 H 12",
  },
  {
    letter: "U",
    gradient: "mint",
    path: "M 7 5 V 34 A 25 25 0 0 0 57 34 V 5",
  },
  {
    letter: "S",
    gradient: "sunset",
    path: "M 53 12 C 48 7 41 5 32 5 C 18 5 8 11 8 20 C 8 39 56 25 56 44 C 56 53 46 59 32 59 C 22 59 13 55 8 50",
  },
] as const;

const GRADIENTS = [
  { name: "violet", from: "#973BED", to: "#007CFF" },
  { name: "sunset", from: "#FFC800", to: "#FF00FF" },
  { name: "mint", from: "#00E0ED", to: "#00DA72" },
] as const;

export function CorpusLoader({
  animated = true,
  className,
}: {
  animated?: boolean;
  className?: string;
}) {
  // Avoid collisions if multiple wordmarks are mounted during a transition.
  const id = `corpus-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 424 64"
      width="424"
      height="64"
      fill="none"
      role="img"
      aria-label="CORPUS"
      focusable="false"
      className={cn(
        "corpus-loader",
        !animated && "corpus-loader--static",
        className,
      )}
    >
      <defs>
        {GRADIENTS.map(({ name, from, to }) => (
          <linearGradient
            key={name}
            id={`${id}-${name}`}
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="64"
            x2="0"
            y2="0"
          >
            <stop stopColor={from} />
            <stop offset="1" stopColor={to} />
            {name === "sunset" && animated && (
              <animateTransform
                attributeName="gradientTransform"
                type="rotate"
                values="0 32 32;-270 32 32;-270 32 32;-540 32 32;-540 32 32;-810 32 32;-810 32 32;-1080 32 32;-1080 32 32"
                dur="8s"
                keyTimes="0;0.125;0.25;0.375;0.5;0.625;0.75;0.875;1"
                keySplines=".42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1"
                calcMode="spline"
                repeatCount="indefinite"
              />
            )}
          </linearGradient>
        ))}
      </defs>

      {LETTERS.map(({ letter, gradient, path }, index) => (
        <svg
          key={letter}
          x={index * 72}
          y="0"
          width="64"
          height="64"
          viewBox="0 0 64 64"
          aria-hidden="true"
          focusable="false"
          stroke={`url(#${id}-${gradient})`}
          strokeWidth={letter === "O" ? 10 : 8}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* A quiet outline keeps CORPUS readable between drawing cycles. */}
          <path className="corpus-loader__track" d={path} />
          <path
            className={
              letter === "O" ? "corpus-loader__spin" : "corpus-loader__dash"
            }
            d={path}
            pathLength="360"
          />
        </svg>
      ))}
    </svg>
  );
}
