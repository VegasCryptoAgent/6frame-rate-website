import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

async function seed() {
  const db = getFirestore(app);
  console.log('Seeding default database...');
  
  try {
    const videosCol = collection(db, 'videos');
    const video = {
      showcaseId: 'cinematic-identity',
      title: "El Patron",
      code: "EP-ID",
      url: "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0374515011.firebasestorage.app/o/El%20Patron.mp4?alt=media&token=944d79e2-2092-4519-b2f1-06966c7bb7bc",
      order: 1
    };
    await addDoc(videosCol, video);
    console.log('Seeded one video successfully');
  } catch (error) {
    console.error('Error seeding:', error);
  }
}

seed();
