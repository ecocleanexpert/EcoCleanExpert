"use client";

import { useEffect, useRef, useState, type ImgHTMLAttributes, type ReactNode, type RefObject } from "react";

type ImgProps = ImgHTMLAttributes<HTMLImageElement> & { src: string; alt: string };

export function Img({ src, alt, className = "", ...rest }: ImgProps) {
  const [err, setErr] = useState(false);
  if (err || !src) {
    return (
      <div className={`${className} bg-gradient-to-br from-slate-200 via-slate-100 to-slate-300 flex items-center justify-center`}>
        <span className="text-[10px] uppercase tracking-widest text-slate-400 px-2 text-center leading-tight">{alt || "Photo à fournir"}</span>
      </div>
    );
  }
  return <img src={src} alt={alt} loading="lazy" decoding="async" className={className} onError={() => setErr(true)} {...rest} />;
}

export function useReveal(threshold = 0.15): [RefObject<any>, boolean] {
  const ref = useRef<any>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (typeof IntersectionObserver === "undefined") { setShown(true); return; }
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); obs.disconnect(); } }, { threshold });
    obs.observe(el); return () => obs.disconnect();
  }, [threshold]);
  return [ref, shown];
}

export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const [ref, shown] = useReveal();
  return (
    <div ref={ref} className={className} style={{
      opacity: shown ? 1 : 0,
      transform: shown ? "translateY(0)" : "translateY(22px)",
      transition: `opacity .7s cubic-bezier(.2,.7,.2,1) ${delay}ms, transform .7s cubic-bezier(.2,.7,.2,1) ${delay}ms`,
    }}>{children}</div>
  );
}

/* Compteur animé — s'active quand la section entre dans le viewport */
export function AnimatedNumber({ value, suffix = "", duration = 1800 }: { value: number; suffix?: string; duration?: number }) {
  const n = Number(String(value).replace(/\s/g, "").replace(",", "."));
  const numeric = !isNaN(n) && isFinite(n) && String(value).trim() !== "";
  const [display, setDisplay] = useState(0);
  const ref = useRef<any>(null);
  const started = useRef(false);

  useEffect(() => {
    if (!numeric) return;
    const el = ref.current; if (!el) return;
    if (typeof IntersectionObserver === "undefined") { setDisplay(n); return; }
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const t0 = performance.now();
        const tick = (now: any) => {
          const t = Math.min(1, (now - t0) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          setDisplay(Math.round(n * eased));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [n, numeric, duration]);

  if (!numeric) return <span>{value}{suffix}</span>;
  return <span ref={ref}>{display.toLocaleString("fr-FR")}{suffix}</span>;
}

/* ============================================================
   COMPOSANTS D'UPLOAD
============================================================ */
