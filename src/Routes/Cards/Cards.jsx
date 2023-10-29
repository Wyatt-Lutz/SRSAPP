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
  const [deckName, setDeckName] = useState("");
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
      const { retained, studied, start, name } = docSnap.data();
      const currTime = new Date().getTime();
      const retainRate = (retained / studied) * 100;
 
    
      if (currTime - start === 907200000) { //10.5 days 
        intervalModifier = (Math.log(85) / Math.log(retainRate));
      }
      const dueCards = await fetchDueCards(docRef);
      setDueCards(dueCards);
      setDeckName(name);

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
      <div class='flex items-center justify-center px-6 py-8 h-screen text-gray-200'>
        <div class='w-full rounded-lg flex flex-col shadow-2xl bg-gray-700 min-h-[400px] max-w-xl'>
     
          <div className='border-b border-indigo-400 appearance-none font-bold text-3xl text-center p-3'>
            {deckName}
          </div>



          <div class='space-y-6 mt-auto'>
            {dueCards.length > 0 ? (

              <div class='text-center'>
                {!isFlipped ? (
                  <div class='text-3xl inset-x-0 top-0'>
                    {dueCards[currentIndex].frontText}
                  </div>
                ) : (
                  <div className='flex flex-col'>
                    <div className='text-3xl'>
                      {dueCards[currentIndex].frontText}
                    </div>
                    <div className='text-xl'>
                      {dueCards[currentIndex].backText}
                    </div>
                    
                    
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div class='text-gray-200'>No Cards Due</div>
                <button className='shadow-indigo-500/50 shadow-2xl rounded-lg bg-indigo-500 px-5 py-2 text-xl font-bold text-white hover:bg-indigo-600 focus:outline-none active:bg-indigo-800' onClick={() => navigate('/decks')}>Exit</button>
              </div>

            )}
          </div>


          <div className='border-t border-indigo-400 pb-4 pt-3 mt-auto'>
            {!isFlipped ? (
              <div className='flex justify-center'> 
                <button className='shadow-indigo-500/50 shadow-2xl rounded-lg bg-indigo-500 px-5 py-2 text-xl font-bold text-white hover:bg-indigo-600 focus:outline-none active:bg-indigo-800' onClick={handleFlipCard}>Flip Card</button>
              </div>
            ) : (
              <div class='flex m-2 justify-between'>
                {buttonData.map((button) => (
                  <button key={button.value} className='shadow-indigo-500/50 shadow-2xl rounded-lg bg-indigo-500 px-5 py-2 text-xl font-bold text-white hover:bg-indigo-600 focus:outline-none active:bg-indigo-800' onClick={() => handleNextCard(button.value)}>{button.text}</button>
                ))}
            </div>
            )}


        
          </div>
        </div>
        
      </div>
  );
}
export default App;
