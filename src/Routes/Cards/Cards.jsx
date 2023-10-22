import {
  doc,
  collection,
  getDoc,
  updateDoc,
  getDocs,
} from 'firebase/firestore';
import React, { useEffect, useState, useRef, useCallback } from 'react';

import { db, auth, app, useNavigate } from '../../imports.js';

import { fetchDueCards, handleReview } from './cardsLogic.js';
//xX8%*c8T!Kc$5C%

function App() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [dueCards, setDueCards] = useState([]);
  const hasMountedRef = useRef(false);


  const urlParams = new URLSearchParams(window.location.search);
  const deckId = urlParams.get('id');
  const docRef = doc(collection(db, 'users', user.uid, 'decks'), deckId);
  var intervalModifier;

  


  const buttonData = [
    { text: 'Again', value: 0 },
    { text: 'Hard', value: 1 },
    { text: 'Good', value: 2 },
    { text: 'Easy', value: 3 },
  ];

  useEffect(() => {

    async function fetchData() {
      const docSnap = await getDoc(docRef);
      const { retained, studied, start } = docSnap.data();
      const currTime = new Date().getTime();
      const retainRate = (retained / studied) * 100;
 
    
      if (currTime - start === 907200000) { //10.5 days 
        intervalModifier = (Math.log(85) / Math.log(retainRate));
      }
      const dueCards = await fetchDueCards(docRef);
      setDueCards(dueCards);

    }
    if (!hasMountedRef.current) {
      fetchData();
      hasMountedRef.current = true
    }

    
    
  
  }, []);

  function handleNextCard(rating) {
    console.log(dueCards);
    handleReview(docRef, dueCards[currentIndex], rating, intervalModifier);
    if (dueCards.length > currentIndex + 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } else {
      console.log('fetchDue notDue cards ran');
      setDueCards(fetchDueCards(docRef));
      setCurrentIndex(0);   
    }
    handleFlipCard();
  }

  const handleFlipCard = useCallback(() => {
    setIsFlipped((prev) => !prev);
  });





  return (
    <section class='bg-gray-900'>
      <div class='flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0'>
        <div class=' w-full rounded-lg border border-gray-700 bg-gray-800 shadow-sm max-w-md md:mt-0 xl:p-0'>
          <div class='space-y-4 p-6 sm:p-8 md:space-y-6 flex flex-col'>
            {dueCards.length > 0 ? (
              <div class='flex justify-between text-gray-200'>
                {!isFlipped ? (
                  <div>
                    <div class='w-1/2 text-lg'>
                      {dueCards[currentIndex].frontText}
                    </div>
                    <button className='shadow-indigo-500/50 shadow-2xl rounded-lg bg-indigo-500 px-5 py-2 text-xl font-bold text-white hover:bg-indigo-600 focus:outline-none active:bg-indigo-800' onClick={handleFlipCard}>Flip Card</button>

                  </div>
                ) : (
                  <div>
                    <div class='w-1/2 text-lg'>
                      {dueCards[currentIndex].frontText}
                    </div>
                    <div class='w-1/2 text-lg'>
                      {dueCards[currentIndex].backText}
                    </div>
                    <div class='flex justify-between'>
                      {buttonData.map((button) => (
                        <button key={button.value} className='shadow-indigo-500/50 shadow-2xl rounded-lg bg-indigo-500 px-5 py-2 text-xl font-bold text-white hover:bg-indigo-600 focus:outline-none active:bg-indigo-800' onClick={() => handleNextCard(button.value)}>{button.text}</button>

                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div class='text-gray-200'>No Cards Due</div>
            )}
          </div>
        </div>
        <button className='shadow-indigo-500/50 shadow-2xl rounded-lg bg-indigo-500 px-5 py-2 text-xl font-bold text-white hover:bg-indigo-600 focus:outline-none active:bg-indigo-800' onClick={() => navigate('/decks')}>Exit</button>
      </div>
    </section>
  );
}
export default App;
