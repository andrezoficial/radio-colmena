import { initializeApp } from 'firebase/app';
import {
  getFirestore, collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp
} from 'firebase/firestore';

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Sin variables de entorno la web funciona igual, pero el chat y las solicitudes quedan solo locales.
export const firebaseEnabled = Boolean(config.apiKey && config.projectId);
const db = firebaseEnabled ? getFirestore(initializeApp(config)) : null;

const formatTime = (date) =>
  new Intl.DateTimeFormat('es-CO', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: 'America/Bogota' }).format(date);

// Escucha los últimos 50 mensajes en tiempo real. Devuelve la función para cancelar.
export function subscribeChat(onMessages, onError) {
  const q = query(collection(db, 'chat'), orderBy('createdAt', 'desc'), limit(50));
  return onSnapshot(
    q,
    (snap) => {
      const list = snap.docs
        .map((d) => {
          const { user, text, createdAt } = d.data({ serverTimestamps: 'estimate' });
          return { id: d.id, user, text, time: formatTime(createdAt ? createdAt.toDate() : new Date()) };
        })
        .reverse();
      onMessages(list);
    },
    onError
  );
}

export function sendChatMessage({ user, text }) {
  return addDoc(collection(db, 'chat'), {
    user: user.slice(0, 24),
    text: text.slice(0, 280),
    createdAt: serverTimestamp()
  });
}

export function sendSongRequest({ name, song, artist, message }) {
  return addDoc(collection(db, 'requests'), {
    name: name.slice(0, 60),
    song: song.slice(0, 100),
    artist: (artist || '').slice(0, 100),
    message: (message || '').slice(0, 200),
    createdAt: serverTimestamp()
  });
}
