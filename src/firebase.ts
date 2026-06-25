import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Define interface for global Firebase configuration injected by Vite
declare const __FIREBASE_CONFIG__: {
  projectId?: string;
  appId?: string;
  apiKey?: string;
  authDomain?: string;
  firestoreDatabaseId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  measurementId?: string;
};

// Retrieve values from environment variables (useful for Vercel/production) or compiled config
const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || __FIREBASE_CONFIG__?.apiKey || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || __FIREBASE_CONFIG__?.authDomain || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || __FIREBASE_CONFIG__?.projectId || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || __FIREBASE_CONFIG__?.storageBucket || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || __FIREBASE_CONFIG__?.messagingSenderId || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || __FIREBASE_CONFIG__?.appId || "",
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID || __FIREBASE_CONFIG__?.firestoreDatabaseId || "(default)",
};

// Initialize Firebase App
const app = initializeApp({
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  projectId: config.projectId,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  appId: config.appId
});

// Initialize Firestore with the custom database ID provided by the configuration
export const db = getFirestore(app, config.firestoreDatabaseId || "(default)");


// Standard Error Handling for Firestore as per integration instructions
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
      emailVerified: false,
      isAnonymous: true,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
