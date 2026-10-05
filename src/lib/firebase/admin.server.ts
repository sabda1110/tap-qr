import { applicationDefault, cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function getAdminCredential() {
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (serviceAccountKey) {
    try {
      const decoded = serviceAccountKey.trim().startsWith("{")
        ? serviceAccountKey
        : Buffer.from(serviceAccountKey, "base64").toString("utf-8");
      return cert(JSON.parse(decoded));
    } catch (error) {
      console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:", error);
    }
  }

  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const projectId = process.env.FIREBASE_PROJECT_ID ?? process.env.VITE_FIREBASE_PROJECT_ID;

  if (clientEmail && privateKey) {
    return cert({
      projectId,
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, "\n"),
    });
  }

  return applicationDefault();
}

function getAdminApp() {
  return (
    getApps()[0] ??
    initializeApp({
      credential: getAdminCredential(),
      projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    })
  );
}

export function getFirebaseAdminAuth() {
  return getAuth(getAdminApp());
}

export function getFirebaseAdminFirestore() {
  return getFirestore(getAdminApp());
}
