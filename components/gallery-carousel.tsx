"use client";

import Image from "next/image";
import { useState, type KeyboardEvent } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
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

export function GalleryCarousel() {
  const [active, setActive] = useState(0);
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
    <div className={styles.carousel} onKeyDown={onKeyDown} tabIndex={0} role="group" aria-label="Gallery photo carousel. Use left and right arrow keys to change photo.">
      <div className={styles.stage}>
        <Image src={`${assetBasePath}/images/gallery/${photos[active].file}`} alt="" aria-hidden="true" fill sizes="(max-width: 850px) 100vw, 84vw" className={styles.backdrop} style={{ objectFit: "cover" }} />
        <Image key={photos[active].file} src={`${assetBasePath}/images/gallery/${photos[active].file}`} alt={photos[active].alt} fill sizes="(max-width: 850px) 100vw, 84vw" className={styles.photo} style={{ objectFit: "contain" }} />
        <span className={styles.count} aria-live="polite">{String(active + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}</span>
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
