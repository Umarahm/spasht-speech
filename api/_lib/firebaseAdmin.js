import admin from 'firebase-admin';

const projectId = process.env.FIREBASE_PROJECT_ID;
const privateKey = (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n');
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

if (!admin.apps.length) {
    if (!projectId || !privateKey || !clientEmail) {
        throw new Error('Missing Firebase Admin credentials in environment');
    }
    admin.initializeApp({
        credential: admin.credential.cert({ projectId, privateKey, clientEmail }),
        storageBucket
    });
}

export const bucket = admin.storage().bucket();


