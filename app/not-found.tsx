const assetBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function NotFound() {
  return <main className="not-found"><p className="eyebrow">Landseaire Logistics Co.</p><p className="not-found-code">404</p><h1>This page is not available.</h1><p>The link may be out of date or the page may have moved. Return to the Landseaire Logistics website to find our services and contact details.</p><a className="button" href={`${assetBasePath}/`}>Return to homepage</a></main>;
}
