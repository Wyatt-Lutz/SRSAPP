
import { collection, query, doc, deleteDoc, getDocs } from 'firebase/firestore';

import { db } from '../../imports.js';
export async function fetchDecks(userId) {
  const decksRef = collection(db, 'users', userId, 'decks');
  const decksQuery = query(decksRef);
  const snapshot = await getDocs(decksQuery);
  const fetchedDecks = snapshot.docs.map((doc) => ({
    id: doc.id,
    name: doc.data().name,
  }));

  return fetchedDecks;
}

export async function deleteDeck(userId, deckId) {
  const deckRef = doc(collection(db, 'users', userId, 'decks'), deckId);
  await deleteDoc(deckRef);
}