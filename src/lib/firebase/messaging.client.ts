import { getMessaging, getToken, isSupported, onMessage } from "firebase/messaging";
import { firebaseApp } from "./client";

export type QueueForegroundMessage = { title?: string; body?: string };

export async function requestQueueMessagingToken() {
  const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
  if (!vapidKey || typeof window === "undefined" || !("Notification" in window) || !("serviceWorker" in navigator)) return null;
  if (!(await isSupported())) return null;
  const permission = await Notification.requestPermission();
  if (permission !== "granted") return null;
  const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
  return getToken(getMessaging(firebaseApp), { vapidKey, serviceWorkerRegistration: registration });
}

export async function listenForQueueMessages(onNotification: (message: QueueForegroundMessage) => void) {
  if (typeof window === "undefined" || !(await isSupported())) return null;
  return onMessage(getMessaging(firebaseApp), (payload) => onNotification({
    title: payload.notification?.title,
    body: payload.notification?.body,
  }));
}
