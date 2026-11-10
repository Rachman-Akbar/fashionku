const envFirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const windowFirebaseConfig = typeof window !== "undefined" ? window.__MARKETKU_FIREBASE_CONFIG__ : null;

const firebaseConfig = {
  ...envFirebaseConfig,
  ...(windowFirebaseConfig || {}),
};

const requiredConfigKeys = ["apiKey", "authDomain", "projectId", "appId"];

export function hasFirebaseConfig() {
  return requiredConfigKeys.every((key) => Boolean(firebaseConfig[key]));
}

let firebasePromise = null;

export function getFirebase() {
  if (!hasFirebaseConfig()) {
    return Promise.reject(new Error("Konfigurasi Firebase Google Login belum lengkap."));
  }

  if (!firebasePromise) {
    firebasePromise = (async () => {
      const [{ initializeApp, getApps }, { getAuth, GoogleAuthProvider }] =
        await Promise.all([import("firebase/app"), import("firebase/auth")]);
      const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
      const firebaseAuth = getAuth(app);
      return {
        firebaseAuth,
        googleProvider: new GoogleAuthProvider(),
      };
    })().catch((error) => {
      firebasePromise = null;
      throw error;
    });
  }

  return firebasePromise;
}
