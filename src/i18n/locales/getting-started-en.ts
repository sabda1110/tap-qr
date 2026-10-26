import type { gettingStartedId } from "./getting-started-id";

export const gettingStartedEn: typeof gettingStartedId = {
  navigationLabel: "Activation guide",
  newTab: "Open guide in a new tab",
  backHome: "Back to home",
  kicker: "How TapQR works",
  titleStart: "From your first order to",
  titleAccent: "your first tap.",
  description: "New to TapQR? Follow these four stages to set up your Social / Google Review card.",
  journey: {
    title: "Your journey map",
    hint: "Click or tap a stop to move your pawn and read the guide. Hover over a stop for a quick preview.",
    start: "Start", finish: "Ready to use", previous: "Previous", next: "Next", restart: "Restart map",
    currentStep: "Guide step",
    readStep: "Read this step's instructions",
    note: "This is a guide. Moving the pawn does not place an order or activate your card.",
    labels: { purchase: "Buy a card", account: "Create account", outlet: "Set up outlet", activate: "Activate card" },
  },
  steps: {
    purchase: {
      title: "Choose and order your card",
      badge: "No account needed",
      description: "Pick a PVC card or acrylic stand that suits your business.",
      instructions: [
        "Click Buy cards, choose Social, a design, and a quantity. Enter your contact and shipping details.",
        "Click Place order, then Continue to admin WhatsApp. Send the prepared message.",
        "Confirm the final price, shipping fee, and payment with the admin, then wait for delivery.",
      ],
      tip: "Track delivery through Check order using the phone number you ordered with.",
    },
    account: {
      title: "Create your TapQR account",
      badge: "Once your card arrives",
      description: "Your account is where you manage your cards and business information.",
      instructions: [
        "Scan the QR on your unactivated card with your phone camera.",
        "Choose Create account, then use Google or enter your name, email, and password. Already registered? Just log in.",
        "After signing in, the activation guide opens with your card ID already filled in.",
      ],
      tip: "Already on the dashboard? Click Activate card. Scan the QR or enter the card ID in the Add details step.",
    },
    outlet: {
      title: "Set up your outlet",
      badge: "Your business profile",
      description: "An outlet is the business or branch that will use this card.",
      instructions: [
        "In Choose business, select New business.",
        "Enter your outlet name, a unique profile address, and your business address. Add an optional logo so customers recognize you.",
        "Click Continue to choose the links you want customers to see.",
      ],
      tip: "Have an outlet already? Choose Existing business to connect the card to it.",
    },
    activate: {
      title: "Add links & activate your card",
      badge: "The final step",
      description: "Choose where customers go when they tap or scan your card.",
      instructions: [
        "In Choose links, select at least one: Google Review, WhatsApp, Instagram, or TikTok.",
        "Continue to Add details. Enter your WhatsApp number, username, or Google Place ID using the available guide. For a menu, catalog, or website, click Add another link.",
        "Check the card ID and destinations, then click Activate card. Your new outlet and card are saved together.",
      ],
      tip: "Links belong to each card. Two cards at the same outlet can have different destinations.",
    },
  },
  readyTitle: "All set? Give your card a try!",
  readyDescription: "Scan the QR or tap NFC with a compatible phone. Check that the right destination opens, then place the card on your counter or a table within easy reach of customers.",
  buy: "Choose my card",
  register: "Create a TapQR account",
  wifiNote: "Ordering a WiFi card? Arrange the network setup with the admin when ordering; the activation guide above is for Social / Google Review cards.",
};
