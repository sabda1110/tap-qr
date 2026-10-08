import { adminDashboardEn } from "./admin-dashboard-en";
import type { id } from "./id";

export const en: typeof id = {
  outletProfile: {
    welcome: "Connect with us using the links below.",
    linksLabel: "Outlet links",
    empty: "No links are available yet. Please check back later.",
    unavailable: "Outlet profile unavailable",
    unavailableDescription: "This outlet is not available yet or has been disabled.",
    error: "Unable to load this profile",
    errorDescription: "Please reload the page in a moment.",
    poweredBy: "Powered by",
    channels: {
      google_review: "Leave a Google Review",
      whatsapp: "Contact on WhatsApp",
      instagram: "Instagram",
      tiktok: "TikTok",
      facebook: "Facebook",
      custom: "Open link",
    },
  },
  header: {
    brandHomeLabel: "TapQR home",
    mainNavigationLabel: "Main navigation",
    features: "Features",
    pricing: "Pricing",
    testimonials: "Testimonials",
    login: "Log in",
    register: "Sign up",
    languageLabel: "Choose language",
    openMenu: "Open navigation menu",
    closeMenu: "Close navigation menu",
  },
  auth: {
    backHome: "Back to home",
    languageLabel: "Choose language",
    google: "Continue with Google",
    divider: "or use your email",
    nameLabel: "Full name",
    namePlaceholder: "Enter your full name",
    emailLabel: "Email",
    emailPlaceholder: "name@yourbusiness.com",
    passwordLabel: "Password",
    passwordPlaceholder: "At least 8 characters",
    confirmPasswordLabel: "Confirm password",
    confirmPasswordPlaceholder: "Enter your password again",
    validation: {
      nameMin: "Name must be at least 2 characters.",
      email: "Enter a valid email address.",
      passwordMin: "Password must be at least 8 characters.",
      passwordsMismatch: "Passwords do not match.",
    },
    errors: {
      emailInUse: "This email is already registered. Please log in instead.",
      googleCancelled: "Google sign-in was cancelled.",
      invalidCredential: "The email or password is incorrect.",
      unavailable: "Authentication could not be completed. Please try again shortly.",
      weakPassword: "The password is too weak. Use at least 8 characters.",
    },
    login: {
      kicker: "Welcome back",
      title: "Log in to TapQR",
      description:
        "Manage your links, track every tap, and help your business earn more reviews.",
      submit: "Log in",
      switchPrompt: "New to TapQR?",
      switchAction: "Create an account",
      showcaseKicker: "One tap, real impact",
      showcaseTitle: "Connect customers with your business.",
      showcaseDescription:
        "One simple page for Google Reviews, WhatsApp, WiFi, menus, and every channel that matters.",
      benefits: ["Ready in just a few minutes", "Change destinations at any time"],
    },
    register: {
      kicker: "Get started with TapQR",
      title: "Create your account",
      description:
        "Set up your business's first tap and scan experience without a complicated process.",
      submit: "Create account",
      switchPrompt: "Already have an account?",
      switchAction: "Log in instead",
      showcaseKicker: "Made for small businesses",
      showcaseTitle: "Turn every visit into a new connection.",
      showcaseDescription:
        "Help customers find your business, leave a review, and reconnect after every transaction.",
      benefits: ["QR and NFC in one experience", "Easy-to-read tap and scan insights"],
    },
  },
  cardClaim: {
    "title": "Activate your TapQR card",
    "description": "Complete two quick steps to get your card ready for customers.",
    "step": "Step {current} of 2",
    "steps": { outlet: "Create or choose an outlet", links: "Link & configure card" },
    "newOutlet": "Create a new outlet",
    "existingOutlet": "Choose an existing outlet",
    "selectOutlet": "Choose an outlet",
    "noOutlets": "No outlets are registered yet. Create a new outlet to continue.",
    "outletDescription": "Choose the outlet that will use this card, or create a new outlet first.",
    "linksDescription": "Enter a Google Place ID for reviews, then add social links if needed.",
    "next": "Continue to step 2",
    "back": "Back to step 1",
    "card": "TapQR card ID",
    "name": "Outlet name",
    "slug": "Outlet profile address",
    "help": "Use lowercase letters, numbers, and hyphens.",
    "save": "Claim & activate card",
    "saving": "Saving…",
    "cancel": "Close",
    "success": "Outlet added and card activated.",
    "error": "Unable to save. Check the card and try again.",
    "slugError": "This profile address is already taken. Choose another.",
    "invalid": "Complete the outlet details, card ID, and at least one valid link.",
    "outletInvalid": "Enter the outlet name, profile address, and operational address.",
    "outletRequired": "Choose an outlet to continue.",
    "placeIdGuide": {
      "quick": "Find your business Place ID with the",
      "googleDocs": "Google guide",
      "tutorial": "View the complete TapQR tutorial",
    },
    "outlets": "Your outlets",
    "profile": "View outlet profile"
},
  googlePlaceIdTutorial: {
    title: "How to find a Google Place ID",
    description: "Use a Place ID so the Google Review button on your TapQR card opens the correct business profile.",
    steps: [
      { title: "Open Place ID Finder", description: "Open Google’s official tool in a new tab." },
      { title: "Find your business", description: "Enter your business name and operational address until the correct location pin appears." },
      { title: "Copy the Place ID", description: "Select the business location, then copy the Place ID code that starts with ChIJ." },
      { title: "Paste it in TapQR", description: "Return to card claim, paste the code in the Google Place ID field, then activate the card." },
    ],
    googleDocs: "Open Google Place ID Finder",
    backHome: "Back to home",
  },
  userDashboard: {
    kicker: "Business dashboard",
    greeting: "Hello",
    description: "Set up your TapQR, then help customers find the right link in one tap or scan.",
    sidebar: {
      dashboard: "Dashboard",
      logout: "Log out",
      navigationLabel: "Dashboard navigation",
      qrGenerator: "Create QR",
    },
    startCard: {
      title: "Set up your first experience",
      description: "Create your business profile and choose a primary destination so your QR or NFC media is ready for customers.",
      action: "Set up business",
    },
    statusCards: {
      mediaTitle: "TapQR media",
      media: "No QR or NFC media is connected yet. You can add one after your business profile is ready.",
      profileTitle: "Account profile",
      profile: "Your account is active. Next, complete your business profile to start using TapQR.",
    },
  },
  adminDashboard: adminDashboardEn,
  qrGenerator: {
    kicker: "QR generator",
    title: "Create a QR code for your link",
    inputLabel: "Destination link",
    inputPlaceholder: "https://example.com/menu",
    invalidUrl: "Enter a complete link that starts with http:// or https://.",
    generate: "Create QR",
    previewTitle: "QR preview",
    emptyPreview: "Enter a link to create your QR code.",
    previewAlt: "QR code for your business link",
    download: "Download PNG",
  },
  home: {
    titleStart: "One Tap, More",
    titleAccent: "Google Reviews",
    titleEnd: "& Returning Customers",
    description:
      "Help customers leave a Google review, connect to WiFi, open WhatsApp, browse your menu, and follow your social media—all from a single tap or scan.",
    getStarted: "Start Free",
    tryDemo: "See how it works",
    illustrationAlt:
      "Customers connecting with a business through their digital devices",
  },
  features: {
    heading: {
      kicker: "Key Features",
      titleStart: "Everything your business needs to",
      titleAccent: "turn one tap",
      titleEnd: "into loyal customers",
    },
    reviewGrowth: {
      eyebrow: "REPUTATION",
      title: "Grow Your Google Reviews",
      description:
        "Send happy customers straight to your review page. A shorter journey helps your business collect more reviews without making customers search for the right place.",
      imageAlt:
        "A customer leaving a review after tapping a TapQR card at a cafe",
    },
    customerHub: {
      eyebrow: "CONNECTION",
      title: "One Tap to Every Channel",
      description:
        "Bring WiFi, WhatsApp, your menu, location, and social media into one experience. Customers can tap or scan to find the action they need.",
      imageAlt:
        "A phone connecting customers to WiFi, chat, menu, location, and social media",
    },
    flexibleNfcQr: {
      eyebrow: "FLEXIBILITY",
      title: "Change Destinations Without Reprinting",
      description:
        "Update TapQR links and destinations from your dashboard at any time. Keep using the same NFC and QR card as your promotions, menu, or business needs change.",
      imageAlt:
        "A business owner updating an NFC and QR card destination from a phone",
    },
    scanAnalytics: {
      eyebrow: "INSIGHT",
      title: "Understand Every Tap and Scan",
      description:
        "See how customers interact with TapQR, which channels they open most, and the activity trends that help you make better business decisions.",
      imageAlt:
        "A business owner viewing TapQR tap and scan analytics on a dashboard",
    },
  },
  pricing: {
    heading: {
      kicker: "Simple Pricing",
      titleStart: "Choose the TapQR media",
      titleAccent: "that fits",
      titleEnd: "your business",
      description:
        "Start with a QR code you print yourself or choose ready-to-use media for your tables and checkout counter.",
    },
    selfPrint: {
      name: "Self-Print QR",
      badge: "",
      description: "A print-ready QR file you can produce yourself.",
      price: "Rp5,000",
      priceDetail: "/ unit",
      features: [
        "Print-ready QR file",
        "Design with your business identity",
        "Updatable link destination",
      ],
      cta: "Choose Self-Print",
    },
    qrBoard: {
      name: "QR Board",
      badge: "Most Popular",
      description: "A ready-to-use QR board printed by the TapQR team.",
      price: "Rp10,000",
      priceDetail: "/ unit",
      features: [
        "Ready-to-display QR board",
        "Printed by the TapQR team",
        "Updatable link destination",
      ],
      cta: "Choose QR Board",
    },
    nfcBundle: {
      name: "NFC + QR Board",
      badge: "Most Complete",
      description: "NFC tap and QR scan experiences in one medium.",
      price: "Rp20,000",
      priceDetail: "/ unit",
      features: [
        "NFC tap and QR scan",
        "Ready-to-display QR board",
        "Made for tables and counters",
      ],
      cta: "Choose NFC Bundle",
    },
    note:
      "Media prices are a one-time charge per unit. Shipping and advanced dashboard services may be calculated separately.",
  },
  testimonials: {
    heading: {
      kicker: "Customer Stories",
      titleStart: "Experiences from businesses",
      titleAccent: "growing with",
      titleEnd: "TapQR",
    },
    ratingLabel: "5 out of 5 stars",
    coffeeShop: {
      quote:
        "Happy customers now know exactly what to tap. Asking for a review feels more natural and no longer slows down the checkout queue.",
      name: "Rina A.",
      role: "Coffee Shop Owner",
      initials: "RA",
    },
    barbershop: {
      quote:
        "One card on the counter is enough to guide customers to our Google Review and WhatsApp. Our team no longer has to explain a long process.",
      name: "Bagus P.",
      role: "Barbershop Owner",
      initials: "BP",
    },
    laundry: {
      quote:
        "When a promotion changes, we can update the link without printing new media. It is practical for a small business that needs to move quickly.",
      name: "Dewi L.",
      role: "Laundry Owner",
      initials: "DL",
    },
  },
  footer: {
    brandHomeLabel: "Back to the TapQR homepage",
    tagline:
      "One tap to help small businesses earn more reviews, connect with customers, and grow with better insight.",
    navigationLabel: "Footer navigation",
    navigationTitle: "Explore",
    home: "Home",
    features: "Features",
    pricing: "Pricing",
    testimonials: "Testimonials",
    ctaTitle: "Ready to make every tap count?",
    ctaDescription:
      "Choose the TapQR media that fits your needs and start connecting customers with your business.",
    ctaLabel: "View pricing options",
    rights: "All rights reserved.",
    backToTop: "Back to top",
  },
};
