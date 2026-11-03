"use client";
// Use: app/[locale]/template.tsx  ->  export { default } from "@/components/motion/PageTransition";
import { motion, MotionConfig } from "framer-motion";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { pageFxMap, pageVariants } from "@/animations/variants";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const locale = useLocale();
  const dir = locale === "ur" ? -1 : 1;
  // "/en/plans/xyz" -> "plans"
  const key = pathname.split("/").filter(Boolean)[1] ?? "";
  const fx = pageFxMap[key] ?? "rise";

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        key={pathname}
        variants={pageVariants(fx, dir)}
        initial="initial"
        animate="animate"
        style={{ willChange: "transform, opacity" }}
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
}
