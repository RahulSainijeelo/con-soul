import { cert, getApps, initializeApp, App, ServiceAccount } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

let _db: Firestore | null = null;
let _app: App | null = null;

function getFirebaseApp(): App {
  if (_app) return _app;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Firebase configuration is missing. Please set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY environment variables."
    );
  }

  const serviceAccount = {
    projectId,
    clientEmail,
    privateKey,
  } as ServiceAccount;

  if (!getApps().length) {
    _app = initializeApp({
      credential: cert(serviceAccount),
      projectId: serviceAccount.projectId,
    });
  } else {
    _app = getApps()[0];
  }

  return _app;
}

// Lazy getter - only initializes Firebase when actually accessed at runtime
// This prevents build-time crashes when env vars are not available
export const db: Firestore = new Proxy({} as Firestore, {
  get(_target, prop, receiver) {
    if (!_db) {
      const app = getFirebaseApp();
      _db = getFirestore(app);
    }
    return Reflect.get(_db, prop, receiver);
  },
});