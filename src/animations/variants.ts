import { Variants } from "framer-motion";

/**
 * Page and section effect mappings
 * Effects: warp, wipe, rise, flip, iris, slide, zoom, glitch.
 */
export const pageFxMap: Record<string, string> = {
  "": "rise",
  "home": "rise",
  "about": "zoom",
  "services": "wipe",
  "plans": "warp",
  "pricing": "warp",
  "trainers": "flip",
  "schedule": "slide",
  "classes": "slide",
  "contact": "iris",
  "faq": "glitch",
  "testimonials": "warp",
  "gallery": "zoom",
};

/**
 * Generates directional and futuristic page variants
 * @param fx - The visual transition type
 * @param dir - Direction multiplier (1 for LTR English, -1 for RTL Urdu)
 */
export const pageVariants = (fx: string = "rise", dir: number = 1): Variants => {
  switch (fx) {
    case "warp":
      return {
        initial: {
          opacity: 0,
          scale: 0.94,
          skewX: -5 * dir,
          filter: "blur(6px)",
        },
        animate: {
          opacity: 1,
          scale: 1,
          skewX: 0,
          filter: "blur(0px)",
          transition: {
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
          },
        },
        exit: {
          opacity: 0,
          scale: 1.05,
          skewX: 4 * dir,
          transition: { duration: 0.35 },
        },
      };

    case "wipe":
      return {
        initial: {
          opacity: 0,
          clipPath:
            dir === -1
              ? "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)"
              : "polygon(0 0, 0 0, 0 100%, 0 100%)",
        },
        animate: {
          opacity: 1,
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
          transition: {
            duration: 0.65,
            ease: [0.22, 1, 0.36, 1],
          },
        },
        exit: {
          opacity: 0,
          transition: { duration: 0.3 },
        },
      };

    case "flip":
      return {
        initial: {
          opacity: 0,
          rotateY: 25 * dir,
          transformPerspective: 1200,
        },
        animate: {
          opacity: 1,
          rotateY: 0,
          transformPerspective: 1200,
          transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          },
        },
        exit: {
          opacity: 0,
          rotateY: -15 * dir,
          transition: { duration: 0.35 },
        },
      };

    case "iris":
      return {
        initial: {
          opacity: 0,
          clipPath: "circle(0% at 50% 50%)",
        },
        animate: {
          opacity: 1,
          clipPath: "circle(140% at 50% 50%)",
          transition: {
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1],
          },
        },
        exit: {
          opacity: 0,
          clipPath: "circle(0% at 50% 50%)",
          transition: { duration: 0.4 },
        },
      };

    case "slide":
      return {
        initial: {
          opacity: 0,
          x: 60 * dir,
        },
        animate: {
          opacity: 1,
          x: 0,
          transition: {
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
          },
        },
        exit: {
          opacity: 0,
          x: -40 * dir,
          transition: { duration: 0.3 },
        },
      };

    case "zoom":
      return {
        initial: {
          opacity: 0,
          scale: 0.88,
        },
        animate: {
          opacity: 1,
          scale: 1,
          transition: {
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
          },
        },
        exit: {
          opacity: 0,
          scale: 1.1,
          transition: { duration: 0.3 },
        },
      };

    case "glitch":
      return {
        initial: {
          opacity: 0,
          x: -12 * dir,
          filter: "drop-shadow(3px 0 0 #b6f500) drop-shadow(-3px 0 0 #5ff0c8)",
        },
        animate: {
          opacity: 1,
          x: 0,
          filter: "drop-shadow(0 0 0 transparent)",
          transition: {
            duration: 0.45,
            ease: "easeOut",
          },
        },
        exit: {
          opacity: 0,
          filter: "blur(4px)",
          transition: { duration: 0.25 },
        },
      };

    case "rise":
    default:
      return {
        initial: {
          opacity: 0,
          y: 40,
        },
        animate: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
          },
        },
        exit: {
          opacity: 0,
          y: -25,
          transition: { duration: 0.3 },
        },
      };
  }
};

/**
 * Reveal animation variants for sections and cards
 * Kinds: up | fade | scale | blur | side
 * Direction mirrors automatically for English LTR (dir = 1) and Urdu RTL (dir = -1)
 */
export const revealVariants = (
  kind: "up" | "fade" | "scale" | "blur" | "side" = "up",
  dir: number = 1
): Variants => {
  switch (kind) {
    case "fade":
      return {
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: { duration: 0.6, ease: "easeOut" },
        },
      };

    case "scale":
      return {
        hidden: { opacity: 0, scale: 0.92 },
        show: {
          opacity: 1,
          scale: 1,
          transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
        },
      };

    case "blur":
      return {
        hidden: { opacity: 0, filter: "blur(12px)", y: 25 },
        show: {
          opacity: 1,
          filter: "blur(0px)",
          y: 0,
          transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
        },
      };

    case "side":
      return {
        hidden: { opacity: 0, x: 45 * dir },
        show: {
          opacity: 1,
          x: 0,
          transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
        },
      };

    case "up":
    default:
      return {
        hidden: { opacity: 0, y: 35 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
        },
      };
  }
};
