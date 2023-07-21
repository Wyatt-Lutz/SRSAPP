import { useState, useEffect } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase.js';

export function fetchDecks(userId) {
  const [decks, setDecks] = useState([]);

  useEffect(() => {
    const decksRef = collection(db, 'users', userId, 'decks');
    const decksQuery = query(decksRef);

    const snap = onSnapshot(decksQuery, (snapshot) => {
      const fetchedDecks = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
      }));
      setDecks(fetchedDecks);
    });
    return snap;
  }, [userId]);

  return decks;
}

export async function deleteDeck(userId, deckId) {
  const deckRef = doc(collection(db, 'users', userId, 'decks'), deckId);
  await deleteDoc(deckRef);
}