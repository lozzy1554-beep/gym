import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { revealVariants } from "../../animations/variants";

export interface RevealProps {
  children: React.ReactNode;
  kind?: "up" | "fade" | "scale" | "blur" | "side";
  delay?: number;
  className?: string;
  dir?: number;
}

/** Section ya card ko wrap karein: <Reveal kind="blur" delay={0.1}>...</Reveal> */
export default function Reveal({
  children,
  kind = "up",
  delay = 0,
  className = "",
  dir: explicitDir,
}: RevealProps) {
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

  return (
    <motion.div
      className={className}
      variants={revealVariants(kind, dir)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
