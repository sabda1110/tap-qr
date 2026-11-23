import { getMessaging, getToken, isSupported } from "firebase/messaging";
import { firebaseApp } from "./client";

export async function requestQueueMessagingToken() {
  const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
  if (!vapidKey || typeof window === "undefined" || !("Notification" in window) || !("serviceWorker" in navigator)) return null;
  if (!(await isSupported())) return null;
  const permission = await Notification.requestPermission();
  if (permission !== "granted") return null;
  const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
  return getToken(getMessaging(firebaseApp), { vapidKey, serviceWorkerRegistration: registration });
}
