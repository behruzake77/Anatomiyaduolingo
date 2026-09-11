import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { Organ } from '../data/anatomy';
import { anatomicalParts } from '../data/parts';

export default function AnatomyDiagram({ organ }: { organ: Organ }) {
  const [activePart, setActivePart] = useState<string | null>(null);
  const partRefs = useRef<(SVGGElement | null)[]>([]);

  function selectPart(part: string) {
    setActivePart((previous) => previous === part ? null : part);
  }

  function closePart() {
    const index = organ.labels.findIndex((label) => label.text === activePart);
    setActivePart(null);
    partRefs.current[index]?.focus();
  }

  return (
    <div className={`anatomy-diagram diagram-${organ.id}`} onKeyDown={(event) => { if (event.key === 'Escape' && activePart) { event.stopPropagation(); closePart(); } }}>
      <img className="model-image" src={organ.image} alt={`${organ.name} tuzilishining batafsil anatomik tasviri`} loading="lazy" />
      <svg className="diagram-labels" viewBox="0 0 600 430" role="group" aria-label={`${organ.name} tuzilmalari. Ma'lumot uchun tanlang.`}>
        <defs>
          <filter id={`diagram-glow-${organ.id}`} x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="4" /></filter>
        </defs>
        {organ.labels.map((label, index) => (
          <g ref={(element) => { partRefs.current[index] = element; }} key={label.text} role="button" tabIndex={0} aria-label={`${label.text} haqida ma'lumot`} aria-pressed={activePart === label.text} className={`diagram-part ${activePart === label.text ? 'selected' : ''}`} onClick={() => selectPart(label.text)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); selectPart(label.text); } }}>
            <polyline points={`${label.x + (label.side === 'left' ? 11 : -11)},${label.y - 4} ${label.targetX + (label.side === 'left' ? -37 : 37)},${label.y - 4} ${label.targetX},${label.targetY}`} />
            <circle cx={label.targetX} cy={label.targetY} r="10" fill="#278aff" opacity="0.65" filter={`url(#diagram-glow-${organ.id})`} />
            <circle className="diagram-point" cx={label.targetX} cy={label.targetY} r="6" />
            <circle cx={label.targetX} cy={label.targetY} r="22" fill="transparent" />
            <text x={label.x} y={label.y} textAnchor={label.side === 'left' ? 'end' : 'start'}>{label.text}</text>
          </g>
        ))}
      </svg>
      <AnimatePresence>
        {activePart && (
          <motion.aside key={activePart} className="diagram-part-info" role="status" initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 7 }} transition={{ duration: 0.18 }}>
            <button className="icon-button" aria-label="Tuzilma ma'lumotini yopish" onClick={closePart}><X size={16} /></button>
            <h3>{activePart}</h3>
            <p>{anatomicalParts[activePart] ?? organ.description}</p>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}