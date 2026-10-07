import { outletsEn } from "./outlets-en";
import { activationPreviewEn } from "./activation-preview-en";
import { activationOnboardingEn } from "./activation-onboarding-en";

export const adminDashboardEn = {
  outlets: outletsEn,
  sidebar: {
    outlets: "Outlets",
    cards: "Card master",
    activation: "QR activation",
    openMenu: "Open dashboard menu",
    closeMenu: "Close dashboard menu",
    logout: "Log out",
    navigationLabel: "Admin navigation",
    roleLabel: "Administrator",
  },
  cards: {
    kicker: "Card master",
    title: "Manage your TapQR card inventory",
    description:
      "Generate new cards, find cards already created, and manage inventory from one place.",
    searchLabel: "Search card ID",
    searchPlaceholder: "Example: TQR-000001",
    searchAction: "Search",
    generateAction: "Generate cards",
    generatorTitle: "Generate new cards",
    quantityLabel: "Number of cards",
    materialLabel: "Card material",
    acrylic: "Acrylic",
    pvc: "PVC",
    generateSubmit: "Generate now",
    cancel: "Cancel",
    table: {
      cardId: "Card ID",
      material: "Material",
      claimStatus: "Claim status",
      enabled: "Status",
      action: "Action",
    },
    unclaimed: "Unclaimed",
    claimed: "Claimed",
    enabled: "Enabled",
    disabled: "Disabled",
    delete: "Delete",
    selectedCount: "{count} cards selected",
    deleteSelected: "Delete selected",
    deleteAllUnused: "Delete all unused",
    selectAll: "Select all unclaimed cards on this page",
    selectCard: "Select card",
    confirmDeleteSelected:
      "Delete the selected cards? Cards already used will remain safe.",
    confirmDeleteAllUnused:
      "Delete every unused card? Cards already claimed will remain safe.",
    deleteSelectedTitle: "Delete selected cards?",
    deleteAllUnusedTitle: "Delete all unused cards?",
    deleteSuccess: "Cards deleted successfully.",
    deleteNoop: "There are no cards available to delete.",
    empty: "No matching cards yet.",
    previous: "Previous",
    next: "Next",
    loading: "Loading cards...",
    requestError: "Cards could not be processed. Please try again.",
    generated: "New cards have been created.",
  },
  activation: {
    preview: activationPreviewEn,
    onboarding: activationOnboardingEn,
    kicker: "QR activation",
    title: "Activate a card for one direct destination",
    description:
      "Connect a TapQR card to Google Review or one social link without creating an outlet first.",
    social: {
      title: "Choose the card destination",
      description:
        "Choose the one destination customers will open after scanning or tapping.",
    },
    channels: {
      google_review: {
        title: "Google Review",
        description: "Send customers to the official Google review page.",
      },
      whatsapp: {
        title: "WhatsApp",
        description: "Open a business WhatsApp chat directly.",
      },
      instagram: {
        title: "Instagram",
        description: "Send visitors to an Instagram profile or post.",
      },
      tiktok: {
        title: "TikTok",
        description: "Send visitors to a TikTok profile or post.",
      },
      custom: {
        title: "Another link",
        description: "Use a complete link for a custom destination.",
      },
    },
    cardIdLabel: "Card ID",
    cardIdPlaceholder: "Example: TQR-7B83...",
    cardIdHelp: "Enter an ID from the Card master menu.",
    destinations: {
      google_review: {
        label: "Google Review link",
        placeholder: "https://g.page/.../review",
        helpText: "Use the official review link from Google Business Profile.",
      },
      whatsapp: {
        label: "WhatsApp number",
        placeholder: "628123456789",
        helpText: "Use an Indonesian number format, for example 628123456789.",
      },
      instagram: {
        label: "Instagram link",
        placeholder: "https://instagram.com/businessname",
        helpText: "Enter an Instagram profile or content link.",
      },
      tiktok: {
        label: "TikTok link",
        placeholder: "https://tiktok.com/@businessname",
        helpText: "Enter a TikTok profile or content link.",
      },
      custom: {
        label: "Destination link",
        placeholder: "https://...",
        helpText: "Enter a complete link beginning with http:// or https://.",
      },
    },
    googleSearch: {
      label: "Find a business on Google",
      placeholder: "Enter a business name or location",
      helpText:
        "Choose a business from the results so its Place ID and official review link are created automatically.",
      searching: "Searching...",
      resultsLabel: "Google business search results",
      error:
        "Google search is not available yet. Check the Google Places API configuration.",
    },
    submit: "Activate QR",
    submitting: "Activating...",
    success: "The card has been activated.",
    requestError:
      "The card could not be activated. Make sure the ID exists and is not linked to a business.",
    validation: {
      cardId: "Enter a valid card ID.",
      destinationUrl: "Enter a valid complete link.",
    },
    direct: {
      title: "No outlet required",
      description:
        "This activation lets a card work directly for one destination, without an outlet or business owner profile.",
      points: [
        "One card for one primary destination",
        "The destination can be updated when needed",
        "Ready for QR and NFC use",
      ],
    },
  },
};
