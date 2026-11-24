"use client";

import Image from "next/image";
import { useState, type KeyboardEvent } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import styles from "./ship-spares-carousel.module.css";

const photos = [
  { file: "ship-spares-06.webp", alt: "Shipping crate and wrapped cargo during loading" },
  { file: "ship-spares-05.webp", alt: "Packed cargo boxes on a warehouse pallet" },
  { file: "ship-spares-03.webp", alt: "Wrapped cargo and wooden crate in a warehouse" },
  { file: "ship-spares-01.webp", alt: "Wooden shipping crate prepared among packaged cargo" },
  { file: "ship-spares-02.webp", alt: "Shipping crate secured inside a delivery vehicle" },
  { file: "ship-spares-04.webp", alt: "Cargo inspection inside a warehouse" },
] as const;

const assetBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function ShipSparesCarousel() {
  const [active, setActive] = useState(0);
  const show = (next: number) => setActive((next + photos.length) % photos.length);
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") { event.preventDefault(); show(active - 1); }
    if (event.key === "ArrowRight") { event.preventDefault(); show(active + 1); }
  };

  return <section className={styles.section} aria-labelledby="ship-spares-title">
    <div className={styles.heading}>
      <div><p className="eyebrow">Our work</p><h2 id="ship-spares-title">Ship Spares</h2><p>Photos of ship-spares cargo handling and delivery.</p></div>
      <a className={styles.request} href={`?service=${encodeURIComponent("Customs Clearance and Ship Spares")}#contact`}>Request ship spares assistance <ArrowRight size={18} aria-hidden="true" /></a>
    </div>
    <div className={styles.carousel} onKeyDown={onKeyDown} tabIndex={0} role="group" aria-label="Ship spares photo carousel. Use left and right arrow keys to change photo.">
      <div className={styles.stage}>
        <Image src={`${assetBasePath}/images/ship-spares/${photos[active].file}`} alt="" aria-hidden="true" fill sizes="(max-width: 850px) 100vw, 84vw" className={styles.backdrop} style={{ objectFit: "cover" }} />
        <Image key={photos[active].file} src={`${assetBasePath}/images/ship-spares/${photos[active].file}`} alt={photos[active].alt} fill sizes="(max-width: 850px) 100vw, 84vw" className={styles.photo} style={{ objectFit: "contain" }} />
        <span className={styles.count} aria-live="polite">{String(active + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}</span>
        <button className={`${styles.arrow} ${styles.previous}`} type="button" onClick={() => show(active - 1)} aria-label="Previous ship spares photo"><ArrowLeft size={22} /></button>
        <button className={`${styles.arrow} ${styles.next}`} type="button" onClick={() => show(active + 1)} aria-label="Next ship spares photo"><ArrowRight size={22} /></button>
      </div>
      <div className={styles.thumbnails} aria-label="Choose a ship spares photo">
        {photos.map((photo, index) => <button key={photo.file} type="button" className={`${styles.thumbnail} ${active === index ? styles.selected : ""}`} onClick={() => show(index)} aria-label={`Show ship spares photo ${index + 1} of ${photos.length}`} aria-pressed={active === index}>
          <Image src={`${assetBasePath}/images/ship-spares/${photo.file}`} alt="" fill sizes="(max-width: 540px) 25vw, 14vw" />
        </button>)}
      </div>
    </div>
  </section>;
}
