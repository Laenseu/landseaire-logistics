export const seoServices = {
  "port-agency": {
    title: "Port Agency Services in the Philippines",
    description: "Port agency and vessel support for foreign and local vessels in Philippine international trade. Contact A2 Landseaire Logistics Inc. in Manila.",
    eyebrow: "Port agency",
    lead: "A2 Landseaire Logistics Inc. supports foreign and local vessels calling at Philippine ports. Our Manila-based team coordinates vessel clearance and the practical services needed around a port call.",
    offerings: [
      ["Vessel clearance", "Entrance and exit clearance for vessels, including the coordination of required documentation."],
      ["Port call support", "Vessel attendance, crew changes, bunkering coordination and permitting, and Cash to Master delivery."],
      ["Specialist assistance", "Support during dry docking and repairs, load and discharge surveys, cargo superintendents, protective agency services and P&I advice."],
    ],
    contactService: "Vessel Operations Support",
    nextStep: "Tell us the vessel name, port, expected dates and the assistance you need. Our team can review the request and discuss the next steps.",
  },
  "customs-brokerage": {
    title: "Customs Brokerage and Cargo Clearance in Manila",
    description: "Customs brokerage, cargo release, ship-spares clearance and special vessel documentation from A2 Landseaire Logistics Inc. in Manila.",
    eyebrow: "Customs brokerage",
    lead: "A2 Landseaire Logistics Inc. provides customs clearance and cargo customs release support, including clearance and delivery of ship spares. The team includes a licensed customs broker.",
    offerings: [
      ["Cargo customs release", "Brokerage support for cargo customs releasing and related clearance work."],
      ["Ship spares", "Customs clearance and delivery coordination for ship spares."],
      ["Special vessel documentation", "Assistance with MARINA Exemption Certificates and customs conversion for special vessels, including dredgers and scientific vessels."],
    ],
    contactService: "Brokerage and Cargo Customs Release",
    nextStep: "Share the cargo or vessel details, the port or location and the type of clearance required so our team can review your request.",
  },
  "freight-forwarding": {
    title: "Freight Forwarding and Trucking in the Philippines",
    description: "Domestic and international cargo forwarding and trucking support from A2 Landseaire Logistics Inc. in Manila, Philippines.",
    eyebrow: "Freight forwarding",
    lead: "A2 Landseaire Logistics Inc. arranges domestic and international cargo forwarding and trucking as part of its broader logistics services. We work with clients to identify the support their shipment requires.",
    offerings: [
      ["Cargo forwarding", "Coordination for domestic and international cargo forwarding requests."],
      ["Trucking", "Trucking support connected to cargo movements and logistics requirements."],
      ["Tailored logistics", "A service plan based on the shipment, location and specific needs you share with us."],
    ],
    contactService: "Cargo Forwarding and Trucking",
    nextStep: "Send the origin, destination, cargo description, estimated dates and any handling requirements. Our team can discuss suitable logistics support.",
  },
} as const;

export type SeoServiceSlug = keyof typeof seoServices;
