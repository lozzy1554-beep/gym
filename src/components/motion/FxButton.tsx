import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Har button ka apna animation:
 *  primary   -> shimmer sweep + glow pulse   (Join / Book Trial)
 *  outline   -> neon border chalta hua       (View Plans)
 *  magnetic  -> cursor ki taraf khichta hai  (Plan cards ka Join)
 *  whatsapp  -> pulse ring                   (floating WhatsApp)
 *  ghost     -> energy underline             (nav / chhote links)
 *  submit    -> ripple + loading bar         (forms)
 */
export type FxKind = "primary" | "outline" | "magnetic" | "whatsapp" | "ghost" | "submit";

export interface FxButtonProps {
  kind?: FxKind;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  loading?: boolean;
  type?: "button" | "submit";
  className?: string;
  target?: string;
  rel?: string;
  title?: string;
  ariaLabel?: string;
  children: React.ReactNode;
}

export default function FxButton({
  kind = "primary",
  href,
  onClick,
  loading,
  type = "button",
  className = "",
  target,
  rel,
  title,
  ariaLabel,
  children,
}: FxButtonProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 15 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 15 });
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  const onMove = (e: React.MouseEvent) => {
    if (kind !== "magnetic" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.3);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.3);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  const addRipple = (e: React.MouseEvent) => {
    if (kind !== "submit" && kind !== "magnetic") return;
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const id = Date.now();
    setRipples((p) => [...p, { id, x: e.clientX - r.left, y: e.clientY - r.top }]);
    setTimeout(() => setRipples((p) => p.filter((q) => q.id !== id)), 700);
  };

  const inner = (
    <motion.span
      ref={ref}
      className={`fx-btn fx-${kind} ${className}`}
      style={kind === "magnetic" ? { x, y } : undefined}
      whileHover={{ scale: kind === "ghost" ? 1 : 1.04 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 18 }}
    >
      <span className="fx-label">{children}</span>
      {ripples.map((r) => (
        <span key={r.id} className="fx-ripple" style={{ left: r.x, top: r.y }} />
      ))}
      {loading && <span className="fx-loadbar" />}
    </motion.span>
  );

  const shared = {
    onMouseMove: onMove,
    onMouseLeave: onLeave,
    onMouseDown: addRipple,
    title,
    "aria-label": ariaLabel,
  };

  return href ? (
    <a href={href} target={target} rel={rel} className="fx-wrap" onClick={onClick} {...shared}>
      {inner}
    </a>
  ) : (
    <button type={type} onClick={onClick} disabled={loading} className="fx-wrap" {...shared}>
      {inner}
    </button>
  );
}
