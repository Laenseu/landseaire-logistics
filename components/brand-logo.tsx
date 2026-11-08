import Image from "next/image";

export function BrandLogo({ basePath = "", priority = false }: { basePath?: string; priority?: boolean }) {
  const src = `${basePath}/brand/a2-landseaire-logo-transparent.png`;
  return <span className="brand-logo">
    <Image src={src} alt="A2 Landseaire Logistics Inc. logo" width={419} height={150} priority={priority} />
    <Image src={src} alt="" aria-hidden="true" width={419} height={150} className="brand-logo-contrast" />
  </span>;
}
