"use client";

import { useEffect, useState } from "react";
import styles from "./logistics-loader.module.css";

const sessionKey = "a2-landseaire-initial-load-complete";

function ShipScene() {
  return <svg className={styles.scene} viewBox="0 0 360 170" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id="loader-hull" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#fff"/><stop offset="1" stopColor="#9bc7e8"/></linearGradient>
      <linearGradient id="loader-wave" x1="0" x2="1"><stop stopColor="#0878c5"/><stop offset=".5" stopColor="#51dbff"/><stop offset="1" stopColor="#0878c5"/></linearGradient>
    </defs>
    <g className={styles.ship}>
      <path d="M62 90h236l-20 25c-8 9-21 13-36 13H105c-13 0-23-4-29-13Z" fill="url(#loader-hull)"/>
      <path d="M67 90h229l-9 10H73Z" fill="#f9fcff"/>
      <path d="M83 77h49l-8 13H78Z" fill="#f9fcff"/>
      <path d="M92 66h25l7 11H86Z" fill="#d5ecfa"/>
      <path d="M95 71h6m5 0h6" stroke="#0a5ca6" strokeWidth="4" strokeLinecap="round"/>
      <path d="M110 35v31m-11-21h22m-7-14h-8" stroke="#f9fcff" strokeWidth="3" strokeLinecap="round"/>
      <rect x="134" y="61" width="38" height="27" rx="2" fill="#0876c7"/><rect x="176" y="61" width="38" height="27" rx="2" fill="#0c96e8"/><rect x="218" y="61" width="38" height="27" rx="2" fill="#f2aa08"/>
      <rect x="145" y="43" width="38" height="15" rx="2" fill="#0c96e8"/><rect x="187" y="43" width="38" height="15" rx="2" fill="#0876c7"/><rect x="229" y="43" width="29" height="15" rx="2" fill="#f2aa08"/>
      <path d="M137 64h32m10 0h32m10 0h32m-104-18h31m10 0h31m10 0h24" stroke="#83d7ff" strokeOpacity=".7" strokeWidth="1"/>
      <path d="M111 114c20 19 32 15 45 10" fill="none" stroke="#f7b31a" strokeWidth="2"/>
    </g>
    <g className={styles.waves} fill="none" stroke="url(#loader-wave)" strokeLinecap="round">
      <path d="M20 128c23-13 43-13 64 0s42 13 64 0 42-13 64 0 43 13 65 0 43-13 63 0" strokeWidth="2.5"/>
      <path d="M4 140c24-13 46-13 68 0s43 13 65 0 43-13 65 0 43 13 65 0 43-13 89 0" strokeWidth="1.5" opacity=".8"/>
    </g>
  </svg>;
}

function TruckScene() {
  return <svg className={styles.scene} viewBox="0 0 360 170" aria-hidden="true" focusable="false">
    <defs><linearGradient id="loader-truck" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#fff"/><stop offset="1" stopColor="#a5c8df"/></linearGradient></defs>
    <g className={styles.trails} fill="none" stroke="#f4ad10" strokeLinecap="round"><path d="M27 76h66" strokeWidth="2"/><path d="M12 91h82" strokeWidth="2"/><path d="M42 106h53" strokeWidth="2"/></g>
    <g className={styles.truck}>
      <rect x="97" y="61" width="139" height="69" rx="5" fill="url(#loader-truck)"/>
      <rect x="103" y="100" width="130" height="7" rx="2" fill="#efaa09"/>
      <path d="M236 79h35l20 22v25h-55Z" fill="url(#loader-truck)"/>
      <path d="M244 84h24l15 17h-39Z" fill="#0d4677"/>
      <path d="M244 111h41" stroke="#7faac7" strokeWidth="2"/>
      <path d="M94 125h200" stroke="#d8edf8" strokeWidth="5" strokeLinecap="round"/>
      <g className={styles.wheel}><circle cx="130" cy="129" r="15" fill="#092b4d"/><circle cx="130" cy="129" r="8" fill="#bfd7e6"/><path d="M130 121v16m-8-8h16" stroke="#39759d" strokeWidth="2"/></g>
      <g className={styles.wheel}><circle cx="265" cy="129" r="15" fill="#092b4d"/><circle cx="265" cy="129" r="8" fill="#bfd7e6"/><path d="M265 121v16m-8-8h16" stroke="#39759d" strokeWidth="2"/></g>
    </g>
    <path d="M10 150h340" stroke="#1575ab" strokeWidth="2"/>
    <path className={styles.roadMarks} d="M16 151h40m30 0h40m30 0h40m30 0h40m30 0h40" stroke="#70b8da" strokeWidth="2"/>
  </svg>;
}

function PlaneScene() {
  return <svg className={styles.scene} viewBox="0 0 360 170" aria-hidden="true" focusable="false">
    <defs><linearGradient id="loader-plane" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#fff"/><stop offset="1" stopColor="#b3d5e9"/></linearGradient></defs>
    <g className={styles.airTrails} fill="none" stroke="#f2ad11" strokeLinecap="round"><path d="M31 123h92" strokeWidth="2"/><path d="M58 135h72" strokeWidth="1.5"/><path d="M72 112h53" strokeWidth="1.5"/></g>
    <g className={styles.plane}>
      <path d="M76 95c20-4 118-15 188-17 24-1 39 4 44 10-7 8-21 14-47 15l-175 7c-11 0-18-8-10-15Z" fill="url(#loader-plane)"/>
      <path d="M160 90 118 45l35 7 71 38Z" fill="#f7fbff"/>
      <path d="m171 101-25 37 18-2 57-34Z" fill="#d4e9f5"/>
      <path d="m94 96-29-26 14 2 43 23Z" fill="#f5af09"/>
      <path d="m96 105-26 18 19-3 32-17Z" fill="#d1e5f3"/>
      <path d="M236 84c16-1 34 0 46 3" fill="none" stroke="#0d5a95" strokeWidth="2" strokeDasharray="4 5" strokeLinecap="round"/>
      <path d="M102 95h23" stroke="#f7b418" strokeWidth="3" strokeLinecap="round"/>
    </g>
  </svg>;
}

export function LogisticsLoader() {
  const [phase, setPhase] = useState<"loading" | "leaving" | "gone">("loading");

  useEffect(() => {
    let leaveTimer: number | undefined;
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      try { sessionStorage.setItem(sessionKey, "1"); } catch { /* Storage may be unavailable. */ }
      setPhase("leaving");
      leaveTimer = window.setTimeout(() => setPhase("gone"), 380);
    };
    try {
      if (sessionStorage.getItem(sessionKey) === "1") {
        const frame = window.requestAnimationFrame(() => setPhase("gone"));
        return () => window.cancelAnimationFrame(frame);
      }
    } catch { /* Continue without session persistence. */ }
    if (document.readyState === "complete") finish();
    else window.addEventListener("load", finish, { once: true });
    const fallbackTimer = window.setTimeout(finish, 12000);
    return () => {
      window.removeEventListener("load", finish);
      window.clearTimeout(fallbackTimer);
      if (leaveTimer !== undefined) window.clearTimeout(leaveTimer);
    };
  }, []);

  if (phase === "gone") return null;
  return <div className={`${styles.overlay} logistics-loader ${phase === "leaving" ? styles.leaving : ""}`} role="status" aria-label="Loading A2 LandSeaAir Logistics website" aria-live="polite">
    <div className={styles.animation} aria-hidden="true">
      <div className={`${styles.vehicleScene} ${styles.sea}`}><ShipScene /></div>
      <div className={`${styles.vehicleScene} ${styles.land}`}><TruckScene /></div>
      <div className={`${styles.vehicleScene} ${styles.air}`}><PlaneScene /></div>
      <div className={styles.progressTrack}><span className={styles.progressFill} /></div>
    </div>
  </div>;
}
