import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, doc, deleteDoc } from 'firebase/firestore';

import { db } from '../../imports.js';
export function fetchDecks(userId) {
  const [decks, setDecks] = useState([]);
  const decksRef = collection(db, 'users', userId, 'decks');
  const decksQuery = query(decksRef);

  useEffect(() => {
    const snapshot = onSnapshot(decksQuery, (snapshot) => {
      const fetchedDecks = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
      }));
      setDecks(fetchedDecks);
    });

    return () => snapshot();
  }, [decksQuery]);

  return decks;
}

export async function deleteDeck(userId, deckId) {
  const deckRef = doc(collection(db, 'users', userId, 'decks'), deckId);
  await deleteDoc(deckRef);
}