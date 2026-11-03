"use client";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { revealVariants } from "@/animations/variants";

type Props = {
  children: React.ReactNode;
  kind?: "up" | "fade" | "scale" | "blur" | "side";
  delay?: number;
  className?: string;
};

/** Section ya card ko wrap karein: <Reveal kind="blur" delay={0.1}>...</Reveal> */
export default function Reveal({ children, kind = "up", delay = 0, className }: Props) {
  const dir = useLocale() === "ur" ? -1 : 1;
  return (
    <motion.div
      className={className}
      variants={revealVariants(kind, dir)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
