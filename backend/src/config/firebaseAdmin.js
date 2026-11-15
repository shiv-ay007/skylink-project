import { applicationDefault, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { AppError } from '../utils/api.js';

// Firebase authentication is opt-in. This module does not need private keys in git.
// Supply FIREBASE_PROJECT_ID and GOOGLE_APPLICATION_CREDENTIALS in backend/.env.
export function getFirebaseAdminAuth() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  if (!projectId) {
    throw new AppError('Firebase Google sign-in is not configured on the server', 503);
  }
  try {
    const app = getApps()[0] || initializeApp({
      credential: applicationDefault(),
      projectId,
    });
    return getAuth(app);
  } catch (error) {
    console.error('Firebase Admin initialization failed:', error.message);
    throw new AppError('Firebase authentication is temporarily unavailable', 503);
  }
}
