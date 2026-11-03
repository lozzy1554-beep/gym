import React, { useEffect, useState } from "react";
import { motion, MotionConfig } from "framer-motion";
import { pageFxMap, pageVariants } from "../../animations/variants";

export interface PageTransitionProps {
  children: React.ReactNode;
  pageKey?: string;
  fxOverride?: string;
  dir?: number;
}

export default function PageTransition({
  children,
  pageKey = "",
  fxOverride,
  dir: explicitDir,
}: PageTransitionProps) {
  const [dir, setDir] = useState<number>(() => {
    if (typeof explicitDir === "number") return explicitDir;
    if (typeof document !== "undefined") {
      return document.documentElement.dir === "rtl" ? -1 : 1;
    }
    return 1;
  });

  useEffect(() => {
    if (typeof explicitDir === "number") {
      setDir(explicitDir);
      return;
    }
    const updateDir = () => {
      setDir(document.documentElement.dir === "rtl" ? -1 : 1);
    };
    updateDir();

    const observer = new MutationObserver(updateDir);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["dir", "lang"],
    });

    return () => observer.disconnect();
  }, [explicitDir]);

  const fx = fxOverride ?? pageFxMap[pageKey] ?? "rise";

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        key={`${pageKey}-${dir}-${fx}`}
        variants={pageVariants(fx, dir)}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{ willChange: "transform, opacity" }}
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
}
