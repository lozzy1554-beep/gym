# Futuristic Animation Kit (Next.js + Tailwind + Framer Motion)

## 1. Install
npm i framer-motion

## 2. Files copy karein
animations/variants.ts           -> /animations/variants.ts
components/motion/*.tsx          -> /components/motion/
styles/futuristic-fx.css         -> /styles/ ; globals.css mein: @import "../styles/futuristic-fx.css";
(@/ alias tsconfig mein pehle se hona chahiye)

## 3. Har page ka alag animation
app/[locale]/template.tsx banayein:
  export { default } from "@/components/motion/PageTransition";
Kaun sa page kaun sa effect use kare, yeh animations/variants.ts ke `pageFxMap` mein badlein.
Effects: warp, wipe, rise, flip, iris, slide, zoom, glitch.

## 4. Har button ka alag animation
import FxButton from "@/components/motion/FxButton";
<FxButton kind="primary" href="/en/contact">Book a Free Trial</FxButton>
<FxButton kind="outline" href="/en/plans">View Plans</FxButton>
<FxButton kind="magnetic">Join Now</FxButton>
<FxButton kind="whatsapp">WA icon</FxButton>
<FxButton kind="ghost" href="/en/about">About</FxButton>
<FxButton kind="submit" type="submit" loading={isSubmitting}>Send</FxButton>

## 5. Sections / cards
import Reveal from "@/components/motion/Reveal";
<Reveal kind="blur"><PlanCard/></Reveal>   // up | fade | scale | blur | side
Background: <section className="fx-grid fx-scan">...</section>

## Notes
- English (LTR) aur Urdu (RTL) dono mein slide/wipe/shimmer/underline ki simt khud mirror hoti hai.
- prefers-reduced-motion wale users ke liye animations khud band ho jate hain.
- Agar aap Next.js/next-intl/Tailwind use nahi kar rahe to apna code bhejein, main isko usi ke mutabiq adapt kar dunga.
