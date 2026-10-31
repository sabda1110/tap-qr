import type { reviewGuideId } from "./review-guide-id";

export const reviewGuideEn: typeof reviewGuideId = {
  title: "How to make Google reviews easier for your customers",
  introduction: "A guide for cafes, restaurants, barbershops, laundries, and shops seeking honest feedback and easier customer contact. Small businesses in Pekanbaru, Kerinci, Duri, and other locations can follow these steps.",
  home: "Home",
  breadcrumbLabel: "Breadcrumb",
  contents: "In this guide",
  sections: [
    {
      id: "profil", title: "1. Check your business profile and location",
      paragraphs: [
        "Review your business name, address, opening hours, and contact information on Google Business Profile. Match the Maps location to the right outlet, especially when you have multiple branches. Customers need information that reflects the actual business.",
        "Get the review request link from your business profile. If you configure a TapQR card with a Google Place ID, use the Place ID guide to ensure the review button opens the correct location. Test the link on a phone before printing or sharing a card.",
      ],
    },
    {
      id: "ajak", title: "2. Invite honest feedback after a purchase",
      paragraphs: [
        "Keep the invitation brief and optional: ‘Thank you for visiting. If you would like to share your experience, you can leave a Google review using this card.’ Let customers decide whether to write a review and which rating reflects their experience.",
        "Do not buy reviews, request fake reviews, offer rewards or discounts for reviews, or selectively direct only satisfied customers to Google. WiFi access must not be offered as a reward for reviewing. Treat positive feedback and criticism fairly.",
      ],
    },
    {
      id: "media", title: "3. Make NFC and QR easy to reach",
      paragraphs: [
        "An acrylic stand works well on tables and checkout counters. A PVC card is compact enough to carry or attach to a suitable surface. Both combine NFC tap and QR scan in one medium; customers who do not use NFC can scan the QR instead.",
        "Keep the QR area clear and high contrast. Test the printed QR with a phone camera and check the NFC tap position on the actual medium. Make the main invitation readable and avoid objects, glare, or decorations covering the card.",
      ],
    },
    {
      id: "penjualan", title: "4. Support sales with service and clear ordering options",
      paragraphs: [
        "To support small business sales, start with consistent service and information that helps prospective customers decide. Provide an accessible menu or catalog and the correct WhatsApp number for questions and orders.",
        "TapQR brings together Google reviews, WhatsApp, menus, and social links. Reviews do not guarantee higher sales or Google rankings. Pricing, product quality, location, staff responses, and the customer experience still affect business results.",
      ],
    },
    {
      id: "evaluasi", title: "5. Review progress without counting clicks as reviews",
      paragraphs: [
        "Check your business profile regularly and respond politely to reviews. Use relevant criticism to improve service. Never share private customer information when replying.",
        "Taps, scans, and review button clicks indicate interactions, not proof that a review was submitted. Compare these with reviews actually visible on Google Business Profile. Record service changes and observation periods so your evaluation goes beyond star counts.",
      ],
    },
  ],
  nextTitle: "Prepare your business links and NFC + QR medium",
  placeId: "Find your Google Place ID",
  activation: "Activate your TapQR card",
  pricing: "View NFC + QR PVC card and acrylic stand prices",
  consultation: "Discuss your business needs",
  source: "Google's official guide to getting reviews",
  disclaimer: "TapQR is an independent service and is not affiliated with Google. This guide does not promise review counts, search rankings, or sales results.",
};
