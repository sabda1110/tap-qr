import type { pricingId } from "./pricing-id";

export const pricingEn: typeof pricingId = {
    promotion: { title: "November 2026 promotion", period: "Valid 1–30 November 2026 (WIB). Shipping excluded.", originalPrice: "Regular price", discountedPrice: "Promotional price" },
    heading: {
      kicker: "Simple Pricing",
      titleStart: "Choose the TapQR media",
      titleAccent: "that fits",
      titleEnd: "your business",
      description:
        "Every medium includes NFC and QR. Choose the material that fits, or get the complete package with Google Review and a landing page.",
    },
    pvcCard: {
      name: "PVC Card",
      badge: "",
      description: "A PVC NFC Google Review card with a QR code, light enough to carry or attach to a surface.",
      price: "Rp79.000",
      priceDetail: "/ unit",
      features: [
        "NFC tap and QR scan in one card",
        "Design with your business identity",
        "Updatable link destination",
      ],
      cta: "Choose PVC Card",
    },
    acrylicBoard: {
      name: "Acrylic Standee",
      badge: "Most Popular",
      description: "An acrylic Google Review stand with NFC and QR, ready for tables and checkout counters.",
      price: "Rp69.000",
      priceDetail: "/ unit",
      features: [
        "NFC tap and QR scan in one board",
        "Sturdy acrylic, ready to display",
        "Updatable link destination",
      ],
      cta: "Choose Acrylic Standee",
    },
    businessBundle: {
      name: "Business Package",
      badge: "Most Complete",
      description: "An acrylic NFC + QR board, plus Google Review setup and a landing page for your business.",
      price: "Rp499.000",
      priceDetail: "/ package",
      features: [
        "Acrylic NFC + QR board",
        "Google Business Profile and review link setup",
        "Business landing page (2 revisions)",
      ],
      cta: "Choose Business Package",
      note: "Domain billed separately (approx. Rp200–300k/year). We help you choose and register it.",
      whatsappMessage:
        "Hello TapQR, I am interested in purchasing the Business Package for Rp499.000.\n\nName: \nBusiness name: \nBusiness type: \nCity: \n\nI need:\n- Acrylic NFC + QR board\n- Google Business Profile and review link setup\n- Business landing page (2 revisions)\n\nDomain preference:\n[ ] I already have a domain\n[ ] I would like help choosing and registering a domain\n[ ] I do not need a domain yet\n\nPlease share the next steps for ordering. Thank you.",
    },
    note:
      "Need a domain too? Business Package + Domain starts at Rp799.000. Contact us.",
  };
