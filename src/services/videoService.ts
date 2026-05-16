import { collection, query, where, orderBy, onSnapshot, getDocs, getDocFromServer, doc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}

export function handleFirestoreError(error: any, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
    },
    operationType,
    path
  };
  console.error('Firestore Error Details:', {
    code: error?.code,
    message: error?.message,
    details: error?.details,
    stack: error instanceof Error ? error.stack : undefined
  });
  console.error('Full Error Info JSON: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export async function testConnection() {
  try {
    // Attempting a server-side fetch of a non-existent doc to test connectivity and rules
    await getDocFromServer(doc(db, 'system', 'connection-test'));
    console.log('Firebase connection test successful');
  } catch (error: any) {
    console.warn('Firebase connection test warning:', error.message);
    if (error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration or internet connection.");
    }
  }
}

export interface Video {
  id: string;
  showcaseId: string;
  title: string;
  code: string;
  url: string;
  order: number;
  description?: string;
  duration?: string;
}

export function subscribeToVideos(showcaseId: string, callback: (videos: Video[]) => void) {
  console.log('Subscribing to videos for showcase:', showcaseId);
  console.log('Firestore DB instance:', db);
  const q = query(
    collection(db, 'videos'),
    where('showcaseId', '==', showcaseId)
  );

  return onSnapshot(q, (snapshot) => {
    const videos = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Video[];
    callback(videos);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, `videos?showcaseId=${showcaseId}`);
  });
}
