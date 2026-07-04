import { initializeApp, getApps, cert } from 'firebase-admin/app';
import dotenv from 'dotenv';

dotenv.config();

// Ensure the user provides the service account JSON string in .env
try {
  if (getApps().length === 0) {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      initializeApp({
        credential: cert(serviceAccount)
      });
      console.log('Firebase Admin initialized with provided service account key.');
    } else {
      console.warn('WARNING: FIREBASE_SERVICE_ACCOUNT_KEY not found in .env');
      initializeApp(); // Will attempt to use application default credentials 
    }
  }
} catch (error) {
  console.error('Failed to initialize Firebase Admin:', error);
}
