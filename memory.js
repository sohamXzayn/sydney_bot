const { initializeApp } = require("firebase/app");
const { getDatabase, ref, push, set, query, orderByChild, limitToLast, get, remove } = require("firebase/database");

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const getContext = async (channelId, limit = 10) => {
  const dbRef = ref(db, `conversations/${channelId}`);
  const q = query(dbRef, orderByChild("timestamp"), limitToLast(limit));
  const snapshot = await get(q);
  
  const history = [];
  snapshot.forEach((child) => {
    const data = child.val();
    history.push({ role: data.role, content: data.content });
  });
  return history;
};

const saveMessage = async (channelId, role, content) => {
  const dbRef = push(ref(db, `conversations/${channelId}`));
  await set(dbRef, {
    role,
    content,
    timestamp: Date.now() // Standard timestamp
  });
};

module.exports = { getContext, saveMessage };