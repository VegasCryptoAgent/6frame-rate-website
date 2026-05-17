import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
const dbId = (firebaseConfig as any).firestoreDatabaseId;
console.log('Firebase Config loaded. Project ID:', firebaseConfig.projectId, 'Target DB ID:', dbId);
export const db = dbId && dbId !== '(default)' ? getFirestore(app, dbId) : getFirestore(app);
console.log('Firestore initialized. Resulting DB ID:', (db as any)._databaseId?.database || 'default');
export const auth = getAuth(app);
