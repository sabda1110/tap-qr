import type { queueId } from "./queue-id";

export const queueEn: typeof queueId = {
  owner: {
    nav: "Queue", title: "Digital Queue", kicker: "Outlet add-on", description: "Manage QR and walk-in customers in one queue.",
    selectOutlet: "Choose outlet", noAddon: "No outlet has the Digital Queue add-on enabled yet.", empty: "No customers are in today's queue.",
    addWalkIn: "Add walk-in", name: "Display name", service: "Service", namePlaceholder: "Customer name", servicePlaceholder: "Example: Haircut",
    add: "Add to queue", adding: "Adding…", waiting: "Waiting", called: "Called", serving: "In service", completed: "Completed", no_show: "No-show", cancelled: "Cancelled",
    sourceOnline: "Online", sourceWalkIn: "Walk-in", call: "Call", start: "Start service", finish: "Complete", skip: "Skip", cancel: "Cancel", reopen: "Return to queue",
    refresh: "Refresh", open: "Open queue", close: "Close queue", openSuccess: "Queue is open.", closeSuccess: "Queue is closed to new customers.", error: "The queue could not be updated. Try again.", added: "Customer added to the queue.", updated: "Queue status updated.",
    cashierAccess: "Cashier access", pinTitle: "Queue cashier PIN", pinHelp: "This PIN is separate from Membership. Cashiers can manage the queue without signing in to the owner account.", newPin: "New PIN (4–6 digits)", confirmPin: "Repeat PIN", pinMismatch: "The PINs do not match or are invalid.", savePin: "Save cashier PIN", pinConfigured: "Cashier PIN is active", pinNotConfigured: "Cashier PIN has not been set", cashierLink: "Cashier mode link", openCashier: "Open cashier mode", copyCashier: "Copy cashier link", copied: "Cashier link copied.", saved: "Queue cashier PIN saved.",
  },
  public: {
    title: "Join the queue", description: "Your number joins the same queue as customers who walk in.", closed: "The queue is closed", closedHelp: "Please try again when the outlet opens the queue.", name: "Display name", namePlaceholder: "Your name",
    service: "Service", servicePlaceholder: "Example: Haircut", submit: "Get a number", submitting: "Processing…", privacy: "No account is needed.", error: "A queue number could not be created. Please try again.",
    ticketTitle: "Your queue number", ticketHelp: "Keep this page open to check your queue status.", notifyPrompt: "Want a notification when the cashier calls your number?", enableNotifications: "Enable turn notifications", notificationsEnabled: "Turn notifications are enabled on this device.", notificationsUnavailable: "Notifications are unavailable in this browser or permission has not been granted.", notificationError: "Notifications could not be enabled. Try again.", outlet: "Outlet", status: "Status", serviceLabel: "Service", unavailable: "Queue unavailable", unavailableHelp: "The queue add-on is inactive or this outlet could not be found.",
    statuses: { waiting: "Waiting", called: "Please come to the counter", serving: "In service", completed: "Completed", no_show: "Your turn was skipped", cancelled: "Queue cancelled" },
    notificationTitle: "It's your turn", notificationBody: "Queue number {number} has been called. Please go to the counter.",
  },
  cashier: { title: "Queue cashier mode", pinTitle: "Enter cashier PIN", pin: "4–6 digit PIN", login: "Open queue", logout: "End shift", locked: "Too many attempts. Try again in 15 minutes.", invalidPin: "The cashier PIN is incorrect." },
};
