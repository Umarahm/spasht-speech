import admin from 'firebase-admin';
import { getStorage } from 'firebase-admin/storage';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

// Initialize Firebase Admin SDK (non-fatal if missing)
try {
    if (!admin.apps || admin.apps.length === 0) {
        const projectId = process.env.FIREBASE_PROJECT_ID;
        const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
        const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
        const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

        console.log('Firebase config check:', {
            hasProjectId: !!projectId,
            hasPrivateKey: !!privateKey,
            hasClientEmail: !!clientEmail,
            hasStorageBucket: !!storageBucket
        });

        if (!projectId || !privateKey || !clientEmail) {
            console.warn('Firebase Admin credentials are missing. Continuing without Firebase.');
        } else {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId,
                    privateKey,
                    clientEmail,
                } as admin.ServiceAccount),
                storageBucket
            });
            console.log('Firebase Admin SDK initialized successfully');
        }
    } else {
        console.log('Firebase Admin SDK already initialized');
    }
} catch (error: any) {
    console.error('Failed to initialize Firebase Admin SDK:', error?.message || error);
    console.error('Environment variables available:', {
        FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID ? 'present' : 'missing',
        FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY ? 'present' : 'missing',
        FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL ? 'present' : 'missing',
        FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET ? 'present' : 'missing'
    });
    // Do not throw; continue without Firebase
}

// Check if Firestore is available
let firestoreAvailable = false;
let db: any = null;
let storage: any = null;

try {
    const testDb = admin.firestore();
    // Try a simple operation to check if Firestore is accessible
    await testDb.collection('_test').limit(1).get();
    firestoreAvailable = true;
    db = admin.firestore();
    console.log('✅ Firestore is available and accessible');
} catch (error) {
    console.warn('⚠️ Firestore is not available or not properly configured:', error.message);
    console.warn('Application will continue without Firestore persistence');
    firestoreAvailable = false;
}

try {
    storage = getStorage().bucket();
    console.log('✅ Firebase Storage is available');
} catch (error) {
    console.error('❌ Firebase Storage is not available:', error.message);
    // Don't throw, allow the app to start but storage-dependent endpoints will fail gracefully
}

export { db, storage, admin, firestoreAvailable };
