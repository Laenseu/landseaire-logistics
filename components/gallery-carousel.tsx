"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import styles from "./gallery-carousel.module.css";

const photos = [
  { file: "gallery-06.webp", alt: "Shipping crate and wrapped cargo during loading" },
  { file: "gallery-05.webp", alt: "Packed cargo boxes on a warehouse pallet" },
  { file: "gallery-03.webp", alt: "Wrapped cargo and wooden crate in a warehouse" },
  { file: "gallery-01.webp", alt: "Wooden shipping crate prepared among packaged cargo" },
  { file: "gallery-02.webp", alt: "Shipping crate secured inside a delivery vehicle" },
  { file: "gallery-04.webp", alt: "Cargo inspection inside a warehouse" },
] as const;

const assetBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const advanceDelay = 6000;

export function GalleryCarousel() {
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [paused, setPaused] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(media.matches);
    updateMotion();
    media.addEventListener("change", updateMotion);
    return () => media.removeEventListener("change", updateMotion);
  }, []);

  useEffect(() => {
    const element = carouselRef.current;
    if (!element) return;
    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.2 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateVisibility = () => setPageVisible(!document.hidden);
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  useEffect(() => {
    if (!inView || !pageVisible || reducedMotion || hovered || focused || paused) return;
    const timer = window.setTimeout(() => setActive((current) => (current + 1) % photos.length), advanceDelay);
    return () => window.clearTimeout(timer);
  }, [active, inView, pageVisible, reducedMotion, hovered, focused, paused]);

  const show = (next: number) => setActive((next + photos.length) % photos.length);
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") { event.preventDefault(); show(active - 1); }
    if (event.key === "ArrowRight") { event.preventDefault(); show(active + 1); }
  };

  return <section className={styles.section} aria-labelledby="gallery-title">
    <div className={styles.heading}>
      <div><p className="eyebrow">Our work</p><h2 id="gallery-title">Gallery</h2><p>Photos from cargo handling and delivery operations.</p></div>
      <a className={styles.request} href="#contact">Contact our team <ArrowRight size={18} aria-hidden="true" /></a>
    </div>
    <div ref={carouselRef} className={styles.carousel} onKeyDown={onKeyDown} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onPointerDown={() => setFocused(false)} onFocusCapture={(event) => { if (event.target instanceof HTMLElement && event.target.matches(":focus-visible")) setFocused(true); }} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }} tabIndex={0} role="group" aria-label="Gallery photo carousel. Photos advance automatically. Use left and right arrow keys to change photo.">
      <div className={styles.stage}>
        <Image src={`${assetBasePath}/images/gallery/${photos[active].file}`} alt="" aria-hidden="true" fill sizes="(max-width: 850px) 100vw, 84vw" className={styles.backdrop} style={{ objectFit: "cover" }} />
        <Image key={photos[active].file} src={`${assetBasePath}/images/gallery/${photos[active].file}`} alt={photos[active].alt} fill sizes="(max-width: 850px) 100vw, 84vw" className={styles.photo} style={{ objectFit: "contain" }} />
        <span className={styles.count}>{String(active + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}</span>
        <button className={styles.playback} type="button" onClick={() => setPaused((value) => !value)} aria-label={paused ? "Resume automatic gallery" : "Pause automatic gallery"} aria-pressed={paused}>{paused ? <Play size={17} aria-hidden="true" /> : <Pause size={17} aria-hidden="true" />}</button>
        <button className={`${styles.arrow} ${styles.previous}`} type="button" onClick={() => show(active - 1)} aria-label="Previous gallery photo"><ArrowLeft size={22} /></button>
        <button className={`${styles.arrow} ${styles.next}`} type="button" onClick={() => show(active + 1)} aria-label="Next gallery photo"><ArrowRight size={22} /></button>
      </div>
      <div className={styles.thumbnails} aria-label="Choose a gallery photo">
        {photos.map((photo, index) => <button key={photo.file} type="button" className={`${styles.thumbnail} ${active === index ? styles.selected : ""}`} onClick={() => show(index)} aria-label={`Show gallery photo ${index + 1} of ${photos.length}`} aria-pressed={active === index}>
          <Image src={`${assetBasePath}/images/gallery/${photo.file}`} alt="" fill sizes="(max-width: 540px) 25vw, 14vw" />
        </button>)}
      </div>
    </div>
  </section>;
}
